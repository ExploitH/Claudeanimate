// Vibe Coding · 导演剪辑版：音乐短片引擎
// 十个世界各自注册到 window.MV_W[id]，本文件负责：节拍时间、十种画风的片元着色器、转场、
// 动态字（歌词）、Clawd 的各种打扮、规则收集 HUD、音轨。
const { useMemo, useRef, useEffect, useState } = React;
const W = 1920, H = 1080;
const BPM = 120, BEAT = 60 / BPM, BAR = BEAT * 4;

// ---------- 字体、颜色、缓动 ----------
const F = {
  sans: '"Noto Sans SC", "PingFang SC", sans-serif',
  serif: '"Noto Serif SC", "Songti SC", serif',
  mono: '"JetBrains Mono", "Noto Sans SC", monospace',
  poster: '"ZCOOL QingKe HuangYou", "Noto Sans SC", sans-serif',
  round: '"ZCOOL KuaiLe", "Noto Sans SC", sans-serif',
  brush: '"Ma Shan Zheng", "Noto Serif SC", serif',
  pixel: '"Press Start 2P", "Noto Sans SC", monospace',
  neon: '"Monoton", "Noto Sans SC", sans-serif',
  type: '"Special Elite", "Noto Serif SC", serif',
  display: '"Bebas Neue", "Noto Sans SC", sans-serif',
};
const FONT_LOADS = [[F.sans, [400, 500, 700, 900]], [F.serif, [400, 700, 900]], [F.mono, [400, 700]], [F.poster, [400]], [F.round, [400]],
  [F.brush, [400]], [F.pixel, [400]], [F.neon, [400]], [F.type, [400]], [F.display, [400]]];
const C = { clawd: '#d97757', clawdHi: '#e8957a', eye: '#1d1210', ink: '#e8e9ee', dim: '#9aa0ab', faint: '#5d626c', bg: '#0b0b0e',
  kw: '#c792ea', str: '#a5d67a', fn: '#7cb7ff', num: '#f2a65a', type: '#5fd4c8', err: '#f07178' };
const E = { lin: x => x, out: Easing.easeOutCubic, in: Easing.easeInCubic, io: Easing.easeInOutCubic, back: Easing.easeOutBack,
  expo: Easing.easeOutExpo, quad: Easing.easeOutQuad, el: Easing.easeOutElastic, sine: Easing.easeInOutSine };
const clamp01 = x => Math.max(0, Math.min(1, x));
const prog = (x, a, b, e = E.out) => e(clamp01((x - a) / (b - a)));
const lerp = (a, b, k) => a + (b - a) * k;
const bump = (x, c, w) => Math.exp(-Math.pow((x - c) / w, 2));
const hash = x => { const s = Math.sin(x * 127.1 + 3.7) * 43758.5453; return s - Math.floor(s); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const toHex = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
const mixC = (a, b, k) => { const A = hex(a), B = hex(b); return toHex(A.map((v, i) => v + (B[i] - v) * k)); };
const rgba = (h, a) => `rgba(${hex(h).join(',')},${a})`;
const fnt = (w, s, fam = F.sans) => `${w} ${s}px ${fam}`;

// 画风编号（与着色器一致）
const LOOK = { VOID: 0, DREAM: 1, ORBIT: 2, RISO: 3, PAPER: 4, NEON: 5, PRINT: 6, PIXEL: 7, NOIR: 8, ALERT: 9, PRISM: 10, FILM: 11 };
const LOOK_NAMES = ['虚空', '梦', '轨道', '印刷', '纸', '霓虹', '蓝图', '存档', '黑色电影', '警报', '回声', '电影'];
// 转场编号
const TR = { CUT: 0, WIPE: 1, PIXEL: 2, IRIS: 3, TEAR: 4, INK: 5, GLITCH: 6, BURN: 7, FLASH: 8 };

// ---------- Canvas 2D 小工具 ----------
const CWC = new Map();
function cw(ctx, ch) { const k = ctx.font + '|' + ch; let w = CWC.get(k); if (w === undefined) { w = ctx.measureText(ch).width; CWC.set(k, w); } return w; }
function rr(ctx, x, y, w, h, r, fill, stroke, lw = 2) {
  if (w < .5 || h < .5) return;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.max(0, Math.min(r, h / 2, w / 2)));
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function circ(ctx, x, y, r, fill, stroke, lw = 2) {
  if (r <= 0) return;
  ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
function seg(ctx, x0, y0, x1, y1, col, lw = 2, dash) {
  ctx.strokeStyle = col; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke(); if (dash) ctx.setLineDash([]);
}
function arrow(ctx, x0, y0, x1, y1, col, lw = 3, hd = 14, k = 1) {
  if (k <= 0) return;
  const x = lerp(x0, x1, k), y = lerp(y0, y1, k), a = Math.atan2(y1 - y0, x1 - x0);
  seg(ctx, x0, y0, x, y, col, lw);
  ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - hd * Math.cos(a - .45), y - hd * Math.sin(a - .45)); ctx.lineTo(x - hd * Math.cos(a + .45), y - hd * Math.sin(a + .45)); ctx.fill();
}
function txt(ctx, s, x, y, font, col, align = 'left', base = 'middle') {
  ctx.font = font; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = base; ctx.fillText(s, x, y); ctx.textAlign = 'left';
}
function tw(ctx, s, font) { ctx.font = font; return ctx.measureText(s).width; }
function scaleAt(ctx, x, y, s, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-x, -y); fn(); ctx.restore(); }
function rotAt(ctx, x, y, a, fn) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.translate(-x, -y); fn(); ctx.restore(); }
function alpha(ctx, a, fn) { if (a <= 0) return; const g = ctx.globalAlpha; ctx.globalAlpha = g * Math.min(1, a); fn(); ctx.globalAlpha = g; }

// ---------- 动态字（歌词） ----------
// text 里用 ‹…› 标第一强调色，«…» 标第二强调色；\n 换行
function marks(s) {
  const out = []; let m = 0;
  for (const ch of s) {
    if (ch === '‹') { m = 1; continue; } if (ch === '«') { m = 2; continue; }
    if (ch === '›' || ch === '»') { m = 0; continue; }
    out.push({ ch, m });
  }
  return out;
}
const GLYPH = '01アカサタナ#$%&*+=<>/\\|{}[]?!密码令牌函数变量提交测试';
// s: {at, out, outLen, text, x, y, size, fam, w, col, acc, align, anim, outAnim, st(拍/字), d(小节), lh, ls, wave, glow, stroke, shadow, box, caret}
function lyric(ctx, L, s) {
  const b = L.b, outLen = s.outLen ?? .25;
  if (b < s.at - 1e-3 || (s.out !== undefined && b >= s.out + outLen + .5)) return null;
  const size = s.size || 64, fam = s.fam || F.sans, wt = s.w || 700;
  ctx.font = fnt(wt, size, fam); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const lines = String(s.text).split('\n').map(marks), ls = (s.ls || 0) * size, lh = (s.lh || 1.28) * size;
  const wid = lines.map(l => l.reduce((a, c) => a + cw(ctx, c.ch) + ls, l.length ? -ls : 0));
  const nch = lines.reduce((a, l) => a + l.length, 0), al = s.align || 'left', d = s.d ?? .18, anim = s.anim || 'rise', oa = s.outAnim || (anim === 'type' ? 'cut' : 'fade');
  const st = Math.min((s.st ?? .12) / 4, (s.rev ?? .3) / Math.max(1, nch)); // 整行最多 rev 小节内出完
  const acc = s.acc || [C.num, C.kw], col = s.col || C.ink;
  const y0 = s.y - (lines.length - 1) * lh / 2;
  let gi = 0, lastX = s.x, lastY = y0, lastVis = false;
  const box = { x: 1e9, y: y0 - lh / 2, x1: -1e9, y1: y0 + (lines.length - .5) * lh, lines: [] };
  const blockK = prog(b, s.at, s.at + d, E.out), outK = s.out === undefined ? 0 : prog(b, s.out, s.out + outLen, E.in);
  ctx.save();
  if (s.glow) { ctx.shadowColor = s.glow[1]; ctx.shadowBlur = s.glow[0]; }
  if (anim === 'stamp') {
    const mw = Math.max(...wid), bx = al === 'center' ? s.x : al === 'right' ? s.x - mw / 2 : s.x + mw / 2, sk = lerp(1.7, 1, E.out(blockK));
    ctx.translate(bx, s.y); ctx.scale(sk, sk); ctx.translate(-bx, -s.y); ctx.globalAlpha *= Math.min(1, blockK * 3);
  }
  lines.forEach((ln, li) => {
    const lw = wid[li], ly = y0 + li * lh;
    let x = al === 'center' ? s.x - lw / 2 : al === 'right' ? s.x - lw : s.x;
    box.x = Math.min(box.x, x); box.x1 = Math.max(box.x1, x + lw); box.lines.push([x, ly, lw]);
    if (s.box && blockK > 0) {
      const [pd, bc, rad] = s.box, sh = ctx.shadowBlur; ctx.shadowBlur = 0;
      const kk = anim === 'type' ? 1 : blockK;
      rr(ctx, x - pd, ly - lh * .46, (lw + pd * 2) * kk, lh * .92, rad ?? 6, bc); ctx.shadowBlur = sh;
    }
    for (const c of ln) {
      const i = gi++, cs = s.at + i * st, e = prog(b, cs, cs + d, E.lin), wch = cw(ctx, c.ch);
      let a = 1, dx = 0, dy = 0, sc = 1, rot = 0, ch = c.ch, blur = 0;
      if (anim === 'type') a = b >= cs ? 1 : 0;
      else if (anim === 'fade') { a = E.out(e); dy = (1 - E.out(e)) * size * .25; }
      else if (anim === 'rise') { a = E.out(e); dy = (1 - E.out(e)) * size * .7; }
      else if (anim === 'drop') { const k = E.back(e); a = Math.min(1, e * 3); dy = -(1 - k) * size * 1.1; }
      else if (anim === 'pop') { sc = E.back(e); a = Math.min(1, e * 4); }
      else if (anim === 'slide') { a = E.out(e); dx = -(1 - E.out(e)) * size * 1.4; }
      else if (anim === 'blur') { a = E.out(e); blur = (1 - e) * size * .22; }
      else if (anim === 'flicker') { a = e <= 0 ? 0 : e < 1 ? (hash(i * 7.3 + Math.floor(b * 48)) > .45 ? 1 : .12) : 1; }
      else if (anim === 'scramble') { a = e > 0 ? 1 : 0; if (e > 0 && e < 1 && c.ch !== ' ') ch = GLYPH[Math.floor(hash(i * 3.1 + Math.floor(b * 40)) * GLYPH.length)]; }
      if (s.wave) dy += Math.sin(b * Math.PI * 2 * (s.waveF || .5) + i * .55) * size * s.wave;
      if (outK > 0) {
        const ok = s.outSt ? prog(b, s.out + i * s.outSt / 4, s.out + i * s.outSt / 4 + outLen, E.in) : outK;
        if (oa === 'fade') a *= 1 - ok;
        else if (oa === 'up') { a *= 1 - ok; dy -= ok * size * .6; }
        else if (oa === 'drop') { dy += ok * ok * size * 4; rot += (hash(i) - .5) * ok * 1.2; a *= 1 - ok * ok; }
        else if (oa === 'blur') { a *= 1 - ok; blur += ok * size * .25; }
        else if (oa === 'scatter') { dx += (hash(i * 1.7) - .5) * ok * size * 6; dy += (hash(i * 2.9) - .5) * ok * size * 4; rot += (hash(i) - .5) * ok * 3; a *= 1 - ok; }
        else if (oa === 'cut') a *= ok > 0 ? 0 : 1;
        else if (oa === 'glitch') { a *= ok > .9 ? 0 : hash(i + Math.floor(b * 50)) > ok ? 1 : 0; dx += (hash(i * 5 + Math.floor(b * 50)) - .5) * ok * size; }
      }
      if (a > .003) {
        const cx = x + dx + wch / 2, cy = ly + dy;
        ctx.save(); ctx.globalAlpha *= a;
        if (blur > .5) ctx.filter = `blur(${blur.toFixed(1)}px)`;
        ctx.translate(cx, cy); if (rot) ctx.rotate(rot); if (sc !== 1) ctx.scale(sc, sc);
        const fill = c.m === 1 ? acc[0] : c.m === 2 ? acc[1] : col;
        if (s.shadow) { ctx.fillStyle = s.shadow[2]; ctx.fillText(ch, -wch / 2 + s.shadow[0], s.shadow[1]); }
        if (s.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = s.stroke[0]; ctx.strokeStyle = s.stroke[1]; ctx.strokeText(ch, -wch / 2, 0); }
        ctx.fillStyle = fill; ctx.fillText(ch, -wch / 2, 0);
        ctx.restore();
        lastVis = true;
      }
      if (b >= cs) { lastX = x + wch; lastY = ly; }
      x += wch + ls;
    }
  });
  ctx.restore();
  if (s.caret && blockK > 0 && outK < 1) {
    const on = Math.floor(L.bt * 2) % 2 === 0 || b < s.at + gi * st + .1;
    if (on) { ctx.fillStyle = s.caret; ctx.fillRect(lastX + size * .06, lastY - size * .5, size * .52, size * 1.0); }
  }
  return box;
}
const youType = text => Math.min(.5, text.length * .028); // 你的气泡：整句打字用时（小节）
// 副歌：主旋律 8 小节，每个字落在一个音符上
const SING = [[[0, '顺着感觉走'], [-1, '，'], [1, '别闭眼'], [-1, '；']], [[2, '说清要啥'], [-1, '，'], [3, '再按回车'], [-1, '。']], [[4, '我会犯错的'], [-1, '，'], [5, '别全信'], [-1, '；']], [[6, '小步存档'], [-1, '——'], [7, '走']]];
const HOOK_ON = [[0, 1.5, 2, 3, 3.5], [0, 2, 3], [0, 1.5, 2, 3], [0, 2, 2.5, 3], [0, 1, 1.5, 2, 3], [0, 2, 3], [0, 1.5, 2, 3], [0]];
// s: {at(主旋律第 0 小节所在的世界小节), x, y, size, fam, w, col(颜色或按小节取色的函数), dim, glow, align, hold, stroke}
function sing(ctx, L, s) {
  const hb = L.b - s.at, hold = s.hold ?? 8.3;
  if (hb < -.2 || hb >= hold) return;
  const ci = Math.max(0, Math.min(3, Math.floor((hb + .15) / 2))), size = s.size || 72;
  ctx.font = fnt(s.w || 900, size, s.fam || F.sans); ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const chars = []; let last = ci * 2;
  for (const [bar, str] of SING[ci]) {
    if (bar < 0) { for (const ch of str) chars.push({ ch, t: last }); continue; }
    [...str].forEach((ch, k) => { const t = bar + HOOK_ON[bar][Math.min(k, HOOK_ON[bar].length - 1)] / 4; chars.push({ ch, t }); last = t; });
  }
  const wid = chars.map(c => cw(ctx, c.ch)), total = wid.reduce((a, b) => a + b, 0);
  let x = s.align === 'left' ? s.x : s.x - total / 2;
  const end = ci < 3 ? ci * 2 + 2 : hold, kin = prog(hb, ci * 2 - .18, ci * 2 - .02, E.out), kout = prog(hb, end - .12, end, E.in);
  const col = typeof s.col === 'function' ? s.col(Math.floor(hb)) : s.col || '#ffffff';
  ctx.save(); ctx.globalAlpha *= kin * (1 - kout);
  chars.forEach((c, i) => {
    const on = hb >= c.t, k = on ? prog(hb, c.t, c.t + .1, E.out) : 0;
    ctx.save(); ctx.translate(x + wid[i] / 2, s.y - (on ? (1 - k) * size * .12 : 0)); const sc = on ? lerp(1.28, 1, k) : 1; ctx.scale(sc, sc);
    if (on && s.glow) { ctx.shadowColor = typeof s.glow === 'function' ? s.glow(Math.floor(hb)) : s.glow; ctx.shadowBlur = 16; }
    if (s.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = s.stroke[0]; ctx.strokeStyle = s.stroke[1]; ctx.strokeText(c.ch, -wid[i] / 2, 0); }
    ctx.fillStyle = on ? col : (s.dim || rgba(col.startsWith('#') ? col : '#ffffff', .3)); ctx.fillText(c.ch, -wid[i] / 2, 0);
    ctx.restore(); x += wid[i];
  });
  ctx.restore();
}
function typeSfx(at, text, st = .12, kind = 'key') { const ev = []; let i = 0; for (const c of marks(text)) { if (c.ch !== ' ' && c.ch !== '\n') ev.push([at + i * st / 4, kind]); i++; } return ev; }

// ---------- Clawd：像素小人，十种打扮 ----------
function clawdCells(st) {
  const cells = [], body = st.col || C.clawd, hi = st.hi || C.clawdHi;
  for (let r = 0; r < 6; r++) for (let c = 2; c < 10; c++) cells.push([c, r, r === 0 ? hi : body]);
  const on = Math.sin(st.ph || 0) > 0;
  let L = [[0, 3], [1, 3]], R = [[10, 3], [11, 3]];
  if (st.pose === 'wave') R = on ? [[10, 2], [11, 1], [11, 0]] : [[10, 3], [11, 2], [12, 1]];
  if (st.pose === 'up') R = [[10, 3], [10, 2], [10, 1], [10, 0]];
  if (st.pose === 'both') { R = [[10, 3], [10, 2], [10, 1], [10, 0]]; L = [[1, 3], [1, 2], [1, 1], [1, 0]]; }
  if (st.pose === 'push') { R = [[10, 3], [11, 3], [12, 3]]; L = [[1, 3]]; }
  if (st.pose === 'point') R = [[10, 3], [11, 2], [12, 1]];
  if (st.pose === 'pointL') L = [[1, 3], [0, 2], [-1, 1]];
  if (st.pose === 'cover') { L = [[1, 3], [1, 2]]; R = [[10, 3], [10, 2]]; }
  if (st.pose === 'type') { L = on ? [[1, 4], [1, 5]] : [[1, 3], [1, 4]]; R = on ? [[10, 3], [10, 4]] : [[10, 4], [10, 5]]; }
  if (st.pose === 'hold') { L = [[1, 3], [1, 4]]; R = [[10, 3], [10, 4]]; }
  [...L, ...R].forEach(([c, r]) => cells.push([c, r, body]));
  if (st.pose === 'cover') [[2, 2], [3, 2], [3, 3], [8, 2], [8, 3], [9, 2]].forEach(([c, r]) => cells.push([c, r, hi]));
  const wk = st.walk >= 0 ? (Math.sin(st.walk) > 0 ? 0 : 1) : -1;
  for (const [c, g] of [[2, 0], [4, 1], [7, 0], [9, 1]]) { cells.push([c, 6, body]); if (wk !== g) cells.push([c, 7, body]); }
  return cells;
}
// st: {x, y, px, pose, ph, walk, eye, blink, squash, alpha, sweat, q, skin, col, hi, eyeC, hat, glow, rot, line}
function clawd(ctx, st) {
  if (!st || st.px <= 0 || (st.alpha ?? 1) <= 0) return;
  const { x, y, px } = st, sq = st.squash || 1, sxk = 1 / Math.sqrt(sq), skin = st.skin || 'pixel';
  const pos = (c, r) => [x + (c - 6) * px * sxk, y - (8 - r) * px * sq];
  const cells = clawdCells(st);
  ctx.save(); ctx.globalAlpha *= st.alpha ?? 1;
  if (st.rot) { ctx.translate(x, y); ctx.rotate(st.rot); ctx.translate(-x, -y); }
  const set = new Set(cells.map(([c, r]) => c + ',' + r));
  const edges = () => {
    ctx.beginPath();
    for (const [c, r] of cells) {
      const [cx, cy] = pos(c, r), w = px * sxk, h = px * sq;
      if (!set.has(c + ',' + (r - 1))) { ctx.moveTo(cx, cy); ctx.lineTo(cx + w, cy); }
      if (!set.has(c + ',' + (r + 1))) { ctx.moveTo(cx, cy + h); ctx.lineTo(cx + w, cy + h); }
      if (!set.has((c - 1) + ',' + r)) { ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + h); }
      if (!set.has((c + 1) + ',' + r)) { ctx.moveTo(cx + w, cy); ctx.lineTo(cx + w, cy + h); }
    }
  };
  if (skin === 'pixel' || skin === 'paper' || skin === 'glow' || skin === 'flat') {
    if (skin === 'paper') { ctx.lineJoin = 'round'; ctx.lineWidth = px * .7; ctx.strokeStyle = st.line || '#fbf6ec'; edges(); ctx.stroke(); }
    if (skin === 'glow') { ctx.shadowColor = st.glow || st.col || C.clawd; ctx.shadowBlur = px * 1.2; }
    const gap = skin === 'pixel' ? .94 : 1.02;
    for (const [c, r, col] of cells) { const [cx, cy] = pos(c, r); ctx.fillStyle = col; ctx.fillRect(cx, cy, px * sxk * gap, px * sq * gap); }
    ctx.shadowBlur = 0;
  } else if (skin === 'neon' || skin === 'wire') {
    ctx.lineJoin = 'miter'; ctx.lineCap = 'square';
    if (skin === 'neon') { ctx.shadowColor = st.glow || st.col || '#ff5fa2'; ctx.shadowBlur = px * 1.6; ctx.lineWidth = px * .34; ctx.strokeStyle = st.col || '#ff7ab8'; edges(); ctx.stroke(); ctx.lineWidth = px * .12; ctx.strokeStyle = '#fff4fa'; edges(); ctx.stroke(); ctx.shadowBlur = 0; }
    else { ctx.lineWidth = Math.max(1.5, px * .16); ctx.strokeStyle = st.col || '#eaf4ff'; edges(); ctx.stroke(); }
  } else if (skin === 'ink') {
    for (const [c, r] of cells) { const [cx, cy] = pos(c, r); ctx.fillStyle = st.col || '#111'; ctx.fillRect(cx, cy, px * sxk * 1.02, px * sq * 1.02); }
  }
  // 眼睛
  if (st.pose !== 'cover' && !(st.hat === 'shades')) {
    const ex = (st.eye || 0) * px * .4, bl = st.blink ? .22 : 1, ey = (st.nod ? px * .3 : 0) + (st.eyeY || 0) * px;
    for (const c of [3, 8]) {
      const [cx, cy] = pos(c, 2), eh = px * 2 * sq * bl;
      ctx.fillStyle = st.eyeC || (skin === 'neon' ? '#fff4fa' : skin === 'wire' ? (st.col || '#eaf4ff') : C.eye);
      if (st.eyeShape === 'x') { ctx.font = fnt(900, px * 1.8, F.mono); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('×', cx + px * .5 * sxk, cy + px * sq); ctx.textAlign = 'left'; }
      else if (st.eyeShape === 'happy') { ctx.fillRect(cx + ex, cy + px * .9 * sq, px * sxk, px * .45 * sq); }
      else ctx.fillRect(cx + ex, cy + ey + (px * 2 * sq - eh) * .5, px * sxk * .94, eh * .94);
    }
  }
  // 配件
  if (st.hat === 'fedora') {
    const [bx, by] = pos(.6, -.55), [cx0, cy0] = pos(2.6, -2.6);
    ctx.fillStyle = st.hatC || '#141414'; ctx.fillRect(bx, by, px * 10.8 * sxk, px * .7); ctx.fillRect(cx0, cy0, px * 6.8 * sxk, px * 2.2);
    ctx.fillStyle = st.bandC || '#7d1d1d'; ctx.fillRect(cx0, by - px * .6, px * 6.8 * sxk, px * .55);
  }
  if (st.hat === 'shades') {
    const [sx, sy] = pos(2.4, 1.7); ctx.fillStyle = '#0b0b0b'; ctx.fillRect(sx, sy, px * 7.2 * sxk, px * 1.3 * sq);
    ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(sx + px * .6, sy + px * .25, px * 1.4, px * .3);
  }
  if (st.hat === 'helmet') {
    const [hx, hy] = pos(6, 2.6), R = px * 6.6;
    ctx.fillStyle = 'rgba(170,215,255,.10)'; ctx.strokeStyle = st.ring || 'rgba(190,225,255,.85)'; ctx.lineWidth = Math.max(2, px * .3);
    ctx.beginPath(); ctx.arc(hx, hy, R, 0, 6.2832); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = Math.max(2, px * .35); ctx.beginPath(); ctx.arc(hx, hy, R * .78, -2.6, -1.9); ctx.stroke();
  }
  if (st.hat === 'cap8') { const [cx0, cy0] = pos(2, -1.1); ctx.fillStyle = st.hatC || '#ff004d'; ctx.fillRect(cx0, cy0, px * 8 * sxk, px * 1.1); ctx.fillRect(cx0 + px * 6 * sxk, cy0 + px * .6, px * 4 * sxk, px * .5); }
  if (st.sweat > 0) { const [cx, cy] = pos(10.4, -.4), dd = (st.sweat * 1.6) % 1; ctx.fillStyle = rgba('#9cdcfe', 1 - dd); ctx.fillRect(cx, cy + dd * px * 3, px * .55, px * .8); }
  if (st.q > 0) {
    const [cx, cy] = pos(9.5, -3.4), s2 = px * .55 * E.back(Math.min(1, st.q));
    const Qm = ['.##.', '#..#', '...#', '..#.', '..#.', '....', '..#.'];
    ctx.fillStyle = st.qC || C.num;
    Qm.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') ctx.fillRect(cx + i * s2, cy + j * s2, s2 * .9, s2 * .9); }));
  }
  ctx.restore();
}
function hop(T, jumps, base) { // jumps: [t0, t1, from, to]（单位随调用方，通常是小节）
  let p = base;
  for (const j of jumps) {
    const [t0, t1, f, to] = j;
    if (T < t0) break;
    if (T < t1) { const k = (T - t0) / (t1 - t0), e = E.io(k), d = Math.hypot(to[0] - f[0], to[1] - f[1]); return { p: [lerp(f[0], to[0], e), lerp(f[1], to[1], e) - Math.sin(Math.PI * k) * (60 + d * .16), lerp(f[2], to[2], e)], air: true, k }; }
    p = to;
  }
  return { p, air: false, k: 0 };
}
function clawdAt(L, jumps, base, extra) { // 带落地挤压的标准跳跃位置
  const r = hop(L.b, jumps, base), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: L.t * 14, walk: -1, eye: 0, blink: (L.t % 3.1) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const land = jumps.map(j => j[1]).find(t => L.b >= t && L.b < t + .12);
  if (land !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (L.b - land) / .12);
  return Object.assign(st, extra || {});
}

// ---------- 着色器：十种画风 + 转场 ----------
const VS = '#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FS = `#version 300 es
precision highp float;
uniform sampler2D uCA,uTA,uCB,uTB,uHud;
uniform vec2 uRes;
uniform float uT,uBeat,uMix,uTK,uLA,uLB,uFx,uBox,uFlash;
uniform vec4 uPA,uPB,uCamA,uCamB,uFoA,uFoB,uTP,uTC;
out vec4 oc;
const float AR=1.7777778;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
float fbm3(vec2 p){float v=0.,a=.5;for(int i=0;i<3;i++){v+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v/.875;}
vec3 pal(float t){return .5+.5*cos(6.2831853*(t+vec3(0.,.33,.67)));}
vec3 dpal(float x){x=fract(x);vec3 a=vec3(.22,.08,.42),b=vec3(.98,.42,.72),c=vec3(.42,.8,1.),d=vec3(1.,.76,.55);return x<.25?mix(a,b,x*4.):x<.5?mix(b,d,(x-.25)*4.):x<.75?mix(d,c,(x-.5)*4.):mix(c,a,(x-.75)*4.);}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
vec4 tx(sampler2D s,vec2 uv,float lod){if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return vec4(0.);return textureLod(s,uv,lod);}
vec2 camUV(vec2 uv,vec4 c){vec2 p=(uv-.5)*vec2(AR,1.);float cs=cos(c.y),sn=sin(c.y);p=mat2(cs,sn,-sn,cs)*p/c.x;p+=c.zw*vec2(AR,1.);return p/vec2(AR,1.)+.5;}
float focusK(vec2 uv,vec4 f){if(f.w<=0.)return 0.;float d=length((uv-f.xy)*vec2(AR,1.));return f.w*smoothstep(f.z,f.z+.3,d);}
vec4 cF(sampler2D C,vec2 cu,float fk){vec4 a=tx(C,cu,0.);if(fk<=.002)return a;return mix(a,tx(C,cu,2.+fk*2.),fk);}
vec3 bloom(sampler2D C,vec2 cu){return tx(C,cu,2.).rgb*.25+tx(C,cu,3.5).rgb*.35+tx(C,cu,5.).rgb*.45;}
vec3 unp(vec4 c){return c.rgb/max(c.a,1e-3);}
vec3 rgb2hsv(vec3 c){vec4 K=vec4(0.,-1./3.,2./3.,-1.);vec4 p=mix(vec4(c.bg,K.wz),vec4(c.gb,K.xy),step(c.b,c.g));vec4 q=mix(vec4(p.xyw,c.r),vec4(c.r,p.yzx),step(p.x,c.r));float d=q.x-min(q.w,q.y);return vec3(abs(q.z+(q.w-q.y)/(6.*d+1e-10)),d/(q.x+1e-10),q.x);}
vec3 vor(vec2 x){vec2 n=floor(x),f=fract(x);float d1=8.,d2=8.;vec2 id=vec2(0.);for(int j=-1;j<=1;j++)for(int i=-1;i<=1;i++){vec2 g=vec2(float(i),float(j));vec2 o=vec2(h1(n+g),h1(n+g+17.3));vec2 r=g+o-f;float d=dot(r,r);if(d<d1){d2=d1;d1=d;id=n+g;}else if(d<d2)d2=d;}return vec3(sqrt(d2)-sqrt(d1),h1(id),h1(id+5.));}
const vec3 P8[16]=vec3[16](vec3(0.),vec3(.114,.169,.325),vec3(.494,.145,.325),vec3(0.,.529,.318),vec3(.671,.322,.212),vec3(.373,.341,.31),vec3(.761,.765,.78),vec3(1.,.945,.91),vec3(1.,0.,.302),vec3(1.,.639,0.),vec3(1.,.925,.153),vec3(0.,.894,.212),vec3(.161,.678,1.),vec3(.514,.463,.612),vec3(1.,.467,.659),vec3(1.,.8,.667));
const float BY[16]=float[16](0.,8.,2.,10.,12.,4.,14.,6.,3.,11.,1.,9.,15.,7.,13.,5.);
float bayer(vec2 g){ivec2 i=ivec2(mod(g,4.));return (BY[i.x+i.y*4]+.5)/16.;}
vec3 quant(vec3 c){float bd=1e9;vec3 b=c;for(int i=0;i<16;i++){vec3 d=c-P8[i];float e=dot(d*d,vec3(.3,.59,.11));if(e<bd){bd=e;b=P8[i];}}return b;}
vec3 over(vec3 bg,vec4 c){return bg*(1.-c.a)+c.rgb;}

vec3 look(float id,sampler2D C,sampler2D X,vec4 P,vec4 cam,vec4 fo,vec2 uv){
  float t=uT;vec2 p=(uv-.5)*vec2(AR,1.);
  vec2 cu=camUV(uv,cam);float fk=focusK(uv,fo);
  vec3 col;vec4 c;vec4 ty;
  if(id<.5){ // 虚空终端
    col=vec3(.012,.013,.017)+vec3(.10,.055,.03)*P.x*exp(-length(p)*2.2)+vec3(.03,.02,.05)*P.y*fbm3(p*2.+t*.05);
    c=cF(C,cu,fk);col=over(col,c)+bloom(C,cu)*.6*uFx;col*=1.-.5*fk;
    ty=tx(X,uv,0.);col=over(col,ty)+tx(X,uv,3.).rgb*.22*uFx;
  }else if(id<1.5){ // 梦：流体、虹彩，P.x 流动 P.y 结晶 P.z 虹彩
    float tt=t*.07;
    vec2 q=vec2(fbm(p*1.5+vec2(0.,tt)),fbm(p*1.5+vec2(5.2,1.3)-tt));
    vec2 r=vec2(fbm(p*1.5+q*3.2+vec2(1.7,9.2)+tt*.8),fbm(p*1.5+q*3.2+vec2(8.3,2.8)-tt*.6));
    float f=fbm(p*1.7+r*2.6);
    vec3 ir=dpal(f*1.3+r.x*.8+tt*.5);
    vec3 deep=mix(vec3(.04,.015,.09),vec3(.09,.02,.14),uv.y);
    col=mix(deep,ir*.5,smoothstep(.35,.92,f)*.75)+vec3(1.,.7,.95)*pow(smoothstep(.62,1.,f),3.)*.25;
    if(P.y>0.){vec3 v=vor(p*9.+vec2(0.,.3));vec3 fc=mix(vec3(.035,.06,.13),vec3(.12,.2,.38),v.y*.85)+vec3(.65,.82,1.)*smoothstep(.03,0.,v.x)*.3;col=mix(col,fc,P.y);}
    vec2 wp=(vec2(fbm3(cu*3.+vec2(0.,t*.35)),fbm3(cu*3.+vec2(4.1,-t*.3)))-.5)*.07*P.x;
    c=cF(C,cu+wp,fk);vec3 cc=mix(c.rgb,c.rgb*(.55+ir*.9),P.z*.55);
    col=col*(1.-c.a)+cc+bloom(C,cu+wp)*.75*uFx;col*=1.-.5*fk;
    vec2 tw=wp*.1;ty=tx(X,uv+tw,0.);col=over(col,ty)+tx(X,uv+tw,3.).rgb*.25*uFx;
  }else if(id<2.5){ // 轨道：深空 + 上下文光圈，P.xy 圆心 P.z 半径 P.w 圈外可见度
    col=vec3(.006,.008,.02);
    vec2 pp=p+cam.zw*vec2(AR,1.)*.3;
    float n=fbm(pp*1.3+vec2(t*.008,0.));
    col+=mix(vec3(.10,.05,.25),vec3(.0,.17,.24),fbm3(pp*2.2+3.))*smoothstep(.42,.95,n)*.85;
    for(int L=0;L<2;L++){float sc=L==0?18.:42.;vec2 g=pp*sc+float(L)*31.;vec2 ce=floor(g);vec2 f=fract(g)-.5;float h=h1(ce);
      if(h>.9){vec2 o=(vec2(h1(ce+1.),h1(ce+2.))-.5)*.6;float tw=.6+.4*sin(t*(1.+h*3.)+h*40.);col+=vec3(.85,.9,1.)*smoothstep(.07,0.,length(f-o))*tw*(L==0?1.:.55);}}
    c=cF(C,cu,fk);
    float d=length((uv-P.xy)*vec2(AR,1.));float m=P.z>0.?smoothstep(P.z+.012,P.z-.02,d):1.;
    float k=mix(P.w,1.,m);
    col+=vec3(.45,.75,1.)*exp(-pow((d-P.z)*160.,2.))*step(.0,P.z)*step(.5,fract(atan(uv.y-P.y,(uv.x-P.x)*AR)*9.549+t*.4))*.7;
    col+=vec3(.25,.4,.7)*exp(-d/(P.z+.001)*2.)*.06*step(.001,P.z);
    col=col*(1.-c.a*k)+c.rgb*k+bloom(C,cu)*.65*uFx*k;col*=1.-.5*fk;
    ty=tx(X,uv,0.);col=over(col,ty)+tx(X,uv,3.).rgb*.2*uFx;
  }else if(id<3.5){ // 印刷：riso 双色，P.x 错版 P.y 套印鬼影
    vec2 px=uv*vec2(1920.,1080.);
    vec3 paper=vec3(.955,.93,.875)*(.965+.045*(vn(px*vec2(.9,.25))*.5+vn(px*vec2(.25,.9))*.5));
    paper*=1.-.035*smoothstep(.55,.85,fbm3(uv*5.));
    vec2 o=vec2(.0024,.0016)*(P.x+.3*sin(floor(t*2.)*1.7));
    c=tx(C,cu,0.);vec4 c2=tx(C,cu+o*1.8,1.);
    vec3 ink=unp(c);
    float ang=.26;mat2 R=mat2(cos(ang),sin(ang),-sin(ang),cos(ang));vec2 g=fract(R*px/7.)-.5;
    float a=c.a>.93?c.a:smoothstep(sqrt(c.a)*.64+.07,sqrt(c.a)*.64-.07,length(g))*step(.03,c.a);
    a*=.86+.14*vn(px*.35);
    col=paper*mix(vec3(1.),ink,a);
    col*=mix(vec3(1.),vec3(1.,.5,.74),c2.a*.3*P.y);
    ty=tx(X,uv+o*.35,0.);float at=ty.a*(.9+.1*vn(px*.5));col*=mix(vec3(1.),unp(ty),at);
    col*=.975+.05*h1(floor(px/2.)+floor(t*12.));col*=1.-.35*fk;
  }else if(id<4.5){ // 纸：剪纸分层 + 定格抖动，P.x 抖动 P.y 远景纸层
    vec2 px=uv*vec2(1920.,1080.);
    vec2 j=(vec2(h1(vec2(floor(t*12.),1.)),h1(vec2(floor(t*12.),2.)))-.5)*.0016*P.x;
    vec3 base=vec3(.94,.9,.82);col=base;
    vec3 PC[4]=vec3[4](vec3(.86,.83,.74),vec3(.62,.76,.66),vec3(.37,.6,.6),vec3(.9,.55,.44));
    for(int i=0;i<4;i++){float fi=float(i);float lv=1.-P.y*(.42-fi*.09)+.035*sin(uv.x*3.1+fi*1.9+t*.05)+.03*(fbm3(vec2(uv.x*3.+fi*3.1,fi))-.5);
      float sh=smoothstep(lv-.035,lv,uv.y)*step(uv.y,lv);col*=1.-.22*sh;if(uv.y>lv)col=PC[i];}
    col*=.95+.05*(vn(px*vec2(1.1,.3))*.6+vn(px*.08)*.4);
    float sh=tx(C,cu+j-vec2(.0035,.0075),2.5).a;col*=1.-.38*sh;
    c=tx(C,cu+j,0.);col=col*(1.-c.a)+c.rgb*(.94+.06*vn(px*.7));col*=1.-.4*fk;
    float st=tx(X,uv+j-vec2(.0025,.005),2.).a;col*=1.-.32*st;
    ty=tx(X,uv+j,0.);col=over(col,ty);
  }else if(id<5.5){ // 霓虹：合成波，P.x 太阳 P.y 网格速度 P.z 网格亮度
    float hz=.62;
    col=mix(vec3(.025,.0,.06),vec3(.17,.0,.28),smoothstep(.0,hz,uv.y));
    col+=vec3(.9,.8,1.)*step(.996,h1(floor(uv*vec2(900.,500.))))*step(uv.y,hz-.1)*.5;
    float sx=P.w>0.?P.w:.5;float sd=length((uv-vec2(sx,.47))*vec2(AR,1.));float sm=smoothstep(.215,.205,sd)*step(uv.y,hz);
    float sk=(uv.y-.27)/.35;vec3 sun=mix(vec3(1.,.86,.25),vec3(1.,.16,.52),clamp(sk,0.,1.));
    float cut=step(.47,uv.y)*step(fract((uv.y-.47)*30.),clamp((uv.y-.47)*4.5,0.,.85));
    col=mix(col,sun,sm*(1.-cut)*P.x);col+=vec3(1.,.25,.6)*exp(-max(sd-.2,0.)*9.)*.25*P.x*step(uv.y,hz);
    if(uv.y>hz){float dy=uv.y-hz;float z=.35/dy;float xw=(uv.x-.5)*AR*z;float zz=z+t*P.y*2.;
      float wx=.012*z+.004,wz=.03*z;
      float gl=max(smoothstep(wx,0.,abs(fract(xw*.6)-.5)/.6),smoothstep(wz,0.,abs(fract(zz*.5)-.5)/.5));
      float fade=exp(-z*.12);col=mix(vec3(.04,.0,.08),vec3(.1,.0,.14),dy*3.);
      col+=mix(vec3(1.,.2,.7),vec3(.2,.9,1.),smoothstep(0.,.3,dy))*gl*fade*(P.z+uBeat*.6);}
    col+=vec3(1.,.3,.8)*exp(-abs(uv.y-hz)*90.)*.5;
    float ab=.0007+uBeat*.0012;
    c=cF(C,cu,fk);vec4 cr=tx(C,cu+vec2(ab,0.),0.),cb=tx(C,cu-vec2(ab,0.),0.);
    vec3 cc=vec3(cr.r,c.g,cb.b);float ca=max(c.a,max(cr.a,cb.a));
    col=col*(1.-ca)+cc+(tx(C,cu,2.5).rgb*.2+tx(C,cu,4.).rgb*.3+tx(C,cu,5.5).rgb*.45)*uFx;col*=1.-.45*fk;
    ty=tx(X,uv,0.);col=over(col,ty)+(tx(X,uv,3.).rgb*.15+tx(X,uv,4.5).rgb*.25)*uFx;
    col*=.93+.07*sin(uv.y*uRes.y*3.1416);
  }else if(id<6.5){ // 蓝图：描边，P.x 填充量
    vec2 px=uv*vec2(1920.,1080.);
    col=mix(vec3(.05,.19,.43),vec3(.08,.26,.53),fbm3(uv*2.5))*(1.-.3*dot(p,p));
    vec2 g1=abs(fract(px/24.-.5)-.5)*24.,g2=abs(fract(px/120.-.5)-.5)*120.;
    col+=vec3(.6,.8,1.)*((1.-smoothstep(0.,1.1,min(g1.x,g1.y)))*.07+(1.-smoothstep(0.,1.4,min(g2.x,g2.y)))*.14);
    col*=.96+.04*vn(px*.6);
    vec2 e=vec2(1.6/1920.,1.6/1080.);
    float a00=tx(C,cu+vec2(-e.x,-e.y),0.).a,a10=tx(C,cu+vec2(0.,-e.y),0.).a,a20=tx(C,cu+vec2(e.x,-e.y),0.).a;
    float a01=tx(C,cu+vec2(-e.x,0.),0.).a,a21=tx(C,cu+vec2(e.x,0.),0.).a;
    float a02=tx(C,cu+vec2(-e.x,e.y),0.).a,a12=tx(C,cu+vec2(0.,e.y),0.).a,a22=tx(C,cu+vec2(e.x,e.y),0.).a;
    float gx=a20+2.*a21+a22-a00-2.*a01-a02,gy=a02+2.*a12+a22-a00-2.*a10-a20;
    float ed=clamp(length(vec2(gx,gy))*.9,0.,1.);
    c=cF(C,cu,fk);vec3 hv=rgb2hsv(unp(c));vec3 lc=mix(vec3(.9,.96,1.),unp(c),smoothstep(.25,.6,hv.y));
    col=mix(col,lc,ed)+lc*c.a*P.x*.55+tx(C,cu,3.).a*vec3(.5,.75,1.)*.12*uFx;col*=1.-.45*fk;
    ty=tx(X,uv,0.);col=over(col,ty)+tx(X,uv,3.).rgb*.15*uFx;
  }else if(id<7.5){ // 像素：PICO-8 调色板 + 抖动，P.x 内容像素 P.y 卷轴 P.z 字像素
    float cell=max(P.x,1.);vec2 RS=vec2(1920.,1080.);
    vec2 g=floor(cu*RS/cell),q=(g+.5)*cell/RS;float lod=max(0.,log2(cell*uRes.y/1080.)-.5);
    vec2 gs=floor(uv*RS/cell),uq=(gs+.5)*cell/RS;float by=bayer(gs);
    float sky=uq.y+(by-.5)*.1;
    vec3 bg=sky<.3?P8[0]:sky<.5?P8[1]:sky<.68?P8[13]*.55+P8[1]*.45:P8[2];
    bg=quant(bg);
    if(h1(gs)>.988&&uq.y<.5)bg=step(.5,fract(t*.7+h1(gs+3.)))>.5?P8[7]:P8[6];
    float x1=uq.x+t*P.y*.01,x2=uq.x+t*P.y*.025;
    float hh1=.66+.05*sin(x1*6.)+.025*sin(x1*17.+1.),hh2=.77+.04*sin(x2*9.+2.)+.02*sin(x2*23.);
    if(uq.y>hh1)bg=P8[1];if(uq.y>hh2)bg=P8[0];
    c=tx(C,q,lod);float a=step(by*.86+.07,c.a);vec3 rgb=quant(unp(c)+(by-.5)*.12);
    col=mix(bg,rgb,a);col*=1.-.45*fk;
    float ct=max(P.z,1.);vec2 gt=floor(uv*RS/ct),qt=(gt+.5)*ct/RS;
    ty=tx(X,qt,max(0.,log2(ct*uRes.y/1080.)-.5));col=mix(col,unp(ty),step(.42,ty.a));
    col*=.9+.1*pow(sin(uv.y*uRes.y*1.5708),2.);
  }else if(id<8.5){ // 黑色电影：黑白 + 红橙点缀，P.x 点缀保留 P.y 百叶窗光
    vec2 wv=(vec2(h1(vec2(floor(t*24.),3.)),h1(vec2(floor(t*24.),5.)))-.5)*.0016;
    cu+=wv;vec2 u2=uv+wv;
    float g0=.05+.045*fbm3(uv*2.2+1.);
    float band=smoothstep(.42,.5,fract((uv.x*.55+uv.y)*8.5+.2))*smoothstep(1.,.92,fract((uv.x*.55+uv.y)*8.5+.2));
    float lm=exp(-length((uv-vec2(.74,.36))*vec2(AR,1.)*1.25)*1.7)*P.y;
    col=vec3(g0+band*lm*.32+lm*.04);
    c=cF(C,cu,fk);vec3 rgb=unp(c);vec3 hv=rgb2hsv(rgb);float gr=smoothstep(.03,.88,lum(rgb));
    float ak=P.x*smoothstep(.35,.55,hv.y)*smoothstep(.3,.5,hv.z)*max(step(hv.x,.1),step(.93,hv.x));
    vec3 cc=mix(vec3(gr),rgb*1.08,ak);
    col=col*(1.-c.a)+cc*c.a;col+=vec3(lum(tx(C,cu,3.5).rgb))*.18*uFx;col*=1.-.55*fk;
    ty=tx(X,u2,0.);vec3 tr=unp(ty),th=rgb2hsv(tr);float ak2=P.x*smoothstep(.35,.55,th.y)*max(step(th.x,.1),step(.93,th.x));
    col=col*(1.-ty.a)+mix(vec3(lum(tr)),tr,ak2)*ty.a;
    col+=(h1(uv*uRes+fract(t*24.)*91.)-.5)*.12*uFx;
    float x0=h1(vec2(floor(t*24.),9.));col+=.22*step(.72,h1(vec2(floor(t*24.),11.)))*exp(-abs(uv.x-x0)*uRes.x*.9)*vn(vec2(uv.y*30.,floor(t*24.)));
    col*=.95+.05*h1(vec2(floor(t*24.),13.));
    col*=1.-.9*pow(length((uv-.5)*vec2(1.1,1.)),2.2);
  }else if(id<9.5){ // 警报：红色故障，P.x 故障 P.y 脉冲 P.z 转青 P.w 保留原色
    vec3 ac=mix(vec3(1.,.12,.17),vec3(.2,.95,.82),P.z);
    col=mix(vec3(.025,.004,.008),vec3(.004,.022,.026),P.z)+ac*.16*P.y*(.5+.5*uBeat)*exp(-length(p)*1.3);
    col+=ac*.05*step(.5,fract(uv.y*60.+t*2.))*(1.-P.z)*.5;
    float bs=floor(t*16.);float rows=mix(10.,44.,h1(vec2(bs,1.)));float row=floor(uv.y*rows);
    vec2 gu=cu;if(h1(vec2(row,bs))<P.x*.38)gu.x+=(h1(vec2(row,bs+3.))-.5)*.16*P.x;
    float ab=.0025+.006*P.x;
    c=cF(C,gu,fk);vec4 cr=tx(C,gu+vec2(ab,0.),0.),cb=tx(C,gu-vec2(ab,0.),0.);
    vec3 rgb=vec3(unp(cr).r,unp(c).g,unp(cb).b);float a=max(c.a,max(cr.a*.8,cb.a*.8));float l=lum(unp(c));
    vec3 duo=mix(ac*l*1.35,vec3(1.,.96,.95),smoothstep(.72,1.,l));
    vec3 cc=mix(duo,rgb,P.w);
    col=col*(1.-a)+cc*a+mix(ac*lum(bloom(C,gu))*1.4,bloom(C,gu),P.w)*.6*uFx;col*=1.-.5*fk;
    ty=tx(X,uv,0.);vec4 tr=tx(X,uv+vec2(ab*.4,0.),0.);col=col*(1.-ty.a)+vec3(tr.r,ty.g,ty.b);
    col*=.9+.1*sin(uv.y*uRes.y*3.1416);
  }else if(id<10.5){ // 回声：干净深色 + 光谱余晖
    col=vec3(.022,.022,.03);
    for(int i=0;i<3;i++){float fi=float(i);col+=pal(uv.x*.45+t*.025+fi*.23)*exp(-pow((uv.y-.15-fi*.07-.06*sin(uv.x*2.6+t*.15+fi*2.))*7.,2.))*.07*P.x;}
    c=cF(C,cu,fk);col=over(col,c)+bloom(C,cu)*.55*uFx;col*=1.-.5*fk;
    ty=tx(X,uv,0.);col=over(col,ty)+tx(X,uv,3.).rgb*.2*uFx;
  }else{ // 电影：现实里的戏。P.x 曝光 P.y 冷暖（0 冷 1 暖）P.z 暗角 P.w 光晕和颗粒
    float ca=.0016*uFx*(.4+length(p));vec2 dc=(uv-.5)*ca;
    c=cF(C,cu,fk);vec3 b0=over(vec3(.006,.008,.012),c);
    b0.r=over(vec3(.006),cF(C,cu+dc,fk)).r;b0.b=over(vec3(.012),cF(C,cu-dc,fk)).b;
    float l=lum(b0);
    vec3 cool=vec3(.80,.97,1.10),warm=vec3(1.12,.98,.80);
    b0*=mix(cool,warm,clamp(P.y,0.,1.));
    b0=mix(b0,b0*vec3(.86,1.,1.06)+vec3(.0,.012,.018),smoothstep(.35,0.,l)*.6);
    b0*=.7+.6*P.x;
    b0+=bloom(C,cu)*.42*P.w*uFx;
    b0=b0/(1.+b0*.18);
    b0*=1.-P.z*smoothstep(.25,1.1,length(p*vec2(.82,1.15)));
    b0+=(h1(gl_FragCoord.xy*.71+fract(uT*13.)*91.)-.5)*.035*P.w*uFx;
    col=b0*(1.-.45*fk);
    ty=tx(X,uv,0.);col=over(col,ty)+tx(X,uv,3.).rgb*.12*uFx;
  }
  return col;
}
float tmask(vec2 uv,float k,float kind,vec4 tp,out vec3 ec,out float ea){
  ec=uTC.rgb;ea=0.;float live=step(.001,k)*step(k,.999);
  if(kind<.5)return step(.5,k);
  if(kind<1.5){float x=k*1.14-.07,w=.04;ea=step(x,uv.x)*step(uv.x,x+w)*live;return step(uv.x,x);}
  if(kind<2.5){vec2 g=floor(uv*vec2(48.,27.));float hc=h1(g+3.1);ea=step(abs(hc-k),.04)*live*.85;return step(hc,k);}
  if(kind<3.5){float d=length((uv-tp.xy)*vec2(AR,1.)),R=k*2.15;ea=exp(-pow((d-R)*55.,2.))*live;return step(d,R);}
  if(kind<4.5){float pos=uv.x+(uv.y-.5)*.22+(fbm3(vec2(uv.y*14.,3.))-.5)*.07;float th=k*1.45-.22;
    ec=vec3(.98,.96,.91);ea=step(th,pos)*step(pos,th+.012+.008*vn(vec2(uv.y*90.,1.)))*live;return step(pos,th);}
  if(kind<5.5){float d=length((uv-tp.xy)*vec2(AR,1.));float n=fbm(uv*vec2(AR,1.)*3.2)*.55+d*.62;float th=k*1.55;
    ec=pal(n*1.6+uT*.15)*1.2;ea=smoothstep(.07,0.,abs(n-th+.035))*live;return smoothstep(th,th-.045,n);}
  if(kind<6.5){float row=floor(uv.y*30.);float s=h1(vec2(row,floor(uT*24.)));ea=step(abs(s-k),.035)*live;return step(s,k*1.12-.06);}
  if(kind<7.5){float n=fbm(uv*vec2(AR,1.)*4.)*.7+length((uv-tp.xy)*vec2(AR,1.))*.4;float th=k*1.35;
    ec=mix(vec3(1.,.32,.04),vec3(1.,.92,.55),smoothstep(.05,0.,n-th));ea=smoothstep(.06,0.,n-th)*step(th,n)*live*1.6;return step(n,th);}
  return smoothstep(.45,.55,k);
}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;uv.y=1.-uv.y;
  vec3 col=look(uLA,uCA,uTA,uPA,uCamA,uFoA,uv);
  if(uMix>0.){
    vec3 ec;float ea;float m=tmask(uv,uMix,uTK,uTP,ec,ea);
    if(m>0.){vec3 cb=look(uLB,uCB,uTB,uPB,uCamB,uFoB,uv);col=mix(col,cb,m);}
    col=mix(col,ec,clamp(ea,0.,1.));
  }
  col=mix(col,vec3(1.),uFlash);
  float lb=uBox*.12;if(uv.y<lb||uv.y>1.-lb)col=vec3(0.);
  vec4 hd=tx(uHud,uv,0.);col=col*(1.-hd.a)+hd.rgb;
  col+=(h1(gl_FragCoord.xy+fract(uT*7.)*100.)-.5)*.018*uFx;
  oc=vec4(clamp(col,0.,1.),1.);
}`;
const UNI = ['uRes', 'uT', 'uBeat', 'uMix', 'uTK', 'uLA', 'uLB', 'uFx', 'uBox', 'uFlash', 'uPA', 'uPB', 'uCamA', 'uCamB', 'uFoA', 'uFoB', 'uTP', 'uTC'];
const TEX = ['uCA', 'uTA', 'uCB', 'uTB', 'uHud'];
const GLR = {
  init() {
    if (this.ok !== undefined) return this.ok;
    this.layers = TEX.map(() => document.createElement('canvas'));
    try {
      const cv = document.createElement('canvas');
      const gl = cv.getContext('webgl2', { preserveDrawingBuffer: true, antialias: false, premultipliedAlpha: false });
      if (!gl) throw new Error('WebGL2 不可用');
      const sh = (t, src) => { const s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const a = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      this.tex = TEX.map((n, i) => {
        const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.uniform1i(gl.getUniformLocation(pr, n), i); return t;
      });
      this.loc = {}; UNI.forEach(k => this.loc[k] = gl.getUniformLocation(pr, k));
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      this.gl = gl; this.cv = cv; this.ok = true;
    } catch (e) { console.warn('着色器不可用，改用普通合成：', e.message); this.ok = false; this.cv = document.createElement('canvas'); }
    return this.ok;
  },
  ctx(i, res) {
    const c = this.layers[i];
    if (c.width !== res[0]) { c.width = res[0]; c.height = res[1]; }
    const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height);
    x.setTransform(res[0] / W, 0, 0, res[1] / H, 0, 0); x.globalAlpha = 1; x.filter = 'none'; x.shadowBlur = 0; return x;
  },
  render(res, u, used) {
    const cv = this.cv;
    if (cv.width !== res[0]) { cv.width = res[0]; cv.height = res[1]; }
    if (!this.ok) {
      const x = cv.getContext('2d'); x.fillStyle = '#0b0b0e'; x.fillRect(0, 0, cv.width, cv.height);
      [0, 1, 4].forEach(i => x.drawImage(this.layers[i], 0, 0)); return cv.toDataURL('image/jpeg', .9);
    }
    const gl = this.gl, L = this.loc;
    gl.viewport(0, 0, cv.width, cv.height);
    this.tex.forEach((t, i) => { if (!used[i]) return; gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.layers[i]); gl.generateMipmap(gl.TEXTURE_2D); });
    gl.uniform2f(L.uRes, cv.width, cv.height);
    for (const k of UNI) { if (k === 'uRes') continue; const v = u[k]; if (typeof v === 'number') gl.uniform1f(L[k], v); else gl.uniform4f(L[k], v[0], v[1], v[2], v[3]); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return cv.toDataURL('image/jpeg', .9);
  },
};

// ---------- 世界、时间表 ----------
const MODS = new Map();
function worlds() {
  const R = window.MV_W || {};
  return Object.keys(R).sort().map(id => {
    const c = MODS.get(id);
    if (c && c.build === R[id]) return c.mod;
    const mod = { id, ...R[id](K) }; MODS.set(id, { build: R[id], mod }); return mod;
  });
}
// 分段文件只带自己的段落；其余段落按世界模块里的小节数补齐，画面和音乐按全片时间计算
function fullCues(Cs, total) {
  const all = worlds().map(m => ({ name: m.scene, dur: m.bars * BAR }));
  const at = all.findIndex(s => s.name in Cs);
  if (at <= 0) return { C: Cs, total, off: 0 };
  const r = x => Math.round(x * 1000) / 1000, out = {};
  let t = 0;
  for (let i = 0; i < at; i++) { out[all[i].name] = r(t); t += all[i].dur; }
  const off = r(t);
  for (const k of Object.keys(Cs)) out[k] = r(off + Cs[k]);
  t = off + total;
  for (let i = at; i < all.length; i++) { const s = all[i]; if (!(s.name in Cs)) { out[s.name] = r(t); t += s.dur; } }
  return { C: out, total: r(t), off };
}
function makePlan(Cs, total) {
  const ws = worlds().map(m => ({ m, start: Cs[m.scene] })).filter(x => typeof x.start === 'number' && isFinite(x.start)).sort((a, b) => a.start - b.start);
  ws.forEach((w, i) => { w.i = i; w.end = i + 1 < ws.length ? ws[i + 1].start : total; });
  const rules = ws.filter(w => w.m.rule).map(w => { const t = w.start + w.m.rule.at * BAR; return { n: w.m.rule.n, text: w.m.rule.text, t, end: w.m.rule.len ? Math.min(w.end, t + w.m.rule.len * BAR) : w.end, w }; });
  return { ws, total, rules };
}
function local(w, T) {
  const t = T - w.start, b = t / BAR, bt = t / BEAT;
  return { T, t, b, bt, w, bars: w.m.bars, p: (b0, b1, e) => prog(b, b0, b1, e), in: (b0, b1) => b >= b0 && b < b1,
    hit: (b0, d = .5) => b >= b0 ? Math.exp(-(b - b0) / d * 4) : 0, beat: Math.exp(-((bt % 1 + 1) % 1) * 5), barPh: ((b % 1) + 1) % 1 };
}
function pickWorlds(P, T) {
  const ws = P.ws; let i = 0;
  while (i + 1 < ws.length && T >= ws[i + 1].start) i++;
  const cur = ws[i], nx = ws[i + 1];
  const tin = w => { const e = w.m.enter || { kind: TR.CUT, a: 0, b: 0 }; return [w.start - (e.a || 0) * BEAT, w.start + (e.b ?? 0) * BEAT, e]; };
  if (i > 0) { const [a, b, e] = tin(cur); if (T < b && b > a) return { A: ws[i - 1], B: cur, k: prog(T, a, b, E.lin), e }; }
  if (nx) { const [a, b, e] = tin(nx); if (T >= a && b > a) return { A: cur, B: nx, k: prog(T, a, b, E.lin), e }; }
  return { A: cur, B: null, k: 0, e: null };
}
const val = (f, L, d) => typeof f === 'function' ? f(L) : f ?? d;
function worldU(w, T, tw) {
  const L = local(w, T), m = w.m;
  const cam = (val(m.cam, L, [1, 0, 0, 0])).slice();
  const pu = val(m.pulse, L, 0) * (tw.fx ?? 1);
  cam[0] *= 1 + .014 * pu * L.beat;
  return { look: val(m.look, L, 0), par: val(m.par, L, [0, 0, 0, 0]), cam, fo: val(m.focus, L, [.5, .5, 1, 0]), box: val(m.lb, L, 0), flash: val(m.flash, L, 0), L };
}

// ---------- HUD：章节号、规则横幅、清单格、来源 ----------
function drawHud(ctx, T, P, cur, k) {
  const w = cur, m = w.m, L = local(w, T), h = m.hud || {};
  const ink = (typeof h.ink === 'function' ? h.ink(L) : h.ink) || C.ink, dim = h.dim || rgba(ink, .55);
  // 章节卡：开场是「时间 + 你的一句话」，随后换成左上角的章节号和时间
  if (h.num && h.time) {
    const mv = h.mv || [.7, 1.05], kin = h.small ? 1 : prog(L.b, 0, .3), kmv = h.small ? 1 : prog(L.b, mv[0], mv[1], E.io), kout = prog(T, w.end - .6, w.end - .1);
    const a = (1 - kout) * (1 - k), acc = h.acc || C.clawd;
    if (kmv < 1 && kin > 0) alpha(ctx, a * kin * (1 - kmv), () => {
      const [cx0, cy0] = h.card || [150, 400], y0 = cy0 - kmv * 40;
      txt(ctx, h.time, cx0, y0, fnt(700, 140, F.mono), acc);
      if (h.line) txt(ctx, '「' + h.line + '」', cx0 - 12, y0 + 128, fnt(900, 70, F.sans), ink);
      txt(ctx, h.num + ' · ' + h.name, cx0 + 4, y0 + 214, fnt(400, 30, F.sans), dim);
    });
    if (kmv > 0) alpha(ctx, a * kmv, () => {
      txt(ctx, h.num, 70, 66, fnt(700, 24, F.mono), acc);
      const nx = 70 + tw(ctx, h.num, fnt(700, 24, F.mono)) + 14;
      txt(ctx, h.name, nx, 66, fnt(500, 26, F.sans), ink);
      txt(ctx, h.time, nx + tw(ctx, h.name, fnt(500, 26, F.sans)) + 18, 67, fnt(400, 22, F.mono), dim);
    });
  } else if (h.num) {
    const mv = h.mv || [.7, 1.05], kin = h.small ? 1 : prog(L.b, 0, .35), kmv = h.small ? 1 : prog(L.b, mv[0], mv[1], E.io), kout = prog(T, w.end - .6, w.end - .1);
    const a = kin * (1 - kout) * (1 - k);
    if (a > 0) alpha(ctx, a, () => {
      const x = lerp(150, 70, kmv), y = lerp(430, 66, kmv), s1 = lerp(150, 24, kmv), s2 = lerp(64, 26, kmv);
      ctx.textBaseline = 'middle';
      txt(ctx, h.num, x, y, fnt(700, s1, F.mono), h.acc || C.clawd);
      const nx = x + tw(ctx, h.num, fnt(700, s1, F.mono)) + lerp(36, 14, kmv);
      txt(ctx, h.name, nx, y + lerp(-s1 * .16, 0, kmv), fnt(lerp(700, 500, kmv), s2, F.sans), ink);
      if (h.world && kmv < 1) alpha(ctx, 1 - kmv, () => txt(ctx, '「' + h.world + '」', nx, y + s1 * .42, fnt(400, 30, F.sans), dim));
    });
  }
  // 你：右上角的对话气泡（所有世界样式不变）
  for (const [at, out, text] of m.you || []) {
    if (L.b < at - .02 || L.b > out + .2) continue;
    const kin = prog(L.b, at, at + .1, E.out), kout = prog(L.b, out, out + .15, E.in), nt = youType(text), n = Math.floor(prog(L.b, at + .06, at + .06 + nt, E.lin) * text.length + 1e-6);
    ctx.save(); ctx.globalAlpha *= kin * (1 - kout) * (1 - k * .8);
    ctx.font = fnt(500, 34, F.sans); const tw0 = ctx.measureText(text).width, hh = 76, bw = tw0 + 150, x = 1850 - bw, y = 118 - (1 - kin) * 16 - kout * 20;
    rr(ctx, x, y, bw, hh, 22, 'rgba(16,17,22,.95)', 'rgba(255,255,255,.22)', 2);
    ctx.fillStyle = 'rgba(16,17,22,.95)'; ctx.beginPath(); ctx.moveTo(x + bw - 50, y + hh - 1.5); ctx.lineTo(x + bw - 14, y + hh + 20); ctx.lineTo(x + bw - 26, y + hh - 1.5); ctx.fill();
    rr(ctx, x + 18, y + 18, 54, 40, 10, C.clawd); txt(ctx, '你', x + 45, y + 39, fnt(900, 26, F.sans), '#1a0f0a', 'center');
    txt(ctx, text.slice(0, n), x + 92, y + hh / 2 + 1, fnt(500, 34, F.sans), '#f4f1ea');
    if (n < text.length || Math.floor(L.bt * 2) % 2 === 0) { ctx.font = fnt(500, 34, F.sans); ctx.fillStyle = C.clawd; ctx.fillRect(x + 96 + ctx.measureText(text.slice(0, n)).width, y + 20, 4, 36); }
    ctx.restore();
  }
  // 来源
  for (const [b0, b1, s] of m.src || []) {
    const a = prog(L.b, b0, b0 + .3) * (1 - prog(L.b, b1 - .3, b1)) * (1 - k);
    if (a > 0) alpha(ctx, a, () => txt(ctx, '来源：' + s, 1850, 1040, fnt(400, 20, F.mono), dim, 'right'));
  }
  // 清单格
  const got = P.rules.filter(r => T >= r.t), showInv = P.rules.length && got.length && !m.noInv;
  if (showInv) {
    const last = got[got.length - 1], kf = prog(T, last.t + 1.1, last.t + 1.5, E.back);
    alpha(ctx, (1 - k * .6), () => {
      const x0 = 1850 - 8 * 26 + 8, y = 58;
      txt(ctx, '清单', x0 - 16, y + 8, fnt(500, 20, F.sans), dim, 'right');
      for (let i = 0; i < 8; i++) {
        const has = got.some(r => r.n === i + 1), fresh = last.n === i + 1, x = x0 + i * 26;
        if (has && !(fresh && kf <= 0)) { const s = fresh ? lerp(1.8, 1, kf) : 1; scaleAt(ctx, x + 9, y + 9, s, () => rr(ctx, x, y, 18, 18, 3, C.clawd)); }
        else rr(ctx, x + 1, y + 1, 16, 16, 3, null, rgba(ink, .35), 2);
      }
    });
  }
  // 规则横幅
  const r = P.rules.find(x => x.w === w);
  if (r && T >= r.t - .05 && !m.noBanner) {
    const kb = prog(T, r.t, r.t + .35, E.out), ko = prog(T, r.end - .5, r.end - .05, E.in), kt = prog(T, r.t + .15, r.t + .9, E.lin);
    if (kb > 0 && ko < 1) {
      ctx.save(); ctx.globalAlpha = 1 - ko;
      ctx.font = fnt(700, 42, F.sans); const tw0 = ctx.measureText(r.text).width, bw = tw0 + 260, x = 960 - bw / 2, y = 922;
      rr(ctx, x, y, bw * kb, 92, 14, 'rgba(10,10,13,.94)', rgba(C.clawd, .9), 2);
      ctx.fillStyle = C.clawd; ctx.fillRect(x + 26, y + 22, 18, 48);
      if (kb > .8) {
        txt(ctx, `规则 ${r.n}/8`, x + 64, y + 46, fnt(700, 22, F.mono), C.clawd);
        const n = Math.floor(kt * r.text.length);
        txt(ctx, r.text.slice(0, n), x + 196, y + 47, fnt(700, 42, F.sans), '#f4f1ea');
        const fly = prog(T, r.t + .95, r.t + 1.35, E.io);
        if (fly > 0 && fly < 1) { const tx = 1850 - 8 * 26 + 8 + (r.n - 1) * 26 + 9; rr(ctx, lerp(x + 35, tx, fly) - 9, lerp(y + 46, 67, fly) - 9, 18, 18, 3, C.clawd); }
      }
      ctx.restore();
    }
  }
}

// ---------- 帧 ----------
const RES = { '流畅': [960, 540], '高': [1600, 900], '原生': [1920, 1080] };
function renderFrame(T, P, tw, fv, res) {
  GLR.init();
  const pk = pickWorlds(P, T), uA = worldU(pk.A, T, tw), uB = pk.B ? worldU(pk.B, T, tw) : null;
  const dw = (w, ci, ti, L) => {
    const cx = GLR.ctx(ci, res), tx = GLR.ctx(ti, res); cx.textBaseline = tx.textBaseline = 'middle'; w.m.draw(cx, tx, L, fv);
    // 3D 层：世界没在 draw 里手动叠，就叠在内容层最上面（文字层仍在它之上）
    if (w.m.three && !L.did3d && window.MV_3D) window.MV_3D.draw(cx, w.m, L);
  };
  dw(pk.A, 0, 1, uA.L);
  if (uB) dw(pk.B, 2, 3, uB.L);
  const curW = pk.B && pk.k >= .5 ? pk.B : pk.A;
  drawHud(GLR.ctx(4, res), T, P, curW, pk.B ? bump(pk.k, .5, .28) : 0);

  const e = pk.e || {}, ex = e.p || [.5, .5, 0, 0], ec = hex(e.col || '#d97757').map(v => v / 255);
  let flash = Math.max(uA.flash, uB ? uB.flash : 0);
  if (pk.B && (e.kind === TR.FLASH || e.flash)) flash = Math.max(flash, bump(pk.k, .5, .16) * (e.flash ?? 1));
  const fx = tw.fx ?? 1, box = uB ? lerp(uA.box, uB.box, pk.k) : uA.box;
  const u = {
    uT: T, uBeat: uA.L.beat * fx, uMix: pk.B ? pk.k : 0, uTK: e.kind ?? 0, uLA: uA.look, uLB: uB ? uB.look : 0, uFx: fx, uBox: box, uFlash: flash * Math.min(1, fx),
    uPA: uA.par, uPB: uB ? uB.par : [0, 0, 0, 0], uCamA: uA.cam, uCamB: uB ? uB.cam : [1, 0, 0, 0], uFoA: uA.fo, uFoB: uB ? uB.fo : [.5, .5, 1, 0],
    uTP: ex, uTC: [...ec, 1],
  };
  return GLR.render(res, u, [1, 1, !!uB, !!uB, 1]);
}
function Frame({ T, P, tw, fv }) {
  const res = RES[tw.quality] || RES['流畅'];
  // three.js 晚到时（暂停状态下）重画一次当前帧
  const [k3, setK3] = useState(0);
  useEffect(() => { const f = () => setK3(k => k + 1); window.addEventListener('mv3d-ready', f); return () => window.removeEventListener('mv3d-ready', f); }, []);
  const url = useMemo(() => renderFrame(T, P, tw, fv, res), [T, res[0], P, fv, tw.fx, k3]);
  return <img src={url} alt="" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, display: 'block' }} />;
}

// ---------- 音轨：音乐模块分块离线渲染 ----------
// 有 window.__mvAudio（单文件预览）就用 Web Audio 逐块播放；否则拼成一条 WAV 放进 <video>，编辑器导出时会带上声音
function sfxList(P) {
  const ev = [];
  for (const w of P.ws) for (const s of w.m.sfx || []) ev.push([w.start + s[0] * BAR, ...s.slice(1)]);
  for (const w of P.ws) for (const [at, , text] of w.m.you || []) { const nt = youType(text); [...text].forEach((ch, i) => { if (ch !== ' ') ev.push([w.start + (at + .06 + (i + .5) * nt / text.length) * BAR, 'key', .8]); }); ev.push([w.start + at * BAR, 'blip', 660]); }
  for (const r of P.rules) ev.push([r.t, 'rule']);
  return ev;
}
function toWav(ch, sr) {
  const n = ch[0].length, v = new DataView(new ArrayBuffer(44 + n * 4));
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + n * 4, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 2, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 4, true); v.setUint16(32, 4, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 4, true);
  for (let i = 0, o = 44; i < n; i++, o += 4) { v.setInt16(o, Math.max(-1, Math.min(1, ch[0][i])) * 32767, true); v.setInt16(o + 2, Math.max(-1, Math.min(1, ch[1][i])) * 32767, true); }
  return new Blob([v.buffer], { type: 'audio/wav' });
}
function useMusic(P, T0, dur, opt) {
  const [chunks, setChunks] = useState([]);
  useEffect(() => {
    let live = true; setChunks([]);
    const M = window.MV_MUSIC; if (!M || !(opt.sfx || opt.bgm)) return;
    const job = M.job(P, sfxList(P), T0, dur, opt);
    job.run(c => { if (live) setChunks(job.done.slice()); });
    return () => { live = false; job.cancel(); };
  }, [P, T0, dur, opt]);
  return chunks;
}
function AudioWeb({ chunks, T0 }) {
  const { time, playing } = useComposition();
  const st = useRef({ srcs: [], at: 0, off: 0, n: 0 });
  const stop = () => { st.current.srcs.forEach(s => { try { s.stop(); } catch (e) {} }); st.current.srcs = []; };
  useEffect(() => {
    const ac = window.__mvAudio, s = st.current;
    if (!ac || !playing || !chunks.length) { stop(); return; }
    const now = ac.currentTime, pos = s.off + (now - s.at);
    if (s.srcs.length && s.n === chunks.length && Math.abs(pos - time) < .25) return;
    stop();
    const out = ac.__mvOut || (ac.__mvOut = (() => { const g = ac.createGain(), c = ac.createDynamicsCompressor(); c.threshold.value = -4; c.knee.value = 4; c.ratio.value = 12; c.attack.value = .002; c.release.value = .2; g.connect(c); c.connect(ac.destination); return g; })());
    for (const c of chunks) {
      const a = c.t0 - T0, b = a + c.buf.duration;
      if (b <= time) continue;
      const src = ac.createBufferSource(); src.buffer = c.buf; src.connect(out);
      if (a >= time) src.start(now + (a - time) + .02); else src.start(now + .02, time - a);
      s.srcs.push(src);
    }
    Object.assign(s, { at: now + .02, off: time, n: chunks.length });
  }, [time, playing, chunks]);
  useEffect(() => stop, []);
  return null;
}
function AudioVideo({ chunks, total, dur, T0 }) {
  const { time, playing } = useComposition();
  const ref = useRef(null);
  const url = useMemo(() => {
    if (!chunks.length || chunks.length < total) return null;
    const sr = chunks[0].buf.sampleRate, n = Math.ceil((dur + .5) * sr), ch = [new Float32Array(n), new Float32Array(n)];
    for (const c of chunks) { const o = Math.round((c.t0 - T0) * sr); for (let k = 0; k < 2; k++) { const d = c.buf.getChannelData(k); for (let i = Math.max(0, -o); i < d.length && i + o < n; i++) ch[k][i + o] += d[i]; } }
    for (const x of ch) for (let i = 0; i < n; i++) { const v = x[i]; if (v > .8 || v < -.8) x[i] = Math.sign(v) * (.8 + .2 * Math.tanh((Math.abs(v) - .8) / .2)); }
    return URL.createObjectURL(toWav(ch, sr));
  }, [chunks, total]);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    if (playing) { if (Math.abs(v.currentTime - time) > .25) v.currentTime = time; if (v.paused) v.play().catch(() => {}); }
    else { if (!v.paused) v.pause(); if (Math.abs(v.currentTime - time) > .04) v.currentTime = time; }
  }, [time, playing, url]);
  if (!url) return null;
  return <video key={url} ref={ref} src={url} playsInline preload="auto" data-om-exportable-video-play-start="0" data-om-exportable-video-play-end={dur}
    style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />;
}
function AudioTrack({ P, T0, dur, opt }) {
  const chunks = useMusic(P, T0, dur, opt);
  const total = window.MV_MUSIC ? window.MV_MUSIC.count(P, T0, dur) : 0;
  return window.__mvAudio ? <AudioWeb chunks={chunks} T0={T0} /> : <AudioVideo chunks={chunks} total={total} dur={dur} T0={T0} />;
}

// ---------- 工具包：传给世界模块 ----------
// ---------- 叙事：按阅读速度排时间 ----------
// 一场戏的台词写成步骤表，按字数算每句停多久，排出每一步的起止小节；画面按名字取时间（S.t('id')）。
// 步骤：id；say（Clawd 的字幕）、big（画面大字，可带 sub）、you / me（对话：你 / Clawd）、
// gloss（词条卡 [词, 英文, 解释]）、src（来源）、rule（规则条 [n, 文字]）、note（只给画面用的标记）；
// pause（空几小节）、hold（多停几小节）、dur（直接给长度）、with（和上一步同时开始，off 偏移）、
// gap（之后空多少）、until / untilEnd（显示到某一步开始 / 结束）、slow（阅读时间倍数）。
const READ = { cps: 4, min: 2.2, pad: 1 };
const PUNCT = /^[，。、；：！？—…「」“”‘’（）·,.;:!?()《》\-]$/;
function readLen(s) {
  let n = 0;
  for (const m of String(s).replace(/[‹›«»\n]/g, '').matchAll(/[A-Za-z0-9_.+#@/%$']+|[^\s]/g)) {
    const w = m[0];
    n += /^[㐀-鿿]$/.test(w) ? 1 : PUNCT.test(w) ? .3 : Math.min(4, 1 + w.length * .12);
  }
  return n;
}
const readBars = (s, slow = 1) => Math.ceil(Math.max(READ.min, readLen(s) / READ.cps * slow + READ.pad) / BAR * 4) / 4;
function seq(steps, o = {}) {
  const at = {}, end = {}, items = [];
  let c = o.start ?? 0, prev = c;
  for (const s0 of steps) {
    const s = typeof s0 === 'string' ? { say: s0 } : s0;
    if (s.pause !== undefined && !s.say && !s.big) { if (s.id) { at[s.id] = c; end[s.id] = c + s.pause; } c += s.pause; prev = c; continue; }
    const st = s.with ? prev + (s.off || 0) : s.at ?? c;
    const t = [s.say, s.big, s.sub, s.you, s.me, s.gloss && s.gloss.slice(1).join(' '), s.rule && s.rule[1]].filter(Boolean).join(' ');
    let d = s.dur ?? (t ? readBars(t, s.slow) : 1);
    if (s.you && s.dur === undefined) d += youType(s.you);
    if (s.me && s.dur === undefined) d += .5; // 「对方正在输入」
    d += s.hold || 0;
    const it = { ...s, at: st, out: st + d };
    items.push(it);
    if (s.id) { at[s.id] = st; end[s.id] = st + d; }
    prev = st;
    if (!s.with) c = Math.max(c, st + d + (s.gap ?? 0)); else if (s.extend) c = Math.max(c, st + d);
  }
  const bars = Math.ceil(c + (o.tail ?? .75));
  for (const it of items) {
    if (it.until) it.out = at[it.until] ?? it.out;
    if (it.untilEnd) it.out = end[it.untilEnd] ?? it.out;
    if (it.keep) it.out = bars + 1;
    it.srcOut = it.srcUntil ? at[it.srcUntil] ?? it.out : it.out;
  }
  // 词条卡：没写 until 就留到下一张词条卡出现（最多 12 小节）
  const gl = items.filter(i => i.gloss);
  gl.forEach((g, i) => { if (!g.until && !g.untilEnd && !g.dur) g.out = Math.min(gl[i + 1] ? gl[i + 1].at : bars, g.at + 12); });
  const text = items.map(i => [i.say, i.big, i.sub, i.you, i.me, i.gloss && i.gloss.join(''), i.rule && i.rule[1], i.src].filter(Boolean).join('')).join('');
  return { at, end, items, bars, text, t: id => at[id] ?? 0, e: id => end[id] ?? 0 };
}
// 把带强调符号的文字按宽度折行（中文按字断，标点不放行首）
function wrapText(ctx, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '', w = 0, mark = '';
    const toks = [...para];
    for (let i = 0; i < toks.length; i++) {
      const ch = toks[i];
      if ('‹›«»'.includes(ch)) { line += ch; mark = ch === '‹' || ch === '«' ? ch : ''; continue; }
      const cwid = cw(ctx, ch);
      if (w + cwid > maxW && line && !PUNCT.test(ch)) {
        const close = mark === '‹' ? '›' : mark === '«' ? '»' : '';
        out.push(line + close); line = mark; w = 0;
      }
      line += ch; w += cwid;
    }
    out.push(line);
  }
  return out.join('\n');
}
// 一场戏里的字：字幕（say）、大字（big + sub）、词条卡（gloss）。st 是这个世界的版式
const SUB0 = { fam: F.sans, size: 44, w: 700, col: '#f6f3ee', acc: [C.num, '#9fd8ff'], y: 972, maxW: 1500, lh: 1.42, shadow: 'rgba(0,0,0,.85)', box: null };
function narrate(ctx, L, S, st = {}) {
  const sub = { ...SUB0, ...(st.sub || {}) }, b = L.b;
  for (const it of S.items) {
    if (b < it.at - .02 || b > it.out + .6) continue;
    if (it.say && !it.big) {
      ctx.font = fnt(sub.w, sub.size, sub.fam);
      const txt0 = wrapText(ctx, it.say, it.maxW || sub.maxW), n = txt0.split('\n').length, lh = sub.lh * sub.size;
      const y = (it.y ?? sub.y) - (n - 1) * lh / 2 - (n > 1 ? lh / 2 : 0);
      ctx.save();
      if (sub.shadow) { ctx.shadowColor = sub.shadow; ctx.shadowBlur = 14; ctx.shadowOffsetY = 2; }
      lyric(ctx, L, { at: it.at, out: it.out, outLen: .12, text: txt0, x: it.x ?? 960, y, size: sub.size, fam: sub.fam, w: sub.w, col: it.col || sub.col, acc: sub.acc, align: it.align || 'center', anim: 'fade', d: .1, rev: .12, lh: sub.lh, box: sub.box ? [16, sub.box, 10] : undefined });
      ctx.restore();
    }
    if (it.big) {
      const bg = { x: 960, y: 470, size: 96, w: 900, col: '#ffffff', align: 'center', anim: 'rise', st: .1, ...(st.big || {}), ...(it.bigS || {}) };
      if (it.x !== undefined) bg.x = it.x; if (it.y !== undefined) bg.y = it.y;
      ctx.font = fnt(bg.w, bg.size, bg.fam || F.sans);
      const t1 = it.nowrap ? it.big : wrapText(ctx, it.big, bg.maxW || 1600);
      const box = lyric(ctx, L, { ...bg, at: it.at, out: it.out, text: t1 });
      if (it.sub) {
        const sb = { size: 38, w: 500, col: rgba(bg.col.startsWith('#') ? bg.col : '#ffffff', .78), anim: 'fade', ...(st.bigSub || {}) };
        const nl = t1.split('\n').length;
        lyric(ctx, L, { ...sb, x: bg.x, align: bg.align, at: it.at + .2, out: it.out, text: it.sub, y: bg.y + bg.size * (bg.lh || 1.28) * (nl / 2) + sb.size * .9 + (it.subGap || 0) });
      }
    }
    if (it.gloss) glossCard(ctx, L, it, st.gloss || {});
  }
}
// 词条卡：左上角滑进来的一张小卡片，词 + 英文 + 一句解释
function glossCard(ctx, L, it, g) {
  const [term, en, def] = it.gloss, b = L.b;
  const k = prog(b, it.at, it.at + .3, E.out), ko = prog(b, it.out - .25, it.out, E.in);
  if (k <= 0 || ko >= 1) return;
  const x = (it.gx ?? g.x ?? 80), y = (it.gy ?? g.y ?? 150), wd = g.w || 660, fam = g.fam || F.sans;
  const bg = g.bg || 'rgba(12,13,18,.82)', ink = g.ink || '#f4f1ea', acc = g.acc || C.clawd, dim = g.dim || rgba(ink, .62);
  ctx.save(); ctx.globalAlpha *= k * (1 - ko); ctx.translate(-(1 - k) * 40, 0);
  ctx.font = fnt(500, 30, fam);
  const lines = wrapText(ctx, def || '', wd - 64).split('\n'), hh = 96 + lines.length * 44;
  rr(ctx, x, y, wd, hh, 14, bg, g.border || rgba(ink, .16), 2);
  ctx.fillStyle = acc; ctx.fillRect(x, y + 14, 6, hh - 28);
  txt(ctx, term, x + 32, y + 46, fnt(900, 40, fam), ink);
  if (en) txt(ctx, en, x + 40 + tw(ctx, term, fnt(900, 40, fam)), y + 49, fnt(400, 24, F.mono), dim);
  lines.forEach((l, i) => txt(ctx, l.replace(/[‹›«»]/g, ''), x + 32, y + 104 + i * 44, fnt(500, 30, fam), rgba(ink, .9)));
  ctx.restore();
}
// 一场戏：把步骤表接到模块上（字幕、气泡、规则、来源、字体预载都从这里来）
function scene(m, S) {
  const you = S.items.filter(i => i.you && !m.chat).map(i => [i.at, i.out, i.you]);
  const r = S.items.find(i => i.rule);
  const src = S.items.filter(i => i.src).map(i => [i.at, i.srcOut, i.src]);
  return { ...m, bars: m.bars ?? S.bars, S, cue: S.at, you: [...(m.you || []), ...you], src: [...(m.src || []), ...src],
    rule: r ? { n: r.rule[0], at: r.at, len: r.out - r.at, text: r.rule[1] } : m.rule,
    text: (m.text || '') + S.text };
}

// ---------- 时间伸缩：给已有的世界加停顿 ----------
// knots = [[新小节, 原小节], ...]，分段线性；斜率 0 的一段就是「停住」（画面按原时间冻结在那一刻，背景动态和节拍照常）。
// 返回包好的模块：draw/画风参数/3D 都按原时间算，音效、来源、气泡、规则按新时间排。
function warpWorld(m, knots, bars) {
  const kn = knots.slice().sort((a, b) => a[0] - b[0]);
  const f = n => {
    if (n <= kn[0][0]) return n - kn[0][0] + kn[0][1];
    for (let i = 0; i + 1 < kn.length; i++) { const [n0, o0] = kn[i], [n1, o1] = kn[i + 1]; if (n < n1) return o0 + (o1 - o0) * (n - n0) / (n1 - n0); }
    const [nl, ol] = kn[kn.length - 1]; return ol + n - nl;
  };
  const inv = o => {
    if (o <= kn[0][1]) return o - kn[0][1] + kn[0][0];
    for (let i = 0; i + 1 < kn.length; i++) { const [n0, o0] = kn[i], [n1, o1] = kn[i + 1]; if (o1 > o0 && o >= o0 && o < o1) return n0 + (n1 - n0) * (o - o0) / (o1 - o0); if (o1 === o0 && o === o0) return n0; }
    const [nl, ol] = kn[kn.length - 1]; return nl + o - ol;
  };
  const WL = L => {
    if (L.warped) return L;
    const b = f(L.b), nb = L.b;
    // 冲击类衰减按真实时间走，停住时不会卡在半亮
    return { ...L, b, nb, warped: true, p: (b0, b1, e) => prog(b, b0, b1, e), in: (b0, b1) => b >= b0 && b < b1, hit: (b0, d = .5) => { const n0 = inv(b0); return nb >= n0 ? Math.exp(-(nb - n0) / d * 4) : 0; } };
  };
  const wf = x => typeof x === 'function' ? L => x(WL(L)) : x;
  const r = { ...m, bars, warpF: f, warpInv: inv,
    draw: (cx, tx, L, fv) => { const W2 = WL(L); m.draw(cx, tx, W2, fv); if (W2.did3d) L.did3d = true; },
    par: wf(m.par), cam: wf(m.cam), focus: wf(m.focus), look: wf(m.look), lb: wf(m.lb), pulse: wf(m.pulse), flash: wf(m.flash),
    sfx: (m.sfx || []).map(([b, ...x]) => [inv(b), ...x]), src: (m.src || []).map(([b0, b1, ...x]) => [inv(b0), inv(b1), ...x]),
    you: (m.you || []).map(([a, o, ...x]) => [inv(a), inv(o), ...x]) };
  if (m.rule) r.rule = { ...m.rule, at: inv(m.rule.at) };
  if (m.three) r.three = (T, U) => { const s = m.three(T, U); return { ...s, update: (L, c, u) => s.update(WL(L), c, u) }; };
  return r;
}

const K = { W, H, BPM, BEAT, BAR, F, C, E, LOOK, TR, clamp01, prog, lerp, bump, hash, hex, mixC, rgba, fnt, cw, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha,
  lyric, typeSfx, marks, clawd, clawdCells, hop, clawdAt, sing,
  warpWorld, seq, narrate, scene, wrapText, readBars, glossCard, youType,
  three: (ctx, L, o) => { L.did3d = true; return !!window.MV_3D && window.MV_3D.draw(ctx, L.w.m, L, o); } };
window.MV_K = K;

function Piece({ tw }) {
  const { T: Tp, CUES, authoredTotal } = useComposition();
  const fc = useMemo(() => fullCues(CUES, authoredTotal), [CUES, authoredTotal]);
  const P = useMemo(() => makePlan(fc.C, fc.total), [fc]);
  window.__mvPlan = P;
  const T = Tp + fc.off;
  const [fv, setFv] = useState(0);
  const opt = useMemo(() => ({ sfx: tw.sfx !== false, bgm: tw.bgm !== false, vol: tw.bgmVol ?? .8 }), [tw.sfx, tw.bgm, tw.bgmVol]);
  useEffect(() => {
    const text = P.ws.map(w => (w.m.text || '') + (w.m.hud ? w.m.hud.name + (w.m.hud.world || '') + (w.m.hud.line || '') + (w.m.hud.time || '') : '') + (w.m.rule ? w.m.rule.text : '') + (w.m.you || []).map(y => y[2]).join('')).join('') + '来源：规则清单你 0123456789/%+-.:「」' + SING.flat().map(x => x[1]).join('');
    const loads = [];
    for (const [fam, ws] of FONT_LOADS) for (const wt of ws) loads.push(document.fonts.load(fnt(wt, 40, fam), text).catch(() => {}));
    Promise.all(loads).then(() => document.fonts.ready).then(() => { CWC.clear(); setFv(v => v + 1); });
  }, [P]);
  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden', background: '#000' }}>
      <Frame T={T} P={P} tw={tw} fv={fv} />
      <AudioTrack P={P} T0={fc.off} dur={authoredTotal} opt={opt} />
    </div>
  );
}
function MVApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, sfx: true, bgm: true, bgmVol: .8, quality: '流畅', fx: 1 });
  return (
    <>
      <CompositionStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#000">
        <Piece tw={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="时间轴" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakSection label="声音" />
        <TweakToggle label="音乐" value={t.bgm} onChange={v => setTweak('bgm', v)} />
        <TweakToggle label="音效" value={t.sfx} onChange={v => setTweak('sfx', v)} />
        <TweakSlider label="音量" value={t.bgmVol} min={0} max={1} step={.05} onChange={v => setTweak('bgmVol', v)} />
        <TweakSection label="画面" />
        <TweakRadio label="渲染分辨率" value={t.quality} options={['流畅', '高', '原生']} onChange={v => setTweak('quality', v)} />
        <TweakSlider label="特效强度" value={t.fx} min={0} max={1.5} step={.05} onChange={v => setTweak('fx', v)} />
      </TweaksPanel>
    </>
  );
}
window.MVApp = MVApp;
