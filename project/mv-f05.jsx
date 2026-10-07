// 第五章 · 22:30「额度没了？」：选模型和费用
// f05a 现实：手机弹出「本月额度已用 94%」
// f05b 霓虹：额度条；每轮重发、包裹越来越大；3D 霓虹赛道：便宜的多绕几圈总价反超；三档模型；思考强度；预算提醒；排行榜；国内模型；
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
const PK = '#ff4fb8', CY = '#3ef0ff', PU = '#b45cff', YE = '#ffe45c', GR = '#4dff9e', RD = '#ff3b5c', WH = '#fff4fc';
const TIERS = [['旗舰', PK, '最强，也最慢最贵', ['架构设计', '难查的 bug', '长时间自主跑的任务']], ['主力', CY, '日常写功能', ['大多数时候用它']], ['轻量', GR, '又快又便宜', ['补全代码', '改格式', '简单重命名']]];
const MODELS = ['通义千问', '智谱 GLM', 'Kimi', 'DeepSeek'];
function glow(ctx, col, blur, fn) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = blur; fn(); ctx.restore(); }
function ntxt(ctx, s, x, y, font, col, align = 'left', a = 1) { alpha(ctx, a, () => glow(ctx, col, 10, () => txt(ctx, s, x, y, font, mixC(col, '#ffffff', .72), align))); }
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
  { id: 'cn', say: '国内能直接用的，比如通义千问、智谱 GLM、Kimi、DeepSeek，都有面向编程的套餐。', hold: .5 },
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
const TR3 = { ox: 580, oy: 560, rx: 330, rz: 300, tilt: .62 };
const trackLocal = (laps, r0, h) => { const a = Math.PI / 2 - laps * 6.283; return [Math.cos(a) * (TR3.rx + r0), h, Math.sin(a) * (TR3.rz + r0), a]; };
function trackPt(laps, r0, h) { const [X, Y, Z] = trackLocal(laps, r0, h), c = Math.cos(TR3.tilt), sn = Math.sin(TR3.tilt), y = Y * c - Z * sn, z = Y * sn + Z * c, Z0 = (window.MV_3D && window.MV_3D.U.Z0) || 2015, k = Z0 / (Z0 - z); return [960 + (TR3.ox - 960 + X) * k, 540 - (540 - TR3.oy + y) * k]; }
// 副歌时赛道重新亮起，两辆车一直绕
const raceOn = b => prog(b, t('race0'), t('race0') + .3) * (1 - prog(b, t('tier0') - .3, t('tier0'))) + prog(b, R0 - .5, R0) * (1 - prog(b, R0 + 8, R0 + 8.4));
const laps = b => b >= R0 - .5 ? [(b - R0) * .5, (b - R0) * .35] : [lapsA(b), lapsB(b)];
return scene({
  scene: '05 霓虹 · 选模型和费用', look: LOOK.NEON,
  desc: '额度条；每轮重发；3D 霓虹赛道上便宜的模型多绕几圈总价反超；三档模型；思考强度；预算提醒；排行榜；国内模型；换个模型；免费版的数据；规则 4；第一次副歌。',
  enter: { kind: TR.FLASH, a: 0, b: .75, flash: 1 },
  hud: { num: '05', name: '选模型和费用', time: '22:30', line: '额度没了？', ink: '#ffe7ff', acc: PK, mv: [2.1, 2.6] },
  par: L => { const b = L.b, race = raceOn(b) > .5, ref = b >= R0 && b < R0 + 8; return [b < t('r0') ? .22 : race ? .45 : ref ? .5 : .12, race || ref ? 1.2 : .35, .55, ref ? .5 : .78]; },
  cam: L => { const race = raceOn(L.b) > .5; return [race ? 1.04 : 1, race ? .01 * Math.sin(L.t * 1.5) : 0, 0, 0]; },
  lb: L => .45 * (prog(L.b, R0 - .3, R0) * (1 - prog(L.b, R0 + 8, R0 + 8.3))),
  pulse: L => L.b >= R0 && L.b < R0 + 8 ? 1 : .4,
  sfx: [[t('q'), 'alarm'], ...[0, 1, 2, 3].map(i => [t('r1') + .2 + i * .45, 'whoosh']), [RACE[0], 'zap'], ...[1, 2, 3, 4, 5].map(i => [lerp(RACE[0], RACE[1], i / 6), 'coin']), [t('race2') + .2, 'stamp'],
    ...TIERS.map((_, i) => [t('t' + i), 'buzz']), [t('knob') + .3, 'blip', 1500], [t('knob') + 1, 'blip', 500], [t('bud') + .4, 'ding'], [t('lb0'), 'glitch'], ...MODELS.map((_, i) => [t('cn') + .3 + i * .4, 'buzz']),
    [t('hi2') + .3, 'pop'], [t('hi2') + .3, 'sparkle'], [R0, 'sparkle']],
  text: TIERS.flatMap(x => [x[0], x[2], ...x[3]]).join('') + MODELS.join('') + '本月额度%第 1 轮第 2 轮第 3 轮第 4 轮1k3k6k10k tokens模型（示意）A · 单价低B · 单价高绕 圈A 反超B 到终点思考强度难题机械活预算提醒排行榜#1#2#3?',
  three(T, U) {
    const scene3 = new T.Scene();
    scene3.add(new T.AmbientLight(0xffffff, .4));
    const l1 = new T.PointLight(0xff4fb8, 3, 0, 2); l1.position.set(-200, 600, 700); scene3.add(l1);
    const plane = new T.Group(); scene3.add(plane);
    const neon = (col, op = 1) => new T.MeshBasicMaterial({ color: new T.Color(col).convertSRGBToLinear(), transparent: true, opacity: op });
    [[0, 7, PU], [-50, 3, '#e8c9ff'], [50, 3, '#e8c9ff']].forEach(([d, tube, col]) => { const m = new T.Mesh(new T.TorusGeometry(1, tube / TR3.rx, 8, 160), neon(col)); m.rotation.x = Math.PI / 2; m.scale.set(TR3.rx + d, TR3.rz + d, 1); plane.add(m); });
    const road = new T.Mesh(new T.RingGeometry(.86, 1.14, 160), new T.MeshBasicMaterial({ color: 0x2a0a40, transparent: true, opacity: .55, side: T.DoubleSide, depthWrite: false })); road.rotation.x = -Math.PI / 2; road.scale.set(TR3.rx, TR3.rz, 1); plane.add(road);
    for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283, p = new T.Mesh(new T.BoxGeometry(10, 40 + (i % 3) * 20, 10), neon(i % 2 ? PK : CY, .7)); p.position.set(Math.cos(a) * (TR3.rx + 85), 20, Math.sin(a) * (TR3.rz + 150)); plane.add(p); }
    for (let i = 0; i < 6; i++) { const q = new T.Mesh(new T.BoxGeometry(14, 2, 20), new T.MeshBasicMaterial({ color: i % 2 ? 0x222222 : 0xffffff })); q.position.set(0, 2, TR3.rz - 50 + i * 20); plane.add(q); }
    const mkCar = col => { const g = new T.Group(); const body = new T.Mesh(new T.BoxGeometry(58, 18, 30), new T.MeshStandardMaterial({ color: new T.Color(col).convertSRGBToLinear(), emissive: new T.Color(col).convertSRGBToLinear(), emissiveIntensity: .8 })); body.position.y = 12; const cab = new T.Mesh(new T.BoxGeometry(26, 14, 24), neon('#ffffff', .9)); cab.position.set(-4, 26, 0); g.add(body, cab); plane.add(g); return g; };
    const cars = [mkCar(CY), mkCar(PK)];
    return {
      scene: scene3,
      update(L) {
        const b = L.b, kc = raceOn(b);
        if (kc <= 0) return false;
        U.at(plane, TR3.ox, TR3.oy, 0); plane.rotation.set(TR3.tilt, b >= R0 - .5 ? (b - R0) * .15 : 0, 0); plane.scale.setScalar(.85 + .15 * Math.min(1, kc));
        const [la, lb2] = laps(b);
        [[la, 25], [lb2, -25]].forEach(([lp, r0], i) => { const [X, , Z, a] = trackLocal(lp, r0, 0); cars[i].position.set(X, 0, Z); cars[i].rotation.set(0, a + Math.PI * 1.5, .25); });
        return true;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, has3d = !!window.THREE;
    // ---------- 额度表（开头掉到 6%；讲预算时回来，加一条预算线） ----------
    const kq = prog(b, t('q') - .3, t('q')) * (1 - prog(b, t('r0') + .5, t('r0') + .8)) + prog(b, t('bud'), t('bud') + .3) * (1 - prog(b, t('lb0') - .3, t('lb0')));
    if (kq > 0) alpha(cx, kq, () => {
      const x = 900, y = 330, w = 820, lv = b < t('r0') + 1 ? lerp(1, .06, prog(b, t('q'), t('q') + 1, E.in)) : .55, col = lv < .2 ? RD : lv < .5 ? YE : GR;
      ntxt(cx, '本月额度', x, y - 50, fnt(900, 36), WH);
      nbox(cx, x, y, w, 70, col, 4, 10);
      alpha(cx, (lv < .2 ? (Math.floor(b * 16) % 2 ? .4 : 1) : 1) * .75, () => glow(cx, col, 14, () => rr(cx, x + 10, y + 10, (w - 20) * lv, 50, 6, col)));
      ntxt(cx, Math.round(lv * 100) + '%', x + w + 30, y + 35, fnt(900, 44, F.mono), col);
      if (b >= t('bud')) { const bx = x + w * .8, kb = prog(b, t('bud') + .4, t('bud') + .7); alpha(cx, kb, () => { glow(cx, YE, 16, () => seg(cx, bx, y - 20, bx, y + 90, YE, 4, [8, 6])); ntxt(cx, '预算提醒', bx, y + 130, fnt(900, 30), YE, 'center'); }); }
    });
    // ---------- 每轮重发 ----------
    const kr = prog(b, t('r1'), t('r1') + .2) * (1 - prog(b, t('race0') - .3, t('race0')));
    if (kr > 0) alpha(cx, kr, () => {
      const mx = 1640, my = 540;
      nbox(cx, mx - 90, my - 90, 180, 180, PU, 5, 20); ntxt(cx, '模型', mx, my, fnt(900, 44), PU, 'center');
      [0, 1, 2, 3].forEach(i => {
        const at = t('r1') + .2 + i * .45, k = prog(b, at, at + .2, E.back); if (k <= 0) return;
        const y = 330 + i * 130, x = 640;
        nbox(cx, x - 120, y - 40, 240, 80, CY, 3, 12, Math.min(1, k)); ntxt(cx, '第 ' + (i + 1) + ' 轮', x, y, fnt(700, 32), CY, 'center', Math.min(1, k));
        const n = i + 1, fly = prog(b, at + .1, at + .6, E.io), px = lerp(x + 140, mx - 110 - n * 30, fly);
        for (let j = 0; j < n; j++) glow(cx, YE, 14, () => rr(cx, px + j * 30, y - 13 - (j % 2) * 4, 26, 26, 4, YE));
        ntxt(cx, ['1k', '3k', '6k', '10k'][i] + ' tokens', px + n * 30 + 14, y + 36, fnt(700, 22, F.mono), YE, 'left', fly);
      });
      alpha(cx, prog(b, t('r1') + 2, t('r1') + 2.3), () => ntxt(cx, '（数字是示意）', 640, 870, fnt(500, 22), WH, 'center'));
    });
    // ---------- 赛跑 ----------
    const kc = prog(b, t('race0'), t('race0') + .3) * (1 - prog(b, t('tier0') - .3, t('tier0')));
    if (kc > 0) alpha(cx, kc, () => {
      if (has3d) [[lapsA(b), 25, CY, 'A'], [lapsB(b), -25, PK, 'B']].forEach(([lp, r0, col, lab]) => { const [x, y] = trackPt(lp, r0, 70); ntxt(cx, lab, x, y, fnt(900, 26), col, 'center'); });
      if (lapsB(b) >= 2) ntxt(cx, 'B 到终点', 700, 840, fnt(900, 28), PK, 'left');
      const x0 = 1120, uw = 110, cA = Math.floor(lapsA(b) + 1e-6), cB = Math.floor(lapsB(b) + 1e-6) * 2.4;
      [['A · 单价低', CY, cA, 430, '绕 ' + Math.floor(lapsA(b) + 1e-6) + ' 圈'], ['B · 单价高', PK, cB, 610, '绕 ' + Math.floor(lapsB(b) + 1e-6) + ' 圈']].forEach(([n, col, c, y, lp]) => {
        ntxt(cx, n, x0, y - 50, fnt(900, 32), col); ntxt(cx, lp, x0 + 640, y - 50, fnt(700, 24), col, 'right');
        nbox(cx, x0, y - 22, 680, 44, col, 2, 8, .5); alpha(cx, .7, () => glow(cx, col, 12, () => rr(cx, x0 + 6, y - 16, Math.min(668, c * uw), 32, 6, col)));
        ntxt(cx, c.toFixed(1), x0 + 690, y, fnt(900, 30, F.mono), col);
      });
      ntxt(cx, '总价', x0, 330, fnt(900, 34), WH);
      const kx = prog(b, t('race2') + .2, t('race2') + .4, E.back);
      if (kx > 0) scaleAt(cx, 1460, 740, kx, () => rotAt(cx, 1460, 740, -.08, () => { nbox(cx, 1300, 700, 320, 80, YE, 5, 10); ntxt(cx, 'A 反超', 1460, 740, fnt(900, 44), YE, 'center'); }));
    });
    // ---------- 三档招牌 + 思考强度 ----------
    const kt = prog(b, t('tier0'), t('tier0') + .2) * (1 - prog(b, t('bud') - .3, t('bud')));
    if (kt > 0) alpha(cx, kt, () => {
      const up = prog(b, t('knob'), t('knob') + .3, E.io);
      TIERS.forEach(([n, col, sub, tasks], i) => {
        const f = flick(b, t('t' + i)); if (f <= 0) return;
        const x = 400 + i * 560, y = lerp(420, 330, up), cur = b >= t('t' + i) && b < (i < 2 ? t('t' + (i + 1)) : t('knob'));
        alpha(cx, f * (cur || up > 0 ? 1 : .55), () => { nbox(cx, x - 230, y - 140, 460, 230, col, 6, 22); ntxt(cx, n, x, y - 50, fnt(900, 96), col, 'center'); ntxt(cx, sub, x, y + 50, fnt(700, 30), WH, 'center'); });
        alpha(cx, f * (1 - up), () => tasks.forEach((s, j) => ntxt(cx, s, x, y + 160 + j * 52, fnt(700, 34), mixC(col, '#ffffff', .4), 'center')));
      });
      const kd = prog(b, t('knob'), t('knob') + .3);
      if (kd > 0) alpha(cx, kd, () => {
        const ox = 960, oy = 760, r = 160, a = b < t('knob') + .3 ? -Math.PI / 2 : b < t('knob') + 1 ? lerp(-Math.PI / 2, -.35, prog(b, t('knob') + .3, t('knob') + .5, E.back)) : lerp(-.35, -Math.PI + .35, prog(b, t('knob') + 1, t('knob') + 1.2, E.back));
        glow(cx, YE, 18, () => { cx.strokeStyle = YE; cx.lineWidth = 6; cx.beginPath(); cx.arc(ox, oy, r, Math.PI, 0); cx.stroke(); cx.lineWidth = 8; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(ox + Math.cos(a) * (r - 20), oy + Math.sin(a) * (r - 20)); cx.stroke(); });
        ntxt(cx, '思考强度', ox, oy + 50, fnt(900, 34), YE, 'center');
        ntxt(cx, '机械活', ox - r - 30, oy, fnt(700, 30), GR, 'right'); ntxt(cx, '难题', ox + r + 30, oy, fnt(700, 30), PK, 'left');
      });
    });
    // ---------- 排行榜 ----------
    const kl = prog(b, t('lb0'), t('lb0') + .2) * (1 - prog(b, t('cn') - .3, t('cn')));
    if (kl > 0) alpha(cx, kl, () => {
      const x = 1080, y = 330;
      nbox(cx, x, y - 70, 620, 420, CY, 4, 18); ntxt(cx, '排行榜', x + 310, y - 20, fnt(900, 40), CY, 'center');
      ['#1  ████  91.2', '#2  ███   89.7', '#3  ███   88.5'].forEach((s, i) => { const gl = hash(i + Math.floor(b * 30)) > .8 ? (hash(i * 3 + Math.floor(b * 30)) - .5) * 30 : 0; ntxt(cx, s, x + 60 + gl, y + 60 + i * 80, fnt(700, 40, F.mono), WH); });
      ntxt(cx, '?', x + 560, y + 260, fnt(900, 90), YE, 'center');
      const k2 = prog(b, t('lb2'), t('lb2') + .3); if (k2 > 0) alpha(cx, k2, () => { nbox(cx, 200, 420, 640, 160, YE, 4, 18); ntxt(cx, '你自己的真实任务', 520, 480, fnt(900, 44), YE, 'center'); ntxt(cx, '× 两三个模型', 520, 540, fnt(700, 34), WH, 'center'); });
    });
    // ---------- 国内模型 ----------
    const km = prog(b, t('cn'), t('cn') + .2) * (1 - prog(b, t('hi') - .3, t('hi')));
    if (km > 0) alpha(cx, km, () => MODELS.forEach((s, i) => { const f = flick(b, t('cn') + .3 + i * .4), col = [CY, PK, YE, GR][i], x = 330 + i * 420, y = 520; alpha(cx, f, () => { nbox(cx, x - 180, y - 70, 360, 140, col, 5, 70); ntxt(cx, s, x, y, fnt(900, 48), col, 'center'); }); }));
    // ---------- Clawd ----------
    const hi = t('hi'), h2 = t('hi2');
    let st = { x: 1660, y: 860, px: 14, skin: 'neon', col: PK, glow: PK, pose: 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: -1 };
    if (b < t('r0')) { st.sweat = b; st.x = 1500; st.y = 760; }
    if (raceOn(b) > .3 && b < R0) { st.x = 580; st.y = 600; st.px = 10; st.eye = Math.sin(tt * 3) > 0 ? 1 : -1; }
    if (b >= t('tier0') && b < t('bud')) st.alpha = 0;
    if (b >= hi && b < t('free')) { const k = prog(b, h2, h2 + .4, E.io); st.x = lerp(1660, 1010, k); st.y = 760; st.px = 18; st.pose = b >= h2 + .3 && b < h2 + .8 ? 'up' : 'idle'; st.eyeShape = b >= h2 + .4 && b < h2 + 1.2 ? 'happy' : null; }
    if (b >= R0) { st.x = 960; st.y = 900; st.px = 12; st.pose = Math.floor(b * 2) % 2 ? 'up' : 'idle'; st.eyeShape = 'happy'; }
    clawd(cx, st);
    if (b >= hi && b < t('free')) { const k = prog(b, h2, h2 + .4, E.io); clawd(cx, { x: lerp(260, 810, k), y: 760, px: 18, skin: 'neon', col: CY, glow: CY, pose: b >= h2 + .3 && b < h2 + .8 ? 'up' : 'idle', ph: tt * 10, eye: 1, eyeShape: b >= h2 + .4 ? 'happy' : null });
      if (b >= h2 + .4) { const s = prog(b, h2 + .4, h2 + .8); alpha(cx, 1 - s, () => glow(cx, YE, 30, () => { for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; seg(cx, 960 + Math.cos(a) * 40 * (1 + s * 3), 590 + Math.sin(a) * 40 * (1 + s * 3), 960 + Math.cos(a) * 70 * (1 + s * 3), 590 + Math.sin(a) * 70 * (1 + s * 3), YE, 5); } })); } }
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
