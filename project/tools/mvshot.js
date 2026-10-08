// 截关键帧：node mvshot.js file.html outdir t1 t2 ...（秒）；--q 高 用高画质
const path = require('path'), fs = require('fs'), http = require('http');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
(async () => {
  const argv = process.argv.slice(2), hi = argv.includes('--hi'), [file, out, ...ts] = argv.filter(a => !a.startsWith('--'));
  fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = [];
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); }); pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u]) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  const sel = 'svg[data-om-exportable-video-with-duration-secs]'; await pg.waitForSelector(sel, { timeout: 60000 });
  if (hi) { await pg.click('.seg button[data-q="高"]'); await pg.waitForSelector(sel, { timeout: 60000 }); }
  await pg.waitForTimeout(3500);
  const stage = await pg.$(sel);
  for (const t of ts) {
    await pg.evaluate(([s, t]) => document.querySelector(s).dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: t, sync: true, playing: false } })), [sel, +t]);
    await pg.waitForTimeout(900);
    await stage.screenshot({ path: path.join(out, `t${String(Math.round(t * 10)).padStart(5, '0')}.png`) });
  }
  console.log(errs.slice(0, 20).join('\n') || 'no errors'); await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
