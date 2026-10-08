// 快速导出整片 mp4：node mvfast.js [file.html] [输出.mp4]
//   默认 file = mv/film.html（先用 mvbuild 打包），默认输出 out/fast/Vibe Coding 电影版.mp4
// 和 mvfilm.js 的区别：画面在浏览器里用 WebCodecs 直接编成 H.264（优先用显卡编码），只把编好的码流传回 Node，
// 省掉了每帧转 JPEG、base64 传输、ffmpeg 解码再用 x264 重编这几步。RTX 3050 上约 10 ms/帧，整片十来分钟。
// 另外把 Google Fonts 缓存到 cache/fonts/，第二次起页面秒开，多开浏览器也不会加载超时。
// 中途断了直接重跑：做完的段（有 .ok 标记）和音轨会跳过。改了片子要重导就删掉 out/fast/。
// 环境变量：
//   MBPS（默认 8）视频码率，单位 Mbit/s。整片 31 分钟：8 → 约 1.9 GB，5 → 约 1.2 GB
//   JOBS（默认 2）同时开几个浏览器；SEG（默认 60）每段秒数；FPS（默认 30）
//   HW（默认 prefer-hardware）设成 prefer-software 强制软件编码
//   RANGE=起点,终点（秒）只导出这一段（带声音），输出到 out/fast/range-起点-终点/，用来试看画质和码率
//   GLARGS / CHROME 同 mvexport.js（Windows 上没装 Playwright 的 Chromium 时可以 CHROME 指向 Edge）
const path = require('path'), fs = require('fs'), http = require('http'), crypto = require('crypto'), { spawn, execFileSync } = require('child_process');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
const RANGE = process.env.RANGE ? process.env.RANGE.split(',').map(Number) : null;
const file = process.argv[2] || 'mv/film.html', dir = path.join(__dirname, RANGE ? `out/fast/range-${RANGE[0]}-${RANGE[1]}` : 'out/fast'), out = process.argv[3] || path.join(dir, 'Vibe Coding 电影版.mp4');
const FPS = +(process.env.FPS || 30), SEG = +(process.env.SEG || 60), JOBS = +(process.env.JOBS || 2), MBPS = +(process.env.MBPS || 8), HW = process.env.HW || 'prefer-hardware';
const FONTS = path.join(__dirname, 'cache/fonts'), CLOUD = '/opt/pw-browsers/chromium';
function glArgs() {
  if (process.env.GLARGS) return process.env.GLARGS.split(' ');
  if (process.platform === 'darwin') return ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'];
  if (process.platform === 'win32') return ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist'];
  return ['--enable-gpu', '--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'];
}
// Google Fonts 的 css 和字体文件落盘缓存，下次直接从本地给
async function fontRoute(rt) {
  const u = rt.request().url(), f = path.join(FONTS, crypto.createHash('sha1').update(u).digest('hex'));
  if (fs.existsSync(f)) { const m = JSON.parse(fs.readFileSync(f + '.json', 'utf8')); return rt.fulfill({ path: f, contentType: m.type, headers: { 'access-control-allow-origin': '*' } }); }
  try {
    const r = await rt.fetch(), body = await r.body();
    if (r.ok()) { fs.mkdirSync(FONTS, { recursive: true }); fs.writeFileSync(f, body); fs.writeFileSync(f + '.json', JSON.stringify({ url: u, type: r.headers()['content-type'] })); }
    return rt.fulfill({ response: r, body });
  } catch (e) { return rt.abort(); }
}
async function open(html) {
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(html); }).listen(0);
  const exe = process.env.CHROME || (fs.existsSync(CLOUD) ? CLOUD : undefined);
  const b = await chromium.launch({ executablePath: exe, args: glArgs() });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = [];
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await pg.route('**/*', rt => {
    const u = rt.request().url();
    if (MAP[u] && fs.existsSync(MAP[u])) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' });
    if (/^https:\/\/fonts\.(googleapis|gstatic)\.com\//.test(u)) return fontRoute(rt);
    return rt.continue();
  });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`, { timeout: 300000 });
  await pg.waitForFunction(() => window.__mvFrame && window.MV_3D && window.__mvPlan, null, { timeout: 120000 });
  if (!(await pg.evaluate(() => window.__mvFrame(0, 'raw') instanceof HTMLCanvasElement))) throw new Error('页面的 __mvFrame 不支持 raw，先重新打包（mvbuild.js）');
  await pg.evaluate(() => document.querySelector('svg[data-om-exportable-video-with-duration-secs]').dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: 0, sync: true, playing: false } })));
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(3000);
  const gpu = await pg.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'), d = g && g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; });
  return { pg, errs, gpu, close: async () => { await b.close(); srv.close(); } };
}
// 浏览器里：开一个编码器渲 [n0, n1) 帧，每次 evaluate 渲一批，把这批产出的码流用 base64 带回来
const BROWSER = {
  start: ([fps, mbps, hw]) => {
    const cfg = { codec: 'avc1.640028', width: 1920, height: 1080, bitrate: mbps * 1e6, bitrateMode: 'variable', framerate: fps, hardwareAcceleration: hw, latencyMode: 'quality', avc: { format: 'annexb' } };
    const S = window.__mvEnc = { buf: [], err: null, hw: true };
    return VideoEncoder.isConfigSupported(cfg).then(r => {
      if (!r.supported) { cfg.hardwareAcceleration = 'prefer-software'; S.hw = false; }
      S.enc = new VideoEncoder({ output: c => { const a = new Uint8Array(c.byteLength); c.copyTo(a); S.buf.push(a); }, error: e => { S.err = String(e); } });
      S.enc.configure(cfg); return cfg.hardwareAcceleration;
    });
  },
  batch: async ([n, m, fps, gop, last]) => {
    const S = window.__mvEnc;
    for (let i = n; i < m; i++) {
      const cv = window.__mvFrame(i / fps, 'raw');
      const f = new VideoFrame(cv, { timestamp: Math.round(i * 1e6 / fps), duration: Math.round(1e6 / fps) });
      S.enc.encode(f, { keyFrame: i === S.first || (i - S.first) % gop === 0 }); f.close();
      while (S.enc.encodeQueueSize > 3) await new Promise(r => setTimeout(r, 0));
    }
    if (last) { await S.enc.flush(); S.enc.close(); }
    if (S.err) throw new Error(S.err);
    const blob = new Blob(S.buf); S.buf = [];
    const url = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(blob); });
    return url.slice(url.indexOf(',') + 1);
  },
};
const name = a => path.join(dir, `seg_${String(a).padStart(5, '0')}`);
async function renderSeg(P, [a, z], tag) {
  const n0 = Math.round(a * FPS), n1 = Math.round(z * FPS), B = 30, t0 = Date.now(), h264 = name(a) + '.h264';
  const how = await P.pg.evaluate(BROWSER.start, [FPS, MBPS, HW]);
  await P.pg.evaluate(n => { window.__mvEnc.first = n; }, n0);
  const fd = fs.openSync(h264, 'w');
  for (let n = n0; n < n1; n += B) {
    const m = Math.min(n + B, n1), b64 = await P.pg.evaluate(BROWSER.batch, [n, m, FPS, FPS * 2, m === n1]);
    fs.writeSync(fd, Buffer.from(b64, 'base64'));
    if ((m - n0) % 600 < B) console.log(`${tag} 段 ${a}s ${m - n0}/${n1 - n0} ${((Date.now() - t0) / (m - n0)).toFixed(1)}ms/帧`);
  }
  fs.closeSync(fd);
  // 裸 H.264 封装成 mp4，打 BT.709 标签（Chromium 编码器按 BT.709 TV range 转换）
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-r', String(FPS), '-f', 'h264', '-i', h264, '-c', 'copy',
    '-bsf:v', 'h264_metadata=colour_primaries=1:transfer_characteristics=1:matrix_coefficients=1:video_full_range_flag=0', name(a) + '.mp4']);
  fs.unlinkSync(h264); fs.writeFileSync(name(a) + '.mp4.ok', how);
  return how;
}
(async () => {
  fs.mkdirSync(dir, { recursive: true });
  const html = fs.readFileSync(file), T0 = Date.now();
  // 第一个浏览器先开：顺便把字体缓存好，也拿到整片时长
  const first = await open(html), full = await first.pg.evaluate(() => window.__mvPlan.total);
  const A0 = RANGE ? RANGE[0] : 0, total = RANGE ? Math.min(RANGE[1], full) - A0 : full;
  console.log(`整片 ${total.toFixed(2)} 秒，${FPS} fps，${MBPS} Mbps，每段 ${SEG} 秒，并行 ${JOBS}；渲染器：${first.gpu}`);
  const wav = path.join(dir, 'audio.wav');
  const audio = fs.existsSync(wav + '.ok') ? Promise.resolve() : new Promise((ok, no) => {
    const p = spawn(process.execPath, ['mvaudio.js', file, path.join(dir, 'aud'), wav, ...(RANGE ? [String(A0), String(total)] : [])], { cwd: __dirname, stdio: ['ignore', 'ignore', 'inherit'] });
    p.on('close', c => c ? no(new Error('音轨渲染失败，退出码 ' + c)) : (fs.writeFileSync(wav + '.ok', 'ok'), console.log('音轨完成'), ok()));
  });
  const segs = []; for (let a = A0; a < A0 + total; a += SEG) segs.push([a, Math.min(a + SEG, A0 + total)]);
  const todo = segs.filter(s => !fs.existsSync(name(s[0]) + '.mp4.ok'));
  console.log(`共 ${segs.length} 段，还剩 ${todo.length} 段`);
  let done = segs.length - todo.length;
  await Promise.all(Array.from({ length: Math.min(JOBS, todo.length) }, async (_, w) => {
    const P = w === 0 ? first : await open(html), tag = `[${w + 1}]`;
    try {
      for (let s; (s = todo.shift());) {
        for (let k = 0; ; k++) {
          try { const how = await renderSeg(P, s, tag); console.log(`== ${tag} 段 ${s[0]}s 完成（${how}），${++done}/${segs.length}，已用 ${((Date.now() - T0) / 60000).toFixed(1)} 分钟`); break; }
          catch (e) { if (k >= 2) throw e; console.log(`!! ${tag} 段 ${s[0]}s 出错，重试：${e.message}`); }
        }
      }
    } finally { if (P.errs.length) console.log(tag, '页面报错：', P.errs.slice(0, 5).join(' | ')); await P.close(); }
  }));
  await first.close().catch(() => {});
  await audio;
  fs.writeFileSync(path.join(dir, 'list.txt'), segs.map(s => `file '${path.basename(name(s[0]))}.mp4'`).join('\n'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-i', wav, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(total), '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log(`导出完成：${out}（${(fs.statSync(out).size / 1e9).toFixed(2)} GB，共 ${((Date.now() - T0) / 60000).toFixed(1)} 分钟）`);
})().catch(e => { console.error(e.message); process.exit(1); });
