// 截关键帧（调试画面用）：node mvshot.js <outdir> <t1> [t2 ...] [--html 页面.html | --dc 入口] [--hi]
// --hi 切到「高」画质再截。时间单位是秒，文件名是 t<十分之一秒>.png。
const path = require('path'), fs = require('fs');
const L = require('./mv-lib');

(async () => {
  const { o, pos } = L.args(process.argv.slice(2), ['--html', '--dc', '--title']);
  const [out, ...ts] = pos;
  if (!out || !ts.length) { console.error('用法：node mvshot.js <outdir> <t1> [t2 ...] [--html f] [--dc f] [--hi]'); process.exit(1); }
  fs.mkdirSync(out, { recursive: true });
  const { page, errs, close } = await L.openPage(L.pageFor(o), { viewport: { width: 1280, height: 800 } });
  try {
    await L.ready(page);
    if (o.hi) {
      const old = await page.$(L.SVG);
      await page.click('.seg button[data-q="高"]');
      await old.waitForElementState('detached', { timeout: 60000 });
      await L.ready(page);
    }
    const stage = await page.$(L.SVG);
    for (const t of ts) {
      await L.seek(page, +t);
      await stage.screenshot({ path: path.join(out, `t${String(Math.round(t * 10)).padStart(5, '0')}.png`) });
    }
    console.log(errs.slice(0, 20).join('\n') || 'no errors');
  } finally { await close(); }
})().catch(e => { console.error(e); process.exit(1); });
