// 第二章 · 21:10「你还记得吧？」：AI 写代码时在做什么
// f02a 现实：你问它还记不记得上周的代码；对方正在输入了很久；「我不记得你。」
// f02b 轨道：深空里一圈金属光环 = 上下文窗口；圈外看不见；窗口里的四样东西；容量上限和 token；训练截止和编出来的方法；
//      Agent 的循环（3D 玻璃管轨道）；每圈多塞一点，context rot，压缩丢细节；你能动手脚的三处
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f02a = K => window.MV_REAL(K, {
  scene: '02 · 21:10 你还记得吧？',
  desc: '你问它还记不记得上周的代码；对方正在输入了很久，台灯闪了一下：「我不记得你。」',
  clock: [21, 10], stamp: ['周五', '21:10'],
  steps: [
    { pause: 1 },
    { id: 'ask', you: '对了，接着上周那份代码写。你还记得吧？' },
    { id: 'no', me: '我不记得你。', wait: 2.2, hold: .5 },
    { id: 'huh', you: '……啊？', enter: false },
    { me: '不是忘了。是我从来就没有「记住」这回事。' },
    { id: 'go', me: '我带你进去看看。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'over', 0], [S.t('no'), 'screen', 2.6, 'io'], [S.t('huh'), 'face', 1.2], [S.t('go'), 'over', 1.5], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: (L, S) => ({ rain: 1, flicker: K.bump(L.b, S.t('no') + 2.75, .12) }),
  figure: (L, S) => ({ type: L.b >= S.t('ask') && L.b < S.t('ask') + 1 ? 1 : 0, lean: K.prog(L.b, S.t('huh'), S.t('huh') + .3) * .5 * (1 - K.prog(L.b, S.t('go'), S.t('go') + .6)) }),
  mood: (L, S) => [.62 - .12 * K.prog(L.b, S.t('no'), S.t('no') + 2.6) * (1 - K.prog(L.b, S.t('huh'), S.t('huh') + 1)), .4, .9, .7],
  sfx: S => [[S.t('no') + 2.7, 'thunder'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, 1);
    S.add('pad', 0, 0, H.CH.Dm.pad, 6, .35, 'string');
    S.add('kick', Math.floor(M.t('no')), 0, 0, 0, .5, 'heart'); S.add('kick', Math.floor(M.t('no')) + 1, 0, 0, 0, .5, 'heart');
    S.add('mute', M.t('no') + 2.3, 0, 0, 1.2);
    S.add('piano', M.t('no') + 2.7, 0, [38, 50], 6, .6);
    S.add('pad', Math.ceil(M.t('huh')), 0, H.CH.Bb.pad, 8, .35, 'dark');
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .5);
  },
});

R.f02b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, alpha, lyric, clawd, seq, narrate, scene, arrow } = K;
const WC = [700, 560], WR = 330, ORB = 215;
const KINDS = [['系统设定', '#7cb7ff', '工具写给我的说明'], ['你说的话', '#a5d67a', '对话里的每一句'], ['读过的文件', '#f2d36a', '项目里的代码'], ['命令输出', '#b8bcc8', '编译、测试的结果']];
const NODES = [['读文件', -Math.PI / 2], ['想下一步', 0], ['调工具', Math.PI / 2], ['看结果', Math.PI]];
const OUTSIDE = [['上周的对话', 1480, 230], ['你别的项目文件', 1620, 820], ['上上周的需求', 260, 160], ['v5.0 新版本的库', 1350, 640]];
const S = seq([
  { id: 'void', say: '这里，是我「看得见」的地方。' },
  { id: 'win', say: '每次回答你，我能看到的，只有这个圈里的东西。' },
  { id: 'g1', say: '这个圈，叫上下文窗口。', gloss: ['上下文窗口', 'context window', '我一次能看到的全部内容。圈外的东西，对我来说不存在。'], gx: 1180, until: 'cap' },
  { id: 'out', say: '圈外漂着的——上周的对话、你别的项目文件——我都看不见。', hold: .5 },
  { id: 'why', say: '所以上周的事，我是真的不记得：它不在窗口里。' },
  { id: 'in0', say: '窗口里，一般装着四样东西：' },
  { id: 'k1', say: '系统设定：工具事先写给我的说明，你平时看不见。' },
  { id: 'k2', say: '你说的话：你在对话里发的每一句。' },
  { id: 'k3', say: '我读过的文件：比如你项目里的代码。' },
  { id: 'k4', say: '命令的输出：编译、运行、测试的结果。', hold: .5 },
  { id: 'cap', say: '而且，这个窗口有容量上限。' },
  { id: 'tok', say: '能装多少，是按 token 算的。', gloss: ['token', '', '计算长度和计费的单位。大约一个英文词，或者一两个汉字。'], gx: 1180, until: 'cut0' },
  { id: 'full', say: '装满了，就塞不进去了。满了会怎样，等会儿说。', hold: .5 },
  { id: 'cut0', say: '还有一件事。' },
  { id: 'cut', say: '我的知识，停在训练截止的那一天。', gloss: ['训练截止', 'training cutoff', '模型学习资料的截止日期。那之后发生的事，它没见过。'], gx: 1180, until: 'ag0' },
  { id: 'new', say: '那之后才发布的新版本库，我没见过。' },
  { id: 'fake', say: '我可能照着老写法写，甚至编出一个根本不存在的方法。', hold: .5 },
  { id: 'look', say: '而且编得很像真的。所以看到陌生的方法名，先去查一下。', hold: .5 },
  { id: 'ag0', say: '再看看我是怎么干活的。' },
  { id: 'ag', say: '现在的编程助手，大多是 Agent，也叫智能体。', gloss: ['Agent', '智能体', '能自己调用工具、一轮一轮干活，直到完成任务的 AI。'], gx: 1180, until: 'fill' },
  { id: 'loop', say: '我干活是一个循环：' },
  { id: 'n0', say: '读文件，', dur: 1 },
  { id: 'n1', say: '想下一步，', dur: 1 },
  { id: 'n2', say: '调用工具——改代码，或者跑命令，', dur: 1.75 },
  { id: 'n3', say: '看结果。', dur: 1.25 },
  { id: 'again', say: '然后再想下一步……一圈一圈，直到我觉得做完了。', hold: 1 },
  { id: 'fill', say: '问题是：每转一圈，窗口里就多塞进一点东西。', hold: .5 },
  { id: 'rot', say: '塞得越满，我越容易漏看、搞混。', hold: .5 },
  { id: 'chroma', say: '这不只是我的毛病。Chroma 在 2025 年测了 18 个模型：输入越长，表现越不稳，简单任务也一样。', src: 'Chroma, Context Rot, 2025-07', srcUntil: 'three' },
  { id: 'cr', say: '这个现象，叫 context rot。', gloss: ['context rot', '上下文腐烂', '窗口里塞的东西越多，模型的表现越不稳定。'], gx: 1180, until: 'comp' },
  { id: 'comp', say: '窗口真满了，工具会把前面的内容压缩成一段摘要。' },
  { id: 'lost', say: '细节，也就跟着丢了。', hold: 1 },
  { id: 'three', say: '所以，想让我干得好，你能动手脚的地方有三处：' },
  { id: 's1', say: '给我看什么——提示词和上下文。' },
  { id: 's2', say: '用哪个模型。' },
  { id: 's3', say: '用什么工具来运行我。' },
  { id: 'order', say: '今晚，我们就按这个顺序来。', hold: 1.5 },
], { start: 2.8, tail: .5 });
const t = S.t;
const SH = t('three');
const NB = [t('n0'), t('n1'), t('n2'), t('n3')];
const LAP0 = t('n0'), LAPF = t('again') + .2;
// 节点：讲解时一个一个亮；「一圈一圈」时一拍一个快速转
function nodeOn(b) {
  if (b < LAP0 || b >= t('rot')) return -1;
  if (b < LAPF) { let k = -1; NB.forEach((a, i) => { if (b >= a) k = i; }); return k; }
  return ((Math.floor((b - LAPF) * 4) % 4) + 4) % 4;
}
function clawdAng(b) { const q = (b - LAPF) * 4; return -Math.PI / 2 + (Math.floor(q) + prog(q % 1, 0, .5, E.io)) * Math.PI / 2; }
function angAt(b) { // 讲解阶段：走到当前节点
  if (b >= LAPF) return clawdAng(b);
  const k = nodeOn(b); if (k <= 0) return -Math.PI / 2;
  return -Math.PI / 2 + (k - 1 + prog(b, NB[k], NB[k] + .4, E.io)) * Math.PI / 2;
}
// 窗口里的层：四样东西（第一圈前）、每圈一层、压缩前再塞六层
const LAPS = [0, 1, 2, 3].map(i => LAPF + 1 + i);
const BANDS = [...KINDS.map(k => [t('loop'), k[1], k[0]]), ...LAPS.map((a, i) => [Math.min(a, t('fill') + .5 + i * .5), ['#c792ea', '#5fd4c8', '#f07178', '#f2a65a'][i], `第 ${i + 1} 圈`]),
  ...[0, 1, 2, 3, 4, 5].map(i => [t('rot') + i * .25, ['#7cb7ff', '#a5d67a', '#c792ea', '#f2d36a', '#5fd4c8', '#f07178'][i], ''])];
const BH = 40;
const STAR = [['给我看什么', '提示词 · 上下文', 's1', 300], ['用哪个模型', '', 's2', 520], ['用什么工具运行我', '', 's3', 740]];
return scene({
  scene: '02 轨道 · AI 在做什么', look: LOOK.ORBIT,
  desc: '上下文窗口和圈外的黑暗；窗口里的四样东西；token 和容量上限；训练截止；Agent 的循环；context rot 和压缩；能动手脚的三处。',
  enter: { kind: TR.IRIS, a: 0, b: 2.5, p: [.5, .5, 0, 0], col: '#9fd8ff' },
  hud: { num: '02', name: 'AI 写代码时在做什么', time: '21:10', line: '你还记得吧？', ink: '#e6efff', acc: '#9fd8ff', card: [1180, 400], mv: [2.1, 2.6] },
  par: L => { const b = L.b, sh = prog(b, SH, SH + .6, E.io), r = (WR / 1080) * prog(b, .4, 1.6, E.out) * (1 - .25 * sh), cx0 = lerp(WC[0], 560, sh); return [cx0 / 1920, WC[1] / 1080, r, .05 + .6 * bump(b, t('out') + 1.5, 1.4)]; },
  cam: L => [1.03 + .02 * Math.sin(L.t * .3), .015 * Math.sin(L.t * .17), .01 * Math.sin(L.t * .2), 0],
  pulse: L => .5,
  sfx: [[t('void'), 'swish'], [t('out'), 'whoosh'], ...KINDS.map((_, i) => [t('k' + (i + 1)) + .1, 'pop']), [t('cap'), 'click'], [t('cut'), 'freeze'], [t('fake') + .4, 'glitch'], [t('ag'), 'swish'],
    ...NB.map((a, i) => [a, 'blip', [700, 880, 1040, 1320][i]]), ...LAPS.map(a => [a, 'thud']), [t('comp'), 'tape'], [t('lost'), 'whoosh'], ...STAR.map(([, , id], i) => [t(id), 'chime', [1319, 1568, 1976][i]]), [t('order') + .4, 'sparkle']],
  text: KINDS.flat().join('') + NODES.map(n => n[0]).join('') + OUTSIDE.map(o => o[0]).join('') + '容量上限训练截止❄oldLogin()loginMagic()不存在的方法压缩后的摘要细节第 1 圈第 2 圈第 3 圈第 4 圈→ 03 · 04 → 05 → 06提示词 · 上下文',
  three(T, U) {
    const scene3 = new T.Scene();
    scene3.add(new T.AmbientLight(0x223355, 1.2));
    const d1 = new T.DirectionalLight(0xbfe4ff, 2.2); d1.position.set(-500, 700, 900); scene3.add(d1);
    const d2 = new T.DirectionalLight(0x5570ff, 1.2); d2.position.set(600, -400, 300); scene3.add(d2);
    const ring = new T.Mesh(new T.TorusGeometry(1, .03, 24, 160), new T.MeshStandardMaterial({ color: 0x6f9be0, metalness: .85, roughness: .22, emissive: 0x16305a, transparent: true }));
    const rim = new T.Mesh(new T.TorusGeometry(.985, .006, 8, 160), new T.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true }));
    const spark = new T.Mesh(new T.SphereGeometry(.03, 16, 12), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
    const win = new T.Group(); win.add(ring, rim, spark); scene3.add(win);
    const tube = new T.Mesh(new T.TorusGeometry(ORB, 9, 16, 160), new T.MeshStandardMaterial({ color: 0x9fd8ff, metalness: .1, roughness: .05, transparent: true, opacity: .28, emissive: 0x0d2a48, depthWrite: false }));
    const nodes = NODES.map(() => new T.Mesh(new T.SphereGeometry(13, 24, 16), new T.MeshStandardMaterial({ color: 0x9fd8ff, emissive: 0x9fd8ff, emissiveIntensity: .2, roughness: .3, transparent: true })));
    const trail = Array.from({ length: 14 }, () => new T.Mesh(new T.SphereGeometry(6, 10, 8), new T.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, depthWrite: false })));
    const orb = new T.Group(); orb.add(tube, ...nodes, ...trail); scene3.add(orb);
    // 训练截止：一块冻住的日历（3D 平板，斜光扫过）
    const cal = new T.Group(); scene3.add(cal);
    const calB = new T.Mesh(new T.BoxGeometry(220, 150, 18), new T.MeshStandardMaterial({ color: 0xdfefff, roughness: .35, metalness: .1 }));
    const calT = new T.Mesh(new T.BoxGeometry(222, 40, 20), new T.MeshStandardMaterial({ color: 0x7cb7ff, roughness: .4 })); calT.position.y = 56;
    const ice = new T.Mesh(new T.BoxGeometry(240, 170, 40), new T.MeshStandardMaterial({ color: 0xbfe6ff, transparent: true, opacity: .25, roughness: .05, metalness: .2 }));
    cal.add(calB, calT, ice);
    return {
      scene: scene3,
      update(L) {
        const b = L.b, tt = L.t, sh = prog(b, SH, SH + .6, E.io), wx = lerp(WC[0], 560, sh), wr = WR * (1 - .25 * sh), kw = prog(b, .4, 1.6, E.out);
        win.visible = kw > 0;
        U.at(win, wx, WC[1], 0); win.scale.setScalar(Math.max(1e-3, wr * (.85 + .15 * kw)));
        win.rotation.set(.06 * Math.sin(tt * .3), .05 * Math.sin(tt * .23), 0);
        ring.material.opacity = kw; rim.material.opacity = kw * (.5 + .3 * Math.sin(tt * 2));
        const hit = Math.max(...KINDS.map((_, i) => L.hit(t('k' + (i + 1)) + .3, .3)), ...LAPS.map(a => L.hit(a, .3)), L.hit(t('cap'), .5));
        ring.material.emissiveIntensity = 1 + 2.5 * hit + 2 * prog(b, t('order'), t('order') + 1);
        const a = tt * 1.3; spark.position.set(Math.cos(a), Math.sin(a), .03); spark.material.opacity = kw;
        const ko = prog(b, t('loop'), t('loop') + .4) * (1 - prog(b, t('comp'), t('comp') + .5));
        orb.visible = ko > 0;
        if (orb.visible) {
          U.at(orb, wx, WC[1] - 30, 20);
          tube.material.opacity = .28 * ko;
          const on = nodeOn(b);
          nodes.forEach((n, i) => { const ang = NODES[i][1]; n.position.set(Math.cos(ang) * ORB, -Math.sin(ang) * ORB, 0); n.material.opacity = ko; n.material.emissiveIntensity = i === on ? 1.6 : .15; n.scale.setScalar(i === on ? 1.3 : 1); });
          const lap = b >= LAPF && b < t('rot');
          trail.forEach((m, j) => { m.visible = lap; if (!lap) return; const ang = angAt(b - j * .03); m.position.set(Math.cos(ang) * ORB, -Math.sin(ang) * ORB, 12); m.material.opacity = .6 * (1 - j / 14) * ko; m.scale.setScalar(1 - j / 20); });
        }
        const kc = prog(b, t('cut'), t('cut') + .4, E.out) * (1 - prog(b, t('ag0') - .3, t('ag0')));
        cal.visible = kc > 0;
        if (cal.visible) { U.at(cal, wx + 30, WC[1] - 120, 60); cal.rotation.set(-.15 + .05 * Math.sin(tt * .5), -.35 + .1 * Math.sin(tt * .4), .05); cal.scale.setScalar(U.back(kc)); ice.material.opacity = .25 * prog(b, t('cut') + .5, t('cut') + 1); }
        return true;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, sh = prog(b, SH, SH + .6, E.io), wx = lerp(WC[0], 560, sh), wy = WC[1], wr = WR * (1 - .25 * sh), has3d = !!window.THREE;
    // 圈外漂着的东西（着色器只让窗口里看得见；讲「圈外」时短暂显形）
    OUTSIDE.forEach(([s, x, y], i) => {
      const xx = x + Math.sin(tt * .4 + i) * 40, yy = y + Math.cos(tt * .33 + i * 2) * 30;
      rr(cx, xx - 160, yy - 34, 320, 68, 34, 'rgba(120,150,210,.35)', 'rgba(170,200,255,.7)', 2);
      txt(cx, s, xx, yy, fnt(500, 26), '#e6efff', 'center');
    });
    if (!has3d) { cx.strokeStyle = '#9fd8ff'; cx.lineWidth = 6; cx.beginPath(); cx.arc(wx, wy, wr, 0, 6.283); cx.stroke(); }
    // 容量上限
    const kc = prog(b, t('cap'), t('cap') + .35) * (1 - prog(b, SH, SH + .4));
    if (kc > 0) alpha(tx, kc, () => { const a = -2.4, x = wx + Math.cos(a) * (wr + 6), y = wy + Math.sin(a) * (wr + 6); rr(tx, x - 132, y - 46, 150, 40, 20, 'rgba(10,20,40,.9)', '#9fd8ff', 2); txt(tx, '容量上限', x - 57, y - 26, fnt(700, 22), '#9fd8ff', 'center'); });
    // 窗口里一层层装填
    const lv = BANDS.map(([at]) => prog(b, at, at + .25, E.out)), bottom = wy + wr - 6, comp = prog(b, t('comp') + .3, t('comp') + .9, E.io);
    cx.save(); cx.beginPath(); cx.arc(wx, wy, wr - 4, 0, 6.283); cx.clip();
    let y = bottom;
    BANDS.forEach(([at, col, lab], i) => {
      const k = lv[i]; if (k <= 0) return;
      const squash = i < 10 ? lerp(1, .32, comp) : 1, h = BH * squash, yy = lerp(wy - wr - 60, y - h, k);
      const blur = i < 8 && b > t('rot') + .4 ? Math.min(6, (b - t('rot') - .4) * 6) * (1 - comp * .5) : 0;
      if (blur > .5) cx.filter = `blur(${blur.toFixed(1)}px)`;
      cx.fillStyle = rgba(col, .85); cx.fillRect(wx - wr, yy, wr * 2, h - 3);
      if (k > .9 && squash > .6 && blur < .5) { cx.fillStyle = rgba('#ffffff', .14); cx.fillRect(wx - wr + 8, yy, wr * 2 - 16, 4); }
      if (lab && squash > .6) txt(cx, lab, wx, yy + h / 2, fnt(700, 22), '#0b1020', 'center');
      cx.filter = 'none'; y -= h * k;
    });
    if (comp > 0) alpha(cx, comp, () => txt(cx, '压缩后的摘要', wx, bottom - BH * 10 * .32 / 2 - 2, fnt(700, 22), '#0b1020', 'center'));
    cx.restore();
    const fill = bottom - y;
    // 细节四散
    if (b >= t('lost') - .1 && b < t('lost') + 2.8) for (let i = 0; i < 18; i++) {
      const k = prog(b, t('lost') + hash(i) * .25, t('lost') + 2.2 + hash(i) * .3, E.out), a = hash(i * 3.1) * 6.283, dist = 40 + k * 380, dk = .4 + hash(i * 1.3) * .6;
      alpha(cx, (1 - k) * dk, () => { const x = wx + Math.cos(a) * dist, yy = bottom - 60 + Math.sin(a) * dist * .7, sz = (.5 + dk * .7) * (1 + k * dk * .6); cx.save(); cx.translate(x, yy); cx.rotate((hash(i * 5.5) - .5) * k * 4); cx.scale(sz, sz); rr(cx, -34, -12, 68, 24, 6, rgba(['#7cb7ff', '#a5d67a', '#f2d36a'][i % 3], .9)); txt(cx, '细节', 0, 0, fnt(500, 16), '#0b1020', 'center'); cx.restore(); });
    }
    // 轨道节点的字
    const ko = prog(b, t('loop'), t('loop') + .4) * (1 - prog(b, t('comp'), t('comp') + .5));
    if (ko > 0) alpha(tx, ko, () => NODES.forEach(([n, a], i) => {
      const x = wx + Math.cos(a) * ORB, yy = wy - 30 + Math.sin(a) * ORB, on = nodeOn(b) === i;
      if (!has3d) circ(cx, x, yy, on ? 15 : 10, mixC('#1a2a48', '#9fd8ff', on ? 1 : .3), '#9fd8ff', 2);
      txt(tx, n, x + (Math.cos(a) > .5 ? 26 : Math.cos(a) < -.5 ? -26 : 0), yy + (Math.sin(a) < -.5 ? -32 : Math.sin(a) > .5 ? 32 : 0), fnt(on ? 900 : 500, 28), on ? '#ffffff' : 'rgba(220,235,255,.6)', Math.cos(a) > .5 ? 'left' : Math.cos(a) < -.5 ? 'right' : 'center');
    }));
    // 四样东西：从深空飞进来，进圈那一下被点亮；讲到 Agent 时落进窗口底部
    KINDS.forEach(([s, col, d], i) => {
      const at = t('k' + (i + 1)), k = prog(b, at, at + .45, E.out), ko2 = prog(b, t('loop') - .3, t('loop'), E.in);
      if (k <= 0 || ko2 >= 1) return;
      const x0 = 1760, y0 = 200 + i * 200, x1 = wx + [-185, 185, -185, 185][i], y1 = wy + [-170, -170, 10, 10][i];
      const x = lerp(x0, x1, k), yy = lerp(y0, y1, k), sc = lerp(.25, 1, k), lit = bump(k, .72, .12);
      alpha(cx, (1 - ko2) * Math.min(1, .3 + k) * (1 - .75 * prog(b, t('cut0'), t('cut0') + .4) * (1 - prog(b, t('ag0') - .3, t('ag0')))), () => scaleAt(cx, x, yy, sc, () => {
        if (lit > .05) { const g = cx.createRadialGradient(x, yy, 0, x, yy, 120); g.addColorStop(0, rgba('#ffffff', .8 * lit)); g.addColorStop(1, rgba(col, 0)); cx.fillStyle = g; cx.fillRect(x - 120, yy - 120, 240, 240); }
        rr(cx, x - 110, yy - 40, 220, 80, 14, rgba(col, .92)); txt(cx, s, x, yy - 10, fnt(900, 28), '#0b1020', 'center'); txt(cx, d, x, yy + 22, fnt(500, 19), 'rgba(11,16,32,.75)', 'center');
      }));
    });
    // 编出来的方法名
    const kg = prog(b, t('fake') + .3, t('fake') + .6) * (1 - prog(b, t('ag0') - .3, t('ag0')));
    if (kg > 0) alpha(cx, kg, () => {
      rr(cx, wx - 150, wy + 70 + Math.sin(tt * 1.2) * 8, 260, 52, 10, 'rgba(10,20,40,.9)', '#f2a65a', 2); txt(cx, 'oldLogin()', wx - 130, wy + 96 + Math.sin(tt * 1.2) * 8, fnt(700, 26, F.mono), '#f2a65a');
      rr(cx, wx - 150, wy + 136 + Math.sin(tt * 1.2 + 1) * 8, 260, 52, 10, 'rgba(10,20,40,.9)', '#f07178', 2); txt(cx, 'loginMagic()', wx - 130, wy + 162 + Math.sin(tt * 1.2 + 1) * 8, fnt(700, 26, F.mono), '#f07178');
      txt(cx, '不存在的方法', wx - 20, wy + 218, fnt(700, 24), '#f07178', 'center');
      if (!has3d) { rr(cx, wx + 60, wy - 230, 190, 120, 12, '#dfefff', '#9fd8ff', 3); txt(cx, '训练截止', wx + 155, wy - 213, fnt(700, 20), '#0b1020', 'center'); }
    });
    const kcal = prog(b, t('cut') + .2, t('cut') + .6) * (1 - prog(b, t('ag0') - .3, t('ag0')));
    if (kcal > 0 && has3d) alpha(tx, kcal, () => { txt(tx, '训练截止', wx + 30, wy - 152, fnt(900, 30), '#0b1020', 'center'); txt(tx, '❄', wx + 30, wy - 105, fnt(400, 40), '#4a7fd0', 'center'); });
    // Clawd：宇航员
    const lapping = b >= t('n0') && b < t('rot'), ang = angAt(b);
    let st = { x: wx, y: wy + 40 + Math.sin(tt * 1.4) * 10, px: 15, hat: 'helmet', pose: 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: 1, rot: Math.sin(tt * .7) * .08 };
    if (b < 1.6) { const k = prog(b, 0, 1.6, E.out); st.x = lerp(wx - 500, wx, k); st.rot = (1 - k) * .6; }
    if (b >= t('out') && b < t('why')) { st.eye = 1; st.q = 1; }
    if (b >= t('fake') && b < t('ag0')) { st.sweat = b; st.eye = 0; }
    if (lapping) { st.x = wx + Math.cos(ang) * ORB; st.y = wy - 30 + Math.sin(ang) * ORB + 40; st.px = 10; st.rot = 0; st.walk = tt * 16; }
    if (b >= t('rot')) { st.x = wx; st.px = 13; st.y = Math.max(wy - wr + 120, Math.min(wy + 40, bottom - fill - 10)); st.sweat = b < t('three') ? b : 0; st.eye = 0; }
    if (b >= SH) { st.px = 13; st.y = wy - 40 + Math.sin(tt * 1.4) * 8; st.x = wx; st.pose = b >= SH + .4 ? 'point' : 'idle'; st.eye = 1; st.sweat = 0; }
    clawd(cx, st);
    // 三颗星
    STAR.forEach(([s, d, id, y], i) => {
      const k = prog(b, t(id), t(id) + .25, E.back); if (k <= 0) return;
      const x = 1080;
      scaleAt(tx, x, y, k * (1 + .25 * bump(b, t('order') + .2 + i * .1, .12)), () => { tx.save(); tx.translate(x, y); tx.rotate(tt * .5); tx.fillStyle = '#ffe9a8'; tx.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 12 : 30, a = j * Math.PI / 5; tx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } tx.fill(); tx.restore(); });
      seg(tx, wx + wr * .9, wy - 60 + i * 40, x - 40, y, rgba('#ffe9a8', .35 * k), 2, [4, 8]);
      lyric(tx, L, { at: t(id), text: s, x: 1140, y, size: 56, w: 900, col: '#ffffff', anim: 'slide' });
      lyric(tx, L, { at: t(id) + .1, text: ['→ 03 · 04', '→ 05', '→ 06'][i] + (d ? '　' + d : ''), x: 1140, y: y + 62, size: 26, fam: F.mono, w: 400, col: '#ffe9a8', anim: 'type' });
      if (i < 2) { const lk = prog(b, t('order'), t('order') + .4); if (lk > 0) seg(tx, x, y + 34, x, lerp(y + 34, STAR[i + 1][3] - 34, lk), rgba('#ffe9a8', .8), 3, [6, 8]); }
    });
    narrate(tx, L, S, { sub: { y: 990 }, gloss: { bg: 'rgba(8,14,30,.85)', acc: '#9fd8ff', ink: '#e6efff' } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD;
    Sm.add('crash', 0, 0, 0, 0, .5);
    H.pads(Sm, 0, B, PD, 'string', .65);
    const a0 = Math.ceil(t('in0'));
    H.roots(Sm, a0, B, PD, 'saw', .45, [[0, .5], [.5, .5], [1, .5], [1.5, .5], [2, .5], [2.5, .5], [3, .5], [3.5, .5]]);
    H.arps(Sm, 0, B, PD, 'arp', .25, [0, 1, 2, 3, 2, 3, 1, 2], .3, 12);
    const l0 = Math.ceil(t('loop'));
    H.four(Sm, l0, B, .6); H.hats(Sm, l0, B, .5, .22, true, true); H.back(Sm, l0 + 1, B, 'snare', .4);
    H.each(Math.floor(LAPF), Math.floor(t('rot')), b => [74, 77, 81, 84].forEach((m, j) => Sm.add('bell', b, j, m, 1, .45)));
    Sm.add('lp', t('rot'), 0, 700, 2); Sm.add('lp', t('three'), 0, 15000, 3);
    STAR.forEach(([, , id], i) => Sm.add('bell', t(id), 0, [76, 79, 83][i], 3, .5));
    Sm.add('crash', t('order'), 0, 0, 0, .5);
    H.roll(Sm, B - 1, 2, 4, 'snare', 'main', .2, .6, .25);
  },
}, S);
};
})();
