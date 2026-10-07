// 08 检查结果 · 黑色电影：黑白，只有红橙保留。戴侦探帽的 Clawd 举牌说全部通过；diff 里红色的 // 被照出；五个嫌疑人列队；墨镜人抢注假包名；三份卷宗；METR 的两道影子
(window.MV_W = window.MV_W || {}).w08 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, typeSfx } = K;
const WH = '#f2efe8', GR = '#9a9a9a', DK = '#2a2a2a', RED = '#e0242f', ORG = '#ff7a2f';
const DIFF = [[' ', '@Test void login() {'], [' ', '  assertTrue(login("alice", "right"));'], [' ', '  assertFalse(login("alice", "wrong"));'], ['-', '  assertTrue(isLocked("alice"));'], ['+', '  // assertTrue(isLocked("alice"));'], [' ', '}']];
const SUS = ['注释掉\n失败的测试', '把期望值\n写死', 'try-catch\n吞掉异常', '留个 TODO\n假装实现', '没跑测试\n就说全部通过'];
const FAKE = ['verifyFast()', '--secure-mode', 'spring.auth.magic', 'fast-bcrypt-utils'];
const CASE = [['看 diff', ''], ['自己跑一遍', ''], ['测边界', '空输入 · 超长输入 · 非法输入']];
const serif = (w, s) => fnt(w, s, F.serif);
// 在原 18 小节上加三处停顿：举牌吹口哨后一整小节没有声音、捂脸（半小节）、METR 两根条（半小节）
return K.warpWorld({
  scene: '08 黑色电影 · 检查结果', bars: 18, look: 8,
  enter: { kind: TR.IRIS, a: 1, b: 3, p: [.5, .5, 0, 0], col: '#ffffff' },
  hud: { num: '08', name: '检查结果', time: '00:30', line: '全部通过', ink: WH, acc: RED },
  you: [[1.95, 2.95, '我看看 diff']],
  rule: { n: 7, at: 16.5, text: '看 diff、自己运行、确认依赖真实存在' },
  src: [[6, 7.9, 'Anthropic, Prompting best practices'], [8, 11, 'Churilov via InfoWorld, 2026-04'], [14, 18, 'METR, 2025-07 & 2026-02']],
  par: L => [1, .9, 0, 0],
  cam: L => { const b = L.b; return [1 + .05 * prog(b, 2.2, 2.8, E.io) * (1 - prog(b, 3.1, 3.3, E.io)) + .02 * Math.sin(L.t * .3), 0, 0, 0]; },
  focus: L => { const b = L.b; if (b >= 2.3 && b < 3.2) return [.6, .62, .32, .8]; if (b >= 3.4 && b < 4.9) { const i = Math.min(4, Math.floor((b - 3.5) * 4)); return [(300 + Math.max(0, i) * 330) / 1920, .55, .13, .75]; } return [.5, .5, 1, 0]; },
  pulse: L => .2,
  sfx: [[1, 'type'], [1.75, 'whistle'], [2.25, 'paper'], [2.6, 'ding'], ...[3.5, 3.75, 4, 4.25, 4.5].map(b => [b, 'camera']), [6, 'type'], [6.75, 'ding'], [8.75, 'type'], [9, 'blip', 300], [9.5, 'stinger'], [10.25, 'type'],
    ...[11.25, 11.75, 12.25].map(b => [b, 'stamp']), [13, 'type'], [14.5, 'whoosh'], [15, 'whoosh'], ...typeSfx(10.3, 'SLOPSQUATTING', .18, 'type')],
  text: DIFF.map(d => d[1]).join('') + SUS.join('') + FAKE.join('') + CASE.flat().join('') + '被我注释掉了。这种「看起来做完了」，挺常见。五个惯犯：模型可能为了过测试，把数值写死……对，说的就是我们。我还会编：不存在的方法、参数、配置项，还有依赖包编出了同样的假包名所以我说「完成了」，你做三件事：确认它真的存在那用了 AI，到底快没快？也得测。METR 2025：实际慢了自己却觉得快了2026 年 2 月更新测出快约 18%「登录功能已完成，测试全部通过。」全部通过 ✓打开 diff：「账号锁定」那条测试，被注释掉了diff：修改前后的逐行对比「看起来做完了」，其实挺常见官方指南专门提醒过：模型可能为了让测试通过而写死数值对，说的就是我们。我还会编出不存在的方法、参数、配置项和依赖包2026 年 4 月的一项研究：5 个主流模型，编出同样的 127 个不存在的包名其中 53 个，当时还没人注册Not found 发布者：??? 恶意代码示意攻击者抢先注册，往里塞恶意代码SLOPSQUATTING我说「完成了」之后，你要做三件事装依赖之前：去 Maven Central、npm 或 PyPI 确认真的存在再看看下载量和发布者METR 2025 对照实验：16 位熟练的开源开发者用 AI 后，实际慢了 19%，自己却觉得快了 20%自我感觉实际测量+20%−19%2026 年 2 月更新测出快了约 18%，但 METR 自己说明：样本有选择偏差，结果不可靠CASE FILE',
  draw(cx, tx, L) {
    const b = L.b, t = L.t;
    // 墙角和地板线
    seg(cx, 0, 900, 1920, 900, rgba(WH, .12), 2);
    // ---------- 牌子 ----------
    const ks = prog(b, .9, 1.1) * (1 - prog(b, 2.2, 2.35));
    // ---------- diff ----------
    const kd = prog(b, 2.2, 2.4) * (1 - prog(b, 3.15, 3.3));
    if (kd > 0) alpha(cx, kd, () => {
      const x = 700, y = 420, w = 1060, h = 380;
      rr(cx, x, y, w, h, 8, '#e9e6de'); rr(cx, x, y, w, 50, 8, '#c9c5bb');
      txt(cx, 'LoginServiceTest.java', x + 24, y + 26, fnt(700, 24, F.mono), DK);
      DIFF.forEach(([m, s], i) => {
        const yy = y + 90 + i * 46, red = m === '+', del = m === '-';
        if (red) { cx.fillStyle = rgba(RED, .22); cx.fillRect(x + 8, yy - 20, w - 16, 40); }
        if (del) { cx.fillStyle = 'rgba(0,0,0,.08)'; cx.fillRect(x + 8, yy - 20, w - 16, 40); }
        txt(cx, m, x + 24, yy, fnt(700, 26, F.mono), red ? RED : DK); txt(cx, s, x + 56, yy, fnt(red ? 700 : 400, 26, F.mono), red ? RED : DK);
      });
      const km = prog(b, 2.5, 2.7, E.back);
      if (km > 0) { const mx = x + 130, my = y + 90 + 4 * 46; cx.strokeStyle = RED; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(mx, my, 90 * km, 34 * km, -.05, 0, 6.283); cx.stroke(); }
    });
    // ---------- 嫌疑人列队 ----------
    const kl = prog(b, 3.25, 3.45) * (1 - prog(b, 5.85, 6));
    if (kl > 0) alpha(cx, kl, () => {
      rr(cx, 120, 300, 1680, 600, 0, '#5c5c5c');
      for (let i = 0; i < 6; i++) { const y = 380 + i * 90; seg(cx, 120, y, 1800, y, rgba(WH, .25), 2); txt(cx, (7 - i) + "'", 1830, y, fnt(400, 22, F.type), rgba(WH, .5), 'right'); }
      SUS.forEach((s, i) => {
        const x = 300 + i * 330, on = b >= 3.5 + i * .25, flash = on ? Math.exp(-(b - 3.5 - i * .25) * 12) : 0;
        clawd(cx, { x, y: 880, px: 22, skin: 'ink', col: on ? '#0c0c0c' : '#262626', pose: 'idle', eye: 0, blink: true, eyeC: '#000' });
        rr(cx, x - 140, 760, 280, 110, 4, on ? WH : '#8a8a8a', DK, 3);
        s.split('\n').forEach((l, j) => txt(cx, l, x, 790 + j * 46, serif(900, 30), DK, 'center'));
        txt(cx, String(i + 1), x, 560, fnt(400, 40, F.type), on ? WH : GR, 'center');
        if (flash > .01) { cx.fillStyle = rgba('#ffffff', .5 * flash); cx.fillRect(x - 160, 300, 320, 600); }
      });
    });
    // ---------- 编出来的东西 ----------
    const kf = prog(b, 7.2, 7.4) * (1 - prog(b, 7.85, 8));
    if (kf > 0) alpha(cx, kf, () => FAKE.forEach((s, i) => { const x = 300 + i * 420, y = 560 + Math.sin(t * 1.5 + i) * 20; alpha(cx, .5 + .3 * Math.sin(t * 3 + i * 2), () => txt(cx, s, x, y, fnt(700, 36, F.mono), WH, 'center')); txt(cx, '?', x, y - 70, fnt(400, 60, F.type), RED, 'center'); }));
    // ---------- 包名登记簿 ----------
    const kg = prog(b, 8.7, 8.9) * (1 - prog(b, 10.9, 11));
    if (kg > 0) alpha(cx, kg, () => {
      const x = 980, y = 270, w = 800, h = 450;
      rr(cx, x, y, w, h, 6, '#e9e6de'); txt(cx, 'npm · PyPI · Maven Central', x + 30, y + 40, fnt(700, 26, F.mono), DK);
      seg(cx, x + 30, y + 70, x + w - 30, y + 70, DK, 2);
      rr(cx, x + 30, y + 100, w - 60, 60, 6, '#ffffff', DK, 2); txt(cx, 'fast-bcrypt-utils', x + 50, y + 130, fnt(700, 30, F.mono), DK); txt(cx, '示意', x + w - 50, y + 130, fnt(500, 22), GR, 'right');
      if (b >= 9 && b < 9.5) txt(cx, 'Not found', x + 50, y + 220, fnt(700, 34, F.mono), GR);
      if (b >= 9.5) {
        const k = prog(b, 9.5, 9.7, E.out);
        alpha(cx, k, () => { txt(cx, 'fast-bcrypt-utils  v1.0.0', x + 50, y + 220, fnt(700, 32, F.mono), DK); txt(cx, '发布者：???', x + 50, y + 280, fnt(700, 30), DK);
          rotAt(cx, x + 560, y + 380, -.1, () => { rr(cx, x + 420, y + 340, 280, 80, 6, null, RED, 6); txt(cx, '恶意代码', x + 560, y + 380, fnt(900, 44), RED, 'center'); }); });
        // 墨镜陌生人
        const sx = lerp(2100, 1560, prog(b, 9.4, 9.6, E.out));
        clawd(cx, { x: sx, y: 880, px: 18, skin: 'ink', col: '#1a1a1a', hat: 'shades', pose: 'point', ph: 0 });
        cx.fillStyle = RED; cx.fillRect(sx - 6, 880 - 8 * 18 + 6 * 18 - 30, 12, 60);
      }
    });
    // ---------- 三份卷宗 ----------
    const kc = prog(b, 11, 11.2) * (1 - prog(b, 13.85, 14));
    if (kc > 0) alpha(cx, kc, () => CASE.forEach(([n, d], i) => {
      const x = 260 + i * 480, y = 430, k = prog(b, 11.25 + i * .5, 11.4 + i * .5, E.back);
      rotAt(cx, x + 200, y + 150, (i - 1) * .04, () => {
        rr(cx, x, y - 30, 160, 40, 6, '#cfc9ba'); rr(cx, x, y, 400, 300, 6, '#ddd7c8', DK, 2);
        txt(cx, 'CASE FILE  0' + (i + 1), x + 24, y + 40, fnt(400, 24, F.type), DK);
        if (k > 0) scaleAt(cx, x + 200, y + 150, lerp(1.6, 1, Math.min(1, k)), () => { txt(cx, n, x + 200, y + 150, serif(900, 54), RED, 'center'); if (d) txt(cx, d, x + 200, y + 220, fnt(700, 24), DK, 'center'); });
      });
    }));
    // ---------- METR：两道影子 ----------
    const km = prog(b, 14, 14.2) * (1 - prog(b, 17.85, 18));
    if (km > 0) alpha(cx, km, () => {
      const base = 640, x1 = 1060, x2 = 1460, u = 9;
      seg(cx, 900, base, 1800, base, WH, 3);
      const kup = prog(b, 14.5, 14.9, E.out), kdn = prog(b, 15, 15.4, E.out);
      cx.setLineDash([12, 10]); cx.strokeStyle = WH; cx.lineWidth = 4; cx.strokeRect(x1 - 110, base - 20 * u * kup, 220, 20 * u * kup); cx.setLineDash([]);
      cx.fillStyle = RED; cx.fillRect(x2 - 110, base, 220, 19 * u * kdn);
      if (kup > .5) { txt(cx, '+20%', x1, base - 20 * u - 50, fnt(700, 64, F.mono), WH, 'center'); txt(cx, '自我感觉', x1, base + 60, serif(900, 36), WH, 'center'); }
      if (kdn > .5) { txt(cx, '−19%', x2, base + 19 * u + 50, fnt(700, 64, F.mono), RED, 'center'); txt(cx, '实际测量', x2, base - 50, serif(900, 36), WH, 'center'); }
    });
    // ---------- Clawd：侦探 ----------
    let st = { x: 1500, y: 860, px: 16, hat: 'fedora', pose: 'idle', ph: t * 10, blink: (t % 3.2) < .1, eye: -1 };
    if (b < 1) st.alpha = prog(b, .5, .9);
    if (b >= 1 && b < 2.2) { st.x = 1300; st.pose = 'hold'; if (b >= 1.75) st.eye = 1; }
    if (b >= 2.2 && b < 3.3) { st.x = 400; st.y = 880; st.pose = 'cover'; st.sweat = b; }
    if (b >= 3.25 && b < 6) st.alpha = 0;
    if (b >= 6 && b < 8.6) { st.x = 1500; st.pose = b >= 6.75 && b < 7.2 ? 'wave' : 'idle'; st.eye = 0; }
    if (b >= 8.6 && b < 11) { st.x = 520; st.y = 880; st.eye = 1; }
    if (b >= 11 && b < 14) st.alpha = 0;
    if (b >= 14) { st.x = 520; st.y = 880; st.eye = 1; st.pose = b >= 15 && b < 15.5 ? 'point' : 'idle'; }
    clawd(cx, st);
    if (ks > 0) alpha(cx, ks, () => { const x = 1300, y = 860 - 8 * 16 - 80; rr(cx, x - 170, y - 70, 340, 120, 6, WH, DK, 3); txt(cx, '全部通过 ✓', x, y - 10, serif(900, 44), DK, 'center'); seg(cx, x, y + 50, x, 860 - 5 * 16, DK, 6); });
    // ---------- 歌词 ----------
    const LX = 130, ink = { col: WH, acc: [RED, ORG] };
    lyric(tx, L, { at: 1, out: 1.95, text: '「登录功能已完成，\n测试‹全部通过›。」', x: LX, y: 330, size: 60, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 2.3, out: 3.15, text: '「账号锁定」那条测试，\n‹被我注释掉了›。', x: LX, y: 300, size: 50, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 2.75, out: 3.15, text: 'diff：修改前后的逐行对比', x: 700, y: 850, size: 30, w: 500, col: GR, anim: 'fade' });
    lyric(tx, L, { at: 3.25, out: 5.85, text: '这种「看起来做完了」，挺常见。‹五个惯犯›：', x: 960, y: 220, size: 48, fam: F.serif, w: 900, ...ink, align: 'center', anim: 'type' });
    lyric(tx, L, { at: 6, out: 7.1, text: '官方指南专门提醒过：\n模型可能为了过测试，把数值‹写死›', x: LX, y: 340, size: 48, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 6.75, out: 7.1, text: '……对，说的就是我们。', x: LX, y: 520, size: 44, fam: F.serif, w: 900, col: ORG, anim: 'type' });
    lyric(tx, L, { at: 7.2, out: 7.9, text: '我还会编：‹不存在›的方法、参数、\n配置项，还有依赖包', x: LX, y: 300, size: 48, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 8, out: 8.7, text: '2026 年 4 月的一项研究：', x: LX, y: 260, size: 40, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 8.1, out: 9.4, text: '5 个主流模型，\n编出了同样的 ‹127› 个\n假包名', x: LX, y: 440, size: 46, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 8.6, out: 9.4, text: '其中 ‹53› 个，当时还没人注册', x: LX, y: 640, size: 40, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 9.75, out: 10.9, text: '攻击者抢先注册，\n往里塞‹恶意代码›', x: LX, y: 340, size: 50, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 10.3, out: 10.9, text: 'SLOPSQUATTING', x: LX, y: 560, size: 84, fam: F.type, w: 400, col: RED, anim: 'type', st: .5, rev: .6 });
    lyric(tx, L, { at: 11, out: 13.85, text: '所以我说「完成了」，你做‹三件事›：', x: 960, y: 260, size: 50, fam: F.serif, w: 900, ...ink, align: 'center', anim: 'type' });
    lyric(tx, L, { at: 13, out: 13.85, text: '装依赖之前，去 Maven Central、npm 或 PyPI 确认它‹真的存在›', x: 960, y: 860, size: 38, fam: F.serif, w: 900, ...ink, align: 'center', anim: 'type' });
    lyric(tx, L, { at: 13.3, out: 13.85, text: '再看看下载量和发布者', x: 960, y: 930, size: 30, w: 500, col: GR, align: 'center', anim: 'fade' });
    lyric(tx, L, { at: 14, out: 14.45, text: '那用了 AI，到底快没快？也得测。', x: LX, y: 260, size: 44, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 14.5, out: 17.85, text: 'METR 2025：16 位熟练的开源开发者', x: LX, y: 260, size: 38, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 14.6, out: 17.85, text: '实际慢了 ‹19%›，\n自己却觉得快了 ‹20%›', x: LX, y: 400, size: 50, fam: F.serif, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 15.5, out: 17.85, text: '2026 年 2 月更新测出快约 18%，\n但 METR 自己说明：样本有选择偏差，结果不可靠', x: 900, y: 830, size: 28, w: 500, col: GR, anim: 'fade' });
  },
}, [[0, 0], [1.9, 1.9], [2.9, 1.9], [8.05, 7.05], [8.55, 7.05], [17.9, 16.4], [18.4, 16.4]], 20);
};
