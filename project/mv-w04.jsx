// 04 上下文 · 纸：剪纸定格动画。纸层叠出 Clawd 看到的全部上下文，规则文件垫底；ETH 两根纸条一降一升；@ 钉住文件；失败纸条把 Clawd 埋住，新开一张纸只带结论
(window.MV_W = window.MV_W || {}).w04 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd } = K;
const NAVY = '#2b2d42', CREAM = '#f7f0e1', MUST = '#e8b04a', SAGE = '#9cb59a', TEAL = '#4f8f8b', CORAL = '#e07a5f', RED = '#c8553d', KRAFT = '#c9a77c', BLUEG = '#5c7aa8';
const STACK = [['规则文件', MUST, 2.5], ['之前的对话', SAGE, 2.75], ['读过的文件', TEAL, 3], ['工具输出', BLUEG, 3.25], ['提示词', CORAL, 3.5]];
const RULES = [['## 构建', 'mvn package'], ['## 测试', 'mvn test'], ['## 规范', '驼峰命名，Service 层写业务'], ['## 别动', 'src/legacy/ 目录']];
const FILES = ['UserService.java', 'User.java', 'PasswordUtil.java', 'pom.xml', 'LoginController.java', 'README.md', 'BookService.java', 'application.yml'];
const jit = (t, s, k = 1) => (hash(Math.floor(t * 12) + s * 7.7) - .5) * k;
function sheet(ctx, x, y, w, h, col, rot, fn) { // 一张剪纸：白边 + 颜色
  rotAt(ctx, x + w / 2, y + h / 2, rot, () => { rr(ctx, x - 6, y - 6, w + 12, h + 12, 6, CREAM); rr(ctx, x, y, w, h, 4, col); if (fn) fn(); });
}
// 在原 18 小节上加三处停顿：纸摞叠好（半小节）、两根纸条比完（半小节）、Clawd 被失败纸条埋住（1 小节）
return K.warpWorld({
  scene: '04 纸 · 上下文', bars: 18, look: 4,
  enter: { kind: TR.TEAR, a: 1, b: 3 },
  hud: { num: '04', name: '上下文', time: '21:45', line: '怎么又错了', ink: NAVY, acc: CORAL },
  you: [[.95, 2.15, '怎么又报错了？'], [11.95, 13.3, '再试一次……再试一次……']],
  rule: { n: 3, at: 9.5, len: 3, text: '规则文件自己写，写短' },
  src: [[6.25, 9.4, 'Gloaguen et al., ETH Zurich / ICLR 2026']],
  par: L => [1, .32 + .1 * prog(L.b, 12, 14.5) * (1 - prog(L.b, 14.5, 15)), 0, 0],
  cam: L => [1.01 + .01 * Math.sin(L.t * .5), jit(L.t, 3, .004), 0, 0],
  pulse: L => .4,
  sfx: [[1, 'paper'], [1.6, 'q', 600], ...STACK.map(s => [s[2], 'paper']), [4.5, 'swish'], ...[5, 5.25, 5.5, 5.75].map(b => [b, 'key']), [6.25, 'paper'], [6.75, 'bonk'], [7.5, 'chime', 1568], [9, 'snip'], [9.25, 'snip'],
    [11, 'stamp'], ...[12, 12.25, 12.5, 12.75, 13, 13.25, 13.5].map(b => [b, 'bonk']), [14.5, 'whoosh'], [14.75, 'chime', 1319], [15.75, 'paper'], [16.5, 'click']],
  text: STACK.map(s => s[0]).join('') + RULES.flat().join('') + FILES.join('') + '提示词写清楚了，我还是不知道——项目用 Maven 构建？测试怎么跑？之前的对话、读过的文件、工具输出……提示词只是最上面那一张。垫在最底下的，是有人专门比过两种规则文件：所以：自己写，写短。用 @ 点名相关文件失败一次次堆进对话，我会被这些错误带歪。用到新库？把官方文档的那一段贴给我，或者接一个能查文档的工具。提示词写清楚了，我还是出错：不知道项目用 Maven 构建不知道测试怎么跑pom.xml? mvn test?我看到的，不只是提示词提示词只是其中一小块规则文件：AGENTS.md · CLAUDE.md · Qoder 项目规则每次对话，自动带上ETH Zurich · ICLR 2026研究对比了两种规则文件AI 自动生成8 组里 5 组成功率下降成本 +20% 以上开发者手写成功率平均 +4%规则文件你自己写，写短只写我从代码里看不出来的用 @ 指定相关文件比让我满仓库翻，更准、更省同一个对话里失败几次，错误的尝试堆满上下文，我会被带歪✗ 失败别硬撑：新开对话，只带结论过去结论用到新库：把官方文档的相关段落贴给我或者接上能查文档的工具MCP：让 AI 连接外部工具和数据的标准接口官方文档',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, T12 = Math.floor(t * 12) / 12;
    // ---------- 开场：Clawd 不知道 Maven ----------
    const k0 = prog(b, .9, 1.1) * (1 - prog(b, 2.3, 2.5));
    if (k0 > 0) alpha(cx, k0, () => {
      sheet(cx, 1180, 360, 260, 110, CREAM, -.06 + jit(t, 1, .02), () => txt(cx, 'pom.xml?', 1310, 415, fnt(700, 40, F.mono), NAVY, 'center'));
      sheet(cx, 1440, 500, 260, 110, CREAM, .05 + jit(t, 2, .02), () => txt(cx, 'mvn test?', 1570, 555, fnt(700, 40, F.mono), NAVY, 'center'));
    });
    // ---------- 纸层：看到的全部 ----------
    const ks = 1 - prog(b, 4.3, 4.5, E.in) * (1 - 0);
    if (b >= 2.4 && b < 4.6) STACK.forEach(([n, col, at], i) => {
      const k = prog(b, at, at + .18, E.out); if (k <= 0) return;
      const w = i === 4 ? 300 : 620, h = 90, x = 1000 + i * 26 + (i === 4 ? 160 : 0), y = lerp(-200, 760 - i * 104, k) + jit(t, i, 3);
      alpha(cx, ks * (i === 0 ? 1 : 1 - prog(b, 4.3, 4.45)), () => sheet(cx, x, y, w, h, col, (hash(i * 5) - .5) * .06 + jit(t, i, .012), () => {
        txt(cx, n, x + 30, y + h / 2, fnt(900, 38), i === 0 ? NAVY : CREAM);
        if (i === 0) { circ(cx, x + w - 30, y + 20, 11, RED); txt(cx, '每次都在', x + w - 60, y + h / 2, fnt(700, 24), NAVY, 'right'); }
      }));
    });
    // ---------- 规则文件 ----------
    const kr = prog(b, 4.45, 4.75, E.back) * (1 - prog(b, 6.05, 6.25, E.in));
    if (kr > 0) {
      const x = 960, y = 300, w = 820, h = 560;
      alpha(cx, Math.min(1, kr), () => scaleAt(cx, x + w / 2, y + h / 2, .8 + .2 * kr, () => sheet(cx, x, y, w, h, MUST, -.02 + jit(t, 9, .01), () => {
        txt(cx, 'AGENTS.md / CLAUDE.md', x + 40, y + 60, fnt(700, 36, F.mono), NAVY);
        seg(cx, x + 40, y + 100, x + w - 40, y + 100, rgba(NAVY, .4), 2);
        RULES.forEach(([a, v], i) => { const k = prog(b, 5 + i * .25, 5.1 + i * .25); if (k <= 0) return; alpha(cx, k, () => { txt(cx, a, x + 40, y + 160 + i * 92, fnt(700, 34, F.mono), RED); txt(cx, v, x + 250, y + 160 + i * 92, fnt(700, 34), NAVY); }); });
      })));
    }
    // ---------- ETH 两根纸条 ----------
    const ke = prog(b, 6.25, 6.45) * (1 - prog(b, 8.85, 9.05));
    if (ke > 0) alpha(cx, ke, () => {
      const base = 640;
      seg(cx, 820, base, 1800, base, NAVY, 4);
      const ka = prog(b, 6.75, 7.05, E.out), kh = prog(b, 7.5, 7.8, E.back);
      // AI 生成：往下掉，撕开
      sheet(cx, 900, base, 340, 230 * ka, RED, .02 + jit(t, 4, .01), () => { if (ka > .7) { txt(cx, '8 组里 5 组', 1070, base + 70, fnt(900, 40), CREAM, 'center'); txt(cx, '成功率下降', 1070, base + 120, fnt(700, 32), CREAM, 'center'); txt(cx, '成本 +20% 以上', 1070, base + 175, fnt(700, 28), CREAM, 'center'); } });
      txt(cx, 'AI 自动生成', 1070, base - 40, fnt(900, 40), NAVY, 'center');
      // 手写：往上长
      sheet(cx, 1380, base - 260 * kh, 340, 260 * kh, TEAL, -.02 + jit(t, 5, .01), () => { if (kh > .7) { txt(cx, '+4%', 1550, base - 170, fnt(900, 76), CREAM, 'center'); txt(cx, '成功率平均', 1550, base - 90, fnt(700, 30), CREAM, 'center'); } });
      txt(cx, '开发者手写', 1550, base + 50, fnt(900, 40), NAVY, 'center');
    });
    // ---------- 写短：剪掉长行 ----------
    const kn = prog(b, 8.95, 9.1) * (1 - prog(b, 10.85, 11));
    if (kn > 0) alpha(cx, kn, () => {
      const x = 1080, y = 330;
      sheet(cx, x, y, 640, 420, MUST, .03 + jit(t, 6, .01), () => {
        txt(cx, 'AGENTS.md', x + 36, y + 56, fnt(700, 34, F.mono), NAVY);
        ['构建：mvn package', '测试：mvn test', '别动：src/legacy/'].forEach((s, i) => txt(cx, s, x + 36, y + 150 + i * 80, fnt(700, 36), NAVY));
      });
      [[9, 760], [9.25, 830]].forEach(([at, yy], i) => { const f = prog(b, at, at + .6, E.in); alpha(cx, 1 - f, () => sheet(cx, x + 40, yy + f * 400, 560, 50, CREAM, f * (i ? -.6 : .5), () => txt(cx, ['……（自动生成的 300 行项目介绍）', '……（代码里一眼能看出的东西）'][i], x + 60, yy + f * 400 + 25, fnt(500, 24), rgba(NAVY, .6)))); });
    });
    // ---------- @ 指定文件 ----------
    const ka2 = prog(b, 10.95, 11.1) * (1 - prog(b, 11.85, 12));
    if (ka2 > 0) alpha(cx, ka2, () => {
      FILES.forEach((f, i) => { const x = 880 + (i % 4) * 240, y = 380 + Math.floor(i / 4) * 170, on = i === 0; alpha(cx, on ? 1 : .45, () => sheet(cx, x, y, 220, 120, on ? CREAM : KRAFT, (hash(i) - .5) * .12 + jit(t, i + 20, .01), () => txt(cx, f.replace('.java', ''), x + 110, y + 60, fnt(700, f.length > 14 ? 20 : 24, F.mono), NAVY, 'center'))); });
      const kp = prog(b, 11, 11.12, E.out);
      scaleAt(cx, 990, 350, lerp(3, 1, kp), () => alpha(cx, kp, () => { circ(cx, 990, 350, 54, CORAL, CREAM, 6); txt(cx, '@', 990, 346, fnt(900, 70), CREAM, 'center'); }));
    });
    // 新开的一张纸
    const kn2 = prog(b, 14.5, 14.75, E.out) * (1 - prog(b, 15.6, 15.8));
    if (kn2 > 0) alpha(cx, Math.min(1, kn2 * 2), () => {
      const x = lerp(1960, 1000, kn2), y = 300;
      sheet(cx, x, y, 700, 560, CREAM, -.015 + jit(t, 7, .008), () => { txt(cx, '新对话', x + 36, y + 56, fnt(700, 30), rgba(NAVY, .6)); seg(cx, x + 36, y + 90, x + 664, y + 90, rgba(NAVY, .2), 2); });
    });
    // ---------- 文档 + MCP ----------
    const km = prog(b, 15.75, 16) * (1 - prog(b, 17.8, 18));
    if (km > 0) alpha(cx, km, () => {
      sheet(cx, 1080, 300, 330, 420, CREAM, .05 + jit(t, 8, .01), () => { txt(cx, '官方文档', 1245, 350, fnt(900, 36), NAVY, 'center'); for (let i = 0; i < 6; i++) cx.fillRect(1120, 400 + i * 44, 250 - (i % 3) * 40, 12); });
      const kp = prog(b, 16.5, 16.65, E.back);
      if (kp > 0) scaleAt(cx, 1600, 480, kp, () => { sheet(cx, 1520, 400, 160, 160, BLUEG, -.05, () => { txt(cx, 'MCP', 1600, 480, fnt(900, 48), CREAM, 'center'); }); seg(cx, 1520, 480, 1420, 480, NAVY, 6); });
    });
    // ---------- Clawd：纸偶 ----------
    let st = { x: 560, y: 760, px: 16, skin: 'paper', col: CORAL, hi: '#ef9a7f', line: CREAM, pose: 'idle', ph: T12 * 10, blink: (t % 3) < .1, eye: 1, rot: jit(t, 0, .07) };
    if (b < .9) st.alpha = prog(b, .4, .9);
    if (b >= 1 && b < 2.4) { st.q = 1; st.qC = RED; }
    if (b >= 2.4 && b < 4.4) { st.x = 520; st.pose = 'point'; }
    if (b >= 4.4 && b < 6.2) { st.pose = 'type'; st.ph = T12 * 20; }
    if (b >= 6.2 && b < 9) { st.x = 600; st.y = 900; st.px = 14; st.eye = 1; }
    if (b >= 9 && b < 11) { st.pose = 'up'; st.x = 640; }
    if (b >= 11 && b < 12) { st.pose = 'point'; st.x = 600; }
    if (b >= 12 && b < 14.5) { st.x = 420; st.y = 900; st.sweat = b - 12; st.eye = 0; }
    if (b >= 14.5) { const k = prog(b, 14.6, 14.9, E.io); st.x = lerp(420, 1350, k); st.y = lerp(900, 780, k) - Math.sin(Math.PI * k) * 160; st.sweat = 0; st.pose = b >= 14.9 ? 'hold' : 'idle'; st.eyeShape = b >= 14.9 && b < 15.6 ? 'happy' : null; }
    if (b >= 15.6) { st.x = 860; st.y = 840; st.pose = 'point'; st.eye = 1; st.eyeShape = null; }
    clawd(cx, st);
    // ---------- 失败纸条把 Clawd 埋住 ----------
    const FAIL = [12, 12.25, 12.5, 12.75, 13, 13.25, 13.5];
    const kf = 1 - prog(b, 14.4, 14.6);
    if (b >= 11.9 && kf > 0) alpha(cx, kf, () => FAIL.forEach((at, i) => {
      const k = prog(b, at, at + .15, E.out); if (k <= 0) return;
      const y = lerp(-100, 900 - i * 62, k) + jit(t, i + 40, 3), x = 420 + (hash(i * 3) - .5) * 120;
      sheet(cx, x - 260, y, 520, 56, i % 2 ? '#e9dccb' : CREAM, (hash(i * 9) - .5) * .14, () => { txt(cx, '✗ 失败：' + ['NullPointerException', '测试没过', '又改坏了', 'mvn 报错', '换个写法也不行', '回到原点', '越改越乱'][i], x - 230, y + 28, fnt(700, 26), RED); });
    }));
    // Clawd 手里的结论卡
    if (b >= 14.85 && b < 15.65) alpha(cx, prog(b, 14.85, 15) * (1 - prog(b, 15.5, 15.65)), () => sheet(cx, 1300, 560, 200, 90, MUST, -.08 + jit(t, 12, .02), () => txt(cx, '结论', 1400, 605, fnt(900, 40), NAVY, 'center')));
    // ---------- 歌词 ----------
    const LX = 130, ink = { col: NAVY, acc: [CORAL, RED] };
    lyric(tx, L, { at: 1.25, out: 2.35, text: '提示词写清楚了，\n我‹还是不知道›——', x: LX, y: 250, size: 56, w: 900, ...ink, anim: 'drop' });
    lyric(tx, L, { at: 1.6, out: 2.35, text: '项目用 Maven 构建？\n测试怎么跑？', x: LX, y: 470, size: 38, w: 700, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 2.5, out: 4.3, text: '我看到的，\n‹不只是提示词›。', x: LX, y: 300, size: 66, w: 900, ...ink, anim: 'drop' });
    lyric(tx, L, { at: 3.5, out: 4.3, text: '之前的对话、读过的文件、工具输出……\n提示词只是最上面那一张。', x: LX, y: 470, size: 38, w: 700, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 4.45, out: 6.1, text: '垫在最底下的，是', x: LX, y: 220, size: 40, w: 700, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 4.55, out: 6.1, text: '‹规则文件›', x: LX, y: 310, size: 80, w: 900, ...ink, anim: 'drop' });
    lyric(tx, L, { at: 4.65, out: 6.1, text: 'AGENTS.md · CLAUDE.md\nQoder 项目规则', x: LX, y: 430, size: 36, fam: F.mono, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 5, out: 6.1, text: '每次对话，自动带上', x: LX, y: 590, size: 48, w: 900, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 6.25, out: 8.9, text: 'ETH Zurich · ICLR 2026', x: LX, y: 280, size: 32, fam: F.mono, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 6.4, out: 8.9, text: '有人专门比过\n两种规则文件：', x: LX, y: 420, size: 62, w: 900, ...ink, anim: 'drop' });
    lyric(tx, L, { at: 9, out: 10.85, text: '所以：\n‹自己写›，‹写短›。', x: LX, y: 340, size: 76, w: 900, ...ink, anim: 'drop', st: .2 });
    lyric(tx, L, { at: 9.4, out: 10.85, text: '只写我从代码里看不出来的。', x: LX, y: 540, size: 40, w: 700, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 11, out: 11.85, text: '用 ‹@› 点名相关文件', x: LX, y: 340, size: 66, w: 900, ...ink, anim: 'drop' });
    lyric(tx, L, { at: 11.25, out: 11.85, text: '比让我满仓库翻，更准、更省', x: LX, y: 470, size: 38, w: 700, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 12.25, out: 14.4, text: '失败一次次堆进对话，\n我会被这些错误‹带歪›。', x: 980, y: 420, size: 50, w: 900, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 14.6, out: 15.6, text: '别硬撑：\n‹新开对话›，只带结论过去。', x: LX, y: 360, size: 58, w: 900, ...ink, anim: 'drop' });
    lyric(tx, L, { at: 15.75, out: 17.8, text: '用到新库？\n把‹官方文档›的那一段贴给我，', x: LX, y: 300, size: 48, w: 900, ...ink, anim: 'rise' });
    lyric(tx, L, { at: 16.5, out: 17.8, text: '或者接一个能查文档的工具。\n«MCP»：让 AI 连接外部工具和数据的标准接口', x: LX, y: 520, size: 34, w: 700, ...ink, acc: [CORAL, BLUEG], anim: 'rise' });
  },
}, [[0, 0], [4.2, 4.2], [4.7, 4.2], [8.9, 8.4], [9.4, 8.4], [15.3, 14.3], [16.3, 14.3]], 20);
};
