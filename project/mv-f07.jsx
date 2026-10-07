// 第七章 · 23:40「一口气改完」：工作流程
// f07a 现实：让它一口气改完；改了五个文件，坏了一处，不知道是哪一处
// f07b 存档（8-bit）：抱着五个文件跑、冒烟；把出错范围控制在一步之内；关卡地图六关，第三关是你的，OK 盖章；计划模式；
//      Git 提交 = 存档点（3D 水晶），读档；分支；测试是终点线；失败三次 GAME OVER（3D 碎心），CONTINUE 三选一；学基础先别用；规则 6
(() => {
const R = (window.MV_W = window.MV_W || {});
const FILES5 = ['UserService.java', 'User.java', 'LoginController.java', 'PasswordUtil.java', 'application.yml'];

R.f07a = K => window.MV_REAL(K, {
  scene: '07 · 23:40 一口气改完',
  desc: '你让它一口气全改完；它同时改了五个文件，测试挂了一处，谁也说不清是哪一处。',
  clock: [23, 40], stamp: ['周五', '23:40'],
  steps: [
    { pause: .75 },
    { id: 'go', you: '一口气全改完吧，快点。' },
    { id: 'ok', me: '好。' },
    { id: 'edit', pause: 2.2 },
    { id: 'five', me: '我一口气改了五个文件。' },
    { id: 'bad', me: '坏了一处。', wait: 1 },
    { id: 'which', you: '哪一处？', enter: false },
    { id: 'idk', me: '……我也说不上来。', wait: .5 },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'over', 0], [S.t('edit') - .2, 'screen', 0], [S.t('which'), 'face', 1.2], [S.t('idk'), 'over', 1.2], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: () => ({ steam: .35 }),
  codeOverlay: (x, w, h, L, S) => {
    const k = K.prog(L.b, S.t('edit'), S.t('edit') + .2); if (k <= 0) return;
    x.globalAlpha = k; x.fillStyle = '#0c0d10'; x.fillRect(0, h - 290, w, 290); x.fillStyle = '#2a2c33'; x.fillRect(0, h - 290, w, 2);
    x.font = '500 17px "JetBrains Mono",monospace';
    FILES5.forEach((f, i) => { if (L.b < S.t('edit') + .2 + i * .3) return; x.fillStyle = '#f2a65a'; x.fillText('M  ' + f, 20, h - 252 + i * 28); });
    if (L.b >= S.t('bad')) { x.fillStyle = '#ff6b6b'; x.fillText('✗ Tests: 11 passed, 1 failed', 20, h - 252 + 5 * 28 + 10); }
    x.globalAlpha = 1;
  },
  figure: (L, S) => ({ type: L.b >= S.t('go') && L.b < S.t('go') + .7 ? 1 : 0, lean: K.prog(L.b, S.t('which'), S.t('which') + .3) * .4 }),
  sfx: S => [...FILES5.map((_, i) => [S.t('edit') + .2 + i * .3, 'blip', 700 + i * 80]), [S.t('bad') + .5, 'hurt'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .45);
    S.add('pad', 0, 0, H.CH.C.pad, 8, .3, 'warm');
    S.add('pad', Math.floor(M.t('bad')), 0, H.CH.Dm.pad, 10, .35, 'dark');
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .6);
  },
});

R.f07b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, seq, narrate, scene } = K;
const P = { blk: '#000000', navy: '#1d2b53', plum: '#7e2553', dg: '#008751', brn: '#ab5236', dgy: '#5f574f', lgy: '#c2c3c7', wht: '#fff1e8', red: '#ff004d', org: '#ffa300', yel: '#ffec27', grn: '#00e436', blu: '#29adff', lav: '#83769c', pnk: '#ff77a8', pch: '#ffccaa' };
const GY = 870, NODES = [['读代码', 260], ['出计划', 540], ['你看计划', 820], ['改代码', 1100], ['验证', 1380], ['提交', 1660]];
const MENU = ['回退到上一个提交', '补充信息，新开对话', '你自己写'];
const SAVEX = [330, 600, 870];
const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x / 6) * 6, Math.round(y / 6) * 6, Math.round(w / 6) * 6, Math.round(h / 6) * 6); };
function ground(ctx, x0, x1, y) { for (let x = x0; x < x1; x += 48) { px(ctx, x, y, 48, 24, P.grn); px(ctx, x, y + 24, 48, 200, P.brn); px(ctx, x + 6, y + 36, 12, 12, P.pch); px(ctx, x + 30, y + 72, 12, 12, P.pch); } }
function file(ctx, x, y, c = P.wht) { px(ctx, x - 24, y - 30, 48, 60, c); px(ctx, x - 24, y - 30, 48, 12, P.blu); px(ctx, x - 12, y - 6, 24, 6, P.dgy); px(ctx, x - 12, y + 6, 24, 6, P.dgy); }
function crystal(ctx, x, y, t, c = P.blu) { const bob = Math.sin(t * 4) * 6; px(ctx, x - 6, y - 48 + bob, 12, 12, P.wht); px(ctx, x - 18, y - 36 + bob, 36, 36, c); px(ctx, x - 6, y + bob, 12, 12, c); }
function bug(ctx, x, y, t) { const l = Math.floor(t * 8) % 2; px(ctx, x - 24, y - 36, 48, 36, P.red); px(ctx, x - 12, y - 30, 6, 6, P.yel); px(ctx, x + 6, y - 30, 6, 6, P.yel); px(ctx, x - 30, y - 6 + l * 6, 6, 12, P.red); px(ctx, x + 24, y - 6 + (1 - l) * 6, 6, 12, P.red); }
function heart(ctx, x, y, on) { const c = on ? P.red : P.dgy; px(ctx, x, y, 12, 12, c); px(ctx, x + 18, y, 12, 12, c); px(ctx, x - 6, y + 6, 42, 12, c); px(ctx, x, y + 18, 30, 6, c); px(ctx, x + 6, y + 24, 18, 6, c); }
const S = seq([
  { id: 'run', say: '一次改得越多，出错的时候，要翻的范围就越大。', hold: .5 },
  { id: 'step', say: '更好的办法：把每次出错的范围，控制在一步之内。好找，也好退回去。', hold: .5 },
  { id: 'map0', say: '换个打法——像打游戏一样，一关一关过：' },
  { id: 'n0', say: '读代码，', dur: 1 },
  { id: 'n1', say: '出计划，', dur: 1 },
  { id: 'n2', say: '你看计划，', dur: 1.25 },
  { id: 'n3', say: '改代码，', dur: 1 },
  { id: 'n4', say: '验证，', dur: 1 },
  { id: 'n5', say: '提交。', dur: 1.25 },
  { id: 'yours', say: '注意第三关：它是你的。你看计划、改计划，我在这儿等你盖章。', hold: .75 },
  { id: 'ok', say: '盖了章，再往下走。', hold: .75 },
  { id: 'mode', say: '多数工具都有「计划模式」：先出方案，不动代码。课件里讲 Qoder 三种模式那页提到过。' },
  { id: 'save0', say: '每过一关、验证通过，就提交一次。', gloss: ['Git 提交', 'commit', '给代码拍一张快照，以后随时能回到这一刻。'], until: 'br' },
  { id: 'save1', say: 'Git 的每一次提交，就是游戏里的存档点。', hold: .75 },
  { id: 'bug', say: '我改坏了？', dur: 1.75 },
  { id: 'load', say: '直接读档，回到上一个存档点。', hold: .75 },
  { id: 'ckpt', say: 'Anthropic 的官方指南也提到：git 记录和检查点，能帮模型在多次会话之间接着干。', src: 'Anthropic, Prompting best practices', srcUntil: 'br' },
  { id: 'br', say: '有风险的尝试，开个分支去试。', gloss: ['分支', 'branch', '从主线分出去的一条平行线。试坏了，主线不受影响。'], until: 'test', hold: .75 },
  { id: 'test', say: '再把测试当成终点线：先写好测试，再让我改到测试通过。', gloss: ['测试', 'JUnit', '一段自动检查代码对不对的代码。'], until: 'g0' },
  { id: 'test2', say: '我能自己跑测试，就能自己发现问题。' },
  { id: 'trick', say: '不过，得防着我为了让测试通过而耍小聪明——下一章细说。', hold: .5 },
  { id: 'g0', say: '如果同一个问题，连着失败了三次——', hold: .5 },
  { id: 'go', pause: 1.75 },
  { id: 'cont', say: '就停下来。三选一：', hold: .25 },
  { id: 'c0', say: '回退到上一个提交；', dur: 1.75 },
  { id: 'c1', say: '补充信息，新开一个对话；', dur: 2 },
  { id: 'c2', say: '或者，你自己写。', dur: 2 },
  { id: 'learn0', say: '最后两句，说给正在学编程的你：' },
  { id: 'learn1', say: '要是你还在学基础语法，先别用我。自己写不出来的代码，你也看不出我错在哪。', hold: .5 },
  { id: 'teacher', say: '作业能不能用 AI、用到什么程度，听老师的。', hold: .5 },
  { id: 'rule', rule: [6, '先出计划，小步提交'], dur: 3.5 },
], { start: 2.8, tail: .5 });
const t = S.t;
const HOPS = NODES.map((_, i) => t('n' + i));
const SAVES = SAVEX.map((x, i) => [t('save1') + i * .5, x]);
const DIE = [0, 1, 2].map(i => t('g0') + .4 + i * .55);
return scene({
  scene: '07 存档 · 工作流程', look: LOOK.PIXEL,
  desc: '一次改太多；关卡地图六关，第三关是你的；计划模式；Git 提交是存档点，改坏了读档；分支；测试是终点线；失败三次就停下三选一；学基础先别用 AI；规则 6。',
  enter: { kind: TR.PIXEL, a: 0, b: 2.5, col: '#ffec27' },
  hud: { num: '07', name: '工作流程', time: '23:40', line: '一口气改完', ink: P.wht, acc: P.yel, mv: [2.1, 2.6] },
  par: L => { const b = L.b, go = b >= t('go') && b < t('cont') + .5; return [go ? 9 : 6, b < t('g0') || b >= t('learn0') ? 1 : 0, 2.5, 0]; },
  cam: L => [1, 0, (L.b >= t('bug') + .3 && L.b < t('bug') + .55 ? (hash(Math.floor(L.t * 30)) - .5) * .01 : 0), 0],
  focus: L => [.5, .5, .2, .8 * prog(L.b, t('go'), t('go') + .1) * (1 - prog(L.b, t('learn0') - .2, t('learn0')))],
  pulse: L => L.b >= t('g0') && L.b < t('learn0') ? 0 : .6,
  sfx: [[t('run'), 'jump'], [t('run') + 1, 'glitch'], [t('step') + .5, 'blip', 700], ...HOPS.map(b => [b, 'jump']), [t('ok') + .1, 'stamp'], [t('ok') + .5, 'powerup'], ...SAVES.map(s => [s[0], 'save']), [t('bug') + .3, 'hurt'], [t('load'), 'rewind'],
    [t('br'), 'jump'], [t('test') + .3, 'coin'], [t('trick') + .3, 'buzz'], ...DIE.map(b => [b, 'hurt']), [t('go'), 'gameover'], [t('cont'), 'menu'], [t('c0'), 'menu'], [t('c1'), 'menu'], [t('c2'), 'menu']],
  text: NODES.map(n => n[0]).join('') + MENU.join('') + FILES5.join('') + 'commitLOADtry/jwtTESTS ✓//GAME OVERCONTINUE?▶OK先学基础',
  three(T, U) {
    const scene3 = new T.Scene();
    scene3.add(new T.AmbientLight(0xffffff, .5));
    const l1 = new T.DirectionalLight(0xffffff, 1.6); l1.position.set(-300, 500, 800); scene3.add(l1);
    const l2 = new T.PointLight(0x29adff, 2, 0, 2); l2.position.set(600, -100, 500); scene3.add(l2);
    const gems = SAVES.map(() => {
      const g = new T.Group();
      const m = new T.Mesh(new T.OctahedronGeometry(1, 0), new T.MeshStandardMaterial({ color: new T.Color(P.blu).convertSRGBToLinear(), emissive: new T.Color('#0b3c78').convertSRGBToLinear(), flatShading: true, roughness: .15, metalness: .2 }));
      m.scale.set(30, 46, 30); g.add(m);
      const core = new T.Mesh(new T.OctahedronGeometry(1, 0), new T.MeshBasicMaterial({ color: 0xfff1e8 })); core.scale.set(9, 14, 9); g.add(core);
      scene3.add(g); return { g, m };
    });
    const N = 26, r = U.rnd(5), vox = new T.InstancedMesh(new T.BoxGeometry(12, 12, 12), new T.MeshStandardMaterial({ color: new T.Color(P.red).convertSRGBToLinear(), emissive: 0x300010, roughness: .5 }), N * 3);
    const dv = Array.from({ length: N * 3 }, () => ({ x: (r() - .5) * 36, y: (r() - .5) * 24, v: new T.Vector3((r() - .5) * 2, r() * 1.6 - .2, .6 + r() * 1.6).multiplyScalar(260), s: r() * 9 }));
    scene3.add(vox);
    const M = new T.Matrix4(), Q = new T.Quaternion(), EU = new T.Euler(), V = new T.Vector3(), S3 = new T.Vector3();
    return {
      scene: scene3,
      update(L) {
        const b = L.b, tt = L.t; let any = false;
        gems.forEach(({ g, m }, i) => {
          const [at, x] = SAVES[i], k = prog(b, at, at + .3), on = b >= t('save0') && b < t('test') && k > 0;
          g.visible = on; if (!on) return; any = true;
          U.at(g, x, GY - 88 + Math.sin(tt * 4 + i) * 6, 0); g.rotation.set(.2, tt * 1.4 + i * 2, 0);
          g.scale.setScalar(U.back(k) * (1 + .25 * L.hit(at, .3)));
          m.material.emissiveIntensity = 1 + 2 * L.hit(at, .4) + (b >= t('load') && b < t('load') + .6 && i === 1 ? 2 : 0);
        });
        vox.visible = b >= DIE[0] && b < DIE[2] + 1;
        if (vox.visible) {
          any = true;
          for (let j = 0; j < N * 3; j++) {
            const h = Math.floor(j / N), d = dv[j], k = prog(b, DIE[h], DIE[h] + .6);
            V.set(1455 + h * 70 - U.W / 2 + d.x + d.v.x * k, U.H / 2 - 162 + d.y + d.v.y * k - 300 * k * k, d.v.z * k);
            EU.set(k * d.s, k * d.s * .7, 0); Q.setFromEuler(EU);
            const sc = k > 0 && k < 1 ? 1 : .0001; M.compose(V, Q, S3.set(sc, sc, sc)); vox.setMatrixAt(j, M);
          }
          vox.instanceMatrix.needsUpdate = true;
        }
        return any;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, step = Math.floor(tt * 8) / 8, has3d = !!window.THREE;
    // ---------- 抱着五个文件跑 ----------
    if (b < t('map0')) {
      ground(cx, 0, 1920, GY);
      const ks = prog(b, t('step'), t('step') + .5, E.io), sx = lerp(840, 1100, prog(b, 0, 1.5, E.lin));
      for (let i = 0; i < 5; i++) {
        const fx = b < t('step') ? sx + (i - 2) * 56 : lerp(sx + (i - 2) * 56, 400 + i * 240, ks), fy = b < t('step') ? GY - 190 - (i % 2) * 20 : lerp(GY - 190, 520, ks), smoke = i === 3 && b >= 1.2;
        file(cx, fx, fy, smoke ? P.lgy : P.wht);
        if (smoke) for (let j = 0; j < 4; j++) { const k = ((tt * 1.5 + j * .25) % 1); px(cx, fx - 12 + Math.sin(k * 9 + j) * 18, fy - 40 - k * 120, 18 + k * 12, 18 + k * 12, k > .6 ? P.lgy : P.dgy); }
        if (ks > .9) alpha(tx, prog(b, t('step') + .4, t('step') + .7), () => txt(tx, FILES5[i].replace('.java', ''), 400 + i * 240, 600, fnt(400, 13, F.pixel), P.wht, 'center'));
      }
      if (b >= t('step') + .6) { const k = prog(b, t('step') + .6, t('step') + 1.2, E.io), x0 = lerp(320, 1100, k), x1 = lerp(1420, 1260, k); cx.setLineDash([18, 12]); cx.strokeStyle = P.red; cx.lineWidth = 6; cx.strokeRect(x0, 440, x1 - x0, 190); cx.setLineDash([]); }
    }
    // ---------- 关卡地图 ----------
    if (b >= t('map0') && b < t('save0')) {
      ground(cx, 0, 1920, GY);
      for (let i = 0; i < NODES.length - 1; i++) for (let x = NODES[i][1] + 40; x < NODES[i + 1][1] - 30; x += 36) px(cx, x, 600, 18, 12, P.yel);
      NODES.forEach(([n, x], i) => {
        const human = i === 2, done = b >= HOPS[i] + .2;
        px(cx, x - 36, 570, 72, 72, human ? P.blu : done ? P.grn : P.dgy); px(cx, x - 24, 582, 48, 48, human ? P.wht : P.navy);
        if (human) { px(cx, x + 30, 470, 6, 100, P.wht); px(cx, x + 36, 470, 48, 36, P.blu); }
        alpha(tx, prog(b, HOPS[i], HOPS[i] + .2), () => txt(tx, n, x, 690, fnt(900, 34), human ? P.blu : P.wht, 'center'));
      });
      const ok = prog(b, t('ok'), t('ok') + .12, E.out);
      if (ok > 0) scaleAt(cx, 820, 500, lerp(2.2, 1, ok), () => { px(cx, 760, 470, 120, 60, P.red); px(cx, 772, 482, 96, 36, P.wht); txt(cx, 'OK', 820, 502, fnt(400, 30, F.pixel), P.red, 'center'); });
      if (b >= t('ok') + .5) for (let j = 0; j < 8; j++) { const a = j / 8 * 6.283 + tt * 2, r = 60 + ((tt * 2) % 1) * 60; px(cx, 1660 + Math.cos(a) * r, 520 + Math.sin(a) * r, 12, 12, P.yel); }
      const km = prog(b, t('mode'), t('mode') + .3);
      if (km > 0) alpha(tx, km, () => { rr(tx, 640, 230, 640, 110, 6, P.navy, P.yel, 6); txt(tx, '计划模式：先出方案，不动代码', 960, 285, fnt(900, 36), P.yel, 'center'); });
    }
    // ---------- 存档点时间线 ----------
    if (b >= t('save0') && b < t('test')) {
      ground(cx, 0, 1920, GY);
      const redA = prog(b, t('bug') + .3, t('bug') + .4) * (1 - prog(b, t('load') + .1, t('load') + .5));
      if (redA > 0) alpha(cx, redA, () => px(cx, 870, GY - 6, 420, 18, P.red));
      SAVES.forEach(([at, x]) => { if (b >= at) { if (!has3d) crystal(cx, x, GY - 70, tt); txt(tx, 'commit', x, GY - 160, fnt(400, 20, F.pixel), P.yel, 'center'); } });
      if (b >= t('bug') && b < t('load') + .1) bug(cx, lerp(1500, 1180, prog(b, t('bug'), t('bug') + .3)), GY, tt);
      const kbr = prog(b, t('br'), t('br') + .4, E.out);
      if (kbr > 0) { for (let i = 0; i < 12 * kbr; i++) px(cx, 900 + i * 22, GY - 40 - i * 34, 18, 12, P.yel); px(cx, 1150, 420, 300 * kbr, 24, P.grn); alpha(tx, kbr, () => txt(tx, '分支 try/jwt', 1300, 480, fnt(900, 30), P.grn, 'center')); }
      if (b >= t('load') && b < t('load') + .8) alpha(tx, 1 - prog(b, t('load') + .5, t('load') + .8), () => txt(tx, 'LOAD', 870, 600, fnt(400, 56, F.pixel), P.yel, 'center'));
    }
    // ---------- 测试终点 ----------
    if (b >= t('test') && b < t('g0')) {
      ground(cx, 0, 1920, GY);
      px(cx, 1500, 520, 12, 350, P.wht); const wave = Math.floor(tt * 6) % 2 * 6;
      px(cx, 1512, 520 + wave, 150, 90, P.grn); txt(tx, 'TESTS ✓', 1587, 565 + wave, fnt(400, 22, F.pixel), P.wht, 'center');
      if (b >= t('trick')) { const f = Math.floor(tt * 8) % 2; px(cx, 1060, 600, 180, 150, f ? P.yel : P.org); txt(tx, '//', 1150, 676, fnt(400, 56, F.pixel), P.blk, 'center'); }
    }
    // ---------- GAME OVER ----------
    if (b >= t('g0') && b < t('learn0')) {
      for (let i = 0; i < 3; i++) heart(cx, 1440 + i * 70, 150, b < DIE[i]);
      const go = prog(b, t('go'), t('go') + .1);
      if (go > 0) alpha(tx, 1 - prog(b, t('learn0') - .3, t('learn0')), () => {
        txt(tx, 'GAME OVER', 960, 300, fnt(400, 84, F.pixel), P.red, 'center');
        if (b >= t('cont')) { txt(tx, 'CONTINUE?', 960, 430, fnt(400, 40, F.pixel), P.wht, 'center');
          const sel = b < t('c0') ? -1 : b < t('c1') ? 0 : b < t('c2') ? 1 : 2;
          MENU.forEach((s, i) => { const y = 540 + i * 90, on = i === sel; if (on) txt(tx, '▶', 640, y, fnt(400, 40, F.pixel), P.yel, 'center'); txt(tx, s, 700, y, fnt(900, 48), on ? P.yel : P.wht); }); }
      });
    }
    if (b >= t('learn0')) {
      ground(cx, 0, 1920, GY);
      const kb = prog(b, t('learn1'), t('learn1') + .3, E.back);
      if (kb > 0) scaleAt(cx, 700, 640, kb, () => { px(cx, 580, 560, 240, 160, P.wht); px(cx, 694, 560, 12, 160, P.dgy); }); if (kb > 0) scaleAt(tx, 700, 640, kb, () => { txt(tx, '基础', 640, 640, fnt(900, 40), P.navy, 'center'); txt(tx, '语法', 760, 640, fnt(900, 40), P.navy, 'center'); });
      const kt = prog(b, t('teacher'), t('teacher') + .3, E.back);
      if (kt > 0) scaleAt(cx, 1350, 620, kt, () => { px(cx, 1250, 540, 200, 120, P.navy); px(cx, 1262, 552, 176, 96, P.dg); px(cx, 1340, 660, 12, 200, P.brn); }); if (kt > 0) scaleAt(tx, 1350, 620, kt, () => txt(tx, '听老师的', 1350, 600, fnt(900, 36), P.wht, 'center'));
    }
    // ---------- Clawd ----------
    let st = { x: 940, y: GY, px: 18, col: P.org, hi: P.pch, eyeC: P.blk, hat: 'cap8', hatC: P.red, pose: 'idle', ph: step * 10, blink: (tt % 3) < .1, eye: 1 };
    if (b < t('step')) { st.x = lerp(840, 1100, prog(b, 0, 1.5, E.lin)); st.walk = b < 1.5 ? step * 20 : -1; st.pose = 'up'; if (b >= 1.2) { st.eye = Math.floor(tt * 6) % 2 ? 1 : -1; st.q = 1; st.sweat = b; } }
    if (b >= t('step') && b < t('map0')) { st.x = 1100; st.eye = -1; }
    if (b >= t('map0') && b < t('save0')) {
      let i = -1; HOPS.forEach((a, j) => { if (b >= a) i = j; });
      const yourStop = b >= HOPS[2] && b < t('ok') + .3, ii = yourStop ? 2 : i;
      const from = ii <= 0 ? 100 : NODES[ii - 1][1], to = ii < 0 ? 100 : NODES[ii][1], k = ii < 0 ? 0 : prog(b, (yourStop ? HOPS[2] : HOPS[ii]), (yourStop ? HOPS[2] : HOPS[ii]) + .3, E.io);
      st.x = lerp(from, to, k); st.y = 560 - Math.sin(Math.PI * k) * 80; st.px = 12;
      if (b >= t('ok') + .3) { const k2 = prog(b, t('ok') + .3, t('ok') + 1, E.io); st.x = lerp(820, 1660, k2); st.y = 560 - Math.sin(Math.PI * k2) * 160; st.pose = k2 >= 1 ? 'both' : 'idle'; }
      if (b >= t('yours') && b < t('ok')) { st.q = 1; st.eye = -1; st.pose = 'up'; }
    }
    if (b >= t('save0') && b < t('test')) {
      const k7 = prog(b, t('save1'), t('bug'), E.lin); st.x = lerp(330, 1180, k7); st.y = GY; st.px = 14; st.walk = b < t('bug') ? step * 20 : -1;
      if (b >= t('bug') + .3 && b < t('load')) { st.x = 1180; st.eyeShape = 'x'; st.pose = 'cover'; }
      if (b >= t('load')) { const k = prog(b, t('load'), t('load') + .5, E.io); st.x = lerp(1180, 600, k); st.eyeShape = null; st.pose = 'idle'; st.walk = k < 1 ? -step * 20 : -1; }
      if (b >= t('br')) { const k = prog(b, t('br'), t('br') + .6, E.io); st.x = lerp(600, 1300, k); st.y = lerp(GY, 420, k) - Math.sin(Math.PI * k) * 60; }
    }
    if (b >= t('test') && b < t('g0')) { const k = prog(b, t('test'), t('test') + 1.2, E.io); st.x = lerp(300, 1420, k); st.y = GY; st.px = 14; st.walk = k < 1 ? step * 20 : -1; if (b >= t('trick')) { st.eye = -1; st.pose = 'point'; } }
    if (b >= t('g0') && b < t('learn0')) { st.x = 960; st.y = 900; st.px = 14; st.alpha = b >= t('go') ? .5 : 1; st.eyeShape = b >= DIE[2] ? 'x' : null; }
    if (b >= t('learn0')) { st.x = 1000; st.y = GY; st.px = 16; st.pose = b >= t('teacher') ? 'point' : 'idle'; }
    clawd(cx, st);
    narrate(tx, L, S, { sub: { y: 990, shadow: 'rgba(0,0,0,1)', fam: F.sans }, gloss: { bg: 'rgba(29,43,83,.95)', ink: P.wht, acc: P.yel, border: P.blu } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD, CH = H.CH;
    Sm.add('kick', 0, 0, 0, 0, 1, 'chip');
    const g0 = Math.floor(t('g0') + .4), g1 = Math.ceil(t('learn0'));
    H.each(0, B, b => {
      if (b >= g0 && b < g1) return;
      const c = CH[PD[b % 4]], soft = b >= g1 ? .55 : .8;
      [0, 2, 2.5].forEach(bt => Sm.add('kick', b, bt, 0, 0, .9 * soft, 'chip'));
      [1, 3].forEach(bt => Sm.add('snare', b, bt, 0, 0, .9 * soft, 'chip'));
      for (let j = 0; j < 8; j++) Sm.add('hat', b, j / 2, 0, 0, .45 * soft, 'chip');
      [0, .5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((bt, j) => Sm.add('bass', b, bt, c.r + 12 + (j % 2 ? 12 : 0), .45, .7 * soft, 'chip'));
      for (let j = 0; j < 16; j++) Sm.add('chiparp', b, j / 4, c.arp[j % 3] + 12, .22, .55 * soft);
    });
    H.hook(Sm, Math.ceil(t('map0')), 'chip', 0, 0, 8, .8);
    H.hook(Sm, g1, 'chip', 0, 0, 4, .45);
  },
}, S);
};
})();
