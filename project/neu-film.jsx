// 东大码 · 宣传片（2 分钟，发布会风格）：七场戏，各自注册到 window.MV_W
// n0 开场：山川图标一笔画出、填色，片名
// n1 付款码：手机升起，二维码逐格拼出；倒计时走完自动换码；扫码「滴」
// n2 校园卡余额：大数字跳到余额；手机里余额卡、充值
// n3 桌面小组件：主屏幕上四款小组件依次弹出；今日课表跟着时间走；本周课表铺满
// n4 校园内网：未连接 → 连接中 → 已连接（数据雨）；分流示意图
// n5 考试与成绩：考试卡片、成绩数字滚动
// n6 收尾：六格功能拼成便当盒，收进山川图标；片名、版本、声明
// 时间单位是小节（120 BPM，一小节 2 秒）。手机是 3D（three.js），没有 three.js 时画平面版。
(() => {
const R = (window.MV_W = window.MV_W || {});
const N = () => window.NEU;
const PAR = [.74, .5, .42, .22]; // 电影画风：曝光、冷暖（中性）、暗角、光晕
const DEF = { x: 960, y: 540, z: 0, rx: 0, ry: 0, rz: 0, s: 1 };

// 关键帧插值：keys = [[小节, 姿态], ...]，两帧之间缓入缓出
function kf(b, keys, ease) {
  const io = ease || N().eio;
  if (b <= keys[0][0]) return { ...DEF, ...keys[0][1] };
  for (let i = 0; i + 1 < keys.length; i++) {
    const [b0, p0] = keys[i], [b1, p1] = keys[i + 1];
    if (b < b1) { const k = io((b - b0) / (b1 - b0)), o = {}; for (const key of Object.keys(DEF)) { const a = p0[key] ?? DEF[key], c = p1[key] ?? DEF[key]; o[key] = a + (c - a) * k; } return o; }
  }
  return { ...DEF, ...keys[keys.length - 1][1] };
}
const float = (p, t, a = 1) => ({ ...p, y: p.y + Math.sin(t * 1.1) * 6 * a, ry: p.ry + Math.sin(t * .7) * .03 * a, rx: p.rx + Math.sin(t * .9 + 1) * .015 * a });
// 舞台背景：两团缓慢漂移的品牌色光
function stage(cx, L, a = 1, hue = 0) {
  const n = N(), t = L.T;
  n.glow(cx, 960 + Math.sin(t * .13) * 380, 300 + Math.cos(t * .11) * 120, 900, hue ? 'rgba(14,124,134,.30)' : 'rgba(15,69,175,.34)', a);
  n.glow(cx, 960 - Math.sin(t * .09) * 460, 860 + Math.sin(t * .15) * 90, 760, hue ? 'rgba(15,69,175,.22)' : 'rgba(14,124,134,.16)', a);
}
const camPush = (bars, z = .025) => L => [1 + z * L.b / bars, 0, 0, 0];
const base = (K, m) => ({ look: K.LOOK.FILM, par: PAR, cam: camPush(m.bars), text: N().TXT + (m.copy || ''), ...m });
const ticks = (a, b, n, kind = 'tock', x) => Array.from({ length: n }, (_, i) => [a + (b - a) * i / n, kind, x]);

// ============ 00 · 开场 ============
R.n0 = K => {
  const { prog, lerp, E } = K, n = N();
  return base(K, {
    scene: '00 · 开场', bars: 7,
    desc: '黑场里一道蓝光画出山川图标，填色，水纹起伏；图标上移，「东大码」「NEU eCode」出现；一句：校园里每天要用的，都在这里。',
    copy: '东大码NEU eCode校园里每天要用的，都在这里。',
    draw(cx, tx, L) {
      const b = L.b, t = L.t, out = 1 - prog(b, 6.4, 6.95);
      stage(cx, L, prog(b, 2.6, 3.6) * out * .9);
      const mv = prog(b, 3, 3.75, E.io), lx = 960, ly = lerp(500, 330, mv), lw = lerp(460, 190, mv);
      const sk = prog(b, .4, 2.8, E.io), fk = prog(b, 2.65, 3.05, E.out);
      n.al(cx, out, () => {
        if (fk < 1) n.al(cx, 1 - fk, () => n.logo(cx, lx, ly, lw, { stroke: '#8FB2FF', strokeK: sk, lw: 2.6 }));
        if (sk > 0 && fk < 1) n.glow(cx, lx, ly, lw * .9, 'rgba(91,140,255,.35)', sk * (1 - fk));
        n.logo(cx, lx, ly, lw, { fill: 'grad', fillK: fk, wave: 1.1 * fk, t });
      });
      n.head(tx, L, '东大码', { at: 3.05, out: 6.4, y: 600, size: 156, w: 900 });
      n.head(tx, L, 'NEU eCode', { at: 3.5, out: 6.4, y: 712, size: 40, w: 500, col: n.C.grey, ls: .32 });
      n.head(tx, L, '校园里每天要用的，都在这里。', { at: 4.5, out: 6.4, y: 846, size: 46, w: 700, grad: n.GRAD });
    },
    sfx: [[.4, 'swish'], [2.7, 'sparkle'], [4.5, 'chime', 1319]],
    music(S, H) {
      S.add('drone', 0, 0, 29, 28, .4);
      S.add('pad', 0, 2, [65, 69, 72], 10, .4, 'glass');
      [[1, 0, 77], [1, 2, 81], [2, 0, 84], [2, 2, 89]].forEach(([b, bt, m]) => S.add('bell', b, bt, m, 2, .32));
      S.add('riser', 1, 0, 0, 8, .55);
      S.add('impact', 3, 0, 0, 0, .8); S.add('crash', 3, 0, 0, 0, .45);
      S.add('bass', 3, 0, 41, 15, .55, 'sub');
      N().PROG.forEach((c, i) => { S.add('piano', 3 + i, 0, H.CH[c].pad, 4, .42); S.add('pad', 3 + i, 0, H.CH[c].pad, 4, .3, 'string'); });
      S.add('riser', 6, 0, 0, 4, .7);
    },
  });
};

// ============ 01 · 付款码 ============
R.n1 = K => {
  const { prog, lerp, bump, E } = K, n = N();
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 1.9) return { ...DEF, hide: true };
      const p = kf(b, [[1.9, { x: 1250, y: 1560, rx: -1.05, ry: .7, rz: .2 }], [3.4, { x: 1250, y: 560, rx: .06, ry: -.3, rz: 0 }], [5.7, { x: 1250, y: 560, rx: .06, ry: -.3 }],
        [6.6, { x: 1230, y: 560, z: 120, rx: .02, ry: -.16 }], [8.1, { x: 1230, y: 560, z: 120, rx: .02, ry: -.16 }], [8.9, { x: 1240, y: 545, z: 330, rx: 0, ry: -.05 }], [11, { x: 1240, y: 545, z: 380, ry: -.08 }]]);
      return float(p, L.t, b < 3.4 ? 0 : 1);
    },
    paint(c, L) {
      const b = L.b, ref = 7;
      const left = b < 5.9 ? 56 - (b - 3) * 2 : b < ref ? lerp(50.2, 0, prog(b, 5.9, ref, E.in)) : 60 - (b - ref - .3) * 2;
      n.payScreen(c, { time: '12:08', seed: b < ref ? 11 : 12, qrK: b < ref ? prog(b, 3, 4, E.lin) : prog(b, ref + .1, ref + .7, E.lin), left: b > ref && b < ref + .3 ? 0 : Math.min(60, left),
        press: prog(b, ref - .1, ref + .3, E.io), flash: bump(b, ref + .55, .18), scan: b >= 9 && b <= 9.6 ? prog(b, 9, 9.6, E.io) : -1 });
    },
  };
  return base(K, {
    scene: '01 · 付款码', bars: 11,
    desc: '「付款」两个字砸下来；手机从下方翻转升起，付款码一格一格拼出；倒计时加速走完，自动换新码；扫码光扫过，滴。',
    copy: '付款抬手，亮码，付好了。e码通付款码打开，就是码。原生界面直接出码，不用再绕进网页等加载。自动刷新过期之前，自动换新码。倒计时走完之前，新的二维码已经换好。滴，付好了。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b;
      stage(cx, L, prog(b, 1.6, 3) * (1 - prog(b, 10.6, 11)) * .85);
      n.phoneLayer(cx, L, P);
      n.head(tx, L, '付款', { at: 0, out: 1.8, y: 470, size: 280, w: 900, d: .3 });
      n.head(tx, L, '抬手，亮码，付好了。', { at: .6, out: 1.8, y: 680, size: 54, w: 500, col: n.C.grey });
      n.head(tx, L, 'e码通付款码', { at: 2.9, out: 5.5, x: 200, y: 360, size: 34, w: 700, align: 'left', col: n.C.brandLt });
      n.head(tx, L, '打开，就是码。', { at: 3.05, out: 5.5, x: 196, y: 470, size: 104, w: 900, align: 'left' });
      n.head(tx, L, '原生界面直接出码，\n不用再绕进网页等加载。', { at: 3.4, out: 5.5, x: 200, y: 640, size: 38, w: 500, align: 'left', col: n.C.grey, lh: 1.5 });
      n.head(tx, L, '自动刷新', { at: 5.85, out: 8.1, x: 200, y: 330, size: 34, w: 700, align: 'left', col: n.C.brandLt });
      n.head(tx, L, '过期之前，\n自动换新码。', { at: 6, out: 8.1, x: 196, y: 480, size: 100, w: 900, align: 'left' });
      n.head(tx, L, '倒计时走完之前，\n新的二维码已经换好。', { at: 6.4, out: 8.1, x: 200, y: 690, size: 38, w: 500, align: 'left', col: n.C.grey, lh: 1.5 });
      n.head(tx, L, '滴，\n付好了。', { at: 9.1, out: 10.6, x: 196, y: 520, size: 130, w: 900, align: 'left', grad: n.GRAD, st: .25 });
    },
    sfx: [[1.9, 'swoosh3d'], ...ticks(3, 4, 8, 'tock'), ...ticks(5.9, 6.95, 8, 'tock'), [6.95, 'click'], [7.1, 'chime', 1568], [9, 'swish'], [9.05, 'beep', 1760], [9.15, 'ding']],
    music(S, H) {
      S.add('crash', 0, 0, 0, 0, .6); S.add('impact', 0, 0, 0, 0, .7);
      N().groove(S, H, 0, 11, { kick: .75, clap: .45, hat: .28, bass: .55, pad: .26 });
      N().groove(S, H, 2, 11, { arp: .26 });
      N().melody(S, 3, 'bell', .5); N().melody(S, 7, 'bell', .5, 0, N().MEL2);
      S.add('crash', 7, 0, 0, 0, .4);
      H.roll(S, 10, 2, 4, 'snare', 'main', .15, .6);
    },
  });
};

// ============ 02 · 校园卡余额 ============
R.n2 = K => {
  const { prog, bump, E } = K, n = N();
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 3.4) return { ...DEF, hide: true };
      return float(kf(b, [[3.4, { x: 2350, y: 560, ry: -.7, rz: -.05 }], [4.3, { x: 1290, y: 560, ry: -.24, rx: .05 }], [8, { x: 1290, y: 560, z: 60, ry: -.18, rx: .05 }]]), L.t);
    },
    paint(c, L) {
      const b = L.b;
      n.payScreen(c, { time: '12:09', seed: 12, left: 52 - b * 2, hi: prog(b, 4.6, 5) * (1 - prog(b, 7.4, 7.8)), pay: prog(b, 6.2, 6.55, E.lin) });
    },
  };
  return base(K, {
    scene: '02 · 校园卡余额', bars: 8,
    desc: '黑底上一个大数字从 0 跳到余额，下面是网费和更新时间；手机从右侧滑进，余额卡亮起，点一下充值。',
    copy: '校园卡余额网费刚刚更新校园卡余额，跟着码一起到。取码时一并同步余额和网费，不够了，充值就在旁边。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, D = n.D;
      stage(cx, L, (prog(b, 0, .6) * (1 - prog(b, 3.1, 3.5)) * .6 + prog(b, 3.6, 4.4) * .85) * (1 - prog(b, 7.6, 8)));
      n.phoneLayer(cx, L, P);
      // 大数字
      const kin = prog(b, .05, .5), kout = prog(b, 3.1, 3.4, E.in), a = kin * (1 - kout);
      if (a > 0) n.al(tx, a, () => {
        const v = D.bal * prog(b, .2, 1.8, E.expo), s = n.money(v), y = 540 - kout * 30 + (1 - kin) * 40;
        tx.save(); tx.textBaseline = 'alphabetic';
        tx.font = n.fnt(700, 240); const w1 = tx.measureText(s).width; tx.font = n.fnt(500, 120); const w0 = tx.measureText('¥').width + 24;
        const x0 = 960 - (w0 + w1) / 2;
        const g = tx.createLinearGradient(x0, y - 200, x0 + w0 + w1, y); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#A9C3FF');
        tx.fillStyle = n.C.grey; tx.fillText('¥', x0, y + 80); tx.font = n.fnt(700, 240); tx.fillStyle = g; tx.fillText(s, x0 + w0, y + 80);
        tx.restore();
      });
      n.head(tx, L, '校园卡余额', { at: .05, out: 3.1, y: 330, size: 40, w: 500, col: n.C.grey });
      n.head(tx, L, `网费 ¥${n.money(n.D.fee)} · 刚刚更新`, { at: 1.9, out: 3.1, y: 760, size: 40, w: 500, col: n.C.teal });
      n.head(tx, L, '校园卡', { at: 4, out: 7.6, x: 200, y: 340, size: 34, w: 700, align: 'left', col: n.C.brandLt });
      n.head(tx, L, '余额，\n跟着码一起到。', { at: 4.1, out: 7.6, x: 196, y: 500, size: 100, w: 900, align: 'left' });
      n.head(tx, L, '取码时一并同步余额和网费，\n不够了，充值就在旁边。', { at: 4.6, out: 7.6, x: 200, y: 700, size: 38, w: 500, align: 'left', col: n.C.grey, lh: 1.5 });
      if (bump(b, 6.35, .25) > .02) n.glow(cx, 1290 + 70, 560 + 5, 160, 'rgba(91,140,255,.35)', bump(b, 6.35, .25));
    },
    sfx: [...ticks(.2, 1.8, 14, 'tock'), [1.85, 'ding'], [3.4, 'swoosh3d'], [4.6, 'blip', 990], [6.2, 'click']],
    music(S, H) {
      const G = N().groove;
      G(S, H, 0, 4, { sub: .4, pluck: .3, pad: .3, padKind: 'glass' });
      S.add('riser', 2, 0, 0, 6, .5);
      S.add('crash', 4, 0, 0, 0, .45);
      G(S, H, 4, 8, { kick: .7, clap: .4, hat: .26, bass: .5, arp: .22, pad: .24 });
      N().melody(S, 4, 'box', .55, 0, N().MEL);
    },
  });
};

// ============ 03 · 桌面小组件 ============
R.n3 = K => {
  const { prog, lerp, E } = K, n = N();
  const W_AT = [2.6, 3.1, 3.6, 4.1];
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 1.9 || b > 6.6) return { ...DEF, hide: true };
      return float(kf(b, [[1.9, { x: 960, y: 1700, rx: -.9, ry: .5 }], [2.6, { x: 960, y: 545, rx: .04, ry: .28 }], [5.8, { x: 960, y: 545, rx: .04, ry: -.22 }], [6.6, { x: -500, y: 600, rx: 0, ry: -.6, rz: .1 }]]), L.t, b < 2.6 ? 0 : .6);
    },
    paint(c, L) {
      const b = L.b;
      n.homeScreen(c, { t: L.t, time: '07:52', w: W_AT.map(a => prog(b, a, a + .45, E.lin)), ws: [{ now: 0 }, { seed: 5, qrK: prog(b, 3.2, 3.9, E.lin) }, {}, { k: prog(b, 4.2, 5.2, E.lin) }], icon: prog(b, 2.4, 2.8) });
    },
  };
  const LABEL = ['今日课表', 'e码通', '我的考试', '本周课表'];
  // 今日课表的时钟：三个时刻，每个时刻高亮下一节课
  const CLK = [[6.3, '07:52', 0], [7.05, '09:58', 1], [7.8, '13:47', 2]];
  return base(K, {
    scene: '03 · 桌面小组件', bars: 11,
    desc: '「课表，摆上桌面。」；手机正面，主屏幕上今日课表、e码通、我的考试、本周课表依次弹出；今日课表放大，时钟走到 7:52、9:58、13:47，「下一节」跟着走；本周课表放大，色块逐列铺满。',
    copy: '课表，摆上桌面。四款桌面小组件，不用打开应用。常用的，抬手就看到。下一节在哪，看一眼就知道。一周的课，一屏看完。按周读取教务课表，每门课一种颜色，在哪儿看都一样。' + LABEL.join('') + CLK.map(c => c[1]).join(''),
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, C = n.C;
      stage(cx, L, (prog(b, 1.6, 2.8) * .9 + .25) * (1 - prog(b, 10.6, 11)), b > 8.4 ? 1 : 0);
      n.phoneLayer(cx, L, P);
      n.head(tx, L, '课表，\n摆上桌面。', { at: 0, out: 1.8, y: 470, size: 150, w: 900, st: .2 });
      n.head(tx, L, '四款桌面小组件，不用打开应用。', { at: .6, out: 1.8, y: 790, size: 44, w: 500, col: C.grey });
      // 左侧：小组件名字依次点亮
      LABEL.forEach((s, i) => {
        const on = prog(b, W_AT[i], W_AT[i] + .3), nx = i < 3 ? W_AT[i + 1] : 9;
        const cur = on * (1 - prog(b, nx, nx + .3) * .55);
        n.head(tx, L, s, { at: W_AT[i], out: 5.7, x: 200, y: 380 + i * 96, size: 54, w: 700, align: 'left', col: K.mixC('#5B6070', '#F5F5F7', cur) });
      });
      n.head(tx, L, '常用的，\n抬手就看到。', { at: 4.7, out: 5.7, x: 1720, y: 540, size: 76, w: 900, align: 'right', grad: n.GRAD });
      // 今日课表特写
      const ka = prog(b, 6.1, 6.6, E.out) * (1 - prog(b, 8.25, 8.55, E.in));
      if (ka > 0) {
        let now = 0; CLK.forEach(([a, , i], j) => { if (j) now = lerp(now, i, prog(b, a - .2, a + .15, E.io)); });
        const s = 2.6 * (.92 + .08 * ka);
        n.al(cx, ka, () => { n.glow(cx, 1200, 540, 700, 'rgba(15,69,175,.35)', 1); cx.save(); cx.translate(1200 - 162 * s, 540 - 88 * s + (1 - ka) * 60); cx.scale(s, s); n.wToday(cx, { now }); cx.restore(); });
        const ci = CLK.filter(c => b >= c[0] - .2).length - 1;
        if (ci >= 0) CLK.forEach(([a, s0], j) => {
          const kin = j === 0 ? prog(b, a, a + .3) : prog(b, a - .2, a), kout = j < 2 ? prog(b, CLK[j + 1][0] - .2, CLK[j + 1][0]) : prog(b, 8.25, 8.55);
          const k = kin * (1 - kout); if (k <= 0) return;
          n.al(tx, k, () => n.tx(tx, s0, 200, 430 - (1 - kin) * 40 + kout * 40, n.fnt(700, 150), '#F5F5F7'));
        });
        n.head(tx, L, '下一节在哪，\n看一眼就知道。', { at: 6.4, out: 8.25, x: 200, y: 680, size: 64, w: 900, align: 'left', grad: n.GRAD });
      }
      // 本周课表特写
      const kw = prog(b, 8.5, 9, E.out) * (1 - prog(b, 10.6, 11, E.in));
      if (kw > 0) {
        const s = 2.15;
        n.al(cx, kw, () => { cx.save(); cx.translate(1240 - 162 * s, 540 - 131 * s + (1 - kw) * 60); cx.scale(s, s); n.wWeek(cx, { k: prog(b, 8.7, 9.9, E.lin) }); cx.restore(); });
        n.head(tx, L, '一周的课，\n一屏看完。', { at: 8.7, out: 10.6, x: 196, y: 470, size: 96, w: 900, align: 'left' });
        n.head(tx, L, '按周读取教务课表，\n每门课一种颜色，\n在哪儿看都一样。', { at: 9.2, out: 10.6, x: 200, y: 720, size: 36, w: 500, align: 'left', col: C.grey, lh: 1.5 });
      }
    },
    sfx: [[1.9, 'swoosh3d'], ...W_AT.map(a => [a, 'pop']), [5.85, 'whoosh'], [6.3, 'tock'], [7.05, 'tock'], [7.8, 'tock'], [8.5, 'swish'], ...ticks(8.7, 9.9, 10, 'blip', 1180)],
    music(S, H) {
      const G = N().groove;
      S.add('crash', 0, 0, 0, 0, .5);
      G(S, H, 0, 2, { sub: .45, pad: .35, hat: .2 });
      G(S, H, 2, 11, { kick: .72, clap: .45, hat: .3, bass: .55, arp: .24, pad: .24, open: true });
      S.add('crash', 2, 0, 0, 0, .5);
      N().melody(S, 2, 'bell', .5); N().melody(S, 6, 'bell', .5, 0, N().MEL2);
      G(S, H, 6, 10, { pluck: .25 });
      H.roll(S, 10, 2, 4, 'snare', 'main', .15, .55);
      S.add('riser', 10, 0, 0, 4, .55);
    },
  });
};

// ============ 04 · 校园内网 ============
R.n4 = K => {
  const { prog, lerp, E } = K, n = N();
  const ON = 4; // 已连接的那一拍：鼓点落下
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 1.5) return { ...DEF, hide: true };
      return float(kf(b, [[1.5, { x: 960, y: 1650, rx: -.8, ry: -.4 }], [2.3, { x: 960, y: 545, rx: .03, ry: .12 }], [3.9, { x: 960, y: 545, z: 0, ry: -.06 }], [4.3, { x: 1260, y: 545, z: 120, ry: -.2 }],
        [5.5, { x: 1260, y: 545, z: 120, ry: -.24 }], [6.1, { x: 410, y: 545, z: -200, ry: .22 }], [9, { x: 410, y: 545, z: -200, ry: .16 }]]), L.t, b < 2.3 ? 0 : .7);
    },
    paint(c, L) {
      const b = L.b;
      n.vpnScreen(c, { time: '21:30', t: L.t, state: b < 2.45 ? 0 : b < ON ? 1 : 2, k: prog(b, ON, ON + .4), press: prog(b, 2.25, 2.5, E.lin) });
    },
  };
  // 数据雨（背景）
  function rain(cx, t, a) {
    if (a <= 0) return;
    n.al(cx, a, () => {
      for (let i = 0; i < 70; i++) {
        const x = 14 + i * 27.5, sp = 160 + n.hash(i) * 260, ph = n.hash(i * 3.3) * 1400;
        for (let j = 0; j < 3; j++) { const y = -200 + ((t * sp + ph + j * 470) % 1480), h = 60 + 120 * n.hash(i * 7 + j), g = cx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(91,140,255,0)'); g.addColorStop(1, `rgba(143,178,255,${.25 + .45 * n.hash(i + j * 9)})`); cx.fillStyle = g; cx.fillRect(x, y, 3, h); }
      }
    });
  }
  // 示意图的一条路：二次曲线，k 画到多少；packets 是包的个数
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
    n.al(cx, k, () => { n.rr(cx, x, y + (1 - k) * 30, w, h, 28, accent ? 'rgba(15,69,175,.28)' : 'rgba(255,255,255,.05)', accent ? 'rgba(143,178,255,.7)' : 'rgba(255,255,255,.18)', 2); });
    n.al(tx2, k, () => { n.tx(tx2, title, x + 40, y + 68 + (1 - k) * 30, n.fnt(700, 46), '#F5F5F7'); n.tx(tx2, sub, x + 40, y + 128 + (1 - k) * 30, n.fnt(500, 28), accent ? '#A9C3FF' : n.C.grey); });
  }
  return base(K, {
    scene: '04 · 校园内网', bars: 9,
    desc: '「人在校外，教务系统打不开？」；手机里点「连接学生 VPN」，山川水纹流动，连接中；鼓点落下，已连接，数据雨铺满背景；分流示意图：校内流量走学生 VPN 隧道到校园内网，其他流量直连互联网。',
    copy: '人在校外，教务系统打不开？校园内网，随身带着。学生 VPN 隧道校园内网教务系统 · 课表 · 考试 · 成绩互联网其他流量照常直连应用内学生 VPN，只分流，不劫持公网。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, t = L.t, end = 1 - prog(b, 8.6, 9);
      stage(cx, L, (.3 + .6 * prog(b, ON, ON + .5)) * end);
      rain(cx, t, prog(b, ON, ON + .35) * (1 - .65 * prog(b, 5.4, 6)) * end);
      n.phoneLayer(cx, L, P);
      n.head(tx, L, '人在校外，\n教务系统打不开？', { at: .1, out: 1.5, y: 500, size: 110, w: 900, st: .3 });
      n.head(tx, L, '校园内网，\n随身带着。', { at: ON + .1, out: 5.5, x: 196, y: 520, size: 118, w: 900, align: 'left', grad: n.GRAD, st: .2 });
      // 分流示意图
      const kd = end;
      n.al(cx, kd, () => n.al(tx, kd, () => {
        const ka = prog(b, 6, 6.6, E.io), kb = prog(b, 6.9, 7.4, E.io);
        route(cx, [600, 500], [920, 330], [1180, 330], ka, 'rgba(91,140,255,.35)', 34, t, 0, 0);
        route(cx, [600, 500], [920, 330], [1180, 330], ka, '#8FB2FF', 4, t, 4, .6);
        route(cx, [600, 600], [920, 770], [1180, 770], kb, 'rgba(255,255,255,.28)', 3, t, 3, .45);
        const kl = prog(b, 6.5, 6.8);
        if (kl > 0) n.al(tx, kl, () => { n.rr(tx, 795, 342, 230, 46, 23, 'rgba(10,26,68,.9)', 'rgba(143,178,255,.6)', 1.5); n.tx(tx, '学生 VPN 隧道', 910, 365, n.fnt(600, 22), '#A9C3FF', 'center'); });
        box(cx, tx, 1200, 230, 560, 200, prog(b, 6.4, 6.8, E.out), '校园内网', '教务系统 · 课表 · 考试 · 成绩', true);
        box(cx, tx, 1200, 670, 560, 200, prog(b, 7.2, 7.6, E.out), '互联网', '其他流量照常直连', false);
      }));
      n.head(tx, L, '应用内学生 VPN，只分流，不劫持公网。', { at: 7.7, out: 8.6, y: 975, size: 40, w: 700, grad: n.GRAD });
    },
    sfx: [[1.5, 'swoosh3d'], [2.25, 'click'], [2.45, 'whoosh'], [ON, 'sparkle'], [5.9, 'swish'], [6.4, 'pop'], [7.2, 'pop']],
    music(S, H) {
      const G = N().groove;
      S.add('drone', 0, 0, 26, 16, .45);
      S.add('pad', 0, 0, H.CH.Dm.pad, 8, .4, 'dark');
      [0, 1].forEach(b => { S.add('kick', b, 0, 0, 0, .7, 'heart'); S.add('kick', b, .5, 0, 0, .45, 'heart'); });
      S.add('pad', 2, 2, H.CH.Bb.pad, 6, .35, 'glass');
      for (let j = 0; j < 12; j++) S.add('tick', 2, 2 + j / 3, 0, 0, .25 + j * .02);
      S.add('riser', 2, 2, 0, 6, .8);
      S.add('impact', ON, 0, 0, 0, .9); S.add('crash', ON, 0, 0, 0, .6);
      G(S, H, ON, 9, { kick: .78, clap: .45, hat: .3, bass: .6, arp: .26, pad: .26, open: true });
      N().melody(S, 5, 'square', .4, -12, N().MEL);
    },
  });
};

// ============ 05 · 考试与成绩 ============
R.n5 = K => {
  const { prog, E } = K, n = N();
  const TAB = 5;
  const P = {
    pose(L) {
      const b = L.b;
      if (b < 1.9) return { ...DEF, hide: true };
      return float(kf(b, [[1.9, { x: 2350, y: 545, ry: -.8, rz: .08 }], [2.6, { x: 1310, y: 545, ry: -.22, rx: .04 }], [8, { x: 1310, y: 545, z: 80, ry: -.14, rx: .04 }]]), L.t);
    },
    paint(c, L) {
      const b = L.b, tk = prog(b, TAB, TAB + .25, E.io);
      n.acadScreen(c, { time: '20:15', tab: tk > .5 ? 1 : 0, tabK: tk, k: tk > .5 ? prog(b, TAB + .15, TAB + .9, E.lin) : prog(b, 2.4, 3.4, E.lin), n: prog(b, TAB + .3, TAB + 1.6, E.lin) });
    },
  };
  return base(K, {
    scene: '05 · 考试与成绩', bars: 8,
    desc: '「考试和成绩，点开就有。」；手机从右侧滑进，考试卡片带日期、时间、地点和座位依次落下；切到成绩页，分数逐个滚动出来。',
    copy: '考试和成绩，点开就有。考试安排时间、地点、座位，一张卡片说清。按日期排好，桌面小组件也能看。成绩和学分，一页看全。数据经校园内网从教务同步。',
    three: n.phoneThree(P),
    draw(cx, tx, L) {
      const b = L.b, C = n.C;
      stage(cx, L, (.3 + .6 * prog(b, 1.8, 2.8)) * (1 - prog(b, 7.6, 8)), 1);
      n.phoneLayer(cx, L, P);
      n.head(tx, L, '考试和成绩，\n点开就有。', { at: 0, out: 1.8, y: 480, size: 140, w: 900, st: .25 });
      n.head(tx, L, '考试安排', { at: 2.4, out: 4.85, x: 200, y: 340, size: 34, w: 700, align: 'left', col: C.brandLt });
      n.head(tx, L, '时间、地点、座位，\n一张卡片说清。', { at: 2.5, out: 4.85, x: 196, y: 480, size: 82, w: 900, align: 'left' });
      n.head(tx, L, '按日期排好，桌面小组件也能看。', { at: 3, out: 4.85, x: 200, y: 660, size: 36, w: 500, align: 'left', col: C.grey });
      n.head(tx, L, '成绩', { at: TAB + .1, out: 7.6, x: 200, y: 340, size: 34, w: 700, align: 'left', col: C.brandLt });
      n.head(tx, L, '成绩和学分，\n一页看全。', { at: TAB + .2, out: 7.6, x: 196, y: 480, size: 96, w: 900, align: 'left', grad: n.GRAD });
      n.head(tx, L, '数据经校园内网从教务同步。', { at: TAB + .7, out: 7.6, x: 200, y: 660, size: 36, w: 500, align: 'left', col: C.grey });
    },
    sfx: [[1.9, 'swoosh3d'], ...ticks(2.4, 3.2, 4, 'pop'), [TAB, 'click'], ...ticks(TAB + .3, TAB + 1.5, 10, 'tock'), [TAB + 1.6, 'chime', 1760]],
    music(S, H) {
      const G = N().groove;
      G(S, H, 0, 2, { sub: .4, pad: .32, pluck: .28 });
      S.add('crash', 2, 0, 0, 0, .45);
      G(S, H, 2, 8, { kick: .72, clap: .42, hat: .28, bass: .55, pluck: .26, pad: .24, open: true });
      N().melody(S, 2, 'kalimba', .65, 12, N().MEL); N().melody(S, 6, 'kalimba', .65, 12, N().MEL2, 0, 2);
      S.add('riser', 6, 0, 0, 8, .7);
      H.roll(S, 7, 0, 4, 'snare', 'main', .12, .7, .25);
    },
  });
};

// ============ 06 · 收尾 ============
R.n6 = K => {
  const { prog, lerp, E } = K, n = N();
  const TW = 440, TH = 300, GAP = 24, X0 = (1920 - TW * 3 - GAP * 2) / 2, Y0 = (1080 - TH * 2 - GAP) / 2;
  const TILES = ['付款码', '校园卡余额', '桌面小组件', '课表', '校园内网', '考试 · 成绩'];
  const SUBS = ['亮码即付，自动换码', '取码时一起同步', '今日、本周、考试、e码通', '按周翻页，课程配色', '应用内学生 VPN', '卡片和分数，一页看全'];
  const COL = 2.6; // 收拢
  function tile(cx, tx, i, b, t) {
    const r = Math.floor(i / 3), c = i % 3, x = X0 + c * (TW + GAP), y = Y0 + r * (TH + GAP);
    const kin = n.back(prog(b, .15 + i * .1, .6 + i * .1, E.lin)), kc = prog(b, COL + (5 - i) * .03, COL + .45 + (5 - i) * .03, E.io);
    if (kin <= 0 || kc >= 1) return;
    const cxp = x + TW / 2, cyp = y + TH / 2, mx = lerp(cxp, 960, kc), my = lerp(cyp, 430, kc), s = (.85 + .15 * kin) * (1 - kc * .9), a = Math.min(1, kin * 1.6) * (1 - kc);
    const body = c2 => {
      c2.save(); c2.translate(mx, my); c2.scale(s, s); c2.translate(-TW / 2, -TH / 2); c2.globalAlpha *= a;
      return () => c2.restore();
    };
    let done = body(cx);
    n.rr(cx, 0, 0, TW, TH, 30, '#0E1117', 'rgba(255,255,255,.10)', 1.5);
    // 每格的小画面
    if (i === 0) { n.rr(cx, TW - 186, 36, 150, 150, 16, '#fff'); n.qr(cx, TW - 176, 46, 130, 21, 1); }
    if (i === 1) { const g = cx.createLinearGradient(36, 60, 360, 160); g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#A9C3FF'); n.tx(cx, '¥' + n.money(n.D.bal), 36, 110, n.fnt(700, 86), g); }
    if (i === 2) { cx.save(); cx.translate(TW - 36 - 324 * .62, 30); cx.scale(.62, .62); n.wToday(cx, { now: 1 }); cx.restore(); }
    if (i === 3) { cx.save(); cx.translate(TW - 36 - 324 * .62, 22); cx.scale(.62, .62); n.wWeek(cx, {}); cx.restore(); }
    if (i === 4) { n.rr(cx, TW - 176, 36, 140, 140, 70, n.C.brand); n.logo(cx, TW - 106, 108, 84, { fill: '#fff', wave: 1.5, t }); }
    if (i === 5) { n.tx(cx, '95', TW - 40, 108, n.fnt(700, 96), '#8FB2FF', 'right'); n.tx(cx, '4 学分', TW - 44, 168, n.fnt(500, 24), n.C.grey, 'right'); }
    done();
    done = body(tx);
    n.tx(tx, TILES[i], 36, TH - 84, n.fnt(700, 40), '#F5F5F7'); n.tx(tx, SUBS[i], 36, TH - 38, n.fnt(500, 24), n.C.grey);
    done();
  }
  return base(K, {
    scene: '06 · 收尾', bars: 6,
    desc: '六格功能拼成一个便当盒（付款码、校园卡余额、桌面小组件、课表、校园内网、考试 · 成绩），一起收进中间，变成山川图标；「东大码」「山川为志，河水为程。」；版本与声明。',
    copy: TILES.join('') + SUBS.join('') + '¥95东大码山川为志，河水为程。NEU eCode 7.6 · Android 7.0 及以上开源 · 非东北大学官方应用学分',
    draw(cx, tx, L) {
      const b = L.b, t = L.t, out = 1 - prog(b, 5.3, 5.85);
      stage(cx, L, (.5 + .4 * prog(b, COL, COL + .6)) * out);
      for (let i = 0; i < 6; i++) tile(cx, tx, i, b, t);
      const kl = prog(b, COL + .3, COL + .8, E.out);
      if (kl > 0) n.al(cx, kl * out, () => { n.glow(cx, 960, 430, 520, 'rgba(61,116,240,.45)', 1 - .5 * prog(b, COL + .8, COL + 2)); n.logo(cx, 960, 430, lerp(120, 230, kl), { fill: 'grad', wave: 1.2, t }); });
      n.head(tx, L, '东大码', { at: COL + .6, out: 5.3, y: 655, size: 150, w: 900 });
      n.head(tx, L, '山川为志，河水为程。', { at: COL + 1.1, out: 5.3, y: 790, size: 46, w: 700, fam: n.SERIF, col: '#C9D3E6' });
      n.head(tx, L, 'NEU eCode 7.6 · Android 7.0 及以上', { at: 4.1, out: 5.3, y: 900, size: 26, w: 500, col: n.C.grey });
      n.head(tx, L, '开源 · 非东北大学官方应用', { at: 4.25, out: 5.3, y: 944, size: 22, w: 500, col: n.C.dim });
    },
    sfx: [...Array.from({ length: 6 }, (_, i) => [.15 + i * .1, 'pop']), [COL, 'whoosh'], [COL + .35, 'sparkle']],
    music(S, H) {
      const G = N().groove;
      S.add('crash', 0, 0, 0, 0, .55);
      G(S, H, 0, 2, { kick: .75, clap: .45, hat: .3, bass: .55, arp: .25, pad: .25 });
      N().melody(S, 0, 'bell', .5, 0, N().MEL2, 0, 2);
      S.add('riser', 2, 0, 0, 2, .5);
      S.add('impact', 3, 0, 0, 0, .8); S.add('crash', 3, 0, 0, 0, .5);
      S.add('bass', 3, 0, 41, 12, .5, 'sub');
      S.add('pad', 3, 0, [65, 69, 72, 77], 12, .4, 'string');
      S.add('pad', 3, 0, [60, 65, 69], 12, .3, 'glass');
      [[3, 0, 77, 1], [3, 1, 81, 1], [3, 2, 84, 2], [4, 0, 89, 6]].forEach(([b, bt, m, d]) => S.add('bell', b, bt, m, d, .45));
      S.add('rev', 5, 0, 0, 4, .5);
    },
  });
};
})();
