// 第 4 章　上下文
(window.VC_CH = window.VC_CH || {})[4] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, blink, typedN, typingOn, drawTyped, drawTokens, cursorAt, popScale, dotsFor, jumpPos } = V;
const { Easing, clamp } = window;
const N = ['04 章节卡', '04 情况', '04 分层', '04 研究', '04 手写', '04 指定文件', '04 新对话', '04 文档'];
const C0 = [560, 720, 22], CI = [790, 846, 11], CL = [880, 846, 10], CR = [1620, 520, 9], CH = [380, 846, 11], CN0 = [550, 846, 11], CN1 = [1410, 846, 11], CD = [420, 846, 11], CM = [520, 846, 12];
const BX = { x0: 230, x1: 790, y0: 190, y1: 850 }, FLOOR = 846, SX = 260, SW = 500, BH = 44, BG = 8, RH = 92;
const PC = { x: 160, y: 250, w: 560, h: 210 }, TW = { x: 900, y: 220, w: 860, h: 440 }, AW = { x: 1000, y: 240, w: 720, h: 470 };
const BLK = [['之前的对话', '加个登录功能', COL.vari], ['读过的文件', 'UserService.java', COL.type], ['工具的输出', 'gradle build', COL.num],
  ['读过的文件', 'PasswordUtil.java', COL.type], ['工具的输出', 'npm test', COL.num], ['之前的对话', '先补测试', COL.vari]];
const slotB = i => FLOOR - RH - 12 - i * (BH + BG);
const CHIPS = [['AGENTS.md', MONO], ['CLAUDE.md', MONO], ['Qoder 项目规则', null]];
const AGL = [['## 构建', 1], ['mvn package', 0], ['## 测试', 1], ['mvn test', 0], ['## 代码规范', 1], ['提交前跑 mvn spotless:apply', 0], ['## 别动', 1], ['src/main/legacy/', 0]];
const BL = 520, BLX0 = 440, BLX1 = 1680, AXC = 700, HXC = 1220, DOWN = [0, 1, 3, 4, 6];
const AUTO = [['本项目是 Java 写的', 0], ['源码在 src/main/java', 0], ['测试：mvn test', 1], ['用了 Spring Boot', 0], ['类名用大驼峰', 0], ['别改 src/main/legacy/', 1], ['包含 UserService 等类', 0], ['提交前跑 mvn spotless:apply', 1]];
const STRIKE = [0, 1, 3, 4, 6], FW = { x: 580, y: 170, w: 800 };
const GR = { x: 560, y: 330, tw: 96, th: 66, gx: 110, gy: 80 }, TGT = 21;
const tileXY = i => [GR.x + (i % 8) * GR.gx, GR.y + Math.floor(i / 8) * GR.gy];
const VISIT = (() => { const a = []; for (let i = 0; i < 40; i++) if (i !== TGT) a.push(i); return a.sort((p, q) => hash(p * 7.31) - hash(q * 7.31)).slice(0, 32); })();
const LW = { x: 200, y: 160, w: 700, h: 686 }, RW = { x: 1100, y: 420, w: 620, h: 426 };
const FAILS = [['× 编译失败', COL.err], ['× 测试没过', COL.err], ['你：还是不行', COL.vari], ['× 改错了文件', COL.err], ['× 空指针', COL.err],
  ['× 测试没过', COL.err], ['你：再试一次', COL.vari], ['× 依赖冲突', COL.err], ['× 回滚重来', COL.err], ['× 还是报错', COL.err]];
const PILE = FAILS.map((f, i) => { const r = Math.floor(i / 2), L = i % 2 === 0, x = r % 2 ? (L ? 236 : 548) : (L ? 222 : 552), w = r % 2 ? (L ? 300 : 330) : (L ? 318 : 326); return { x, w, y: FLOOR - r * 58, rot: (hash(i * 4.7) - .5) * .06 }; });
const FP = { x: 600, y: 250, w: 500, h: 380 }, DP = { x: 1220, y: 230, w: 460, h: 420 }, FC = { x: 700, y: 392, w: 300, h: 96 };
const MX = { x: 800, y: 540, w: 220, h: 150 }, OB = [['文档', COL.fn, 440], ['工具', COL.num, 615], ['数据', COL.type, 790]];
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, I, Ly, R, H, At, Nw, Dc] = N.map(n => C[n]);
  const tm = { S, I, Ly, R, H, At, Nw, Dc,
    dots: S + .5, err1: I + 2.9, err2: I + 5.9, qI: I + 6.4,
    box: Ly + .2, morph: Ly + .4, ghost: Ly + 2.2, small: Ly + 2.6,
    bT: [Ly + 5, Ly + 6, Ly + 7, Ly + 6.15, Ly + 7.15, Ly + 5.15], rules: Ly + 8.4,
    chipT: [Ly + 10.9, Ly + 11.7, Ly + 12.6], absorb: Ly + 13.8, flush: Ly + 14.6, newtag: Ly + 15.2, rpulse: Ly + 15.8, aw: Ly + 17.2,
    badge: R + .5, base: R + 2.4, lab: [R + 3.2, R + 3.8], aiBar: R + 6.2, sq: R + 7, flip: R + 8, aiLab: R + 8.6, cost: R + 9.6, hBar: R + 11.6, hLab: R + 12.8,
    win: H + .3, lnT: H + .6, strike: H + 2.2, coll: H + 4.4, swap: H + 5.2,
    scan: At + .4, inp: At + 3, hit: At + 4.6,
    fall: Nw + .6, slit: Nw + 2.2, rw: Nw + 6.6, out: Nw + 8,
    docIn: Dc + 2, para: Dc + 3, fly4: Dc + 3.7, clear: Dc + 4.3, p2: Dc + 6.1, hub: Dc + 6.3, mcp: Dc + 6.6, cable: Dc + 7.8, boxT: [Dc + 9, Dc + 9.6, Dc + 10.2], flow: Dc + 10.8,
  };
  tm.fT = FAILS.map((_, i) => tm.fall + i * .4);
  const aS = [Ly + 17.6, Ly + 18.7, Ly + 19.8, Ly + 21.3];
  const ty = {
    chName: { s: S + 1.3, cps: 10, text: '上下文' },
    t1: { s: I + 1.5, cps: 12, text: '$ gradle build' },
    t2: { s: I + 4.8, cps: 14, text: '$ npm test' },
    box: { s: Ly + .6, cps: 22, text: '// 上下文窗口' },
    ...Object.fromEntries(AGL.map(([s, hd], i) => ['g' + i, { s: aS[i >> 1] + (hd ? 0 : .45), cps: hd ? 18 : 24, text: s }])),
    at: { s: At + 3.3, cps: 15, text: '@UserService.java' },
    mcp: { s: Dc + 6.8, cps: 8, text: 'MCP' },
  };
  const caps = [
    [I + .2, I + 4.2, '提示词写清楚了，我还是在别处出了错：'],
    [I + 4.2, I + 8.5, '不知道项目用 Maven 构建，也不知道测试怎么跑。'],
    [Ly + .2, Ly + 4.6, '因为提示词只是我看到的一小部分。'],
    [Ly + 4.6, Ly + 10.2, '之前的对话、我读过的文件、工具的输出，还有项目规则文件，我都会看到。'],
    [Ly + 10.2, Ly + 13.6, '规则文件就是 AGENTS.md、CLAUDE.md、Qoder 的项目规则这类文件，'],
    [Ly + 13.6, Ly + 17, '每次对话都会自动带上。'],
    [Ly + 17, Ly + 23, '里面适合写：怎么构建、怎么跑测试、代码规范，还有哪些目录别动。'],
    [R + .2, R + 5.6, 'ETH Zurich 有篇发在 ICLR 2026 的研究，专门比较了两种规则文件。'],
    [R + 5.6, R + 11.2, '让 AI 自动生成的，8 组实验里有 5 组成功率反而下降，成本还涨了 20% 以上。'],
    [R + 11.2, R + 17, '开发者自己手写的，成功率平均提高约 4%。'],
    [H + .2, H + 7, '所以规则文件得你自己写，写短，只写我从代码里看不出来的东西。'],
    [At + .2, At + 7, '用 @ 直接指定相关文件，比让我在整个仓库里自己翻要准，也更省。'],
    [Nw + .2, Nw + 5.6, '同一个对话里来回失败几次，上下文里就堆满了错误的尝试，我会被带歪。'],
    [Nw + 5.6, Nw + 12.5, '这时候别硬撑，新开一个对话，只把有用的结论带过去。'],
    [Dc + .2, Dc + 6.4, '用到比较新的库，就把官方文档的相关段落贴给我，或者接上能查文档的工具。'],
    [Dc + 6.4, Dc + 13, 'MCP 就是让 AI 连接外部工具和数据的一种标准接口。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0],
    [I + .8, 1.56, .06, .03, 0, .06, 0], [I + 4.4, 1.5, .1, .04, 0, .12, 0], [I + 8.4, 1.5, .1, .04, 0, .1, 0],
    [Ly + .8, 1.42, -.06, .03, 0, -.2, .02], [Ly + 9.6, 1.4, -.08, .03, 0, -.18, .02], [Ly + 11, 1.56, .02, .03, 0, 0, .02],
    [Ly + 14.4, 1.42, -.04, .03, 0, -.18, .02], [Ly + 17.4, 1.56, .06, .03, 0, .06, 0], [Ly + 23, 1.52, .1, .04, 0, .08, 0],
    [R + .8, 1.6, 0, .02, 0, 0, -.02], [R + 6.4, 1.54, -.04, .03, 0, -.06, .02], [R + 11.4, 1.54, .06, .03, 0, .06, -.02], [R + 17, 1.56, .04, .02, 0, 0, 0],
    [H + .6, 1.5, .02, .03, 0, 0, 0], [H + 7, 1.46, -.02, .03, 0, 0, -.02],
    [At + .6, 1.56, .04, .03, 0, .02, 0], [At + 4.6, 1.44, .06, .04, 0, .08, -.02], [At + 7, 1.42, .08, .04, 0, .1, -.02],
    [Nw + .8, 1.4, -.08, .04, 0, -.18, .06], [Nw + 5.6, 1.24, -.1, .04, .01, -.24, .1], [Nw + 7.6, 1.5, .02, .03, 0, 0, .04], [Nw + 12.5, 1.46, .1, .04, 0, .14, .06],
    [Dc + .8, 1.56, .02, .03, 0, 0, 0], [Dc + 6, 1.5, .04, .03, 0, .02, 0], [Dc + 7, 1.56, -.02, .03, 0, 0, .02], [Dc + 13, 1.5, .06, .04, 0, .04, .02],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'], [I - .1, 'jump'], [I + .2, 'on'], [I + .5, 'on'],
    [tm.err1, 'buzz'], [tm.err1, 'glitch'], [tm.err2, 'buzz'], [tm.err2, 'glitch'], [tm.qI, 'blip'],
    [Ly + .1, 'jump'], [tm.box, 'sweep'], [tm.morph, 'whoosh'], [tm.small, 'blip'], [tm.ghost, 'sweep'], ...tm.bT.map(t => [t, 'pix']), [tm.rules, 'thump'],
    ...tm.chipT.map(t => [t, 'on']), [tm.absorb, 'whoosh'], [tm.absorb + .5, 'ping'], [tm.flush, 'whoosh'], [tm.flush + .12, 'whoosh'], [tm.newtag, 'blip'], [tm.rpulse, 'ping'], [tm.aw, 'on'],
    [R - .2, 'jump'], [tm.badge, 'on'], [tm.base, 'sweep'], ...tm.lab.map(t => [t, 'blip']), [tm.aiBar, 'glitch'], [tm.aiBar + .05, 'thump'],
    ...Array.from({ length: 8 }, (_, i) => [tm.sq + i * .14, 'pix']), ...DOWN.map((_, j) => [tm.flip + j * .1, 'blip']), [tm.aiLab, 'on'], [tm.cost, 'on'],
    [tm.hBar, 'sweep'], [tm.hLab, 'ping'], [tm.hLab, 'jump'],
    [H - .2, 'jump'], [tm.win, 'on'], ...AUTO.map((_, i) => [tm.lnT + i * .12, 'pix']), ...STRIKE.map((_, j) => [tm.strike + j * .38, 'snip']), [tm.coll, 'whoosh'], [tm.swap, 'ping'],
    ...VISIT.map((_, k) => [tm.scan + k * .075, 'step']), [tm.inp, 'on'], [tm.hit, 'ping'], [tm.hit + .05, 'sweep'],
    [Nw - .2, 'jump'], ...tm.fT.flatMap(t => [[t, 'thump'], [t + .02, 'pix']]), [tm.slit, 'blip'], [tm.rw, 'sweep'], [tm.out, 'jump'], [tm.out, 'whoosh'], [tm.out + .05, 'on'], [tm.out + .8, 'thump'],
    [Dc - .2, 'jump'], [Dc + .6, 'blip'], [tm.docIn, 'whoosh'], [tm.para, 'on'], [tm.fly4, 'whoosh'], [tm.clear, 'sweep'], [tm.clear + .1, 'sparkle'],
    [tm.hub, 'jump'], [tm.mcp, 'assemble'], [tm.cable, 'on'], ...tm.boxT.map(t => [t, 'on']), [tm.flow, 'ping']];
  const SRC = '来源：Gloaguen et al., ETH Zurich / ICLR 2026';
  const text = [...BLK.flat().filter(s => typeof s === 'string' && s[0] !== '#'), ...CHIPS.map(c => c[0]), ...AGL.map(a => a[0]), ...AUTO.map(a => a[0]), ...FAILS.map(f => f[0]), ...OB.map(o => o[0]),
    SRC, '提示词写清楚了规则文件一直都在 AGENTS.md 等新对话终端 error: 找不到 build.gradle package.json ETH Zurich · ICLR 2026 AI 自动生成开发者手写 8 组里 5 组下降成本 +20% 以上成功率平均 +约 4% 示意自动生成 · 8 行手写 · 3 行对话 1对话 2 · 新结论 // 之后发布的 auth-lib 3.0 新版本 · API 有改动官方文档相关段落标准接口 // 第 4 章',
    ...Object.values(ty).map(d => d.text)].join('');
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [R, 'fluid'], [Nw, 'dis'], [Dc, 'fluid']],
    rips: [[tm.err2, (TW.x + TW.w / 2) / 1920, 520 / 1080], [tm.aiBar, AXC / 1920, BL / 1080], [tm.hit, (tileXY(TGT)[0] + 48) / 1920, (tileXY(TGT)[1] + 33) / 1080], [tm.out, CN0[0] / 1920, 800 / 1080]],
    shakes: [[tm.err2, .008], [tm.out, .014]],
    quiet: [[Nw + 5.6, tm.rw]], lp: [[tm.slit, tm.out + .3, 520]],
    hud: { num: '04', name: '上下文', from: I + .3, srcs: [[R + .2, H - .2, SRC]] },
  };
}

// ---------- 小工具 ----------
function box(ctx, x, y, w, h, fill, stroke, lw = 2, r = 14, dash) {
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.roundRect(x, y, w, Math.max(0, h), Math.min(r, Math.abs(h) / 2)); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
}
function win(ctx, x, y, w, h, title, tc) {
  box(ctx, x, y, w, h, COL.card, COL.line, 2, 16);
  ctx.fillStyle = COL.line; ctx.fillRect(x, y + 54, w, 1.5);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = COL.faint; ctx.beginPath(); ctx.arc(x + 28 + i * 20, y + 27, 6, 0, 6.283); ctx.fill(); }
  ctx.font = font(500, 24, MONO); ctx.fillStyle = tc; ctx.textAlign = 'left'; ctx.fillText(title, x + 100, y + 28);
}
function check(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .7); ctx.stroke(); }
function chip(ctx, s, cx, cy, k, c, f = font(600, 26), fill = COL.bg) {
  if (k <= 0) return;
  ctx.font = f; const w = ctx.measureText(s).width + 44;
  popScale(ctx, cx, cy, k, () => { box(ctx, cx - w / 2, cy - 24, w, 48, fill, c, 2.5, 24); ctx.font = f; ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, cx, cy + 1); ctx.textAlign = 'left'; });
}
const cb = (x1, y1, x2, y2, t) => { const mx = (x1 + x2) / 2, u = 1 - t; return [u * u * u * x1 + 3 * u * u * t * mx + 3 * u * t * t * mx + t * t * t * x2, u * u * u * y1 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y2]; };
function curve(ctx, x1, y1, x2, y2, k) {
  if (k <= 0) return;
  const n = Math.max(2, Math.ceil(30 * k));
  ctx.beginPath(); for (let i = 0; i <= n; i++) { const [x, y] = cb(x1, y1, x2, y2, k * i / n); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
}
function typedLine(ctx, T, d, x, y, c, cc) {
  drawTyped(ctx, T, d, x, y, c, false);
  if (typingOn(T, d, 0)) cursorAt(ctx, x + ctx.measureText(d.text.slice(0, typedN(T, d))).width, y, cc);
}

// ---------- 情况：终端 ----------
function drawTerm(ctx, T, pl) {
  const { tm, ty } = pl, ki = prog(T, tm.I + .5, tm.I + 1), a = ki * (1 - prog(T, tm.Ly + .1, tm.Ly + .6));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 20 * (1 - ki));
  win(ctx, TW.x, TW.y, TW.w, TW.h, '终端', COL.dim);
  const X = TW.x + 44;
  ctx.font = font(500, 32, MONO);
  const e1 = drawTokens(ctx, T, ty.t1, [['$ ', COL.str], ['gradle build', COL.text]], X, TW.y + 116);
  const e2 = drawTokens(ctx, T, ty.t2, [['$ ', COL.str], ['npm test', COL.text]], X, TW.y + 254);
  const sh = t => T < t + .4 ? Math.sin(T * 90) * 6 * (1 - (T - t) / .4) : 0;
  ctx.font = font(500, 28, MONO); ctx.fillStyle = COL.err;
  if (T >= tm.err1) ctx.fillText('error: 找不到 build.gradle', X + sh(tm.err1), TW.y + 166);
  if (T >= tm.err2) ctx.fillText('error: 找不到 package.json', X + sh(tm.err2), TW.y + 304);
  ctx.font = font(500, 32, MONO);
  if (T < tm.err1) { if (T >= ty.t1.s && (typingOn(T, ty.t1, 0) || blink(T))) cursorAt(ctx, e1, TW.y + 116); }
  else if (T >= ty.t2.s && T < tm.err2) { if (typingOn(T, ty.t2, 0) || blink(T)) cursorAt(ctx, e2, TW.y + 254); }
  else if (T >= tm.err2 + .3) { ctx.fillStyle = COL.str; ctx.fillText('$ ', X, TW.y + 380); if (blink(T)) cursorAt(ctx, X + ctx.measureText('$ ').width, TW.y + 380); }
  ctx.restore();
}

// ---------- 分层：容器 ----------
const flushK = (T, tm, i) => prog(T, tm.flush + i * .05, tm.flush + i * .05 + .6, Easing.easeInCubic);
function drawBox(ctx, T, pl) {
  const { tm, ty } = pl, k = prog(T, tm.box, tm.box + 1, MOTION.draw), a = 1 - prog(T, tm.R - .5, tm.R);
  if (k <= 0 || a <= 0) return;
  const { x0, x1, y0, y1 } = BX, w = x1 - x0, h = y1 - y0, per = 2 * (w + h);
  ctx.save(); ctx.globalAlpha = a;
  ctx.fillStyle = rgba(COL.fn, .035 * k); ctx.fillRect(x0, y0, w, h);
  ctx.strokeStyle = mixC(COL.line, COL.fn, .3); ctx.lineWidth = 3; ctx.setLineDash([per * k, per]); ctx.beginPath(); ctx.roundRect(x0, y0, w, h, 14); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = font(400, 26, MONO); drawTyped(ctx, T, ty.box, x0, y0 - 34, COL.dim, T < ty.box.s + 1.6);
  const kg = prog(T, tm.ghost, tm.ghost + .5) * (1 - prog(T, tm.rules, tm.rules + .3));
  if (kg > 0) {
    ctx.strokeStyle = COL.faint; ctx.lineWidth = 2; ctx.setLineDash([8, 7]);
    for (let i = 0; i < 6; i++) { const f = prog(T, tm.bT[i], tm.bT[i] + .2); if (f >= 1) continue; ctx.globalAlpha = a * kg * (1 - f) * .8; ctx.beginPath(); ctx.roundRect(SX, slotB(i) - BH, SW, BH, 6); ctx.stroke(); }
    ctx.globalAlpha = a * kg * .8; ctx.beginPath(); ctx.roundRect(SX, FLOOR - RH, SW, RH - 4, 10); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.globalAlpha = a;
  const kt = prog(T, tm.newtag, tm.newtag + .4, MOTION.pop);
  if (kt > 0) chip(ctx, '新对话', SX + 70, y0 + 44, kt, COL.fn);
  ctx.restore();
}
function blockAt(ctx, b, x, yb, w, h, al) {
  if (al <= 0) return;
  ctx.globalAlpha = al;
  box(ctx, x, yb - h, w, h, mixC(COL.card, b[2], .16), rgba(b[2], .85), 2, 6);
  ctx.font = font(600, 22); ctx.fillStyle = b[2]; ctx.textAlign = 'left'; ctx.fillText(b[0], x + 18, yb - h / 2);
  ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.textAlign = 'right'; ctx.fillText(b[1], x + w - 18, yb - h / 2); ctx.textAlign = 'left';
}
function drawStack(ctx, T, pl) {
  const { tm } = pl, a = 1 - prog(T, tm.R - .5, tm.R);
  ctx.save();
  BLK.forEach((b, i) => {
    const k = prog(T, tm.bT[i], tm.bT[i] + .35, MOTION.pop), f = flushK(T, tm, i);
    if (k <= 0 || f >= 1) return;
    blockAt(ctx, b, SX, slotB(i) - 24 * (1 - Math.min(k, 1)) - 720 * f, SW, BH, a * Math.min(1, k * 3) * (1 - f));
  });
  ctx.restore();
  drawRules(ctx, T, tm, a);
}
function drawRules(ctx, T, tm, a) {
  const k = prog(T, tm.rules, tm.rules + .5, MOTION.draw);
  if (k <= 0 || a <= 0) return;
  const y = FLOOR - RH + (RH + 20) * (1 - k), pu = Math.max(bump(T, tm.absorb + .45, .3), bump(T, tm.rpulse + .1, .45), bump(T, tm.aw + .2, .4));
  ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(BX.x0, BX.y0, BX.x1 - BX.x0, FLOOR - BX.y0 + 2); ctx.clip();
  box(ctx, SX, y, SW, RH - 4, mixC(COL.card, COL.str, .14 + .22 * pu), COL.str, 2.5 + 2 * pu, 10);
  ctx.fillStyle = COL.str; ctx.beginPath(); ctx.arc(SX + 34, y + 32, 9, 0, 6.283); ctx.fill(); ctx.fillRect(SX + 32, y + 32, 4, 24);
  ctx.font = font(600, 30); ctx.fillText('规则文件', SX + 60, y + 30);
  ctx.font = font(400, 22); ctx.fillStyle = COL.dim; ctx.fillText('一直都在', SX + 60, y + 64);
  const ka = prog(T, tm.absorb + .3, tm.absorb + .7);
  if (ka > 0) { ctx.globalAlpha = a * ka; ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.text; ctx.textAlign = 'right'; ctx.fillText('AGENTS.md 等', SX + SW - 22, y + 44); ctx.textAlign = 'left'; }
  ctx.restore();
}
function drawPromptCard(ctx, T, pl) {
  const { tm } = pl, ki = prog(T, tm.I + .2, tm.I + .7, MOTION.pop), f = flushK(T, tm, 6), a = 1 - prog(T, tm.R - .5, tm.R);
  if (ki <= 0 || f >= 1 || a <= 0) return;
  const m = prog(T, tm.morph, tm.morph + 1, MOTION.draw), pu = bump(T, tm.small + .2, .4);
  const x = lerp(PC.x, SX, m), y = lerp(PC.y, slotB(6) - BH, m) - 720 * f, w = lerp(PC.w, SW, m), h = lerp(PC.h, BH, m);
  ctx.save(); ctx.globalAlpha = a * (1 - f);
  popScale(ctx, x + w / 2, y + h / 2, Math.min(ki, 1.2), () => {
    box(ctx, x, y, w, h, mixC(COL.card, COL.fn, .16 * m + .3 * pu), COL.fn, 2.5 + 3 * pu, lerp(16, 6, m));
    const cA = 1 - Math.min(1, m * 2.5);
    if (cA > 0) {
      ctx.globalAlpha = a * (1 - f) * cA;
      ctx.font = font(600, 26); ctx.fillStyle = COL.fn; ctx.fillText('提示词', x + 30, y + 42);
      [[[COL.fn, 130], [COL.type, 190], [COL.num, 120]], [[COL.str, 230], [COL.kw, 150]]].forEach((row, r) => {
        let bx = x + 30; row.forEach(([c, bw]) => { ctx.fillStyle = rgba(c, .75); ctx.beginPath(); ctx.roundRect(bx, y + 84 + r * 34, bw, 12, 6); ctx.fill(); bx += bw + 14; });
      });
      check(ctx, x + 44, y + 170, 10, COL.str); ctx.font = font(600, 26); ctx.fillStyle = COL.str; ctx.fillText('写清楚了', x + 68, y + 170);
    }
    if (m > .4) {
      ctx.globalAlpha = a * (1 - f) * prog(m, .4, 1);
      ctx.font = font(600, 22); ctx.fillStyle = COL.fn; ctx.fillText('提示词', x + 18, y + h / 2);
      ctx.font = font(400, 22); ctx.fillStyle = COL.dim; ctx.textAlign = 'right'; ctx.fillText('写清楚的那条', x + w - 18, y + h / 2); ctx.textAlign = 'left';
    }
  });
  ctx.restore();
}
function drawChips(ctx, T, pl) {
  const { tm } = pl;
  let x = 1000;
  CHIPS.forEach(([s, fam], i) => {
    const f0 = fam ? font(600, 30, fam) : font(600, 30);
    ctx.font = f0; const w = ctx.measureText(s).width + 52;
    const k = prog(T, tm.chipT[i], tm.chipT[i] + .45, MOTION.pop), f = prog(T, tm.absorb + i * .08, tm.absorb + i * .08 + .5, MOTION.draw);
    if (k > 0 && f < 1) {
      const cx = lerp(x + w / 2, SX + SW - 90, f), cy = lerp(560, FLOOR - 46, f), s2 = k * lerp(1, .3, f);
      ctx.save(); ctx.globalAlpha = 1 - f * f; ctx.translate(cx, cy); ctx.scale(s2, s2);
      box(ctx, -w / 2, -34, w, 68, COL.card, COL.str, 2.5, 12);
      ctx.font = f0; ctx.fillStyle = COL.text; ctx.textAlign = 'center'; ctx.fillText(s, 0, 1); ctx.restore(); ctx.textAlign = 'left';
    }
    x += w + 28;
  });
}
function drawAW(ctx, T, pl) {
  const { tm, ty } = pl, k = prog(T, tm.aw, tm.aw + .45, MOTION.pop), a = 1 - prog(T, tm.R - .5, tm.R);
  if (k <= 0 || a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const kl = prog(T, tm.aw, tm.aw + .5, MOTION.draw);
  ctx.strokeStyle = rgba(COL.str, .7); ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
  ctx.beginPath(); ctx.moveTo(BX.x1 - 30, 770); ctx.lineTo(lerp(BX.x1 - 30, AW.x, kl), lerp(770, AW.y + AW.h - 40, kl)); ctx.stroke(); ctx.setLineDash([]);
  popScale(ctx, AW.x + 60, AW.y + AW.h, Math.min(k, 1.1), () => {
    win(ctx, AW.x, AW.y, AW.w, AW.h, 'AGENTS.md', COL.str);
    AGL.forEach(([, hd], i) => { ctx.font = hd ? font(500, 26, MONO) : font(500, 30, MONO); typedLine(ctx, T, ty['g' + i], AW.x + 44, AW.y + 98 + i * 46, hd ? COL.faint : COL.text, COL.str); });
  });
  ctx.restore();
}

// ---------- 研究：两根对比柱 ----------
function drawStudy(ctx, T, pl) {
  const { tm } = pl, a = prog(T, tm.R, tm.R + .5) * (1 - prog(T, tm.H - .5, tm.H));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  chip(ctx, 'ETH Zurich · ICLR 2026', 960, 210, prog(T, tm.badge, tm.badge + .45, MOTION.pop), COL.kw, font(600, 30));
  ctx.globalAlpha = a * prog(T, tm.base, tm.base + .5); ctx.font = font(400, 22); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('示意', BLX1, 300); ctx.textAlign = 'left'; ctx.globalAlpha = a;
  const kl = prog(T, tm.base, tm.base + .8, MOTION.draw);
  ctx.strokeStyle = COL.dim; ctx.lineWidth = 2; ctx.setLineDash([12, 10]); ctx.beginPath(); ctx.moveTo(BLX0, BL); ctx.lineTo(lerp(BLX0, BLX1, kl), BL); ctx.stroke(); ctx.setLineDash([]);
  const lab = (s, x, y, k) => { if (k <= 0) return; popScale(ctx, x, y, k, () => { ctx.font = font(600, 34); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(s, x, y); ctx.textAlign = 'left'; }); };
  lab('AI 自动生成', AXC, BL - 42, prog(T, tm.lab[0], tm.lab[0] + .45, MOTION.pop));
  lab('开发者手写', HXC, BL + 44, prog(T, tm.lab[1], tm.lab[1] + .45, MOTION.pop));
  const kd = prog(T, tm.aiBar, tm.aiBar + 1, MOTION.draw);
  if (kd > 0) box(ctx, AXC - 100, BL + 2, 200, 168 * kd, rgba(COL.err, .22), COL.err, 2.5, 6);
  for (let i = 0; i < 8; i++) {
    const k = prog(T, tm.sq + i * .14, tm.sq + i * .14 + .3, MOTION.pop), j = DOWN.indexOf(i), fl = j >= 0 ? prog(T, tm.flip + j * .1, tm.flip + j * .1 + .2) : 0;
    if (k <= 0) continue;
    const cx = AXC - 161 + i * 46, cy = 800;
    popScale(ctx, cx, cy, k, () => {
      box(ctx, cx - 17, cy - 17, 34, 34, mixC(COL.card, COL.err, .85 * fl), mixC(COL.dim, COL.err, fl), 2, 5);
      if (fl > .5) { ctx.fillStyle = COL.eye; ctx.beginPath(); ctx.moveTo(cx - 8, cy - 5); ctx.lineTo(cx + 8, cy - 5); ctx.lineTo(cx, cy + 7); ctx.fill(); }
    });
  }
  const ka = prog(T, tm.aiLab, tm.aiLab + .45, MOTION.pop);
  if (ka > 0) popScale(ctx, AXC, 742, ka, () => { ctx.font = font(600, 30); ctx.textAlign = 'center'; ctx.fillStyle = COL.err; ctx.fillText('8 组里 5 组下降', AXC, 742); ctx.textAlign = 'left'; });
  const kc = prog(T, tm.cost, tm.cost + .45, MOTION.pop);
  if (kc > 0) popScale(ctx, AXC + 240, 620, kc, () => {
    ctx.font = font(600, 30); const s = '成本 +20% 以上', w = ctx.measureText(s).width;
    box(ctx, AXC + 130, 594, w + 76, 52, COL.bg, COL.num, 2.5, 26);
    ctx.fillStyle = COL.num; ctx.beginPath(); ctx.moveTo(AXC + 154, 630); ctx.lineTo(AXC + 166, 610); ctx.lineTo(AXC + 178, 630); ctx.fill();
    ctx.fillText(s, AXC + 188, 621);
  });
  const kh = prog(T, tm.hBar, tm.hBar + 1, MOTION.draw);
  if (kh > 0) box(ctx, HXC - 100, BL - 2 - 118 * kh, 200, 118 * kh, rgba(COL.str, .22), COL.str, 2.5, 6);
  const kt = prog(T, tm.hLab, tm.hLab + .45, MOTION.pop);
  if (kt > 0) popScale(ctx, HXC, 362, kt, () => { ctx.font = font(600, 30); ctx.textAlign = 'center'; ctx.fillStyle = COL.str; ctx.fillText('成功率平均 +约 4%', HXC, 362); ctx.textAlign = 'left'; });
  ctx.restore();
}

// ---------- 手写：删掉看得出来的 ----------
function drawTrim(ctx, T, pl) {
  const { tm } = pl, ki = prog(T, tm.win, tm.win + .5), a = ki * (1 - prog(T, tm.At - .5, tm.At));
  if (a <= 0) return;
  const kc = prog(T, tm.coll, tm.coll + .6, MOTION.draw), h = lerp(120 + 8 * 56, 120 + 3 * 56, kc);
  ctx.save(); ctx.globalAlpha = a; ctx.translate(0, 24 * (1 - ki));
  box(ctx, FW.x, FW.y, FW.w, h, COL.card, COL.line, 2, 16);
  ctx.fillStyle = COL.line; ctx.fillRect(FW.x, FW.y + 56, FW.w, 1.5);
  ctx.font = font(600, 26, MONO); ctx.fillStyle = COL.text; ctx.fillText('AGENTS.md', FW.x + 32, FW.y + 29);
  const sw = T >= tm.swap;
  chip(ctx, sw ? '手写 · 3 行' : '自动生成 · 8 行', FW.x + FW.w - 120, FW.y + 29, sw ? prog(T, tm.swap, tm.swap + .45, MOTION.pop) : 1, sw ? COL.str : COL.num, font(600, 24), COL.card);
  let kept = 0;
  AUTO.forEach(([s, keep], i) => {
    const kl = prog(T, tm.lnT + i * .12, tm.lnT + i * .12 + .25);
    if (kl <= 0) return;
    const j = STRIKE.indexOf(i), ts = tm.strike + j * .38, ks = j >= 0 ? prog(T, ts, ts + .2) : 0;
    const y = keep ? lerp(FW.y + 104 + i * 56, FW.y + 104 + kept * 56, kc) : FW.y + 104 + i * 56;
    const al = keep ? 1 : 1 - Math.min(1, kc * 2);
    if (keep) kept++;
    if (al <= 0) return;
    ctx.globalAlpha = a * kl * al;
    ctx.font = font(500, 30); ctx.fillStyle = keep && sw ? COL.text : ks > 0 ? COL.faint : COL.dim; ctx.fillText(s, FW.x + 44, y);
    if (ks > 0) { ctx.fillStyle = COL.err; ctx.fillRect(FW.x + 38, y - 2, (ctx.measureText(s).width + 12) * ks, 4); }
  });
  ctx.restore();
}

// ---------- 指定文件 ----------
function tile(ctx, x, y, fill, stroke, lw) {
  const w = GR.tw, h = GR.th, f = 18;
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w - f, y); ctx.lineTo(x + w, y + f); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = rgba(COL.dim, .3); ctx.fillRect(x + 14, y + 30, w - 40, 6); ctx.fillRect(x + 14, y + 44, w - 54, 6);
}
function drawRepo(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.At, tm.At + .4) * (1 - prog(T, tm.Nw - .5, tm.Nw));
  if (a <= 0) return;
  ctx.save();
  const hk = prog(T, tm.hit, tm.hit + .4), clr = 1 - hk;
  for (let i = 0; i < 40; i++) {
    const k = prog(T, tm.At + .1 + hash(i * 2.3) * .3, tm.At + .4 + hash(i * 2.3) * .3);
    if (k <= 0) continue;
    const [x, y] = tileXY(i), v = VISIT.indexOf(i), vt = v >= 0 ? tm.scan + v * .075 : 1e9, seen = T >= vt ? clr : 0, cur = bump(T, vt + .07, .1) * clr;
    const tg = i === TGT ? hk : 0;
    ctx.globalAlpha = a * k * (i === TGT ? 1 : lerp(1, .35, hk));
    tile(ctx, x, y, tg > 0 ? mixC(COL.card, COL.fn, .35 * tg) : mixC(COL.card, COL.num, .14 * seen + .3 * cur), tg > 0 ? mixC(COL.line, COL.fn, tg) : mixC(COL.line, COL.num, Math.max(.55 * seen, cur)), 2 + 2 * Math.max(cur, tg));
  }
  ctx.globalAlpha = a;
  const ki = prog(T, tm.inp, tm.inp + .4, MOTION.pop);
  if (ki > 0) popScale(ctx, 993, 253, Math.min(ki, 1.1), () => {
    box(ctx, GR.x, 216, 866, 74, COL.card, COL.fn, 2.5, 14);
    ctx.font = font(600, 26, MONO); ctx.fillStyle = COL.fn; ctx.fillText('你', GR.x + 28, 253);
    ctx.font = font(500, 32, MONO); const e = drawTokens(ctx, T, ty.at, [['@', COL.kw], ['UserService.java', COL.text]], GR.x + 80, 253);
    if (T < tm.hit + .6 && (typingOn(T, ty.at, 0) || blink(T))) cursorAt(ctx, e, 253, COL.kw);
  });
  if (hk > 0) {
    const [tx, ty2] = tileXY(TGT), kb = prog(T, tm.hit, tm.hit + .4, MOTION.draw);
    ctx.strokeStyle = COL.fn; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(GR.x + 90, 290); ctx.lineTo(lerp(GR.x + 90, tx + 48, kb), lerp(290, ty2, kb)); ctx.stroke();
    chip(ctx, 'UserService.java', tx + 48, ty2 - 34, prog(T, tm.hit + .2, tm.hit + .6, MOTION.pop), COL.fn, font(600, 24, MONO), COL.card);
  }
  ctx.restore();
}

// ---------- 新对话 ----------
function drawPile(ctx, T, pl, dimmed) {
  const { tm } = pl, a = (1 - prog(T, tm.Dc - .5, tm.Dc)) * (dimmed ? 1 - .55 * prog(T, tm.out, tm.out + .6) : 1);
  if (a <= 0) return;
  ctx.save(); ctx.textBaseline = 'middle';
  FAILS.forEach(([s, c], i) => {
    const t = tm.fT[i], k = (T - (t - .38)) / .38;
    if (k < 0) return;
    const p = PILE[i], e = Easing.easeInQuad(Math.min(1, k)), y = lerp(LW.y + 120, p.y, e), sq = T >= t && T < t + .2 ? Math.sin(Math.PI * (T - t) / .2) : 0;
    ctx.globalAlpha = a * Math.min(1, k * 4);
    ctx.save(); ctx.translate(p.x + p.w / 2, y - 26); ctx.rotate(p.rot * e); ctx.scale(1 + .04 * sq, 1 - .14 * sq);
    box(ctx, -p.w / 2, -26, p.w, 52, mixC(COL.card, c, .22), c, 2.5, 6);
    ctx.font = font(600, 24, MONO); ctx.fillStyle = c; ctx.fillText(s, -p.w / 2 + 20, 1);
    ctx.restore();
  });
  ctx.restore();
}
function drawSlit(ctx, T, pl) {
  const { tm } = pl, k = prog(T, tm.slit, tm.slit + .3);
  if (k <= 0) return;
  const st = clawd(T, pl), px = st.px, ex = (st.eye || 0) * px * .4, bl = st.blink ? .25 : 1;
  ctx.save(); ctx.globalAlpha = k;
  ctx.fillStyle = COL.eye; ctx.fillRect(st.x - 52, st.y - 6.6 * px, 104, 3.2 * px);
  ctx.fillStyle = COL.clawd; ctx.fillRect(st.x - 46, st.y - 6.3 * px, 92, 2.6 * px);
  for (const c of [3, 8]) { const cx = st.x + (c - 6) * px, cy = st.y - 6 * px; ctx.fillStyle = COL.eye; ctx.fillRect(cx + ex, cy + px * (1 - bl), px * .94, px * 2 * bl * .94); }
  ctx.restore();
}
function drawNew(ctx, T, pl) {
  const { tm } = pl, a = prog(T, tm.Nw, tm.Nw + .4) * (1 - prog(T, tm.Dc - .5, tm.Dc));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a * (1 - .4 * prog(T, tm.out, tm.out + .6));
  win(ctx, LW.x, LW.y, LW.w, LW.h, '对话 1', COL.dim);
  ctx.globalAlpha = a;
  const kr = prog(T, tm.rw, tm.rw + .9, MOTION.draw);
  if (kr > 0) {
    const { x, y, w, h } = RW, per = 2 * (w + h);
    ctx.fillStyle = rgba(COL.card, kr); ctx.beginPath(); ctx.roundRect(x, y, w, h, 16); ctx.fill();
    ctx.strokeStyle = COL.fn; ctx.lineWidth = 2.5; ctx.setLineDash([per * kr, per]); ctx.beginPath(); ctx.roundRect(x, y, w, h, 16); ctx.stroke(); ctx.setLineDash([]);
    ctx.globalAlpha = a * prog(T, tm.rw + .5, tm.rw + .9);
    ctx.fillStyle = COL.line; ctx.fillRect(x, y + 54, w, 1.5);
    ctx.font = font(500, 24, MONO); ctx.fillStyle = COL.fn; ctx.fillText('对话 2 · 新', x + 28, y + 28);
  }
  ctx.restore();
}

// ---------- 文档与 MCP ----------
function drawDocs(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.Dc, tm.Dc + .4) * (1 - prog(T, tm.p2, tm.p2 + .5));
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.faint; ctx.fillText('// 之后发布的', FP.x, FP.y - 30);
    const ccx = FC.x + FC.w / 2, ccy = FC.y + FC.h / 2, kc = prog(T, tm.clear + .4, tm.clear + 1);
    for (let i = 0; i < 25; i++) for (let j = 0; j < 19; j++) {
      const x = FP.x + i * 20, y = FP.y + j * 20, d = Math.hypot(x + 10 - ccx, (y + 10 - ccy) * 1.3) / 330, cl = prog(T, tm.clear + d * .8, tm.clear + d * .8 + .3);
      if (cl >= 1) continue;
      const h = hash(i * 3.7 + j * 11.3 + Math.floor(T * 3 + hash(i + j * 5) * 3) * 1.37);
      ctx.fillStyle = rgba(COL.dim, (.04 + .12 * h) * (1 - cl)); ctx.fillRect(x, y, 19, 19);
    }
    ctx.strokeStyle = mixC(COL.faint, COL.fn, kc); ctx.lineWidth = 2 + kc; ctx.fillStyle = rgba(COL.card, kc);
    if (kc < 1) ctx.setLineDash([8, 7]);
    ctx.beginPath(); ctx.roundRect(FC.x, FC.y, FC.w, FC.h, 12); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = font(500, 26, MONO); ctx.fillStyle = mixC(COL.dim, COL.text, kc); ctx.fillText('auth-lib 3.0', FC.x + 26, FC.y + 32);
    ctx.font = font(400, 22); ctx.fillStyle = mixC(COL.faint, COL.dim, kc); ctx.fillText('新版本 · API 有改动', FC.x + 26, FC.y + 70);
    const kd = prog(T, tm.docIn, tm.docIn + .7, MOTION.draw);
    if (kd > 0) {
      const dx = lerp(1960, DP.x, kd);
      box(ctx, dx, DP.y, DP.w, DP.h, COL.card, COL.kw, 2.5, 12);
      ctx.font = font(600, 28); ctx.fillStyle = COL.kw; ctx.fillText('官方文档', dx + 30, DP.y + 44);
      for (let b = 0; b < 7; b++) { ctx.fillStyle = rgba(COL.dim, b >= 2 && b <= 4 ? .55 : .25); ctx.beginPath(); ctx.roundRect(dx + 30, DP.y + 104 + b * 42, (DP.w - 60) * (.6 + .4 * hash(b * 5.1)), 12, 6); ctx.fill(); }
      const kp = prog(T, tm.para, tm.para + .4);
      if (kp > 0) {
        ctx.globalAlpha = a * kp; ctx.strokeStyle = COL.kw; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.roundRect(dx + 16, DP.y + 170, DP.w - 32, 136, 10); ctx.stroke();
        chip(ctx, '相关段落', dx + DP.w - 90, DP.y + 170, Math.min(1, kp * 1.2), COL.kw, font(600, 22), COL.card);
        ctx.globalAlpha = a;
      }
    }
    const kf = prog(T, tm.fly4, tm.fly4 + .6, MOTION.draw);
    if (kf > 0 && kf < 1) {
      const fx0 = DP.x + DP.w / 2, fy0 = DP.y + 238, s = lerp(1, .3, kf), x = lerp(fx0, ccx, kf), y = lerp(fy0, ccy, kf) - Math.sin(Math.PI * kf) * 90;
      ctx.globalAlpha = a * (1 - kf * .5); ctx.fillStyle = rgba(COL.kw, .25); ctx.strokeStyle = COL.kw; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.roundRect(x - (DP.w - 32) * s / 2, y - 68 * s, (DP.w - 32) * s, 136 * s, 10); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }
  const b = prog(T, tm.p2, tm.p2 + .5);
  if (b <= 0) return;
  ctx.save(); ctx.globalAlpha = b;
  const hx = CM[0] + 6.5 * CM[2], hy = CM[1] - 6.5 * CM[2], mcx = MX.x + MX.w / 2, mcy = MX.y + MX.h / 2;
  ctx.strokeStyle = COL.kw; ctx.lineWidth = 4; curve(ctx, hx, hy, MX.x, mcy, prog(T, tm.cable, tm.cable + .5, MOTION.draw));
  OB.forEach(([s, c, oy], j) => {
    const k = prog(T, tm.boxT[j], tm.boxT[j] + .45, MOTION.pop), py = mcy - 40 + j * 40;
    ctx.strokeStyle = c; ctx.lineWidth = 3; curve(ctx, MX.x + MX.w, py, 1260, oy, prog(T, tm.boxT[j] - .1, tm.boxT[j] + .35, MOTION.draw));
    if (k > 0) popScale(ctx, 1410, oy, k, () => { box(ctx, 1260, oy - 52, 300, 104, COL.card, c, 2.5, 14); ctx.font = font(600, 40); ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, 1410, oy + 1); ctx.textAlign = 'left'; });
    if (T >= tm.flow) for (let d = 0; d < 2; d++) {
      const u = ((T - tm.flow) * .7 + j * .3 + d * .5) % 1, [x, y] = cb(MX.x + MX.w, py, 1260, oy, 1 - u);
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.283); ctx.fill();
    }
  });
  if (T >= tm.flow) for (let d = 0; d < 3; d++) { const u = ((T - tm.flow - .4) * .8 + d / 3) % 1; if (u < 0) continue; const [x, y] = cb(hx, hy, MX.x, mcy, 1 - u); ctx.fillStyle = COL.kw; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.283); ctx.fill(); }
  const km = prog(T, tm.mcp, tm.mcp + .5, MOTION.pop);
  if (km > 0) popScale(ctx, mcx, mcy, km, () => {
    box(ctx, MX.x, MX.y, MX.w, MX.h, mixC(COL.card, COL.kw, .12 + .25 * bump(T, tm.flow + .3, .5)), COL.kw, 3, 18);
    for (let j = 0; j < 3; j++) { ctx.fillStyle = COL.kw; ctx.fillRect(MX.x + MX.w - 6, mcy - 46 + j * 40, 12, 12); }
    ctx.fillRect(MX.x - 6, mcy - 6, 12, 12);
    ctx.font = font(700, 60, MONO); const w = ctx.measureText(ty.mcp.text).width;
    drawTyped(ctx, T, ty.mcp, mcx - w / 2, mcy + 2, COL.text, false);
  });
  ctx.globalAlpha = b * prog(T, tm.mcp + .9, tm.mcp + 1.4); ctx.font = font(500, 28); ctx.fillStyle = COL.dim; ctx.textAlign = 'center'; ctx.fillText('标准接口', mcx, MX.y + MX.h + 40); ctx.textAlign = 'left';
  ctx.restore();
}

// ---------- 章节卡 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 4 章', 1080, 330); ctx.globalAlpha = 1;
  dotsFor('04', 300, 12, 700, MONO, fv).pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.I - .6);
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.I) return drawCard(ctx, T, pl, fv);
  if (T < tm.R) { drawTerm(ctx, T, pl); drawBox(ctx, T, pl); drawStack(ctx, T, pl); drawPromptCard(ctx, T, pl); drawChips(ctx, T, pl); drawAW(ctx, T, pl); return; }
  if (T < tm.H) return drawStudy(ctx, T, pl);
  if (T < tm.At) return drawTrim(ctx, T, pl);
  if (T < tm.Nw) return drawRepo(ctx, T, pl);
  if (T < tm.Dc) { drawNew(ctx, T, pl); if (T >= tm.out) drawPile(ctx, T, pl, true); return; }
  drawDocs(ctx, T, pl);
}

// ---------- Clawd ----------
function clawd(T, pl) {
  const { tm, ty } = pl, prev = pl.prev || [960, 600, 12];
  const J = [[tm.S - .55, tm.S + .35, prev, C0], [tm.I - .1, tm.I + .6, C0, CI], [tm.Ly + .1, tm.Ly + .7, CI, CL], [tm.R - .2, tm.R + .5, CL, CR],
    [tm.H - .2, tm.H + .5, CR, CH], [tm.Nw - .2, tm.Nw + .5, CH, CN0], [tm.out, tm.out + .8, CN0, CN1], [tm.Dc - .2, tm.Dc + .5, CN1, CD], [tm.hub, tm.hub + .45, CD, CM]];
  const r = jumpPos(T, J, prev), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  const typing = d => T >= d.s - .15 && T < d.s + d.text.length / d.cps + .15;
  const nod = (t, d = 1.3) => { if (T >= t && T < t + d) st.nod = Math.sin((T - t) * 5) > .3; };
  if (T >= tm.S + .35 && T < tm.I - .1) st.eye = 1;
  if (T >= tm.I + .6 && T < tm.Ly) st.eye = 1;
  if (typing(ty.t1) || typing(ty.t2)) { st.pose = 'type'; st.ph = T * 22; }
  for (const t of [tm.err1, tm.err2]) if (T >= t && T < t + .4) st.y -= Math.sin(Math.PI * (T - t) / .4) * 26;
  if (T >= tm.err2 && T < tm.Ly) st.sweat = T - tm.err2;
  if (T >= tm.qI && T < tm.qI + 1.8) st.q = qk(T, tm.qI, 1.8);
  if (T >= tm.Ly + .7 && T < tm.R - .2) st.eye = -1;
  if (T >= tm.chipT[0] - .2 && T < tm.absorb) st.eye = 1;
  nod(tm.rpulse);
  if (T >= tm.aw && T < tm.R - .2) { st.eye = 1; if (T >= tm.aw + .3 && T < tm.Ly + 22.6) st.pose = 'point'; }
  if (T >= tm.R + .5 && T < tm.H - .2) st.eye = -1;
  if (T >= tm.aiBar + .2 && T < tm.hBar) st.sweat = T - tm.aiBar;
  if (T >= tm.hLab && T < tm.hLab + 1) { st.pose = 'up'; st.y -= Math.sin(Math.PI * (T - tm.hLab)) * 40; }
  if (T >= tm.H + .5 && T < tm.At) st.eye = 1;
  if (T >= tm.strike - .2 && T < tm.coll) st.pose = 'point';
  nod(tm.swap + .2);
  if (T >= tm.At && T < tm.Nw - .2) st.eye = 1;
  if (T >= tm.scan && T < tm.inp) { st.eye = Math.sin(T * 9) > 0 ? 1 : -1; if (T >= tm.scan + 1.4) st.sweat = T - tm.scan; }
  if (T >= tm.hit && T < tm.hit + .8) st.pose = 'up';
  nod(tm.hit + 1);
  if (T >= tm.Nw + .5 && T < tm.out) st.eye = T < tm.slit + .4 ? 0 : Math.sin(T * 3.1) > 0 ? 1 : -1;
  if (T >= tm.slit + 1 && T < tm.out) st.sweat = T - tm.slit;
  if (T >= tm.out && T < tm.Dc - .2) { st.pose = 'point'; st.eye = T < tm.out + 1.4 ? 1 : -1; }
  nod(tm.Nw + 10.4);
  if (T >= tm.Dc + .5 && T < tm.Dc + 2.2) { st.q = qk(T, tm.Dc + .6, 1.6); st.eye = 1; }
  if (T >= tm.docIn && T < tm.p2) st.eye = 1;
  if (T >= tm.clear + .6 && T < tm.clear + 1.4) st.pose = 'up';
  if (T >= tm.hub + .45) st.eye = 1;
  if (T >= tm.cable - .2 && T < tm.boxT[0]) st.pose = 'point';
  if (T >= tm.flow + .4 && T < tm.flow + 1.2) st.pose = 'up';
  return st;
}

// ---------- 演员层：压住 Clawd 的失败块、结论卡片 ----------
function over(ctx, T, pl) {
  const { tm } = pl;
  ctx.textBaseline = 'middle';
  if (T >= tm.Nw && T < tm.out) { drawPile(ctx, T, pl, false); drawSlit(ctx, T, pl); }
  if (T >= tm.out && T < tm.Dc - .1) {
    const st = clawd(T, pl), k = prog(T, tm.out, tm.out + .4, MOTION.pop) * (1 - prog(T, tm.Dc - .5, tm.Dc - .1));
    if (k <= 0) return;
    const cx = st.x + 6 * st.px + 75, cy = st.y - 7 * st.px - 40;
    popScale(ctx, cx, cy, k, () => {
      box(ctx, cx - 75, cy - 46, 150, 92, COL.card, COL.str, 3, 12);
      ctx.font = font(600, 34); ctx.textAlign = 'center'; ctx.fillStyle = COL.str; ctx.fillText('结论', cx, cy + 1); ctx.textAlign = 'left';
    });
  }
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.I - .6, tm.I, Easing.linear);
  let gl = 0;
  const sp = (t, a, d) => { if (T >= t) gl = Math.max(gl, a * Math.exp(-(T - t) * d)); };
  sp(tm.err1, .4, 6); sp(tm.err2, .5, 6); sp(tm.aiBar, .3, 6); sp(tm.out, .35, 5);
  let rays = 0, light = [.5, .44];
  if (T < tm.I) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T < tm.R) { rays = .35 * Math.max(bump(T, tm.rpulse + .1, .5), bump(T, tm.absorb + .5, .4)); light = [510 / 1920, 800 / 1080]; }
  else if (T < tm.H) { rays = .35 * bump(T, tm.hLab + .2, .6); light = [HXC / 1920, 420 / 1080]; }
  else if (T >= tm.At && T < tm.Nw) { rays = .4 * bump(T, tm.hit + .2, .5); const [tx, ty] = tileXY(TGT); light = [(tx + 48) / 1920, (ty + 33) / 1080]; }
  else if (T >= tm.Nw && T < tm.Dc) { rays = .4 * bump(T, tm.out + 1.2, .6); light = [CN1[0] / 1920, 740 / 1080]; }
  else if (T >= tm.Dc) { rays = .4 * Math.max(bump(T, tm.clear + .5, .5), bump(T, tm.flow + .4, .7)); light = T < tm.p2 ? [850 / 1920, 440 / 1080] : [910 / 1920, 615 / 1080]; }
  const buried = prog(T, tm.slit, tm.slit + 1) * (1 - prog(T, tm.out, tm.out + .6));
  return { gl, rays, light,
    energy: lerp(.38, 1, card) + .25 * buried + .2 * bump(T, tm.out + .4, .5),
    warm: .15 + .5 * buried + .3 * bump(T, tm.aiBar + .4, .8) + .2 * bump(T, tm.err2 + .3, .6),
    floor: Math.max(.65 * card, .7 * prog(T, tm.Ly, tm.Ly + 1) * (1 - prog(T, tm.R - .4, tm.R)), .8 * prog(T, tm.Nw, tm.Nw + 1) * (1 - prog(T, tm.Dc - .4, tm.Dc)), .8 * prog(T, tm.p2, tm.p2 + 1)) };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"04 章节卡 · 情况":[["04 章节卡",3.5],["04 情况",8.5]],"04 分层":[["04 分层",23]],"04 研究 · 手写 · 指定文件":[["04 研究",17],["04 手写",7],["04 指定文件",7]],"04 新对话 · 文档":[["04 新对话",12.5],["04 文档",13]]};

return { plan, scene, clawd, fx, over, parts: TL_PARTS };
};
