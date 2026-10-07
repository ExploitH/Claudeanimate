// 第一章 · 21:03「先 vibe 一下」：什么是 vibe coding
// f01a 现实：你说先 vibe 一下，Clawd 问你知不知道这个词从哪来；镜头推进屏幕
// f01b 梦：Karpathy 的帖子（三句原文和翻译）；「只说、不看代码」的循环；名字；他自己写的适用范围（肥皂泡）；年度词；
//      Simon Willison 的界线（三个勾，梦冻成晶体）；用多久、给谁用；项目轴，任务钉在「作业」上；规则 1
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f01a = K => window.MV_REAL(K, {
  scene: '01 · 21:03 先 vibe 一下',
  desc: '你说今晚先 vibe 一下，能跑就行；Clawd 问你知不知道这个词从哪来，镜头推进屏幕。',
  clock: [21, 3], stamp: ['周五', '21:03'],
  steps: [
    { pause: 1 },
    { id: 'v', you: '今晚先 vibe 一下，能跑就行。' },
    { me: 'vibe 一下？' },
    { id: 'q', me: '这个词，你知道是从哪来的吗？' },
    { you: '……网上都这么说？', enter: false },
    { id: 'tell', me: '那我先讲给你听。不长。' },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'desk', 0], [S.t('q'), 'over', 2.5], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  figure: (L, S) => ({ type: (L.b >= S.t('v') && L.b < S.t('v') + .8) || (L.b >= S.t('tell') - 1.4 && L.b < S.t('tell') - .7) ? 1 : 0, lean: K.prog(L.b, S.t('q'), S.t('q') + .6) * .35 }),
  sfx: S => [[S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    S.add('rain', 0, 0, 0, w.m.bars * 4, .8);
    ['Dm', 'Bb', 'F', 'C'].forEach((c, i) => S.add('pad', i, 0, H.CH[c].pad, 4, .35, 'warm'));
    S.add('piano', 0, 0, [62, 69], 3, .4); S.add('piano', 1, 2, [65], 2, .35); S.add('piano', 2, 0, [60, 67], 3, .35);
    S.add('riser', Math.floor(w.m.S.t('push')), 0, 0, 6, .5);
  },
});

R.f01b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, seq, narrate, scene } = K;
const CODE = ['function login(user, pwd) {', 'if (!user) return null;', 'const hash = sha256(pwd);', 'await db.users.find({ name })', 'for (let i = 0; i < n; i++)', 'return token;', 'session.set("uid", id);',
  'catch (e) { /* ??? */ }', '} else {', 'export default App;', 'if (tries > 5) lock();', 'res.json({ ok: true })'];
const CPOS = CODE.map((_, i) => [120 + hash(i * 3.7) * 1500, 140 + ((i * 83) % 820), .3 + hash(i * 1.3) * .7]);
const QUOTE = [['“fully give in to the vibes,', '完全顺着感觉走'], ['embrace exponentials,', '拥抱指数级增长——相信 AI 会越来越强'], ['and forget that the code even exists.”', '忘掉代码的存在']];
const BUB = [['周末 demo', 300], ['小游戏', 620], ['随手脚本', 1300], ['一次性网页', 1620]];
const AX = { x0: 220, x1: 1700, y: 760 }, TK = [['作业', .45], ['给别人用', .72], ['上线', 1]];
const S = seq([
  { id: 'post', say: '2025 年 2 月，有人在网上发了一条帖子。' },
  { id: 'who', say: '发帖的人叫 Andrej Karpathy，OpenAI 的联合创始人之一。', src: 'Karpathy, 2025-02', srcUntil: 'mean' },
  { say: '他在帖子里，描述了一种新的写代码的方式。' },
  { id: 'q1', say: '原话是这样的：', hold: .5 },
  { id: 'q2', pause: 2.6 },
  { id: 'q3', pause: 2.8 },
  { id: 'q4', pause: 2.4 },
  { id: 'mean', say: '意思是：只用大白话告诉 AI 你要什么。' },
  { id: 'loop', say: 'AI 写，你运行；出了错，就把报错原样丢回去，让它接着改。' },
  { id: 'blind', say: '代码长什么样？不看，也不管。', hold: .5 },
  { id: 'name', big: 'vibe coding', sub: '他给这种做法起的名字', bigS: { size: 140, fam: F.serif, w: 700, anim: 'blur', d: .35, st: .2, glow: [30, 'rgba(255,170,230,.6)'] }, hold: .5 },
  { id: 'magic', say: '听起来像魔法：你只管说，代码我来，看都不用看。' },
  { id: 'but', say: '但同一条帖子里，他还写了一句很多人没注意的话——', hold: .25 },
  { id: 'week', big: '这适合周末随手做、用完就扔的小项目。', bigS: { size: 64, y: 300 }, hold: 1 },
  { id: 'pop', say: '玩一下，扔掉。坏了，也没关系。', hold: 1 },
  { id: 'dict0', say: '后来，这个词火到什么程度？' },
  { id: 'dict', say: '同年 11 月，柯林斯词典把 vibe coding 选成了 2025 年度词。', src: 'Collins Dictionary, 2025-11', hold: .5 },
  { id: 'prob', say: '人人都在说，问题也跟着来了：' },
  { id: 'ask0', big: 'AI 写的代码，\n什么时候算 vibe coding，什么时候不算？', bigS: { size: 60, y: 450 }, hold: .5 },
  { id: 'sw', say: '程序员 Simon Willison 给了一条很实用的界线：', src: 'Simon Willison', srcUntil: 'real' },
  { id: 'checks', say: 'AI 写的代码，只要你审过、测过、能讲清它是怎么工作的——', hold: 1 },
  { id: 'normal', say: '那就是正常写程序，算不上 vibe coding。', hold: .75 },
  { id: 'real', say: '所以真正要问的，不是「用不用 AI」。' },
  { id: 'ask', big: '这个项目，要用多久？给谁用？', bigS: { size: 76, y: 400 }, hold: .5 },
  { id: 'axis', say: '画一条线。' },
  { id: 'left', say: '最左边，是玩完就扔的小玩具。' },
  { id: 'right', say: '往右走：作业、给别人用的程序、上线的服务。', hold: .5 },
  { id: 'cost', say: '越往右，出错的代价越大，越不能光凭感觉。', hold: .5 },
  { id: 'pin', say: '今晚的任务，在这儿：它是作业，在右边。', hold: .5 },
  { id: 'rule', rule: [1, '先判断这个项目在轴的哪一端'], dur: 3.5 },
], { start: 2.8, tail: .5 });
const t = S.t, e = S.e;
const QAT = [t('q2'), t('q3'), t('q4')];
const melt = b => prog(b, t('q4') + .4, t('q4') + 2.2, E.in) * (1 - prog(b, t('checks') - .2, t('checks')));
const CHK = [['审过', 0, 560], ['测过', .9, 960], ['能讲清', 1.8, 1360]].map(([w, d, x]) => [w, t('checks') + .3 + d, x]);
const crystal = b => b < t('axis') ? prog(b, t('checks'), t('checks') + .5, E.out) : lerp(.15, 1, slider(b));
function slider(b) { // 滑块：左 → 作业 → 给别人用 → 上线，再退回作业
  const a = t('right'), c = t('pin');
  if (b < a) return 0;
  const st = [[a + .2, .45], [a + .9, .72], [a + 1.6, 1]];
  let v = 0;
  for (const [s, p] of st) if (b >= s) v = p;
  const prev = st.filter(([s]) => b >= s).length - 1, prv = prev > 0 ? st[prev - 1][1] : 0;
  if (prev >= 0 && b < st[prev][0] + .35) v = lerp(prv, st[prev][1], prog(b, st[prev][0], st[prev][0] + .35, E.io));
  if (b >= c) v = lerp(1, .45, prog(b, c, c + .5, E.io));
  return v;
}
const bubK = (b, i) => prog(b, t('week') + .3 + i * .35, t('week') + 2.2 + i * .3, E.out);
const bubPop = i => t('pop') + .3 + i * .5;
function bubPos(b, tt, i) { const [, x] = BUB[i], k = bubK(b, i); return { k, x: x + Math.sin(tt * 1.3 + x) * 14, y: lerp(1200, 560 + (i % 2) * 120, k) + Math.sin(tt * 2 + x) * 10 }; }
// 晶体簇：冻结时沿四周析出；进项目轴后右后方越长越多
const XT = [[150, 600, -200, .8, 0], [330, 930, -150, .9, .5], [720, 960, -300, .7, 1], [1180, 950, -250, .8, 1.5], [1790, 520, -250, .8, .2], [1350, 990, -150, .6, 1.2],
  ...Array.from({ length: 8 }, (_, i) => [1180 + i * 95 + hash(i * 3.1) * 40, 420 + hash(i * 1.7) * 220 - i * 12, -900 - hash(i * 2.9) * 600, .9 + i * .1, 0])];
const NW = 6;
const POST = { x: 260, y: 230, w: 1100, h: 520 };
return scene({
  scene: '01 梦 · 什么是 vibe coding', look: LOOK.DREAM,
  desc: 'Karpathy 的帖子和三句原文；只说不看的循环；vibe coding 这个名字；他自己说适合用完就扔的小项目；柯林斯年度词；Simon Willison 的界线；项目轴；规则 1。',
  enter: { kind: TR.INK, a: 0, b: 3, p: [.5, .5, 0, 0] },
  hud: { num: '01', name: '什么是 vibe coding', time: '21:03', line: '先 vibe 一下', ink: '#f3eefc', acc: '#ffb3e6', mv: [2.1, 2.6] },
  par: L => { const b = L.b, cr = crystal(b); return [Math.max(0, (1 + 1.6 * melt(b)) * (1 - cr) * (b > t('dict') && b < t('prob') ? .45 : 1)), cr, .7 * (1 - cr * .6), 0]; },
  cam: L => { const b = L.b, sh = L.hit(t('dict') + .6, .25) * .012; return [1.02 + .02 * Math.sin(L.t * .25) + .04 * prog(b, t('q2'), t('mean'), E.io) * (1 - prog(b, t('mean'), t('mean') + .5, E.io)) + .03 * prog(b, t('axis'), t('cost'), E.io), .012 * Math.sin(L.t * .2) + (hash(Math.floor(L.t * 40)) - .5) * sh, 0, 0]; },
  focus: L => [.42, .45, .42, .5 * prog(L.b, t('q2'), t('q2') + .4) * (1 - prog(L.b, t('mean') - .4, t('mean')))],
  pulse: L => L.b >= t('checks') ? .7 : .25,
  sfx: [[t('post'), 'pop'], [t('who'), 'swish'], ...QAT.map((a, i) => [a, 'chime', [1175, 1319, 1568][i]]), [t('q4') + .5, 'whoosh'], [t('name'), 'sparkle'], [t('week'), 'bubble'], [t('week') + .6, 'bubble'],
    ...BUB.map((_, i) => [bubPop(i), 'pop']), [t('dict') + .1, 'paper'], [t('dict') + .6, 'stamp'], [t('checks'), 'freeze'], ...CHK.map(([, a], i) => [a, 'chime', [1319, 1568, 1976][i]]), [t('normal'), 'ding'],
    [t('axis'), 'whoosh'], [t('right') + .2, 'blip', 900], [t('right') + .9, 'blip', 1100], [t('right') + 1.6, 'glitch'], [t('pin'), 'swish'], [t('pin') + .8, 'stamp']],
  text: CODE.join('') + QUOTE.flat().join('') + BUB.map(b => b[0]).join('') + 'Andrej Karpathy@karpathy2025 年 2 月你说AI 写运行报错丢回去看不用代码Collins English Dictionary WORD OF THE YEAR 2025 noun 柯林斯词典 2025 年度词审过测过能讲清&&= 正常写程序用完就扔的小玩具作业给别人用上线今晚的任务给图书管理系统加登录功能',
  three(T, U) {
    const scene3 = new T.Scene();
    scene3.add(new T.AmbientLight(0xc8b8ff, .55));
    const l1 = new T.DirectionalLight(0xffffff, 1.1); l1.position.set(-400, 600, 900); scene3.add(l1);
    const l2 = new T.PointLight(0x9fd8ff, 1.4, 0, 2); l2.position.set(600, -200, 600); scene3.add(l2);
    const sph = new T.SphereGeometry(96, 48, 32), dropG = new T.SphereGeometry(1, 8, 6);
    const bubs = BUB.map((_, i) => {
      const g = new T.Group(), film = U.film(T), m = new T.Mesh(sph, film);
      const hl = new T.Mesh(new T.TorusGeometry(96 * .72, 3.2, 8, 40, Math.PI * .5), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7, depthWrite: false }));
      hl.position.z = 96 * .55; hl.rotation.z = 1.9; g.add(m, hl);
      const r = U.rnd(i + 3), drops = Array.from({ length: 22 }, () => { const d = new T.Mesh(dropG, new T.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, depthWrite: false })); d.userData = { th: r() * 6.283, ph: Math.acos(2 * r() - 1), s: 3 + r() * 5, v: .8 + r() * .8 }; scene3.add(d); return d; });
      scene3.add(g); return { g, film, hl, drops };
    });
    const xg = new T.OctahedronGeometry(1, 0);
    const xtals = XT.map(([x, y, z, s], i) => {
      const grp = new T.Group(), r = U.rnd(i * 7 + 1), n = 5 + Math.floor(r() * 3);
      for (let j = 0; j < n; j++) {
        const mat = new T.MeshStandardMaterial({ color: new T.Color().setHSL(.58 + r() * .1, .55, .55).convertSRGBToLinear(), roughness: .15, metalness: .3, flatShading: true, transparent: true, opacity: .7, emissive: 0x0a1230 });
        const m = new T.Mesh(xg, mat), h = (90 + r() * 140) * s, w = (16 + r() * 18) * s;
        m.scale.set(w, h, w); m.rotation.z = (r() - .5) * 1.6; m.rotation.y = r() * 3; m.position.set((r() - .5) * 50 * s, (r() - .3) * 40 * s, (r() - .5) * 60);
        m.userData = { d: j * .06 }; grp.add(m);
      }
      grp.userData = { x, y, z, d: XT[i][4] }; scene3.add(grp); return grp;
    });
    return {
      scene: scene3,
      update(L) {
        const b = L.b, tt = L.t; let any = false;
        bubs.forEach((o, i) => {
          const p = bubPos(b, tt, i), pop = prog(b, bubPop(i), bubPop(i) + .45, E.out);
          o.g.visible = p.k > 0 && pop < 1; o.drops.forEach(d => d.visible = false);
          if (!o.g.visible) return; any = true;
          U.at(o.g, p.x, p.y, 0); o.g.rotation.set(Math.sin(tt * .7 + i) * .3, tt * .5 + i, 0);
          o.g.scale.setScalar((.6 + .4 * U.out(p.k)) * (1 + pop * .5));
          o.film.uniforms.uT.value = tt + i * 1.7; o.film.uniforms.uA.value = 1 - pop * 1.6; o.hl.material.opacity = .7 * Math.max(0, 1 - pop * 3);
          if (pop > 0) o.drops.forEach(d => { const u = d.userData, r0 = 96 * (1 + pop * 1.6 * u.v); d.visible = true; d.scale.setScalar(u.s * (1 - pop)); d.position.set(o.g.position.x + r0 * Math.sin(u.ph) * Math.cos(u.th), o.g.position.y + r0 * Math.cos(u.ph) - pop * pop * 120, r0 * Math.sin(u.ph) * Math.sin(u.th)); d.material.opacity = .85 * (1 - pop); });
        });
        const s = slider(b);
        xtals.forEach((g, i) => {
          const { x, y, z, d } = g.userData, isW = i < NW;
          const k = isW ? prog(b, t('checks') + d, t('checks') + d + .4, E.out) * (1 - prog(b, t('axis') - .3, t('axis'))) : prog(b, t('axis'), t('axis') + .5, E.out) * prog(s, (i - NW) / 8 * .9, (i - NW) / 8 * .9 + .15);
          g.visible = k > .001; if (!g.visible) return; any = true;
          U.at(g, x, y, z); g.rotation.y = tt * .25 + i; g.rotation.x = .2 * Math.sin(tt * .3 + i);
          g.children.forEach(m => { const kk = U.back(prog(k, m.userData.d, m.userData.d + .7)); m.visible = kk > .01; m.material.opacity = .7 * Math.min(1, kk); });
          g.scale.setScalar(Math.max(.001, U.back(k)) * (1 + .05 * L.beat));
        });
        return any;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, cr = crystal(b), m = melt(b);
    // ---------- 背景代码：景深分层漂着；第三句原文时融化 ----------
    if (b < t('axis') + .1) alpha(cx, 1 - prog(b, t('axis') - .3, t('axis')), () => {
      cx.textBaseline = 'middle';
      CODE.forEach((s, i) => {
        const [x, y0, z] = CPOS[i], y = y0 - (b < t('checks') ? (tt * 6 * z) % 60 : 0), ds = .6 + z * .4;
        const col = cr > .5 ? mixC('#bcd7ff', '#ffffff', hash(i)) : mixC('#ffd6f5', '#bdf3ff', hash(i * 2.1));
        const a = (.07 + .09 * z) * (b < t('checks') ? 1 - m * .2 : prog(b, t('checks'), t('checks') + .3) * .7) * (1 - .6 * prog(b, t('post'), t('post') + .5) * (1 - prog(b, t('mean') - .3, t('mean'))));
        cx.font = fnt(400, Math.round(26 * ds), F.mono);
        if (b >= t('checks') || m <= .001) { cx.fillStyle = rgba(col, a); cx.fillText(s, x, y); return; }
        let xx = x;
        for (let j = 0; j < s.length; j++) {
          const ch = s[j], wch = cx.measureText(ch).width, kk = Math.min(1, m * (1.2 + hash(i * 7 + j) * 1.4));
          cx.fillStyle = rgba(col, a * (1 - kk));
          cx.save(); cx.translate(xx, y + kk * kk * (120 + 380 * hash(j * 1.7 + i))); cx.scale(1, 1 + kk * 2.6); cx.fillText(ch, 0, 0); cx.restore();
          xx += wch;
        }
      });
    });
    // ---------- 帖子卡片：名字、日期，三句原文依次出现，每句带翻译 ----------
    const kp = prog(b, t('post'), t('post') + .4, E.out) * (1 - prog(b, t('mean') - .3, t('mean') + .1, E.in));
    if (kp > 0) alpha(tx, kp, () => {
      const { x, y, w, h } = POST, yy = y + (1 - kp) * 40;
      rr(tx, x, yy, w, h, 26, 'rgba(24,14,40,.72)', 'rgba(255,214,245,.35)', 2);
      circ(tx, x + 64, yy + 66, 30, '#c9a6ff'); txt(tx, 'A', x + 64, yy + 67, fnt(900, 30), '#2a1840', 'center');
      const kw = prog(b, t('who'), t('who') + .3);
      txt(tx, 'Andrej Karpathy', x + 112, yy + 52, fnt(700, 30), mixC('#cdb4ee', '#ffffff', kw));
      txt(tx, '2025 年 2 月', x + 112, yy + 86, fnt(400, 22, F.mono), '#a993c9');
      if (kw > 0) alpha(tx, kw, () => { rr(tx, x + w - 360, yy + 40, 320, 48, 24, 'rgba(255,214,245,.12)'); txt(tx, 'OpenAI 联合创始人之一', x + w - 200, yy + 64, fnt(500, 24), '#ffd6f5', 'center'); });
      QUOTE.forEach(([en, zh], i) => {
        const a = QAT[i], k = prog(b, a, a + .5, E.out); if (k <= 0) return;
        const cur = i === QAT.filter(q => b >= q).length - 1, dim = cur || b >= t('q4') + 2 ? 1 : .45, ly = yy + 170 + i * 112;
        alpha(tx, k * dim, () => {
          txt(tx, en, x + 64 + (1 - k) * 20, ly, fnt(700, 50, F.serif), i === 2 && b >= t('q4') + .4 ? '#ffd38a' : '#fff8ff');
          txt(tx, zh, x + 66, ly + 48, fnt(500, 28), '#e8dcff');
        });
      });
    });
    // ---------- 「只说、不看」的循环 ----------
    const kl = prog(b, t('mean'), t('mean') + .4) * (1 - prog(b, t('name') - .3, t('name')));
    if (kl > 0) alpha(cx, kl, () => {
      const N = [['你说', '大白话', 560, 380], ['AI 写', '代码', 960, 260], ['运行', '能跑吗？', 1360, 380], ['报错', '原样丢回去', 960, 560]];
      const ka = prog(b, t('loop'), t('loop') + 1.6, E.lin);
      N.forEach(([n, d, x, y], i) => {
        const on = i === 0 ? 1 : prog(ka, (i - 1) / 3, (i - 1) / 3 + .2);
        alpha(cx, .25 + .75 * on, () => { rr(cx, x - 120, y - 52, 240, 104, 22, 'rgba(40,20,60,.85)', '#ffb3e6', 3); txt(cx, n, x, y - 12, fnt(900, 40), '#ffffff', 'center'); txt(cx, d, x, y + 28, fnt(500, 24), '#e8dcff', 'center'); });
        const [, , x2, y2] = N[(i + 1) % 4], kk = i === 3 ? prog(ka, .95, 1) : prog(ka, i / 3, i / 3 + .25);
        if (kk > 0) K.arrow(cx, lerp(x, x2, .25), lerp(y, y2, .25), lerp(x, x2, .75), lerp(y, y2, .75), rgba('#ffb3e6', .8), 4, 16, kk);
      });
      // 代码：一只被划掉的眼睛
      const kb = prog(b, t('blind'), t('blind') + .3, E.back);
      if (kb > 0) scaleAt(cx, 960, 410, kb, () => {
        cx.strokeStyle = '#fff6ff'; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(960, 410, 70, 38, 0, 0, 6.283); cx.stroke(); circ(cx, 960, 410, 18, '#fff6ff');
        cx.strokeStyle = '#ff6fae'; cx.lineWidth = 9; cx.beginPath(); cx.moveTo(890, 460); cx.lineTo(1030, 360); cx.stroke();
      });
    });
    // ---------- 肥皂泡上的字 ----------
    BUB.forEach(([s0], i) => {
      const p = bubPos(b, tt, i), pop = prog(b, bubPop(i), bubPop(i) + .45, E.out);
      if (p.k <= 0 || pop >= 1) return;
      if (!window.THREE) alpha(cx, 1 - pop, () => circ(cx, p.x, p.y, 96, rgba('#ffffff', .06), '#ffb3e6', 4));
      alpha(tx, Math.min(1, p.k * 2) * (1 - Math.min(1, pop * 2.5)), () => txt(tx, s0, p.x, p.y, fnt(700, 30), '#ffffff', 'center'));
    });
    // ---------- 柯林斯词典 ----------
    const kd = prog(b, t('dict'), t('dict') + .35, E.back) * (1 - prog(b, t('prob') + .2, t('prob') + .6, E.in));
    if (kd > 0) alpha(cx, kd, () => scaleAt(cx, 960, 480, .9 + .1 * kd, () => {
      rr(cx, 690, 300, 540, 340, 18, '#2a1840', '#c792ea', 3);
      txt(cx, 'Collins English Dictionary', 730, 350, fnt(400, 22, F.mono), '#cdb4ee');
      txt(cx, 'vibe coding', 730, 430, fnt(700, 62, F.mono), '#fff6ff');
      txt(cx, 'noun', 730, 490, fnt(400, 24, F.mono), '#c792ea');
      const ks = prog(b, t('dict') + .6, t('dict') + .72, E.quad);
      if (ks > 0) rotAt(cx, 960, 560, -.08, () => scaleAt(cx, 960, 560, lerp(2.4, 1, ks), () => alpha(cx, Math.min(1, ks * 3), () => {
        rr(cx, 760, 515, 400, 92, 10, rgba('#f2a65a', .2), '#f2a65a', 4);
        txt(cx, 'WORD OF THE YEAR 2025', 960, 545, fnt(700, 24, F.mono), '#f2a65a', 'center');
        txt(cx, '柯林斯词典 2025 年度词', 960, 582, fnt(700, 26), '#f2a65a', 'center');
      })));
    }));
    // ---------- 三个勾 ----------
    const WOUT = t('real');
    CHK.forEach(([w, at, x], i) => {
      lyric(tx, L, { at, out: WOUT, text: w, x, y: 430, size: 110, w: 900, col: '#ffffff', align: 'center', anim: 'stamp', d: .12, outAnim: 'up', glow: [20, 'rgba(150,200,255,.6)'] });
      const kc = prog(b, at + .05, at + .2, E.back);
      if (kc > 0 && b < WOUT + .3) alpha(tx, 1 - prog(b, WOUT, WOUT + .25), () => scaleAt(tx, x, 320, kc, () => { tx.strokeStyle = '#a5f0a0'; tx.lineWidth = 10; tx.lineCap = 'round'; tx.beginPath(); tx.moveTo(x - 26, 320); tx.lineTo(x - 6, 342); tx.lineTo(x + 30, 296); tx.stroke(); }));
      if (i < 2) lyric(tx, L, { at: at + .25, out: WOUT, text: '&&', x: x + 200, y: 430, size: 50, fam: F.mono, w: 700, col: '#7fa6d8', align: 'center', anim: 'fade' });
    });
    lyric(tx, L, { at: t('normal'), out: WOUT, text: '= ‹正常写程序›', x: 960, y: 600, size: 76, w: 900, col: '#ffffff', acc: ['#a5f0a0'], align: 'center', anim: 'stamp', d: .12, outAnim: 'up' });
    lyric(tx, L, { at: t('normal') + .2, out: WOUT, text: '不算 vibe coding', x: 960, y: 690, size: 36, w: 500, col: '#a9c4e8', align: 'center', anim: 'fade' });
    // ---------- 项目轴 ----------
    const ka = prog(b, t('axis'), t('axis') + .6, E.io);
    if (ka > 0) {
      const s = slider(b), len = AX.x1 - AX.x0, sx = AX.x0 + len * s;
      const g = cx.createLinearGradient(AX.x0, 0, AX.x1, 0); g.addColorStop(0, '#ffb3e6'); g.addColorStop(.5, '#d8c8ff'); g.addColorStop(1, '#9fd8ff');
      cx.fillStyle = rgba('#ffffff', .25); cx.fillRect(AX.x0, AX.y - 2, len * ka, 4);
      cx.fillStyle = g; cx.fillRect(AX.x0, AX.y - 4, (sx - AX.x0) * ka, 8);
      alpha(cx, ka, () => {
        circ(cx, AX.x0, AX.y, 10, '#ffb3e6');
        alpha(cx, prog(b, t('left'), t('left') + .3), () => txt(cx, '用完就扔的小玩具', AX.x0, AX.y + 58, fnt(700, 32), '#ffe3f5', 'center'));
        TK.forEach(([n, p]) => { const x = AX.x0 + len * p, lit = s >= p - 1e-3, kv = prog(b, t('right'), t('right') + .3); cx.fillStyle = lit ? '#ffffff' : rgba('#ffffff', .35); cx.fillRect(x - 3, AX.y - 18, 6, 36); alpha(cx, kv, () => txt(cx, n, x, AX.y + 58, fnt(lit ? 900 : 500, 32), lit ? '#ffffff' : rgba('#ffffff', .55), 'center')); });
        const kr = prog(b, t('cost'), t('cost') + .4);
        if (kr > 0) alpha(cx, kr, () => { K.arrow(cx, AX.x0 + 200, AX.y - 120, AX.x1 - 80, AX.y - 120, rgba('#9fd8ff', .8), 4, 18); txt(cx, '出错的代价越来越大', (AX.x0 + AX.x1) / 2 + 60, AX.y - 150, fnt(700, 30), '#d9ecff', 'center'); });
        circ(cx, sx, AX.y, 24, '#1a1030'); circ(cx, sx, AX.y, 16, mixC('#ffb3e6', '#9fd8ff', s));
      });
      const kc = prog(b, t('pin'), t('pin') + .4, E.out);
      if (kc > 0) {
        const x = AX.x0 + len * .45, y = lerp(320, 500, kc), w = 660;
        alpha(tx, Math.min(1, kc * 2), () => {
          seg(tx, x, y + 70, x, AX.y - 24, rgba('#ffffff', .6), 2, [8, 8]);
          rr(tx, x - w / 2, y - 70, w, 140, 16, 'rgba(26,16,48,.92)', '#ffcf8a', 3);
          txt(tx, '今晚的任务', x - w / 2 + 30, y - 32, fnt(500, 24), '#ffcf8a');
          txt(tx, '给图书管理系统加登录功能', x - w / 2 + 30, y + 22, fnt(900, 42), '#fff6ea');
          const kp2 = prog(b, t('pin') + .8, t('pin') + .9, E.quad); if (kp2 > 0) rr(tx, x - 13, lerp(y - 160, y - 76, kp2) - 13, 26, 26, 6, '#f07178');
        });
      }
    }
    // ---------- Clawd ----------
    const bob = Math.sin(tt * 1.6) * 12;
    let st = { x: 1640, y: 780 + bob, px: 14, skin: 'glow', col: '#ff7d55', hi: '#ffa27f', glow: '#ff5fa8', pose: 'idle', ph: tt * 10, rot: Math.sin(tt * .9) * .06, blink: (tt % 3.2) < .12, eye: -1 };
    if (b >= t('magic') && b < t('but')) { st.pose = 'wave'; st.ph = tt * 4; st.eye = 0; }
    if (b >= t('week') && b < t('dict0')) { st.eyeY = -.4; }
    if (b >= t('dict') + .55 && b < t('dict') + .8) st.squash = 1 - .2 * Math.sin(Math.PI * prog(b, t('dict') + .55, t('dict') + .8, E.lin));
    if (b >= t('checks')) { st = { ...st, skin: 'pixel', col: C.clawd, hi: C.clawdHi, rot: 0, y: 830, glow: null, blink: (tt % 3.1) < .12 }; st.nod = CHK.some(([, a]) => b >= a && b < a + .12); }
    if (b >= t('axis')) {
      const s = slider(b), sx = AX.x0 + (AX.x1 - AX.x0) * s, into = prog(b, t('axis'), t('axis') + .4, E.io), jump = Math.sin(Math.PI * into) * 160;
      st.x = lerp(1640, sx - 64, into); st.y = lerp(830, AX.y - 4, into) - jump; st.px = lerp(14, 12, into);
      if (b >= t('right') && b < t('pin')) { st.pose = 'push'; st.walk = tt * 16; st.eye = 1; }
      if (s > .95 && b < t('pin')) { st.sweat = (b * 2) % 1; st.x += (hash(Math.floor(tt * 30)) - .5) * 5; }
      if (b >= t('pin')) { st.pose = 'up'; st.eye = -1; st.x = AX.x0 + (AX.x1 - AX.x0) * .45 + 400; }
    }
    clawd(cx, st);
    narrate(tx, L, S, { sub: { y: 975 } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD;
    H.pads(Sm, 0, B, PD, 'warm', .6);
    H.arps(Sm, 0, Math.ceil(t('checks')), PD, 'tri', .5, [0, 1, 2, 3, 2, 1, 2, 3], .42);
    Sm.add('crackle', 0, 0, 0, B * 4, .45);
    // 帖子段：轻轻的 lo-fi；原文三句时长笛吹主旋律
    const g0 = Math.ceil(t('q1'));
    H.each(g0, Math.ceil(t('checks')), b => { Sm.add('kick', b, 0, 0, 0, .6, 'soft'); Sm.add('kick', b, 2.5, 0, 0, .4, 'soft'); Sm.add('snare', b, 2, 0, 0, .4, 'lofi'); });
    H.hats(Sm, g0, Math.ceil(t('checks')), .5, .22, false, false, true);
    H.roots(Sm, g0, Math.ceil(t('checks')), PD, 'sub', .5, [[0, 4]]);
    H.hook(Sm, Math.round(t('q2')), 'flute', 0, 0, 8, .6);
    // 冻结：四拍底鼓，琶音变亮
    const c0 = Math.ceil(t('checks'));
    Sm.add('crash', c0, 0, 0, 0, .5);
    H.four(Sm, c0, B, .62); H.back(Sm, c0 + 1, B, 'clap', .4); H.hats(Sm, c0, B, .25, .16);
    H.arps(Sm, c0, B, PD, 'arp', .25, [0, 1, 2, 3, 1, 2, 3, 2], .32, 12);
    H.roots(Sm, c0, B, PD, 'saw', .45, [[0, .5], [.5, .5, 12], [1, .5], [1.5, .5, 12], [2, .5], [2.5, .5, 12], [3, .5], [3.5, .5, 12]]);
    H.roll(Sm, B - 1, 2, 4, 'snare', 'main', .2, .7, .25);
  },
}, S);
};
})();
