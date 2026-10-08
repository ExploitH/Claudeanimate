// 导出全片配音台本：node voxlist.js <out.json> [--html f | --dc 入口]
// 每条带 k（sp|text）、sp（说话人：narrator 或 user，对应 mv-voice.js 里 banks 的键）、text、kind、scene、t（成片秒数）。同一句只记一次。
// 用来对着台本录人声碎片：每个字念一个碎片，标点不念。
const fs = require('fs');
const L = require('./mv-lib');

(async () => {
  const { o, pos } = L.args(process.argv.slice(2), ['--html', '--dc', '--title']);
  const [out] = pos;
  if (!out) { console.error('用法：node voxlist.js <out.json> [--html f | --dc 入口]'); process.exit(1); }
  const { page, close } = await L.openPage(L.pageFor(o));
  let all;
  try {
    await page.waitForFunction(() => window.__mvPlan && window.MV_VOXLINES, null, { timeout: 60000 });
    all = await page.evaluate(() => {
      const out = [];
      for (const w of window.__mvPlan.ws) for (const i of (w.m.S ? w.m.S.items : [])) for (const [sp, text, kind] of window.MV_VOXLINES(i)) out.push({ k: window.MV_VOXKEY(sp, text), sp, text, kind, scene: w.m.scene, t: +(w.start + i.at * window.MV_K.BAR).toFixed(1) });
      return out;
    });
  } finally { await close(); }
  const seen = new Set(), uniq = all.filter(x => !seen.has(x.k) && seen.add(x.k));
  fs.writeFileSync(out, JSON.stringify(uniq, null, 1));
  const bySp = {};
  for (const x of uniq) bySp[x.sp] = (bySp[x.sp] || 0) + 1;
  console.log(out, all.length, 'lines,', uniq.length, 'unique,', uniq.reduce((a, x) => a + x.text.length, 0), 'chars;', Object.entries(bySp).map(([k, v]) => k + ' ' + v).join(', '));
})().catch(e => { console.error(e); process.exit(1); });
