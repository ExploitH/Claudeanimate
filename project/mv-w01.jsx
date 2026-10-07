// 01 什么是 vibe coding · 梦：流体虹彩，原句漂浮、代码融化；肥皂泡项目；年度词；三个勾让梦冻结成晶体；地平线变成项目轴
(window.MV_W = window.MV_W || {}).w01 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd } = K;
const CODE = ['function login(user, pwd) {', 'if (!user) return null;', 'const hash = sha256(pwd);', 'await db.users.find({ name })', 'for (let i = 0; i < n; i++)', 'return token;', 'session.set("uid", id);',
  'catch (e) { /* ??? */ }', '} else {', 'export default App;', 'if (tries > 5) lock();', 'res.json({ ok: true })'];
const CPOS = CODE.map((_, i) => [120 + hash(i * 3.7) * 1500, 140 + ((i * 83) % 820), .5 + hash(i * 1.3) * .5]);
const BUB = [['周末 demo', 330, 9.5], ['小游戏', 640, 10], ['随手脚本', 950, 10.25], ['一次性网页', 1230, 10.5]];
const AX = { x0: 220, x1: 1700, y: 770 }, TK = [['作业', .45], ['给别人用', .72], ['上线', 1]];
const QUOTE = [['“fully give in to the vibes,', '完全顺着感觉走'], ['embrace exponentials,', '拥抱指数级增长'], ['and ‹forget that the code even exists.›”', '忘掉代码的存在']];
// 滑块：每拍走一格（小节）
function slider(b) {
  if (b < 15) return 0;
  if (b < 16) { const st = [[15, 0], [15.25, .45], [15.5, .72], [15.75, 1]]; let v = 0; for (let i = 0; i < st.length; i++) if (b >= st[i][0]) v = i + 1 < st.length ? lerp(st[i][1], st[i + 1][1], prog(b, st[i][0], st[i][0] + .2, E.io)) : 1; return v; }
  return lerp(1, .45, prog(b, 16, 16.4, E.io));
}
const melt = b => prog(b, 4.6, 6.6, E.in) * (1 - prog(b, 12, 12.2));
const crystal = b => b < 14.5 ? prog(b, 12, 12.35, E.out) : lerp(.15, 1, slider(b));
function iris(ctx, x, y, r, a, t) { // 肥皂泡
  const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  ['#ff9ad5', '#9ae6ff', '#c9a6ff', '#fff2a8', '#ff9ad5'].forEach((c, i) => g.addColorStop(i / 4, rgba(c, .9 * a)));
  ctx.fillStyle = rgba('#ffffff', .06 * a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.strokeStyle = g; ctx.lineWidth = 4; ctx.stroke();
  ctx.strokeStyle = rgba('#ffffff', .8 * a); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r * .78, -2.5 + t * .3, -1.9 + t * .3); ctx.stroke();
}
return {
  scene: '01 梦 · 什么是 vibe coding', bars: 18, look: 1,
  enter: { kind: TR.INK, a: 1, b: 3, p: [960 / 1920, 690 / 1080, 0, 0] },
  hud: { num: '01', name: '什么是 vibe coding', world: '梦', ink: '#f3eefc' },
  rule: { n: 1, at: 16.5, text: '先判断这个项目在轴的哪一端' },
  src: [[1.3, 6.7, 'Karpathy, 2025-02'], [10.75, 12, 'Collins Dictionary, 2025-11'], [12, 14.4, 'Simon Willison']],
  par: L => { const b = L.b, cr = crystal(b); return [Math.max(0, (1 + 1.6 * melt(b)) * (1 - cr) * (b > 10.5 && b < 12 ? .45 : 1)), cr, .7 * (1 - cr * .6), 0]; },
  cam: L => { const b = L.b, sh = L.hit(11, .25) * .012; return [1.02 + .02 * Math.sin(L.t * .25) + .04 * prog(b, 2.5, 6.5, E.io) * (1 - prog(b, 6.5, 7, E.io)), .012 * Math.sin(L.t * .2) + (hash(Math.floor(L.t * 40)) - .5) * sh, 0, 0]; },
  focus: L => [.33, .42, .38, .55 * prog(L.b, 2.4, 2.8) * (1 - prog(L.b, 6.5, 6.9))],
  pulse: L => L.b >= 12 ? .8 : .3,
  sfx: [[1.3, 'swish'], [2.5, 'chime', 1175], [3.5, 'swish'], [4.5, 'chime', 1568], [4.75, 'whoosh'], [6.75, 'swish'], [8.85, 'bubble'], [9.1, 'bubble'],
    ...BUB.map(b => [b[2], 'pop']), [10.75, 'paper'], [11, 'stamp'], [12, 'freeze'], [12.5, 'chime', 1319], [13, 'chime', 1568], [13.5, 'chime', 1976], [14, 'ding'],
    [14.55, 'whoosh'], [15.25, 'blip', 900], [15.5, 'blip', 1100], [15.75, 'glitch'], [16, 'swish'], [16.3, 'whoosh'], [16.5, 'stamp']],
  text: CODE.join('') + QUOTE.flat().join('') + BUB.map(b => b[0]).join('') + '2025 年 2 月Andrej Karpathy 发了一条帖子只用大白话告诉 AI 要什么，代码长什么样，都不管了。他自己也说：适合用完就扔的周末小项目同年 11 月柯林斯词典年度词Collins English Dictionary WORD OF THE YEAR 2025 vibe coding noun Simon Willison 的界线审过测过能讲清&&= 正常写程序不算 vibe coding关键：用多久？给谁用？越往右，越不能光凭感觉用完就扔的小玩具作业给别人用上线贯穿任务给图书管理系统加登录功能',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, cr = crystal(b), m = melt(b);
    // ---------- 背景里的代码碎片：融化、冻结 ----------
    if (b < 14.6) alpha(cx, 1 - prog(b, 14.3, 14.6), () => {
      cx.font = fnt(400, 30, F.mono); cx.textBaseline = 'middle';
      CODE.forEach((s, i) => {
        const [x, y0, z] = CPOS[i], y = y0 - (b < 12 ? t * 6 * z : 0) % 60;
        const col = cr > .5 ? mixC('#bcd7ff', '#ffffff', hash(i)) : mixC('#ffd6f5', '#bdf3ff', hash(i * 2.1));
        const a = (.1 + .07 * z) * (b < 12 ? 1 - m * .2 : prog(b, 12, 12.3) * .8);
        if (b >= 12 || m <= .001) { cx.fillStyle = rgba(col, a); cx.fillText(s, x, y); return; }
        let xx = x;
        for (let j = 0; j < s.length; j++) {
          const ch = s[j], wch = K.cw(cx, ch), kk = Math.min(1, m * (1.2 + hash(i * 7 + j) * 1.4));
          cx.fillStyle = rgba(col, a * (1 - kk));
          cx.save(); cx.translate(xx, y + kk * kk * (120 + 380 * hash(j * 1.7 + i))); cx.scale(1, 1 + kk * 2.5); cx.fillText(ch, 0, 0); cx.restore();
          xx += wch;
        }
      });
    });
    // ---------- 肥皂泡：用完就扔的周末小项目 ----------
    for (const [s, x, pt] of BUB) {
      const k = prog(b, 8.8 + (pt - 9.5) * .3, pt, E.out), r = 92;
      if (k <= 0 || b > pt + .4) continue;
      const y = lerp(1180, 520 - (x % 300) * .25, k) + Math.sin(t * 2 + x) * 10, xx = x + Math.sin(t * 1.3 + x) * 14;
      if (b < pt) { iris(cx, xx, y, r, 1, t); txt(cx, s, xx, y, fnt(700, 30), '#ffffff', 'center'); }
      else { const p = prog(b, pt, pt + .35, E.out); alpha(cx, 1 - p, () => { iris(cx, xx, y, r * (1 + p * .6), 1, t); for (let j = 0; j < 10; j++) { const a = j / 10 * 6.283; circ(cx, xx + Math.cos(a) * r * (1 + p * 1.2), y + Math.sin(a) * r * (1 + p * 1.2) + p * p * 60, 6 * (1 - p), '#e8f6ff'); } }); }
    }
    // ---------- 柯林斯词典 ----------
    if (b >= 10.6 && b < 12.3) {
      const k = prog(b, 10.7, 11, E.back), ko = prog(b, 11.9, 12.2, E.in);
      alpha(cx, k * (1 - ko), () => scaleAt(cx, 1310, 470, .9 + .1 * k + ko * .3, () => {
        rr(cx, 1040, 300, 540, 340, 18, '#2a1840', '#c792ea', 3);
        txt(cx, 'Collins English Dictionary', 1080, 350, fnt(400, 22, F.mono), '#cdb4ee');
        txt(cx, 'vibe coding', 1080, 430, fnt(700, 62, F.mono), '#fff6ff');
        txt(cx, 'noun', 1080, 490, fnt(400, 24, F.mono), '#c792ea');
        const ks = prog(b, 11, 11.12, E.quad);
        if (ks > 0) rotAt(cx, 1310, 560, -.08, () => scaleAt(cx, 1310, 560, lerp(2.4, 1, ks), () => alpha(cx, Math.min(1, ks * 3), () => {
          rr(cx, 1110, 515, 400, 92, 10, rgba('#f2a65a', .2), '#f2a65a', 4);
          txt(cx, 'WORD OF THE YEAR 2025', 1310, 545, fnt(700, 24, F.mono), '#f2a65a', 'center');
          txt(cx, '柯林斯词典 2025 年度词', 1310, 582, fnt(700, 26), '#f2a65a', 'center');
        })));
      }));
    }
    // ---------- 项目轴（地平线） ----------
    const ka = prog(b, 14.5, 15, E.io);
    if (ka > 0) {
      const s = slider(b), len = AX.x1 - AX.x0, sx = AX.x0 + len * s;
      const g = cx.createLinearGradient(AX.x0, 0, AX.x1, 0); g.addColorStop(0, '#ffb3e6'); g.addColorStop(.5, '#d8c8ff'); g.addColorStop(1, '#9fd8ff');
      cx.fillStyle = rgba('#ffffff', .25); cx.fillRect(AX.x0, AX.y - 2, len * ka, 4);
      cx.fillStyle = g; cx.fillRect(AX.x0, AX.y - 4, (sx - AX.x0) * ka, 8);
      alpha(cx, ka, () => {
        circ(cx, AX.x0, AX.y, 10, '#ffb3e6');
        txt(cx, '用完就扔的小玩具', AX.x0, AX.y + 58, fnt(700, 32), '#ffe3f5', 'center');
        TK.forEach(([n, p]) => { const x = AX.x0 + len * p, lit = s >= p - 1e-3; cx.fillStyle = lit ? '#ffffff' : rgba('#ffffff', .35); cx.fillRect(x - 3, AX.y - 18, 6, 36); txt(cx, n, x, AX.y + 58, fnt(lit ? 900 : 500, 32), lit ? '#ffffff' : rgba('#ffffff', .55), 'center'); });
        if (b >= 15.75 && b < 16.4) alpha(cx, bump(b, 15.9, .2), () => { const gg = cx.createRadialGradient(AX.x1, AX.y, 0, AX.x1, AX.y, 220); gg.addColorStop(0, rgba('#9fd8ff', .9)); gg.addColorStop(1, rgba('#9fd8ff', 0)); cx.fillStyle = gg; cx.fillRect(AX.x1 - 220, AX.y - 220, 440, 440); });
        circ(cx, sx, AX.y, 24, '#1a1030'); circ(cx, sx, AX.y, 16, mixC('#ffb3e6', '#9fd8ff', s));
      });
      // 任务卡钉在「作业」
      const kc = prog(b, 16.2, 16.5, E.out);
      if (kc > 0) {
        const x = AX.x0 + len * .45, y = lerp(380, 560, kc), w = 640;
        alpha(cx, Math.min(1, kc * 2), () => {
          seg(cx, x, y + 70, x, AX.y - 24, rgba('#ffffff', .6), 2, [8, 8]);
          rr(cx, x - w / 2, y - 70, w, 140, 16, 'rgba(26,16,48,.92)', '#ffcf8a', 3);
          txt(cx, '贯穿任务', x - w / 2 + 30, y - 32, fnt(500, 24), '#ffcf8a');
          txt(cx, '给图书管理系统加登录功能', x - w / 2 + 30, y + 22, fnt(900, 42), '#fff6ea');
          const kp = prog(b, 16.5, 16.6, E.quad); if (kp > 0) { const py = lerp(y - 160, y - 76, kp); rr(cx, x - 13, py - 13, 26, 26, 6, '#f07178'); }
        });
      }
    }
    // ---------- Clawd ----------
    const bob = Math.sin(t * 1.6) * 12, pushing = b >= 14.8 && b < 16.45;
    let st = { x: 1560, y: 760 + bob, px: 16, skin: 'glow', col: '#ff7d55', hi: '#ffa27f', glow: '#ff5fa8', pose: 'idle', ph: t * 10, rot: Math.sin(t * .9) * .06, blink: b < 2.4 || (t % 3.2) < .12, eye: -1 };
    if (b >= 6.75 && b < 8.6) { st.pose = 'wave'; st.ph = t * 5; st.eye = 0; }
    if (b >= 8.6 && b < 10.7) { st.eyeY = -.4; st.eye = -1; }
    if (b >= 10.95 && b < 11.2) st.squash = 1 - .2 * Math.sin(Math.PI * prog(b, 10.95, 11.2, E.lin));
    if (b >= 12) { st = { ...st, skin: 'pixel', col: C.clawd, hi: C.clawdHi, rot: 0, x: 1560, y: 820, px: 16, glow: null, blink: (t % 3.1) < .12, eye: -1 }; st.nod = [12.5, 13, 13.5].some(x => b >= x && b < x + .12); }
    if (b >= 14.5) {
      const s = slider(b), sx = AX.x0 + (AX.x1 - AX.x0) * s;
      const into = prog(b, 14.5, 14.85, E.io), jump = Math.sin(Math.PI * into) * 160;
      st.x = lerp(1560, sx - 64, into); st.y = lerp(820, AX.y - 4, into) - jump; st.px = lerp(16, 12, into);
      if (pushing) { st.pose = 'push'; st.walk = t * 16; st.eye = 1; if (b >= 16) { st.eye = -1; st.x = sx + 64; st.pose = 'pointL'; } }
      if (b >= 15.75 && b < 16) { st.sweat = b - 15.75; st.x += (hash(Math.floor(t * 30)) - .5) * 5; }
      if (b >= 16.45) { st.pose = 'up'; st.eye = -1; const x = AX.x0 + (AX.x1 - AX.x0) * .45 + 380; st.x = x; st.y = AX.y - 4 - Math.sin(Math.PI * prog(b, 16.45, 16.7, E.lin)) * 60; }
    }
    clawd(cx, st);
    // ---------- 歌词 ----------
    const LX = 140;
    lyric(tx, L, { at: 1.3, out: 2.35, text: '2025 年 2 月', x: LX, y: 330, size: 30, fam: F.mono, w: 400, col: '#d9c8ff', anim: 'type', st: .2 });
    lyric(tx, L, { at: 1.45, out: 2.35, text: 'Andrej Karpathy 发了一条帖子', x: LX, y: 400, size: 56, w: 700, col: '#fff6ff', anim: 'blur', st: .15, outAnim: 'blur' });
    QUOTE.forEach(([en, zh], i) => {
      const at = 2.5 + i, out = i < 2 ? at + .95 : 6.6, big = i === 2;
      lyric(tx, L, { at, out, text: en, x: LX, y: 440, size: big ? 70 : 84, fam: F.serif, w: 700, col: '#fff8ff', acc: ['#ffd38a', '#ffd38a'], anim: 'blur', st: .14, d: .3, wave: .025, outAnim: 'blur', glow: [24, 'rgba(255,170,230,.55)'] });
      lyric(tx, L, { at: at + .1, out, text: zh, x: LX, y: 560, size: 40, w: 500, col: '#e8dcff', anim: 'fade', st: .2, outAnim: 'fade' });
    });
    lyric(tx, L, { at: 6.75, out: 8.6, text: '只用大白话告诉 AI 要什么，\n代码长什么样，‹都不管了›。', x: LX, y: 440, size: 66, w: 900, col: '#fff6ff', acc: ['#ffd38a'], anim: 'rise', st: .12, wave: .02, outAnim: 'blur' });
    lyric(tx, L, { at: 8.75, out: 10.6, text: '他自己也说：', x: LX, y: 250, size: 40, w: 500, col: '#e8dcff', anim: 'fade' });
    lyric(tx, L, { at: 9, out: 10.6, text: '适合«用完就扔»的周末小项目', x: LX, y: 330, size: 66, w: 900, col: '#fff6ff', acc: [C.num, '#ffd38a'], anim: 'rise', st: .12, outAnim: 'up' });
    lyric(tx, L, { at: 10.75, out: 11.9, text: '同年 11 月', x: LX, y: 410, size: 40, w: 500, col: '#e8dcff', anim: 'fade' });
    lyric(tx, L, { at: 10.85, out: 11.9, text: '柯林斯词典\n年度词', x: LX, y: 530, size: 84, w: 900, col: '#fff6ff', anim: 'drop', st: .1, outAnim: 'blur' });
    // 晶体段：三个勾
    lyric(tx, L, { at: 12, out: 14.4, text: 'Simon Willison 的界线', x: 960, y: 260, size: 40, w: 500, col: '#cfe3ff', align: 'center', anim: 'type', st: .08 });
    const W3 = [['审过', 12.5, 560], ['测过', 13, 960], ['能讲清', 13.5, 1360]];
    W3.forEach(([w, at, x], i) => {
      lyric(tx, L, { at, out: 14.4, text: w, x, y: 470, size: 110, w: 900, col: '#ffffff', align: 'center', anim: 'stamp', d: .12, outAnim: 'up', glow: [20, 'rgba(150,200,255,.6)'] });
      const kc = prog(b, at + .05, at + .2, E.back);
      if (kc > 0 && b < 14.6) alpha(tx, 1 - prog(b, 14.3, 14.5), () => scaleAt(tx, x, 360, kc, () => { tx.strokeStyle = '#a5f0a0'; tx.lineWidth = 10; tx.lineCap = 'round'; tx.beginPath(); tx.moveTo(x - 26, 360); tx.lineTo(x - 6, 382); tx.lineTo(x + 30, 336); tx.stroke(); }));
      if (i < 2) lyric(tx, L, { at: at + .25, out: 14.4, text: '&&', x: x + 200, y: 470, size: 50, fam: F.mono, w: 700, col: '#7fa6d8', align: 'center', anim: 'fade' });
    });
    lyric(tx, L, { at: 14, out: 14.4, text: '= ‹正常写程序›', x: 960, y: 630, size: 72, w: 900, col: '#ffffff', acc: ['#a5f0a0'], align: 'center', anim: 'stamp', d: .12, outAnim: 'up' });
    lyric(tx, L, { at: 14.1, out: 14.4, text: '不算 vibe coding', x: 960, y: 715, size: 34, w: 500, col: '#a9c4e8', align: 'center', anim: 'fade' });
    // 项目轴段
    lyric(tx, L, { at: 14.55, out: 16.15, text: '关键：«用多久？给谁用？»', x: LX, y: 290, size: 64, w: 900, col: '#ffffff', acc: [C.num, '#ffd38a'], anim: 'rise', st: .1, outAnim: 'up' });
    lyric(tx, L, { at: 15.25, out: 16.15, text: '越往右，越不能光凭感觉', x: LX, y: 400, size: 48, w: 700, col: '#d9e8ff', anim: 'rise', st: .08, outAnim: 'up' });
  },
};
};
