// 第五章 · 22:30「额度没了？」：选模型和费用
// f05a 现实：手机弹出「本月额度已用 94%」
// f05b 霓虹：用量条；每轮把前面全部重发；2D 霓虹赛道：便宜的多绕几圈总价反超；三档模型；思考强度；预算提醒；排行榜；国内模型；
//      换个模型击掌；免费版的数据设置；规则 4；第一次副歌（主旋律上逐字点亮）
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f05a = K => window.MV_REAL(K, {
  scene: '05 · 22:30 额度没了？',
  desc: '手机弹出「本月额度已用 94%」，登录才写了一半。',
  clock: [22, 30], stamp: ['周五', '22:30'],
  steps: [
    { pause: .75 },
    { id: 'buzz', pause: 3 },
    { id: 'eh', you: '欸？额度怎么快没了？登录才写了一半。' },
    { id: 'look', me: '我们去看看，钱都花在哪儿了。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'desk', 0], [S.t('buzz'), 'phone', 1.2], [S.t('eh'), 'over', 1.4], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: (L, S) => ({ steam: .7 }),
  phone: (x, w, h, L, S) => {
    const k = K.prog(L.b, S.t('buzz') + .3, S.t('buzz') + .5); if (k <= 0) return;
    x.globalAlpha = k; x.fillStyle = '#1e2028'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#e8e9ee'; x.font = '300 64px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.fillText('22:30', w / 2, 110); x.textAlign = 'left';
    x.fillStyle = 'rgba(255,80,110,.25)'; x.beginPath(); x.roundRect(14, 170, w - 28, 130, 18); x.fill();
    x.fillStyle = '#ffffff'; x.font = '700 22px "Noto Sans SC",sans-serif'; x.fillText('AI 编程助手 · 用量提醒', 30, 205);
    x.font = '400 20px "Noto Sans SC",sans-serif'; x.fillText('本月额度已用 94%', 30, 245); x.fillStyle = '#ff6b8a'; x.fillRect(30, 268, (w - 60) * .94, 10);
    x.globalAlpha = 1;
  },
  draw(cx, tx, L, S) {
    const kp = K.prog(L.b, S.t('buzz') + .4, S.t('buzz') + .7, K.E.out) * (1 - K.prog(L.b, S.t('eh') - .3, S.t('eh')));
    if (kp > 0) K.alpha(tx, kp, () => {
      const x = 560, y = 760 + (1 - kp) * 30;
      K.rr(tx, x, y, 800, 150, 28, 'rgba(28,30,38,.9)', 'rgba(255,110,140,.5)', 2);
      K.rr(tx, x + 28, y + 34, 56, 56, 14, '#ff4f7a'); K.txt(tx, '!', x + 56, y + 63, K.fnt(900, 36), '#fff', 'center');
      K.txt(tx, 'AI 编程助手 · 用量提醒', x + 108, y + 52, K.fnt(700, 30), '#ffffff'); K.txt(tx, '现在', x + 760, y + 52, K.fnt(400, 24), 'rgba(255,255,255,.5)', 'right');
      K.txt(tx, '本月额度已用 94%', x + 108, y + 104, K.fnt(500, 34), '#ffb3c4');
    });
  },
  figure: (L, S) => ({ type: L.b >= S.t('eh') && L.b < S.t('eh') + .8 ? 1 : 0, yaw: K.prog(L.b, S.t('buzz') + .2, S.t('buzz') + .6) * -.5 * (1 - K.prog(L.b, S.t('eh') - .4, S.t('eh'))) }),
  sfx: S => [[S.t('buzz') + .3, 'notify'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .6);
    S.add('pad', 0, 0, H.CH.Bb.pad, 8, .3, 'warm');
    S.add('pad', Math.floor(M.t('eh')), 0, H.CH.C.pad, 8, .35, 'string');
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .6);
  },
});

R.f05b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, seq, narrate, scene, sing } = K;
const PK = '#ff4fb8', CY = '#3ef0ff', PU = '#b45cff', YE = '#ffe45c', GR = '#4dff9e', RD = '#ff3b5c', WH = '#fff4fc', GY = '#8a7a9a';
const TIERS = [['旗舰', PK, '最强，也最慢最贵', ['架构设计', '难查的 bug', '长时间自主跑的任务']], ['主力', CY, '日常写功能', ['大多数时候用它']], ['轻量', GR, '又快又便宜', ['补全代码', '改格式', '简单重命名']]];
const MODELS = ['通义千问', '智谱 GLM', 'Kimi', 'DeepSeek'];
function glow(ctx, col, blur, fn) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = blur; fn(); ctx.restore(); }
// 小字不走霓虹着色器（会被光晕和色散糊掉）：变换和画布一致时改画到文字层，透明度跟着画布走
let CX = null, TX = null;
const sameT = (a, b) => { const m = a.getTransform(), n = b.getTransform(); return m.a === n.a && m.b === n.b && m.c === n.c && m.d === n.d && m.e === n.e && m.f === n.f; };
function ntxt(ctx, s, x, y, font, col, align = 'left', a = 1) {
  const sz = +((font.match(/(\d+)px/) || [0, 40])[1]);
  if (sz < 64 && ctx === CX && TX && sameT(CX, TX)) { const ga = CX.globalAlpha; alpha(TX, a * ga, () => glow(TX, col, 8, () => txt(TX, s, x, y, font, mixC(col, '#ffffff', .78), align))); return; }
  alpha(ctx, a, () => glow(ctx, col, Math.max(3, Math.min(12, sz * .2)), () => txt(ctx, s, x, y, font, mixC(col, '#ffffff', .72), align)));
}
function nbox(ctx, x, y, w, h, col, lw = 4, r = 16, a = 1) { alpha(ctx, a, () => glow(ctx, col, 12, () => { rr(ctx, x, y, w, h, r, null, col, lw); rr(ctx, x, y, w, h, r, null, mixC(col, '#ffffff', .6), lw * .35); })); }
const flick = (b, at) => b < at ? 0 : b > at + .2 ? 1 : hash(Math.floor(b * 64) + at * 13) > .45 ? 1 : .15;
const S = seq([
  { id: 'q', say: '先看看，钱都花哪儿了。', hold: .5 },
  { id: 'r0', say: '你可能以为：每发一句话，只算这一句的钱。' },
  { id: 'r1', say: '其实每一轮对话，前面所有的内容，都要重新发给模型一遍。', hold: .5 },
  { id: 'r2', say: '所以对话越长，每一轮就越贵。', hold: .75 },
  { id: 'ag', say: 'Agent 做一个任务，可能要读几十个文件、跑很多轮。' },
  { id: 'race0', say: '来看一场比赛：A 模型单价便宜，B 模型单价贵。' },
  { id: 'race1', say: 'A 便宜，但不太灵光，绕了六圈才跑完；B 两圈就到了终点。', hold: 1 },
  { id: 'race2', say: '算总账：便宜的 A，反而更贵。', hold: .75 },
  { id: 'race3', say: '所以算钱，要算完成一个任务一共花了多少，别只盯着每百万 token 的单价。', hold: .5 },
  { id: 'tier0', say: '选模型，也要看活儿。大致分三档：' },
  { id: 't0', say: '旗舰：最强，也最慢、最贵。留给架构设计、难查的 bug、长时间自主跑的任务。' },
  { id: 't1', say: '主力：日常写功能，大多数时候用它。' },
  { id: 't2', say: '轻量：补全代码、改格式、简单重命名。', hold: .5 },
  { id: 'knob', say: '很多模型还能调「思考强度」：难题调高，机械性的修改调低。' },
  { id: 'knob2', say: '省时间，也省钱。', hold: .5 },
  { id: 'bud', say: '订阅制有用量上限；按量付费的 API，记得设一个预算提醒。', gloss: ['API', '', '程序之间互相调用的接口。按量付费的 API：用多少，付多少。'], until: 'lb0', hold: .5 },
  { id: 'lb0', say: '排行榜，看看就好。' },
  { id: 'lb1', say: '分数受测试时用的工具影响，公开的题目也可能混进了训练数据。' },
  { id: 'lb2', say: '最靠谱的办法：拿你自己的真实任务，试两三个模型。', hold: .5 },
  { id: 'cn', say: '国内能直接用的，比如通义千问、智谱 GLM、Kimi、DeepSeek；不少还有专门面向编程的套餐。', hold: .5 },
  { id: 'hi', say: '卡住的时候，换个模型再问一遍，是很正常的排查办法。' },
  { id: 'hi2', say: '放心，我不会介意。', hold: 1 },
  { id: 'free', say: '还有：免费版本可能会拿你的数据去训练。记得看清设置。' },
  { id: 'free2', say: '课程练习一般没关系；实习和公司的代码，按公司规定来。', hold: .5 },
  { id: 'rule', rule: [4, '按任务选模型，按任务算费用'], dur: 3.5 },
  { id: 'ref0', say: '先停一下。今晚要记住的，其实就这四句——' },
  { id: 'ref', pause: 9.5 },
], { start: 2.8, tail: .25 });
const t = S.t;
const R0 = Math.ceil(t('ref') + .25); // 副歌从整小节开始，和配乐的主旋律对齐
const RACE = [t('race0') + .3, t('race2')];
const lapsA = b => 6 * prog(b, RACE[0], RACE[1], E.lin), lapsB = b => 2 * prog(b, RACE[0], lerp(RACE[0], RACE[1], 1 / 3), E.lin);
const PRICE = [1, 2.4];
// 2D 霓虹赛道（俯视椭圆）；副歌时挪到画面中间，两辆车一直绕
const raceOn = b => prog(b, t('race0'), t('race0') + .3) * (1 - prog(b, t('tier0') - .3, t('tier0')));
const refOn = b => prog(b, t('ref0') + .5, R0) * (1 - prog(b, R0 + 8, R0 + 8.4));
function trackAt(cx, X, Y, RX, RY, a1, lapA, lapB, labels, tt) {
  alpha(cx, a1, () => {
    glow(cx, PU, 22, () => { [[-46, 3, '#e8c9ff'], [0, 8, PU], [46, 3, '#e8c9ff']].forEach(([d, lw, col]) => { cx.strokeStyle = col; cx.lineWidth = lw; cx.beginPath(); cx.ellipse(X, Y, RX + d, RY + d * .6, 0, 0, Math.PI * 2); cx.stroke(); }); });
    for (let i = 0; i < 36; i++) { const a = i / 36 * Math.PI * 2, c = i % 2 ? PK : CY; glow(cx, c, 10, () => seg(cx, X + Math.cos(a) * (RX + 70), Y + Math.sin(a) * (RY + 44), X + Math.cos(a) * (RX + 92), Y + Math.sin(a) * (RY + 58), c, 4)); }
    // 起终点线在正下方
    for (let i = 0; i < 6; i++) { cx.fillStyle = i % 2 ? '#222' : '#fff'; cx.fillRect(X - 8, Y + RY - 46 * .6 + i * 9, 16, 9); }
    [[lapA, 24, CY, 'A'], [lapB, -24, PK, 'B']].forEach(([lp, r0, col, lab]) => {
      const pt = l => { const a = Math.PI / 2 + l * Math.PI * 2; return [X + Math.cos(a) * (RX + r0), Y + Math.sin(a) * (RY + r0 * .6), a]; };
      for (let k = 10; k >= 1; k--) { const [x, y] = pt(lp - k * .012); alpha(cx, (1 - k / 11) * .5, () => circ(cx, x, y, 9 - k * .5, col)); }
      const [x, y, a] = pt(lp), ang = Math.atan2(Math.cos(a) * (RY + r0 * .6), -Math.sin(a) * (RX + r0));
      rotAt(cx, x, y, ang, () => glow(cx, col, 18, () => { rr(cx, x - 26, y - 13, 52, 26, 8, col); rr(cx, x - 6, y - 9, 18, 18, 4, '#ffffff'); }));
      if (labels) ntxt(cx, lab, x, y - 40, fnt(900, 34), col, 'center');
    });
  });
}
return scene({
  scene: '05 霓虹 · 选模型和费用', look: LOOK.NEON,
  desc: '用量条；每轮把前面全部重发；霓虹赛道上便宜的模型多绕几圈总价反超；三档模型；思考强度；预算提醒；排行榜；国内模型；换个模型；免费版的数据设置；规则 4；第一次副歌。',
  enter: { kind: TR.FLASH, a: 0, b: .75, flash: 1 },
  hud: { num: '05', name: '选模型和费用', time: '22:30', line: '额度没了？', ink: '#ffe7ff', acc: PK, mv: [2.1, 2.6] },
  par: L => { const b = L.b, race = raceOn(b) > .5, ref = b >= R0 && b < R0 + 8; return [b < t('r0') ? .22 : race ? .45 : ref ? .5 : .12, race || ref ? 1.2 : .35, .55, ref ? .5 : .78]; },
  cam: L => { const race = raceOn(L.b) > .5; return [race ? 1.02 : 1, 0, 0, 0]; },
  lb: L => .45 * (prog(L.b, R0 - .3, R0) * (1 - prog(L.b, R0 + 8, R0 + 8.3))),
  pulse: L => L.b >= R0 && L.b < R0 + 8 ? 1 : .4,
  sfx: [[t('q'), 'alarm'], [t('r0') + .3, 'blip', 900], [t('r1') + .1, 'buzz'], ...[0, 1, 2, 3].map(i => [t('r1') + .5 + i * .6, 'whoosh']), [RACE[0], 'zap'], ...[1, 2, 3, 4, 5].map(i => [lerp(RACE[0], RACE[1], i / 6), 'coin']), [lerp(RACE[0], RACE[1], 1 / 3), 'ding'], [t('race2') + .2, 'stamp'],
    ...TIERS.map((_, i) => [t('t' + i), 'buzz']), [t('knob') + .3, 'blip', 1500], [t('knob') + 1, 'blip', 500], [t('bud') + .4, 'ding'], [t('lb0'), 'glitch'], [t('lb1') + .3, 'blip', 700], [t('lb1') + 1.3, 'blip', 700], ...MODELS.map((_, i) => [t('cn') + .3 + i * .4, 'buzz']),
    [t('hi') + .5, 'swish'], [t('hi2') + .3, 'pop'], [t('hi2') + .3, 'sparkle'], [t('free') + .9, 'click'], [t('free2') + .3, 'ding'], [t('free2') + .9, 'blip', 600], [R0, 'sparkle']],
  text: TIERS.flatMap(x => [x[0], x[2], ...x[3]]).join('') + MODELS.join('') + '本月已用%第 1 轮第 2 轮第 3 轮第 4 轮≈ 1k3k6k10k tokens模型你以为：这一句你说的我回的这一轮新加的数字是示意A · 单价低B · 单价高绕 圈总价单价 1 × 6 圈 = 6.02.4 × 2 圈 = 4.8A 反超B 到终点✓思考强度难题机械活预算提醒排行榜#1#2#3?测试用的工具不同，分数就不同题目可能早被「背」过了你自己的真实任务× 两三个模型不少有包月的编程套餐模型 A模型 B⇄ 换一个设置 · 数据与隐私允许用我的对话改进模型开关课程练习一般没关系实习 / 公司代码按公司规定来',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t; CX = cx; TX = tx;
    // ---------- 用量条（开头冲到 94%；讲预算时回来，加一条预算线） ----------
    const kq = prog(b, t('q') - .3, t('q')) * (1 - prog(b, t('r0') - .3, t('r0'))) + prog(b, t('bud'), t('bud') + .3) * (1 - prog(b, t('lb0') - .3, t('lb0')));
    if (kq > 0) alpha(cx, kq, () => {
      const x = 560, y = 420, w = 900, lv = b < t('r0') ? lerp(.68, .94, prog(b, t('q'), t('q') + 1.2, E.out)) : .55, col = lv > .85 ? RD : lv > .7 ? YE : GR;
      ntxt(cx, '本月已用', x, y - 60, fnt(900, 44), WH);
      nbox(cx, x, y, w, 80, col, 4, 12);
      alpha(cx, (lv > .85 ? (Math.floor(b * 8) % 2 ? .55 : 1) : 1) * .8, () => glow(cx, col, 14, () => rr(cx, x + 10, y + 10, (w - 20) * lv, 60, 8, col)));
      ntxt(cx, Math.round(lv * 100) + '%', x + w + 30, y + 40, fnt(900, 56, F.mono), col);
      if (b >= t('bud')) { const bx = x + w * .8, kb = prog(b, t('bud') + .4, t('bud') + .7); alpha(cx, kb, () => { glow(cx, YE, 16, () => seg(cx, bx, y - 24, bx, y + 104, YE, 5, [10, 8])); ntxt(cx, '预算提醒', bx, y + 150, fnt(900, 40), YE, 'center'); }); }
    });
    // ---------- 你以为 vs 每轮重发 ----------
    const MX = 1600, MY = 520;
    const k0 = prog(b, t('r0'), t('r0') + .3) * (1 - prog(b, t('r1'), t('r1') + .3));
    if (k0 > 0) alpha(cx, k0, () => {
      ntxt(cx, '你以为：', 560, 520, fnt(900, 48), WH, 'right');
      nbox(cx, 600, 480, 200, 80, CY, 4, 12); ntxt(cx, '这一句', 700, 520, fnt(900, 38), CY, 'center');
      glow(cx, CY, 10, () => seg(cx, 820, 520, MX - 120, 520, CY, 4, [12, 10]));
      nbox(cx, MX - 100, MY - 100, 200, 200, PU, 5, 22); ntxt(cx, '模型', MX, MY, fnt(900, 48), PU, 'center');
    });
    const kr = prog(b, t('r1'), t('r1') + .3) * (1 - prog(b, t('race0') - .3, t('race0')));
    if (kr > 0) alpha(cx, kr, () => {
      nbox(cx, MX - 100, MY - 100, 200, 200, PU, 5, 22); ntxt(cx, '模型', MX, MY, fnt(900, 48), PU, 'center');
      [[CY, '你说的'], [PK, '我回的'], [YE, '这一轮新加的']].forEach(([c, n], i) => { glow(cx, c, 8, () => rr(cx, 300 + i * 260, 214, 34, 34, 6, i === 2 ? null : c, c, 4)); ntxt(cx, n, 346 + i * 260, 232, fnt(700, 30), c); });
      [0, 1, 2, 3].forEach(i => {
        const at = t('r1') + .5 + i * .6, k = prog(b, at, at + .2, E.out); if (k <= 0) return;
        const y = 340 + i * 130, n = 2 * i + 1;
        nbox(cx, 180, y - 40, 200, 80, CY, 3, 12, k); ntxt(cx, '第 ' + (i + 1) + ' 轮', 280, y, fnt(900, 36), CY, 'center', k);
        for (let j = 0; j < n; j++) {
          const kj = prog(b, at + .05 + j * .04, at + .15 + j * .04); if (kj <= 0) continue;
          const nw = j === n - 1, c = nw ? YE : j % 2 ? PK : CY;
          alpha(cx, kj, () => glow(cx, c, 10, () => rr(cx, 420 + j * 66, y - 24, 56, 48, 8, nw ? null : rgba(c, .75), c, 4)));
        }
        const kt = prog(b, at + .4, at + .55);
        const ex = 420 + n * 66 + 10;
        ntxt(cx, '≈ ' + ['1k', '3k', '6k', '10k'][i] + ' tokens', ex + 10, y, fnt(800, 34, F.mono), YE, 'left', kt);
        if (kt > 0) { const d = (tt * .8 + i * .25) % 1; glow(cx, YE, 10, () => { seg(cx, ex + 250, y, MX - 120, lerp(y, MY, .6), rgba(YE, .35), 3); circ(cx, lerp(ex + 250, MX - 120, d), lerp(y, lerp(y, MY, .6), d), 7, YE); }); }
      });
      alpha(cx, prog(b, t('r2'), t('r2') + .3), () => ntxt(cx, '数字是示意', MX, MY + 150, fnt(500, 26), WH, 'center'));
    });
    // ---------- 赛跑：2D 赛道 + 总账 ----------
    const kc = raceOn(b);
    if (kc > 0) {
      trackAt(cx, 560, 560, 330, 200, kc, lapsA(b), lapsB(b), true, tt);
      alpha(cx, kc, () => {
        const la = Math.floor(lapsA(b) + 1e-6), lb = Math.floor(lapsB(b) + 1e-6);
        ntxt(cx, 'A 第 ' + Math.min(6, la + 1) + ' 圈', 560, 540, fnt(900, 36), CY, 'center');
        if (lb >= 2) ntxt(cx, 'B 到终点 ✓', 560, 600, fnt(900, 36), PK, 'center');
        const x0 = 1060, uw = 108;
        ntxt(cx, '总价', x0, 250, fnt(900, 44), WH);
        [['A · 单价低', CY, la * PRICE[0], 380, '单价 1 × ' + la + ' 圈 = ' + (la * PRICE[0]).toFixed(1)], ['B · 单价高', PK, lb * PRICE[1], 600, '单价 2.4 × ' + lb + ' 圈 = ' + (lb * PRICE[1]).toFixed(1)]].forEach(([n, col, c, y, f]) => {
          ntxt(cx, n, x0, y - 56, fnt(900, 40), col);
          nbox(cx, x0, y - 26, 680, 52, col, 2, 8, .5); alpha(cx, .75, () => glow(cx, col, 12, () => rr(cx, x0 + 6, y - 20, Math.min(668, c * uw), 40, 6, col)));
          ntxt(cx, f, x0, y + 64, fnt(800, 36), WH);
        });
        const kx = prog(b, t('race2') + .2, t('race2') + .4, E.back);
        if (kx > .01) scaleAt(cx, 1400, 800, kx, () => rotAt(cx, 1400, 800, -.06, () => { nbox(cx, 1220, 750, 360, 100, YE, 5, 12); ntxt(cx, 'A 反超', 1400, 800, fnt(900, 56), YE, 'center'); }));
      });
    }
    // ---------- 三档招牌 + 思考强度 ----------
    const kt = prog(b, t('tier0'), t('tier0') + .2) * (1 - prog(b, t('bud') - .3, t('bud')));
    if (kt > 0) alpha(cx, kt, () => {
      const up = prog(b, t('knob'), t('knob') + .3, E.io);
      TIERS.forEach(([n, col, sub, tasks], i) => {
        const f = flick(b, t('t' + i)); if (f <= 0) return;
        const x = 400 + i * 560, y = lerp(400, 320, up), cur = b >= t('t' + i) && b < (i < 2 ? t('t' + (i + 1)) : t('knob'));
        alpha(cx, f * (cur || up > 0 ? 1 : .5), () => { nbox(cx, x - 240, y - 140, 480, 250, col, 6, 22); ntxt(cx, n, x, y - 45, fnt(900, 100), col, 'center'); ntxt(cx, sub, x, y + 60, fnt(800, 36), WH, 'center'); });
        alpha(cx, f * (1 - up) * (cur ? 1 : .55), () => tasks.forEach((s, j) => ntxt(cx, s, x, y + 180 + j * 56, fnt(800, 40), mixC(col, '#ffffff', .4), 'center')));
      });
      const kd = prog(b, t('knob'), t('knob') + .3);
      if (kd > 0) alpha(cx, kd, () => {
        const ox = 960, oy = 790, r = 180, a = b < t('knob') + .3 ? -Math.PI / 2 : b < t('knob') + 1 ? lerp(-Math.PI / 2, -.35, prog(b, t('knob') + .3, t('knob') + .5, E.back)) : lerp(-.35, -Math.PI + .35, prog(b, t('knob') + 1, t('knob') + 1.2, E.back));
        glow(cx, YE, 18, () => { cx.strokeStyle = YE; cx.lineWidth = 6; cx.beginPath(); cx.arc(ox, oy, r, Math.PI, 0); cx.stroke(); cx.lineWidth = 9; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(ox + Math.cos(a) * (r - 20), oy + Math.sin(a) * (r - 20)); cx.stroke(); });
        ntxt(cx, '思考强度', ox, oy + 56, fnt(900, 40), YE, 'center');
        ntxt(cx, '机械活', ox - r - 30, oy, fnt(900, 40), GR, 'right'); ntxt(cx, '难题', ox + r + 30, oy, fnt(900, 40), PK, 'left');
      });
    });
    // ---------- 排行榜 ----------
    const kl = prog(b, t('lb0'), t('lb0') + .2) * (1 - prog(b, t('cn') - .3, t('cn')));
    if (kl > 0) alpha(cx, kl, () => {
      const x = 1080, y = 330;
      nbox(cx, x, y - 90, 660, 460, CY, 4, 18); ntxt(cx, '排行榜', x + 330, y - 30, fnt(900, 48), CY, 'center');
      [[91.2, 1], [89.7, .92], [88.5, .88]].forEach(([v, w], i) => { const gl = hash(i + Math.floor(b * 30)) > .8 ? (hash(i * 3 + Math.floor(b * 30)) - .5) * 30 : 0, yy = y + 60 + i * 90; ntxt(cx, '#' + (i + 1), x + 50 + gl, yy, fnt(900, 44, F.mono), WH); glow(cx, CY, 10, () => rr(cx, x + 150 + gl, yy - 20, 300 * w, 40, 6, rgba(CY, .7))); ntxt(cx, v.toFixed(1), x + 480 + gl, yy, fnt(900, 44, F.mono), WH); });
      ntxt(cx, '?', x + 610, y + 300, fnt(900, 100), YE, 'center');
      ['测试用的工具不同，分数就不同', '题目可能早被「背」过了'].forEach((s, i) => { const k = prog(b, t('lb1') + .3 + i, t('lb1') + .6 + i, E.out); if (k <= 0) return; alpha(cx, k, () => { nbox(cx, 160, 250 + i * 130, 760, 96, PK, 3, 14); ntxt(cx, s, 540, 298 + i * 130, fnt(800, 38), PK, 'center'); }); });
      const k2 = prog(b, t('lb2'), t('lb2') + .3); if (k2 > 0) alpha(cx, k2, () => { nbox(cx, 160, 560, 760, 170, YE, 5, 18); ntxt(cx, '你自己的真实任务', 540, 620, fnt(900, 52), YE, 'center'); ntxt(cx, '× 两三个模型', 540, 685, fnt(800, 40), WH, 'center'); });
    });
    // ---------- 国内模型 ----------
    const km = prog(b, t('cn'), t('cn') + .2) * (1 - prog(b, t('hi') - .3, t('hi')));
    if (km > 0) alpha(cx, km, () => {
      MODELS.forEach((s, i) => { const f = flick(b, t('cn') + .3 + i * .4), col = [CY, PK, YE, GR][i], x = 330 + i * 420, y = 460; alpha(cx, f, () => { nbox(cx, x - 185, y - 75, 370, 150, col, 5, 75); ntxt(cx, s, x, y, fnt(900, 54), col, 'center'); }); });
      const kp = prog(b, t('cn') + 2.2, t('cn') + 2.6); if (kp > 0) alpha(cx, kp, () => ntxt(cx, '不少有包月的编程套餐', 960, 650, fnt(900, 44), WH, 'center'));
    });
    // ---------- 免费版：数据设置 ----------
    const kf = prog(b, t('free'), t('free') + .3) * (1 - prog(b, t('ref0') - .3, t('ref0')));
    if (kf > 0) alpha(cx, kf, () => {
      const x = 460, y = 230, w = 1000, on = 1 - prog(b, t('free') + .9, t('free') + 1.1, E.io), sc = mixC(GY, PK, on);
      nbox(cx, x, y, w, 230, CY, 3, 18); ntxt(cx, '设置 · 数据与隐私', x + 40, y + 50, fnt(900, 36), CY);
      seg(cx, x + 30, y + 90, x + w - 30, y + 90, rgba(CY, .3), 2);
      ntxt(cx, '允许用我的对话改进模型', x + 40, y + 160, fnt(800, 42), WH);
      glow(cx, sc, 14, () => { rr(cx, x + w - 190, y + 125, 140, 70, 35, rgba(sc, .5), sc, 4); circ(cx, lerp(x + w - 155, x + w - 85, on), y + 160, 26, '#ffffff'); });
      const k2 = prog(b, t('free2') + .2, t('free2') + .5, E.out), k3 = prog(b, t('free2') + .8, t('free2') + 1.1, E.out);
      if (k2 > 0) alpha(cx, k2, () => { nbox(cx, 300, 540, 560, 150, GR, 4, 18); ntxt(cx, '课程练习', 580, 590, fnt(900, 46), GR, 'center'); ntxt(cx, '一般没关系 ✓', 580, 648, fnt(800, 34), WH, 'center'); });
      if (k3 > 0) alpha(cx, k3, () => { nbox(cx, 1060, 540, 560, 150, YE, 4, 18); ntxt(cx, '实习 / 公司代码', 1340, 590, fnt(900, 46), YE, 'center'); ntxt(cx, '按公司规定来', 1340, 648, fnt(800, 34), WH, 'center'); });
    });
    // ---------- 副歌：赛道挪到中间 ----------
    const kref = refOn(b);
    if (kref > 0) trackAt(cx, 960, 640, 380, 190, kref, (b - R0) * .5, (b - R0) * .35, false, tt);
    // ---------- Clawd ----------
    const hi = t('hi'), h2 = t('hi2');
    let st = { x: 1660, y: 780, px: 14, skin: 'neon', col: PK, glow: PK, pose: 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: -1 };
    if (b < t('r0')) { st.sweat = b; st.x = 1700; st.y = 760; }
    if (b >= t('r0') && b < t('race0')) { st.x = 1760; st.y = 820; st.px = 11; }
    if (kc > .3) { st.x = 560; st.y = 450; st.px = 9; st.eye = Math.sin(tt * 3) > 0 ? 1 : -1; }
    if (b >= t('tier0') && b < t('bud')) st.alpha = 0;
    if (b >= t('bud') && b < t('lb0')) { st.x = 1700; st.y = 800; }
    if (b >= t('lb0') && b < t('hi')) { st.x = 1780; st.y = 820; st.px = 11; }
    if (b >= hi && b < t('free')) { const k = prog(b, h2, h2 + .4, E.io); st.x = lerp(1660, 1010, k); st.y = 700; st.px = 18; st.pose = b >= h2 + .3 && b < h2 + .8 ? 'up' : 'idle'; st.eyeShape = b >= h2 + .4 && b < h2 + 1.2 ? 'happy' : null; }
    if (b >= t('free') && b < t('ref0')) { st.x = 1780; st.y = 840; st.px = 11; }
    if (b >= t('ref0')) { st.x = 960; st.y = 640; st.px = 12; st.alpha = 1 - kref * .0; if (b >= R0) { st.pose = Math.floor(b * 2) % 2 ? 'up' : 'idle'; st.eyeShape = 'happy'; } }
    clawd(cx, st);
    if (b >= hi && b < t('free')) {
      const k = prog(b, h2, h2 + .4, E.io), ka = prog(b, hi + .3, hi + .6) * (1 - prog(b, h2 + .3, h2 + .5));
      clawd(cx, { x: lerp(260, 810, k), y: 700, px: 18, skin: 'neon', col: CY, glow: CY, pose: b >= h2 + .3 && b < h2 + .8 ? 'up' : 'idle', ph: tt * 10, eye: 1, eyeShape: b >= h2 + .4 ? 'happy' : null });
      alpha(cx, ka, () => { ntxt(cx, '模型 A', 260, 520, fnt(900, 40), CY, 'center'); ntxt(cx, '模型 B', 1660, 520, fnt(900, 40), PK, 'center'); ntxt(cx, '⇄ 换一个', 960, 520, fnt(900, 44), YE, 'center'); });
      if (b >= h2 + .4) { const s = prog(b, h2 + .4, h2 + .8); alpha(cx, 1 - s, () => glow(cx, YE, 30, () => { for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; seg(cx, 960 + Math.cos(a) * 40 * (1 + s * 3), 530 + Math.sin(a) * 40 * (1 + s * 3), 960 + Math.cos(a) * 70 * (1 + s * 3), 530 + Math.sin(a) * 70 * (1 + s * 3), YE, 5); } })); }
    }
    // ---------- 副歌 ----------
    sing(tx, L, { at: R0, x: 960, y: 200, size: 70, col: WH, dim: 'rgba(255,220,250,.22)', glow: PK, hold: 8.15 });
    narrate(tx, L, S, { sub: { y: 990, shadow: 'rgba(255,79,184,.6)' }, gloss: { bg: 'rgba(20,6,30,.85)', acc: PK, ink: WH } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD;
    Sm.add('siren', 0, 0, 0, 4, .35);
    H.pads(Sm, 0, B, PD, 'string', .6);
    // 讲解段：合成器贝斯和轻拍；赛跑和副歌：整套四拍
    const race0 = Math.floor(RACE[0]), race1 = Math.ceil(RACE[1]);
    H.roots(Sm, 0, B, PD, 'saw', .5, [[0, .5], [.5, .5, 12], [1, .5], [1.5, .5, 12], [2, .5], [2.5, .5, 12], [3, .5], [3.5, .5, 12]]);
    H.arps(Sm, 0, B, PD, 'arp', .25, [0, 1, 2, 3], .3, 12);
    H.each(0, B, b => { const full = (b >= race0 && b < race1) || (b >= R0 && b < R0 + 8); if (full) { for (let j = 0; j < 4; j++) Sm.add('kick', b, j, 0, 0, .85, 'main'); Sm.add('snare', b, 1, 0, 0, .65, 'gated'); Sm.add('snare', b, 3, 0, 0, .65, 'gated'); } else { Sm.add('kick', b, 0, 0, 0, .5, 'soft'); Sm.add('clap', b, 3, 0, 0, .3); } });
    H.hats(Sm, 0, B, .5, .22);
    Sm.add('crash', race0, 0, 0, 0, .6);
    H.hook(Sm, race0, 'saw', 0, 4, 8, .45, -12);
    // 第一次副歌
    Sm.add('crash', R0, 0, 0, 0, .8);
    H.hook(Sm, R0, 'saw', 0, 0, 8, .95);
    H.hats(Sm, R0, R0 + 8, .5, .2, true, true);
    [2, 2.5, 3, 3.5].forEach((bt, j) => Sm.add('tom', R0 + 7, bt, [220, 180, 150, 120][j], 0, .7));
    H.roll(Sm, R0 - 1, 2, 4, 'snare', 'gated', .2, .8, .25);
  },
}, S);
};
})();
