// 快速导出（引擎的 video export fast path）：同步定格 → 直接截可导出的 svg（原始 1920×1080，不缩放）→ ffmpeg 编码。
// 每帧不等两帧刷新；引擎广告了 data-om-sync-seek 时完全不等。字体已内联，所以单独截 svg 也是对的。
// 用法：node mvexport.js <out.mp4> [--fps 30] [--from 秒] [--to 秒] [--hi] [--audio] [--keep] [--html f | --dc 入口] [--title 标题]
//   --audio  同时离线渲染整条音轨并和画面合成（同一段时间）
//   --no-keys  音轨里去掉「你」的按键声（和页面上的开关一样）
//   --keep   保留逐帧 png（tools/out/<name>/frames/）
const path = require('path'), fs = require('fs'), { execFileSync } = require('child_process');
const L = require('./mv-lib');
const { renderAudio } = require('./mvaudio');

(async () => {
  const { o, pos } = L.args(process.argv.slice(2), ['--html', '--dc', '--title', '--fps', '--from', '--to']);
  const [outFile] = pos;
  if (!outFile) { console.error('用法：node mvexport.js <out.mp4> [--fps 30] [--from 秒] [--to 秒] [--hi] [--audio] [--no-keys] [--keep] [--html f | --dc 入口]'); process.exit(1); }
  const fps = +(o.fps || 30), from = +(o.from || 0);
  const name = path.basename(outFile, path.extname(outFile));
  const dir = path.join(L.BUILD_DIR, '..', 'out', name, 'frames');
  fs.rmSync(path.join(L.BUILD_DIR, '..', 'out', name), { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  const { page, errs, close } = await L.openPage(L.pageFor(o), { viewport: { width: 1920, height: 1200 } });
  try {
    await L.ready(page);
    if (o.hi) {
      const old = await page.$(L.SVG);
      await page.click('.seg button[data-q="高"]');
      await old.waitForElementState('detached', { timeout: 60000 });
      await L.ready(page);
    }
    // 原始尺寸：去掉舞台的缩放，直接截 svg 本身
    await page.evaluate(s => { document.querySelector(s).style.transform = 'none'; }, L.SVG);
    const total = await page.evaluate(() => window.__mvPlan.total);
    const { W, H } = await page.evaluate(s => { const e = document.querySelector(s); return { W: +e.getAttribute('width'), H: +e.getAttribute('height') }; }, L.SVG);
    const to = o.to ? +o.to : total;
    const N = Math.ceil((to - from) * fps);
    const stage = await page.$(L.SVG);
    console.log(`导出 ${name}：${from}s–${to}s，${fps} fps，${N} 帧，画面 ${W}×${H}，逐帧同步定格`);
    const t0 = Date.now();
    for (let i = 0; i < N; i++) {
      await L.seek(page, from + i / fps);
      await stage.screenshot({ path: path.join(dir, `${String(i).padStart(7, '0')}.png`) });
      if (i && i % (fps * 10) === 0) console.log(`  ${i}/${N} 帧，${((Date.now() - t0) / 1000).toFixed(0)} 秒`);
    }
    console.log(`画面完成，${((Date.now() - t0) / 1000).toFixed(1)} 秒`);

    const args = ['-y', '-v', 'error', '-framerate', String(fps), '-i', path.join(dir, '%07d.png')];
    if (o.audio) {
      const wav = path.join(dir, '..', 'audio.wav');
      const res = await renderAudio(page, { A0: from, AD: to - from, wantWav: true, youKeys: !o['no-keys'] });
      fs.writeFileSync(wav, Buffer.from(res.wav, 'base64'));
      console.log(`音轨完成，${res.ms} ms`);
      args.push('-i', wav, '-c:a', 'aac', '-b:a', '192k', '-shortest');
    }
    // 元素截图可能多出半个像素，裁回引擎的画布尺寸（H.264 也要求偶数）
    args.push('-vf', `crop=${W}:${H}:0:0`, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', outFile);
    execFileSync('ffmpeg', args, { stdio: 'inherit' });
    console.log(outFile, fs.statSync(outFile).size >> 10, 'KB');
    console.log(errs.slice(0, 20).join('\n') || 'no errors');
  } finally {
    await close();
    if (!o.keep) fs.rmSync(path.join(L.BUILD_DIR, '..', 'out', name), { recursive: true, force: true });
  }
})().catch(e => { console.error(e); process.exit(1); });
