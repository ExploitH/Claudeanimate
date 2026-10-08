// 渲染整条音轨并分析：node mvaudio.js file.html outdir [x.wav] [起点秒] [时长秒]；VOICE_ONLY=1 只渲人声碎片（不带音乐和音效）
const path = require('path'), fs = require('fs'), http = require('http');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js' };
(async () => {
  const [file, out, wav, A0, AD] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0);
  const b = await chromium.launch({ executablePath: process.env.CHROME || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined), args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pg = await b.newPage({ viewport: { width: 1280, height: 800 } }); const errs = [];
  pg.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.type() + ': ' + m.text()); }); pg.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u]) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  await pg.waitForFunction(() => window.__mvPlan, null, { timeout: 60000 });
  await pg.waitForSelector('svg[data-om-exportable-video-with-duration-secs]');
  await pg.evaluate(() => document.querySelector('svg[data-om-exportable-video-with-duration-secs]').dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: 0, sync: true, playing: false } })));
  await pg.waitForTimeout(1500);
  const res = await pg.evaluate(async ([wantWav, A0, AD, voiceOnly]) => {
    const P = window.__mvPlan, T0 = A0 ? +A0 : 0, total = AD ? +AD : P.total - T0, t0 = performance.now();
    const sfx = window.MV_SFXLIST(P);
    const J = window.MV_MUSIC.job(P, sfx, T0, total, { sfx: !voiceOnly, bgm: !voiceOnly, vol: .8 });
    const times = []; let last = performance.now();
    await J.run(() => { const n = performance.now(); times.push(Math.round(n - last)); last = n; });
    const ms = performance.now() - t0, sr = J.done[0].buf.sampleRate, n = Math.ceil((total + 1) * sr);
    const L = new Float32Array(n), R = new Float32Array(n);
    for (const c of J.done) { const o = Math.round((c.t0 - T0) * sr), a = c.buf.getChannelData(0), bb = c.buf.getChannelData(1); for (let i = 0; i < a.length && i + o < n; i++) { L[i + o] += a[i]; R[i + o] += bb[i]; } }
    // 每 0.5 秒 RMS / 峰值
    const step = sr / 2, rms = [], peak = [];
    for (let i = 0; i + step <= n; i += step) { let s = 0, p = 0; for (let j = i; j < i + step; j++) { const v = (L[j] + R[j]) / 2; s += v * v; p = Math.max(p, Math.abs(L[j]), Math.abs(R[j])); } rms.push(+Math.sqrt(s / step).toFixed(3)); peak.push(+p.toFixed(2)); }
    // 频谱图：对数频率，宽 = 每 0.125 秒一列
    const N = 2048, hop = sr / 8, cols = Math.floor((n - N) / hop), rows = 220;
    const cv = document.createElement('canvas'); cv.width = cols; cv.height = rows; const x = cv.getContext('2d'); const img = x.createImageData(cols, rows);
    const re = new Float32Array(N), im = new Float32Array(N), win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    const fft = () => { for (let i = 1, j = 0; i < N; i++) { let bit = N >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
      for (let len = 2; len <= N; len <<= 1) { const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang); for (let i = 0; i < N; i += len) { let cr = 1, ci = 0; for (let j = 0; j < len / 2; j++) { const ar = re[i + j], ai = im[i + j], br = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci, bi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr; re[i + j] = ar + br; im[i + j] = ai + bi; re[i + j + len / 2] = ar - br; im[i + j + len / 2] = ai - bi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } } };
    for (let c = 0; c < cols; c++) {
      const o = c * hop; for (let i = 0; i < N; i++) { re[i] = (L[o + i] + R[o + i]) * .5 * win[i]; im[i] = 0; } fft();
      for (let r = 0; r < rows; r++) { const f = 40 * Math.pow(14000 / 40, 1 - r / rows), k = Math.round(f / sr * N); const m = Math.hypot(re[k], im[k]); const db = 20 * Math.log10(m + 1e-6); const v = Math.max(0, Math.min(1, (db + 30) / 70)); const p = (r * cols + c) * 4; img.data[p] = 255 * Math.min(1, v * 1.6); img.data[p + 1] = 255 * Math.max(0, v * 1.6 - .6); img.data[p + 2] = 255 * Math.max(0, .5 - v) + 60 * v; img.data[p + 3] = 255; }
    }
    x.putImageData(img, 0, 0);
    let wavUrl = null;
    if (wantWav) { const v = new DataView(new ArrayBuffer(44 + n * 4)); const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
      ws(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 4, true);
      for (let i = 0, o = 44; i < n; i++, o += 4) { v.setInt16(o, Math.max(-1, Math.min(1, L[i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, R[i])) * 32767, true); }
      const bytes = new Uint8Array(v.buffer); let s = ''; for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768)); wavUrl = btoa(s); }
    return { ms: Math.round(ms), times, chunks: J.done.length, rms, peak, png: cv.toDataURL('image/png'), wav: wavUrl, starts: P.ws.map(w => [w.m.id, w.start]) };
  }, [wav && wav !== "-", A0, AD, !!process.env.VOICE_ONLY]);
  fs.writeFileSync(path.join(out, 'spec.png'), Buffer.from(res.png.split(',')[1], 'base64'));
  if (res.wav) fs.writeFileSync(wav, Buffer.from(res.wav, 'base64'));
  console.log('render ms', res.ms, 'per chunk', res.times.join(','), 'chunks', res.chunks);
  for (const [id, st] of res.starts) {
    const i0 = st * 2, i1 = (res.starts.find(s => s[1] > st) || [0, res.rms.length / 2])[1] * 2;
    const r = res.rms.slice(i0, i1), p = res.peak.slice(i0, i1);
    console.log(id, 'rms avg', (r.reduce((a, b) => a + b, 0) / r.length).toFixed(3), 'max', Math.max(...r).toFixed(3), 'peak', Math.max(...p));
  }
  console.log(errs.slice(0, 20).join('\n') || 'no errors'); await b.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
