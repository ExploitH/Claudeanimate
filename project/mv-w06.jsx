// 06 Harness · 蓝图：同一台发动机装进两辆车；爆炸图七个部件带引线飞入；HAL 的 42/78/95 用尺寸线标出；六级梯子逐级升调；RedAccess 点阵；选工具七项规格表
(window.MV_W = window.MV_W || {}).w06 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, clamp01 } = K;
const WL = '#eaf4ff', YE = '#ffd75e', OR = '#ff9a4d', RD = '#ff6b6b', GN = '#7dffb0', DIM = 'rgba(234,244,255,.6)';
const PARTS = [['系统提示词', ''], ['工具', '读写文件 · 执行命令 · 搜索 · 浏览器'], ['权限设置', ''], ['上下文管理', '压缩 · 子代理'], ['规则文件', ''], ['hooks', '特定时机自动运行的脚本'], ['反馈', '跑测试 · 代码检查']];
const RUNG = [['行内补全', '打字时补下一段'], ['对话面板', '问答、解释、生成片段'], ['IDE 里的 Agent', 'Qoder · Trae · Cursor'], ['命令行 Agent', 'Claude Code · Codex CLI'], ['云端后台 Agent', '跑完直接提交 PR'], ['应用生成平台', 'Lovable · Bolt · v0']];
const SEVEN = ['在哪写代码：IDE 还是终端', '能用哪些模型，能不能换', '计费方式', '权限控制和撤销功能（检查点）', '是否支持规则文件和 MCP', '国内网络能否直接用', '数据会不会被拿去训练'];
const CEN = [1100, 560];
function engine(ctx, x, y, s, col = WL) { // 发动机线稿
  ctx.strokeStyle = col; ctx.lineWidth = 3;
  ctx.strokeRect(x - 90 * s, y - 50 * s, 180 * s, 100 * s);
  for (let i = 0; i < 3; i++) { ctx.strokeRect(x - 70 * s + i * 50 * s, y - 85 * s, 40 * s, 35 * s); circ(ctx, x - 50 * s + i * 50 * s, y - 95 * s, 8 * s, null, col, 3); }
  circ(ctx, x + 110 * s, y, 24 * s, null, col, 3); seg(ctx, x + 90 * s, y, x + 86 * s, y, col, 3);
}
function car(ctx, x, y, s, col = WL) { // 车身线稿
  ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath();
  ctx.moveTo(x - 300 * s, y + 40 * s); ctx.lineTo(x - 300 * s, y - 20 * s); ctx.lineTo(x - 200 * s, y - 40 * s); ctx.lineTo(x - 120 * s, y - 110 * s); ctx.lineTo(x + 110 * s, y - 110 * s); ctx.lineTo(x + 190 * s, y - 40 * s); ctx.lineTo(x + 300 * s, y - 25 * s); ctx.lineTo(x + 300 * s, y + 40 * s); ctx.closePath(); ctx.stroke();
  [-180, 180].forEach(d => { circ(ctx, x + d * s, y + 40 * s, 55 * s, 'rgba(18,58,122,1)', col, 3); circ(ctx, x + d * s, y + 40 * s, 22 * s, null, col, 2); });
}
function dim(ctx, x0, x1, y, col, label, k = 1) { // 尺寸线
  const x = lerp(x0, x1, k);
  seg(ctx, x0, y - 16, x0, y + 16, col, 2); if (k > .98) seg(ctx, x1, y - 16, x1, y + 16, col, 2);
  arrow(ctx, x0 + 2, y, x, y, col, 2, 12, 1);
}
return {
  scene: '06 蓝图 · Harness', bars: 22, look: 6,
  enter: { kind: TR.WIPE, a: 1, b: 3, col: '#9fd8ff' },
  hud: { num: '06', name: 'Harness', time: '23:00', line: '室友一次就成', ink: WL, acc: YE },
  you: [[.95, 2.15, '室友用同一个模型，一次就写完了？？']],
  rule: { n: 5, at: 18, len: 1.9, text: '弄清工具的权限设置和撤销方式' },
  src: [[7.5, 11, 'Princeton HAL / Sayash Kapoor, 2025-12'], [14, 16, 'RedAccess via Security Boulevard, 2026-05']],
  par: L => [.1 + .25 * L.hit(2.25, .6), 0, 0, 0],
  cam: L => { const b = L.b; return [1 + .015 * Math.sin(L.t * .4) + .05 * prog(b, 3, 6.5, E.io) * (1 - prog(b, 6.5, 7.5, E.io)), 0, 0, 0]; },
  pulse: L => .5,
  sfx: [[1, 'plot'], [1.5, 'ding'], [1.75, 'glitch'], [2.25, 'plot'], [2.6, 'plot'], ...PARTS.map((_, i) => [3.25 + i * .25, 'click']), [6.5, 'plot'], [8, 'plot'], [8.5, 'plot'], [9, 'plot'], [9.05, 'ding'],
    [14, 'tick'], [14.75, 'alarm'], ...SEVEN.map((_, i) => [16.25 + i * .25, 'click']), [19, 'blip', 900], [19.5, 'blip', 1100], [20, 'blip', 1300], [20.75, 'shatter']],
  text: PARTS.flat().join('') + RUNG.flat().join('') + SEVEN.join('') + '同一个模型，换个工具，结果就不一样。模型之外的一切，都叫 harness：同一套 CORE-Bench：换成别的模型工具按自主程度，有六级：越要靠流程兜底病历、银行记录就摆在外面原因：默认公开，没人改成私有这门课的路线还有：同一个模型：这个工具里顺利写完，换个工具就半路出错✓ 顺利写完✗ 半路出错模型差别在模型外面那一层HARNESS模型之外的全部，都算 harness模型是发动机，harness 是整辆车Princeton HAL · 2025-12同一个 Claude Opus 4.5 · CORE-Bench通用框架Claude Code修正评分错误后42%78%95%换成其他模型，差距小得多有的在通用框架里反而更好模型和 harness，放在一起看自主程度：从低到高亲眼看的代码需要的检查和隔离越往上，你亲眼看的代码越少越得靠流程兜底RedAccess · 2026-05扫了约 38 万个 Lovable、Base44、Replit 等平台生成的公开应用约 5000 个暴露了病历、银行记录原因：默认公开，用户没改成私有选工具，看这七项这门课的建议先用 IDEA 里的 Qoder熟悉 Git 和命令行后，再试命令行 Agent应用生成平台，只拿来做原型别让几个 Agent 同时改同一批文件UserService.java冲突',
  draw(cx, tx, L) {
    const b = L.b, t = L.t;
    // ---------- 两辆车，同一台发动机 ----------
    const k1 = prog(b, .95, 1.15) * (1 - prog(b, 2.05, 2.2));
    if (k1 > 0) alpha(cx, k1, () => {
      [[360, 'A', GN, '✓ 顺利写完', 1.5], [700, 'B', RD, '✗ 半路出错', 1.75]].forEach(([y, n, col, s, at]) => {
        car(cx, 1180, y, .9); engine(cx, 1180, y - 20, .55);
        const k = prog(b, at, at + .15);
        if (k > 0) alpha(tx, k, () => { txt(tx, s, 1500, y - 90, fnt(900, 40), col); txt(tx, '工具 ' + n, 860, y - 90, fnt(700, 30, F.mono), DIM, 'right'); });
        if (n === 'B' && b >= 1.75) for (let i = 0; i < 8; i++) { const a = hash(i + Math.floor(t * 12)) * 6.283, r = 30 + hash(i * 3 + Math.floor(t * 12)) * 60; seg(cx, 1180 + 60, y - 40, 1180 + 60 + Math.cos(a) * r, y - 40 + Math.sin(a) * r, RD, 3); }
      });
      txt(tx, '模型', 1180, 545, fnt(700, 28), YE, 'center'); arrow(tx, 1180, 520, 1180, 380, rgba(YE, .7), 2, 10); arrow(tx, 1180, 570, 1180, 650, rgba(YE, .7), 2, 10);
    });
    // HARNESS 大字（内容层，会被描边）
    const kh = prog(b, 2.25, 2.85, E.lin) * (1 - prog(b, 2.95, 3.1));
    if (kh > 0) {
      cx.save(); cx.beginPath(); cx.rect(0, 0, 200 + 1600 * kh, 1080); cx.clip();
      txt(cx, 'HARNESS', 960, 780, fnt(400, 260, F.display), WL, 'center'); cx.restore();
      circ(cx, 200 + 1600 * kh, 700, 8, YE);
    }
    // ---------- 爆炸图 ----------
    const ke = prog(b, 3, 3.2) * (1 - prog(b, 7.35, 7.5));
    if (ke > 0) alpha(cx, ke, () => {
      const [x0, y0] = CEN;
      engine(cx, x0, y0 + 20, 1.1);
      PARTS.forEach(([n, d], i) => {
        const at = 3.25 + i * .25, k = prog(b, at, at + .2, E.out), kf = 1 - prog(b, 6.35, 6.55); if (k <= 0 || kf <= 0) return;
        cx.save(); cx.globalAlpha *= kf; tx.save(); tx.globalAlpha *= kf;
        const a = -Math.PI / 2 + (i / PARTS.length) * 6.283, R = lerp(900, 360, k), px = x0 + Math.cos(a) * R * 1.12, py = y0 + Math.sin(a) * R * .95;
        cx.strokeStyle = WL; cx.lineWidth = 3; cx.strokeRect(px - 46, py - 30, 92, 60);
        if (k > .9) { cx.setLineDash([6, 6]); seg(cx, x0 + Math.cos(a) * 140, y0 + Math.sin(a) * 100, px - Math.cos(a) * 50, py - Math.sin(a) * 34, rgba(WL, .7), 2); cx.setLineDash([]); }
        alpha(tx, k, () => { const right = Math.cos(a) > .2, left = Math.cos(a) < -.2, al = right ? 'left' : left ? 'right' : 'center', ox = right ? 62 : left ? -62 : 0, oy = right || left ? 0 : Math.sin(a) < 0 ? -56 : 56;
          txt(tx, n, px + ox, py + oy - (d ? 14 : 0), fnt(900, 34), WL, al); if (d) txt(tx, d, px + ox, py + oy + 22, fnt(500, 22), YE, al); txt(tx, String(i + 1), px, py, fnt(700, 26, F.mono), YE, 'center'); });
        cx.restore(); tx.restore();
      });
      const kc = prog(b, 6.5, 7, E.lin);
      if (kc > 0) { cx.save(); cx.beginPath(); cx.rect(0, 0, 400 + 1500 * kc, 1080); cx.clip(); car(cx, x0, y0 + 120, 1.9, YE); cx.restore(); }
    });
    // ---------- HAL 成绩：尺寸线 ----------
    const kb = prog(b, 7.5, 7.7) * (1 - prog(b, 10.85, 11));
    if (kb > 0) alpha(cx, kb, () => {
      const x0 = 800, W0 = 950;
      seg(cx, x0, 360, x0, 840, WL, 3); [0, .5, 1].forEach(p => { seg(cx, x0 + W0 * p, 830, x0 + W0 * p, 850, DIM, 2); alpha(tx, kb, () => txt(tx, Math.round(p * 100) + '%', x0 + W0 * p, 875, fnt(500, 22, F.mono), DIM, 'center')); });
      [['通用框架', .42, 8, OR], ['Claude Code', .78, 8.5, GN], ['修正评分错误后', .95, 9, YE]].forEach(([n, v, at, col], i) => {
        const k = prog(b, at, at + .3, E.out); if (k <= 0) return;
        const y = 440 + i * 150;
        cx.strokeStyle = col; cx.lineWidth = 3; cx.strokeRect(x0, y - 34, W0 * v * k, 68);
        dim(cx, x0, x0 + W0 * v, y - 60, col, '', k);
        alpha(tx, k, () => { txt(tx, n, x0 - 24, y, fnt(900, 34), WL, 'right'); txt(tx, Math.round(v * 100 * k) + '%', x0 + W0 * v * k + 24, y, fnt(700, 56, F.mono), col); });
      });
    });
    // ---------- 梯子 ----------
    const kl = prog(b, 10.95, 11.1) * (1 - prog(b, 13.85, 14));
    if (kl > 0) alpha(cx, kl, () => {
      const lx = 1060, rx = 1280, yb = 900, gap = 110;
      seg(cx, lx, yb + 30, lx, yb - gap * 6, WL, 4); seg(cx, rx, yb + 30, rx, yb - gap * 6, WL, 4);
      RUNG.forEach(([n, ex], i) => {
        const at = 11 + i * .5, on = b >= at, y = yb - gap * i, top = i === 5 && b >= 13.5;
        cx.strokeStyle = top ? RD : on ? YE : rgba(WL, .4); cx.lineWidth = on ? 6 : 3; seg(cx, lx, y, rx, y, cx.strokeStyle, cx.lineWidth);
        alpha(tx, on ? 1 : .35, () => { txt(tx, n, rx + 40, y - 14, fnt(900, 32), top ? RD : WL); txt(tx, ex, rx + 40, y + 20, fnt(500, 22), on ? YE : DIM); });
      });
      // 两侧量表
      const lv = clamp01((b - 11) / 2.5);
      [[880, '亲眼看的代码', 1 - lv * .85, OR], [600, '需要的检查和隔离', .15 + lv * .85, GN]].forEach(([x, n, v, col]) => {
        cx.strokeStyle = WL; cx.lineWidth = 2; cx.strokeRect(x - 30, 320, 60, 560); cx.fillStyle = rgba(col, .8); cx.fillRect(x - 24, 874 - 548 * v, 48, 548 * v);
        alpha(tx, kl, () => txt(tx, n, x, 290, fnt(700, 24), col, 'center'));
      });
    });
    // ---------- RedAccess 点阵 ----------
    const kd = prog(b, 14, 14.2) * (1 - prog(b, 15.85, 16));
    if (kd > 0) alpha(cx, kd, () => {
      const cols = 64, rows = 26, x0 = 860, y0 = 380, s = 14;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const id = j * cols + i, red = hash(id * 1.37) < .013, k = prog(b, 14 + (i / cols) * .5, 14.1 + (i / cols) * .5);
        if (k <= 0) continue;
        const lit = red && b >= 14.75, x = x0 + i * s, y = y0 + j * s;
        cx.fillStyle = lit ? RD : rgba(WL, .55); cx.fillRect(x, y, lit ? 10 : 6, lit ? 10 : 6);
        if (lit) { cx.strokeStyle = rgba(RD, .7 * (.5 + .5 * Math.sin(t * 6 + id))); cx.lineWidth = 2; cx.strokeRect(x - 6, y - 6, 22, 22); }
      }
    });
    // ---------- 七项规格表（字幕层） ----------
    const ks = prog(b, 16, 16.2) * (1 - prog(b, 18.85, 19));
    if (ks > 0) alpha(tx, ks, () => {
      const x = 860, y = 250, w = 940;
      tx.strokeStyle = WL; tx.lineWidth = 2; tx.strokeRect(x, y, w, 620); seg(tx, x, y + 80, x + w, y + 80, WL, 2);
      txt(tx, '选工具，看这七项', x + 30, y + 42, fnt(900, 38), WL); txt(tx, 'SPEC · 07', x + w - 30, y + 42, fnt(700, 24, F.mono), YE, 'right');
      SEVEN.forEach((s, i) => {
        const yy = y + 130 + i * 74, on = b >= 16.25 + i * .25;
        seg(tx, x, yy + 37, x + w, yy + 37, rgba(WL, .25), 1);
        tx.strokeStyle = on ? YE : rgba(WL, .5); tx.lineWidth = 3; tx.strokeRect(x + 30, yy - 16, 32, 32);
        if (on) { tx.beginPath(); tx.moveTo(x + 36, yy); tx.lineTo(x + 44, yy + 9); tx.lineTo(x + 58, yy - 10); tx.stroke(); }
        txt(tx, s, x + 86, yy, fnt(i === 3 ? 900 : 700, 32), i === 3 && on ? YE : WL);
      });
    });
    // ---------- 课程建议 + 抢文件 ----------
    const ka = prog(b, 19, 19.15) * (1 - prog(b, 21.85, 22));
    if (ka > 0) {
      const tear = prog(b, 20.75, 21.1, E.out);
      alpha(cx, ka * prog(b, 20.5, 20.6), () => {
        const x = 1250, y = 640;
        [-1, 1].forEach(sd => { cx.save(); cx.translate(sd * tear * 60, 0); cx.beginPath(); cx.rect(sd < 0 ? x - 160 : x, y - 100, 160, 200); cx.clip(); cx.strokeStyle = WL; cx.lineWidth = 3; cx.strokeRect(x - 150, y - 90, 300, 180); cx.restore(); });
        alpha(tx, ka * prog(b, 20.5, 20.6), () => { txt(tx, 'UserService.java', 1250, 640, fnt(700, 26, F.mono), WL, 'center'); if (tear > .3) txt(tx, '冲突', 1250, 520, fnt(900, 44), RD, 'center'); });
      });
    }
    // ---------- Clawd：线框 ----------
    let st = { x: CEN[0], y: CEN[1] + 50, px: 9, skin: 'wire', col: YE, pose: 'idle', ph: t * 10, blink: (t % 3) < .1, eye: 0, alpha: 0 };
    if (b >= 3 && b < 7.4) { st.alpha = 1; }
    if (b >= 11 && b < 14) { const i = Math.min(5, Math.floor((b - 11) * 2)), k = prog(((b - 11) * 2) % 1, 0, .4, E.io); st = { ...st, alpha: 1, px: 10, x: 1170, y: 900 - 110 * Math.min(5, i + (i < 5 ? k : 0)) - 4, pose: 'up', walk: t * 12 }; if (b >= 13.5) { st.sweat = b - 13.5; st.pose = 'idle'; } }
    if (b >= 20.5 && b < 22) { const k = prog(b, 20.5, 20.75, E.io), tear = prog(b, 20.75, 21.1, E.out); clawd(cx, { ...st, alpha: 1, px: 12, x: lerp(900, 1040, k) - tear * 80, y: 700, pose: 'push', walk: t * 20, col: YE }); st = { ...st, alpha: 1, px: 12, x: lerp(1600, 1460, k) + tear * 80, y: 700, pose: 'push', walk: t * 20, col: OR, eye: -1 }; }
    clawd(cx, st);
    // ---------- 歌词 ----------
    const LX = 110, ink = { col: WL, acc: [YE, OR] };
    lyric(tx, L, { at: 1.25, out: 2.15, text: '‹同一个模型›，', x: LX, y: 330, size: 66, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 1.45, out: 2.15, text: '换个工具，\n结果就不一样。', x: LX, y: 470, size: 44, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 2.25, out: 2.95, text: '差别在模型外面那一层', x: 960, y: 520, size: 52, w: 900, ...ink, align: 'center', anim: 'type' });
    lyric(tx, L, { at: 3.1, out: 6.4, text: '模型之外的一切，\n都叫 ‹harness›：', x: LX, y: 230, size: 46, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 6.5, out: 7.4, text: '模型是‹发动机›，\nharness 是‹整辆车›', x: LX, y: 230, size: 56, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 7.5, out: 10.85, text: 'Princeton HAL · 2025-12', x: LX, y: 230, size: 30, fam: F.mono, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 7.6, out: 10.85, text: '同一个 Claude Opus 4.5\n同一套 CORE-Bench：', x: LX, y: 320, size: 40, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 10, out: 10.85, text: '换成别的模型，差距小得多，\n有的在通用框架里反而更好', x: LX, y: 940, size: 34, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 10.4, out: 10.85, text: '→ 模型和 harness，‹放在一起看›', x: 1100, y: 960, size: 40, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 11, out: 13.85, text: '工具按自主程度，\n有‹六级›：', x: LX, y: 260, size: 48, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 12.5, out: 13.85, text: '越往上，\n你亲眼看的代码越少，\n越要靠‹流程›兜底', x: LX, y: 560, size: 40, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 14, out: 15.85, text: 'RedAccess · 2026-05', x: LX, y: 260, size: 30, fam: F.mono, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 14.1, out: 15.85, text: '扫了约 ‹38 万›个\nLovable、Base44、Replit 等\n平台生成的公开应用', x: LX, y: 400, size: 36, w: 900, ...ink, anim: 'type' });
    lyric(tx, L, { at: 14.75, out: 15.85, text: '约 «5000» 个，\n病历、银行记录就摆在外面', x: LX, y: 610, size: 44, w: 900, ...ink, acc: [YE, RD], anim: 'type' });
    lyric(tx, L, { at: 15.25, out: 15.85, text: '原因：默认公开，没人改成私有', x: LX, y: 780, size: 32, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 19, out: 21.85, text: '这门课的路线', x: LX, y: 220, size: 34, w: 700, ...ink, anim: 'type' });
    [['先用 IDEA 里的 ‹Qoder›', 19], ['熟悉 Git 和命令行后，\n再试‹命令行 Agent›', 19.5], ['应用生成平台，只拿来做‹原型›', 20]].forEach(([s, at], i) => lyric(tx, L, { at, out: 21.85, text: (i + 1) + '  ' + s, x: LX, y: 320 + i * 120 + (i === 2 ? 30 : 0), size: 38, w: 900, ...ink, anim: 'type' }));
    lyric(tx, L, { at: 20.5, out: 21.85, text: '还有：别让几个 Agent\n同时改‹同一批文件›', x: 1000, y: 330, size: 44, w: 900, ...ink, acc: [RD], anim: 'type' });
  },
};
};
