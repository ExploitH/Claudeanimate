// 从世界模块算出每场戏的时长，写回 dc 的 OM_SCENES：node mvscenes.js [dc 文件 ...] [--dc 入口]
// 没给文件就只更新入口；给了分段文件，则只写它里面出现过的场次。时长 = 世界的 bars × 引擎的 BAR。
const path = require('path'), fs = require('fs');
const L = require('./mv-lib');
const { build } = require('./mvbuild');

(async () => {
  const { o, pos } = L.args(process.argv.slice(2), ['--dc', '--title']);
  const main = L.entry(o.dc);
  const OUT = path.join(L.BUILD_DIR, 'scenes.html');
  build(main, OUT, o.title);
  const { page, errs, close } = await L.openPage(OUT);
  let sc;
  try {
    await page.waitForFunction(() => window.MV_K && window.MV_W, null, { timeout: 30000 });
    sc = await page.evaluate(() => Object.keys(window.MV_W).sort().map(id => { const m = window.MV_W[id](window.MV_K); return { id, name: m.scene, dur: m.bars * window.MV_K.BAR, desc: m.desc || '' }; }));
  } finally { await close(); }
  if (errs.length) console.log(errs.join('\n'));
  const files = pos.length ? pos.map(f => path.resolve(L.ROOT, f)) : [main];
  for (const p of files) {
    let s = fs.readFileSync(p, 'utf8');
    const m = s.match(/window\.OM_SCENES = '(.*?)';<\/script>/), old = JSON.parse(m[1].replace(/\\'/g, "'"));
    const keep = new Set(old.map(x => x.name)), part = p === main ? sc : sc.filter(x => keep.has(x.name));
    const arr = part.map(x => ({ name: x.name, dur: x.dur, desc: x.desc || (old.find(q => q.name === x.name) || {}).desc || '' }));
    s = s.slice(0, m.index) + "window.OM_SCENES = '" + JSON.stringify(arr).replace(/'/g, "\\'") + "';</script>" + s.slice(m.index + m[0].length);
    fs.writeFileSync(p, s);
    console.log(path.basename(p), arr.reduce((a, x) => a + x.dur, 0) + 's', arr.map(x => x.name + ':' + x.dur).join(' | '));
  }
})().catch(e => { console.error(e); process.exit(1); });
