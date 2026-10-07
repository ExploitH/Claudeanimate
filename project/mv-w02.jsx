// 02 AI 在做什么 · 轨道：深空里一圈光就是上下文窗口，圈外什么都看不见；Agent 绕轨道一拍一个节点，窗口像烧瓶一样被一层层装满
(window.MV_W = window.MV_W || {}).w02 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, alpha, lyric, clawd } = K;
const WC = [700, 560], WR = 330, ORB = 215;
const KINDS = [['系统设定', '#7cb7ff'], ['你说的话', '#a5d67a'], ['读过的文件', '#f2d36a'], ['命令输出', '#b8bcc8']];
const NODES = [['读文件', -Math.PI / 2], ['想下一步', 0], ['调工具', Math.PI / 2], ['看结果', Math.PI]];
const OUTSIDE = [['上周的对话', 1480, 230], ['你昨天说的需求', 1620, 820], ['别的项目文件', 260, 180], ['v5.0 新版本的库', 1350, 640]];
// 窗口里的层：[出现小节, 颜色, 标签]
const BANDS = [...KINDS.map((k, i) => [7, k[1], k[0]]), [8, '#c792ea', '第 1 圈'], [9, '#5fd4c8', '第 2 圈'], [10, '#f07178', '第 3 圈'], [11, '#f2a65a', '第 4 圈'],
  ...[0, 1, 2, 3, 4, 5].map(i => [11.25 + i * .25, ['#7cb7ff', '#a5d67a', '#c792ea', '#f2d36a', '#5fd4c8', '#f07178'][i], '']) ];
const BH = 40;
function level(b) { // 已经落下的层数（带下落动画）
  return BANDS.map(([at]) => prog(b, at, at + .2, E.out));
}
return {
  scene: '02 轨道 · AI 在做什么', bars: 16, look: 2,
  enter: { kind: TR.IRIS, a: 2, b: 2, p: [1560 / 1920, 760 / 1080, 0, 0], col: '#9fd8ff' },
  hud: { num: '02', name: 'AI 写代码时在做什么', world: '轨道', ink: '#e6efff' },
  src: [[11, 13, 'Chroma, Context Rot, 2025-07']],
  par: L => { const b = L.b, r = (WR / 1080) * prog(b, .2, 1.2, E.out) * (1 - .25 * prog(b, 13, 13.6, E.io)), cx = lerp(WC[0], 560, prog(b, 13, 13.6, E.io)); return [cx / 1920, WC[1] / 1080, r, .06 + .9 * prog(b, 15, 15.8)]; },
  cam: L => [1.03 + .02 * Math.sin(L.t * .3), .015 * Math.sin(L.t * .17), .01 * Math.sin(L.t * .2), 0],
  pulse: L => .6,
  sfx: [[1.25, 'blip', 700], [2.25, 'swish'], [3.25, 'click'], ...KINDS.map((_, i) => [3.5 + i * .25, 'pop']), [5, 'freeze'], [5.75, 'glitch'], [7, 'swish'],
    ...[8, 9, 10, 11].map(b => [b, 'thud']), ...[0, 1, 2, 3, 4, 5].map(i => [11.25 + i * .25, 'stick']), [12, 'tape'], [12.25, 'whoosh'], [13.5, 'chime', 1319], [14, 'chime', 1568], [14.5, 'chime', 1976], [15.5, 'sparkle']],
  text: KINDS.map(k => k[0]).join('') + NODES.map(n => n[0]).join('') + OUTSIDE.map(o => o[0]).join('') + '我不记得你。我只看得见上下文窗口里的东西它有上限容量上限窗口里装着我的知识停在训练截止那天新版本的库，我可能按老写法写，甚至编一个不存在的方法训练截止oldLogin() loginV2() 不存在的方法我是 Agent自己调用工具，一轮轮干到完成每转一圈，窗口就更满塞得越满，越容易漏看、搞混context rot Chroma 2025 测了 18 个模型：输入越长越不稳满了就压缩，细节跟着丢压缩后的摘要细节你能动手脚的三处给我看什么用哪个模型用什么工具运行我第 圈→ 03 · 04 → 05 → 06',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, wx = lerp(WC[0], 560, prog(b, 13, 13.6, E.io)), wy = WC[1], wr = WR * (1 - .25 * prog(b, 13, 13.6, E.io));
    // 窗口外漂着的东西（着色器只让窗口里的看得见）
    OUTSIDE.forEach(([s, x, y], i) => {
      const xx = x + Math.sin(t * .4 + i) * 40, yy = y + Math.cos(t * .33 + i * 2) * 30;
      rr(cx, xx - 150, yy - 34, 300, 68, 34, 'rgba(120,150,210,.35)', 'rgba(170,200,255,.7)', 2);
      txt(cx, s, xx, yy, fnt(500, 26), '#e6efff', 'center');
    });
    // 容量上限标签
    const kc = prog(b, 3.25, 3.6) * (1 - prog(b, 12.8, 13.2));
    if (kc > 0) alpha(tx, kc, () => { const cx = tx; const a = -2.4; const x = wx + Math.cos(a) * (wr + 6), y = wy + Math.sin(a) * (wr + 6); rr(cx, x - 132, y - 46, 150, 40, 20, 'rgba(10,20,40,.9)', '#9fd8ff', 2); txt(cx, '容量上限', x - 57, y - 26, fnt(700, 22), '#9fd8ff', 'center'); });
    // 烧瓶式装填
    const lv = level(b), bottom = wy + wr - 6;
    const comp = prog(b, 12.25, 12.6, E.io);
    cx.save(); cx.beginPath(); cx.arc(wx, wy, wr - 4, 0, 6.283); cx.clip();
    let y = bottom;
    BANDS.forEach(([at, col, lab], i) => {
      const k = lv[i]; if (k <= 0) return;
      const squash = i < 10 ? lerp(1, .32, comp) : 1, h = BH * squash;
      const yy = lerp(wy - wr - 60, y - h, k);
      const blur = i < 8 && b > 11.4 ? Math.min(6, (b - 11.4) * 8) * (1 - comp * .5) : 0;
      if (blur > .5) cx.filter = `blur(${blur.toFixed(1)}px)`;
      cx.fillStyle = rgba(col, .85); cx.fillRect(wx - wr, yy, wr * 2, h - 3);
      if (lab && squash > .6) txt(cx, lab, wx, yy + h / 2, fnt(700, 22), '#0b1020', 'center');
      cx.filter = 'none';
      y -= h * k;
    });
    if (comp > 0) { const h = BH * 10 * .32; alpha(cx, comp, () => txt(cx, '压缩后的摘要', wx, bottom - h / 2 - 2, fnt(700, 22), '#0b1020', 'center')); }
    cx.restore();
    const fill = bottom - y;
    // 压缩时飞走的细节
    if (b >= 12.25 && b < 13.5) for (let i = 0; i < 14; i++) {
      const k = prog(b, 12.3 + hash(i) * .2, 13.2 + hash(i) * .3, E.out), a = hash(i * 3.1) * 6.283;
      alpha(cx, 1 - k, () => { const x = wx + Math.cos(a) * (60 + k * 520), yy = bottom - 60 + Math.sin(a) * (40 + k * 300); rr(cx, x - 34, yy - 12, 68, 24, 6, rgba(['#7cb7ff', '#a5d67a', '#f2d36a'][i % 3], .9)); txt(cx, '细节', x, yy, fnt(500, 16), '#0b1020', 'center'); });
    }
    // 轨道与节点
    const ko = prog(b, 7, 7.4) * (1 - prog(b, 12.8, 13.3));
    if (ko > 0) alpha(cx, ko, () => {
      cx.setLineDash([6, 10]); cx.strokeStyle = 'rgba(160,200,255,.55)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(wx, wy - 30, ORB, 0, 6.283); cx.stroke(); cx.setLineDash([]);
      NODES.forEach(([n, a], i) => {
        const x = wx + Math.cos(a) * ORB, yy = wy - 30 + Math.sin(a) * ORB, on = b >= 7.5 && b < 11.2 && Math.floor((b - 7) * 4) % 4 === i;
        const lit = on ? 1 : .3;
        circ(cx, x, yy, on ? 15 : 10, mixC('#1a2a48', '#9fd8ff', lit), '#9fd8ff', 2);
        txt(cx, n, x + (Math.cos(a) > .5 ? 26 : Math.cos(a) < -.5 ? -26 : 0), yy + (Math.sin(a) < -.5 ? -32 : Math.sin(a) > .5 ? 32 : 0), fnt(on ? 900 : 500, 26), on ? '#ffffff' : 'rgba(220,235,255,.6)', Math.cos(a) > .5 ? 'left' : Math.cos(a) < -.5 ? 'right' : 'center');
      });
    });
    // 四种内容飞进窗口
    KINDS.forEach(([s, col], i) => {
      const at = 3.5 + i * .25, k = prog(b, at, at + .3, E.out), ko2 = prog(b, 6.8, 7.05, E.in);
      if (k <= 0 || ko2 >= 1) return;
      const a = -2.6 + i * 1.3 + t * .2, x0 = 1700, y0 = 200 + i * 200, x1 = wx - 20 + Math.cos(a) * 205, y1 = wy + 10 + Math.sin(a) * 150;
      alpha(cx, 1 - ko2, () => { const x = lerp(x0, x1, k), yy = lerp(y0, y1, k); rr(cx, x - 92, yy - 26, 184, 52, 12, rgba(col, .9)); txt(cx, s, x, yy, fnt(700, 24), '#0b1020', 'center'); });
    });
    // 知识截止：冻住的日历 + 新版本库的方法写成老写法
    const kk = prog(b, 5, 5.3, E.back) * (1 - prog(b, 6.8, 7));
    if (kk > 0) alpha(cx, Math.min(1, kk), () => scaleAt(cx, wx + 150, wy - 170, kk, () => {
      rr(cx, wx + 60, wy - 230, 190, 120, 12, '#dfefff', '#9fd8ff', 3); cx.fillStyle = '#7cb7ff'; cx.fillRect(wx + 60, wy - 230, 190, 34);
      txt(cx, '训练截止', wx + 155, wy - 213, fnt(700, 20), '#0b1020', 'center'); txt(cx, '❄', wx + 155, wy - 150, fnt(400, 54), '#4a7fd0', 'center');
    }));
    const kg = prog(b, 5.75, 6) * (1 - prog(b, 6.8, 7));
    if (kg > 0) alpha(cx, kg, () => {
      rr(cx, wx - 260, wy + 40, 250, 50, 10, 'rgba(10,20,40,.9)', '#f2a65a', 2); txt(cx, 'oldLogin()', wx - 240, wy + 65, fnt(700, 24, F.mono), '#f2a65a');
      rr(cx, wx - 260, wy + 110, 250, 50, 10, 'rgba(10,20,40,.9)', '#f07178', 2); txt(cx, 'loginMagic()', wx - 240, wy + 135, fnt(700, 24, F.mono), '#f07178');
      txt(cx, '不存在的方法', wx - 135, wy + 186, fnt(700, 20), '#f07178', 'center');
    });
    // Clawd：宇航员
    const lap = b >= 7.5 && b < 11.2, ang = -Math.PI / 2 + (Math.floor((b - 7) * 4) + prog(((b - 7) * 4) % 1, 0, .5, E.io)) * Math.PI / 2;
    let st = { x: wx, y: wy + 40 + Math.sin(t * 1.4) * 10, px: 15, hat: 'helmet', pose: 'idle', ph: t * 10, blink: (t % 3) < .1, eye: 1, rot: Math.sin(t * .7) * .08 };
    if (b < 1) { const k = prog(b, 0, 1, E.out); st.x = lerp(wx - 500, wx, k); st.rot = (1 - k) * .6; }
    if (b >= 1.25 && b < 2.5) { st.eye = 1; st.q = Math.min(1, (b - 1.25) * 4) * (b < 2.3 ? 1 : 0); }
    if (lap) { st.x = wx + Math.cos(ang) * ORB; st.y = wy - 30 + Math.sin(ang) * ORB + 40; st.px = 10; st.rot = 0; st.walk = t * 16; }
    if (b >= 11.2) { st.x = wx; st.px = 13; st.y = Math.max(wy - wr + 120, Math.min(wy + 40, bottom - fill - 10)); st.sweat = b < 12.6 ? b : 0; st.eye = 0; }
    if (b >= 13) { st.px = 13; st.y = wy - 40 + Math.sin(t * 1.4) * 8; st.x = wx; st.pose = b >= 13.4 ? 'point' : 'idle'; st.eye = 1; st.sweat = 0; }
    clawd(cx, st);
    // 三颗星：三个控制点
    const STAR = [['给我看什么', '→ 03 · 04', 13.5, 300], ['用哪个模型', '→ 05', 14, 520], ['用什么工具运行我', '→ 06', 14.5, 740]];
    STAR.forEach(([s, to, at, y], i) => {
      const k = prog(b, at, at + .2, E.back);
      if (k <= 0) return;
      const x = 1080;
      scaleAt(tx, x, y, k, () => { tx.save(); tx.translate(x, y); tx.rotate(t * .5); tx.fillStyle = '#ffe9a8'; tx.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 12 : 30, a = j * Math.PI / 5; tx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } tx.fill(); tx.restore(); });
      seg(tx, wx + wr * .9, wy - 60 + i * 40, x - 40, y, rgba('#ffe9a8', .35 * k), 2, [4, 8]);
    });
    // ---------- 歌词 ----------
    const RX = 1150;
    lyric(tx, L, { at: 1.25, out: 2.15, text: '我不记得你。', x: RX, y: 420, size: 110, w: 900, col: '#ffffff', anim: 'blur', outAnim: 'up', glow: [30, 'rgba(120,180,255,.5)'] });
    lyric(tx, L, { at: 2.25, out: 3.4, text: '我只看得见\n‹上下文窗口›里的东西', x: RX, y: 400, size: 64, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'rise' });
    lyric(tx, L, { at: 3.4, out: 4.9, text: '窗口有上限，里面装着：', x: RX, y: 300, size: 46, w: 700, col: '#dfeaff', anim: 'rise', outAnim: 'up' });
    lyric(tx, L, { at: 3.5, out: 4.9, text: '系统设定 · 你说的话\n读过的文件 · 命令输出', x: RX, y: 420, size: 54, w: 900, col: '#ffffff', anim: 'pop', st: .25, rev: 1, outAnim: 'up' });
    lyric(tx, L, { at: 5, out: 6.85, text: '我的知识停在‹训练截止›那天', x: RX - 40, y: 300, size: 52, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'rise' });
    lyric(tx, L, { at: 5.75, out: 6.85, text: '新版本的库，我可能按老写法写，\n甚至编一个‹不存在的方法›', x: RX - 40, y: 430, size: 40, w: 500, col: '#dfeaff', acc: ['#f07178'], anim: 'rise' });
    lyric(tx, L, { at: 7, out: 8.9, text: '我是 ‹Agent›', x: RX + 40, y: 300, size: 76, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'drop' });
    lyric(tx, L, { at: 7.25, out: 8.9, text: '自己调用工具，一轮轮干到完成', x: RX + 40, y: 400, size: 40, w: 500, col: '#dfeaff', anim: 'rise' });
    lyric(tx, L, { at: 9, out: 10.9, text: '每转一圈，\n窗口就更满', x: RX + 40, y: 360, size: 76, w: 900, col: '#ffffff', anim: 'rise' });
    lyric(tx, L, { at: 11.1, out: 12.15, text: '塞得越满，\n越容易‹漏看、搞混›', x: RX + 20, y: 340, size: 64, w: 900, col: '#ffffff', acc: ['#f07178'], anim: 'blur' });
    lyric(tx, L, { at: 11.3, out: 12.15, text: 'context rot · Chroma 2025 测了 18 个模型\n输入越长，表现越不稳', x: RX + 20, y: 500, size: 28, fam: F.mono, w: 400, col: '#9fb4d8', anim: 'type', rev: .5 });
    lyric(tx, L, { at: 12.25, out: 12.9, text: '满了就压缩，\n«细节跟着丢»', x: RX + 20, y: 380, size: 70, w: 900, col: '#ffffff', acc: ['#f2a65a', '#f2a65a'], anim: 'stamp', d: .15, outAnim: 'scatter' });
    lyric(tx, L, { at: 13, out: 15.8, text: '你能动手脚的‹三处›', x: 960, y: 170, size: 56, w: 900, col: '#ffffff', acc: ['#ffe9a8'], align: 'center', anim: 'rise' });
    [['给我看什么', '→ 03 · 04', 13.5, 300], ['用哪个模型', '→ 05', 14, 520], ['用什么工具运行我', '→ 06', 14.5, 740]].forEach(([s, to, at, y]) => {
      lyric(tx, L, { at, out: 15.8, text: s, x: 1140, y, size: 58, w: 900, col: '#ffffff', anim: 'slide' });
      lyric(tx, L, { at: at + .1, out: 15.8, text: to, x: 1140, y: y + 64, size: 28, fam: F.mono, w: 400, col: '#ffe9a8', anim: 'type' });
    });
  },
};
};
