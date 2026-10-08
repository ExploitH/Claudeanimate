// 从世界模块算出每场戏的时长，写回 dc 文件的 OM_SCENES：node mvscenes.js [dc 文件名 ...]
// 先用当前 dc 的引用列表打一个包，在浏览器里构建所有世界，读 scene / bars / desc
const path = require('path'), fs = require('fs'), http = require('http'), { execSync } = require('child_process');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const SRC = path.resolve(__dirname, '..'), OUT = path.join(__dirname, 'mv/scenes.html');
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
(async () => {
  const main = process.env.DC || 'Vibe Coding 电影版.dc.html';
  execSync(`node "${path.join(__dirname, 'mvbuild.js')}" "${OUT}"`, { env: { ...process.env, DC: main } });
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(OUT)); }).listen(0);
  const b = await chromium.launch({ executablePath: process.env.CHROME || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pg = await b.newPage(); const errs = [];
  pg.on('pageerror', e => errs.push(e.message));
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u]) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  await pg.waitForFunction(() => window.MV_K && window.MV_W, null, { timeout: 30000 });
  const sc = await pg.evaluate(() => Object.keys(window.MV_W).sort().map(id => { const m = window.MV_W[id](window.MV_K); return { id, name: m.scene, dur: m.bars * 2, desc: m.desc || '' }; }));
  await b.close(); srv.close();
  if (errs.length) console.log(errs.join('\n'));
  const files = process.argv.slice(2).length ? process.argv.slice(2) : [main];
  for (const f of files) {
    const p = path.join(SRC, f); let s = fs.readFileSync(p, 'utf8');
    const m = s.match(/window\.OM_SCENES = '(.*?)';<\/script>/), old = JSON.parse(m[1]);
    const keep = new Set(old.map(x => x.name)), part = f === main ? sc : sc.filter(x => keep.has(x.name));
    const arr = part.map(x => ({ name: x.name, dur: x.dur, desc: x.desc || (old.find(o => o.name === x.name) || {}).desc || '' }));
    s = s.slice(0, m.index) + "window.OM_SCENES = '" + JSON.stringify(arr).replace(/'/g, "\\'") + "';</script>" + s.slice(m.index + m[0].length);
    fs.writeFileSync(p, s);
    console.log(f, arr.reduce((a, x) => a + x.dur, 0) + 's', arr.map(x => x.name + ':' + x.dur).join(' | '));
  }
})().catch(e => { console.error(e); process.exit(1); });
