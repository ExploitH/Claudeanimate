// 看时间表：node plan.js [世界id] [--html f | --dc 入口]
// 不给世界 id 就列出每个世界的起点、小节数、场名；给了 id 就列它每个小节点（S.at）的绝对秒数。
const L = require('./mv-lib');

(async () => {
  const { o, pos } = L.args(process.argv.slice(2), ['--html', '--dc', '--title']);
  const q = pos[0] || '';
  const { page, close } = await L.openPage(L.pageFor(o));
  try {
    await L.ready(page);
    const r = await page.evaluate(q => window.__mvPlan.ws.filter(w => !q || w.m.id === q).map(w => [w.m.id, +w.start.toFixed(2), w.m.bars, q ? JSON.stringify(Object.fromEntries(Object.entries(w.m.S.at).map(([k, v]) => [k, +(w.start + v * window.MV_K.BAR).toFixed(1)]))) : w.m.scene]), q);
    console.log(r.map(x => x.join(' | ')).join('\n'));
  } finally { await close(); }
})().catch(e => { console.error(e); process.exit(1); });
