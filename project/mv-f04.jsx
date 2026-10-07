// 第四章 · 21:45「怎么又错了」：上下文
// f04a 现实：Clawd 跑测试，用的是 gradle，报错「command not found」；它不知道项目用 Maven
// f04b 纸：窗口里的东西像一摞纸，翻遍了没写 Maven；规则文件垫底，写什么；ETH 的实验；自己写、写短（剪掉下半截）；规则 3；
//      输入框 @ 点名文件；失败纸条塞满窗口，新开对话只带规则和结论；新库超出训练截止，贴文档、接 MCP
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f04a = K => window.MV_REAL(K, {
  scene: '04 · 21:45 怎么又错了',
  desc: 'Clawd 用 gradle 跑测试，报错找不到命令；它不知道这个项目用 Maven 构建，也不知道测试怎么跑。',
  clock: [21, 45], stamp: ['周五', '21:45'],
  steps: [
    { pause: .75 },
    { id: 'run', me: '代码写好了。我来跑一下测试。' },
    { id: 'err', pause: 2 },
    { id: 'why', you: '怎么又报错了？提示词我都写清楚了啊。' },
    { id: 'a1', me: '提示词是清楚了。可我不知道这个项目用 Maven 构建，猜成了 Gradle。' },
    { id: 'a2', me: '测试要怎么跑，我也不知道。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'desk', 0], [S.t('err') - .2, 'screen', 0], [S.t('why'), 'over', 1.5], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  codeOverlay: (x, w, h, L, S) => {
    const k = K.prog(L.b, S.t('err'), S.t('err') + .3); if (k <= 0) return;
    x.globalAlpha = k; x.fillStyle = '#0c0d10'; x.fillRect(0, h - 250, w, 250); x.fillStyle = '#2a2c33'; x.fillRect(0, h - 250, w, 2);
    x.font = '500 17px "JetBrains Mono",monospace';
    [['$ gradle test', '#d6d9e0'], ['bash: gradle: command not found', '#ff6b6b'], ['', ''], ['✗ 测试没有运行', '#ff6b6b']].forEach(([s, c], i) => { if (L.b < S.t('err') + .3 + i * .3) return; x.fillStyle = c; x.fillText(s, 20, h - 210 + i * 30); });
    x.globalAlpha = 1;
  },
  figure: (L, S) => ({ type: L.b >= S.t('why') && L.b < S.t('why') + .7 ? 1 : 0, lean: K.prog(L.b, S.t('a1'), S.t('a1') + .4) * .3 }),
  sfx: S => [[S.t('err') + .6, 'buzz'], [S.t('err') + 1.2, 'hurt'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .7);
    S.add('pad', 0, 0, H.CH.F.pad, 8, .3, 'warm');
    S.add('pad', Math.floor(M.t('err')), 0, H.CH.Dm.pad, 12, .35, 'dark');
    S.add('piano', M.t('err') + .6, 0, [50, 53], 2, .4);
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .5);
  },
});

R.f04b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, seq, narrate, scene } = K;
const NAVY = '#2b2d42', CREAM = '#f7f0e1', MUST = '#e8b04a', SAGE = '#9cb59a', TEAL = '#4f8f8b', CORAL = '#e07a5f', RED = '#c8553d', KRAFT = '#c9a77c', BLUEG = '#5c7aa8', WHITE = '#fbf6ea';
// 一摞纸：从下往上。0 号规则文件后来才垫进去
const STACK = [['规则文件', MUST, '构建 mvn package · 测试 mvn test'], ['之前的对话', SAGE, '「帮我写个登录功能」……'], ['读过的文件', TEAL, 'UserService.java · User.java'], ['工具输出', BLUEG, '$ gradle test → not found'], ['提示词', CORAL, '「在 UserService 里加 login……」']];
const RULES = [['## 构建', 'mvn package'], ['## 测试', 'mvn test'], ['## 规范', '驼峰命名，Service 层写业务'], ['## 别动', 'src/legacy/ 目录']];
const FILES = ['UserService.java', 'UserController.java', 'UserRepository.java', 'User.java'];
const REPO = ['UserService', 'User', 'PasswordUtil', 'pom.xml', 'LoginController', 'README', 'BookService', 'application.yml'];
const FAILS = ['NullPointerException', '测试没过', '又改坏了', 'mvn 报错', '换个写法也不行', '回到原点', '越改越乱'];
const WX = 780, WY = 150, WW = 960, WH = 760, SH = 104, SX = 820, SW = 880;
const jit = (t, s, k = 1) => (hash(Math.floor(t * 12) + s * 7.7) - .5) * k;
const sy = j => WY + WH - 30 - SH - j * 118;
function sheet(ctx, x, y, w, h, col, rot, fn) { rotAt(ctx, x + w / 2, y + h / 2, rot, () => { rr(ctx, x - 6, y - 6, w + 12, h + 12, 6, CREAM); rr(ctx, x, y, w, h, 4, col); if (fn) fn(); }); }
// 上下文窗口：纸做的框，标题栏右边是「占用」条
function win(ctx, x, title, fill, tt, s) {
  sheet(ctx, x, WY, WW, WH, WHITE, -.006 + jit(tt, s, .004), () => {
    rr(ctx, x, WY, WW, 60, 4, NAVY); txt(ctx, title, x + 30, WY + 31, fnt(900, 30), CREAM);
    txt(ctx, '占用', x + WW - 300, WY + 31, fnt(700, 22), rgba(CREAM, .75), 'right');
    rr(ctx, x + WW - 284, WY + 20, 250, 22, 11, rgba(CREAM, .2)); rr(ctx, x + WW - 284, WY + 20, 250 * fill, 22, 11, fill > .85 ? RED : MUST);
  });
}
function stackSheet(ctx, i, x, y, tt, rot = 0) {
  const [n, col, d] = STACK[i], ink = i === 0 ? NAVY : CREAM;
  sheet(ctx, x, y, SW, SH, col, rot + (hash(i * 5) - .5) * .03 + jit(tt, i, .008), () => {
    txt(ctx, n, x + 30, y + SH / 2, fnt(900, 38), ink);
    txt(ctx, d, x + 250, y + SH / 2, fnt(600, 26, F.mono), rgba(ink, .85));
    if (i === 0) { circ(ctx, x + SW - 24, y + 20, 10, RED); }
  });
}
const S = seq([
  { id: 'mvn', say: 'Maven 和 Gradle，是 Java 项目最常用的两种构建工具。', gloss: ['Maven / Gradle', '', 'Java 项目的构建工具：负责下载依赖、编译、打包、跑测试。'], until: 'stack' },
  { id: 'q', say: '我不知道你用哪个，就只能猜。为什么不知道？', hold: .25 },
  { id: 'stack', say: '还记得那个窗口吗？我每次回答，能看到的只有窗口里的东西。', gloss: ['上下文', 'context', '这一轮里 AI 能看到的全部内容。窗口外面的，它就不知道。'], until: 'rule0' },
  { id: 's1', say: '它们像一摞纸：之前的对话、我读过的文件、工具的输出……', hold: .5 },
  { id: 's2', say: '你写的提示词，只是最上面那一张。', hold: .5 },
  { id: 'look', say: '我从上翻到下：没有一张写着，这个项目用 Maven。', hold: .75 },
  { id: 'rule0', say: '所以要有一张纸，垫在最底下、每次都在：规则文件。', hold: .25 },
  { id: 'rf', say: 'AGENTS.md、CLAUDE.md、Qoder 的项目规则，都属于这一类。', gloss: ['规则文件', 'AGENTS.md / CLAUDE.md', '写给 AI 的项目说明。每次对话，工具都会自动把它带上。'], until: 'eth0' },
  { id: 'rf2', say: '它像一份项目说明书。适合写这几样：' },
  { id: 'r0', say: '怎么构建，', dur: 1.25 },
  { id: 'r1', say: '怎么跑测试，', dur: 1.25 },
  { id: 'r2', say: '代码规范，', dur: 1.25 },
  { id: 'r3', say: '还有哪些目录不能动。', hold: .75 },
  { id: 'eth0', say: '那规则文件该怎么写？有人专门做过实验。' },
  { id: 'eth', say: 'ETH Zurich 有一篇发表在 ICLR 2026 的研究，比较了两种规则文件。', src: 'Gloaguen et al., ETH Zurich / ICLR 2026', srcUntil: 'short' },
  { id: 'ai', say: '让 AI 自动生成的：8 组实验里有 5 组，成功率反而下降，成本还涨了 20% 以上。', gloss: ['成功率', '', '实验里，AI 独立把编程任务做完、并通过测试的比例。'], until: 'short', hold: .5 },
  { id: 'hand', say: '开发者自己手写的：成功率平均提高约 4%。', hold: .75 },
  { id: 'short', say: '所以：规则文件要你自己写，而且写短。' },
  { id: 'only', say: '只写我从代码里看不出来的东西。代码里一眼就能看出来的，不用写。', hold: .5 },
  { id: 'rule', rule: [3, '规则文件自己写，写短'], dur: 3.5 },
  { id: 'at0', say: '另一个省力的办法：在输入框里打 @，直接点名相关的文件。' },
  { id: 'at1', say: '比让我在整个仓库里自己翻，更准，也更省地方。', hold: .5 },
  { id: 'fail0', you: '再试一次……再试一次……', hold: .25 },
  { id: 'fail', say: '同一个对话里来回失败，窗口里就堆满了错误的尝试。' },
  { id: 'fail2', say: '我会被这些错误带歪：越改越乱。', hold: 1 },
  { id: 'new', say: '这时候别硬撑。新开一个对话——' },
  { id: 'new2', say: '规则文件还在，再把有用的结论带过去，就够了。', hold: .75 },
  { id: 'doc0', say: '最后一种情况：用到比较新的库。' },
  { id: 'doc1', say: '还记得训练截止吗？截止以后出的新版本，我没见过。' },
  { id: 'doc2', say: '那就把官方文档里相关的那一段，贴给我。' },
  { id: 'mcp', say: '或者，给我接上能查文档的工具。', gloss: ['MCP', 'Model Context Protocol', '让 AI 连接外部工具和数据的一种标准接口。'], hold: 1.25 },
], { start: 2.8, tail: .5 });
const t = S.t;
const STK_AT = [t('rule0') + .2, t('s1') + .3, t('s1') + 1.2, t('s1') + 2.1, t('s2') + .2];
const FAIL_AT = FAILS.map((_, i) => t('fail') + .2 + i * .4);
const SCAN = [t('look') + .1, t('look') + 1.9];
const AT_TYPE = t('at0') + .4, AT_PICK = t('at0') + 1.9;
return scene({
  scene: '04 纸 · 上下文', look: LOOK.PAPER,
  desc: '窗口里的一摞纸，翻遍了也没写 Maven；规则文件垫在底下，写什么；ETH 的实验：手写、写短；规则 3；输入 @ 点名文件；失败堆满了窗口就新开对话；新库超出训练截止，贴文档、接 MCP。',
  enter: { kind: TR.TEAR, a: 0, b: 3 },
  hud: { num: '04', name: '上下文', time: '21:45', line: '怎么又错了', ink: NAVY, acc: CORAL, mv: [2.1, 2.6] },
  par: L => [1, .32 + .1 * prog(L.b, t('fail'), t('fail2')) * (1 - prog(L.b, t('new'), t('new') + .5)), 0, 0],
  cam: L => [1.01 + .01 * Math.sin(L.t * .5), jit(L.t, 3, .004), 0, 0],
  pulse: L => .3,
  sfx: [[t('mvn'), 'paper'], [t('mvn') + .3, 'paper'], [t('q') + .6, 'stamp'], [t('stack') + .1, 'paper'], ...STK_AT.map(a => [a, 'paper']), ...[0, 1, 2, 3].map(i => [lerp(SCAN[0], SCAN[1], i / 3), 'tock']), [SCAN[1] + .1, 'stamp'],
    [t('rule0') + .2, 'swish'], [t('rule0') + .5, 'bonk'], ...RULES.map((_, i) => [t('r' + i), 'key']), [t('eth'), 'paper'], [t('ai') + .3, 'bonk'], [t('hand') + .3, 'chime', 1568],
    [t('only') + .1, 'snip'], [t('only') + .35, 'paper'], ...[0, 1, 2, 3, 4].map(i => [AT_TYPE + i * .14, 'key']), [AT_TYPE + .2, 'pop'], [AT_PICK, 'enter'], [t('at1') + .2, 'swish'],
    [t('fail0'), 'paper'], ...FAIL_AT.map(a => [a, 'bonk']), [t('fail2') + .2, 'alarm'], [t('new'), 'whoosh'], [t('new2') + .3, 'chime', 1319],
    [t('doc0') + .3, 'pop'], [t('doc1') + .4, 'q'], [t('doc2'), 'paper'], [t('doc2') + .8, 'swish'], [t('mcp') + .3, 'click']],
  text: STACK.flat().join('') + RULES.flat().join('') + FILES.join('') + REPO.join('') + FAILS.join('') + 'pom.xml build.gradle窗口外面▲我猜的✗ command not found上下文窗口新对话占用找不到：用 Maven每次都在AGENTS.md / CLAUDE.md8 组里 5 组成功率下降成本 +20% 以上+4%成功率平均AI 自动生成开发者手写300 行项目介绍目录结构代码里看得出✂@UserS 加一个 login 方法我自己翻@ 点名占用窗口✗ 失败：结论① 跑测试用 mvn test② NPE：User.password 为空训练截止我见过的新版本 v5没见过官方文档 · v5 迁移指南MCP查文档的工具相关的那一段',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    // ---------- 开场：猜构建工具 ----------
    const k0 = prog(b, t('mvn'), t('mvn') + .3) * (1 - prog(b, t('stack') - .3, t('stack')));
    if (k0 > 0) alpha(cx, k0, () => {
      const ka = prog(b, t('mvn'), t('mvn') + .3, E.back), kb = prog(b, t('mvn') + .3, t('mvn') + .6, E.back);
      scaleAt(cx, 1010, 400, ka, () => { txt(cx, 'Maven', 1010, 300, fnt(900, 48), CORAL, 'center'); sheet(cx, 810, 340, 400, 130, CREAM, -.05 + jit(tt, 1, .02), () => txt(cx, 'pom.xml', 1010, 405, fnt(700, 48, F.mono), NAVY, 'center')); });
      scaleAt(cx, 1520, 560, kb, () => { txt(cx, 'Gradle', 1520, 460, fnt(900, 48), BLUEG, 'center'); sheet(cx, 1300, 500, 440, 130, CREAM, .04 + jit(tt, 2, .02), () => txt(cx, 'build.gradle', 1520, 565, fnt(700, 46, F.mono), NAVY, 'center')); });
      const kq = prog(b, t('q'), t('q') + .3); if (kq > 0) alpha(cx, kq, () => txt(cx, '?', 1270, 330, fnt(900, 140, F.poster), RED, 'center'));
      const kg = prog(b, t('q') + .6, t('q') + .8, E.back);
      if (kg > .01) scaleAt(cx, 1520, 700, lerp(1.6, 1, Math.min(1, kg)), () => rotAt(cx, 1520, 700, -.06, () => { rr(cx, 1340, 660, 360, 80, 8, null, RED, 5); txt(cx, '我猜的 ✗', 1520, 700, fnt(900, 40), RED, 'center'); txt(cx, 'command not found', 1520, 775, fnt(700, 26, F.mono), RED, 'center'); }));
    });
    // ---------- 窗口里的一摞纸 ----------
    const ks = prog(b, t('stack'), t('stack') + .4, E.out) * (1 - prog(b, t('rf2') - .3, t('rf2'), E.in));
    if (ks > 0) alpha(cx, Math.min(1, ks * 1.5), () => {
      const x0 = lerp(1960, WX, ks), dx = x0 - WX, kr = prog(b, t('rule0') + .2, t('rule0') + .7, E.io);
      win(cx, x0, '上下文窗口', .38 + .08 * kr, tt, 30);
      for (let i = 4; i >= 0; i--) {
        const k = prog(b, STK_AT[i], STK_AT[i] + .35, E.out); if (k <= 0) continue;
        if (i === 0) { stackSheet(cx, 0, SX + dx - 1100 * (1 - kr), sy(0), tt); continue; }
        const y = lerp(-160, sy(i - 1 + kr), k);
        stackSheet(cx, i, SX + dx, y, tt);
      }
      // 从上往下翻：扫描条 + 每张打 ✗
      if (b >= SCAN[0] && b < t('rule0') + .4) {
        const ksc = prog(b, SCAN[0], SCAN[1], E.lin), yy = lerp(sy(3) - 10, sy(0) + SH + 10, ksc);
        if (ksc < 1) { rr(cx, SX - 20 + dx, yy - 5, SW + 40, 10, 5, rgba(RED, .7)); }
        [4, 3, 2, 1].forEach((i, n) => { if (ksc > (n + .6) / 4) txt(cx, '✗', SX + SW - 40 + dx, sy(i - 1) + SH / 2, fnt(900, 54), RED, 'center'); });
        const kst = prog(b, SCAN[1] + .1, SCAN[1] + .3, E.back) * (1 - prog(b, t('rule0'), t('rule0') + .4));
        if (kst > 0) alpha(cx, Math.min(1, kst), () => scaleAt(cx, 1260, 520, lerp(1.8, 1, Math.min(1, kst)), () => rotAt(cx, 1260, 520, -.08, () => { rr(cx, 900, 465, 720, 110, 10, 'rgba(251,246,234,.92)', RED, 6); txt(cx, '找不到：用 Maven', 1260, 520, fnt(900, 56), RED, 'center'); })));
      }
      // 窗口外面：pom.xml 明明在仓库里，可不在窗口里
      const ko = prog(b, t('stack') + 1.5, t('stack') + 1.9, E.out) * (1 - prog(b, t('rule0'), t('rule0') + .4));
      if (ko > 0) alpha(cx, ko * (1 - .4 * prog(b, t('look'), t('look') + .3)), () => { txt(cx, '窗口外面', 520, 400, fnt(900, 30), rgba(NAVY, .6), 'center'); sheet(cx, 380, 430, 280, 100, KRAFT, -.06 + jit(tt, 33, .01), () => txt(cx, 'pom.xml', 520, 480, fnt(700, 40, F.mono), NAVY, 'center')); });
      const ke = prog(b, t('rule0') + .6, t('rule0') + .9);
      if (ke > 0) alpha(cx, ke, () => { txt(cx, '每次都在 →', SX - 30 + dx, sy(0) + SH / 2, fnt(900, 30), RED, 'right'); });
    });
    // ---------- 规则文件：项目说明书 ----------
    const kr = prog(b, t('rf2'), t('rf2') + .4, E.back) * (1 - prog(b, t('eth0') - .3, t('eth0'), E.in));
    if (kr > 0) {
      const x = 820, y = 230, w = 920, h = 600;
      alpha(cx, Math.min(1, kr), () => scaleAt(cx, x + w / 2, y + h / 2, .8 + .2 * kr, () => sheet(cx, x, y, w, h, MUST, -.02 + jit(tt, 9, .01), () => {
        txt(cx, 'AGENTS.md / CLAUDE.md', x + 44, y + 64, fnt(700, 40, F.mono), NAVY);
        seg(cx, x + 44, y + 110, x + w - 44, y + 110, rgba(NAVY, .4), 2);
        RULES.forEach(([a, v], i) => { const k = prog(b, t('r' + i), t('r' + i) + .3); if (k <= 0) return; alpha(cx, k, () => { txt(cx, a, x + 44, y + 180 + i * 104, fnt(700, 38, F.mono), RED); txt(cx, v, x + 280, y + 180 + i * 104, fnt(700, 40), NAVY); }); });
      })));
    }
    // ---------- ETH：两根纸条 ----------
    const ke = prog(b, t('eth'), t('eth') + .3) * (1 - prog(b, t('short') - .3, t('short')));
    if (ke > 0) alpha(cx, ke, () => {
      const base = 520;
      alpha(cx, prog(b, t('eth'), t('eth') + .3), () => { rr(cx, 840, 170, 880, 74, 10, 'rgba(255,255,255,.55)'); txt(cx, 'ETH Zurich · ICLR 2026', 1280, 207, fnt(700, 34, F.mono), NAVY, 'center'); });
      seg(cx, 820, base, 1740, base, NAVY, 5);
      const ka = prog(b, t('ai') + .2, t('ai') + .7, E.out), kh = prog(b, t('hand') + .2, t('hand') + .7, E.back);
      txt(cx, 'AI 自动生成', 1060, base - 44, fnt(900, 44), NAVY, 'center');
      if (ka > .01) sheet(cx, 870, base + 8, 380, 270 * ka, RED, .02 + jit(tt, 4, .01), () => { if (ka > .7) { txt(cx, '8 组里 5 组', 1060, base + 80, fnt(900, 46), CREAM, 'center'); txt(cx, '成功率下降', 1060, base + 140, fnt(700, 36), CREAM, 'center'); txt(cx, '成本 +20% 以上', 1060, base + 210, fnt(700, 32), CREAM, 'center'); } });
      txt(cx, '开发者手写', 1500, base + 52, fnt(900, 44), NAVY, 'center');
      if (kh > .01) sheet(cx, 1310, base - 8 - 260 * kh, 380, 260 * kh, TEAL, -.02 + jit(tt, 5, .01), () => { if (kh > .7) { txt(cx, '+4%', 1500, base - 170, fnt(900, 90), CREAM, 'center'); txt(cx, '成功率平均', 1500, base - 82, fnt(700, 34), CREAM, 'center'); } });
    });
    // ---------- 写短：一刀剪掉下半截 ----------
    const kn = prog(b, t('short'), t('short') + .3) * (1 - prog(b, t('at0') - .3, t('at0')));
    if (kn > 0) alpha(cx, kn, () => {
      const x = 900, y = 170, w = 760, cutY = 470, f = prog(b, t('only') + .35, t('only') + 1.2, E.in);
      // 下半截：自动生成的废话，剪下来往下掉
      alpha(cx, 1 - f, () => rotAt(cx, x + w / 2, cutY + 200 + f * 500, f * .5, () => {
        const yy = cutY + 14 + f * 500;
        rr(cx, x, yy, w, 380, 4, mixC(MUST, CREAM, .35));
        [['……300 行项目介绍', 50], ['……目录结构', 170], ['……用了哪些框架', 290]].forEach(([s, oy], i) => { txt(cx, s, x + 40, yy + oy, fnt(700, 32), rgba(NAVY, .7)); txt(cx, '代码里看得出', x + w - 40, yy + oy, fnt(700, 26), RED, 'right'); cx.fillStyle = rgba(NAVY, .2); [0, 1].forEach(r => cx.fillRect(x + 40, yy + oy + 34 + r * 26, 560 - r * 140, 10)); });
      }));
      sheet(cx, x, y, w, cutY - y, MUST, .0, () => {
        txt(cx, 'AGENTS.md', x + 40, y + 56, fnt(700, 38, F.mono), NAVY);
        ['构建：mvn package', '测试：mvn test', '别动：src/legacy/'].forEach((s, i) => txt(cx, s, x + 40, y + 130 + i * 62, fnt(700, 40), NAVY));
      });
      const kc = prog(b, t('only') + .05, t('only') + .35, E.io);
      if (kc > 0 && f < .2) { seg(cx, x - 30, cutY + 7, x + w + 30, cutY + 7, RED, 3, [14, 10]); txt(cx, '✂', lerp(x - 40, x + w + 10, kc), cutY + 2, fnt(900, 56), RED, 'center'); }
    });
    // ---------- @：输入框点名文件 ----------
    const ka2 = prog(b, t('at0'), t('at0') + .3) * (1 - prog(b, t('fail0') - .3, t('fail0')));
    if (ka2 > 0) alpha(cx, ka2, () => {
      const ix = 820, iy = 600, iw = 920, ih = 100, typed = '@UserS'.slice(0, Math.max(0, Math.min(6, Math.floor((b - AT_TYPE) / .14) + 1))), picked = b >= AT_PICK;
      const up = lerp(0, -330, prog(b, t('at1'), t('at1') + .4, E.io));
      cx.save(); cx.translate(0, up);
      sheet(cx, ix, iy, iw, ih, WHITE, 0, () => {
        if (!picked) { txt(cx, typed, ix + 36, iy + ih / 2, fnt(700, 40, F.mono), NAVY); cx.font = fnt(700, 40, F.mono); if ((tt % .8) < .5) cx.fillRect(ix + 40 + cx.measureText(typed).width, iy + 28, 4, 44); }
        else { cx.font = fnt(700, 34, F.mono); const w = cx.measureText('@UserService.java').width + 30; rr(cx, ix + 26, iy + 24, w, 52, 8, mixC(CORAL, CREAM, .6)); txt(cx, '@UserService.java', ix + 41, iy + 51, fnt(700, 34, F.mono), NAVY); txt(cx, '加一个 login 方法', ix + 50 + w, iy + 51, fnt(700, 38), NAVY); }
      });
      // 下拉候选
      const kd = prog(b, AT_TYPE + .2, AT_TYPE + .4, E.out) * (1 - prog(b, AT_PICK, AT_PICK + .2));
      if (kd > 0) alpha(cx, kd, () => { rr(cx, ix + 20, iy - 20 - 4 * 76 - 16, 620, 4 * 76 + 16, 10, WHITE, rgba(NAVY, .35), 2); FILES.forEach((f, i) => { const yy = iy - 20 - 4 * 76 + i * 76; if (i === 0) rr(cx, ix + 28, yy, 604, 68, 6, mixC(CORAL, CREAM, .55)); txt(cx, f, ix + 50, yy + 36, fnt(700, 32, F.mono), NAVY); }); });
      cx.restore();
      // 对比：自己翻 vs 点名
      const kb = prog(b, t('at1') + .3, t('at1') + .7, E.out);
      if (kb > 0) alpha(cx, kb, () => {
        txt(cx, '占用窗口', 820, 470, fnt(700, 28), rgba(NAVY, .6));
        [[0, '我自己翻', REPO.length, KRAFT], [1, '@ 点名', 1, CORAL]].forEach(([r, n, cnt, col]) => {
          const y = 530 + r * 150, kk = prog(b, t('at1') + .4 + r * .5, t('at1') + 1 + r * .5, E.out);
          txt(cx, n, 820, y + 45, fnt(900, 40), NAVY);
          for (let i = 0; i < cnt; i++) { if (kk * cnt <= i) break; sheet(cx, 1040 + i * 88, y, 76, 90, col, (hash(i + r * 9) - .5) * .12, () => { cx.fillStyle = rgba(NAVY, .35); [0, 1, 2].forEach(l => cx.fillRect(1052 + i * 88, y + 22 + l * 20, 50 - l * 10, 7)); }); }
        });
      });
    });
    // ---------- 失败纸条把窗口塞满 ----------
    const kw = prog(b, t('fail') - .4, t('fail'), E.out) * (1 - prog(b, t('new'), t('new') + .5, E.in));
    const kw2 = prog(b, t('new'), t('new') + .6, E.out) * (1 - prog(b, t('doc0') - .3, t('doc0')));
    if (kw > 0) alpha(cx, Math.min(1, kw * 1.5) * (1 - prog(b, t('new'), t('new') + .5)), () => {
      const dx = lerp(1960 - WX, 0, kw) - lerp(0, 1100, prog(b, t('new'), t('new') + .5, E.in)), nf = FAIL_AT.filter(a => b >= a).length;
      win(cx, WX + dx, '上下文窗口', .46 + .52 * nf / FAILS.length, tt, 31);
      stackSheet(cx, 0, SX + dx, sy(0), tt); stackSheet(cx, 1, SX + dx, sy(1), tt);
      const wob = prog(b, t('fail2'), t('fail2') + .3);
      FAIL_AT.forEach((at, i) => {
        const k = prog(b, at, at + .25, E.out); if (k <= 0) return;
        const y = lerp(-80, sy(1) - 62 - i * 62, k) + jit(tt, i + 40, 3 + 8 * wob), x = SX + 40 + dx + (hash(i * 3) - .5) * 80;
        sheet(cx, x, y, 760, 48, i % 2 ? '#e9dccb' : CREAM, (hash(i * 9) - .5) * .025 + wob * jit(tt, i, .03), () => txt(cx, '✗ 失败：' + FAILS[i], x + 26, y + 24, fnt(700, 30), RED));
      });
    });
    // 新开的窗口：规则文件还在，加一张结论
    if (kw2 > 0) alpha(cx, Math.min(1, kw2 * 2), () => {
      const dx = lerp(1960 - WX, 0, kw2);
      win(cx, WX + dx, '新对话', .2 + .06 * prog(b, t('new2') + .2, t('new2') + .6), tt, 32);
      stackSheet(cx, 0, SX + dx, sy(0), tt);
      const kc = prog(b, t('new2') + .2, t('new2') + .6, E.back);
      if (kc > 0) scaleAt(cx, SX + 440 + dx, sy(1) - 40, kc, () => sheet(cx, SX + dx, sy(1) - 140, SW, 200, CREAM, -.015, () => {
        rr(cx, SX + dx + 24, sy(1) - 120, 110, 48, 6, MUST); txt(cx, '结论', SX + dx + 79, sy(1) - 96, fnt(900, 30), NAVY, 'center');
        txt(cx, '① 跑测试用 mvn test', SX + dx + 160, sy(1) - 96, fnt(700, 36), NAVY);
        txt(cx, '② NPE：User.password 为空', SX + dx + 160, sy(1) - 30, fnt(700, 36), NAVY);
      }));
    });
    // ---------- 训练截止 + 官方文档 + MCP ----------
    const kd = prog(b, t('doc0'), t('doc0') + .3) * (1 - prog(b, S.bars - .5, S.bars));
    if (kd > 0) alpha(cx, kd, () => {
      const y = 300, cut = 1300, kup = prog(b, t('doc2'), t('doc2') + .5, E.io);
      cx.save(); cx.translate(0, -60 * kup);
      cx.fillStyle = rgba(SAGE, .45); cx.fillRect(800, y - 50, cut - 800, 100);
      txt(cx, '我见过的', 1050, y, fnt(900, 36), NAVY, 'center');
      seg(cx, 800, y + 50, 1740, y + 50, NAVY, 4);
      seg(cx, cut, y - 80, cut, y + 70, RED, 5); txt(cx, '训练截止', cut, y + 100, fnt(900, 32), RED, 'center');
      const kv = prog(b, t('doc0') + .3, t('doc0') + .6, E.back);
      if (kv > 0) scaleAt(cx, 1540, y, kv, () => { sheet(cx, 1420, y - 46, 240, 92, BLUEG, .05, () => txt(cx, '新版本 v5', 1540, y, fnt(900, 36), CREAM, 'center')); });
      const kq = prog(b, t('doc1') + .4, t('doc1') + .7, E.back) * (1 - kup);
      if (kq > 0) scaleAt(cx, 1540, y - 110, kq, () => txt(cx, '没见过', 1540, y - 100, fnt(900, 40), RED, 'center'));
      cx.restore();
      const kp = prog(b, t('doc2'), t('doc2') + .4, E.out);
      if (kp > 0) alpha(cx, kp, () => {
        const x = lerp(1200, 860, kp), yy = 440;
        sheet(cx, x, yy, 560, 420, CREAM, .02 + jit(tt, 8, .008), () => {
          txt(cx, '官方文档 · v5 迁移指南', x + 30, yy + 50, fnt(900, 32), NAVY);
          const hl = prog(b, t('doc2') + .6, t('doc2') + 1.1);
          cx.fillStyle = rgba(MUST, .7); cx.fillRect(x + 26, yy + 186, 500 * hl, 104);
          cx.fillStyle = rgba(NAVY, .55); for (let i = 0; i < 6; i++) cx.fillRect(x + 30, yy + 100 + i * 42, 470 - (i % 3) * 70, 12);
          if (hl > .8) txt(cx, '▲ 相关的那一段', x + 30, yy + 370, fnt(900, 32), RED);
        });
      });
      const km = prog(b, t('mcp') + .2, t('mcp') + .5, E.back);
      if (km > .01) {
        seg(cx, 1420, 650, 1520, 650, NAVY, 6);
        scaleAt(cx, 1620, 650, km, () => { sheet(cx, 1520, 560, 200, 180, BLUEG, -.04, () => { txt(cx, 'MCP', 1620, 630, fnt(900, 54), CREAM, 'center'); txt(cx, '查文档的工具', 1620, 690, fnt(700, 24), CREAM, 'center'); }); });
      }
    });
    // ---------- Clawd：纸偶 ----------
    const T12 = Math.floor(tt * 12) / 12;
    let st = { x: 520, y: 780, px: 16, skin: 'paper', col: CORAL, hi: '#ef9a7f', line: CREAM, pose: 'idle', ph: T12 * 10, blink: (tt % 3) < .1, eye: 1, rot: jit(tt, 0, .07) };
    if (b < t('stack')) { st.q = 1; st.qC = RED; }
    if (b >= t('stack') && b < t('rf2')) { st.x = 480; st.pose = 'point'; if (b >= t('look') && b < t('rule0')) { st.pose = 'idle'; st.sweat = b; st.eye = 0; } }
    if (b >= t('rf2') && b < t('eth0')) { st.pose = 'type'; st.ph = T12 * 20; st.x = 480; }
    if (b >= t('eth0') && b < t('short')) { st.x = 480; st.y = 820; st.px = 14; }
    if (b >= t('short') && b < t('at0')) { st.pose = 'up'; st.x = 520; }
    if (b >= t('at0') && b < t('fail0')) { st.pose = 'point'; st.x = 480; }
    if (b >= t('fail0') && b < t('new')) { st.x = 460; st.sweat = b; st.eye = 0; if (b >= t('fail2')) { st.eyeShape = 'x'; st.rot = Math.sin(tt * 6) * .2; } }
    if (b >= t('new') && b < t('doc0')) { st.x = 480; st.pose = b >= t('new2') + .3 ? 'up' : 'idle'; st.eyeShape = 'happy'; }
    if (b >= t('doc0')) { st.x = 520; st.y = 820; st.pose = 'point'; if (b >= t('doc1') && b < t('doc2')) { st.q = 1; st.qC = RED; st.pose = 'idle'; } }
    clawd(cx, st);
    narrate(tx, L, S, { sub: { col: NAVY, shadow: null, box: 'rgba(247,240,225,.9)', acc: [CORAL, RED], y: 985 }, gloss: { bg: 'rgba(250,244,230,.96)', ink: NAVY, acc: CORAL, border: rgba(NAVY, .3) } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD, CH = H.CH;
    H.pads(Sm, 0, B, PD, 'organ', .5);
    H.arps(Sm, 0, B, PD, 'kalimba', .5, [0, 1, 2, 3, 1, 2, 3, 2], .5);
    H.each(0, B, b => {
      Sm.add('kick', b, 0, 0, 0, .6, 'soft'); Sm.add('kick', b, 2.5, 0, 0, .4, 'soft'); Sm.add('snare', b, 2, 0, 0, .35, 'lofi');
      [.5, 1.5, 2.5, 3.5].forEach((bt, j) => Sm.add('wood', b, bt, j % 2 ? 1250 : 900, 0, .35));
      for (let j = 0; j < 16; j++) Sm.add('shaker', b, j / 4, 0, 0, j % 2 ? .28 : .16);
      const r = CH[PD[b % 4]].r + 12; Sm.add('bass', b, 0, r, 1.5, .6, 'upright'); Sm.add('bass', b, 2.5, r + 7, 1, .45, 'upright');
    });
    H.hook(Sm, Math.ceil(t('eth')), 'whistle', 0, 0, 8, .55);
    Sm.add('lp', t('fail'), 0, 1500, 2); Sm.add('lp', t('new'), 0, 14000, 1);
  },
}, S);
};
})();
