// 02 AI 在做什么 · 轨道：深空里一圈 3D 金属光环就是上下文窗口，圈外什么都看不见；「我不记得你」打出后停两拍；
// Agent 沿玻璃管轨道跑，窗口像烧瓶一样装满；压缩时细节四散；三颗星，圈外显形
(window.MV_W = window.MV_W || {}).w02 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, alpha, lyric, clawd } = K;
const WC = [700, 560], WR = 330, ORB = 215, SH = 16;
const KINDS = [['系统设定', '#7cb7ff'], ['你说的话', '#a5d67a'], ['读过的文件', '#f2d36a'], ['命令输出', '#b8bcc8']];
const NODES = [['读文件', -Math.PI / 2], ['想下一步', 0], ['调工具', Math.PI / 2], ['看结果', Math.PI]];
const OUTSIDE = [['上周的对话', 1480, 230], ['你昨天说的需求', 1620, 820], ['别的项目文件', 260, 180], ['v5.0 新版本的库', 1350, 640]];
// 窗口里的层：[出现小节, 颜色, 标签]
const BANDS = [...KINDS.map((k, i) => [10, k[1], k[0]]), [11, '#c792ea', '第 1 圈'], [12, '#5fd4c8', '第 2 圈'], [13, '#f07178', '第 3 圈'], [14, '#f2a65a', '第 4 圈'],
  ...[0, 1, 2, 3, 4, 5].map(i => [14.25 + i * .25, ['#7cb7ff', '#a5d67a', '#c792ea', '#f2d36a', '#5fd4c8', '#f07178'][i], '']) ];
const BH = 40;
function level(b) { return BANDS.map(([at]) => prog(b, at, at + .2, E.out)); }
// 没有 3D 时的 2D 圆环壁
function ringWall(ctx, wx, wy, wr, t, ka) {
  if (ka <= 0) return;
  ctx.save(); ctx.globalAlpha *= ka;
  // 外壁渐变（模拟 3D 圆柱侧面光照）
  const gOuter = ctx.createLinearGradient(wx - wr, wy, wx + wr, wy);
  gOuter.addColorStop(0, rgba('#4a80c8', .9));
  gOuter.addColorStop(.35, rgba('#9fd8ff', 1));
  gOuter.addColorStop(.65, rgba('#9fd8ff', 1));
  gOuter.addColorStop(1, rgba('#4a80c8', .9));
  ctx.strokeStyle = gOuter; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(wx, wy, wr, 0, 6.283); ctx.stroke();
  // 内壁高光（3D 内缘）
  ctx.strokeStyle = rgba('#ffffff', .18); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(wx, wy, wr - 5, -0.8, 0.8); ctx.stroke();
  ctx.beginPath(); ctx.arc(wx, wy, wr - 5, Math.PI - 0.8, Math.PI + 0.8); ctx.stroke();
  // 脉冲旋转光点（模拟圆环表面流光）
  const a = t * 1.2;
  const gx = wx + Math.cos(a) * wr, gy = wy + Math.sin(a) * wr;
  const grd = ctx.createRadialGradient(gx, gy, 0, gx, gy, 28);
  grd.addColorStop(0, rgba('#ffffff', .7)); grd.addColorStop(1, rgba('#9fd8ff', 0));
  ctx.fillStyle = grd; ctx.fillRect(gx - 28, gy - 28, 56, 56);
  ctx.restore();
}
return {
  scene: '02 轨道 · AI 在做什么', bars: 20, look: 2,
  enter: { kind: TR.IRIS, a: 2, b: 2, p: [1560 / 1920, 760 / 1080, 0, 0], col: '#9fd8ff' },
  hud: { num: '02', name: 'AI 写代码时在做什么', time: '21:10', line: '你还记得吧？', ink: '#e6efff', acc: '#9fd8ff', card: [1180, 400] },
  you: [[.95, 2.1, '接着上周的代码写，你还记得吧？']],
  src: [[14, 16, 'Chroma, Context Rot, 2025-07']],
  par: L => { const b = L.b, r = (WR / 1080) * prog(b, .2, 1.2, E.out) * (1 - .25 * prog(b, SH, SH + .6, E.io)), cx = lerp(WC[0], 560, prog(b, SH, SH + .6, E.io)); return [cx / 1920, WC[1] / 1080, r, .06 + .9 * prog(b, 18.5, 19.3)]; },
  cam: L => [1.03 + .02 * Math.sin(L.t * .3), .015 * Math.sin(L.t * .17), .01 * Math.sin(L.t * .2), 0],
  pulse: L => .6,
  sfx: [
    [1.25, 'blip', 700], [2, 'swish'], [2.05, 'blip', 330], [4, 'swish'], [4.75, 'blip', 400],
    [5.5, 'click'], ...KINDS.map((_, i) => [5.75 + i * .25, 'pop']),
    [7, 'freeze'], [8, 'glitch'], [10, 'swish'],
    ...[11, 12, 13, 14].map(b => [b, 'thud']),
    ...[0, 1, 2, 3, 4, 5].map(i => [14.25 + i * .25, 'stick']),
    [15.25, 'tape'], [15.3, 'whoosh'],
    [16.75, 'chime', 1319], [17.25, 'chime', 1568], [17.75, 'chime', 1976], [18.5, 'sparkle']
  ],
  text: KINDS.map(k => k[0]).join('') + NODES.map(n => n[0]).join('') + OUTSIDE.map(o => o[0]).join('') + '我不记得你。我只看得见上下文窗口里的东西。窗口外面，一片黑。我的知识，停在训练截止那天。之后才出的新版本库，我可能照老写法写，甚至编一个不存在的方法。自己调工具，一轮一轮干到完成每转一圈，窗口就满一点。塞得越满，我越容易漏看、搞混。满了就压缩——细节，跟着丢所以你能动手脚的，就三处：它有上限容量上限窗口里装着我的知识停在训练截止那天新版本的库，我可能按老写法写，甚至编一个不存在的方法训练截止oldLogin() loginV2() 不存在的方法我是 Agent自己调用工具，一轮轮干到完成每转一圈，窗口就更满塞得越满，越容易漏看、搞混context rot Chroma 2025 测了 18 个模型：输入越长越不稳满了就压缩，细节跟着丢压缩后的摘要细节你能动手脚的三处给我看什么用哪个模型用什么工具运行我第 圈→ 03 · 04 → 05 → 06',
  three(T, U) {
    const scene = new T.Scene();
    scene.add(new T.AmbientLight(0x223355, 1.2));
    const d1 = new T.DirectionalLight(0xbfe4ff, 2.2); d1.position.set(-500, 700, 900); scene.add(d1);
    const d2 = new T.DirectionalLight(0x5570ff, 1.2); d2.position.set(600, -400, 300); scene.add(d2);
    // 上下文窗口：有厚度的金属光环 + 内缘一圈冷光 + 沿环流动的光点
    const ring = new T.Mesh(new T.TorusGeometry(1, .03, 24, 160), new T.MeshStandardMaterial({ color: 0x6f9be0, metalness: .85, roughness: .22, emissive: 0x16305a, transparent: true }));
    const rim = new T.Mesh(new T.TorusGeometry(.985, .006, 8, 160), new T.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true }));
    const spark = new T.Mesh(new T.SphereGeometry(.03, 16, 12), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
    const win = new T.Group(); win.add(ring, rim, spark); scene.add(win);
    // 轨道：透明发光管 + 四个节点球 + 跟着 Clawd 的光迹
    const tube = new T.Mesh(new T.TorusGeometry(ORB, 9, 16, 160), new T.MeshStandardMaterial({ color: 0x9fd8ff, metalness: .1, roughness: .05, transparent: true, opacity: .28, emissive: 0x0d2a48, depthWrite: false }));
    const nodes = NODES.map(() => new T.Mesh(new T.SphereGeometry(13, 24, 16), new T.MeshStandardMaterial({ color: 0x9fd8ff, emissive: 0x9fd8ff, emissiveIntensity: .2, roughness: .3, transparent: true })));
    const trail = Array.from({ length: 14 }, () => new T.Mesh(new T.SphereGeometry(6, 10, 8), new T.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, depthWrite: false })));
    const orb = new T.Group(); orb.add(tube, ...nodes, ...trail); scene.add(orb);
    return {
      scene,
      update(L) {
        const b = L.b, t = L.t, sh = prog(b, SH, SH + .6, E.io), wx = lerp(WC[0], 560, sh), wr = WR * (1 - .25 * sh);
        const kw = prog(b, .2, 1.2, E.out);
        win.visible = kw > 0;
        U.at(win, wx, WC[1], 0); win.scale.setScalar(Math.max(1e-3, wr * (.85 + .15 * kw)));
        win.rotation.set(.06 * Math.sin(t * .3), .05 * Math.sin(t * .23), 0);
        ring.material.opacity = kw; rim.material.opacity = kw * (.5 + .3 * Math.sin(t * 2));
        // 卡片进圈、每圈装填时，光环亮一下
        const hit = Math.max(...[5.75, 6, 6.25, 6.5, 11, 12, 13, 14].map(x => L.hit(x, .3)));
        ring.material.emissiveIntensity = 1 + 2.5 * hit + 2 * prog(b, 18.5, 19.3);
        const a = t * 1.3; spark.position.set(Math.cos(a), Math.sin(a), .03); spark.material.opacity = kw;
        // 轨道
        const ko = prog(b, 10, 10.4) * (1 - prog(b, 15.8, 16.3));
        orb.visible = ko > 0;
        if (orb.visible) {
          U.at(orb, wx, WC[1] - 30, 20); orb.rotation.set(0, 0, 0);
          tube.material.opacity = .28 * ko;
          const step = Math.floor((b - 10) * 4), on = b >= 10.5 && b < 14.2 ? ((step % 4) + 4) % 4 : -1;
          nodes.forEach((n, i) => { const ang = NODES[i][1]; n.position.set(Math.cos(ang) * ORB, -Math.sin(ang) * ORB, 0); n.material.opacity = ko; n.material.emissiveIntensity = i === on ? 1.6 : .15; n.scale.setScalar(i === on ? 1.3 : 1); });
          const lap = b >= 10.5 && b < 14.2;
          trail.forEach((m, j) => {
            m.visible = lap; if (!lap) return;
            const bb = b - j * .03, st = Math.floor((bb - 10) * 4), ang = -Math.PI / 2 + (st + prog(((bb - 10) * 4) % 1, 0, .5, E.io)) * Math.PI / 2;
            m.position.set(Math.cos(ang) * ORB, -Math.sin(ang) * ORB, 12); m.material.opacity = .6 * (1 - j / 14) * ko; m.scale.setScalar(1 - j / 20);
          });
        }
        return win.visible;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, t = L.t, sh = prog(b, SH, SH + .6, E.io), wx = lerp(WC[0], 560, sh), wy = WC[1], wr = WR * (1 - .25 * sh), has3d = !!window.THREE;
    // 窗口外漂着的东西（着色器只让窗口里的看得见）
    OUTSIDE.forEach(([s, x, y], i) => {
      const xx = x + Math.sin(t * .4 + i) * 40, yy = y + Math.cos(t * .33 + i * 2) * 30;
      rr(cx, xx - 150, yy - 34, 300, 68, 34, 'rgba(120,150,210,.35)', 'rgba(170,200,255,.7)', 2);
      txt(cx, s, xx, yy, fnt(500, 26), '#e6efff', 'center');
    });
    if (!has3d) ringWall(cx, wx, wy, wr, t, prog(b, .2, 1.2, E.out));
    // 容量上限标签
    const kc = prog(b, 5.5, 5.85) * (1 - prog(b, 15.8, 16.2));
    if (kc > 0) alpha(tx, kc, () => { const a = -2.4; const x = wx + Math.cos(a) * (wr + 6), y = wy + Math.sin(a) * (wr + 6); rr(tx, x - 132, y - 46, 150, 40, 20, 'rgba(10,20,40,.9)', '#9fd8ff', 2); txt(tx, '容量上限', x - 57, y - 26, fnt(700, 22), '#9fd8ff', 'center'); });
    // 烧瓶式装填：一层层从底部堆上来，每层顶上一道液面高光
    const lv = level(b), bottom = wy + wr - 6, comp = prog(b, 15.25, 15.6, E.io);
    cx.save(); cx.beginPath(); cx.arc(wx, wy, wr - 4, 0, 6.283); cx.clip();
    let y = bottom;
    BANDS.forEach(([at, col, lab], i) => {
      const k = lv[i]; if (k <= 0) return;
      const squash = i < 10 ? lerp(1, .32, comp) : 1, h = BH * squash, yy = lerp(wy - wr - 60, y - h, k);
      const blur = i < 8 && b > 14.4 ? Math.min(6, (b - 14.4) * 8) * (1 - comp * .5) : 0;
      if (blur > .5) cx.filter = `blur(${blur.toFixed(1)}px)`;
      cx.fillStyle = rgba(col, .85); cx.fillRect(wx - wr, yy, wr * 2, h - 3);
      if (k > .9 && squash > .6 && blur < .5) { cx.fillStyle = rgba('#ffffff', .14); cx.fillRect(wx - wr + 8, yy, wr * 2 - 16, 4); }
      if (lab && squash > .6) txt(cx, lab, wx, yy + h / 2, fnt(700, 22), '#0b1020', 'center');
      cx.filter = 'none';
      y -= h * k;
    });
    if (comp > 0) { const h = BH * 10 * .32; alpha(cx, comp, () => txt(cx, '压缩后的摘要', wx, bottom - h / 2 - 2, fnt(700, 22), '#0b1020', 'center')); }
    cx.restore();
    const fill = bottom - y;
    // 压缩时飞走的细节：向四面八方弹飞，近的大、远的小
    if (b >= 15.25 && b < 16.9) for (let i = 0; i < 18; i++) {
      const k = prog(b, 15.3 + hash(i) * .25, 16.5 + hash(i) * .3, E.out), a = hash(i * 3.1) * 6.283, dist = 60 + k * 580, dk = .4 + hash(i * 1.3) * .6;
      alpha(cx, (1 - k) * dk, () => {
        const x = wx + Math.cos(a) * dist, yy = bottom - 60 + Math.sin(a) * dist * .7, sz = (.5 + dk * .7) * (1 + k * dk * .6);
        cx.save(); cx.translate(x, yy); cx.rotate((hash(i * 5.5) - .5) * k * 4); cx.scale(sz, sz);
        rr(cx, -34, -12, 68, 24, 6, rgba(['#7cb7ff', '#a5d67a', '#f2d36a'][i % 3], .9));
        txt(cx, '细节', 0, 0, fnt(500, 16), '#0b1020', 'center');
        cx.restore();
      });
    }
    // 轨道节点的字（管子和球在 3D 层）
    const ko = prog(b, 10, 10.4) * (1 - prog(b, 15.8, 16.3));
    if (ko > 0) alpha(tx, ko, () => {
      if (!has3d) { cx.strokeStyle = rgba('#9fd8ff', .45); cx.lineWidth = 6; cx.beginPath(); cx.arc(wx, wy - 30, ORB, 0, 6.283); cx.stroke(); }
      NODES.forEach(([n, a], i) => {
        const x = wx + Math.cos(a) * ORB, yy = wy - 30 + Math.sin(a) * ORB;
        const on = b >= 10.5 && b < 14.2 && ((Math.floor((b - 10) * 4) % 4) + 4) % 4 === i;
        if (!has3d) circ(cx, x, yy, on ? 15 : 10, mixC('#1a2a48', '#9fd8ff', on ? 1 : .3), '#9fd8ff', 2);
        txt(tx, n, x + (Math.cos(a) > .5 ? 26 : Math.cos(a) < -.5 ? -26 : 0), yy + (Math.sin(a) < -.5 ? -32 : Math.sin(a) > .5 ? 32 : 0), fnt(on ? 900 : 500, 26), on ? '#ffffff' : 'rgba(220,235,255,.6)', Math.cos(a) > .5 ? 'left' : Math.cos(a) < -.5 ? 'right' : 'center');
      });
    });
    // 四种内容从深空飞进窗口：远处是小点，穿过圈壁那一下被点亮
    KINDS.forEach(([s, col], i) => {
      const at = 5.75 + i * .25, k = prog(b, at, at + .35, E.out), ko2 = prog(b, 9.8, 10.05, E.in);
      if (k <= 0 || ko2 >= 1) return;
      const a = -2.6 + i * 1.3 + t * .2, x0 = 1760, y0 = 200 + i * 200;
      const x1 = wx - 20 + Math.cos(a) * 205, y1 = wy + 10 + Math.sin(a) * 150;
      const x = lerp(x0, x1, k), yy = lerp(y0, y1, k), sc = lerp(.25, 1, k), lit = bump(k, .72, .12);
      alpha(cx, (1 - ko2) * Math.min(1, .3 + k), () => scaleAt(cx, x, yy, sc, () => {
        if (lit > .05) { const grd = cx.createRadialGradient(x, yy, 0, x, yy, 120); grd.addColorStop(0, rgba('#ffffff', .8 * lit)); grd.addColorStop(1, rgba(col, 0)); cx.fillStyle = grd; cx.fillRect(x - 120, yy - 120, 240, 240); }
        rr(cx, x - 92, yy - 26, 184, 52, 12, rgba(col, .9)); txt(cx, s, x, yy, fnt(700, 24), '#0b1020', 'center');
      }));
    });
    // 知识截止：冻住的日历（倾斜的平板，一道斜光照在日期上）+ 假方法名
    const kk = prog(b, 7, 7.3, E.back) * (1 - prog(b, 9.75, 10));
    if (kk > 0) alpha(cx, Math.min(1, kk), () => scaleAt(cx, wx + 150, wy - 170, kk, () => {
      cx.save(); cx.translate(wx + 155, wy - 170); cx.transform(1, 0, -0.08, 1, 0, 0); cx.translate(-wx - 155, -wy + 170);
      rr(cx, wx + 60, wy - 230, 190, 120, 12, '#dfefff', '#9fd8ff', 3); cx.fillStyle = '#7cb7ff'; cx.fillRect(wx + 60, wy - 230, 190, 34);
      txt(cx, '训练截止', wx + 155, wy - 213, fnt(700, 20), '#0b1020', 'center'); txt(cx, '❄', wx + 155, wy - 150, fnt(400, 54), '#4a7fd0', 'center');
      const g = cx.createLinearGradient(wx + 40, wy - 260, wx + 230, wy - 100); g.addColorStop(0, rgba('#ffffff', 0)); g.addColorStop(.5, rgba('#ffffff', .35 * (.6 + .4 * Math.sin(t * 2)))); g.addColorStop(1, rgba('#ffffff', 0));
      cx.fillStyle = g; cx.fillRect(wx + 60, wy - 230, 190, 120);
      cx.restore();
    }));
    const kg = prog(b, 8, 8.25) * (1 - prog(b, 9.75, 10));
    if (kg > 0) alpha(cx, kg, () => {
      rr(cx, wx - 260, wy + 40 + Math.sin(t * 1.2) * 8, 250, 50, 10, 'rgba(10,20,40,.9)', '#f2a65a', 2); txt(cx, 'oldLogin()', wx - 240, wy + 65 + Math.sin(t * 1.2) * 8, fnt(700, 24, F.mono), '#f2a65a');
      rr(cx, wx - 260, wy + 110 + Math.sin(t * 1.2 + 1) * 8, 250, 50, 10, 'rgba(10,20,40,.9)', '#f07178', 2); txt(cx, 'loginMagic()', wx - 240, wy + 135 + Math.sin(t * 1.2 + 1) * 8, fnt(700, 24, F.mono), '#f07178');
      txt(cx, '不存在的方法', wx - 135, wy + 190, fnt(700, 20), '#f07178', 'center');
    });
    // Clawd：宇航员
    const lap = b >= 10.5 && b < 14.2, ang = -Math.PI / 2 + (Math.floor((b - 10) * 4) + prog(((b - 10) * 4) % 1, 0, .5, E.io)) * Math.PI / 2;
    let st = { x: wx, y: wy + 40 + Math.sin(t * 1.4) * 10, px: 15, hat: 'helmet', pose: 'idle', ph: t * 10, blink: (t % 3) < .1, eye: 1, rot: Math.sin(t * .7) * .08 };
    if (b < 1) { const k = prog(b, 0, 1, E.out); st.x = lerp(wx - 500, wx, k); st.rot = (1 - k) * .6; }
    if (b >= 1.25 && b < 2) { st.eye = 1; st.q = Math.min(1, (b - 1.25) * 4); }
    if (b >= 2 && b < 4) { st.eye = -1; st.rot = 0; st.y = wy + 40; st.blink = b > 3.4 && b < 3.45; } // 停两拍：一动不动看着你
    if (lap) { st.x = wx + Math.cos(ang) * ORB; st.y = wy - 30 + Math.sin(ang) * ORB + 40; st.px = 10; st.rot = 0; st.walk = t * 16; }
    if (b >= 14.2) { st.x = wx; st.px = 13; st.y = Math.max(wy - wr + 120, Math.min(wy + 40, bottom - fill - 10)); st.sweat = b < 15.6 ? b : 0; st.eye = 0; }
    if (b >= SH) { st.px = 13; st.y = wy - 40 + Math.sin(t * 1.4) * 8; st.x = wx; st.pose = b >= SH + .4 ? 'point' : 'idle'; st.eye = 1; st.sweat = 0; }
    clawd(cx, st);
    // 三颗星：三个控制点
    const STAR = [['给我看什么', '→ 03 · 04', 16.75, 300], ['用哪个模型', '→ 05', 17.25, 520], ['用什么工具运行我', '→ 06', 17.75, 740]];
    STAR.forEach(([s, to, at, y], i) => {
      const k = prog(b, at, at + .2, E.back);
      if (k <= 0) return;
      const x = 1080, lk = prog(b, 18.5, 18.7);
      scaleAt(tx, x, y, k * (1 + .25 * bump(b, 18.6 + i * .08, .12)), () => { tx.save(); tx.translate(x, y); tx.rotate(t * .5); tx.fillStyle = '#ffe9a8'; tx.beginPath(); for (let j = 0; j < 10; j++) { const r = j % 2 ? 12 : 30, a = j * Math.PI / 5; tx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } tx.fill(); tx.restore(); });
      seg(tx, wx + wr * .9, wy - 60 + i * 40, x - 40, y, rgba('#ffe9a8', .35 * k), 2, [4, 8]);
      if (i < 2 && lk > 0) seg(tx, x, y + 34, x, lerp(y + 34, STAR[i + 1][3] - 34, lk), rgba('#ffe9a8', .8), 3, [6, 8]);
    });
    // ---------- 歌词 ----------
    const RX = 1150;
    lyric(tx, L, { at: 2, out: 3.9, text: '我不记得你。', x: RX, y: 420, size: 110, w: 900, col: '#ffffff', anim: 'blur', outAnim: 'up', glow: [30, 'rgba(120,180,255,.5)'] });
    lyric(tx, L, { at: 4, out: 5.35, text: '我只看得见\n‹上下文窗口›里的东西。', x: RX, y: 380, size: 58, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'rise' });
    lyric(tx, L, { at: 4.75, out: 5.35, text: '窗口外面，一片黑。', x: RX, y: 560, size: 40, w: 500, col: '#9fb4d8', anim: 'fade' });
    lyric(tx, L, { at: 5.5, out: 6.9, text: '窗口有上限，里面装着：', x: RX, y: 300, size: 46, w: 700, col: '#dfeaff', anim: 'rise', outAnim: 'up' });
    lyric(tx, L, { at: 5.75, out: 6.9, text: '系统设定 · 你说的话\n读过的文件 · 命令输出', x: RX, y: 420, size: 54, w: 900, col: '#ffffff', anim: 'pop', st: .25, rev: 1, outAnim: 'up' });
    lyric(tx, L, { at: 7, out: 9.8, text: '我的知识，停在‹训练截止›那天。', x: RX - 40, y: 300, size: 52, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'rise' });
    lyric(tx, L, { at: 8, out: 9.8, text: '之后才出的新版本库，我可能照老写法写，\n甚至编一个‹不存在的方法›。', x: RX - 40, y: 430, size: 40, w: 500, col: '#dfeaff', acc: ['#f07178'], anim: 'rise' });
    lyric(tx, L, { at: 10, out: 11.9, text: '我是 ‹Agent›', x: RX + 40, y: 300, size: 76, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'drop' });
    lyric(tx, L, { at: 10.25, out: 11.9, text: '自己调工具，一轮一轮干到完成', x: RX + 40, y: 400, size: 40, w: 500, col: '#dfeaff', anim: 'rise' });
    lyric(tx, L, { at: 12, out: 13.9, text: '每转一圈，\n窗口就满一点。', x: RX + 40, y: 360, size: 76, w: 900, col: '#ffffff', anim: 'rise' });
    lyric(tx, L, { at: 14, out: 15.15, text: '塞得越满，\n我越容易‹漏看、搞混›。', x: RX + 20, y: 340, size: 64, w: 900, col: '#ffffff', acc: ['#f07178'], anim: 'blur' });
    lyric(tx, L, { at: 14.25, out: 15.15, text: 'context rot · Chroma 2025 测了 18 个模型\n输入越长，表现越不稳', x: RX + 20, y: 500, size: 28, fam: F.mono, w: 400, col: '#9fb4d8', anim: 'type', rev: .5 });
    lyric(tx, L, { at: 15.25, out: 16.1, text: '满了就压缩——\n«细节，跟着丢»', x: RX + 20, y: 380, size: 70, w: 900, col: '#ffffff', acc: ['#f2a65a', '#f2a65a'], anim: 'stamp', d: .15, outAnim: 'scatter' });
    lyric(tx, L, { at: 16.25, out: 19.4, text: '所以你能动手脚的，就‹三处›：', x: 960, y: 170, size: 56, w: 900, col: '#ffffff', acc: ['#ffe9a8'], align: 'center', anim: 'rise' });
    STAR.forEach(([s, to, at, y]) => {
      lyric(tx, L, { at, out: 19.4, text: s, x: 1140, y, size: 58, w: 900, col: '#ffffff', anim: 'slide' });
      lyric(tx, L, { at: at + .1, out: 19.4, text: to, x: 1140, y: y + 64, size: 28, fam: F.mono, w: 400, col: '#ffe9a8', anim: 'type' });
    });
  },
};
};
