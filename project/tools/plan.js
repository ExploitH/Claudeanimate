const path = require('path'), fs = require('fs'), http = require('http');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
(async () => {
  const file = process.argv[2] || path.join(__dirname, 'mv/index.html');
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pg = await b.newPage();
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u]) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  await pg.waitForFunction(() => window.__mvPlan, null, { timeout: 60000 });
  const r = await pg.evaluate((q) => window.__mvPlan.ws.filter(w => !q || w.m.id === q).map(w => [w.m.id, +w.start.toFixed(2), w.m.bars, q ? JSON.stringify(Object.fromEntries(Object.entries(w.m.S.at).map(([k, v]) => [k, +(w.start + v * 2).toFixed(1)]))) : w.m.scene]), process.argv[3] || '');
  console.log(r.map(x => x.join(' | ')).join('\n'));
  await b.close(); srv.close();
})();
