const { useMemo, useRef, useEffect, useState } = React;
const W = 1920, H = 1080, AR = W / H;
const COL = { bg: '#131417', card: '#1b1c21', line: '#2e3139', text: '#e6e8ee', dim: '#9aa0ab', faint: '#5d626c',
  kw: '#c792ea', str: '#a5d67a', fn: '#7cb7ff', num: '#f2a65a', type: '#5fd4c8', err: '#f07178', vari: '#9cdcfe',
  clawd: '#d97757', clawdHi: '#e8957a', eye: '#1d1210' };
const SANS = '"Noto Sans SC", "PingFang SC", sans-serif';
const MONO = '"JetBrains Mono", "Noto Sans SC", monospace';
const font = (w, s, fam = SANS) => `${w} ${s}px ${fam}`;
const MOTION = { enter: Easing.easeOutCubic, draw: Easing.easeInOutCubic, pop: Easing.easeOutBack };
const prog = (T, s, e, ease = MOTION.enter) => ease(clamp((T - s) / (e - s), 0, 1));
const lerp = (a, b, k) => a + (b - a) * k;
const bump = (T, t, w) => Math.exp(-Math.pow((T - t) / w, 2));
const hash = x => { const s = Math.sin(x * 127.1 + 3.7) * 43758.5453; return s - Math.floor(s); };
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const mixC = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
const rgba = (h, a) => `rgba(${hex(h).join(',')},${a})`;
const heat = p => p < .5 ? mixC(COL.str, COL.num, p / .5) : mixC(COL.num, COL.err, (p - .5) / .5);

// ---------- 内容 ----------
const Q1 = 'I call "vibe coding", where you fully give in to the vibes, embrace exponentials, and forget that the code even exists.';
const Q1_TR = '我称之为 vibe coding：完全顺着感觉走，拥抱指数级增长，忘掉代码的存在。';
const Q2 = "It's not too bad for throwaway weekend projects";
const Q2_TR = '用来做用完就扔的周末小项目，还不错。';
const CODE_TOK = [
  [['if', COL.kw], [' (', COL.text], ['reviewed', COL.vari], [' && ', COL.type], ['tested', COL.vari], [' && ', COL.type], ['canExplain', COL.vari], [') {', COL.text]],
  [['  ', COL.text], ['return', COL.kw], [' ', COL.text], ['"正常写程序"', COL.str], [';', COL.text]],
];
const CODE = CODE_TOK.map(l => l.map(t => t[0]).join(''));
const CONDS = [['reviewed', '审过'], ['tested', '测过'], ['canExplain', '能讲清']];
const AX = { x0: 260, x1: 1660, y: 560 };
const TICKS = [{ k: '作业', x: .45 }, { k: '给别人用', x: .72 }, { k: '上线', x: 1 }];
const SCENE_TEXT = Q1_TR + Q2_TR + '需要注意的细节信息截至年月第章什么是助教柯林斯词典年度词审过测过能讲清正常写程序算不上用多久给谁用用完就扔的小玩具作业给别人用上线贯穿全片给图书管理系统加登录功能来源？';

function plan(C, end) {
  const S = C['片头'], I = C['自我介绍'], P = C['帖子'], Y = C['年度词'], J = C['界线'], A = C['项目轴'], K = C['贯穿任务'];
  end = end || K + 11;
  const ty = {
    sub: { s: S + 3.0, cps: 10, text: '需要注意的细节' },
    date: { s: S + 3.7, cps: 34, text: '// 信息截至 2026 年 10 月' },
    chName: { s: I + 2.0, cps: 16, text: '什么是 vibe coding' },
    q1: { s: P + 7.3, cps: 30, text: Q1 },
    q2: { s: P + 14.6, cps: 28, text: Q2 },
    cm: { s: J + .4, cps: 34, text: '// Simon Willison 的界线' },
    c1: { s: J + 1.2, cps: 34, text: CODE[0] },
    c2: { s: J + 2.5, cps: 22, text: CODE[1] },
    c3: { s: J + 3.4, cps: 20, text: '}' },
    c2b: { s: J + 8.9, cps: 22, text: '  // 算不上 vibe coding' },
    task: { s: K + 3.3, cps: 16, text: '给图书管理系统加登录功能' },
  };
  const tm = { S, I, P, Y, J, A, K, end,
    blink1: S + .7, blink2: S + 1.1, asm: S + 1.4, hop: S + 2.15, build: S + 1.95, boom: I - .75,
    wave: I + .3, tag: I + .7, dots: I + 1.3,
    card: P + .5, hl1: P + 11.8, tr1: P + 12.0, term: P + 12.8, hl2: P + 16.6, tr2: P + 17.0, nod: P + 21,
    shift: Y + .2, book: Y + .6, qb: Y + 1.4, open: Y + 3.6, stamp: Y + 5.4,
    chk: [J + 5.2, J + 5.7, J + 6.2], ret: J + 8.0,
    axis: A + .5, axTitle: A + 1.0, left: A + 3.4, ticks: A + 5.0, push0: A + 4.9, push1: A + 7.6, danger: A + 8.6,
    back0: K + .4, back1: K + 2.2, taskIn: K + 2.6, pinJump: K + 5.0, pin: K + 5.6, land: K + 6.0, right: K + 6.3, bye: K + 8.4,
    off: end - .9,
  };
  const caps = [
    [I + .2, I + 4.8, '嗨，我是 Clawd，这门课的 AI 助教。今天聊聊 vibe coding。'],
    [P + .3, P + 7.0, '这个词是 Andrej Karpathy 在 2025 年 2 月发帖提出来的，他是 OpenAI 的联合创始人之一。'],
    [P + 7.0, P + 14.0, '他的玩法是：只用大白话告诉 AI 要什么，顺着感觉走，代码长什么样都不管了。'],
    [P + 14.0, P + 21.0, '不过他在同一条帖子里就说了，这么干适合周末随手做、用完就扔的小项目。'],
    [Y + .2, Y + 6.4, '后来这个词火到什么程度？同年 11 月，柯林斯词典把它选成了年度词。'],
    [J + .2, J + 3.6, '程序员 Simon Willison 给了一条很实用的界线：'],
    [J + 3.6, J + 11.3, 'AI 写的代码，只要你审过、测过、能讲清它怎么工作，那就是正常写程序，算不上 vibe coding。'],
    [A + .2, A + 3.3, '所以关键看项目要用多久、给谁用。'],
    [A + 3.3, A + 8.6, '左边是玩完就扔的小玩具，右边是作业、给别人用的程序、上线的服务。'],
    [A + 8.6, A + 11.8, '越往右，越不能光凭感觉。'],
    [K + .2, K + 6.3, '接下来我拿一个任务从头演示：给课程作业里的图书管理系统加个登录功能。'],
    [K + 6.3, K + 10.0, '这活儿在轴的右边，后面每一章都用得上。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const bounds = [[P, 'dis'], [J, 'fluid'], [A, 'dis']];
  const cam = [
    [S, 2.7, .1, -.04, 0, 0, .06], [S + 4.2, 1.62, -.03, -.02, 0, 0, .02], [I + .2, 1.3, .08, 0, 0, 0, 0],
    [I + 2.2, 1.58, .12, .03, 0, 0, 0], [I + 4.6, 1.54, .06, .02, 0, 0, 0],
    [P + .6, 1.6, -.1, .03, 0, 0, 0], [P + 7, 1.48, -.04, .02, 0, -.05, .05], [P + 14, 1.48, .02, .02, 0, -.05, .02],
    [P + 21, 1.5, 0, .02, 0, -.03, 0], [P + 27, 1.5, .16, .06, -.012, 0, 0],
    [Y + .9, 1.62, .03, 0, 0, 0, 0], [Y + 7.5, 1.55, -.04, 0, 0, .04, 0],
    [J + .6, 1.56, .1, .02, 0, 0, 0], [J + 11.5, 1.48, -.06, .02, 0, 0, 0],
    [A + .6, 1.6, 0, .02, 0, 0, 0], [A + 2.8, 1.38, .36, .1, 0, 0, .06], [A + 11.6, 1.4, .24, .12, 0, 0, .06],
    [K + 2.8, 1.48, .06, .08, 0, 0, .06], [K + 9.6, 1.42, .1, .06, 0, 0, .04],
  ];
  return { ty, tm, caps, bounds, cam };
}
const typedN = (T, d) => clamp(Math.floor((T - d.s) * d.cps), 0, d.text.length);
const typingOn = (T, d, tail = .5) => T >= d.s && T < d.s + d.text.length / d.cps + tail;
const blink = T => Math.floor(T * 2.4) % 2 === 0;
function sliderPos(T, tm) {
  if (T < tm.K) return prog(T, tm.push0, tm.push1, MOTION.draw);
  return lerp(1, TICKS[0].x, prog(T, tm.back0, tm.back1, MOTION.draw));
}
const sliderX = (T, tm) => AX.x0 + (AX.x1 - AX.x0) * sliderPos(T, tm);

// ---------- Canvas 2D 小工具 ----------
function fsOf(ctx) { return parseFloat(ctx.font.match(/(\d+(\.\d+)?)px/)[1]); }
function drawTyped(ctx, T, d, x, y, color, cursor, cursorColor = COL.kw) {
  const n = typedN(T, d), s = d.text.slice(0, n);
  ctx.fillStyle = color; ctx.fillText(s, x, y);
  if (cursor && (typingOn(T, d, 0) || blink(T))) {
    const fs = fsOf(ctx); ctx.fillStyle = cursorColor;
    ctx.fillRect(x + ctx.measureText(s).width + fs * .06, y - fs * .52, fs * .55, fs * 1.04);
  }
  return n;
}
function drawTokens(ctx, T, d, tokens, x, y, glow = 0) {
  let left = typedN(T, d), cx = x;
  for (const [s, c] of tokens) {
    const part = s.slice(0, clamp(left, 0, s.length)); left -= s.length;
    if (!part) break;
    const w = ctx.measureText(part).width;
    if (glow > 0 && c === COL.str) { ctx.fillStyle = rgba(COL.str, .16 * glow); ctx.fillRect(cx - 6, y - 34, w + 12, 68); }
    ctx.fillStyle = glow > 0 && c === COL.str ? mixC(COL.str, '#f4ffe8', glow * .7) : c;
    ctx.fillText(part, cx, y); cx += w;
  }
  return cx;
}
function cursorAt(ctx, x, y, color = COL.kw) { const fs = fsOf(ctx); ctx.fillStyle = color; ctx.fillRect(x + fs * .06, y - fs * .52, fs * .55, fs * 1.04); }
function wrapWords(ctx, text, maxW) {
  const lines = []; let a = 0, last = 0;
  for (let i = 0; i <= text.length; i++) {
    if (i === text.length || text[i] === ' ') {
      if (ctx.measureText(text.slice(a, i)).width > maxW && last > a) { lines.push([a, last]); a = last + 1; }
      last = i;
    }
  }
  lines.push([a, text.length]); return lines;
}
function wrapChars(ctx, text, maxW) {
  const out = []; let cur = '';
  for (const ch of text) { if (ctx.measureText(cur + ch).width > maxW && cur) { out.push(cur); cur = ch; } else cur += ch; }
  if (cur) out.push(cur); return out;
}
function wrapCap(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return [text];
  const mid = text.length / 2; let best = -1, bs = 1e9;
  for (let i = 1; i < text.length - 1; i++) {
    const ch = text[i - 1], good = '，。：；？、'.includes(ch) ? 0 : ch === ' ' ? 4 : 1e3;
    const sc = Math.abs(i - mid) + good;
    if (sc < bs && ctx.measureText(text.slice(0, i)).width <= maxW && ctx.measureText(text.slice(i)).width <= maxW) { bs = sc; best = i; }
  }
  return best > 0 ? [text.slice(0, best).trim(), text.slice(best).trim()] : wrapChars(ctx, text, maxW);
}
function drawPara(ctx, text, n, x, y, lh, maxW, marks, color, caretColor, showCaret) {
  const lines = wrapWords(ctx, text, maxW);
  let cx = x, cy = y;
  lines.forEach(([a, b], i) => {
    const ly = y + i * lh, e = Math.min(b, n);
    for (const m of marks) {
      const s0 = Math.max(m.a, a), s1 = Math.min(m.b, e);
      if (m.k <= 0 || s1 <= s0) continue;
      const px = x + ctx.measureText(text.slice(a, s0)).width, pw = ctx.measureText(text.slice(s0, s1)).width;
      ctx.fillStyle = rgba(m.c, .22 * m.k); ctx.fillRect(px - 3, ly - lh * .42, pw + 6, lh * .84);
      ctx.fillStyle = rgba(m.c, m.k); ctx.fillRect(px - 3, ly + lh * .36, pw + 6, 4);
    }
    if (e > a) { ctx.fillStyle = color; ctx.fillText(text.slice(a, e), x, ly); }
    if (n >= a && (n <= b || i === lines.length - 1)) { cx = x + ctx.measureText(text.slice(a, clamp(n, a, b))).width; cy = ly; }
  });
  if (showCaret) cursorAt(ctx, cx, cy, caretColor);
  return lines.length;
}
function popScale(ctx, cx, cy, s, fn) { ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy); fn(); ctx.restore(); }
const DOTS = new Map();
function dotsFor(text, size, step, weight, fam, ver) {
  const key = [text, size, step, weight, fam, ver].join('|');
  if (DOTS.has(key)) return DOTS.get(key);
  const c = document.createElement('canvas'), x = c.getContext('2d'), fs = size / step;
  x.font = font(weight, fs, fam);
  const w = Math.ceil(x.measureText(text).width) + 4, h = Math.ceil(fs * 1.35);
  c.width = w; c.height = h; x.font = font(weight, fs, fam); x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(text, 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data, pts = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 110) pts.push([i * step, (j - h / 2) * step]);
  const r = { pts, w: w * step }; DOTS.set(key, r); return r;
}

// ---------- Clawd：像素小人 ----------
function drawClawd(ctx, st) {
  const { x, y, px } = st;
  if (px <= 0 || st.alpha <= 0) return;
  const cells = [];
  for (let r = 0; r < 6; r++) for (let c = 2; c < 10; c++) cells.push([c, r, r === 0 ? COL.clawdHi : COL.clawd]);
  const ph = st.ph || 0, on = Math.sin(ph) > 0;
  const L = [[0, 3], [1, 3]];
  let R = [[10, 3], [11, 3]];
  if (st.pose === 'wave') R = on ? [[10, 2], [11, 1], [11, 0]] : [[10, 3], [11, 2], [12, 1]];
  if (st.pose === 'up') R = [[10, 3], [10, 2], [10, 1], [10, 0]];
  if (st.pose === 'push') R = [[10, 3], [11, 3], [12, 3]];
  if (st.pose === 'point') R = [[10, 3], [11, 2], [12, 1]];
  let LL = L;
  if (st.pose === 'cover') { LL = [[1, 3], [1, 2]]; R = [[10, 3], [10, 2]]; }
  if (st.pose === 'type') { LL = on ? [[1, 4], [1, 5]] : [[1, 3], [1, 4]]; R = on ? [[10, 3], [10, 4]] : [[10, 4], [10, 5]]; }
  if (st.pose === 'push') LL = [[1, 3]];
  [...LL, ...R].forEach(([c, r]) => cells.push([c, r, COL.clawd]));
  if (st.pose === 'cover') [[2, 2], [3, 2], [3, 3], [8, 2], [8, 3], [9, 2]].forEach(([c, r]) => cells.push([c, r, COL.clawdHi]));
  const legs = [[2, 0], [4, 1], [7, 0], [9, 1]];
  const wk = st.walk >= 0 ? (Math.sin(st.walk) > 0 ? 0 : 1) : -1;
  for (const [c, g] of legs) { cells.push([c, 6, COL.clawd]); if (wk !== g) cells.push([c, 7, COL.clawd]); }
  const sq = st.squash || 1, sxk = 1 / Math.sqrt(sq);
  const pos = (c, r) => [x + (c - 6) * px * sxk, y - (8 - r) * px * sq];
  ctx.save(); ctx.globalAlpha = st.alpha;
  const asm = st.asm;
  cells.forEach(([c, r, col], i) => {
    let [cx, cy] = pos(c, r), s = px;
    if (asm && asm.k < 1) {
      const ki = clamp((asm.k - hash(i * 3.1) * .55) / .45, 0, 1);
      if (ki <= 0) return;
      const e = MOTION.pop(ki); cx = lerp(asm.sx, cx, e); cy = lerp(asm.sy, cy, e) - Math.sin(ki * Math.PI) * 60 * hash(i); s = px * lerp(.3, 1, ki);
    }
    ctx.fillStyle = col; ctx.fillRect(cx, cy, s * sxk * .94, s * sq * .94);
  });
  if ((!asm || asm.k >= .85) && st.pose !== 'cover') {
    const ex = (st.eye || 0) * px * .4, bl = st.blink ? .25 : 1, ey = st.nod ? px * .3 : 0;
    for (const c of [3, 8]) {
      const [cx, cy] = pos(c, 2);
      ctx.fillStyle = COL.eye; ctx.fillRect(cx + ex, cy + ey + px * 2 * sq * (1 - bl) * .5, px * sxk * .94, px * 2 * sq * bl * .94);
    }
  }
  if (st.sweat > 0) {
    const [cx, cy] = pos(10.4, -0.4), d = (st.sweat * 1.6) % 1;
    ctx.fillStyle = rgba(COL.vari, 1 - d); ctx.fillRect(cx, cy + d * px * 3, px * .55, px * .8);
  }
  if (st.q > 0) {
    const [cx, cy] = pos(9.5, -3.2), s = px * .55 * MOTION.pop(st.q);
    const Qm = ['.##.', '#..#', '...#', '..#.', '..#.', '....', '..#.'];
    ctx.fillStyle = COL.num;
    Qm.forEach((row, j) => [...row].forEach((ch, i) => { if (ch === '#') ctx.fillRect(cx + i * s, cy + j * s, s * .9, s * .9); }));
  }
  ctx.restore();
}
function jumpPos(T, jumps, base) {
  let p = base;
  for (const j of jumps) {
    const [t0, t1] = j, from = typeof j[2] === 'function' ? j[2](T) : j[2], to = typeof j[3] === 'function' ? j[3](T) : j[3];
    if (T < t0) break;
    if (T < t1) {
      const k = (T - t0) / (t1 - t0), e = MOTION.draw(k), d = Math.hypot(to[0] - from[0], to[1] - from[1]);
      return { p: [lerp(from[0], to[0], e), lerp(from[1], to[1], e) - Math.sin(Math.PI * k) * (70 + d * .18), lerp(from[2], to[2], e)], air: true, k };
    }
    p = to;
  }
  return { p, air: false };
}
function clawdAt(T, pl) {
  const { tm } = pl;
  const P0 = [960, 526, 14], PT = [1462, 432, 12], PI = [560, 720, 22], PP = [1710, 800, 12], PY = [1600, 262, 10], PJ = [1660, 860, 13];
  const ground = t => [sliderX(t, tm) - 84, AX.y - 3, 10];
  const PIN = [AX.x0 + (AX.x1 - AX.x0) * TICKS[0].x - 150, 520, 10];
  const jumps = [
    [tm.hop, tm.hop + .5, P0, PT], [tm.I - .65, tm.I + .25, PT, PI], [tm.P - .1, tm.P + .6, PI, PP], [tm.Y + .9, tm.Y + 1.5, PP, PY],
    [tm.J - .1, tm.J + .6, PY, PJ], [tm.A + 1.8, tm.A + 2.6, PJ, ground], [tm.pinJump, tm.pin, ground, PIN], [tm.land, tm.land + .55, PIN, ground],
  ];
  const r = jumpPos(T, jumps, P0);
  let [x, y, px] = r.p;
  if (!r.air && T >= tm.A + 2.6 && !(T >= tm.pin && T < tm.land)) [x, y, px] = ground(T);
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (T < tm.asm) st.alpha = 0;
  else if (T < tm.asm + .75) st.asm = { k: (T - tm.asm) / .75, sx: 960, sy: 470 };
  if (T >= tm.hop + .5 && T < tm.I - .7) st.eye = -1;
  if (r.air) { st.squash = 1 + .1 * Math.sin(Math.PI * r.k); }
  const land = jumps.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (land !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - land) / .25);
  if (T >= tm.wave && T < tm.wave + 2.4) st.pose = 'wave';
  if (T >= tm.P + 6.8 && T < tm.Y) st.eye = -1;
  if (T >= tm.nod && T < tm.Y) { st.nod = Math.sin((T - tm.nod) * 5) > .3; st.eye = -1; }
  if (T >= tm.qb && T < tm.qb + 1.6) st.q = Math.min(1, (T - tm.qb) * 4) * (T > tm.qb + 1.4 ? (tm.qb + 1.6 - T) * 5 : 1);
  if (T >= tm.stamp && T < tm.stamp + .3) st.squash = 1 - .25 * Math.sin(Math.PI * (T - tm.stamp) / .3);
  if (T >= tm.stamp) st.eye = T < tm.J ? -1 : st.eye;
  if (T >= tm.J + .6 && T < tm.J + 4.2) { st.pose = 'type'; st.ph = T * 22; st.eye = -1; }
  if (T >= tm.J + 4.2 && T < tm.A) st.eye = -1;
  if (T >= tm.ret && T < tm.ret + .4) st.y -= Math.sin(Math.PI * (T - tm.ret) / .4) * 40;
  if (T >= tm.push0 - .3 && T < tm.K + 2.4) st.pose = 'push';
  if ((T >= tm.push0 && T < tm.push1) || (T >= tm.back0 && T < tm.back1)) st.walk = T * 16;
  if (T >= tm.danger && T < tm.K) { st.sweat = T - tm.danger; st.x += (hash(Math.floor(T * 30)) - .5) * 4; }
  if (T >= tm.K && T < tm.back1 + .3) st.eye = -1;
  if (T >= tm.pinJump && T < tm.land) st.pose = 'up';
  if (T >= tm.bye && T < tm.bye + 1.6) st.pose = 'wave';
  return st;
}

// ---------- 场景层（可溶解、扭曲） ----------
function drawScene(ctx, T, pl, fv) {
  const { tm, ty } = pl;
  ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  const ch = activeCh(pl, T, 'start');
  if (ch) { ch.m.scene(ctx, T, ch.p, fv); return; }
  if (T < tm.I) { drawTitle(ctx, T, pl, fv); return; }
  if (T < tm.P) {
    const kt = prog(T, tm.tag, tm.tag + .5, MOTION.pop);
    if (kt > 0) popScale(ctx, 720, 500, kt, () => {
      ctx.font = font(600, 36); const w = ctx.measureText('Clawd · 助教').width + 56;
      ctx.fillStyle = COL.card; ctx.strokeStyle = COL.clawd; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.roundRect(720, 470, w, 64, 32); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COL.text; ctx.fillText('Clawd · 助教', 748, 503);
    });
    const kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
    ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
    ctx.fillText('// 第 1 章', 1080, 330); ctx.globalAlpha = 1;
    const D = dotsFor('01', 300, 12, 700, MONO, fv);
    D.pts.forEach(([dx, dy], i) => {
      const hv = hash(i * .73);
      if (hv > kd) return;
      ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
      ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
    });
    ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.P - .6);
    return;
  }
  if (T < tm.J) { drawPost(ctx, T, pl); if (T >= tm.Y) drawDict(ctx, T, pl); return; }
  if (T < tm.A) { drawCode(ctx, T, pl); return; }
  drawAxis(ctx, T, pl);
  if (T >= tm.taskIn) drawTask(ctx, T, pl);
}
function drawTitle(ctx, T, pl, fv) {
  const { tm, ty } = pl;
  const D = dotsFor('Vibe Coding', 168, 8, 700, MONO, fv);
  const x0 = 960 - D.w / 2, y0 = 470, lw = D.w / 11;
  const boom = prog(T, tm.boom, tm.I, Easing.easeInCubic);
  D.pts.forEach(([dx, dy], i) => {
    const li = Math.floor(dx / lw), hv = hash(i * .37);
    const k = clamp((T - (tm.build + li * .085 + hv * .28)) / .45, 0, 1);
    if (k <= 0) return;
    const e = MOTION.enter(k);
    const ox = (dx - D.w / 2) * .9 + (hash(i * 2.3) - .5) * 500, oy = dy * 2 + (hash(i * 5.1) - .5) * 360;
    let x = x0 + dx + ox * (1 - e), y = y0 + dy + oy * (1 - e), s = lerp(26, 7, e), a = Math.min(1, k * 2.5);
    if (boom > 0) { x += ((dx - D.w / 2) * 1.6 + (hash(i * 7.7) - .5) * 900) * boom; y += (dy * 3 + (hash(i * 3.3) - .5) * 700) * boom; s *= 1 + boom * 3; a *= 1 - boom; }
    const tw = hash(i + Math.floor(T * 7) * 131) > .985;
    ctx.globalAlpha = a; ctx.fillStyle = tw ? '#ffffff' : hv > .93 ? COL.num : hv > .82 ? COL.kw : COL.text;
    ctx.fillRect(x - s / 2, y - s / 2, s, s);
  });
  ctx.globalAlpha = 1;
  const cOn = (T >= tm.blink1 && T < tm.blink1 + .28) || (T >= tm.blink2 && T < tm.blink2 + .28);
  if (cOn) { ctx.fillStyle = COL.kw; ctx.fillRect(934, y0 - 56, 52, 112); }
  if (T >= tm.asm && T < tm.asm + .25) { const k = prog(T, tm.asm, tm.asm + .25); ctx.globalAlpha = 1 - k; ctx.fillStyle = '#fff'; ctx.fillRect(960 - 26 * (1 + k), y0 - 56 * (1 - k * .5), 52 * (1 + k), 112 * (1 - k * .5)); }
  ctx.globalAlpha = 1 - boom;
  ctx.font = font(500, 60); const sw = ctx.measureText(ty.sub.text).width;
  if (T >= ty.sub.s) drawTyped(ctx, T, ty.sub, 960 - sw / 2, 640, COL.text, T < ty.date.s, COL.kw);
  ctx.font = font(400, 24, MONO); const dw = ctx.measureText(ty.date.text).width;
  if (T >= ty.date.s) drawTyped(ctx, T, ty.date, 960 - dw / 2, 725, COL.dim, T < tm.boom, COL.kw);
  ctx.globalAlpha = 1;
}
function drawPost(ctx, T, pl) {
  const { tm, ty } = pl;
  const k = prog(T, tm.card, tm.card + .7), s = prog(T, tm.shift, tm.shift + .9, MOTION.draw);
  if (k <= 0) return;
  ctx.save();
  ctx.globalAlpha = k * (1 - .5 * s);
  ctx.translate(410 - 250 * s, 500 + 40 * (1 - k)); ctx.scale(1 - .2 * s, 1 - .2 * s); ctx.translate(-410, -500);
  const X = 380, Y0 = 180, Wd = 1160, Hd = 640;
  ctx.fillStyle = COL.card; ctx.strokeStyle = COL.line; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(X, Y0, Wd, Hd, 18); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#2a2c33'; ctx.beginPath(); ctx.arc(X + 80, Y0 + 82, 34, 0, 6.283); ctx.fill();
  ctx.font = font(600, 24, MONO); ctx.fillStyle = COL.kw; ctx.textAlign = 'center'; ctx.fillText('AK', X + 80, Y0 + 83); ctx.textAlign = 'left';
  ctx.font = font(600, 32); ctx.fillStyle = COL.text; ctx.fillText('Andrej Karpathy', X + 132, Y0 + 66);
  ctx.font = font(400, 23); ctx.fillStyle = COL.dim; ctx.fillText('OpenAI 联合创始人之一 · 2025 年 2 月', X + 132, Y0 + 104);
  const iT = Q1.indexOf('"vibe coding"'), iF = Q1.indexOf('forget'), iW = Q2.indexOf('throwaway');
  ctx.font = font(400, 36, MONO);
  const m1 = [{ a: iT, b: iT + 13, k: prog(T, tm.term, tm.term + .4), c: COL.kw }, { a: iF, b: iF + 32, k: prog(T, tm.hl1, tm.hl1 + .4), c: COL.kw }];
  const n1 = typedN(T, ty.q1);
  if (T >= ty.q1.s - .2) drawPara(ctx, Q1, n1, X + 48, Y0 + 186, 54, Wd - 96, m1, COL.text, COL.kw, T < ty.q2.s && (typingOn(T, ty.q1, 0) || blink(T)));
  const t1 = prog(T, tm.tr1, tm.tr1 + .6);
  ctx.font = font(400, 29); ctx.fillStyle = COL.dim; ctx.globalAlpha *= t1 || 0;
  wrapChars(ctx, Q1_TR, Wd - 96).forEach((l, i) => ctx.fillText(l, X + 48, Y0 + 368 + i * 44 + 10 * (1 - t1)));
  ctx.globalAlpha = k * (1 - .5 * s);
  const d2 = prog(T, ty.q2.s - .3, ty.q2.s + .2);
  ctx.fillStyle = COL.line; ctx.fillRect(X + 48, Y0 + 452, (Wd - 96) * d2, 2);
  ctx.font = font(400, 36, MONO);
  const m2 = [{ a: iW, b: iW + 26, k: prog(T, tm.hl2, tm.hl2 + .4), c: COL.str }];
  if (T >= ty.q2.s - .2) drawPara(ctx, Q2, typedN(T, ty.q2), X + 48, Y0 + 514, 54, Wd - 96, m2, COL.text, COL.str, T < tm.Y && (typingOn(T, ty.q2, 0) || blink(T)));
  const t2 = prog(T, tm.tr2, tm.tr2 + .6);
  ctx.font = font(400, 30); ctx.fillStyle = COL.dim; ctx.globalAlpha *= t2 || 0;
  ctx.fillText(Q2_TR, X + 48, Y0 + 578 + 10 * (1 - t2));
  ctx.restore();
}
function drawDict(ctx, T, pl) {
  const { tm } = pl;
  const kb = prog(T, tm.book, tm.book + .7, MOTION.pop);
  if (kb <= 0) return;
  const X = 1170, Y0 = 268, Wd = 540, Hd = 440;
  ctx.save();
  ctx.translate(0, 120 * (1 - kb)); ctx.globalAlpha = Math.min(1, kb * 1.4);
  ctx.fillStyle = COL.card; ctx.strokeStyle = COL.line; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(X, Y0, Wd, Hd, 14); ctx.fill(); ctx.stroke();
  ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.fillText('Collins English Dictionary', X + 44, Y0 + 56);
  ctx.font = font(700, 62, MONO); ctx.fillStyle = COL.text; ctx.fillText('vibe coding', X + 44, Y0 + 140);
  ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.kw; ctx.fillText('noun', X + 44, Y0 + 200);
  ctx.fillStyle = COL.line; ctx.fillRect(X + 44, Y0 + 240, Wd - 88, 2);
  const ks = prog(T, tm.stamp, tm.stamp + .35, Easing.easeOutQuad);
  if (ks > 0) {
    const sc = lerp(2.4, 1, ks);
    ctx.save(); ctx.globalAlpha *= Math.min(1, ks * 3); ctx.translate(X + Wd / 2, Y0 + 336); ctx.rotate(-.07); ctx.scale(sc, sc);
    ctx.strokeStyle = COL.num; ctx.lineWidth = 4; ctx.fillStyle = rgba(COL.num, .14);
    ctx.beginPath(); ctx.roundRect(-210, -62, 420, 124, 10); ctx.fill(); ctx.stroke();
    ctx.textAlign = 'center'; ctx.font = font(700, 26, MONO); ctx.fillStyle = COL.num; ctx.fillText('WORD OF THE YEAR 2025', 0, -20);
    ctx.font = font(600, 32); ctx.fillText('柯林斯词典 2025 年度词', 0, 26);
    ctx.restore();
  }
  const ko = prog(T, tm.open, tm.open + .8, MOTION.draw);
  if (ko < 1) {
    const cw = Wd * Math.cos(ko * Math.PI);
    ctx.fillStyle = ko < .5 ? '#3a2a4a' : '#2a2033';
    ctx.beginPath(); ctx.roundRect(cw >= 0 ? X : X + cw, Y0, Math.abs(cw), Hd, 14); ctx.fill();
    if (ko < .5) {
      ctx.save(); ctx.beginPath(); ctx.rect(X, Y0, Math.abs(cw), Hd); ctx.clip();
      ctx.strokeStyle = COL.kw; ctx.lineWidth = 3; ctx.strokeRect(X + 30, Y0 + 30, Wd - 60, Hd - 60);
      ctx.textAlign = 'center'; ctx.font = font(700, 54, MONO); ctx.fillStyle = COL.kw; ctx.fillText('COLLINS', X + Wd / 2, Y0 + Hd / 2 - 20);
      ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.fillText('ENGLISH DICTIONARY', X + Wd / 2, Y0 + Hd / 2 + 34);
      ctx.restore();
    }
  }
  ctx.restore();
}
function drawCode(ctx, T, pl) {
  const { tm, ty } = pl;
  const X = 300, Y0 = 290;
  ctx.font = font(400, 30, MONO);
  drawTyped(ctx, T, ty.cm, X, Y0, COL.faint, T < ty.c1.s, COL.kw);
  ctx.font = font(400, 54, MONO);
  const cw = ctx.measureText('0').width;
  const e1 = drawTokens(ctx, T, ty.c1, CODE_TOK[0], X, Y0 + 100);
  const lineDone = ty.c1.s + CODE[0].length / ty.c1.cps;
  CONDS.forEach(([tok, lab], i) => {
    const st = CODE[0].indexOf(tok), c = prog(T, tm.chk[i], tm.chk[i] + .4), u = prog(T, lineDone, lineDone + .4);
    ctx.globalAlpha = u; ctx.fillStyle = mixC(COL.line, COL.str, c); ctx.fillRect(X + st * cw, Y0 + 140, tok.length * cw, 5);
    ctx.globalAlpha = c; ctx.font = font(500, 30); ctx.fillStyle = COL.str; ctx.textAlign = 'center';
    ctx.fillText('✓ ' + lab, X + (st + tok.length / 2) * cw, Y0 + 186 + 10 * (1 - c));
    ctx.textAlign = 'left'; ctx.globalAlpha = 1; ctx.font = font(400, 54, MONO);
  });
  const g = prog(T, tm.ret, tm.ret + .5);
  const e2 = drawTokens(ctx, T, ty.c2, CODE_TOK[1], X, Y0 + 266, g);
  ctx.font = font(400, 40, MONO);
  const e2b = T >= ty.c2b.s ? drawTokens(ctx, T, ty.c2b, [[ty.c2b.text, COL.faint]], e2, Y0 + 268) : e2;
  ctx.font = font(400, 54, MONO);
  const e3 = drawTokens(ctx, T, ty.c3, [['}', COL.text]], X, Y0 + 352);
  if (blink(T) || T < ty.c3.s + .1) {
    if (T >= ty.c1.s && T < ty.c2.s) cursorAt(ctx, e1, Y0 + 100);
    else if (T >= ty.c2.s && T < ty.c3.s) cursorAt(ctx, e2, Y0 + 266);
    else if (T >= ty.c3.s && T < ty.c2b.s) cursorAt(ctx, e3, Y0 + 352);
    else if (T >= ty.c2b.s) { ctx.font = font(400, 40, MONO); cursorAt(ctx, e2b, Y0 + 268); }
  }
}
function drawAxis(ctx, T, pl) {
  const { tm } = pl;
  const d = prog(T, tm.axis, tm.axis + 1.2, MOTION.draw);
  if (d <= 0) return;
  const len = AX.x1 - AX.x0, p = sliderPos(T, tm), sx = AX.x0 + len * p, sc = heat(p);
  const kl = prog(T, tm.left, tm.left + .6), kt = prog(T, tm.ticks, tm.ticks + .6), ka = prog(T, tm.axTitle, tm.axTitle + .6) * (1 - prog(T, tm.push0, tm.push0 + .4));
  const dang = T >= tm.danger ? prog(T, tm.danger, tm.danger + .5) * (T < tm.K ? 1 : 1 - prog(T, tm.K, tm.K + 1)) : 0;
  ctx.globalAlpha = ka; ctx.font = font(400, 26, MONO); ctx.fillStyle = COL.dim; ctx.textAlign = 'right';
  ctx.fillText('// 用多久、给谁用 →', AX.x1, AX.y - 90); ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  ctx.fillStyle = '#5a5f6b'; ctx.fillRect(AX.x0, AX.y - 2, len * d, 4);
  if (dang > 0) { const g = ctx.createLinearGradient(AX.x0 + len * .6, 0, AX.x1, 0); g.addColorStop(0, rgba(COL.err, 0)); g.addColorStop(1, rgba(COL.err, .9 * dang)); ctx.fillStyle = g; ctx.fillRect(AX.x0 + len * .6, AX.y - 6, len * .4, 12); }
  if (p > 0) { const g = ctx.createLinearGradient(AX.x0, 0, sx, 0); g.addColorStop(0, COL.str); g.addColorStop(1, sc); ctx.fillStyle = g; ctx.fillRect(AX.x0, AX.y - 3, sx - AX.x0, 6); }
  const kr = T >= tm.right ? bump(T, tm.right + .8, .7) : 0;
  if (kr > .01) { const bx = lerp(AX.x0 + len * .45, AX.x1, clamp((T - tm.right) / 1.6, 0, 1)); const g = ctx.createRadialGradient(bx, AX.y, 0, bx, AX.y, 160); g.addColorStop(0, rgba(COL.num, .9 * kr)); g.addColorStop(1, rgba(COL.num, 0)); ctx.fillStyle = g; ctx.fillRect(bx - 160, AX.y - 40, 320, 80); }
  ctx.globalAlpha = kl; ctx.fillStyle = COL.str; ctx.beginPath(); ctx.arc(AX.x0, AX.y, 9, 0, 6.283); ctx.fill();
  ctx.font = font(500, 32); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText('用完就扔的小玩具', AX.x0, AX.y + 58);
  TICKS.forEach(tk => {
    const x = AX.x0 + len * tk.x, lit = p >= tk.x - 1e-3, c = heat(tk.x);
    ctx.globalAlpha = kt; ctx.fillStyle = lit ? c : '#4a4e57'; ctx.fillRect(x - 3, AX.y - 16, 6, 32);
    ctx.font = font(lit ? 600 : 400, 32); ctx.fillStyle = lit ? COL.text : COL.dim;
    ctx.fillText(tk.k, x, AX.y + 58 + 10 * (1 - kt));
  });
  ctx.textAlign = 'left'; ctx.globalAlpha = 1;
  const ks = prog(T, tm.left + .2, tm.left + .7, MOTION.pop);
  if (ks > 0) {
    ctx.fillStyle = 'rgba(19,20,23,.95)'; ctx.beginPath(); ctx.arc(sx, AX.y, 24 * ks, 0, 6.283); ctx.fill();
    ctx.fillStyle = sc; ctx.beginPath(); ctx.arc(sx, AX.y, 17 * ks, 0, 6.283); ctx.fill();
  }
}
function drawTask(ctx, T, pl) {
  const { tm, ty } = pl;
  const cx = AX.x0 + (AX.x1 - AX.x0) * TICKS[0].x;
  const k = prog(T, tm.taskIn, tm.taskIn + .9, Easing.linear);
  const X = cx - 340, Y0 = 250, Wd = 680, Hd = 150;
  const cells = 34;
  const ln = prog(T, tm.pin, tm.pin + .5, MOTION.draw);
  if (ln > 0) { ctx.strokeStyle = COL.num; ctx.lineWidth = 2; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(cx, Y0 + Hd); ctx.lineTo(cx, Y0 + Hd + (AX.y - 20 - Y0 - Hd) * ln); ctx.stroke(); ctx.setLineDash([]); }
  if (k < 1) {
    for (let i = 0; i < cells; i++) for (let j = 0; j < 8; j++) {
      const hv = hash(i * 13.7 + j * 3.1); if (hv > k) continue;
      ctx.fillStyle = hv > k - .08 ? COL.num : COL.card;
      ctx.fillRect(X + i * Wd / cells, Y0 + j * Hd / 8, Wd / cells + .5, Hd / 8 + .5);
    }
  } else {
    ctx.fillStyle = COL.card; ctx.strokeStyle = COL.num; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(X, Y0, Wd, Hd, 14); ctx.fill(); ctx.stroke();
  }
  ctx.globalAlpha = prog(T, tm.taskIn + .6, tm.taskIn + 1);
  ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.str; ctx.fillText('$', X + 34, Y0 + 40);
  ctx.fillStyle = COL.dim; ctx.fillText('task', X + 60, Y0 + 40);
  ctx.font = font(400, 22); ctx.fillStyle = COL.num; ctx.textAlign = 'right'; ctx.fillText('贯穿全片', X + Wd - 34, Y0 + 40); ctx.textAlign = 'left';
  ctx.globalAlpha = 1; ctx.font = font(600, 44);
  drawTyped(ctx, T, ty.task, X + 34, Y0 + 100, COL.text, T < tm.pin, COL.num);
  const kp = prog(T, tm.pin - .05, tm.pin + .25, Easing.easeOutQuad);
  if (kp > 0) { const py = lerp(Y0 - 120, Y0 - 8, kp); ctx.fillStyle = COL.err; ctx.fillRect(cx - 12, py - 12, 24, 24); ctx.fillStyle = '#ffd2d4'; ctx.fillRect(cx - 12, py - 12, 10, 10); ctx.fillStyle = COL.dim; ctx.fillRect(cx - 2, py + 12, 4, 16 * kp); }
}

// ---------- 演员层与 HUD 层 ----------
function drawActor(ctx, T, pl) { const ch = activeCh(pl, T, 'actorFrom'); drawClawd(ctx, ch ? ch.m.clawd(T, ch.p) : clawdAt(T, pl)); if (ch && ch.m.over) ch.m.over(ctx, T, ch.p); }
function drawHud(ctx, T, pl, tw) {
  const { tm } = pl;
  ctx.textBaseline = 'middle';
  const e1 = Math.min(tm.off, tm.chEnd - .1), kc = prog(T, tm.P + .3, tm.P + 1) * (1 - prog(T, e1 - .4, e1));
  if (kc > 0) {
    ctx.globalAlpha = kc; ctx.font = font(600, 24, MONO); ctx.fillStyle = COL.kw; ctx.textAlign = 'left'; ctx.fillText('01', 70, 66);
    ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.fillText('什么是 vibe coding', 114, 66);
  }
  const ks = prog(T, tm.P + .6, tm.P + 1.2) * (1 - prog(T, tm.J - .5, tm.J));
  if (ks > 0) { ctx.globalAlpha = ks; ctx.font = font(400, 20, MONO); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('来源：Karpathy, 2025-02；Collins Dictionary, 2025-11', 1850, 66); }
  for (const x of pl.chs) {
    const h = x.p.hud, e = Math.min(tm.off, x.p.end - .1), k = prog(T, h.from, h.from + .7) * (1 - prog(T, e - .4, e));
    if (k > 0) { ctx.globalAlpha = k; ctx.font = font(600, 24, MONO); ctx.fillStyle = COL.kw; ctx.textAlign = 'left'; ctx.fillText(h.num, 70, 66); ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.fillText(h.name, 114, 66); }
    for (const [a, b, s] of h.srcs) { const k2 = prog(T, a, a + .6) * (1 - prog(T, b - .5, b)); if (k2 > 0) { ctx.globalAlpha = k2; ctx.font = font(400, 20, MONO); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText(s, 1850, 66); } }
    ctx.textAlign = 'left';
  }
  ctx.globalAlpha = 1;
  const cap = pl.caps.find(c => T >= c.at && T < c.until);
  if (cap) {
    const a = Math.min(1, (T - cap.at) / .18, (cap.until - T) / .18);
    const fs = tw.subtitleSize || 46;
    ctx.font = font(500, fs); ctx.textAlign = 'center';
    const lines = wrapCap(ctx, cap.text, 1640);
    const lh = fs * 1.38, y0 = 1000 - (lines.length - 1) * lh / 2;
    const g = ctx.createLinearGradient(0, 880, 0, 1080); g.addColorStop(0, 'rgba(8,8,10,0)'); g.addColorStop(.45, 'rgba(8,8,10,.72)'); g.addColorStop(1, 'rgba(8,8,10,.86)');
    ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(0, 880, W, 200);
    ctx.lineJoin = 'round'; ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(8,8,10,.9)';
    lines.forEach((l, i) => { ctx.strokeText(l, 960, y0 + i * lh); ctx.fillStyle = COL.text; ctx.fillText(l, 960, y0 + i * lh); });
    ctx.globalAlpha = 1; ctx.textAlign = 'left';
  }
}

// ---------- 着色器合成：三层画面全部经由片元着色器输出 ----------
const VS = '#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
const FS = `#version 300 es
precision highp float;
uniform sampler2D uScene, uActor, uHud;
uniform vec2 uRes, uPow, uPan, uLight;
uniform float uT, uGlitch, uPix, uFluid, uDis, uRays, uFloor, uWarm, uEnergy, uBloom, uCurve, uFx, uScanY, uLine, uFlZ;
uniform vec4 uCam, uRip;
out vec4 oc;
const float AR = 1.7777778, FL = 1.6;
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*vn(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1,0,0,0,c,s,0,-s,c);}
mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0,-s,0,1,0,s,0,c);}
void cam(vec2 p,out vec3 ro,out vec3 rd){
  float cr=cos(uCam.w),sr=sin(uCam.w);p=mat2(cr,-sr,sr,cr)*p;
  mat3 R=rotY(uCam.y)*rotX(uCam.z);
  ro=R*vec3(uPan,-uCam.x);rd=R*normalize(vec3(p,FL));
}
vec2 planeUV(vec2 p){
  vec3 ro,rd;cam(p,ro,rd);
  if(rd.z<=1e-4)return vec2(-1.);
  vec3 hp=ro+rd*(-ro.z/rd.z);
  return vec2(hp.x/AR+.5,.5-hp.y);
}
vec4 tx(sampler2D s,vec2 uv,float lod){
  if(uv.x<0.||uv.y<0.||uv.x>1.||uv.y>1.)return vec4(0.);
  return textureLod(s,uv,lod);
}
float lum(vec3 c){return dot(c,vec3(.299,.587,.114));}
vec2 toP(vec2 u){return vec2((u.x-.5)*AR,.5-u.y);}
void main(){
  vec2 uv=gl_FragCoord.xy/uRes;uv.y=1.-uv.y;
  vec2 cc=uv*2.-1.;cc*=1.+uCurve*.045*dot(cc,cc);
  vec2 u2=cc*.5+.5;
  vec2 suv=vec2((u2.x-.5)/max(uPow.x,1e-3)+.5,(u2.y-.5)/max(uPow.y,1e-3)+.5);
  vec2 puv=suv;
  if(uPix>1.){vec2 cl=vec2(uPix)/vec2(1920.,1080.);puv=(floor(suv/cl)+.5)*cl;}
  float gs=floor(uT*18.);
  float band=floor(puv.y*mix(8.,42.,h1(vec2(gs,1.))));
  if(h1(vec2(band,gs))<uGlitch*.4)puv.x+=(h1(vec2(band,gs+3.))-.5)*.22*uGlitch;
  if(h1(vec2(gs,7.))>.75)puv.y+=(h1(vec2(gs,9.))-.5)*.03*uGlitch;
  puv+=(vec2(fbm(puv*3.+vec2(0.,uT*.5)),fbm(puv*3.+vec2(5.2,1.3)-uT*.5))-.5)*uFluid*.2;
  if(uRip.w>0.){
    vec2 d=(puv-uRip.xy)*vec2(AR,1.);float r=length(d);float fr=uRip.z*1.1;
    float w=sin((r-fr)*46.)*exp(-pow((r-fr)*5.,2.))*exp(-uRip.z*1.3)*uRip.w;
    puv+=d/(r+1e-3)*w*.022;
  }
  vec2 p=toP(puv);
  vec2 bp=p*1.15;
  vec2 q=vec2(fbm(bp*1.4+vec2(0.,uT*.05)),fbm(bp*1.4+vec2(5.2,1.3)-uT*.04));
  float f=fbm(bp*2.+q*2.4+vec2(uT*.03,0.));
  vec3 cool=mix(vec3(.49,.72,1.),vec3(.78,.57,.92),smoothstep(.3,.7,q.x));
  vec3 hot=mix(vec3(.95,.65,.35),vec3(.94,.44,.47),smoothstep(.3,.7,q.y));
  vec3 tint=mix(cool,hot,uWarm);
  vec3 c=vec3(.058,.062,.074)+tint*smoothstep(.45,.95,f)*.4*uEnergy;
  vec2 lp=toP(uLight);vec2 dl=p-lp;float ang=atan(dl.y,dl.x);
  float sh=pow(vn(vec2(ang*6.,uT*.12)),3.)*exp(-length(dl)*1.2);
  c+=tint*sh*.28*uEnergy;
  vec3 ro,rd;cam(p,ro,rd);
  float tf=(-.58-ro.y)/min(rd.y,-1e-4);
  vec2 g=((ro+rd*tf).xz+vec2(0.,uFlZ))*3.;
  vec2 fw=fwidth(g);vec2 gg=abs(fract(g-.5)-.5)/max(fw,vec2(1e-4));
  float ln=1.-min(min(gg.x,gg.y),1.);
  float fade=exp(-max(tf-1.,0.)*.35)*smoothstep(0.,.06,-rd.y)*step(rd.y,-1e-3);
  c+=tint*(ln*.5+.04)*fade*uFloor;
  vec2 cu=planeUV(p);
  float ab=uGlitch*.011;
  vec4 s0=tx(uScene,cu,0.);
  vec4 sc=vec4(tx(uScene,cu+vec2(ab,0.),0.).r,s0.g,tx(uScene,cu-vec2(ab,0.),0.).b,s0.a);
  vec2 cell=floor(cu*vec2(96.,54.));
  float dn=mix(h1(cell),fbm(cu*vec2(AR,1.)*5.),.5);
  float keep=step(uDis,dn);
  float edge=(1.-keep)*smoothstep(uDis-.07,uDis,dn)*step(.001,uDis);
  vec3 ec=mix(vec3(.78,.57,.92),vec3(.95,.65,.35),h1(cell+3.));
  c=c*(1.-sc.a*keep)+sc.rgb*keep+ec*edge*tx(uScene,cu,1.5).a*2.2;
  vec4 a0=tx(uActor,cu,0.);
  vec4 ac=vec4(tx(uActor,cu+vec2(ab,0.),0.).r,a0.g,tx(uActor,cu-vec2(ab,0.),0.).b,a0.a);
  c=c*(1.-ac.a)+ac.rgb;
  vec3 bl=(tx(uScene,cu,2.).rgb*keep+tx(uActor,cu,2.).rgb)*.3+(tx(uScene,cu,3.5).rgb+tx(uActor,cu,3.5).rgb)*.35+(tx(uScene,cu,5.).rgb+tx(uActor,cu,5.).rgb)*.45;
  c+=max(bl-.06,0.)*uBloom;
  if(uRays>.001){
    vec2 dir=puv-uLight;float acc=0.;float jt=h1(gl_FragCoord.xy+fract(uT)*31.);
    for(int i=0;i<32;i++){
      float k=(float(i)+jt)/32.;vec2 sp=puv-dir*k*.6;vec2 su=planeUV(toP(sp));
      acc+=lum(tx(uScene,su,3.).rgb+tx(uActor,su,3.).rgb)*(1.-k);
    }
    c+=mix(tint,vec3(1.),.35)*acc/32.*uRays*1.7;
  }
  if(uScanY>-.5){float sb=exp(-pow((suv.y-uScanY)*12.,2.));c+=tint*sb*.45+sb*.04;}
  vec4 hd=tx(uHud,suv,0.);
  c=c*(1.-hd.a)+vec3(tx(uHud,suv+vec2(.0006,0.),0.).r,hd.g,tx(uHud,suv-vec2(.0006,0.),0.).b);
  float scan=.5+.5*cos(suv.y*1080.*6.2831853/3.);
  c*=1.-uFx*.12*(1.-scan);
  float mx=mod(gl_FragCoord.x,3.);
  vec3 msk=mx<1.?vec3(1.,.92,.92):mx<2.?vec3(.92,1.,.92):vec3(.92,.92,1.);
  c*=mix(vec3(1.),msk,uFx*.6);
  vec2 vv=u2-.5;c*=1.-dot(vv,vv)*(.45+uFx*.6);
  c+=(h1(gl_FragCoord.xy+fract(uT*7.)*100.)-.5)*.035*uFx;
  c+=vec3(.75,.85,1.)*exp(-abs(u2.y-.5)*260.)*uLine*step(abs(u2.x-.5),uPow.x*.5);
  float inside=step(abs(u2.y-.5),uPow.y*.5)*step(abs(u2.x-.5),uPow.x*.5);
  vec2 qd=abs(u2-.5)-vec2(.5-.03);
  float bz=1.-smoothstep(0.,.004,length(max(qd,0.))-.03);
  c*=mix(1.,bz,step(.01,uCurve));
  oc=vec4(max(c,0.)*mix(1.,inside,1.),1.);
  if(inside<.5&&uLine<.001)oc=vec4(0.,0.,0.,1.);
}`;
const UNI = ['uRes', 'uPow', 'uPan', 'uLight', 'uT', 'uGlitch', 'uPix', 'uFluid', 'uDis', 'uRays', 'uFloor', 'uWarm', 'uEnergy', 'uBloom', 'uCurve', 'uFx', 'uScanY', 'uLine', 'uFlZ', 'uCam', 'uRip'];
const GLR = {
  init() {
    if (this.ok !== undefined) return this.ok;
    this.layers = [0, 1, 2].map(() => document.createElement('canvas'));
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
      this.tex = ['uScene', 'uActor', 'uHud'].map((n, i) => {
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
    x.setTransform(res[0] / W, 0, 0, res[1] / H, 0, 0); x.globalAlpha = 1; return x;
  },
  render(res, u) {
    const cv = this.cv;
    if (cv.width !== res[0]) { cv.width = res[0]; cv.height = res[1]; }
    if (!this.ok) {
      const x = cv.getContext('2d'); x.fillStyle = COL.bg; x.fillRect(0, 0, cv.width, cv.height);
      this.layers.forEach(l => x.drawImage(l, 0, 0)); return cv.toDataURL('image/jpeg', .92);
    }
    const gl = this.gl, L = this.loc;
    gl.viewport(0, 0, cv.width, cv.height);
    this.tex.forEach((t, i) => { gl.activeTexture(gl.TEXTURE0 + i); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.layers[i]); gl.generateMipmap(gl.TEXTURE_2D); });
    gl.uniform2f(L.uRes, cv.width, cv.height);
    for (const k of UNI) { if (k === 'uRes') continue; const v = u[k]; if (typeof v === 'number') gl.uniform1f(L[k], v); else if (v.length === 2) gl.uniform2f(L[k], v[0], v[1]); else gl.uniform4f(L[k], v[0], v[1], v[2], v[3]); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return cv.toDataURL('image/jpeg', .92);
  },
};
function camAt(T, pl) {
  const K = pl.cam, tm = pl.tm;
  let v = K[K.length - 1].slice(1);
  if (T <= K[0][0]) v = K[0].slice(1);
  else for (let i = 0; i < K.length - 1; i++) if (T < K[i + 1][0]) { const k = prog(T, K[i][0], K[i + 1][0], MOTION.draw); v = K[i].slice(1).map((a, j) => lerp(a, K[i + 1][j + 1], k)); break; }
  if (T >= tm.A + 4) v[4] += (sliderX(T, tm) / W - .5) * AR * .45 * prog(T, tm.A + 4, tm.A + 5, MOTION.draw) * (1 - prog(T, tm.chEnd - .6, tm.chEnd + .4, MOTION.draw));
  for (const [t, amp] of [[tm.stamp + .05, .03], [tm.pin, .014], ...pl.shakes]) if (T >= t && T < t + 1.5) { const a = amp * Math.exp(-(T - t) * 6); v[4] += (hash(Math.floor(T * 40)) - .5) * a; v[5] += (hash(Math.floor(T * 40) + 7) - .5) * a; }
  return v;
}
function fxAt(T, pl, tw) {
  const { tm } = pl, I = tw.fx ?? 1, crt = tw.crt ?? 1;
  let px = 1, py = 1, line = 0;
  if (T < tm.S + .6) { px = Math.max(.002, prog(T, tm.S, tm.S + .2)); py = Math.max(.004, prog(T, tm.S + .15, tm.S + .55)); line = py < .99 ? 1 - py : 0; }
  if (T >= tm.off) { py = Math.max(.004, 1 - prog(T, tm.off, tm.off + .3, Easing.easeInCubic)); px = Math.max(.002, 1 - prog(T, tm.off + .3, tm.off + .65, Easing.easeInCubic)); line = 1 - py; if (T > tm.off + .75) line = 0; }
  let dis = 0, pix = 0, flu = 0, gl = 0;
  for (const [b, kind] of pl.bounds) {
    if (T >= b - .55 && T < b) dis = Math.max(dis, prog(T, b - .55, b, Easing.easeInQuad));
    if (T >= b && T < b + .5) dis = Math.max(dis, 1 - prog(T, b, b + .5, Easing.easeOutQuad));
    if (kind === 'fluid') flu = Math.max(flu, 1.2 * bump(T, b, .26));
  }
  if (T >= tm.stamp) gl = Math.max(gl, .95 * Math.exp(-(T - tm.stamp) * 5));
  if (T >= tm.danger && T < tm.danger + .9) gl = Math.max(gl, hash(Math.floor(T * 12)) > .35 ? .75 : .15);
  const sp = T >= tm.A ? sliderPos(T, tm) : 0;
  let rays = 0, light = [.5, .44];
  if (T < tm.I + 1) rays = prog(T, tm.build, tm.build + 1) * .9 + .8 * bump(T, tm.boom + .4, .3) - .9 * prog(T, tm.I - .2, tm.I + 1);
  else if (T >= tm.stamp && T < tm.J) { rays = .9 * Math.exp(-(T - tm.stamp) * 2.2); light = [.74, .5]; }
  else if (T >= tm.ret && T < tm.A) { rays = .55 * Math.exp(-(T - tm.ret) * 1.4); light = [.3, .5]; }
  rays = Math.max(0, rays);
  let energy = T < tm.I ? 1 : T < tm.P ? lerp(1, .38, prog(T, tm.P - .6, tm.P)) : .38;
  if (T >= tm.A) energy += .4 * sp;
  let scan = -1;
  for (const s of [tm.S + .5]) if (T >= s && T < s + 1) scan = -.1 + (T - s) * 1.2;
  let rip = [0, 0, 0, 0];
  for (const [t, x, y] of [[tm.stamp + .05, 1440 / W, 600 / H], [tm.pin, 890 / W, 250 / H], ...pl.rips]) if (T >= t) rip = [x, y, T - t, I];
  const M = { gl, rays, energy, warm: Math.max(sp * .9, T >= tm.K ? .4 : 0),
    floor: Math.max(prog(T, tm.S + .3, tm.S + 1.5) * (1 - .35 * prog(T, tm.I, tm.I + 1)) * (1 - prog(T, tm.P - .6, tm.P)), prog(T, tm.A + 1, tm.A + 2.6)) };
  for (const x of pl.chs) {
    if (T < x.p.start - .6) break;
    const G = x.m.fx(T, x.p), k = prog(T, x.p.start - .6, x.p.start + .6, MOTION.draw);
    for (const n in M) M[n] = lerp(M[n], G[n] ?? 0, k);
    if (k >= .5 && G.light) light = G.light;
  }
  const c = camAt(T, pl);
  return {
    uPow: [px, py], uLine: line, uT: T, uGlitch: M.gl * I, uPix: pix * I, uFluid: flu * I, uDis: dis,
    uRays: Math.max(0, M.rays) * I, uLight: light, uWarm: M.warm,
    uFloor: M.floor * I,
    uEnergy: M.energy * Math.max(I, .2), uBloom: .5 * I, uCurve: crt * .38, uFx: .7 * crt, uScanY: scan, uFlZ: T * .32,
    uCam: [c[0], c[1], c[2], c[3]], uPan: [c[4], c[5]], uRip: rip,
  };
}
const RES = { '流畅': [960, 540], '高': [1600, 900], '原生': [1920, 1080] };
function Frame({ T, pl, tw, fv }) {
  const res = RES[tw.quality] || RES['高'];
  const url = useMemo(() => {
    GLR.init();
    drawScene(GLR.ctx(0, res), T, pl, fv);
    drawActor(GLR.ctx(1, res), T, pl);
    drawHud(GLR.ctx(2, res), T, pl, tw);
    return GLR.render(res, fxAt(T, pl, tw));
  }, [T, res[0], pl, fv, tw.fx, tw.crt, tw.subtitleSize]);
  return <img src={url} alt="" style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, display: 'block' }} />;
}

// ---------- 合成音效：按当前时间表离线渲染成一条音轨 ----------
function sfxEvents(pl) {
  const { ty, tm } = pl, ev = [];
  for (const Y of [ty, ...pl.chs.map(x => x.p.ty)]) for (const k in Y) { const d = Y[k]; for (let i = 0; i < d.text.length; i++) if (d.text[i] !== ' ') ev.push([d.s + i / d.cps + hash(i + d.s) * .012, 'key']); }
  pl.chs.forEach(x => ev.push(...x.p.sfx));
  ev.push([tm.S + .02, 'crt'], [tm.blink1, 'blip'], [tm.blink2, 'blip'], [tm.asm, 'assemble'], [tm.off, 'crtoff'], [tm.boom, 'whoosh']);
  for (let li = 0; li < 11; li++) ev.push([tm.build + li * .085 + .15, 'pix']);
  pl.bounds.forEach(([b]) => ev.push([b - .4, 'whoosh']));
  [tm.tag, tm.hl1, tm.term, tm.hl2, ...tm.chk].forEach(t => ev.push([t, 'on']));
  ev.push([tm.wave, 'hi'], [tm.dots, 'sparkle'], [tm.book, 'whoosh'], [tm.qb, 'blip'], [tm.open, 'page'], [tm.stamp, 'thump'], [tm.stamp, 'glitch'],
    [tm.ret, 'ping'], [tm.axis, 'sweep'], [tm.danger, 'glitch'], [tm.danger + .35, 'glitch'], [tm.taskIn, 'assemble'], [tm.pin, 'thump'], [tm.pin + .02, 'ping'], [tm.bye, 'hi']);
  [[tm.hop], [tm.I - .65], [tm.P - .1], [tm.Y + .9], [tm.J - .1], [tm.A + 1.8], [tm.pinJump], [tm.land]].forEach(([t]) => ev.push([t, 'jump']));
  for (const [a, b] of [[tm.push0, tm.push1], [tm.back0, tm.back1]]) for (let t = a; t < b; t += Math.PI / 16) ev.push([t, 'step']);
  let prev = 0;
  for (let t = tm.A; t < tm.K + 4; t += .01) { const p = sliderPos(t, tm); for (const tk of TICKS) if (prev < tk.x - 1e-4 && p >= tk.x - 1e-4) ev.push([t, 'on']); prev = p; }
  return ev;
}
function toWav(buf) {
  const d = buf.getChannelData(0), n = d.length, sr = buf.sampleRate, v = new DataView(new ArrayBuffer(44 + n * 2));
  const ws = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  ws(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); ws(8, 'WAVE'); ws(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * 2, true);
  for (let i = 0; i < n; i++) v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, d[i])) * 32767, true);
  return new Blob([v.buffer], { type: 'audio/wav' });
}
const SFX = new Map();
function addBgm(ctx, out, pl, T0, dur, vol, nb, rnd) {
  const { tm } = pl, beat = 60 / 96, bar = beat * 4, e8 = beat / 2;
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const bus = ctx.createGain(), lv = .35 * vol;
  bus.gain.setValueAtTime(.0001, 0); bus.gain.linearRampToValueAtTime(lv, 1.6);
  bus.gain.setValueAtTime(lv, Math.max(1.7, tm.off - .1)); bus.gain.linearRampToValueAtTime(.0001, tm.off + .7);
  bus.connect(out);
  const CH = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]], BASS = [41, 40, 38, 36];
  const pf = ctx.createBiquadFilter(); pf.type = 'lowpass'; pf.Q.value = .8;
  pf.frequency.setValueAtTime(260, 0); pf.frequency.exponentialRampToValueAtTime(1500, Math.max(.5, tm.asm));
  pf.frequency.setValueAtTime(1500, tm.push0); pf.frequency.linearRampToValueAtTime(3200, tm.push1); pf.frequency.linearRampToValueAtTime(1500, tm.K + 2);
  for (const [a, b, f] of pl.chs.flatMap(x => x.p.lp || [])) { pf.frequency.setValueAtTime(1500, a); pf.frequency.exponentialRampToValueAtTime(f, a + .5); pf.frequency.setValueAtTime(f, b - .5); pf.frequency.exponentialRampToValueAtTime(1500, b); }
  pf.connect(bus);
  for (let b = Math.max(0, Math.floor((T0 - 3) / bar)); b * bar < T0 + dur; b++) {
    const t0 = b * bar;
    for (const m of CH[b % 4]) for (const dt of [-8, 8]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = dt;
      const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t0); g.gain.linearRampToValueAtTime(.045, t0 + .6); g.gain.setValueAtTime(.045, t0 + bar - .2); g.gain.linearRampToValueAtTime(.0001, t0 + bar + .4);
      o.connect(g).connect(pf); o.start(t0); o.stop(t0 + bar + .45);
    }
  }
  const af = ctx.createBiquadFilter(); af.type = 'lowpass'; af.frequency.value = 2400;
  const dl = ctx.createDelay(1); dl.delayTime.value = beat * .75; const fb = ctx.createGain(); fb.gain.value = .32; const wet = ctx.createGain(); wet.gain.value = .5;
  af.connect(bus); af.connect(dl); dl.connect(fb).connect(dl); dl.connect(wet).connect(bus);
  const PAT = [0, 1, 2, 3, 2, 1, 3, 1];
  for (let j = Math.max(Math.ceil((tm.asm + .3) / e8), Math.ceil((T0 - 1) / e8)); j * e8 < Math.min(T0 + dur, tm.mEnd + .5); j++) {
    const t = j * e8, m = CH[Math.floor(t / bar + 1e-6) % 4][PAT[j % 8]] + 12;
    const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = mtof(m);
    const g = ctx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.16, t + .005); g.gain.exponentialRampToValueAtTime(.0001, t + .22);
    o.connect(g).connect(af); o.start(t); o.stop(t + .25);
  }
  const hit = (t, len, f, type, peak, q = .7) => {
    const s = ctx.createBufferSource(); s.buffer = nb; const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(.0001, t + len); s.connect(fl).connect(g).connect(bus); s.start(t, rnd() * .5, len + .05);
  };
  const bl = ctx.createBiquadFilter(); bl.type = 'lowpass'; bl.frequency.value = 700; bl.connect(bus);
  const quiet = pl.chs.flatMap(x => x.p.quiet || []);
  const drums = t => t >= tm.I - .05 && t < tm.mEnd && !(t >= tm.open && t < tm.stamp - .01) && !quiet.some(([a, b]) => t >= a && t < b);
  for (let j = Math.max(Math.ceil((tm.I - .05) / e8), Math.ceil((T0 - 2) / e8)); j * e8 < Math.min(T0 + dur, tm.mEnd + .2); j++) {
    const t = j * e8, pos = j % 8, bi = Math.floor(t / bar + 1e-6);
    if ([0, 3, 6].includes(pos)) {
      const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = mtof(BASS[bi % 4] + (pos === 6 ? 7 : 0));
      const len = pos === 0 ? beat * 1.4 : beat * .45, g = ctx.createGain();
      g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(.4, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + len);
      o.connect(g).connect(bl); o.start(t); o.stop(t + len + .05);
    }
    if (!drums(t)) continue;
    if (pos === 0 || pos === 4 || (pos === 5 && bi % 2)) {
      const o = ctx.createOscillator(); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(45, t + .25);
      const g = ctx.createGain(); g.gain.setValueAtTime(.7, t); g.gain.exponentialRampToValueAtTime(.0001, t + .32); o.connect(g).connect(bus); o.start(t); o.stop(t + .35);
    }
    if (t >= tm.P - .05) {
      if (pos === 2 || pos === 6) hit(t, .16, 1600, 'bandpass', .3, .8);
      hit(t, .04, 7000, 'highpass', pos % 2 ? .12 : .06);
      if (t >= tm.A && t < tm.K) hit(t + e8 / 2, .03, 8000, 'highpass', .05);
    }
  }
  hit(tm.stamp, 1.8, 5000, 'highpass', .18);
  hit(tm.push1, 1.2, 5000, 'highpass', .1);
}
// 分段文件：音轨只渲染 [T0, T0 + dur]，所有排程时间整体前移 T0
function shiftCtx(rc, T0) {
  if (!T0) return rc;
  const S = t => Math.max(0, t - T0);
  const P = p => { for (const m of ['setValueAtTime', 'linearRampToValueAtTime', 'exponentialRampToValueAtTime']) { const f = p[m].bind(p); p[m] = (v, t) => f(v, S(t)); } };
  const N = n => {
    for (const k of ['gain', 'frequency', 'detune', 'Q', 'delayTime', 'playbackRate']) if (n[k] instanceof AudioParam) P(n[k]);
    if (n.start) { const st = n.start.bind(n); n.start = (t = 0, off, d) => { const lag = Math.max(0, T0 - t); if (off === undefined) return st(S(t)); if (d === undefined) return st(S(t), off + lag); if (d > lag) st(S(t), off + lag, d - lag); }; }
    if (n.stop) { const sp = n.stop.bind(n); n.stop = t => sp(S(t)); }
    return n;
  };
  const sc = { destination: rc.destination, sampleRate: rc.sampleRate, createBuffer: (...a) => rc.createBuffer(...a) };
  for (const m of ['createOscillator', 'createGain', 'createBiquadFilter', 'createBufferSource', 'createDelay']) sc[m] = (...a) => N(rc[m](...a));
  return sc;
}
function buildSfx(pl, T0, dur, opt) {
  const key = JSON.stringify(pl.tm) + pl.chs.map(x => x.p.start).join() + T0 + '/' + dur + JSON.stringify(opt);
  if (SFX.has(key)) return SFX.get(key);
  const job = (async () => {
    const sr = 32000, rc = new OfflineAudioContext(1, Math.ceil(sr * (dur + .5)), sr), ctx = shiftCtx(rc, T0);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const nb = ctx.createBuffer(1, sr, sr), nd = nb.getChannelData(0); for (let i = 0; i < nd.length; i++) nd[i] = rnd() * 2 - 1;
    const out = ctx.createGain(); out.gain.value = .8; out.connect(ctx.destination);
    const env = (g, t, peak, a, len) => { g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(.0001, t + len); };
    const noise = (t, len, f, q, peak, f2, a = .003, type = 'bandpass') => {
      const s = ctx.createBufferSource(); s.buffer = nb; const bp = ctx.createBiquadFilter(); bp.type = type; bp.Q.value = q;
      bp.frequency.setValueAtTime(f, t); if (f2) bp.frequency.exponentialRampToValueAtTime(f2, t + len);
      const g = ctx.createGain(); env(g, t, peak, a, len); s.connect(bp).connect(g).connect(out); s.start(t, rnd() * .5, len + .05);
    };
    const tone = (t, f, len, peak, type = 'sine', f2) => {
      const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len);
      const g = ctx.createGain(); env(g, t, peak, .006, len); o.connect(g).connect(out); o.start(t); o.stop(t + len + .05);
    };
    const fx = {
      key: t => { noise(t, .035, 2600 + rnd() * 1800, 1.4, .18); tone(t, 170 + rnd() * 50, .03, .045, 'triangle'); },
      on: t => { tone(t, 880, .3, .05); tone(t + .05, 1320, .4, .04); },
      ping: t => { tone(t, 1046.5, .5, .065); tone(t + .11, 1568, .8, .055); },
      whoosh: t => noise(t, .55, 300, .9, .2, 3600, .3),
      thump: t => { tone(t, 150, .4, .38, 'sine', 40); noise(t, .09, 800, .8, .22); },
      crt: t => { noise(t, .12, 1200, .6, .3); tone(t, 60, .5, .18, 'sine', 45); tone(t + .05, 15000, 1.4, .012); },
      crtoff: t => { tone(t, 900, .35, .06, 'sine', 80); noise(t + .25, .2, 2000, .7, .15); },
      blip: t => tone(t, 1200, .06, .05, 'square'),
      hi: t => { tone(t, 523, .09, .05, 'square'); tone(t + .09, 784, .14, .05, 'square'); },
      jump: t => tone(t, 300, .18, .05, 'square', 820),
      step: t => tone(t, 180 + rnd() * 40, .04, .04, 'square'),
      assemble: t => { for (let i = 0; i < 8; i++) tone(t + i * .06, 600 + i * 140, .08, .03, 'square'); },
      sparkle: t => { for (let i = 0; i < 6; i++) tone(t + i * .09, 1400 + rnd() * 1600, .2, .02); },
      glitch: t => { for (let i = 0; i < 5; i++) noise(t + i * .035 + rnd() * .02, .03, 400 + rnd() * 5000, 3, .16); tone(t, 90, .12, .06, 'sawtooth'); },
      page: t => noise(t, .35, 1800, .5, .14, 600, .1),
      snip: t => { noise(t, .04, 5200, 2, .2); tone(t, 2400, .03, .04, 'square'); noise(t + .07, .03, 6400, 2, .16); },
      stick: t => { noise(t, .07, 900, 1, .26); tone(t, 220, .08, .08, 'triangle', 140); },
      buzz: t => { tone(t, 140, .32, .06, 'sawtooth'); tone(t, 147, .32, .05, 'square'); },
      sweep: t => tone(t, 200, 1.2, .03, 'triangle', 700),
      save: t => { tone(t, 660, .08, .045, 'square'); tone(t + .08, 990, .08, .045, 'square'); tone(t + .16, 1320, .18, .045, 'square'); },
      whistle: t => { tone(t, 1400, .25, .035, 'sine', 1900); tone(t + .32, 1900, .35, .035, 'sine', 1250); },
      shatter: t => { noise(t, .7, 2600, .5, .32, 300); for (let i = 0; i < 7; i++) tone(t + i * .045, 2200 - i * 260, .09, .03, 'square'); },
      lock: t => { noise(t, .03, 3200, 2, .22); tone(t + .05, 520, .07, .06, 'square'); tone(t + .1, 780, .1, .05, 'square'); },
      rewind: t => { tone(t, 1600, .5, .04, 'sawtooth', 200); noise(t, .5, 3000, 1, .1, 600); },
    };
    fx.pix = t => tone(t, 1500 + rnd() * 900, .07, .025, 'square');
    if (opt.sfx) for (const [t, k] of sfxEvents(pl)) if (t >= Math.max(0, T0 - .6) && t < T0 + dur) fx[k](t);
    if (opt.bgm) addBgm(ctx, out, pl, T0, dur, opt.vol, nb, rnd);
    return { url: URL.createObjectURL(toWav(await rc.startRendering())), dur };
  })().catch(e => { console.warn('音效不可用：', e); return null; });
  SFX.set(key, job); return job;
}
function AudioTrack({ opt, pl, t0 = 0, dur }) {
  const { time, playing } = useComposition();
  const ref = useRef(null);
  const [trk, setTrk] = useState(null);
  useEffect(() => { let live = true; buildSfx(pl, t0, dur, opt).then(t => live && setTrk(t)); return () => { live = false; }; }, [pl, t0, dur, opt]);
  useEffect(() => {
    const v = ref.current; if (!v) return;
    v.muted = !(opt.sfx || opt.bgm);
    if (playing) { if (Math.abs(v.currentTime - time) > .25) v.currentTime = time; if (v.paused) v.play().catch(() => {}); }
    else { if (!v.paused) v.pause(); if (Math.abs(v.currentTime - time) > .04) v.currentTime = time; }
  }, [time, playing, opt, trk]);
  if (!trk) return null;
  return <video key={trk.url} ref={ref} src={trk.url} playsInline preload="auto" data-om-exportable-video-play-start="0" data-om-exportable-video-play-end={trk.dur}
    style={{ position: 'absolute', left: 0, top: 0, width: 1, height: 1, opacity: 0, pointerEvents: 'none' }} />;
}

// ---------- 章节模块：vc-chNN.jsx 注册到 window.VC_CH[n] ----------
const V = { W, H, COL, SANS, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, heat, typedN, typingOn, blink, fsOf, drawTyped, drawTokens, cursorAt,
  wrapWords, wrapChars, wrapCap, drawPara, popScale, dotsFor, drawClawd, jumpPos };
const CHM = new Map();
function chapters() {
  const R = window.VC_CH || {};
  return Object.keys(R).map(Number).sort((a, b) => a - b).map(n => {
    const c = CHM.get(n);
    if (c && c.build === R[n]) return c.mod;
    const mod = { n, ...R[n](V) }; CHM.set(n, { build: R[n], mod }); return mod;
  });
}
function activeCh(pl, T, key) { let r = null; for (const x of pl.chs) if (T >= x.p[key]) r = x; return r; }
// 时间轴段落合并过（上限 50 段）：按各章 PARTS 展开出章内小节的起点
function expandCues(C) {
  const out = {};
  for (const k of Object.keys(C)) out[k] = C[k];
  for (const m of chapters()) for (const [g, ps] of Object.entries(m.parts || {})) {
    let t = out[g];
    if (typeof t !== 'number' || !isFinite(t)) continue;
    for (const [n, d] of ps) { if (out[n] === undefined) out[n] = Math.round(t * 1000) / 1000; t += d; }
  }
  return out;
}
// 全片段落（作者时长）。主持方编辑器只显示 5 分钟，全片拆成几个分段文件；
// 分段文件只带自己的段落，其余段落按这张表补齐，画面和音乐按全片时间计算
const ALL_SCENES = [{"name":"片头","dur":5},{"name":"自我介绍","dur":5},{"name":"帖子","dur":27},{"name":"年度词","dur":7.5},{"name":"界线","dur":11.5},{"name":"项目轴","dur":12},{"name":"贯穿任务","dur":11},{"name":"02 章节卡 · 上下文窗口","dur":26.5},{"name":"02 知识截止 · Agent 循环","dur":29},{"name":"02 塞满","dur":15.5},{"name":"02 压缩 · 三个控制点","dur":17},{"name":"03 章节卡 · 一句话 · 随手挑","dur":28},{"name":"03 五部分 · 为什么","dur":31},{"name":"03 清楚版 · 报错","dur":23},{"name":"03 拆小 · 老套路","dur":27},{"name":"04 章节卡 · 情况","dur":12},{"name":"04 分层","dur":23},{"name":"04 研究 · 手写 · 指定文件","dur":31},{"name":"04 新对话 · 文档","dur":25.5},{"name":"05 章节卡 · 额度 · 重发 · 赛跑","dur":28.5},{"name":"05 算账 · 三档","dur":28.5},{"name":"05 思考强度 · 预算 · 排行榜","dur":27.7},{"name":"05 国内 · 换模型 · 免费版","dur":26.2},{"name":"06 章节卡 · 怪事 · 外层 · 部件","dur":35.5},{"name":"06 发动机 · 成绩 · 其他模型","dur":30},{"name":"06 梯子 · RedAccess","dur":33},{"name":"06 七项 · 建议 · 打架","dur":29},{"name":"07 章节卡 · 一口气 · 原因","dur":25.5},{"name":"07 流程 · 存档","dur":35},{"name":"07 分支 · 测试","dur":19.5},{"name":"07 三次 · 基础","dur":25},{"name":"08 章节卡 · 全部通过 · diff","dur":21},{"name":"08 假完成 · 写死","dur":24.5},{"name":"08 编造 · 抢注","dur":25.5},{"name":"08 三件事 · 查包 · METR","dur":45.5},{"name":"09 章节卡 · 明文密码 · 泄露","dur":40.5},{"name":"09 不作废 · 代码安全","dur":25.5},{"name":"09 PocketOS","dur":34},{"name":"09 密钥 · 确认 · 注入 · 别发","dur":51},{"name":"片尾 清单","dur":24}];
function fullCues(C, total) {
  const at = ALL_SCENES.findIndex(s => s.name in C);
  if (at <= 0) return { C, total, off: 0 };
  const r = x => Math.round(x * 1000) / 1000, out = {};
  let t = 0;
  for (let i = 0; i < at; i++) { out[ALL_SCENES[i].name] = r(t); t += ALL_SCENES[i].dur; }
  const off = r(t);
  for (const k of Object.keys(C)) out[k] = r(off + C[k]);
  t = off + total;
  for (let i = at; i < ALL_SCENES.length; i++) { const s = ALL_SCENES[i]; if (!(s.name in C)) { out[s.name] = r(t); t += s.dur; } }
  return { C: out, total: r(t), off };
}
function planAll(C, total) {
  C = expandCues(C);
  const p1 = plan(C, total);
  const chs = chapters().map(m => ({ m, p: m.plan(C, total) })).filter(x => x.p).sort((a, b) => a.p.start - b.p.start);
  p1.tm.chEnd = chs.length ? chs[0].p.start : total;
  p1.tm.mEnd = chs.length ? p1.tm.off : p1.tm.bye + 1;
  chs.forEach((x, i) => { x.p.end = i + 1 < chs.length ? chs[i + 1].p.start : total; });
  const pl = { ...p1, chs, total };
  chs.forEach((x, i) => { const pv = chs[i - 1], t = x.p.actorFrom - 1e-3, st = pv ? pv.m.clawd(t, pv.p) : clawdAt(t, pl); x.p.prev = [st.x, st.y, st.px]; });
  pl.caps = p1.caps.concat(...chs.map(x => x.p.caps));
  pl.cam = p1.cam.concat(...chs.map(x => x.p.cam)).sort((a, b) => a[0] - b[0]);
  pl.bounds = p1.bounds.concat(...chs.map(x => x.p.bounds));
  pl.rips = chs.flatMap(x => x.p.rips || []);
  pl.shakes = chs.flatMap(x => x.p.shakes || []);
  return pl;
}

function Piece({ tw }) {
  const { T: Tp, CUES, authoredTotal } = useComposition();
  const fc = useMemo(() => fullCues(CUES, authoredTotal), [CUES, authoredTotal]);
  const pl = useMemo(() => planAll(fc.C, fc.total), [fc]);
  const T = Tp + fc.off;
  const [fv, setFv] = useState(0);
  const opt = useMemo(() => ({ sfx: tw.sfx !== false, bgm: tw.bgm !== false, vol: tw.bgmVol ?? .6 }), [tw.sfx, tw.bgm, tw.bgmVol]);
  useEffect(() => {
    const txt = SCENE_TEXT + pl.caps.map(c => c.text).join('') + pl.chs.map(x => x.p.text || '').join('');
    Promise.all([400, 500, 600, 700].map(w => document.fonts.load(font(w, 40), txt)).concat(
      [400, 600, 700].map(w => document.fonts.load(font(w, 40, MONO), 'Vibe Coding if return 0123456789'))))
      .then(() => document.fonts.ready).then(() => setFv(v => v + 1)).catch(() => setFv(v => v + 1));
  }, []);
  return (
    <div data-screen-label={`t=${Math.floor(T)}s`} style={{ position: 'absolute', left: 0, top: 0, width: W, height: H, overflow: 'hidden', background: '#000' }}>
      <Frame T={T} pl={pl} tw={tw} fv={fv} />
      <AudioTrack opt={opt} pl={pl} t0={fc.off} dur={authoredTotal} />
    </div>
  );
}

function VibeApp() {
  const [t, setTweak] = useTweaks(window.TWEAK_DEFAULTS || { motionEditor: true, sfx: true, bgm: true, bgmVol: .6, quality: '高', fx: 1, crt: 1, subtitleSize: 46 });
  return (
    <>
      <CompositionStage width={W} height={H} scenes={window.OM_SCENES} playback={window.OM_PLAYBACK} bg="#000">
        <Piece tw={t} />
      </CompositionStage>
      <TweaksPanel>
        <TweakSection label="时间轴" />
        <TweakToggle label="Motion editor" value={t.motionEditor} onChange={v => setTweak('motionEditor', v)} />
        <TweakSection label="声音" />
        <TweakToggle label="合成音效" value={t.sfx} onChange={v => setTweak('sfx', v)} />
        <TweakToggle label="背景音乐" value={t.bgm} onChange={v => setTweak('bgm', v)} />
        <TweakSlider label="音乐音量" value={t.bgmVol} min={0} max={1} step={.05} onChange={v => setTweak('bgmVol', v)} />
        <TweakSection label="着色器" />
        <TweakRadio label="渲染分辨率" value={t.quality} options={['流畅', '高', '原生']} onChange={v => setTweak('quality', v)} />
        <TweakSlider label="特效强度" value={t.fx} min={0} max={1.5} step={.05} onChange={v => setTweak('fx', v)} />
        <TweakSlider label="CRT 显示器感" value={t.crt} min={0} max={1} step={.05} onChange={v => setTweak('crt', v)} />
        <TweakSection label="字幕" />
        <TweakSlider label="字号" value={t.subtitleSize} min={36} max={60} step={1} unit="px" onChange={v => setTweak('subtitleSize', v)} />
      </TweaksPanel>
    </>
  );
}
window.VibeApp = VibeApp;
