// 第 7 章　工作流程
(window.VC_CH = window.VC_CH || {})[7] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, drawTyped, popScale, dotsFor, jumpPos, drawClawd } = V;
const { Easing, clamp } = window;
const N = ['07 章节卡', '07 一口气', '07 原因', '07 流程', '07 存档', '07 分支', '07 测试', '07 三次', '07 基础'];
const C0 = [560, 720, 22], CQ = [960, 780, 11], HUM = COL.fn;
const FILES = ['User.java', 'UserService.java', 'LoginController.java', 'login.html', 'UserServiceTest.java'];
const FX = i => 260 + i * 350, FY = 400, FW = 150, FH = 184, BADF = 2;
const STEPS = [['读代码', 0], ['出计划', 0], ['你看计划', 1], ['改代码', 0], ['验证', 0], ['提交', 0]];
const SX = i => 210 + i * 300, SY = 330, SW = 250, SH = 110;
const PLAN = ['1. UserService 加 login()', '2. 记录失败次数', '3. 失败 3 次锁 30 分钟', '4. 补 JUnit 测试'], PLAN_FIX = '3. 失败 5 次锁 15 分钟';
const PD = { x: 500, y: 470, w: 620, h: 330 };
const NX = [300, 560, 820, 1080, 1340], CMT = [['a1f3', '写 login()'], ['b7c2', '记录失败次数'], ['c9e0', '5 次锁 15 分钟'], ['d4a8', '补测试'], ['e2b1', '接着干']];
const TESTS = ['loginSuccess()', 'wrongPassword()', 'lockAfter5Fails()'], RUNS = [[1, 0, 0], [1, 1, 0], [1, 1, 1]];
const TW = { x: 190, y: 220, w: 800, h: 430 }, TR = { x: 1050, y: 220, w: 680, h: 430 };
const OPT = [{ x: 360, k: 'A', t: '回退到上一个提交', s: 'git reset --hard' }, { x: 960, k: 'B', t: '补充信息，新开对话', s: '/clear' }, { x: 1560, k: 'C', t: '你自己写', s: '' }];
const OY = 520, OW = 480, OH = 170;
const CODE = [['List<Book> books = repo.findAll();'], ['for (int i = 0; i ', '<=', ' books.size(); i++) {'], ['    print(books.get(i).title);'], ['}']];
const CK = { x: 220, y: 290, w: 1000, h: 330 };
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);
const fio = (T, a, b, i = .4, o = .5) => prog(T, a, a + i) * (1 - prog(T, b - o, b));

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, Q, R, Fl, Sv, Br, Ts, Th, Bs] = N.map(n => C[n]);
  const tm = { S, Q, R, Fl, Sv, Br, Ts, Th, Bs,
    dots: S + .5,
    task: Q + .4, fIn: FILES.map((_, i) => Q + 1 + i * .25), grab: Q + 3.9, run0: Q + 4.5, run1: Q + 7, smoke: Q + 6.4, drop: Q + 7.2, haze: Q + 7.8, qs: FILES.map((_, i) => Q + 8.6 + i * .3), spin0: Q + 8.4, spin1: Q + 11,
    scope: R + .6, steps: R + 4.4, ok: [R + 5, R + 5.4], bad: R + 5.8, shrink: R + 6.2, find: R + 8, undo: R + 8.6,
    st: [Fl + 1.2, Fl + 3.2, Fl + 5.4, Fl + 8.2, Fl + 9.4, Fl + 10.6], plan: Fl + 4, edit: Fl + 6.4, stamp: Fl + 7.4, mode: Fl + 11.8, ppt: Fl + 14.2,
    line: Sv + .4, cm: [Sv + 1, Sv + 2.1, Sv + 3.2, Sv + 4.3], savL: Sv + 5.2, bad0: Sv + 7.4, bad1: Sv + 8.4, load: Sv + 8.9, up: Sv + 10.2, anth: Sv + 10.4, s1: Sv + 11.4, s1x: Sv + 12.6, s2: Sv + 13.4, log: Sv + 14, cm5: Sv + 16.2,
    br: Br + .3, brL: Br + 1, brJ: Br + 1.6, risk: Br + 2.2,
    win: Ts + .4, tests: TESTS.map((_, i) => Ts + 2.6 + i * .5), typ0: Ts + 4.2, typ1: Ts + 9, run: [Ts + 5.6, Ts + 7, Ts + 8.4], sly: Ts + 9.6, slyC: Ts + 10.2, next: Ts + 12.8,
    f: [Th + .6, Th + 1.5, Th + 2.4], stop: Th + 3, op: [Th + 4.4, Th + 6.6, Th + 9],
    basic: Bs + .5, back: Bs + 1, no: Bs + 1.6, code: Bs + 3.8, lens0: Bs + 4.2, lens1: Bs + 6.4, bug: Bs + 6.6, rule: Bs + 8.4, ruleS: Bs + 10.6,
  };
  const ty = { chName: { s: S + 1.3, cps: 10, text: '工作流程' }, log: { s: tm.log, cps: 26, text: '$ git log --oneline' } };
  const caps = [
    [Q + .2, Q + 3.8, '这次你让我一口气把登录功能改完。'], [Q + 3.8, Q + 6.4, '我同时动了五个文件，'], [Q + 6.4, Q + 11.2, '其中有一处改坏了，可已经分不清是哪一处。'],
    [R + .2, R + 4.4, '一次改得越多，出错时要翻的范围就越大。'], [R + 4.4, R + 8, '把每次出错的范围控制在一步之内，'], [R + 8, R + 10.3, '好找，也好退回去。'],
    [Fl + .2, Fl + 2, '推荐的顺序是：'], [Fl + 2, Fl + 5.4, '先让我读相关代码，出个计划；'], [Fl + 5.4, Fl + 8, '你看计划、改计划；'], [Fl + 8, Fl + 11.6, '然后我再动手改代码，接着验证、提交。'],
    [Fl + 11.6, Fl + 14, '多数工具都有计划模式，'], [Fl + 14, Fl + 16.8, '课件里讲 Qoder 三种模式那页提到过。'],
    [Sv + .2, Sv + 5, '小步走：每做完一小步、验证通过，就 commit 一次。'], [Sv + 5, Sv + 7.6, 'Git 的提交就是存档点，'], [Sv + 7.6, Sv + 10.2, '我改坏了，直接读档。'],
    [Sv + 10.2, Sv + 13.2, 'Anthropic 的官方指南也提到，'], [Sv + 13.2, Sv + 17.8, 'git 记录和检查点能帮模型在多次会话之间接着干。'],
    [Br + .2, Br + 4.2, '有风险的尝试，开个分支去做。'],
    [Ts + .2, Ts + 2.4, '用测试当验收标准：'], [Ts + 2.4, Ts + 5.6, '先有测试，再让我改到测试通过。'], [Ts + 5.6, Ts + 9.2, '我能自己跑测试，就能自己发现问题。'],
    [Ts + 9.2, Ts + 12.6, '不过得防着我为了过测试耍小聪明，'], [Ts + 12.6, Ts + 14.8, '下一章细说。'],
    [Th + .2, Th + 4.4, '同一个问题失败三次，就停下来，三选一：'], [Th + 4.4, Th + 6.6, '回退到上一个提交，'], [Th + 6.6, Th + 9, '补充信息后新开对话，'], [Th + 9, Th + 11.2, '或者你自己写。'],
    [Bs + .2, Bs + 3.8, '要是你还在学基础语法，先别用我。'], [Bs + 3.8, Bs + 8.4, '自己写不出来的代码，你也看不出我错在哪。'], [Bs + 8.4, Bs + 13.2, '课程作业能不能用 AI、能用到什么程度，听老师的。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0],
    [Q + .8, 1.54, 0, .03, 0, 0, 0], [Q + 4.6, 1.5, -.04, .04, 0, 0, -.02], [Q + 8.4, 1.46, .04, .03, 0, 0, 0],
    [R + .8, 1.52, 0, .03, 0, 0, 0], [R + 6.2, 1.48, -.03, .03, 0, .02, 0], [R + 10.2, 1.5, 0, .03, 0, 0, 0],
    [Fl + .8, 1.56, .06, .03, 0, 0, 0], [Fl + 5.4, 1.48, .02, .03, 0, -.06, -.02], [Fl + 8.2, 1.54, -.04, .03, 0, .06, 0], [Fl + 11.8, 1.56, 0, .03, 0, 0, 0], [Fl + 16.8, 1.54, 0, .03, 0, 0, 0],
    [Sv + .8, 1.46, .1, .08, 0, -.04, 0], [Sv + 4.8, 1.5, .06, .07, 0, .02, 0], [Sv + 8.6, 1.46, .02, .06, 0, .08, 0], [Sv + 10.4, 1.56, 0, .04, 0, 0, 0], [Sv + 17.6, 1.52, -.04, .04, 0, .04, 0],
    [Br + 1.2, 1.46, -.06, .05, 0, .12, .06], [Br + 4.2, 1.46, -.04, .05, 0, .1, .06],
    [Ts + .8, 1.56, 0, .03, 0, 0, 0], [Ts + 5.6, 1.48, -.04, .03, 0, .1, 0], [Ts + 9.6, 1.48, .04, .03, 0, -.1, 0], [Ts + 14.6, 1.54, 0, .03, 0, 0, 0],
    [Th + .8, 1.46, 0, .03, 0, 0, .06], [Th + 4, 1.56, 0, .03, 0, 0, 0], [Th + 11.2, 1.54, .04, .03, 0, 0, 0],
    [Bs + .8, 1.52, -.04, .03, 0, -.04, 0], [Bs + 6.6, 1.46, -.02, .03, 0, -.1, 0], [Bs + 8.6, 1.54, .02, .03, 0, 0, 0], [Bs + 13.2, 1.5, 0, .03, 0, 0, 0],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'],
    [Q - .1, 'jump'], [tm.task, 'on'], ...tm.fIn.map(t => [t, 'pix']), ...FILES.map((_, i) => [tm.grab + i * .08, 'whoosh']).slice(0, 2), [tm.grab + .3, 'assemble'],
    ...Array.from({ length: 12 }, (_, i) => [tm.run0 + i * .2, 'step']), [tm.smoke, 'glitch'], [tm.smoke + .1, 'buzz'], [tm.drop, 'thump'], [tm.haze, 'whoosh'], ...tm.qs.map(t => [t, 'blip']),
    [tm.scope, 'sweep'], [tm.steps, 'on'], ...tm.ok.map(t => [t, 'ping']), [tm.bad, 'buzz'], [tm.shrink, 'sweep'], [tm.find, 'on'], [tm.undo, 'whoosh'], [tm.undo + .5, 'ping'],
    [Fl - .2, 'jump'], ...tm.st.flatMap(t => [[t, 'pix'], [t - .1, 'jump']]), [tm.plan, 'page'], [tm.edit, 'snip'], [tm.edit + .4, 'key'], [tm.stamp, 'thump'], [tm.stamp, 'hi'],
    [tm.mode, 'sweep'], [tm.mode + .3, 'on'], [tm.ppt, 'blip'],
    [Sv - .2, 'jump'], [tm.line, 'sweep'], ...tm.cm.flatMap(t => [[t - .45, 'jump'], [t, 'save']]), [tm.savL, 'sparkle'], ...Array.from({ length: 5 }, (_, i) => [tm.bad0 + i * .2, 'step']), [tm.bad0 + .6, 'glitch'],
    [tm.load, 'rewind'], [tm.load + .6, 'ping'], [tm.anth, 'on'], [tm.s1, 'on'], [tm.s1x, 'buzz'], [tm.s2, 'on'], [tm.cm5 - .45, 'jump'], [tm.cm5, 'save'],
    [tm.br, 'sweep'], [tm.brL, 'blip'], [tm.brJ, 'jump'], [tm.risk, 'on'],
    [Ts - .2, 'jump'], [tm.win, 'on'], [tm.win + .2, 'on'], ...tm.run.flatMap((t, i) => [[t, 'blip'], [t + .5, i < 2 ? 'buzz' : 'ping']]), [tm.sly, 'glitch'], [tm.slyC, 'blip'], [tm.next, 'on'],
    [Th - .2, 'jump'], ...tm.f.flatMap(t => [[t, 'buzz'], [t, 'thump']]), [tm.stop, 'glitch'], [tm.stop + .05, 'thump'], ...tm.op.flatMap(t => [[t - .1, 'jump'], [t, 'on']]),
    [Bs - .2, 'jump'], [tm.basic, 'on'], [tm.back, 'jump'], [tm.no, 'blip'], [tm.code, 'on'], [tm.lens0, 'sweep'], [tm.bug, 'buzz'], [tm.bug + .1, 'on'], [tm.rule, 'page'], [tm.ruleS, 'thump'], [tm.ruleS + .05, 'ping']];
  const SRC = 'Anthropic, Prompting best practices';
  const text = [...FILES, ...STEPS.map(s => s[0]), ...PLAN, PLAN_FIX, ...CMT.flat(), ...TESTS, ...OPT.flatMap(o => [o.t, o.s]), ...CODE.flat(), SRC,
    '第 7 章一口气改完登录功能要翻的范围 5 个文件只翻这一步好找退回去第步你计划模式课件 Qoder 的三种模式 OK 存档点读档 SAVE Anthropic 官方指南会话 1 2 上下文清空 git log --oneline main try/jwt 有风险的尝试分支不受影响 UserServiceTest.java gradle test passed failed 耍小聪明？→ 第 8 章同一个问题失败次数 STOP 还在学基础语法先别用我越界课程说明 AI 使用听老师的作业 ?'].join('');
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [Fl, 'dis'], [Sv, 'fluid'], [Ts, 'dis'], [Th, 'fluid'], [Bs, 'dis']],
    rips: [[tm.drop, 960 / 1920, FY / 1080], [tm.stamp, SX(2) / 1920, (PD.y + PD.h - 70) / 1080], [tm.load, NX[3] / 1920, 560 / 1080], [tm.f[2], 960 / 1920, 330 / 1080], [tm.ruleS, 1180 / 1920, 600 / 1080]],
    shakes: [[tm.drop, .008], [tm.stamp, .01], [tm.f[2], .012], [tm.ruleS, .008]],
    hud: { num: '07', name: '工作流程', from: Q + .3, srcs: [[Sv + 10.2, Br + 4.2, SRC]] },
  };
}

// ---------- 小工具 ----------
function box(ctx, x, y, w, h, fill, stroke, lw = 2, r = 14, dash) {
  if (h < .5 || w < .5) return;
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, h / 2, w / 2)); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
}
function win(ctx, x, y, w, h, title, tc) {
  box(ctx, x, y, w, h, COL.card, COL.line, 2, 16);
  ctx.fillStyle = COL.line; ctx.fillRect(x, y + 54, w, 1.5);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = COL.faint; ctx.beginPath(); ctx.arc(x + 28 + i * 20, y + 27, 6, 0, 6.283); ctx.fill(); }
  ctx.font = font(500, 24, MONO); ctx.fillStyle = tc; ctx.textAlign = 'left'; ctx.fillText(title, x + 100, y + 28);
}
function check(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .7); ctx.stroke(); }
function cross(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke(); }
function chip(ctx, s, cx, cy, k, c, f = font(600, 26), fill = COL.bg, h = 48) {
  if (k <= .01) return;
  ctx.font = f; const w = ctx.measureText(s).width + 44;
  popScale(ctx, cx, cy, k, () => { box(ctx, cx - w / 2, cy - h / 2, w, h, fill, c, 2.5, h / 2); ctx.font = f; ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, cx, cy + 1); ctx.textAlign = 'left'; });
}
function arrow(ctx, x1, y, x2, k, c) {
  if (k <= 0) return;
  const x = lerp(x1, x2, k);
  ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x - 6, y); ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x - 14, y - 11); ctx.lineTo(x - 14, y + 11); ctx.fill();
}
function fileIcon(ctx, cx, cy, s, name, c, lines = 5) {
  const w = FW * s, h = FH * s, x = cx - w / 2, y = cy - h / 2, d = 34 * s;
  ctx.fillStyle = COL.card; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w - d, y); ctx.lineTo(x + w, y + d); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w - d, y); ctx.lineTo(x + w - d, y + d); ctx.lineTo(x + w, y + d); ctx.stroke();
  ctx.fillStyle = rgba(COL.dim, .45);
  for (let j = 0; j < lines; j++) ctx.fillRect(x + 20 * s, y + (58 + j * 24) * s, (w - 40 * s) * (.45 + .55 * hash(j * 2.7 + name.length)), 8 * s);
  if (name && s > .6) { ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.dim; ctx.textAlign = 'center'; ctx.fillText(name, cx, y + h + 34); ctx.textAlign = 'left'; }
}
function puff(ctx, x, y, T, t0, n, spread, c) {
  for (let i = 0; i < n; i++) {
    const ph = ((T - t0) * .8 + hash(i * 3.3)) % 1, r = lerp(8, 30, ph) * (.7 + .6 * hash(i));
    ctx.globalAlpha = (1 - ph) * .6; ctx.fillStyle = c;
    ctx.fillRect(x + (hash(i * 7.1) - .5) * spread + Math.sin(T * 3 + i) * 10 - r / 2, y - ph * 120 - r / 2, r, r);
  }
  ctx.globalAlpha = 1;
}

// ---------- 章节卡 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 7 章', 1080, 330); ctx.globalAlpha = 1;
  dotsFor('07', 300, 12, 700, MONO, fv).pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.Q - .6);
}

// ---------- 一口气 · 原因：五个文件 ----------
const carried = (T, tm) => T >= tm.grab && T < tm.drop + .7;
const runX = (T, tm) => T < tm.run0 ? 0 : 430 * Math.sin((Math.min(T, tm.run1) - tm.run0) * 2.5) * (1 - prog(T, tm.run1 - .6, tm.run1));
function stackXY(st, i) { return [st.x + (i - 2) * 6, st.y - 8 * st.px - 70 - i * 40]; }
function filePos(T, pl, i) {
  const { tm } = pl, row = [FX(i), FY, 1];
  if (T < tm.grab) return row;
  const st = clawd(T, pl), s = stackXY(st, i), sk = [s[0], s[1], .42];
  const g = prog(T, tm.grab + i * .08, tm.grab + i * .08 + .5, MOTION.draw), d = prog(T, tm.drop + i * .06, tm.drop + i * .06 + .55, MOTION.draw);
  const a = g >= 1 ? sk : row.map((v, j) => lerp(v, sk[j], g)), arc = Math.sin(Math.PI * g) * 120 * (1 - d) + Math.sin(Math.PI * d) * 140;
  const p = a.map((v, j) => lerp(v, row[j], d));
  p[1] -= arc; return p;
}
function drawFiles(ctx, T, pl, layer) {
  const { tm } = pl;
  if ((layer === 'over') !== carried(T, pl.tm)) return;
  const inR = T >= tm.R, kst = prog(T, tm.steps, tm.steps + .6);
  FILES.forEach((n, i) => {
    const k = prog(T, tm.fIn[i], tm.fIn[i] + .45, MOTION.pop);
    if (k <= .01) return;
    const [x, y, s] = filePos(T, pl, i);
    let c = COL.fn;
    if (inR && kst > 0) { if (i < 2 && T >= tm.ok[i]) c = COL.str; if (i === BADF && T >= tm.bad) c = COL.err; if (i > BADF) c = mixC(COL.fn, COL.line, kst); }
    popScale(ctx, x, y, Math.min(k, 1.1), () => fileIcon(ctx, x, y, s, n, c));
    if (i === BADF && T >= tm.smoke && T < tm.haze + .8) { ctx.save(); ctx.globalAlpha = 1 - prog(T, tm.haze, tm.haze + .8); puff(ctx, x, y - FH * s / 2, T, tm.smoke, 9, 40 * s + 20, '#6b6f78'); ctx.restore(); }
  });
}
function drawFive(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Q, tm.Fl);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  chip(ctx, '一口气改完登录功能', 960, 190, prog(T, tm.task, tm.task + .45, MOTION.pop) * (1 - prog(T, tm.R - .4, tm.R)), COL.num, font(600, 30));
  drawFiles(ctx, T, pl, 'scene');
  ctx.globalAlpha = a;
  const hz = prog(T, tm.haze, tm.haze + .8) * (1 - prog(T, tm.R, tm.R + .8));
  if (hz > 0) for (let i = 0; i < 46; i++) {
    const hx = 160 + hash(i * 1.7) * 1600, hy = FY - 40 + (hash(i * 4.9) - .5) * 220 + Math.sin(T * 1.3 + i) * 14, r = 50 + 70 * hash(i * 2.2);
    ctx.globalAlpha = a * hz * .22; ctx.fillStyle = '#6b6f78'; ctx.fillRect(hx - r / 2, hy - r / 2, r, r);
  }
  ctx.globalAlpha = a;
  tm.qs.forEach((t, i) => { const k = prog(T, t, t + .4, MOTION.pop) * (1 - prog(T, tm.R, tm.R + .4)); chip(ctx, '?', FX(i), FY - 140, k, COL.num, font(700, 30, MONO), COL.card, 46); });
  // 原因：翻找范围从五个文件缩到一步
  const ks = prog(T, tm.scope, tm.scope + .6, MOTION.draw);
  if (ks > 0) {
    const sh = prog(T, tm.shrink, tm.shrink + .8, MOTION.draw), x0 = lerp(FX(0) - 120, FX(BADF) - 120, sh), x1 = lerp(FX(4) + 120, FX(BADF) + 120, sh);
    ctx.strokeStyle = COL.err; ctx.lineWidth = 3; ctx.setLineDash([12, 10]); ctx.lineDashOffset = -T * 30;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, 1920 * ks + 1, 1080); ctx.clip();
    ctx.beginPath(); ctx.roundRect(x0, FY - 150, x1 - x0, 330, 20); ctx.stroke(); ctx.restore(); ctx.setLineDash([]); ctx.lineDashOffset = 0;
    ctx.font = font(600, 30); ctx.fillStyle = COL.err; ctx.textAlign = 'center';
    ctx.globalAlpha = a * ks * (1 - sh); ctx.fillText('要翻的范围：5 个文件', 960, FY - 186);
    ctx.globalAlpha = a * sh; ctx.fillText('只翻这一步', FX(BADF), FY - 186); ctx.textAlign = 'left'; ctx.globalAlpha = a;
  }
  const kst = prog(T, tm.steps, tm.steps + .6);
  if (kst > 0) {
    for (let i = 0; i < 4; i++) arrow(ctx, FX(i) + 92, FY, FX(i + 1) - 92, kst, mixC(COL.line, COL.dim, .5));
    FILES.forEach((_, i) => { chip(ctx, `第 ${i + 1} 步`, FX(i), FY + 192, kst, i < 2 && T >= tm.ok[i] ? COL.str : i === BADF && T >= tm.bad ? COL.err : COL.dim, font(600, 24), COL.card, 42); });
    tm.ok.forEach((t, i) => { const k = prog(T, t, t + .4, MOTION.pop); if (k > .01) popScale(ctx, FX(i) + 60, FY - 70, k, () => { ctx.fillStyle = COL.bg; ctx.beginPath(); ctx.arc(FX(i) + 60, FY - 70, 24, 0, 6.283); ctx.fill(); check(ctx, FX(i) + 60, FY - 70, 12, COL.str); }); });
    const kb = prog(T, tm.bad, tm.bad + .4, MOTION.pop);
    if (kb > .01) popScale(ctx, FX(BADF) + 60, FY - 70, kb, () => { ctx.fillStyle = COL.bg; ctx.beginPath(); ctx.arc(FX(BADF) + 60, FY - 70, 24, 0, 6.283); ctx.fill(); cross(ctx, FX(BADF) + 60, FY - 70, 10, COL.err); });
  }
  chip(ctx, '好找', FX(BADF) + 190, FY - 70, prog(T, tm.find, tm.find + .45, MOTION.pop), COL.num, font(600, 26), COL.card);
  const ku = prog(T, tm.undo, tm.undo + .7, MOTION.draw);
  if (ku > 0) {
    const ax = FX(BADF), bx = FX(1), y = FY + 250;
    ctx.strokeStyle = COL.str; ctx.lineWidth = 4; ctx.beginPath();
    for (let j = 0; j <= 30 * ku; j++) { const u = j / 30, x = lerp(ax, bx, u), yy = y + Math.sin(Math.PI * u) * 46; j ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); }
    ctx.stroke();
    if (ku >= 1) { ctx.fillStyle = COL.str; ctx.beginPath(); ctx.moveTo(bx - 4, y - 4); ctx.lineTo(bx + 18, y + 6); ctx.lineTo(bx + 4, y + 22); ctx.fill(); }
    ctx.globalAlpha = a * prog(T, tm.undo + .4, tm.undo + .8); ctx.font = font(600, 28); ctx.fillStyle = COL.str; ctx.textAlign = 'center'; ctx.fillText('退回去', (ax + bx) / 2, y + 86); ctx.textAlign = 'left';
  }
  ctx.restore();
}

// ---------- 流程 ----------
function drawFlow(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Fl, tm.Sv);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  STEPS.forEach(([s, hum], i) => {
    if (i > 0) arrow(ctx, SX(i - 1) + SW / 2 + 6, SY, SX(i) - SW / 2 - 6, prog(T, tm.st[i] - .3, tm.st[i], MOTION.draw), COL.faint);
    const k = prog(T, tm.st[i], tm.st[i] + .45, MOTION.pop);
    if (k <= .01) return;
    const c = hum ? HUM : COL.clawd, done = hum ? T >= tm.stamp : T >= (tm.st[i + 1] ?? tm.st[5] + 1) - .1;
    popScale(ctx, SX(i), SY, Math.min(k, 1.1), () => {
      box(ctx, SX(i) - SW / 2, SY - SH / 2, SW, SH, mixC(COL.card, c, done ? .14 : .05), c, hum ? 4 : 2.5, 14);
      ctx.font = font(600, 34); ctx.textAlign = 'center'; ctx.fillStyle = hum ? HUM : COL.text; ctx.fillText(s, SX(i), SY + 2);
      ctx.font = font(400, 18, MONO); ctx.fillStyle = COL.faint; ctx.fillText(String(i + 1).padStart(2, '0'), SX(i), SY + SH / 2 - 16); ctx.textAlign = 'left';
    });
    if (hum) chip(ctx, '你', SX(i) + SW / 2 - 6, SY - SH / 2 - 4, k, HUM, font(700, 24), COL.card, 40);
  });
  // 计划文档：你来改
  const kp = prog(T, tm.plan, tm.plan + .6, MOTION.pop) * (1 - prog(T, tm.mode - .6, tm.mode - .1));
  if (kp > .01) popScale(ctx, PD.x + PD.w / 2, PD.y, Math.min(kp, 1.08), () => {
    box(ctx, PD.x, PD.y, PD.w, PD.h, COL.card, T >= tm.edit ? HUM : COL.line, 2.5, 16);
    ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText('plan.md', PD.x + 32, PD.y + 36);
    PLAN.forEach((l, j) => {
      const y = PD.y + 92 + j * 54;
      ctx.font = font(500, 30); ctx.fillStyle = COL.text;
      if (j === 2 && T >= tm.edit) {
        const ke = prog(T, tm.edit, tm.edit + .4), w = ctx.measureText(l).width;
        ctx.globalAlpha = a * (1 - .6 * ke); ctx.fillText(l, PD.x + 32, y); ctx.globalAlpha = a;
        ctx.fillStyle = COL.err; ctx.fillRect(PD.x + 28, y - 2, (w + 8) * ke, 4);
        const kf = prog(T, tm.edit + .4, tm.edit + .9);
        if (kf > 0) { ctx.globalAlpha = a * kf; ctx.fillStyle = HUM; ctx.fillText(PLAN_FIX, PD.x + 32, y + 40); ctx.globalAlpha = a; }
      } else ctx.fillText(l, PD.x + 32, j === 3 && T >= tm.edit + .4 ? y + 40 * prog(T, tm.edit + .3, tm.edit + .7) : y);
    });
    const ks = prog(T, tm.stamp, tm.stamp + .3, Easing.easeOutQuad);
    if (ks > 0) {
      const sc = lerp(2.2, 1, ks);
      ctx.save(); ctx.globalAlpha = a * Math.min(1, ks * 3); ctx.translate(PD.x + PD.w - 110, PD.y + PD.h - 70); ctx.rotate(-.12); ctx.scale(sc, sc);
      ctx.strokeStyle = HUM; ctx.lineWidth = 4; ctx.fillStyle = rgba(HUM, .15); ctx.beginPath(); ctx.roundRect(-86, -40, 172, 80, 10); ctx.fill(); ctx.stroke();
      ctx.font = font(700, 40, MONO); ctx.fillStyle = HUM; ctx.textAlign = 'center'; ctx.fillText('OK', 0, 2); ctx.restore();
    }
  });
  // 计划模式
  const km = prog(T, tm.mode, tm.mode + .7, MOTION.draw);
  if (km > 0) {
    const x0 = SX(0) - SW / 2, x1 = lerp(x0, SX(2) + SW / 2, km), y = SY + SH / 2 + 34;
    ctx.strokeStyle = COL.kw; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y - 16); ctx.lineTo(x0, y); ctx.lineTo(x1, y); if (km >= 1) ctx.lineTo(x1, y - 16); ctx.stroke();
    chip(ctx, '计划模式', (SX(0) + SX(2)) / 2, y + 46, prog(T, tm.mode + .3, tm.mode + .75, MOTION.pop), COL.kw, font(600, 30), COL.card, 54);
  }
  chip(ctx, '课件：Qoder 的三种模式', (SX(0) + SX(2)) / 2, SY + SH / 2 + 160, prog(T, tm.ppt, tm.ppt + .45, MOTION.pop), COL.dim, font(500, 26), COL.card);
  ctx.restore();
}

// ---------- 存档 · 分支 ----------
const tY = (T, tm) => lerp(560, 430, prog(T, tm.up, tm.up + .8, MOTION.draw));
const badX = (T, tm) => lerp(NX[3], 1460, prog(T, tm.bad0, tm.bad1, Easing.linear)) - (1460 - NX[3]) * prog(T, tm.load, tm.load + .6, MOTION.draw);
function saveIcon(ctx, x, y, s, c) {
  ctx.fillStyle = c; ctx.fillRect(x - 20 * s, y - 20 * s, 40 * s, 40 * s);
  ctx.fillStyle = COL.bg; ctx.fillRect(x - 11 * s, y - 20 * s, 22 * s, 13 * s); ctx.fillRect(x - 13 * s, y + 3 * s, 26 * s, 14 * s);
  ctx.fillStyle = c; ctx.fillRect(x + 3 * s, y - 18 * s, 5 * s, 9 * s);
}
function brPath(T, tm) { const y = tY(T, tm); return { x0: NX[4], y0: y, x1: NX[4] + 120, y1: y - 150, x2: 1760 }; }
function drawGit(ctx, T, pl) {
  const { tm } = pl, end = Math.min(tm.Ts, pl.end ?? 1e9), a = fio(T, tm.Sv, end);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const y = tY(T, tm), kl = prog(T, tm.line, tm.line + 1, MOTION.draw), xe = lerp(180, 1760, kl);
  const safe = prog(T, tm.risk, tm.risk + .5);
  ctx.fillStyle = mixC('#5a5f6b', COL.str, safe * .8); ctx.fillRect(180, y - 3, xe - 180, 6);
  ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.faint; if (kl > .1) ctx.fillText('main', 180, y - 34);
  const nC = T >= tm.cm5 ? 5 : 4;
  for (let i = 0; i < nC; i++) {
    const t = i < 4 ? tm.cm[i] : tm.cm5, k = prog(T, t, t + .45, MOTION.pop);
    if (k <= .01) continue;
    const glow = bump(T, tm.savL + i * .12, .3) + bump(T, tm.load + .5, .3) * (i === 3);
    popScale(ctx, NX[i], y, Math.min(k, 1.15), () => {
      ctx.fillStyle = COL.bg; ctx.strokeStyle = i === 4 ? COL.type : COL.str; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(NX[i], y, 17, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.font = font(600, 22, MONO); ctx.textAlign = 'center'; ctx.fillStyle = COL.num; ctx.fillText(CMT[i][0], NX[i], y + 46);
      ctx.font = font(500, 24); ctx.fillStyle = COL.dim; ctx.fillText(CMT[i][1], NX[i], y + 82); ctx.textAlign = 'left';
    });
    const fl = qk(T, t, 1.1) + glow;
    if (fl > .01) { ctx.save(); ctx.globalAlpha = a * Math.min(1, fl); saveIcon(ctx, NX[i] + 70, y - 70, 1, mixC(COL.num, '#ffffff', glow * .5)); ctx.font = font(700, 18, MONO); ctx.fillStyle = COL.num; ctx.fillText('SAVE', NX[i] + 96, y - 70); ctx.restore(); }
  }
  ctx.globalAlpha = a;
  chip(ctx, '存档点', (NX[0] + NX[3]) / 2, y - 150, prog(T, tm.savL, tm.savL + .45, MOTION.pop) * (1 - prog(T, tm.up - .3, tm.up)), COL.num, font(600, 30), COL.card);
  // 改坏的一段：读档后收回
  if (T >= tm.bad0 && T < tm.load + .8) {
    const bx = badX(T, tm);
    ctx.strokeStyle = COL.err; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(NX[3] + 20, y);
    for (let x = NX[3] + 40; x < bx; x += 20) ctx.lineTo(x, y + (Math.floor(x / 20) % 2 ? -12 : 12) + (hash(Math.floor(T * 14) + x) - .5) * 6);
    ctx.stroke();
    if (T < tm.load) puff(ctx, bx, y - 20, T, tm.bad0, 6, 30, '#6b6f78');
  }
  chip(ctx, '读档', NX[3], y - 150, qk(T, tm.load, 1.6), COL.str, font(700, 30), COL.card);
  // 会话 1 / 会话 2
  const ks = fio(T, tm.s1, tm.Br + .6);
  if (ks > 0) {
    ctx.globalAlpha = a * ks;
    const by = 590, bh = 210;
    box(ctx, 250, by, 560, bh, COL.card, T >= tm.s1x ? COL.faint : COL.line, 2, 14);
    ctx.font = font(600, 28); ctx.fillStyle = T >= tm.s1x ? COL.faint : COL.text; ctx.fillText('会话 1', 286, by + 46);
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText('写 login() · 锁定 · 测试', 286, by + 96);
    const kx = prog(T, tm.s1x, tm.s1x + .4);
    if (kx > 0) { ctx.globalAlpha = a * ks * kx; ctx.font = font(600, 26); ctx.fillStyle = COL.err; ctx.fillText('上下文清空', 286, by + 156); ctx.globalAlpha = a * ks; }
    const k2 = prog(T, tm.s2, tm.s2 + .5, MOTION.pop);
    if (k2 > .01) popScale(ctx, 1210, by + bh / 2, Math.min(k2, 1.08), () => {
      box(ctx, 930, by, 560, bh, COL.card, COL.type, 2.5, 14);
      ctx.font = font(600, 28); ctx.fillStyle = COL.text; ctx.fillText('会话 2', 966, by + 46);
      ctx.font = font(500, 24, MONO); drawTyped(ctx, T, pl.ty.log, 966, by + 96, COL.str, T < tm.cm5);
      const kl2 = prog(T, tm.log + .9, tm.log + 1.6);
      ctx.globalAlpha = a * ks * kl2; ctx.font = font(400, 20, MONO);
      [3, 2, 1].forEach((j, r) => { ctx.fillStyle = COL.num; ctx.fillText(CMT[j][0], 966, by + 136 + r * 26); ctx.fillStyle = COL.dim; ctx.fillText(CMT[j][1], 1036, by + 136 + r * 26); });
    });
    const ka = prog(T, tm.log + .6, tm.log + 1.2, MOTION.draw);
    if (ka > 0) { ctx.globalAlpha = a * ks; ctx.strokeStyle = rgba(COL.type, .7); ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(NX[3], y + 100); ctx.lineTo(lerp(NX[3], 1090, ka), lerp(y + 100, by - 4, ka)); ctx.stroke(); ctx.setLineDash([]); }
  }
  ctx.globalAlpha = a;
  chip(ctx, 'Anthropic · 官方指南', 960, 190, prog(T, tm.anth, tm.anth + .45, MOTION.pop) * (1 - prog(T, tm.Br - .3, tm.Br)), COL.kw, font(600, 28));
  // 分支
  const kb = prog(T, tm.br, tm.br + .9, MOTION.draw);
  if (kb > 0) {
    const b = brPath(T, tm);
    ctx.strokeStyle = COL.num; ctx.lineWidth = 6; ctx.setLineDash([16, 10]); ctx.beginPath(); ctx.moveTo(b.x0, b.y0);
    const k1 = clamp(kb * 2, 0, 1), k2 = clamp(kb * 2 - 1, 0, 1);
    ctx.quadraticCurveTo(b.x0 + 20, lerp(b.y0, b.y1, k1), lerp(b.x0, b.x1, k1), lerp(b.y0, b.y1, k1));
    if (k2 > 0) ctx.lineTo(lerp(b.x1, b.x2, k2), b.y1);
    ctx.stroke(); ctx.setLineDash([]);
    chip(ctx, 'try/jwt', b.x2 - 90, b.y1 + 44, prog(T, tm.brL, tm.brL + .45, MOTION.pop), COL.num, font(600, 26, MONO), COL.card);
    chip(ctx, '有风险的尝试 → 开分支', b.x1 + 150, b.y1 - 140, prog(T, tm.risk, tm.risk + .45, MOTION.pop), COL.num, font(600, 26), COL.card);
    ctx.globalAlpha = a * safe; ctx.font = font(500, 24); ctx.fillStyle = COL.str; ctx.fillText('main 不受影响', 196, y + 140);
  }
  ctx.restore();
}

// ---------- 测试 ----------
const runIdx = (T, tm) => tm.run.reduce((r, t, i) => T >= t + .5 ? i : r, -1);
function drawTests(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Ts, tm.Th);
  if (a <= 0) return;
  ctx.save();
  [[TW, 'UserServiceTest.java', COL.fn], [TR, 'terminal', COL.dim]].forEach(([w, t, c], j) => {
    const k = prog(T, tm.win + j * .2, tm.win + j * .2 + .5);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = a * k; ctx.translate(0, 20 * (1 - k)); win(ctx, w.x, w.y, w.w, w.h, t, c); ctx.restore();
  });
  const ri = runIdx(T, tm);
  TESTS.forEach((n, i) => {
    const k = prog(T, tm.tests[i], tm.tests[i] + .4);
    if (k <= 0) return;
    const y = TW.y + 120 + i * 100, ok = ri >= 0 ? RUNS[ri][i] : -1;
    ctx.globalAlpha = a * k;
    const gh = i === 2 && T >= tm.sly ? fio(T, tm.sly, tm.next, .2, .6) * (hash(Math.floor(T * 16)) > .45 ? 1 : .25) : 0;
    if (gh > 0) { ctx.globalAlpha = a * k * gh; ctx.font = font(700, 22, MONO); ctx.fillStyle = COL.err; ctx.fillText('//', TW.x + 90, y - 20); ctx.globalAlpha = a * k; }
    ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.kw; ctx.fillText('@Test', TW.x + 90 + 40 * Math.min(1, gh * 2), y - 20);
    ctx.font = font(500, 30, MONO); ctx.fillStyle = COL.text; ctx.fillText('void ' + n, TW.x + 90, y + 16);
    const c = ok === 1 ? COL.str : ok === 0 ? COL.err : COL.faint;
    ctx.fillStyle = rgba(c, .2); ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(TW.x + 50, y, 20, 0, 6.283); ctx.fill(); ctx.stroke();
    if (ok === 1) check(ctx, TW.x + 50, y, 10, COL.str); else if (ok === 0) cross(ctx, TW.x + 50, y, 8, COL.err);
  });
  ctx.globalAlpha = a;
  tm.run.forEach((t, i) => {
    const k = prog(T, t, t + .3);
    if (k <= 0 || T >= (tm.run[i + 1] ?? 1e9)) return;
    const y0 = TR.y + 110;
    ctx.globalAlpha = a * k; ctx.font = font(500, 28, MONO); ctx.fillStyle = COL.str; ctx.fillText('$', TR.x + 40, y0); ctx.fillStyle = COL.text; ctx.fillText('gradle test', TR.x + 72, y0);
    if (T >= t + .5) {
      const p = RUNS[i].reduce((s, v) => s + v, 0), f = 3 - p;
      ctx.font = font(500, 26, MONO);
      RUNS[i].forEach((v, j) => { ctx.fillStyle = v ? COL.str : COL.err; ctx.fillText((v ? 'PASS ' : 'FAIL ') + TESTS[j], TR.x + 40, y0 + 64 + j * 44); });
      ctx.font = font(700, 34, MONO); ctx.fillStyle = f ? COL.err : COL.str;
      ctx.fillText(f ? `${p} passed, ${f} failed` : '3 passed', TR.x + 40, y0 + 230);
    }
    ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText(`run ${i + 1}`, TR.x + TR.w - 36, TR.y + 28); ctx.textAlign = 'left';
  });
  ctx.globalAlpha = a;
  chip(ctx, '耍小聪明？', TW.x + 690, TW.y + 320, prog(T, tm.slyC, tm.slyC + .45, MOTION.pop) * (1 - prog(T, tm.Th - .5, tm.Th)), COL.err, font(600, 26), COL.card);
  chip(ctx, '→ 第 8 章', TR.x + TR.w / 2, TR.y + TR.h + 70, prog(T, tm.next, tm.next + .45, MOTION.pop), COL.kw, font(600, 28), COL.card);
  ctx.restore();
}

// ---------- 三次 ----------
const fails = (T, tm) => tm.f.reduce((n, t) => T >= t ? n + 1 : n, 0);
function drawThree(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Th, tm.Bs);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const n = fails(T, tm), last = n ? tm.f[n - 1] : 0, jx = n && T < last + .35 ? Math.sin(T * 90) * 8 * (1 - (T - last) / .35) : 0;
  const k = prog(T, tm.Th + .3, tm.Th + .7), c = n >= 3 ? COL.err : n ? COL.num : COL.dim, up = prog(T, tm.op[0] - .6, tm.op[0], MOTION.draw), cy = lerp(330, 230, up), sc = lerp(1, .7, up);
  if (k > 0) popScale(ctx, 960, cy, sc, () => {
    ctx.globalAlpha = a * k;
    box(ctx, 960 - 280 + jx, cy - 110, 560, 220, COL.card, c, 3, 18);
    ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.textAlign = 'center'; ctx.fillText('同一个问题 · 失败次数', 960 + jx, cy - 64);
    const bump1 = n ? 1 + .25 * Math.exp(-(T - last) * 8) : 1;
    ctx.save(); ctx.translate(960 + jx, cy + 30); ctx.scale(bump1, bump1); ctx.font = font(700, 110, MONO); ctx.fillStyle = c; ctx.fillText(String(n), 0, 0); ctx.restore();
    ctx.textAlign = 'left';
  });
  chip(ctx, 'STOP', 960 + 330 * sc, cy - 90 * sc, prog(T, tm.stop, tm.stop + .4, MOTION.pop), COL.err, font(700, 32, MONO), COL.card, 54);
  OPT.forEach((o, i) => {
    const ko = prog(T, tm.op[i], tm.op[i] + .45, MOTION.pop);
    if (ko <= .01) return;
    popScale(ctx, o.x, OY + OH / 2, Math.min(ko, 1.1), () => {
      box(ctx, o.x - OW / 2, OY, OW, OH, COL.card, i === 2 ? HUM : COL.type, 2.5, 16);
      ctx.font = font(700, 30, MONO); ctx.fillStyle = i === 2 ? HUM : COL.type; ctx.fillText(o.k, o.x - OW / 2 + 32, OY + 50);
      ctx.font = font(600, 34); ctx.fillStyle = COL.text; ctx.fillText(o.t, o.x - OW / 2 + 32, OY + 104);
      if (o.s) { ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText(o.s, o.x - OW / 2 + 32, OY + 142); }
    });
  });
  ctx.restore();
}

// ---------- 基础 ----------
function drawBasic(ctx, T, pl) {
  const { tm } = pl, end = pl.end || tm.Bs + 13.5, a = fio(T, tm.Bs, end);
  if (a <= 0) return;
  ctx.save();
  const kc = fio(T, tm.Bs, tm.rule + .2);
  if (kc > 0) {
    ctx.globalAlpha = a * kc;
    chip(ctx, '还在学基础语法', CK.x + 190, CK.y - 70, prog(T, tm.basic, tm.basic + .45, MOTION.pop), COL.num, font(600, 28), COL.card);
    const k = prog(T, tm.basic + .2, tm.basic + .7);
    ctx.globalAlpha = a * kc * k;
    box(ctx, CK.x, CK.y, CK.w, CK.h, COL.card, COL.line, 2, 16);
    ctx.font = font(500, 32, MONO);
    const kb = prog(T, tm.bug, tm.bug + .4);
    CODE.forEach((parts, j) => {
      let x = CK.x + 48; const y = CK.y + 70 + j * 64;
      parts.forEach((s, m) => {
        const bug = j === 1 && m === 1;
        if (bug && kb > 0) { const w = ctx.measureText(s).width; ctx.fillStyle = rgba(COL.err, .25 * kb); ctx.fillRect(x - 6, y - 28, w + 12, 56); ctx.fillStyle = COL.err; ctx.fillRect(x - 6, y + 26, (w + 12) * kb, 4); }
        ctx.fillStyle = bug && kb > 0 ? mixC(COL.text, COL.err, kb) : j === 1 && m === 0 ? COL.kw : COL.text;
        ctx.fillText(s, x, y); x += ctx.measureText(s).width;
      });
    });
    // 放大镜：照了一圈也找不到
    const kl = fio(T, tm.lens0, tm.bug + .6, .3, .4);
    if (kl > 0) {
      const u = prog(T, tm.lens0, tm.lens1, Easing.linear), lx = CK.x + 200 + 600 * (.5 + .5 * Math.sin(u * 7.5)), ly = CK.y + 100 + 150 * (.5 + .5 * Math.sin(u * 4.3 + 1));
      const fx = T >= tm.lens1 ? lerp(lx, CK.x + 48 + 330, prog(T, tm.lens1, tm.bug)) : lx, fy = T >= tm.lens1 ? lerp(ly, CK.y + 134, prog(T, tm.lens1, tm.bug)) : ly;
      ctx.globalAlpha = a * kc * kl; ctx.strokeStyle = COL.text; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(fx, fy, 54, 0, 6.283); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.06)'; ctx.fill(); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(fx + 38, fy + 38); ctx.lineTo(fx + 90, fy + 90); ctx.stroke();
      if (T < tm.lens1) { ctx.font = font(700, 34, MONO); ctx.fillStyle = COL.num; ctx.fillText('?', fx + 66, fy - 50); }
    }
    ctx.globalAlpha = a * kc;
    chip(ctx, '越界', CK.x + 48 + 330, CK.y + 134 + 76, prog(T, tm.bug + .2, tm.bug + .6, MOTION.pop), COL.err, font(600, 26), COL.card);
  }
  // 课程说明：听老师的
  const kr = prog(T, tm.rule, tm.rule + .5, MOTION.pop);
  if (kr > .01) {
    ctx.globalAlpha = a;
    popScale(ctx, 900, 470, Math.min(kr, 1.08), () => {
      box(ctx, 560, 230, 680, 460, COL.card, COL.line, 2, 18);
      ctx.font = font(600, 36); ctx.fillStyle = COL.text; ctx.fillText('课程说明', 610, 296);
      ctx.fillStyle = COL.line; ctx.fillRect(610, 336, 580, 2);
      ctx.font = font(600, 30); ctx.fillStyle = COL.fn; ctx.fillText('作业 · AI 使用', 610, 392);
      ctx.fillStyle = rgba(COL.dim, .45); for (let j = 0; j < 4; j++) ctx.fillRect(610, 440 + j * 44, 560 * (.5 + .5 * hash(j * 3.7)), 10);
      const ks = prog(T, tm.ruleS, tm.ruleS + .3, Easing.easeOutQuad);
      if (ks > 0) {
        const sc = lerp(2.2, 1, ks);
        ctx.save(); ctx.globalAlpha = a * Math.min(1, ks * 3); ctx.translate(1080, 600); ctx.rotate(-.1); ctx.scale(sc, sc);
        ctx.strokeStyle = HUM; ctx.lineWidth = 4; ctx.fillStyle = rgba(HUM, .15); ctx.beginPath(); ctx.roundRect(-130, -42, 260, 84, 10); ctx.fill(); ctx.stroke();
        ctx.font = font(700, 38); ctx.fillStyle = HUM; ctx.textAlign = 'center'; ctx.fillText('听老师的', 0, 2); ctx.restore();
      }
    });
  }
  ctx.restore();
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.Q) return drawCard(ctx, T, pl, fv);
  if (T < tm.Fl) return drawFive(ctx, T, pl);
  if (T < tm.Sv) return drawFlow(ctx, T, pl);
  if (T < tm.Ts) return drawGit(ctx, T, pl);
  if (T < tm.Th) return drawTests(ctx, T, pl);
  if (T < tm.Bs) return drawThree(ctx, T, pl);
  drawBasic(ctx, T, pl);
}

// ---------- Clawd ----------
function clawd(T, pl) {
  const { tm } = pl, prev = pl.prev || [960, 600, 12];
  const run = t => [CQ[0] + runX(t, tm), CQ[1], CQ[2]], stp = i => [SX(i), SY - SH / 2, 9];
  const nd = i => t => [NX[i], tY(t, tm) - 20, 8], bad = t => [badX(t, tm) + 30, tY(t, tm) - 20, 8], brP = t => { const b = brPath(t, tm); return [b.x1 + 40, b.y1 - 6, 8]; };
  const J = [[tm.S - .55, tm.S + .35, prev, C0], [tm.Q - .1, tm.Q + .6, C0, CQ], [tm.Fl - .2, tm.Fl + .5, run, [SX(0), 600, 10]]];
  tm.st.forEach((t, i) => J.push([t - .1, t + .4, i ? stp(i - 1) : [SX(0), 600, 10], stp(i)]));
  J.push([tm.Sv - .2, tm.Sv + .5, stp(5), [200, 540, 8]], [tm.cm[0] - .45, tm.cm[0], [200, 540, 8], nd(0)]);
  for (let i = 1; i < 4; i++) J.push([tm.cm[i] - .45, tm.cm[i], nd(i - 1), nd(i)]);
  J.push([tm.load, tm.load + .5, bad, nd(3)], [tm.cm5 - .45, tm.cm5, nd(3), nd(4)], [tm.brJ, tm.brJ + .55, nd(4), brP],
    [tm.Ts - .2, tm.Ts + .5, brP, [960, 820, 10]], [tm.Th - .2, tm.Th + .5, [960, 820, 10], [960, 760, 11]]);
  OPT.forEach((o, i) => J.push([tm.op[i] - .1, tm.op[i] + .45, i ? [OPT[i - 1].x, 850, 9] : [960, 760, 11], [o.x, 850, 9]]));
  J.push([tm.Bs - .2, tm.Bs + .5, [OPT[2].x, 850, 9], [1440, 640, 14]], [tm.back, tm.back + .5, [1440, 640, 14], [1560, 700, 13]], [tm.rule - .2, tm.rule + .4, [1560, 700, 13], [1480, 760, 12]]);
  const r = jumpPos(T, J, prev);
  let [x, y, px] = r.p;
  if (!r.air && T >= tm.Q + .6 && T < tm.Fl - .2) [x, y, px] = run(T);
  if (!r.air && T >= tm.bad0 && T < tm.load) [x, y, px] = bad(T);
  if (!r.air && T >= tm.Sv && T < tm.Ts - .2) { const ny = tY(T, tm) - 20; if (T < tm.brJ) y = ny; }
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  const nod = (t, d = 1.3) => { if (T >= t && T < t + d) st.nod = Math.sin((T - t) * 5) > .3; };
  if (T >= tm.S + .35 && T < tm.Q - .1) st.eye = 1;
  if (T >= tm.grab - .1 && T < tm.drop) { st.pose = 'up'; if (T >= tm.run0 && T < tm.run1) { st.walk = T * 18; st.eye = Math.cos((T - tm.run0) * 2.5) > 0 ? 1 : -1; } }
  if (T >= tm.smoke && T < tm.R) st.sweat = T - tm.smoke;
  if (T >= tm.spin0 && T < tm.spin1) { st.eye = Math.sin((T - tm.spin0) * 9) > 0 ? 1 : -1; st.q = qk(T, tm.spin0 + .4, 2.4); }
  if (T >= tm.find - .1 && T < tm.find + .9) st.pose = 'point';
  if (T >= tm.st[2] + .4 && T < tm.stamp) { st.eye = -1; st.q = qk(T, tm.st[2] + .6, 1.4); }
  nod(tm.stamp + .1);
  if (T >= tm.bad0 && T < tm.load) { st.walk = T * 16; st.sweat = T - tm.bad0; }
  if (T >= tm.load && T < tm.load + .5) st.alpha = .4 + .6 * (hash(Math.floor(T * 30)) > .4);
  nod(tm.cm5 + .1);
  if (T >= tm.typ0 && T < tm.typ1) { st.pose = 'type'; st.ph = T * 22; st.eye = T < tm.run[0] ? -1 : 1; }
  if (T >= tm.sly && T < tm.next) { st.eye = Math.floor((T - tm.sly) * 2) % 2 ? 1 : -1; }
  tm.f.forEach(t => { if (T >= t && T < t + .3) st.squash = 1 - .25 * Math.sin(Math.PI * (T - t) / .3); });
  if (T >= tm.f[0] && T < tm.op[0] - .1) st.sweat = T - tm.f[0];
  if (T >= tm.f[2] && T < tm.f[2] + 1.2) st.q = qk(T, tm.f[2] + .2, 1);
  if (T >= tm.no && T < tm.code + .4) { st.pose = 'up'; st.eye = -1; }
  if (T >= tm.lens0 && T < tm.bug) st.eye = -1;
  if (T >= tm.bug && T < tm.rule) st.sweat = T - tm.bug;
  nod(tm.ruleS + .2);
  return st;
}

// ---------- 演员层：抱着的文件、「先别用我」 ----------
function over(ctx, T, pl) {
  const { tm } = pl;
  ctx.textBaseline = 'middle';
  if (carried(T, tm)) { ctx.save(); drawFiles(ctx, T, pl, 'over'); ctx.restore(); }
  const k = prog(T, tm.no, tm.no + .45, MOTION.pop) * (1 - prog(T, tm.code, tm.code + .4));
  if (k > .01) { const st = clawd(T, pl); chip(ctx, '先别用我', st.x, st.y - 8 * st.px - 60, k, COL.clawd, font(600, 28), COL.card); }
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.Q - .6, tm.Q, Easing.linear);
  let gl = 0;
  const sp = (t, a, d) => { if (T >= t) gl = Math.max(gl, a * Math.exp(-(T - t) * d)); };
  sp(tm.smoke, .35, 6); sp(tm.bad, .2, 7); sp(tm.bad0 + .6, .35, 5); sp(tm.load, .5, 4); sp(tm.s1x, .2, 7); sp(tm.sly, .3, 4); sp(tm.f[2], .4, 6); sp(tm.stop, .3, 6); sp(tm.bug, .2, 7);
  let rays = 0, light = [.5, .44];
  if (T < tm.Q) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T >= tm.Fl && T < tm.Sv) { rays = .4 * bump(T, tm.stamp + .1, .45); light = [(PD.x + PD.w - 110) / 1920, (PD.y + PD.h - 70) / 1080]; }
  else if (T >= tm.Sv && T < tm.Ts) { rays = .35 * bump(T, tm.savL + .3, .5) + .35 * bump(T, tm.load + .5, .4); light = [NX[3] / 1920, 500 / 1080]; }
  else if (T >= tm.Ts && T < tm.Th) { rays = .3 * bump(T, tm.run[2] + .6, .5); light = [(TR.x + 200) / 1920, (TR.y + 340) / 1080]; }
  else if (T >= tm.Bs) { rays = .35 * bump(T, tm.ruleS + .1, .45); light = [1080 / 1920, 600 / 1080]; }
  return { gl, rays, light,
    energy: lerp(.38, 1, card) + .12 * bump(T, tm.stamp, .5) + .15 * bump(T, tm.load + .3, .5),
    warm: .15 + .35 * prog(T, tm.smoke, tm.smoke + .6) * (1 - prog(T, tm.R, tm.R + 1.5)) + .3 * bump(T, tm.bad1, .7) + .45 * prog(T, tm.f[1], tm.f[2] + .3) * (1 - prog(T, tm.op[0], tm.op[0] + 1.2)),
    floor: Math.max(.65 * card, .7 * prog(T, tm.Sv, tm.Sv + 1) * (1 - prog(T, tm.Ts - .4, tm.Ts))) };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"07 章节卡 · 一口气 · 原因":[["07 章节卡",3.5],["07 一口气",11.5],["07 原因",10.5]],"07 流程 · 存档":[["07 流程",17],["07 存档",18]],"07 分支 · 测试":[["07 分支",4.5],["07 测试",15]],"07 三次 · 基础":[["07 三次",11.5],["07 基础",13.5]]};

return { plan, scene, clawd, fx, over, parts: TL_PARTS };
};
