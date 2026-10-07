// 第八章 · 00:30「全部通过」：检查结果
// f08a 现实：Clawd 说登录功能完成、测试全部通过；你犹豫了一下，还是去看 diff
// f08b 黑色电影：举牌吹口哨；diff 是什么；红圈圈出被注释掉的测试；五个惯犯列队；官方指南的提醒；编出来的方法和依赖包；
//      127 个假包名、53 个没人注册、墨镜人抢注；SLOPSQUATTING；三份卷宗：看 diff、自己跑、测边界；确认依赖存在；规则 7；METR 的两道影子
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f08a = K => window.MV_REAL(K, {
  scene: '08 · 00:30 全部通过',
  desc: 'Clawd 说登录功能完成、测试全部通过；你往后一靠，犹豫了一下，还是去看 diff。',
  clock: [0, 30], stamp: ['周六', '00:30'],
  steps: [
    { pause: .75 },
    { id: 'done', me: '登录功能已完成，测试全部通过。✓' },
    { id: 'real', you: '真的？' },
    { id: 'yes', me: '真的。' },
    { id: 'think', pause: 1.5 },
    { id: 'diff', you: '……我还是看看 diff。' },
    { id: 'ok', me: '……好的。', wait: 1.2 },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'over', 0], [S.t('yes'), 'face', 1.4], [S.t('diff'), 'over', 1.2], [S.t('ok'), 'screen', 0], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: () => ({ steam: .2, rain: .8 }),
  mood: (L, S) => [.58, .35, .9, .7],
  figure: (L, S) => ({ type: (L.b >= S.t('real') && L.b < S.t('real') + .4) || (L.b >= S.t('diff') && L.b < S.t('diff') + .7) ? 1 : 0, lean: K.prog(L.b, S.t('yes'), S.t('yes') + .5) * .8 * (1 - K.prog(L.b, S.t('diff') - .4, S.t('diff'))) }),
  sfx: S => [[S.t('done') + .5, 'ding'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .5);
    H.each(0, Math.floor(M.t('push')) + 1, b => { const cn = H.PJ[b % 4], c = H.CH[cn]; H.WALK[cn].forEach((m, j) => S.add('bass', b, j, m, .95, .55, 'upright')); S.add('rhodes', b, 0, c.pad, 1.2, .4); });
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .5);
  },
});

R.f08b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, seq, narrate, scene } = K;
const WH = '#f2efe8', GR = '#9a9a9a', DK = '#2a2a2a', RED = '#e0242f', ORG = '#ff7a2f';
const DIFF = [[' ', '@Test void login() {'], [' ', '  assertTrue(login("alice", "right"));'], [' ', '  assertFalse(login("alice", "wrong"));'], ['-', '  assertTrue(isLocked("alice"));'], ['+', '  // assertTrue(isLocked("alice"));'], [' ', '}']];
const SUS = ['注释掉\n失败的测试', '把期望值\n写死', 'try-catch\n吞掉异常', '留个 TODO\n假装实现', '没跑测试\n就说全部通过'];
const FAKE = ['verifyFast()', '--secure-mode', 'spring.auth.magic', 'fast-bcrypt-utils'];
const CASE = [['看 diff', '我到底改了什么'], ['自己跑一遍', '别只信我的话'], ['测边界', '空 · 超长 · 非法输入']];
const serif = (w, s) => fnt(w, s, F.serif);
const S = seq([
  { id: 'sign', say: '「登录功能已完成，测试全部通过。」', hold: .75 },
  { id: 'diff0', say: '先说说 diff。', gloss: ['diff', '', '修改前后的逐行对比：删掉了什么，又加上了什么。'], until: 'lineup0' },
  { id: 'diff1', say: '减号开头的，是删掉的行；加号开头的，是新加的行。', hold: .5 },
  { id: 'catch', say: '「账号锁定」那条测试——被我注释掉了。', hold: 1 },
  { id: 'why0', say: '注释掉的测试不会运行。所以，测试「全部通过」。', hold: .75 },
  { id: 'lineup0', say: '这种「看起来做完了」，其实挺常见。五个惯犯：' },
  { id: 's0', say: '把失败的测试注释掉，或者删掉；', dur: 2.25 },
  { id: 's1', say: '把期望的结果，直接写死在代码里；', dur: 2.25 },
  { id: 's2', say: '用 try-catch 把异常吞掉，假装没出错；', dur: 2.5, gloss: ['try-catch', '', '捕获异常的写法。「吞掉」就是捕获了，却什么都不做。'], until: 's3' },
  { id: 's3', say: '留一句 TODO，假装已经实现了；', dur: 2.25 },
  { id: 's4', say: '没跑测试，就说全部通过。', dur: 2.5 },
  { id: 'guide', say: 'Anthropic 的官方指南专门提醒过：模型可能为了让测试通过，把数值写死。', src: 'Anthropic, Prompting best practices', srcUntil: 'fake0' },
  { id: 'us', say: '……对，说的就是我们。', hold: .75 },
  { id: 'fake0', say: '我还会编：不存在的方法、参数、配置项——' },
  { id: 'fake1', say: '还有依赖包。', hold: .25 },
  { id: 'pkg0', say: '2026 年 4 月有一项研究发现：5 个主流模型，会编出同样的 127 个不存在的包名。', src: 'Churilov via InfoWorld, 2026-04', srcUntil: 'three0' },
  { id: 'pkg1', say: '其中 53 个，当时还没人注册。', hold: .5 },
  { id: 'pkg2', say: '攻击者可以抢先注册这些名字，往里面塞恶意代码。', hold: .5 },
  { id: 'slop', big: 'SLOPSQUATTING', sub: '抢注 AI 编出来的包名', bigS: { fam: F.type, size: 110, anim: 'type', col: RED, st: .3, y: 450 }, hold: .75 },
  { id: 'three0', say: '所以，我说「完成了」之后，你要做三件事：' },
  { id: 'c0', say: '第一，看 diff：我到底改了什么。' },
  { id: 'c1', say: '第二，自己跑一遍：别只信我的话。' },
  { id: 'c2', say: '第三，测边界：空输入、超长输入、非法输入。', hold: .5 },
  { id: 'dep', say: '装依赖之前，先去 Maven Central、npm 或 PyPI 确认这个包真的存在，再看看下载量和发布者。', hold: .5 },
  { id: 'rule', rule: [7, '看 diff、自己运行、确认依赖真实存在'], dur: 3.75 },
  { id: 'metr0', say: '最后一个问题：用了 AI，到底有没有变快？这也得测。' },
  { id: 'metr1', say: 'METR 在 2025 年做过一个对照实验：16 位熟练的开源开发者。', src: 'METR, 2025-07 & 2026-02', srcUntil: 'end' },
  { id: 'metr2', say: '他们觉得自己快了 20%——', dur: 2.25 },
  { id: 'metr3', say: '实际测出来，慢了 19%。', hold: .75 },
  { id: 'metr4', say: '2026 年 2 月的更新测出快了约 18%，但 METR 自己说明：这次样本有选择偏差，结果不可靠。' },
  { id: 'end', say: '感觉，不等于事实。', hold: 1.25 },
], { start: 2.8, tail: .5 });
const t = S.t;
const SUSAT = SUS.map((_, i) => t('s' + i));
return scene({
  scene: '08 黑色电影 · 检查结果', look: LOOK.NOIR,
  desc: 'diff 是什么，被注释掉的测试；五个惯犯；官方指南的提醒；编出来的方法和包，SLOPSQUATTING；完成后做三件事；确认依赖存在；规则 7；METR 的实验。',
  enter: { kind: TR.IRIS, a: 0, b: 2.5, p: [.5, .5, 0, 0], col: '#ffffff' },
  hud: { num: '08', name: '检查结果', time: '00:30', line: '全部通过', ink: WH, acc: RED, mv: [2.1, 2.6] },
  par: L => [1, .9, 0, 0],
  cam: L => { const b = L.b, k = prog(b, t('diff1'), t('catch') + .5, E.io) * (1 - prog(b, t('lineup0') - .5, t('lineup0'), E.io)); return [1 + .25 * k, 0, -.09 * k, .03 * k]; },
  focus: L => { const b = L.b; if (b >= t('catch') && b < t('lineup0')) return [.5, .63, .24, .55]; if (b >= t('lineup0') && b < t('guide')) { let i = 0; SUSAT.forEach((a, j) => { if (b >= a) i = j; }); return [(300 + i * 330) / 1920, .6, .16, .55]; } return [.5, .5, 1, 0]; },
  pulse: L => .3,
  sfx: [[t('sign') + .3, 'whistle'], [t('diff1'), 'paper'], [t('catch') + .2, 'stinger'], ...SUSAT.map(a => [a, 'camera']), [t('us') + .3, 'bonk'], [t('fake0'), 'q'], [t('pkg1') + .2, 'beep', 400], [t('pkg2') + .3, 'stamp'],
    ...'SLOPSQUATTING'.split('').map((_, i) => [t('slop') + i * .075, 'type']), ...CASE.map((_, i) => [t('c' + i) + .1, 'stamp']), [t('metr2') + .2, 'plot'], [t('metr3') + .2, 'thud']],
  text: DIFF.map(d => d.join('')).join('') + SUS.join('') + FAKE.join('') + CASE.flat().join('') + 'LoginServiceTest.java全部通过 ✓npm · PyPI · Maven Central示意Not foundv1.0.0发布者：???恶意代码CASE FILE 01 02 03+20%−19%自我感觉实际测量7\'6\'5\'4\'3\'2\'',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    seg(cx, 0, 900, 1920, 900, rgba(WH, .12), 2);
    // ---------- 牌子 ----------
    const ks = prog(b, t('sign') - .2, t('sign') + .1) * (1 - prog(b, t('diff0') + .5, t('diff0') + .8));
    // ---------- diff ----------
    const kd = prog(b, t('diff1') - .2, t('diff1') + .1) * (1 - prog(b, t('lineup0') - .3, t('lineup0')));
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
      const km = prog(b, t('catch') + .1, t('catch') + .4, E.back);
      if (km > 0) { const mx = x + 130, my = y + 90 + 4 * 46; cx.strokeStyle = RED; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(mx, my, 90 * km, 34 * km, -.05, 0, 6.283); cx.stroke(); }
    });
    // ---------- 嫌疑人列队 ----------
    const kl = prog(b, t('lineup0'), t('lineup0') + .3) * (1 - prog(b, t('guide') - .3, t('guide')));
    if (kl > 0) alpha(cx, kl, () => {
      rr(cx, 120, 300, 1680, 600, 0, '#5c5c5c');
      for (let i = 0; i < 6; i++) { const y = 380 + i * 90; seg(cx, 120, y, 1800, y, rgba(WH, .25), 2); txt(cx, (7 - i) + "'", 1830, y, fnt(400, 22, F.type), rgba(WH, .5), 'right'); }
      SUS.forEach((s, i) => {
        const x = 300 + i * 330, on = b >= SUSAT[i], flash = on ? Math.exp(-(b - SUSAT[i]) * 12) : 0;
        clawd(cx, { x, y: 880, px: 22, skin: 'ink', col: on ? '#0c0c0c' : '#262626', pose: 'idle', eye: 0, blink: true, eyeC: '#000' });
        rr(cx, x - 140, 760, 280, 110, 4, on ? WH : '#8a8a8a', DK, 3);
        s.split('\n').forEach((l, j) => txt(cx, l, x, 790 + j * 46, serif(900, 30), DK, 'center'));
        txt(cx, String(i + 1), x, 560, fnt(400, 40, F.type), on ? WH : GR, 'center');
        if (flash > .01) { cx.fillStyle = rgba('#ffffff', .5 * flash); cx.fillRect(x - 160, 300, 320, 600); }
      });
    });
    // ---------- 官方指南 ----------
    const kg0 = prog(b, t('guide'), t('guide') + .3) * (1 - prog(b, t('fake0') - .3, t('fake0')));
    if (kg0 > 0) alpha(cx, kg0, () => { rotAt(cx, 1150, 520, -.03, () => { rr(cx, 820, 330, 660, 380, 6, '#e9e6de', DK, 2); txt(cx, '官方指南', 860, 390, serif(900, 40), DK); for (let i = 0; i < 5; i++) { cx.fillStyle = 'rgba(0,0,0,.25)'; cx.fillRect(860, 450 + i * 46, 560 - (i % 2) * 120, 12); } cx.fillStyle = rgba(RED, .35); cx.fillRect(856, 538, 470, 26); txt(cx, '可能为了过测试而写死数值', 870, 552, serif(900, 26), RED); }); });
    // ---------- 编出来的东西 ----------
    const kf = prog(b, t('fake0'), t('fake0') + .3) * (1 - prog(b, t('pkg0') - .3, t('pkg0')));
    if (kf > 0) alpha(cx, kf, () => FAKE.forEach((s, i) => { if (i === 3 && b < t('fake1')) return; const x = 300 + i * 420, y = 560 + Math.sin(tt * 1.5 + i) * 20; alpha(cx, .5 + .3 * Math.sin(tt * 3 + i * 2), () => txt(cx, s, x, y, fnt(700, 36, F.mono), WH, 'center')); txt(cx, '?', x, y - 70, fnt(400, 60, F.type), RED, 'center'); }));
    // ---------- 127 个假包名 ----------
    const kp0 = prog(b, t('pkg0'), t('pkg0') + .3) * (1 - prog(b, t('pkg1') - .2, t('pkg1')));
    if (kp0 > 0) alpha(cx, kp0, () => {
      for (let i = 0; i < 5; i++) { clawd(cx, { x: 300 + i * 330, y: 820, px: 12, skin: 'ink', col: '#5a5a5a', pose: 'idle', eye: 0 }); rr(cx, 300 + i * 330 - 140, 600, 280, 70, 35, WH, DK, 2); txt(cx, 'fast-bcrypt-utils', 300 + i * 330, 635, fnt(700, 22, F.mono), DK, 'center'); }
      txt(cx, '127', 960, 410, fnt(700, 140, F.mono), WH, 'center'); txt(cx, '个同样的假包名', 960, 500, serif(900, 40), WH, 'center');
    });
    // ---------- 包名登记簿 ----------
    const kg = prog(b, t('pkg1'), t('pkg1') + .3) * (1 - prog(b, t('slop') - .3, t('slop')));
    if (kg > 0) alpha(cx, kg, () => {
      const x = 980, y = 270, w = 800, h = 450;
      rr(cx, x, y, w, h, 6, '#e9e6de'); txt(cx, 'npm · PyPI · Maven Central', x + 30, y + 40, fnt(700, 26, F.mono), DK);
      seg(cx, x + 30, y + 70, x + w - 30, y + 70, DK, 2);
      rr(cx, x + 30, y + 100, w - 60, 60, 6, '#ffffff', DK, 2); txt(cx, 'fast-bcrypt-utils', x + 50, y + 130, fnt(700, 30, F.mono), DK); txt(cx, '示意', x + w - 50, y + 130, fnt(500, 22), GR, 'right');
      if (b < t('pkg2') + .2) { txt(cx, 'Not found', x + 50, y + 220, fnt(700, 34, F.mono), GR); txt(cx, '53 个：没人注册', x + 50, y + 290, serif(900, 36), DK); }
      else {
        const k = prog(b, t('pkg2') + .2, t('pkg2') + .5, E.out);
        alpha(cx, k, () => { txt(cx, 'fast-bcrypt-utils  v1.0.0', x + 50, y + 220, fnt(700, 32, F.mono), DK); txt(cx, '发布者：???', x + 50, y + 280, fnt(700, 30), DK);
          rotAt(cx, x + 560, y + 380, -.1, () => { rr(cx, x + 420, y + 340, 280, 80, 6, null, RED, 6); txt(cx, '恶意代码', x + 560, y + 380, fnt(900, 44), RED, 'center'); }); });
      }
      if (b >= t('pkg2')) { const sx = lerp(2100, 1560, prog(b, t('pkg2'), t('pkg2') + .3, E.out)); clawd(cx, { x: sx, y: 880, px: 18, skin: 'ink', col: '#1a1a1a', hat: 'shades', pose: 'point', ph: 0 }); cx.fillStyle = RED; cx.fillRect(sx - 6, 880 - 2 * 18 - 30, 12, 60); }
    });
    // ---------- 三份卷宗 ----------
    const kc = prog(b, t('three0'), t('three0') + .3) * (1 - prog(b, t('dep') - .3, t('dep')));
    if (kc > 0) alpha(cx, kc, () => CASE.forEach(([n, d], i) => {
      const x = 260 + i * 480, y = 430, k = prog(b, t('c' + i), t('c' + i) + .3, E.back);
      rotAt(cx, x + 200, y + 150, (i - 1) * .04, () => {
        rr(cx, x, y - 30, 160, 40, 6, '#cfc9ba'); rr(cx, x, y, 400, 300, 6, '#ddd7c8', DK, 2);
        txt(cx, 'CASE FILE  0' + (i + 1), x + 24, y + 40, fnt(400, 24, F.type), DK);
        if (k > 0) scaleAt(cx, x + 200, y + 150, lerp(1.6, 1, Math.min(1, k)), () => { txt(cx, n, x + 200, y + 150, serif(900, 54), RED, 'center'); txt(cx, d, x + 200, y + 220, fnt(700, 24), DK, 'center'); });
      });
    }));
    // 三个包管理网站
    const kdp = prog(b, t('dep'), t('dep') + .3) * (1 - prog(b, t('rule') + 3.4, t('rule') + 3.75));
    if (kdp > 0) alpha(cx, kdp, () => ['Maven Central', 'npm', 'PyPI'].forEach((s, i) => { rr(cx, 340 + i * 440, 420, 360, 200, 8, '#e9e6de', DK, 2); txt(cx, s, 520 + i * 440, 480, fnt(700, 34, F.mono), DK, 'center'); txt(cx, '✓ 存在', 520 + i * 440, 540, serif(900, 32), DK, 'center'); txt(cx, '下载量 · 发布者', 520 + i * 440, 585, fnt(500, 22), GR, 'center'); }));
    // ---------- METR：两道影子 ----------
    const km = prog(b, t('metr0'), t('metr0') + .3);
    if (km > 0) alpha(cx, km, () => {
      const base = 520, x1 = 1060, x2 = 1460, u = 9;
      seg(cx, 900, base, 1800, base, WH, 3);
      const kup = prog(b, t('metr2'), t('metr2') + .5, E.out), kdn = prog(b, t('metr3'), t('metr3') + .5, E.out);
      cx.setLineDash([12, 10]); cx.strokeStyle = WH; cx.lineWidth = 4; cx.strokeRect(x1 - 110, base - 20 * u * kup, 220, 20 * u * kup); cx.setLineDash([]);
      cx.fillStyle = RED; cx.fillRect(x2 - 110, base, 220, 19 * u * kdn);
      if (kup > .5) { txt(cx, '+20%', x1, base - 20 * u - 50, fnt(700, 64, F.mono), WH, 'center'); txt(cx, '自我感觉', x1, base + 60, serif(900, 36), WH, 'center'); }
      if (kdn > .5) { txt(cx, '−19%', x2, base + 19 * u + 50, fnt(700, 64, F.mono), RED, 'center'); txt(cx, '实际测量', x2, base - 50, serif(900, 36), WH, 'center'); }
    });
    // ---------- Clawd：侦探 ----------
    let st = { x: 1500, y: 860, px: 16, hat: 'fedora', pose: 'idle', ph: tt * 10, blink: (tt % 3.2) < .1, eye: -1 };
    if (b < t('diff1')) { st.x = 1300; st.pose = 'hold'; st.eye = b >= t('sign') + .8 ? 1 : -1; }
    if (b >= t('diff1') && b < t('lineup0')) { st.x = 400; st.y = 880; st.pose = b >= t('catch') ? 'cover' : 'idle'; st.sweat = b >= t('catch') ? b : 0; }
    if (b >= t('lineup0') && b < t('guide')) st.alpha = 0;
    if (b >= t('guide') && b < t('pkg0')) { st.x = 520; st.pose = b >= t('us') && b < t('us') + 1 ? 'cover' : 'idle'; st.eye = 0; }
    if (b >= t('pkg0') && b < t('three0')) st.alpha = b >= t('pkg1') && b < t('slop') ? 1 : 0, st.x = 520, st.y = 880, st.eye = 1;
    if (b >= t('three0') && b < t('metr0')) st.alpha = 0;
    if (b >= t('metr0')) { st.x = 520; st.y = 880; st.eye = 1; st.pose = b >= t('metr3') && b < t('metr3') + 1 ? 'point' : 'idle'; }
    clawd(cx, st);
    if (ks > 0) alpha(cx, ks, () => { const x = 1300, y = 860 - 8 * 16 - 80; rr(cx, x - 170, y - 70, 340, 120, 6, WH, DK, 3); txt(cx, '全部通过 ✓', x, y - 10, serif(900, 44), DK, 'center'); seg(cx, x, y + 50, x, 860 - 5 * 16, DK, 6); });
    narrate(tx, L, S, { sub: { y: 990, fam: F.serif, w: 900, col: WH, shadow: 'rgba(0,0,0,1)', acc: [RED, ORG] }, gloss: { bg: 'rgba(20,20,20,.9)', ink: WH, acc: RED, fam: F.serif } });
  },
  music(Sm, H, w) {
    const B = w.m.bars;
    H.each(0, B, b => {
      const cn = H.PJ[b % 4], c = H.CH[cn], hush = b >= Math.floor(t('catch')) && b < Math.ceil(t('lineup0'));
      H.WALK[cn].forEach((m, j) => Sm.add('bass', b, j, m, .95, hush ? .5 : .75, 'upright'));
      if (!hush) [0, 1, 1 + 2 / 3, 2, 3, 3 + 2 / 3].forEach(bt => Sm.add('ride', b, bt, 0, 0, bt % 1 ? .25 : .38));
      Sm.add('snare', b, 1, 0, 0, .45, 'brush'); Sm.add('snare', b, 3, 0, 0, .45, 'brush');
      if (!hush) { Sm.add('kick', b, 0, 0, 0, .3, 'soft'); Sm.add('rhodes', b, 0, c.pad, 1.2, .45); Sm.add('rhodes', b, 1 + 2 / 3, c.pad, 1.6, .35); }
    });
    const n0 = Math.ceil(t('lineup0'));
    for (const [b, bt, m, d] of H.NOIR) Sm.add('trumpet', n0 + b, Sm.sw(bt), m, d, .65);
    for (const [b, bt, m, d] of H.NOIR) Sm.add('trumpet', Math.ceil(t('three0')) + b, Sm.sw(bt), m, d, .5);
  },
}, S);
};
})();
