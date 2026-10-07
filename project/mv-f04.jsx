// 第四章 · 21:45「怎么又错了」：上下文
// f04a 现实：Clawd 跑测试，用的是 gradle，报错「command not found」；它不知道项目用 Maven
// f04b 纸：窗口里的东西像一摞纸，提示词只是最上面一张；规则文件垫底，写什么；ETH 的实验；自己写、写短；规则 3；
//      用 @ 点名文件；失败纸条把 Clawd 埋住，新开对话只带结论；新库贴文档，MCP
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
  shots: S => [[0, 'desk', 0], [S.t('err') - .2, 'screen', 1.4], [S.t('why'), 'over', 1.5], [S.t('push'), 'into', 1.5, 'in']],
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
const NAVY = '#2b2d42', CREAM = '#f7f0e1', MUST = '#e8b04a', SAGE = '#9cb59a', TEAL = '#4f8f8b', CORAL = '#e07a5f', RED = '#c8553d', KRAFT = '#c9a77c', BLUEG = '#5c7aa8';
const STACK = [['规则文件', MUST], ['之前的对话', SAGE], ['读过的文件', TEAL], ['工具输出', BLUEG], ['提示词', CORAL]];
const RULES = [['## 构建', 'mvn package'], ['## 测试', 'mvn test'], ['## 规范', '驼峰命名，Service 层写业务'], ['## 别动', 'src/legacy/ 目录']];
const FILES = ['UserService.java', 'User.java', 'PasswordUtil.java', 'pom.xml', 'LoginController.java', 'README.md', 'BookService.java', 'application.yml'];
const FAILS = ['NullPointerException', '测试没过', '又改坏了', 'mvn 报错', '换个写法也不行', '回到原点', '越改越乱'];
const jit = (t, s, k = 1) => (hash(Math.floor(t * 12) + s * 7.7) - .5) * k;
function sheet(ctx, x, y, w, h, col, rot, fn) { rotAt(ctx, x + w / 2, y + h / 2, rot, () => { rr(ctx, x - 6, y - 6, w + 12, h + 12, 6, CREAM); rr(ctx, x, y, w, h, 4, col); if (fn) fn(); }); }
const S = seq([
  { id: 'mvn', say: 'Maven 和 Gradle，是 Java 项目最常用的两种构建工具。', gloss: ['Maven / Gradle', '', 'Java 项目的构建工具：负责下载依赖、编译、打包、跑测试。'], until: 'stack' },
  { id: 'q', say: '我不知道你用哪个，就只能猜。为什么不知道？', hold: .25 },
  { id: 'stack', say: '还记得那个窗口吗？里面的内容，像一摞纸：' },
  { id: 's1', say: '之前的对话、我读过的文件、工具的输出……', hold: .5 },
  { id: 's2', say: '你写的提示词，只是最上面那一张。', hold: .5 },
  { id: 'rule0', say: '而垫在最底下、每次都在的，是规则文件。', hold: .25 },
  { id: 'rf', say: 'AGENTS.md、CLAUDE.md、Qoder 的项目规则，都属于这一类。', gloss: ['规则文件', 'AGENTS.md / CLAUDE.md', '写给 AI 的项目说明。每次对话，工具都会自动把它带上。'], until: 'eth0' },
  { id: 'rf2', say: '它像一份项目说明书。适合写这几样：' },
  { id: 'r0', say: '怎么构建，', dur: 1.25 },
  { id: 'r1', say: '怎么跑测试，', dur: 1.25 },
  { id: 'r2', say: '代码规范，', dur: 1.25 },
  { id: 'r3', say: '还有哪些目录不能动。', hold: .75 },
  { id: 'eth0', say: '那规则文件该怎么写？有人专门做过实验。' },
  { id: 'eth', say: 'ETH Zurich 有一篇发表在 ICLR 2026 的研究，比较了两种规则文件。', src: 'Gloaguen et al., ETH Zurich / ICLR 2026', srcUntil: 'short' },
  { id: 'ai', say: '让 AI 自动生成的：8 组实验里有 5 组，成功率反而下降，成本还涨了 20% 以上。', hold: .5 },
  { id: 'hand', say: '开发者自己手写的：成功率平均提高约 4%。', hold: .75 },
  { id: 'short', say: '所以：规则文件要你自己写，而且写短。' },
  { id: 'only', say: '只写我从代码里看不出来的东西。代码里一眼就能看出来的，不用写。', hold: .5 },
  { id: 'rule', rule: [3, '规则文件自己写，写短'], dur: 3.5 },
  { id: 'at0', say: '另一个省力的办法：用 @ 直接点名相关的文件。' },
  { id: 'at1', say: '比让我在整个仓库里自己翻，更准，也更省。', hold: .5 },
  { id: 'fail0', you: '再试一次……再试一次……', hold: .25 },
  { id: 'fail', say: '同一个对话里来回失败，窗口里就堆满了错误的尝试。' },
  { id: 'fail2', say: '我会被这些错误带歪：越改越乱。', hold: 1 },
  { id: 'new', say: '这时候别硬撑。新开一个对话——' },
  { id: 'new2', say: '只把有用的结论带过去。', hold: .75 },
  { id: 'doc0', say: '最后一种情况：用到比较新的库。' },
  { id: 'doc1', say: '还记得训练截止吗？新版本的用法，我可能没见过。' },
  { id: 'doc2', say: '那就把官方文档里相关的那一段，贴给我。' },
  { id: 'mcp', say: '或者，给我接上能查文档的工具。', gloss: ['MCP', 'Model Context Protocol', '让 AI 连接外部工具和数据的一种标准接口。'], hold: 1.25 },
], { start: 2.8, tail: .5 });
const t = S.t;
const STK_AT = STACK.map((_, i) => i === 0 ? t('rule0') + .3 : i < 4 ? t('s1') + .2 + (i - 1) * .5 : t('s2') + .2);
const FAIL_AT = FAILS.map((_, i) => t('fail') + .2 + i * .35);
return scene({
  scene: '04 纸 · 上下文', look: LOOK.PAPER,
  desc: '窗口里的一摞纸；规则文件垫在底下，写什么；ETH 的实验：手写、写短；规则 3；用 @ 点名文件；失败堆满了就新开对话；新库贴文档、MCP。',
  enter: { kind: TR.TEAR, a: 0, b: 3 },
  hud: { num: '04', name: '上下文', time: '21:45', line: '怎么又错了', ink: NAVY, acc: CORAL, mv: [2.1, 2.6] },
  par: L => [1, .32 + .1 * prog(L.b, t('fail'), t('fail2')) * (1 - prog(L.b, t('new'), t('new') + .5)), 0, 0],
  cam: L => [1.01 + .01 * Math.sin(L.t * .5), jit(L.t, 3, .004), 0, 0],
  pulse: L => .3,
  sfx: [[t('mvn'), 'paper'], ...STK_AT.map(a => [a, 'paper']), [t('rule0') + .3, 'bonk'], ...RULES.map((_, i) => [t('r' + i), 'key']), [t('eth'), 'paper'], [t('ai') + .3, 'bonk'], [t('hand') + .3, 'chime', 1568],
    [t('only') + .3, 'snip'], [t('only') + .7, 'snip'], [t('at0') + .3, 'stamp'], ...FAIL_AT.map(a => [a, 'bonk']), [t('new'), 'whoosh'], [t('new2'), 'chime', 1319], [t('doc2'), 'paper'], [t('mcp') + .3, 'click']],
  text: STACK.map(s => s[0]).join('') + RULES.flat().join('') + FILES.join('') + FAILS.join('') + 'pom.xml? mvn test? build.gradle?每次都在AGENTS.md / CLAUDE.md8 组里 5 组成功率下降成本 +20% 以上+4%成功率平均AI 自动生成开发者手写自动生成的 300 行项目介绍代码里一眼能看出的东西@新对话结论官方文档MCP✗ 失败：',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    // ---------- 开场：两张小纸片 ----------
    const k0 = prog(b, t('mvn'), t('mvn') + .3) * (1 - prog(b, t('stack') - .3, t('stack')));
    if (k0 > 0) alpha(cx, k0, () => {
      sheet(cx, 1080, 380, 280, 110, CREAM, -.06 + jit(tt, 1, .02), () => txt(cx, 'pom.xml', 1220, 435, fnt(700, 40, F.mono), NAVY, 'center'));
      sheet(cx, 1420, 520, 300, 110, CREAM, .05 + jit(tt, 2, .02), () => txt(cx, 'build.gradle', 1570, 575, fnt(700, 36, F.mono), NAVY, 'center'));
      txt(cx, 'Maven', 1220, 330, fnt(900, 34), CORAL, 'center'); txt(cx, 'Gradle', 1570, 470, fnt(900, 34), BLUEG, 'center');
      const kq = prog(b, t('q'), t('q') + .3); if (kq > 0) alpha(cx, kq, () => txt(cx, '?', 1400, 330, fnt(900, 120, F.poster), RED, 'center'));
    });
    // ---------- 一摞纸 ----------
    const ks = prog(b, t('stack'), t('stack') + .2) * (1 - prog(b, t('rf2') - .3, t('rf2'), E.in));
    if (ks > 0) STACK.forEach(([n, col], i) => {
      const k = prog(b, STK_AT[i], STK_AT[i] + .3, E.out); if (k <= 0) return;
      const w = i === 4 ? 300 : 620, h = 90, x = 1000 + i * 26 + (i === 4 ? 160 : 0), y = lerp(-200, 760 - i * 104, k) + jit(tt, i, 3);
      alpha(cx, ks, () => sheet(cx, x, y, w, h, col, (hash(i * 5) - .5) * .06 + jit(tt, i, .012), () => {
        txt(cx, n, x + 30, y + h / 2, fnt(900, 38), i === 0 ? NAVY : CREAM);
        if (i === 0) { circ(cx, x + w - 30, y + 20, 11, RED); txt(cx, '每次都在', x + w - 60, y + h / 2, fnt(700, 24), NAVY, 'right'); }
      }));
    });
    // ---------- 规则文件：项目说明书 ----------
    const kr = prog(b, t('rf2'), t('rf2') + .4, E.back) * (1 - prog(b, t('eth0') - .3, t('eth0'), E.in));
    if (kr > 0) {
      const x = 960, y = 300, w = 860, h = 560;
      alpha(cx, Math.min(1, kr), () => scaleAt(cx, x + w / 2, y + h / 2, .8 + .2 * kr, () => sheet(cx, x, y, w, h, MUST, -.02 + jit(tt, 9, .01), () => {
        txt(cx, 'AGENTS.md / CLAUDE.md', x + 40, y + 60, fnt(700, 36, F.mono), NAVY);
        seg(cx, x + 40, y + 100, x + w - 40, y + 100, rgba(NAVY, .4), 2);
        RULES.forEach(([a, v], i) => { const k = prog(b, t('r' + i), t('r' + i) + .3); if (k <= 0) return; alpha(cx, k, () => { txt(cx, a, x + 40, y + 160 + i * 92, fnt(700, 34, F.mono), RED); txt(cx, v, x + 250, y + 160 + i * 92, fnt(700, 34), NAVY); }); });
      })));
    }
    // ---------- ETH 两根纸条 ----------
    const ke = prog(b, t('eth'), t('eth') + .3) * (1 - prog(b, t('short') - .3, t('short')));
    if (ke > 0) alpha(cx, ke, () => {
      const base = 620;
      seg(cx, 820, base, 1800, base, NAVY, 4);
      const ka = prog(b, t('ai') + .2, t('ai') + .7, E.out), kh = prog(b, t('hand') + .2, t('hand') + .7, E.back);
      sheet(cx, 900, base, 340, 230 * ka, RED, .02 + jit(tt, 4, .01), () => { if (ka > .7) { txt(cx, '8 组里 5 组', 1070, base + 70, fnt(900, 40), CREAM, 'center'); txt(cx, '成功率下降', 1070, base + 120, fnt(700, 32), CREAM, 'center'); txt(cx, '成本 +20% 以上', 1070, base + 175, fnt(700, 28), CREAM, 'center'); } });
      txt(cx, 'AI 自动生成', 1070, base - 40, fnt(900, 40), NAVY, 'center');
      sheet(cx, 1380, base - 260 * kh, 340, 260 * kh, TEAL, -.02 + jit(tt, 5, .01), () => { if (kh > .7) { txt(cx, '+4%', 1550, base - 170, fnt(900, 76), CREAM, 'center'); txt(cx, '成功率平均', 1550, base - 90, fnt(700, 30), CREAM, 'center'); } });
      txt(cx, '开发者手写', 1550, base + 50, fnt(900, 40), NAVY, 'center');
      alpha(cx, prog(b, t('eth'), t('eth') + .3), () => { rr(cx, 900, 230, 820, 70, 10, 'rgba(255,255,255,.5)'); txt(cx, 'ETH Zurich · ICLR 2026', 1310, 265, fnt(700, 32, F.mono), NAVY, 'center'); });
    });
    // ---------- 写短：剪掉长行 ----------
    const kn = prog(b, t('short'), t('short') + .3) * (1 - prog(b, t('at0') - .3, t('at0')));
    if (kn > 0) alpha(cx, kn, () => {
      const x = 1080, y = 300;
      sheet(cx, x, y, 640, 420, MUST, .03 + jit(tt, 6, .01), () => {
        txt(cx, 'AGENTS.md', x + 36, y + 56, fnt(700, 34, F.mono), NAVY);
        ['构建：mvn package', '测试：mvn test', '别动：src/legacy/'].forEach((s, i) => txt(cx, s, x + 36, y + 150 + i * 80, fnt(700, 36), NAVY));
      });
      [[t('only') + .3, 740], [t('only') + .7, 810]].forEach(([at, yy], i) => { const f = prog(b, at, at + .6, E.in); alpha(cx, 1 - f, () => sheet(cx, x + 40, yy + f * 400, 560, 50, CREAM, f * (i ? -.6 : .5), () => txt(cx, ['……（自动生成的 300 行项目介绍）', '……（代码里一眼能看出的东西）'][i], x + 60, yy + f * 400 + 25, fnt(500, 24), rgba(NAVY, .6)))); });
    });
    // ---------- @ 指定文件 ----------
    const ka2 = prog(b, t('at0'), t('at0') + .3) * (1 - prog(b, t('fail0') - .3, t('fail0')));
    if (ka2 > 0) alpha(cx, ka2, () => {
      FILES.forEach((f, i) => { const x = 880 + (i % 4) * 240, y = 380 + Math.floor(i / 4) * 170, on = i === 0; alpha(cx, on ? 1 : .45, () => sheet(cx, x, y, 220, 120, on ? CREAM : KRAFT, (hash(i) - .5) * .12 + jit(tt, i + 20, .01), () => txt(cx, f.replace('.java', ''), x + 110, y + 60, fnt(700, f.length > 14 ? 20 : 24, F.mono), NAVY, 'center'))); });
      const kp = prog(b, t('at0') + .3, t('at0') + .45, E.out);
      scaleAt(cx, 990, 350, lerp(3, 1, kp), () => alpha(cx, kp, () => { circ(cx, 990, 350, 54, CORAL, CREAM, 6); txt(cx, '@', 990, 346, fnt(900, 70), CREAM, 'center'); }));
    });
    // 新开的一张纸
    const kn2 = prog(b, t('new'), t('new') + .4, E.out) * (1 - prog(b, t('doc0') - .3, t('doc0')));
    if (kn2 > 0) alpha(cx, Math.min(1, kn2 * 2), () => { const x = lerp(1960, 1000, kn2), y = 300; sheet(cx, x, y, 700, 560, CREAM, -.015 + jit(tt, 7, .008), () => { txt(cx, '新对话', x + 36, y + 56, fnt(700, 30), rgba(NAVY, .6)); seg(cx, x + 36, y + 90, x + 664, y + 90, rgba(NAVY, .2), 2); }); });
    // ---------- 文档 + MCP ----------
    const km = prog(b, t('doc2'), t('doc2') + .3) * (1 - prog(b, S.bars - .5, S.bars));
    if (km > 0) alpha(cx, km, () => {
      sheet(cx, 1080, 300, 330, 420, CREAM, .05 + jit(tt, 8, .01), () => { txt(cx, '官方文档', 1245, 350, fnt(900, 36), NAVY, 'center'); cx.fillStyle = NAVY; for (let i = 0; i < 6; i++) cx.fillRect(1120, 400 + i * 44, 250 - (i % 3) * 40, 12); });
      const kp = prog(b, t('mcp') + .2, t('mcp') + .45, E.back);
      if (kp > 0) scaleAt(cx, 1600, 480, kp, () => { sheet(cx, 1520, 400, 160, 160, BLUEG, -.05, () => txt(cx, 'MCP', 1600, 480, fnt(900, 48), CREAM, 'center')); seg(cx, 1520, 480, 1420, 480, NAVY, 6); });
    });
    // ---------- Clawd：纸偶 ----------
    const T12 = Math.floor(tt * 12) / 12;
    let st = { x: 560, y: 760, px: 16, skin: 'paper', col: CORAL, hi: '#ef9a7f', line: CREAM, pose: 'idle', ph: T12 * 10, blink: (tt % 3) < .1, eye: 1, rot: jit(tt, 0, .07) };
    if (b < t('stack')) { st.q = 1; st.qC = RED; }
    if (b >= t('stack') && b < t('rf2')) { st.x = 520; st.pose = 'point'; }
    if (b >= t('rf2') && b < t('eth0')) { st.pose = 'type'; st.ph = T12 * 20; }
    if (b >= t('eth0') && b < t('short')) { st.x = 600; st.y = 900; st.px = 14; }
    if (b >= t('short') && b < t('at0')) { st.pose = 'up'; st.x = 640; }
    if (b >= t('at0') && b < t('fail0')) { st.pose = 'point'; st.x = 600; }
    if (b >= t('fail0') && b < t('new')) { st.x = 420; st.y = 900; st.sweat = b; st.eye = 0; }
    if (b >= t('new')) { const k = prog(b, t('new') + .1, t('new') + .5, E.io); st.x = lerp(420, 1350, k); st.y = lerp(900, 780, k) - Math.sin(Math.PI * k) * 160; st.sweat = 0; st.pose = k >= 1 ? 'hold' : 'idle'; st.eyeShape = k >= 1 && b < t('doc0') ? 'happy' : null; }
    if (b >= t('doc0')) { st.x = 860; st.y = 840; st.pose = 'point'; st.eye = 1; st.eyeShape = null; }
    clawd(cx, st);
    // 失败纸条把 Clawd 埋住
    const kf = 1 - prog(b, t('new') - .2, t('new'));
    if (b >= t('fail') && kf > 0) alpha(cx, kf, () => FAIL_AT.forEach((at, i) => {
      const k = prog(b, at, at + .2, E.out); if (k <= 0) return;
      const y = lerp(-100, 900 - i * 62, k) + jit(tt, i + 40, 3), x = 420 + (hash(i * 3) - .5) * 120;
      sheet(cx, x - 260, y, 520, 56, i % 2 ? '#e9dccb' : CREAM, (hash(i * 9) - .5) * .14, () => txt(cx, '✗ 失败：' + FAILS[i], x - 230, y + 28, fnt(700, 26), RED));
    }));
    if (b >= t('new2') && b < t('doc0')) alpha(cx, prog(b, t('new2'), t('new2') + .2) * (1 - prog(b, t('doc0') - .2, t('doc0'))), () => sheet(cx, 1300, 560, 200, 90, MUST, -.08 + jit(tt, 12, .02), () => txt(cx, '结论', 1400, 605, fnt(900, 40), NAVY, 'center')));
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
