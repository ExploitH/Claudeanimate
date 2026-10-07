// 01 什么是 vibe coding · 梦：流体虹彩，原句漂浮、代码融化；肥皂泡项目（3D 球体）；年度词；三个勾让梦冻结成晶体（3D 析出）；地平线变成项目轴（3D 透视）
// 22 小节版：引文停顿 +2，肥皂泡缓升 +1，晶体呼吸拍 +1
(window.MV_W = window.MV_W || {}).w01 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd } = K;
const CODE = ['function login(user, pwd) {', 'if (!user) return null;', 'const hash = sha256(pwd);', 'await db.users.find({ name })', 'for (let i = 0; i < n; i++)', 'return token;', 'session.set(“uid”, id);',
  'catch (e) { /* ??? */ }', '} else {', 'export default App;', 'if (tries > 5) lock();', 'res.json({ ok: true })'];
// z 轴深度 [0.3 近 … 1.0 远]，近的大/亮，远的小/暗，模拟景深视差
const CPOS = CODE.map((_, i) => [120 + hash(i * 3.7) * 1500, 140 + ((i * 83) % 820), .3 + hash(i * 1.3) * .7]);
// 22 小节新时间轴：引文段整体后移 2 拍，其余跟着顺延
const BUB = [['周末 demo', 330, 11.5], ['小游戏', 640, 12], ['随手脚本', 950, 12.25], ['一次性网页', 1230, 12.5]];
const AX = { x0: 220, x1: 1700, y: 770 }, TK = [['作业', .45], ['给别人用', .72], ['上线', 1]];
const QUOTE = [['”fully give in to the vibes,', '完全顺着感觉走'], ['embrace exponentials,', '拥抱指数级增长'], ['and ‹forget that the code even exists.›”', '忘掉代码的存在']];
// 滑块：每拍走一格（小节），整体后移 4 拍
function slider(b) {
  if (b < 19) return 0;
  if (b < 20) { const st = [[19, 0], [19.25, .45], [19.5, .72], [19.75, 1]]; let v = 0; for (let i = 0; i < st.length; i++) if (b >= st[i][0]) v = i + 1 < st.length ? lerp(st[i][1], st[i + 1][1], prog(b, st[i][0], st[i][0] + .2, E.io)) : 1; return v; }
  return lerp(1, .45, prog(b, 20, 20.4, E.io));
}
// melt 从 b=6.6 开始（引文停顿结束后）
const melt = b => prog(b, 6.6, 8.6, E.in) * (1 - prog(b, 14, 14.2));
const crystal = b => b < 18.5 ? prog(b, 14, 14.35, E.out) : lerp(.15, 1, slider(b));
// 肥皂泡：3D 彩虹薄膜球，多层环光模拟球面折射
function iris(ctx, x, y, r, a, t) {
  // 球体底色（半透明球面）
  const grd = ctx.createRadialGradient(x - r * .35, y - r * .35, r * .05, x, y, r);
  grd.addColorStop(0, rgba('#ffffff', .18 * a));
  grd.addColorStop(.6, rgba('#c9a6ff', .06 * a));
  grd.addColorStop(1, rgba('#9ae6ff', .04 * a));
  ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  // 彩虹薄膜描边
  const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  ['#ff9ad5', '#9ae6ff', '#c9a6ff', '#fff2a8', '#ff9ad5'].forEach((c, i) => g.addColorStop(i / 4, rgba(c, .85 * a)));
  ctx.strokeStyle = g; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.stroke();
  // 高光弧（模拟球面反光）
  ctx.strokeStyle = rgba('#ffffff', .75 * a); ctx.lineWidth = 4.5;
  ctx.beginPath(); ctx.arc(x, y, r * .78, -2.5 + t * .3, -1.9 + t * .3); ctx.stroke();
  // 第二高光弧，球面下方折射
  ctx.strokeStyle = rgba('#ffd6f5', .25 * a); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x, y, r * .88, 0.6 + t * .15, 1.4 + t * .15); ctx.stroke();
}
// 晶体尖角：模拟 3D 析出的多面体棱角
function crystalSpike(ctx, cx, cy, r, phase, ka) {
  if (ka <= 0) return;
  const N = 6;
  ctx.save(); ctx.globalAlpha *= ka * .6;
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2 + phase, len = r * (.5 + hash(i * 3.1) * .8);
    const x0 = cx + Math.cos(a) * r * .7, y0 = cy + Math.sin(a) * r * .7;
    const x1 = cx + Math.cos(a) * (r + len), y1 = cy + Math.sin(a) * (r + len);
    ctx.strokeStyle = mixC('#9fd8ff', '#ffffff', hash(i * 1.7)); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
  }
  ctx.restore();
}
return {
  scene: '01 梦 · 什么是 vibe coding', bars: 22, look: 1,
  enter: { kind: TR.INK, a: 1, b: 3, p: [960 / 1920, 690 / 1080, 0, 0] },
  hud: { num: '01', name: '什么是 vibe coding', time: '21:03', line: '先 vibe 一下', ink: '#f3eefc', acc: '#ffb3e6' },
  you: [[1, 2.25, '今晚先 vibe 一下，能跑就行']],
  rule: { n: 1, at: 20.5, text: '先判断这个项目在轴的哪一端' },
  src: [[1.3, 8.7, 'Karpathy, 2025-02'], [12.75, 14, 'Collins Dictionary, 2025-11'], [14, 16.4, 'Simon Willison']],
  par: L => { const b = L.b, cr = crystal(b); return [Math.max(0, (1 + 1.6 * melt(b)) * (1 - cr) * (b > 12.5 && b < 14 ? .45 : 1)), cr, .7 * (1 - cr * .6), 0]; },
  cam: L => { const b = L.b, sh = L.hit(13, .25) * .012; return [1.02 + .02 * Math.sin(L.t * .25) + .04 * prog(b, 2.5, 8.5, E.io) * (1 - prog(b, 8.5, 9, E.io)), .012 * Math.sin(L.t * .2) + (hash(Math.floor(L.t * 40)) - .5) * sh, 0, 0]; },
  focus: L => [.33, .42, .38, .55 * prog(L.b, 2.4, 2.8) * (1 - prog(L.b, 8.5, 8.9))],
  pulse: L => L.b >= 14 ? .8 : .3,
  sfx: [[1.3, 'swish'], [2.5, 'chime', 1175], [3.5, 'swish'], [4.5, 'chime', 1568], [4.75, 'whoosh'],
    // 引文第三段：停顿后融化，多一个 whoosh
    [6.6, 'whoosh'], [8, 'swish'],
    [8.75, 'bubble'], [9.1, 'bubble'],
    ...BUB.map(b => [b[2], 'pop']),
    [12.75, 'paper'], [13, 'stamp'], [14, 'freeze'],
    [14.5, 'chime', 1319], [15, 'chime', 1568], [15.5, 'chime', 1976], [16, 'ding'],
    [18.55, 'whoosh'], [19.25, 'blip', 900], [19.5, 'blip', 1100], [19.75, 'glitch'], [20, 'swish'], [20.3, 'whoosh'], [20.5, 'stamp']],
  text: CODE.join('') + QUOTE.flat().join('') + BUB.map(b => b[0]).join('') + '2025 年 2 月这个词，出自 Andrej Karpathy 的一条帖子听起来像魔法——你只管说，代码我来，看都不用看。可他在同一条帖子里就写了：后来，这个词火进了词典2025 年度词程序员 Simon Willison 划了一条线所以先问一句：能跑就行？这是作业，在右边。适合用完就扔的周末小项目同年 11 月柯林斯词典年度词Collins English Dictionary WORD OF THE YEAR 2025 vibe coding noun Simon Willison 的界线审过测过能讲清&&= 正常写程序不算 vibe coding关键：用多久？给谁用？越往右，越不能光凭感觉用完就扔的小玩具作业给别人用上线贯穿任务给图书管理系统加登录功能',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, cr = crystal(b), m = melt(b);
    // ---------- 背景里的代码碎片：3D 景深视差 + 融化 z 轴拉伸 ----------
    if (b < 18.6) alpha(cx, 1 - prog(b, 18.3, 18.6), () => {
      cx.textBaseline = 'middle';
      CODE.forEach((s, i) => {
        const [x, y0, z] = CPOS[i];
        // z 轴视差：近层（z 大）漂移快，远层漂移慢；3D 纵深用 scale 模拟
        const parallax = (b < 14 ? t * 6 * z : 0) % 60;
        const y = y0 - parallax;
        const depthScale = 0.6 + z * 0.4; // 近的字更大
        const col = cr > .5 ? mixC('#bcd7ff', '#ffffff', hash(i)) : mixC('#ffd6f5', '#bdf3ff', hash(i * 2.1));
        const a = (.08 + .08 * z) * (b < 14 ? 1 - m * .2 : prog(b, 14, 14.3) * .8);
        cx.font = fnt(400, Math.round(26 * depthScale), F.mono);
        if (b >= 14 || m <= .001) { cx.fillStyle = rgba(col, a); cx.fillText(s, x, y); return; }
        let xx = x;
        for (let j = 0; j < s.length; j++) {
          const ch = s[j], wch = K.cw(cx, ch) * depthScale;
          const kk = Math.min(1, m * (1.2 + hash(i * 7 + j) * 1.4));
          cx.fillStyle = rgba(col, a * (1 - kk));
          cx.save();
          // z 轴拉伸：字符先向 z 轴延伸（用 scaleY 模拟），再弯折垂落
          const stretch = 1 + kk * 2.8;
          cx.translate(xx, y + kk * kk * (120 + 380 * hash(j * 1.7 + i)));
          cx.scale(depthScale, stretch);
          cx.fillText(ch, 0, 0);
          cx.restore();
          xx += wch;
        }
      });
    });
    // ---------- 肥皂泡：3D 球体，缓升节奏放慢 ----------
    for (const [s, x, pt] of BUB) {
      // 起升点前移 1 小节，让泡泡缓缓飘起
      const k = prog(b, 10.5 + (pt - 11.5) * .3, pt, E.out), r = 92;
      if (k <= 0 || b > pt + .5) continue;
      const y = lerp(1180, 520 - (x % 300) * .25, k) + Math.sin(t * 2 + x) * 10;
      const xx = x + Math.sin(t * 1.3 + x) * 14;
      if (b < pt) {
        iris(cx, xx, y, r, 1, t);
        txt(cx, s, xx, y, fnt(700, 30), '#ffffff', 'center');
      } else {
        // 破碎：球面向外膨胀后散成粒子，带真实 3D 旋转感
        const p = prog(b, pt, pt + .45, E.out);
        alpha(cx, 1 - p, () => {
          iris(cx, xx, y, r * (1 + p * .7), 1, t);
          for (let j = 0; j < 14; j++) {
            const a = j / 14 * 6.283, dist = r * (1 + p * 1.4);
            const px2 = xx + Math.cos(a) * dist, py2 = y + Math.sin(a) * dist * .7 + p * p * 80;
            const pr = (5 + hash(j) * 6) * (1 - p);
            circ(cx, px2, py2, pr, rgba('#e8f6ff', .8 * (1 - p)));
          }
        });
      }
    }
    // ---------- 柯林斯词典（后移 2 拍） ----------
    if (b >= 12.6 && b < 14.3) {
      const k = prog(b, 12.7, 13, E.back), ko = prog(b, 13.9, 14.2, E.in);
      alpha(cx, k * (1 - ko), () => scaleAt(cx, 1310, 470, .9 + .1 * k + ko * .3, () => {
        rr(cx, 1040, 300, 540, 340, 18, '#2a1840', '#c792ea', 3);
        txt(cx, 'Collins English Dictionary', 1080, 350, fnt(400, 22, F.mono), '#cdb4ee');
        txt(cx, 'vibe coding', 1080, 430, fnt(700, 62, F.mono), '#fff6ff');
        txt(cx, 'noun', 1080, 490, fnt(400, 24, F.mono), '#c792ea');
        const ks = prog(b, 13, 13.12, E.quad);
        if (ks > 0) rotAt(cx, 1310, 560, -.08, () => scaleAt(cx, 1310, 560, lerp(2.4, 1, ks), () => alpha(cx, Math.min(1, ks * 3), () => {
          rr(cx, 1110, 515, 400, 92, 10, rgba('#f2a65a', .2), '#f2a65a', 4);
          txt(cx, 'WORD OF THE YEAR 2025', 1310, 545, fnt(700, 24, F.mono), '#f2a65a', 'center');
          txt(cx, '柯林斯词典 2025 年度词', 1310, 582, fnt(700, 26), '#f2a65a', 'center');
        })));
      }));
    }
    // ---------- 晶体析出尖角（3D 效果：在三个勾打完之间析出） ----------
    if (b >= 14 && b < 18.5) {
      const W3_X = [560, 960, 1360];
      W3_X.forEach((x, i) => {
        const ka = prog(b, 14 + i * .5, 14.3 + i * .5, E.out) * (1 - prog(b, 17.8, 18.2));
        crystalSpike(cx, x, 470, 80 + i * 20, t * .2 + i * 2, ka);
      });
    }
    // ---------- 项目轴（3D 透视延伸：地平线向远处收缩） ----------
    const ka = prog(b, 18.5, 19, E.io);
    if (ka > 0) {
      const s = slider(b), len = AX.x1 - AX.x0, sx = AX.x0 + len * s;
      // 透视效果：左端（远）比右端（近）细，用渐变高度模拟
      const g = cx.createLinearGradient(AX.x0, 0, AX.x1, 0); g.addColorStop(0, '#ffb3e6'); g.addColorStop(.5, '#d8c8ff'); g.addColorStop(1, '#9fd8ff');
      cx.fillStyle = rgba('#ffffff', .25); cx.fillRect(AX.x0, AX.y - 2, len * ka, 4);
      cx.fillStyle = g; cx.fillRect(AX.x0, AX.y - 4, (sx - AX.x0) * ka, 8);
      alpha(cx, ka, () => {
        circ(cx, AX.x0, AX.y, 10, '#ffb3e6');
        txt(cx, '用完就扔的小玩具', AX.x0, AX.y + 58, fnt(700, 32), '#ffe3f5', 'center');
        TK.forEach(([n, p]) => { const x = AX.x0 + len * p, lit = s >= p - 1e-3; cx.fillStyle = lit ? '#ffffff' : rgba('#ffffff', .35); cx.fillRect(x - 3, AX.y - 18, 6, 36); txt(cx, n, x, AX.y + 58, fnt(lit ? 900 : 500, 32), lit ? '#ffffff' : rgba('#ffffff', .55), 'center'); });
        if (b >= 19.75 && b < 20.4) alpha(cx, bump(b, 19.9, .2), () => { const gg = cx.createRadialGradient(AX.x1, AX.y, 0, AX.x1, AX.y, 220); gg.addColorStop(0, rgba('#9fd8ff', .9)); gg.addColorStop(1, rgba('#9fd8ff', 0)); cx.fillStyle = gg; cx.fillRect(AX.x1 - 220, AX.y - 220, 440, 440); });
        circ(cx, sx, AX.y, 24, '#1a1030'); circ(cx, sx, AX.y, 16, mixC('#ffb3e6', '#9fd8ff', s));
      });
      // 任务卡钉在「作业」
      const kc = prog(b, 20.2, 20.5, E.out);
      if (kc > 0) {
        const x = AX.x0 + len * .45, y = lerp(380, 560, kc), w = 640;
        alpha(cx, Math.min(1, kc * 2), () => {
          seg(cx, x, y + 70, x, AX.y - 24, rgba('#ffffff', .6), 2, [8, 8]);
          rr(cx, x - w / 2, y - 70, w, 140, 16, 'rgba(26,16,48,.92)', '#ffcf8a', 3);
          txt(cx, '贯穿任务', x - w / 2 + 30, y - 32, fnt(500, 24), '#ffcf8a');
          txt(cx, '给图书管理系统加登录功能', x - w / 2 + 30, y + 22, fnt(900, 42), '#fff6ea');
          const kp = prog(b, 20.5, 20.6, E.quad); if (kp > 0) { const py = lerp(y - 160, y - 76, kp); rr(cx, x - 13, py - 13, 26, 26, 6, '#f07178'); }
        });
      }
    }
    // ---------- Clawd ----------
    const bob = Math.sin(t * 1.6) * 12, pushing = b >= 18.8 && b < 20.45;
    let st = { x: 1560, y: 760 + bob, px: 16, skin: 'glow', col: '#ff7d55', hi: '#ffa27f', glow: '#ff5fa8', pose: 'idle', ph: t * 10, rot: Math.sin(t * .9) * .06, blink: b < 2.4 || (t % 3.2) < .12, eye: -1 };
    if (b >= 8.75 && b < 10.6) { st.pose = 'wave'; st.ph = t * 5; st.eye = 0; }
    if (b >= 10.6 && b < 12.7) { st.eyeY = -.4; st.eye = -1; }
    if (b >= 12.95 && b < 13.2) st.squash = 1 - .2 * Math.sin(Math.PI * prog(b, 12.95, 13.2, E.lin));
    if (b >= 14) { st = { ...st, skin: 'pixel', col: C.clawd, hi: C.clawdHi, rot: 0, x: 1560, y: 820, px: 16, glow: null, blink: (t % 3.1) < .12, eye: -1 }; st.nod = [14.5, 15, 15.5].some(x => b >= x && b < x + .12); }
    if (b >= 18.5) {
      const s = slider(b), sx = AX.x0 + (AX.x1 - AX.x0) * s;
      const into = prog(b, 18.5, 18.85, E.io), jump = Math.sin(Math.PI * into) * 160;
      st.x = lerp(1560, sx - 64, into); st.y = lerp(820, AX.y - 4, into) - jump; st.px = lerp(16, 12, into);
      if (pushing) { st.pose = 'push'; st.walk = t * 16; st.eye = 1; if (b >= 20) { st.eye = -1; st.x = sx + 64; st.pose = 'pointL'; } }
      if (b >= 19.75 && b < 20) { st.sweat = b - 19.75; st.x += (hash(Math.floor(t * 30)) - .5) * 5; }
      if (b >= 20.45) { st.pose = 'up'; st.eye = -1; const x = AX.x0 + (AX.x1 - AX.x0) * .45 + 380; st.x = x; st.y = AX.y - 4 - Math.sin(Math.PI * prog(b, 20.45, 20.7, E.lin)) * 60; }
    }
    clawd(cx, st);
    // ---------- 歌词（所有时间点后移 2 拍，晶体段后移 2 拍）----------
    const LX = 140;
    lyric(tx, L, { at: 1.3, out: 2.35, text: '2025 年 2 月', x: LX, y: 330, size: 30, fam: F.mono, w: 400, col: '#d9c8ff', anim: 'type', st: .2 });
    lyric(tx, L, { at: 1.45, out: 2.35, text: '这个词，出自 Andrej Karpathy 的一条帖子', x: LX, y: 400, size: 52, w: 700, col: '#fff6ff', anim: 'blur', st: .15, outAnim: 'blur' });
    QUOTE.forEach(([en, zh], i) => {
      const at = 2.5 + i, out = i < 2 ? at + .95 : 8.6, big = i === 2;
      lyric(tx, L, { at, out, text: en, x: LX, y: 440, size: big ? 70 : 84, fam: F.serif, w: 700, col: '#fff8ff', acc: ['#ffd38a', '#ffd38a'], anim: 'blur', st: .14, d: .3, wave: .025, outAnim: 'blur', glow: [24, 'rgba(255,170,230,.55)'] });
      lyric(tx, L, { at: at + .1, out, text: zh, x: LX, y: 560, size: 40, w: 500, col: '#e8dcff', anim: 'fade', st: .2, outAnim: 'fade' });
    });
    // 引文最后一段停顿：b=5.5 已出完，b=6.5 才开始消失（多 1 拍静止）
    lyric(tx, L, { at: 8, out: 10.6, text: '听起来像魔法——\n你只管说，代码我来，‹看都不用看›。', x: LX, y: 440, size: 66, w: 900, col: '#fff6ff', acc: ['#ffd38a'], anim: 'rise', st: .12, wave: .02, outAnim: 'blur' });
    lyric(tx, L, { at: 10.75, out: 12.6, text: '可他在同一条帖子里就写了：', x: LX, y: 250, size: 40, w: 500, col: '#e8dcff', anim: 'fade' });
    lyric(tx, L, { at: 11, out: 12.6, text: '适合«用完就扔»的周末小项目', x: LX, y: 330, size: 66, w: 900, col: '#fff6ff', acc: [C.num, '#ffd38a'], anim: 'rise', st: .12, outAnim: 'up' });
    lyric(tx, L, { at: 12.75, out: 13.9, text: '后来，这个词火进了词典', x: LX, y: 410, size: 40, w: 500, col: '#e8dcff', anim: 'fade' });
    lyric(tx, L, { at: 12.85, out: 13.9, text: '柯林斯词典\n2025 年度词', x: LX, y: 530, size: 84, w: 900, col: '#fff6ff', anim: 'drop', st: .1, outAnim: 'blur' });
    // 晶体段：三个勾（后移 2 拍，打完最后一勾后多 1 拍停留）
    lyric(tx, L, { at: 14, out: 18.4, text: '程序员 Simon Willison 划了一条线', x: 960, y: 260, size: 40, w: 500, col: '#cfe3ff', align: 'center', anim: 'type', st: .08 });
    const W3 = [['审过', 14.5, 560], ['测过', 15, 960], ['能讲清', 15.5, 1360]];
    W3.forEach(([w, at, x], i) => {
      lyric(tx, L, { at, out: 18.4, text: w, x, y: 470, size: 110, w: 900, col: '#ffffff', align: 'center', anim: 'stamp', d: .12, outAnim: 'up', glow: [20, 'rgba(150,200,255,.6)'] });
      const kc = prog(b, at + .05, at + .2, E.back);
      if (kc > 0 && b < 18.6) alpha(tx, 1 - prog(b, 18.3, 18.5), () => scaleAt(tx, x, 360, kc, () => { tx.strokeStyle = '#a5f0a0'; tx.lineWidth = 10; tx.lineCap = 'round'; tx.beginPath(); tx.moveTo(x - 26, 360); tx.lineTo(x - 6, 382); tx.lineTo(x + 30, 336); tx.stroke(); }));
      if (i < 2) lyric(tx, L, { at: at + .25, out: 18.4, text: '&&', x: x + 200, y: 470, size: 50, fam: F.mono, w: 700, col: '#7fa6d8', align: 'center', anim: 'fade' });
    });
    lyric(tx, L, { at: 16, out: 18.4, text: '= ‹正常写程序›', x: 960, y: 630, size: 72, w: 900, col: '#ffffff', acc: ['#a5f0a0'], align: 'center', anim: 'stamp', d: .12, outAnim: 'up' });
    lyric(tx, L, { at: 16.1, out: 18.4, text: '不算 vibe coding', x: 960, y: 715, size: 34, w: 500, col: '#a9c4e8', align: 'center', anim: 'fade' });
    // 项目轴段
    lyric(tx, L, { at: 18.55, out: 20.15, text: '所以先问一句：«用多久？给谁用？»', x: LX, y: 290, size: 64, w: 900, col: '#ffffff', acc: [C.num, '#ffd38a'], anim: 'rise', st: .1, outAnim: 'up' });
    lyric(tx, L, { at: 19.25, out: 20.15, text: '越往右，越不能光凭感觉', x: LX, y: 400, size: 48, w: 700, col: '#d9e8ff', anim: 'rise', st: .08, outAnim: 'up' });
    lyric(tx, L, { at: 20.3, out: 21.85, text: '能跑就行？\n这是作业，在‹右边›。', x: LX, y: 300, size: 64, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'rise', st: .1 });
  },
};
};
