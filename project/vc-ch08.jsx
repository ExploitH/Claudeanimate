// 第 8 章　检查结果
(window.VC_CH = window.VC_CH || {})[8] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, drawTyped, popScale, dotsFor, jumpPos, drawClawd } = V;
const { Easing, clamp } = window;
const N = ['08 章节卡', '08 全部通过', '08 diff', '08 假完成', '08 写死', '08 编造', '08 抢注', '08 三件事', '08 查包', '08 METR'];
const C0 = [560, 720, 22], COk = [960, 760, 16], CDf = [1600, 800, 11], CFk = [1720, 820, 10], CSq = [1740, 820, 10], CTh = [560, 820, 11], CPk = [1480, 720, 12], CMe = [1760, 820, 9], HUM = COL.fn;
const DF = { x: 180, y: 210, w: 1180, h: 500 };
const DIFF = [[' ', '@Test'], [' ', 'void loginSuccess() { … }'], ['-', '@Test'], ['-', 'void lockAfter5Fails() { … }'], ['+', '// @Test'], ['+', '// void lockAfter5Fails() { … }']];
const CHEAT = [['注释掉、删掉测试', '// @Test'], ['期望值写死', 'int failCount() { return 5; }'], ['吞掉异常', 'catch (Exception e) { }'], ['留句 TODO 假装实现', 'void lock() { // TODO }'], ['没跑测试就说通过', '0 tests run · 全部通过 ✓']];
const CW = 500, CH = 210, CXY = [[200, 250], [710, 250], [1220, 250], [455, 520], [965, 520]];
const FAKE = [['方法', 'auth.verifyMagic()'], ['参数', 'login(name, pwd, true)'], ['配置项', 'spring.auth.magic=true'], ['依赖包', 'fast-bcrypt-utils']];
const PKG = 'fast-bcrypt-utils', MX = i => 360 + i * 300, MY = 370, MC = [COL.fn, COL.type, COL.kw, COL.num, COL.str];
const RG = { x: 260, y: 520, w: 900, h: 300 };
const JOBS = [['1', '看 diff'], ['2', '自己跑一遍'], ['3', '测边界情况']], JX = i => 260 + i * 500, JY = 290, JW = 420, JH = 170;
const EDGE = [['""', '空输入'], ['"aaaa…" × 10000', '超长输入'], ["\"' OR 1=1 --\"", '非法输入']];
const REG = ['Maven Central', 'npm', 'PyPI'], PC = { x: 560, y: 330, w: 800, h: 420 };
const AY = 520, AU = 9, BX = [900, 1200, 1500];
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);
const fio = (T, a, b, i = .4, o = .5) => prog(T, a, a + i) * (1 - prog(T, b - o, b));

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, Ok, Df, Fk, Hc, Hl, Sq, Th, Pk, Me] = N.map(n => C[n]);
  const tm = { S, Ok, Df, Fk, Hc, Hl, Sq, Th, Pk, Me,
    dots: S + .5,
    sign: Ok + .5, back: Ok + 4.6, diff: Ok + 4.9, dl: DIFF.map((_, i) => Ok + 5.3 + i * .15), ring: Ok + 7.2, tag: Ok + 7.8, whis: Ok + 7.9,
    old: Df + .6, nw: Df + 1.2, seem: Df + 3.6,
    ch: [Fk + .5, Fk + 3.9, Fk + 6.5, Fk + 9.5, Fk + 12.3],
    anth: Hc + .4, focus: Hc + 1, test: Hc + 3.8, link: Hc + 5, us: Hc + 7.2,
    fk: FAKE.map((_, i) => Hl + .5 + i * .9),
    mod: MC.map((_, i) => Sq + .4 + i * .18), bub: MC.map((_, i) => Sq + 3.3 + i * .25), n127: Sq + 5.6, reg: Sq + 7.8, n53: Sq + 9.6, bad: Sq + 10.8, grab: Sq + 12, evil: Sq + 13.4, slop: Sq + 15.8,
    done: Th + .4, job: [Th + 4.4, Th + 5.7, Th + 7], edge: [Th + 8.2, Th + 9.2, Th + 10.2],
    regs: REG.map((_, i) => Pk + .6 + i * .5), pcard: Pk + 4.2, pk: [Pk + 4.8, Pk + 6, Pk + 7.2],
    metr: Me + 4.2, devs: Me + 5, axis: Me + 7.2, b0: Me + 8.4, b1: Me + 12.2, upd: Me + 14.6, b2: Me + 15.4, bias: Me + 18.6,
  };
  const ty = { chName: { s: S + 1.3, cps: 10, text: '检查结果' }, q: { s: tm.reg + .4, cps: 18, text: PKG }, slop: { s: tm.slop, cps: 14, text: 'slopsquatting' } };
  const caps = [
    [Ok + .2, Ok + 4.6, '我回复你：登录功能已完成，测试全部通过。'], [Ok + 4.6, Ok + 6.8, '你打开 diff 一看，'], [Ok + 6.8, Ok + 10.3, '「账号锁定」那条测试被我注释掉了。'],
    [Df + .2, Df + 3.4, 'diff 就是修改前后的逐行对比。'], [Df + 3.4, Df + 6.8, '这种「看起来做完了」其实挺常见。'],
    [Fk + .2, Fk + 3.8, '比如：把失败的测试注释掉或删掉，'], [Fk + 3.8, Fk + 6.4, '把期望值写死在代码里，'], [Fk + 6.4, Fk + 9.4, '用 try-catch 把异常吞掉，'],
    [Fk + 9.4, Fk + 12.2, '留一句 TODO 假装实现了，'], [Fk + 12.2, Fk + 14.8, '没跑测试就说全部通过。'],
    [Hc + .2, Hc + 3.6, 'Anthropic 的官方指南专门提醒过，'], [Hc + 3.6, Hc + 7.2, '模型可能为了让测试通过而写死数值。'], [Hc + 7.2, Hc + 9.3, '对，说的就是我们。'],
    [Hl + .2, Hl + 5.8, '我还可能编出不存在的方法、参数、配置项和依赖包。'],
    [Sq + .2, Sq + 3, '2026 年 4 月有项研究发现，'], [Sq + 3, Sq + 7.8, '5 个主流模型会编出同样的 127 个不存在的包名，'], [Sq + 7.8, Sq + 10.8, '其中 53 个当时还没人注册。'],
    [Sq + 10.8, Sq + 15.6, '攻击者可以抢先注册这些名字，往里面塞恶意代码。'], [Sq + 15.6, Sq + 19.3, '这招叫 slopsquatting。'],
    [Th + .2, Th + 4.4, '所以我说「完成了」之后，你要做三件事：'], [Th + 4.4, Th + 7, '看 diff，自己跑一遍，'], [Th + 7, Th + 11.8, '测边界情况，比如空输入、超长输入、非法输入。'],
    [Pk + .2, Pk + 4.2, '装依赖之前，先去 Maven Central、npm 或 PyPI'], [Pk + 4.2, Pk + 9.3, '确认这个包真的存在，再看看下载量和发布者。'],
    [Me + .2, Me + 4, '用了 AI 到底有没有变快，也得靠测。'], [Me + 4, Me + 7.2, 'METR 2025 年做过对照实验，'], [Me + 7.2, Me + 12, '16 位熟练的开源开发者用 AI 后实际慢了 19%，'],
    [Me + 12, Me + 14.6, '自己却觉得快了 20%。'], [Me + 14.6, Me + 18.2, '2026 年 2 月的更新测出快了约 18%，'], [Me + 18.2, Me + 23.8, '但 METR 自己说明了，这次样本有选择偏差，结果不可靠。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0],
    [Ok + .8, 1.3, 0, .03, 0, 0, -.06], [Ok + 4, 1.34, 0, .03, 0, 0, -.06], [Ok + 5.4, 1.56, -.03, .03, 0, 0, 0], [Ok + 7.4, 1.46, -.03, .03, 0, -.04, .02], [Df + 2.6, 1.5, -.02, .03, 0, -.06, 0], [Df + 6.8, 1.54, 0, .03, 0, 0, 0],
    [Fk + .8, 1.56, 0, .03, 0, 0, 0], [Fk + 14.6, 1.54, .02, .03, 0, 0, 0], [Hc + 1.4, 1.44, 0, .03, 0, 0, .02], [Hc + 9.2, 1.46, .02, .03, 0, .04, 0],
    [Hl + .8, 1.5, 0, .03, 0, 0, 0], [Hl + 5.8, 1.48, .02, .03, 0, 0, 0],
    [Sq + .8, 1.56, 0, .03, 0, 0, .02], [Sq + 7.4, 1.54, 0, .03, 0, 0, .02], [Sq + 9, 1.52, -.03, .03, 0, -.03, -.02], [Sq + 12.4, 1.5, .03, .03, 0, .04, -.02], [Sq + 19.2, 1.5, 0, .03, 0, 0, 0],
    [Th + .8, 1.54, 0, .03, 0, 0, 0], [Th + 8, 1.5, .03, .03, 0, .08, 0], [Th + 11.8, 1.52, 0, .03, 0, .02, 0],
    [Pk + .8, 1.54, 0, .03, 0, 0, 0], [Pk + 9.2, 1.5, 0, .03, 0, 0, 0],
    [Me + .8, 1.56, 0, .03, 0, 0, 0], [Me + 8, 1.5, .03, .03, 0, .04, 0], [Me + 15, 1.5, -.03, .03, 0, .06, 0], [Me + 23.8, 1.54, 0, .03, 0, .02, 0],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'],
    [Ok - .1, 'jump'], [tm.sign, 'assemble'], [tm.sign + .4, 'ping'], [tm.back, 'jump'], [tm.diff, 'on'], ...tm.dl.map(t => [t, 'pix']), [tm.ring, 'sweep'], [tm.ring + .6, 'buzz'], [tm.tag, 'blip'], [tm.whis, 'whistle'],
    [tm.old, 'blip'], [tm.nw, 'blip'], [tm.seem, 'thump'],
    [Fk - .2, 'jump'], ...tm.ch.flatMap(t => [[t, 'on'], [t + .3, 'pix']]),
    [tm.anth, 'on'], [tm.focus, 'whoosh'], [tm.test, 'blip'], [tm.link, 'sweep'], [tm.link + .6, 'ping'], [tm.us, 'buzz'],
    ...tm.fk.flatMap(t => [[t, 'pix'], [t + .4, 'buzz']]),
    [Sq - .2, 'jump'], ...tm.mod.map(t => [t, 'pix']), ...tm.bub.map(t => [t, 'blip']), [tm.n127, 'on'], [tm.reg, 'on'], [tm.reg + 1.6, 'buzz'], [tm.n53, 'on'],
    [tm.bad, 'jump'], [tm.bad, 'glitch'], [tm.grab, 'thump'], [tm.grab + .05, 'glitch'], [tm.evil, 'buzz'], [tm.evil, 'glitch'],
    [Th - .2, 'jump'], [tm.done, 'ping'], ...tm.job.map(t => [t, 'on']), ...tm.edge.map(t => [t, 'pix']),
    [Pk - .2, 'jump'], ...tm.regs.map(t => [t, 'blip']), [tm.pcard, 'on'], ...tm.pk.map(t => [t, 'ping']),
    [Me - .2, 'jump'], [tm.metr, 'on'], [tm.devs, 'sparkle'], [tm.axis, 'sweep'], [tm.b0, 'sweep'], [tm.b0 + 1, 'thump'], [tm.b1, 'sweep'], [tm.b1 + 1, 'ping'], [tm.upd, 'on'], [tm.b2, 'sweep'], [tm.bias, 'glitch'], [tm.bias, 'buzz']];
  const SRC1 = 'Anthropic, Prompting best practices', SRC2 = 'Churilov via InfoWorld, 2026-04', SRC3 = 'METR, 2025-07 & 2026-02';
  const text = [...DIFF.map(d => d[1]), ...CHEAT.flat(), ...FAKE.flat(), PKG, ...JOBS.flat(), ...EDGE.flat(), ...REG, SRC1, SRC2, SRC3,
    '第 8 章全部通过 ✓ diff · UserServiceTest.java 账号锁定修改前修改后看起来 Anthropic 官方指南 assertEquals(5, failCount()); 刚好对上不存在模型 1 2 3 4 5 127 个不存在的包名 53 个没人注册 0 results 1.0.0 by ??? 恶意代码 slopsquatting 完成了存在下载量发布者 spring-security-crypto org.springframework Spring 官方 METR 2025-07 2026-02 更新 16 位开源开发者实际测量自我感觉 −19% +20% +18% 选择偏差 · 不可靠 示意 search'].join('');
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [Fk, 'fluid'], [Hl, 'dis'], [Th, 'fluid'], [Pk, 'dis'], [Me, 'fluid']],
    rips: [[tm.ring + .6, 380 / 1920, (DF.y + 120 + 4 * 62) / 1080], [tm.seem, CDf[0] / 1920, 520 / 1080], [tm.grab, (RG.x + 450) / 1920, (RG.y + 170) / 1080], [tm.bias, BX[2] / 1920, (AY - 80) / 1080]],
    shakes: [[tm.seem, .008], [tm.grab, .012], [tm.us, .006]],
    hud: { num: '08', name: '检查结果', from: Ok + .3, srcs: [[Hc + .2, Hl - .2, SRC1], [Sq + .2, Th - .2, SRC2], [Me + 4, Me + 24, SRC3]] },
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
function wavy(ctx, x, y, w, k, c) {
  if (k <= 0) return;
  ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath();
  for (let i = 0; i <= w * k; i += 4) { const yy = y + Math.sin(i / 6) * 4; i ? ctx.lineTo(x + i, yy) : ctx.moveTo(x, yy); }
  ctx.stroke();
}
function stamp(ctx, s, x, y, k, c, rot = -.1, fs = 34) {
  if (k <= 0) return;
  const sc = lerp(2.2, 1, k);
  ctx.save(); ctx.globalAlpha *= Math.min(1, k * 3); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = font(700, fs); const w = ctx.measureText(s).width + 48;
  ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.fillStyle = rgba(c, .15); ctx.beginPath(); ctx.roundRect(-w / 2, -fs * .95, w, fs * 1.9, 10); ctx.fill(); ctx.stroke();
  ctx.fillStyle = c; ctx.textAlign = 'center'; ctx.fillText(s, 0, 2); ctx.restore();
}

// ---------- 章节卡 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 8 章', 1080, 330); ctx.globalAlpha = 1;
  dotsFor('08', 300, 12, 700, MONO, fv).pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.Ok - .6);
}

// ---------- 全部通过 · diff ----------
function drawDiff(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Ok, tm.Fk);
  if (a <= 0) return;
  const k = prog(T, tm.diff, tm.diff + .5);
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = a * k; ctx.translate(0, 24 * (1 - k));
  win(ctx, DF.x, DF.y, DF.w, DF.h, 'diff · UserServiceTest.java', COL.dim);
  DIFF.forEach(([m, s], i) => {
    const kl = prog(T, tm.dl[i], tm.dl[i] + .3);
    if (kl <= 0) return;
    const y = DF.y + 120 + i * 62, c = m === '-' ? COL.err : m === '+' ? COL.str : COL.dim;
    ctx.globalAlpha = a * k * kl;
    if (m !== ' ') { ctx.fillStyle = rgba(c, .1); ctx.fillRect(DF.x + 2, y - 28, DF.w - 4, 56); }
    ctx.font = font(500, 30, MONO); ctx.fillStyle = c; ctx.fillText(m, DF.x + 34, y);
    ctx.fillStyle = m === ' ' ? COL.dim : COL.text; ctx.fillText(s, DF.x + 80, y);
  });
  ctx.globalAlpha = a * k;
  // 红圈圈住 //
  const kr = prog(T, tm.ring, tm.ring + .6, MOTION.draw);
  if (kr > 0) {
    const cx = DF.x + 102, cy = DF.y + 120 + 4.5 * 62;
    ctx.strokeStyle = COL.err; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(cx, cy, 46, 92, -.08, -Math.PI / 2, -Math.PI / 2 + 6.6 * kr); ctx.stroke();
  }
  chip(ctx, '账号锁定', DF.x + 760, DF.y + 120 + 4.5 * 62, prog(T, tm.tag, tm.tag + .45, MOTION.pop), COL.err, font(600, 28), COL.card);
  chip(ctx, '修改前', DF.x + DF.w - 100, DF.y + 120 + 2.5 * 62, prog(T, tm.old, tm.old + .45, MOTION.pop), COL.err, font(600, 24), COL.card, 42);
  chip(ctx, '修改后', DF.x + DF.w - 100, DF.y + 120 + 4.5 * 62, prog(T, tm.nw, tm.nw + .45, MOTION.pop), COL.str, font(600, 24), COL.card, 42);
  ctx.restore();
}

// ---------- 假完成 · 写死 ----------
function cardXY(T, tm, i) {
  const [x, y] = CXY[i], f = prog(T, tm.focus, tm.focus + .8, MOTION.draw);
  if (i !== 1 || f <= 0) return [x + CW / 2, y + CH / 2, 1];
  return [lerp(x + CW / 2, 860, f), lerp(y + CH / 2, 540, f), lerp(1, 1.6, f)];
}
function drawCheats(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Fk, tm.Hl);
  if (a <= 0) return;
  ctx.save();
  const f = prog(T, tm.focus, tm.focus + .8, MOTION.draw);
  [0, 2, 3, 4, 1].forEach(i => {
    const k = prog(T, tm.ch[i], tm.ch[i] + .5, MOTION.pop);
    if (k <= .01) return;
    const [cx, cy, s] = cardXY(T, tm, i), dim = i === 1 ? 1 : 1 - .8 * f;
    ctx.globalAlpha = a * dim;
    popScale(ctx, cx, cy, Math.min(k, 1.1) * s, () => {
      const x = cx - CW / 2, y = cy - CH / 2;
      box(ctx, x, y, CW, CH, COL.card, i === 1 && f > 0 ? COL.num : COL.err, 2.5, 16);
      ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText(String(i + 1).padStart(2, '0'), x + 28, y + 40);
      ctx.font = font(600, 32); ctx.fillStyle = COL.text; ctx.fillText(CHEAT[i][0], x + 76, y + 40);
      box(ctx, x + 24, y + 86, CW - 48, 96, COL.bg, COL.line, 1.5, 10);
      ctx.font = font(500, i === 4 ? 24 : 25, MONO); ctx.fillStyle = i === 0 ? COL.faint : i === 3 ? COL.num : COL.text;
      if (i === 1) {
        const pre = 'int failCount() { ', hl = 'return 5;', w0 = ctx.measureText(pre).width, w1 = ctx.measureText(hl).width, g = prog(T, tm.link, tm.link + .4);
        ctx.fillText(pre, x + 46, y + 134);
        if (g > 0) { ctx.fillStyle = rgba(COL.num, .25 * g); ctx.fillRect(x + 42 + w0, y + 112, w1 + 8, 44); }
        ctx.fillStyle = mixC(COL.text, COL.num, g); ctx.fillText(hl, x + 46 + w0, y + 134); ctx.fillStyle = COL.text; ctx.fillText(' }', x + 46 + w0 + w1, y + 134);
      } else ctx.fillText(CHEAT[i][1], x + 46, y + 134);
    });
  });
  ctx.globalAlpha = a;
  chip(ctx, 'Anthropic · 官方指南', 960, 150, prog(T, tm.anth, tm.anth + .45, MOTION.pop), COL.kw, font(600, 28));
  const kt = prog(T, tm.test, tm.test + .5);
  if (kt > 0) {
    ctx.globalAlpha = a * kt;
    box(ctx, 560, 250, 600, 74, COL.bg, COL.str, 2, 12);
    ctx.font = font(500, 28, MONO); ctx.fillStyle = COL.str; ctx.textAlign = 'center'; ctx.fillText('assertEquals(5, failCount());', 860, 288); ctx.textAlign = 'left';
    const kl = prog(T, tm.link, tm.link + .5, MOTION.draw);
    if (kl > 0) { ctx.strokeStyle = COL.num; ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(990, 326); ctx.lineTo(990, lerp(326, 548, kl)); ctx.stroke(); ctx.setLineDash([]); }
    chip(ctx, '刚好对上', 1290, 380, prog(T, tm.link + .4, tm.link + .85, MOTION.pop), COL.num, font(600, 26), COL.card);
  }
  ctx.restore();
}

// ---------- 编造 ----------
function drawFake(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Hl, tm.Sq);
  if (a <= 0) return;
  ctx.save();
  FAKE.forEach(([lab, code], i) => {
    const k = prog(T, tm.fk[i], tm.fk[i] + .4);
    if (k <= 0) return;
    const y = 270 + i * 130;
    ctx.globalAlpha = a * k;
    ctx.font = font(600, 30); ctx.fillStyle = COL.dim; ctx.textAlign = 'right'; ctx.fillText(lab, 520, y); ctx.textAlign = 'left';
    box(ctx, 560, y - 44, 760, 88, COL.card, COL.line, 2, 12);
    ctx.font = font(500, 34, MONO); ctx.fillStyle = COL.text; ctx.fillText(code, 600, y);
    const w = ctx.measureText(code).width;
    wavy(ctx, 600, y + 28, w, prog(T, tm.fk[i] + .3, tm.fk[i] + .7), COL.err);
    chip(ctx, '不存在', 1420, y, prog(T, tm.fk[i] + .4, tm.fk[i] + .85, MOTION.pop), COL.err, font(600, 26), COL.card);
  });
  ctx.restore();
}

// ---------- 抢注 ----------
function bot(ctx, x, y, c, k, T, i) {
  popScale(ctx, x, y, k, () => {
    box(ctx, x - 50, y - 50, 100, 100, rgba(c, .16), c, 3, 18);
    const bl = ((T + i * .7) % 3.1) < .12 ? .2 : 1;
    ctx.fillStyle = c; ctx.fillRect(x - 26, y - 16 * bl, 14, 32 * bl); ctx.fillRect(x + 12, y - 16 * bl, 14, 32 * bl);
    ctx.fillRect(x - 4, y - 72, 8, 22); ctx.beginPath(); ctx.arc(x, y - 76, 8, 0, 6.283); ctx.fill();
  });
}
function drawSquat(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Sq, tm.Th);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  MC.forEach((c, i) => {
    const k = prog(T, tm.mod[i], tm.mod[i] + .45, MOTION.pop);
    if (k <= .01) return;
    bot(ctx, MX(i), MY, c, Math.min(k, 1.1), T, i);
    ctx.font = font(500, 22); ctx.fillStyle = COL.dim; ctx.textAlign = 'center'; ctx.fillText(`模型 ${i + 1}`, MX(i), MY + 78); ctx.textAlign = 'left';
    const kb = prog(T, tm.bub[i], tm.bub[i] + .4, MOTION.pop);
    if (kb > .01) popScale(ctx, MX(i), MY - 150, kb, () => {
      box(ctx, MX(i) - 128, MY - 180, 256, 60, COL.card, COL.err, 2.5, 14);
      ctx.fillStyle = COL.card; ctx.strokeStyle = COL.err; ctx.beginPath(); ctx.moveTo(MX(i) - 14, MY - 121); ctx.lineTo(MX(i), MY - 102); ctx.lineTo(MX(i) + 14, MY - 121); ctx.fill(); ctx.stroke();
      ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.text; ctx.textAlign = 'center'; ctx.fillText(PKG, MX(i), MY - 150); ctx.textAlign = 'left';
    });
  });
  chip(ctx, '127 个不存在的包名', 1500, MY + 180, prog(T, tm.n127, tm.n127 + .45, MOTION.pop), COL.err, font(600, 30), COL.card, 56);
  // 包注册表：搜不到 → 被陌生账号抢注
  const kr = prog(T, tm.reg, tm.reg + .5);
  if (kr > 0) {
    ctx.globalAlpha = a * kr; ctx.save(); ctx.translate(0, 20 * (1 - kr));
    box(ctx, RG.x, RG.y, RG.w, RG.h, COL.card, COL.line, 2, 16);
    ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText('package registry · search', RG.x + 32, RG.y + 38);
    box(ctx, RG.x + 32, RG.y + 66, RG.w - 64, 64, COL.bg, COL.line, 2, 12);
    ctx.font = font(500, 30, MONO); drawTyped(ctx, T, pl.ty.q, RG.x + 60, RG.y + 98, COL.text, T < tm.reg + 1.6, COL.num);
    const taken = prog(T, tm.grab, tm.grab + .3), ev = prog(T, tm.evil, tm.evil + .5);
    if (T >= tm.reg + 1.6 && taken <= 0) { ctx.font = font(600, 30, MONO); ctx.fillStyle = COL.dim; ctx.fillText('0 results', RG.x + 60, RG.y + 196); }
    if (taken > 0) {
      const c = mixC(COL.dim, COL.err, ev), gx = (hash(Math.floor(T * 20)) - .5) * 10 * bump(T, tm.evil + .2, .3);
      ctx.globalAlpha = a * kr * taken;
      box(ctx, RG.x + 32 + gx, RG.y + 146, RG.w - 64, 104, mixC(COL.card, COL.err, .12 * ev), c, 2.5, 12);
      ctx.fillStyle = mixC(COL.line, COL.kw, ev); ctx.fillRect(RG.x + 60 + gx, RG.y + 166, 64, 64);
      if (ev > 0) { ctx.fillStyle = COL.bg; ctx.fillRect(RG.x + 76 + gx, RG.y + 182, 10, 10); ctx.fillRect(RG.x + 98 + gx, RG.y + 182, 10, 10); ctx.fillRect(RG.x + 80 + gx, RG.y + 208, 24, 6); }
      ctx.font = font(600, 30, MONO); ctx.fillStyle = COL.text; ctx.fillText(PKG, RG.x + 150 + gx, RG.y + 180);
      ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText('1.0.0 · by ???', RG.x + 150 + gx, RG.y + 220);
      chip(ctx, '恶意代码', RG.x + RG.w - 140, RG.y + 199, prog(T, tm.evil, tm.evil + .45, MOTION.pop), COL.err, font(600, 26), COL.card);
    }
    ctx.globalAlpha = a * kr; ctx.font = font(700, 42, MONO); drawTyped(ctx, T, pl.ty.slop, RG.x + 32, RG.y + RG.h - 36, COL.err, T >= tm.slop, COL.err);
    ctx.restore();
  }
  ctx.globalAlpha = a;
  chip(ctx, '53 个没人注册', 1500, MY + 256, prog(T, tm.n53, tm.n53 + .45, MOTION.pop), COL.num, font(600, 30), COL.card, 56);
  ctx.restore();
}

// ---------- 三件事 ----------
function drawJobs(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Th, tm.Pk);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  JOBS.forEach(([n, s], i) => {
    const k = prog(T, tm.job[i], tm.job[i] + .45, MOTION.pop);
    if (k <= .01) return;
    popScale(ctx, JX(i) + JW / 2, JY + JH / 2, Math.min(k, 1.1), () => {
      box(ctx, JX(i), JY, JW, JH, mixC(COL.card, HUM, .08), HUM, 3, 16);
      ctx.font = font(700, 30, MONO); ctx.fillStyle = HUM; ctx.fillText(n, JX(i) + 32, JY + 50);
      ctx.font = font(600, 40); ctx.fillStyle = COL.text; ctx.fillText(s, JX(i) + 32, JY + 112);
    });
    chip(ctx, '你', JX(i) + JW - 30, JY, k, HUM, font(700, 22), COL.card, 38);
  });
  EDGE.forEach(([v, lab], i) => {
    const k = prog(T, tm.edge[i], tm.edge[i] + .4);
    if (k <= 0) return;
    const y = JY + JH + 80 + i * 84, x = JX(2);
    ctx.globalAlpha = a * k;
    ctx.strokeStyle = COL.line; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + 24, JY + JH); ctx.lineTo(x + 24, y); ctx.lineTo(x + 44, y); ctx.stroke();
    box(ctx, x + 50, y - 30, 270, 60, COL.bg, COL.num, 2, 10);
    ctx.font = font(500, 22, MONO); ctx.fillStyle = COL.num; ctx.fillText(v, x + 70, y + 1);
    ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.fillText(lab, x + 340, y + 1);
  });
  ctx.restore();
}

// ---------- 查包 ----------
function drawPkg(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Pk, tm.Me);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  REG.forEach((s, i) => chip(ctx, s, 600 + i * 360, 220, prog(T, tm.regs[i], tm.regs[i] + .45, MOTION.pop), COL.type, font(600, 30, MONO), COL.card, 58));
  const kc = prog(T, tm.pcard, tm.pcard + .5);
  if (kc > 0) {
    ctx.globalAlpha = a * kc; ctx.save(); ctx.translate(0, 20 * (1 - kc));
    box(ctx, PC.x, PC.y, PC.w, PC.h, COL.card, COL.line, 2, 16);
    ctx.font = font(600, 32, MONO); ctx.fillStyle = COL.text; ctx.fillText('spring-security-crypto', PC.x + 40, PC.y + 56);
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText('org.springframework.security', PC.x + 40, PC.y + 98);
    ctx.fillStyle = COL.line; ctx.fillRect(PC.x + 40, PC.y + 130, PC.w - 80, 2);
    [['存在', ''], ['下载量', ''], ['发布者', 'Spring 官方']].forEach(([lab, v], i) => {
      const t = tm.pk[i], k = prog(T, t, t + .4), y = PC.y + 190 + i * 80;
      ctx.globalAlpha = a * kc * Math.max(.35, k);
      ctx.font = font(600, 32); ctx.fillStyle = COL.text; ctx.fillText(lab, PC.x + 110, y);
      if (k > 0) {
        ctx.fillStyle = rgba(COL.str, .2); ctx.strokeStyle = COL.str; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(PC.x + 64, y, 20, 0, 6.283); ctx.fill(); ctx.stroke();
        check(ctx, PC.x + 64, y, 10, COL.str);
      }
      if (i === 1) for (let j = 0; j < 10; j++) { const h = (10 + 34 * (.4 + .6 * j / 9) * (.8 + .4 * hash(j))) * k; ctx.fillStyle = COL.type; ctx.fillRect(PC.x + 300 + j * 26, y + 22 - h, 18, h); }
      if (v) { ctx.font = font(500, 28); ctx.fillStyle = COL.dim; ctx.fillText(v, PC.x + 300, y); }
    });
    ctx.restore();
  }
  ctx.restore();
}

// ---------- METR ----------
function dev(ctx, x, y, s, c) { ctx.fillStyle = c; ctx.fillRect(x - 14 * s, y - 14 * s, 28 * s, 22 * s); ctx.fillRect(x - 10 * s, y + 10 * s, 20 * s, 8 * s); ctx.fillStyle = COL.bg; ctx.fillRect(x - 8 * s, y - 6 * s, 5 * s, 6 * s); ctx.fillRect(x + 3 * s, y - 6 * s, 5 * s, 6 * s); }
function bar(ctx, x, v, k, c, dash, fade = 0) {
  const h = v * AU * k, y = h > 0 ? AY - h : AY;
  if (Math.abs(h) < .5) return;
  ctx.fillStyle = rgba(c, (dash ? .14 : .35) * (1 - .5 * fade)); ctx.strokeStyle = mixC(c, COL.faint, fade); ctx.lineWidth = 3; if (dash) ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.rect(x - 70, y, 140, Math.abs(h)); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
}
function drawMetr(ctx, T, pl) {
  const { tm } = pl, end = pl.end || tm.Me + 24, a = fio(T, tm.Me, end);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  chip(ctx, 'METR · 2025-07', 420, 200, prog(T, tm.metr, tm.metr + .45, MOTION.pop), COL.kw, font(600, 28, MONO));
  for (let i = 0; i < 16; i++) {
    const k = prog(T, tm.devs + i * .05, tm.devs + i * .05 + .35, MOTION.pop);
    if (k > .01) popScale(ctx, 270 + (i % 4) * 100, 330 + Math.floor(i / 4) * 90, k, () => dev(ctx, 270 + (i % 4) * 100, 330 + Math.floor(i / 4) * 90, 1.4, mixC(COL.fn, COL.type, hash(i * 2.1))));
  }
  ctx.globalAlpha = a * prog(T, tm.devs + .6, tm.devs + 1); ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.textAlign = 'center'; ctx.fillText('16 位开源开发者', 420, 700); ctx.textAlign = 'left';
  const ka = prog(T, tm.axis, tm.axis + .7, MOTION.draw);
  ctx.globalAlpha = a;
  if (ka > 0) { ctx.fillStyle = '#5a5f6b'; ctx.fillRect(760, AY - 2, 900 * ka, 4); ctx.font = font(400, 20, MONO); ctx.fillStyle = COL.faint; ctx.fillText('0%', 720, AY); }
  const k0 = prog(T, tm.b0, tm.b0 + 1, MOTION.draw), k1 = prog(T, tm.b1, tm.b1 + 1, MOTION.draw), k2 = prog(T, tm.b2, tm.b2 + 1, MOTION.draw), kb = prog(T, tm.bias, tm.bias + .5);
  bar(ctx, BX[0], -19, k0, COL.err); bar(ctx, BX[1], 20, k1, COL.fn); bar(ctx, BX[2], 18, k2, COL.type, true, kb);
  ctx.textAlign = 'center';
  const lab = (x, top, s, sub, k, c) => { if (k <= 0) return; ctx.globalAlpha = a * Math.min(1, k * 2); ctx.font = font(700, 40, MONO); ctx.fillStyle = c; ctx.fillText(s, x, top); ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.fillText(sub, x, AY + (top < AY ? 40 : -40)); };
  lab(BX[0], AY + 19 * AU * k0 + 40, '−19%', '实际测量', k0, COL.err);
  lab(BX[1], AY - 20 * AU * k1 - 36, '+20%', '自我感觉', k1, COL.fn);
  lab(BX[2], AY - 18 * AU * k2 - 36, '+18%', '2026-02 更新', k2, mixC(COL.type, COL.faint, kb));
  ctx.textAlign = 'left'; ctx.globalAlpha = a;
  chip(ctx, 'METR · 2026-02 更新', BX[2], 200, prog(T, tm.upd, tm.upd + .45, MOTION.pop), COL.type, font(600, 26, MONO), COL.card);
  if (kb > 0) {
    ctx.save(); ctx.beginPath(); ctx.rect(BX[2] - 70, AY - 18 * AU, 140, 18 * AU); ctx.clip(); ctx.globalAlpha = a * kb * .5; ctx.strokeStyle = COL.num; ctx.lineWidth = 3;
    for (let x = -200; x < 200; x += 22) { ctx.beginPath(); ctx.moveTo(BX[2] + x, AY); ctx.lineTo(BX[2] + x + 162, AY - 162); ctx.stroke(); }
    ctx.restore();
  }
  chip(ctx, '选择偏差 · 不可靠', BX[2], AY + 110, prog(T, tm.bias, tm.bias + .45, MOTION.pop), COL.num, font(600, 26), COL.card);
  ctx.restore();
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.Ok) return drawCard(ctx, T, pl, fv);
  if (T < tm.Fk) return drawDiff(ctx, T, pl);
  if (T < tm.Hl) return drawCheats(ctx, T, pl);
  if (T < tm.Sq) return drawFake(ctx, T, pl);
  if (T < tm.Th) return drawSquat(ctx, T, pl);
  if (T < tm.Pk) return drawJobs(ctx, T, pl);
  if (T < tm.Me) return drawPkg(ctx, T, pl);
  drawMetr(ctx, T, pl);
}

// ---------- Clawd ----------
function clawd(T, pl) {
  const { tm } = pl, prev = pl.prev || [960, 600, 12];
  const J = [[tm.S - .55, tm.S + .35, prev, C0], [tm.Ok - .1, tm.Ok + .6, C0, COk], [tm.back, tm.back + .6, COk, CDf], [tm.Fk - .2, tm.Fk + .5, CDf, CFk],
    [tm.Sq - .2, tm.Sq + .5, CFk, CSq], [tm.Th - .2, tm.Th + .5, CSq, CTh], [tm.Pk - .2, tm.Pk + .5, CTh, CPk], [tm.Me - .2, tm.Me + .5, CPk, CMe]];
  const r = jumpPos(T, J, prev), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  const nod = (t, d = 1.3) => { if (T >= t && T < t + d) st.nod = Math.sin((T - t) * 5) > .3; };
  if (T >= tm.S + .35 && T < tm.Ok - .1) st.eye = 1;
  if (T >= tm.sign - .1 && T < tm.Fk - .2) st.pose = 'up';
  if (T >= tm.back + .6 && T < tm.ring) st.eye = -1;
  if (T >= tm.whis && T < tm.Fk - .2) { st.eye = 1; st.nod = false; }
  if (T >= tm.Fk + .5 && T < tm.Sq - .2) st.eye = -1;
  tm.ch.forEach(t => nod(t + .4, .8));
  if (T >= tm.us && T < tm.Hl - .1) { st.pose = 'cover'; st.sweat = T - tm.us; }
  if (T >= tm.fk[3] + .5 && T < tm.fk[3] + 2) st.q = qk(T, tm.fk[3] + .5, 1.5);
  if (T >= tm.Sq + .5 && T < tm.Th - .2) { st.eye = -1; if (T >= tm.bad) { st.eye = -1; st.sweat = T - tm.bad; } }
  if (T >= tm.done - .1 && T < tm.job[0]) st.pose = 'up';
  if (T >= tm.job[0] && T < tm.Pk - .2) st.eye = 1;
  if (T >= tm.Pk + .5 && T < tm.Me - .2) st.eye = -1;
  tm.pk.forEach(t => nod(t + .2, .6));
  if (T >= tm.Me + .5) st.eye = -1;
  if (T >= tm.b1 + 1 && T < tm.b1 + 2) st.q = qk(T, tm.b1 + 1, 1);
  if (T >= tm.bias && T < tm.bias + 1.4) st.sweat = T - tm.bias;
  return st;
}

// ---------- 演员层：举牌、口哨、陌生账号 ----------
function sign(ctx, st, s, c, k, tilt = 0, over) {
  if (k <= .01) return;
  const sc = st.px / 11, hx = st.x + 4 * st.px, top = st.y - 8 * st.px;
  ctx.save(); ctx.translate(hx, top); ctx.rotate(tilt); ctx.scale(sc * k, sc * k);
  ctx.fillStyle = '#7a5a40'; ctx.fillRect(-4, -120, 8, 120);
  ctx.font = font(700, 40); const w = ctx.measureText(s).width + 60;
  box(ctx, -w / 2, -200, w, 90, COL.card, c, 4, 12);
  ctx.fillStyle = c; ctx.textAlign = 'center'; ctx.fillText(s, 0, -154);
  if (over) over(w);
  ctx.restore();
}
function note(ctx, x, y, s, c) { ctx.fillStyle = c; ctx.fillRect(x, y - 30 * s, 5 * s, 30 * s); ctx.fillRect(x, y - 30 * s, 16 * s, 6 * s); ctx.fillRect(x - 10 * s, y - 4 * s, 15 * s, 11 * s); }
function stranger(T, pl) {
  const { tm } = pl, r = jumpPos(T, [[tm.bad, tm.bad + .7, [2080, 820, 12], [1340, 820, 12]], [tm.grab - .35, tm.grab, [1340, 820, 12], [1180, 800, 12]]], [2080, 820, 12]), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: -1, blink: false, squash: 1, alpha: 1 - prog(T, tm.Th - .5, tm.Th) };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  if (T >= tm.grab && T < tm.grab + .25) st.squash = 1 - .2 * Math.sin(Math.PI * (T - tm.grab) / .25);
  if (T >= tm.grab - .1 && T < tm.grab + .6) st.pose = 'push';
  return st;
}
function drawStranger(ctx, st) {
  if (st.alpha <= 0) return;
  const a = COL.clawd, b = COL.clawdHi;
  COL.clawd = '#4a4e57'; COL.clawdHi = '#61656f';
  try { drawClawd(ctx, st); } finally { COL.clawd = a; COL.clawdHi = b; }
  const { px } = st, x = st.x - .4 * px, gy = st.y - 6.1 * px;
  ctx.save(); ctx.globalAlpha = st.alpha; ctx.fillStyle = '#0b0b0e';
  ctx.fillRect(x - 3.7 * px, gy, 3.2 * px, 2.1 * px); ctx.fillRect(x + 1.5 * px, gy, 3.2 * px, 2.1 * px); ctx.fillRect(x - .6 * px, gy + .3 * px, 2.2 * px, .5 * px);
  ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(x - 3.3 * px, gy + .3 * px, .7 * px, .5 * px); ctx.fillRect(x + 1.9 * px, gy + .3 * px, .7 * px, .5 * px);
  ctx.restore();
}
function over(ctx, T, pl) {
  const { tm } = pl;
  ctx.textBaseline = 'middle';
  if (T >= tm.sign - .1 && T < tm.Fk) {
    const st = clawd(T, pl), k = prog(T, tm.sign, tm.sign + .5, MOTION.pop) * (1 - prog(T, tm.Fk - .5, tm.Fk - .2)), tilt = T >= tm.whis ? -.12 + .03 * Math.sin(T * 3) : 0;
    const ks = prog(T, tm.seem, tm.seem + .3, Easing.easeOutQuad);
    sign(ctx, st, '全部通过 ✓', COL.str, k, tilt, ks > 0 ? w => stamp(ctx, '看起来', w / 2 - 30, -214, ks, COL.num, .14, 30) : null);
    if (T >= tm.whis) for (let i = 0; i < 3; i++) {
      const ph = ((T - tm.whis) * .7 + i / 3) % 1;
      ctx.globalAlpha = Math.sin(Math.PI * ph) * k; note(ctx, st.x + 6 * st.px + 20 + ph * 90, st.y - 5 * st.px - ph * 110 + Math.sin(ph * 9) * 10, .9, COL.type); ctx.globalAlpha = 1;
    }
  }
  if (T >= tm.done - .1 && T < tm.job[0] + .3) {
    const st = clawd(T, pl), k = prog(T, tm.done, tm.done + .45, MOTION.pop) * (1 - prog(T, tm.job[0] - .2, tm.job[0] + .2));
    sign(ctx, st, '完成了', COL.str, k);
  }
  if (T >= tm.bad && T < tm.Th) drawStranger(ctx, stranger(T, pl));
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.Ok - .6, tm.Ok, Easing.linear);
  let gl = 0;
  const sp = (t, a, d) => { if (T >= t) gl = Math.max(gl, a * Math.exp(-(T - t) * d)); };
  sp(tm.ring + .6, .35, 6); sp(tm.us, .2, 6); sp(tm.bad, .3, 5); sp(tm.grab, .45, 5); sp(tm.evil, .4, 4); sp(tm.bias, .3, 6);
  let rays = 0, light = [.5, .44];
  if (T < tm.Ok) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T < tm.Fk) { rays = .45 * bump(T, tm.sign + .5, .5); light = [COk[0] / 1920, 330 / 1080]; }
  else if (T >= tm.Hc && T < tm.Hl) { rays = .3 * bump(T, tm.link + .5, .5); light = [990 / 1920, 470 / 1080]; }
  else if (T >= tm.Pk && T < tm.Me) { rays = .3 * bump(T, tm.pk[2] + .4, .5); light = [960 / 1920, 540 / 1080]; }
  return { gl, rays, light,
    energy: lerp(.38, 1, card) + .15 * bump(T, tm.sign + .4, .5),
    warm: .15 + .3 * bump(T, tm.ring + .8, .8) + .5 * prog(T, tm.bad, tm.bad + .6) * (1 - prog(T, tm.Th - .6, tm.Th)) + .25 * bump(T, tm.b0 + 1, .8),
    floor: Math.max(.65 * card, .5 * prog(T, tm.Me + 7, tm.Me + 8)) };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"08 章节卡 · 全部通过 · diff":[["08 章节卡",3.5],["08 全部通过",10.5],["08 diff",7]],"08 假完成 · 写死":[["08 假完成",15],["08 写死",9.5]],"08 编造 · 抢注":[["08 编造",6],["08 抢注",19.5]],"08 三件事 · 查包 · METR":[["08 三件事",12],["08 查包",9.5],["08 METR",24]]};

return { plan, scene, clawd, fx, over, parts: TL_PARTS };
};
