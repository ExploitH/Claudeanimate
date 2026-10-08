// 导出全片配音台本：node voxlist.js page.html out.json
const path = require('path'), fs = require('fs'), http = require('http');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
(async () => {
  const [file, out] = process.argv.slice(2);
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader'] });
  const pg = await b.newPage();
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u]) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  await pg.waitForFunction(() => window.__mvPlan && window.MV_VOXLINES, null, { timeout: 60000 });
  const L = await pg.evaluate(() => { const out = []; for (const w of window.__mvPlan.ws) for (const i of (w.m.S ? w.m.S.items : [])) for (const [sp, text, kind] of window.MV_VOXLINES(i)) out.push({ k: window.MV_VOXKEY(sp, text), sp, text, kind, scene: w.m.scene, t: +(w.start + i.at * 2).toFixed(1) }); return out; });
  await b.close(); srv.close();
  const seen = new Set(), uniq = L.filter(x => !seen.has(x.k) && seen.add(x.k));
  fs.writeFileSync(out, JSON.stringify(uniq, null, 1));
  console.log(out, L.length, 'lines,', uniq.length, 'unique,', uniq.reduce((a, x) => a + x.text.length, 0), 'chars; you:', uniq.filter(x => x.sp === 'you').length);
})().catch(e => { console.error(e); process.exit(1); });
