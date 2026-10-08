// 工具共用：定位项目、读入口 dc、预编译模块、起浏览器。所有 mv*.js 都从这里取东西。
// 项目根目录 = tools 的上一级（可用 MV_ROOT 覆盖）；可选的 mv.config.json 放在项目根目录。
const path = require('path'), fs = require('fs'), http = require('http');

const ROOT = process.env.MV_ROOT ? path.resolve(process.env.MV_ROOT) : path.resolve(__dirname, '..');
const DEPS = process.env.MV_DEPS || path.join(__dirname, 'node_modules');
const CHROME = process.env.MV_CHROME || '/opt/pw-browsers/chromium';
const BUILD_DIR = path.join(__dirname, 'mv');
const CDN = {
  'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': path.join(DEPS, 'react/umd/react.production.min.js'),
  'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': path.join(DEPS, 'react-dom/umd/react-dom.production.min.js'),
  'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': path.join(DEPS, 'three/build/three.min.js'),
};
const GL_ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'];
const DEFAULT_TWEAKS = { motionEditor: true, sfx: true, bgm: true, bgmVol: .8, quality: '流畅', fx: 1 };

// 项目配置（可选）：{ "dc": "入口.dc.html", "title": "标题", "script": { "labels": {...} } }
function config() {
  for (const p of [path.join(ROOT, 'mv.config.json'), path.join(__dirname, 'mv.config.json')]) {
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  return {};
}

// 入口 dc：--dc / DC 环境变量 / 配置里的 dc，都没有就找项目根目录下唯一一个含 OM_SCENES 的 .dc.html（排除 parts.py 切出的分段）
function entry(arg) {
  const cfg = config();
  const f = arg || process.env.DC || cfg.dc;
  if (f) return path.resolve(ROOT, f);
  const cands = fs.readdirSync(ROOT).filter(f => /\.dc\.html$/.test(f) && !/\.part\d+\.dc\.html$/.test(f))
    .filter(f => fs.readFileSync(path.join(ROOT, f), 'utf8').includes('window.OM_SCENES'));
  if (cands.length === 1) return path.join(ROOT, cands[0]);
  throw new Error(`找不到唯一的入口 dc（找到 ${cands.length} 个）。用 --dc 指定，或在 mv.config.json 里写 "dc"。`);
}

// 读入口：场次表、模块列表、默认 tweak、字体、标题
function readEntry(file) {
  const html = fs.readFileSync(file, 'utf8');
  const sc = html.match(/window\.OM_SCENES = '(.*?)';<\/script>/);
  if (!sc) throw new Error(`${path.basename(file)} 里没有 window.OM_SCENES`);
  const imp = html.match(/component-from-global-scope="MVApp" from="([^"]+)"/);
  if (!imp) throw new Error(`${path.basename(file)} 里没有 component-from-global-scope="MVApp" 的 x-import`);
  const tw = html.match(/window\.TWEAK_DEFAULTS = \/\*EDITMODE-BEGIN\*\/([\s\S]*?)\/\*EDITMODE-END\*\//);
  const font = html.match(/<link href="(https:\/\/fonts\.googleapis\.com\/css2[^"]+)"/);
  return {
    file, html,
    scenes: JSON.parse(sc[1].replace(/\\'/g, "'")),
    files: imp[1].split(/\s+/).filter(Boolean).map(f => f.replace(/^\.\//, '')),
    tweaks: { ...DEFAULT_TWEAKS, ...(tw ? JSON.parse(tw[1]) : {}) },
    font: font ? font[1].replace(/&amp;/g, '&') : null,
    hasVox: html.includes('./mv-voice.js'),
  };
}

// 把 dc 里列出的模块预编译成一段脚本；缺的文件跳过并提示
function bundle(entryInfo) {
  const Babel = require(path.join(DEPS, '@babel/standalone'));
  let js = '/* 预编译包 */\n';
  for (const f of entryInfo.files) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) { console.log('skip missing', f); continue; }
    const code = Babel.transform(fs.readFileSync(p, 'utf8'), { filename: f, presets: ['react'] }).code;
    js += `\n// ---- ${f}\n;(function (React, module, exports, require) {\n${code}\n})(window.React, { exports: {} }, {}, function () { return {}; });\n`;
  }
  return js;
}

// 单文件页面：和播放器一样的壳，所有 CDN 依赖用 node_modules 里的副本替代
async function openPage(file, { viewport = { width: 1280, height: 800 } } = {}) {
  const { chromium } = require(path.join(DEPS, 'playwright'));
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0, '127.0.0.1');
  const exe = fs.existsSync(CHROME) ? CHROME : undefined;
  const browser = await chromium.launch({ executablePath: exe, args: GL_ARGS }).catch(e => { srv.close(); throw e; });
  const page = await browser.newPage({ viewport });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await page.route('**/*', rt => { const u = rt.request().url(); if (CDN[u]) return rt.fulfill({ path: CDN[u], contentType: 'text/javascript' }); return rt.continue(); });
  await page.goto(`http://127.0.0.1:${srv.address().port}/`);
  return { page, errs, close: async () => { await browser.close(); srv.close(); } };
}

// 等播放器挂好、字体内联完
async function ready(page, { timeout = 60000 } = {}) {
  await page.waitForFunction(() => window.__mvPlan, null, { timeout });
  await page.waitForSelector(SVG, { timeout });
  await page.waitForFunction(s => { const e = document.querySelector(s); return e && e.hasAttribute('data-om-fonts-inlined'); }, SVG, { timeout: 20000 }).catch(() => {});
}
const SVG = 'svg[data-om-exportable-video-with-duration-secs]';

// 同步定格到 t 秒：引擎广告了 data-om-sync-seek 就不用等，否则等两帧
async function seek(page, t) {
  await page.evaluate(([s, t]) => document.querySelector(s).dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: t, sync: true, playing: false } })), [SVG, t]);
  const sync = await page.evaluate(s => document.querySelector(s).getAttribute('data-om-sync-seek') === 'true', SVG);
  if (!sync) await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
}

// 命令行：--flag 取值放在 valued 里，其余 --开关 为 true，其余为位置参数
function args(argv, valued = []) {
  const o = {}, pos = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { pos.push(a); continue; }
    const k = a.slice(2);
    if (valued.includes(a)) o[k] = argv[++i]; else o[k] = true;
  }
  return { o, pos };
}

// 没给 --html 时，用入口 dc 构建到 tools/mv/（build 在 mvbuild.js 里，这里懒加载避免循环）
function pageFor(o) {
  if (o.html) return path.resolve(o.html);
  return require('./mvbuild').build(entry(o.dc), path.join(BUILD_DIR, 'index.html'), o.title).out;
}

module.exports = { ROOT, DEPS, BUILD_DIR, CDN, config, entry, readEntry, bundle, openPage, ready, seek, args, pageFor, SVG, DEFAULT_TWEAKS };
