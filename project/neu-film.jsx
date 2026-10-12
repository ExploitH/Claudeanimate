// 东大码 · 宣传片（约 2 分钟，发布会风格）：「从早八，到深夜」，一个学生的一天
// n0 开场：光点从四周盘旋飞来，落成山川轮廓；填色、冲击波、扫光；「从早八，到深夜。」
// n1 07:52 宿舍：翻页时钟；主屏幕上四款小组件弹出，手机侧过来，小组件一层层浮起（爆炸图）；今日课表延时摄影；本周课表方块落下
// n2 12:08 食堂：「付款」砸下来；二维码由几百个小方块飞来拼成；倒计时光环走完，冲击波，换新码；扫码光束，「滴」的声波
// n3 12:09 余额：滚轮数字跳到余额；余额卡从屏幕里浮起来，点充值
// n4 21:30 校外：红色故障画风——教务系统打不开；连接学生 VPN，镜头扎进屏幕，光速隧道，闪白，已连接；分流示意图
// n5 21:32 成绩：「成绩出了吗？」；考试卡片像一手牌一样摊开；成绩翻牌
// n6 收尾：六格便当盒带着时间戳，扫光，收拢、内爆成山川图标；「东大码」
// 时间单位是小节（120 BPM，一小节 2 秒）。手机是 3D（three.js），没有 three.js 时画平面版。
(() => {
const R = (window.MV_W = window.MV_W || {});
const N = () => window.NEU, FX = () => window.NEU_FX;
const PAR = [.74, .5, .42, .24]; // 电影画风：曝光、冷暖（中性）、暗角、光晕和颗粒
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
const float = (p, t, a = 1) => ({ ...p, y: p.y + Math.sin(t * 1.1) * 6 * a, ry: p.ry + Math.sin(t * .7) * .03 * a, rx: p.rx + Math.sin(t * .9 + 1) * .015 * a });
function stage(cx, L, a = 1, hue = 0) {
  const n = N(), t = L.T;
  n.glow(cx, 960 + Math.sin(t * .13) * 380, 300 + Math.cos(t * .11) * 120, 900, hue ? 'rgba(14,124,134,.30)' : 'rgba(15,69,175,.34)', a);
  n.glow(cx, 960 - Math.sin(t * .09) * 460, 860 + Math.sin(t * .15) * 90, 760, hue ? 'rgba(15,69,175,.22)' : 'rgba(14,124,134,.16)', a);
}
const ticks = (a, b, n, kind = 'tock', x, curve = 1) => Array.from({ length: n }, (_, i) => [a + (b - a) * Math.pow(i / n, curve), kind, x]);
const accel = (a, b, n, kind = 'tock', x) => Array.from({ length: n }, (_, i) => [a + (b - a) * (1 - Math.pow(1 - i / n, 2)), kind, x]);
const TXT = () => N().TXT;

// ============ 00 · 开场 ============
R.n0 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const FILL = 2.85, HIT = 3;
  return {
    scene: '00 · 开场', bars: 7, look: K.LOOK.PRISM, par: L => [.6 * prog(L.b, 2.8, 4.5), 0, 0, 0],
    cam: X.cam(7, [[HIT, 1]]), flash: X.flash([[HIT, .18]]),
    desc: '黑场里几百个光点从四周盘旋飞来，落成山川轮廓；描边亮起、填色，冲击波和放射光，扫光；「东大码」「NEU eCode」；「从早八，到深夜。」',
    text: TXT() + '东大码NEU eCode从早八，到深夜。东北大学校园生活的原生伴侣',
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      stage(cx, L, prog(b, 2.8, 3.8) * .9);
      const mv = prog(b, 3.4, 4.1, E.io), lx = 960, ly = lerp(500, 330, mv), lw = lerp(460, 190, mv);
      const fk = prog(b, FILL, FILL + .25, E.out);
      n.al(cx, 1 - prog(b, FILL, FILL + .5), () => X.swarm(cx, lx, ly, lw, prog(b, .1, 2.6, E.lin), t));
      n.al(cx, prog(b, 2.1, 2.8) * (1 - fk), () => { n.glow(cx, lx, ly, lw, 'rgba(91,140,255,.45)', 1); n.logo(cx, lx, ly, lw, { stroke: '#BFD3FF', strokeK: prog(b, 2.1, 2.8, E.io), lw: 3 }); });
      X.ring(cx, lx, ly, prog(b, HIT, HIT + 1, E.lin), 1400);
      X.burst(cx, lx, ly, prog(b, HIT, HIT + .8, E.lin), { n: 64, r0: 240, r1: 1200 });
      n.logo(cx, lx, ly, lw, { fill: 'grad', fillK: fk, wave: 1.1 * fk, t, sweep: prog(b, 3.7, 4.4, E.lin) });
      n.head(tx, L, '东大码', { at: 3.6, y: 600, size: 156, w: 900, sweep: [4.3, .7, '169,195,255'] });
      n.head(tx, L, 'NEU eCode', { at: 4, y: 712, size: 40, w: 500, col: n.C.grey, ls: .32 });
      n.head(tx, L, '从早八，到深夜。', { at: 4.6, y: 840, size: 58, w: 700, grad: n.GRAD, sweep: [5.4, .7] });
      n.head(tx, L, '东北大学校园生活的原生伴侣', { at: 5.1, y: 918, size: 28, w: 500, col: n.C.dim, ls: .1 });
    },
    sfx: [[.1, 'swoosh3d'], [1.2, 'sparkle'], [2.1, 'sparkle'], [2.8, 'whoosh'], [4.3, 'chime', 1568], [5.4, 'chime', 2093]],
    music(S, H) {
      S.add('drone', 0, 0, 29, 28, .4);
      S.add('pad', 0, 0, [65, 69, 72], 12, .35, 'glass');
      [65, 69, 72, 77, 81, 84, 89, 93].forEach((m, i) => S.add('bell', Math.floor(i / 4) + 1, (i % 4), m, 2, .25 + i * .02));
      S.add('riser', 1, 0, 0, 8, .6);
      S.add('impact', HIT, 0, 0, 0, .9); S.add('crash', HIT, 0, 0, 0, .5);
      S.add('bass', HIT, 0, 41, 15, .55, 'sub');
      N().PROG.forEach((c, i) => { S.add('piano', HIT + i, 0, H.CH[c].pad, 4, .42); S.add('pad', HIT + i, 0, H.CH[c].pad, 4, .3, 'string'); });
      S.add('riser', 6, 0, 0, 4, .75);
    },
  };
};

// ============ 01 · 07:52 宿舍 · 桌面小组件 ============
R.n1 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const W_AT = [3.4, 3.75, 4.1, 4.45], LIFT = 5.1, DROP = 7, LBL = [5.6, 6, 6.4, 6.8];
  const LABEL = ['今日课表', 'e码通', '我的考试', '本周课表'], ZUP = [170, 280, 280, 90];
  const CLK = [[8, '07:52', 0], [8.6, '09:58', 1], [9.3, '13:47', 2]], WEEK = 10.1;
  const ws = b => [{ now: 0 }, { seed: 5, qrK: prog(b, 3.85, 4.5, E.lin) }, {}, { k: prog(b, 4.5, 5.3, E.lin), drop: true }];
  const hl = (b, i) => prog(b, LBL[i], LBL[i] + .25) * (1 - prog(b, i < 3 ? LBL[i + 1] : DROP, (i < 3 ? LBL[i + 1] : DROP) + .25));
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 2.7 || b > 7.9) return { ...DEF, hide: true };
      return float(kf(b, [[2.7, { x: 960, y: 1650, rx: -.9, ry: .4 }], [3.4, { x: 960, y: 545, rx: .04, ry: .22 }], [5, { x: 960, y: 545, rx: .04, ry: .08 }], [5.6, { x: 1180, y: 570, rx: .22, ry: -.62, rz: .05 }],
        [DROP, { x: 1180, y: 570, rx: .18, ry: -.5, rz: .04 }], [DROP + .45, { x: 1000, y: 545, rx: .02, ry: .05 }], [7.9, { x: -500, y: 600, ry: -.6, rz: .1 }]]), L.t, b < 3.4 ? 0 : .6);
    },
    paint(c, L, flat) { const b = L.b; n.homeScreen(c, { t: L.t, time: '07:52', layers: !flat, w: W_AT.map(a => prog(b, a, a + .45, E.lin)), ws: ws(b), icon: prog(b, 3.2, 3.6) }); },
    layers(Ph) {
      const Ls = n.HOME.map(([, , w, h]) => Ph.layer(w, h, 22));
      return L => {
        const b = L.b, W = ws(b);
        Ls.forEach((ly, i) => {
          const [x, y, w, h, fn] = n.HOME[i], pop = prog(b, W_AT[i], W_AT[i] + .45, E.lin);
          const lift = n.eio(prog(b, LIFT + i * .08, LIFT + .6 + i * .08)) * (1 - n.eio(prog(b, DROP, DROP + .45))), h1 = hl(b, i) * lift;
          ly.set({ sx: x + w / 2, sy: y + h / 2, z: lift * ZUP[i] + h1 * 120, a: Math.min(1, pop * 2.5), s: (.6 + .4 * n.back(pop)) * (1 + h1 * .06), rx: -lift * .06, ry: lift * (i === 1 ? -.1 : i === 2 ? .1 : 0) });
          if (pop > 0) ly.paint(c => fn(c, W[i]));
        });
      };
    },
  };
  return {
    scene: '01 · 07:52 宿舍', bars: 12, look: K.LOOK.FILM, par: PAR,
    enter: { kind: K.TR.FLASH, a: 1, b: 1, flash: .9 },
    cam: X.cam(12, [[3, .5]]), pulse: L => L.b > 3 && L.b < 7.9 ? .5 : 0,
    desc: '翻页时钟 07:51 → 07:52，窗外天刚亮；「课表，摆上桌面。」；主屏幕上今日课表、e码通、我的考试、本周课表弹出；手机侧过来，小组件一层层浮起，逐个点名；收回；今日课表延时摄影，时钟翻到 9:58、13:47，「下一节」跟着走，天色从清晨到午后；本周课表的方块从天而降。',
    text: TXT() + '周三 · 宿舍第一节课前课表，摆上桌面。四款桌面小组件，不用打开应用。常用的，抬手就看到。下一节在哪，看一眼就知道。一周的课，一屏看完。按周读取教务课表，每门课一种颜色，在哪儿看都一样。' + LABEL.join(''),
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t, C = n.C;
      // 天色：清晨 → （特写时）正午 → 午后
      const ph = prog(b, 8, 9.8, E.lin), close = prog(b, 7.85, 8.3) * (1 - prog(b, 9.85, 10.15));
      X.sky(cx, 'dawn', prog(b, 0, .5) * (1 - .55 * prog(b, 1.6, 2.6)) * (1 - close) + close * (1 - ph));
      X.sky(cx, 'noon', close * Math.sin(Math.PI * ph), t); X.sky(cx, 'dusk', close * prog(ph, .55, 1), t);
      X.leak(cx, t, .6 * prog(b, 0, .4) * (1 - prog(b, 1.4, 2)));
      stage(cx, L, (prog(b, 2.4, 3.2) * .9 + .2) * (1 - close), b > WEEK ? 1 : 0);
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { from: '07:51', to: '07:52', place: '周三 · 宿舍', line: '第一节课前', at: 0, flip: .5, out: 1.45, end: 7.6 });
      n.head(tx, L, '课表，\n摆上桌面。', { at: 1.75, out: 2.9, y: 470, size: 150, w: 900, st: .2, sweep: [2.3, .6, '169,195,255'] });
      n.head(tx, L, '四款桌面小组件，不用打开应用。', { at: 2.2, out: 2.9, y: 790, size: 44, w: 500, col: C.grey });
      // 爆炸图：左侧逐个点名
      LABEL.forEach((s, i) => n.head(tx, L, s, { at: LBL[i] - .1, out: DROP + .1, x: 200, y: 360 + i * 100, size: 58, w: 700, align: 'left', col: K.mixC('#5B6070', '#F5F5F7', Math.max(hl(b, i), .0)) }));
      n.head(tx, L, '常用的，抬手就看到。', { at: 6.2, out: DROP + .1, x: 200, y: 830, size: 40, w: 700, align: 'left', grad: n.GRAD });
      // 今日课表：延时摄影
      if (close > 0) {
        let now = 0; CLK.forEach(([a, , i], j) => { if (j) now = lerp(now, i, prog(b, a, a + .3, E.io)); });
        const s = 2.6 * (.92 + .08 * close);
        n.al(cx, close, () => { cx.save(); cx.translate(1220 - 162 * s, 540 - 88 * s + (1 - close) * 60); cx.scale(s, s); n.wToday(cx, { now }); cx.restore(); });
        const ci = Math.max(0, CLK.filter(c => b >= c[0]).length - 1), prev = CLK[Math.max(0, ci - (b < CLK[ci][0] + .5 ? 1 : 0))][1];
        n.al(tx, close, () => X.flip(tx, 200 + 255, 400, 150, ci ? CLK[ci - 1][1] : CLK[0][1], CLK[ci][1], ci ? prog(b, CLK[ci][0], CLK[ci][0] + .5, E.lin) : 1));
        n.head(tx, L, '下一节在哪，\n看一眼就知道。', { at: 8.1, out: 9.85, x: 200, y: 660, size: 64, w: 900, align: 'left', grad: n.GRAD });
      }
      // 本周课表：方块落下
      const kw = prog(b, WEEK - .05, WEEK + .3, E.out);
      if (kw > 0) {
        const s = 2.15;
        n.al(cx, kw, () => { cx.save(); cx.translate(1240 - 162 * s, 540 - 131 * s + (1 - kw) * 60); cx.scale(s, s); n.wWeek(cx, { k: prog(b, WEEK + .15, WEEK + 1.35, E.lin), drop: true }); cx.restore(); });
        n.head(tx, L, '一周的课，\n一屏看完。', { at: WEEK + .15, x: 196, y: 470, size: 96, w: 900, align: 'left', sweep: [WEEK + 1.2, .6, '169,195,255'] });
        n.head(tx, L, '按周读取教务课表，\n每门课一种颜色，\n在哪儿看都一样。', { at: WEEK + .6, x: 200, y: 720, size: 36, w: 500, align: 'left', col: C.grey, lh: 1.5 });
      }
    },
    sfx: [[.5, 'tock'], [.62, 'tock'], [.9, 'notify'], [2.7, 'swoosh3d'], ...W_AT.map(a => [a, 'pop']), [LIFT, 'whoosh'], ...LBL.map(a => [a, 'blip', 1100]), [DROP, 'swish'], [DROP + .45, 'whoosh'],
      [8.6, 'tock'], [8.72, 'tock'], [9.3, 'tock'], [9.42, 'tock'], [WEEK, 'swish'], ...n.D.week7.map((_, i) => [WEEK + .15 + 1.2 * ((i * .061) % .6 + .35 * .36), 'thud'])],
    music(S, H) {
      const G = N().groove;
      for (let j = 0; j < 6; j++) S.add('tick', Math.floor(j / 4), j % 4, 0, 0, .3);
      S.add('pad', 0, 0, H.CH.F.pad, 6, .32, 'glass');
      N().melody(S, 0, 'box', .5, 0, N().MEL, 0, 2);
      S.add('impact', 1, 2, 0, 0, .45); S.add('pad', 1, 2, H.CH.Dm.pad, 6, .3, 'string');
      S.add('riser', 2, 0, 0, 4, .6);
      S.add('crash', 3, 0, 0, 0, .55); S.add('impact', 3, 0, 0, 0, .5);
      G(S, H, 3, 12, { kick: .72, clap: .45, hat: .3, bass: .55, arp: .24, pad: .24, open: true });
      N().melody(S, 4, 'bell', .5); N().melody(S, 8, 'bell', .5, 0, N().MEL2);
      G(S, H, 8, 10, { pluck: .25 });
      H.roll(S, 11, 2, 4, 'snare', 'main', .15, .55);
      S.add('riser', 11, 0, 0, 4, .55);
    },
  };
};

// ============ 02 · 12:08 食堂 · 付款码 ============
R.n2 = K => {
  const { prog, lerp, bump, E } = K, n = N(), X = FX();
  const SLAM = 2, QR0 = 4.3, QR1 = 5.8, CD0 = 7.2, REF = 8.9, SCAN = 10.2, DI = 10.8;
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 3.3) return { ...DEF, hide: true };
      const p = kf(b, [[3.3, { x: 1250, y: 1560, rx: -1.05, ry: .7, rz: .2 }], [4.3, { x: 1250, y: 560, rx: .06, ry: -.3 }], [7, { x: 1250, y: 560, rx: .06, ry: -.3 }], [7.6, { x: 1230, y: 560, z: 120, rx: .02, ry: -.12 }],
        [9.6, { x: 1230, y: 560, z: 120, rx: .02, ry: -.12 }], [10.1, { x: 1240, y: 545, z: 330 }], [12, { x: 1240, y: 545, z: 380, ry: -.04 }]]);
      return float(p, L.t, b < 4.3 ? 0 : b > 9.6 && b < 11.2 ? .2 : 1);
    },
    paint(c, L, flat) {
      const b = L.b;
      const left = b < CD0 ? 56 - Math.max(0, b - QR1) * 2 : b < REF ? lerp(52, 0, prog(b, CD0, REF, E.in)) : 60 - (b - REF - .4) * 2;
      const qrK = flat ? (b < REF ? prog(b, QR0, QR1, E.lin) : prog(b, REF + .05, REF + .8, E.lin)) : (b < REF ? (b >= QR1 ? 1 : 0) : (b >= REF + .8 ? 1 : 0));
      n.payScreen(c, { time: '12:08', seed: b < REF ? 11 : 12, qrK, left: b > REF && b < REF + .4 ? 0 : Math.min(60, left),
        press: prog(b, REF - .1, REF + .3, E.io), flash: bump(b, REF + .9, .18), scan: b >= SCAN && b <= SCAN + .6 ? prog(b, SCAN, SCAN + .6, E.io) : -1 });
    },
    layers(Ph) { return L => { const b = L.b; if (b < REF) Ph.qrFx(11, prog(b, QR0, QR1, E.lin), L.t); else Ph.qrFx(12, prog(b, REF + .05, REF + .8, E.lin), L.t); }; },
  };
  return {
    scene: '02 · 12:08 食堂', bars: 12, look: K.LOOK.FILM, par: PAR,
    enter: { kind: K.TR.IRIS, a: 1, b: 2, p: [.5, .5, 0, 0], col: '#FFD9A0' },
    cam: X.cam(12, [[SLAM, 1.3], [REF + .05, .6], [DI, .6]]), flash: X.flash([[SLAM, .3], [REF + .05, .25], [DI, .2]]), pulse: L => L.b > SLAM ? .5 : 0,
    desc: '翻页时钟 12:07 → 12:08，正午的暖光；「付款」带着红青错位砸下来，冲击波；手机翻转升起，几百个小方块从四面八方飞来，拼成付款码；倒计时光环走完，冲击波，方块重新飞来拼成新码；扫码光束扫过，「滴」的声波一圈圈荡开。',
    text: TXT() + '周三 · 食堂午饭时间付款抬手，亮码，付好了。e码通付款码打开，就是码。原生界面直接出码，不用再绕进网页等加载。自动刷新过期之前，自动换新码。倒计时走完之前，新的二维码已经换好。滴，付好了。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      X.sky(cx, 'noon', prog(b, 0, .4) * (1 - .6 * prog(b, 1.6, 2.2)), t);
      X.leak(cx, t, .7 * prog(b, 0, .4) * (1 - prog(b, 1.5, 2)));
      stage(cx, L, prog(b, 3, 4.2) * .85);
      // 「付款」
      X.ring(cx, 960, 470, prog(b, SLAM, SLAM + 1, E.lin), 1500, '255,217,160');
      X.burst(cx, 960, 470, prog(b, SLAM, SLAM + .7, E.lin), { n: 56, r0: 300, r1: 1300, col: '255,230,200' });
      X.slam(tx, b, '付款', { at: SLAM, out: 3.4, y: 460, size: 300 });
      n.head(tx, L, '抬手，亮码，付好了。', { at: SLAM + .4, out: 3.4, y: 690, size: 54, w: 500, col: n.C.grey });
      // 倒计时光环
      const p = P.pose(L), kr = prog(b, CD0 - .1, CD0 + .3) * (1 - prog(b, REF + .2, REF + .6));
      if (kr > 0 && !p.hide) {
        const sc = 2015 / (2015 - p.z), R0 = 470 * sc, left = b < REF ? lerp(52, 0, prog(b, CD0, REF, E.in)) / 52 : 0;
        n.al(cx, kr, () => {
          cx.save(); cx.lineCap = 'round';
          cx.strokeStyle = 'rgba(143,178,255,.15)'; cx.lineWidth = 3; cx.beginPath(); cx.arc(p.x, p.y, R0, 0, 7); cx.stroke();
          for (let i = 0; i < 60; i++) { const a = -Math.PI / 2 + i / 60 * 6.283, on = i / 60 < left; cx.strokeStyle = on ? 'rgba(169,195,255,.8)' : 'rgba(169,195,255,.12)'; cx.lineWidth = i % 5 ? 2 : 4; cx.beginPath(); cx.moveTo(p.x + Math.cos(a) * (R0 + 14), p.y + Math.sin(a) * (R0 + 14)); cx.lineTo(p.x + Math.cos(a) * (R0 + (i % 5 ? 28 : 40)), p.y + Math.sin(a) * (R0 + (i % 5 ? 28 : 40))); cx.stroke(); }
          cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = 'rgba(91,140,255,.9)'; cx.lineWidth = 6; cx.beginPath(); cx.arc(p.x, p.y, R0, -Math.PI / 2, -Math.PI / 2 + left * 6.283); cx.stroke();
          const ha = -Math.PI / 2 + left * 6.283; n.glow(cx, p.x + Math.cos(ha) * R0, p.y + Math.sin(ha) * R0, 60, 'rgba(200,220,255,.9)', 1);
          cx.restore();
        });
      }
      X.ring(cx, p.x || 1230, p.y || 560, prog(b, REF + .05, REF + .9, E.lin), 1300);
      X.burst(cx, p.x || 1230, p.y || 560, prog(b, REF + .05, REF + .6, E.lin), { n: 40, r0: 420, r1: 1100, seed: 3 });
      n.phoneLayer(cx, L, P);
      // 扫码光束：横跨手机的一道红光
      if (b >= SCAN && b <= SCAN + .65) {
        const s = 2015 / (2015 - 330), y = lerp(545 + (116 - 390) * .995 * s, 545 + (366 - 390) * .995 * s, prog(b, SCAN, SCAN + .6, E.io)), a = Math.sin(Math.PI * prog(b, SCAN, SCAN + .65));
        n.al(cx, a, () => { cx.save(); cx.globalCompositeOperation = 'lighter'; const g = cx.createLinearGradient(780, 0, 1700, 0); g.addColorStop(0, 'rgba(255,70,60,0)'); g.addColorStop(.5, 'rgba(255,90,70,.95)'); g.addColorStop(1, 'rgba(255,70,60,0)'); cx.fillStyle = g; cx.fillRect(780, y - 2, 920, 4); n.glow(cx, 1240, y, 380, 'rgba(255,80,60,.35)', 1); cx.restore(); });
      }
      for (let j = 0; j < 3; j++) X.ring(cx, 1240, 545, prog(b, DI + j * .18, DI + j * .18 + 1.3, E.lin), 1100, '127,214,222', 4);
      X.burst(cx, 1240, 545, prog(b, DI, DI + .6, E.lin), { n: 36, r0: 520, r1: 1000, col: '127,214,222', seed: 7 });
      X.chapter(tx, L, { from: '12:07', to: '12:08', place: '周三 · 食堂', line: '午饭时间', at: 0, flip: .45, out: 1.4 });
      n.head(tx, L, 'e码通付款码', { at: 4.6, out: 7, x: 200, y: 360, size: 34, w: 700, align: 'left', col: n.C.brandLt });
      n.head(tx, L, '打开，就是码。', { at: 4.75, out: 7, x: 196, y: 470, size: 104, w: 900, align: 'left', sweep: [QR1, .6, '169,195,255'] });
      n.head(tx, L, '原生界面直接出码，\n不用再绕进网页等加载。', { at: 5.1, out: 7, x: 200, y: 640, size: 38, w: 500, align: 'left', col: n.C.grey, lh: 1.5 });
      n.head(tx, L, '自动刷新', { at: CD0 + .05, out: 9.6, x: 200, y: 330, size: 34, w: 700, align: 'left', col: n.C.brandLt });
      n.head(tx, L, '过期之前，\n自动换新码。', { at: CD0 + .2, out: 9.6, x: 196, y: 480, size: 100, w: 900, align: 'left' });
      n.head(tx, L, '倒计时走完之前，\n新的二维码已经换好。', { at: CD0 + .6, out: 9.6, x: 200, y: 690, size: 38, w: 500, align: 'left', col: n.C.grey, lh: 1.5 });
      n.head(tx, L, '滴，\n付好了。', { at: DI + .1, x: 196, y: 520, size: 130, w: 900, align: 'left', grad: n.GRAD, st: .25, sweep: [DI + .9, .7] });
    },
    sfx: [[.45, 'tock'], [.57, 'tock'], [1, 'whoosh'], [SLAM, 'stamp'], [3.3, 'swoosh3d'], [QR0, 'whoosh'], ...ticks(QR0 + .4, QR1, 10, 'tock'), [QR1, 'ding'],
      ...accel(CD0, REF, 12, 'tock'), [REF, 'click'], [REF + .05, 'zap'], [REF + .1, 'whoosh'], [REF + .85, 'chime', 1568], [SCAN, 'swish'], [DI, 'beep', 1760], [DI + .08, 'ding']],
    music(S, H) {
      const G = N().groove;
      S.add('pad', 0, 0, H.CH.F.pad, 8, .32, 'warm'); S.add('piano', 0, 0, [53, 60, 65, 69], 4, .4); S.add('piano', 1, 0, [48, 55, 64, 67], 4, .35);
      S.add('riser', 1, 0, 0, 4, .7);
      S.add('impact', SLAM, 0, 0, 0, 1); S.add('crash', SLAM, 0, 0, 0, .6);
      G(S, H, SLAM, 12, { kick: .78, clap: .45, hat: .3, bass: .58, pad: .26, open: true });
      G(S, H, 4, 12, { arp: .26 });
      N().melody(S, 4, 'bell', .5); N().melody(S, 8, 'bell', .5, 0, N().MEL2);
      S.add('crash', 9, 0, 0, 0, .45);
      H.roll(S, 11, 2, 4, 'snare', 'main', .15, .6);
    },
  };
};

// ============ 03 · 12:09 余额 ============
R.n3 = K => {
  const { prog, E } = K, n = N(), X = FX();
  const LAND = 1.9, PH = 3, LIFT = 3.9, PAY = 5.3;
  const vAt = b => n.D.bal * (1 - Math.pow(1 - prog(b, .15, LAND, E.lin), 4));
  const P = {
    pose(L) {
      const b = L.b;
      if (b < PH) return { ...DEF, hide: true };
      return float(kf(b, [[PH, { x: 2350, y: 560, ry: -.7, rz: -.05 }], [PH + .7, { x: 1290, y: 560, ry: -.24, rx: .05 }], [LIFT, { x: 1290, y: 560, ry: -.24, rx: .05 }], [LIFT + .6, { x: 1300, y: 560, z: 60, ry: -.36, rx: .14 }], [7, { x: 1300, y: 560, z: 80, ry: -.3, rx: .1 }]]), L.t);
    },
    paint(c, L, flat) { const b = L.b, lift = prog(b, LIFT, LIFT + .6); n.payScreen(c, { time: '12:09', seed: 12, left: 50 - b * 2, noBal: !flat, hi: flat ? lift : 0, pay: prog(b, PAY, PAY + .5, E.lin) }); },
    layers(Ph) {
      const ly = Ph.layer(328, 116, 22);
      return L => { const b = L.b, lift = n.eio(prog(b, LIFT, LIFT + .6)); ly.set({ sx: 180, sy: 544, z: lift * 220, rx: -lift * .1, ry: lift * .12, rz: -lift * .03, s: 1 + lift * .05 }); ly.paint(c => n.balCard(c, { hi: lift, pay: prog(b, PAY, PAY + .5, E.lin) })); };
    },
  };
  return {
    scene: '03 · 12:09 余额', bars: 7, look: K.LOOK.FILM, par: PAR,
    cam: X.cam(7, [[LAND, .5]]), flash: X.flash([[LAND, .12]]), pulse: L => L.b > PH ? .45 : 0,
    desc: '滚轮数字从 0 转到校园卡余额，越转越慢，落定时一圈光；网费和更新时间；手机从右侧滑进，余额卡从屏幕里浮起来，点一下充值。',
    text: TXT() + '周三 · 食堂校园卡余额网费刚刚更新校园卡余额，跟着码一起到。取码时一并同步余额和网费，不够了，充值就在旁边。¥',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      X.sky(cx, 'noon', .3, t);
      stage(cx, L, prog(b, 0, .6) * (1 - prog(b, PH - .4, PH)) * .6 + prog(b, PH + .2, PH + 1) * .85);
      const kin = prog(b, .05, .5), kout = prog(b, PH - .3, PH, E.in), a = kin * (1 - kout);
      if (a > 0) {
        n.glow(cx, 960, 520, 700, 'rgba(91,140,255,.35)', a * (.4 + .6 * K.bump(b, LAND, .4)));
        X.ring(cx, 960, 520, prog(b, LAND, LAND + 1, E.lin), 900);
        n.al(tx, a, () => X.odo(tx, 960, 520 - kout * 30 + (1 - kin) * 40, vAt(b), n.D.bal, 240, { pre: '¥', vel: (vAt(b) - vAt(b - .05)) / .05, grad: ['#FFFFFF', '#A9C3FF'] }));
      }
      n.head(tx, L, '校园卡余额', { at: .05, out: PH - .3, y: 300, size: 40, w: 500, col: n.C.grey });
      n.head(tx, L, `网费 ¥${n.money(n.D.fee)} · 刚刚更新`, { at: LAND + .1, out: PH - .3, y: 740, size: 40, w: 500, col: n.C.teal });
      const lift = prog(b, LIFT, LIFT + .6);
      if (lift > 0) n.glow(cx, 1300, 560, 520, 'rgba(91,140,255,.35)', lift * (.6 + .4 * K.bump(b, PAY + .2, .3)));
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { card: false, from: '12:09', to: '12:09', place: '周三 · 食堂', end: 7 });
      n.head(tx, L, '校园卡', { at: PH + .5, out: 6.7, x: 200, y: 340, size: 34, w: 700, align: 'left', col: n.C.brandLt });
      n.head(tx, L, '余额，\n跟着码一起到。', { at: PH + .6, out: 6.7, x: 196, y: 500, size: 100, w: 900, align: 'left', sweep: [LIFT + .3, .6, '169,195,255'] });
      n.head(tx, L, '取码时一并同步余额和网费，\n不够了，充值就在旁边。', { at: PH + 1.1, out: 6.7, x: 200, y: 700, size: 38, w: 500, align: 'left', col: n.C.grey, lh: 1.5 });
    },
    sfx: [...ticks(.15, LAND, 18, 'tock', undefined, 2), [LAND, 'ding'], [PH, 'swoosh3d'], [LIFT, 'whoosh'], [PAY, 'click'], [PAY + .1, 'coin']],
    music(S, H) {
      const G = N().groove;
      G(S, H, 0, 3, { sub: .4, pluck: .3, pad: .3, padKind: 'glass' });
      S.add('riser', 2, 0, 0, 4, .55);
      S.add('crash', PH, 0, 0, 0, .5);
      G(S, H, PH, 7, { kick: .72, clap: .42, hat: .28, bass: .52, arp: .22, pad: .24 });
      N().melody(S, PH, 'box', .55);
    },
  };
};

// ============ 04 · 21:30 校外 · 校园内网 ============
R.n4 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const ERR = 1.5, UP = 3, PRESS = 3.55, DIVE = 3.9, WARP = 4.35, ON = 5, DIA = 6.5;
  const P = {
    pose(L) {
      const b = L.b;
      if (b < UP || (b > WARP + .1 && b < ON)) return { ...DEF, hide: true };
      if (b < ON) return float(kf(b, [[UP, { x: 960, y: 1650, rx: -.8, ry: -.4 }], [UP + .5, { x: 960, y: 545, rx: .03, ry: .1 }], [DIVE, { x: 960, y: 545 }], [WARP + .1, { x: 960, y: 560, z: 1900 }]]), L.t, b < DIVE ? .5 : 0);
      return float(kf(b, [[ON, { x: 1260, y: 545, z: 320, ry: -.4 }], [ON + .6, { x: 1260, y: 545, z: 120, ry: -.2 }], [DIA, { x: 1260, y: 545, z: 120, ry: -.24 }], [DIA + .6, { x: 410, y: 545, z: -200, ry: .22 }], [10, { x: 410, y: 545, z: -200, ry: .16 }]]), L.t, .7);
    },
    paint(c, L) { const b = L.b; n.vpnScreen(c, { time: '21:30', t: L.t, state: b < PRESS + .1 ? 0 : b < ON ? 1 : 2, k: prog(b, ON, ON + .4), press: prog(b, PRESS, PRESS + .25, E.lin) }); },
  };
  const isErr = L => L.b >= ERR && L.b < UP;
  function rain(cx, t, a) {
    if (a <= 0) return;
    n.al(cx, a, () => {
      for (let i = 0; i < 70; i++) {
        const x = 14 + i * 27.5, sp = 160 + n.hash(i) * 260, ph = n.hash(i * 3.3) * 1400;
        for (let j = 0; j < 3; j++) { const y = -200 + ((t * sp + ph + j * 470) % 1480), h = 60 + 120 * n.hash(i * 7 + j), g = cx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(91,140,255,0)'); g.addColorStop(1, `rgba(143,178,255,${.25 + .45 * n.hash(i + j * 9)})`); cx.fillStyle = g; cx.fillRect(x, y, 3, h); }
      }
    });
  }
  function route(cx, p0, p1, p2, k, col, lw, t, packets, sp) {
    if (k <= 0) return;
    const pt = u => [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * p1[0] + u * u * p2[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * p1[1] + u * u * p2[1]];
    cx.strokeStyle = col; cx.lineWidth = lw; cx.lineCap = 'round'; cx.beginPath();
    for (let i = 0; i <= 60 * k; i++) { const [x, y] = pt(i / 60); i ? cx.lineTo(x, y) : cx.moveTo(x, y); }
    cx.stroke();
    if (k >= 1) for (let j = 0; j < packets; j++) { const u = (t * sp + j / packets) % 1, [x, y] = pt(u); n.glow(cx, x, y, 22, 'rgba(255,255,255,.9)', .8); cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(x, y, 5, 0, 7); cx.fill(); }
  }
  function box(cx, tx2, x, y, w, h, k, title, sub, accent) {
    if (k <= 0) return;
    n.al(cx, k, () => n.rr(cx, x, y + (1 - k) * 30, w, h, 28, accent ? 'rgba(15,69,175,.28)' : 'rgba(255,255,255,.05)', accent ? 'rgba(143,178,255,.7)' : 'rgba(255,255,255,.18)', 2));
    n.al(tx2, k, () => { n.tx(tx2, title, x + 40, y + 68 + (1 - k) * 30, n.fnt(700, 46), '#F5F5F7'); n.tx(tx2, sub, x + 40, y + 128 + (1 - k) * 30, n.fnt(500, 28), accent ? '#A9C3FF' : n.C.grey); });
  }
  const shk = X.cam(10, [[ERR, 1], [ERR + .75, .7], [ON, 1.5]]);
  return {
    scene: '04 · 21:30 校外', bars: 10,
    // 打不开的那一段用红色故障画风
    look: L => isErr(L) ? K.LOOK.ALERT : K.LOOK.FILM,
    par: L => isErr(L) ? [.3 + .9 * L.hit(ERR, .6) + .7 * L.hit(ERR + .75, .5) + .2 * Math.max(0, Math.sin(L.t * 9)), .8, 0, .08] : PAR,
    enter: { kind: K.TR.INK, a: 2, b: 2, p: [.7, .4, 0, 0] },
    cam: L => { const c = shk(L), w = prog(L.b, WARP, ON) * (1 - prog(L.b, ON, ON + .1)); return [c[0] + w * .08 + Math.sin(L.t * 30) * w * .006, c[1], c[2], c[3]]; },
    flash: X.flash([[ON, 1.1]]), pulse: L => L.b > ON ? .5 : 0,
    desc: '翻页时钟 21:29 → 21:30，夜里城市的散景；画面变成红色故障：「人在校外，教务系统打不开？」，报错卡片抖动；切回正常，手机升起，点「连接学生 VPN」，镜头扎进屏幕，屏幕形状的光框迎面扑来（光速隧道），闪白，已连接，数据雨落下；分流示意图：校内流量走学生 VPN 隧道到校园内网，其他流量直连互联网。',
    text: TXT() + '周三 · 校外自习回来人在校外，教务系统打不开？无法连接到教务系统请在校园网环境下访问!校园内网，随身带着。学生 VPN 隧道教务系统 · 课表 · 考试 · 成绩互联网其他流量照常直连应用内学生 VPN，只分流，不劫持公网。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t;
      X.sky(cx, 'night', prog(b, 0, .4) * (isErr(L) ? .5 : b < ON ? .9 : .4), t);
      stage(cx, L, b < ON ? .35 : .3 + .6 * prog(b, ON, ON + .5));
      rain(cx, t, prog(b, ON, ON + .35) * (1 - .65 * prog(b, DIA - .1, DIA + .5)));
      // 打不开：报错卡片（画在内容层，跟着故障一起抖）
      if (isErr(L)) {
        const k = prog(b, ERR, ERR + .2), y = 700;
        n.al(cx, k, () => {
          n.rr(cx, 550, y - 105, 820, 210, 30, 'rgba(255,255,255,.07)', 'rgba(255,255,255,.25)', 2);
          cx.strokeStyle = '#ffffff'; cx.lineWidth = 6; cx.beginPath(); cx.arc(660, y, 48, 0, 7); cx.stroke();
          n.tx(cx, '!', 660, y + 2, n.fnt(900, 60), '#ffffff', 'center');
          n.tx(cx, '无法连接到教务系统', 740, y - 28, n.fnt(700, 46), '#ffffff');
          n.tx(cx, '请在校园网环境下访问', 740, y + 36, n.fnt(500, 30), 'rgba(255,255,255,.7)');
        });
        n.head(cx, L, '人在校外，\n教务系统打不开？', { at: ERR + .05, y: 330, size: 92, w: 900, st: .25 });
      }
      n.phoneLayer(cx, L, P);
      // 光速隧道
      // 扎进屏幕：屏幕铺满画面的那一刻压成全黑，隧道从黑里冲出来
      const wb = prog(b, WARP, WARP + .1) * (1 - prog(b, ON - .02, ON + .05)), wa = prog(b, WARP + .05, WARP + .3) * (1 - prog(b, ON - .02, ON + .05));
      if (wb > 0) { n.al(cx, wb, () => { cx.fillStyle = '#02040a'; cx.fillRect(0, 0, 1920, 1080); }); X.warp(cx, t, prog(b, WARP, ON, E.in), wa); }
      X.ring(cx, 960, 540, prog(b, ON, ON + 1, E.lin), 1500); X.burst(cx, 960, 540, prog(b, ON, ON + .7, E.lin), { n: 70, r0: 120, r1: 1300, seed: 5 });
      X.chapter(tx, L, { from: '21:29', to: '21:30', place: '周三 · 校外', line: '自习回来', at: 0, flip: .45, out: 1.3 });
      n.head(tx, L, '校园内网，\n随身带着。', { at: ON + .15, out: DIA, x: 196, y: 520, size: 118, w: 900, align: 'left', grad: n.GRAD, st: .2, sweep: [ON + .9, .7] });
      // 分流示意图
      const ka = prog(b, DIA + .5, DIA + 1.1, E.io), kb = prog(b, DIA + 1.4, DIA + 1.9, E.io);
      route(cx, [600, 500], [920, 330], [1180, 330], ka, 'rgba(91,140,255,.35)', 34, t, 0, 0);
      route(cx, [600, 500], [920, 330], [1180, 330], ka, '#8FB2FF', 4, t, 4, .6);
      route(cx, [600, 600], [920, 770], [1180, 770], kb, 'rgba(255,255,255,.28)', 3, t, 3, .45);
      const kl = prog(b, DIA + 1, DIA + 1.3);
      if (kl > 0) n.al(tx, kl, () => { n.rr(tx, 795, 342, 230, 46, 23, 'rgba(10,26,68,.9)', 'rgba(143,178,255,.6)', 1.5); n.tx(tx, '学生 VPN 隧道', 910, 365, n.fnt(600, 22), '#A9C3FF', 'center'); });
      box(cx, tx, 1200, 230, 560, 200, prog(b, DIA + .9, DIA + 1.3, E.out), '校园内网', '教务系统 · 课表 · 考试 · 成绩', true);
      box(cx, tx, 1200, 670, 560, 200, prog(b, DIA + 1.7, DIA + 2.1, E.out), '互联网', '其他流量照常直连', false);
      n.head(tx, L, '应用内学生 VPN，只分流，不劫持公网。', { at: DIA + 2.2, y: 975, size: 40, w: 700, grad: n.GRAD });
    },
    sfx: [[.45, 'tock'], [.57, 'tock'], [ERR, 'glitch'], [ERR + .05, 'buzz'], [ERR + .75, 'glitch'], [UP, 'swoosh3d'], [PRESS, 'click'], [PRESS + .1, 'blip', 880], [DIVE, 'whoosh'], [WARP, 'swoosh3d'], [ON, 'zap'], [ON, 'sparkle'],
      [DIA, 'swish'], [DIA + .9, 'pop'], [DIA + 1.7, 'pop']],
    music(S, H) {
      const G = N().groove;
      S.add('drone', 0, 0, 26, 12, .45);
      S.add('pad', 0, 0, H.CH.Dm.pad, 6, .38, 'dark');
      S.add('kick', 0, 2, 0, 0, .6, 'heart'); S.add('kick', 0, 2.5, 0, 0, .4, 'heart');
      [[1, 2], [2, 0], [2, 1.5], [2, 2.5]].forEach(([b, bt]) => S.add('bass', b, bt, 26, 1.2, .7, '808'));
      S.add('siren', 1, 2, 0, 6, .3);
      S.add('pad', UP, 0, H.CH.Bb.pad, 8, .35, 'glass');
      for (let j = 0; j < 16; j++) S.add('tick', UP + Math.floor(j / 8), (j % 8) / 2, 0, 0, .25 + j * .02);
      S.add('riser', UP, 0, 0, 8, .95);
      S.add('impact', ON, 0, 0, 0, 1); S.add('crash', ON, 0, 0, 0, .7);
      G(S, H, ON, 10, { kick: .8, clap: .45, hat: .3, bass: .6, arp: .26, pad: .26, open: true });
      N().melody(S, ON + 1, 'square', .4, -12);
    },
  };
};

// ============ 05 · 21:32 成绩 ============
R.n5 = K => {
  const { prog, E } = K, n = N(), X = FX();
  const Q = 1, UP = 2, FAN = 2.8, BACKB = 4.4, TAB = 4.8, FL = [5.1, 5.8, 6.5];
  const SCORES = [['--', '95', '程序设计基础 · 4 学分'], ['95', '92', '高等数学（上） · 5 学分'], ['92', '90', '大学物理 · 4 学分']];
  const P = {
    pose(L) {
      const b = L.b;
      if (b < UP) return { ...DEF, hide: true };
      return float(kf(b, [[UP, { x: 2350, y: 545, ry: -.8, rz: .08 }], [UP + .6, { x: 1330, y: 545, ry: -.22, rx: .04 }], [FAN, { x: 1330, y: 545, ry: -.22, rx: .04 }], [FAN + .6, { x: 1420, y: 545, ry: .36, rx: .08 }],
        [BACKB, { x: 1420, y: 545, ry: .32, rx: .06 }], [BACKB + .4, { x: 1330, y: 545, ry: -.2, rx: .04 }], [8, { x: 1330, y: 545, z: 80, ry: -.14, rx: .04 }]]), L.t);
    },
    paint(c, L, flat) {
      const b = L.b, tk = prog(b, TAB, TAB + .25, E.io);
      n.acadScreen(c, { time: '21:32', tab: tk > .5 ? 1 : 0, tabK: tk, lift: !flat, k: tk > .5 ? prog(b, TAB + .15, TAB + .9, E.lin) : prog(b, UP + .3, UP + 1.2, E.lin), n: prog(b, TAB + .3, TAB + 1.6, E.lin) });
    },
    layers(Ph) {
      const Ls = [0, 1, 2, 3].map(() => Ph.layer(328, 92, 18));
      return L => {
        const b = L.b;
        Ls.forEach((ly, i) => {
          const ap = n.eo(prog(b, UP + .3 + i * .15, UP + .75 + i * .15)) * (1 - prog(b, TAB, TAB + .1));
          const lift = n.eio(prog(b, FAN + i * .08, FAN + .6 + i * .08)) * (1 - n.eio(prog(b, BACKB, BACKB + .35)));
          ly.set({ sx: 180, sy: 172 + i * 104 + 46, dy: (1 - ap) * -24, z: lift * (120 + i * 70), dx: -lift * (150 + i * 40), rz: lift * (i - 1.5) * .08, ry: -lift * .3, a: ap });
          if (ap > 0) ly.paint(c => n.examCard(c, i));
        });
      };
    },
  };
  return {
    scene: '05 · 21:32 成绩', bars: 8, look: K.LOOK.FILM, par: PAR,
    enter: { kind: K.TR.WIPE, a: 1, b: 1, col: '#8FB2FF' },
    cam: X.cam(8, [[UP, .5], ...FL.map(f => [f, .25])]), pulse: L => L.b > UP ? .45 : 0,
    desc: '翻页时钟 21:31 → 21:32；「成绩出了吗？」随心跳一下下亮；手机滑进，考试卡片从屏幕里浮起，像一手牌一样摊开；收回，切到成绩页，左边的翻牌分数一张张翻过：95、92、90。',
    text: TXT() + '周三 · 校外成绩出了吗？考试安排时间、地点、座位，一张卡片说清。按日期排好，桌面小组件也能看。成绩成绩和学分，一页看全。数据经校园内网从教务同步。-' + SCORES.flat().join(''),
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t, C = n.C;
      X.sky(cx, 'night', .35, t);
      stage(cx, L, (.3 + .6 * prog(b, UP - .2, UP + .8)), 1);
      // 心跳：每拍一下光
      const hb = prog(b, Q, Q + .2) * (1 - prog(b, UP - .2, UP));
      if (hb > 0) n.glow(cx, 960, 500, 800, 'rgba(91,140,255,.4)', hb * (.3 + .7 * L.beat));
      n.phoneLayer(cx, L, P);
      X.chapter(tx, L, { from: '21:31', to: '21:32', place: '周三 · 校外', at: 0, flip: .4, out: .95 });
      n.al(tx, 1, () => sc1(tx, b, L));
      n.head(tx, L, '考试安排', { at: FAN, out: BACKB, x: 200, y: 340, size: 34, w: 700, align: 'left', col: C.brandLt });
      n.head(tx, L, '时间、地点、座位，\n一张卡片说清。', { at: FAN + .1, out: BACKB, x: 196, y: 480, size: 80, w: 900, align: 'left', sweep: [FAN + .8, .6, '169,195,255'] });
      n.head(tx, L, '按日期排好，桌面小组件也能看。', { at: FAN + .5, out: BACKB, x: 200, y: 660, size: 36, w: 500, align: 'left', col: C.grey });
      // 成绩翻牌
      const kf2 = prog(b, FL[0] - .3, FL[0]);
      if (kf2 > 0) {
        const ci = Math.max(0, FL.filter(f => b >= f).length - 1), [f0, f1, lab] = SCORES[ci];
        n.al(tx, kf2, () => { X.flip(tx, 355, 540, 210, f0, f1, prog(b, FL[ci], FL[ci] + .45, E.lin)); n.tx(tx, lab, 200, 700, n.fnt(500, 32), '#C9D3E6'); });
      }
      n.head(tx, L, '成绩', { at: TAB + .1, x: 200, y: 250, size: 34, w: 700, align: 'left', col: C.brandLt });
      n.head(tx, L, '成绩和学分，一页看全。', { at: TAB + .2, x: 196, y: 330, size: 64, w: 900, align: 'left', grad: n.GRAD });
      n.head(tx, L, '数据经校园内网从教务同步。', { at: 7, x: 200, y: 800, size: 34, w: 500, align: 'left', col: C.grey });
    },
    sfx: [[.4, 'tock'], [.52, 'tock'], [Q, 'heart'], [Q + .5, 'heart'], [UP, 'swoosh3d'], ...ticks(UP + .3, UP + .9, 4, 'pop'), [FAN, 'whoosh'], [BACKB, 'swish'], [TAB, 'click'],
      ...FL.flatMap(f => [[f, 'tock'], [f + .1, 'tock'], [f + .2, 'tock']]), [FL[0] + .5, 'chime', 1760]],
    music(S, H) {
      const G = N().groove;
      for (let j = 0; j < 4; j++) S.add('tick', 0, j, 0, 0, .3);
      S.add('drone', 0, 0, 29, 8, .4); S.add('pad', 0, 0, H.CH.Dm.pad, 8, .32, 'dark');
      S.add('kick', 1, 0, 0, 0, .75, 'heart'); S.add('kick', 1, .5, 0, 0, .5, 'heart'); S.add('kick', 1, 2, 0, 0, .75, 'heart'); S.add('kick', 1, 2.5, 0, 0, .5, 'heart');
      S.add('riser', 1, 0, 0, 4, .6);
      S.add('crash', UP, 0, 0, 0, .55); S.add('impact', UP, 0, 0, 0, .5);
      G(S, H, UP, 8, { kick: .72, clap: .42, hat: .28, bass: .55, pluck: .26, pad: .24, open: true });
      N().melody(S, UP, 'kalimba', .65, 12); N().melody(S, 6, 'kalimba', .65, 12, N().MEL2, 0, 2);
      S.add('riser', 6, 0, 0, 8, .7);
      H.roll(S, 7, 0, 4, 'snare', 'main', .12, .7, .25);
    },
  };
  function sc1(tx, b, L) {
    if (b < Q - .05 || b > UP + .1) return;
    const k = prog(b, Q, Q + .3), ko = prog(b, UP - .2, UP), s = 1 + .03 * L.beat * (1 - ko);
    tx.save(); tx.translate(960, 500); tx.scale(s, s); tx.globalAlpha *= k * (1 - ko);
    if (1 - k > .02) tx.filter = `blur(${((1 - k) * 16).toFixed(1)}px)`;
    n.tx(tx, '成绩出了吗？', 0, 0, n.fnt(900, 150), '#F5F5F7', 'center'); tx.restore();
  }
};

// ============ 06 · 收尾 ============
R.n6 = K => {
  const { prog, lerp, E } = K, n = N(), X = FX();
  const TW = 440, TH = 300, GAP = 24, X0 = (1920 - TW * 3 - GAP * 2) / 2, Y0 = (1080 - TH * 2 - GAP) / 2 + 30;
  const TILES = ['付款码', '校园卡余额', '桌面小组件', '课表', '校园内网', '考试 · 成绩'];
  const SUBS = ['亮码即付，自动换码', '取码时一起同步', '今日、本周、考试、e码通', '按周翻页，课程配色', '应用内学生 VPN', '卡片和分数，一页看全'];
  const STAMP = ['12:08', '12:09', '07:52', '全天', '21:30', '21:32'];
  const COL = 3, IMP = 3.45, SW = 1.7;
  function tile(cx, tx, i, b, t) {
    const r = Math.floor(i / 3), c = i % 3, x = X0 + c * (TW + GAP), y = Y0 + r * (TH + GAP);
    const e = n.eo(prog(b, .35 + i * .09, .8 + i * .09, E.lin)), kc = prog(b, COL + (5 - i) * .04, COL + .4 + (5 - i) * .04, E.in);
    if (e <= 0 || kc >= 1) return;
    const cxp = x + TW / 2, cyp = y + TH / 2 + Math.sin(t * 1.3 + i) * 4 * (1 - kc), mx = lerp(cxp, 960, kc), my = lerp(cyp, 430, kc), s = 1 - kc * .92, a = Math.min(1, e * 1.5) * (1 - kc * .6);
    if (kc > 0) n.al(cx, (1 - kc) * .6, () => { cx.save(); cx.globalCompositeOperation = 'lighter'; cx.strokeStyle = 'rgba(143,178,255,.6)'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(lerp(cxp, 960, kc * .4), lerp(cyp, 430, kc * .4)); cx.lineTo(mx, my); cx.stroke(); cx.restore(); });
    // 翻进来：横向从 0 展开，展开时一层白光
    const body = c2 => { c2.save(); c2.translate(mx, my); c2.scale(s * e, s * (.9 + .1 * e)); c2.rotate(kc * (i - 2.5) * .3); c2.translate(-TW / 2, -TH / 2); c2.globalAlpha *= a; return () => c2.restore(); };
    let done = body(cx);
    n.rr(cx, 0, 0, TW, TH, 30, '#0E1117', 'rgba(255,255,255,.10)', 1.5);
    if (i === 0) { n.rr(cx, TW - 186, 36, 150, 150, 16, '#fff'); n.qr(cx, TW - 176, 46, 130, 21, 1); }
    if (i === 1) { const g = cx.createLinearGradient(36, 60, 360, 160); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#A9C3FF'); n.tx(cx, '¥' + n.money(n.D.bal), 36, 120, n.fnt(700, 86), g); }
    if (i === 2) { cx.save(); cx.translate(TW - 36 - 324 * .62, 30); cx.scale(.62, .62); n.wToday(cx, { now: 1 }); cx.restore(); }
    if (i === 3) { cx.save(); cx.translate(TW - 36 - 324 * .62, 22); cx.scale(.62, .62); n.wWeek(cx, {}); cx.restore(); }
    if (i === 4) { n.rr(cx, TW - 176, 36, 140, 140, 70, n.C.brand); n.logo(cx, TW - 106, 108, 84, { fill: '#fff', wave: 1.5, t }); }
    if (i === 5) { n.tx(cx, '95', TW - 40, 108, n.fnt(700, 96), '#8FB2FF', 'right'); n.tx(cx, '4 学分', TW - 44, 168, n.fnt(500, 24), n.C.grey, 'right'); }
    if (e < 1) { cx.fillStyle = `rgba(200,220,255,${(1 - e) * .7})`; cx.beginPath(); cx.roundRect(0, 0, TW, TH, 30); cx.fill(); }
    // 扫光：一道斜亮带依次扫过六格
    const sk = prog(b, SW + (c + r) * .08, SW + .55 + (c + r) * .08, E.io);
    if (sk > 0 && sk < 1) { cx.save(); cx.beginPath(); cx.roundRect(0, 0, TW, TH, 30); cx.clip(); const bx = -200 + (TW + 400) * sk, g = cx.createLinearGradient(bx - 120, 0, bx + 60, TH); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); cx.fillStyle = g; cx.fillRect(0, 0, TW, TH); cx.restore(); }
    done();
    done = body(tx);
    n.rr(tx, 28, 28, 84, 34, 17, 'rgba(143,178,255,.14)'); n.tx(tx, STAMP[i], 70, 45, n.fnt(600, 20), '#A9C3FF', 'center');
    n.tx(tx, TILES[i], 36, TH - 84, n.fnt(700, 40), '#F5F5F7'); n.tx(tx, SUBS[i], 36, TH - 38, n.fnt(500, 24), n.C.grey);
    done();
  }
  return {
    scene: '06 · 收尾', bars: 7, look: K.LOOK.FILM, par: [.74, .5, .42, .1],
    enter: { kind: K.TR.FLASH, a: 1, b: 1, flash: .8 },
    cam: X.cam(7, [[IMP, 1.3]]), flash: X.flash([[IMP, .6]]), pulse: L => L.b < COL ? .5 : 0,
    desc: '「从早八，到深夜。」；六格便当盒翻进来，每格带着今天的时间戳（07:52、12:08、12:09、21:30、21:32）；一道扫光扫过；六格拖着光尾收进中心，内爆、冲击波，变成山川图标；「东大码」「山川为志，河水为程。」；版本与声明，淡出。',
    text: TXT() + TILES.join('') + SUBS.join('') + STAMP.join('') + '¥95从早八，到深夜。东大码山川为志，河水为程。NEU eCode 7.6 · Android 7.0 及以上开源 · 非东北大学官方应用学分',
    draw(cx, tx, L) {
      const b = L.b, t = L.t, out = 1 - prog(b, 6.3, 6.95);
      stage(cx, L, (.5 + .4 * prog(b, COL, COL + .6)) * out);
      // 顶上的极光
      [['rgba(61,116,240,.40)', 380, .11], ['rgba(127,214,222,.28)', 960, .07], ['rgba(140,110,240,.26)', 1540, .09]].forEach(([c0, x0, f], i) => n.glow(cx, x0 + Math.sin(t * f * 6 + i) * 220, -120 + Math.sin(t * f * 4) * 40, 700, c0, out * .9));
      for (let i = 0; i < 6; i++) tile(cx, tx, i, b, t);
      n.head(tx, L, '从早八，到深夜。', { at: .15, out: COL - .1, y: 120, size: 60, w: 900, grad: n.GRAD, sweep: [1, .6] });
      X.ring(cx, 960, 430, prog(b, IMP, IMP + 1.1, E.lin), 1500);
      X.burst(cx, 960, 430, prog(b, IMP, IMP + .8, E.lin), { n: 80, r0: 140, r1: 1300, seed: 9 });
      const kl = prog(b, IMP, IMP + .45, E.lin);
      if (kl > 0) n.al(cx, out, () => { n.glow(cx, 960, 430, 560, 'rgba(61,116,240,.5)', 1 - .5 * prog(b, IMP + .5, IMP + 2)); n.logo(cx, 960, 430, 230 * n.back(kl), { fill: 'grad', wave: 1.2, t, sweep: prog(b, IMP + .7, IMP + 1.4, E.lin) }); });
      n.head(tx, L, '东大码', { at: IMP + .25, out: 6.3, y: 655, size: 150, w: 900, sweep: [IMP + 1, .7, '169,195,255'] });
      n.head(tx, L, '山川为志，河水为程。', { at: IMP + .7, out: 6.3, y: 790, size: 46, w: 700, fam: n.SERIF, col: '#C9D3E6' });
      n.head(tx, L, 'NEU eCode 7.6 · Android 7.0 及以上', { at: 5.1, out: 6.3, y: 905, size: 26, w: 500, col: n.C.grey });
      n.head(tx, L, '开源 · 非东北大学官方应用', { at: 5.25, out: 6.3, y: 949, size: 22, w: 500, col: n.C.dim });
    },
    sfx: [...Array.from({ length: 6 }, (_, i) => [.35 + i * .09, 'pop']), [SW, 'swish'], [COL, 'whoosh'], [COL + .2, 'swoosh3d'], [IMP + .1, 'sparkle'], [IMP + 1, 'chime', 1319]],
    music(S, H) {
      const G = N().groove;
      S.add('crash', 0, 0, 0, 0, .55);
      G(S, H, 0, 3, { kick: .75, clap: .45, hat: .3, bass: .55, arp: .25, pad: .25 });
      N().melody(S, 0, 'bell', .5, 0, N().MEL2, 0, 2);
      S.add('riser', 2, 0, 0, 5.8, .7);
      S.add('mute', 3, 0, 0, 1.8);
      S.add('impact', 3, 1.8, 0, 0, 1); S.add('crash', 3, 1.8, 0, 0, .55);
      S.add('bass', 3, 1.8, 41, 12, .5, 'sub');
      S.add('pad', 3, 1.8, [65, 69, 72, 77], 12, .4, 'string');
      S.add('pad', 3, 1.8, [60, 65, 69], 12, .3, 'glass');
      [[4, 0, 77, 1], [4, 1, 81, 1], [4, 2, 84, 2], [5, 0, 89, 6]].forEach(([b, bt, m, d]) => S.add('bell', b, bt, m, d, .45));
      S.add('rev', 6, 0, 0, 4, .5);
    },
  };
};
})();
