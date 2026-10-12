// 东大码 · 宣传片：特效（window.NEU_FX）
// 粒子汇聚成图标、冲击波、放射线、散景、天色、翻页时钟、滚轮数字、光速隧道、扫光、撞色大字、章节卡与角标、镜头抖动。
// 都只依赖传进来的时间，可随意跳转。
(() => {
const N = () => window.NEU;
const clamp01 = x => Math.max(0, Math.min(1, x));
const pr = (x, a, b) => clamp01((x - a) / (b - a));
const eo = k => 1 - Math.pow(1 - clamp01(k), 3);
const eio = k => (k = clamp01(k), k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const hash = x => { const s = Math.sin(x * 127.1 + 3.7) * 43758.5453; return s - Math.floor(s); };
const lerp = (a, b, k) => a + (b - a) * k;
const SANS = '"Noto Sans SC", "PingFang SC", sans-serif';
const fnt = (w, s, fam = SANS) => `${w} ${s}px ${fam}`;

// ---------- 图标轮廓上的均匀采样点（108 视口坐标） ----------
const LPC = new Map();
function logoPts(n) {
  if (LPC.has(n)) return LPC.get(n);
  const P = window.NEU_LOGO || [], segs = []; let tot = 0;
  for (const q of P) for (let i = 0; i < q.length; i += 2) { const j = (i + 2) % q.length, d = Math.hypot(q[j] - q[i], q[j + 1] - q[i + 1]); segs.push([q[i], q[i + 1], q[j], q[j + 1], d]); tot += d; }
  const out = []; let si = 0, acc = 0;
  for (let k = 0; k < n && segs.length; k++) {
    const want = (k + .5) / n * tot;
    while (si < segs.length - 1 && acc + segs[si][4] < want) { acc += segs[si][4]; si++; }
    const [x0, y0, x1, y1, d] = segs[si], u = d ? (want - acc) / d : 0; out.push([x0 + (x1 - x0) * u, y0 + (y1 - y0) * u]);
  }
  LPC.set(n, out); return out;
}
// 粒子从四周盘旋飞来，落在图标轮廓上。x, y, w 同 NEU.logo；k 0..1
function swarm(c, x, y, w, k, t, o = {}) {
  if (k <= 0) return;
  const P = logoPts(o.n || 560), s = w / 68;
  const pos = (i, e) => {
    const [px, py] = P[i], tx0 = x + (px - 54) * s, ty0 = y + (py - 53.5) * s;
    const ang = hash(i * 2.3) * 6.283, R = 380 + hash(i * 3.1) * 700, sw = 1 - e, spin = ang + sw * 1.1;
    return [lerp(tx0, 960 + Math.cos(spin) * R * 1.7, sw * sw), lerp(ty0, 540 + Math.sin(spin) * R, sw * sw)];
  };
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < P.length; i++) {
    const d0 = hash(i * 1.7) * .35, e = eio(pr(k, d0, d0 + .65)); if (e <= 0) continue;
    const [X, Y] = pos(i, e), [X0, Y0] = pos(i, Math.max(0, e - .07)), a = (.25 + .75 * e) * (.7 + .3 * Math.sin(t * 9 + i));
    const col = hash(i * 9.1) > .7 ? '127,214,222' : '143,178,255';
    if (e < 1) { c.strokeStyle = `rgba(${col},${a * .16})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X0, Y0); c.lineTo(X, Y); c.stroke(); }
    c.fillStyle = `rgba(${col},${a})`; c.beginPath(); c.arc(X, Y, 1.4 + 1.4 * hash(i * 4.4), 0, 7); c.fill();
  }
  c.restore();
}

// ---------- 冲击波、放射线 ----------
function ring(c, x, y, k, rMax, col = '143,178,255', lw = 6) {
  if (k <= 0 || k >= 1) return;
  const r = rMax * eo(k), a = 1 - k;
  c.save(); c.globalCompositeOperation = 'lighter';
  c.strokeStyle = `rgba(${col},${a * .25})`; c.lineWidth = lw * 4 * (1 - k) + 2; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  c.strokeStyle = `rgba(${col},${a * .9})`; c.lineWidth = lw * (1 - k) + 1; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
  c.restore();
}
function burst(c, x, y, k, o = {}) {
  if (k <= 0 || k >= 1) return;
  const n = o.n || 48, r0 = o.r0 || 80, r1 = o.r1 || 900, col = o.col || '200,220,255';
  c.save(); c.globalCompositeOperation = 'lighter'; c.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const a = i / n * 6.283 + hash(i + (o.seed || 0)) * .2, sp = .6 + .4 * hash(i * 2.7 + (o.seed || 0)), e = eo(k * sp * 1.2);
    const ra = r0 + (r1 - r0) * e, rb = ra - (60 + 160 * hash(i * 5.3)) * (1 - k);
    c.strokeStyle = `rgba(${col},${(1 - k) * .8})`; c.lineWidth = 2 + 2 * hash(i * 3.9);
    c.beginPath(); c.moveTo(x + Math.cos(a) * Math.max(r0, rb), y + Math.sin(a) * Math.max(r0, rb)); c.lineTo(x + Math.cos(a) * ra, y + Math.sin(a) * ra); c.stroke();
  }
  c.restore();
}

// ---------- 散景、天色、漏光 ----------
// o: { n, seed, y0, y1, r0, r1, cols, a, sp }
function bokeh(c, t, o = {}) {
  const a = o.a ?? 1; if (a <= 0) return;
  const n = o.n || 30, cols = o.cols || ['255,190,120', '143,178,255', '255,230,200'];
  c.save(); c.globalCompositeOperation = 'lighter';
  for (let i = 0; i < n; i++) {
    const h = hash(i * 7.7 + (o.seed || 0)), x = ((hash(i * 3.1 + (o.seed || 0)) * 2200 + t * (o.sp ?? 12) * (h - .3)) % 2200) - 140;
    const y = lerp(o.y0 ?? 0, o.y1 ?? 1080, hash(i * 5.9 + (o.seed || 0))) + Math.sin(t * .5 + i) * 10;
    const r = lerp(o.r0 ?? 18, o.r1 ?? 70, hash(i * 8.3)), al = a * (.25 + .35 * hash(i * 2.2)) * (.8 + .2 * Math.sin(t * 1.3 + i * 2));
    const g = c.createRadialGradient(x, y, r * .55, x, y, r); const cc = cols[i % cols.length];
    g.addColorStop(0, `rgba(${cc},${al})`); g.addColorStop(.85, `rgba(${cc},${al * .8})`); g.addColorStop(1, `rgba(${cc},0)`);
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
  }
  c.restore();
}
// kind: dawn 清晨（地平线一抹橙粉）/ noon 正午（顶上暖光）/ dusk 午后 / night 夜（城市散景）
function sky(c, kind, a, t) {
  if (a <= 0) return;
  const n = N();
  if (kind === 'dawn') { n.glow(c, 960, 1260, 1250, 'rgba(255,128,86,.42)', a); n.glow(c, 1300, 1150, 700, 'rgba(255,196,140,.35)', a); n.glow(c, 700, -100, 900, 'rgba(40,80,190,.35)', a); }
  if (kind === 'noon') { n.glow(c, 960, -260, 1300, 'rgba(255,226,170,.40)', a); n.glow(c, 1500, 200, 600, 'rgba(255,245,220,.18)', a); }
  if (kind === 'dusk') { n.glow(c, 1500, 1100, 1100, 'rgba(255,150,90,.35)', a); n.glow(c, 400, -100, 900, 'rgba(120,90,220,.25)', a); }
  if (kind === 'night') { n.glow(c, 960, 1300, 1300, 'rgba(15,69,175,.45)', a); bokeh(c, t, { n: 36, seed: 4, y0: 620, y1: 1080, r0: 10, r1: 46, a: a * .9, sp: 8 }); }
}
// 边缘漏光：两团慢慢漂移的暖光 / 冷光
function leak(c, t, a, warm = true) {
  if (a <= 0) return;
  const n = N();
  n.glow(c, -100 + Math.sin(t * .23) * 160, 300 + Math.cos(t * .19) * 200, 700, warm ? 'rgba(255,150,90,.30)' : 'rgba(91,140,255,.30)', a);
  n.glow(c, 2020 - Math.cos(t * .17) * 160, 800 + Math.sin(t * .21) * 150, 640, warm ? 'rgba(255,90,120,.18)' : 'rgba(127,214,222,.22)', a);
}

// ---------- 翻页时钟 ----------
function tile(c, x, y, w, h, ch, part, size) {
  c.save(); c.beginPath();
  if (part === 'top') c.rect(x - 2, y - 2, w + 4, h / 2 + 2); else if (part === 'bot') c.rect(x - 2, y + h / 2, w + 4, h / 2 + 2); else c.rect(x - 2, y - 2, w + 4, h + 4);
  c.clip();
  N().rr(c, x, y, w, h, w * .14, '#161A22');
  const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(255,255,255,.07)'); g.addColorStop(.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.25)');
  N().rr(c, x, y, w, h, w * .14, g);
  c.font = fnt(700, size * .82); c.fillStyle = '#F5F5F7'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(ch, x + w / 2, y + h / 2 + size * .04); c.textAlign = 'left';
  c.restore();
}
// 居中画在 (cx, cy)；from → to 在 k 0..1 之间逐位翻过（同位相同的不翻）
function flip(c, cx, cy, size, from, to, k, o = {}) {
  const w = size * .7, h = size * 1.06, gap = size * .07, cw = ch => ch === ':' || ch === '.' ? size * .32 : w;
  const chars = [...to], fr = [...String(from).padStart(chars.length, ' ')];
  let total = chars.reduce((a, ch) => a + cw(ch) + gap, -gap), x = cx - total / 2;
  const y = cy - h / 2;
  chars.forEach((t, i) => {
    const f = fr[i], ww = cw(t);
    if (t === ':' || t === '.') { c.fillStyle = '#F5F5F7'; if (t === ':') { [-.18, .18].forEach(d => { c.beginPath(); c.arc(x + ww / 2, cy + d * size, size * .055, 0, 7); c.fill(); }); } else { c.beginPath(); c.arc(x + ww / 2, cy + size * .36, size * .055, 0, 7); c.fill(); } x += ww + gap; return; }
    const ki = pr(k, i * .07, i * .07 + .55);
    if (f === t || ki >= 1) tile(c, x, y, ww, h, t, 'all', size);
    else if (ki <= 0) tile(c, x, y, ww, h, f, 'all', size);
    else {
      tile(c, x, y, ww, h, t, 'top', size); tile(c, x, y, ww, h, f, 'bot', size);
      const m = y + h / 2;
      c.save(); c.translate(0, m);
      if (ki < .5) { c.scale(1, 1 - ki * 2); c.translate(0, -m); tile(c, x, y, ww, h, f, 'top', size); c.fillStyle = `rgba(0,0,0,${ki})`; c.fillRect(x, y, ww, h / 2); }
      else { c.scale(1, ki * 2 - 1); c.translate(0, -m); tile(c, x, y, ww, h, t, 'bot', size); c.fillStyle = `rgba(0,0,0,${(1 - ki) * .8})`; c.fillRect(x, m, ww, h / 2); }
      c.restore();
    }
    c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(x, cy - 1, ww, 2);
    x += ww + gap;
  });
  return total;
}

// ---------- 时间：变了的那一位，旧数字向上淡出、新数字从下面淡入 ----------
function timeRoll(c, cx, cy, size, from, to, k, o = {}) {
  const chars = [...to], fr = [...String(from).padStart(chars.length, ' ')];
  c.save(); c.font = fnt(o.w || 400, size); c.textBaseline = 'middle'; c.textAlign = 'center';
  const dw = c.measureText('0').width * 1.04, cwd = ch => ch === ':' ? size * .34 : dw;
  const total = chars.reduce((a, ch) => a + cwd(ch), 0); let x = cx - total / 2;
  chars.forEach((t, i) => {
    const f = fr[i], w = cwd(t), ki = eio(pr(k, i * .06, i * .06 + .7));
    if (f === t || ki >= 1) { c.globalAlpha = 1; c.fillStyle = o.col || '#F5F5F7'; c.fillText(t, x + w / 2, cy - (t === ':' ? size * .05 : 0)); }
    else {
      c.fillStyle = o.col || '#F5F5F7';
      c.globalAlpha = 1 - ki; c.fillText(f, x + w / 2, cy - ki * size * .45);
      c.globalAlpha = ki; c.fillText(t, x + w / 2, cy + (1 - ki) * size * .45);
    }
    x += w;
  });
  c.restore(); return total;
}

// ---------- 滚轮数字（里程表） ----------
// v 当前值，fin 最终值（决定位数），vel 每小节变化量（决定拖影）；居中画在 (cx, y)，col 数字颜色
function odo(c, cx, y, v, fin, size, o = {}) {
  const fmt = fin.toFixed(o.dec ?? 2), places = [];
  const intLen = fmt.indexOf('.') < 0 ? fmt.length : fmt.indexOf('.'); for (let i = 0; i < fmt.length; i++) places.push(fmt[i] === '.' ? '.' : Math.pow(10, i < intLen ? intLen - 1 - i : intLen - i));
  c.save(); c.font = fnt(700, size); c.textBaseline = 'middle'; c.textAlign = 'center';
  const dw = c.measureText('0').width * 1.02, pw = size * .3, lh = size * 1.05;
  const total = places.reduce((a, p) => a + (p === '.' ? pw : dw), 0), pre = o.pre || '';
  c.font = fnt(500, size * .5); const prw = pre ? c.measureText(pre).width + size * .1 : 0;
  let x = cx - (total + prw) / 2;
  if (pre) { c.fillStyle = o.preCol || '#8A8F98'; c.textAlign = 'left'; c.fillText(pre, x, y + size * .1); c.textAlign = 'center'; x += prw; }
  c.font = fnt(700, size);
  const low = Math.min(...places.filter(p => p !== '.')), blur = Math.min(3, Math.abs(o.vel || 0) / (fin * .4 + 1) * 3);
  const g = o.grad ? c.createLinearGradient(x, y - size / 2, x + total, y + size / 2) : null; if (g) o.grad.forEach((cc, j) => g.addColorStop(j / (o.grad.length - 1), cc));
  for (const p of places) {
    if (p === '.') { c.fillStyle = g || o.col || '#fff'; c.fillText('.', x + pw / 2, y); x += pw; continue; }
    // 以最小一位为单位做整数运算，避免 128.6 / 0.1 这类浮点误差
    const V = v / low + 1e-6, u = Math.round(p / low);
    let base, frac;
    if (u === 1) { const d = V % 10; base = Math.floor(d); frac = d - base; }
    else { base = Math.floor(V / u) % 10; frac = clamp01((V % u) - (u - 1)); }
    const lead = v < p && p > 1 && p * 10 > 1; // 还没到这一位：淡一点
    c.save(); c.beginPath(); c.rect(x - 8, y - lh, dw + 16, lh * 2); c.clip();
    c.globalAlpha *= lead ? .18 : 1;
    const draw = (d, dy, a) => { c.globalAlpha *= a; c.fillStyle = g || o.col || '#fff'; c.fillText(String((d + 10) % 10), x + dw / 2, y + dy); c.globalAlpha /= a; };
    const ef = eio(frac); draw(base, -ef * lh * .4, 1 - ef); draw(base + 1, (1 - ef) * lh * .4, ef);
    if (o.trail && blur > .2 && p === low) for (let k = 1; k <= 3; k++) { draw(base, -frac * lh + k * blur * 6, .18); draw(base + 1, (1 - frac) * lh + k * blur * 6, .18); }
    c.restore();
    x += dw;
  }
  c.restore();
}

// ---------- 光速隧道：一圈圈屏幕形状的光框迎面扑来，加放射光线 ----------
function warp(c, t, sp, a) {
  if (a <= 0) return;
  c.save(); c.globalCompositeOperation = 'lighter';
  const n = 26;
  for (let i = 0; i < n; i++) {
    const z = ((i / n - t * .55 * (.4 + sp)) % 1 + 1) % 1, s = 1 / (z * 7 + .12);
    const w = 220 * s, h = 300 * s, al = a * Math.pow(1 - z, 1.5) * (z < .04 ? z / .04 : 1);
    c.strokeStyle = i % 3 ? `rgba(143,178,255,${al * .8})` : `rgba(127,214,222,${al})`; c.lineWidth = Math.max(1, 3 * s * .4);
    c.beginPath(); c.roundRect(960 - w / 2, 540 - h / 2, w, h, 26 * s); c.stroke();
  }
  for (let i = 0; i < 160; i++) {
    const ang = hash(i * 1.9) * 6.283, ph = ((hash(i * 4.1) + t * (.6 + sp * 1.8)) % 1), r0 = 40 + ph * ph * 1300, len = (40 + sp * 380) * ph;
    c.strokeStyle = `rgba(220,232,255,${a * ph * .7})`; c.lineWidth = 1 + 2 * ph;
    c.beginPath(); c.moveTo(960 + Math.cos(ang) * r0, 540 + Math.sin(ang) * r0 * .7); c.lineTo(960 + Math.cos(ang) * (r0 + len), 540 + Math.sin(ang) * (r0 + len) * .7); c.stroke();
  }
  N().glow(c, 960, 540, 380, 'rgba(160,190,255,.9)', a * (.4 + .6 * sp));
  c.restore();
}

// ---------- 扫光：一道亮带扫过文字 ----------
function sweep(c, text, x, y, font, align, k, col = '255,255,255') {
  if (k <= 0 || k >= 1) return;
  c.save(); c.font = font; c.textAlign = align; c.textBaseline = 'middle';
  const w = c.measureText(text).width, x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x, bx = x0 - 260 + (w + 520) * eio(k);
  const ia = .7 * Math.sin(Math.PI * k), g = c.createLinearGradient(bx - 140, 0, bx + 140, 0); g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(.5, `rgba(${col},${ia})`); g.addColorStop(1, `rgba(${col},0)`);
  c.fillStyle = g; c.shadowColor = `rgba(${col},${.6 * ia})`; c.shadowBlur = 12; c.fillText(text, x, y);
  c.restore();
}
// 撞色大字：从大到小砸下来，红青两色错位慢慢合回去
function slam(c, b, text, o) {
  const k = pr(b, o.at, o.at + (o.d ?? .35)), kout = o.out === undefined ? 0 : eio(pr(b, o.out, o.out + .3));
  if (k <= 0 || kout >= 1) return;
  const e = eo(k), s = lerp(1.8, 1, e), sp = (1 - e) * 46 + Math.max(0, Math.sin(b * 40)) * 4 * (1 - pr(b, o.at, o.at + 1.2));
  c.save(); c.translate(o.x ?? 960, o.y); c.scale(s, s); c.font = fnt(o.w || 900, o.size); c.textAlign = 'center'; c.textBaseline = 'middle';
  c.globalAlpha *= Math.min(1, k * 3) * (1 - kout);
  if (1 - e > .02 || sp > 1) { c.globalCompositeOperation = 'lighter'; c.fillStyle = 'rgba(255,60,90,.75)'; c.fillText(text, sp, 0); c.fillStyle = 'rgba(60,200,255,.75)'; c.fillText(text, -sp, 0); c.globalCompositeOperation = 'source-over'; }
  if ((1 - e) * 14 > .4) c.filter = `blur(${((1 - e) * 14).toFixed(1)}px)`;
  c.fillStyle = o.col || '#F5F5F7'; c.fillText(text, 0, 0);
  c.restore();
}

// ---------- 章节卡：翻页时钟 + 地点，随后缩到左上角当角标 ----------
// o: { from, to, place, at, flip (翻页时刻), out (开始缩), end (角标消失), card (false = 只要角标) }
function chapter(tx, L, o) {
  const b = L.b, n = N();
  const kin = o.card === false ? 1 : pr(b, o.at ?? 0, (o.at ?? 0) + .35), m = o.card === false ? 1 : eio(pr(b, o.out, o.out + .55));
  const kend = o.end === undefined ? 0 : pr(b, o.end - .35, o.end);
  const a = kin * (1 - kend); if (a <= 0) return;
  const size = lerp(210, 26, m), cx = lerp(960, 70 + size * 1.25, m), cy = lerp(500, 66, m);
  const fk = o.card === false ? 1 : pr(b, o.flip, o.flip + .7);
  n.al(tx, a, () => {
    const w = timeRoll(tx, cx, cy, size, o.from, o.to, fk, { w: m > .5 ? 500 : 400 });
    tx.font = fnt(lerp(500, 500, m), lerp(38, 22, m)); tx.textBaseline = 'middle';
    const lw = tx.measureText(o.place).width, lx = lerp(960 - lw / 2, cx + w / 2 + 16, m), ly = lerp(cy - size * .78, cy, m);
    tx.fillStyle = m > .5 ? '#9AA3B5' : '#8A8F98'; tx.fillText(o.place, lx, ly);
    if (m < 1) n.al(tx, (1 - m) * pr(b, o.flip + .3, o.flip + .7), () => { tx.fillStyle = '#5B6070'; tx.font = fnt(500, 26); tx.textAlign = 'center'; tx.fillText(o.line || '', 960, cy + size * .95); tx.textAlign = 'left'; });
  });
}

// ---------- 镜头：慢推 + 撞击时抖一下；闪白 ----------
// hits: [[小节, 强度], ...]
function cam(bars, hits = [], push = .025) {
  return L => {
    let sh = 0; for (const [b0, a] of hits) sh += eio(pr(L.b, b0 - .3, b0 + .6)) * (1 - eio(pr(L.b, b0 + .6, b0 + 2))) * a;
    return [1 + push * eio(L.b / bars) + sh * .006, 0, 0, 0];
  };
}
function flash(hits) { return L => { let f = 0; for (const [b0, a] of hits) f += L.hit(b0, .35) * a; return Math.min(1, f); }; }

window.NEU_FX = { timeRoll, logoPts, swarm, ring, burst, bokeh, sky, leak, flip, odo, warp, sweep, slam, chapter, cam, flash };
})();
