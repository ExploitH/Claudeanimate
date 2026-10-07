// 第 6 章　Harness
(window.VC_CH = window.VC_CH || {})[6] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, heat, drawTyped, popScale, dotsFor, jumpPos, drawClawd } = V;
const { Easing, clamp } = window;
const N = ['06 章节卡', '06 怪事', '06 外层', '06 部件', '06 发动机', '06 成绩', '06 其他模型', '06 梯子', '06 RedAccess', '06 七项', '06 建议', '06 打架'];
const F = 846;
const C0 = [560, 720, 22], CWp = [960, F, 11], CC = [960, 586, 14], CE = [960, 588, 12], COm = [1700, F, 10], CL0 = [200, F, 9], CRa = [1720, F, 10], CK = [1640, F, 11],
  CAd = [[460, F, 11], [1000, F, 11], [1540, F, 11]], CF0 = [760, F, 12], CF1 = [840, F, 12], CF2 = [690, F, 12], K0 = [2040, F, 12], K1 = [1160, F, 12], K2 = [1080, F, 12], K3 = [1230, F, 12];
const WW = [{ x: 200, t: '工具 1', ok: 1 }, { x: 1040, t: '工具 2', ok: 0 }], WY = 230, WWd = 680, WH = 360;
const CX = 960, CY = 530, CR = 130, ER = [560, 290];
const PARTS = [['系统提示词', ''], ['工具', '读写文件 · 执行命令 · 搜索 · 浏览器'], ['权限设置', ''], ['上下文管理', ''], ['规则文件', ''], ['hooks', ''], ['反馈', '跑测试 · 代码检查']];
const partXY = i => { const an = -Math.PI / 2 + i * 2 * Math.PI / 7; return [CX + ER[0] * Math.cos(an), CY + ER[1] * Math.sin(an)]; };
const LY = [400, 720], CX0 = 520, CX1 = 1480, LC = [COL.dim, COL.type], LNAME = ['通用框架', 'Claude Code'], BIG = { fx: 1084, y: 564, sc: 2 };
const OR = [['Claude Opus 4.5', .42, .78, 1], ['其他模型 1', .55, .6, 0], ['其他模型 2', .5, .46, 0], ['其他模型 3', .38, .43, 0]], OX = 700, OWd = 900;
const oY = i => 330 + i * 130 + (i ? 30 : 0);
const RUNG = [['行内补全', '打字时补下一段'], ['对话面板', '问答、解释、生成片段'], ['IDE 里的 Agent', 'Qoder · Trae · Cursor'], ['命令行 Agent', 'Claude Code · Codex CLI'], ['云端后台 Agent', '跑完直接提交 PR'], ['应用生成平台', 'Lovable · Bolt · v0']];
const RY = [800, 692, 584, 476, 368, 260], RX0 = 300, RW = 500, GX = 1240, GW = 480;
const AXT = [['作业', .45], ['给别人用', .72], ['上线', 1]];
const GC = 42, GS = 30, GX0 = 330, GY0 = 290, REDI = [47, 118, 160, 233, 299, 352, 437];
const VS = { x: 560, y: 250, w: 800, h: 420 };
const SEVEN = ['在哪写代码：IDE 还是终端', '能用哪些模型，能不能换', '计费方式', '权限控制和撤销功能（检查点）', '是否支持规则文件和 MCP', '国内网络能否直接用', '数据会不会被拿去训练'];
const KC = { x: 400, y: 170, w: 1080, h: 680 };
const ADV = [{ x: 260, n: '1', t: 'IDEA 里的 Qoder', tag: '先用', c: COL.str }, { x: 800, n: '2', t: '命令行 Agent', tag: '再试', c: COL.fn }, { x: 1340, n: '3', t: '应用生成平台', tag: '只拿来做原型', c: COL.num }];
const AY = 330, AW = 400, AH = 220;
const FD = { cx: 960, cy: 690, w: 180, h: 220 };
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);
const fio = (T, a, b, i = .4, o = .5) => prog(T, a, a + i) * (1 - prog(T, b - o, b));

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, W, O, P, E, G, Om, L, Ra, K, Ad, Fg] = N.map(n => C[n]);
  const tm = { S, W, O, P, E, G, Om, L, Ra, K, Ad, Fg,
    dots: S + .5,
    wWin: W + .6, wChip: W + 1.4, p1a: W + 3, p1b: W + 5.4, ok1: W + 5.5, p2a: W + 6.2, p2b: W + 7.4, wErr: W + 7.6,
    core: O + .4, coreL: O + .9, ring: O + 1.6, ringL: O + 2.4, fillR: O + 3.4,
    morph: P + .3, pT: [P + 1, P + 2.2, P + 3.4, P + 4.6, P + 5.6, P + 6.4, P + 7.6], hk: P + 9.8, hkEx: P + 10.6, cx: P + 13.2, cxA: P + 14.2, cxB: P + 15.6,
    eng: E + .4, engL: E + 1.2, body: E + 3, bodyL: E + 3.6, split: E + 4.8, inCar1: E + 5,
    badge: G + .5, mChip: G + 3.2, bChip: G + 3.8, ln1: G + 5.6, d1a: G + 5.9, d1b: G + 6.9, toCar2: G + 7.1, ln2: G + 7.2, d2a: G + 7.8, d2b: G + 8.8, fixL: G + 9.6, fixA: G + 9.6, fixB: G + 10.4,
    legend: Om + .4, oRow: [Om + .6, Om + 1.2, Om + 1.7, Om + 2.2], revHi: Om + 3.4, cmb: Om + 6, merge: Om + 7.2,
    rung: [L + 3.6, L + 4.6, L + 5.6, L + 7, L + 8.2, L + 9.4], gauges: L + 2.8, gHi: L + 10.6, axis: L + 12.4, sl0: L + 13, sl1: L + 14.4, red: L + 14.4,
    badgeR: Ra + .6, scan0: Ra + 3.6, scan1: Ra + 6, cnt: Ra + 4.6, plat: [Ra + 5.4, Ra + 5.8, Ra + 6.2], deng: Ra + 6.5, redT: REDI.map((_, i) => Ra + 8.6 + i * .16), redL: Ra + 9.6, data: [Ra + 10.4, Ra + 11], vis: Ra + 12.2, priv: Ra + 14.4,
    items: SEVEN.map((_, i) => K + .8 + i * .5),
    ad: [Ad + 1.2, Ad + 5, Ad + 7], gate: Ad + 4, adTag: [Ad + 2.2, Ad + 5.8, Ad + 8],
    file: Fg + .5, clone: Fg + .9, tagsF: Fg + 1.6, grab: Fg + 2.6, tear: Fg + 4.8, clash: Fg + 5,
  };
  const ty = { chName: { s: S + 1.3, cps: 10, text: 'Harness' } };
  const caps = [
    [W + .2, W + 2.8, '怪事来了：同一个模型，'], [W + 2.8, W + 6, '放在这个工具里能顺利写完登录功能，'], [W + 6, W + 8.3, '换个工具就老是半路出错。'],
    [O + .2, O + 3.2, '差别出在模型外面那一层，叫 harness。'], [O + 3.2, O + 5.8, '模型之外的全部，都算 harness。'],
    [P + .2, P + 4.4, '包括系统提示词、能调用的工具、权限设置、'], [P + 4.4, P + 7, '上下文管理、规则文件和 hooks，'], [P + 7, P + 9.6, '还有跑测试、跑代码检查这类反馈。'],
    [P + 9.6, P + 13, 'hooks 是在特定时机自动运行的脚本。'], [P + 13, P + 17.3, '上下文管理包括压缩内容，以及把子任务分给子代理。'],
    [E + .2, E + 3, '打个比方：模型是发动机，'], [E + 3, E + 4.8, 'harness 是整辆车。'], [E + 4.8, E + 8.8, '同一台发动机装进不同的车，跑出来的成绩不一样。'],
    [G + .2, G + 3, 'Princeton HAL 团队 2025 年 12 月测过：'], [G + 3, G + 5.6, '同一个 Claude Opus 4.5 做 CORE-Bench，'],
    [G + 5.6, G + 8.8, '用通用框架得 42%，放进 Claude Code 得 78%，'], [G + 8.8, G + 11.3, '修正评分错误后到了 95%。'],
    [Om + .2, Om + 3, '换成其他模型，差距就小得多，'], [Om + 3, Om + 5.8, '有的反而在通用框架里表现更好。'], [Om + 5.8, Om + 9.3, '所以模型和 harness 得放在一起看。'],
    [L + .2, L + 3.4, '常见的工具形态，按自主程度从低到高排：'], [L + 3.4, L + 6.6, '行内补全、对话面板、IDE 里的 Agent、'], [L + 6.6, L + 10.4, '命令行 Agent、云端后台 Agent、应用生成平台。'],
    [L + 10.4, L + 13, '越往上，你亲眼看的代码越少，'], [L + 13, L + 16.3, '检查和隔离就越得靠流程来兜底。'],
    [Ra + .2, Ra + 3.6, '举个例子。2026 年 5 月，RedAccess 扫了'], [Ra + 3.6, Ra + 8.4, '约 38 万个用 Lovable、Base44、Replit 等平台生成的公开应用，'],
    [Ra + 8.4, Ra + 12, '约 5000 个把病历、银行记录这类敏感数据暴露在外。'], [Ra + 12, Ra + 16.3, '主要原因是这些平台默认公开，用户没改成私有。'],
    [K + .2, K + 3.2, '挑工具的时候，看画面上这七项。'],
    [Ad + .2, Ad + 3.6, '给这门课的建议：先用 IDEA 里的 Qoder；'], [Ad + 3.6, Ad + 6.6, '熟悉了 Git 和命令行，再试命令行 Agent；'], [Ad + 6.6, Ad + 9.8, '应用生成平台只拿来做原型。'],
    [Fg + .2, Fg + 4.8, '另外，别让好几个 Agent 同时改同一个仓库里的同一批文件，'], [Fg + 4.8, Fg + 7.3, '它们会打架。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0],
    [W + .8, 1.52, 0, .03, 0, 0, 0], [W + 3.2, 1.48, -.06, .03, 0, -.08, 0], [W + 6.2, 1.48, .06, .03, 0, .08, 0], [W + 8.4, 1.5, .04, .03, 0, .04, 0],
    [O + .6, 1.4, 0, .02, 0, 0, -.02], [O + 5.8, 1.5, .04, .03, 0, 0, 0],
    [P + 1, 1.62, -.04, .04, 0, 0, 0], [P + 9.8, 1.56, .04, .04, 0, -.1, 0], [P + 13.2, 1.56, -.02, .04, 0, .08, .03], [P + 17.2, 1.6, .02, .04, 0, 0, 0],
    [E + .8, 1.42, .04, .03, 0, 0, 0], [E + 4.6, 1.5, .08, .05, 0, 0, 0], [E + 8.8, 1.56, .12, .07, 0, 0, .02],
    [G + 6, 1.54, .06, .07, 0, -.02, -.03], [G + 8, 1.54, .08, .07, 0, .02, .04], [G + 11.2, 1.56, .1, .06, 0, .06, .03],
    [Om + .8, 1.52, -.04, .03, 0, 0, 0], [Om + 9.2, 1.48, .04, .03, 0, 0, 0],
    [L + .8, 1.56, .1, .05, 0, -.06, .03], [L + 6, 1.5, .08, .03, 0, -.08, -.03], [L + 10.4, 1.54, -.06, .03, 0, .06, 0], [L + 16.2, 1.54, -.04, .03, 0, .04, 0],
    [Ra + .8, 1.56, 0, .03, 0, 0, 0], [Ra + 8.6, 1.48, .04, .03, 0, 0, 0], [Ra + 12.4, 1.52, -.04, .03, 0, 0, 0], [Ra + 16.2, 1.5, .02, .03, 0, 0, 0],
    [K + .8, 1.56, -.03, .03, 0, -.02, 0], [K + 11.2, 1.5, .03, .03, 0, -.02, 0],
    [Ad + .8, 1.54, -.06, .03, 0, -.06, 0], [Ad + 5, 1.52, 0, .03, 0, 0, 0], [Ad + 9.6, 1.52, .06, .03, 0, .06, 0],
    [Fg + .8, 1.5, 0, .03, 0, 0, 0], [Fg + 4.6, 1.46, 0, .03, 0, 0, 0], [Fg + 7.2, 1.5, 0, .03, 0, 0, 0],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'],
    [W - .1, 'jump'], [tm.wWin, 'on'], [tm.wWin + .2, 'on'], [tm.wChip, 'blip'], [tm.wChip + .15, 'blip'], [tm.p1a, 'sweep'], [tm.ok1, 'ping'], [tm.p2a, 'sweep'], [tm.wErr, 'buzz'], [tm.wErr, 'glitch'], [tm.wErr + .4, 'blip'],
    [O - .2, 'jump'], [tm.core, 'on'], [tm.coreL, 'blip'], [tm.ring, 'sweep'], [tm.ringL, 'on'], [tm.fillR, 'sparkle'],
    [tm.morph, 'whoosh'], ...tm.pT.flatMap(t => [[t, 'whoosh'], [t + .6, 'stick']]), [tm.hk, 'on'], [tm.hkEx, 'blip'], [tm.cx, 'on'], [tm.cxA, 'pix'], [tm.cxB, 'pix'],
    [E - .2, 'jump'], [tm.eng, 'assemble'], [tm.engL, 'on'], [tm.body, 'sweep'], [tm.bodyL, 'on'], [tm.split, 'whoosh'], [tm.inCar1, 'jump'],
    [tm.badge, 'on'], [tm.mChip, 'blip'], [tm.bChip, 'blip'], [tm.ln1, 'on'], [tm.d1a, 'sweep'], [tm.d1b, 'thump'], [tm.toCar2, 'jump'], [tm.ln2, 'on'], [tm.d2a, 'sweep'], [tm.d2b, 'ping'], [tm.fixA, 'sweep'], [tm.fixB, 'sparkle'],
    [Om - .2, 'jump'], [tm.legend, 'on'], ...tm.oRow.map(t => [t, 'pix']), [tm.revHi, 'blip'], [tm.cmb, 'on'], [tm.cmb + .2, 'on'], [tm.merge, 'whoosh'], [tm.merge + .5, 'thump'],
    [L - .2, 'jump'], [L + .4, 'sweep'], ...tm.rung.flatMap(t => [[t - .1, 'jump'], [t + .3, 'on']]), [tm.gauges, 'on'], [tm.gHi, 'blip'], [tm.axis, 'on'], [tm.sl0, 'sweep'], [tm.red, 'glitch'], [tm.red, 'buzz'],
    [Ra - .2, 'jump'], [tm.badgeR, 'on'], [tm.scan0, 'sweep'], ...Array.from({ length: 12 }, (_, i) => [tm.scan0 + i * .2, 'pix']), [tm.cnt, 'on'], ...tm.plat.map(t => [t, 'blip']),
    ...tm.redT.map(t => [t, 'pix']), [tm.redT[0], 'buzz'], [tm.redL, 'glitch'], ...tm.data.map(t => [t, 'on']), [tm.vis, 'on'], [tm.priv, 'ping'],
    [K - .2, 'jump'], ...tm.items.flatMap(t => [[t, 'pix'], [t + .2, 'blip']]),
    [Ad - .2, 'jump'], ...tm.ad.map(t => [t, 'on']), [tm.ad[1] - .1, 'jump'], [tm.ad[2] - .1, 'jump'], [tm.gate, 'blip'], ...tm.adTag.map(t => [t, 'ping']),
    [Fg - .2, 'jump'], [tm.file, 'on'], [tm.clone, 'jump'], [tm.tagsF, 'blip'], [tm.grab - .4, 'jump'], ...Array.from({ length: 6 }, (_, i) => [tm.grab + .1 + i * .35, 'stick']),
    [tm.tear, 'snip'], [tm.tear, 'glitch'], [tm.tear + .05, 'thump'], [tm.clash, 'buzz']];
  const SRC1 = 'Princeton HAL / Sayash Kapoor, 2025-12', SRC2 = 'RedAccess via Security Boulevard, 2026-05';
  const text = [...WW.map(w => w.t), ...PARTS.flat(), ...LNAME, ...OR.map(o => o[0]), ...RUNG.flat(), ...AXT.map(a => a[0]), ...SEVEN, ...ADV.flatMap(d => [d.t, d.tag]), SRC1, SRC2,
    '第 6 章同一个模型登录功能写完了半路出错模型 harness 改完代码，自动跑检查压缩子代理发动机 = 模型整辆车 = harness 0% 50% 100% -- Princeton HAL · 2025-12 Claude Opus 4.5 CORE-Bench 修正评分错误后通用框架示意 + 自主程度从低到高亲自看的代码量需要的检查和隔离项目轴 RedAccess · 2026-05 约 38 万个公开应用 Lovable Base44 Replit 等约 5000 个暴露敏感数据病历银行记录应用设置谁能访问公开私有默认选工具看这七项熟悉 Git 和命令行 UserService.java 冲突 Agent 1 2'].join('');
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [E, 'dis'], [L, 'fluid'], [Ra, 'dis'], [Ad, 'fluid']],
    rips: [[tm.wErr, (WW[1].x + 340) / 1920, (WY + 254) / 1080], [tm.fixB, 1670 / 1920, LY[1] / 1080], [tm.red, (RX0 + RW / 2) / 1920, RY[5] / 1080], [tm.tear, FD.cx / 1920, FD.cy / 1080]],
    shakes: [[tm.wErr, .006], [tm.tear, .014]],
    quiet: [[K + 4.2, K + 11]], lp: [[K + 4, K + 11.2, 900]],
    hud: { num: '06', name: 'Harness', from: W + .3, srcs: [[G + .2, Om + 9.3, SRC1], [Ra + .2, K - .2, SRC2]] },
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
  ctx.font = font(500, 24); ctx.fillStyle = tc; ctx.textAlign = 'left'; ctx.fillText(title, x + 100, y + 28);
}
function check(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .7); ctx.stroke(); }
function cross(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke(); }
function chip(ctx, s, cx, cy, k, c, f = font(600, 26), fill = COL.bg, h = 48) {
  if (k <= .01) return;
  ctx.font = f; const w = ctx.measureText(s).width + 44;
  popScale(ctx, cx, cy, k, () => { box(ctx, cx - w / 2, cy - h / 2, w, h, fill, c, 2.5, h / 2); ctx.font = f; ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, cx, cy + 1); ctx.textAlign = 'left'; });
}
const chipW = (ctx, s, f) => { ctx.font = f; return ctx.measureText(s).width + 44; };
function arrow(ctx, x1, y, x2, k, c) {
  if (k <= 0) return;
  const x = lerp(x1, x2, k);
  ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x - 6, y); ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x - 14, y - 11); ctx.lineTo(x - 14, y + 11); ctx.fill();
}

// ---------- 章节卡 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 6 章', 1080, 330); ctx.globalAlpha = 1;
  dotsFor('06', 300, 12, 700, MONO, fv).pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.W - .6);
}

// ---------- 怪事：同一个模型，两个工具 ----------
const wProg = (T, tm, i) => i === 0 ? prog(T, tm.p1a, tm.p1b, MOTION.draw) : .58 * prog(T, tm.p2a, tm.p2b, Easing.easeOutQuad);
function drawOdd(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.W, tm.O);
  if (a <= 0) return;
  ctx.save();
  WW.forEach((w, i) => {
    const k = prog(T, tm.wWin + i * .2, tm.wWin + i * .2 + .5);
    if (k <= 0) return;
    ctx.save(); ctx.globalAlpha = a * k; ctx.translate(0, 20 * (1 - k));
    win(ctx, w.x, WY, WWd, WH, w.t, COL.dim);
    chip(ctx, '同一个模型', w.x + WWd / 2, WY + 116, prog(T, tm.wChip + i * .15, tm.wChip + i * .15 + .45, MOTION.pop), COL.kw, font(600, 28));
    ctx.font = font(600, 34); ctx.fillStyle = COL.text; ctx.fillText('登录功能', w.x + 50, WY + 200);
    const p = wProg(T, tm, i), bad = !w.ok && T >= tm.wErr, c = bad ? COL.err : w.ok && p >= 1 ? COL.str : COL.fn;
    const jx = bad && T < tm.wErr + .4 ? Math.sin(T * 90) * 6 * (1 - (T - tm.wErr) / .4) : 0;
    box(ctx, w.x + 50 + jx, WY + 240, WWd - 100, 28, COL.bg, COL.line, 2, 14);
    if (p > .01) { ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(w.x + 54 + jx, WY + 244, (WWd - 108) * p, 20, 10); ctx.fill(); }
    const ks = w.ok ? prog(T, tm.ok1, tm.ok1 + .45, MOTION.pop) : prog(T, tm.wErr, tm.wErr + .45, MOTION.pop);
    if (ks > .01) popScale(ctx, w.x + 70, WY + 316, ks, () => {
      if (w.ok) check(ctx, w.x + 70, WY + 316, 14, COL.str); else cross(ctx, w.x + 70, WY + 316, 11, COL.err);
      ctx.font = font(600, 30); ctx.fillStyle = w.ok ? COL.str : COL.err; ctx.fillText(w.ok ? '写完了' : '半路出错', w.x + 100, WY + 316);
    });
    ctx.restore();
  });
  ctx.restore();
}

// ---------- 外层与部件 ----------
function drawShell(ctx, T, pl) {
  const { tm } = pl, a = prog(T, tm.O, tm.O + .3) * (1 - prog(T, tm.E - .5, tm.E));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const m = prog(T, tm.morph, tm.morph + .8, MOTION.draw), rx = lerp(300, ER[0], m), ry = lerp(300, ER[1], m);
  const kr = prog(T, tm.ring, tm.ring + .8, MOTION.draw), kf = prog(T, tm.fillR, tm.fillR + .6) * (1 - m);
  if (kf > 0) { ctx.fillStyle = rgba(COL.type, .12 * kf); ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, 0, 6.283); ctx.moveTo(CX + CR, CY); ctx.arc(CX, CY, CR, 0, 6.283); ctx.fill('evenodd'); }
  if (kr > 0) {
    ctx.strokeStyle = mixC(COL.type, COL.line, m * .5); ctx.lineWidth = lerp(6, 2, m); if (m > 0) ctx.setLineDash([10, 10]);
    ctx.beginPath(); ctx.ellipse(CX, CY, rx, ry, 0, -Math.PI / 2, -Math.PI / 2 + 6.283 * kr); ctx.stroke(); ctx.setLineDash([]);
  }
  chip(ctx, 'harness', CX, CY - ry, prog(T, tm.ringL, tm.ringL + .45, MOTION.pop) * (1 - m), COL.type, font(600, 30, MONO));
  const hl = T >= tm.cx ? 3 : T >= tm.hk ? 5 : -1;
  PARTS.forEach(([t, sub], i) => {
    const t0 = tm.pT[i], k = prog(T, t0, t0 + .6, MOTION.draw);
    if (k <= 0) return;
    const [px, py] = partXY(i), an = Math.atan2(py - CY, px - CX), sx = px + Math.cos(an) * 900 * (1 - k), sy = py + Math.sin(an) * 900 * (1 - k);
    const on = hl === i ? 1 : 0, dim = hl < 0 || on ? 1 : .35;
    ctx.globalAlpha = a * dim * Math.min(1, k * 2);
    const ks = prog(T, t0 + .5, t0 + .9, MOTION.draw);
    if (ks > 0) {
      const ex = CX + Math.cos(an) * (CR + 8), ey = CY + Math.sin(an) * (CR + 8);
      ctx.strokeStyle = rgba(COL.type, .6); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(lerp(ex, px, ks), lerp(ey, py, ks)); ctx.stroke();
    }
    const ft = font(600, 30, i === 5 ? MONO : undefined);
    ctx.font = ft; let w = ctx.measureText(t).width;
    if (sub) { ctx.font = font(400, 20); w = Math.max(w, ctx.measureText(sub).width); }
    w += 56; const h = sub ? 92 : 68;
    box(ctx, sx - w / 2, sy - h / 2, w, h, mixC(COL.card, COL.type, .08 + .2 * on), mixC(COL.line, COL.type, .6 + .4 * on), 2.5 + 1.5 * on, 12);
    ctx.font = ft; ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(t, sx, sub ? sy - 16 : sy);
    if (sub) { ctx.font = font(400, 20); ctx.fillStyle = COL.dim; ctx.fillText(sub, sx, sy + 22); }
    ctx.textAlign = 'left';
  });
  const [hx, hy] = partXY(5), ke = prog(T, tm.hkEx, tm.hkEx + .4) * (1 - prog(T, tm.cx - .3, tm.cx));
  if (ke > 0) { ctx.globalAlpha = a * ke; ctx.font = font(500, 24); ctx.textAlign = 'center'; ctx.fillStyle = COL.type; ctx.fillText('改完代码，自动跑检查', hx, hy + 72 + 8 * (1 - ke)); ctx.textAlign = 'left'; }
  const [cxx, cxy] = partXY(3);
  ctx.globalAlpha = a;
  chip(ctx, '压缩', cxx + 190, cxy, prog(T, tm.cxA, tm.cxA + .45, MOTION.pop), COL.type, font(600, 26), COL.card);
  chip(ctx, '子代理', cxx + 324, cxy, prog(T, tm.cxB, tm.cxB + .45, MOTION.pop), COL.type, font(600, 26), COL.card);
  const kc = prog(T, tm.core, tm.core + .5, MOTION.pop);
  if (kc > .01) popScale(ctx, CX, CY, Math.min(kc, 1.1), () => {
    ctx.fillStyle = rgba(COL.kw, .1); ctx.strokeStyle = COL.kw; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(CX, CY, CR, 0, 6.283); ctx.fill(); ctx.stroke();
  });
  chip(ctx, '模型', CX, CY + CR + 4, prog(T, tm.coreL, tm.coreL + .45, MOTION.pop), COL.kw, font(600, 28), COL.card);
  ctx.restore();
}

// ---------- 发动机与车 ----------
const carS = (T, tm, i) => i ? .78 * prog(T, tm.d2a, tm.d2b, MOTION.draw) + .17 * prog(T, tm.fixA, tm.fixB, MOTION.draw) : .42 * prog(T, tm.d1a, tm.d1b, MOTION.draw);
const carFx = (T, tm, i) => CX0 + (CX1 - CX0) * carS(T, tm, i);
function car(ctx, fx, y, sc, kb, c, wa) {
  ctx.save(); ctx.translate(fx, y); ctx.scale(sc, sc);
  const ga = ctx.globalAlpha;
  if (kb > 0) {
    ctx.globalAlpha = ga * Math.min(1, kb * 1.5); ctx.lineJoin = 'round';
    ctx.fillStyle = COL.card; ctx.strokeStyle = c; ctx.lineWidth = 3 / sc;
    ctx.beginPath(); ctx.moveTo(-262, -40); ctx.lineTo(-222, -86); ctx.lineTo(-128, -86); ctx.lineTo(-100, -40); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = rgba(c, .18); ctx.beginPath(); ctx.moveTo(-246, -46); ctx.lineTo(-216, -78); ctx.lineTo(-134, -78); ctx.lineTo(-112, -46); ctx.closePath(); ctx.fill();
    box(ctx, -300, -40, 300, 80, COL.card, c, 3 / sc, 16);
    for (const wx of [-238, -62]) {
      ctx.fillStyle = COL.bg; ctx.strokeStyle = c; ctx.lineWidth = 5 / sc; ctx.beginPath(); ctx.arc(wx, 40, 28, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 3 / sc; ctx.beginPath();
      for (let s = 0; s < 3; s++) { const an = wa + s * 2.094; ctx.moveTo(wx, 40); ctx.lineTo(wx + Math.cos(an) * 22, 40 + Math.sin(an) * 22); }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = ga;
  box(ctx, -114, -38, 104, 52, rgba(COL.clawd, .08), COL.dim, 2.5 / sc, 8);
  ctx.restore();
}
function drawCars(ctx, T, pl) {
  const { tm } = pl, a = prog(T, tm.E, tm.E + .3) * (1 - prog(T, tm.Om - .5, tm.Om));
  if (a <= 0) return;
  ctx.save();
  const kx = 1 - prog(T, tm.split, tm.split + .6);
  if (kx > 0) {
    ctx.globalAlpha = a * kx;
    const ke = prog(T, tm.eng, tm.eng + .5, MOTION.pop), kb = prog(T, tm.body, tm.body + .7);
    if (ke > .01) popScale(ctx, 960, 540, Math.min(ke, 1.1) * lerp(.6, 1, kx), () => car(ctx, BIG.fx, BIG.y, BIG.sc, kb, COL.type, 0));
    ctx.font = font(600, 32);
    ctx.globalAlpha = a * kx * prog(T, tm.engL, tm.engL + .4); ctx.fillStyle = COL.kw; ctx.fillText('发动机 = 模型', 1130, 540);
    ctx.globalAlpha = a * kx * prog(T, tm.bodyL, tm.bodyL + .4); ctx.fillStyle = COL.type; ctx.textAlign = 'center'; ctx.fillText('整辆车 = harness', 734, 340); ctx.textAlign = 'left';
  }
  const kl = prog(T, tm.split + .2, tm.split + .8);
  if (kl > 0) LY.forEach((y, i) => {
    ctx.globalAlpha = a * kl;
    ctx.strokeStyle = COL.line; ctx.lineWidth = 2; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(160, y + 72); ctx.lineTo(CX1 + 20, y + 72); ctx.stroke(); ctx.setLineDash([]);
    ctx.font = font(400, 20, MONO); ctx.fillStyle = COL.faint; ctx.textAlign = 'center';
    [[0, '0%'], [.5, '50%'], [1, '100%']].forEach(([s, l]) => { const x = CX0 + (CX1 - CX0) * s; ctx.fillRect(x - 1, y + 64, 2, 16); ctx.fillText(l, x, y + 96); });
    const s = carS(T, tm, i), st0 = i ? tm.d2a : tm.d1a, shown = T >= st0 ? Math.round(s * 100) + '%' : '--';
    box(ctx, 1560, y - 50, 220, 100, COL.bg, i ? COL.type : COL.line, 2.5, 12);
    ctx.font = font(700, 56, MONO); ctx.fillStyle = T < st0 ? COL.faint : i ? COL.type : COL.text; ctx.fillText(shown, 1670, y + 2); ctx.textAlign = 'left';
    const fx = carFx(T, tm, i);
    car(ctx, fx, y, 1, 1, LC[i], (fx - CX0) / 28);
    const mv = i ? (T > tm.d2a && T < tm.d2b) || (T > tm.fixA && T < tm.fixB) : T > tm.d1a && T < tm.d1b;
    if (mv) { ctx.strokeStyle = rgba(LC[i], .6); ctx.lineWidth = 3; for (let j = 0; j < 3; j++) { const ly = y - 20 + j * 22, l = 40 + 30 * hash(j + Math.floor(T * 12)); ctx.beginPath(); ctx.moveTo(fx - 320 - l, ly); ctx.lineTo(fx - 316, ly); ctx.stroke(); } }
    const tn = i ? tm.ln2 : tm.ln1;
    chip(ctx, LNAME[i], 300, y + 124, prog(T, tn, tn + .45, MOTION.pop), i ? COL.type : COL.dim, font(600, 26, i ? MONO : undefined), COL.card);
  });
  ctx.globalAlpha = a;
  chip(ctx, '修正评分错误后', 1670, LY[1] + 86, prog(T, tm.fixL, tm.fixL + .45, MOTION.pop), COL.type, font(600, 22), COL.card);
  chip(ctx, 'Princeton HAL · 2025-12', 960, 180, prog(T, tm.badge, tm.badge + .45, MOTION.pop), COL.kw, font(600, 28));
  chip(ctx, 'Claude Opus 4.5', 800, 250, prog(T, tm.mChip, tm.mChip + .45, MOTION.pop), COL.clawd, font(600, 26, MONO), COL.card);
  chip(ctx, 'CORE-Bench', 1110, 250, prog(T, tm.bChip, tm.bChip + .45, MOTION.pop), COL.num, font(600, 26, MONO), COL.card);
  ctx.restore();
}

// ---------- 其他模型 ----------
function drawOther(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Om, tm.cmb);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a * prog(T, tm.legend, tm.legend + .4);
    [[COL.dim, '通用框架'], [COL.type, 'Claude Code']].forEach(([c, s], j) => {
      const x = OX + j * 240; box(ctx, x, 214, 26, 26, rgba(c, .3), c, 2, 5);
      ctx.font = font(500, 26, j ? MONO : undefined); ctx.fillStyle = COL.dim; ctx.fillText(s, x + 40, 228);
    });
    ctx.font = font(400, 22); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('示意', OX + OWd, 228); ctx.textAlign = 'left';
    OR.forEach(([n, g, c, real], i) => {
      const k = prog(T, tm.oRow[i], tm.oRow[i] + .7, MOTION.draw);
      if (k <= 0) return;
      const y = oY(i);
      ctx.globalAlpha = a * Math.min(1, k * 2);
      ctx.font = font(600, 30, real ? MONO : undefined); ctx.fillStyle = real ? COL.text : COL.dim; ctx.textAlign = 'right'; ctx.fillText(n, OX - 30, y); ctx.textAlign = 'left';
      box(ctx, OX, y - 34, OWd * g * k, 28, rgba(COL.dim, .3), COL.dim, 2, 6);
      box(ctx, OX, y + 6, OWd * c * k, 28, rgba(COL.type, .3), COL.type, 2, 6);
      if (real) { ctx.font = font(600, 24, MONO); ctx.fillStyle = COL.dim; ctx.fillText('42%', OX + OWd * g * k + 14, y - 20); ctx.fillStyle = COL.type; ctx.fillText('78%', OX + OWd * c * k + 14, y + 20); }
    });
    const rh = prog(T, tm.revHi, tm.revHi + .4);
    if (rh > 0) { ctx.globalAlpha = a * rh; ctx.strokeStyle = COL.num; ctx.lineWidth = 2.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.roundRect(OX - 300, oY(2) - 52, OWd + 330, 104, 12); ctx.stroke(); ctx.setLineDash([]); }
    ctx.restore();
  }
  const b = prog(T, tm.cmb, tm.cmb + .4) * (1 - prog(T, tm.L - .5, tm.L));
  if (b <= 0) return;
  ctx.save(); ctx.globalAlpha = b;
  const mg = prog(T, tm.merge, tm.merge + .6, MOTION.draw);
  chip(ctx, '模型', lerp(700, 830, mg), 520, prog(T, tm.cmb, tm.cmb + .45, MOTION.pop), COL.kw, font(600, 44), COL.card, 84);
  chip(ctx, 'harness', lerp(1220, 1090, mg), 520, prog(T, tm.cmb + .2, tm.cmb + .65, MOTION.pop), COL.type, font(600, 44, MONO), COL.card, 84);
  ctx.globalAlpha = b * mg; ctx.font = font(600, 52); ctx.fillStyle = COL.dim; ctx.textAlign = 'center'; ctx.fillText('+', 938, 520); ctx.textAlign = 'left';
  const kw = prog(T, tm.merge + .4, tm.merge + 1, MOTION.draw);
  if (kw > 0) { const per = 2 * (560 + 170); ctx.globalAlpha = b; ctx.strokeStyle = COL.text; ctx.lineWidth = 3; ctx.setLineDash([per * kw, per]); ctx.beginPath(); ctx.roundRect(680, 435, 580, 170, 22); ctx.stroke(); ctx.setLineDash([]); }
  ctx.restore();
}

// ---------- 梯子 ----------
const lvl = (T, tm) => tm.rung.slice(1).reduce((s, t) => s + prog(T, t - .1, t + .35), 0) / 5;
function drawLadder(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.L, tm.Ra);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const kr = prog(T, tm.L + .4, tm.L + 1.4, MOTION.draw), rt = RY[5] - 32, red = prog(T, tm.red, tm.red + .5);
  ctx.fillStyle = COL.line;
  for (const rx of [RX0 + 30, RX0 + RW - 38]) ctx.fillRect(rx, lerp(F, rt, kr), 8, (F - rt) * kr);
  ctx.globalAlpha = a * kr; ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.faint; ctx.fillText('// 自主程度从低到高', RX0, 180);
  RUNG.forEach(([n, ex], i) => {
    const t = tm.rung[i], k = prog(T, t, t + .35), y = RY[i], top = i === 5 ? red : 0, c = mixC(COL.fn, COL.err, top);
    ctx.globalAlpha = a * kr;
    box(ctx, RX0, y - 32, RW, 64, mixC(COL.card, c, .15 * k + .25 * top), mixC(COL.line, c, k), 2 + 1.5 * k, 10);
    ctx.font = font(600, 30); ctx.textAlign = 'center'; ctx.fillStyle = k > .5 ? COL.text : COL.faint; ctx.fillText(n, RX0 + 300, y); ctx.textAlign = 'left';
    ctx.globalAlpha = a * k; ctx.font = font(400, 22); ctx.fillStyle = COL.dim; ctx.fillText(ex, RX0 + RW + 30, y);
  });
  const kg = prog(T, tm.gauges, tm.gauges + .5), lv = lvl(T, tm), hi = bump(T, tm.gHi + .3, .4);
  if (kg > 0) {
    ctx.globalAlpha = a * kg;
    [['亲自看的代码量', 1 - .85 * lv, COL.fn], ['需要的检查和隔离', .15 + .85 * lv, heat(lv)]].forEach(([s, v, c], j) => {
      const y = 300 + j * 150;
      ctx.font = font(600, 30); ctx.fillStyle = COL.text; ctx.fillText(s, GX, y);
      box(ctx, GX, y + 34, GW, 36, COL.bg, mixC(COL.line, c, .4 + .6 * hi), 2 + 2 * hi, 10);
      ctx.fillStyle = c; ctx.beginPath(); ctx.roundRect(GX + 5, y + 39, (GW - 10) * v, 26, 8); ctx.fill();
    });
  }
  const ka = prog(T, tm.axis, tm.axis + .6);
  if (ka > 0) {
    const ay = 680, sp = lerp(.45, 1, prog(T, tm.sl0, tm.sl1, MOTION.draw)), sx = GX + GW * sp;
    ctx.globalAlpha = a * ka; ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.faint; ctx.fillText('// 项目轴', GX, ay - 60);
    ctx.fillStyle = '#5a5f6b'; ctx.fillRect(GX, ay - 2, GW, 4);
    const g = ctx.createLinearGradient(GX, 0, sx, 0); g.addColorStop(0, COL.str); g.addColorStop(1, heat(sp)); ctx.fillStyle = g; ctx.fillRect(GX, ay - 3, sx - GX, 6);
    ctx.textAlign = 'center';
    AXT.forEach(([s, x]) => { const lit = sp >= x - 1e-3, tx = GX + GW * x; ctx.fillStyle = lit ? heat(x) : '#4a4e57'; ctx.fillRect(tx - 3, ay - 14, 6, 28); ctx.font = font(lit ? 600 : 400, 24); ctx.fillStyle = lit ? COL.text : COL.dim; ctx.fillText(s, tx, ay + 44); });
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(19,20,23,.95)'; ctx.beginPath(); ctx.arc(sx, ay, 20, 0, 6.283); ctx.fill();
    ctx.fillStyle = heat(sp); ctx.beginPath(); ctx.arc(sx, ay, 14, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}

// ---------- RedAccess ----------
function drawScan(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Ra, tm.vis - .2);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    chip(ctx, 'RedAccess · 2026-05', 960, 200, prog(T, tm.badgeR, tm.badgeR + .45, MOTION.pop), COL.err, font(600, 28));
    const sx = lerp(GX0 - 40, GX0 + GC * GS + 40, prog(T, tm.scan0, tm.scan1, Easing.linear));
    for (let i = 0; i < GC * 12; i++) {
      const x = GX0 + (i % GC) * GS, y = GY0 + Math.floor(i / GC) * GS;
      if (sx < x) continue;
      const ri = REDI.indexOf(i), kr = ri >= 0 ? prog(T, tm.redT[ri], tm.redT[ri] + .35, MOTION.pop) : 0;
      ctx.globalAlpha = a * Math.min(1, (sx - x) / 60);
      if (kr > .01) { const s = 24 * Math.min(kr, 1.3); ctx.fillStyle = rgba(COL.err, .25); ctx.fillRect(x + 12 - s, y + 12 - s, s * 2, s * 2); box(ctx, x + 12 - s / 2, y + 12 - s / 2, s, s, COL.err, COL.err, 2, 4); }
      else box(ctx, x, y, 24, 24, rgba(COL.dim, .2), COL.line, 1.5, 4);
    }
    if (T >= tm.scan0 && T < tm.scan1 + .2) { ctx.globalAlpha = a; ctx.fillStyle = rgba(COL.type, .8); ctx.fillRect(sx - 2, GY0 - 20, 4, 12 * GS + 30); }
    ctx.globalAlpha = a * prog(T, tm.cnt, tm.cnt + .4); ctx.font = font(600, 34); ctx.fillStyle = COL.text; ctx.fillText('约 38 万个公开应用', GX0, 700);
    let px = GX0;
    ['Lovable', 'Base44', 'Replit'].forEach((s, i) => { const f = font(600, 24, MONO), w = chipW(ctx, s, f); ctx.globalAlpha = a; chip(ctx, s, px + w / 2, 770, prog(T, tm.plat[i], tm.plat[i] + .45, MOTION.pop), COL.dim, f, COL.card); px += w + 16; });
    ctx.globalAlpha = a * prog(T, tm.deng, tm.deng + .3); ctx.font = font(500, 28); ctx.fillStyle = COL.dim; ctx.fillText('等', px + 4, 770);
    const xr = GX0 + GC * GS - 6;
    ctx.globalAlpha = a * prog(T, tm.redL, tm.redL + .4); ctx.font = font(600, 34); ctx.fillStyle = COL.err; ctx.textAlign = 'right'; ctx.fillText('约 5000 个暴露敏感数据', xr, 700); ctx.textAlign = 'left';
    ctx.globalAlpha = a;
    const f2 = font(600, 26), w1 = chipW(ctx, '银行记录', f2), w0 = chipW(ctx, '病历', f2);
    chip(ctx, '病历', xr - w1 - 16 - w0 / 2, 770, prog(T, tm.data[0], tm.data[0] + .45, MOTION.pop), COL.err, f2, COL.card);
    chip(ctx, '银行记录', xr - w1 / 2, 770, prog(T, tm.data[1], tm.data[1] + .45, MOTION.pop), COL.err, f2, COL.card);
    ctx.restore();
  }
  const b = prog(T, tm.vis, tm.vis + .4) * (1 - prog(T, tm.K - .5, tm.K));
  if (b <= 0) return;
  const k = prog(T, tm.vis, tm.vis + .5), { x, y, w, h } = VS;
  ctx.save(); ctx.globalAlpha = b; ctx.translate(0, 20 * (1 - k));
  win(ctx, x, y, w, h, '应用设置', COL.dim);
  ctx.font = font(600, 34); ctx.fillStyle = COL.text; ctx.fillText('谁能访问', x + 50, y + 116);
  [['公开', 1], ['私有', 0]].forEach(([s, sel], i) => {
    const ry = y + 210 + i * 104, c = sel ? COL.err : COL.line;
    box(ctx, x + 40, ry - 40, w - 80, 80, sel ? rgba(COL.err, .12) : COL.bg, c, 2.5, 12);
    ctx.strokeStyle = sel ? COL.err : COL.dim; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x + 90, ry, 16, 0, 6.283); ctx.stroke();
    if (sel) { ctx.fillStyle = COL.err; ctx.beginPath(); ctx.arc(x + 90, ry, 8, 0, 6.283); ctx.fill(); }
    ctx.font = font(500, 32); ctx.fillStyle = sel ? COL.text : COL.dim; ctx.fillText(s, x + 130, ry);
    if (sel) chip(ctx, '默认', x + w - 120, ry, 1, COL.num, font(600, 24), COL.card);
  });
  if (T >= tm.priv) {
    const p = .55 + .45 * Math.sin((T - tm.priv) * 6);
    ctx.globalAlpha = b * prog(T, tm.priv, tm.priv + .4) * p; ctx.strokeStyle = COL.str; ctx.lineWidth = 3; ctx.setLineDash([10, 8]);
    ctx.beginPath(); ctx.roundRect(x + 30, y + 314 - 50, w - 60, 100, 16); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.restore();
}

// ---------- 七项 ----------
function drawSeven(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.K, tm.Ad);
  if (a <= 0) return;
  const ki = prog(T, tm.K + .2, tm.K + .7);
  ctx.save(); ctx.globalAlpha = a * ki; ctx.translate(0, 20 * (1 - ki));
  box(ctx, KC.x, KC.y, KC.w, KC.h, COL.card, COL.line, 2, 18);
  ctx.font = font(600, 36); ctx.fillStyle = COL.text; ctx.fillText('选工具看这七项', KC.x + 56, KC.y + 64);
  ctx.fillStyle = COL.line; ctx.fillRect(KC.x + 56, KC.y + 110, KC.w - 112, 2);
  SEVEN.forEach((s, i) => {
    const t = tm.items[i], k = prog(T, t, t + .35), y = KC.y + 166 + i * 72, kc = prog(T, t + .2, t + .5, MOTION.pop);
    if (k <= 0) return;
    ctx.globalAlpha = a * ki * k;
    box(ctx, KC.x + 56, y - 18, 36, 36, kc > .01 ? rgba(COL.str, .2) : COL.bg, kc > .01 ? COL.str : COL.dim, 2.5, 6);
    if (kc > .01) popScale(ctx, KC.x + 74, y, kc, () => check(ctx, KC.x + 74, y, 10, COL.str));
    ctx.font = font(500, 32); ctx.fillStyle = COL.text; ctx.fillText(s, KC.x + 120, y + 10 * (1 - k));
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText(String(i + 1).padStart(2, '0'), KC.x + KC.w - 56, y); ctx.textAlign = 'left';
  });
  ctx.restore();
}

// ---------- 建议 ----------
function drawAdvice(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Ad, tm.Fg);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ADV.forEach((d, i) => {
    if (i > 0) arrow(ctx, ADV[i - 1].x + AW + 14, AY + AH / 2, d.x - 14, prog(T, tm.ad[i] - .4, tm.ad[i], MOTION.draw), COL.dim);
    const k = prog(T, tm.ad[i], tm.ad[i] + .45, MOTION.pop);
    if (k <= .01) return;
    popScale(ctx, d.x + AW / 2, AY + AH / 2, Math.min(k, 1.1), () => {
      box(ctx, d.x, AY, AW, AH, COL.card, d.c, 2.5, 16);
      ctx.font = font(500, 26, MONO); ctx.fillStyle = COL.faint; ctx.fillText(d.n, d.x + 36, AY + 44);
      ctx.font = font(600, 36); ctx.fillStyle = COL.text; ctx.fillText(d.t, d.x + 36, AY + 110);
    });
    const f = font(600, 26);
    chip(ctx, d.tag, d.x + 36 + chipW(ctx, d.tag, f) / 2, AY + 174, prog(T, tm.adTag[i], tm.adTag[i] + .45, MOTION.pop), d.c, f, COL.card);
  });
  chip(ctx, '熟悉 Git 和命令行', 730, 270, prog(T, tm.gate, tm.gate + .45, MOTION.pop), COL.type, font(600, 24), COL.card);
  ctx.restore();
}

// ---------- 打架 ----------
function docShape(ctx, x, y, w, h) {
  ctx.fillStyle = COL.card; ctx.strokeStyle = COL.fn; ctx.lineWidth = 3; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w - 34, y); ctx.lineTo(x + w, y + 34); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + w - 34, y); ctx.lineTo(x + w - 34, y + 34); ctx.lineTo(x + w, y + 34); ctx.stroke();
  ctx.fillStyle = rgba(COL.dim, .5);
  for (let j = 0; j < 6; j++) ctx.fillRect(x + 24, y + 70 + j * 24, (w - 48) * (.5 + .5 * hash(j * 2.7)), 8);
}
const tugAt = (T, tm) => T >= tm.grab && T < tm.tear ? Math.sin(T * 22) * 10 : 0;
function drawFight(ctx, T, pl) {
  const { tm } = pl, end = pl.end || tm.Fg + 7.5, a = fio(T, tm.Fg, end);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const kf = prog(T, tm.file, tm.file + .45, MOTION.pop), kt = prog(T, tm.tear, tm.tear + .6), x = FD.cx - FD.w / 2 + tugAt(T, tm), y = FD.cy - FD.h / 2;
  chip(ctx, 'UserService.java', FD.cx, y - 44, kf * (1 - prog(T, tm.tear, tm.tear + .3)), COL.fn, font(600, 24, MONO), COL.card);
  if (kt <= 0) { if (kf > .01) popScale(ctx, FD.cx, FD.cy, kf, () => docShape(ctx, x, y, FD.w, FD.h)); }
  else [-1, 1].forEach(sd => {
    ctx.save();
    ctx.translate(FD.cx + sd * 150 * kt, FD.cy + 30 * kt); ctx.rotate(sd * .32 * kt); ctx.translate(-FD.cx, -FD.cy);
    const ex = sd < 0 ? x - 20 : x + FD.w + 20;
    ctx.beginPath(); ctx.moveTo(ex, y - 10);
    for (let j = 0; j <= 8; j++) ctx.lineTo(FD.cx + (j % 2 ? 12 : -12), y - 4 + j * (FD.h + 8) / 8);
    ctx.lineTo(ex, y + FD.h + 10); ctx.closePath(); ctx.clip();
    docShape(ctx, x, y, FD.w, FD.h);
    ctx.restore();
  });
  chip(ctx, '冲突', FD.cx, FD.cy - 40, prog(T, tm.clash, tm.clash + .45, MOTION.pop), COL.err, font(600, 30));
  ctx.restore();
}
function clone(T, pl) {
  const { tm } = pl, end = pl.end || tm.Fg + 7.5, r = jumpPos(T, [[tm.clone, tm.clone + .6, K0, K1], [tm.grab - .4, tm.grab, K1, K2], [tm.tear, tm.tear + .5, K2, K3]], K0), [x, y, px] = r.p;
  const st = { x: x + tugAt(T, tm), y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 1, blink: ((T + 1.7) % 3.4) < .12, squash: 1, alpha: 1 - prog(T, end - .5, end) };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  for (const t of [tm.clone + .6, tm.grab, tm.tear + .5]) if (T >= t && T < t + .25) st.squash = 1 - .2 * Math.sin(Math.PI * (T - t) / .25);
  if (T >= tm.grab - .1 && T < tm.tear) st.pose = 'push';
  if (T >= tm.tear + .5) st.sweat = T - tm.tear;
  return st;
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.W) return drawCard(ctx, T, pl, fv);
  if (T < tm.O) return drawOdd(ctx, T, pl);
  if (T < tm.E) return drawShell(ctx, T, pl);
  if (T < tm.Om) return drawCars(ctx, T, pl);
  if (T < tm.L) return drawOther(ctx, T, pl);
  if (T < tm.Ra) return drawLadder(ctx, T, pl);
  if (T < tm.K) return drawScan(ctx, T, pl);
  if (T < tm.Ad) return drawSeven(ctx, T, pl);
  if (T < tm.Fg) return drawAdvice(ctx, T, pl);
  drawFight(ctx, T, pl);
}

// ---------- Clawd ----------
function clawd(T, pl) {
  const { tm } = pl, prev = pl.prev || [960, 600, 12];
  const c1 = t => [carFx(t, tm, 0) - 62, LY[0] + 12, 7], c2 = t => [carFx(t, tm, 1) - 62, LY[1] + 12, 7], rp = i => [360, RY[i] - 32, 9];
  const J = [[tm.S - .55, tm.S + .35, prev, C0], [tm.W - .1, tm.W + .6, C0, CWp], [tm.O - .2, tm.O + .5, CWp, CC], [tm.E - .2, tm.E + .5, CC, CE],
    [tm.inCar1, tm.inCar1 + .6, CE, c1], [tm.toCar2, tm.toCar2 + .55, c1, c2], [tm.Om - .2, tm.Om + .5, c2, COm], [tm.L - .2, tm.L + .5, COm, CL0]];
  tm.rung.forEach((t, i) => J.push([t - .1, t + .35, i ? rp(i - 1) : CL0, rp(i)]));
  J.push([tm.Ra - .2, tm.Ra + .5, rp(5), CRa], [tm.K - .2, tm.K + .5, CRa, CK], [tm.Ad - .2, tm.Ad + .5, CK, CAd[0]], [tm.ad[1] - .1, tm.ad[1] + .5, CAd[0], CAd[1]],
    [tm.ad[2] - .1, tm.ad[2] + .5, CAd[1], CAd[2]], [tm.Fg - .2, tm.Fg + .5, CAd[2], CF0], [tm.grab - .4, tm.grab, CF0, CF1], [tm.tear, tm.tear + .5, CF1, CF2]);
  const r = jumpPos(T, J, prev), [x, y, px] = r.p;
  const st = { x: x + tugAt(T, tm), y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  const nod = (t, d = 1.3) => { if (T >= t && T < t + d) st.nod = Math.sin((T - t) * 5) > .3; };
  if (T >= tm.S + .35 && T < tm.W - .1) st.eye = 1;
  if (T >= tm.W + .6 && T < tm.O - .2) { st.eye = T < tm.p2a - .2 ? -1 : 1; if (T >= tm.wErr) st.sweat = T - tm.wErr; }
  if (T >= tm.wErr + .4 && T < tm.wErr + 2) st.q = qk(T, tm.wErr + .4, 1.6);
  nod(tm.fillR);
  tm.pT.forEach((t, i) => { if (T >= t && T < t + .9) st.eye = Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 7) > .2 ? 1 : Math.cos(-Math.PI / 2 + i * 2 * Math.PI / 7) < -.2 ? -1 : 0; });
  if (T >= tm.hk && T < tm.cx) st.eye = -1;
  if (T >= tm.cx && T < tm.E - .2) st.eye = 1;
  if (T >= tm.E + .5 && T < tm.Om - .2) st.eye = 1;
  if ((T > tm.d1a && T < tm.d1b) || (T > tm.d2a && T < tm.d2b) || (T > tm.fixA && T < tm.fixB)) st.pose = 'push';
  if (T >= tm.fixB && T < tm.fixB + .9) { st.pose = 'up'; st.y -= Math.sin(Math.PI * (T - tm.fixB) / .9) * 14; }
  if (T >= tm.Om + .5 && T < tm.L - .2) st.eye = -1;
  nod(tm.merge + .6);
  if (T >= tm.L + .5 && T < tm.Ra - .2) { st.eye = 1; if (T >= tm.red) st.sweat = T - tm.red; }
  if (T >= tm.rung[5] + .35 && T < tm.rung[5] + 1.2) st.pose = 'up';
  if (T >= tm.Ra + .5 && T < tm.K - .2) { st.eye = -1; if (T >= tm.redT[0] && T < tm.vis) st.sweat = T - tm.redT[0]; }
  nod(tm.priv + .2);
  if (T >= tm.K + .5 && T < tm.Ad - .2) st.eye = -1;
  nod(tm.items[3]); nod(tm.items[6] + .4);
  tm.adTag.forEach(t => { if (T >= t - .1 && T < t + .9) st.pose = 'point'; });
  if (T >= tm.Fg + .5) st.eye = 1;
  if (T >= tm.grab - .1 && T < tm.tear) st.pose = 'push';
  if (T >= tm.tear + .5) st.sweat = T - tm.tear;
  return st;
}

// ---------- 演员层：另一个 Clawd 和标签 ----------
function over(ctx, T, pl) {
  const { tm } = pl, end = pl.end || tm.Fg + 7.5;
  ctx.textBaseline = 'middle';
  if (T < tm.clone || T >= end) return;
  const cs = clone(T, pl);
  ctx.save(); ctx.translate(cs.x, 0); ctx.scale(-1, 1); ctx.translate(-cs.x, 0); drawClawd(ctx, cs); ctx.restore();
  const k = prog(T, tm.tagsF, tm.tagsF + .4, MOTION.pop) * (1 - prog(T, tm.grab - .5, tm.grab - .2));
  if (k > .01) {
    const st = clawd(T, pl);
    chip(ctx, 'Agent 1', st.x, st.y - 8 * st.px - 44, k, COL.clawd, font(600, 24, MONO), COL.card);
    chip(ctx, 'Agent 2', cs.x, cs.y - 8 * cs.px - 44, k, COL.clawd, font(600, 24, MONO), COL.card);
  }
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.W - .6, tm.W, Easing.linear);
  let gl = 0;
  const sp = (t, a, d) => { if (T >= t) gl = Math.max(gl, a * Math.exp(-(T - t) * d)); };
  sp(tm.wErr, .4, 6); sp(tm.red, .4, 5); sp(tm.redT[0], .25, 6); sp(tm.tear, .5, 5);
  let rays = 0, light = [.5, .44];
  if (T < tm.W) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T >= tm.O && T < tm.E) { rays = .4 * bump(T, tm.ringL + .2, .5) + .3 * bump(T, tm.fillR + .3, .5); light = [CX / 1920, CY / 1080]; }
  else if (T >= tm.G && T < tm.Om) { rays = .4 * bump(T, tm.fixB + .2, .5); light = [1670 / 1920, LY[1] / 1080]; }
  else if (T >= tm.K && T < tm.Ad) { rays = .3 * bump(T, tm.items[6] + .4, .5); light = [940 / 1920, 500 / 1080]; }
  else if (T >= tm.Fg) { rays = .4 * bump(T, tm.tear + .1, .4); light = [FD.cx / 1920, FD.cy / 1080]; }
  return { gl, rays, light,
    energy: lerp(.38, 1, card) + .15 * bump(T, tm.fixB, .6),
    warm: .15 + .3 * bump(T, tm.wErr + .3, .6) + .5 * prog(T, tm.red, tm.red + .5) * (1 - prog(T, tm.Ra - .4, tm.Ra)) + .3 * bump(T, tm.redT[3], .8) + .3 * bump(T, tm.tear + .2, .6),
    floor: Math.max(.65 * card, .8 * prog(T, tm.split, tm.split + 1) * (1 - prog(T, tm.Om - .4, tm.Om)), .6 * prog(T, tm.L, tm.L + 1) * (1 - prog(T, tm.Ra - .4, tm.Ra))) };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"06 章节卡 · 怪事 · 外层 · 部件":[["06 章节卡",3.5],["06 怪事",8.5],["06 外层",6],["06 部件",17.5]],"06 发动机 · 成绩 · 其他模型":[["06 发动机",9],["06 成绩",11.5],["06 其他模型",9.5]],"06 梯子 · RedAccess":[["06 梯子",16.5],["06 RedAccess",16.5]],"06 七项 · 建议 · 打架":[["06 七项",11.5],["06 建议",10],["06 打架",7.5]]};

return { plan, scene, clawd, fx, over, parts: TL_PARTS };
};
