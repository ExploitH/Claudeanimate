// 05 选模型和费用 · 霓虹：额度表报警；每轮重发、包裹越来越大；副歌里两辆霓虹车赛跑，便宜的多绕几圈总价反超；三块招牌分档；击掌
(window.MV_W = window.MV_W || {}).w05 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, sing } = K;
const PK = '#ff4fb8', CY = '#3ef0ff', PU = '#b45cff', YE = '#ffe45c', GR = '#4dff9e', RD = '#ff3b5c', WH = '#fff4fc';
const TIERS = [['旗舰', PK, '最强，也最慢最贵', ['架构设计', '难查的 bug', '长时间自主跑的任务']], ['主力', CY, '日常主力', ['日常写功能']], ['轻量', GR, '又快又便宜', ['补全代码', '改格式', '简单重命名']]];
const MODELS = ['通义千问', '智谱 GLM', 'Kimi', 'DeepSeek'];
function glow(ctx, col, blur, fn) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = blur; fn(); ctx.restore(); }
function ntxt(ctx, s, x, y, font, col, align = 'left', a = 1) { alpha(ctx, a, () => glow(ctx, col, 10, () => txt(ctx, s, x, y, font, mixC(col, '#ffffff', .72), align))); }
function nbox(ctx, x, y, w, h, col, lw = 4, r = 16, a = 1) { alpha(ctx, a, () => glow(ctx, col, 12, () => { rr(ctx, x, y, w, h, r, null, col, lw); rr(ctx, x, y, w, h, r, null, mixC(col, '#ffffff', .6), lw * .35); })); }
const flick = (b, at) => b < at ? 0 : b > at + .2 ? 1 : hash(Math.floor(b * 64) + at * 13) > .45 ? 1 : .15;
// 赛跑：A 单价低绕 6 圈，B 单价高绕 2 圈
const RACE = [4.25, 8];
const lapsA = b => 6 * prog(b, RACE[0], RACE[1], E.lin), lapsB = b => 2 * prog(b, RACE[0], 6.25, E.lin);
// 3D 赛道：椭圆跑道躺在一个向后倾 TILT 的平面上，中心在画面 (600, 560)
const TR3 = { ox: 580, oy: 560, rx: 330, rz: 300, tilt: .62 };
const trackLocal = (laps, r0, h) => { const a = Math.PI / 2 - laps * 6.283; return [Math.cos(a) * (TR3.rx + r0), h, Math.sin(a) * (TR3.rz + r0), a]; };
function trackPt(laps, r0, h) { // 局部点 → 画布坐标（和 3D 相机同一套透视）
  const [X, Y, Z] = trackLocal(laps, r0, h), c = Math.cos(TR3.tilt), sn = Math.sin(TR3.tilt);
  const y = Y * c - Z * sn, z = Y * sn + Z * c, Z0 = (window.MV_3D && window.MV_3D.U.Z0) || 2015, k = Z0 / (Z0 - z);
  return [960 + (TR3.ox - 960 + X) * k, 540 - (540 - TR3.oy + y) * k];
}
// 击掌之后停半拍（副歌段 4–12 不动，跟主旋律对齐）
return K.warpWorld({
  scene: '05 霓虹 · 选模型和费用', bars: 20, look: 5,
  enter: { kind: TR.FLASH, a: .5, b: .5, flash: 1 },
  hud: { num: '05', name: '选模型和费用', time: '22:30', line: '额度没了？', ink: '#ffe7ff', acc: PK },
  you: [[.3, 1.4, '欸？额度怎么没了']],
  rule: { n: 4, at: 18, text: '按任务选模型，按任务算费用' },
  src: [],
  par: L => { const b = L.b, sx = b < 1.4 ? .5 : b < 4 ? .3 : b < 8 ? .5 : b < 14 ? .5 : .78; return [b < 1.4 ? .22 : b < 4 ? .6 : b < 8 ? .45 : b < 14 ? .12 : .5, b >= 4 && b < 8 ? 1.2 : .35, .55, sx]; },
  cam: L => { const b = L.b, race = b >= 4 && b < 8; return [race ? 1.04 : 1.0, race ? .01 * Math.sin(L.t * 1.5) : 0, 0, 0]; },
  lb: L => .45 * prog(L.b, 3.9, 4.2) * (1 - prog(L.b, 7.9, 8.2)),
  pulse: L => L.b >= 4 && L.b < 12 ? 1 : .6,
  sfx: [[0, 'alarm'], [1.5, 'whoosh'], [2, 'whoosh'], [2.5, 'whoosh'], [3, 'whoosh'], [4.25, 'zap'], ...[1, 2, 3, 4, 5].map(i => [4.25 + i * 3.75 / 6, 'coin']), [5.25, 'coin'], [6.25, 'coin'], [7.5, 'stamp'],
    [8, 'buzz'], [8.5, 'buzz'], [9, 'buzz'], [10.25, 'blip', 1500], [10.75, 'blip', 500], [12, 'ding'], [13, 'glitch'], [14, 'buzz'], [16.5, 'pop'], [16.5, 'sparkle'], [17, 'swish']],
  text: TIERS.flatMap(t => [t[0], t[2], ...t[3]]).join('') + MODELS.join('') + '登录才写一半，这个月的额度见底了钱花哪儿了？每一轮，前面所有内容都要重新发一遍选模型，看活儿分数受测试用的工具影响，公开题目也可能混进了训练数据国内能直接用的，都有编程套餐：我不介意。免费版可能拿你的代码去训练——看清设置课程练习一般没事；实习和公司的代码，按公司规定登录功能写到一半，额度见底了钱都花哪儿了？本月额度每一轮，之前的内容都重新发一遍对话越长，每轮越贵第 1 轮第 2 轮第 3 轮第 4 轮模型1k3k6k10k tokens便宜的模型多绕几圈总价反而更高单价低单价高A 总价B 总价A 反超算完成一个任务花多少，别只盯单价token：模型计费的单位，约一个词或一两个汉字FINISH LAP思考强度：难题调高，机械活调低思考强度难题机械活订阅有用量上限；按量付费的 API，记得设预算提醒预算提醒排行榜看看就好分数受测试工具影响，公开题目也可能混进训练数据拿你自己的真实任务，试两三个模型排行榜国内能直接用，都有面向编程的套餐卡住了？换个模型再问一遍放心，我不会介意免费版可能拿你的数据去训练：看清设置课程练习一般没关系；实习和公司代码，按公司规定',
  three(T, U) {
    const scene = new T.Scene();
    scene.add(new T.AmbientLight(0xffffff, .4));
    const l1 = new T.PointLight(0xff4fb8, 3, 0, 2); l1.position.set(-200, 600, 700); scene.add(l1);
    const plane = new T.Group(); scene.add(plane);
    const neon = (col, op = 1) => new T.MeshBasicMaterial({ color: new T.Color(col).convertSRGBToLinear(), transparent: true, opacity: op });
    // 跑道：三圈霓虹管（中线 + 内外两条），一圈半透明路面
    [[0, 7, PU], [-50, 3, '#e8c9ff'], [50, 3, '#e8c9ff']].forEach(([d, tube, col]) => {
      const m = new T.Mesh(new T.TorusGeometry(1, tube / TR3.rx, 8, 160), neon(col)); m.rotation.x = Math.PI / 2; m.scale.set(TR3.rx + d, TR3.rz + d, 1); plane.add(m);
    });
    const road = new T.Mesh(new T.RingGeometry(.86, 1.14, 160), new T.MeshBasicMaterial({ color: 0x2a0a40, transparent: true, opacity: .55, side: T.DoubleSide, depthWrite: false }));
    road.rotation.x = -Math.PI / 2; road.scale.set(TR3.rx, TR3.rz, 1); plane.add(road);
    // 看台：外侧一排发光的柱子
    for (let i = 0; i < 28; i++) { const a = i / 28 * 6.283, p = new T.Mesh(new T.BoxGeometry(10, 40 + (i % 3) * 20, 10), neon(i % 2 ? PK : CY, .7)); p.position.set(Math.cos(a) * (TR3.rx + 85), 20, Math.sin(a) * (TR3.rz + 150)); plane.add(p); }
    // 终点线：黑白格
    for (let i = 0; i < 6; i++) { const q = new T.Mesh(new T.BoxGeometry(14, 2, 32), new T.MeshBasicMaterial({ color: i % 2 ? 0x222222 : 0xffffff })); q.position.set(0, 2, TR3.rz - 50 + i * 20); q.scale.z = .62; plane.add(q); }
    const mkCar = col => { const g = new T.Group(); const body = new T.Mesh(new T.BoxGeometry(58, 18, 30), new T.MeshStandardMaterial({ color: new T.Color(col).convertSRGBToLinear(), emissive: new T.Color(col).convertSRGBToLinear(), emissiveIntensity: .8 })); body.position.y = 12; const cab = new T.Mesh(new T.BoxGeometry(26, 14, 24), neon('#ffffff', .9)); cab.position.set(-4, 26, 0); g.add(body, cab); plane.add(g); return g; };
    const cars = [mkCar(CY), mkCar(PK)];
    return {
      scene,
      update(L) {
        const b = L.b, kc = prog(b, 3.95, 4.2) * (1 - prog(b, 7.95, 8.1));
        if (kc <= 0) return false;
        U.at(plane, TR3.ox, TR3.oy, 0); plane.rotation.set(TR3.tilt, 0, 0); plane.scale.setScalar(.85 + .15 * kc);
        [[lapsA(b), 25], [lapsB(b), -25]].forEach(([laps, r0], i) => {
          const [X, , Z, a] = trackLocal(laps, r0, 0);
          cars[i].position.set(X, 0, Z); cars[i].rotation.set(0, a + Math.PI / 2 + Math.PI, .25 * (i ? 1 : 1));
        });
        return true;
      },
    };
  },
  draw(cx, tx, L) {
    const has3d = !!window.THREE;
    const b = L.b, t = L.t;
    // ---------- 额度表 ----------
    const kq = prog(b, 0, .2) * (1 - prog(b, 1.3, 1.5)) + prog(b, 12, 12.2) * (1 - prog(b, 12.9, 13.05));
    if (kq > 0) alpha(cx, kq, () => {
      const x = 900, y = 330, w = 820, lv = b < 2 ? lerp(1, .06, prog(b, .1, .9, E.in)) : .55, col = lv < .2 ? RD : lv < .5 ? YE : GR;
      ntxt(cx, '本月额度', x, y - 50, fnt(900, 36), WH);
      nbox(cx, x, y, w, 70, col, 4, 10);
      alpha(cx, (b < 2 && lv < .2 ? (Math.floor(b * 16) % 2 ? .4 : 1) : 1) * .75, () => glow(cx, col, 14, () => rr(cx, x + 10, y + 10, (w - 20) * lv, 50, 6, col)));
      ntxt(cx, Math.round(lv * 100) + '%', x + w + 30, y + 35, fnt(900, 44, F.mono), col);
      if (b >= 12) { const bx = x + w * .8; glow(cx, YE, 16, () => seg(cx, bx, y - 20, bx, y + 90, YE, 4, [8, 6])); ntxt(cx, '预算提醒', bx, y + 130, fnt(900, 30), YE, 'center'); }
    });
    // ---------- 每轮重发 ----------
    const kr = prog(b, 1.4, 1.6) * (1 - prog(b, 3.85, 4.05));
    if (kr > 0) alpha(cx, kr, () => {
      const mx = 1640, my = 560;
      nbox(cx, mx - 90, my - 90, 180, 180, PU, 5, 20); ntxt(cx, '模型', mx, my, fnt(900, 44), PU, 'center');
      [1.5, 2, 2.5, 3].forEach((at, i) => {
        const k = prog(b, at, at + .15, E.back); if (k <= 0) return;
        const y = 380 + i * 120, x = 760;
        nbox(cx, x - 120, y - 40, 240, 80, CY, 3, 12, Math.min(1, k)); ntxt(cx, '第 ' + (i + 1) + ' 轮', x, y, fnt(700, 32), CY, 'center', Math.min(1, k));
        const n = i + 1, fly = prog(b, at + .1, at + .45, E.io), px = lerp(x + 140, mx - 110 - n * 30, fly);
        for (let j = 0; j < n; j++) glow(cx, YE, 14, () => rr(cx, px + j * 30, y - 13 - (j % 2) * 4, 26, 26, 4, YE));
        ntxt(cx, ['1k', '3k', '6k', '10k'][i] + ' tokens', px + n * 30 + 14, y + 36, fnt(700, 22, F.mono), YE, 'left', fly);
      });
    });
    // ---------- 赛跑 ----------
    const kc = prog(b, 3.95, 4.2) * (1 - prog(b, 7.95, 8.1));
    if (kc > 0) alpha(cx, kc, () => {
      const ox = 600, oy = 560, rx = 400, ry = 210;
      if (has3d) { // 3D 赛道：只在这里写车标签（按透视投影到画面上）
        [[lapsA(b), 25, CY, 'A'], [lapsB(b), -25, PK, 'B']].forEach(([laps, r0, col, lab]) => { const [x, y] = trackPt(laps, r0, 70); ntxt(cx, lab, x, y, fnt(900, 24), col, 'center'); });
      } else {
      glow(cx, PU, 24, () => { cx.strokeStyle = PU; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(ox, oy, rx, ry, 0, 0, 6.283); cx.stroke(); cx.lineWidth = 2; cx.strokeStyle = '#e8c9ff'; cx.beginPath(); cx.ellipse(ox, oy, rx - 50, ry - 50, 0, 0, 6.283); cx.stroke(); cx.beginPath(); cx.ellipse(ox, oy, rx + 50, ry + 50, 0, 0, 6.283); cx.stroke(); });
      glow(cx, WH, 10, () => { for (let i = 0; i < 6; i++) { cx.fillStyle = i % 2 ? '#222' : WH; cx.fillRect(ox - 6, oy + ry - 50 + i * 17, 12, 17); } });
      const car = (laps, rr0, col, lab) => {
        const a = Math.PI / 2 - laps * 6.283, x = ox + Math.cos(a) * (rx + rr0), y = oy + Math.sin(a) * (ry + rr0);
        glow(cx, col, 26, () => { cx.save(); cx.translate(x, y); cx.rotate(a + Math.PI); rr(cx, -26, -14, 52, 28, 8, col); cx.restore(); });
        ntxt(cx, lab, x, y - 40, fnt(900, 24), col, 'center');
      };
      car(lapsA(b), 25, CY, 'A'); car(lapsB(b), -25, PK, 'B');
      }
      if (b >= 6.25) ntxt(cx, 'B 到终点', ox + 120, oy + ry + 40, fnt(900, 28), PK, 'left');
      // 总价条
      const x0 = 1120, uw = 110, cA = Math.floor(lapsA(b) + 1e-6) * 1, cB = Math.floor(lapsB(b) + 1e-6) * 2.4;
      [['A · 单价低', CY, cA, 430, '绕 ' + Math.floor(lapsA(b) + 1e-6) + ' 圈'], ['B · 单价高', PK, cB, 610, '绕 ' + Math.floor(lapsB(b) + 1e-6) + ' 圈']].forEach(([n, col, c, y, laps]) => {
        ntxt(cx, n, x0, y - 50, fnt(900, 32), col); ntxt(cx, laps, x0 + 640, y - 50, fnt(700, 24), col, 'right');
        nbox(cx, x0, y - 22, 680, 44, col, 2, 8, .5); alpha(cx, .7, () => glow(cx, col, 12, () => rr(cx, x0 + 6, y - 16, Math.min(668, c * uw), 32, 6, col)));
        ntxt(cx, c.toFixed(1), x0 + 690, y, fnt(900, 30, F.mono), col);
      });
      const kx = prog(b, 7.5, 7.65, E.back);
      if (kx > 0) scaleAt(cx, 1460, 740, kx, () => rotAt(cx, 1460, 740, -.08, () => { nbox(cx, 1300, 700, 320, 80, YE, 5, 10); ntxt(cx, 'A 反超', 1460, 740, fnt(900, 44), YE, 'center'); }));
    });
    // ---------- 三档招牌 ----------
    const kt = prog(b, 7.95, 8.1) * (1 - prog(b, 11.85, 12));
    if (kt > 0) alpha(cx, kt, () => {
      const up = prog(b, 10, 10.3, E.io);
      TIERS.forEach(([n, col, sub, tasks], i) => {
        const f = flick(b, 8 + i * .5); if (f <= 0) return;
        const x = 400 + i * 560, y = lerp(450, 400, up);
        alpha(cx, f, () => { nbox(cx, x - 230, y - 140, 460, 230, col, 6, 22); ntxt(cx, n, x, y - 50, fnt(900, 96), col, 'center'); ntxt(cx, sub, x, y + 50, fnt(700, 30), WH, 'center'); });
        alpha(cx, f * (1 - up), () => tasks.forEach((s, j) => ntxt(cx, s, x, y + 160 + j * 52, fnt(700, 34), mixC(col, '#ffffff', .4), 'center')));
      });
      // 思考强度旋钮
      const kd = prog(b, 10.1, 10.3);
      if (kd > 0) alpha(cx, kd, () => {
        const ox = 960, oy = 760, r = 160, a = b < 10.25 ? -Math.PI / 2 : b < 10.75 ? lerp(-Math.PI / 2, -.35, prog(b, 10.25, 10.4, E.back)) : lerp(-.35, -Math.PI + .35, prog(b, 10.75, 10.9, E.back));
        glow(cx, YE, 18, () => { cx.strokeStyle = YE; cx.lineWidth = 6; cx.beginPath(); cx.arc(ox, oy, r, Math.PI, 0); cx.stroke(); cx.lineWidth = 8; cx.beginPath(); cx.moveTo(ox, oy); cx.lineTo(ox + Math.cos(a) * (r - 20), oy + Math.sin(a) * (r - 20)); cx.stroke(); });
        ntxt(cx, '思考强度', ox, oy + 50, fnt(900, 34), YE, 'center');
        ntxt(cx, '机械活', ox - r - 30, oy, fnt(700, 30), GR, 'right'); ntxt(cx, '难题', ox + r + 30, oy, fnt(700, 30), PK, 'left');
      });
    });
    // ---------- 排行榜 ----------
    const kl = prog(b, 13, 13.15) * (1 - prog(b, 13.9, 14.05));
    if (kl > 0) alpha(cx, kl, () => {
      const x = 1080, y = 330;
      nbox(cx, x, y - 70, 620, 420, CY, 4, 18); ntxt(cx, '排行榜', x + 310, y - 20, fnt(900, 40), CY, 'center');
      ['#1  ████  91.2', '#2  ███   89.7', '#3  ███   88.5'].forEach((s, i) => { const gl = hash(i + Math.floor(b * 30)) > .8 ? (hash(i * 3 + Math.floor(b * 30)) - .5) * 30 : 0; ntxt(cx, s, x + 60 + gl, y + 60 + i * 80, fnt(700, 40, F.mono), WH); });
      ntxt(cx, '?', x + 560, y + 260, fnt(900, 90), YE, 'center');
    });
    // ---------- 国内模型 ----------
    const km = prog(b, 14, 14.1) * (1 - prog(b, 15.9, 16));
    if (km > 0) alpha(cx, km, () => MODELS.forEach((s, i) => {
      const f = flick(b, 14 + i * .25), col = [CY, PK, YE, GR][i], x = 330 + i * 420, y = 520;
      alpha(cx, f, () => { nbox(cx, x - 180, y - 70, 360, 140, col, 5, 70); ntxt(cx, s, x, y, fnt(900, 48), col, 'center'); });
    }));
    // ---------- Clawd ----------
    let st = { x: 1660, y: 860, px: 14, skin: 'neon', col: PK, glow: PK, pose: 'idle', ph: t * 10, blink: (t % 3) < .1, eye: -1 };
    if (b < 1.4) { st.sweat = b; st.x = 1500; st.y = 760; }
    if (b >= 4 && b < 8) { st.x = 600; st.y = 640; st.px = 11; st.eye = Math.sin(t * 3) > 0 ? 1 : -1; }
    if (b >= 8 && b < 12) { st.alpha = 0; }
    if (b >= 16) { const k = prog(b, 16, 16.5, E.io); st.x = lerp(1660, 1010, k); st.y = 760; st.px = 18; st.pose = b >= 16.35 && b < 16.8 ? 'up' : 'idle'; st.eyeShape = b >= 16.5 && b < 17 ? 'happy' : null; }
    if (b >= 17) { st.x = 1600; st.y = 860; st.px = 14; st.pose = 'idle'; }
    clawd(cx, st);
    if (b >= 16 && b < 17) { const k = prog(b, 16, 16.5, E.io); clawd(cx, { x: lerp(260, 910 + 300 - 400, k) + 0, y: 760, px: 18, skin: 'neon', col: CY, glow: CY, pose: b >= 16.35 && b < 16.8 ? 'up' : 'idle', ph: t * 10, eye: 1, eyeShape: b >= 16.5 ? 'happy' : null });
      if (b >= 16.5) { const s = prog(b, 16.5, 16.8); alpha(cx, 1 - s, () => glow(cx, YE, 30, () => { for (let i = 0; i < 10; i++) { const a = i / 10 * 6.283; seg(cx, 960 + Math.cos(a) * 40 * (1 + s * 3), 590 + Math.sin(a) * 40 * (1 + s * 3), 960 + Math.cos(a) * 70 * (1 + s * 3), 590 + Math.sin(a) * 70 * (1 + s * 3), YE, 5); } })); } }
    // ---------- 歌词 ----------
    const G = c => [8, c], LX = 120;
    lyric(tx, L, { at: .6, out: 1.35, text: '登录才写一半，\n这个月的额度‹见底›了', x: 900, y: 560, size: 56, w: 900, col: WH, acc: [RD], anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 1, out: 1.35, text: '钱花哪儿了？', x: 900, y: 720, size: 44, w: 700, col: YE, anim: 'flicker', glow: G(YE) });
    lyric(tx, L, { at: 1.5, out: 3.9, text: '每一轮，前面所有内容\n都要‹重新发一遍›', x: LX, y: 230, size: 56, w: 900, col: WH, acc: [YE], anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 3, out: 3.9, text: '对话越长，每轮越贵', x: LX, y: 900, size: 44, w: 900, col: PK, anim: 'flicker', glow: G(PK) });
    // 副歌：主旋律上逐字点亮
    sing(tx, L, { at: 4, x: 960, y: 165, size: 62, col: WH, dim: 'rgba(255,220,250,.22)', glow: PK, hold: 8.15 });
    lyric(tx, L, { at: 5, out: 6.4, text: '便宜的模型，多绕几圈', x: 960, y: 905, size: 44, w: 900, col: WH, align: 'center', anim: 'flicker', glow: G(CY) });
    lyric(tx, L, { at: 6.5, out: 7.15, text: '‹总价›反而更高', x: 960, y: 905, size: 52, w: 900, col: WH, acc: [YE], align: 'center', anim: 'flicker', glow: G(YE) });
    lyric(tx, L, { at: 7.25, out: 7.95, text: '算完成一个任务花多少，别只盯单价', x: 960, y: 905, size: 44, w: 900, col: WH, align: 'center', anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 7.35, out: 7.95, text: 'token：模型计费的单位，约一个词或一两个汉字', x: 960, y: 975, size: 26, fam: F.mono, w: 700, col: CY, align: 'center', anim: 'type', glow: G(CY) });
    lyric(tx, L, { at: 8.25, out: 9.95, text: '选模型，看活儿', x: 960, y: 960, size: 40, w: 900, col: WH, align: 'center', anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 10.1, out: 11.85, text: '思考强度：难题调高，机械活调低', x: 960, y: 960, size: 40, w: 900, col: WH, align: 'center', anim: 'flicker', glow: G(YE) });
    lyric(tx, L, { at: 12.1, out: 12.9, text: '订阅有上限；\n按量付费的 API，记得设‹预算提醒›', x: LX, y: 640, size: 50, w: 900, col: WH, acc: [YE], anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 13, out: 13.9, text: '排行榜看看就好', x: LX, y: 330, size: 64, w: 900, col: WH, anim: 'flicker', glow: G(CY) });
    lyric(tx, L, { at: 13.15, out: 13.9, text: '分数受测试用的工具影响，\n公开题目也可能混进了训练数据', x: LX, y: 480, size: 34, w: 700, col: mixC(CY, '#ffffff', .4), anim: 'fade' });
    lyric(tx, L, { at: 13.5, out: 13.9, text: '拿‹你自己的真实任务›，试两三个模型', x: LX, y: 650, size: 42, w: 900, col: WH, acc: [YE], anim: 'flicker', glow: G(YE) });
    lyric(tx, L, { at: 14, out: 15.9, text: '国内能直接用的，都有编程套餐：', x: 960, y: 300, size: 50, w: 900, col: WH, align: 'center', anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 16, out: 16.95, text: '卡住了？‹换个模型›再问一遍', x: 960, y: 300, size: 60, w: 900, col: WH, acc: [CY], align: 'center', anim: 'flicker', glow: G(CY) });
    lyric(tx, L, { at: 16.5, out: 16.95, text: '我不介意。', x: 960, y: 400, size: 40, w: 700, col: PK, align: 'center', anim: 'fade' });
    lyric(tx, L, { at: 17, out: 19.8, text: '免费版可能拿你的代码去训练——\n‹看清设置›', x: LX, y: 380, size: 56, w: 900, col: WH, acc: [YE], anim: 'flicker', glow: G(PK) });
    lyric(tx, L, { at: 17.4, out: 19.8, text: '课程练习一般没事；\n实习和公司的代码，按公司规定', x: LX, y: 600, size: 38, w: 700, col: mixC(PK, '#ffffff', .5), anim: 'fade' });
  },
}, [[0, 0], [16.6, 16.6], [17.1, 16.6]], 20);
};
