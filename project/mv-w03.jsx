// 03 提示词 · 印刷：riso 双色海报。一句话长出问号树，Clawd 闭眼瞎挑；五色版式拆出提示词五部分；清楚版提示词分色排版；老套路便签贴上又抖掉
(window.MV_W = window.MV_W || {}).w03 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd } = K;
const BLUE = '#2a4fd0', PINK = '#ff3d9a', YEL = '#ffd23a', ORG = '#ff6a2a', GRN = '#14a05a', INK = '#1f1b2e';
const QS = [['密码怎么存？', ['明文存', '加密存']], ['要不要注册？', ['带注册', '只做登录']], ['输错几次锁定？', ['不锁定', '5 次锁 15 分钟']], ['Session 还是 Token？', ['Session', 'Token']]];
const QX = [270, 680, 1090, 1500], GUESS = [0, 1, 0, 1];
const PARTS = [['目标', BLUE, '要做成什么'], ['背景', GRN, '用什么技术\n相关代码在哪'], ['约束', ORG, '哪些文件别碰\n能不能加依赖'], ['验收标准', PINK, '怎样算做完\n怎么验证'], ['参考', YEL, '已有的类似\n代码或示例']];
const SEGS = [[0, '在 UserService 里', 1], [0, '加一个 login(username, password) 方法。', 0], [1, '密码用项目里已有的 PasswordUtil.verify() 校验。', 4],
  [2, '连续输错 5 次锁定 15 分钟。', 0], [3, '不要修改 User 类的字段，不要加新依赖。', 2], [4, '写完补 JUnit 测试，覆盖登录成功、密码错误、', 3], [5, '账号锁定三种情况，并运行通过。', 3]];
const SEG_AT = [9, 9.25, 9.5, 9.75, 10, 10.25, 10.4];
const STK = [['你是世界顶级程序员', -.12, -150, -110], ['必须!!!', .18, 120, -40], ['给你小费 $', -.06, -40, 70]];
const CL = [1640, 880];
return {
  scene: '03 印刷 · 提示词', bars: 18, look: 3,
  enter: { kind: TR.WIPE, a: 1, b: 3, col: PINK },
  hud: { num: '03', name: '提示词', world: '印刷', ink: INK, acc: PINK, mv: [.55, .95] },
  rule: { n: 2, at: 16.5, text: '提示词写清目标、背景、约束、验收标准' },
  src: [[8, 13, 'Anthropic, Prompting best practices'], [15.25, 16.5, 'Anthropic, Prompting best practices']],
  par: L => { const b = L.b, h = Math.max(L.hit(1, .4), L.hit(4, .5), L.hit(16, .4)); return [.5 + 2.2 * h, 1, 0, 0]; },
  cam: L => { const b = L.b, h = L.hit(4, .3) + L.hit(1, .25); return [1 + .03 * h, -.006 + .02 * L.hit(4, .3) * Math.sin(L.t * 60), 0, 0]; },
  pulse: L => .7,
  sfx: [[1, 'stamp'], ...QX.map((_, i) => [1.5 + i * .25, 'q', 520 + i * 90]), ...[0, 1, 2, 3, 4, 5, 6, 7].map(i => [2.5 + i * .0625, 'blip', 900 + i * 60]), ...GUESS.map((_, i) => [3 + i * .25, 'pop']),
    [4, 'scratch'], [4, 'stamp'], ...PARTS.map((_, i) => [5 + i * .25, 'stamp']), ...[6.5, 6.75, 7, 7.25].map(b => [b, 'snip']), [8.25, 'stamp'],
    ...SEG_AT.map(b => [b, 'paper']), [13, 'swish'], ...[13.25, 13.5, 13.75, 14].map(b => [b, 'stamp']), [14.25, 'swish'], ...STK.map((_, i) => [15.25 + i * .25, 'stick']), [16, 'whoosh'], [16, 'scratch']],
  text: QS.flat(2).join('') + PARTS.flat().join('') + SEGS.map(s => s[1]).join('') + STK.map(s => s[0]).join('') + '帮我写个登录功能每个没说的地方，我只能自己挑GARBAGE IN, GARBAGE OUT输入含糊，输出就靠不住写清楚，分五部分12345再顺手写一句为什么官方指南也这么建议：知道原因，我判断得更贴合WHY?同一个需求，写清楚以后：报错的时候，给我四样完整报错和堆栈你做了什么操作你期望的结果实际的结果界面出问题？直接甩截图大任务拆小，一个对话只干一件事没想清楚？先让我提问，或者先出方案这些老套路，用不着了语气太重，我反而用力过猛正常说话就好≠ 你想要的',
  draw(cx, tx, L) {
    const b = L.b, t = L.t;
    // 背景版线
    alpha(cx, .5, () => { for (let i = 0; i < 6; i++) seg(cx, 140 + i * 330, 120, 140 + i * 330, 980, rgba(BLUE, .14), 1.5); seg(cx, 140, 140, 1780, 140, rgba(BLUE, .2), 1.5); });
    // ---------- 问号树 ----------
    const kt = (1 - prog(b, 4.75, 5, E.in)) * (1 - .8 * prog(b, 3.95, 4.05));
    if (b >= 1.4 && kt > 0) alpha(cx, kt, () => {
      const rx = 560, ry = 300;
      QS.forEach(([q, opts], i) => {
        const at = 1.5 + i * .25, k = prog(b, at, at + .15, E.out); if (k <= 0) return;
        const x = QX[i], y = 520;
        cx.strokeStyle = INK; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(rx, ry); cx.lineTo(lerp(rx, x, k), lerp(ry, y - 40, k)); cx.stroke();
        scaleAt(cx, x, y, E.back(k), () => { rr(cx, x - 170, y - 40, 340, 80, 6, YEL, INK, 3); txt(cx, q, x, y, fnt(900, 32), INK, 'center'); });
        opts.forEach((o, j) => {
          const a2 = 2.5 + (i * 2 + j) * .0625, k2 = prog(b, a2, a2 + .1, E.out); if (k2 <= 0) return;
          const lx = x + (j ? 90 : -90), ly = 700, picked = b >= 3 + i * .25 && GUESS[i] === j;
          seg(cx, x, y + 40, lerp(x, lx, k2), lerp(y + 40, ly - 30, k2), picked ? PINK : INK, picked ? 7 : 3);
          rr(cx, lx - 84, ly - 30, 168, 60, 30, picked ? rgba(PINK, .85) : rgba(BLUE, .35), picked ? PINK : BLUE, 3);
          txt(cx, o, lx, ly, fnt(700, o.length > 6 ? 20 : 26), INK, 'center');
          if (!picked) txt(cx, '?', lx + 70, ly - 34, fnt(900, 30, F.poster), PINK, 'center');
        });
      });
      const kr = prog(b, 3.9, 4.1);
      if (kr > 0) alpha(cx, kr, () => { rr(cx, 1060, 790, 380, 90, 8, null, PINK, 5); txt(cx, '≠ 你想要的', 1250, 835, fnt(900, 44), PINK, 'center'); });
    });
    // ---------- 五部分 ----------
    const kp = prog(b, 4.95, 5) * (1 - prog(b, 7.9, 8.2, E.in));
    if (kp > 0) alpha(cx, kp, () => PARTS.forEach(([n, col, d], i) => {
      const at = 5 + i * .25, k = prog(b, at, at + .14, E.back); if (k <= 0) return;
      const x = 140 + i * 330, y = lerp(-300, 330, Math.min(1, k)), dark = col === YEL;
      rotAt(cx, x + 150, y + 210, (hash(i * 3) - .5) * .05, () => {
        rr(cx, x, y, 300, 430, 4, col);
        txt(cx, String(i + 1), x + 24, y + 70, fnt(400, 110, F.poster), dark ? INK : '#fff6ea');
        txt(cx, n, x + 24, y + 200, fnt(400, n.length > 2 ? 54 : 70, F.poster), dark ? INK : '#fff6ea');
        d.split('\n').forEach((l, j) => txt(cx, l, x + 26, y + 300 + j * 40, fnt(700, 28), dark ? INK : '#fff6ea'));
      });
    }));
    // 被剪掉的问号
    [6.5, 6.75, 7, 7.25].forEach((at, i) => {
      if (b < 5.2 || b > 8.2) return;
      const x = 300 + i * 360, y0 = 820, f = prog(b, at, at + .5, E.in);
      alpha(cx, 1 - f, () => rotAt(cx, x, y0 + f * 500, f * 2, () => { circ(cx, x, y0 + f * 500, 34, PINK); txt(cx, '?', x, y0 + f * 500 + 2, fnt(400, 48, F.poster), '#fff6ea', 'center'); }));
    });
    // ---------- 为什么 ----------
    const kw = prog(b, 8.25, 8.4, E.back) * (1 - prog(b, 8.9, 9, E.in));
    if (kw > 0) scaleAt(cx, 1420, 520, kw * (1 + .4 * (1 - Math.min(1, kw))), () => rotAt(cx, 1420, 520, -.15, () => { circ(cx, 1420, 520, 170, YEL, INK, 5); txt(cx, 'WHY?', 1420, 500, fnt(400, 96, F.poster), INK, 'center'); txt(cx, '为什么', 1420, 590, fnt(900, 44), INK, 'center'); }));
    // ---------- 清楚版提示词 ----------
    if (b >= 8.95 && b < 13.1) alpha(cx, prog(b, 8.95, 9.1) * (1 - prog(b, 12.85, 13.05)), () => {
      const X = 150, Y = 340, LH = 94; cx.font = fnt(700, 46);
      const xs = [X, X, X, X, X, X, X];
      SEGS.forEach(([ln, s, pi], i) => {
        const k = prog(b, SEG_AT[i], SEG_AT[i] + .15, E.out); if (k <= 0) return;
        cx.font = fnt(700, 46); let x = X; for (let j = 0; j < i; j++) if (SEGS[j][0] === ln) x += cx.measureText(SEGS[j][1]).width;
        const w = cx.measureText(s).width, y = Y + ln * LH, col = PARTS[pi][1];
        cx.fillStyle = mixC(col, '#f4ecdc', .55); cx.fillRect(x - 4, y - 30, (w + 8) * k, 60);
        alpha(cx, k, () => { cx.fillStyle = INK; cx.fillText(s, x, y); });
        const tag = PARTS[pi][0]; if (i === 0 || SEGS[i - 1][2] !== pi) alpha(cx, k, () => txt(cx, tag, x + 4, y - 50, fnt(900, 22), col === YEL ? INK : col));
      });
    });
    // ---------- 报错四样 ----------
    const ERR = ['完整报错和堆栈', '你做了什么操作', '你期望的结果', '实际的结果'];
    if (b >= 13 && b < 14.4) alpha(cx, 1 - prog(b, 14.15, 14.35), () => ERR.forEach((s, i) => {
      const at = 13.25 + i * .25, k = prog(b, at, at + .12, E.back); if (k <= 0) return;
      const x = 160 + (i % 2) * 620, y = 420 + Math.floor(i / 2) * 170;
      scaleAt(cx, x + 280, y + 60, lerp(1.3, 1, Math.min(1, k)), () => rotAt(cx, x + 280, y + 60, (i % 2 ? .03 : -.03), () => { rr(cx, x, y, 560, 120, 6, null, [BLUE, PINK, GRN, ORG][i], 6); txt(cx, (i + 1) + '  ' + s, x + 36, y + 62, fnt(900, 44), [BLUE, PINK, GRN, ORG][i]); }));
    }));
    // ---------- Clawd ----------
    let st = { x: CL[0], y: CL[1], px: 14, col: ORG, hi: '#ff9a6a', pose: 'idle', ph: t * 10, blink: (t % 3) < .1, eye: -1 };
    if (b >= 1 && b < 1.15) st.squash = 1 - .2 * Math.sin(Math.PI * prog(b, 1, 1.15, E.lin));
    if (b >= 1.4 && b < 3) { st.q = 1; st.eye = -1; }
    if (b >= 3 && b < 4) { st.blink = true; st.pose = 'pointL'; }
    if (b >= 4 && b < 4.9) { st.pose = 'cover'; st.sweat = b - 4; }
    if (b >= 6.3 && b < 7.6) { st.pose = 'point'; st.ph = t * 30; st.x = lerp(CL[0], 1500, prog(b, 6.3, 6.5)); }
    if (b >= 9 && b < 13) { st.pose = 'type'; st.ph = t * 22; st.x = 1700; st.y = 900; }
    // 便签贴上 Clawd，又被抖掉
    const sx = 1300, sy = 640;
    if (b >= 15) { st.x = sx; st.y = sy + 120; st.px = 20; st.eye = 0; if (b >= 16 && b < 16.3) { st.x += (hash(Math.floor(t * 40)) - .5) * 30; st.squash = 1 + .15 * Math.sin(t * 60); } if (b >= 16.3) st.eyeShape = 'happy'; }
    clawd(cx, st);
    if (b >= 15.2) STK.forEach(([s, r, dx, dy], i) => {
      const at = 15.25 + i * .25, k = prog(b, at, at + .1, E.out), f = prog(b, 16.05, 16.5, E.in); if (k <= 0) return;
      const fx = (hash(i * 7) - .5) * 1400 * f, fy = -300 * f + 1400 * f * f;
      alpha(cx, 1 - prog(b, 16.35, 16.5), () => rotAt(cx, sx + dx + fx, sy + dy + fy, r + f * (i - 1) * 3, () => scaleAt(cx, sx + dx + fx, sy + dy + fy, lerp(1.5, 1, k), () => {
        cx.font = fnt(900, 36); const w = cx.measureText(s).width + 50;
        rr(cx, sx + dx + fx - w / 2, sy + dy + fy - 34, w, 68, 3, [YEL, PINK, GRN][i]); txt(cx, s, sx + dx + fx, sy + dy + fy, fnt(900, 36), INK, 'center');
      })));
    });
    // ---------- 歌词 ----------
    const LX = 140;
    lyric(tx, L, { at: 1, out: 4.75, text: '「帮我写个登录功能」', x: LX, y: 230, size: 120, fam: F.poster, w: 400, col: BLUE, anim: 'stamp', d: .1, outAnim: 'up' });
    lyric(tx, L, { at: 3, out: 3.95, text: '每个没说的地方，我只能‹自己挑›', x: LX, y: 870, size: 48, w: 900, col: INK, acc: [PINK], anim: 'rise' });
    lyric(tx, L, { at: 4, out: 4.9, text: 'GARBAGE IN,\nGARBAGE OUT', x: 900, y: 520, size: 150, fam: F.poster, w: 400, col: PINK, align: 'center', anim: 'stamp', d: .08, lh: 1.05, outAnim: 'cut' });
    lyric(tx, L, { at: 4.4, out: 4.9, text: '输入含糊，输出就靠不住', x: 900, y: 790, size: 40, w: 900, col: INK, align: 'center', anim: 'fade' });
    lyric(tx, L, { at: 5, out: 7.9, text: '写清楚，分五部分', x: LX, y: 230, size: 56, w: 900, col: INK, anim: 'slide' });
    lyric(tx, L, { at: 8.25, out: 8.9, text: '再顺手写一句：«为什么»', x: LX, y: 440, size: 72, w: 900, col: INK, acc: [PINK, PINK], anim: 'slide' });
    lyric(tx, L, { at: 8.4, out: 8.9, text: '官方指南也这么建议：\n知道原因，我判断得更贴合', x: LX, y: 600, size: 38, w: 700, col: INK, anim: 'fade' });
    lyric(tx, L, { at: 9, out: 12.9, text: '同一个需求，写清楚以后：', x: LX, y: 220, size: 40, w: 900, col: INK, anim: 'type' });
    lyric(tx, L, { at: 13, out: 14.15, text: '报错的时候，给我‹四样›', x: LX, y: 280, size: 60, w: 900, col: INK, acc: [PINK], anim: 'slide' });
    lyric(tx, L, { at: 13.6, out: 14.15, text: '界面出问题？直接甩截图', x: LX, y: 820, size: 38, w: 700, col: BLUE, anim: 'fade' });
    lyric(tx, L, { at: 14.25, out: 15.15, text: '大任务拆小，\n一个对话只干‹一件事›', x: LX, y: 420, size: 72, w: 900, col: INK, acc: [BLUE], anim: 'stamp', d: .1, outAnim: 'up' });
    lyric(tx, L, { at: 14.6, out: 15.15, text: '没想清楚？先让我提问，或者先出方案', x: LX, y: 620, size: 40, w: 700, col: INK, anim: 'fade' });
    lyric(tx, L, { at: 16, out: 17.8, text: '这些老套路，用不着了', x: LX, y: 280, size: 60, w: 900, col: INK, anim: 'slide' });
    lyric(tx, L, { at: 16.2, out: 17.8, text: '语气太重，我反而用力过猛\n‹正常说话›就好', x: LX, y: 440, size: 48, w: 700, col: INK, acc: [PINK], anim: 'fade' });
  },
};
};
