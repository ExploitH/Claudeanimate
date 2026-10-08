// 离线渲染整条音轨并分析（不用实时播放）：node mvaudio.js <outdir> [--wav out.wav] [--from 秒] [--dur 秒] [--html f | --dc 入口]
// 输出 outdir/spec.png（频谱图）和每段的 RMS / 峰值。--wav 同时写出立体声 WAV。
const path = require('path'), fs = require('fs');
const L = require('./mv-lib');

// 在已打开并挂好的页面里渲染：A0 起点秒，AD 时长秒（缺省到全片结束）
async function renderAudio(page, { A0 = 0, AD = 0, wantWav = false } = {}) {
  return page.evaluate(async ([wantWav, A0, AD]) => {
    const P = window.__mvPlan;   // sfx 的位置以小节计，换成秒要乘 MV_K.BAR
    const T0 = A0 ? +A0 : 0, total = AD ? +AD : P.total - T0, t0 = performance.now();
    const sfx = []; for (const w of P.ws) for (const s of w.m.sfx || []) sfx.push([w.start + s[0] * window.MV_K.BAR, ...s.slice(1)]); for (const r of P.rules) sfx.push([r.t, 'rule']); for (const w of P.ws) for (const [at, k, d] of w.m.vox || []) sfx.push([w.start + at * window.MV_K.BAR, 'vox', k, d]);
    const J = window.MV_MUSIC.job(P, sfx, T0, total, { sfx: true, bgm: true, vol: .8 });
    const times = []; let last = performance.now();
    await J.run(() => { const n = performance.now(); times.push(Math.round(n - last)); last = n; });
    const ms = performance.now() - t0, sr = J.done[0].buf.sampleRate, n = Math.ceil((total + 1) * sr);
    const Lc = new Float32Array(n), Rc = new Float32Array(n);
    for (const c of J.done) { const o = Math.round(c.t0 * sr), a = c.buf.getChannelData(0), bb = c.buf.getChannelData(1); for (let i = 0; i < a.length && i + o < n; i++) { Lc[i + o] += a[i]; Rc[i + o] += bb[i]; } }
    // 每 0.5 秒 RMS / 峰值
    const step = sr / 2, rms = [], peak = [];
    for (let i = 0; i + step <= n; i += step) { let s = 0, p = 0; for (let j = i; j < i + step; j++) { const v = (Lc[j] + Rc[j]) / 2; s += v * v; p = Math.max(p, Math.abs(Lc[j]), Math.abs(Rc[j])); } rms.push(+Math.sqrt(s / step).toFixed(3)); peak.push(+p.toFixed(2)); }
    // 频谱图：对数频率，宽 = 每 0.125 秒一列
    const N = 2048, hop = sr / 8, cols = Math.floor((n - N) / hop), rows = 220;
    const cv = document.createElement('canvas'); cv.width = cols; cv.height = rows; const x = cv.getContext('2d'); const img = x.createImageData(cols, rows);
    const re = new Float32Array(N), im = new Float32Array(N), win = new Float32Array(N); for (let i = 0; i < N; i++) win[i] = .5 - .5 * Math.cos(2 * Math.PI * i / N);
    const fft = () => { for (let i = 1, j = 0; i < N; i++) { let bit = N >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
      for (let len = 2; len <= N; len <<= 1) { const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang); for (let i = 0; i < N; i += len) { let cr = 1, ci = 0; for (let j = 0; j < len / 2; j++) { const ar = re[i + j], ai = im[i + j], br = re[i + j + len / 2] * cr - im[i + j + len / 2] * ci, bi = re[i + j + len / 2] * ci + im[i + j + len / 2] * cr; re[i + j] = ar + br; im[i + j] = ai + bi; re[i + j + len / 2] = ar - br; im[i + j + len / 2] = ai - bi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } } };
    for (let c = 0; c < cols; c++) {
      const o = c * hop; for (let i = 0; i < N; i++) { re[i] = (Lc[o + i] + Rc[o + i]) * .5 * win[i]; im[i] = 0; } fft();
      for (let r = 0; r < rows; r++) { const f = 40 * Math.pow(14000 / 40, 1 - r / rows), k = Math.round(f / sr * N); const m = Math.hypot(re[k], im[k]); const db = 20 * Math.log10(m + 1e-6); const v = Math.max(0, Math.min(1, (db + 30) / 70)); const p = (r * cols + c) * 4; img.data[p] = 255 * Math.min(1, v * 1.6); img.data[p + 1] = 255 * Math.max(0, v * 1.6 - .6); img.data[p + 2] = 255 * Math.max(0, .5 - v) + 60 * v; img.data[p + 3] = 255; }
    }
    x.putImageData(img, 0, 0);
    let wavB64 = null;
    if (wantWav) { const v = new DataView(new ArrayBuffer(44 + n * 4)); const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
      ws(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true); v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 4, true);
      for (let i = 0, o = 44; i < n; i++, o += 4) { v.setInt16(o, Math.max(-1, Math.min(1, Lc[i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, Rc[i])) * 32767, true); }
      const bytes = new Uint8Array(v.buffer); let s = ''; for (let i = 0; i < bytes.length; i += 32768) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 32768)); wavB64 = btoa(s); }
    return { ms: Math.round(ms), times, chunks: J.done.length, rms, peak, png: cv.toDataURL('image/png'), wav: wavB64, sr, starts: P.ws.map(w => [w.m.id, w.start]) };
  }, [wantWav, A0, AD]);
}

module.exports = { renderAudio };

if (require.main === module) {
  (async () => {
    const { o, pos } = L.args(process.argv.slice(2), ['--html', '--dc', '--title', '--wav', '--from', '--dur']);
    const [out] = pos;
    if (!out) { console.error('用法：node mvaudio.js <outdir> [--wav out.wav] [--from 秒] [--dur 秒] [--html f | --dc 入口]'); process.exit(1); }
    fs.mkdirSync(out, { recursive: true });
    const { page, errs, close } = await L.openPage(L.pageFor(o), { viewport: { width: 1280, height: 800 } });
    try {
      await L.ready(page);
      await L.seek(page, 0);
      const res = await renderAudio(page, { A0: +(o.from || 0), AD: +(o.dur || 0), wantWav: !!o.wav });
      fs.writeFileSync(path.join(out, 'spec.png'), Buffer.from(res.png.split(',')[1], 'base64'));
      if (res.wav) fs.writeFileSync(o.wav, Buffer.from(res.wav, 'base64'));
      console.log('render ms', res.ms, 'per chunk', res.times.join(','), 'chunks', res.chunks);
      // rms / peak 是从渲染起点开始、每 0.5 秒一个值，所以（秒 − 起点） × 2 就是下标
      const A0 = +(o.from || 0), n = res.rms.length;
      for (let k = 0; k < res.starts.length; k++) {
        const [id, st] = res.starts[k];
        const i0 = Math.max(0, Math.round((st - A0) * 2)), i1 = Math.min(n, k + 1 < res.starts.length ? Math.round((res.starts[k + 1][1] - A0) * 2) : n);
        if (i1 <= i0) continue;
        const r = res.rms.slice(i0, i1), p = res.peak.slice(i0, i1);
        console.log(id, 'rms avg', (r.reduce((a, b) => a + b, 0) / r.length).toFixed(3), 'max', Math.max(...r).toFixed(3), 'peak', Math.max(...p));
      }
      console.log(errs.slice(0, 20).join('\n') || 'no errors');
    } finally { await close(); }
  })().catch(e => { console.error(e); process.exit(1); });
}
