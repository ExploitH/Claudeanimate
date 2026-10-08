// 第七章 · 23:40「一口气改完」：工作流程
// f07a 现实：让它一口气改完；改了五个文件，坏了一处，不知道是哪一处
// f07b 存档（8-bit）：五个文件里找一处错，收成一步就一眼找到；关卡地图六关，第三关你审计划（划掉一步、加一条、盖章）；计划模式锁文件；
//      存档菜单两次提交，改坏了读档；第二天新对话翻提交记录；矿车开分支翻车；测试灯和假通过；同一堵墙撞三次、暂停菜单三选一；教程关和 == 的坑；规则 6
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
const PM = { b: P.blu, w: P.wht, l: P.lgy, d: P.dgy, n: P.navy, y: P.yel, o: P.org, r: P.red, g: P.grn, G: P.dg, k: P.blk, p: P.pch, B: P.brn };
// 12×N 像素图标
const ICON = {
  book: ['............', '.wwww..wwww.', 'wddww..wwddw', 'wwwww..wwwww', 'wddwwnnwwddw', 'wwwwwnnwwwww', 'wddwwnnwwddw', 'wwwwwnnwwwww', 'nnnnnnnnnnnn', '............'],
  scroll: ['.oooooooooo.', 'oyyyyyyyyyyo', '.wwwwwwwwww.', '.wddddddddw.', '.wwwwwwwwww.', '.wddddddwww.', '.wwwwwwwwww.', '.wdddddwwww.', '.wwwwwwwwww.', 'oyyyyyyyyyyo', '.oooooooooo.'],
  flag: ['.k..........', '.kbbbbbbb...', '.kbbbbbbbbb.', '.kbbwwwbbbb.', '.kbbbbbbbbb.', '.kbbbbbbb...', '.k..........', '.k..........', '.k..........', 'kkk.........'],
  hammer: ['.lllllll....', 'llllllllll..', 'llllllllll..', '.lllllll....', '....BB......', '....BB......', '....BB......', '....BB......', '....BB......', '....BB......'],
  shield: ['.bbbbbbbbbb.', '.bwwwwwwwwb.', '.bwwwwwwgwb.', '.bwwwwwggwb.', '.bwgwwggwwb.', '.bwggggwwwb.', '.bwwggwwwwb.', '..bwwwwwwb..', '...bwwwwb...', '....bbbb....'],
  floppy: ['bbbbbbbbbbb.', 'bbwwwwwwdbbb', 'bbwwwwwwdbbb', 'bbwwwwwwwbbb', 'bbbbbbbbbbbb', 'bbbbbbbbbbbb', 'bblllllllllb', 'bblddddddllb', 'bbllllllllbb', 'bbldddddllbb', 'bbllllllllbb', 'bbbbbbbbbbbb'],
  bug: ['..r......r..', '...r....r...', '....rrrr....', '..rrrrrrrr..', '.rryrrrryrr.', 'rrrrrrrrrrrr', '.rrrrrrrrrr.', 'r.rrrrrrrr.r', '..rrrrrrrr..', '.r..r..r..r.'],
  lock: ['...dddddd...', '..dd....dd..', '..d......d..', '..d......d..', '.yyyyyyyyyy.', '.yyyyyyyyyy.', '.yyyykkyyyy.', '.yyyykkyyyy.', '.yyyyyyyyyy.', '.yyyyyyyyyy.'],
  chat: ['wwwwwwwwww..', 'wbbbbbbbbw..', 'wbbbbggbbw..', 'wbbbggggbw..', 'wbbbbggbbw..', 'wbbbbbbbbw..', 'wwwwwwwwww..', '.ww.........', 'w...........'],
  keys: ['dddddddddddd', 'dwlwlwlwlwld', 'dddddddddddd', 'dlwlwlwlwlwd', 'dddddddddddd', 'dwwlllllllwd', 'dddddddddddd'],
  page: ['wwwwwwww....', 'wddddddww...', 'wwwwwwwwww..', 'wdddddwwwww.', 'wwwwwwwwwww.', 'wddddddddww.', 'wwwwwwwwwww.', 'wdddwwwwwww.', 'wwwwwwwwwww.', 'wwwwwwwwwww.'],
};
const FILES5 = ['UserService.java', 'User.java', 'PasswordUtil.java', 'LoginController.java', 'application.yml'];
const NODES = [['读代码', 'book', 420, 380], ['出计划', 'scroll', 960, 380], ['你看计划', 'flag', 1500, 380], ['改代码', 'hammer', 1500, 720], ['验证', 'shield', 960, 720], ['提交', 'floppy', 420, 720]];
const PLAN = ['User 加 passwordHash 字段', 'PasswordUtil 加 hash() 和 verify()', 'UserService.login 改用 verify()', '顺便重构 LoginController'];
const SLOTS = [['a1f3c2e', 'User 加 passwordHash 字段'], ['7b9e041', 'PasswordUtil 加 hash() / verify()']];
const LOG = [['7b9e041', 'PasswordUtil 加 hash() / verify()'], ['a1f3c2e', 'User 加 passwordHash 字段'], ['3e0b8d2', '初始项目']];
const TCODE = ['@Test void loginOk() {', '  assertTrue(login("alice", "pw123"));', '}', '@Test void wrongPassword() {', '  assertFalse(login("alice", "xxx"));', '}', '@Test void nullPassword() {', '  assertFalse(login("alice", null));', '}'];
const TNAME = ['loginOk', 'wrongPassword', 'nullPassword'];
const MENU = [['floppy', '回退到上一个提交'], ['chat', '补充信息，新开一个对话'], ['keys', '你自己写']];
const pxr = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
function pic(ctx, name, x, y, s) { const m = ICON[name], h = m.length, w = m[0].length, x0 = x - w * s / 2, y0 = y - h * s / 2; m.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const c = PM[row[i]]; if (c) { ctx.fillStyle = c; ctx.fillRect(x0 + i * s, y0 + j * s, s, s); } } }); }
// RPG 对话框：黑边 + 白框 + 底色
function win(ctx, x, y, w, h, fill = P.navy, edge = P.wht) { pxr(ctx, x, y, w, h, P.blk); pxr(ctx, x + 6, y + 6, w - 12, h - 12, edge); pxr(ctx, x + 12, y + 12, w - 24, h - 24, fill); }
function person(ctx, x, y, s, shirt, hair = P.blk, glasses = false) {
  const R = (i, j, w, h, c) => pxr(ctx, x + i * s, y - j * s, w * s, h * s, c);
  R(-2, 4, 1.7, 4, P.navy); R(.3, 4, 1.7, 4, P.navy); R(-3, 10, 6, 6, shirt); R(-4, 10, 1, 5, shirt); R(3, 10, 1, 5, shirt); R(-4, 5, 1, 1, P.pch); R(3, 5, 1, 1, P.pch);
  R(-2.5, 15, 5, 5, P.pch); R(-2.5, 16, 5, 2, hair); R(-2.5, 15, 1, 3, hair);
  if (glasses) { R(-2, 13.5, 2, 2, P.dgy); R(.2, 13.5, 2, 2, P.dgy); R(-1.5, 13, 1, 1, P.wht); R(.7, 13, 1, 1, P.wht); }
  R(-1.3, 13, .8, 1, P.blk); R(.9, 13, .8, 1, P.blk);
}
function rail(ctx, x0, y0, x1, y1) { const n = Math.hypot(x1 - x0, y1 - y0) / 42, nx = -(y1 - y0) / (n * 42), ny = (x1 - x0) / (n * 42); for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), y = lerp(y0, y1, i / n); ctx.save(); ctx.translate(x, y); ctx.rotate(Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2); pxr(ctx, -24, -5, 48, 10, P.brn); ctx.restore(); } [-16, 16].forEach(d => seg(ctx, x0 + nx * d, y0 + ny * d, x1 + nx * d, y1 + ny * d, P.lgy, 6)); }
function cart(ctx, x, y, rot = 0) { rotAt(ctx, x, y, rot, () => { pxr(ctx, x - 60, y - 66, 120, 54, P.dgy); pxr(ctx, x - 54, y - 60, 108, 12, P.lgy); pxr(ctx, x - 66, y - 72, 132, 12, P.dgy); [-34, 34].forEach(d => { pxr(ctx, x + d - 15, y - 18, 30, 30, P.blk); pxr(ctx, x + d - 6, y - 9, 12, 12, P.lgy); }); }); }
function bricks(ctx, x, y, w, h) { pxr(ctx, x, y, w, h, P.brn); for (let r = 0; r * 36 < h; r++) { pxr(ctx, x, y + r * 36, w, 6, P.plum); for (let c = (r % 2) * 36; c < w; c += 72) pxr(ctx, x + c, y + r * 36, 6, 36, P.plum); } }
const S = seq([
  { id: 'run', say: '五个文件，几十处改动；测试只告诉你：挂了一个。', hold: .5 },
  { id: 'run2', say: '一次改得越多，出错的时候，要翻的范围就越大。', hold: .75 },
  { id: 'step', say: '更好的办法：把每次出错的范围，控制在一步之内。好找，也好退回去。', hold: .75 },
  { id: 'map0', say: '换个打法——像打游戏一样，一关一关过：' },
  { id: 'n0', say: '读代码，', dur: 1 },
  { id: 'n1', say: '出计划，', dur: 1 },
  { id: 'n2', say: '你看计划，', dur: 1.25 },
  { id: 'n3', say: '改代码，', dur: 1 },
  { id: 'n4', say: '验证，', dur: 1 },
  { id: 'n5', say: '提交。', dur: 1.25 },
  { id: 'yours', say: '注意第三关：它是你的。我先交一份计划，你来看、来改。', hold: .5 },
  { id: 'cut', say: '比如第四步「顺便重构 LoginController」——这次用不着，划掉。', hold: .25 },
  { id: 'add', say: '再加一条：每改完一步，跑一次测试。', hold: .25 },
  { id: 'ok', say: '你盖了章，我再往下走。', hold: 1 },
  { id: 'mode', say: '有的工具有「计划模式」：先出方案，不动代码。' }, // 不点名具体工具：IDEA 里的 Qoder 没有计划模式
  { id: 'mode2', say: '没有的话，直接跟我说：先别改代码，给我一个计划。', hold: .75 },
  { id: 'save0', say: '每过一关、验证通过，就提交一次。', gloss: ['Git 提交', 'commit', '给代码拍一张快照，以后随时能回到这一刻。'], until: 'bug' },
  { id: 'save1', say: 'Git 的每一次提交，就是游戏里的存档点。', hold: .75 },
  { id: 'bug', say: '下一步改坏了？', dur: 1.75 },
  { id: 'load', say: '不用一行一行去找，直接读档，回到上一个存档点。', hold: .75 },
  { id: 'ckpt', say: 'Anthropic 的官方指南也提到：git 记录和检查点，能帮模型在多次会话之间接着干。', src: 'Anthropic, Prompting best practices', srcUntil: 'br' },
  { id: 'ckpt2', say: '第二天开个新对话，我先翻一遍提交记录，就知道做到第几步了。', hold: .5 },
  { id: 'br', say: '有风险的尝试，开个分支去试。', gloss: ['分支', 'branch', '从主线分出去的一条平行线。试坏了，主线不受影响。'], until: 'test', hold: .5 },
  { id: 'br2', say: '试砸了，删掉这条分支就行，主线一点不受影响。', hold: .75 },
  { id: 'test', say: '再把测试当成终点线：先写好测试，再让我改到测试通过。', gloss: ['测试', 'JUnit', '一段自动检查代码对不对的代码。'], until: 'trick' },
  { id: 'test2', say: '我能自己跑测试，就能自己发现问题。改、跑、看结果，一圈一圈来。', hold: .5 },
  { id: 'trick', say: '不过，得防着我为了让测试通过而耍小聪明——下一章细说。', hold: .75 },
  { id: 'g0', say: '如果同一个问题，连着失败了三次——', hold: 1 },
  { id: 'go', pause: 1.25 },
  { id: 'cont', say: '就停下来。三选一：', hold: .25 },
  { id: 'c0', say: '回退到上一个提交；', dur: 1.75 },
  { id: 'c1', say: '补充信息，新开一个对话；', dur: 2 },
  { id: 'c2', say: '或者，你自己写。', dur: 2 },
  { id: 'learn0', say: '最后两句，说给正在学编程的你：' },
  { id: 'learn1', say: '要是你还在学基础语法，先别用我。自己写不出来的代码，你也看不出我错在哪。', hold: .5 },
  { id: 'eq', say: '比如这一行：两个字符串用 == 比较，看着没毛病。可在 Java 里，比较字符串该用 equals。', hold: .75 },
  { id: 'teacher', say: '作业能不能用 AI、用到什么程度，听老师的。', hold: .5 },
  { id: 'rule', rule: [6, '先出计划，小步提交'], dur: 3.5 },
], { start: 2.8, tail: .5 });
const t = S.t;
const sec = (b, a, e) => prog(b, t(a) - .05, t(a) + .3) * (e ? 1 - prog(b, t(e) - .3, t(e)) : 1);
const both = (cx, tx, k, fn) => { if (k > 0) alpha(cx, k, () => alpha(tx, k, fn)); };
// 五个文件的改动行：第 3 个文件第 9 行是出错的那一行；「一步」只保留第 3 个文件的 7/9/11 行
const ROWS = 15, BUGF = 2, BUGR = 9, STEP = [7, 9, 11];
const CHG = FILES5.map((_, i) => Array.from({ length: ROWS }, (_, j) => (i === BUGF && STEP.includes(j)) || hash(i * 31 + j * 7 + 3) < .4));
const NCHG = CHG.flat().filter(Boolean).length;
const VISIT = []; CHG.forEach((r, i) => r.forEach((c, j) => { if (c && !(i === BUGF && j === BUGR)) VISIT.push([i, j]); }));
const fx = i => 150 + i * 330, ry = j => 352 + j * 26;
const HOPS = NODES.map((_, i) => t('n' + i));
const GO3 = [0, 1, 2].map(i => t('ok') + .9 + i * .4);
const SAVE = [t('save0') + .7, t('save1') + .5];
const DIE = [0, 1, 2].map(i => lerp(t('g0'), t('go'), (i + .7) / 3.2));
const LAMP = [t('test2') + .6, t('test2') + 1.5];
return scene({
  scene: '07 存档 · 工作流程', look: LOOK.PIXEL,
  desc: '五个文件里找一处错；关卡地图六关，第三关你审计划、划掉一步、加一条、盖章；计划模式锁住文件；存档菜单里两次提交，改坏了读档；第二天新对话翻提交记录；矿车开分支、翻车，主线没事；测试灯和假通过；同一堵墙撞三次，暂停菜单三选一；教程关和 == 的坑；听老师的；规则 6。',
  enter: { kind: TR.PIXEL, a: 0, b: 2.5, col: '#ffec27' },
  hud: { num: '07', name: '工作流程', time: '23:40', line: '一口气改完', ink: P.wht, acc: P.yel, mv: [2.1, 2.6] },
  par: L => { const b = L.b, ps = b >= t('go') && b < t('cont'); return [ps ? 9 : 6, b < t('map0') || b >= t('learn0') ? 1 : 0, 1.5, 0]; },
  cam: L => [1, 0, (L.b >= t('bug') + .2 && L.b < t('bug') + .45 ? (hash(Math.floor(L.t * 30)) - .5) * .01 : 0), 0],
  pulse: L => L.b >= t('go') && L.b < t('learn0') ? 0 : .6,
  sfx: [[t('run') + .2, 'buzz'], ...VISIT.slice(0, 10).map((_, i) => [lerp(t('run2'), t('step'), i / 10), 'tick']), [t('step') + .9, 'coin'],
    ...HOPS.map((b, i) => [b, i < 3 ? 'jump' : 'blip', 700 + i * 80]), [t('yours') + .2, 'menu'], [t('cut') + .4, 'scratch'], [t('add') + .3, 'type'], [t('ok') + .1, 'stamp'], ...GO3.map(b => [b, 'jump']), [GO3[2] + .4, 'powerup'],
    [t('mode') + .4, 'click'], [t('mode') + .9, 'lock'], ...SAVE.map(b => [b + .5, 'save']), [t('bug') + .2, 'hurt'], [t('load') + .3, 'menu'], [t('load') + .7, 'rewind'],
    [t('ckpt') + .3, 'enter'], [t('ckpt2') + .5, 'blip', 900], [t('br') + .2, 'jump'], [t('br') + 1.6, 'shatter'], [t('br2') + .4, 'snip'], [t('br2') + .9, 'coin'],
    [t('test') + .4, 'type'], ...LAMP.map(b => [b, 'coin']), [t('trick') + .5, 'type'], [t('trick') + 1, 'buzz'], ...DIE.map(b => [b, 'bonk']), [t('go'), 'freeze'], [t('cont') + .1, 'menu'], [t('c0'), 'menu'], [t('c1'), 'menu'], [t('c2'), 'menu'],
    [t('learn0') + .2, 'jump'], [t('eq') + .5, 'buzz'], [t('eq') + 1.3, 'coin'], [t('teacher') + .3, 'q', 600]],
  text: NODES.map(n => n[0]).join('') + PLAN.join('') + SLOTS.flat().join('') + LOG.flat().join('') + TCODE.join('') + TNAME.join('') + MENU.map(m => m[1]).join('') + FILES5.join('') +
    '测试：11 个通过，1 个失败改动处已检查这一步找到了计划PLAN+ 每改完一步，跑一次 mvn test这次用不着OK你计划模式ON先出方案不动代码只读没有这个模式？直接说：「先别改代码，给我一个计划」SAVELOAD存档空第 3 步 ✗ 测试失败◀◀ 读档回到存档 2第二天 · 新对话git log --oneline→ 接着做第 3 步：UserService.login 改用 verify()main 主线try/jwt 分支删掉分支✓ 不受影响UserServiceTest.java终点：全部通过假通过→ 第 8 章改跑看结果同一个问题NPE：User.password 为空第 1 次第 2 次第 3 次✗PAUSE‖教程关基础语法看着没问题？if (user.getPassword() == input) {return true;}user.getPassword().equals(input)比较字符串用 equals()作业要求完成用户登录功能AI 使用：按老师的要求老师你',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, step = Math.floor(tt * 8) / 8;
    let st = { x: 960, y: 890, px: 12, col: P.org, hi: P.pch, eyeC: P.blk, hat: 'cap8', hatC: P.red, pose: 'idle', ph: step * 10, blink: (tt % 3) < .1, eye: 0, alpha: 0 };
    // ---------- A. 五个文件里找一处错 ----------
    const kA = sec(b, 'run', 'map0');
    both(cx, tx, kA, () => {
      const ks = prog(b, t('step'), t('step') + .5, E.io);
      txt(tx, '测试：11 个通过，1 个失败', 960, 196, fnt(900, 40), P.red, 'center');
      FILES5.forEach((f, i) => {
        const solo = i === BUGF, a = solo ? 1 : 1 - ks, x = fx(i) + (solo ? 0 : (i < BUGF ? -1 : 1) * ks * 160);
        if (a <= 0) return;
        alpha(cx, a, () => alpha(tx, a, () => {
          const kin = prog(b, t('run') + i * .12, t('run') + .3 + i * .12, E.back); if (kin <= .01) return;
          scaleAt(cx, x + 150, 500, kin, () => { win(cx, x, 250, 300, 500, P.navy); pxr(cx, x + 12, 262, 276, 48, P.blu); });
          if (kin > .9) txt(tx, f, x + 150, 288, fnt(700, f.length > 16 ? 19 : 21, F.mono), P.wht, 'center');
          for (let j = 0; j < ROWS; j++) {
            const keep = solo && STEP.includes(j), on = CHG[i][j] && (ks < .5 || keep), w = 90 + hash(i * 17 + j * 5) * 160;
            if (kin > .9) pxr(cx, x + 24, ry(j), w, 12, on ? P.org : P.dgy);
          }
        }));
      });
      // 放大镜：先在所有改动行之间一处处翻；收成一步之后直接落到那一行
      const kr = prog(b, t('run2'), t('step'), E.lin) * 10, idx = Math.min(VISIT.length - 1, Math.floor(kr)), nx = Math.min(VISIT.length - 1, idx + 1), f2 = E.io(kr - Math.floor(kr));
      let mx = lerp(fx(VISIT[idx][0]) + 120, fx(VISIT[nx][0]) + 120, f2), my = lerp(ry(VISIT[idx][1]), ry(VISIT[nx][1]), f2);
      const kf = prog(b, t('step') + .4, t('step') + .9, E.io); mx = lerp(mx, fx(BUGF) + 120, kf); my = lerp(my, ry(BUGR), kf);
      if (b >= t('run2')) { circ(cx, mx, my + 6, 64, rgba(P.wht, .12), P.wht, 10); seg(cx, mx + 46, my + 52, mx + 100, my + 108, P.brn, 16); }
      if (b >= t('run2') && ks < .5) txt(tx, '已检查 ' + Math.min(idx + 1, 10) + ' / ' + NCHG + ' 处', 960, 810, fnt(900, 40), P.yel, 'center');
      else if (b < t('run2')) txt(tx, '改动 ' + NCHG + ' 处', 960, 810, fnt(900, 40), P.org, 'center');
      if (ks >= .5) {
        txt(tx, '这一步：改动 3 处', 960, 810, fnt(900, 40), P.yel, 'center');
        const d = prog(b, t('step') + .2, t('step') + .5); cx.setLineDash([18, 12]); cx.strokeStyle = rgba(P.yel, d); cx.lineWidth = 6; cx.strokeRect(fx(BUGF) - 30, 230, 360, 540); cx.setLineDash([]);
        const kb = prog(b, t('step') + .9, t('step') + 1.2, E.back);
        if (kb > .01) { scaleAt(cx, fx(BUGF) + 330, ry(BUGR), kb, () => pic(cx, 'bug', fx(BUGF) + 330, ry(BUGR), 6)); alpha(tx, Math.min(1, kb), () => txt(tx, '找到了', fx(BUGF) + 390, ry(BUGR), fnt(900, 40), P.yel)); }
      }
      st = { ...st, alpha: kA, x: 1760, y: 900, px: 11, pose: b < t('step') ? 'idle' : 'up', eye: b < t('step') ? (Math.floor(tt * 3) % 2 ? 1 : -1) : 0, q: b >= t('run') + .5 && b < t('step') ? 1 : 0, sweat: b >= t('run2') && b < t('step') ? b : 0, eyeShape: b >= t('step') + 1 ? 'happy' : null };
    });
    // ---------- B. 关卡地图 ----------
    const kB = sec(b, 'map0', 'mode');
    both(cx, tx, kB, () => {
      pxr(cx, 120, 220, 1680, 660, P.dg);
      for (let y = 220; y < 880; y += 60) for (let x = 120 + (Math.round((y - 220) / 60) % 2) * 60; x < 1800; x += 120) pxr(cx, x, y, 60, Math.min(60, 880 - y), '#0a7a48');
      const path = (x0, y0, x1, y1) => { const k = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / 48; for (let i = 0; i <= k; i++) pxr(cx, lerp(x0, x1, i / k) - 30, lerp(y0, y1, i / k) - 30, 60, 60, P.pch); };
      path(200, 380, 1500, 380); path(1500, 380, 1500, 720); path(1500, 720, 420, 720);
      const kpl = prog(b, t('yours') + .2, t('yours') + .5, E.out) * (1 - prog(b, t('ok') + .4, t('ok') + .7));
      NODES.forEach(([n, ic, x, y], i) => {
        const human = i === 2, lit = b >= HOPS[i], done = i < 2 ? b >= HOPS[i + 1] : i >= 3 && b >= GO3[i - 3] + .3;
        const kp = prog(b, HOPS[i], HOPS[i] + .25, E.back), s = 1 + .15 * Math.max(0, kp > 0 && kp < 1 ? Math.sin(kp * Math.PI) : 0);
        scaleAt(cx, x, y, s, () => { pxr(cx, x - 60, y - 60, 120, 120, P.blk); pxr(cx, x - 54, y - 54, 108, 108, human ? P.blu : done ? P.grn : lit ? P.lgy : P.dgy); pxr(cx, x - 46, y - 46, 92, 92, human ? P.wht : P.navy); pic(cx, ic, x, y, 6); });
        alpha(tx, (lit ? 1 : .35) * (1 - kpl), () => { const w = tw(tx, n, fnt(900, 36)) + 28; pxr(tx, x - w / 2, y + 74, w, 50, 'rgba(0,0,0,.72)'); txt(tx, n, x, y + 98, fnt(900, 36), human ? P.blu : P.wht, 'center'); });
      });
      person(cx, 1610, 440, 5, P.blu); alpha(tx, 1 - kpl, () => txt(tx, '你', 1610, 322, fnt(900, 30), P.blu, 'center'));
      // 第二关和第三关之间的闸门：盖章以后才抬起来
      const gate = prog(b, t('ok') + .5, t('ok') + .8, E.io);
      pxr(cx, 1428, 576 - gate * 60, 144, 18, P.brn); pxr(cx, 1428, 612 - gate * 60, 144, 18, P.brn); pxr(cx, 1420, 556, 12, 90, P.dgy); pxr(cx, 1568, 556, 12, 90, P.dgy);
      if (b >= GO3[2] + .4) for (let j = 0; j < 8; j++) { const a = j / 8 * 6.283 + tt * 2, r = 70 + ((tt * 2) % 1) * 50; pxr(cx, 420 + Math.cos(a) * r, 720 + Math.sin(a) * r, 12, 12, P.yel); }
      // Clawd 在格子上跳：前两关跳过去，在第三关门口等；盖章后连跳三关
      const at = i => [NODES[i][2], NODES[i][3] - 64];
      let p = [200, 316], k = 0, from = p, to = p;
      [[HOPS[0], [200, 316], at(0)], [HOPS[1], at(0), at(1)], [HOPS[2], at(1), at(2)], [GO3[0], at(2), at(3)], [GO3[1], at(3), at(4)], [GO3[2], at(4), at(5)]].forEach(([a, f, e]) => { if (b >= a) { from = f; to = e; k = prog(b, a, a + .3, E.io); } });
      p = [lerp(from[0], to[0], k), lerp(from[1], to[1], k) - Math.sin(Math.PI * k) * 70];
      st = { ...st, alpha: kB, x: p[0], y: p[1], px: 7, pose: b >= GO3[2] + .3 ? 'both' : 'idle', eye: b >= HOPS[2] && b < t('ok') ? -1 : 0 };
      if (b >= t('yours') && b < t('ok')) st.q = 1;
      // 卷轴打开时，Clawd 从第三关跳到卷轴右下，站在一旁等你盖章
      if (kpl > 0) { st.x = lerp(st.x, 1640, kpl); st.y = lerp(st.y, 860, kpl); st.px = lerp(7, 11, kpl); }
      // 计划卷轴
      const kp = prog(b, t('yours') + .2, t('yours') + .5, E.out) * (1 - prog(b, t('ok') + .4, t('ok') + .7));
      if (kp > 0) alpha(cx, kp, () => alpha(tx, kp, () => {
        alpha(cx, .6, () => pxr(cx, 0, 0, 1920, 1080, P.blk));
        const y0 = 170 + (1 - kp) * 40;
        pxr(cx, 420, y0, 1080, 36, P.org); pxr(cx, 420, y0 + 664, 1080, 36, P.org);
        pxr(cx, 450, y0 + 36, 1020, 628, P.wht); pxr(cx, 450, y0 + 36, 12, 628, P.pch); pxr(cx, 1458, y0 + 36, 12, 628, P.pch);
        txt(tx, '计划', 520, y0 + 104, fnt(900, 48), P.navy); txt(tx, 'PLAN', 1410, y0 + 104, fnt(400, 26, F.pixel), P.org, 'right');
        pxr(cx, 520, y0 + 140, 880, 6, P.lgy);
        PLAN.forEach((s, i) => {
          const y = y0 + 210 + i * 90; txt(tx, (i + 1) + '.', 520, y, fnt(900, 36, F.mono), P.dgy); txt(tx, s, 580, y, fnt(700, 36), i === 3 && b >= t('cut') + .4 ? P.dgy : P.navy);
          if (i === 3) { const kc = prog(b, t('cut') + .3, t('cut') + .6, E.io); if (kc > 0) { pxr(cx, 572, y - 4, (tw(tx, s, fnt(700, 36)) + 20) * kc, 8, P.red); if (kc >= 1) txt(tx, '这次用不着', 1400, y, fnt(900, 30), P.red, 'right'); } }
        });
        const ka = prog(b, t('add') + .2, t('add') + 1, E.lin);
        if (ka > 0) { const s = '+ 每改完一步，跑一次 mvn test'; txt(tx, s.slice(0, Math.ceil(s.length * ka)), 520, y0 + 570, fnt(900, 36), P.dg); }
        const ko = prog(b, t('ok'), t('ok') + .12, E.out);
        if (ko > 0) rotAt(cx, 1300, y0 + 560, -.18, () => scaleAt(cx, 1300, y0 + 560, lerp(2.2, 1, ko), () => { pxr(cx, 1210, y0 + 510, 180, 100, P.red); pxr(cx, 1222, y0 + 522, 156, 76, P.wht); pxr(cx, 1234, y0 + 534, 132, 52, P.red); }));
        if (ko > 0) alpha(tx, ko, () => rotAt(tx, 1300, y0 + 560, -.18, () => txt(tx, 'OK', 1300, y0 + 562, fnt(400, 40, F.pixel), P.wht, 'center')));
      }));
    });
    // ---------- 计划模式 ----------
    const kM = sec(b, 'mode', 'save0');
    both(cx, tx, kM, () => {
      win(cx, 300, 200, 1320, 620, P.navy);
      txt(tx, '计划模式', 400, 300, fnt(900, 52), P.wht);
      const on = prog(b, t('mode') + .4, t('mode') + .6, E.io);
      pxr(cx, 720, 260, 150, 78, P.blk); pxr(cx, 726, 266, 138, 66, on > .5 ? P.grn : P.dgy); pxr(cx, lerp(732, 804, on), 272, 54, 54, P.wht);
      if (on > .5) txt(tx, 'ON', 900, 300, fnt(400, 30, F.pixel), P.grn);
      pxr(cx, 360, 380, 1200, 6, P.lgy);
      const k1 = prog(b, t('mode') + .5, t('mode') + .8, E.back);
      if (k1 > .01) { scaleAt(cx, 560, 560, k1, () => pic(cx, 'scroll', 560, 560, 12)); alpha(tx, Math.min(1, k1), () => txt(tx, '先出方案', 560, 730, fnt(900, 44), P.yel, 'center')); }
      [0, 1, 2].forEach(i => {
        const x = 1000 + i * 180, kl = prog(b, t('mode') + .9 + i * .1, t('mode') + 1.1 + i * .1, E.back);
        pic(cx, 'page', x, 540, 10);
        if (kl > .01) scaleAt(cx, x + 40, 600, kl, () => pic(cx, 'lock', x + 40, 600, 6));
      });
      const k2 = prog(b, t('mode') + .9, t('mode') + 1.2); if (k2 > 0) alpha(tx, k2, () => { txt(tx, '不动代码', 1180, 730, fnt(900, 44), P.yel, 'center'); txt(tx, '只读', 1180, 445, fnt(700, 28), P.lgy, 'center'); });
      const k3 = prog(b, t('mode2'), t('mode2') + .3); if (k3 > 0) alpha(tx, k3, () => txt(tx, '没有这个模式？直接说：「先别改代码，给我一个计划」', 960, 790, fnt(700, 30), P.wht, 'center'));
      st = { ...st, alpha: kM, x: 1740, y: 780, px: 11, pose: 'type', ph: tt * 18 };
    });
    // ---------- C. 存档菜单 ----------
    const kC = sec(b, 'save0', 'ckpt');
    both(cx, tx, kC, () => {
      const isLoad = b >= t('load'), redA = prog(b, t('bug') + .2, t('bug') + .3) * (1 - prog(b, t('load') + .7, t('load') + 1));
      win(cx, 780, 160, 1020, 700, P.navy);
      txt(tx, isLoad ? 'LOAD' : 'SAVE', 840, 230, fnt(400, 44, F.pixel), isLoad ? P.blu : P.yel);
      [0, 1, 2].forEach(i => {
        const y = 290 + i * 180, sv = i < 2 ? prog(b, SAVE[i], SAVE[i] + .5, E.lin) : 0, sel = isLoad && i === 1 && b < t('load') + .7;
        pxr(cx, 830, y, 920, 150, sel && Math.floor(tt * 6) % 2 ? P.blu : P.blk); pxr(cx, 836, y + 6, 908, 138, i === 2 && redA > 0 ? mixC('#14203f', P.plum, redA) : '#14203f'); if (i === 2 && redA > 0) alpha(cx, redA, () => { pxr(cx, 836, y + 6, 908, 6, P.red); pxr(cx, 836, y + 138, 908, 6, P.red); });
        pic(cx, 'floppy', 910, y + 75, 6);
        txt(tx, '存档 ' + (i + 1), 980, y + 50, fnt(900, 30), P.lgy);
        if (i < 2 && sv > 0) {
          if (sv < 1) { pxr(cx, 980, y + 92, 700, 24, P.dgy); pxr(cx, 980, y + 92, 700 * sv, 24, P.yel); txt(tx, 'SAVING...', 1680, y + 50, fnt(400, 20, F.pixel), P.yel, 'right'); }
          else { txt(tx, SLOTS[i][1], 980, y + 104, fnt(800, 36), P.wht); txt(tx, SLOTS[i][0], 1720, y + 50, fnt(600, 26, F.mono), P.lgy, 'right'); txt(tx, '✓ 测试通过', 1720, y + 104, fnt(800, 28), P.grn, 'right'); }
        } else if (i === 2 && redA > 0) {
          alpha(tx, redA, () => txt(tx, '第 3 步 ✗ 测试失败', 980, y + 104, fnt(900, 36), P.wht));
          alpha(cx, redA, () => pic(cx, 'bug', 1620 + Math.sin(tt * 9) * 10, y + 80, 6));
        } else txt(tx, '—— 空 ——', 980, y + 104, fnt(700, 32), P.dgy);
        if (sel) txt(tx, '▶', 800, y + 76, fnt(900, 40), P.yel, 'center');
      });
      // 读档：横条倒带
      const rw = prog(b, t('load') + .7, t('load') + 1.2);
      if (rw > 0 && rw < 1) { for (let j = 0; j < 9; j++) { const y = (j * 140 + tt * 2200) % 1100 - 20; alpha(cx, .55, () => pxr(cx, 0, y, 1920, 24, P.wht)); } txt(tx, '◀◀ 读档', 960, 540, fnt(900, 72), P.wht, 'center'); }
      if (b >= t('load') + 1.2) alpha(tx, prog(b, t('load') + 1.2, t('load') + 1.4), () => txt(tx, '回到存档 2', 1290, 900, fnt(900, 36), P.blu, 'center'));
      const hurt = b >= t('bug') + .2 && b < t('load') + 1;
      st = { ...st, alpha: kC, x: 400, y: 880, px: 13, pose: hurt ? 'cover' : b >= SAVE[0] + .5 && b < SAVE[0] + 1 || b >= SAVE[1] + .5 && b < SAVE[1] + 1 ? 'up' : 'idle', eyeShape: hurt ? 'x' : b >= t('load') + 1.2 ? 'happy' : null };
    });
    // ---------- 第二天：新对话翻提交记录 ----------
    const kD = sec(b, 'ckpt', 'br');
    both(cx, tx, kD, () => {
      txt(tx, '第二天 · 新对话', 960, 200, fnt(900, 48), P.yel, 'center');
      win(cx, 360, 260, 1200, 540, P.blk, P.lgy);
      txt(tx, '$ git log --oneline', 420, 330, fnt(600, 32, F.mono), P.grn);
      LOG.forEach(([h, m], i) => { const k = prog(b, t('ckpt') + .4 + i * .2, t('ckpt') + .6 + i * .2); if (k > 0) alpha(tx, k, () => { txt(tx, h, 420, 410 + i * 64, fnt(600, 32, F.mono), P.yel); txt(tx, m, 590, 410 + i * 64, fnt(700, 32), P.wht); }); });
      const kn = prog(b, t('ckpt2') + .5, t('ckpt2') + .8);
      if (kn > 0) alpha(tx, kn, () => { pxr(tx, 420, 610, 1080, 4, P.dgy); txt(tx, '→ 接着做第 3 步：UserService.login 改用 verify()', 420, 690, fnt(900, 34), P.blu); });
      st = { ...st, alpha: kD, x: 1710, y: 820, px: 12, pose: 'pointL', eye: -1, ph: tt * 10 };
    });
    // ---------- D. 矿车开分支 ----------
    const kE = sec(b, 'br', 'test');
    both(cx, tx, kE, () => {
      const SW = 760, MY = 800, BY = 520, BX = 1500;
      rail(cx, 0, MY, 1920, MY);
      const del = prog(b, t('br2') + .4, t('br2') + .8);
      alpha(cx, 1 - del, () => { rail(cx, SW, MY, SW + 240, BY); rail(cx, SW + 240, BY, BX, BY); pxr(cx, BX + 20, BY - 12, 60, 24, P.dgy); });
      [300, 540].forEach(x => { pxr(cx, x - 3, MY - 190, 6, 120, P.lgy); pic(cx, 'floppy', x, MY - 210, 5); });
      txt(tx, 'main 主线', 140, MY + 70, fnt(900, 34), P.grn);
      alpha(tx, 1 - del, () => txt(tx, 'try/jwt 分支', 1180, BY - 90, fnt(900, 34), P.yel, 'center'));
      if (del > 0 && del < 1) txt(tx, '✗', 1180, BY + 10, fnt(900, 120), P.red, 'center');
      if (b >= t('br2') + .8) { alpha(tx, prog(b, t('br2') + .8, t('br2') + 1.1), () => { txt(tx, '删掉分支', 1180, BY - 20, fnt(900, 40), P.red, 'center'); txt(tx, '✓ 不受影响', 140, MY + 120, fnt(900, 34), P.grn); }); }
      // 矿车：主线 → 岔道 → 分支尽头翻车
      const k1 = prog(b, t('br') + .1, t('br') + .6, E.in), k2 = prog(b, t('br') + .6, t('br') + .9, E.lin), k3 = prog(b, t('br') + .9, t('br') + 1.6, E.lin), crash = prog(b, t('br') + 1.6, t('br') + 2.2, E.out);
      let x = lerp(80, SW, k1), y = MY, r = 0;
      if (k2 > 0) { x = lerp(SW, SW + 240, k2); y = lerp(MY, BY, k2); r = -.86; }
      if (k3 > 0) { x = lerp(SW + 240, BX + 40, k3); y = BY; r = 0; }
      if (crash > 0) { x = BX + 40 + crash * 160; y = BY + crash * crash * 340; r = crash * 2.4; }
      if (b < t('br2') + .5) {
        alpha(cx, 1 - prog(b, t('br2') + .1, t('br2') + .5), () => cart(cx, x, y - 6, r));
        if (crash > 0 && crash < 1) for (let j = 0; j < 14; j++) { const a = hash(j) * 6.283, d = crash * (80 + hash(j + 9) * 140); pxr(cx, BX + 60 + Math.cos(a) * d, BY - 40 + Math.sin(a) * d, 18, 18, j % 3 ? P.org : P.yel); }
      }
      if (crash <= 0) st = { ...st, alpha: kE, x: x + Math.sin(r) * 62, y: y - 6 - Math.cos(r) * 62, px: 6, pose: 'up', rot: r }; // 脚踩在车斗口上，跟着车身一起转
      else { const kl = prog(b, t('br') + 1.8, t('br') + 2.7, E.io), xx = lerp(BX + 120, 1300, kl); st = { ...st, alpha: kE, x: xx, y: lerp(BY - 80, MY - 30, kl) - Math.sin(Math.PI * kl) * 160, px: 9, pose: kl >= 1 ? 'idle' : 'both', eyeShape: kl < 1 ? 'x' : b >= t('br2') + .9 ? 'happy' : null, rot: 0 }; }
    });
    // ---------- E. 测试灯 ----------
    const kT = sec(b, 'test', 'g0');
    both(cx, tx, kT, () => {
      win(cx, 780, 230, 680, 560, P.blk, P.lgy); pxr(cx, 792, 242, 656, 50, P.dgy);
      txt(tx, 'UserServiceTest.java', 810, 268, fnt(700, 24, F.mono), P.wht);
      const kc = prog(b, t('test') + .3, t('test') + 1.3, E.lin), cheat = prog(b, t('trick') + .4, t('trick') + .7);
      TCODE.forEach((s, i) => {
        if (i / TCODE.length >= kc) return;
        const y = 340 + i * 48, faked = i === 7 && cheat > 0;
        if (faked) pxr(cx, 800, y - 22, 640, 44, rgba(P.org, .5));
        txt(tx, faked ? '//' + s : s, 810, y, fnt(500, 23, F.mono), s.startsWith('@') ? P.blu : s === '}' ? P.lgy : faked ? P.org : P.wht);
      });
      win(cx, 1500, 230, 320, 560, P.navy);
      for (let i = 0; i < 8; i++) pxr(cx, 1512 + i * 37, 242, 37, 28, i % 2 ? P.wht : P.blk);
      txt(tx, '终点：全部通过', 1660, 320, fnt(900, 30), P.wht, 'center');
      TNAME.forEach((n, i) => {
        const y = 420 + i * 120, g = i < 2 ? b >= LAMP[i] : cheat >= 1, fl = i === 2 && g && Math.floor(tt * 6) % 3 === 0;
        circ(cx, 1580, y, 30, P.blk); circ(cx, 1580, y, 24, g && !fl ? P.grn : g ? P.yel : P.red);
        txt(tx, n, 1625, y, fnt(600, 22, F.mono), P.wht);
        if (i === 2 && g) txt(tx, '假通过', 1660, y + 44, fnt(900, 28), P.org, 'center');
      });
      // 改 → 跑 → 看结果 的循环
      const kl = prog(b, t('test2'), t('test2') + .3);
      if (kl > 0) alpha(cx, kl, () => alpha(tx, kl, () => {
        const X = 420, Y = 620, Rr = 120;
        for (let j = 0; j < 18; j++) { const a = j / 18 * 6.283 + tt * 1.5; pxr(cx, X + Math.cos(a) * Rr - 6, Y + Math.sin(a) * Rr - 6, 12, 12, j % 6 === 0 ? P.yel : P.lgy); }
        [['改', -90], ['跑', 30], ['看结果', 150]].forEach(([s, d]) => { const a = d * Math.PI / 180; txt(tx, s, X + Math.cos(a) * (Rr + 60), Y + Math.sin(a) * (Rr + 40), fnt(900, 34), P.wht, 'center'); });
      }));
      if (cheat >= 1) alpha(tx, prog(b, t('trick') + .9, t('trick') + 1.2), () => txt(tx, '→ 第 8 章', 1820, 860, fnt(900, 34), P.org, 'right'));
      st = b < t('trick') ? { ...st, alpha: kT, x: 420, y: 668, px: 9, pose: 'type', ph: tt * 18 } : { ...st, alpha: kT, x: lerp(420, 640, prog(b, t('trick'), t('trick') + .4, E.io)), y: 880, px: 11, pose: 'pointL', eye: 1, walk: b < t('trick') + .4 ? step * 20 : -1 };
    });
    // ---------- F. 同一堵墙撞三次，暂停 ----------
    const kF = sec(b, 'g0', 'learn0');
    both(cx, tx, kF, () => {
      const WX = 1240;
      bricks(cx, WX, 380, 216, 500);
      win(cx, 1150, 210, 520, 130, P.wht, P.dgy); txt(tx, '同一个问题', 1410, 252, fnt(700, 26), P.dgy, 'center'); txt(tx, 'NPE：User.password 为空', 1410, 300, fnt(900, 30), P.red, 'center');
      ['第 1 次', '第 2 次', '第 3 次'].forEach((s, i) => {
        const x = 220 + i * 220, hit = b >= DIE[i];
        pxr(cx, x, 210, 190, 110, P.blk); pxr(cx, x + 6, 216, 178, 98, hit ? P.red : P.navy);
        txt(tx, s, x + 95, 246, fnt(800, 28), P.wht, 'center'); if (hit) txt(tx, '✗', x + 95, 292, fnt(900, 40), P.wht, 'center');
      });
      // 冲上去、撞、弹回来
      let x = 640, sq = 1;
      DIE.forEach(d => { const a = prog(b, d - .3, d, E.in), r = prog(b, d, d + .3, E.out); if (b >= d - .3 && b < d + .3) { x = b < d ? lerp(640, WX - 70, a) : lerp(WX - 70, 640, r); sq = b >= d && b < d + .06 ? .7 : 1; } });
      DIE.forEach(d => { const k = prog(b, d, d + .3); if (k > 0 && k < 1) for (let j = 0; j < 5; j++) { const a = -1.6 + j * .5; pxr(cx, WX - 30 + Math.cos(a) * 80 * k, 760 + Math.sin(a) * 80 * k, 12, 12, P.yel); } });
      st = { ...st, alpha: kF, x, y: 880, px: 13, squash: sq, walk: b >= t('g0') && b < DIE[2] + .3 ? step * 24 : -1, eyeShape: b >= DIE[2] ? 'x' : null, sweat: b >= DIE[1] ? b : 0 };
      // 暂停
      const kp = prog(b, t('go'), t('go') + .15);
      if (kp > 0) {
        alpha(cx, .7 * kp, () => pxr(cx, 0, 0, 1920, 1080, P.blk));
        const km = prog(b, t('cont'), t('cont') + .3, E.out);
        alpha(tx, kp, () => { pxr(tx, 900, lerp(470, 200, km) - 40, 30, 80, P.wht); pxr(tx, 950, lerp(470, 200, km) - 40, 30, 80, P.wht); txt(tx, 'PAUSE', 1010, lerp(470, 200, km), fnt(400, 56, F.pixel), P.wht); });
        if (km > 0) alpha(cx, km, () => alpha(tx, km, () => {
          win(cx, 480, 290, 960, 440, P.navy);
          const sel = b < t('c0') ? -1 : b < t('c1') ? 0 : b < t('c2') ? 1 : 2;
          MENU.forEach(([ic, s], i) => {
            const y = 390 + i * 120, on = i === sel;
            if (on) pxr(cx, 504, y - 50, 912, 100, '#2c3d6e');
            pic(cx, ic, 640, y, 6); txt(tx, s, 720, y, fnt(900, 44), on ? P.yel : P.wht);
            if (on) txt(tx, '▶', 545, y, fnt(900, 40), P.yel, 'center');
          });
        }));
      }
    });
    // ---------- G. 教程关、== 的坑、听老师的 ----------
    const kG = sec(b, 'learn0');
    both(cx, tx, kG, () => {
      const GY = 820;
      for (let x = 0; x < 1920; x += 48) { pxr(cx, x, GY, 48, 18, P.dg); pxr(cx, x, GY + 18, 48, 260, '#2a1a12'); pxr(cx, x + 6, GY + 42, 12, 12, P.brn); }
      const kt = prog(b, t('teacher'), t('teacher') + .4, E.io);
      // 教程关路牌
      alpha(cx, 1 - kt, () => alpha(tx, 1 - kt, () => { pxr(cx, 284, 560, 12, 260, P.brn); pxr(cx, 160, 500, 260, 130, P.brn); pxr(cx, 170, 510, 240, 110, P.org); txt(tx, '教程关', 290, 545, fnt(900, 40), P.navy, 'center'); txt(tx, '基础语法', 290, 592, fnt(900, 32), P.navy, 'center'); }));
      const ps = prog(b, t('learn0') + .2, t('learn0') + .6, E.out);
      person(cx, lerp(380, 560, ps), GY, 9, P.blu);
      // 代码卡：先看着没问题，再标出 ==
      const kc = prog(b, t('learn1') + .5, t('learn1') + .8, E.out) * (1 - kt);
      if (kc > 0) alpha(cx, kc, () => alpha(tx, kc, () => {
        win(cx, 760, 230, 1000, 400, P.blk, P.lgy);
        const L1 = 'if (user.getPassword() == input) {';
        txt(tx, L1, 810, 320, fnt(500, 34, F.mono), P.wht); txt(tx, '    return true;', 810, 380, fnt(500, 34, F.mono), P.wht); txt(tx, '}', 810, 440, fnt(500, 34, F.mono), P.wht);
        const ke = prog(b, t('eq') + .4, t('eq') + .6);
        if (ke > 0) { const x0 = 810 + tw(tx, 'if (user.getPassword() ', fnt(500, 34, F.mono)); cx.strokeStyle = P.red; cx.lineWidth = 6; if (Math.floor(tt * 4) % 2 || b > t('eq') + 1.2) cx.strokeRect(x0 - 8, 290, tw(tx, '==', fnt(500, 34, F.mono)) + 16, 56); }
        const kq = prog(b, t('eq') + 1.2, t('eq') + 1.5);
        if (kq > 0) alpha(tx, kq, () => { txt(tx, 'user.getPassword().equals(input)', 810, 530, fnt(700, 34, F.mono), P.grn); txt(tx, '比较字符串用 equals()', 1720, 590, fnt(900, 30), P.yel, 'right'); });
      }));
      // 学生头上的气泡
      const kb = prog(b, t('learn1') + 1, t('learn1') + 1.2) * (1 - prog(b, t('eq') + .4, t('eq') + .6));
      if (kb > 0) alpha(cx, kb, () => alpha(tx, kb, () => { pxr(cx, 420, 520, 300, 80, P.wht); pxr(cx, 540, 600, 24, 24, P.wht); txt(tx, '看着没问题？', 570, 560, fnt(900, 32), P.navy, 'center'); }));
      // 老师和作业要求
      if (kt > 0) alpha(cx, kt, () => alpha(tx, kt, () => {
        win(cx, 780, 260, 640, 460, P.dg, P.brn);
        txt(tx, '作业要求', 1100, 340, fnt(900, 44), P.wht, 'center');
        txt(tx, '完成用户登录功能', 840, 440, fnt(700, 34), P.wht);
        pxr(cx, 830, 500, 560, 80, rgba(P.yel, .35)); txt(tx, 'AI 使用：按老师的要求', 840, 540, fnt(900, 34), P.yel);
        person(cx, 1560, GY, 10, P.dg, P.dgy, true); txt(tx, '老师', 1560, 630, fnt(900, 32), P.wht, 'center');
      }));
      const kw = prog(b, t('learn1'), t('learn1') + .6, E.io);
      st = { ...st, alpha: kG, x: lerp(820, 1780, kw), y: GY, px: 12, walk: kw > 0 && kw < 1 ? step * 20 : -1, pose: b >= t('learn1') + .6 && b < t('teacher') ? 'idle' : b >= t('teacher') ? 'point' : 'idle', eye: b >= t('learn1') + .6 ? -1 : 0 };
      if (b >= t('teacher')) st.x = lerp(1780, 1760, kt);
    });
    clawd(cx, st);
    narrate(tx, L, S, { sub: { y: 990, shadow: 'rgba(0,0,0,1)', fam: F.sans }, gloss: { bg: 'rgba(29,43,83,.95)', ink: P.wht, acc: P.yel, border: P.blu } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD, CH = H.CH;
    Sm.add('kick', 0, 0, 0, 0, 1, 'chip');
    // 冻结（go）那一刻鼓和贝斯停，暂停期间只留铺底，learn0 之后的小节线回来。按音符的实际时间判断，不按整小节：
    // 以前从 go 所在小节的开头就停、铺底等到 cont 之后的小节线才进，中间两小节多一点什么都没有
    const go = t('go'), g1 = Math.ceil(t('learn0')), on = (b, bt) => { const at = b + bt / 4; return at < go || at >= g1; };
    H.each(0, B, b => {
      const c = CH[PD[b % 4]], soft = b >= g1 ? .55 : .8;
      [0, 2, 2.5].forEach(bt => on(b, bt) && Sm.add('kick', b, bt, 0, 0, .9 * soft, 'chip'));
      [1, 3].forEach(bt => on(b, bt) && Sm.add('snare', b, bt, 0, 0, .9 * soft, 'chip'));
      for (let j = 0; j < 8; j++) on(b, j / 2) && Sm.add('hat', b, j / 2, 0, 0, .45 * soft, 'chip');
      [0, .5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((bt, j) => on(b, bt) && Sm.add('bass', b, bt, c.r + 12 + (j % 2 ? 12 : 0), .45, .7 * soft, 'chip'));
      for (let j = 0; j < 16; j++) on(b, j / 4) && Sm.add('chiparp', b, j / 4, c.arp[j % 3] + 12, .22, .55 * soft);
    });
    // 暂停那几小节：只留一层低低的铺底，冻结那一刻就接上（先补上冻结所在小节剩下的部分）
    const gb = Math.floor(go); Sm.add('pad', gb, (go - gb) * 4, CH[PD[gb % 4]].pad, (gb + 1 - go) * 4, .4, 'warm');
    H.pads(Sm, gb + 1, g1, PD, 'warm', .4, gb + 1);
    H.hook(Sm, Math.ceil(t('map0')), 'chip', 0, 0, 8, .8);
    H.hook(Sm, g1, 'chip', 0, 0, 4, .45);
  },
}, S);
};
})();
