// 第六章 · 23:00「室友一次就成」：Harness
// f06a 现实：室友说同一个模型一次就写完；Clawd：你们用的不是同一辆车
// f06b 蓝图：两辆车同一台发动机；HARNESS；3D 线框爆炸图，七个部件逐一飞入并讲解；发动机和整车；HAL 的 42/78/95；
//      六级梯子；RedAccess 点阵；选工具七项；规则 5；这门课的路线；两个 Agent 抢一个文件
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f06a = K => window.MV_REAL(K, {
  scene: '06 · 23:00 室友一次就成',
  desc: '室友发来消息：同一个模型，他一次就写完了；Clawd 说你们用的不是同一辆车。',
  clock: [23, 0], stamp: ['周五', '23:00'],
  steps: [
    { pause: .75 },
    { id: 'buzz', pause: 3.2 },
    { id: 'why', you: '同一个模型，凭什么他一次就成，我老出错？' },
    { id: 'car', me: '因为你们用的，不是同一辆车。' },
    { id: 'huh', you: '……车？', enter: false },
    { id: 'draw', me: '我画给你看。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'wide', 0], [S.t('buzz') - .2, 'phone', 1.2], [S.t('why'), 'desk', 1.4], [S.t('huh'), 'face', 1], [S.t('draw'), 'over', 1.2], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: () => ({ steam: .5 }),
  phone: (x, w, h, L, S) => {
    const k = K.prog(L.b, S.t('buzz') + .3, S.t('buzz') + .5); if (k <= 0) return;
    x.globalAlpha = k; x.fillStyle = '#1e2028'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#e8e9ee'; x.font = '300 64px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.fillText('23:00', w / 2, 110); x.textAlign = 'left';
    x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.roundRect(14, 170, w - 28, 130, 18); x.fill();
    x.fillStyle = '#ffffff'; x.font = '700 22px "Noto Sans SC",sans-serif'; x.fillText('室友', 30, 205);
    x.font = '400 19px "Noto Sans SC",sans-serif'; x.fillText('我用的同一个模型，', 30, 240); x.fillText('一次就写完了。', 30, 268);
    x.globalAlpha = 1;
  },
  draw(cx, tx, L, S) {
    const kp = K.prog(L.b, S.t('buzz') + .4, S.t('buzz') + .7, K.E.out) * (1 - K.prog(L.b, S.t('why') - .3, S.t('why')));
    if (kp > 0) K.alpha(tx, kp, () => {
      const x = 560, y = 760 + (1 - kp) * 30;
      K.rr(tx, x, y, 800, 150, 28, 'rgba(28,30,38,.88)', 'rgba(255,255,255,.12)', 2);
      K.rr(tx, x + 28, y + 34, 56, 56, 14, '#4f8f6b'); K.txt(tx, '室', x + 56, y + 63, K.fnt(900, 30), '#fff', 'center');
      K.txt(tx, '室友', x + 108, y + 52, K.fnt(700, 30), '#ffffff'); K.txt(tx, '现在', x + 760, y + 52, K.fnt(400, 24), 'rgba(255,255,255,.5)', 'right');
      K.txt(tx, '我用的同一个模型，一次就写完了。', x + 108, y + 104, K.fnt(500, 32), 'rgba(255,255,255,.92)');
    });
  },
  figure: (L, S) => ({ type: L.b >= S.t('why') && L.b < S.t('why') + .8 ? 1 : 0, lean: K.prog(L.b, S.t('huh'), S.t('huh') + .3) * .4, yaw: K.prog(L.b, S.t('buzz') + .2, S.t('buzz') + .6) * -.5 * (1 - K.prog(L.b, S.t('why') - .4, S.t('why'))) }),
  sfx: S => [[S.t('buzz') + .3, 'notify'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .5);
    S.add('pad', 0, 0, H.CH.F.pad, 8, .3, 'glass');
    H.each(Math.floor(M.t('why')), Math.floor(M.t('push')) + 1, b => { for (let j = 0; j < 16; j++) S.add('tick', b, j / 4, 0, 0, .25); });
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .6);
  },
});

R.f06b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, clamp01, seq, narrate, scene } = K;
const WL = '#eaf4ff', YE = '#ffd75e', OR = '#ff9a4d', RD = '#ff6b6b', GN = '#7dffb0', DIM = 'rgba(234,244,255,.6)';
const PARTS = [['系统提示词', ''], ['工具', '读写文件 · 执行命令 · 搜索'], ['权限设置', ''], ['上下文管理', '压缩 · 子代理'], ['规则文件', ''], ['hooks', '特定时机自动运行的脚本'], ['反馈', '跑测试 · 代码检查']];
const RUNG = [['行内补全', '打字时补下一段'], ['对话面板', '问答、解释、生成片段'], ['IDE 里的 Agent', 'Qoder · Trae · Cursor'], ['命令行 Agent', 'Claude Code · Codex CLI'], ['云端后台 Agent', '跑完直接提交改动'], ['应用生成平台', 'Lovable · Bolt · v0']];
const SEVEN = ['在哪写代码：IDE 还是终端', '能用哪些模型，能不能换', '计费方式', '权限控制和撤销功能（检查点）', '是否支持规则文件和 MCP', '国内网络能否直接用', '数据会不会被拿去训练'];
const ROUTE = ['先用 IDEA 里的 Qoder', '熟悉了 Git 和命令行，再试命令行 Agent', '应用生成平台，只拿来做原型'];
const CEN = [1100, 560];
function engine(ctx, x, y, s, col = WL) { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.strokeRect(x - 90 * s, y - 50 * s, 180 * s, 100 * s); for (let i = 0; i < 3; i++) { ctx.strokeRect(x - 70 * s + i * 50 * s, y - 85 * s, 40 * s, 35 * s); circ(ctx, x - 50 * s + i * 50 * s, y - 95 * s, 8 * s, null, col, 3); } circ(ctx, x + 110 * s, y, 24 * s, null, col, 3); }
function car(ctx, x, y, s, col = WL) {
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(x - 300 * s, y + 40 * s); ctx.lineTo(x - 300 * s, y - 20 * s); ctx.lineTo(x - 200 * s, y - 40 * s); ctx.lineTo(x - 120 * s, y - 110 * s); ctx.lineTo(x + 110 * s, y - 110 * s); ctx.lineTo(x + 190 * s, y - 40 * s); ctx.lineTo(x + 300 * s, y - 25 * s); ctx.lineTo(x + 300 * s, y + 40 * s); ctx.closePath(); ctx.stroke();
  [-180, 180].forEach(d => { circ(ctx, x + d * s, y + 40 * s, 55 * s, 'rgba(18,58,122,1)', col, 3); circ(ctx, x + d * s, y + 40 * s, 22 * s, null, col, 2); });
}
function dimLine(ctx, x0, x1, y, col, k = 1) { const x = lerp(x0, x1, k); seg(ctx, x0, y - 16, x0, y + 16, col, 2); if (k > .98) seg(ctx, x1, y - 16, x1, y + 16, col, 2); arrow(ctx, x0 + 2, y, x, y, col, 2, 12, 1); }
const S = seq([
  { id: 'cars', say: '同一个模型，放进不同的工具里，结果就是不一样。', hold: .75 },
  { id: 'layer', say: '差别，出在模型外面的那一层。', hold: .5 },
  { id: 'hn', say: '这一层，叫 harness。', gloss: ['harness', '', '原意是马具：套在马身上、把马的力气变成拉车的那一整套。这里指模型之外的一切。'], until: 'p0' },
  { id: 'list', say: '模型之外的一切都算。我们拆开来看：' },
  { id: 'p0', say: '系统提示词：工具事先写给我的说明。' },
  { id: 'p1', say: '工具：读写文件、执行命令、搜索、上网。' },
  { id: 'p2', say: '权限设置：哪些事我能直接做，哪些必须你点头。' },
  { id: 'p3', say: '上下文管理：内容太多时压缩，或者把子任务分给子代理。', gloss: ['子代理', 'sub-agent', '主 Agent 派出去干一件小事的另一个 Agent，干完只把结果交回来。'], until: 'p4' },
  { id: 'p4', say: '规则文件：上一章讲过的那个。' },
  { id: 'p5', say: 'hooks：在特定时机自动运行的脚本，比如每次改完代码，自动格式化。' },
  { id: 'p6', say: '反馈：跑测试、跑代码检查，再把结果告诉我。', hold: .5 },
  { id: 'car', say: '打个比方：模型是发动机，harness 是整辆车。', hold: .75 },
  { id: 'car2', say: '同一台发动机，装进不同的车，跑出来的成绩就不一样。', hold: .5 },
  { id: 'hal0', say: '有人专门测过。Princeton 的 HAL 团队，2025 年 12 月：', src: 'Princeton HAL / Sayash Kapoor, 2025-12', srcUntil: 'ladder0' },
  { id: 'hal1', say: '同一个 Claude Opus 4.5，做同一套测试 CORE-Bench——' },
  { id: 'h0', say: '放在通用框架里，得分 42%；' },
  { id: 'h1', say: '放进 Claude Code，得分 78%；' },
  { id: 'h2', say: '修正了评分里的错误之后，到了 95%。', hold: .75 },
  { id: 'other', say: '换成别的模型，差距就小得多，有的反而在通用框架里表现更好。' },
  { id: 'both', say: '所以，模型和 harness，要放在一起看。', hold: .75 },
  { id: 'ladder0', say: '市面上的编程工具，按自主程度从低到高，大概有六级：' },
  { id: 'l0', say: '行内补全：你打字的时候，帮你补下一段。' },
  { id: 'l1', say: '对话面板：问答、解释、生成代码片段。' },
  { id: 'l2', say: 'IDE 里的 Agent：比如 Qoder、Trae、Cursor。', gloss: ['IDE', '集成开发环境', '写代码用的软件，比如 IntelliJ IDEA。'], until: 'up' },
  { id: 'l3', say: '命令行 Agent：比如 Claude Code、Codex CLI。' },
  { id: 'l4', say: '云端后台 Agent：在云上跑完，直接把改动提交给你。' },
  { id: 'l5', say: '应用生成平台：比如 Lovable、Bolt、v0，一句话生成整个应用。' },
  { id: 'up', say: '越往上，AI 自己干的越多，你亲眼看的代码就越少。' },
  { id: 'up2', say: '检查和隔离，就越得靠流程来兜底。', hold: .5 },
  { id: 'ra0', say: '举个例子。2026 年 5 月，RedAccess 扫描了约 38 万个用 Lovable、Base44、Replit 等平台生成的公开应用。', src: 'RedAccess via Security Boulevard, 2026-05', srcUntil: 'spec' },
  { id: 'ra1', say: '其中约 5000 个，把病历、银行记录这类敏感数据，暴露在外。', hold: .5 },
  { id: 'ra2', say: '主要原因：这些平台默认公开，用户没改成私有。', hold: .5 },
  { id: 'spec', say: '所以，挑工具的时候，看这七项：', hold: 2.5 },
  { id: 'spec4', say: '尤其是第四项：权限怎么控制，改坏了能不能撤销。', hold: .75 },
  { id: 'rule', rule: [5, '弄清工具的权限设置和撤销方式'], dur: 3.5 },
  { id: 'route0', say: '给这门课的建议：' },
  { id: 'r0', say: '先用 IDEA 里的 Qoder；' },
  { id: 'r1', say: '熟悉了 Git 和命令行，再试命令行 Agent；' },
  { id: 'r2', say: '应用生成平台，只拿来做原型。', hold: .5 },
  { id: 'fight', say: '另外：别让好几个 Agent 同时改同一批文件。它们会打架。', hold: 1.25 },
], { start: 2.8, tail: .5 });
const t = S.t;
const PAT = PARTS.map((_, i) => t('p' + i)), HAL = [t('h0'), t('h1'), t('h2')], RAT = RUNG.map((_, i) => t('l' + i));
return scene({
  scene: '06 蓝图 · Harness', look: LOOK.PRINT,
  desc: '两辆车同一台发动机；HARNESS；3D 爆炸图里七个部件逐一讲解；发动机和整车；HAL 的 42/78/95；六级工具梯子；RedAccess；选工具七项；规则 5；课程路线；Agent 抢文件。',
  enter: { kind: TR.WIPE, a: 0, b: 3, col: '#9fd8ff' },
  hud: { num: '06', name: 'Harness', time: '23:00', line: '室友一次就成', ink: WL, acc: YE, mv: [2.1, 2.6] },
  par: L => [.1 + .25 * L.hit(t('layer') + .5, .6), 0, 0, 0],
  cam: L => { const b = L.b; return [1 + .015 * Math.sin(L.t * .4) + .05 * prog(b, t('list'), t('p6'), E.io) * (1 - prog(b, t('car'), t('car') + 1, E.io)), 0, 0, 0]; },
  pulse: L => .4,
  sfx: [[t('cars') + .3, 'plot'], [t('cars') + 1, 'ding'], [t('cars') + 1.4, 'glitch'], [t('layer') + .3, 'plot'], ...PAT.map(a => [a, 'click']), [t('car') + .3, 'plot'], ...HAL.map((a, i) => [a, 'plot']), [t('h2') + .4, 'ding'],
    ...RAT.map((a, i) => [a, 'blip', 700 + i * 120]), [t('ra1'), 'tick'], [t('ra1') + .5, 'alarm'], ...SEVEN.map((_, i) => [t('spec') + .3 + i * .35, 'click']), [t('r0'), 'blip', 900], [t('r1'), 'blip', 1100], [t('r2'), 'blip', 1300], [t('fight') + .8, 'shatter']],
  text: PARTS.flat().join('') + RUNG.flat().join('') + SEVEN.join('') + ROUTE.join('') + '✓ 顺利写完✗ 半路出错工具 A工具 B模型HARNESS通用框架Claude Code修正评分错误后42%78%95%0%50%100%亲眼看的代码需要的检查和隔离选工具，看这七项SPEC · 07这门课的路线UserService.java冲突',
  three(T, U) {
    const scene3 = new T.Scene(), mat = new T.LineBasicMaterial({ color: 0xeaf4ff, transparent: true }), hot = new T.LineBasicMaterial({ color: 0xffd75e, transparent: true });
    const wire = (geo, m = mat) => new T.LineSegments(new T.EdgesGeometry(geo, 20), m);
    const eng = new T.Group(); scene3.add(eng);
    eng.add(wire(new T.BoxGeometry(220, 120, 130)));
    const pistons = [-70, 0, 70].map(x => { const g = new T.Group(); g.add(wire(new T.BoxGeometry(46, 40, 46))); const rod = wire(new T.CylinderGeometry(9, 9, 40, 10)); rod.position.y = 38; g.add(rod); const cap = wire(new T.CylinderGeometry(16, 16, 8, 14)); cap.position.y = 62; g.add(cap); g.position.set(x, 80, 0); eng.add(g); return g; });
    const fly = wire(new T.CylinderGeometry(42, 42, 16, 24), hot); fly.rotation.z = Math.PI / 2; fly.position.x = 140; eng.add(fly);
    const crank = wire(new T.CylinderGeometry(8, 8, 300, 8)); crank.rotation.z = Math.PI / 2; crank.position.y = -40; eng.add(crank);
    const shapes = [
      () => wire(new T.BoxGeometry(90, 60, 8)),
      () => { const g = new T.Group(); g.add(wire(new T.BoxGeometry(18, 80, 10))); const h = wire(new T.TorusGeometry(22, 7, 6, 12, Math.PI * 1.4)); h.position.y = 50; g.add(h); return g; },
      () => { const g = new T.Group(); g.add(wire(new T.BoxGeometry(70, 52, 30))); const h = wire(new T.TorusGeometry(22, 5, 6, 14, Math.PI)); h.position.y = 26; g.add(h); return g; },
      () => wire(new T.CylinderGeometry(40, 40, 16, 12)),
      () => wire(new T.BoxGeometry(60, 80, 12)),
      () => wire(new T.TorusGeometry(26, 6, 6, 14, Math.PI * 1.3)),
      () => wire(new T.TorusGeometry(34, 5, 6, 20, Math.PI * 1.7)),
    ];
    const parts = shapes.map(f => { const o = f(); scene3.add(o); return o; });
    return {
      scene: scene3,
      update(L) {
        const b = L.b, tt = L.t, ke = prog(b, t('list'), t('list') + .3) * (1 - prog(b, t('car') + .6, t('car') + 1));
        if (ke <= 0) return false;
        mat.opacity = ke; hot.opacity = ke;
        const [x0, y0] = CEN;
        U.at(eng, x0, y0 + 10, 0); eng.scale.setScalar(1.25);
        eng.rotation.set(.35, -.5 + .35 * Math.sin(tt * .35), 0);
        pistons.forEach((p, i) => p.position.y = 80 + 14 * Math.sin(tt * 6 + i * 2.1));
        fly.rotation.x = tt * 3;
        parts.forEach((o, i) => {
          const k = prog(b, PAT[i], PAT[i] + .5, E.out), kf = 1 - prog(b, t('car') + .2, t('car') + .6);
          o.visible = k > 0 && kf > 0; if (!o.visible) return;
          const a = -Math.PI / 2 + (i / PARTS.length) * 6.283, R = lerp(900, 360, k), px = x0 + Math.cos(a) * R * 1.12, py = y0 + Math.sin(a) * R * .95;
          U.at(o, px, py, lerp(-1800, 0, k));
          const cur = b >= PAT[i] && (i === 6 ? b < t('car') : b < PAT[i + 1]);
          o.rotation.set(.4 + (1 - k) * 4 + .2 * Math.sin(tt + i), (1 - k) * 6 + tt * (cur ? 1.6 : .6) + i, 0);
          o.scale.setScalar(kf * (cur ? 1.35 : 1));
        });
        return true;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, has3d = !!window.THREE;
    // ---------- 两辆车，同一台发动机 ----------
    const k1 = prog(b, t('cars') - .3, t('cars')) * (1 - prog(b, t('layer') + .3, t('layer') + .6));
    if (k1 > 0) alpha(cx, k1, () => {
      [[360, 'A', GN, '✓ 顺利写完', t('cars') + 1], [720, 'B', RD, '✗ 半路出错', t('cars') + 1.4]].forEach(([y, n, col, s, at]) => {
        car(cx, 1180, y, .9); engine(cx, 1180, y - 20, .55);
        const k = prog(b, at, at + .2);
        if (k > 0) alpha(tx, k, () => { txt(tx, s, 1500, y - 90, fnt(900, 40), col); txt(tx, '工具 ' + n, 860, y - 90, fnt(700, 30, F.mono), DIM, 'right'); });
        if (n === 'B' && b >= at) for (let i = 0; i < 8; i++) { const a = hash(i + Math.floor(tt * 12)) * 6.283, r = 30 + hash(i * 3 + Math.floor(tt * 12)) * 60; seg(cx, 1240, y - 40, 1240 + Math.cos(a) * r, y - 40 + Math.sin(a) * r, RD, 3); }
      });
      alpha(tx, k1, () => { txt(tx, '模型', 1180, 545, fnt(700, 28), YE, 'center'); arrow(tx, 1180, 520, 1180, 380, rgba(YE, .7), 2, 10); arrow(tx, 1180, 570, 1180, 690, rgba(YE, .7), 2, 10); });
    });
    // HARNESS 大字
    const kh = prog(b, t('layer') + .3, t('hn') + .5, E.lin) * (1 - prog(b, t('list') - .3, t('list')));
    if (kh > 0) { cx.save(); cx.beginPath(); cx.rect(0, 0, 200 + 1600 * kh, 1080); cx.clip(); txt(cx, 'HARNESS', 960, 560, fnt(400, 300, F.display), WL, 'center'); cx.restore(); circ(cx, 200 + 1600 * kh, 640, 8, YE); }
    // ---------- 爆炸图的字 ----------
    const ke = prog(b, t('list'), t('list') + .3) * (1 - prog(b, t('car') + .6, t('car') + 1));
    if (ke > 0) alpha(cx, ke, () => {
      const [x0, y0] = CEN;
      if (!has3d) engine(cx, x0, y0 + 20, 1.1);
      PARTS.forEach(([n, d], i) => {
        const k = prog(b, PAT[i], PAT[i] + .5, E.out), kf = 1 - prog(b, t('car') + .2, t('car') + .6); if (k <= 0 || kf <= 0) return;
        const cur = b >= PAT[i] && (i === 6 ? b < t('car') : b < PAT[i + 1]);
        cx.save(); cx.globalAlpha *= kf; tx.save(); tx.globalAlpha *= kf;
        const a = -Math.PI / 2 + (i / PARTS.length) * 6.283, R = lerp(900, 360, k), px = x0 + Math.cos(a) * R * 1.12, py = y0 + Math.sin(a) * R * .95;
        if (!has3d) { cx.strokeStyle = WL; cx.lineWidth = 3; cx.strokeRect(px - 46, py - 30, 92, 60); }
        if (k > .9) { cx.setLineDash([6, 6]); seg(cx, x0 + Math.cos(a) * 140, y0 + Math.sin(a) * 100, px - Math.cos(a) * 50, py - Math.sin(a) * 34, rgba(WL, .7), 2); cx.setLineDash([]); }
        alpha(tx, k, () => { const right = Math.cos(a) > .2, left = Math.cos(a) < -.2, al = right ? 'left' : left ? 'right' : 'center', ox = right ? 62 : left ? -62 : 0, oy = right || left ? 0 : Math.sin(a) < 0 ? -56 : 56;
          txt(tx, n, px + ox, py + oy - (d ? 14 : 0), fnt(900, cur ? 40 : 32), cur ? YE : WL, al); if (d) txt(tx, d, px + ox, py + oy + 22, fnt(500, 22), YE, al); txt(tx, String(i + 1), px, py, fnt(700, 26, F.mono), YE, 'center'); });
        cx.restore(); tx.restore();
      });
      const kc = prog(b, t('car'), t('car') + 1, E.lin);
      if (kc > 0) { cx.save(); cx.beginPath(); cx.rect(0, 0, 400 + 1500 * kc, 1080); cx.clip(); car(cx, x0, y0 + 120, 1.9, YE); cx.restore(); }
    });
    const kcar = prog(b, t('car') + 1, t('car') + 1.2) * (1 - prog(b, t('hal0') - .3, t('hal0')));
    if (kcar > 0) alpha(cx, kcar, () => { car(cx, CEN[0], CEN[1] + 120, 1.9, YE); engine(cx, CEN[0], CEN[1] + 40, 1, WL); alpha(tx, kcar, () => { txt(tx, '发动机 = 模型', CEN[0], CEN[1] - 120, fnt(900, 36), WL, 'center'); txt(tx, '整辆车 = harness', CEN[0], CEN[1] + 330, fnt(900, 36), YE, 'center'); }); });
    // ---------- HAL 成绩：尺寸线 ----------
    const kb = prog(b, t('hal0'), t('hal0') + .3) * (1 - prog(b, t('ladder0') - .3, t('ladder0')));
    if (kb > 0) alpha(cx, kb, () => {
      const x0 = 800, W0 = 950;
      alpha(tx, kb, () => { txt(tx, 'Princeton HAL · 2025-12', 800, 260, fnt(700, 30, F.mono), YE); txt(tx, '同一个 Claude Opus 4.5 · CORE-Bench', 800, 305, fnt(700, 30), WL); });
      seg(cx, x0, 360, x0, 840, WL, 3); [0, .5, 1].forEach(p => { seg(cx, x0 + W0 * p, 830, x0 + W0 * p, 850, DIM, 2); alpha(tx, kb, () => txt(tx, Math.round(p * 100) + '%', x0 + W0 * p, 875, fnt(500, 22, F.mono), DIM, 'center')); });
      [['通用框架', .42, OR], ['Claude Code', .78, GN], ['修正评分错误后', .95, YE]].forEach(([n, v, col], i) => {
        const k = prog(b, HAL[i], HAL[i] + .5, E.out); if (k <= 0) return;
        const y = 440 + i * 150;
        cx.strokeStyle = col; cx.lineWidth = 3; cx.strokeRect(x0, y - 34, W0 * v * k, 68);
        dimLine(cx, x0, x0 + W0 * v, y - 60, col, k);
        alpha(tx, k, () => { txt(tx, n, x0 - 24, y, fnt(900, 34), WL, 'right'); txt(tx, Math.round(v * 100 * k) + '%', x0 + W0 * v * k + 24, y, fnt(700, 56, F.mono), col); });
      });
    });
    // ---------- 梯子 ----------
    const kl = prog(b, t('ladder0'), t('ladder0') + .3) * (1 - prog(b, t('ra0') - .3, t('ra0')));
    if (kl > 0) alpha(cx, kl, () => {
      const lx = 1060, rx = 1280, yb = 900, gap = 110;
      seg(cx, lx, yb + 30, lx, yb - gap * 6, WL, 4); seg(cx, rx, yb + 30, rx, yb - gap * 6, WL, 4);
      RUNG.forEach(([n, ex], i) => {
        const on = b >= RAT[i], y = yb - gap * i, top = i === 5 && b >= t('up2');
        const c = top ? RD : on ? YE : rgba(WL, .4); seg(cx, lx, y, rx, y, c, on ? 6 : 3);
        alpha(tx, on ? 1 : .35, () => { txt(tx, n, rx + 40, y - 14, fnt(900, 32), top ? RD : WL); txt(tx, ex, rx + 40, y + 20, fnt(500, 22), on ? YE : DIM); });
      });
      const lv = clamp01(prog(b, t('up'), t('up2') + 1, E.io));
      [[880, '亲眼看的代码', 1 - lv * .85, OR], [600, '需要的检查和隔离', .15 + lv * .85, GN]].forEach(([x, n, v, col]) => {
        alpha(cx, prog(b, t('up'), t('up') + .3), () => { cx.strokeStyle = WL; cx.lineWidth = 2; cx.strokeRect(x - 30, 320, 60, 560); cx.fillStyle = rgba(col, .8); cx.fillRect(x - 24, 874 - 548 * v, 48, 548 * v); alpha(tx, kl, () => txt(tx, n, x, 290, fnt(700, 24), col, 'center')); });
      });
    });
    // ---------- RedAccess 点阵 ----------
    const kd = prog(b, t('ra0'), t('ra0') + .3) * (1 - prog(b, t('spec') - .3, t('spec')));
    if (kd > 0) alpha(cx, kd, () => {
      const cols = 64, rows = 26, x0 = 860, y0 = 380, s = 14;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const id = j * cols + i, red = hash(id * 1.37) < .013, k = prog(b, t('ra0') + (i / cols) * 1.2, t('ra0') + .2 + (i / cols) * 1.2);
        if (k <= 0) continue;
        const lit = red && b >= t('ra1'), x = x0 + i * s, y = y0 + j * s;
        cx.fillStyle = lit ? RD : rgba(WL, .55); cx.fillRect(x, y, lit ? 10 : 6, lit ? 10 : 6);
        if (lit) { cx.strokeStyle = rgba(RD, .7 * (.5 + .5 * Math.sin(tt * 6 + id))); cx.lineWidth = 2; cx.strokeRect(x - 6, y - 6, 22, 22); }
      }
      alpha(tx, kd, () => { txt(tx, '约 38 万个公开应用', x0, 330, fnt(900, 34), WL); const k2 = prog(b, t('ra1'), t('ra1') + .3); alpha(tx, k2, () => txt(tx, '约 5000 个暴露了敏感数据', x0 + 896, 330, fnt(900, 34), RD, 'right')); });
    });
    // ---------- 七项规格表 ----------
    const ks = prog(b, t('spec'), t('spec') + .3) * (1 - prog(b, t('route0') - .3, t('route0')));
    if (ks > 0) alpha(tx, ks, () => {
      const x = 860, y = 230, w = 940;
      tx.strokeStyle = WL; tx.lineWidth = 2; tx.strokeRect(x, y, w, 620); seg(tx, x, y + 80, x + w, y + 80, WL, 2);
      txt(tx, '选工具，看这七项', x + 30, y + 42, fnt(900, 38), WL); txt(tx, 'SPEC · 07', x + w - 30, y + 42, fnt(700, 24, F.mono), YE, 'right');
      SEVEN.forEach((s, i) => {
        const yy = y + 130 + i * 74, on = b >= t('spec') + .3 + i * .35, hl = i === 3 && b >= t('spec4');
        if (hl) { tx.fillStyle = rgba(YE, .14); tx.fillRect(x + 4, yy - 34, w - 8, 68); }
        seg(tx, x, yy + 37, x + w, yy + 37, rgba(WL, .25), 1);
        tx.strokeStyle = on ? YE : rgba(WL, .5); tx.lineWidth = 3; tx.strokeRect(x + 30, yy - 16, 32, 32);
        if (on) { tx.beginPath(); tx.moveTo(x + 36, yy); tx.lineTo(x + 44, yy + 9); tx.lineTo(x + 58, yy - 10); tx.stroke(); }
        txt(tx, s, x + 86, yy, fnt(hl ? 900 : 700, 32), hl ? YE : WL);
      });
    });
    // ---------- 课程路线 ----------
    const kr = prog(b, t('route0'), t('route0') + .3) * (1 - prog(b, t('fight') - .3, t('fight')));
    if (kr > 0) alpha(tx, kr, () => {
      txt(tx, '这门课的路线', 860, 300, fnt(900, 40), YE);
      ROUTE.forEach((s, i) => { const k = prog(b, t('r' + i), t('r' + i) + .3); if (k <= 0) return; alpha(tx, k, () => { circ(tx, 890, 400 + i * 130, 26, null, YE, 3); txt(tx, String(i + 1), 890, 401 + i * 130, fnt(900, 28, F.mono), YE, 'center'); txt(tx, s, 940, 400 + i * 130, fnt(700, 40), WL); }); });
    });
    // ---------- 抢文件 ----------
    const ka = prog(b, t('fight'), t('fight') + .3);
    if (ka > 0) {
      const tear = prog(b, t('fight') + .8, t('fight') + 1.2, E.out), x = 1250, y = 640;
      alpha(cx, ka, () => [-1, 1].forEach(sd => { cx.save(); cx.translate(sd * tear * 60, 0); cx.beginPath(); cx.rect(sd < 0 ? x - 160 : x, y - 100, 160, 200); cx.clip(); cx.strokeStyle = WL; cx.lineWidth = 3; cx.strokeRect(x - 150, y - 90, 300, 180); cx.restore(); }));
      alpha(tx, ka, () => { txt(tx, 'UserService.java', 1250, 640, fnt(700, 26, F.mono), WL, 'center'); if (tear > .3) txt(tx, '冲突', 1250, 520, fnt(900, 44), RD, 'center'); });
    }
    // ---------- Clawd：线框 ----------
    let st = { x: CEN[0], y: CEN[1] + 50, px: 9, skin: 'wire', col: YE, pose: 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: 0, alpha: 0 };
    if (b >= t('list') && b < t('car') + .6) st.alpha = 1;
    if (b >= t('ladder0') && b < t('ra0')) { let i = -1; RAT.forEach((a, j) => { if (b >= a) i = j; }); const k = i >= 0 ? prog(b, RAT[i], RAT[i] + .4, E.io) : 0; st = { ...st, alpha: 1, px: 10, x: 1170, y: 900 - 110 * Math.max(0, i - 1 + k) - 4, pose: 'up', walk: tt * 12 }; if (b >= t('up2')) { st.sweat = b; st.pose = 'idle'; } }
    if (b >= t('fight')) { const k = prog(b, t('fight') + .3, t('fight') + .7, E.io), tear = prog(b, t('fight') + .8, t('fight') + 1.2, E.out); clawd(cx, { ...st, alpha: 1, px: 12, x: lerp(900, 1040, k) - tear * 80, y: 700, pose: 'push', walk: tt * 20, col: YE }); st = { ...st, alpha: 1, px: 12, x: lerp(1600, 1460, k) + tear * 80, y: 700, pose: 'push', walk: tt * 20, col: OR, eye: -1 }; }
    clawd(cx, st);
    narrate(tx, L, S, { sub: { y: 990, col: WL, shadow: 'rgba(0,20,60,.9)', acc: [YE, OR] }, gloss: { bg: 'rgba(14,40,90,.9)', ink: WL, acc: YE, border: rgba(WL, .4) } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD, CH = H.CH;
    Sm.add('crash', 0, 0, 0, 0, .5);
    H.pads(Sm, 0, B, PD, 'glass', .6);
    H.each(0, B, b => { for (let j = 0; j < 16; j++) Sm.add('tick', b, j / 4, 0, 0, j % 4 === 2 ? .45 : .25); });
    H.each(0, B, b => { const r = CH[PD[b % 4]].r + 12; [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 7, 12].forEach((o, j) => Sm.add('bass', b, j / 4, r + o, .22, .45, 'seq')); });
    const d0 = Math.ceil(t('list'));
    H.four(Sm, d0, B, .6); H.back(Sm, d0 + 2, B, 'snare', .4);
    H.hook(Sm, d0, 'bell', 0, 4, 8, .55);
    RAT.forEach((a, i) => Sm.add('bell', a, 0, [74, 76, 77, 79, 81, 84][i], 2.5, .6));
    H.roll(Sm, B - 1, 2, 4, 'snare', 'main', .2, .7, .25);
  },
}, S);
};
})();
