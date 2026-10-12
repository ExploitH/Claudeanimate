// 东大码 · 宣传片（约 2 分钟，发布会风格）：「从早八，到深夜」，一个学生的一天
// 基调：克制、丝滑。场与场之间柔和溶解；动作都是长时间的缓入缓出；不闪白、不抖、不故障。
// n0 开场：光点缓缓汇聚成山川轮廓，填色，一道柔光扫过；「东大码」「从早八，到深夜。」
// n1 07:52 宿舍：时间平滑跳到 07:52；主屏幕上四款小组件出现，手机侧过来，小组件一层层浮起（爆炸图）；今日课表随时间推移；本周课表依次铺开
// n2 12:08 食堂：「付款」；二维码由小方块从近处聚拢拼成；倒计时细环走完，换新码；一道柔光扫过二维码，「滴」
// n3 12:09 余额：数字滚到余额；余额卡从屏幕里浮起，点充值
// n4 21:30 校外：教务系统打不开；连接学生 VPN，镜头缓缓推近，已连接时屏幕中心泛起柔光；慢速光线；分流示意图
// n5 21:32 成绩：「成绩出了吗？」；考试卡片摊开；分数平滑滚出来
// n6 收尾：六格便当盒带着时间戳依次浮现，柔光扫过，缓缓聚拢成山川图标；「东大码」
// 时间单位是小节（120 BPM，一小节 2 秒）。手机是 3D（three.js），没有 three.js 时画平面版。
(() => {
const R = (window.MV_W = window.MV_W || {});
const N = () => window.NEU, FX = () => window.NEU_FX;
const PAR = [.74, .5, .36, .12]; // 电影画风：曝光、冷暖（中性）、暗角、轻微光晕和颗粒
const DIS = { kind: 9, a: 10, b: 10 }; // 柔和溶解：窗口 10 秒，中间约 1 秒交叉淡化
const DEF = { x: 960, y: 540, z: 0, rx: 0, ry: 0, rz: 0, s: 1 };

function kf(b, keys) {
  const io = N().eio;
  if (b <= keys[0][0]) return { ...DEF, ...keys[0][1] };
  for (let i = 0; i + 1 < keys.length; i++) {
    const [b0, p0] = keys[i], [b1, p1] = keys[i + 1];
    if (b < b1) { const k = io((b - b0) / (b1 - b0)), o = {}; for (const key of Object.keys(DEF)) { const a = p0[key] ?? DEF[key], c = p1[key] ?? DEF[key]; o[key] = a + (c - a) * k; } return o; }
  }
  return { ...DEF, ...keys[keys.length - 1][1] };
}
const float = (p, t, a = 1) => ({ ...p, y: p.y + Math.sin(t * .8) * 5 * a, ry: p.ry + Math.sin(t * .5) * .025 * a, rx: p.rx + Math.sin(t * .6 + 1) * .012 * a });
function stage(cx, L, a = 1, hue = 0) {
  const n = N(), t = L.T;
  n.glow(cx, 960 + Math.sin(t * .09) * 340, 300 + Math.cos(t * .07) * 110, 920, hue ? 'rgba(14,124,134,.26)' : 'rgba(15,69,175,.30)', a);
  n.glow(cx, 960 - Math.sin(t * .06) * 420, 860 + Math.sin(t * .1) * 80, 780, hue ? 'rgba(15,69,175,.20)' : 'rgba(14,124,134,.14)', a);
}
// 柔光圈：一圈很淡的光慢慢扩散
function halo(cx, x, y, k, r0, r1, col = '143,178,255') {
  if (k <= 0 || k >= 1) return;
  const n = N(), e = n.eio(k), r = r0 + (r1 - r0) * e, a = Math.sin(Math.PI * k);
  cx.save(); cx.strokeStyle = `rgba(${col},${.22 * a})`; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.stroke(); cx.restore();
  n.glow(cx, x, y, r * 1.1, `rgba(${col},.16)`, a);
}
const TXT = () => N().TXT;
const base = (K, m) => ({ look: K.LOOK.FILM, par: PAR, enter: DIS, ...m });

// ============ 00 · 开场 ============
R.n0 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const FILL = 3;
  return base(K, {
    scene: '00 · 开场', bars: 7, enter: undefined,
    cam: X.cam(7, [], .03),
    desc: '黑场里光点从四周缓缓汇聚，落成山川轮廓；轮廓轻轻亮起、填色，一道柔光扫过；图标上移，「东大码」「NEU eCode」；「从早八，到深夜。」',
    text: TXT() + '东大码NEU eCode从早八，到深夜。东北大学校园生活的原生伴侣',
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      stage(cx, L, prog(b, 2.8, 4.2, E.io) * .9);
      const mv = prog(b, 3.6, 4.6, E.io), lx = 960, ly = lerp(500, 330, mv), lw = lerp(440, 190, mv);
      const fk = prog(b, FILL, FILL + .6, E.io);
      n.al(cx, 1 - prog(b, FILL, FILL + .8, E.io), () => X.swarm(cx, lx, ly, lw, prog(b, .2, 2.9, E.lin), t, { n: 460 }));
      n.al(cx, prog(b, 2.3, 3, E.io) * (1 - fk), () => n.logo(cx, lx, ly, lw, { stroke: '#BFD3FF', strokeK: 1, lw: 2 }));
      n.glow(cx, lx, ly, lw * 1.6, 'rgba(91,140,255,.30)', fk * (1 - .5 * mv));
      n.logo(cx, lx, ly, lw, { fill: 'grad', fillK: fk, wave: 1 * fk, t: t * .7, sweep: prog(b, 3.9, 4.9, E.lin) });
      n.head(tx, L, '东大码', { at: 4, y: 600, size: 150, w: 900, d: .7, sweep: [4.9, 1, '169,195,255'] });
      n.head(tx, L, 'NEU eCode', { at: 4.4, y: 708, size: 36, w: 500, col: n.C.grey, ls: .32, d: .7 });
      n.head(tx, L, '从早八，到深夜。', { at: 5.1, y: 840, size: 54, w: 700, grad: n.GRAD, d: .7 });
      n.head(tx, L, '东北大学校园生活的原生伴侣', { at: 5.6, y: 914, size: 26, w: 500, col: n.C.dim, ls: .1, d: .7 });
    },
    sfx: [[FILL, 'chime', 1047], [4.9, 'chime', 1568]],
    music(S, H) {
      S.add('drone', 0, 0, 29, 28, .28);
      S.add('pad', 0, 0, [65, 69, 72], 12, .28, 'glass');
      [[1, 0, 65], [1, 2, 69], [2, 0, 72], [2, 2, 77]].forEach(([b, bt, m]) => S.add('piano', b, bt, [m], 3, .3));
      S.add('riser', 1, 2, 0, 6, .28);
      [65, 69, 72, 77].forEach((m, j) => S.add('bell', FILL, j * .25, m + 12, 3, .22));
      N().calm(S, H, 3, 7, { piano: .2, pad: .22, sub: .3 });
    },
  });
};

// ============ 01 · 07:52 宿舍 · 桌面小组件 ============
R.n1 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const W_AT = [3.4, 3.8, 4.2, 4.6], LIFT = 5.3, DROP = 7.4, LBL = [5.9, 6.25, 6.6, 6.95];
  const LABEL = ['今日课表', 'e码通', '我的考试', '本周课表'], ZUP = [150, 240, 240, 80];
  const CLK = [[8.4, '07:52', 0], [9, '09:58', 1], [9.6, '13:47', 2]], WEEK = 10.2;
  const ws = b => [{ now: 0 }, { seed: 5, qrK: prog(b, 3.9, 4.8, E.lin) }, {}, { k: prog(b, 4.6, 5.6, E.lin), drop: true }];
  const hl = (b, i) => prog(b, LBL[i], LBL[i] + .3, E.io) * (1 - prog(b, i < 3 ? LBL[i + 1] : DROP, (i < 3 ? LBL[i + 1] : DROP) + .3, E.io));
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 2.5 || b > 8.3) return { ...DEF, hide: true };
      return float(kf(b, [[2.5, { x: 960, y: 1500, rx: -.5, ry: .25 }], [3.5, { x: 960, y: 545, rx: .03, ry: .14 }], [5.1, { x: 960, y: 545, rx: .03, ry: .04 }], [6, { x: 1180, y: 570, rx: .2, ry: -.58, rz: .04 }],
        [DROP, { x: 1180, y: 570, rx: .16, ry: -.48, rz: .03 }], [DROP + .5, { x: 1010, y: 545, rx: .02, ry: .04 }], [8.3, { x: -420, y: 560, ry: -.4, rz: .04 }]]), L.t, b < 3.5 ? 0 : .6);
    },
    paint(c, L, flat) { const b = L.b; n.homeScreen(c, { t: L.t, time: '07:52', layers: !flat, w: W_AT.map(a => prog(b, a, a + .6, E.lin)), ws: ws(b), icon: prog(b, 3.2, 3.7) }); },
    layers(Ph) {
      const Ls = n.HOME.map(([, , w, h]) => Ph.layer(w, h, 22));
      return L => {
        const b = L.b, W = ws(b);
        Ls.forEach((ly, i) => {
          const [x, y, w, h, fn] = n.HOME[i], pop = n.eio(prog(b, W_AT[i], W_AT[i] + .6));
          const lift = n.eio(prog(b, LIFT + i * .1, LIFT + .9 + i * .1)) * (1 - n.eio(prog(b, DROP, DROP + .6))), h1 = hl(b, i) * lift;
          ly.set({ sx: x + w / 2, sy: y + h / 2, z: lift * ZUP[i] + h1 * 90, a: pop, s: (.94 + .06 * pop) * (1 + h1 * .04), dy: -(1 - pop) * 14, rx: -lift * .05, ry: lift * (i === 1 ? -.08 : i === 2 ? .08 : 0) });
          if (pop > 0) ly.paint(c => fn(c, W[i]));
        });
      };
    },
  };
  return base(K, {
    scene: '01 · 07:52 宿舍', bars: 12,
    cam: X.cam(12, [], .03),
    desc: '时间从 07:51 平滑跳到 07:52，窗外天刚亮；「课表，摆上桌面。」；主屏幕上四款小组件依次浮现；手机侧过来，小组件一层层浮起，左边逐个点名；收回；今日课表随时间推移，时钟跳到 9:58、13:47，「下一节」跟着走，天色从清晨到午后；本周课表按列铺开。',
    text: TXT() + '周三 · 宿舍第一节课前课表，摆上桌面。四款桌面小组件，不用打开应用。常用的，抬手就看到。下一节在哪，看一眼就知道。一周的课，一屏看完。按周读取教务课表，每门课一种颜色，在哪儿看都一样。' + LABEL.join(''),
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t, C = n.C;
      const ph = prog(b, 8.4, 10, E.io), close = prog(b, 8.2, 8.9, E.io) * (1 - prog(b, 10, 10.6, E.io));
      X.sky(cx, 'dawn', prog(b, 0, 1, E.io) * (1 - .55 * prog(b, 1.6, 3, E.io)) * (1 - close) + close * (1 - ph) * .8);
      X.sky(cx, 'noon', close * Math.sin(Math.PI * ph) * .8, t); X.sky(cx, 'dusk', close * prog(ph, .55, 1) * .8, t);
      stage(cx, L, (prog(b, 2.4, 3.6, E.io) * .9 + .2) * (1 - close), b > WEEK ? 1 : 0);
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { from: '07:51', to: '07:52', place: '周三 · 宿舍', line: '第一节课前', at: 0, flip: .6, out: 1.5, end: 8.1 });
      n.head(tx, L, '课表，\n摆上桌面。', { at: 1.9, out: 3, y: 470, size: 140, w: 900, st: .2, d: .7 });
      n.head(tx, L, '四款桌面小组件，不用打开应用。', { at: 2.3, out: 3, y: 780, size: 40, w: 500, col: C.grey, d: .7 });
      LABEL.forEach((s, i) => n.head(tx, L, s, { at: LBL[i] - .15, out: DROP + .1, x: 200, y: 360 + i * 96, size: 54, w: 700, align: 'left', col: K.mixC('#5B6070', '#F5F5F7', hl(b, i)), d: .6 }));
      n.head(tx, L, '常用的，抬手就看到。', { at: 6.5, out: DROP + .1, x: 200, y: 820, size: 38, w: 700, align: 'left', grad: n.GRAD, d: .7 });
      if (close > 0) {
        let now = 0; CLK.forEach(([a, , i], j) => { if (j) now = lerp(now, i, prog(b, a, a + .5, E.io)); });
        const s = 2.6;
        n.al(cx, close, () => { cx.save(); cx.translate(1220 - 162 * s, 540 - 88 * s + (1 - close) * 30); cx.scale(s, s); n.wToday(cx, { now }); cx.restore(); });
        const ci = Math.max(0, CLK.filter(c => b >= c[0]).length - 1);
        n.al(tx, close, () => X.timeRoll(tx, 410, 400, 150, ci ? CLK[ci - 1][1] : CLK[0][1], CLK[ci][1], ci ? prog(b, CLK[ci][0], CLK[ci][0] + .6, E.lin) : 1));
        n.head(tx, L, '下一节在哪，\n看一眼就知道。', { at: 8.6, out: 10, x: 200, y: 640, size: 60, w: 900, align: 'left', grad: n.GRAD, d: .7 });
      }
      const kw = prog(b, WEEK, WEEK + .7, E.io);
      if (kw > 0) {
        const s = 2.15;
        n.al(cx, kw, () => { cx.save(); cx.translate(1240 - 162 * s, 540 - 131 * s + (1 - kw) * 30); cx.scale(s, s); n.wWeek(cx, { k: prog(b, WEEK + .3, WEEK + 1.6, E.lin), drop: true }); cx.restore(); });
        n.head(tx, L, '一周的课，\n一屏看完。', { at: WEEK + .3, x: 196, y: 470, size: 92, w: 900, align: 'left', d: .7 });
        n.head(tx, L, '按周读取教务课表，\n每门课一种颜色，\n在哪儿看都一样。', { at: WEEK + .8, x: 200, y: 710, size: 34, w: 500, align: 'left', col: C.grey, lh: 1.5, d: .7 });
      }
    },
    sfx: [[.6, 'tock'], [2.5, 'swish'], ...W_AT.map(a => [a, 'tock']), [LIFT, 'swish'], [DROP, 'swish'], [9, 'tock'], [9.6, 'tock'], [WEEK, 'swish']],
    music(S, H) {
      const C2 = N().calm;
      C2(S, H, 0, 3, { piano: .2, glass: .2, sub: .28 });
      C2(S, H, 3, 12, { kick: .32, shaker: .1, bass: .28, piano: .18, pad: .2 });
      N().melody(S, 4, 'bell', .3); N().melody(S, 8, 'bell', .3, 0, N().MEL2);
    },
  });
};

// ============ 02 · 12:08 食堂 · 付款码 ============
R.n2 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const HEAD = 2, QR0 = 4.1, QR1 = 5.9, CD0 = 7.2, REF = 8.9, SWAP = REF + .4, SCAN = 10.1, DI = 10.8;
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 3.1) return { ...DEF, hide: true };
      const p = kf(b, [[3.1, { x: 1250, y: 1450, rx: -.5, ry: .4, rz: .08 }], [4.2, { x: 1250, y: 560, rx: .05, ry: -.28 }], [7, { x: 1250, y: 560, rx: .05, ry: -.28 }], [7.7, { x: 1230, y: 560, z: 120, rx: .02, ry: -.12 }],
        [9.5, { x: 1230, y: 560, z: 120, rx: .02, ry: -.12 }], [10.1, { x: 1240, y: 545, z: 320 }], [12, { x: 1240, y: 545, z: 360, ry: -.03 }]]);
      return float(p, L.t, b < 4.2 ? 0 : b > 9.5 && b < 11.3 ? .2 : 1);
    },
    paint(c, L, flat) {
      const b = L.b;
      const left = b < CD0 ? 56 - Math.max(0, b - QR1) * 2 : b < REF ? lerp(52, 0, prog(b, CD0, REF, E.io)) : 60 - (b - REF - .6) * 2;
      // 首次出码：3D 方块聚拢，模块在方块落定时整格接替；刷新：旧码逐格消散，新码逐格浮现
      const old = b < SWAP, qrK = old ? (b < REF - .1 ? prog(b, QR0, QR1, E.lin) : 1 - prog(b, REF - .1, SWAP, E.lin)) : prog(b, SWAP, REF + 1.3, E.lin);
      n.payScreen(c, { time: '12:08', seed: old ? 11 : 12, qrK, qrLand: !flat && b < REF - .1, left: b > REF && b < REF + .6 ? 0 : Math.min(60, left), press: prog(b, REF - .2, REF + .4, E.io), flash: 0, scan: -1 });
    },
    layers(Ph) { return L => Ph.qrFx(11, prog(L.b, QR0, QR1, E.lin), L.t); },
  };
  return base(K, {
    scene: '02 · 12:08 食堂', bars: 12,
    cam: X.cam(12, [], .03),
    desc: '时间平滑跳到 12:08，正午的暖光；「付款」；手机缓缓升起，小方块从近处聚拢，拼成付款码；手机周围一圈细环倒计时走完，方块重新聚拢成新码；一道柔光扫过二维码，「滴，付好了。」',
    text: TXT() + '周三 · 食堂午饭时间付款抬手，亮码，付好了。e码通付款码打开，就是码。原生界面直接出码，不用再绕进网页等加载。自动刷新过期之前，自动换新码。倒计时走完之前，新的二维码已经换好。滴，付好了。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      X.sky(cx, 'noon', prog(b, 0, 1, E.io) * (1 - .6 * prog(b, 1.6, 2.6, E.io)), t);
      stage(cx, L, prog(b, 2.8, 4.2, E.io) * .85);
      n.head(tx, L, '付款', { at: HEAD, out: 3.3, y: 470, size: 260, w: 900, d: .8 });
      n.head(tx, L, '抬手，亮码，付好了。', { at: HEAD + .4, out: 3.3, y: 690, size: 50, w: 500, col: n.C.grey, d: .7 });
      // 倒计时细环
      const p = P.pose(L), kr = prog(b, CD0 - .2, CD0 + .4, E.io) * (1 - prog(b, REF + .3, REF + .9, E.io));
      if (kr > 0 && !p.hide) {
        const sc = 2015 / (2015 - p.z), R0 = 470 * sc, left = b < REF ? lerp(52, 0, prog(b, CD0, REF, E.io)) / 52 : 0;
        n.al(cx, kr, () => {
          cx.save(); cx.lineCap = 'round';
          cx.strokeStyle = 'rgba(143,178,255,.12)'; cx.lineWidth = 2; cx.beginPath(); cx.arc(p.x, p.y, R0, 0, 7); cx.stroke();
          cx.strokeStyle = 'rgba(169,195,255,.85)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(p.x, p.y, R0, -Math.PI / 2, -Math.PI / 2 + left * 6.283); cx.stroke();
          const ha = -Math.PI / 2 + left * 6.283; n.glow(cx, p.x + Math.cos(ha) * R0, p.y + Math.sin(ha) * R0, 46, 'rgba(200,220,255,.7)', 1);
          cx.restore();
        });
      }
      halo(cx, p.x || 1230, p.y || 560, prog(b, REF + .1, REF + 1.6, E.lin), 300, 700);
      n.phoneLayer(cx, L, P);
      // 柔光扫过二维码
      if (b >= SCAN && b <= SCAN + .9) {
        const s = 2015 / (2015 - 320), y = lerp(545 + (116 - 390) * .995 * s, 545 + (366 - 390) * .995 * s, prog(b, SCAN, SCAN + .9, E.io)), a = Math.sin(Math.PI * prog(b, SCAN, SCAN + .9));
        n.glow(cx, 1240, y, 260, 'rgba(200,225,255,.35)', a);
      }
      halo(cx, 1240, 545, prog(b, DI, DI + 1.6, E.lin), 380, 900, '127,214,222');
      X.chapter(tx, L, { from: '12:07', to: '12:08', place: '周三 · 食堂', line: '午饭时间', at: 0, flip: .55, out: 1.4 });
      n.head(tx, L, 'e码通付款码', { at: 4.5, out: 7, x: 200, y: 360, size: 32, w: 700, align: 'left', col: n.C.brandLt, d: .7 });
      n.head(tx, L, '打开，就是码。', { at: 4.65, out: 7, x: 196, y: 470, size: 100, w: 900, align: 'left', d: .7, sweep: [QR1, 1, '169,195,255'] });
      n.head(tx, L, '原生界面直接出码，\n不用再绕进网页等加载。', { at: 5.1, out: 7, x: 200, y: 640, size: 36, w: 500, align: 'left', col: n.C.grey, lh: 1.5, d: .7 });
      n.head(tx, L, '自动刷新', { at: CD0 + .1, out: 9.6, x: 200, y: 330, size: 32, w: 700, align: 'left', col: n.C.brandLt, d: .7 });
      n.head(tx, L, '过期之前，\n自动换新码。', { at: CD0 + .25, out: 9.6, x: 196, y: 480, size: 96, w: 900, align: 'left', d: .7 });
      n.head(tx, L, '倒计时走完之前，\n新的二维码已经换好。', { at: CD0 + .7, out: 9.6, x: 200, y: 690, size: 36, w: 500, align: 'left', col: n.C.grey, lh: 1.5, d: .7 });
      n.head(tx, L, '滴，\n付好了。', { at: DI + .1, x: 196, y: 520, size: 120, w: 900, align: 'left', grad: n.GRAD, st: .3, d: .8 });
    },
    sfx: [[.55, 'tock'], [3.1, 'swish'], [QR1, 'chime', 1319], [REF, 'click'], [REF + 1.3, 'chime', 1568], [SCAN, 'swish'], [DI, 'ding']],
    music(S, H) {
      const C2 = N().calm;
      C2(S, H, 0, 2, { keys: .3, glass: .2, sub: .25 });
      C2(S, H, 2, 12, { kick: .36, shaker: .12, bass: .3, piano: .2, pad: .2 });
      N().melody(S, 4, 'bell', .32); N().melody(S, 8, 'bell', .32, 0, N().MEL2);
    },
  });
};

// ============ 03 · 12:09 余额 ============
R.n3 = K => {
  const { prog, E } = K, n = N(), X = FX();
  const LAND = 2.1, PH = 3.2, LIFT = 4.2, PAY = 5.6;
  const vAt = b => n.D.bal * n.eio(prog(b, .2, LAND, E.lin));
  const P = {
    pose(L) {
      const b = L.b;
      if (b < PH) return { ...DEF, hide: true };
      return float(kf(b, [[PH, { x: 2200, y: 560, ry: -.5, rz: -.03 }], [PH + .9, { x: 1290, y: 560, ry: -.24, rx: .05 }], [LIFT, { x: 1290, y: 560, ry: -.24, rx: .05 }], [LIFT + .9, { x: 1300, y: 560, z: 60, ry: -.34, rx: .12 }], [7, { x: 1300, y: 560, z: 80, ry: -.3, rx: .1 }]]), L.t);
    },
    paint(c, L, flat) { const b = L.b, lift = prog(b, LIFT, LIFT + .9); n.payScreen(c, { time: '12:09', seed: 12, left: 50 - b * 2, noBal: !flat, hi: flat ? lift : 0, pay: prog(b, PAY, PAY + .7, E.lin) }); },
    layers(Ph) {
      const ly = Ph.layer(328, 116, 22);
      return L => { const b = L.b, lift = n.eio(prog(b, LIFT, LIFT + .9)); ly.set({ sx: 180, sy: 544, z: lift * 200, rx: -lift * .08, ry: lift * .1, rz: -lift * .02, s: 1 + lift * .04 }); ly.paint(c => n.balCard(c, { hi: lift, pay: prog(b, PAY, PAY + .7, E.lin) })); };
    },
  };
  return base(K, {
    scene: '03 · 12:09 余额', bars: 7,
    cam: X.cam(7, [], .03),
    desc: '数字从 0 平滑滚到校园卡余额，越滚越慢；网费和更新时间；手机从右侧滑进，余额卡从屏幕里浮起来，点一下充值。',
    text: TXT() + '周三 · 食堂校园卡余额网费刚刚更新校园卡余额，跟着码一起到。取码时一并同步余额和网费，不够了，充值就在旁边。¥',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      X.sky(cx, 'noon', .25, t);
      stage(cx, L, prog(b, 0, 1, E.io) * (1 - prog(b, PH - .5, PH, E.io)) * .6 + prog(b, PH, PH + 1.2, E.io) * .85);
      const kin = prog(b, 0, .8, E.io), kout = prog(b, PH - .6, PH, E.io), a = kin * (1 - kout);
      if (a > 0) {
        n.glow(cx, 960, 520, 700, 'rgba(91,140,255,.30)', a * (.5 + .5 * prog(b, LAND - .3, LAND + .4, E.io)));
        n.al(tx, a, () => X.odo(tx, 960, 520 - kout * 20 + (1 - kin) * 24, vAt(b), n.D.bal, 230, { pre: '¥', vel: (vAt(b) - vAt(b - .05)) / .05, grad: ['#FFFFFF', '#A9C3FF'] }));
      }
      n.head(tx, L, '校园卡余额', { at: .1, out: PH - .6, y: 300, size: 38, w: 500, col: n.C.grey, d: .7 });
      n.head(tx, L, `网费 ¥${n.money(n.D.fee)} · 刚刚更新`, { at: LAND + .1, out: PH - .6, y: 740, size: 38, w: 500, col: n.C.teal, d: .7 });
      const lift = prog(b, LIFT, LIFT + .9, E.io);
      if (lift > 0) n.glow(cx, 1300, 560, 520, 'rgba(91,140,255,.30)', lift);
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { card: false, from: '12:09', to: '12:09', place: '周三 · 食堂', end: 7 });
      n.head(tx, L, '校园卡', { at: PH + .7, out: 6.6, x: 200, y: 340, size: 32, w: 700, align: 'left', col: n.C.brandLt, d: .7 });
      n.head(tx, L, '余额，\n跟着码一起到。', { at: PH + .85, out: 6.6, x: 196, y: 500, size: 96, w: 900, align: 'left', d: .7 });
      n.head(tx, L, '取码时一并同步余额和网费，\n不够了，充值就在旁边。', { at: PH + 1.3, out: 6.6, x: 200, y: 700, size: 36, w: 500, align: 'left', col: n.C.grey, lh: 1.5, d: .7 });
    },
    sfx: [[LAND, 'chime', 1319], [PH, 'swish'], [LIFT, 'swish'], [PAY, 'click']],
    music(S, H) {
      const C2 = N().calm;
      C2(S, H, 0, 3, { piano: .2, glass: .2, sub: .26 });
      C2(S, H, 3, 7, { kick: .32, shaker: .1, bass: .28, keys: .22, pad: .2 });
      N().melody(S, 3, 'box', .38);
    },
  });
};

// ============ 04 · 21:30 校外 · 校园内网 ============
R.n4 = K => {
  const { prog, E } = K, n = N(), X = FX();
  const ERR = 1.5, UP = 3.1, PRESS = 3.8, ON = 5.2, DIA = 6.6;
  const P = {
    pose(L) {
      const b = L.b;
      if (b < UP) return { ...DEF, hide: true };
      return float(kf(b, [[UP, { x: 960, y: 1450, rx: -.45, ry: -.25 }], [UP + .8, { x: 960, y: 545, rx: .03, ry: .08 }], [PRESS + .2, { x: 960, y: 545, ry: 0 }], [ON, { x: 960, y: 545, z: 520 }],
        [ON + 1, { x: 1260, y: 545, z: 120, ry: -.2 }], [DIA, { x: 1260, y: 545, z: 120, ry: -.24 }], [DIA + .9, { x: 410, y: 545, z: -200, ry: .2 }], [10, { x: 410, y: 545, z: -200, ry: .14 }]]), L.t, b > PRESS && b < ON + .5 ? .2 : .7);
    },
    paint(c, L) { const b = L.b; n.vpnScreen(c, { time: '21:30', t: L.t, state: b < PRESS + .15 ? 0 : b < ON ? 1 : 2, k: prog(b, ON, ON + .7, E.io), press: prog(b, PRESS, PRESS + .3, E.lin) }); },
  };
  // 慢速光线：稀疏、细、慢
  function lines(cx, t, a) {
    if (a <= 0) return;
    n.al(cx, a, () => {
      for (let i = 0; i < 34; i++) {
        const x = 30 + i * 56 + n.hash(i * 1.3) * 30, sp = 40 + n.hash(i) * 60, ph = n.hash(i * 3.3) * 1400;
        for (let j = 0; j < 2; j++) { const y = -300 + ((t * sp + ph + j * 700) % 1600), h = 140 + 200 * n.hash(i * 7 + j), g = cx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(91,140,255,0)'); g.addColorStop(1, `rgba(143,178,255,${.12 + .22 * n.hash(i + j * 9)})`); cx.fillStyle = g; cx.fillRect(x, y, 1.5, h); }
      }
    });
  }
  function route(cx, p0, p1, p2, k, col, lw, t, packets, sp) {
    if (k <= 0) return;
    const pt = u => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
    cx.strokeStyle = col; cx.lineWidth = lw; cx.lineCap = 'round'; cx.beginPath();
    for (let i = 0; i <= 60 * k; i++) { const [x, y] = pt(i / 60); i ? cx.lineTo(x, y) : cx.moveTo(x, y); }
    cx.stroke();
    if (k >= 1) for (let j = 0; j < packets; j++) { const u = (t * sp + j / packets) % 1, [x, y] = pt(u), a = Math.sin(Math.PI * u); n.glow(cx, x, y, 20, 'rgba(255,255,255,.8)', .7 * a); cx.fillStyle = `rgba(255,255,255,${a})`; cx.beginPath(); cx.arc(x, y, 4, 0, 7); cx.fill(); }
  }
  function box(cx, tx2, x, y, w, h, k, title, sub, accent) {
    if (k <= 0) return;
    n.al(cx, k, () => n.rr(cx, x, y + (1 - k) * 20, w, h, 28, accent ? 'rgba(15,69,175,.24)' : 'rgba(255,255,255,.04)', accent ? 'rgba(143,178,255,.55)' : 'rgba(255,255,255,.14)', 1.5));
    n.al(tx2, k, () => { n.tx(tx2, title, x + 40, y + 68 + (1 - k) * 20, n.fnt(700, 44), '#F5F5F7'); n.tx(tx2, sub, x + 40, y + 128 + (1 - k) * 20, n.fnt(500, 26), accent ? '#A9C3FF' : n.C.grey); });
  }
  return base(K, {
    scene: '04 · 21:30 校外', bars: 10,
    par: L => [.74 - .2 * prog(L.b, ERR, ERR + .8, E.io) * (1 - prog(L.b, UP - .4, UP + .4, E.io)), .5, .36, .12],
    cam: X.cam(10, [], .03),
    desc: '时间平滑跳到 21:30，夜里城市的散景；画面暗下去：「人在校外，教务系统打不开？」，一张安静的报错卡片；手机升起，点「连接学生 VPN」，镜头缓缓推近屏幕，连接中；已连接时屏幕中心泛起柔光，背景里慢速光线流过；分流示意图：校内流量走学生 VPN 隧道到校园内网，其他流量直连互联网。',
    text: TXT() + '周三 · 校外自习回来人在校外，教务系统打不开？无法连接到教务系统请在校园网环境下访问校园内网，随身带着。学生 VPN 隧道教务系统 · 课表 · 考试 · 成绩互联网其他流量照常直连应用内学生 VPN，只分流，不劫持公网。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      X.sky(cx, 'night', prog(b, 0, 1, E.io) * (1 - .5 * prog(b, ERR, ERR + .8, E.io) * (1 - prog(b, UP, UP + .8))) * (b > ON ? .5 : .9), t);
      stage(cx, L, .3 + .55 * prog(b, ON, ON + 1, E.io));
      lines(cx, t, prog(b, ON, ON + 1.2, E.io) * (1 - .5 * prog(b, DIA, DIA + 1, E.io)));
      // 打不开：安静的报错卡片
      const ke = prog(b, ERR + .2, ERR + .9, E.io) * (1 - prog(b, UP - .5, UP, E.io));
      if (ke > 0) n.al(cx, ke, () => {
        const y = 700 + (1 - ke) * 16;
        n.rr(cx, 560, y - 100, 800, 200, 30, 'rgba(255,255,255,.05)', 'rgba(255,255,255,.16)', 1.5);
        cx.strokeStyle = 'rgba(255,255,255,.7)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(660, y, 40, 0, 7); cx.stroke();
        n.tx(cx, '!', 660, y + 2, n.fnt(700, 46), 'rgba(255,255,255,.8)', 'center');
        n.tx(cx, '无法连接到教务系统', 730, y - 26, n.fnt(700, 42), '#E6E8EE');
        n.tx(cx, '请在校园网环境下访问', 730, y + 32, n.fnt(500, 28), '#8A8F98');
      });
      n.head(tx, L, '人在校外，\n教务系统打不开？', { at: ERR, out: UP - .5, y: 360, size: 88, w: 900, st: .3, d: .8 });
      n.glow(cx, 960, 545 - 128 * 1.35, 520, 'rgba(143,178,255,.45)', Math.sin(Math.PI * prog(b, ON - .2, ON + 1.4)));
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { from: '21:29', to: '21:30', place: '周三 · 校外', line: '自习回来', at: 0, flip: .55, out: 1.3 });
      n.head(tx, L, '校园内网，\n随身带着。', { at: ON + .5, out: DIA, x: 196, y: 520, size: 110, w: 900, align: 'left', grad: n.GRAD, st: .25, d: .8 });
      const ka = prog(b, DIA + .7, DIA + 1.6, E.io), kb = prog(b, DIA + 1.5, DIA + 2.3, E.io);
      route(cx, [600, 500], [920, 330], [1180, 330], ka, 'rgba(91,140,255,.22)', 26, t, 0, 0);
      route(cx, [600, 500], [920, 330], [1180, 330], ka, '#8FB2FF', 3, t, 3, .35);
      route(cx, [600, 600], [920, 770], [1180, 770], kb, 'rgba(255,255,255,.22)', 2, t, 2, .28);
      const kl = prog(b, DIA + 1.3, DIA + 1.8, E.io);
      if (kl > 0) n.al(tx, kl, () => { n.rr(tx, 795, 342, 230, 46, 23, 'rgba(10,26,68,.85)', 'rgba(143,178,255,.45)', 1.2); n.tx(tx, '学生 VPN 隧道', 910, 365, n.fnt(600, 22), '#A9C3FF', 'center'); });
      box(cx, tx, 1200, 230, 560, 200, prog(b, DIA + 1.2, DIA + 1.9, E.io), '校园内网', '教务系统 · 课表 · 考试 · 成绩', true);
      box(cx, tx, 1200, 670, 560, 200, prog(b, DIA + 2, DIA + 2.7, E.io), '互联网', '其他流量照常直连', false);
      n.head(tx, L, '应用内学生 VPN，只分流，不劫持公网。', { at: DIA + 2.5, y: 975, size: 38, w: 700, grad: n.GRAD, d: .7 });
    },
    sfx: [[.55, 'tock'], [UP, 'swish'], [PRESS, 'click'], [ON, 'chime', 1568], [ON + .1, 'chime', 2093], [DIA, 'swish']],
    music(S, H) {
      const C2 = N().calm;
      S.add('pad', 0, 0, H.CH.Dm.pad, 12, .28, 'glass');
      S.add('drone', 0, 0, 26, 20, .25);
      [[0, 2, 62], [1, 0, 65], [1, 2, 69], [2, 0, 65], [2, 2, 62], [3, 0, 58]].forEach(([b, bt, m]) => S.add('piano', b, bt, [m], 3, .26));
      S.add('pad', 3, 0, H.CH.Bb.pad, 8, .26, 'string');
      S.add('riser', 3, 2, 0, 6.5, .3);
      for (let j = 0; j < 6; j++) S.add('tick', 4, j * .5 + 1, 0, 0, .15);
      [65, 69, 72, 77].forEach((m, j) => S.add('bell', ON, j * .25, m + 12, 3, .22));
      C2(S, H, 5, 10, { kick: .34, shaker: .12, bass: .3, piano: .2, pad: .22 });
      N().melody(S, 6, 'bell', .3);
    },
  });
};

// ============ 05 · 21:32 成绩 ============
R.n5 = K => {
  const { prog, E } = K, n = N(), X = FX();
  const Q = 1, UP = 2.1, FAN = 3, BACKB = 4.6, TAB = 5, FL = [5.3, 6, 6.7];
  const SCORES = [[95, '程序设计基础 · 4 学分'], [92, '高等数学（上） · 5 学分'], [90, '大学物理 · 4 学分']];
  const P = {
    pose(L) {
      const b = L.b;
      if (b < UP) return { ...DEF, hide: true };
      return float(kf(b, [[UP, { x: 2200, y: 545, ry: -.5, rz: .04 }], [UP + .9, { x: 1330, y: 545, ry: -.22, rx: .04 }], [FAN, { x: 1330, y: 545, ry: -.22, rx: .04 }], [FAN + .9, { x: 1420, y: 545, ry: .32, rx: .07 }],
        [BACKB, { x: 1420, y: 545, ry: .3, rx: .06 }], [BACKB + .6, { x: 1330, y: 545, ry: -.2, rx: .04 }], [8, { x: 1330, y: 545, z: 70, ry: -.14, rx: .04 }]]), L.t);
    },
    paint(c, L, flat) {
      const b = L.b, tk = prog(b, TAB, TAB + .4, E.io);
      n.acadScreen(c, { time: '21:32', tab: tk > .5 ? 1 : 0, tabK: tk, lift: !flat, k: tk > .5 ? prog(b, TAB + .2, TAB + 1.1, E.lin) : prog(b, UP + .4, UP + 1.4, E.lin), n: prog(b, TAB + .4, TAB + 1.8, E.lin) });
    },
    layers(Ph) {
      const Ls = [0, 1, 2, 3].map(() => Ph.layer(328, 92, 18));
      return L => {
        const b = L.b;
        Ls.forEach((ly, i) => {
          const ap = n.eio(prog(b, UP + .4 + i * .15, UP + 1 + i * .15)) * (1 - prog(b, TAB, TAB + .15));
          const lift = n.eio(prog(b, FAN + i * .1, FAN + .9 + i * .1)) * (1 - n.eio(prog(b, BACKB, BACKB + .6)));
          ly.set({ sx: 180, sy: 172 + i * 104 + 46, dy: (1 - ap) * -16, z: lift * (110 + i * 60), dx: -lift * (140 + i * 36), rz: lift * (i - 1.5) * .06, ry: -lift * .26, a: ap });
          if (ap > 0) ly.paint(c => n.examCard(c, i));
        });
      };
    },
  };
  return base(K, {
    scene: '05 · 21:32 成绩', bars: 8,
    cam: X.cam(8, [], .03),
    desc: '时间平滑跳到 21:32；「成绩出了吗？」；手机滑进，考试卡片从屏幕里浮起，缓缓摊开；收回，切到成绩页，左边的大号分数平滑滚出 95、92、90。',
    text: TXT() + '周三 · 校外成绩出了吗？考试安排时间、地点、座位，一张卡片说清。按日期排好，桌面小组件也能看。成绩成绩和学分，一页看全。数据经校园内网从教务同步。' + SCORES.flat().join(''),
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t, C = n.C;
      X.sky(cx, 'night', .35, t);
      stage(cx, L, .3 + .55 * prog(b, UP - .3, UP + 1, E.io), 1);
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { from: '21:31', to: '21:32', place: '周三 · 校外', at: 0, flip: .45, out: .95 });
      n.head(tx, L, '成绩出了吗？', { at: Q, out: UP - .1, y: 500, size: 140, w: 900, d: .8 });
      n.head(tx, L, '考试安排', { at: FAN, out: BACKB, x: 200, y: 340, size: 32, w: 700, align: 'left', col: C.brandLt, d: .7 });
      n.head(tx, L, '时间、地点、座位，\n一张卡片说清。', { at: FAN + .15, out: BACKB, x: 196, y: 480, size: 76, w: 900, align: 'left', d: .7 });
      n.head(tx, L, '按日期排好，桌面小组件也能看。', { at: FAN + .6, out: BACKB, x: 200, y: 660, size: 34, w: 500, align: 'left', col: C.grey, d: .7 });
      // 成绩：大号数字平滑滚到每一门的分数
      const kf2 = prog(b, FL[0] - .4, FL[0] + .2, E.io);
      if (kf2 > 0) {
        const ci = Math.max(0, FL.filter(f => b >= f).length - 1), prev = ci ? SCORES[ci - 1][0] : 0, v = prev + (SCORES[ci][0] - prev) * n.eio(prog(b, FL[ci], FL[ci] + .55, E.lin));
        n.al(tx, kf2, () => { X.odo(tx, 330, 540, v, 95, 200, { dec: 0, grad: ['#FFFFFF', '#A9C3FF'] }); });
        SCORES.forEach(([, lab], j) => { const a = prog(b, FL[j], FL[j] + .4, E.io) * (j < 2 ? 1 - prog(b, FL[j + 1] - .1, FL[j + 1] + .3, E.io) : 1); if (a > 0) n.al(tx, a * kf2, () => n.tx(tx, lab, 200, 700, n.fnt(500, 30), '#C9D3E6')); });
      }
      n.head(tx, L, '成绩', { at: TAB + .1, x: 200, y: 250, size: 32, w: 700, align: 'left', col: C.brandLt, d: .7 });
      n.head(tx, L, '成绩和学分，一页看全。', { at: TAB + .25, x: 196, y: 330, size: 60, w: 900, align: 'left', grad: n.GRAD, d: .7 });
      n.head(tx, L, '数据经校园内网从教务同步。', { at: 7, x: 200, y: 800, size: 32, w: 500, align: 'left', col: C.grey, d: .7 });
    },
    sfx: [[.45, 'tock'], [UP, 'swish'], [FAN, 'swish'], [BACKB, 'swish'], [TAB, 'click'], [FL[0] + .5, 'chime', 1568]],
    music(S, H) {
      const C2 = N().calm;
      C2(S, H, 0, 2, { keys: .26, glass: .2, sub: .24 });
      C2(S, H, 2, 8, { kick: .32, shaker: .1, bass: .28, piano: .18, pad: .2 });
      N().melody(S, 2, 'kalimba', .42, 12); N().melody(S, 6, 'kalimba', .42, 12, N().MEL2, 0, 2);
    },
  });
};

// ============ 06 · 收尾 ============
R.n6 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const TW = 440, TH = 300, GAP = 24, X0 = (1920 - TW * 3 - GAP * 2) / 2, Y0 = (1080 - TH * 2 - GAP) / 2 + 30;
  const TILES = ['付款码', '校园卡余额', '桌面小组件', '课表', '校园内网', '考试 · 成绩'];
  const SUBS = ['亮码即付，自动换码', '取码时一起同步', '今日、本周、考试、e码通', '按周翻页，课程配色', '应用内学生 VPN', '卡片和分数，一页看全'];
  const STAMP = ['12:08', '12:09', '07:52', '全天', '21:30', '21:32'];
  const COL = 3.1, LOGO = 3.9, SW = 2;
  function tile(cx, tx, i, b, t) {
    const r = Math.floor(i / 3), c = i % 3, x = X0 + c * (TW + GAP), y = Y0 + r * (TH + GAP);
    const e = n.eio(prog(b, .4 + i * .12, 1.1 + i * .12, E.lin)), kc = n.eio(prog(b, COL + (5 - i) * .05, COL + .9 + (5 - i) * .05, E.lin));
    if (e <= 0 || kc >= 1) return;
    const cxp = x + TW / 2, cyp = y + TH / 2 + (1 - e) * 24, mx = lerp(cxp, 960, kc), my = lerp(cyp, 430, kc), s = (.97 + .03 * e) * (1 - kc * .85), a = e * (1 - kc);
    const body = c2 => { c2.save(); c2.translate(mx, my); c2.scale(s, s); c2.translate(-TW / 2, -TH / 2); c2.globalAlpha *= a; return () => c2.restore(); };
    let done = body(cx);
    n.rr(cx, 0, 0, TW, TH, 30, '#0E1117', 'rgba(255,255,255,.09)', 1.2);
    if (i === 0) { n.rr(cx, TW - 186, 36, 150, 150, 16, '#fff'); n.qr(cx, TW - 176, 46, 130, 21, 1); }
    if (i === 1) { const g = cx.createLinearGradient(36, 60, 360, 160); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#A9C3FF'); n.tx(cx, '¥' + n.money(n.D.bal), 36, 120, n.fnt(700, 86), g); }
    if (i === 2) { cx.save(); cx.translate(TW - 36 - 324 * .62, 30); cx.scale(.62, .62); n.wToday(cx, { now: 1 }); cx.restore(); }
    if (i === 3) { cx.save(); cx.translate(TW - 36 - 324 * .62, 22); cx.scale(.62, .62); n.wWeek(cx, {}); cx.restore(); }
    if (i === 4) { n.rr(cx, TW - 176, 36, 140, 140, 70, n.C.brand); n.logo(cx, TW - 106, 108, 84, { fill: '#fff', wave: 1.2, t: t * .7 }); }
    if (i === 5) { n.tx(cx, '95', TW - 40, 108, n.fnt(700, 96), '#8FB2FF', 'right'); n.tx(cx, '4 学分', TW - 44, 168, n.fnt(500, 24), n.C.grey, 'right'); }
    const sk = prog(b, SW + (c + r) * .12, SW + .9 + (c + r) * .12, E.io);
    if (sk > 0 && sk < 1) { cx.save(); cx.beginPath(); cx.roundRect(0, 0, TW, TH, 30); cx.clip(); const bx = -200 + (TW + 400) * sk, g = cx.createLinearGradient(bx - 140, 0, bx + 60, TH); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.10)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = g; cx.fillRect(0, 0, TW, TH); cx.restore(); }
    done();
    done = body(tx);
    n.rr(tx, 28, 28, 84, 34, 17, 'rgba(143,178,255,.12)'); n.tx(tx, STAMP[i], 70, 45, n.fnt(600, 20), '#A9C3FF', 'center');
    n.tx(tx, TILES[i], 36, TH - 84, n.fnt(700, 40), '#F5F5F7'); n.tx(tx, SUBS[i], 36, TH - 38, n.fnt(500, 24), n.C.grey);
    done();
  }
  return base(K, {
    scene: '06 · 收尾', bars: 7, par: [.74, .5, .36, .1],
    cam: X.cam(7, [], .03),
    desc: '「从早八，到深夜。」；六格便当盒依次浮现，每格带着今天的时间戳（07:52、12:08、12:09、21:30、21:32）；一道柔光缓缓扫过；六格缓缓聚拢、淡去，山川图标在中心亮起；「东大码」「山川为志，河水为程。」；版本与声明，淡出。',
    text: TXT() + TILES.join('') + SUBS.join('') + STAMP.join('') + '¥95从早八，到深夜。东大码山川为志，河水为程。NEU eCode 7.6 · Android 7.0 及以上开源 · 非东北大学官方应用学分',
    draw(cx, tx, L) {
      const b = L.b, t = L.t, out = 1 - prog(b, 6.2, 7, E.io);
      stage(cx, L, (.45 + .4 * prog(b, COL, COL + 1, E.io)) * out);
      [['rgba(61,116,240,.32)', 380, .11], ['rgba(127,214,222,.22)', 960, .07], ['rgba(140,110,240,.20)', 1540, .09]].forEach(([c0, x0, f], i) => n.glow(cx, x0 + Math.sin(t * f * 4 + i) * 200, -120 + Math.sin(t * f * 3) * 30, 700, c0, out * .9));
      for (let i = 0; i < 6; i++) tile(cx, tx, i, b, t);
      n.head(tx, L, '从早八，到深夜。', { at: .2, out: COL - .2, y: 120, size: 56, w: 900, grad: n.GRAD, d: .8 });
      const kl = prog(b, LOGO - .4, LOGO + .6, E.io);
      if (kl > 0) n.al(cx, out * kl, () => { n.glow(cx, 960, 430, 560, 'rgba(61,116,240,.42)', 1); n.logo(cx, 960, 430, 210 + 20 * kl, { fill: 'grad', wave: 1, t: t * .7, sweep: prog(b, LOGO + .6, LOGO + 1.6, E.lin) }); });
      n.head(tx, L, '东大码', { at: LOGO + .2, out: 6.2, y: 655, size: 140, w: 900, d: .8 });
      n.head(tx, L, '山川为志，河水为程。', { at: LOGO + .6, out: 6.2, y: 785, size: 42, w: 700, fam: n.SERIF, col: '#C9D3E6', d: .8 });
      n.head(tx, L, 'NEU eCode 7.6 · Android 7.0 及以上', { at: 5.2, out: 6.2, y: 905, size: 24, w: 500, col: n.C.grey, d: .7 });
      n.head(tx, L, '开源 · 非东北大学官方应用', { at: 5.35, out: 6.2, y: 947, size: 21, w: 500, col: n.C.dim, d: .7 });
    },
    sfx: [[SW, 'swish'], [COL, 'swish'], [LOGO, 'chime', 1047], [LOGO + .6, 'chime', 1568]],
    music(S, H) {
      const C2 = N().calm;
      C2(S, H, 0, 3, { kick: .32, shaker: .1, bass: .28, piano: .2, pad: .22 });
      N().melody(S, 0, 'bell', .3, 0, N().MEL2, 0, 2);
      S.add('pad', 3, 0, [65, 69, 72, 77], 16, .32, 'string');
      S.add('pad', 3, 0, [60, 65, 69], 16, .24, 'glass');
      S.add('bass', 3, 0, 41, 14, .34, 'sub');
      S.add('piano', 4, 0, [53, 60, 65, 69, 72], 8, .3);
      [[4, 0, 77, 2], [4, 2, 81, 2], [5, 0, 84, 6]].forEach(([b, bt, m, d]) => S.add('bell', b, bt, m, d, .3));
    },
  });
};
})();
