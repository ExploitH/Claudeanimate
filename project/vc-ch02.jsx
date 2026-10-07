// 第 2 章　AI 写代码时在做什么
(window.VC_CH = window.VC_CH || {})[2] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, heat, blink, typingOn, drawTyped, drawTokens, cursorAt, popScale, dotsFor, jumpPos } = V;
const { Easing, clamp } = window;
const N = ['02 章节卡', '02 上下文窗口', '02 知识截止', '02 Agent 循环', '02 塞满', '02 压缩', '02 三个控制点'];
const BX = { x0: 230, x1: 790, y0: 190, y1: 850, lim: 262 };
const COLX = 250, COLW = 410, BH = 46, BG = 8, FLOOR = 846;
const C0 = [560, 720, 22], CIN = [726, 846, 8], CSIDE = [880, 846, 8], CEND = [960, 790, 12];
const CP = [[400, 700, 10], [960, 700, 10], [1520, 700, 10]];
const TR = { cx: 1330, cy: 530, rx: 370, ry: 210 };
const NODES = ['读文件', '想下一步', '调用工具', '看结果'];
const nodeXY = j => { const a = Math.PI * (1 + j / 2); return [TR.cx + TR.rx * Math.cos(a), TR.cy + TR.ry * Math.sin(a)]; };
const TL = { x0: 940, x1: 1740, y: 340, cut: 1330 };
const CHT = { x0: 1000, x1: 1720, y0: 310, y1: 720 };
const CARD = { y: 240, w: 500, h: 300 };
const CARDS = [
  { x: 150, c: COL.fn, n: '01', t: '给我看什么', s: '第 3–4 章 · 提示词、上下文' },
  { x: 710, c: COL.kw, n: '02', t: '用哪个模型', s: '第 5 章 · 选模型和费用' },
  { x: 1270, c: COL.type, n: '03', t: '用什么工具来运行我', s: '第 6 章 · Harness' },
];
const CHAT = [['你', '图书表怎么设计？', COL.fn], ['Clawd', '拆成 books 和 users 两张表', COL.clawd], ['你', '好，就按这个来', COL.fn]];
const CODE1 = [['auth', COL.vari], ['.', COL.text], ['login', COL.fn], ['(user, pwd);', COL.text]];
const CODE2 = [['auth', COL.vari], ['.', COL.text], ['verifyMagic', COL.fn], ['(pwd);', COL.text]];
const BLK = [
  ['系统设定', '工具内置', COL.kw], ['你说的话', '加个登录功能', COL.fn], ['读过的文件', 'BookService.java', COL.type], ['命令输出', '运行结果', COL.num],
  ['读过的文件', 'UserService.java', COL.type], ['命令输出', '测试日志', COL.num], ['读过的文件', 'User.java', COL.type], ['命令输出', '报错堆栈', COL.num],
  ['读过的文件', 'AuthFilter.java', COL.type], ['命令输出', '测试日志', COL.num], ['读过的文件', 'PasswordUtil.java', COL.type],
];
const THROWN = i => i >= 4 && i <= 8;
const GLY = '#%&@?*$';
const scr = (s, m, T) => { const f = Math.floor(T * 10); return [...s].map((ch, i) => ch !== ' ' && hash(i * 7.3 + f * 1.7 + s.length) < m * .55 ? GLY[Math.floor(hash(i + f * 3.1) * GLY.length)] : ch).join(''); };
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, Wn, Kc, L, F, Z, Tc] = N.map(n => C[n]);
  const laps = [[L + 10, L + 14.4], [L + 14.4, L + 17.4], [L + 17.4, F + 1.3], [F + 1.3, F + 3.4], [F + 3.4, F + 5.3]];
  const land = [Wn + 14.6, Wn + 16, Wn + 17.3, Wn + 18.8, ...laps.map(l => l[1] + .7), Z + .5, Z + 1.1];
  const tm = { S, Wn, Kc, L, F, Z, Tc, laps, land,
    dots: S + .6, nod: S + 3.2,
    box: Wn + .2, chat: Wn + .9, ghost: Wn + 2.3, q1: Wn + 2.6, pulse: Wn + 4.4, chatOut: Wn + 8.2, limit: Wn + 10.2,
    tl: Kc + .3, flag: Kc + .9, fog: Kc + 1.6, lib: Kc + 3.6, warn: Kc + 6.2, bad: Kc + 8.2,
    track: L + .6, out: L + 4.2,
    messy: F + 2.5, sit: F + 5.3, trackOut: F + 5.6, chart: F + 6.4, lines0: F + 7, lines1: F + 10, band: F + 10.6, rot: F + 12.6,
    over: Z + 1.4, zip0: Z + 2, zip1: Z + 3, q2: Z + 3.2,
    cardT: [Tc + 2.4, Tc + 3.6, Tc + 4.8], arrows: Tc + 6.8,
  };
  const ty = {
    chName: { s: S + 1.5, cps: 16, text: 'AI 写代码时在做什么' },
    box: { s: Wn + .6, cps: 22, text: '// 上下文窗口' },
    cm: { s: Kc + 4.4, cps: 30, text: '// 我按老写法写的：' },
    c1: { s: Kc + 5, cps: 22, text: 'auth.login(user, pwd);' },
    n1: { s: Kc + 6.3, cps: 20, text: '// 3.0 已改名' },
    c2: { s: Kc + 6.8, cps: 22, text: 'auth.verifyMagic(pwd);' },
    n2: { s: Kc + 8.3, cps: 20, text: '// 不存在' },
    agent: { s: L + 1.2, cps: 12, text: 'Agent' },
    chT: { s: F + 6.4, cps: 30, text: '// Chroma 2025 · 18 个模型' },
    rot: { s: F + 12.6, cps: 14, text: 'context rot' },
  };
  const caps = [
    [S + .3, S + 5.2, '开工之前，先看看我写代码时脑子里到底在发生什么。'],
    [Wn + .3, Wn + 4.2, '先说个可能让你意外的事：我不记得你。'],
    [Wn + 4.2, Wn + 7.9, '每次回答，我只能看到上下文窗口里的东西。'],
    [Wn + 7.9, Wn + 13.2, '上下文窗口就是我一次能看到的全部内容，它有容量上限。'],
    [Wn + 13.2, Wn + 20.1, '里面装着工具给我的系统设定、你说的话、我读过的文件，还有命令的输出。'],
    [Kc + .3, Kc + 3.4, '我的知识停在训练截止的那天。'],
    [Kc + 3.4, Kc + 10.2, '之后才发布的新版本库，我可能按老写法写，甚至编一个不存在的方法出来。'],
    [L + .3, L + 4, '现在的编程助手大多是 Agent，也叫智能体，'],
    [L + 4, L + 9, '就是能自己调用工具、一轮轮干活直到完成任务的 AI。'],
    [L + 9, L + 14, '我干活是个循环：读文件，想下一步，调用工具改代码或跑命令，看结果，'],
    [L + 14, L + 18.2, '再想下一步，直到我觉得做完了。'],
    [F + .2, F + 6, '每转一圈，窗口里就多塞一点东西。塞得越满，我越容易漏看、搞混。'],
    [F + 6, F + 10.6, '这不只是我的毛病。Chroma 2025 年测了 18 个模型，'],
    [F + 10.6, F + 15.3, '输入越长表现越不稳，简单任务也一样。这现象叫 context rot。'],
    [Z + .2, Z + 5.6, '窗口满了，工具会把前面的内容压缩掉，细节也就跟着丢了。'],
    [Tc + .3, Tc + 6.6, '所以你能动手脚的地方有三处：给我看什么，用哪个模型，用什么工具来运行我。'],
    [Tc + 6.6, Tc + 9.6, '后面就按这个顺序来。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0], [S + 5.6, 1.54, .06, .02, 0, 0, 0],
    [Wn + .8, 1.6, .12, .03, 0, 0, .01], [Wn + 7.9, 1.52, .05, .02, 0, -.04, .01],
    [Wn + 13.4, 1.36, -.06, .02, 0, -.3, .01], [Wn + 20, 1.4, -.09, .03, 0, -.26, .01],
    [Kc + 1, 1.58, .1, .03, 0, .02, 0], [Kc + 10.3, 1.5, .14, .04, 0, .08, 0],
    [L + 1.4, 1.6, .2, .07, 0, .06, .02], [L + 9.6, 1.54, .26, .1, 0, .1, .03], [L + 18.2, 1.56, .3, .12, -.01, .1, .03],
    [F + 6.2, 1.56, .16, .07, 0, .08, .02], [F + 15.2, 1.5, .06, .04, 0, .1, 0],
    [Z + .9, 1.22, -.1, .02, 0, -.36, .04], [Z + 5.8, 1.18, -.14, .02, .01, -.38, .04],
    [Tc + .8, 1.62, .04, .04, 0, 0, .04], [Tc + 10.8, 1.54, .12, .06, 0, 0, .04],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'], [Wn - .1, 'jump'], [tm.box, 'sweep'], [tm.chat, 'on'], [tm.ghost, 'whoosh'], [tm.ghost + .6, 'blip'], [tm.q1, 'blip'],
    [tm.pulse, 'on'], [tm.limit, 'sweep'], [tm.tl, 'sweep'], [tm.flag, 'thump'], [tm.lib, 'blip'], [tm.warn, 'on'], [tm.bad, 'glitch'],
    [tm.track, 'sweep'], [tm.out, 'jump'], [tm.sit, 'jump'], [tm.chart, 'sweep'], [tm.rot, 'glitch'],
    [tm.over, 'glitch'], [tm.over + .3, 'glitch'], [tm.zip0, 'whoosh'], [tm.zip0 + .1, 'crtoff'], [tm.q2, 'blip'],
    [Tc - .35, 'jump'], [Tc + 2, 'jump'], [Tc + 3.2, 'jump'], [Tc + 4.4, 'jump'], [Tc + 6.4, 'jump'],
    ...tm.cardT.map(t => [t, 'assemble']), [tm.arrows, 'on'], [tm.arrows + .4, 'on'], [tm.arrows + .9, 'ping']];
  land.forEach((t, i) => sfx.push([t, THROWN(i) ? 'pix' : 'thump']));
  laps.forEach(([a, b], i) => {
    for (let t = a; t < b; t += .14) sfx.push([t, 'step']);
    for (let j = 0; j < 4; j++) sfx.push([a + (b - a) * j / 4, i ? 'blip' : 'on']);
    sfx.push([b, 'whoosh']);
  });
  const text = [...CARDS.flatMap(c => [c.t, c.s]), ...CHAT.flat().filter(s => typeof s === 'string' && s[0] !== '#'), ...BLK.flatMap(b => [b[0], b[1]]), ...NODES,
    '窗口外 · 我看不见容量上限我学过的之后发布的训练截止新版本 · API 有改动表现输入长度 →示意压缩后的摘要智能体第轮 // 第 2 章', ...Object.values(ty).map(d => d.text)].join('');
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [Wn, 'fluid'], [Tc, 'dis']],
    rips: [[tm.bad, 1180 / 1920, 742 / 1080], [tm.over, 510 / 1920, BX.lim / 1080], [tm.zip0 + .2, 455 / 1920, 600 / 1080]],
    shakes: [[tm.over, .012], [tm.zip0, .018]],
    quiet: [[tm.zip0, tm.zip0 + 1.6]], lp: [[tm.zip0 - .1, Z + 5.2, 480]],
    hud: { num: '02', name: 'AI 写代码时在做什么', from: Wn + .3, srcs: [[F + 6, Tc - .2, '来源：Chroma, Context Rot, 2025-07']] },
  };
}

// ---------- 容器里的内容块 ----------
function stackOf(T, tm) {
  const kz = prog(T, tm.zip0, tm.zip1, MOTION.draw), items = [];
  let y = FLOOR;
  for (let i = 0; i < BLK.length; i++) {
    const tl = tm.land[i], th = THROWN(i), fd = th ? .7 : .45;
    if (T < tl - fd) break;
    let h = BH, g = BG;
    if (i >= 1 && i <= 7) { h = lerp(BH, BH / 7, kz); if (i < 7) g = lerp(BG, 0, kz); }
    if (T >= tl) { items.push({ i, x: COLX, y, w: COLW, h, a: 1, sq: T < tl + .25 ? Math.sin(Math.PI * (T - tl) / .25) : 0 }); y -= h + g; continue; }
    const k = (T - (tl - fd)) / fd;
    if (th) {
      const e = MOTION.draw(k), [nx, ny] = nodeXY(0), w = COLW * lerp(.4, 1, e);
      items.push({ i, x: lerp(nx - COLW * .2, COLX, e), y: lerp(ny - 30, y, e) - Math.sin(Math.PI * k) * 160, w, h: BH * lerp(.4, 1, e), a: Math.min(1, k * 4), fly: true });
    } else items.push({ i, x: COLX, y: lerp(80, y, Easing.easeInQuad(k)), w: COLW, h: BH, a: Math.min(1, k * 3), fly: true });
    break;
  }
  return { items, top: y, kz };
}
function drawBlock(ctx, b, x, y, w, h, a, mess, T) {
  if (h < .5 || a <= 0) return;
  ctx.globalAlpha = a;
  ctx.fillStyle = rgba(b[2], .16); ctx.strokeStyle = rgba(b[2], .85); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(x, y - h, w, h, Math.min(6, h / 2)); ctx.fill(); ctx.stroke();
  if (h > 30 && w > COLW * .8) {
    ctx.font = font(600, 22); ctx.fillStyle = b[2]; ctx.textAlign = 'left';
    ctx.fillText(mess > 0 ? scr(b[0], mess, T) : b[0], x + 18, y - h / 2);
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.textAlign = 'right';
    ctx.fillText(mess > 0 ? scr(b[1], mess, T) : b[1], x + w - 18, y - h / 2); ctx.textAlign = 'left';
  }
  ctx.globalAlpha = 1;
}
function drawSummary(ctx, T, tm, y) {
  const k = prog(T, tm.zip1 - .15, tm.zip1 + .4);
  ctx.fillStyle = rgba(COL.dim, .14); ctx.strokeStyle = rgba(COL.dim, .8); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.roundRect(COLX, y - BH, COLW, BH, 6); ctx.fill(); ctx.stroke();
  ctx.globalAlpha = k; ctx.font = font(600, 22); ctx.fillStyle = COL.text; ctx.fillText('压缩后的摘要', COLX + 18, y - BH / 2);
  ctx.save(); ctx.filter = 'blur(3px)'; ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.textAlign = 'right';
  ctx.fillText('User… 测试… 报错…', COLX + COLW - 18, y - BH / 2); ctx.restore();
  ctx.globalAlpha = 1;
}
function drawStack(ctx, T, tm, S) {
  const m = prog(T, tm.messy, tm.messy + 1.5) * (1 - S.kz), merged = S.kz >= .999;
  for (const it of S.items) {
    if (merged && it.i >= 2 && it.i <= 7) continue;
    if (merged && it.i === 1) { drawSummary(ctx, T, tm, it.y); continue; }
    let a = it.a, mess = 0;
    if (!it.fly && it.i >= 1 && it.i <= 8 && m > 0) { mess = m * (1 - it.i / 10); if (hash(Math.floor(T * 9) + it.i * 13) > .6) a *= 1 - .6 * mess; }
    if (S.kz > 0 && it.i >= 1 && it.i <= 7) a *= lerp(1, .55, S.kz);
    const sq = it.sq || 0, h = it.h * (1 - .14 * sq), w = it.w * (1 + .04 * sq);
    drawBlock(ctx, BLK[it.i], it.x - (w - it.w) / 2, it.y, w, h, a, mess, T);
  }
}
function drawBits(ctx, T, tm) {
  if (T < tm.zip0 || T > tm.zip1 + 1.6) return;
  for (let i = 0; i < 72; i++) {
    const age = T - (tm.zip0 + hash(i * 1.7) * .9), life = 1.3;
    if (age < 0 || age > life) continue;
    const ox = COLX + hash(i * 2.9) * COLW, oy = lerp(792, 430, hash(i * 4.1)), s = 6 + hash(i * 9.9) * 9;
    ctx.globalAlpha = 1 - age / life; ctx.fillStyle = BLK[1 + Math.floor(hash(i * 8.7) * 7)][2];
    ctx.fillRect(ox + (140 + hash(i * 6.1) * 420) * age, oy - (60 + hash(i * 7.3) * 220) * age + 120 * age * age, s, s);
  }
  ctx.globalAlpha = 1;
}
function drawBox(ctx, T, pl) {
  const { tm, ty } = pl, { x0, x1, y0, y1 } = BX;
  const k = prog(T, tm.box, tm.box + 1, MOTION.draw);
  if (k <= 0) return;
  const w = x1 - x0, h = y1 - y0, per = 2 * (w + h), pulse = bump(T, tm.pulse + .35, .4);
  const hot = prog(T, tm.over, tm.over + .15) * (1 - prog(T, tm.zip1, tm.zip1 + .8));
  ctx.globalAlpha = k; ctx.fillStyle = rgba(COL.fn, .035 + .06 * pulse); ctx.fillRect(x0, y0, w, h); ctx.globalAlpha = 1;
  ctx.strokeStyle = mixC(mixC(COL.line, COL.fn, .3 + .7 * pulse), COL.err, hot); ctx.lineWidth = 3;
  ctx.setLineDash([per * k, per]); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 14); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = font(400, 26, MONO); drawTyped(ctx, T, ty.box, x0, y0 - 34, COL.dim, T < ty.box.s + 1.6);
}
function drawLimit(ctx, T, tm, S) {
  const kl = prog(T, tm.limit, tm.limit + .7, MOTION.draw);
  if (kl <= 0) return;
  const { x0, x1, lim } = BX, hot = prog(T, tm.over, tm.over + .15) * (1 - prog(T, tm.zip1, tm.zip1 + .8));
  const fl = hot > 0 && Math.floor(T * 10) % 2 ? 1 : 0;
  ctx.strokeStyle = rgba(COL.err, .75 + .25 * fl); ctx.lineWidth = 2 + 2 * hot; ctx.setLineDash([12, 10]);
  ctx.beginPath(); ctx.moveTo(x0, lim); ctx.lineTo(x0 + (x1 - x0) * kl, lim); ctx.stroke(); ctx.setLineDash([]);
  ctx.globalAlpha = prog(T, tm.limit + .4, tm.limit + .9);
  ctx.font = font(600, 24); ctx.fillStyle = COL.err; ctx.textAlign = 'left'; ctx.fillText('容量上限', x1 + 28, lim);
  const fill = clamp((FLOOR - S.top) / (FLOOR - lim), 0, 1), gx = x1 + 12;
  ctx.fillStyle = COL.line; ctx.fillRect(gx, lim, 6, FLOOR - lim);
  ctx.fillStyle = heat(fill); ctx.fillRect(gx, FLOOR - (FLOOR - lim) * fill, 6, (FLOOR - lim) * fill);
  ctx.globalAlpha = 1;
}

// ---------- 窗外：昨天的对话 ----------
function drawChat(ctx, T, tm) {
  const ka = prog(T, tm.chat, tm.chat + .6), a = ka * (1 - prog(T, tm.chatOut, tm.chatOut + .8));
  if (a <= 0) return;
  const g = prog(T, tm.ghost, tm.ghost + 1, MOTION.draw), X = 1080, Y0 = 290, Wd = 620, Hd = 340;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 30 * (1 - ka));
  ctx.fillStyle = mixC(COL.card, COL.bg, g); ctx.strokeStyle = mixC(COL.line, COL.faint, g); ctx.lineWidth = 2;
  if (g > .5) ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.roundRect(X, Y0, Wd, Hd, 16); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.dim; ctx.fillText('// 昨天的对话', X + 36, Y0 + 48);
  CHAT.forEach(([who, s, c], i) => {
    const y = Y0 + 126 + i * 72;
    ctx.font = font(600, 24, MONO); ctx.fillStyle = mixC(c, COL.faint, g); ctx.fillText(who, X + 36, y);
    ctx.font = font(400, 30); ctx.fillStyle = mixC(COL.text, COL.faint, g); ctx.fillText(s, X + 150, y);
  });
  if (g > 0) {
    const cw = Wd / 31, chh = Hd / 17;
    ctx.globalCompositeOperation = 'destination-out'; ctx.fillStyle = '#000';
    for (let i = 0; i < 31; i++) for (let j = 0; j < 17; j++) if (hash(i * 7.7 + j * 1.9) < g * .42) ctx.fillRect(X + i * cw, Y0 + j * chh, cw + .5, chh + .5);
    ctx.globalCompositeOperation = 'source-over';
  }
  const kt = prog(T, tm.ghost + .6, tm.ghost + 1.1, MOTION.pop);
  if (kt > 0) popScale(ctx, X + Wd - 120, Y0, kt, () => {
    ctx.font = font(600, 24); const s = '窗口外 · 我看不见', w = ctx.measureText(s).width + 36;
    ctx.fillStyle = COL.bg; ctx.strokeStyle = COL.num; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(X + Wd - 20 - w, Y0 - 22, w, 44, 22); ctx.fill(); ctx.stroke();
    ctx.fillStyle = COL.num; ctx.fillText(s, X + Wd - 2 - w, Y0);
  });
  ctx.restore();
}

// ---------- 训练截止 ----------
function drawCutoff(ctx, T, pl) {
  const { tm, ty } = pl, out = 1 - prog(T, tm.L - .5, tm.L + .2);
  if (out <= 0) return;
  ctx.save(); ctx.globalAlpha = out;
  const kd = prog(T, tm.tl, tm.tl + 1.1, MOTION.draw), xm = lerp(TL.x0, TL.x1, kd);
  ctx.fillStyle = COL.dim; ctx.fillRect(TL.x0, TL.y - 2, Math.min(xm, TL.cut) - TL.x0, 4);
  if (xm > TL.cut) { ctx.strokeStyle = COL.faint; ctx.lineWidth = 3; ctx.setLineDash([10, 10]); ctx.beginPath(); ctx.moveTo(TL.cut, TL.y); ctx.lineTo(xm, TL.y); ctx.stroke(); ctx.setLineDash([]); }
  const ka = prog(T, tm.fog, tm.fog + .6);
  ctx.globalAlpha = out * ka; ctx.font = font(500, 26); ctx.textAlign = 'center';
  ctx.fillStyle = COL.dim; ctx.fillText('我学过的', (TL.x0 + TL.cut) / 2, TL.y + 44);
  ctx.fillStyle = COL.faint; ctx.fillText('之后发布的', (TL.cut + TL.x1) / 2, TL.y + 44);
  ctx.textAlign = 'left';
  const kc = prog(T, tm.lib, tm.lib + .8), oy = 16 * (1 - kc);
  if (kc > 0) {
    ctx.globalAlpha = out * kc * .9; ctx.strokeStyle = COL.faint; ctx.lineWidth = 2; ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.roundRect(1420, 420 + oy, 300, 96, 12); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = font(500, 26, MONO); ctx.fillStyle = COL.dim; ctx.fillText('auth-lib 3.0', 1446, 452 + oy);
    ctx.font = font(400, 22); ctx.fillStyle = COL.faint; ctx.fillText('新版本 · API 有改动', 1446, 490 + oy);
  }
  if (ka > 0) {
    ctx.globalAlpha = out;
    for (let i = 0; i < 20; i++) for (let j = 0; j < 15; j++) {
      const h = hash(i * 3.7 + j * 11.3 + Math.floor(T * 3 + hash(i + j * 5) * 3) * 1.37);
      ctx.fillStyle = rgba(COL.dim, (.03 + .11 * h) * ka * Math.min(1, (i + 1) / 4));
      ctx.fillRect(TL.cut + 12 + i * 20, 236 + j * 20, 19, 19);
    }
  }
  const kf = prog(T, tm.flag, tm.flag + .5, MOTION.pop);
  if (kf > 0) {
    const kh = Math.min(kf, 1);
    ctx.globalAlpha = out; ctx.fillStyle = COL.num; ctx.fillRect(TL.cut - 2, TL.y - 96 * kh, 4, 96 * kh);
    popScale(ctx, TL.cut, TL.y - 118, kf, () => {
      ctx.fillStyle = COL.num; ctx.beginPath(); ctx.roundRect(TL.cut - 72, TL.y - 140, 144, 44, 22); ctx.fill();
      ctx.font = font(600, 24); ctx.fillStyle = COL.eye; ctx.textAlign = 'center'; ctx.fillText('训练截止', TL.cut, TL.y - 118); ctx.textAlign = 'left';
    });
  }
  ctx.globalAlpha = out;
  const X = 940;
  ctx.font = font(400, 28, MONO); drawTyped(ctx, T, ty.cm, X, 612, COL.faint, false);
  ctx.font = font(400, 38, MONO); const cw = ctx.measureText('0').width;
  const e1 = drawTokens(ctx, T, ty.c1, CODE1, X, 678), e2 = drawTokens(ctx, T, ty.c2, CODE2, X, 744);
  const kw = prog(T, tm.warn, tm.warn + .4);
  if (kw > 0) { ctx.fillStyle = COL.num; ctx.fillRect(X + 5 * cw, 702, 5 * cw * kw, 4); }
  const kb = prog(T, tm.bad, tm.bad + .4);
  if (kb > 0) {
    ctx.strokeStyle = COL.err; ctx.lineWidth = 3; ctx.beginPath();
    for (let s = 0; s <= 11 * cw * kb; s += 8) ctx[s ? 'lineTo' : 'moveTo'](X + 5 * cw + s, 770 + ((s / 8) % 2 ? 4 : -4));
    ctx.stroke();
  }
  ctx.font = font(400, 28, MONO); drawTyped(ctx, T, ty.n1, 1464, 680, COL.num, false); drawTyped(ctx, T, ty.n2, 1464, 746, COL.err, false);
  ctx.font = font(400, 38, MONO);
  if (blink(T) || typingOn(T, ty.c1, 0) || typingOn(T, ty.c2, 0)) {
    if (T >= ty.c1.s && T < ty.c2.s) cursorAt(ctx, e1, 678);
    else if (T >= ty.c2.s) cursorAt(ctx, e2, 744);
  }
  ctx.restore();
}

// ---------- Agent 循环 ----------
function lapState(T, tm) {
  const L = tm.laps;
  if (T < L[0][0]) return { th: Math.PI, run: false, i: -1 };
  for (let i = 0; i < L.length; i++) { const [a, b] = L[i]; if (T < b) return { th: Math.PI * (1 + 2 * (i + (T - a) / (b - a))), run: true, i }; }
  return { th: Math.PI, run: false, i: L.length };
}
function nodeGlow(T, tm, j) {
  let g = 0;
  tm.laps.forEach(([a, b]) => { for (const q of [j, j + 4]) { const tp = a + (b - a) * q / 4; if (q <= 4 && T >= tp) g = Math.max(g, Math.exp(-(T - tp) * 2.2)); } });
  return g;
}
function drawLoop(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.track - .2, tm.track + .4) * (1 - prog(T, tm.trackOut, tm.trackOut + .6));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const kd = prog(T, tm.track, tm.track + 1.2, MOTION.draw), ls = lapState(T, tm);
  ctx.strokeStyle = COL.line; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(TR.cx, TR.cy, TR.rx, TR.ry, 0, Math.PI, Math.PI * (1 + 2 * kd)); ctx.stroke();
  if (ls.run) { ctx.strokeStyle = rgba(COL.fn, .75); ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(TR.cx, TR.cy, TR.rx, TR.ry, 0, Math.PI * (1 + 2 * ls.i), ls.th); ctx.stroke(); }
  NODES.forEach((lab, j) => {
    const [x, y] = nodeXY(j), [a0, b0] = tm.laps[0], tp = a0 + (b0 - a0) * j / 4, kp = prog(T, tp - .15, tp + .25, MOTION.pop);
    if (kp <= 0) return;
    const g = nodeGlow(T, tm, j);
    if (g > .01) { const rg = ctx.createRadialGradient(x, y, 0, x, y, 70); rg.addColorStop(0, rgba(COL.fn, .55 * g)); rg.addColorStop(1, rgba(COL.fn, 0)); ctx.fillStyle = rg; ctx.fillRect(x - 70, y - 70, 140, 140); }
    ctx.fillStyle = mixC(COL.card, COL.fn, g); ctx.strokeStyle = mixC(COL.dim, COL.fn, g); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, 14 * kp, 0, 6.283); ctx.fill(); ctx.stroke();
    ctx.globalAlpha = a * Math.min(1, kp); ctx.font = font(600, 28); ctx.fillStyle = mixC(COL.dim, COL.text, Math.max(g, .5));
    const [lx, ly, al] = j === 0 ? [x - 20, y + 32, 'right'] : j === 2 ? [x + 20, y + 32, 'left'] : [x, y + (j === 1 ? 48 : 50), 'center'];
    ctx.textAlign = al; ctx.fillText(lab, lx, ly); ctx.textAlign = 'left'; ctx.globalAlpha = a;
  });
  ctx.font = font(700, 64, MONO); const aw = ctx.measureText(ty.agent.text).width;
  drawTyped(ctx, T, ty.agent, TR.cx - aw / 2, TR.cy - 26, COL.text, T < tm.laps[0][0], COL.kw);
  ctx.textAlign = 'center';
  ctx.globalAlpha = a * prog(T, ty.agent.s + .6, ty.agent.s + 1.2); ctx.font = font(500, 30); ctx.fillStyle = COL.dim; ctx.fillText('智能体', TR.cx, TR.cy + 34);
  if (ls.i >= 0) { ctx.globalAlpha = a; ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.fn; ctx.fillText(`// 第 ${Math.min(ls.i + 1, tm.laps.length)} 轮`, TR.cx, TR.cy + 88); }
  ctx.restore();
}

// ---------- Chroma：输入越长越不稳 ----------
function drawChart(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.chart - .2, tm.chart + .5) * (1 - prog(T, tm.Z - .2, tm.Z + .4));
  if (a <= 0) return;
  const { x0, x1, y0, y1 } = CHT;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(400, 26, MONO); drawTyped(ctx, T, ty.chT, x0, y0 - 56, COL.dim, false);
  ctx.font = font(400, 22); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('示意', x1, y0 - 56);
  const ka = prog(T, tm.chart + .2, tm.chart + 1, MOTION.draw);
  ctx.fillStyle = COL.line; ctx.fillRect(x0, y0, 2, (y1 - y0) * ka); ctx.fillRect(x0, y1 - 2, (x1 - x0) * ka, 2);
  ctx.globalAlpha = a * ka; ctx.font = font(500, 24); ctx.fillStyle = COL.dim;
  ctx.fillText('表现', x0 - 16, y0 + 12); ctx.fillText('输入长度 →', x1, y1 + 38); ctx.textAlign = 'left';
  const kb = prog(T, tm.band, tm.band + .6);
  if (kb > 0) { ctx.globalAlpha = a * kb; ctx.fillStyle = rgba(COL.err, .08); ctx.fillRect(x0 + (x1 - x0) * .55, y0, (x1 - x0) * .45, y1 - y0 - 2); }
  ctx.globalAlpha = a;
  const u1 = prog(T, tm.lines0, tm.lines1, Easing.linear), rot = prog(T, tm.rot, tm.rot + 1), HI = [2, 7, 13], HC = [COL.fn, COL.kw, COL.type];
  for (let m = 0; m < 18; m++) {
    const b0 = .82 + hash(m * 3.1) * .12, dr = .2 + hash(m * 5.7) * .5, pw = 1.2 + hash(m * 9.1) * 1.6, ph = hash(m * 1.3) * 50, hi = HI.indexOf(m);
    ctx.strokeStyle = hi >= 0 ? HC[hi] : rgba(COL.dim, .45); ctx.lineWidth = hi >= 0 ? 3 : 2;
    ctx.beginPath();
    for (let s = 0; s <= 60 * u1; s++) {
      const u = s / 60, nz = ((Math.sin(u * 23 + ph) + Math.sin(u * 51 + ph * 2)) * .5 * (.05 + .06 * rot) + Math.sin(u * 37 + T * 6 + ph) * .03 * rot) * u;
      const v = clamp(b0 - dr * Math.pow(u, pw) + nz, .02, 1), X = x0 + 8 + (x1 - x0 - 8) * u, Y = y1 - (y1 - y0) * v;
      s ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y);
    }
    ctx.stroke();
  }
  ctx.font = font(700, 52, MONO); const rw = ctx.measureText(ty.rot.text).width;
  drawTyped(ctx, T, ty.rot, x1 - rw, y0 + 24, COL.err, T < tm.Z, COL.err);
  ctx.restore();
}

// ---------- 章节卡与三个控制点 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 2 章', 1080, 330); ctx.globalAlpha = 1;
  const D = dotsFor('02', 300, 12, 700, MONO, fv);
  D.pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.Wn - .6);
}
function drawCards(ctx, T, pl) {
  const { tm } = pl, { y: Y0, w: Wd, h: Hd } = CARD;
  CARDS.forEach((cd, n) => {
    const t0 = tm.cardT[n], k = prog(T, t0, t0 + .8, Easing.linear), X = cd.x;
    if (k <= 0) return;
    if (k < 1) {
      for (let i = 0; i < 25; i++) for (let j = 0; j < 15; j++) {
        const hv = hash(i * 13.7 + j * 3.1 + n * 51); if (hv > k) continue;
        ctx.fillStyle = hv > k - .08 ? cd.c : COL.card; ctx.fillRect(X + i * Wd / 25, Y0 + j * Hd / 15, Wd / 25 + .5, Hd / 15 + .5);
      }
    } else { ctx.fillStyle = COL.card; ctx.strokeStyle = cd.c; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(X, Y0, Wd, Hd, 16); ctx.fill(); ctx.stroke(); }
    const lit = prog(T, tm.arrows + n * .4, tm.arrows + n * .4 + .4);
    ctx.globalAlpha = prog(T, t0 + .5, t0 + .9);
    ctx.font = font(600, 26, MONO); ctx.fillStyle = cd.c; ctx.fillText(cd.n, X + 36, Y0 + 52);
    ctx.font = font(600, 44); ctx.fillStyle = COL.text; ctx.fillText(cd.t, X + 36, Y0 + 146);
    ctx.fillStyle = mixC(COL.line, cd.c, lit); ctx.fillRect(X + 36, Y0 + 204, (Wd - 72), 2);
    ctx.font = font(500, 26); ctx.fillStyle = mixC(COL.dim, COL.text, lit); ctx.fillText(cd.s, X + 36, Y0 + 252);
    ctx.globalAlpha = 1;
  });
  for (const n of [0, 1]) {
    const k = prog(T, tm.arrows + n * .4 + .1, tm.arrows + n * .4 + .5, MOTION.draw);
    if (k <= 0) continue;
    const xa = CARDS[n].x + Wd + 8, xb = CARDS[n + 1].x - 8, y = Y0 + Hd / 2, xe = lerp(xa, xb, k);
    ctx.strokeStyle = COL.num; ctx.fillStyle = COL.num; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(xa, y); ctx.lineTo(xe, y); ctx.stroke();
    if (k > .8) { ctx.beginPath(); ctx.moveTo(xe + 2, y); ctx.lineTo(xe - 10, y - 8); ctx.lineTo(xe - 10, y + 8); ctx.fill(); }
  }
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.Wn) return drawCard(ctx, T, pl, fv);
  if (T >= tm.Tc) return drawCards(ctx, T, pl);
  const S = stackOf(T, tm);
  drawBox(ctx, T, pl);
  drawStack(ctx, T, tm, S);
  drawLimit(ctx, T, tm, S);
  drawBits(ctx, T, tm);
  if (T < tm.Kc + .2) drawChat(ctx, T, tm);
  if (T >= tm.Kc && T < tm.L + .3) drawCutoff(ctx, T, pl);
  if (T >= tm.L && T < tm.F + 6.3) drawLoop(ctx, T, pl);
  if (T >= tm.F + 6) drawChart(ctx, T, pl);
}

// ---------- Clawd ----------
function clawd(T, pl) {
  const { tm } = pl, n0 = nodeXY(0), N0 = [n0[0], n0[1], 8], prev = pl.prev || [960, 600, 12];
  const J = [
    [tm.S - .55, tm.S + .35, prev, C0], [tm.Wn - .1, tm.Wn + .6, C0, CIN], [tm.out, tm.out + .7, CIN, N0], [tm.sit, tm.sit + .7, N0, CSIDE],
    [tm.Tc - .35, tm.Tc + .35, CSIDE, CEND], [tm.Tc + 2, tm.Tc + 2.5, CEND, CP[0]], [tm.Tc + 3.2, tm.Tc + 3.7, CP[0], CP[1]],
    [tm.Tc + 4.4, tm.Tc + 4.9, CP[1], CP[2]], [tm.Tc + 6.4, tm.Tc + 7, CP[2], CEND],
  ];
  const r = jumpPos(T, J, prev), ls = lapState(T, tm);
  let [x, y, px] = r.p;
  if (ls.run && !r.air) { x = TR.cx + TR.rx * Math.cos(ls.th); y = TR.cy + TR.ry * Math.sin(ls.th) - Math.abs(Math.sin(T * 18)) * 5; }
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  for (const t of tm.land) if (T >= t && T < t + .2 && T < tm.out) st.squash = 1 - .12 * Math.sin(Math.PI * (T - t) / .2);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  if (T >= tm.S + .35 && T < tm.Wn - .1) st.eye = 1;
  if (T >= tm.nod && T < tm.nod + 1.3) st.nod = Math.sin((T - tm.nod) * 5) > .3;
  if (T >= tm.Wn + .9 && T < tm.Wn + 13) st.eye = 1;
  if (T >= tm.q1 && T < tm.q1 + 2) st.q = qk(T, tm.q1, 2);
  if (T >= tm.Wn + 13 && T < tm.Kc + .6) st.eye = -1;
  if (T >= tm.Kc + .6 && T < tm.out) st.eye = 1;
  if (T >= tm.Kc + 4.6 && T < tm.bad) { st.pose = 'type'; st.ph = T * 22; }
  if (T >= tm.bad && T < tm.bad + 1.8) st.sweat = T - tm.bad;
  if (T >= tm.out + .7 && T < tm.laps[0][0]) st.eye = 1;
  if (ls.run && !r.air) { st.walk = T * 18; st.eye = Math.sin(ls.th) < 0 ? 1 : -1; }
  if (T >= tm.messy && T < tm.Tc - .35) st.sweat = T - tm.messy;
  if (T >= tm.sit + .7 && T < tm.Z) st.eye = 1;
  if (T >= tm.Z && T < tm.Tc - .35) st.eye = -1;
  if (T >= tm.over && T < tm.over + .4) st.y -= Math.sin(Math.PI * (T - tm.over) / .4) * 34;
  if (T >= tm.q2 && T < tm.q2 + 2) st.q = qk(T, tm.q2, 2);
  for (const d of [2.5, 3.7, 4.9]) if (T >= tm.Tc + d && T < tm.Tc + d + .7) st.pose = 'up';
  return st;
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.Wn - .6, tm.Wn, Easing.linear), toc = prog(T, tm.Tc - .5, tm.Tc + .6);
  const fill = T >= tm.Wn && T < tm.Tc + .6 ? clamp((FLOOR - stackOf(T, tm).top) / (FLOOR - BX.lim), 0, 1) : 0;
  let gl = 0;
  if (T >= tm.ghost) gl = Math.max(gl, .25 * Math.exp(-(T - tm.ghost) * 6));
  if (T >= tm.bad) gl = Math.max(gl, .5 * Math.exp(-(T - tm.bad) * 5));
  if (T >= tm.rot && T < tm.rot + .8) gl = Math.max(gl, hash(Math.floor(T * 12)) > .5 ? .35 : .05);
  if (T >= tm.over && T < tm.over + .6) gl = Math.max(gl, hash(Math.floor(T * 14)) > .35 ? .8 : .2);
  if (T >= tm.zip0) gl = Math.max(gl, .6 * Math.exp(-(T - tm.zip0) * 3));
  let rays = 0, light = [.5, .44];
  if (T < tm.Wn) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T >= tm.Tc + 6) { rays = .35 * bump(T, tm.Tc + 7.6, .7); light = [.5, .36]; }
  return {
    gl, rays, light,
    energy: lerp(.38, 1, card) + .3 * fill * (1 - toc),
    warm: lerp(.1 + .75 * fill, .15, toc),
    floor: Math.max(.65 * card, .85 * prog(T, tm.L + .4, tm.L + 2) * (1 - prog(T, tm.Z - .4, tm.Z + .4)), prog(T, tm.Tc - .2, tm.Tc + 1)),
  };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"02 章节卡 · 上下文窗口":[["02 章节卡",6],["02 上下文窗口",20.5]],"02 知识截止 · Agent 循环":[["02 知识截止",10.5],["02 Agent 循环",18.5]],"02 塞满":[["02 塞满",15.5]],"02 压缩 · 三个控制点":[["02 压缩",6],["02 三个控制点",11]]};

return { plan, scene, clawd, fx, parts: TL_PARTS };
};
