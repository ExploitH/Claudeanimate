// 导出整片 mp4：node mvfilm.js [file.html] [输出.mp4]
//   默认 file = mv/film.html（先用 mvbuild 打包：DC="Vibe Coding 电影版.dc.html" TITLE="电影版" node mvbuild.js mv/film.html）
//   默认输出 out/film/Vibe Coding 电影版.mp4
// 步骤：1) 离线渲整条音轨（mvaudio.js）2) 按 SEG 秒分段渲画面（mvexport.js），同时跑 JOBS 段 3) 拼接 + 配音轨（AAC 320k / 48k）
// 中途断了直接重跑：做完的段（有 .ok 标记）和音轨会跳过。要从头来就删掉 out/film/。
// 环境变量：FPS（默认 30）SEG（默认 120）JOBS（默认 1，显卡机器可以试 2–3）以及 mvexport.js 的 CRF / PRESET / XT / FMT / GLARGS / CHROME
const path = require('path'), fs = require('fs'), { spawn, execFileSync } = require('child_process');
const file = process.argv[2] || 'mv/film.html', dir = path.join(__dirname, 'out/film'), out = process.argv[3] || path.join(dir, 'Vibe Coding 电影版.mp4');
const FPS = +(process.env.FPS || 30), SEG = +(process.env.SEG || 120), JOBS = +(process.env.JOBS || 1);
const run = (args, tag) => new Promise((ok, no) => { const p = spawn(process.execPath, args, { cwd: __dirname, stdio: ['ignore', 'pipe', 'inherit'] }); let s = ''; p.stdout.on('data', d => { s += d; process.stdout.write(tag ? String(d).split('\n').filter(Boolean).map(l => tag + l + '\n').join('') : d); }); p.on('close', c => c ? no(new Error(args.join(' ') + ' 退出码 ' + c)) : ok(s)); });
(async () => {
  fs.mkdirSync(dir, { recursive: true });
  const total = +(await run(['mvexport.js', file, 'total'])).trim().split('\n').pop();
  console.log(`整片 ${total.toFixed(2)} 秒，${FPS} fps，每段 ${SEG} 秒，并行 ${JOBS}`);
  const wav = path.join(dir, 'audio.wav');
  if (!fs.existsSync(wav + '.ok')) { console.log('渲音轨…'); await run(['mvaudio.js', file, path.join(dir, 'aud'), wav], '[音轨] '); fs.writeFileSync(wav + '.ok', 'ok'); }
  const segs = []; for (let a = 0; a < total; a += SEG) segs.push([a, Math.min(a + SEG, total)]);
  const name = ([a]) => path.join(dir, `seg_${String(a).padStart(5, '0')}.mp4`);
  const todo = segs.filter(s => !fs.existsSync(name(s) + '.ok'));
  console.log(`共 ${segs.length} 段，还剩 ${todo.length} 段`);
  const t0 = Date.now(); let done = 0;
  await Promise.all(Array.from({ length: JOBS }, async () => {
    for (let s; (s = todo.shift());) {
      await run(['mvexport.js', file, name(s), String(s[0]), String(s[1]), String(FPS)]);
      fs.writeFileSync(name(s) + '.ok', 'ok'); done++;
      const left = todo.length + JOBS - 1; console.log(`== 完成 ${segs.length - left}/${segs.length} 段，已用 ${((Date.now() - t0) / 60000).toFixed(1)} 分钟`);
    }
  }));
  fs.writeFileSync(path.join(dir, 'list.txt'), segs.map(s => `file '${path.basename(name(s))}'`).join('\n'));
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', path.join(dir, 'list.txt'), '-i', wav, '-map', '0:v', '-map', '1:a',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '320k', '-ar', '48000', '-t', String(total), '-movflags', '+faststart', out], { stdio: 'inherit' });
  console.log('导出完成：' + out);
})().catch(e => { console.error(e.message); process.exit(1); });
