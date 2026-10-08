// 逐帧导出一段无声视频：node mvexport.js file.html out.mp4 起点秒 终点秒 [fps]
//   node mvexport.js file.html total   只打印整片时长（秒）
// 每帧调用页面里的 window.__mvFrame(t)，按 1920×1080 原生分辨率直接从渲染画布取图（不经过页面截图，tweak 面板这些 DOM 不会进画面），
// 喂给 ffmpeg 编成 x264。整片用 mvfilm.js 跑（分段、续跑、配音轨、拼接）。
// 环境变量：CRF（默认 16）PRESET（默认 medium）XT（x264 线程，默认 2）FMT=png（帧用无损 PNG 传，默认 JPEG q.96）
//   GLARGS 覆盖 Chromium 的 GL 参数（默认见 glArgs()）；CHROME 指定浏览器路径（默认用 Playwright 自带的 Chromium）
const path = require('path'), fs = require('fs'), http = require('http'), { spawn } = require('child_process');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
const CLOUD = '/opt/pw-browsers/chromium';
// 本地有显卡就用显卡；云端容器没有显卡，走 Mesa llvmpipe（需要 libegl-mesa0），比默认的 SwiftShader 快 6–10 倍
function glArgs() {
  if (process.env.GLARGS) return process.env.GLARGS.split(' ');
  if (process.platform === 'darwin') return ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist'];
  if (process.platform === 'win32') return ['--enable-gpu', '--use-angle=d3d11', '--ignore-gpu-blocklist'];
  return ['--enable-gpu', '--use-gl=angle', '--use-angle=gl-egl', '--ignore-gpu-blocklist'];
}
async function open(file) {
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0);
  const exe = process.env.CHROME || (fs.existsSync(CLOUD) ? CLOUD : undefined);
  const b = await chromium.launch({ executablePath: exe, args: glArgs() });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = [];
  pg.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u] && fs.existsSync(MAP[u])) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  await pg.waitForFunction(() => window.__mvFrame && window.MV_3D && window.__mvPlan, null, { timeout: 120000 });
  // 先把播放器暂停，不然它每一帧都在后台自己渲预览，导出会慢一倍多
  await pg.evaluate(() => document.querySelector('svg[data-om-exportable-video-with-duration-secs]').dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: 0, sync: true, playing: false } })));
  await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(4000);
  const gpu = await pg.evaluate(() => { const g = document.createElement('canvas').getContext('webgl2'), d = g && g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : '?'; });
  return { b, pg, errs, gpu, close: async () => { await b.close(); srv.close(); } };
}
(async () => {
  const [file, out, a, z, f] = process.argv.slice(2);
  const P = await open(file);
  if (out === 'total') { console.log(await P.pg.evaluate(() => window.__mvPlan.total)); return P.close(); }
  const fps = +(f || 30), A = +a, Z = +z, png = process.env.FMT === 'png';
  console.log(`${out} 渲染器：${P.gpu}`);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', png ? 'png' : 'mjpeg', '-i', '-',
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p', '-c:v', 'libx264', '-preset', process.env.PRESET || 'medium', '-crf', process.env.CRF || '16',
    '-threads', process.env.XT || '2', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n0 = Math.round(A * fps), n1 = Math.round(Z * fps), t0 = Date.now(), B = 8; // 一次 evaluate 渲几帧，省掉来回的开销
  for (let n = n0; n < n1; n += B) {
    const urls = await P.pg.evaluate(([n, m, fps, q]) => { const r = []; for (let i = n; i < m; i++) r.push(window.__mvFrame(i / fps, q)); return r; }, [n, Math.min(n + B, n1), fps, png ? 'png' : .96]);
    for (const url of urls) { const buf = Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); }
    const k = Math.min(n + B, n1) - n0; if (k % 240 < B) console.log(`${out} ${k}/${n1 - n0} ${((Date.now() - t0) / k).toFixed(0)}ms/帧`);
  }
  ff.stdin.end(); const code = await new Promise(r => ff.on('close', r));
  console.log(out, code ? 'ffmpeg 出错' : 'done', ((Date.now() - t0) / 1000).toFixed(0) + 's', P.errs.slice(0, 5).join(' | ') || 'no errors');
  await P.close(); if (code) process.exit(1);
})().catch(e => { console.error(e); process.exit(1); });
