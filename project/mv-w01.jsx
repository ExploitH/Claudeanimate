// 01 什么是 vibe coding · 梦：流体虹彩，原句漂浮、代码按景深分层融化；停一拍；3D 肥皂泡缓缓升起、按拍子破掉；年度词；
// 三个勾让梦冻结，3D 晶体从字后面析出；地平线变成项目轴，越往右晶体越多
(window.MV_W = window.MV_W || {}).w01 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd } = K;
const CODE = ['function login(user, pwd) {', 'if (!user) return null;', 'const hash = sha256(pwd);', 'await db.users.find({ name })', 'for (let i = 0; i < n; i++)', 'return token;', 'session.set("uid", id);',
  'catch (e) { /* ??? */ }', '} else {', 'export default App;', 'if (tries > 5) lock();', 'res.json({ ok: true })'];
// 第三个数是景深：大 = 近（字大、亮、漂得快）
const CPOS = CODE.map((_, i) => [120 + hash(i * 3.7) * 1500, 140 + ((i * 83) % 820), .3 + hash(i * 1.3) * .7]);
// 肥皂泡：[字, x, 破的时刻]；从 b9.2 起依次升起
const BUB = [['周末 demo', 380, 10], ['小游戏', 700, 10.5], ['随手脚本', 1020, 10.75], ['一次性网页', 1330, 11]];
const BR = 96, bubY = x => 560 - (x % 300) * .25;
const AX = { x0: 220, x1: 1700, y: 770 }, TK = [['作业', .45], ['给别人用', .72], ['上线', 1]];
const QUOTE = [['“fully give in to the vibes,', '完全顺着感觉走'], ['embrace exponentials,', '拥抱指数级增长'], ['and ‹forget that the code even exists.›”', '忘掉代码的存在']];
const W3 = [['审过', 13.5, 560], ['测过', 14, 960], ['能讲清', 14.5, 1360]];
const AXIS = 16.3;
// 滑块：每拍走一格
function slider(b) {
  if (b < 17) return 0;
  if (b < 18) { const st = [[17, 0], [17.25, .45], [17.5, .72], [17.75, 1]]; let v = 0; for (let i = 0; i < st.length; i++) if (b >= st[i][0]) v = i + 1 < st.length ? lerp(st[i][1], st[i + 1][1], prog(b, st[i][0], st[i][0] + .2, E.io)) : 1; return v; }
  return lerp(1, .45, prog(b, 18, 18.4, E.io));
}
const melt = b => prog(b, 4.75, 6.5, E.in) * (1 - prog(b, 13, 13.2));
const crystal = b => b < AXIS ? prog(b, 13, 13.35, E.out) : lerp(.15, 1, slider(b));
const bubK = (b, i) => { const [, , pt] = BUB[i]; return prog(b, 9.15 + i * .2, pt - .1, E.out); };
function iris(ctx, x, y, r, a, t) { // 没有 3D 时的 2D 肥皂泡
  const g = ctx.createLinearGradient(x - r, y - r, x + r, y + r);
  ['#ff9ad5', '#9ae6ff', '#c9a6ff', '#fff2a8', '#ff9ad5'].forEach((c, i) => g.addColorStop(i / 4, rgba(c, .9 * a)));
  ctx.fillStyle = rgba('#ffffff', .06 * a); ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  ctx.strokeStyle = g; ctx.lineWidth = 4; ctx.stroke();
  ctx.strokeStyle = rgba('#ffffff', .8 * a); ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, r * .78, -2.5 + t * .3, -1.9 + t * .3); ctx.stroke();
}
function bubPos(b, t, i) {
  const [, x] = BUB[i], k = bubK(b, i);
  return { k, x: x + Math.sin(t * 1.3 + x) * 14, y: lerp(1200, bubY(x), k) + Math.sin(t * 2 + x) * 10 };
}
// 晶体簇：[x, y, 景深, 大小, 出现时刻]；冻结时沿画面四周析出（不挡字），进项目轴后在右后方随滑块越长越多
const XT = [[150, 600, -200, .8, 13.1], [330, 930, -150, .9, 13.55], [720, 960, -300, .7, 14.05], [1180, 950, -250, .8, 14.55], [1790, 520, -250, .8, 13.3], [1350, 990, -150, .6, 14.3],
  ...Array.from({ length: 8 }, (_, i) => [1180 + i * 95 + hash(i * 3.1) * 40, 420 + hash(i * 1.7) * 220 - i * 12, -900 - hash(i * 2.9) * 600, .9 + i * .1, AXIS + .1])];
const NW = 6;
return {
  scene: '01 梦 · 什么是 vibe coding', bars: 22, look: 1,
  enter: { kind: TR.INK, a: 1, b: 3, p: [960 / 1920, 690 / 1080, 0, 0] },
  hud: { num: '01', name: '什么是 vibe coding', time: '21:03', line: '先 vibe 一下', ink: '#f3eefc', acc: '#ffb3e6' },
  you: [[1, 2.25, '今晚先 vibe 一下，能跑就行']],
  rule: { n: 1, at: 20, text: '先判断这个项目在轴的哪一端' },
  src: [[1.3, 11.3, 'Karpathy, 2025-02'], [11.5, 13, 'Collins Dictionary, 2025-11'], [13, 16.3, 'Simon Willison']],
  par: L => { const b = L.b, cr = crystal(b); return [Math.max(0, (1 + 1.6 * melt(b)) * (1 - cr) * (b > 11.5 && b < 13 ? .45 : 1) * (1 - .4 * bump(b, 8.35, .4))), cr, .7 * (1 - cr * .6), 0]; },
  cam: L => { const b = L.b, sh = L.hit(12, .25) * .012; return [1.02 + .02 * Math.sin(L.t * .25) + .04 * prog(b, 2.5, 6.6, E.io) * (1 - prog(b, 6.6, 7.1, E.io)) + .03 * prog(b, AXIS, 18.5, E.io), .012 * Math.sin(L.t * .2) + (hash(Math.floor(L.t * 40)) - .5) * sh, 0, 0]; },
  focus: L => [.33, .42, .38, .55 * prog(L.b, 2.4, 2.8) * (1 - prog(L.b, 6.5, 6.9))],
  pulse: L => L.b >= 13 ? .8 : .3,
  sfx: [[1.3, 'swish'], [2.5, 'chime', 1175], [3.5, 'swish'], [4.5, 'chime', 1568], [4.75, 'whoosh'], [6.75, 'swish'], [8.75, 'swish'], [9.15, 'bubble'], [9.55, 'bubble'],
    ...BUB.map(b => [b[2], 'pop']), [11.6, 'paper'], [12, 'stamp'], [13, 'freeze'], ...W3.map(([, at], i) => [at, 'chime', [1319, 1568, 1976][i]]), [15.25, 'ding'],
    [AXIS + .05, 'whoosh'], [17.25, 'blip', 900], [17.5, 'blip', 1100], [17.75, 'glitch'], [18, 'swish'], [18.5, 'whoosh'], [18.8, 'stamp']],
  text: CODE.join('') + QUOTE.flat().join('') + BUB.map(b => b[0]).join('') + '2025 年 2 月这个词，出自 Andrej Karpathy 的一条帖子听起来像魔法——你只管说，代码我来，看都不用看。可他在同一条帖子里就写了：后来，这个词火进了词典2025 年度词程序员 Simon Willison 划了一条线所以先问一句：能跑就行？这是作业，在右边。适合用完就扔的周末小项目柯林斯词典Collins English Dictionary WORD OF THE YEAR 2025 vibe coding noun 审过测过能讲清&&= 正常写程序不算 vibe coding用多久？给谁用？越往右，越不能光凭感觉用完就扔的小玩具作业给别人用上线贯穿任务给图书管理系统加登录功能',
  three(T, U) {
    const scene = new T.Scene();
    scene.add(new T.AmbientLight(0xc8b8ff, .55));
    const l1 = new T.DirectionalLight(0xffffff, 1.1); l1.position.set(-400, 600, 900); scene.add(l1);
    const l2 = new T.PointLight(0x9fd8ff, 1.4, 0, 2); l2.position.set(600, -200, 600); scene.add(l2);
    // 肥皂泡：虹彩薄膜 + 一道高光；破掉时膨胀、散成水雾粒子
    const sph = new T.SphereGeometry(BR, 48, 32), dropG = new T.SphereGeometry(1, 8, 6);
    const bubs = BUB.map((_, i) => {
      const g = new T.Group(), film = U.film(T), m = new T.Mesh(sph, film);
      const hl = new T.Mesh(new T.TorusGeometry(BR * .72, 3.2, 8, 40, Math.PI * .5), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .7, depthWrite: false }));
      hl.position.z = BR * .55; hl.rotation.z = 1.9;
      g.add(m, hl);
      const r = U.rnd(i + 3), drops = Array.from({ length: 22 }, () => {
        const d = new T.Mesh(dropG, new T.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, depthWrite: false }));
        d.userData = { th: r() * 6.283, ph: Math.acos(2 * r() - 1), s: 3 + r() * 5, v: .8 + r() * .8 }; scene.add(d); return d;
      });
      scene.add(g); return { g, film, hl, drops };
    });
    // 晶体：拉长的八面体，平面着色出棱面高光
    const xg = new T.OctahedronGeometry(1, 0);
    const xtals = XT.map(([x, y, z, s], i) => {
      const grp = new T.Group(), r = U.rnd(i * 7 + 1);
      const n = 5 + Math.floor(r() * 3);
      for (let j = 0; j < n; j++) {
        const mat = new T.MeshStandardMaterial({ color: new T.Color().setHSL(.58 + r() * .1, .55, .55).convertSRGBToLinear(), roughness: .15, metalness: .3, flatShading: true, transparent: true, opacity: .7, emissive: 0x0a1230 });
        const m = new T.Mesh(xg, mat), h = (90 + r() * 140) * s, w = (16 + r() * 18) * s;
        m.scale.set(w, h, w); m.rotation.z = (r() - .5) * 1.6; m.rotation.y = r() * 3; m.position.set((r() - .5) * 50 * s, (r() - .3) * 40 * s, (r() - .5) * 60);
        m.userData = { d: j * .06 }; grp.add(m);
      }
      grp.userData = { x, y, z, at: XT[i][4] }; scene.add(grp); return grp;
    });
    return {
      scene,
      update(L) {
        const b = L.b, t = L.t;
        let any = false;
        bubs.forEach((o, i) => {
          const pt = BUB[i][2], p = bubPos(b, t, i), pop = prog(b, pt, pt + .45, E.out);
          o.g.visible = p.k > 0 && pop < 1;
          o.drops.forEach(d => d.visible = false);
          if (!o.g.visible) return; any = true;
          U.at(o.g, p.x, p.y, 0);
          o.g.rotation.set(Math.sin(t * .7 + i) * .3, t * .5 + i, 0);
          o.g.scale.setScalar((.6 + .4 * U.out(p.k)) * (1 + pop * .5));
          o.film.uniforms.uT.value = t + i * 1.7; o.film.uniforms.uA.value = (1 - pop * 1.6);
          o.hl.material.opacity = .7 * Math.max(0, 1 - pop * 3);
          if (pop > 0) o.drops.forEach(d => {
            const u = d.userData, rr0 = BR * (1 + pop * 1.6 * u.v);
            d.visible = true; d.scale.setScalar(u.s * (1 - pop));
            d.position.set(o.g.position.x + rr0 * Math.sin(u.ph) * Math.cos(u.th), o.g.position.y + rr0 * Math.cos(u.ph) - pop * pop * 120, rr0 * Math.sin(u.ph) * Math.sin(u.th));
            d.material.opacity = .85 * (1 - pop);
          });
        });
        // 晶体：冻结时从字后面长出来；进项目轴后越往右越密，跟着滑块亮
        const s = slider(b);
        xtals.forEach((g, i) => {
          const { x, y, z, at } = g.userData, isW = i < NW;
          const k = isW ? prog(b, at, at + .35, E.out) * (1 - prog(b, AXIS - .2, AXIS + .1)) : prog(b, at, at + .5, E.out) * prog(s, (i - NW) / 8 * .9, (i - NW) / 8 * .9 + .15);
          g.visible = k > .001; if (!g.visible) return; any = true;
          U.at(g, x, y, z);
          g.rotation.y = t * .25 + i; g.rotation.x = .2 * Math.sin(t * .3 + i);
          g.children.forEach(m => { const kk = U.back(prog(k, m.userData.d, m.userData.d + .7)); m.visible = kk > .01; m.material.opacity = .7 * Math.min(1, kk); });
          g.scale.setScalar(Math.max(.001, U.back(k)) * (1 + .05 * L.beat));
        });
        return any;
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, t = L.t, cr = crystal(b), m = melt(b), has3d = !!window.THREE;
    // ---------- 背景代码：景深分层漂移；融化时每个字被拉长、垂落 ----------
    if (b < AXIS + .1) alpha(cx, 1 - prog(b, AXIS - .2, AXIS + .1), () => {
      cx.textBaseline = 'middle';
      CODE.forEach((s, i) => {
        const [x, y0, z] = CPOS[i], y = y0 - (b < 13 ? (t * 6 * z) % 60 : 0), ds = .6 + z * .4;
        const col = cr > .5 ? mixC('#bcd7ff', '#ffffff', hash(i)) : mixC('#ffd6f5', '#bdf3ff', hash(i * 2.1));
        const a = (.08 + .1 * z) * (b < 13 ? 1 - m * .2 : prog(b, 13, 13.3) * .8);
        cx.font = fnt(400, Math.round(26 * ds), F.mono);
        if (b >= 13 || m <= .001) { cx.fillStyle = rgba(col, a); cx.fillText(s, x, y); return; }
        let xx = x;
        for (let j = 0; j < s.length; j++) {
          const ch = s[j], wch = cx.measureText(ch).width, kk = Math.min(1, m * (1.2 + hash(i * 7 + j) * 1.4));
          cx.fillStyle = rgba(col, a * (1 - kk));
          cx.save(); cx.translate(xx, y + kk * kk * (120 + 380 * hash(j * 1.7 + i))); cx.scale(1, 1 + kk * 2.6); cx.fillText(ch, 0, 0); cx.restore();
          xx += wch;
        }
      });
    });
    // ---------- 肥皂泡（球体在 3D 层，字在文字层） ----------
    BUB.forEach(([s, , pt], i) => {
      const p = bubPos(b, t, i);
      if (p.k <= 0 || b > pt + .5) return;
      const pop = prog(b, pt, pt + .45, E.out);
      if (!has3d) alpha(cx, 1 - pop, () => iris(cx, p.x, p.y, BR * (1 + pop * .5), 1, t));
      alpha(tx, Math.min(1, p.k * 2) * (1 - Math.min(1, pop * 2.5)), () => txt(tx, s, p.x, p.y, fnt(700, 30), '#ffffff', 'center'));
    });
    // ---------- 柯林斯词典 ----------
    if (b >= 11.5 && b < 13.1) {
      const k = prog(b, 11.6, 11.9, E.back), ko = prog(b, 12.7, 13, E.in);
      alpha(cx, k * (1 - ko), () => scaleAt(cx, 1310, 470, .9 + .1 * k + ko * .3, () => {
        rr(cx, 1040, 300, 540, 340, 18, '#2a1840', '#c792ea', 3);
        txt(cx, 'Collins English Dictionary', 1080, 350, fnt(400, 22, F.mono), '#cdb4ee');
        txt(cx, 'vibe coding', 1080, 430, fnt(700, 62, F.mono), '#fff6ff');
        txt(cx, 'noun', 1080, 490, fnt(400, 24, F.mono), '#c792ea');
        const ks = prog(b, 12, 12.12, E.quad);
        if (ks > 0) rotAt(cx, 1310, 560, -.08, () => scaleAt(cx, 1310, 560, lerp(2.4, 1, ks), () => alpha(cx, Math.min(1, ks * 3), () => {
          rr(cx, 1110, 515, 400, 92, 10, rgba('#f2a65a', .2), '#f2a65a', 4);
          txt(cx, 'WORD OF THE YEAR 2025', 1310, 545, fnt(700, 24, F.mono), '#f2a65a', 'center');
          txt(cx, '柯林斯词典 2025 年度词', 1310, 582, fnt(700, 26), '#f2a65a', 'center');
        })));
      }));
    }
    // ---------- 项目轴 ----------
    const ka = prog(b, AXIS, AXIS + .45, E.io);
    if (ka > 0) {
      const s = slider(b), len = AX.x1 - AX.x0, sx = AX.x0 + len * s;
      const g = cx.createLinearGradient(AX.x0, 0, AX.x1, 0); g.addColorStop(0, '#ffb3e6'); g.addColorStop(.5, '#d8c8ff'); g.addColorStop(1, '#9fd8ff');
      cx.fillStyle = rgba('#ffffff', .25); cx.fillRect(AX.x0, AX.y - 2, len * ka, 4);
      cx.fillStyle = g; cx.fillRect(AX.x0, AX.y - 4, (sx - AX.x0) * ka, 8);
      alpha(cx, ka, () => {
        circ(cx, AX.x0, AX.y, 10, '#ffb3e6');
        txt(cx, '用完就扔的小玩具', AX.x0, AX.y + 58, fnt(700, 32), '#ffe3f5', 'center');
        TK.forEach(([n, p]) => { const x = AX.x0 + len * p, lit = s >= p - 1e-3; cx.fillStyle = lit ? '#ffffff' : rgba('#ffffff', .35); cx.fillRect(x - 3, AX.y - 18, 6, 36); txt(cx, n, x, AX.y + 58, fnt(lit ? 900 : 500, 32), lit ? '#ffffff' : rgba('#ffffff', .55), 'center'); });
        if (b >= 17.75 && b < 18.4) alpha(cx, bump(b, 17.9, .2), () => { const gg = cx.createRadialGradient(AX.x1, AX.y, 0, AX.x1, AX.y, 220); gg.addColorStop(0, rgba('#9fd8ff', .9)); gg.addColorStop(1, rgba('#9fd8ff', 0)); cx.fillStyle = gg; cx.fillRect(AX.x1 - 220, AX.y - 220, 440, 440); });
        circ(cx, sx, AX.y, 24, '#1a1030'); circ(cx, sx, AX.y, 16, mixC('#ffb3e6', '#9fd8ff', s));
      });
      // 任务卡钉在「作业」
      const kc = prog(b, 18.5, 18.8, E.out);
      if (kc > 0) {
        const x = AX.x0 + len * .45, y = lerp(380, 560, kc), w = 640;
        alpha(tx, Math.min(1, kc * 2), () => {
          seg(tx, x, y + 70, x, AX.y - 24, rgba('#ffffff', .6), 2, [8, 8]);
          rr(tx, x - w / 2, y - 70, w, 140, 16, 'rgba(26,16,48,.92)', '#ffcf8a', 3);
          txt(tx, '今晚的任务', x - w / 2 + 30, y - 32, fnt(500, 24), '#ffcf8a');
          txt(tx, '给图书管理系统加登录功能', x - w / 2 + 30, y + 22, fnt(900, 42), '#fff6ea');
          const kp = prog(b, 18.8, 18.9, E.quad); if (kp > 0) { const py = lerp(y - 160, y - 76, kp); rr(tx, x - 13, py - 13, 26, 26, 6, '#f07178'); }
        });
      }
    }
    // ---------- Clawd ----------
    const bob = Math.sin(t * 1.6) * 12, pushing = b >= 16.65 && b < 18.45;
    let st = { x: 1560, y: 760 + bob, px: 16, skin: 'glow', col: '#ff7d55', hi: '#ffa27f', glow: '#ff5fa8', pose: 'idle', ph: t * 10, rot: Math.sin(t * .9) * .06, blink: b < 2.4 || (t % 3.2) < .12, eye: -1 };
    if (b >= 6.75 && b < 8.6) { st.pose = 'wave'; st.ph = t * 4; st.eye = 0; st.blink = (t % 2.2) < .3; }
    if (b >= 9.1 && b < 11.4) { st.eyeY = -.4; st.eye = -1; }
    if (b >= 11.95 && b < 12.2) st.squash = 1 - .2 * Math.sin(Math.PI * prog(b, 11.95, 12.2, E.lin));
    if (b >= 13) { st = { ...st, skin: 'pixel', col: C.clawd, hi: C.clawdHi, rot: 0, x: 1560, y: 820, px: 16, glow: null, blink: (t % 3.1) < .12, eye: -1 }; st.nod = W3.some(([, x]) => b >= x && b < x + .12); }
    if (b >= AXIS) {
      const s = slider(b), sx = AX.x0 + (AX.x1 - AX.x0) * s;
      const into = prog(b, AXIS, AXIS + .35, E.io), jump = Math.sin(Math.PI * into) * 160;
      st.x = lerp(1560, sx - 64, into); st.y = lerp(820, AX.y - 4, into) - jump; st.px = lerp(16, 12, into);
      if (pushing) { st.pose = 'push'; st.walk = t * 16; st.eye = 1; if (b >= 18) { st.eye = -1; st.x = sx + 64; st.pose = 'pointL'; } }
      if (b >= 17.75 && b < 18) { st.sweat = b - 17.75; st.x += (hash(Math.floor(t * 30)) - .5) * 5; }
      if (b >= 18.45) { st.pose = 'up'; st.eye = -1; st.x = AX.x0 + (AX.x1 - AX.x0) * .45 + 380; st.y = AX.y - 4 - Math.sin(Math.PI * prog(b, 18.45, 18.7, E.lin)) * 60; }
    }
    clawd(cx, st);
    // ---------- 歌词 ----------
    const LX = 140;
    lyric(tx, L, { at: 1.3, out: 2.35, text: '2025 年 2 月', x: LX, y: 330, size: 30, fam: F.mono, w: 400, col: '#d9c8ff', anim: 'type', st: .2 });
    lyric(tx, L, { at: 1.45, out: 2.35, text: '这个词，出自 Andrej Karpathy 的一条帖子', x: LX, y: 400, size: 52, w: 700, col: '#fff6ff', anim: 'blur', st: .15, outAnim: 'blur' });
    QUOTE.forEach(([en, zh], i) => {
      const at = 2.5 + i, out = i < 2 ? at + .95 : 6.6, big = i === 2;
      lyric(tx, L, { at, out, text: en, x: LX, y: 440, size: big ? 70 : 84, fam: F.serif, w: 700, col: '#fff8ff', acc: ['#ffd38a', '#ffd38a'], anim: 'blur', st: .14, d: .3, wave: .025, outAnim: 'blur', glow: [24, 'rgba(255,170,230,.55)'] });
      lyric(tx, L, { at: at + .1, out, text: zh, x: LX, y: 560, size: 40, w: 500, col: '#e8dcff', anim: 'fade', st: .2, outAnim: 'fade' });
    });
    lyric(tx, L, { at: 6.75, out: 7.95, text: '听起来像魔法——\n你只管说，代码我来，‹看都不用看›。', x: LX, y: 440, size: 66, w: 900, col: '#fff6ff', acc: ['#ffd38a'], anim: 'rise', st: .12, wave: .02, outAnim: 'blur' });
    // b8–8.75：停一拍，只剩流体
    lyric(tx, L, { at: 8.75, out: 11.35, text: '可他在同一条帖子里就写了：', x: LX, y: 250, size: 40, w: 500, col: '#e8dcff', anim: 'fade' });
    lyric(tx, L, { at: 9, out: 11.35, text: '适合«用完就扔»的周末小项目', x: LX, y: 330, size: 66, w: 900, col: '#fff6ff', acc: [C.num, '#ffd38a'], anim: 'rise', st: .12, outAnim: 'up' });
    lyric(tx, L, { at: 11.5, out: 12.9, text: '后来，这个词火进了词典', x: LX, y: 410, size: 40, w: 500, col: '#e8dcff', anim: 'fade' });
    lyric(tx, L, { at: 11.6, out: 12.9, text: '柯林斯词典\n2025 年度词', x: LX, y: 530, size: 84, w: 900, col: '#fff6ff', anim: 'drop', st: .1, outAnim: 'blur' });
    // 冻结：三拍各砸一个词，打完停一整拍
    const WOUT = AXIS - .1;
    lyric(tx, L, { at: 13, out: WOUT, text: '程序员 Simon Willison 划了一条线', x: 960, y: 260, size: 40, w: 500, col: '#cfe3ff', align: 'center', anim: 'type', st: .08 });
    W3.forEach(([w, at, x], i) => {
      lyric(tx, L, { at, out: WOUT, text: w, x, y: 470, size: 110, w: 900, col: '#ffffff', align: 'center', anim: 'stamp', d: .12, outAnim: 'up', glow: [20, 'rgba(150,200,255,.6)'] });
      const kc = prog(b, at + .05, at + .2, E.back);
      if (kc > 0 && b < AXIS) alpha(tx, 1 - prog(b, WOUT - .2, WOUT), () => scaleAt(tx, x, 360, kc, () => { tx.strokeStyle = '#a5f0a0'; tx.lineWidth = 10; tx.lineCap = 'round'; tx.beginPath(); tx.moveTo(x - 26, 360); tx.lineTo(x - 6, 382); tx.lineTo(x + 30, 336); tx.stroke(); }));
      if (i < 2) lyric(tx, L, { at: at + .25, out: WOUT, text: '&&', x: x + 200, y: 470, size: 50, fam: F.mono, w: 700, col: '#7fa6d8', align: 'center', anim: 'fade' });
    });
    lyric(tx, L, { at: 15.25, out: WOUT, text: '= ‹正常写程序›', x: 960, y: 630, size: 72, w: 900, col: '#ffffff', acc: ['#a5f0a0'], align: 'center', anim: 'stamp', d: .12, outAnim: 'up' });
    lyric(tx, L, { at: 15.35, out: WOUT, text: '不算 vibe coding', x: 960, y: 715, size: 34, w: 500, col: '#a9c4e8', align: 'center', anim: 'fade' });
    // 项目轴
    lyric(tx, L, { at: AXIS + .1, out: 18.4, text: '所以先问一句：«用多久？给谁用？»', x: LX, y: 290, size: 64, w: 900, col: '#ffffff', acc: [C.num, '#ffd38a'], anim: 'rise', st: .1, outAnim: 'up' });
    lyric(tx, L, { at: 17, out: 18.4, text: '越往右，越不能光凭感觉', x: LX, y: 400, size: 48, w: 700, col: '#d9e8ff', anim: 'rise', st: .08, outAnim: 'up' });
    lyric(tx, L, { at: 19, out: 21.85, text: '能跑就行？\n这是作业，在‹右边›。', x: LX, y: 300, size: 64, w: 900, col: '#ffffff', acc: ['#9fd8ff'], anim: 'rise', st: .1 });
  },
};
};
