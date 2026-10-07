// 第 5 章　选模型和费用
(window.VC_CH = window.VC_CH || {})[5] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, hash, mixC, rgba, heat, blink, drawTyped, popScale, dotsFor, jumpPos, drawClawd } = V;
const { Easing, clamp } = window;
const N = ['05 章节卡', '05 额度', '05 重发', '05 赛跑', '05 算账', '05 三档', '05 思考强度', '05 预算', '05 排行榜', '05 国内', '05 换模型', '05 免费版'];
const F = 846;
const C0 = [560, 720, 22], CQ = [1640, F, 11], CRh = [900, F, 11], CRm = [1280, F, 11], CA = [1720, F, 10], CRc = [870, F, 11], CTk = [1640, F, 11],
  CT = [[480, F, 11], [960, F, 11], [1440, F, 11]], CTh = [960, F, 12], CBd = [960, F, 11], CLb = [1600, F, 10], CLb2 = [960, F, 11], CCn = [960, F, 11],
  CSw = [760, F, 11], CSw2 = [910, F, 11], CFr = [300, F, 11], B0 = [2040, F, 11], B1 = [1300, F, 11], B2 = [1020, F, 11];
const QT = { x: 560, y: 220, w: 640, h: 120 }, QM = { x: 560, y: 480, w: 900, h: 72 };
const CW = { x: 200, y: 190, w: 580, h: 560 }, MB = { x: 1460, y: 250, w: 300, h: 180 };
const ROUNDS = [['你', '加个登录功能'], ['我', '读了 UserService.java'], ['你', '测试没过，再改改'], ['我', '改了 PasswordUtil'], ['你', '再跑一次测试']];
const rowY = r => CW.y + 130 + r * 88;
const LN = [{ y: 330, name: '模型 A', tag: '单价低', c: COL.str, lap: .72, n: 9, seg: 75 }, { y: 650, name: '模型 B', tag: '单价高', c: COL.num, lap: 2.3, n: 2, seg: 300 }];
const RX = 450, RR = 92, BX0 = 620, XB = BX0 + 600;
const TG = { x: 220, y: 330, w: 480, h: 230 }, RP = { x: 1000, y: 190, w: 580, h: 600 };
const RL = [['读文件 × 几十个', 110], ['跑命令 × 很多轮', 130], ['改代码、跑测试', 80], ['失败了，再来几轮', 100]];
const TKE = ['add', ' a', ' login', ' method'], TKZ = ['加', '个', '登录', '功能'], TKC = [COL.fn, COL.type, COL.num, COL.kw];
const TC = [{ x: 270, c: COL.kw, n: '旗舰', m: [3, 1, 3], t: ['架构设计', '难查的 bug', '长时间自主跑'] }, { x: 750, c: COL.fn, n: '主力', m: [2, 2, 2], t: ['日常写功能'] },
  { x: 1230, c: COL.str, n: '轻量', m: [1, 3, 1], t: ['补全代码', '改格式', '简单重命名'] }];
const ML = ['能力', '速度', '价格'], CDW = 420, CDY = 210, CDH = 500;
const SL = { x0: 560, x1: 1360, y: 470 };
const BP = [{ x: 300, n: '订阅制' }, { x: 1040, n: '按量付费 API' }], BPW = 580, BPY = 220, BPH = 480, BB = 640;
const BW = { x: 300, y: 200, w: 1000, h: 470 }, TB = { x: 1420, y: 520, w: 320, h: 150 };
const MODELS = ['模型 A', '模型 B', '模型 C', '模型 D'], S1 = [.92, .84, .77, .69], S2 = [.71, .9, .82, .66], RK2 = [2, 0, 1, 3];
const SLX = [560, 960, 1360], RES = [[1, '测试通过', COL.str], [0, '测试没过', COL.err], [1, '测试通过', COL.str]];
const NAMES = ['通义千问', '智谱 GLM', 'Kimi', 'DeepSeek'], NX0 = 216, NCW = 330, NCG = 36, NY = 360, NCH = 170;
const SWn = { x: 520, y: 190, w: 880, h: 360 };
const FS = { x: 460, y: 190, w: 1000, h: 250 }, FL = { x: 520, y: 590, w: 320, h: 130 }, FT = { x: 1080, y: 590, w: 320, h: 130 };
const FR = [['课程练习', '一般没关系', COL.str, 1], ['实习 · 公司代码', '按公司规定来', COL.kw, 0]];
const BUDHI = mixC(COL.type, '#ffffff', .35);
const qk = (T, t0, d) => clamp(Math.min((T - t0) * 4, (t0 + d - T) * 5), 0, 1);
const fio = (T, a, b, i = .4, o = .5) => prog(T, a, a + i) * (1 - prog(T, b - o, b));

function plan(C) {
  if (C[N[0]] === undefined) return null;
  const [S, Q, Rs, Ac, Rc, Tr, Th, Bd, Lb, Cn, Sw, Fr] = N.map(n => C[n]);
  const go = Ac + 1.4, fill1 = Bd + 3.2;
  const tm = { S, Q, Rs, Ac, Rc, Tr, Th, Bd, Lb, Cn, Sw, Fr,
    dots: S + .5,
    task: Q + .3, drain0: Q + .9, drain1: Q + 4.6, low: Q + 3.6, qm: Q + 4.9,
    rT: [0, 1, 2, 3, 4].map(r => Rs + .9 + r * 1.3),
    lanes: Ac + .4, go, bDone: go + 2 * 2.3, pass: go + 8 * .72, aDone: go + 9 * .72,
    tag: Rc + .4, rcp: Rc + .9, rl: [Rc + 1.5, Rc + 1.9, Rc + 2.3, Rc + 2.7], tot: Rc + 3.3, dimTag: Rc + 4.2, tok: Rc + 6, split1: Rc + 9.6, split2: Rc + 10.8,
    cards: [Tr + 2.6, Tr + 2.9, Tr + 3.2], tj: [Tr + 3.6, Tr + 9.4, Tr + 11.9], mT: [Tr + 4, Tr + 9.9, Tr + 12.2],
    cT: [[Tr + 6.2, Tr + 7.1, Tr + 8.1], [Tr + 11], [Tr + 13.3, Tr + 14.1, Tr + 14.8]],
    sl: Th + .5, hard: Th + 2.8, up: Th + 3.1, mech: Th + 4.1, down: Th + 4.8, save: [Th + 6, Th + 6.5],
    subP: Bd + .3, fill0: Bd + .7, cap: Bd + 1.9, apiP: Bd + 2.4, fill1, alert: fill1 + 2 * 190 / 290,
    board: Lb + .4, tab2: Lb + 3.4, bin: Lb + 5.4, qf: [Lb + 5.9, Lb + 6.2, Lb + 6.5], dimB: Lb + 7.4, p2: Lb + 8.4, task2: Lb + 8.8, wire: Lb + 11, res: [Lb + 12.2, Lb + 12.6, Lb + 13],
    nT: [Cn + 1.9, Cn + 2.8, Cn + 3.6, Cn + 4.2], deng: Cn + 4.9, tagT: Cn + 5.5,
    swin: Sw + .3, err: Sw + .9, swap: Sw + 1.8, resend: Sw + 2.5, bIn: Sw + 3, hf: Sw + 5,
    fwin: Fr + .3, flow: Fr + 1, ring: Fr + 4, tOff: Fr + 4.7, p2f: Fr + 5.6, rowT: [Fr + 5.9, Fr + 8],
  };
  const ty = {
    chName: { s: S + 1.3, cps: 10, text: '选模型和费用' },
    tkH: { s: Rc + 6.4, cps: 20, text: '// token' },
    en: { s: Rc + 6.7, cps: 16, text: 'add a login method' },
    zh: { s: Rc + 8, cps: 10, text: '加个登录功能' },
    trH: { s: Tr + .5, cps: 18, text: '// 按活儿选模型' },
    thH: { s: Th + .4, cps: 18, text: '// 思考强度' },
    cnH: { s: Cn + .5, cps: 18, text: '// 国内能直接用' },
  };
  const caps = [
    [Q + .2, Q + 4.8, '登录功能才写到一半，这个月的额度已经快见底了。'],
    [Q + 4.8, Q + 6.8, '钱都花哪儿了？'],
    [Rs + .2, Rs + 4.6, '每一轮对话，之前的内容都会重新发给模型一遍，'],
    [Rs + 4.6, Rs + 7.6, '所以对话越长，每一轮越贵。'],
    [Ac + .2, Ac + 4.4, 'Agent 做一个任务，可能要读几十个文件、跑很多轮。'],
    [Ac + 4.4, Ac + 9.6, '单价便宜的模型要是多绕几圈，总价反而可能更高。'],
    [Rc + .2, Rc + 6, '所以算账要算完成一个任务花了多少，别只盯着每百万 token 的单价。'],
    [Rc + 6, Rc + 12.2, 'token 是模型计费和计算长度的单位，大约一个词或一两个汉字。'],
    [Tr + .2, Tr + 2.4, '选模型也要看活儿。'],
    [Tr + 2.4, Tr + 5.6, '大致分三档：旗舰最强，也最慢最贵，'],
    [Tr + 5.6, Tr + 9.6, '留给架构设计、难查的 bug、长时间自主跑的任务。'],
    [Tr + 9.6, Tr + 12, '主力档负责日常写功能；'],
    [Tr + 12, Tr + 15.8, '轻量档负责补全代码、改格式、简单重命名。'],
    [Th + .2, Th + 7.3, '很多模型还能调思考强度：难题调高，机械性的修改调低，省时间也省钱。'],
    [Bd + .2, Bd + 2.2, '订阅制有用量上限；'],
    [Bd + 2.2, Bd + 6, '按量付费的 API 记得设个预算提醒。'],
    [Lb + .2, Lb + 2.4, '排行榜看看就好。'],
    [Lb + 2.4, Lb + 5.2, '分数受测试时用的工具影响，'],
    [Lb + 5.2, Lb + 8.4, '公开题目也可能混进了训练数据。'],
    [Lb + 8.4, Lb + 13.8, '最靠谱的办法是拿你自己的真实任务，试两三个模型。'],
    [Cn + .2, Cn + 7, '国内能直接用的有通义千问、智谱 GLM、Kimi、DeepSeek 等，都有面向编程的套餐。'],
    [Sw + .2, Sw + 4.8, '卡住的时候，换个模型再问一遍，这是很正常的排查办法。'],
    [Sw + 4.8, Sw + 7.3, '放心，我不会介意。'],
    [Fr + .2, Fr + 5.6, '还有，免费版本可能会拿你的数据去训练，记得看清设置。'],
    [Fr + 5.6, Fr + 11.2, '课程练习一般没关系，实习和公司代码按公司规定来。'],
  ].map(([at, until, text]) => ({ at, until, text }));
  const cam = [
    [S + .2, 1.32, .08, 0, 0, 0, 0], [S + 2.2, 1.58, .12, .03, 0, 0, 0],
    [Q + .8, 1.5, -.06, .03, 0, 0, 0], [Q + 4.6, 1.42, -.08, .04, 0, .04, 0], [Q + 6.8, 1.44, -.06, .04, 0, .02, 0],
    [Rs + .8, 1.52, .06, .03, 0, 0, 0], [Rs + 7.6, 1.46, .1, .03, 0, .04, 0],
    [Ac + .8, 1.56, .12, .06, 0, 0, .02], [Ac + 6, 1.46, .06, .05, 0, .04, .02], [Ac + 9.6, 1.48, .1, .06, 0, .02, .02],
    [Rc + .8, 1.52, -.04, .03, 0, 0, 0], [Rc + 5.6, 1.48, -.06, .03, 0, .04, 0], [Rc + 6.6, 1.54, .04, .02, 0, -.04, 0], [Rc + 12.2, 1.5, .06, .03, 0, -.02, 0],
    [Tr + .8, 1.62, 0, .05, 0, 0, .02], [Tr + 3.8, 1.54, -.06, .05, 0, -.14, .02], [Tr + 9.8, 1.54, 0, .05, 0, 0, .02], [Tr + 12.2, 1.54, .06, .05, 0, .14, .02], [Tr + 15.6, 1.58, .04, .04, 0, .04, .02],
    [Th + .8, 1.5, .04, .03, 0, 0, 0], [Th + 7.2, 1.46, -.04, .03, 0, 0, 0],
    [Bd + .8, 1.52, -.04, .03, 0, -.06, 0], [Bd + 2.6, 1.5, .04, .03, 0, .06, 0], [Bd + 5.8, 1.5, .06, .03, 0, .06, 0],
    [Lb + .8, 1.5, -.04, .03, 0, -.04, 0], [Lb + 5.4, 1.5, .04, .03, 0, .06, 0], [Lb + 8.8, 1.56, .02, .05, 0, 0, .02], [Lb + 13.6, 1.5, .06, .05, 0, 0, .02],
    [Cn + .8, 1.56, -.04, .03, 0, 0, 0], [Cn + 6.8, 1.52, .04, .03, 0, 0, 0],
    [Sw + .8, 1.5, .04, .03, 0, 0, 0], [Sw + 4.6, 1.48, .02, .04, 0, -.02, -.01], [Sw + 7.2, 1.5, -.02, .03, 0, 0, 0],
    [Fr + .8, 1.52, -.04, .03, 0, 0, 0], [Fr + 5.6, 1.5, .04, .03, 0, 0, 0], [Fr + 11, 1.5, .06, .03, 0, 0, 0],
  ];
  const sfx = [[S - .55, 'jump'], [tm.dots, 'sparkle'],
    [Q - .1, 'jump'], [tm.task, 'on'], [tm.drain0, 'sweep'], ...Array.from({ length: 9 }, (_, i) => [tm.drain0 + i * .42, 'pix']), [tm.low, 'buzz'], [tm.low, 'glitch'], [tm.qm, 'blip'],
    [Rs - .2, 'jump'], [Rs + .3, 'on'], ...tm.rT.flatMap(t => [[t - .45, 'pix'], [t, 'whoosh'], [t + .4, 'jump'], [t + .85, 'whoosh'], [t + .88, 'jump'], [t + 1.05, 'thump']]),
    [Ac - .2, 'jump'], [tm.lanes, 'sweep'], [go, 'on'], ...Array.from({ length: 9 }, (_, i) => [go + (i + 1) * .72, 'blip']), [go + 2.3, 'on'], [tm.bDone, 'ping'], [tm.pass, 'glitch'], [tm.pass, 'thump'], [tm.aDone, 'buzz'],
    [Rc - .2, 'jump'], [tm.tag, 'on'], [tm.rcp, 'page'], ...tm.rl.map(t => [t, 'pix']), [tm.tot, 'ping'], [tm.dimTag, 'sweep'], [tm.tok, 'jump'],
    ...[0, 1, 2, 3].flatMap(i => [[tm.split1 + i * .08, 'snip'], [tm.split2 + i * .08, 'snip']]),
    [Tr - .2, 'jump'], ...tm.cards.map(t => [t, 'assemble']), ...tm.tj.map(t => [t, 'jump']), ...tm.mT.map(t => [t, 'blip']), ...tm.cT.flat().map(t => [t, 'on']),
    [Th - .2, 'jump'], [tm.sl, 'sweep'], [tm.hard, 'on'], [tm.up, 'sweep'], [tm.mech, 'on'], [tm.down, 'sweep'], ...tm.save.map(t => [t, 'ping']),
    [Bd - .2, 'jump'], [tm.subP, 'on'], [tm.fill0, 'sweep'], [tm.cap, 'thump'], [tm.apiP, 'on'], [tm.fill1, 'sweep'], [tm.alert, 'ping'], [tm.alert + .25, 'ping'],
    [Lb - .2, 'jump'], [tm.board, 'on'], ...[0, 1, 2, 3].map(j => [tm.board + .2 + j * .15, 'pix']), [tm.tab2, 'blip'], [tm.tab2 + .1, 'whoosh'], [tm.bin, 'on'], ...tm.qf.flatMap(t => [[t, 'whoosh'], [t + .55, 'pix']]),
    [tm.p2, 'jump'], [tm.task2, 'assemble'], ...[0, 1, 2].map(i => [tm.wire + i * .2, 'on']), [tm.res[0], 'ping'], [tm.res[1], 'buzz'], [tm.res[2], 'ping'],
    [Cn - .2, 'jump'], ...tm.nT.map(t => [t, 'on']), [tm.deng, 'blip'], ...[0, 1, 2, 3].map(i => [tm.tagT + i * .15, 'pix']),
    [Sw - .2, 'jump'], [tm.swin, 'on'], [tm.err, 'buzz'], [tm.swap, 'blip'], [tm.swap + .1, 'page'], [tm.resend, 'on'], [tm.bIn, 'jump'], [tm.hf - .4, 'jump'], [tm.hf, 'hi'], [tm.hf, 'sparkle'], [tm.hf, 'thump'],
    [Fr - .2, 'jump'], [tm.fwin, 'on'], [tm.flow, 'sweep'], [tm.ring, 'ping'], [tm.tOff, 'blip'], [tm.tOff + .05, 'sweep'], ...tm.rowT.flatMap(t => [[t, 'on'], [t + .6, 'ping']])];
  const text = [...ROUNDS.flat(), ...LN.flatMap(l => [l.name, l.tag]), ...RL.map(r => r[0]), ...TC.flatMap(c => [c.n, ...c.t]), ...ML, ...MODELS, ...NAMES, ...RES.map(r => r[1]), ...FR.flatMap(r => [r[0], r[1]]),
    '第 5 章 task 登录功能写到一半本月额度快见底了对话第轮模型每轮费用圈数总价示意完成反超单价每百万 token 完成一个任务≈一个词一两个汉字低高难题机械性的修改省时间省钱用量上限预算提醒排行榜·公开题目工具 12 训练数据题目你自己的真实任务：编程套餐等你还是报错卡住了同一个问题，再问一遍设置免费版用我的数据改进模型开关你的代码模型训练',
    ...Object.values(ty).map(d => d.text)].join('');
  return { start: S, actorFrom: S - .55, tm, ty, caps, cam, sfx, text,
    bounds: [[S, 'dis'], [Ac, 'fluid'], [Tr, 'dis'], [Lb, 'fluid'], [Fr, 'dis']],
    rips: [[tm.pass, XB / 1920, LN[0].y / 1080], [tm.cap, (BP[0].x + BPW / 2) / 1920, (BB - 250) / 1080], [tm.hf, 965 / 1920, 760 / 1080]],
    shakes: [[tm.pass, .008], [tm.cap, .006]],
    quiet: [[tm.qm - .1, Q + 6.8]], lp: [],
    hud: { num: '05', name: '选模型和费用', from: Q + .3, srcs: [] },
  };
}

// ---------- 小工具 ----------
function box(ctx, x, y, w, h, fill, stroke, lw = 2, r = 14, dash) {
  if (h < .5 || w < .5) return;
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; if (dash) ctx.setLineDash(dash);
  ctx.beginPath(); ctx.roundRect(x, y, w, Math.max(0, h), Math.min(r, Math.abs(h) / 2, Math.abs(w) / 2)); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
}
function win(ctx, x, y, w, h, title, tc) {
  box(ctx, x, y, w, h, COL.card, COL.line, 2, 16);
  ctx.fillStyle = COL.line; ctx.fillRect(x, y + 54, w, 1.5);
  for (let i = 0; i < 3; i++) { ctx.fillStyle = COL.faint; ctx.beginPath(); ctx.arc(x + 28 + i * 20, y + 27, 6, 0, 6.283); ctx.fill(); }
  ctx.font = font(500, 24); ctx.fillStyle = tc; ctx.textAlign = 'left'; ctx.fillText(title, x + 100, y + 28);
}
function check(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .7); ctx.stroke(); }
function cross(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke(); }
function chip(ctx, s, cx, cy, k, c, f = font(600, 26), fill = COL.bg) {
  if (k <= 0) return;
  ctx.font = f; const w = ctx.measureText(s).width + 44;
  popScale(ctx, cx, cy, k, () => { box(ctx, cx - w / 2, cy - 24, w, 48, fill, c, 2.5, 24); ctx.font = f; ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, cx, cy + 1); ctx.textAlign = 'left'; });
}
const chipW = (ctx, s, f) => { ctx.font = f; return ctx.measureText(s).width + 44; };
function pixIn(ctx, x, y, w, h, k, c) {
  const nx = Math.round(w / 20), ny = Math.round(h / 20), cw = w / nx, ch = h / ny;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const hv = hash(i * 13.7 + j * 3.1 + x * .01); if (hv > k) continue;
    ctx.fillStyle = hv > k - .08 ? c : COL.card; ctx.fillRect(x + i * cw, y + j * ch, cw + .5, ch + .5);
  }
}
function arrow(ctx, x1, y, x2, k, c) {
  if (k <= 0) return;
  const x = lerp(x1, x2, k);
  ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x - 6, y); ctx.stroke();
  ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(x + 4, y); ctx.lineTo(x - 14, y - 11); ctx.lineTo(x - 14, y + 11); ctx.fill();
}
function vcurve(ctx, x1, y1, x2, y2, k) {
  if (k <= 0) return;
  const n = Math.max(2, Math.ceil(24 * k)), my = (y1 + y2) / 2;
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = k * i / n, u = 1 - t, x = u * u * u * x1 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x2, y = u * u * u * y1 + 3 * u * u * t * my + 3 * u * t * t * my + t * t * t * y2;
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
}
function bell(ctx, x, y, k, rot) {
  ctx.save(); ctx.translate(x, y - 26); ctx.rotate(rot); ctx.scale(k, k); ctx.translate(0, 26);
  ctx.fillStyle = COL.num;
  ctx.beginPath(); ctx.moveTo(-24, 16); ctx.quadraticCurveTo(-22, -26, 0, -26); ctx.quadraticCurveTo(22, -26, 24, 16); ctx.closePath(); ctx.fill();
  ctx.fillRect(-30, 14, 60, 7);
  ctx.beginPath(); ctx.arc(0, 28, 7, 0, 6.283); ctx.fill(); ctx.beginPath(); ctx.arc(0, -29, 5, 0, 6.283); ctx.fill();
  ctx.restore();
}

// ---------- 章节卡 ----------
function drawCard(ctx, T, pl, fv) {
  const { tm, ty } = pl, kd = prog(T, tm.dots, tm.dots + 1.1, Easing.linear);
  ctx.globalAlpha = prog(T, tm.dots - .2, tm.dots + .3); ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim;
  ctx.fillText('// 第 5 章', 1080, 330); ctx.globalAlpha = 1;
  dotsFor('05', 300, 12, 700, MONO, fv).pts.forEach(([dx, dy], i) => {
    const hv = hash(i * .73);
    if (hv > kd) return;
    ctx.fillStyle = hv > .85 ? COL.num : COL.kw;
    ctx.beginPath(); ctx.arc(1080 + dx, 480 + dy, 4.6, 0, 6.283); ctx.fill();
  });
  ctx.font = font(600, 72); drawTyped(ctx, T, ty.chName, 1080, 650, COL.text, T < tm.Q - .6);
}

// ---------- 额度 ----------
const level = (T, tm) => 1 - .92 * prog(T, tm.drain0, tm.drain1, MOTION.draw);
function drawQuota(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Q, tm.Rs);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  const kt = prog(T, tm.task, tm.task + .45, MOTION.pop);
  if (kt > 0) popScale(ctx, QT.x + QT.w / 2, QT.y + QT.h / 2, kt, () => {
    box(ctx, QT.x, QT.y, QT.w, QT.h, COL.card, COL.num, 2.5, 14);
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.fillText('task', QT.x + 32, QT.y + 34);
    ctx.font = font(600, 38); ctx.fillStyle = COL.text; ctx.fillText('登录功能', QT.x + 32, QT.y + 82);
    const bx = QT.x + 250, bw = QT.w - 282, kp = prog(T, tm.task + .3, tm.task + 1.1, MOTION.draw);
    box(ctx, bx, QT.y + 70, bw, 24, COL.bg, COL.line, 2, 12);
    if (kp > 0) { ctx.fillStyle = COL.fn; ctx.beginPath(); ctx.roundRect(bx + 4, QT.y + 74, (bw - 8) * .5 * kp, 16, 8); ctx.fill(); }
    ctx.font = font(500, 24); ctx.fillStyle = COL.dim; ctx.textAlign = 'right'; ctx.fillText('写到一半', QT.x + QT.w - 32, QT.y + 34); ctx.textAlign = 'left';
  });
  const km = prog(T, tm.task + .5, tm.task + 1);
  if (km > 0) {
    ctx.globalAlpha = a * km;
    ctx.font = font(600, 32); ctx.fillStyle = COL.text; ctx.fillText('本月额度', QM.x, QM.y - 44);
    const L = level(T, tm), lo = T >= tm.low, fl = lo && blink(T * 1.6) ? 1 : 0;
    box(ctx, QM.x, QM.y, QM.w, QM.h, COL.bg, lo ? mixC(COL.line, COL.err, .5 + .5 * fl) : COL.line, 2.5, 12);
    ctx.fillStyle = heat(1 - L); ctx.beginPath(); ctx.roundRect(QM.x + 6, QM.y + 6, (QM.w - 12) * L, QM.h - 12, 8); ctx.fill();
    for (let i = 1; i < 4; i++) { ctx.fillStyle = rgba(COL.bg, .5); ctx.fillRect(QM.x + QM.w * i / 4 - 1, QM.y + 6, 2, QM.h - 12); }
    for (let i = 0; i < 26; i++) {
      const t0 = tm.drain0 + i * .14, k = (T - t0) / .9;
      if (k < 0 || k >= 1) continue;
      const ex = QM.x + 6 + (QM.w - 12) * level(t0, tm), x = ex + (hash(i * 3.3) - .2) * 140 * k, y = QM.y + QM.h / 2 - 20 - 420 * k + 300 * k * k, s = 18;
      ctx.globalAlpha = a * (1 - k); ctx.fillStyle = COL.num; ctx.fillRect(x - s / 2, y - s / 2, s, s);
      ctx.fillStyle = mixC(COL.num, '#ffffff', .5); ctx.fillRect(x - s / 2, y - s / 2, s * .4, s * .4);
    }
    ctx.globalAlpha = a;
    chip(ctx, '快见底了', QM.x + QM.w - 90, QM.y + QM.h + 56, prog(T, tm.low, tm.low + .45, MOTION.pop), COL.err, font(600, 28));
  }
  ctx.restore();
}

// ---------- 重发：对话越长，每轮越贵 ----------
function drawResend(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Rs, tm.Ac);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  win(ctx, CW.x, CW.y, CW.w, CW.h, '对话', COL.dim);
  ROUNDS.forEach(([who, s], r) => {
    const t = tm.rT[r], k = prog(T, t - .45, t - .1, MOTION.pop);
    if (k <= 0) return;
    const y = rowY(r), c = who === '你' ? COL.fn : COL.clawd;
    let hl = 0; for (let j = r; j < 5; j++) hl = Math.max(hl, bump(T, tm.rT[j] + .1, .18));
    ctx.globalAlpha = a * Math.min(1, k * 2);
    popScale(ctx, CW.x + 40, y, Math.min(k, 1.1), () => {
      box(ctx, CW.x + 28, y - 34, CW.w - 56, 68, mixC(COL.card, c, .12 + .25 * hl), mixC(COL.line, c, .5 + .5 * hl), 2 + 2 * hl, 10);
      ctx.font = font(600, 26); ctx.fillStyle = c; ctx.fillText(who, CW.x + 52, y);
      ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.text; ctx.fillText(s, CW.x + 100, y);
      ctx.font = font(400, 20); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText(`第 ${r + 1} 轮`, CW.x + CW.w - 48, y); ctx.textAlign = 'left';
    });
  });
  ctx.globalAlpha = a;
  const km = prog(T, tm.Rs + .3, tm.Rs + .8, MOTION.pop);
  let fl = 0; tm.rT.forEach(t => { fl = Math.max(fl, bump(T, t + 1.08, .14)); });
  if (km > 0) popScale(ctx, MB.x + MB.w / 2, MB.y + MB.h / 2, Math.min(km, 1.1), () => {
    box(ctx, MB.x, MB.y, MB.w, MB.h, mixC(COL.card, COL.kw, .12 + .3 * fl), COL.kw, 3 + 2 * fl, 18);
    ctx.font = font(600, 44); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText('模型', MB.x + MB.w / 2, MB.y + MB.h / 2); ctx.textAlign = 'left';
  });
  ctx.globalAlpha = a * prog(T, tm.Rs + .5, tm.Rs + 1);
  ctx.fillStyle = COL.line; ctx.fillRect(MB.x, 720, MB.w, 2);
  ctx.font = font(500, 26); ctx.fillStyle = COL.dim; ctx.fillText('每轮费用', MB.x, 768);
  tm.rT.forEach((t, r) => {
    const k = prog(T, t + 1.05, t + 1.4, MOTION.pop);
    if (k < .01) return;
    const h = 24 * (r + 1) * Math.min(k, 1.15), c = heat(r / 4);
    box(ctx, MB.x + 20 + r * 56, 718 - h, 38, h, rgba(c, .3), c, 2.5, 5);
  });
  ctx.restore();
}
function pkg(ctx, cx, cy, s, r, al) {
  ctx.save(); ctx.globalAlpha = al;
  box(ctx, cx - s / 2, cy - s / 2, s, s, COL.card, COL.dim, 3, 8);
  const n = r + 1, ih = (s - 16) / n;
  for (let i = 0; i < n; i++) { ctx.fillStyle = rgba(ROUNDS[i][0] === '你' ? COL.fn : COL.clawd, .8); ctx.fillRect(cx - s / 2 + 8, cy - s / 2 + 8 + i * ih, s - 16, Math.max(2, ih - 3)); }
  ctx.restore();
}
function drawPkgs(ctx, T, pl) {
  const { tm } = pl;
  tm.rT.forEach((t, r) => {
    if (T < t || T >= t + 1.12) return;
    const s = 50 + 20 * r, st = clawd(T, pl), hx = st.x, hy = st.y - 8 * st.px * st.squash - s / 2 - 4;
    let x = hx, y = hy, sc = 1, al = 1;
    if (T < t + .35) {
      const k = MOTION.draw((T - t) / .35);
      x = lerp(CW.x + CW.w / 2, hx, k); y = lerp((rowY(0) + rowY(r)) / 2, hy, k) - Math.sin(Math.PI * k) * 90; sc = lerp(.5, 1, k);
    } else if (T >= t + .85) {
      const k = MOTION.enter(Math.min(1, (T - t - .85) / .27)), x0 = CRm[0], y0 = CRm[1] - 8 * CRm[2] - s / 2 - 4;
      x = lerp(x0, MB.x + MB.w / 2, k); y = lerp(y0, MB.y + MB.h / 2, k) - Math.sin(Math.PI * k) * 60; sc = lerp(1, .35, k); al = 1 - k * .7;
    }
    pkg(ctx, x, y, s * sc, r, al);
  });
}

// ---------- 赛跑：单价低但绕圈多 ----------
function drawRace(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Ac, tm.Rc);
  if (a <= 0) return;
  ctx.save();
  ctx.globalAlpha = a * prog(T, tm.lanes, tm.lanes + .5); ctx.font = font(400, 24, MONO); ctx.fillStyle = COL.faint;
  ctx.textAlign = 'center'; ctx.fillText('// 圈数', RX, 190); ctx.textAlign = 'left'; ctx.fillText('// 总价', BX0, 190);
  ctx.font = font(400, 22); ctx.textAlign = 'right'; ctx.fillText('示意', BX0 + 1080, 190); ctx.textAlign = 'left';
  LN.forEach((L, li) => {
    const t0 = tm.lanes + li * .2, kl = prog(T, t0, t0 + .7, MOTION.draw);
    if (kl <= 0) return;
    ctx.globalAlpha = a; ctx.lineCap = 'round';
    ctx.strokeStyle = COL.line; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(RX, L.y, RR, -Math.PI / 2, -Math.PI / 2 + 6.283 * kl); ctx.stroke();
    ctx.globalAlpha = a * kl;
    ctx.font = font(600, 32); ctx.fillStyle = COL.text; ctx.textAlign = 'right'; ctx.fillText(L.name, RX - RR - 44, L.y - 24); ctx.textAlign = 'left';
    const f = font(600, 24), cw = chipW(ctx, L.tag, f);
    chip(ctx, L.tag, RX - RR - 44 - cw / 2, L.y + 28, 1, L.c, f, COL.card);
    box(ctx, BX0, L.y - 34, 760, 68, 'rgba(0,0,0,0)', COL.line, 2, 8, [6, 6]);
    const el = Math.max(0, T - tm.go), laps = Math.min(L.n, el / L.lap), done = laps >= L.n, k = Math.floor(laps), fr = laps - k;
    ctx.globalAlpha = a;
    if (T >= tm.go) {
      const ang = -Math.PI / 2 + 6.283 * (done ? 0 : fr);
      if (!done && fr > 0) { ctx.strokeStyle = L.c; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(RX, L.y, RR, ang - Math.min(fr * 6.283, 1.4), ang); ctx.stroke(); }
      ctx.fillStyle = L.c; ctx.beginPath(); ctx.arc(RX + Math.cos(ang) * RR, L.y + Math.sin(ang) * RR, 15, 0, 6.283); ctx.fill();
    }
    ctx.lineCap = 'butt';
    ctx.font = font(600, 30); ctx.textAlign = 'center'; ctx.fillStyle = T >= tm.go ? COL.text : COL.faint;
    ctx.fillText(`第 ${Math.min(L.n, k + 1)} 圈`, RX, L.y); ctx.textAlign = 'left';
    for (let i = 0; i < Math.ceil(laps - 1e-6); i++) {
      const w = L.seg * (i < k ? 1 : fr);
      if (w < 10) continue;
      const c = li === 0 && i >= 8 ? COL.err : L.c;
      box(ctx, BX0 + i * L.seg + 3, L.y - 26, w - 6, 52, rgba(c, .3), c, 2.5, 6);
    }
    const tD = li ? tm.bDone : tm.aDone;
    chip(ctx, '完成', BX0 + L.n * L.seg + 64, L.y, prog(T, tD, tD + .45, MOTION.pop), COL.str, font(600, 26));
  });
  const kv = prog(T, tm.bDone, tm.bDone + .6, MOTION.draw);
  if (kv > 0) {
    ctx.globalAlpha = a; ctx.strokeStyle = COL.dim; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
    ctx.beginPath(); ctx.moveTo(XB, LN[1].y - 40); ctx.lineTo(XB, lerp(LN[1].y - 40, LN[0].y - 50, kv)); ctx.stroke(); ctx.setLineDash([]);
  }
  ctx.globalAlpha = a;
  chip(ctx, '反超', XB + 38, LN[0].y - 76, prog(T, tm.pass, tm.pass + .45, MOTION.pop), COL.err, font(600, 28));
  ctx.restore();
}

// ---------- 算账：单价 vs 完成一个任务 ----------
function drawReceipt(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Rc, tm.tok + .2, .4, .6);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    const kt = prog(T, tm.tag, tm.tag + .45, MOTION.pop), dm = prog(T, tm.dimTag, tm.dimTag + .6);
    if (kt > 0) popScale(ctx, TG.x + TG.w / 2, TG.y + TG.h / 2, kt * lerp(1, .88, dm), () => {
      const { x, y, w, h } = TG;
      ctx.globalAlpha = a * lerp(1, .4, dm);
      ctx.fillStyle = COL.card; ctx.strokeStyle = COL.num; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + 70, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h); ctx.lineTo(x + 70, y + h); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = COL.bg; ctx.beginPath(); ctx.arc(x + 56, y + h / 2, 14, 0, 6.283); ctx.fill(); ctx.stroke();
      ctx.font = font(600, 60); ctx.fillStyle = COL.text; ctx.fillText('单价', x + 110, y + 82);
      ctx.font = font(400, 30, MONO); ctx.fillStyle = COL.dim; ctx.fillText('每百万 token', x + 110, y + 160);
    });
    ctx.globalAlpha = a;
    const kr = prog(T, tm.rcp, tm.rcp + .8, MOTION.draw);
    if (kr > 0) {
      const { x, y, w } = RP, h = RP.h * kr, tooth = 20;
      ctx.save();
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + h);
      for (let i = w / tooth - 1; i >= 0; i--) { ctx.lineTo(x + i * tooth + tooth / 2, y + h - 12); ctx.lineTo(x + i * tooth, y + h); }
      ctx.closePath(); ctx.fillStyle = COL.card; ctx.fill(); ctx.strokeStyle = COL.line; ctx.lineWidth = 2; ctx.stroke(); ctx.clip();
      ctx.font = font(600, 36); ctx.fillStyle = COL.text; ctx.fillText('完成一个任务', x + 40, y + 60);
      ctx.font = font(400, 24); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('登录功能', x + w - 40, y + 60); ctx.textAlign = 'left';
      ctx.strokeStyle = COL.line; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(x + 30, y + 104); ctx.lineTo(x + w - 30, y + 104); ctx.stroke(); ctx.setLineDash([]);
      RL.forEach(([s, bw], i) => {
        const k = prog(T, tm.rl[i], tm.rl[i] + .3);
        if (k <= 0) return;
        const ly = y + 160 + i * 72;
        ctx.globalAlpha = a * k; ctx.font = font(500, 30); ctx.fillStyle = COL.text; ctx.fillText(s, x + 40, ly);
        ctx.fillStyle = rgba(COL.dim, .5); ctx.beginPath(); ctx.roundRect(x + w - 40 - bw * k, ly - 7, bw * k, 14, 7); ctx.fill();
      });
      const kk = prog(T, tm.tot, tm.tot + .4), pu = bump(T, tm.tot + .3, .35);
      if (kk > 0) {
        ctx.globalAlpha = a * kk;
        ctx.fillStyle = COL.line; ctx.fillRect(x + 30, y + 446, w - 60, 2); ctx.fillRect(x + 30, y + 452, w - 60, 2);
        ctx.fillStyle = rgba(COL.str, .12 + .2 * pu); ctx.fillRect(x + 20, y + 470, w - 40, 84);
        ctx.font = font(700, 44); ctx.fillStyle = COL.str; ctx.fillText('总价', x + 40, y + 512);
        ctx.beginPath(); ctx.roundRect(x + w - 40 - 240 * kk, y + 503, 240 * kk, 18, 9); ctx.fill();
      }
      ctx.restore();
    }
    ctx.restore();
  }
  if (T >= tm.tok) drawTok(ctx, T, pl);
}
function tokRow(ctx, T, d, toks, f, x, y, k, label, a) {
  ctx.font = f;
  if (k <= 0) { drawTyped(ctx, T, d, x, y, COL.text, T >= d.s, COL.kw); return; }
  let pre = '';
  toks.forEach((s, i) => {
    ctx.font = f;
    const bx = x + ctx.measureText(pre).width + i * 30 * k, lead = ctx.measureText(s.slice(0, s.length - s.trimStart().length)).width, tw = ctx.measureText(s).width, c = TKC[i % 4];
    ctx.globalAlpha = a * k; box(ctx, bx + lead - 14, y - 48, tw - lead + 28, 96, rgba(c, .16), c, 2.5, 10);
    ctx.globalAlpha = a; ctx.font = f; ctx.fillStyle = mixC(COL.text, c, .35 * k); ctx.fillText(s, bx, y);
    pre += s;
  });
  ctx.globalAlpha = a * k; ctx.font = font(500, 30); ctx.fillStyle = COL.dim; ctx.fillText(label, x, y + 100);
  ctx.globalAlpha = a;
}
function drawTok(ctx, T, pl) {
  const { tm, ty } = pl, a = prog(T, tm.tok + .2, tm.tok + .6) * (1 - prog(T, tm.Tr - .5, tm.Tr));
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(400, 30, MONO); drawTyped(ctx, T, ty.tkH, 340, 250, COL.faint, false);
  ctx.font = font(400, 22); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('示意', 1580, 250); ctx.textAlign = 'left';
  tokRow(ctx, T, ty.en, TKE, font(600, 66, MONO), 340, 420, prog(T, tm.split1, tm.split1 + .6, MOTION.draw), '≈ 一个词一个 token', a);
  tokRow(ctx, T, ty.zh, TKZ, font(600, 66), 340, 660, prog(T, tm.split2, tm.split2 + .6, MOTION.draw), '≈ 一两个汉字一个 token', a);
  ctx.restore();
}

// ---------- 三档 ----------
function drawTiers(ctx, T, pl) {
  const { tm, ty } = pl, a = fio(T, tm.Tr, tm.Th);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(400, 28, MONO); drawTyped(ctx, T, ty.trH, 270, 160, COL.faint, false);
  const pre = 1 - prog(T, tm.mT[0] - .2, tm.mT[0] + .2);
  TC.forEach((cd, i) => {
    const k = prog(T, tm.cards[i], tm.cards[i] + .8, Easing.linear);
    if (k <= 0) return;
    const { x } = cd, y = CDY;
    ctx.globalAlpha = a;
    if (k < 1) { pixIn(ctx, x, y, CDW, CDH, k, cd.c); return; }
    const s0 = tm.mT[i] - .2, e0 = i < 2 ? tm.mT[i + 1] - .2 : 1e9, wi = prog(T, s0, s0 + .4) * (1 - prog(T, e0, e0 + .4)), fo = Math.max(pre, .45 + .55 * wi);
    ctx.globalAlpha = a * fo;
    box(ctx, x, y, CDW, CDH, COL.card, mixC(COL.line, cd.c, .35 + .65 * wi), 2.5 + 1.5 * wi, 16);
    ctx.font = font(600, 50); ctx.fillStyle = cd.c; ctx.fillText(cd.n, x + 36, y + 64);
    ML.forEach((lb, j) => {
      const tj = tm.mT[i] + (i === 0 ? [0, .9, 1.3][j] : j * .15), kj = prog(T, tj, tj + .3), ly = y + 146 + j * 54;
      ctx.font = font(500, 28); ctx.fillStyle = COL.dim; ctx.fillText(lb, x + 36, ly);
      for (let q = 0; q < 3; q++) { const full = q < cd.m[j] && kj > q / 3; box(ctx, x + 130 + q * 40, ly - 13, 26, 26, full ? cd.c : COL.bg, full ? cd.c : COL.line, 2, 5); }
    });
    ctx.fillStyle = COL.line; ctx.fillRect(x + 36, y + 290, CDW - 72, 2);
    cd.t.forEach((s, j) => {
      const kc = prog(T, tm.cT[i][j], tm.cT[i][j] + .45, MOTION.pop);
      if (kc <= 0) return;
      const f = font(500, 28), w = chipW(ctx, s, f), cy = y + 346 + j * 60;
      popScale(ctx, x + 36 + w / 2, cy, kc, () => { box(ctx, x + 36, cy - 25, w, 50, rgba(cd.c, .12), cd.c, 2, 25); ctx.font = f; ctx.fillStyle = COL.text; ctx.fillText(s, x + 58, cy + 1); });
    });
  });
  ctx.restore();
}

// ---------- 思考强度 ----------
const thinkV = (T, tm) => lerp(lerp(.45, 1, prog(T, tm.up, tm.up + .6, MOTION.draw)), .1, prog(T, tm.down, tm.down + .6, MOTION.draw));
function drawThink(ctx, T, pl) {
  const { tm, ty } = pl, a = fio(T, tm.Th, tm.Bd);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(400, 28, MONO); drawTyped(ctx, T, ty.thH, SL.x0, 400, COL.faint, false);
  const kl = prog(T, tm.sl, tm.sl + .8, MOTION.draw), v = thinkV(T, tm), hx = lerp(SL.x0, SL.x1, v);
  ctx.fillStyle = COL.line; ctx.beginPath(); ctx.roundRect(SL.x0, SL.y - 6, (SL.x1 - SL.x0) * kl, 12, 6); ctx.fill();
  if (kl >= 1) {
    ctx.fillStyle = COL.kw; ctx.beginPath(); ctx.roundRect(SL.x0, SL.y - 6, hx - SL.x0, 12, 6); ctx.fill();
    ctx.fillStyle = COL.bg; ctx.beginPath(); ctx.arc(hx, SL.y, 30, 0, 6.283); ctx.fill();
    ctx.fillStyle = COL.kw; ctx.beginPath(); ctx.arc(hx, SL.y, 22, 0, 6.283); ctx.fill();
  }
  ctx.globalAlpha = a * kl; ctx.font = font(500, 32); ctx.textAlign = 'center'; ctx.fillStyle = COL.dim;
  ctx.fillText('低', SL.x0, SL.y + 66); ctx.fillText('高', SL.x1, SL.y + 66); ctx.textAlign = 'left';
  ctx.globalAlpha = a;
  chip(ctx, '难题', 960, 300, prog(T, tm.hard, tm.hard + .45, MOTION.pop) * (1 - prog(T, tm.mech - .25, tm.mech)), COL.num, font(600, 32));
  chip(ctx, '机械性的修改', 960, 300, prog(T, tm.mech, tm.mech + .45, MOTION.pop), COL.type, font(600, 32));
  chip(ctx, '省时间', 1290, 660, prog(T, tm.save[0], tm.save[0] + .45, MOTION.pop), COL.str, font(600, 30));
  chip(ctx, '省钱', 1460, 660, prog(T, tm.save[1], tm.save[1] + .45, MOTION.pop), COL.str, font(600, 30));
  ctx.restore();
}
function drawBubble(ctx, T, pl) {
  const { tm } = pl, a = prog(T, tm.sl, tm.sl + .4) * (1 - prog(T, tm.Bd - .5, tm.Bd));
  if (a <= 0) return;
  const st = clawd(T, pl), v = thinkV(T, tm), n = Math.max(2, Math.round(2 + 10 * v)), w = 44 + n * 22, cx = st.x + 30, cy = st.y - 8 * st.px - 74;
  ctx.save(); ctx.globalAlpha = a;
  box(ctx, cx - w / 2, cy - 30, w, 60, COL.card, COL.dim, 2, 30);
  for (const [ox, oy, r] of [[-8, 44, 9], [-22, 62, 5]]) { ctx.fillStyle = COL.card; ctx.strokeStyle = COL.dim; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(st.x + ox, cy + oy, r, 0, 6.283); ctx.fill(); ctx.stroke(); }
  for (let i = 0; i < n; i++) {
    ctx.globalAlpha = a * (.35 + .65 * (.5 + .5 * Math.sin(T * 7 - i * .7)));
    ctx.fillStyle = COL.kw; ctx.beginPath(); ctx.arc(cx - (n - 1) * 11 + i * 22, cy, 6, 0, 6.283); ctx.fill();
  }
  ctx.restore();
}

// ---------- 预算 ----------
function drawBudget(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Bd, tm.Lb);
  if (a <= 0) return;
  ctx.save();
  BP.forEach((p, i) => {
    const t0 = i ? tm.apiP : tm.subP, k = prog(T, t0, t0 + .45, MOTION.pop);
    if (k <= 0) return;
    ctx.globalAlpha = a * Math.min(1, k * 2);
    popScale(ctx, p.x + BPW / 2, BPY + BPH / 2, Math.min(k, 1.05), () => {
      box(ctx, p.x, BPY, BPW, BPH, COL.card, COL.line, 2, 16);
      ctx.font = font(600, 34); ctx.fillStyle = COL.text; ctx.fillText(p.n, p.x + 36, BPY + 52);
      const cx = p.x + BPW / 2;
      ctx.fillStyle = COL.line; ctx.fillRect(p.x + 60, BB, BPW - 120, 2);
      ctx.font = font(500, 26); ctx.textAlign = 'right';
      if (!i) {
        const h = 250 * prog(T, tm.fill0, tm.cap, Easing.easeInQuad), hit = bump(T, tm.cap + .1, .2), ly = BB - 250;
        if (h > 0) box(ctx, cx - 65, BB - h, 130, h, rgba(COL.fn, .3 + .3 * hit), mixC(COL.fn, COL.err, hit), 2.5, 6);
        ctx.fillStyle = COL.err; ctx.fillRect(p.x + 60, ly - 2, BPW - 120, 4); ctx.fillText('用量上限', p.x + BPW - 60, ly - 28);
      } else {
        const h = 290 * clamp((T - tm.fill1) / 2, 0, 1), ly = BB - 190, c = T >= tm.alert ? COL.num : COL.fn;
        if (h > 0) box(ctx, cx - 65, BB - h, 130, h, rgba(c, .3), c, 2.5, 6);
        ctx.strokeStyle = COL.num; ctx.lineWidth = 3; ctx.setLineDash([12, 9]); ctx.beginPath(); ctx.moveTo(p.x + 60, ly); ctx.lineTo(p.x + BPW - 60, ly); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = COL.num; ctx.fillText('预算提醒', p.x + BPW - 60, ly - 28);
        const kb = prog(T, tm.alert, tm.alert + .4, MOTION.pop);
        if (kb > 0) bell(ctx, p.x + 110, ly - 50, kb, Math.sin((T - tm.alert) * 34) * .35 * Math.exp(-(T - tm.alert) * 2.5));
      }
      ctx.textAlign = 'left';
    });
  });
  ctx.restore();
}

// ---------- 排行榜 ----------
function drawBoard(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Lb, tm.p2 + .1, .4, .6);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    win(ctx, BW.x, BW.y, BW.w, BW.h, '排行榜 · 公开题目', COL.dim);
    const ks = prog(T, tm.tab2, tm.tab2 + .7, MOTION.draw), t2 = T >= tm.tab2, dk = prog(T, tm.dimB, tm.dimB + .6);
    chip(ctx, '工具 1', BW.x + BW.w - 250, BW.y + 28, 1, t2 ? COL.faint : COL.fn, font(600, 22), t2 ? COL.card : rgba(COL.fn, .18));
    chip(ctx, '工具 2', BW.x + BW.w - 110, BW.y + 28, 1, t2 ? COL.fn : COL.faint, font(600, 22), t2 ? rgba(COL.fn, .18) : COL.card);
    for (let i = 0; i < 4; i++) { ctx.font = font(500, 26, MONO); ctx.fillStyle = COL.faint; ctx.fillText('#' + (i + 1), BW.x + 40, BW.y + 118 + i * 84); }
    MODELS.forEach((m, j) => {
      const t0 = tm.board + .2 + j * .15, kr = prog(T, t0, t0 + .4);
      if (kr <= 0) return;
      const y = BW.y + 118 + lerp(j, RK2[j], ks) * 84, bw = (BW.w - 340) * lerp(S1[j], S2[j], ks) * prog(T, t0 + .1, t0 + .8, MOTION.draw);
      ctx.globalAlpha = a * kr;
      ctx.font = font(600, 30); ctx.fillStyle = COL.text; ctx.fillText(m, BW.x + 110, y);
      if (bw > 4) box(ctx, BW.x + 290, y - 16, bw, 32, rgba(COL.fn, .1 + .25 * (1 - dk)), mixC(COL.fn, COL.faint, dk), 2, 6);
    });
    ctx.globalAlpha = a;
    const kb = prog(T, tm.bin, tm.bin + .45, MOTION.pop);
    if (kb > 0) popScale(ctx, TB.x + TB.w / 2, TB.y + TB.h / 2, kb, () => {
      const pu = Math.max(...tm.qf.map(t => bump(T, t + .55, .15)));
      box(ctx, TB.x, TB.y, TB.w, TB.h, mixC(COL.card, COL.type, .1 + .3 * pu), COL.type, 2.5 + 2 * pu, 14);
      ctx.font = font(600, 32); ctx.textAlign = 'center'; ctx.fillStyle = COL.type; ctx.fillText('训练数据', TB.x + TB.w / 2, TB.y + TB.h / 2); ctx.textAlign = 'left';
    });
    tm.qf.forEach((t, i) => {
      const k = (T - t) / .55;
      if (k < 0 || k >= 1.05) return;
      const e = MOTION.draw(Math.min(1, k)), x = lerp(BW.x + 420 + i * 150, TB.x + TB.w / 2, e), y = lerp(BW.y + 300, TB.y + TB.h / 2, e) - Math.sin(Math.PI * e) * 200;
      ctx.globalAlpha = a * Math.min(1, k * 5) * (1 - Math.max(0, k - .85) / .2);
      popScale(ctx, x, y, lerp(1, .5, e), () => {
        box(ctx, x - 50, y - 32, 100, 64, COL.card, COL.type, 2.5, 8);
        ctx.font = font(600, 26); ctx.textAlign = 'center'; ctx.fillStyle = COL.type; ctx.fillText('题目', x, y); ctx.textAlign = 'left';
      });
    });
    ctx.restore();
  }
  const b = prog(T, tm.p2, tm.p2 + .5) * (1 - prog(T, tm.Cn - .5, tm.Cn));
  if (b <= 0) return;
  ctx.save(); ctx.globalAlpha = b;
  const kt = prog(T, tm.task2, tm.task2 + .45, MOTION.pop);
  if (kt > 0) popScale(ctx, 960, 252, kt, () => {
    box(ctx, 600, 200, 720, 104, COL.card, COL.num, 2.5, 14);
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.dim; ctx.fillText('task', 630, 232);
    ctx.font = font(600, 34); ctx.fillStyle = COL.text; ctx.fillText('你自己的真实任务：登录功能', 630, 274);
  });
  SLX.forEach((cx, i) => {
    const tw = tm.wire + i * .2, kw = prog(T, tw, tw + .5, MOTION.draw), ks = prog(T, tw + .3, tw + .75, MOTION.pop);
    ctx.strokeStyle = COL.num; ctx.lineWidth = 3; vcurve(ctx, 960, 304, cx, 440, kw);
    if (ks <= 0) return;
    const [ok, s, c] = RES[i], tr = tm.res[i], kr = prog(T, tr, tr + .4, MOTION.pop);
    popScale(ctx, cx, 525, Math.min(ks, 1.1), () => {
      box(ctx, cx - 150, 440, 300, 170, COL.card, kr > 0 ? mixC(COL.line, c, Math.min(1, kr)) : COL.line, 2.5, 14);
      ctx.font = font(600, 32); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(MODELS[i], cx, 484); ctx.textAlign = 'left';
      ctx.fillStyle = COL.line; ctx.fillRect(cx - 120, 518, 240, 2);
      if (kr <= 0) for (let d = 0; d < 3; d++) { ctx.fillStyle = rgba(COL.dim, .3 + .7 * (.5 + .5 * Math.sin(T * 8 - d * .9 - i))); ctx.beginPath(); ctx.arc(cx - 30 + d * 30, 566, 8, 0, 6.283); ctx.fill(); }
      else popScale(ctx, cx, 566, kr, () => {
        if (ok) check(ctx, cx - 84, 566, 14, c); else cross(ctx, cx - 84, 566, 11, c);
        ctx.font = font(600, 30); ctx.fillStyle = c; ctx.fillText(s, cx - 56, 566);
      });
    });
  });
  ctx.restore();
}

// ---------- 国内 ----------
function drawCN(ctx, T, pl) {
  const { tm, ty } = pl, a = fio(T, tm.Cn, tm.Sw);
  if (a <= 0) return;
  ctx.save(); ctx.globalAlpha = a;
  ctx.font = font(400, 28, MONO); drawTyped(ctx, T, ty.cnH, NX0, 290, COL.faint, false);
  NAMES.forEach((s, i) => {
    const k = prog(T, tm.nT[i], tm.nT[i] + .45, MOTION.pop);
    if (k <= 0) return;
    const x = NX0 + i * (NCW + NCG), cx = x + NCW / 2;
    popScale(ctx, cx, NY + NCH / 2, k, () => {
      box(ctx, x, NY, NCW, NCH, COL.card, COL.line, 2, 16);
      ctx.font = font(600, 44); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(s, cx, NY + 64); ctx.textAlign = 'left';
    });
    chip(ctx, '编程套餐', cx, NY + 124, prog(T, tm.tagT + i * .15, tm.tagT + i * .15 + .45, MOTION.pop), COL.type, font(600, 24), COL.card);
  });
  const kd = prog(T, tm.deng, tm.deng + .4);
  if (kd > 0) { ctx.globalAlpha = a * kd; ctx.font = font(500, 40); ctx.fillStyle = COL.dim; ctx.fillText('等', NX0 + 4 * (NCW + NCG) - NCG + 30, NY + NCH / 2); }
  ctx.restore();
}

// ---------- 换模型 ----------
function drawSwap(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Sw, tm.Fr);
  if (a <= 0) return;
  const { x, y, w, h } = SWn, ki = prog(T, tm.swin, tm.swin + .5);
  ctx.save(); ctx.globalAlpha = a * ki; ctx.translate(0, 20 * (1 - ki));
  win(ctx, x, y, w, h, '对话', COL.dim);
  const fk = prog(T, tm.swap, tm.swap + .4), sB = fk >= .5, mx = x + w - 120;
  ctx.save(); ctx.translate(mx, y + 28); ctx.scale(1, Math.max(.05, Math.abs(Math.cos(Math.PI * fk)))); ctx.translate(-mx, -(y + 28));
  chip(ctx, sB ? '模型 B' : '模型 A', mx, y + 28, 1, sB ? COL.type : COL.fn, font(600, 22), COL.card);
  ctx.restore();
  const r1 = y + 124;
  box(ctx, x + 36, r1 - 32, w - 72, 64, COL.bg, COL.line, 2, 10);
  ctx.font = font(500, 30); ctx.fillStyle = COL.fn; ctx.fillText('你', x + 60, r1); ctx.fillStyle = COL.text; ctx.fillText('登录功能还是报错', x + 106, r1);
  chip(ctx, '模型 A · 卡住了', x + w - 170, r1, prog(T, tm.err, tm.err + .4, MOTION.pop), COL.err, font(600, 22), COL.card);
  const k2 = prog(T, tm.resend, tm.resend + .45, MOTION.pop);
  if (k2 > 0) {
    const r2 = y + 224;
    popScale(ctx, x + 60, r2, Math.min(k2, 1.1), () => {
      box(ctx, x + 36, r2 - 32, w - 72, 64, COL.bg, COL.type, 2, 10);
      ctx.font = font(500, 30); ctx.fillStyle = COL.fn; ctx.fillText('你', x + 60, r2); ctx.fillStyle = COL.text; ctx.fillText('同一个问题，再问一遍', x + 106, r2);
      chip(ctx, '模型 B', x + w - 120, r2, 1, COL.type, font(600, 22), COL.card);
    });
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = a * ki * prog(T, tm.resend + .5, tm.resend + .8) * (.3 + .7 * (.5 + .5 * Math.sin(T * 8 - i * .9)));
      ctx.fillStyle = COL.type; ctx.beginPath(); ctx.arc(x + 110 + i * 30, y + 304, 8, 0, 6.283); ctx.fill();
    }
  }
  ctx.restore();
}
function buddy(T, pl) {
  const { tm } = pl, r = jumpPos(T, [[tm.bIn, tm.bIn + .6, B0, B1], [tm.hf - .4, tm.hf, B1, B2]], B0), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 1, blink: ((T + 1.3) % 3.1) < .12, squash: 1, alpha: 1 - prog(T, tm.Fr - .5, tm.Fr) };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  for (const t of [tm.bIn + .6, tm.hf]) if (T >= t && T < t + .25) st.squash = 1 - .2 * Math.sin(Math.PI * (T - t) / .25);
  if (T >= tm.bIn + .6 && T < tm.bIn + 2.2) st.pose = 'wave';
  if (T >= tm.hf - .4 && T < tm.hf + .5) st.pose = 'up';
  return st;
}
function drawBuddy(ctx, st) {
  if (st.alpha <= 0) return;
  const a = COL.clawd, b = COL.clawdHi;
  COL.clawd = COL.type; COL.clawdHi = BUDHI;
  try { ctx.save(); ctx.translate(st.x, 0); ctx.scale(-1, 1); ctx.translate(-st.x, 0); drawClawd(ctx, st); ctx.restore(); }
  finally { COL.clawd = a; COL.clawdHi = b; }
}
function sparks(ctx, T, t) {
  const k = (T - t) / .6;
  if (k < 0 || k >= 1) return;
  const cs = [COL.num, COL.type, COL.kw, COL.str];
  ctx.save();
  for (let i = 0; i < 12; i++) {
    const an = i / 12 * 6.283 + .2, d = 24 + 110 * MOTION.enter(k), s = 12 * (1 - k);
    ctx.globalAlpha = 1 - k; ctx.fillStyle = cs[i % 4]; ctx.fillRect(965 + Math.cos(an) * d - s / 2, 760 + Math.sin(an) * d - s / 2, s, s);
  }
  ctx.restore();
}

// ---------- 免费版 ----------
function drawFree(ctx, T, pl) {
  const { tm } = pl, a = fio(T, tm.Fr, tm.p2f);
  if (a > 0) {
    ctx.save(); ctx.globalAlpha = a;
    const { x, y, w, h } = FS, ry = y + 152, tx = x + w - 150, on = 1 - prog(T, tm.tOff, tm.tOff + .3, MOTION.draw);
    win(ctx, x, y, w, h, '设置 · 免费版', COL.dim);
    const rg = Math.min(1, bump(T, tm.ring + .3, .4) + (T >= tm.ring && T < tm.tOff + .4 ? .6 : 0));
    if (rg > .01) { ctx.strokeStyle = rgba(COL.num, rg); ctx.lineWidth = 3; ctx.beginPath(); ctx.roundRect(x + 24, ry - 46, w - 48, 92, 14); ctx.stroke(); }
    ctx.font = font(500, 34); ctx.fillStyle = COL.text; ctx.fillText('用我的数据改进模型', x + 50, ry);
    const tc = mixC(COL.line, COL.num, on);
    box(ctx, tx - 52, ry - 28, 104, 56, tc, tc, 2, 28);
    ctx.fillStyle = COL.text; ctx.beginPath(); ctx.arc(lerp(tx - 24, tx + 24, on), ry, 20, 0, 6.283); ctx.fill();
    ctx.font = font(500, 26); ctx.fillStyle = on > .5 ? COL.num : COL.dim; ctx.textAlign = 'right'; ctx.fillText(on > .5 ? '开' : '关', tx - 76, ry); ctx.textAlign = 'left';
    const kf = prog(T, tm.flow, tm.flow + .5);
    if (kf > 0) {
      [[FL, '你的代码', COL.fn, 1], [FT, '模型训练', COL.kw, lerp(.4, 1, on)]].forEach(([b, s, c, d]) => {
        ctx.globalAlpha = a * kf * d;
        box(ctx, b.x, b.y, b.w, b.h, COL.card, c, 2.5, 14);
        ctx.font = font(600, 30); ctx.textAlign = 'center'; ctx.fillStyle = c; ctx.fillText(s, b.x + b.w / 2, b.y + b.h / 2); ctx.textAlign = 'left';
      });
      const y0 = FL.y + FL.h / 2, xa = FL.x + FL.w + 16, xb = FT.x - 16;
      ctx.globalAlpha = a * kf; ctx.strokeStyle = COL.line; ctx.lineWidth = 2; ctx.setLineDash([8, 8]);
      ctx.beginPath(); ctx.moveTo(xa, y0); ctx.lineTo(xb, y0); ctx.stroke(); ctx.setLineDash([]);
      for (let d = 0; d < 4; d++) {
        const u = ((T - tm.flow) * .8 + d / 4) % 1;
        ctx.globalAlpha = a * kf * on * Math.min(1, u * 6, (1 - u) * 6);
        ctx.fillStyle = COL.fn; ctx.fillRect(lerp(xa, xb, u) - 12, y0 - 9, 24, 18);
      }
    }
    ctx.restore();
  }
  const b = prog(T, tm.p2f, tm.p2f + .4);
  if (b <= 0) return;
  ctx.save(); ctx.globalAlpha = b;
  FR.forEach(([l, r, c, ok], i) => {
    const t = tm.rowT[i], k = prog(T, t, t + .45, MOTION.pop), y = 400 + i * 200;
    if (k <= 0) return;
    popScale(ctx, 650, y, Math.min(k, 1.1), () => {
      box(ctx, 420, y - 55, 460, 110, COL.card, COL.line, 2, 14);
      ctx.font = font(600, 36); ctx.textAlign = 'center'; ctx.fillStyle = COL.text; ctx.fillText(l, 650, y); ctx.textAlign = 'left';
    });
    arrow(ctx, 910, y, 1060, prog(T, t + .3, t + .7, MOTION.draw), COL.dim);
    const kr = prog(T, t + .6, t + 1, MOTION.pop);
    if (kr > 0) popScale(ctx, 1100, y, kr, () => {
      if (ok) check(ctx, 1122, y, 16, c);
      else { box(ctx, 1104, y - 24, 36, 48, rgba(c, .2), c, 2.5, 4); ctx.fillStyle = c; ctx.fillRect(1112, y - 8, 20, 3); ctx.fillRect(1112, y + 2, 20, 3); ctx.fillRect(1112, y + 12, 14, 3); }
      ctx.font = font(600, 40); ctx.fillStyle = c; ctx.fillText(r, 1164, y);
    });
  });
  ctx.restore();
}

function scene(ctx, T, pl, fv) {
  const { tm } = pl;
  if (T < tm.Q) return drawCard(ctx, T, pl, fv);
  if (T < tm.Rs) return drawQuota(ctx, T, pl);
  if (T < tm.Ac) return drawResend(ctx, T, pl);
  if (T < tm.Rc) return drawRace(ctx, T, pl);
  if (T < tm.Tr) return drawReceipt(ctx, T, pl);
  if (T < tm.Th) return drawTiers(ctx, T, pl);
  if (T < tm.Bd) return drawThink(ctx, T, pl);
  if (T < tm.Lb) return drawBudget(ctx, T, pl);
  if (T < tm.Cn) return drawBoard(ctx, T, pl);
  if (T < tm.Sw) return drawCN(ctx, T, pl);
  if (T < tm.Fr) return drawSwap(ctx, T, pl);
  drawFree(ctx, T, pl);
}

// ---------- Clawd ----------
function clawd(T, pl) {
  const { tm } = pl, prev = pl.prev || [960, 600, 12];
  const J = [[tm.S - .55, tm.S + .35, prev, C0], [tm.Q - .1, tm.Q + .6, C0, CQ], [tm.Rs - .2, tm.Rs + .5, CQ, CRh]];
  tm.rT.forEach(t => J.push([t + .4, t + .8, CRh, CRm], [t + .88, t + 1.22, CRm, CRh]));
  J.push([tm.Ac - .2, tm.Ac + .5, CRh, CA], [tm.Rc - .2, tm.Rc + .5, CA, CRc], [tm.tok, tm.tok + .6, CRc, CTk], [tm.Tr - .2, tm.Tr + .5, CTk, CT[1]],
    [tm.tj[0], tm.tj[0] + .6, CT[1], CT[0]], [tm.tj[1], tm.tj[1] + .6, CT[0], CT[1]], [tm.tj[2], tm.tj[2] + .6, CT[1], CT[2]],
    [tm.Th - .2, tm.Th + .5, CT[2], CTh], [tm.Bd - .2, tm.Bd + .5, CTh, CBd], [tm.Lb - .2, tm.Lb + .5, CBd, CLb], [tm.p2, tm.p2 + .6, CLb, CLb2],
    [tm.Cn - .2, tm.Cn + .5, CLb2, CCn], [tm.Sw - .2, tm.Sw + .5, CCn, CSw], [tm.hf - .4, tm.hf, CSw, CSw2], [tm.Fr - .2, tm.Fr + .5, CSw2, CFr]);
  const r = jumpPos(T, J, prev), [x, y, px] = r.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (r.air) st.squash = 1 + .1 * Math.sin(Math.PI * r.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  const nod = (t, d = 1.3) => { if (T >= t && T < t + d) st.nod = Math.sin((T - t) * 5) > .3; };
  const hop = (t, h = 26, d = .4) => { if (T >= t && T < t + d) st.y -= Math.sin(Math.PI * (T - t) / d) * h; };
  if (T >= tm.S + .35 && T < tm.Q - .1) st.eye = 1;
  if (T >= tm.Q + .6 && T < tm.Rs - .2) { st.eye = -1; if (T >= tm.low - .4) st.sweat = T - tm.low + .4; }
  if (T >= tm.qm && T < tm.qm + 1.8) st.q = qk(T, tm.qm, 1.8);
  hop(tm.low);
  if (T >= tm.Rs + .5 && T < tm.Ac - .2) st.eye = -1;
  tm.rT.forEach((t, i) => {
    if (T >= t + .3 && T < t + .92) { st.pose = 'up'; st.squash *= 1 - .016 * (i + 1); if (i >= 3) st.sweat = T - t; }
    if (T >= t + .7 && T < t + .95) st.eye = 1;
  });
  if (T >= tm.Ac + .5 && T < tm.Rc - .2) { st.eye = -1; if (T >= tm.pass) st.sweat = T - tm.pass; }
  hop(tm.pass, 30);
  if (T >= tm.Rc + .5 && T < tm.tok) { st.eye = 1; if (T >= tm.tot - .1 && T < tm.dimTag + 1.4) st.pose = 'point'; }
  nod(tm.tot + .4);
  if (T >= tm.tok + .6 && T < tm.Tr - .2) st.eye = -1;
  nod(tm.split1 + .4); nod(tm.split2 + .4);
  for (const c of tm.cT) if (T >= c[0] - .2 && T < c[c.length - 1] + .8) st.pose = 'point';
  if (T >= tm.up && T < tm.mech) st.eye = Math.sin(T * 7) > 0 ? 1 : -1;
  nod(tm.save[0] + .2);
  if (T >= tm.Bd + .5 && T < tm.Lb - .2) st.eye = T < tm.apiP ? -1 : 1;
  hop(tm.cap, 20);
  if (T >= tm.alert && T < tm.alert + 1) st.pose = 'up';
  if (T >= tm.Lb + .5 && T < tm.p2) st.eye = T >= tm.bin && T < tm.qf[2] + .6 ? 0 : -1;
  if (T >= tm.tab2 && T < tm.tab2 + .9) st.eye = Math.sin(T * 9) > 0 ? 1 : -1;
  nod(tm.res[0] + .3, .8); if (T >= tm.res[1] && T < tm.res[1] + .8) st.sweat = T - tm.res[1]; nod(tm.res[2] + .4);
  if (T >= tm.Cn + .5 && T < tm.Sw - .2) st.eye = clamp((T - tm.nT[0]) / (tm.deng - tm.nT[0]) * 2 - 1, -1, 1);
  if (T >= tm.Sw + .5 && T < tm.Fr - .2) st.eye = 1;
  if (T >= tm.err && T < tm.swap + .4) st.sweat = T - tm.err;
  if (T >= tm.hf - .4 && T < tm.hf + .5) st.pose = 'up';
  nod(tm.hf + .8);
  if (T >= tm.Fr + .5) { st.eye = 1; if (T >= tm.ring - .2 && T < tm.tOff + .8) st.pose = 'point'; }
  nod(tm.rowT[0] + .9); nod(tm.rowT[1] + .9);
  return st;
}

// ---------- 演员层：包裹、思考泡泡、另一个像素小人 ----------
function over(ctx, T, pl) {
  const { tm } = pl;
  ctx.textBaseline = 'middle';
  if (T >= tm.Rs && T < tm.Ac) drawPkgs(ctx, T, pl);
  if (T >= tm.Th && T < tm.Bd) drawBubble(ctx, T, pl);
  if (T >= tm.bIn && T < tm.Fr) { drawBuddy(ctx, buddy(T, pl)); sparks(ctx, T, tm.hf); }
}

// ---------- 着色器参数 ----------
function fx(T, pl) {
  const { tm } = pl, card = 1 - prog(T, tm.Q - .6, tm.Q, Easing.linear);
  let gl = 0;
  const sp = (t, a, d) => { if (T >= t) gl = Math.max(gl, a * Math.exp(-(T - t) * d)); };
  sp(tm.low, .3, 5); sp(tm.pass, .45, 6); sp(tm.cap, .3, 7); sp(tm.res[1], .2, 7);
  let rays = 0, light = [.5, .44];
  if (T < tm.Q) { rays = .5 * bump(T, tm.dots + 1.2, .45); light = [1080 / 1920, 480 / 1080]; }
  else if (T >= tm.Rc && T < tm.tok) { rays = .4 * bump(T, tm.tot + .3, .5); light = [(RP.x + RP.w / 2) / 1920, (RP.y + 512) / 1080]; }
  else if (T >= tm.Tr && T < tm.Th) { rays = .25 * bump(T, tm.cards[2] + .9, .5); light = [960 / 1920, 460 / 1080]; }
  else if (T >= tm.Lb && T < tm.Cn) { rays = .35 * bump(T, tm.res[2] + .4, .6); light = [960 / 1920, 520 / 1080]; }
  else if (T >= tm.Sw && T < tm.Fr) { rays = .5 * bump(T, tm.hf + .15, .45); light = [965 / 1920, 760 / 1080]; }
  else if (T >= tm.Fr) { rays = .3 * bump(T, tm.tOff + .2, .4); light = [(FS.x + FS.w - 150) / 1920, (FS.y + 152) / 1080]; }
  const drain = prog(T, tm.drain0, tm.drain1) * (1 - prog(T, tm.Rs - .3, tm.Rs + .5));
  return { gl, rays, light,
    energy: lerp(.38, 1, card) + .2 * bump(T, tm.hf + .1, .5) + .15 * drain,
    warm: .15 + .5 * drain + .35 * bump(T, tm.pass + .4, .8) + .2 * bump(T, tm.cap + .2, .5),
    floor: Math.max(.65 * card, .7 * prog(T, tm.Ac, tm.Ac + 1) * (1 - prog(T, tm.Rc - .4, tm.Rc)), .7 * prog(T, tm.Tr, tm.Tr + 1) * (1 - prog(T, tm.Th - .4, tm.Th)),
      .7 * prog(T, tm.p2, tm.p2 + 1) * (1 - prog(T, tm.Sw - .4, tm.Sw))) };
}

// 时间轴上的合并段落 → 章内小节（作者时长）
const TL_PARTS = {"05 章节卡 · 额度 · 重发 · 赛跑":[["05 章节卡",3.5],["05 额度",7],["05 重发",8],["05 赛跑",10]],"05 算账 · 三档":[["05 算账",12.5],["05 三档",16]],"05 思考强度 · 预算 · 排行榜":[["05 思考强度",7.5],["05 预算",6.2],["05 排行榜",14]],"05 国内 · 换模型 · 免费版":[["05 国内",7.2],["05 换模型",7.5],["05 免费版",11.5]]};

return { plan, scene, clawd, fx, over, parts: TL_PARTS };
};
