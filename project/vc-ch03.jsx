// 第 3 章　提示词
(window.VC_CH = window.VC_CH || {})[3] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, blink, typedN, typingOn, drawTyped, cursorAt, popScale, dotsFor, jumpPos } = V;
const { Easing, clamp } = window;
const N = ['03 章节卡', '03 一句话', '03 随手挑', '03 五部分', '03 为什么', '03 清楚版', '03 报错', '03 拆小', '03 老套路'];
const C0 = [560, 720, 22], CA = [290, 846, 10], CF = [330, 846, 12], CE = [1650, 846, 13], CD = [960, 846, 13], CO = [1240, 760, 22];
const TRE = { rw: 320, cols: [650, 930, 1210, 1490], rows: [410, 670], nw: 210, nh: 64, hy: 262, res: 1740 };
const QS = [['密码怎么存', ['明文存', '加密存']], ['要不要注册', ['带注册', '只做登录']], ['输错几次锁定', ['不锁定', '5 次锁 15 分钟']], ['Session 还是 Token', ['Session', 'Token']]];
const WANT = [1, 1, 1, 0], GUESS = [0, 1, 0, 1];
const MINI = { ox: 520, oy: 730, s: .75 };
const PARTS = [['目标', COL.fn, '要做成什么'], ['背景', COL.type, '项目用什么技术、相关代码在哪'], ['约束', COL.num, '哪些文件别碰、能不能加新依赖'],
  ['验收标准', COL.str, '怎样算做完、怎么验证'], ['参考', COL.kw, '已有的类似代码或示例'], ['为什么', COL.clawdHi, '这么做的原因']];
const ROWY = [235, 345, 455, 565, 675, 785], CHX = 520, CHW = 210, DX = 780;
const SEGS = [['在 UserService 里', 1], ['加一个 login(username, password) 方法。', 0], ['密码用项目里已有的 PasswordUtil.verify() 校验。', 4],
  ['连续输错 5 次锁定 15 分钟。', 0], ['不要修改 User 类的字段，不要加新依赖。', 2], ['写完补 JUnit 测试，覆盖登录成功、密码错误、账号锁定三种情况，并运行通过。', 3]];
const PROMPT = SEGS.map(s => s[0]).join('');
const SEG_AT = (() => { let a = 0; return SEGS.map(([s]) => { const r = [a, a + s.length]; a += s.length; return r; }); })();
const CUT_SEG = [2, 1, 3, 4];
const FIELDS = [['完整报错和堆栈', COL.err], ['你做了什么操作', COL.fn], ['你期望的结果', COL.str], ['实际的结果', COL.num]];
const FY = [270, 440, 560, 680];
const TASKS = ['写 login 方法', '加锁定逻辑', '补 JUnit 测试'], TX = [400, 960, 1520];
const ASKS = [['先让我提问', COL.fn, 600], ['先让我出个方案', COL.kw, 1320]];
const STK = [['世界顶级程序员', COL.num, -60, -140, -.14, -700, -560], ['必须!!!', COL.err, 74, -86, .12, 760, -620], ['给你小费', COL.str, -34, -34, -.06, -980, 60]];
const OFFV = [[-620, -520, -4], [660, -480, 4.5], [-320, -680, -3]];
const SHOUT = '必须!!! 绝对不能改 User 类!!!', CALM = '不要修改 User 类的字段。';
const GLY = '#%&@?*$!';
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);
const scr = (s, m, T, sd) => { const f = Math.floor(T * 14); return [...s].map((ch, i) => ch !== ' ' && hash(i * 7.3 + f * 1.7 + sd) < m ? GLY[Math.floor(hash(i + f * 3.1) * GLY.length)] : ch).join(''); };
const toMini = (x, y) => [MINI.ox + (x - 290) * MINI.s, MINI.oy + (y - 540) * MINI.s];

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, A, R, F, Y, Q, E, D, O] = N.map(n => C[n]);
  const tm = { S, A, R, F, Y, Q, E, D, O,
    dots: S + .5,
    send: A + 4.9, morph: A + 5.1, pulse: A + 6.2, hT: [A + 8.6, A + 9.6, A + 10.7, A + 11.9],
    shut: R + .4, gT: [R + .9, R + 1.6, R + 2.3, R + 3, R + 3.7], wrong: R + 4.2, cover: R + 4.7, dim: R + 6.6, gout: R + 9.2,
    chip: [F + 4.3, F + 4.8, F + 5.3, F + 5.9, F + 6.5, Y + .4], dS: [F + 7.5, F + 8.9, F + 11.6, F + 16.4, F + 19.2, Y + 1.2], badge: Y + 3.6, nodY: Y + 5.6,
    cT: [Q + 7.5, Q + 8.4, Q + 9.3, Q + 10.2], glow: Q + 10.9,
    fT: [E + 3, E + 4.4, E + 5.9, E + 7.1], shot: E + 8.4,
    big: D + .3, split: D + 1.4, wT: [D + 2.6, D + 3, D + 3.4], qD: D + 5, ask: [D + 6.7, D + 8.2],
    stk: [O + 1.1, O + 3.1, O + 5.1], shake: O + 6.1, fly: O + 6.9, bub: O + 9.2, nodO: O + 10.6, shout: O + 11.8, over: O + 13.3, calm: O + 14.6, end: O + 16.8,
  };
  const ty = {
    chName: { s: S + 1.3, cps: 10, text: '提示词' },
    ask: { s: A + 3.4, cps: 7, text: '帮我写个登录功能' },
    gin: { s: R + 7, cps: 14, text: 'garbage in' },
    gout: { s: R + 8.3, cps: 14, text: 'garbage out' },
    fh: { s: F + 2.4, cps: 24, text: '// 一条写清楚的提示词' },
    ...Object.fromEntries(PARTS.map((p, i) => ['d' + i, { s: tm.dS[i], cps: 10, text: p[2] }])),
    pr: { s: Q + 1, cps: 28, text: PROMPT },
    et: { s: E + .6, cps: 24, text: '// 报错时，给我这四样' },
    e0a: { s: tm.fT[0] + .3, cps: 40, text: 'java.lang.NullPointerException' },
    e0b: { s: tm.fT[0] + 1.1, cps: 40, text: '    at UserService.login(UserService.java:42)' },
    e1: { s: tm.fT[1] + .3, cps: 14, text: '输入正确的账号密码，点登录' },
    e2: { s: tm.fT[2] + .3, cps: 12, text: '跳转到首页' },
    e3: { s: tm.fT[3] + .3, cps: 12, text: '页面显示 500 错误' },
    c1: { s: O + 9.6, cps: 14, text: CALM },
    sh: { s: O + 11.9, cps: 18, text: SHOUT },
  };
  const caps = [
    [A + .2, A + 2, '好，开工。'],
    [A + 2, A + 5.2, '第一次，你只给我发了一句：帮我写个登录功能。'],
    [A + 5.2, A + 8.4, '这句话里没说的事可太多了：'],
    [A + 8.4, A + 12.8, '密码怎么存，要不要注册，输错几次锁定，用 Session 还是 Token。'],
    [R + .2, R + 3.2, '每个没说的地方，我都只能自己挑一种做法，'],
    [R + 3.2, R + 6.6, '挑中的不一定是你想要的。'],
    [R + 6.6, R + 11.3, '这就是常说的 garbage in, garbage out：输入含糊，输出就靠不住。'],
    [F + .2, F + 2.2, '那换个写法。'],
    [F + 2.2, F + 7, '一条写清楚的提示词有五部分：目标、背景、约束、验收标准、参考。'],
    [F + 7, F + 11.2, '目标是要做成什么；背景是项目用什么技术、相关代码在哪；'],
    [F + 11.2, F + 15.8, '约束是哪些文件别碰、能不能加新依赖。'],
    [F + 15.8, F + 21.8, '验收标准是怎样算做完、怎么验证；参考是已有的类似代码或示例。'],
    [Y + .2, Y + 3, '最好再顺手写一句为什么要这样。'],
    [Y + 3, Y + 8.8, 'Anthropic 的官方指南也这么建议，知道了原因，我能判断得更贴合。'],
    [Q + .2, Q + 3.4, '来看同一个需求，写清楚以后长这样。'],
    [E + .2, E + 3, '程序报错的时候，给我四样东西：'],
    [E + 3, E + 8, '完整报错和堆栈、你做了什么操作、你期望的结果、实际的结果。'],
    [E + 8, E + 11.3, '界面出问题，直接甩截图就行。'],
    [D + .2, D + 4.2, '大任务拆成小任务，一个对话只干一件事。'],
    [D + 4.2, D + 9.8, '要是需求你自己还没想清楚，先让我提问，或者先让我出个方案。'],
    [O + .2, O + 5.4, '至于「你是世界顶级程序员」、全大写的「必须」、威胁我或者许诺给小费，'],
    [O + 5.4, O + 8.8, '这些老套路现在都用不着了。'],
    [O + 8.8, O + 11.6, '官方指南提到，新模型对指令更敏感，'],
    [O + 11.6, O + 14.4, '语气太重反而可能让我用力过猛。'],
    [O + 14.4, O + 16.8, '正常说话就好。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0],
    [A + .8, 1.4, .04, .02, 0, -.26, 0], [A + 5, 1.46, .05, .03, 0, -.22, 0], [A + 8.4, 1.62, .1, .04, 0, 0, 0], [A + 12.8, 1.6, .14, .05, 0, .04, 0],
    [R + .8, 1.56, .08, .04, 0, .04, 0], [R + 4.4, 1.4, .04, .03, 0, .32, 0], [R + 6.9, 1.6, 0, .02, 0, 0, 0], [R + 11.3, 1.56, -.04, .02, 0, 0, 0],
    [F + .8, 1.6, -.1, .04, 0, -.02, 0], [F + 11, 1.56, -.14, .05, 0, .02, 0], [F + 21.8, 1.54, -.08, .04, 0, .02, 0],
    [Y + 4, 1.5, -.04, .03, 0, .04, 0], [Y + 8.8, 1.52, -.02, .03, 0, .04, 0],
    [Q + .8, 1.6, .06, .02, 0, 0, 0], [Q + 7, 1.54, .1, .04, 0, -.04, 0], [Q + 11.3, 1.5, .14, .05, 0, .04, 0],
    [E + .9, 1.58, -.06, .03, 0, -.06, 0], [E + 11.3, 1.52, -.1, .03, 0, .02, 0],
    [D + .8, 1.6, .04, .03, 0, 0, 0], [D + 9.8, 1.52, .08, .04, 0, 0, 0],
    [O + .9, 1.36, 0, .02, 0, .12, 0], [O + 6.8, 1.3, .02, .02, .01, .14, 0], [O + 9.4, 1.5, -.02, .03, 0, 0, 0],
    [O + 13.4, 1.4, 0, .03, .01, .06, 0], [O + 15, 1.52, -.04, .03, 0, 0, 0], [O + 16.8, 1.54, -.06, .03, 0, 0, 0],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'], [A - .1, 'jump'], [tm.send, 'blip'], [tm.morph, 'whoosh'], [tm.pulse, 'on'],
    ...tm.hT.flatMap(t => [[t, 'on'], [t + .3, 'pix'], [t + .38, 'pix']]),
    [tm.shut, 'blip'], ...tm.gT.map(t => [t, 'blip']), [tm.wrong, 'buzz'], [tm.wrong, 'glitch'], [tm.cover, 'thump'], [tm.gout, 'glitch'], [tm.gout + .3, 'glitch'],
    [F + .1, 'jump'], ...tm.chip.map(t => [t, 'on']), [tm.badge, 'ping'],
    [Q + .3, 'jump'], ...tm.cT.flatMap(t => [[t - .5, 'jump'], [t, 'snip'], [t + .15, 'whoosh']]), [tm.glow - .5, 'jump'], [tm.glow, 'ping'],
    [E - .2, 'jump'], ...tm.fT.map(t => [t, 'on']), [tm.shot, 'whoosh'], [tm.shot + .6, 'thump'],
    [tm.big, 'thump'], [tm.split, 'glitch'], [tm.split + .05, 'assemble'], ...tm.wT.map(t => [t, 'on']), [D + 4, 'jump'], [tm.qD, 'blip'], ...tm.ask.map(t => [t, 'on']),
    [O - .3, 'jump'], ...tm.stk.map(t => [t, 'stick']), [tm.fly, 'whoosh'], [tm.fly + .06, 'whoosh'], [tm.bub, 'on'],
    [tm.shout - .1, 'glitch'], [tm.over, 'jump'], [tm.over + .05, 'glitch'], [tm.over + .8, 'thump'], [tm.calm, 'blip'], [tm.calm + .2, 'blip'], [tm.calm + .6, 'ping']];
  for (let t = tm.shake; t < tm.fly; t += .07) sfx.push([t, 'step']);
  const text = [...QS.flat(2), ...PARTS.flatMap(p => [p[0], p[2]]), PROMPT, ...FIELDS.map(f => f[0]), ...TASKS, ...ASKS.map(a => a[0]), ...STK.map(s => s[0]), SHOUT, CALM,
    '你结果不是你想要的登录功能对话 123截图Anthropic 官方指南+ // 第 3 章', ...Object.values(ty).map(d => d.text)].join('');
  const SRC = '来源：Anthropic, Prompting best practices';
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [F, 'fluid'], [Q, 'dis'], [O, 'fluid']],
    rips: [[tm.wrong, TRE.res / 1920, 540 / 1080], [tm.over + .8, CO[0] / 1920, CO[1] / 1080]],
    shakes: [[tm.wrong, .01], [tm.over + .8, .02]],
    quiet: [[tm.calm - .05, tm.calm + 1.3]],
    hud: { num: '03', name: '提示词', from: A + .3, srcs: [[Y + 3, Q - .2, SRC], [O + 8.8, tm.end, SRC]] },
  };
}

// ---------- 小工具 ----------
function box(ctx, x, y, w, h, fill, stroke, lw = 2, r = 14, dash) {
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
}
const bz = (x1, y1, x2, y2, t) => { const mx = (x1 + x2) / 2, u = 1 - t; return [u * u * u * x1 + 3 * u * t * mx + t * t * t * x2, u * u * u * y1 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y2]; };
function curve(ctx, x1, y1, x2, y2, k) {
  if (k <= 0) return;
  const n = Math.max(2, Math.ceil(24 * k));
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = bz(x1, y1, x2, y2, k * i / n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
}
const LINES = new Map();
function wrapIdx(ctx, s, maxW) {
  const key = ctx.font + '|' + maxW + '|' + s;
  if (LINES.has(key)) return LINES.get(key);
  const out = []; let a = 0;
  while (a < s.length) {
    let b = a + 1;
    while (b < s.length && ctx.measureText(s.slice(a, b + 1)).width <= maxW) b++;
    if (b < s.length) {
      let c = b;
      while (c > a + 1 && /[A-Za-z0-9_.()]/.test(s[c]) && /[A-Za-z0-9_.(]/.test(s[c - 1])) c--;
      if (c > a + 4) b = c;
      while (b > a + 1 && '，。、；：）)!'.includes(s[b])) b--;
    }
    out.push([a, b]); a = b; while (s[a] === ' ') a++;
  }
  LINES.set(key, out); return out;
}

// ---------- 决策树 ----------
const nodeC = (j, o) => [TRE.cols[j], TRE.rows[o]];
const EDGES = (() => {
  const E = [];
  for (const o of [0, 1]) E.push({ j: 0, a: null, b: [0, o] });
  for (let j = 1; j < 4; j++) for (const a of [0, 1]) for (const b of [0, 1]) E.push({ j, a: [j - 1, a], b: [j, b] });
  for (const o of [0, 1]) E.push({ j: 4, a: [3, o], b: null });
  return E;
})();
const ePts = e => {
  const [x1, y1] = e.a ? nodeC(...e.a) : [290, 540], [x2, y2] = e.b ? nodeC(...e.b) : [TRE.res, 540];
  return [x1 + (e.a ? TRE.nw / 2 : TRE.rw / 2), y1, x2 - TRE.nw / 2, y2];
};
const onPath = (e, P) => (!e.a || e.a[1] === P[e.a[0]]) && (!e.b || e.b[1] === P[e.b[0]]);
function header(ctx, j, cx, y, k, chk) {
  if (k <= 0) return;
  popScale(ctx, cx, y, k, () => {
    ctx.font = font(600, 26); const s = QS[j][0], w = ctx.measureText(s).width, bx = cx - (w + 46) / 2 + 17;
    ctx.fillStyle = mixC(COL.num, COL.str, chk); ctx.beginPath(); ctx.arc(bx, y, 17, 0, 6.283); ctx.fill();
    if (chk < .5) { ctx.font = font(700, 24); ctx.textAlign = 'center'; ctx.fillStyle = COL.eye; ctx.fillText('?', bx, y + 1); }
    else { ctx.strokeStyle = COL.eye; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(bx - 8, y); ctx.lineTo(bx - 2, y + 6); ctx.lineTo(bx + 8, y - 6); ctx.stroke(); }
    ctx.font = font(600, 26); ctx.textAlign = 'left'; ctx.fillStyle = COL.dim; ctx.fillText(s, bx + 29, y);
  });
}
function drawTree(ctx, T, pl, mode, X, al) {
  if (al <= 0) return;
  const { tm } = pl, cut = mode === 'cut';
  ctx.save(); ctx.translate(X.ox, X.oy); ctx.scale(X.s, X.s); ctx.translate(-290, -540);
  const colK = j => cut ? 1 : j < 4 ? prog(T, tm.hT[j], tm.hT[j] + .5, MOTION.draw) : prog(T, tm.gT[4] - .45, tm.gT[4], MOTION.draw);
  const gk = j => prog(T, tm.gT[j] - .45, tm.gT[j], MOTION.draw);
  const fallOf = (j, o) => cut && o !== WANT[j] ? Math.max(0, T - tm.cT[j]) : 0;
  for (const e of EDGES) {
    const k = colK(e.j); if (k <= 0) continue;
    let a = 1;
    if (cut) { const ts = [e.a, e.b].filter(n => n && n[1] !== WANT[n[0]]).map(n => tm.cT[n[0]]); if (ts.length) a = 1 - prog(T, Math.min(...ts), Math.min(...ts) + .3); }
    if (a <= 0) continue;
    const [x1, y1, x2, y2] = ePts(e);
    ctx.globalAlpha = al * a; ctx.strokeStyle = COL.line; ctx.lineWidth = 3; curve(ctx, x1, y1, x2, y2, k);
    if (!cut && onPath(e, GUESS)) { ctx.strokeStyle = COL.clawd; ctx.lineWidth = 5; curve(ctx, x1, y1, x2, y2, gk(e.j)); }
    if (cut && onPath(e, WANT)) { ctx.strokeStyle = COL.str; ctx.lineWidth = 5; curve(ctx, x1, y1, x2, y2, prog(T, tm.glow - .3 + e.j * .12, tm.glow + .1 + e.j * .12, MOTION.draw)); }
  }
  if (cut) tm.cT.forEach((t, j) => {
    const b = bump(T, t + .05, .12); if (b < .02) return;
    const [x1, y1, x2, y2] = ePts({ a: j ? [j - 1, WANT[j - 1]] : null, b: [j, 1 - WANT[j]] }), [sx, sy] = bz(x1, y1, x2, y2, .5);
    ctx.globalAlpha = al * b; ctx.strokeStyle = COL.text; ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) { const an = i * 1.047 + .3; ctx.beginPath(); ctx.moveTo(sx + Math.cos(an) * 12, sy + Math.sin(an) * 12); ctx.lineTo(sx + Math.cos(an) * 34, sy + Math.sin(an) * 34); ctx.stroke(); }
  });
  ctx.globalAlpha = al;
  if (cut) { box(ctx, 290 - TRE.rw / 2, 540 - TRE.nh / 2, TRE.rw, TRE.nh, COL.card, COL.fn, 2.5); ctx.font = font(500, 28); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText('登录功能', 290, 541); ctx.textAlign = 'left'; }
  const wg = cut ? prog(T, tm.glow, tm.glow + .5) : 0;
  for (let j = 0; j < 4; j++) {
    const nk = cut ? 1 : prog(T, tm.hT[j] + .3, tm.hT[j] + .7, MOTION.pop);
    header(ctx, j, TRE.cols[j], TRE.hy, cut ? 1 : prog(T, tm.hT[j], tm.hT[j] + .45, MOTION.pop), cut ? prog(T, tm.cT[j], tm.cT[j] + .3) : 0);
    if (nk <= 0) continue;
    for (const o of [0, 1]) {
      let [x, y] = nodeC(j, o), a = 1, rot = 0;
      const f = fallOf(j, o);
      if (f > 0) { y += 900 * f * f; rot = (o ? 1 : -1) * f * 2.2; a = 1 - prog(f, .25, .8); }
      if (a <= 0) continue;
      const onG = !cut && o === GUESS[j] && T >= tm.gT[j], onW = cut && o === WANT[j];
      ctx.save(); ctx.globalAlpha = al * a; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(nk, nk);
      box(ctx, -TRE.nw / 2, -TRE.nh / 2, TRE.nw, TRE.nh, onG ? mixC(COL.card, COL.clawd, .2) : COL.card, onG ? COL.clawd : onW ? mixC(COL.dim, COL.str, wg) : COL.dim, 2.5);
      ctx.font = font(500, 24); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(QS[j][1][o], 0, 1);
      ctx.restore();
    }
  }
  const rk = cut ? 1 : prog(T, tm.gT[4] - .1, tm.gT[4] + .3, MOTION.pop);
  if (rk > 0) {
    const bad = !cut && T >= tm.wrong, good = cut && T >= tm.glow;
    const jx = bad && T < tm.wrong + .5 ? Math.sin(T * 80) * 8 * (1 - (T - tm.wrong) / .5) : 0;
    const lab = bad ? '不是你想要的' : good ? '你想要的' : '结果', c = bad ? COL.err : good ? COL.str : COL.dim;
    ctx.save(); ctx.globalAlpha = al; ctx.translate(TRE.res + jx, 540); ctx.scale(rk, rk);
    box(ctx, -TRE.nw / 2, -TRE.nh / 2, TRE.nw, TRE.nh, bad ? mixC(COL.card, COL.err, .18) : good ? mixC(COL.card, COL.str, .18) : COL.card, c, 3);
    ctx.font = font(600, 24); ctx.textAlign = 'center'; ctx.fillStyle = bad || good ? c : COL.dim; ctx.fillText(lab, 0, 1);
    ctx.restore();
  }
  ctx.restore(); ctx.textAlign = 'left';
}

// ---------- 一句话 ----------
function drawAsk(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.A + .1, tm.A + .6) * (1 - prog(T, tm.F - .4, tm.F)) * (1 - .82 * prog(T, tm.dim, tm.dim + .6));
  if (a <= 0) return;
  const m = prog(T, tm.morph, tm.morph + 1, MOTION.draw), pul = bump(T, tm.send + .08, .18);
  const x = lerp(150, 130, m), y = lerp(170, 508, m), w = lerp(720, 320, m), h = lerp(120, 64, m);
  ctx.save(); ctx.globalAlpha = a;
  box(ctx, x, y, w, h, COL.card, mixC(COL.line, COL.fn, Math.max(m, pul, .35)), 2.5, lerp(18, 14, m));
  const n = typedN(T, ty.ask), s = ty.ask.text.slice(0, n);
  if (m < 1) {
    ctx.globalAlpha = a * (1 - m);
    ctx.font = font(600, 26, MONO); ctx.fillStyle = COL.fn; ctx.fillText('你', x + 32, y + h / 2);
    ctx.fillStyle = mixC(COL.line, COL.fn, prog(T, ty.ask.s + 1.15, ty.ask.s + 1.35));
    ctx.beginPath(); ctx.roundRect(x + w - 88, y + h / 2 - 28, 56, 56, 12); ctx.fill();
    ctx.fillStyle = COL.bg; ctx.beginPath(); ctx.moveTo(x + w - 69, y + h / 2 - 12); ctx.lineTo(x + w - 47, y + h / 2); ctx.lineTo(x + w - 69, y + h / 2 + 12); ctx.fill();
    ctx.font = font(500, 40); ctx.fillStyle = COL.text; ctx.fillText(s, x + 84, y + h / 2);
    if (T < tm.send && (typingOn(T, ty.ask, 0) || blink(T))) cursorAt(ctx, x + 84 + ctx.measureText(s).width, y + h / 2, COL.fn);
  }
  if (m > 0) { ctx.globalAlpha = a * m; ctx.font = font(500, 28); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(s, x + w / 2, y + h / 2); ctx.textAlign = 'left'; }
  const rk = clamp((T - tm.pulse) / 1.1, 0, 1);
  if (rk > 0 && rk < 1) { ctx.globalAlpha = a * (1 - rk); ctx.strokeStyle = COL.num; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(290, 540, 170 + 260 * rk, 40 + 160 * rk, 0, 0, 6.283); ctx.stroke(); }
  ctx.restore();
}
function drawGarbage(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.dim, tm.dim + .5) * (1 - prog(T, tm.F - .4, tm.F));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.font = font(700, 80, MONO);
  const w1 = ctx.measureText(ty.gin.text).width, w2 = ctx.measureText(ty.gout.text).width;
  drawTyped(ctx, T, ty.gin, 960 - w1 / 2, 420, COL.dim, false);
  const ka = prog(T, ty.gin.s + .8, ty.gin.s + 1.3, MOTION.draw);
  if (ka > 0) {
    ctx.strokeStyle = COL.faint; ctx.fillStyle = COL.faint; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(960, 478); ctx.lineTo(960, 478 + 60 * ka); ctx.stroke();
    if (ka > .9) { ctx.beginPath(); ctx.moveTo(946, 534); ctx.lineTo(974, 534); ctx.lineTo(960, 552); ctx.fill(); }
  }
  const n = typedN(T, ty.gout), m = T >= tm.gout ? lerp(.5, .1, prog(T, tm.gout + .5, tm.gout + 1.4)) : 0;
  let s = ty.gout.text.slice(0, n); if (m > 0) s = scr(s, m, T, 3);
  const jx = m > .25 ? (hash(Math.floor(T * 30)) - .5) * 12 : 0;
  ctx.fillStyle = COL.err; ctx.fillText(s, 960 - w2 / 2 + jx, 620);
  ctx.restore();
}

// ---------- 五部分 + 为什么 ----------
function drawRows(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.F, tm.F + .5) * (1 - prog(T, tm.Q - .5, tm.Q));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(400, 28, MONO); drawTyped(ctx, T, ty.fh, CHX, 150, COL.dim, false);
  let act = -1; tm.dS.forEach((t, i) => { if (T >= t - .1) act = i; });
  PARTS.forEach(([lab, c], i) => {
    const k = prog(T, tm.chip[i], tm.chip[i] + .45, MOTION.pop);
    if (k <= 0) return;
    const y = ROWY[i], on = i === act, why = i === 5;
    popScale(ctx, CHX + CHW / 2, y, k, () => {
      box(ctx, CHX, y - 38, CHW, 76, on ? c : COL.card, c, 2.5, 14, why ? [9, 7] : null);
      ctx.font = font(600, 32); ctx.textAlign = 'center'; ctx.fillStyle = on ? COL.eye : c; ctx.fillText(why ? '+ ' + lab : lab, CHX + CHW / 2, y + 1); ctx.textAlign = 'left';
    });
    ctx.font = font(500, 34); drawTyped(ctx, T, ty['d' + i], DX, y, on ? COL.text : COL.dim, false);
  });
  const kb = prog(T, tm.badge, tm.badge + .45, MOTION.pop);
  if (kb > 0) {
    ctx.font = font(500, 34); const bx = DX + ctx.measureText(PARTS[5][2]).width + 36;
    ctx.font = font(600, 24); const s = 'Anthropic 官方指南', w = ctx.measureText(s).width + 40;
    popScale(ctx, bx + w / 2, ROWY[5], kb, () => { box(ctx, bx, ROWY[5] - 24, w, 48, COL.bg, COL.kw, 2, 24); ctx.fillStyle = COL.kw; ctx.fillText(s, bx + 20, ROWY[5] + 1); });
  }
  ctx.restore();
}

// ---------- 清楚版 ----------
function drawPrompt(ctx, T, pl) {
  const { tm, ty } = pl, ki = prog(T, tm.Q + .1, tm.Q + .7), ko = prog(T, tm.E - .5, tm.E), a = ki * (1 - ko);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 24 * (1 - ki) - 30 * ko);
  ctx.font = font(500, 32);
  const L = wrapIdx(ctx, PROMPT, 1480), X = 220, Y0 = 236, LH = 52;
  box(ctx, 170, 128, 1580, 104 + L.length * LH, COL.card, COL.fn, 2.5, 18);
  ctx.font = font(600, 26, MONO); ctx.fillStyle = COL.fn; ctx.fillText('你', X, 176);
  ctx.font = font(500, 32);
  const n = typedN(T, ty.pr), pulse = si => Math.max(0, ...tm.cT.map((t, j) => CUT_SEG[j] === si ? bump(T, t + .1, .35) : 0));
  let cx = X, cy = Y0;
  L.forEach(([a0, b0], li) => {
    const y = Y0 + li * LH;
    SEGS.forEach(([, pi], si) => {
      const [sa, sb] = SEG_AT[si], s0 = Math.max(sa, a0), s1 = Math.min(sb, b0, n);
      if (s1 <= s0) return;
      const str = PROMPT.slice(s0, s1), px = X + ctx.measureText(PROMPT.slice(a0, s0)).width, pu = pulse(si);
      if (pu > .02) { ctx.fillStyle = rgba(PARTS[pi][1], .28 * pu); ctx.fillRect(px - 4, y - 26, ctx.measureText(str).width + 8, 52); }
      ctx.fillStyle = PARTS[pi][1]; ctx.fillText(str, px, y);
    });
    if (n >= a0 && n <= b0) { cx = X + ctx.measureText(PROMPT.slice(a0, n)).width; cy = y; }
  });
  if (typingOn(T, ty.pr, 0) || (T < tm.cT[0] - 1 && blink(T))) cursorAt(ctx, cx, cy, COL.fn);
  ctx.restore();
}

// ---------- 报错四样 ----------
function drawBug(ctx, T, pl) {
  const { tm, ty } = pl, ki = prog(T, tm.E, tm.E + .5), ko = prog(T, tm.D - .5, tm.D), a = ki * (1 - ko);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 30 * (1 - ki) - 30 * ko);
  box(ctx, 200, 150, 1100, 640, COL.card, COL.line, 2, 18);
  ctx.font = font(400, 26, MONO); drawTyped(ctx, T, ty.et, 250, 205, COL.dim, false);
  FIELDS.forEach(([lab, c], i) => {
    const k = prog(T, tm.fT[i], tm.fT[i] + .4);
    if (k <= 0) return;
    const y = FY[i];
    ctx.globalAlpha = a * k;
    if (i) { ctx.fillStyle = COL.line; ctx.fillRect(250, y - 50, 1000, 1.5); }
    ctx.font = font(600, 24, MONO); ctx.fillStyle = c; ctx.fillText(String(i + 1), 250 - 12 * (1 - k), y);
    ctx.font = font(600, 28); ctx.fillText(lab, 290 - 12 * (1 - k), y);
  });
  ctx.globalAlpha = a;
  ctx.font = font(400, 24, MONO); drawTyped(ctx, T, ty.e0a, 290, FY[0] + 46, COL.err, false); drawTyped(ctx, T, ty.e0b, 290, FY[0] + 82, COL.dim, false);
  ctx.font = font(400, 30); [ty.e1, ty.e2, ty.e3].forEach((d, i) => drawTyped(ctx, T, d, 290, FY[i + 1] + 48, COL.text, false));
  const ks = prog(T, tm.shot, tm.shot + .6);
  if (ks > 0) {
    const sx = lerp(1900, 1340, ks), sy = lerp(260, 660, ks) - Math.sin(Math.PI * ks) * 80;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(lerp(.5, -.05, ks));
    box(ctx, -160, -105, 320, 210, COL.bg, COL.dim, 2, 10);
    ctx.fillStyle = COL.line; ctx.beginPath(); ctx.roundRect(-160, -105, 320, 30, [10, 10, 0, 0]); ctx.fill();
    [0, 1, 2].forEach(i => { ctx.fillStyle = COL.faint; ctx.beginPath(); ctx.arc(-140 + i * 16, -90, 5, 0, 6.283); ctx.fill(); });
    ctx.fillStyle = rgba(COL.dim, .35); [[-130, -55, 180], [-130, -27, 240], [-130, 1, 140]].forEach(([x, y, w]) => ctx.fillRect(x, y, w, 14));
    ctx.strokeStyle = COL.err; ctx.lineWidth = 2.5; ctx.strokeRect(-130, 34, 130, 42);
    ctx.font = font(600, 22); ctx.fillStyle = COL.dim; ctx.fillText('截图', -160, -128);
    ctx.restore();
  }
  ctx.restore();
}

// ---------- 拆小 ----------
function drawTasks(ctx, T, pl) {
  const { tm } = pl, a = prog(T, tm.D, tm.D + .3) * (1 - prog(T, tm.O - .5, tm.O));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const ks = prog(T, tm.split, tm.split + .7, MOTION.draw), dimk = prog(T, tm.D + 4.2, tm.D + 4.8);
  if (T < tm.split) {
    popScale(ctx, 960, 420, prog(T, tm.big, tm.big + .45, MOTION.pop), () => {
      box(ctx, 600, 360, 720, 120, COL.card, COL.fn, 3, 18);
      ctx.font = font(600, 48); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText('登录功能', 960, 421); ctx.textAlign = 'left';
    });
  } else TASKS.forEach((t, i) => {
    const wk = prog(T, tm.wT[i], tm.wT[i] + .45, MOTION.pop);
    ctx.globalAlpha = a * (1 - .5 * dimk);
    if (wk > 0) popScale(ctx, TX[i], 445, wk, () => {
      box(ctx, TX[i] - 240, 300, 480, 290, COL.bg, COL.line, 2, 16);
      ctx.fillStyle = COL.line; ctx.fillRect(TX[i] - 240, 350, 480, 1.5);
      ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.fillText('对话 ' + (i + 1), TX[i] - 212, 326);
    });
    const cx = lerp(720 + i * 240, TX[i], ks), w = lerp(240, 400, ks), cy = lerp(420, 470, prog(T, tm.wT[i], tm.wT[i] + .45, MOTION.draw));
    box(ctx, cx - w / 2, cy - 48, w, 96, COL.card, COL.fn, 2.5, 14);
    ctx.globalAlpha = a * (1 - .5 * dimk) * prog(T, tm.split + .35, tm.split + .7);
    ctx.font = font(600, 32); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(t, cx, cy + 1); ctx.textAlign = 'left';
  });
  const fl = bump(T, tm.split, .08);
  if (fl > .02) { ctx.globalAlpha = a * fl; ctx.fillStyle = COL.text; ctx.fillRect(838, 360, 4, 120); ctx.fillRect(1078, 360, 4, 120); }
  ctx.globalAlpha = a;
  ASKS.forEach(([s, c, x], i) => {
    const k = prog(T, tm.ask[i], tm.ask[i] + .45, MOTION.pop);
    if (k <= 0) return;
    ctx.font = font(600, 32); const w = ctx.measureText(s).width + 64;
    popScale(ctx, x, 720, k, () => { box(ctx, x - w / 2, 686, w, 68, COL.card, c, 2.5, 34); ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, x, 721); ctx.textAlign = 'left'; });
  });
  ctx.restore();
}

// ---------- 老套路 ----------
function drawTalk(ctx, T, pl) {
  const { tm, ty } = pl, k = prog(T, tm.bub, tm.bub + .45, MOTION.pop);
  if (k <= 0) return;
  const hk = T >= tm.shout - .1 ? 1 - prog(T, tm.calm, tm.calm + .6) : 0;
  const j = hk > 0 && T >= ty.sh.s ? 6 * hk : 0, jx = (hash(Math.floor(T * 30)) - .5) * j, jy = (hash(Math.floor(T * 30) + 7) - .5) * j;
  popScale(ctx, 980, 420, k, () => {
    ctx.save(); ctx.translate(jx, jy);
    const sc = mixC(COL.line, COL.err, hk);
    box(ctx, 170, 340, 810, 160, COL.card, sc, 3, 20);
    ctx.fillStyle = COL.card; ctx.strokeStyle = sc; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(978, 398); ctx.lineTo(1040, 430); ctx.lineTo(978, 456); ctx.fill();
    ctx.beginPath(); ctx.moveTo(980, 398); ctx.lineTo(1040, 430); ctx.lineTo(980, 456); ctx.stroke();
    let s, c = COL.text, f = font(500, 40);
    if (T < tm.shout - .1) s = ty.c1.text.slice(0, typedN(T, ty.c1));
    else if (T < tm.calm) { s = ty.sh.text.slice(0, typedN(T, ty.sh)); c = COL.err; f = font(700, 40); }
    else {
      const m = prog(T, tm.calm, tm.calm + .6, Easing.linear), L = Math.max(SHOUT.length, CALM.length);
      s = ''; for (let i = 0; i < L; i++) s += hash(i * 3.3 + .7) < m ? (CALM[i] || '') : hash(i + Math.floor(T * 20) * 1.3) < .5 ? GLY[i % GLY.length] : (SHOUT[i] || '');
      c = mixC(COL.err, COL.text, m); if (m < .5) f = font(700, 40);
    }
    ctx.font = f; ctx.fillStyle = c; ctx.fillText(s, 220, 420);
    if (T < tm.calm && (typingOn(T, ty.c1, 0) || typingOn(T, ty.sh, 0) || blink(T))) cursorAt(ctx, 220 + ctx.measureText(s).width, 420, hk > 0 ? COL.err : COL.kw);
    ctx.restore();
  });
}

// ---------- 章节卡 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 3 章', 1080, 330); ctx.globalAlpha = 1;
  dotsFor('03', 300, 12, 700, MONO, fv).pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.A - .6);
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.A) return drawCard(ctx, T, pl, fv);
  if (T < tm.F) {
    const dk = prog(T, tm.dim, tm.dim + .6);
    drawTree(ctx, T, pl, 'grow', { ox: 290, oy: 540, s: 1 }, (1 - .82 * dk) * (1 - prog(T, tm.F - .4, tm.F)));
    drawAsk(ctx, T, pl); drawGarbage(ctx, T, pl); return;
  }
  if (T < tm.Q) return drawRows(ctx, T, pl);
  if (T < tm.E) {
    drawPrompt(ctx, T, pl);
    const k = prog(T, tm.Q + .4, tm.Q + 1.2);
    drawTree(ctx, T, pl, 'cut', { ox: MINI.ox, oy: MINI.oy + 20 * (1 - k), s: MINI.s }, k * (1 - prog(T, tm.E - .5, tm.E)));
    return;
  }
  if (T < tm.D) return drawBug(ctx, T, pl);
  if (T < tm.O) return drawTasks(ctx, T, pl);
  drawTalk(ctx, T, pl);
}

// ---------- Clawd ----------
const topOf = j => { const [x, y] = j < 0 ? toMini(290, 540) : j > 3 ? toMini(TRE.res, 540) : toMini(TRE.cols[j], TRE.rows[WANT[j]]); return [x, y - TRE.nh / 2 * MINI.s, 7]; };
function clawd(T, pl) {
  const { tm } = pl, prev = pl.prev || [960, 600, 12];
  const J = [
    [tm.S - .55, tm.S + .35, prev, C0], [tm.A - .1, tm.A + .6, C0, CA], [tm.F + .1, tm.F + .6, CA, CF], [tm.Q + .3, tm.Q + 1, CF, topOf(-1)],
    ...tm.cT.map((t, j) => [t - .5, t - .1, topOf(j - 1), topOf(j)]), [tm.glow - .5, tm.glow - .1, topOf(3), topOf(4)],
    [tm.E - .2, tm.E + .5, topOf(4), CE], [tm.D + 4, tm.D + 4.6, CE, CD], [tm.O - .3, tm.O + .4, CD, CO],
  ];
  const r = jumpPos(T, J, prev), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  if (T >= tm.S + .35 && T < tm.A - .1) st.eye = 1;
  if (T >= tm.A + .6 && T < tm.R) st.eye = 1;
  if (T >= tm.hT[0] && T < tm.hT[3] + 1.4) st.q = qk(T, tm.hT[0], tm.hT[3] + 1.4 - tm.hT[0]);
  if (T >= tm.shut && T < tm.wrong) { st.blink = true; st.pose = 'point'; st.eye = 0; }
  if (T >= tm.wrong && T < tm.cover) { st.eye = 1; st.y -= Math.sin(Math.PI * clamp((T - tm.wrong) / .4, 0, 1)) * 24; }
  if (T >= tm.cover && T < tm.dim) { st.pose = 'cover'; st.sweat = T - tm.cover; }
  if (T >= tm.dim && T < tm.F) st.eye = 1;
  if (T >= tm.chip[0] - .2 && T < tm.chip[4] + 1) st.pose = 'point';
  if (T >= tm.F + .6 && T < tm.Q) st.eye = 1;
  if (T >= tm.nodY && T < tm.nodY + 1.4) st.nod = Math.sin((T - tm.nodY) * 5) > .3;
  if (T >= tm.cT[0] - 1.2 && T < tm.glow) { st.pose = 'push'; st.eye = 1; }
  if (T >= tm.glow && T < tm.glow + .8) st.pose = 'up';
  if (T >= tm.E + .5 && T < tm.D + 4) { st.eye = -1; for (const t of tm.fT) if (T >= t && T < t + .6) st.nod = Math.sin((T - t) * 10) > 0; }
  if (T >= tm.qD && T < tm.qD + 1.6) st.q = qk(T, tm.qD, 1.6);
  if (T >= tm.ask[0] && T < tm.ask[0] + 1.3) st.eye = -1;
  if (T >= tm.ask[1] && T < tm.ask[1] + 1.3) st.eye = 1;
  if (T >= tm.stk[0] && T < tm.shake) { st.eye = Math.sin(T * 2.6) > 0 ? -1 : 1; if (T >= tm.stk[1]) st.sweat = T - tm.stk[1]; }
  for (const t of tm.stk) if (T >= t && T < t + .18) st.squash = 1 - .1 * Math.sin(Math.PI * (T - t) / .18);
  if (T >= tm.shake && T < tm.fly + .2) { st.x += Math.sin(T * 95) * 9; st.ph = T * 60; st.pose = 'wave'; st.blink = true; }
  if (T >= tm.fly + .2 && T < tm.fly + .45) st.squash = 1 - .15 * Math.sin(Math.PI * (T - tm.fly - .2) / .25);
  if (T >= tm.bub) st.eye = -1;
  if (T >= tm.nodO && T < tm.nodO + 1) st.nod = Math.sin((T - tm.nodO) * 5) > .3;
  if (T >= tm.shout + .4 && T < tm.calm) { st.sweat = T - tm.shout; st.x += (hash(Math.floor(T * 30)) - .5) * 5; }
  if (T >= tm.over && T < tm.over + .8) { const k = (T - tm.over) / .8; st.y -= Math.sin(Math.PI * k) * 220; st.squash = 1 + .15 * Math.sin(Math.PI * k); st.pose = 'up'; st.eye = 0; }
  if (T >= tm.over + .8 && T < tm.over + 1.05) st.squash = 1 - .25 * Math.sin(Math.PI * (T - tm.over - .8) / .25);
  if (T >= tm.calm + .6 && T < tm.calm + 1.8) st.nod = Math.sin((T - tm.calm - .6) * 5) > .3;
  return st;
}

// ---------- 演员层：剪刀和便签 ----------
function drawScissors(ctx, T, pl) {
  const { tm } = pl, k = prog(T, tm.cT[0] - 1.2, tm.cT[0] - .9) * (1 - prog(T, tm.glow, tm.glow + .3));
  if (k <= 0) return;
  const st = clawd(T, pl), px = st.px, sq = st.squash || 1;
  let op = .5;
  for (const t of tm.cT) { const d = T - t; if (d > -.18 && d < 0) op = lerp(.5, .9, (d + .18) / .18); else if (d >= 0 && d < .08) op = .9 * (1 - d / .08); else if (d >= .08 && d < .35) op = .5 * (d - .08) / .27; }
  ctx.save(); ctx.globalAlpha = k; ctx.translate(st.x + 7 * px / Math.sqrt(sq), st.y - 4.5 * px * sq); ctx.scale(px / 7, px / 7);
  ctx.lineCap = 'round'; ctx.strokeStyle = COL.text; ctx.lineWidth = 4;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(10, 0); ctx.lineTo(10 + 28 * Math.cos(s * op / 2), 28 * Math.sin(s * op / 2)); ctx.stroke(); }
  ctx.strokeStyle = COL.err; ctx.lineWidth = 3;
  for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(2, s * 7, 5.5, 0, 6.283); ctx.stroke(); }
  ctx.fillStyle = COL.dim; ctx.beginPath(); ctx.arc(10, 0, 2.5, 0, 6.283); ctx.fill();
  ctx.restore(); ctx.lineCap = 'butt';
}
function drawStickers(ctx, T, pl) {
  const { tm } = pl, st = clawd(T, pl);
  STK.forEach(([lab, c, dx, dy, r0, fx, fy], i) => {
    const t0 = tm.stk[i], ki = (T - (t0 - .45)) / .45;
    if (ki < 0) return;
    const ax = st.x + dx, ay = st.y + dy;
    let x = ax, y = ay, r = r0, a = 1, s = 1;
    if (ki < 1) { const e = Easing.easeInCubic(ki); x = lerp(ax + fx, ax, e); y = lerp(ay + fy, ay, e); r = lerp(r0 + (i % 2 ? 2.4 : -2.4), r0, e); }
    else if (T < tm.fly) { if (T < t0 + .18) s = 1 + .14 * Math.sin(Math.PI * (T - t0) / .18); }
    else { const f = T - tm.fly, [vx, vy, vr] = OFFV[i]; x = ax + vx * f; y = ay + vy * f + 1500 * f * f; r = r0 + vr * f; a = 1 - prog(f, .6, 1.3); }
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s);
    ctx.font = font(700, 30); const w = ctx.measureText(lab).width + 48;
    ctx.fillStyle = rgba(COL.eye, .5); ctx.fillRect(-w / 2 + 6, -29, w, 70);
    ctx.fillStyle = c; ctx.fillRect(-w / 2, -35, w, 70);
    ctx.fillStyle = rgba(COL.text, .35); ctx.fillRect(-26, -43, 52, 16);
    ctx.fillStyle = COL.eye; ctx.textAlign = 'center'; ctx.fillText(lab, 0, 1); ctx.textAlign = 'left';
    ctx.restore();
  });
}
function over(ctx, T, pl) {
  const { tm } = pl;
  ctx.textBaseline = 'middle';
  if (T >= tm.Q && T < tm.E) drawScissors(ctx, T, pl);
  if (T >= tm.stk[0] - .5 && T < tm.fly + 1.4) drawStickers(ctx, T, pl);
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.A - .6, tm.A, Easing.linear);
  let gl = 0;
  const sp = (t, a, d) => { if (T >= t) gl = Math.max(gl, a * Math.exp(-(T - t) * d)); };
  sp(tm.wrong, .55, 5); sp(tm.split, .3, 6); sp(tm.over + .8, .7, 4); sp(tm.shout - .1, .35, 5);
  if (T >= tm.gout && T < tm.gout + 1) gl = Math.max(gl, hash(Math.floor(T * 12)) > .5 ? .35 : .05);
  if (T >= pl.ty.sh.s && T < tm.calm) gl = Math.max(gl, hash(Math.floor(T * 8)) > .8 ? .22 : 0);
  let rays = 0, light = [.5, .44];
  if (T < tm.A) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T >= tm.Q && T < tm.E) { rays = .4 * bump(T, tm.glow + .3, .6); const [lx, ly] = toMini(TRE.res, 540); light = [lx / 1920, ly / 1080]; }
  else if (T >= tm.O) { rays = .4 * bump(T, tm.calm + .5, .7); light = [575 / 1920, 420 / 1080]; }
  const hot = prog(T, tm.stk[0], tm.stk[0] + .5) * (1 - prog(T, tm.fly, tm.fly + 1)) + prog(T, tm.shout, tm.shout + .5) * (1 - prog(T, tm.calm, tm.calm + 1));
  return { gl, rays, light,
    energy: lerp(.38, 1, card) + .3 * hot + .25 * bump(T, tm.over + .4, .5),
    warm: .15 + .55 * hot + .35 * bump(T, tm.wrong + .4, .8),
    floor: Math.max(.65 * card, .6 * prog(T, tm.Q, tm.Q + 1) * (1 - prog(T, tm.E - .4, tm.E + .2)), .85 * prog(T, tm.O, tm.O + 1.2)) };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"03 章节卡 · 一句话 · 随手挑":[["03 章节卡",3.5],["03 一句话",13],["03 随手挑",11.5]],"03 五部分 · 为什么":[["03 五部分",22],["03 为什么",9]],"03 清楚版 · 报错":[["03 清楚版",11.5],["03 报错",11.5]],"03 拆小 · 老套路":[["03 拆小",10],["03 老套路",17]]};

return { plan, scene, clawd, fx, over, parts: TL_PARTS };
};
