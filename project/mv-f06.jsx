// 第六章 · 23:00「室友一次就成」：Harness
// f06a 现实：室友说同一个模型一次就写完；Clawd：你们用的不是同一辆车
// f06b 2D 蓝图：两辆车同一台发动机；HARNESS
// f06c 3D：车身变线框、零件飞散，七个部件（说明书、车轮、刹车、油箱、导航、雨刷、仪表盘）按讲解逐个装回，镜头跟着推；发动机是模型，整辆车是 harness
// f06d 3D：直线赛道，同一台 Claude Opus 4.5 装进卡丁车和整车，开得越远得分越高：42% / 78% / 修正评分后 95%；换一台发动机差距变小
// f06e 2D 蓝图：六级梯子；RedAccess；选工具七项；规则 5；这门课的路线；两个 Agent 抢一个文件
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f06a = K => window.MV_REAL(K, {
  scene: '06 · 23:00 室友一次就成',
  desc: '室友发来消息：同一个模型，他一次就写完了；Clawd 说你们用的不是同一辆车。',
  clock: [23, 0], stamp: ['周五', '23:00'],
  steps: [
    { pause: .75 },
    { id: 'buzz', pause: 3.2 },
    { id: 'why', you: '同一个模型，凭什么他一次就成，我老出错？' },
    { id: 'car', me: '因为你们用的，不是同一辆车。' },
    { id: 'huh', you: '……车？', enter: false },
    { id: 'draw', me: '我画给你看。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'wide', 0], [S.t('buzz') - .2, 'phone', 1.2], [S.t('why'), 'desk', 1.4], [S.t('huh'), 'face', 1], [S.t('draw'), 'over', 1.2], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: () => ({ steam: .5 }),
  phone: (x, w, h, L, S) => {
    const k = K.prog(L.b, S.t('buzz') + .3, S.t('buzz') + .5); if (k <= 0) return;
    x.globalAlpha = k; x.fillStyle = '#1e2028'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#e8e9ee'; x.font = '300 64px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.fillText('23:00', w / 2, 110); x.textAlign = 'left';
    x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.roundRect(14, 170, w - 28, 130, 18); x.fill();
    x.fillStyle = '#ffffff'; x.font = '700 22px "Noto Sans SC",sans-serif'; x.fillText('室友', 30, 205);
    x.font = '400 19px "Noto Sans SC",sans-serif'; x.fillText('我用的同一个模型，', 30, 240); x.fillText('一次就写完了。', 30, 268);
    x.globalAlpha = 1;
  },
  draw(cx, tx, L, S) {
    const kp = K.prog(L.b, S.t('buzz') + .4, S.t('buzz') + .7, K.E.out) * (1 - K.prog(L.b, S.t('why') - .3, S.t('why')));
    if (kp > 0) K.alpha(tx, kp, () => {
      const x = 560, y = 760 + (1 - kp) * 30;
      K.rr(tx, x, y, 800, 150, 28, 'rgba(28,30,38,.88)', 'rgba(255,255,255,.12)', 2);
      K.rr(tx, x + 28, y + 34, 56, 56, 14, '#4f8f6b'); K.txt(tx, '室', x + 56, y + 63, K.fnt(900, 30), '#fff', 'center');
      K.txt(tx, '室友', x + 108, y + 52, K.fnt(700, 30), '#ffffff'); K.txt(tx, '现在', x + 760, y + 52, K.fnt(400, 24), 'rgba(255,255,255,.5)', 'right');
      K.txt(tx, '我用的同一个模型，一次就写完了。', x + 108, y + 104, K.fnt(500, 32), 'rgba(255,255,255,.92)');
    });
  },
  figure: (L, S) => ({ type: L.b >= S.t('why') && L.b < S.t('why') + .8 ? 1 : 0, lean: K.prog(L.b, S.t('huh'), S.t('huh') + .3) * .4, yaw: K.prog(L.b, S.t('buzz') + .2, S.t('buzz') + .6) * -.5 * (1 - K.prog(L.b, S.t('why') - .4, S.t('why'))) }),
  sfx: S => [[S.t('buzz') + .3, 'notify'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .5);
    S.add('pad', 0, 0, H.CH.F.pad, 8, .3, 'glass');
    H.each(Math.floor(M.t('why')), Math.floor(M.t('push')) + 1, b => { for (let j = 0; j < 16; j++) S.add('tick', b, j / 4, 0, 0, .25); });
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .6);
  },
});


const K3 = () => window.MV_K3;
const WL = '#eaf4ff', YE = '#ffd75e', OR = '#ff9a4d', RD = '#ff6b6b', GN = '#7dffb0', DIM = 'rgba(234,244,255,.6)', BP = '#9fd8ff';
const PARTS = [['系统提示词', '说明书'], ['工具', '车轮'], ['权限设置', '刹车'], ['上下文管理', '油箱'], ['规则文件', '导航'], ['hooks', '自动雨刷'], ['反馈', '仪表盘']];
const RUNG = [['行内补全', '打字时补下一段'], ['对话面板', '问答、解释、生成片段'], ['IDE 里的 Agent', 'Qoder · Trae · Cursor'], ['命令行 Agent', 'Claude Code · Codex CLI'], ['云端后台 Agent', '跑完直接提交改动'], ['应用生成平台', 'Lovable · Bolt · v0']];
const SEVEN = ['在哪写代码：IDE 还是终端', '能用哪些模型，能不能换', '计费方式', '权限控制和撤销功能（检查点）', '是否支持规则文件和 MCP', '国内网络能否直接用', '数据会不会被拿去训练'];
const ROUTE = ['先用 IDEA 里的 Qoder', '熟悉了 Git 和命令行，再试命令行 Agent', '应用生成平台，只拿来做原型'];
const HUD = small => ({ num: '06', name: 'Harness', time: '23:00', line: small ? undefined : '室友一次就成', small, ink: WL, acc: YE, mv: small ? undefined : [2.1, 2.6] });
const NARR = K => ({ sub: { y: 990, col: WL, shadow: 'rgba(0,20,60,.9)', acc: [YE, OR] }, gloss: { bg: 'rgba(14,40,90,.9)', ink: WL, acc: YE, border: 'rgba(234,244,255,.4)' } });
function groove(Sm, H, B, drums0) {
  const PD = H.PD, CH = H.CH;
  H.pads(Sm, 0, B, PD, 'glass', .6);
  H.each(0, B, b => { for (let j = 0; j < 16; j++) Sm.add('tick', b, j / 4, 0, 0, j % 4 === 2 ? .45 : .25); });
  H.each(0, B, b => { const r = CH[PD[b % 4]].r + 12; [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 7, 12].forEach((o, j) => Sm.add('bass', b, j / 4, r + o, .22, .45, 'seq')); });
  if (drums0 != null && drums0 < B) { H.four(Sm, drums0, B, .6); H.back(Sm, drums0 + 2, B, 'snare', .4); }
}
// 2D 线框车和发动机（开场用）
function engine2(K, ctx, x, y, s, col = WL) { const { circ } = K; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - 90 * s, y - 50 * s, 180 * s, 100 * s); for (let i = 0; i < 3; i++) { ctx.strokeRect(x - 70 * s + i * 50 * s, y - 85 * s, 40 * s, 35 * s); circ(ctx, x - 50 * s + i * 50 * s, y - 95 * s, 8 * s, null, col, 3); } circ(ctx, x + 110 * s, y, 24 * s, null, col, 3); }
function car2(K, ctx, x, y, s, col = WL) {
  const { circ } = K; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(x - 300 * s, y + 40 * s); ctx.lineTo(x - 300 * s, y - 20 * s); ctx.lineTo(x - 200 * s, y - 40 * s); ctx.lineTo(x - 120 * s, y - 110 * s); ctx.lineTo(x + 110 * s, y - 110 * s); ctx.lineTo(x + 190 * s, y - 40 * s); ctx.lineTo(x + 300 * s, y - 25 * s); ctx.lineTo(x + 300 * s, y + 40 * s); ctx.closePath(); ctx.stroke();
  [-180, 180].forEach(d => { circ(ctx, x + d * s, y + 40 * s, 55 * s, 'rgba(18,58,122,1)', col, 3); circ(ctx, x + d * s, y + 40 * s, 22 * s, null, col, 2); });
}

// ---------- 3D：发动机和车（两段 3D 共用） ----------
function buildEngine(T, k3, o = {}) {
  const g = new T.Group(), metal = k3.mat(T, o.col || '#9aa6b8', { m: .85, r: .28 }), dark = k3.mat(T, '#3a414d', { m: .7, r: .4 });
  const block = new T.Mesh(new T.BoxGeometry(110, 58, 78), metal); block.position.y = 29; block.castShadow = true; g.add(block);
  for (let i = 0; i < 4; i++) { const c = new T.Mesh(new T.CylinderGeometry(11, 11, 26, 14), dark); c.position.set(-36 + i * 24, 70, 0); c.castShadow = true; g.add(c); }
  const pul = new T.Mesh(new T.CylinderGeometry(22, 22, 8, 24), dark); pul.rotation.z = Math.PI / 2; pul.position.set(60, 30, 0); g.add(pul);
  const glowM = new T.MeshBasicMaterial({ color: k3.col(T, o.glow || '#ff9a4d') });
  [-1, 1].forEach(s => { const strip = new T.Mesh(new T.BoxGeometry(90, 8, 2), glowM); strip.position.set(0, 34, s * 40); g.add(strip); });
  const light = new T.PointLight(k3.col(T, o.glow || '#ff9a4d'), .8, 260, 2); light.position.set(0, 60, 0); g.add(light);
  return { g, glowM, light };
}
// kind: 'full' 整辆车 / 'kart' 只有车架的通用框架
function buildCar(T, k3, kind, col = '#d97757') {
  const g = new T.Group(), full = kind === 'full', L = full ? 420 : 340, WX = full ? 140 : 115, WZ = full ? 105 : 82, WR = full ? 40 : 30;
  const out = { g, kind, wheels: [], parts: {}, WR, L };
  if (full) {
    const bodyM = new T.MeshStandardMaterial({ color: k3.col(T, col), roughness: .35, metalness: .35, transparent: true, opacity: 1 });
    const edgeM = new T.LineBasicMaterial({ color: k3.col(T, BP), transparent: true, opacity: 0 });
    const body = new T.Group();
    [[[L, 60, 190], [0, 75, 0]], [[220, 72, 170], [-40, 141, 0]]].forEach(([s, p]) => { const geo = new T.BoxGeometry(...s), m = new T.Mesh(geo, bodyM); m.position.set(...p); m.castShadow = true; body.add(m); const e = new T.LineSegments(new T.EdgesGeometry(geo), edgeM); e.position.set(...p); body.add(e); });
    const glass = new T.Mesh(new T.PlaneGeometry(160, 60), new T.MeshStandardMaterial({ color: 0x0b1a2a, roughness: .1, metalness: .6, transparent: true, opacity: .75 })); glass.rotation.y = Math.PI / 2; glass.position.set(71, 141, 0); body.add(glass);
    g.add(body); out.body = body; out.bodyM = bodyM; out.edgeM = edgeM;
  } else {
    const tube = k3.mat(T, '#7a8494', { m: .8, r: .35 });
    [[[L, 8, 8], [0, 34, 60]], [[L, 8, 8], [0, 34, -60]], [[8, 8, 128], [L / 2 - 4, 34, 0]], [[8, 8, 128], [-L / 2 + 4, 34, 0]], [[8, 8, 128], [0, 34, 0]]].forEach(([s, p]) => { const m = new T.Mesh(new T.BoxGeometry(...s), tube); m.position.set(...p); m.castShadow = true; g.add(m); });
    const seat = new T.Mesh(new T.BoxGeometry(50, 50, 60), k3.mat(T, '#2a2f3a')); seat.position.set(-60, 60, 0); g.add(seat);
  }
  const W = new T.Group(); g.add(W);
  [[WX, WZ], [WX, -WZ], [-WX, WZ], [-WX, -WZ]].forEach(([x, z]) => {
    const w = new T.Group(), spin = new T.Group(); w.add(spin);
    const tire = new T.Mesh(new T.CylinderGeometry(WR, WR, WR * .75, 28), k3.mat(T, '#15171c', { r: .85 })); tire.rotation.x = Math.PI / 2; tire.castShadow = true; spin.add(tire);
    const hub = new T.Mesh(new T.CylinderGeometry(WR * .45, WR * .45, WR * .8, 6), k3.mat(T, '#c8d2e0', { m: .9, r: .2 })); hub.rotation.x = Math.PI / 2; spin.add(hub);
    w.position.set(x, WR, z); w.userData.home = new T.Vector3(x, WR, z); W.add(w); out.wheels.push({ w, spin });
  });
  out.parts.wheels = W;
  if (full) {
    const P = out.parts, add = (name, obj, x, y, z) => { obj.position.set(x, y, z); obj.userData.home = new T.Vector3(x, y, z); g.add(obj); P[name] = obj; };
    const book = new T.Group(); book.add(new T.Mesh(new T.BoxGeometry(46, 6, 34), k3.mat(T, '#f4f1ea'))); const stripe = new T.Mesh(new T.BoxGeometry(46, 6.5, 6), k3.mat(T, '#3c7bd6')); stripe.position.z = -10; book.add(stripe); add('book', book, 30, 112, 48);
    const brakes = new T.Group(); [[WX, WZ], [WX, -WZ], [-WX, WZ], [-WX, -WZ]].forEach(([x, z]) => { const c = new T.Mesh(new T.BoxGeometry(18, 30, 10), k3.mat(T, '#e0242f', { e: '#e0242f', ei: .3 })); c.position.set(x + 16, WR + 10, z + Math.sign(z) * (WR * .4 + 6)); brakes.add(c); }); add('brakes', brakes, 0, 0, 0);
    const tank = new T.Mesh(new T.CylinderGeometry(26, 26, 120, 20), k3.mat(T, '#d9a92b', { m: .6, r: .35 })); tank.rotation.x = Math.PI / 2; add('tank', tank, -150, 58, 0);
    const gps = k3.label(T, '导航 · 路线已设定', { size: 24, bg: '#0b2a3a', border: '#5fe0ff', col: '#bff4ff', h: 22 }); gps.rotation.y = -Math.PI / 2; add('gps', gps, 66, 140, 10);
    const wip = new T.Group(); [-38, 38].forEach(z => { const a = new T.Mesh(new T.BoxGeometry(4, 4, 70), k3.mat(T, '#1a1d24')); a.position.set(0, 0, z); a.rotation.x = .15; wip.add(a); }); add('wipers', wip, 76, 114, 0);
    const gau = k3.label(T, '◔  ◕', { size: 28, bg: '#10131a', border: '#9fd8ff', col: '#ffd75e', h: 20 }); gau.rotation.y = -Math.PI / 2; add('gauges', gau, 66, 122, -46);
  }
  return out;
}
const PART_KEYS = ['book', 'wheels', 'brakes', 'tank', 'gps', 'wipers', 'gauges'];
const EXPLODE = { book: [0, 260, 170], wheels: null, brakes: [0, 230, 0], tank: [-300, 0, 0], gps: [0, 300, 40], wipers: [220, 220, 0], gauges: [-40, 300, -220] };
function setCar(car, x, z, dist, o = {}) {
  car.g.position.set(x, 0, z); car.g.rotation.y = o.ry || 0;
  car.wheels.forEach(({ spin }) => { spin.rotation.z = -dist / car.WR; });
}
function bpWorld(T, k3, bg = '#081830') {
  const sc = new T.Scene(); sc.background = k3.col(T, bg); sc.fog = new T.Fog(k3.col(T, bg), 1600, 6000);
  sc.add(new T.HemisphereLight(k3.col(T, '#9fc4ff'), k3.col(T, '#0a1020'), .65));
  const key = new T.DirectionalLight(0xffffff, 1.4); key.position.set(600, 1200, 800); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -1400, right: 1400, top: 1400, bottom: -1400, near: 10, far: 4000 }); sc.add(key, key.target);
  const floor = new T.Mesh(new T.PlaneGeometry(14000, 14000), new T.MeshStandardMaterial({ color: k3.col(T, '#0c2244'), roughness: .55, metalness: .3 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; sc.add(floor);
  const grid = new T.GridHelper(14000, 140, k3.col(T, '#2d5a96'), k3.col(T, '#16365f')); grid.position.y = .5; sc.add(grid);
  return { sc, key };
}

// ======================================================================
// f06b 2D 蓝图开场：两辆车同一台发动机；HARNESS
R.f06b = K => {
const { F, E, TR, LOOK, prog, lerp, hash, rgba, fnt, txt, seg, arrow, alpha, clawd, seq, narrate, scene } = K;
const S = seq([
  { id: 'cars', say: '同一个模型，放进不同的工具里，结果就是不一样。', hold: .75 },
  { id: 'layer', say: '差别，出在模型外面的那一层。', hold: .5 },
  { id: 'hn', say: '这一层，叫 harness。', gloss: ['harness', '', '原意是马具：套在马身上、把马的力气变成拉车的那一整套。这里指模型之外的一切。'], hold: 1.5 },
], { start: 2.8, tail: .5 });
const t = S.t;
return scene({
  scene: '06 蓝图 · Harness', look: LOOK.PRINT,
  desc: '两辆线框车装着同一台发动机，一辆顺利写完、一辆半路出错；差别在模型外面那一层；HARNESS。',
  enter: { kind: TR.WIPE, a: 0, b: 3, col: '#9fd8ff' },
  hud: HUD(false),
  par: L => [.1 + .25 * L.hit(t('layer') + .5, .6), 0, 0, 0],
  cam: L => [1 + .006 * Math.sin(L.t * .4), 0, 0, 0],
  pulse: L => .4,
  sfx: [[t('cars') + .3, 'plot'], [t('cars') + 1, 'ding'], [t('cars') + 1.4, 'glitch'], [t('layer') + .3, 'plot'], [t('hn') + .2, 'swoosh3d']],
  text: '✓ 顺利写完✗ 半路出错工具 A工具 B同一个模型HARNESS',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    const k1 = prog(b, t('cars') - .3, t('cars')) * (1 - prog(b, t('layer') + .3, t('layer') + .6));
    if (k1 > 0) alpha(cx, k1, () => {
      [[340, 'A', GN, '✓ 顺利写完', t('cars') + 1], [740, 'B', RD, '✗ 半路出错', t('cars') + 1.4]].forEach(([y, n, col, s, at]) => {
        car2(K, cx, 960, y, 1); engine2(K, cx, 960, y - 20, .6);
        const k = prog(b, at, at + .2);
        if (k > 0) alpha(tx, k, () => { txt(tx, s, 1320, y - 20, fnt(900, 48), col); txt(tx, '工具 ' + n, 600, y - 20, fnt(900, 44), WL, 'right'); });
        if (n === 'B' && b >= at) for (let i = 0; i < 8; i++) { const a = hash(i + Math.floor(tt * 12)) * 6.283, r = 30 + hash(i * 3 + Math.floor(tt * 12)) * 60; seg(cx, 1030, y - 50, 1030 + Math.cos(a) * r, y - 50 + Math.sin(a) * r, RD, 3); }
      });
      alpha(tx, k1, () => { txt(tx, '同一个模型', 960, 545, fnt(900, 36), YE, 'center'); arrow(tx, 960, 515, 960, 360, rgba(YE, .7), 3, 12); arrow(tx, 960, 575, 960, 720, rgba(YE, .7), 3, 12); });
    });
    const kh = prog(b, t('layer') + .3, t('hn') + .5, E.lin);
    if (kh > 0) { cx.save(); cx.beginPath(); cx.rect(0, 0, 200 + 1600 * kh, 1080); cx.clip(); txt(cx, 'HARNESS', 960, 560, fnt(400, 300, F.display), WL, 'center'); cx.restore(); circ2(cx, 200 + 1600 * kh, 640); }
    function circ2(ctx, x, y) { K.circ(ctx, Math.min(x, 1800), y, 8, YE); }
    const k = prog(b, t('layer'), t('layer') + .35, E.io);
    clawd(cx, { x: lerp(1720, 1700, k), y: lerp(560, 860, k) - Math.sin(Math.PI * k) * 90, px: 12, skin: 'wire', col: YE, pose: b < t('layer') ? 'pointL' : 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: -1, alpha: prog(b, t('cars') - .2, t('cars') + .2) });
    narrate(tx, L, S, NARR(K));
  },
  music(Sm, H, w) { Sm.add('crash', 0, 0, 0, 0, .5); groove(Sm, H, w.m.bars, null); },
}, S);
};

// ======================================================================
// f06c 3D：一辆车拆开，七个部件一个个装回去；发动机是模型，整辆车是 harness
R.f06c = K => {
const { F, E, TR, LOOK, prog, lerp, rgba, fnt, rr, txt, alpha, seq, narrate, scene } = K;
const S = seq([
  { id: 'list', say: '模型之外的一切都算。我们把这辆车拆开来看：', hold: .75 },
  { id: 'p0', say: '系统提示词：工具事先写给我的说明。像车里那本说明书。', hold: .25 },
  { id: 'p1', say: '工具：读写文件、执行命令、搜索、上网。像车轮，让力气落到地上。', hold: .25 },
  { id: 'p2', say: '权限设置：哪些事我能直接做，哪些必须你点头。像刹车。', hold: .25 },
  { id: 'p3', say: '上下文管理：内容太多时压缩，或者把子任务分给子代理。像油箱，容量有限，得管着用。', gloss: ['子代理', 'sub-agent', '主 Agent 派出去干一件小事的另一个 Agent，干完只把结果交回来。'], until: 'p4', hold: .25 },
  { id: 'p4', say: '规则文件：上一章讲过的那个。像导航，每次出发都在。', hold: .25 },
  { id: 'p5', say: 'hooks：在特定时机自动运行的脚本，比如每次改完代码，自动格式化。像自动雨刷，一下雨就动。', hold: .25 },
  { id: 'p6', say: '反馈：跑测试、跑代码检查，再把结果告诉我。像仪表盘。', hold: .5 },
  { id: 'car', say: '所以：模型是发动机，harness 是整辆车。', hold: .75 },
  { id: 'car2', say: '同一台发动机，装进不同的车，跑出来的成绩就不一样。', hold: 1 },
], { start: .5, tail: .5 });
const t = S.t;
const PAT = PARTS.map((_, i) => t('p' + i)), EX0 = t('list') + .6, EX1 = t('list') + 1.6;
const P3 = {};
// 每个部件的镜头：[位置, 看向, fov]；Clawd 站的位置
const SHOT = [[[230, 300, 380], [30, 112, 48], 30], [[160, 110, 640], [0, 40, 90], 34], [[400, 120, 360], [150, 50, 110], 30], [[-600, 110, 380], [-150, 55, 0], 32], [[-260, 300, 30], [66, 140, 10], 30], [[540, 300, 260], [80, 125, 0], 30], [[-200, 260, -160], [66, 122, -46], 28]];
return scene({
  scene: '06 蓝图 3D · 整辆车', look: LOOK.FILM,
  desc: '3D：蓝图车间里一辆橙色的车，车身变成线框、零件全部飞散；七个部件按讲解一个个装回原位，每装一个镜头推到它跟前（说明书、车轮、刹车、油箱、导航、雨刷、仪表盘）；车身合上，镜头绕车一圈：发动机是模型，整辆车是 harness；一台只有车架的卡丁车开进来，装上同一台发动机。',
  enter: { kind: TR.FLASH, a: 0, b: .5, flash: .5 },
  hud: HUD(true),
  par: L => [.62, .35, .8, .7],
  lb: L => .45,
  pulse: () => 0,
  sfx: [[EX0, 'whoosh'], [EX0 + .1, 'shatter'], ...PAT.map(a => [a + .5, 'click']), ...PAT.map(a => [a + .6, 'lock']), [t('car') + .1, 'swoosh3d'], [t('car') + .4, 'ding'], [t('car2') + .3, 'whoosh'], [t('car2') + 1.2, 'thud']],
  text: PARTS.flat().join('') + '发动机 = 模型整辆车 = harness导航 · 路线已设定◔  ◕同一台发动机=',
  three(T, U) {
    const k3 = K3(), { sc } = bpWorld(T, k3);
    const car = buildCar(T, k3, 'full'), eng = buildEngine(T, k3); car.g.add(eng.g); eng.g.position.set(132, 62, 0); eng.g.scale.setScalar(.9); sc.add(car.g);
    const kart = buildCar(T, k3, 'kart'), eng2 = buildEngine(T, k3); kart.g.add(eng2.g); eng2.g.position.set(110, 40, 0); eng2.g.scale.setScalar(.8); sc.add(kart.g);
    const me = k3.clawd(T, { px: 7 }); sc.add(me.g);
    const ring = new T.Mesh(new T.RingGeometry(.9, 1, 64), new T.MeshBasicMaterial({ color: k3.col(T, YE), transparent: true, opacity: .8, side: T.DoubleSide, depthWrite: false })); ring.rotation.x = -Math.PI / 2; sc.add(ring);
    const keys = [[0, [760, 420, 760], [0, 90, 0], 36, 0], [EX0 - .2, [980, 640, 980], [0, 110, 0], 40, 1.4]];
    SHOT.forEach((s, i) => keys.push([PAT[i], s[0], s[1], s[2], 1.1]));
    const rig = k3.rig(keys);
    const V = new T.Vector3();
    return { scene: sc, update(L, c) {
      const b = L.b, tt = L.t;
      U.renderer.toneMapping = T.ACESFilmicToneMapping; U.renderer.toneMappingExposure = 1.2;
      // 运镜：拆开时拉远，讲到哪个部件推到哪个；整车之后绕车一圈
      if (b < t('car')) rig(b, tt, c);
      else {
        const k = prog(b, t('car'), t('car') + 1.4, E.io), a = .78 + (b - t('car')) * .32, R0 = 940, hgt = 360;
        const kc2 = prog(b, t('car2'), t('car2') + 1.2, E.io);
        const px = Math.cos(a) * R0, pz = Math.sin(a) * R0, from = SHOT[6];
        c.position.set(lerp(from[0][0], px, k), lerp(from[0][1], hgt + 260 * kc2, k), lerp(from[0][2], pz + 500 * kc2, k));
        c.lookAt(lerp(from[1][0], 0, k), lerp(from[1][1], 80, k), lerp(from[1][2], -260 * kc2, k)); c.fov = lerp(from[2], 38 + 6 * kc2, k); c.updateProjectionMatrix(); c.updateMatrixWorld();
      }
      setCar(car, 0, 0, 0);
      // 拆开：车身变线框，零件飞出去；讲到哪个装回哪个
      const ex = E.out(prog(b, EX0, EX1)), shut = prog(b, t('car'), t('car') + .8, E.io);
      const ghost = ex * (1 - shut);
      car.bodyM.opacity = 1 - .88 * ghost; car.bodyM.depthWrite = ghost < .5; car.edgeM.opacity = ghost;
      PART_KEYS.forEach((name, i) => {
        const back = E.io(prog(b, PAT[i] + .3, PAT[i] + .9)), e = ex * (1 - back), cur = b >= PAT[i] && b < (i < 6 ? PAT[i + 1] : t('car'));
        const o = car.parts[name];
        if (name === 'wheels') car.wheels.forEach(({ w }) => { const h = w.userData.home; w.position.set(h.x + Math.sign(h.x) * 80 * e, h.y + 30 * e, h.z + Math.sign(h.z) * 260 * e); });
        else { const h = o.userData.home, d = EXPLODE[name]; o.position.set(h.x + d[0] * e, h.y + d[1] * e, h.z + d[2] * e); }
        const pulse = cur && back < 1 ? 1 + .12 * Math.sin(tt * 8) : cur ? 1 + .06 * Math.sin(tt * 6) : 1;
        if (name !== 'wheels' && name !== 'brakes') o.scale.setScalar(pulse); else if (name === 'brakes') o.children.forEach(m => m.scale.setScalar(pulse));
        if (cur) { const p = name === 'wheels' ? car.wheels[0].w.position : name === 'brakes' ? V.set(150, 70, 120) : o.position; P3.cur = k3.proj(T, c, V.copy(p).add(new T.Vector3(0, name === 'wheels' ? 70 : 50, 0))); P3.i = i; ring.position.set(p.x, 1, p.z); }
      });
      const inPart = b >= PAT[0] && b < t('car');
      ring.visible = inPart; ring.scale.setScalar(70 + 8 * Math.sin(tt * 6));
      if (!inPart) P3.i = -1;
      eng.glowM.color.setHSL(.07, 1, .5 + .15 * Math.sin(tt * 4)); eng.light.intensity = 1 + (b >= t('car') ? 1.5 : 0);
      P3.eng = k3.proj(T, c, V.set(132, 160, 0)); P3.car = k3.proj(T, c, V.set(-60, 240, 0));
      // 卡丁车开进来，同一台发动机落进去
      const kk = prog(b, t('car2') + .2, t('car2') + 1.1, E.out), drop = prog(b, t('car2') + 1.1, t('car2') + 1.5, E.in);
      kart.g.visible = kk > 0; setCar(kart, lerp(-1400, -40, kk), -620, 1400 * kk);
      eng2.g.position.y = lerp(400, 40, drop); eng2.g.visible = b >= t('car2') + .9;
      P3.kart = k3.proj(T, c, V.set(-40, 180, -620));
      // Clawd：跳到正在讲的那个部件上，骑着它一起装回原位
      const TOP = [4, 40, 16, 26, 12, 3, 10], ROOF = [-40, 177, 0];
      const spotOf = j => { if (j < 0) return ROOF; const n = PART_KEYS[j], o = car.parts[n]; let p;
        if (n === 'wheels') p = car.wheels[0].w.position.clone(); else if (n === 'brakes') p = o.position.clone().add(o.children[0].position); else p = o.position.clone();
        return [p.x, p.y + TOP[j] * (n === 'wheels' ? 1 : o.scale.y), p.z]; };
      let i = -1; PAT.forEach((a, j) => { if (b >= a) i = j; });
      const atCar = b >= t('car'), a0 = atCar ? t('car') : i >= 0 ? PAT[i] : 0;
      const kh = i < 0 ? 1 : prog(b, a0, a0 + .35, E.io);
      const from = atCar ? spotOf(6) : spotOf(i - 1), to = atCar ? ROOF : spotOf(i);
      const mx = lerp(from[0], to[0], kh), my = lerp(from[1], to[1], kh) + Math.sin(Math.PI * kh) * 90, mz = lerp(from[2], to[2], kh);
      me.set({ pose: kh < 1 ? 'up' : atCar ? 'both' : 'point', walk: -1, ph: tt * 8, eye: 0, blink: (tt % 2.9) < .1 });
      me.g.scale.setScalar(atCar || i < 0 ? 1 : i >= 4 ? .45 : .6);
      me.g.position.set(mx, my, mz); me.g.rotation.y = Math.atan2(c.position.x - mx, c.position.z - mz);
      return true;
    } };
  },
  draw(cx, tx, L) {
    const b = L.b;
    K.three(cx, L);
    // 当前部件的标签
    if (P3.i >= 0 && P3.cur && P3.cur[2]) {
      const [n, m] = PARTS[P3.i], k = prog(b, PAT[P3.i] + .2, PAT[P3.i] + .5);
      alpha(tx, k, () => {
        tx.font = fnt(900, 40); const w1 = tx.measureText(n).width; tx.font = fnt(700, 32); const w2 = tx.measureText('= ' + m).width; const w = Math.max(w1, w2) + 120;
        const x = Math.max(60, Math.min(1860 - w, P3.cur[0] - w / 2)), y = Math.max(140, P3.cur[1] - 150);
        rr(tx, x, y, w, 118, 12, 'rgba(8,24,48,.88)', YE, 3);
        txt(tx, String(P3.i + 1), x + 40, y + 42, fnt(800, 34, F.mono), YE, 'center'); txt(tx, n, x + 76, y + 42, fnt(900, 40), WL); txt(tx, '= ' + m, x + 76, y + 90, fnt(700, 32), YE);
      });
    }
    // 整车：发动机 = 模型，整辆车 = harness
    const kc = prog(b, t('car') + .6, t('car') + 1) * (1 - prog(b, t('car2') - .2, t('car2') + .1));
    if (kc > 0) alpha(tx, kc, () => {
      if (P3.eng && P3.eng[2]) { rr(tx, P3.eng[0] - 150, P3.eng[1] - 70, 300, 64, 10, 'rgba(8,24,48,.88)', OR, 3); txt(tx, '发动机 = 模型', P3.eng[0], P3.eng[1] - 38, fnt(900, 34), OR, 'center'); }
      txt(tx, '整辆车 = harness', 960, 220, fnt(900, 64), YE, 'center');
    });
    const kk = prog(b, t('car2') + 1.4, t('car2') + 1.7);
    if (kk > 0) alpha(tx, kk, () => { txt(tx, '同一台发动机', 960, 220, fnt(900, 56), OR, 'center'); });
    narrate(tx, L, S, NARR(K));
  },
  music(Sm, H, w) { groove(Sm, H, w.m.bars, Math.ceil(t('p0'))); H.hook(Sm, Math.ceil(t('p0')), 'bell', 0, 4, 8, .5); },
}, S);
};

// ======================================================================
// f06d 3D：直线赛道。同一台 Claude Opus 4.5 装进两辆车，跑 CORE-Bench；距离就是得分
R.f06d = K => {
const { F, E, TR, LOOK, prog, lerp, rgba, fnt, rr, txt, alpha, seq, narrate, scene } = K;
const S = seq([
  { id: 'hal0', say: '有人专门测过。Princeton 的 HAL 团队，2025 年 12 月：', src: 'Princeton HAL / Sayash Kapoor, 2025-12', srcUntil: 'end', hold: .5 },
  { id: 'hal1', say: '同一个 Claude Opus 4.5，做同一套测试 CORE-Bench——', gloss: ['CORE-Bench', '', '一套测试：让 AI 照着论文的代码和数据，复现出论文里的结果。'], until: 'other', hold: .5 },
  { id: 'rule0', say: '这条赛道上，开得越远，得分越高。', hold: .25 },
  { id: 'h0', say: '放在通用框架里，得分 42%；', hold: 1 },
  { id: 'h1', say: '放进 Claude Code，得分 78%；', hold: 1 },
  { id: 'h2', say: '修正了评分里的错误之后，到了 95%。', hold: 1.25 },
  { id: 'other', say: '换成别的模型，差距就小得多，有的反而在通用框架里表现更好。', hold: 1 },
  { id: 'both', say: '所以，模型和 harness，要放在一起看。', hold: 1.25 },
  { id: 'end', pause: .25 },
], { start: .5, tail: .5 });
const t = S.t;
const LEN = 2400, FRONT = 210, KF = 170; // 0%→x=0，100%→x=LEN；车头到车中心的距离
const LANES = { kart: -170, car: 170, kart2: -520, car2: 520 };
const RUN = { kart: [t('h0') + .2, t('h0') + 1.8, 0, .42], car: [t('h1') + .2, t('h1') + 2, 0, .78], fix: [t('h2') + .9, t('h2') + 1.9, .78, .95], kart2: [t('other') + .5, t('other') + 2.2, 0, .6], car2: [t('other') + .5, t('other') + 2.2, 0, .56] };
const P3 = {};
return scene({
  scene: '06 蓝图 3D · 同一台发动机', look: LOOK.FILM,
  desc: '3D 直线赛道：同一台 Claude Opus 4.5 发动机装进只有车架的卡丁车（通用框架）和整辆车（Claude Code），开得越远得分越高；卡丁车停在 42%，整车停在 78%；裁判 Clawd 挥旗修正评分，整车往前推到 95%；换一台别的发动机，两辆车停得很近，卡丁车还略靠前；镜头升起：模型和 harness 一起看。',
  enter: { kind: TR.FLASH, a: 0, b: .5, flash: .5 },
  hud: HUD(true),
  par: L => [.62, .35, .8, .7],
  lb: L => .45,
  pulse: () => 0,
  sfx: [[t('hal0') + .3, 'plot'], [t('hal1') + .4, 'zap'], [RUN.kart[0], 'whoosh'], [RUN.kart[1] - .3, 'stamp'], [RUN.car[0], 'whoosh'], [RUN.car[1] - .3, 'stamp'], [t('h2') + .4, 'whistle'], [RUN.fix[1] - .2, 'ding'], [RUN.kart2[0], 'whoosh'], [t('both') + .3, 'swoosh3d']],
  text: '通用框架Claude Code修正评分错误后别的模型Claude Opus 4.5CORE-Bench起点终点0%25%50%75%100%42%78%95%Princeton HAL · 2025-12同一台发动机开得越远，得分越高模型 + harness，一起看',
  three(T, U) {
    const k3 = K3(), { sc, key } = bpWorld(T, k3, '#071426');
    key.position.set(1200, 1600, 1200); key.target.position.set(1200, 0, 0);
    // 赛道：沥青、车道线、起点终点、每 25% 一块距离牌
    const asphalt = new T.Mesh(new T.PlaneGeometry(LEN + 1400, 1500), new T.MeshStandardMaterial({ color: k3.col(T, '#121a26'), roughness: .8 })); asphalt.rotation.x = -Math.PI / 2; asphalt.position.set(LEN / 2, 1, 0); asphalt.receiveShadow = true; sc.add(asphalt);
    const lineM = new T.MeshBasicMaterial({ color: 0xcfd8e6 });
    [-345, 0, 345, -700, 700].forEach(z => { for (let x = -500; x < LEN + 600; x += 120) { const d = new T.Mesh(new T.PlaneGeometry(60, 6), lineM); d.rotation.x = -Math.PI / 2; d.position.set(x, 2, z); sc.add(d); } });
    const chk = document.createElement('canvas'); chk.width = 64; chk.height = 512; { const x = chk.getContext('2d'); for (let i = 0; i < 4; i++) for (let j = 0; j < 32; j++) { x.fillStyle = (i + j) % 2 ? '#111' : '#f4f4f4'; x.fillRect(i * 16, j * 16, 16, 16); } }
    const ct = new T.CanvasTexture(chk);
    [0, LEN].forEach(x => { const m = new T.Mesh(new T.PlaneGeometry(60, 1400), new T.MeshBasicMaterial({ map: ct })); m.rotation.x = -Math.PI / 2; m.position.set(x, 2.5, 0); sc.add(m); });
    const markers = [0, .25, .5, .75, 1].map(p => { const s = k3.label(T, Math.round(p * 100) + '%', { font: '"JetBrains Mono",monospace', size: 40, bg: '#0b1a30', border: BP, col: WL, h: 60 }); s.position.set(p * LEN, 110, -820); sc.add(s); const pole = new T.Mesh(new T.BoxGeometry(6, 80, 6), k3.mat(T, '#5a6a80')); pole.position.set(p * LEN, 40, -820); sc.add(pole); return s; });
    const arch = new T.Group(); [-780, 780].forEach(z => { const p = new T.Mesh(new T.BoxGeometry(24, 420, 24), k3.mat(T, '#2b3a52', { m: .6 })); p.position.set(-40, 210, z); arch.add(p); }); const bar = new T.Mesh(new T.BoxGeometry(24, 30, 1584), k3.mat(T, '#2b3a52', { m: .6 })); bar.position.set(-40, 420, 0); arch.add(bar); sc.add(arch);
    const banner = k3.label(T, 'CORE-Bench', { font: '"JetBrains Mono",monospace', size: 56, bg: '#0b1a30', border: YE, col: YE, h: 80 }); banner.position.set(-30, 470, 0); banner.rotation.y = Math.PI / 2; sc.add(banner);
    // 灯塔
    [[600, -900], [1800, -900], [600, 900], [1800, 900]].forEach(([x, z]) => { const p = new T.Mesh(new T.BoxGeometry(14, 700, 14), k3.mat(T, '#2b3a52')); p.position.set(x, 350, z); sc.add(p); const s = new T.SpotLight(0xdfe9ff, 1.6, 2600, .6, .6, 1); s.position.set(x, 700, z); s.target.position.set(x, 0, 0); sc.add(s, s.target); });
    // 四辆车，同一台发动机（后两辆换一台灰色的）
    const mk = (kind, col, glow, lab) => { const c = buildCar(T, k3, kind, col), e = buildEngine(T, k3, { glow, col: kind === 'full' ? '#9aa6b8' : '#8a96a8' }); c.g.add(e.g); if (kind === 'full') { e.g.position.set(132, 62, 0); e.g.scale.setScalar(.9); } else { e.g.position.set(110, 40, 0); e.g.scale.setScalar(.8); } sc.add(c.g); const tag = k3.label(T, lab, { size: 26, bg: 'rgba(8,24,48,.9)', border: glow, col: '#ffe9d6', h: 24 }); c.g.add(tag); tag.position.set(kind === 'full' ? 132 : 110, kind === 'full' ? 170 : 140, 0); return { c, e, tag }; };
    const V = { kart: mk('kart', null, '#ff9a4d', 'Claude Opus 4.5'), car: mk('full', '#d97757', '#ff9a4d', 'Claude Opus 4.5'), kart2: mk('kart', null, '#8fb4ff', '别的模型'), car2: mk('full', '#6b7a90', '#8fb4ff', '别的模型') };
    V.car.c.bodyM.opacity = 1; V.car2.c.bodyM.opacity = 1;
    // 裁判 Clawd：站在终点线旁的台子上，修正评分时挥红旗
    const podium = new T.Mesh(new T.BoxGeometry(160, 60, 160), k3.mat(T, '#2b3a52', { m: .5 })); podium.position.set(LEN + 160, 30, 860); sc.add(podium);
    const me = k3.clawd(T, { px: 9 }); sc.add(me.g);
    const flag = new T.Group(); const stick = new T.Mesh(new T.CylinderGeometry(2.5, 2.5, 140, 8), k3.mat(T, '#ddd')); stick.position.y = 70; flag.add(stick); const cloth = new T.Mesh(new T.PlaneGeometry(70, 46), new T.MeshStandardMaterial({ color: k3.col(T, RD), side: T.DoubleSide })); cloth.position.set(36, 116, 0); flag.add(cloth); sc.add(flag);
    const W3 = new T.Vector3();
    const posOf = (name, b) => { if (name === 'car') { const r = RUN.car, f = RUN.fix; if (b >= f[0]) return lerp(f[2], f[3], E.io(prog(b, f[0], f[1]))); return lerp(r[2], r[3], E.out(prog(b, r[0], r[1]))); } const r = RUN[name]; return lerp(r[2], r[3], E.out(prog(b, r[0], r[1]))); };
    const rig = k3.rig([
      [0, [-1300, 700, 1300], [700, 0, 0], 40, 0],
      [t('hal1') - .2, [-120, 210, 520], [-150, 90, 0], 34, 1.4],
      [t('rule0'), [-700, 520, 1100], [900, 0, 0], 42, 1.2],
      [t('h0') + .2, [500, 650, 1000], [900, 40, -170], 42, 1.6],
      [t('h1') + .2, [800, 340, 1200], [1600, 40, 170], 42, 1.8],
      [t('h2'), [1650, 300, 750], [2150, 60, 170], 36, 1.2],
      [t('other') - .2, [1000, 1300, 2300], [1100, 0, 0], 50, 1.8],
      [t('both'), [900, 2300, 1700], [1100, 0, 0], 46, 2.2],
    ]);
    return { scene: sc, update(L, c) {
      const b = L.b, tt = L.t;
      U.renderer.toneMapping = T.ACESFilmicToneMapping; U.renderer.toneMappingExposure = 1.2;
      rig(b, tt, c);
      Object.entries(V).forEach(([name, v]) => {
        const p = posOf(name, b), x = p * LEN - (v.c.kind === 'full' ? FRONT : KF), vis = name.endsWith('2') ? b >= t('other') : true;
        v.c.g.visible = vis; setCar(v.c, x, LANES[name], p * LEN);
        v.tag.visible = vis && b >= t('hal1') - .3; v.tag.lookAt(c.position);
        v.e.glowM.color.set(name.endsWith('2') ? 0x8fb4ff : (b >= t('hal1') && b < t('rule0') ? (Math.sin(tt * 10) > 0 ? 0xffd75e : 0xff9a4d) : 0xff9a4d));
        P3[name] = k3.proj(T, c, W3.set(p * LEN, 230, LANES[name])); P3[name + 'p'] = p;
      });
      markers.forEach(m => m.lookAt(c.position)); banner.lookAt(c.position.x, banner.position.y, c.position.z);
      const fixing = b >= t('h2') && b < RUN.fix[1] + .6;
      me.set({ pose: fixing ? 'up' : b >= t('both') ? 'both' : b >= t('h0') && b < t('other') ? 'point' : 'idle', walk: -1, ph: tt * 8, eye: 0, blink: (tt % 2.7) < .1 });
      me.g.position.set(LEN + 160, 60, 860); me.g.rotation.y = Math.atan2(c.position.x - me.g.position.x, c.position.z - me.g.position.z);
      flag.visible = b >= t('h2'); flag.position.set(LEN + 220, 60, 860); flag.rotation.z = fixing ? Math.sin(tt * 9) * .5 : .1; cloth.material.color.set(fixing ? 0xff6b6b : 0x7dffb0);
      P3.hal = k3.proj(T, c, W3.set(-150, 190, 0));
      return true;
    } };
  },
  draw(cx, tx, L) {
    const b = L.b;
    K.three(cx, L);
    const kb = prog(b, t('hal0'), t('hal0') + .4) * (1 - prog(b, t('other') - .3, t('other')));
    if (kb > 0) alpha(tx, kb, () => { rr(tx, 1300, 120, 560, 104, 10, 'rgba(8,24,48,.85)', 'rgba(234,244,255,.3)', 2); txt(tx, 'Princeton HAL · 2025-12', 1330, 160, fnt(700, 30, F.mono), YE); txt(tx, 'CORE-Bench · 同一个 Claude Opus 4.5', 1330, 200, fnt(700, 26), WL); });
    const ks = prog(b, t('hal1') + .6, t('hal1') + 1) * (1 - prog(b, t('rule0') - .2, t('rule0')));
    const kr = prog(b, t('rule0') + .2, t('rule0') + .5) * (1 - prog(b, t('h0') + .2, t('h0') + .5));
    if (kr > 0) alpha(tx, kr, () => txt(tx, '开得越远，得分越高', 1100, 330, fnt(900, 56), WL, 'center'));
    // 每辆车头上的名字和分数
    const tag = (name, lab, col, shown, score) => {
      const p0 = P3[name]; if (!p0 || !p0[2] || !shown) return;
      const kk = typeof shown === 'number' ? shown : 1;
      alpha(tx, kk, () => { tx.font = fnt(900, 30); const w = Math.max(tx.measureText(lab).width, score ? 120 : 0) + 40, hh = score ? 108 : 56, p = [Math.max(w / 2 + 40, Math.min(1880 - w / 2, p0[0])), Math.max(hh + 150, p0[1])];
        rr(tx, p[0] - w / 2, p[1] - hh - 20, w, hh, 10, 'rgba(8,24,48,.9)', col, 3); txt(tx, lab, p[0], p[1] - hh + 8, fnt(900, 30), WL, 'center'); if (score) txt(tx, score, p[0], p[1] - 46, fnt(800, 44, F.mono), col, 'center'); });
    };
    const before = 1 - prog(b, t('other') - .3, t('other'));
    if (b >= t('rule0') && before > 0) alpha(tx, before, () => {
      const kd = b >= RUN.kart[1] - .3, cd = b >= RUN.car[1] - .3, fd = b >= RUN.fix[1] - .2;
      tag('kart', '通用框架', OR, 1, kd ? '42%' : null);
      tag('car', fd ? '修正评分错误后' : 'Claude Code', fd ? YE : GN, 1, fd ? '95%' : cd && b < t('h2') + .9 ? '78%' : cd ? Math.round(P3.carp * 100) + '%' : null);
    });
    if (b >= t('other') + .3) {
      const k = prog(b, t('other') + .3, t('other') + .6) * (1 - prog(b, t('both') + .2, t('both') + .6));
      tag('kart2', '别的模型 · 通用框架', '#8fb4ff', k, null); tag('car2', '别的模型 · Claude Code', '#8fb4ff', k, null);
    }
    const kf = prog(b, t('both') + .4, t('both') + .8);
    if (kf > 0) alpha(tx, kf, () => txt(tx, '模型 + harness，一起看', 960, 230, fnt(900, 64), YE, 'center'));
    narrate(tx, L, S, NARR(K));
  },
  music(Sm, H, w) { groove(Sm, H, w.m.bars, 1); [RUN.kart[0], RUN.car[0]].forEach(a => Sm.add('riser', Math.floor(a), (a % 1) * 4, 0, 6, .35)); Sm.add('crash', Math.floor(RUN.fix[1]), (RUN.fix[1] % 1) * 4, 0, 0, .5); },
}, S);
};

// ======================================================================
// f06e 2D 蓝图：六级梯子；RedAccess；选工具七项；规则 5；课程路线；Agent 抢文件
R.f06e = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, clawd, clamp01, seq, narrate, scene } = K;
const S = seq([
  { id: 'ladder0', say: '市面上的编程工具，按自主程度从低到高，大概有六级：' },
  { id: 'l0', say: '行内补全：你打字的时候，帮你补下一段。' },
  { id: 'l1', say: '对话面板：问答、解释、生成代码片段。' },
  { id: 'l2', say: 'IDE 里的 Agent：比如 Qoder、Trae、Cursor。', gloss: ['IDE', '集成开发环境', '写代码用的软件，比如 IntelliJ IDEA。'], until: 'up' },
  { id: 'l3', say: '命令行 Agent：比如 Claude Code、Codex CLI。' },
  { id: 'l4', say: '云端后台 Agent：在云上跑完，直接把改动提交给你。' },
  { id: 'l5', say: '应用生成平台：比如 Lovable、Bolt、v0，一句话生成整个应用。' },
  { id: 'up', say: '越往上，AI 自己干的越多，你亲眼看的代码就越少。' },
  { id: 'up2', say: '检查和隔离，就越得靠流程来兜底。', hold: .5 },
  { id: 'ra0', say: '举个例子。2026 年 5 月，RedAccess 扫描了约 38 万个用 Lovable、Base44、Replit 等平台生成的公开应用。', src: 'RedAccess via Security Boulevard, 2026-05', srcUntil: 'spec' },
  { id: 'ra1', say: '其中约 5000 个，把病历、银行记录这类敏感数据，暴露在外。', hold: .5 },
  { id: 'ra2', say: '主要原因：这些平台默认公开，用户没改成私有。', hold: .5 },
  { id: 'spec', say: '所以，挑工具的时候，看这七项：', hold: 2.5 },
  { id: 'spec4', say: '尤其是第四项：权限怎么控制，改坏了能不能撤销。', hold: .75 },
  { id: 'rule', rule: [5, '弄清工具的权限设置和撤销方式'], dur: 3.5 },
  { id: 'route0', say: '给这门课的建议：' },
  { id: 'r0', say: '先用 IDEA 里的 Qoder；' },
  { id: 'r1', say: '熟悉了 Git 和命令行，再试命令行 Agent；' },
  { id: 'r2', say: '应用生成平台，只拿来做原型。', hold: .5 },
  { id: 'fight', say: '另外：别让好几个 Agent 同时改同一批文件。它们会打架。', hold: 1.25 },
], { start: .75, tail: .5 });
const t = S.t;
const RAT = RUNG.map((_, i) => t('l' + i));
return scene({
  scene: '06 蓝图 · 选工具', look: LOOK.PRINT,
  desc: '六级工具梯子；RedAccess 点阵和默认公开；选工具七项；规则 5；这门课的路线；两个 Agent 抢一个文件。',
  enter: { kind: TR.WIPE, a: 0, b: 1, col: '#9fd8ff' },
  hud: HUD(true),
  par: L => [.1, 0, 0, 0],
  cam: L => [1 + .006 * Math.sin(L.t * .4), 0, 0, 0],
  pulse: L => .4,
  sfx: [...RAT.map((a, i) => [a, 'blip', 700 + i * 120]), [t('ra1'), 'tick'], [t('ra1') + .5, 'alarm'], ...SEVEN.map((_, i) => [t('spec') + .3 + i * .35, 'click']), [t('r0'), 'blip', 900], [t('r1'), 'blip', 1100], [t('r2'), 'blip', 1300], [t('fight') + .8, 'shatter']],
  text: RUNG.flat().join('') + SEVEN.join('') + ROUTE.join('') + '新建应用可见性公开（默认）Agent 1 改这里Agent 2 改这里冲突：互相覆盖亲眼看的代码需要的检查和隔离选工具，看这七项SPEC · 07这门课的路线UserService.java约 38 万个公开应用约 5000 个暴露了敏感数据',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    // ---------- 梯子 ----------
    const kl = prog(b, t('ladder0') - .3, t('ladder0')) * (1 - prog(b, t('ra0') - .3, t('ra0')));
    if (kl > 0) alpha(cx, kl, () => {
      const lx = 1060, rx = 1280, yb = 900, gap = 110;
      seg(cx, lx, yb + 30, lx, yb - gap * 6, WL, 4); seg(cx, rx, yb + 30, rx, yb - gap * 6, WL, 4);
      RUNG.forEach(([n, ex], i) => {
        const on = b >= RAT[i], y = yb - gap * i, top = i === 5 && b >= t('up2');
        const c = top ? RD : on ? YE : rgba(WL, .4); seg(cx, lx, y, rx, y, c, on ? 6 : 3);
        alpha(tx, kl * (on ? 1 : .35), () => { txt(tx, n, rx + 40, y - 16, fnt(900, 36), top ? RD : WL); txt(tx, ex, rx + 40, y + 22, fnt(600, 26), on ? YE : DIM); });
      });
      const lv = clamp01(prog(b, t('up'), t('up2') + 1, E.io));
      [[860, '亲眼看的代码', 1 - lv * .85, OR], [560, '需要的检查和隔离', .15 + lv * .85, GN]].forEach(([x, n, v, col]) => {
        alpha(cx, prog(b, t('up'), t('up') + .3), () => { cx.strokeStyle = WL; cx.lineWidth = 2; cx.strokeRect(x - 30, 320, 60, 560); cx.fillStyle = rgba(col, .8); cx.fillRect(x - 24, 874 - 548 * v, 48, 548 * v); alpha(tx, kl, () => txt(tx, n, x, 285, fnt(900, 30), col, 'center')); });
      });
    });
    // ---------- RedAccess 点阵 ----------
    const kd = prog(b, t('ra0'), t('ra0') + .3) * (1 - prog(b, t('spec') - .3, t('spec')));
    if (kd > 0) alpha(cx, kd, () => {
      const cols = 64, rows = 26, x0 = 860, y0 = 380, s = 14;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const id = j * cols + i, red = hash(id * 1.37) < .013, k = prog(b, t('ra0') + (i / cols) * 1.2, t('ra0') + .2 + (i / cols) * 1.2);
        if (k <= 0) continue;
        const lit = red && b >= t('ra1'), x = x0 + i * s, y = y0 + j * s;
        cx.fillStyle = lit ? RD : rgba(WL, .55); cx.fillRect(x, y, lit ? 10 : 6, lit ? 10 : 6);
        if (lit) { cx.strokeStyle = rgba(RD, .7 * (.5 + .5 * Math.sin(tt * 6 + id))); cx.lineWidth = 2; cx.strokeRect(x - 6, y - 6, 22, 22); }
      }
      const kpub = prog(b, t('ra2'), t('ra2') + .3);
      if (kpub > 0) alpha(tx, kpub, () => { const px = 160, py = 520; tx.strokeStyle = WL; tx.lineWidth = 2; tx.strokeRect(px, py, 560, 200); txt(tx, '新建应用', px + 30, py + 44, fnt(900, 34), WL); txt(tx, '可见性', px + 30, py + 130, fnt(700, 34), WL); rr(tx, px + 220, py + 100, 300, 60, 30, rgba(RD, .25), RD, 3); txt(tx, '公开（默认）', px + 370, py + 130, fnt(900, 32), RD, 'center'); });
      alpha(tx, kd, () => { txt(tx, '约 38 万个公开应用', x0, 330, fnt(900, 34), WL); const k2 = prog(b, t('ra1'), t('ra1') + .3); alpha(tx, k2, () => txt(tx, '约 5000 个暴露了敏感数据', x0 + 896, 330, fnt(900, 34), RD, 'right')); });
    });
    // ---------- 七项规格表 ----------
    const ks = prog(b, t('spec'), t('spec') + .3) * (1 - prog(b, t('route0') - .3, t('route0')));
    if (ks > 0) alpha(tx, ks, () => {
      const x = 860, y = 230, w = 940;
      tx.strokeStyle = WL; tx.lineWidth = 2; tx.strokeRect(x, y, w, 620); seg(tx, x, y + 80, x + w, y + 80, WL, 2);
      txt(tx, '选工具，看这七项', x + 30, y + 42, fnt(900, 38), WL); txt(tx, 'SPEC · 07', x + w - 30, y + 42, fnt(700, 24, F.mono), YE, 'right');
      SEVEN.forEach((s, i) => {
        const yy = y + 130 + i * 74, on = b >= t('spec') + .3 + i * .35, hl = i === 3 && b >= t('spec4');
        if (hl) { tx.fillStyle = rgba(YE, .14); tx.fillRect(x + 4, yy - 34, w - 8, 68); }
        seg(tx, x, yy + 37, x + w, yy + 37, rgba(WL, .25), 1);
        tx.strokeStyle = on ? YE : rgba(WL, .5); tx.lineWidth = 3; tx.strokeRect(x + 30, yy - 16, 32, 32);
        if (on) { tx.beginPath(); tx.moveTo(x + 36, yy); tx.lineTo(x + 44, yy + 9); tx.lineTo(x + 58, yy - 10); tx.stroke(); }
        txt(tx, s, x + 86, yy, fnt(hl ? 900 : 700, 32), hl ? YE : WL);
      });
    });
    // ---------- 课程路线 ----------
    const kr = prog(b, t('route0'), t('route0') + .3) * (1 - prog(b, t('fight') - .3, t('fight')));
    if (kr > 0) alpha(tx, kr, () => {
      txt(tx, '这门课的路线', 560, 300, fnt(900, 48), YE);
      ROUTE.forEach((s, i) => { const k = prog(b, t('r' + i), t('r' + i) + .3); if (k <= 0) return; alpha(tx, k, () => { circ(tx, 590, 420 + i * 140, 30, null, YE, 3); txt(tx, String(i + 1), 590, 421 + i * 140, fnt(900, 32, F.mono), YE, 'center'); txt(tx, s, 650, 420 + i * 140, fnt(800, 46), WL); }); });
    });
    // ---------- 抢文件 ----------
    const ka = prog(b, t('fight'), t('fight') + .3);
    if (ka > 0) {
      const tear = prog(b, t('fight') + .8, t('fight') + 1.2, E.out), x = 960, y = 560;
      alpha(cx, ka, () => [-1, 1].forEach(sd => { cx.save(); cx.translate(sd * tear * 60, 0); cx.beginPath(); cx.rect(sd < 0 ? x - 240 : x, y - 150, 240, 300); cx.clip(); cx.strokeStyle = WL; cx.lineWidth = 4; cx.strokeRect(x - 230, y - 140, 460, 280); cx.fillStyle = rgba(WL, .35); for (let r = 0; r < 5; r++) cx.fillRect(x - 190, y - 60 + r * 40, 300 - (r % 3) * 60, 10); cx.restore(); }));
      alpha(tx, ka, () => { txt(tx, 'UserService.java', 960, 455, fnt(700, 32, F.mono), WL, 'center'); txt(tx, 'Agent 1 改这里', 560, 380, fnt(900, 34), YE, 'center'); txt(tx, 'Agent 2 改这里', 1360, 380, fnt(900, 34), OR, 'center'); if (tear > .3) txt(tx, '冲突：互相覆盖', 960, 790, fnt(900, 52), RD, 'center'); });
    }
    // ---------- Clawd：线框 ----------
    let st = { x: 1760, y: 800, px: 12, skin: 'wire', col: YE, pose: 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: 0, alpha: 1 };
    const SPOT = [['ra0', 1760, 800, 'idle'], ['ra2', 860, 860, 'pointL'], ['spec', 500, 660, 'point'], ['route0', 1620, 780, 'idle']];
    let sp = null; SPOT.forEach(q => { if (b >= t(q[0])) sp = q; });
    if (b < t('ra0')) { let i = -1; RAT.forEach((a, j) => { if (b >= a) i = j; }); const k = i >= 0 ? prog(b, RAT[i], RAT[i] + .4, E.io) : 0; st = { ...st, px: 10, x: 1170, y: 900 - 110 * Math.max(0, i - 1 + k) - 4, pose: 'up', walk: tt * 12 }; if (b >= t('up2')) { st.sweat = b; st.pose = 'idle'; } }
    else if (sp && b < t('fight')) {
      const k = prog(b, t(sp[0]), t(sp[0]) + .35, E.io), prev = SPOT[SPOT.indexOf(sp) - 1] || sp;
      st = { ...st, x: lerp(prev[1], sp[1], k), y: lerp(prev[2], sp[2], k) - Math.sin(Math.PI * k) * 90, pose: sp[3] };
      if (sp[0] === 'ra0' && b >= t('ra1')) { st.sweat = b; st.eye = -1; }
      if (sp[0] === 'spec' && b >= t('spec4')) st.pose = 'up';
      if (sp[0] === 'route0') { st.pose = 'type'; st.ph = tt * 18; }
    }
    if (b >= t('fight')) { const k = prog(b, t('fight') + .3, t('fight') + .7, E.io), tear = prog(b, t('fight') + .8, t('fight') + 1.2, E.out); clawd(cx, { ...st, px: 16, x: lerp(420, 640, k) - tear * 80, y: 600, pose: 'push', walk: tt * 20, col: YE }); st = { ...st, px: 16, x: lerp(1500, 1280, k) + tear * 80, y: 600, pose: 'push', walk: tt * 20, col: OR, eye: -1 }; }
    clawd(cx, st);
    narrate(tx, L, S, NARR(K));
  },
  music(Sm, H, w) {
    const B = w.m.bars; groove(Sm, H, B, 0);
    H.hook(Sm, 0, 'bell', 0, 4, 8, .45);
    RAT.forEach((a, i) => Sm.add('bell', a, 0, [74, 76, 77, 79, 81, 84][i], 2.5, .6));
    H.roll(Sm, B - 1, 2, 4, 'snare', 'main', .2, .7, .25);
  },
}, S);
};
})();
