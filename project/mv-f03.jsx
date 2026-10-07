// 第三章 · 21:20「帮我写个登录」：提示词
// f03a 现实：你只发了一句「帮我写个登录功能」，代码刷刷地出来，带了注册、明文存密码
// f03b 印刷：一句话长出问号树，Clawd 闭眼挑；GARBAGE IN, GARBAGE OUT；五部分（每部分配例子），剪掉问号；为什么；
//      清楚版提示词全文；报错给四样；大活拆小；老咒语便签抖掉；规则 2
(() => {
const R = (window.MV_W = window.MV_W || {});
const BAD = ['public void register(String u, String p) {', '    users.save(new User(u, p)); // 明文存密码', '}', 'public boolean login(String u, String p) {', '    User x = users.find(u);', '    if (x != null && x.password.equals(p)) {', '        session.setAttribute("user", x);', '        rememberMe(u, 30); // 记住密码 30 天', '        return true;', '    }', '    return false;', '}'];

R.f03a = K => window.MV_REAL(K, {
  scene: '03 · 21:20 帮我写个登录',
  desc: '你只发了一句「帮我写个登录功能」，代码一下子刷出来：带注册、记住密码、密码明文存。',
  clock: [21, 20], stamp: ['周五', '21:20'],
  steps: [
    { pause: .75 },
    { id: 'ask', you: '帮我写个登录功能。' },
    { id: 'ok', me: '好的！' },
    { id: 'code', pause: 2.5 },
    { id: 'done', me: '写好了：带注册、记住密码 30 天，用 Session 保存登录状态，密码先直接存进数据库。' },
    { id: 'huh', you: '……注册？我没说要注册啊。密码直接存？', enter: false },
    { me: '你也没说不要。' },
    { id: 'go', me: '我们回头看看你刚才那句话。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'over', 0], [S.t('code') - .3, 'screen', 0], [S.t('huh'), 'desk', 1.4], [S.t('go'), 'over', 1.2], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  code: [...BAD, ...BAD],
  codeScroll: (L, S) => Math.min(330, Math.max(0, (L.b - S.t('code')) * 120)),
  figure: (L, S) => ({ type: L.b >= S.t('ask') && L.b < S.t('ask') + .6 ? 1 : 0, lean: K.prog(L.b, S.t('huh'), S.t('huh') + .4) * .4, yaw: 0 }),
  sfx: S => [...Array.from({ length: 18 }, (_, i) => [S.t('code') + i * .13, 'key', .5]), [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .7);
    H.each(0, Math.floor(M.t('push')), b => { const c = H.CH[H.PD[b % 4]]; S.add('pad', b, 0, c.pad, 4, .3, 'warm'); });
    H.each(Math.floor(M.t('code')), Math.floor(M.t('code')) + 2, b => { for (let j = 0; j < 8; j++) S.add('tick', b, j / 2, 0, 0, .5); });
    S.add('piano', M.t('huh'), 0, [57, 60, 64], 3, .4);
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .5);
  },
});

R.f03b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, seq, narrate, scene } = K;
const BLUE = '#2a4fd0', PINK = '#ff3d9a', YEL = '#ffd23a', ORG = '#ff6a2a', GRN = '#14a05a', INK = '#1f1b2e', CREAM = '#f4ecdc';
const QS = [['密码怎么存？', ['明文存', '加密存']], ['要不要注册？', ['带注册', '只做登录']], ['输错几次锁定？', ['不锁定', '5 次锁 15 分钟']], ['Session 还是 Token？', ['Session', 'Token']]];
const QX = [270, 680, 1090, 1500], GUESS = [0, 0, 0, 0];
const PARTS = [['目标', BLUE, '要做成什么', '加一个 login 方法'], ['背景', GRN, '用什么技术\n相关代码在哪', '用已有的 PasswordUtil'], ['约束', ORG, '哪些别碰\n能不能加依赖', '不改 User 字段'], ['验收标准', PINK, '怎样算做完\n怎么验证', 'JUnit 测试三种情况'], ['参考', YEL, '类似的代码\n或示例', '仿照 BookService']];
const SEGS = [[0, '在 UserService 里', 1], [0, '加一个 login(username, password) 方法。', 0], [1, '密码用项目里已有的 PasswordUtil.verify() 校验。', 1],
  [2, '连续输错 5 次锁定 15 分钟。', 0], [3, '不要修改 User 类的字段，不要加新依赖。', 2], [4, '写完补 JUnit 测试，覆盖登录成功、密码错误、', 3], [5, '账号锁定三种情况，并运行通过。', 3]];
const STK = [['你是世界顶级程序员', -.12, -150, -110], ['必须!!!', .18, 120, -40], ['给你小费 $200', -.06, -40, 70]];
const ERR = ['完整报错和堆栈', '你做了什么操作', '你期望的结果', '实际的结果'];
const S = seq([
  { id: 'poster', say: '你发给我的，只有这一句。', hold: .5 },
  { id: 'gap', say: '可这句话里，没说清楚的事太多了。' },
  { id: 'q0', say: '密码怎么存？明文，还是加密？' },
  { id: 'q1', say: '要不要做注册？' },
  { id: 'q2', say: '密码输错几次，要锁定账号？' },
  { id: 'q3', say: '登录状态，用 Session 还是 Token？', gloss: ['Session / Token', '', '两种记住「你已经登录了」的常见做法。'], until: 'pick' },
  { id: 'pick', say: '每一个没说的地方，我都只能自己挑一种。', hold: .75 },
  { id: 'neq', say: '挑中的，不一定是你想要的。', hold: .5 },
  { id: 'gigo', say: '这就是常说的：垃圾进，垃圾出。', hold: .5 },
  { id: 'gigo2', say: '输入含糊，输出就靠不住。', hold: .75 },
  { id: 're', say: '那我们换个写法。' },
  { id: 'five', say: '一条写清楚的提示词，有五个部分：' },
  { id: 'p0', say: '目标：要做成什么。' },
  { id: 'p1', say: '背景：项目用什么技术，相关的代码在哪。' },
  { id: 'p2', say: '约束：哪些文件别碰，能不能加新的依赖。', gloss: ['依赖', 'dependency', '项目里用到的、别人写好的代码库。'], until: 'p3' },
  { id: 'p3', say: '验收标准：怎样算做完，用什么来验证。' },
  { id: 'p4', say: '参考：项目里已有的、类似的代码或者示例。', hold: .5 },
  { id: 'snip', say: '每写清一部分，就替我剪掉一个问号。', hold: .75 },
  { id: 'why', say: '最好再顺手写一句：为什么要这样做。' },
  { id: 'why2', say: 'Anthropic 的官方指南也这么建议：知道了原因，我能判断得更贴合。', src: 'Anthropic, Prompting best practices', srcUntil: 'err0' },
  { id: 'see', say: '来看看：同一个需求，写清楚以后长什么样。' },
  { id: 'full', pause: 8 },
  { id: 'not', say: '它并不长。但每一个分叉，都提前替我做好了选择。', hold: .75 },
  { id: 'err0', say: '写代码，总会报错。报错的时候，给我四样东西：' },
  { id: 'err', say: '完整的报错和堆栈、你做了什么操作、你期望的结果、实际的结果。', gloss: ['堆栈', 'stack trace', '报错时打出来的一串调用记录，指出错在哪一行。'], until: 'shot', hold: .5 },
  { id: 'shot', say: '界面出问题？直接截图给我，比描述清楚得多。' },
  { id: 'small', say: '还有：大任务拆小，一个对话只干一件事。', hold: .5 },
  { id: 'plan', say: '要是你自己还没想清楚要什么——先让我问你问题，或者先让我出个方案。', hold: .5 },
  { id: 'stk0', say: '最后，说说网上流传的那些「咒语」：' },
  { id: 'stk', say: '「你是世界顶级程序员」「必须!!!」「给你小费」……', hold: .5 },
  { id: 'shake', say: '现在都用不着了。', hold: .25 },
  { id: 'tone', say: '官方指南提到：新模型对指令更敏感，语气太重，我反而容易用力过猛。' },
  { id: 'normal', say: '正常说话就好。', hold: .75 },
  { id: 'rule', rule: [2, '提示词写清目标、背景、约束、验收标准'], dur: 4 },
], { start: 2.8, tail: .5 });
const t = S.t;
const SEG_AT = SEGS.map((_, i) => t('full') + .2 + i * .55);
const CL = [1660, 880];
return scene({
  scene: '03 印刷 · 提示词', look: LOOK.RISO,
  desc: '一句话长出问号树；GARBAGE IN, GARBAGE OUT；提示词的五部分和例子；为什么；清楚版提示词全文；报错给四样；大活拆小；老咒语；规则 2。',
  enter: { kind: TR.WIPE, a: 0, b: 3, col: PINK },
  hud: { num: '03', name: '提示词', time: '21:20', line: '帮我写个登录', ink: INK, acc: PINK, mv: [2.1, 2.6] },
  par: L => { const b = L.b, h = Math.max(L.hit(t('poster'), .4), L.hit(t('gigo'), .5), L.hit(t('shake'), .4)); return [.5 + 2.2 * h, 1, 0, 0]; },
  cam: L => { const h = L.hit(t('gigo'), .3) + L.hit(t('poster'), .25); return [1 + .03 * h, -.006 + .02 * L.hit(t('gigo'), .3) * Math.sin(L.t * 60), 0, 0]; },
  pulse: L => .5,
  sfx: [[t('poster'), 'stamp'], ...QS.map((_, i) => [t('q' + i), 'q', 520 + i * 90]), ...QS.map((_, i) => [t('q' + i) + .5, 'blip', 900 + i * 60]), ...GUESS.map((_, i) => [t('pick') + .3 + i * .3, 'pop']),
    [t('gigo'), 'scratch'], [t('gigo'), 'stamp'], ...PARTS.map((_, i) => [t('p' + i), 'stamp']), ...[0, 1, 2, 3].map(i => [t('snip') + .2 + i * .35, 'snip']), [t('why'), 'stamp'],
    ...SEG_AT.map(b => [b, 'paper']), ...ERR.map((_, i) => [t('err') + i * .4, 'stamp']), [t('small'), 'swish'], ...STK.map((_, i) => [t('stk') + .2 + i * .4, 'stick']), [t('shake'), 'whoosh'], [t('shake'), 'scratch']],
  text: QS.flat(2).join('') + PARTS.flat().join('') + SEGS.map(s => s[1]).join('') + STK.map(s => s[0]).join('') + ERR.join('') + '「帮我写个登录功能」GARBAGE IN, GARBAGE OUT≠ 你想要的WHY?为什么例：12345一个对话，一件事先问我先出方案',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    alpha(cx, .5, () => { for (let i = 0; i < 6; i++) seg(cx, 140 + i * 330, 120, 140 + i * 330, 980, rgba(BLUE, .14), 1.5); seg(cx, 140, 140, 1780, 140, rgba(BLUE, .2), 1.5); });
    // ---------- 海报大字 + 问号树 ----------
    lyric(tx, L, { at: t('poster'), out: t('re') - .1, text: '「帮我写个登录功能」', x: 140, y: 230, size: 110, fam: F.poster, w: 400, col: BLUE, anim: 'stamp', d: .1, outAnim: 'up' });
    const kt = (1 - prog(b, t('re') - .3, t('re'), E.in)) * (1 - .75 * prog(b, t('gigo') - .05, t('gigo') + .05));
    if (b >= t('q0') - .1 && kt > 0) alpha(cx, kt, () => {
      const rx = 560, ry = 300;
      QS.forEach(([q, opts], i) => {
        const at = t('q' + i), k = prog(b, at, at + .3, E.out); if (k <= 0) return;
        const x = QX[i], y = 520;
        cx.strokeStyle = INK; cx.lineWidth = 4; cx.beginPath(); cx.moveTo(rx, ry); cx.lineTo(lerp(rx, x, k), lerp(ry, y - 40, k)); cx.stroke();
        scaleAt(cx, x, y, E.back(k), () => { rr(cx, x - 170, y - 40, 340, 80, 6, YEL, INK, 3); txt(cx, q, x, y, fnt(900, 32), INK, 'center'); });
        opts.forEach((o, j) => {
          const a2 = at + .45 + j * .2, k2 = prog(b, a2, a2 + .2, E.out); if (k2 <= 0) return;
          const lx = x + (j ? 90 : -90), ly = 700, picked = b >= t('pick') + .3 + i * .3 && GUESS[i] === j;
          seg(cx, x, y + 40, lerp(x, lx, k2), lerp(y + 40, ly - 30, k2), picked ? PINK : INK, picked ? 7 : 3);
          rr(cx, lx - 84, ly - 30, 168, 60, 30, picked ? rgba(PINK, .85) : rgba(BLUE, .35), picked ? PINK : BLUE, 3);
          txt(cx, o, lx, ly, fnt(700, o.length > 6 ? 20 : 26), INK, 'center');
          if (!picked) txt(cx, '?', lx + 70, ly - 34, fnt(900, 30, F.poster), PINK, 'center');
        });
      });
      const kr = prog(b, t('neq'), t('neq') + .3);
      if (kr > 0) alpha(cx, kr, () => { rr(cx, 1060, 790, 380, 90, 8, null, PINK, 5); txt(cx, '≠ 你想要的', 1250, 835, fnt(900, 44), PINK, 'center'); });
    });
    lyric(tx, L, { at: t('gigo'), out: t('re') - .1, text: 'GARBAGE IN,\nGARBAGE OUT', x: 900, y: 500, size: 150, fam: F.poster, w: 400, col: PINK, align: 'center', anim: 'stamp', d: .08, lh: 1.05, outAnim: 'up' });
    // ---------- 五部分 ----------
    const kp = prog(b, t('five'), t('five') + .1) * (1 - prog(b, t('why') - .3, t('why'), E.in));
    if (kp > 0) alpha(cx, kp, () => PARTS.forEach(([n, col, d, ex], i) => {
      const at = t('p' + i), k = prog(b, at, at + .3, E.back); if (k <= 0) return;
      const x = 140 + i * 330, y = lerp(-300, 300, Math.min(1, k)), dark = col === YEL, ink = dark ? INK : '#fff6ea';
      rotAt(cx, x + 150, y + 220, (hash(i * 3) - .5) * .05, () => {
        rr(cx, x, y, 300, 450, 4, col);
        txt(cx, String(i + 1), x + 24, y + 70, fnt(400, 100, F.poster), ink);
        txt(cx, n, x + 24, y + 190, fnt(400, n.length > 2 ? 54 : 70, F.poster), ink);
        d.split('\n').forEach((l, j) => txt(cx, l, x + 26, y + 270 + j * 38, fnt(700, 27), ink));
        const ke = prog(b, at + .6, at + .9);
        if (ke > 0) alpha(cx, ke, () => { rr(cx, x + 16, y + 360, 268, 70, 6, 'rgba(255,255,255,.25)'); txt(cx, '例：' + ex, x + 28, y + 395, fnt(700, ex.length > 10 ? 20 : 23), ink); });
      });
    }));
    // 被剪掉的问号
    [0, 1, 2, 3].forEach(i => {
      if (b < t('five') || b > t('why')) return;
      const at = t('snip') + .2 + i * .35, x = 300 + i * 360, y0 = 830, f = prog(b, at, at + .5, E.in);
      alpha(cx, 1 - f, () => rotAt(cx, x, y0 + f * 500, f * 2, () => { circ(cx, x, y0 + f * 500, 34, PINK); txt(cx, '?', x, y0 + f * 500 + 2, fnt(400, 48, F.poster), '#fff6ea', 'center'); }));
    });
    // ---------- 为什么 ----------
    const kw = prog(b, t('why'), t('why') + .3, E.back) * (1 - prog(b, t('see') - .2, t('see'), E.in));
    if (kw > 0) scaleAt(cx, 960, 480, kw * (1 + .4 * (1 - Math.min(1, kw))), () => rotAt(cx, 960, 480, -.15, () => { circ(cx, 960, 480, 200, YEL, INK, 5); txt(cx, 'WHY?', 960, 450, fnt(400, 110, F.poster), INK, 'center'); txt(cx, '为什么', 960, 560, fnt(900, 50), INK, 'center'); }));
    // ---------- 清楚版提示词 ----------
    const kf = prog(b, t('see'), t('see') + .3) * (1 - prog(b, t('err0') - .3, t('err0')));
    if (kf > 0) alpha(cx, kf, () => {
      const X = 150, Y = 330, LH = 96;
      alpha(cx, prog(b, t('see'), t('see') + .3), () => { rr(cx, 110, 200, 1700, 690, 10, 'rgba(255,255,255,.35)', rgba(INK, .25), 2); txt(cx, '清楚版提示词', 150, 240, fnt(900, 30), INK); PARTS.forEach(([n, col], i) => { rr(cx, 470 + i * 230, 222, 200, 38, 19, mixC(col, CREAM, .45)); txt(cx, n, 570 + i * 230, 241, fnt(900, 22), INK, 'center'); }); });
      SEGS.forEach(([ln, s, pi], i) => {
        const k = prog(b, SEG_AT[i], SEG_AT[i] + .3, E.out); if (k <= 0) return;
        cx.font = fnt(700, 46); let x = X; for (let j = 0; j < i; j++) if (SEGS[j][0] === ln) x += cx.measureText(SEGS[j][1]).width;
        const w = cx.measureText(s).width, y = Y + ln * LH, col = PARTS[pi][1];
        cx.fillStyle = mixC(col, CREAM, .55); cx.fillRect(x - 4, y - 30, (w + 8) * k, 60);
        alpha(cx, k, () => { cx.fillStyle = INK; cx.textBaseline = 'middle'; cx.fillText(s, x, y); });
      });
    });
    // ---------- 报错四样 ----------
    const ke = prog(b, t('err0'), t('err0') + .2) * (1 - prog(b, t('small') - .3, t('small')));
    if (ke > 0) alpha(cx, ke, () => {
      ERR.forEach((s, i) => {
        const at = t('err') + i * .4, k = prog(b, at, at + .25, E.back); if (k <= 0) return;
        const x = 160 + (i % 2) * 820, y = 380 + Math.floor(i / 2) * 190;
        scaleAt(cx, x + 360, y + 60, lerp(1.3, 1, Math.min(1, k)), () => rotAt(cx, x + 360, y + 60, (i % 2 ? .03 : -.03), () => { rr(cx, x, y, 720, 130, 6, 'rgba(255,255,255,.3)', [BLUE, PINK, GRN, ORG][i], 6); txt(cx, (i + 1) + '  ' + s, x + 40, y + 66, fnt(900, 48), [BLUE, PINK, GRN, ORG][i]); }));
      });
      const ks = prog(b, t('shot'), t('shot') + .3, E.back);
      if (ks > 0) scaleAt(cx, 1500, 270, ks, () => { rr(cx, 1340, 200, 320, 140, 8, '#ffffff', INK, 4); rr(cx, 1360, 220, 280, 70, 4, mixC(BLUE, CREAM, .6)); circ(cx, 1500, 255, 22, PINK); txt(cx, '截图', 1500, 318, fnt(900, 26), INK, 'center'); });
    });
    // ---------- 一个对话，一件事 ----------
    const ksm = prog(b, t('small'), t('small') + .3) * (1 - prog(b, t('stk0') - .3, t('stk0')));
    if (ksm > 0) alpha(cx, ksm, () => {
      [0, 1, 2].forEach(i => { const k = prog(b, t('small') + .3 + i * .3, t('small') + .6 + i * .3, E.back); scaleAt(cx, 400 + i * 420, 420, k, () => { rr(cx, 240 + i * 420, 320, 320, 200, 18, '#ffffff', [BLUE, GRN, ORG][i], 5); txt(cx, '对话 ' + (i + 1), 400 + i * 420, 380, fnt(400, 40, F.poster), [BLUE, GRN, ORG][i], 'center'); txt(cx, ['加 login 方法', '写测试', '修报错'][i], 400 + i * 420, 450, fnt(900, 36), INK, 'center'); }); });
      const kq = prog(b, t('plan'), t('plan') + .3, E.back);
      if (kq > 0) scaleAt(cx, 960, 680, kq, () => { rr(cx, 640, 620, 640, 120, 60, YEL, INK, 4); txt(cx, '先问我 · 先出方案', 960, 680, fnt(900, 46), INK, 'center'); });
    });
    // ---------- Clawd ----------
    let st = { x: CL[0], y: CL[1], px: 14, col: ORG, hi: '#ff9a6a', pose: 'idle', ph: tt * 10, blink: (tt % 3) < .1, eye: -1 };
    if (b >= t('poster') && b < t('poster') + .2) st.squash = 1 - .2 * Math.sin(Math.PI * prog(b, t('poster'), t('poster') + .2, E.lin));
    if (b >= t('gap') && b < t('pick')) { st.q = 1; }
    if (b >= t('pick') && b < t('neq')) { st.blink = true; st.pose = 'pointL'; }
    if (b >= t('neq') && b < t('re')) { st.pose = 'cover'; st.sweat = b; }
    if (b >= t('snip') && b < t('why')) { st.pose = 'point'; st.ph = tt * 30; st.x = lerp(CL[0], 1520, prog(b, t('snip'), t('snip') + .3)); }
    if (b >= t('full') && b < t('err0')) { st.pose = 'type'; st.ph = tt * 22; st.x = 1720; st.y = 950; st.px = 11; }
    const sx = 1300, sy = 600;
    if (b >= t('stk0')) { st.x = sx; st.y = sy + 120; st.px = 20; st.eye = 0; if (b >= t('shake') && b < t('shake') + .4) { st.x += (hash(Math.floor(tt * 40)) - .5) * 30; st.squash = 1 + .15 * Math.sin(tt * 60); } if (b >= t('shake') + .4) st.eyeShape = 'happy'; }
    clawd(cx, st);
    if (b >= t('stk')) STK.forEach(([s, r, dx, dy], i) => {
      const at = t('stk') + .2 + i * .4, k = prog(b, at, at + .15, E.out), f = prog(b, t('shake'), t('shake') + .5, E.in); if (k <= 0) return;
      const fx = (hash(i * 7) - .5) * 1400 * f, fy = -300 * f + 1400 * f * f;
      alpha(cx, 1 - prog(b, t('shake') + .35, t('shake') + .5), () => rotAt(cx, sx + dx + fx, sy + dy + fy, r + f * (i - 1) * 3, () => scaleAt(cx, sx + dx + fx, sy + dy + fy, lerp(1.5, 1, k), () => {
        cx.font = fnt(900, 36); const w = cx.measureText(s).width + 50;
        rr(cx, sx + dx + fx - w / 2, sy + dy + fy - 34, w, 68, 3, [YEL, PINK, GRN][i]); txt(cx, s, sx + dx + fx, sy + dy + fy, fnt(900, 36), INK, 'center');
      })));
    });
    narrate(tx, L, S, { sub: { col: INK, shadow: null, box: 'rgba(247,240,225,.88)', acc: [PINK, BLUE], y: 985 }, gloss: { bg: 'rgba(250,244,230,.95)', ink: INK, acc: PINK, border: rgba(INK, .3) } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD, CH = H.CH;
    Sm.add('crash', 0, 0, 0, 0, .5);
    H.pads(Sm, 0, B, PD, 'string', .4);
    // 放克：讲解段收着（只有贝斯和拍手），清楚版提示词出来时整套进来
    const full0 = Math.ceil(t('see')), full1 = Math.floor(t('err0'));
    H.each(0, B, b => {
      const c = CH[PD[b % 4]], r = c.r + 12, big = b >= full0 && b < full1 || b >= Math.ceil(t('shake'));
      [[0, r], [.75, r], [1.5, r + 12], [2, r], [2.5, r + 7], [3.25, r], [3.5, r + 12]].forEach(([bt, m]) => Sm.add('bass', b, bt, m, .35, big ? .7 : .45, 'pluck'));
      Sm.add('clap', b, 1, 0, 0, big ? .5 : .3); Sm.add('clap', b, 3, 0, 0, big ? .5 : .3);
      if (big) { [0, 1.5, 2.5].forEach(bt => Sm.add('kick', b, bt, 0, 0, bt ? .6 : .8, 'main')); [.5, 1.5, 2.5, 3.5].forEach(bt => Sm.add('stab', b, bt, c.pad, .2, .4)); for (let j = 0; j < 16; j++) Sm.add('hat', b, j / 4, 0, 0, .22, 'closed'); }
      else Sm.add('kick', b, 0, 0, 0, .5, 'soft');
    });
    H.hook(Sm, full0, 'square', 0, 0, 8, .55);
    Sm.add('lp', t('gigo') - .1, 0, 900, .5); Sm.add('lp', t('re'), 0, 15000, 2);
    H.roll(Sm, B - 1, 2, 4, 'snare', 'main', .3, .7, .125);
  },
}, S);
};
})();
