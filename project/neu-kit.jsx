// 东大码 · 宣传片：共用道具（window.NEU）
// 山川图标、二维码、3D 手机（屏幕是一张每帧重画的画布贴图）、App 的五个界面、四款桌面小组件、标题字、配乐的和弦与主旋律。
// 颜色和文案取自 NEU-ECode-Android（Theme.kt、CoursePalette.kt、各页面与小组件的字符串）。
// 所有画法只依赖传进来的时间，可以随意跳转。
(() => {
const MK = () => window.MV_K;
const clamp01 = x => Math.max(0, Math.min(1, x));
const pr = (x, a, b) => clamp01((x - a) / (b - a));
const eo = k => 1 - Math.pow(1 - clamp01(k), 3);
const eio = k => (k = clamp01(k), k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const back = k => { const c = 1.70158; k = clamp01(k) - 1; return 1 + (c + 1) * k * k * k + c * k * k; };
const bounce = k => { k = clamp01(k); const n = 7.5625, d = 2.75; if (k < 1 / d) return n * k * k; if (k < 2 / d) return n * (k -= 1.5 / d) * k + .75; if (k < 2.5 / d) return n * (k -= 2.25 / d) * k + .9375; return n * (k -= 2.625 / d) * k + .984375; };
const hash = x => { const s = Math.sin(x * 127.1 + 3.7) * 43758.5453; return s - Math.floor(s); };
const SANS = '"Noto Sans SC", "PingFang SC", sans-serif', SERIF = '"Noto Serif SC", "Songti SC", serif', MONO = '"JetBrains Mono", "Noto Sans SC", monospace';
const fnt = (w, s, fam = SANS) => `${w} ${s}px ${fam}`;

// ---------- 颜色：App 浅色主题 + 片子用的深色舞台 ----------
const C = {
  brand: '#0F45AF', brandHi: '#3D74F0', brandLt: '#8FB2FF', teal: '#7FD6DE', tealD: '#0E7C86',
  bg: '#F5F7FA', ink: '#0F172A', sub: '#526075', faint: '#8391A7', line: '#D5DCE6', card: '#FFFFFF', cont: '#EBEFF5', pc: '#DCE6FF', onPc: '#0A2A6B',
  stage: '#000000', white: '#F5F5F7', grey: '#8A8F98', dim: '#5B6070',
};
// 课程配色（与小组件的卡片底一致）：[底, 字]
const COURSE = [['#CFE8FF', '#0B4A7A'], ['#D6E4FF', '#1E3A8A'], ['#E1D7FF', '#4C2A99'], ['#FFD8E4', '#8A1F4A'], ['#FFE0C2', '#8A4200'],
  ['#D7F3D4', '#1F5E24'], ['#CCF0EC', '#0F5C55'], ['#FFEDB8', '#7A5200'], ['#FFDAD6', '#8C1D18'], ['#E0E4F0', '#38425C']];

// ---------- 演示数据（界面里的示例内容） ----------
const D = {
  bal: 128.6, fee: 36, week: 9, day: '周三',
  today: [['高等数学', '08:00', '09:40', '浑南 A102', '1-2', 0], ['大学英语', '10:10', '11:50', '浑南 B305', '3-4', 1], ['数据结构', '14:00', '15:40', '信息楼 208', '5-6', 6]],
  week7: [[0, 1, 2, 0, '高数'], [0, 5, 2, 6, '数构'], [1, 3, 2, 1, '英语'], [1, 7, 2, 4, '体育'], [2, 1, 2, 0, '高数'], [2, 3, 2, 1, '英语'], [2, 5, 2, 6, '数构'],
    [3, 1, 2, 2, '物理'], [3, 5, 3, 5, '实验'], [4, 3, 2, 3, '思政'], [4, 7, 2, 2, '物理'], [1, 9, 2, 7, '选修'], [3, 9, 2, 8, '线代']],
  exams: [['高等数学（上）', '1月8日 周四', '08:30-10:30', '浑南 B204', '37', 0], ['大学物理', '1月10日 周六', '14:00-16:00', '浑南 A305', '12', 2],
    ['程序设计基础', '1月12日 周一', '09:00-11:00', '信息楼 208', '45', 6], ['线性代数', '1月14日 周三', '08:30-10:30', '浑南 B106', '8', 8]],
  grades: [['程序设计基础', 4, 95, 6], ['高等数学（上）', 5, 92, 0], ['大学物理', 4, 90, 2], ['大学英语', 3, 88, 1], ['思想道德与法治', 3, 86, 3]],
};
const money = v => v.toFixed(2);

// ---------- 2D 小工具 ----------
function rr(c, x, y, w, h, r, fill, stroke, lw = 1) {
  if (w <= 0 || h <= 0) return;
  c.beginPath(); c.roundRect(x, y, w, h, Math.max(0, Math.min(r, w / 2, h / 2)));
  if (fill) { c.fillStyle = fill; c.fill(); }
  if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); }
}
function tx(c, s, x, y, font, col, align = 'left', base = 'middle') { c.font = font; c.fillStyle = col; c.textAlign = align; c.textBaseline = base; c.fillText(s, x, y); c.textAlign = 'left'; }
function al(c, a, fn) { if (a <= 0.002) return; const g = c.globalAlpha; c.globalAlpha = g * Math.min(1, a); fn(); c.globalAlpha = g; }
function sc(c, x, y, s, fn) { c.save(); c.translate(x, y); c.scale(s, s); c.translate(-x, -y); fn(); c.restore(); }
function glow(c, x, y, r, col, a) { if (a <= 0) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); al(c, a, () => { c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2); }); }
const hexA = (h, a) => `rgba(${[1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)).join(',')},${a})`;

// ---------- 山川图标 ----------
const LOGO = () => window.NEU_LOGO || [];
let LENS = null;
function lens() {
  if (LENS) return LENS;
  LENS = LOGO().map(q => { const seg = []; let tot = 0; for (let i = 0; i < q.length; i += 2) { const j = (i + 2) % q.length, d = Math.hypot(q[j] - q[i], q[j + 1] - q[i + 1]); seg.push(d); tot += d; } return { seg, tot }; });
  return LENS;
}
// 图标中心约在 (54, 53.5)，宽 68：w 是图标在画面上的宽度。
// o: { fill (颜色或 'grad'), fillK, stroke, strokeK (描边画到多少), lw, wave (水纹起伏), t, only (只画第几段) }
function logo(c, x, y, w, o = {}) {
  const P = LOGO(); if (!P.length) return;
  const s = w / 68, L = lens(), t = o.t || 0;
  c.save(); c.translate(x, y); c.scale(s, s); c.translate(-54, -53.5);
  const off = i => i === 0 || !o.wave ? [0, 0] : [Math.sin(t * 2.2 + i * 1.3) * o.wave, Math.sin(t * 1.7 + i * .9) * o.wave * .35];
  const path = (i, q) => { const [dx, dy] = off(i); c.moveTo(q[0] + dx, q[1] + dy); for (let k = 2; k < q.length; k += 2) c.lineTo(q[k] + dx, q[k + 1] + dy); c.closePath(); };
  if ((o.fillK ?? 1) > 0 && o.fill) {
    let f = o.fill;
    if (f === 'grad') { const g = c.createLinearGradient(30, 25, 80, 82); g.addColorStop(0, '#5B8CFF'); g.addColorStop(.55, '#1A55D0'); g.addColorStop(1, '#0F45AF'); f = g; }
    al(c, o.fillK ?? 1, () => { c.fillStyle = f; c.beginPath(); P.forEach((q, i) => { if (o.only === undefined || o.only === i) path(i, q); }); c.fill(); });
  }
  if (o.sweep > 0 && o.sweep < 1) { // 扫光：裁在图标里的一道斜亮带
    c.save(); c.beginPath(); P.forEach((q, i) => path(i, q)); c.clip();
    const bx = 5 + 110 * eio(o.sweep), g = c.createLinearGradient(bx - 16, 20, bx + 8, 90);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, 108, 108); c.restore();
  }
  if (o.stroke && (o.strokeK ?? 1) > 0) {
    c.strokeStyle = o.stroke; c.lineWidth = (o.lw || 2) / s; c.lineJoin = 'round'; c.lineCap = 'round';
    P.forEach((q, i) => {
      const k = clamp01((o.strokeK ?? 1) * 1.25 - i * .05); if (k <= 0) return;
      const [dx, dy] = off(i); let left = L[i].tot * k;
      c.beginPath(); c.moveTo(q[0] + dx, q[1] + dy);
      for (let j = 0; j < L[i].seg.length && left > 0; j++) {
        const a = j * 2, b = ((j + 1) * 2) % q.length, d = L[i].seg[j], u = Math.min(1, left / d);
        c.lineTo(q[a] + (q[b] - q[a]) * u + dx, q[a + 1] + (q[b + 1] - q[a + 1]) * u + dy); left -= d;
      }
      c.stroke();
    });
  }
  c.restore();
}

// ---------- 二维码（示意：定位点 + 按种子散开的模块，不编码任何内容） ----------
const QRN = 29, QRC = new Map();
function qrMat(seed) {
  if (QRC.has(seed)) return QRC.get(seed);
  const m = [];
  const fin = (x, y) => { for (let j = -1; j < 8; j++) for (let i = -1; i < 8; i++) { const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= QRN || Y >= QRN) continue; m[Y][X] = -1; } };
  for (let y = 0; y < QRN; y++) { m.push([]); for (let x = 0; x < QRN; x++) m[y].push(hash(seed * 13.7 + y * 31.3 + x * 7.9) > .52 ? 1 : 0); }
  fin(0, 0); fin(QRN - 7, 0); fin(0, QRN - 7);
  for (let i = 8; i < QRN - 8; i++) { m[6][i] = i % 2 ? 0 : 1; m[i][6] = i % 2 ? 0 : 1; }
  for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) m[QRN - 9 + j][QRN - 9 + i] = Math.max(Math.abs(i), Math.abs(j)) === 1 ? 0 : 1;
  QRC.set(seed, m); return m;
}
// k: 0..1 模块逐个出现；ink 颜色
function qr(c, x, y, size, seed, k = 1, ink = C.ink) {
  const m = qrMat(seed), cs = size / QRN, ga = c.globalAlpha;
  c.fillStyle = ink;
  for (let j = 0; j < QRN; j++) for (let i = 0; i < QRN; i++) {
    if (m[j][i] !== 1) continue;
    const a = hash(i * 3.1 + j * 17.7 + seed) * .7, e = eo(pr(k, a, a + .3)); if (e <= 0) continue;
    const s = cs * (.25 + .75 * e) + .4, cx = x + (i + .5) * cs, cy = y + (j + .5) * cs;
    c.globalAlpha = ga * Math.min(1, e * 2); c.fillRect(cx - s / 2, cy - s / 2, s, s);
  }
  c.globalAlpha = ga;
  const fk = eo(pr(k, 0, .35));
  if (fk > 0) [[0, 0], [QRN - 7, 0], [0, QRN - 7]].forEach(([i, j]) => {
    const X = x + i * cs, Y = y + j * cs, S = 7 * cs;
    sc(c, X + S / 2, Y + S / 2, .6 + .4 * fk, () => al(c, fk, () => {
      rr(c, X, Y, S, S, cs * 1.6, ink); rr(c, X + cs, Y + cs, S - 2 * cs, S - 2 * cs, cs * 1.1, '#ffffff'); rr(c, X + 2 * cs, Y + 2 * cs, S - 4 * cs, S - 4 * cs, cs * .8, ink);
    }));
  });
}

// ---------- 界面零件（逻辑尺寸 360×780） ----------
function status(c, time, dark) {
  const col = dark ? '#ffffff' : C.ink;
  tx(c, time, 26, 20, fnt(600, 13.5), col);
  c.fillStyle = col;
  [4, 6.5, 9, 11.5].forEach((h, i) => c.fillRect(283 + i * 5, 25 - h, 3.2, h));
  rr(c, 307, 14, 24, 12, 3.5, null, dark ? 'rgba(255,255,255,.7)' : 'rgba(15,23,42,.6)', 1.2); rr(c, 309.5, 16.5, 16, 7, 2, col); c.fillRect(332, 18, 2, 4);
}
function topBar(c, title, o = {}) {
  if (o.back) { c.strokeStyle = C.ink; c.lineWidth = 2; c.lineCap = 'round'; c.beginPath(); c.moveTo(30, 58); c.lineTo(22, 66); c.lineTo(30, 74); c.stroke(); }
  tx(c, title, o.back ? 46 : 20, 66, fnt(700, 21), C.ink);
  if (o.right) tx(c, o.right, 340, 66, fnt(600, 14), C.brand, 'right');
  if (o.refresh !== undefined) {
    const a = o.refresh * Math.PI * 2;
    c.save(); c.translate(326, 66); c.rotate(a); c.strokeStyle = C.ink; c.lineWidth = 2; c.lineCap = 'round';
    c.beginPath(); c.arc(0, 0, 8, -.4, 4.6); c.stroke(); c.beginPath(); c.moveTo(7.6, -6.6); c.lineTo(8.2, -1.8); c.lineTo(3.4, -2.6); c.stroke(); c.restore();
  }
}
function navIcon(c, kind, x, y, col) {
  c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8;
  if (kind === 0) { [[-8, -8], [2, -8], [-8, 2]].forEach(([a, b]) => { rr(c, x + a, y + b, 6.5, 6.5, 1.5, null, col, 1.8); }); c.fillRect(x + 3, y + 3, 2.6, 2.6); c.fillRect(x + 6, y + 6, 2.6, 2.6); }
  else if (kind === 1) { rr(c, x - 8.5, y - 7, 17, 16, 3, null, col, 1.8); c.fillRect(x - 8.5, y - 3, 17, 1.8); c.fillRect(x - 4.5, y - 10, 1.8, 4); c.fillRect(x + 2.7, y - 10, 1.8, 4); }
  else { c.beginPath(); c.arc(x, y - 4, 4.2, 0, 7); c.stroke(); c.beginPath(); c.arc(x, y + 10, 9, Math.PI * 1.15, Math.PI * 1.85); c.stroke(); }
}
function bottomNav(c, act) {
  c.fillStyle = C.cont; c.fillRect(0, 708, 360, 72);
  ['付款码', '课表', '我的'].forEach((s, i) => {
    const x = 60 + i * 120, on = i === act;
    if (on) rr(c, x - 28, 718, 56, 28, 14, C.pc);
    navIcon(c, i, x, 732, on ? C.onPc : C.sub);
    tx(c, s, x, 760, fnt(on ? 700 : 500, 11.5), on ? C.ink : C.sub, 'center');
  });
}
function toggle(c, x, y, on) { rr(c, x, y, 44, 26, 13, on ? C.brand : C.cont, on ? null : C.faint, 1.5); c.fillStyle = on ? '#fff' : C.faint; c.beginPath(); c.arc(on ? x + 31 : x + 13, y + 13, on ? 9 : 7, 0, 7); c.fill(); }

// 付款码页。st: { time, seed, qrK, left (秒), ttl, press (刷新转圈), scan (-1 或 0..1), hi (余额卡高亮 0..1), pay (充值按下 0..1), bal }
function payScreen(c, st) {
  c.fillStyle = C.bg; c.fillRect(0, 0, 360, 780);
  status(c, st.time || '08:00');
  topBar(c, '付款码', { refresh: st.press || 0 });
  rr(c, 16, 92, 328, 378, 24, C.card, C.line);
  const q = 250, qx = 180 - q / 2, qy = 116;
  qr(c, qx, qy, q, st.seed || 1, st.qrK ?? 1);
  if (st.flash > 0) al(c, st.flash, () => rr(c, qx - 8, qy - 8, q + 16, q + 16, 14, null, C.brandHi, 3));
  if (st.scan >= 0 && st.scan <= 1) {
    const y = qy + st.scan * q;
    const g = c.createLinearGradient(0, y - 30, 0, y); g.addColorStop(0, 'rgba(255,80,60,0)'); g.addColorStop(1, 'rgba(255,80,60,.28)');
    c.fillStyle = g; c.fillRect(qx - 10, y - 30, q + 20, 30); c.fillStyle = '#ff4b3a'; c.fillRect(qx - 12, y - 1, q + 24, 2.4);
  }
  tx(c, '向收银员出示此码', 180, 392, fnt(500, 15), C.sub, 'center');
  const left = Math.max(0, Math.ceil(st.left ?? 56)), ttl = st.ttl || 60;
  tx(c, left > 0 ? `${left} 秒后自动刷新` : '正在获取新码…', 180, 420, fnt(600, 13), C.brand, 'center');
  rr(c, 90, 440, 180, 4, 2, C.cont); rr(c, 90, 440, 180 * clamp01((st.left ?? 56) / ttl), 4, 2, C.brand);
  // 余额卡（noBal：卡片被抬到 3D 图层上，这里只留一个空槽）
  if (st.noBal) rr(c, 16, 486, 328, 116, 22, C.cont);
  else { c.save(); c.translate(16, 486); balCard(c, st); c.restore(); }
  // 开关
  rr(c, 16, 616, 328, 84, 20, C.card, C.line);
  tx(c, '启用 e码通', 32, 640, fnt(500, 14.5), C.ink); toggle(c, 286, 627, true);
  tx(c, '自动刷新二维码', 32, 678, fnt(500, 14.5), C.ink); toggle(c, 286, 665, true);
  bottomNav(c, 0);
}

// 余额卡 328×116（原点在卡片左上角）。st: { hi, pay, bal }
function balCard(c, st = {}) {
  const hk = st.hi || 0;
  rr(c, 0, 0, 328, 116, 22, C.card, hk > 0 ? hexA(C.brand, .25 + .75 * hk) : C.line, 1 + 1.5 * hk);
  tx(c, '校园卡余额', 20, 28, fnt(500, 13), C.sub);
  tx(c, '¥ ' + money(st.bal ?? D.bal), 20, 65, fnt(700, 30), C.ink);
  tx(c, `网费 ¥${money(D.fee)} · 刚刚更新`, 20, 98, fnt(400, 12), C.faint);
  const pk = st.pay || 0;
  if (pk > 0 && pk < 1) al(c, 1 - pk, () => { c.save(); c.beginPath(); c.roundRect(248, 44, 66, 36, 18); c.clip(); c.fillStyle = hexA(C.brand, .25); c.beginPath(); c.arc(281, 62, 10 + 60 * pk, 0, 7); c.fill(); c.restore(); });
  sc(c, 281, 62, 1 - .08 * Math.sin(Math.PI * pk), () => { rr(c, 248, 44, 66, 36, 18, pk > 0 && pk < 1 ? '#C8D7FF' : C.pc); tx(c, '充值', 281, 62, fnt(600, 14), C.onPc, 'center'); });
}

// 内网连接页。st: { state: 0 未连接 / 1 连接中 / 2 已连接, t, k (切到已连接的进度), press }
function vpnScreen(c, st) {
  c.fillStyle = C.bg; c.fillRect(0, 0, 360, 780);
  status(c, st.time || '21:30');
  topBar(c, '内网连接', { back: true });
  const cx = 180, cy = 262, t = st.t || 0, s = st.state || 0;
  if (s === 0) {
    const br = .5 + .5 * Math.sin(t * 2.4);
    c.fillStyle = hexA(C.faint, .08 + .08 * br); c.beginPath(); c.arc(cx, cy, 92 + 8 * br, 0, 7); c.fill();
    rr(c, cx - 76, cy - 76, 152, 152, 76, C.cont, C.line, 1.5);
    logo(c, cx, cy + 2, 92, { fill: C.faint });
  } else if (s === 1) {
    rr(c, cx - 76, cy - 76, 152, 152, 76, C.pc);
    c.strokeStyle = C.brand; c.lineWidth = 4; c.lineCap = 'round'; c.beginPath(); c.arc(cx, cy, 92, t * 4, t * 4 + 1.6); c.stroke();
    logo(c, cx, cy + 2, 92, { fill: C.brand, wave: 2.2, t: t * 2.5 });
  } else {
    const k = eo(st.k ?? 1);
    c.save(); c.beginPath(); c.arc(cx, cy, 76 + 16 * k, 0, 7); c.clip();
    c.fillStyle = C.brand; c.fillRect(cx - 100, cy - 100, 200, 200);
    for (let i = 0; i < 14; i++) {
      const x = cx - 91 + i * 14, sp = 60 + hash(i) * 70, ph = hash(i * 3.3) * 200;
      for (let j = 0; j < 3; j++) { const y = cy - 100 + ((t * sp + ph + j * 70) % 200); c.fillStyle = `rgba(169,195,255,${.25 + .5 * hash(i + j)})`; c.fillRect(x, y, 3, 14 + 10 * hash(i * 7 + j)); }
    }
    c.restore();
    logo(c, cx, cy + 2, 92, { fill: '#ffffff' });
  }
  tx(c, ['未连接', '连接中', '已连接'][s], cx, 398, fnt(700, 24), s === 2 ? C.brand : C.ink, 'center');
  ['连接学生 VPN 后即可访问教务系统等校内', '接口，其他流量不经过隧道。'].forEach((l, i) => tx(c, l, cx, 438 + i * 22, fnt(400, 13.5), C.sub, 'center'));
  const pk = st.press || 0;
  sc(c, cx, 586, 1 - .06 * Math.sin(Math.PI * pk), () => {
    if (s === 0) { rr(c, 40, 562, 280, 48, 24, C.brand); tx(c, '连接学生 VPN', cx, 586, fnt(600, 16), '#fff', 'center'); }
    else if (s === 1) { rr(c, 40, 562, 280, 48, 24, C.cont); tx(c, '正在连接…', cx, 586, fnt(600, 16), C.sub, 'center'); }
    else { rr(c, 40, 562, 280, 48, 24, null, C.faint, 1.5); tx(c, '断开', cx, 586, fnt(600, 16), C.brand, 'center'); }
  });
}

// 考试 / 成绩页。st: { tab: 0 考试 / 1 成绩, k (列表出现), n (成绩数字滚动 0..1) }
function acadScreen(c, st) {
  c.fillStyle = C.bg; c.fillRect(0, 0, 360, 780);
  status(c, st.time || '20:00');
  const tab = st.tab || 0;
  topBar(c, tab ? '成绩' : '考试', { back: true, right: '同步' });
  rr(c, 16, 92, 328, 40, 20, C.cont);
  const tk = st.tabK ?? tab;
  rr(c, 20 + 160 * tk, 96, 160, 32, 16, C.card);
  tx(c, '考试', 100, 112, fnt(tab ? 500 : 700, 14), tab ? C.sub : C.ink, 'center');
  tx(c, '成绩', 260, 112, fnt(tab ? 700 : 500, 14), tab ? C.ink : C.sub, 'center');
  tx(c, tab ? '2025-2026 秋季学期 · 5 门' : '2025-2026 秋季学期 · 4 场', 20, 154, fnt(500, 12.5), C.sub);
  const k = st.k ?? 1;
  if (!tab) D.exams.forEach((e, i) => {
    const y = 172 + i * 104, a = eo(pr(k, i * .15, i * .15 + .45)); if (a <= 0) return;
    if (st.lift) { rr(c, 16, y, 328, 92, 18, C.cont); return; }
    al(c, a, () => { c.save(); c.translate(16, y + (1 - a) * 24); examCard(c, i); c.restore(); });
  });
  else D.grades.forEach((g, i) => {
    const y = 172 + i * 76, a = eo(pr(k, i * .12, i * .12 + .4)); if (a <= 0) return;
    al(c, a, () => { c.save(); c.translate(0, (1 - a) * 24);
      rr(c, 16, y, 328, 64, 18, C.card, C.line);
      tx(c, g[0], 34, y + 24, fnt(700, 15.5), C.ink);
      tx(c, `${g[1]} 学分`, 34, y + 46, fnt(400, 12.5), C.faint);
      const n = Math.round(g[2] * eo(pr(st.n ?? 1, i * .08, i * .08 + .6)));
      tx(c, String(n), 326, y + 33, fnt(700, 26), C.brand, 'right');
      c.restore(); });
  });
}

// 考试卡片 328×92（原点在左上角）
function examCard(c, i) {
  const e = D.exams[i];
  rr(c, 0, 0, 328, 92, 18, C.card, C.line); rr(c, 0, 16, 5, 60, 3, COURSE[e[5]][1]);
  tx(c, e[0], 18, 24, fnt(700, 16), C.ink);
  tx(c, `${e[1]}  ${e[2]}`, 18, 50, fnt(500, 13), C.sub);
  tx(c, e[3], 18, 72, fnt(400, 12.5), C.faint);
  rr(c, 252, 58, 62, 24, 12, C.pc); tx(c, `座位 ${e[4]}`, 283, 70, fnt(600, 12), C.onPc, 'center');
}

// ---------- 桌面小组件（各自的逻辑尺寸） ----------
function wBox(c, w, h) { rr(c, 0, 0, w, h, 22, 'rgba(255,255,255,.96)'); }
// 今日课表 324×176。st: { now (当前课的序号，可为小数做过渡), done }
function wToday(c, st = {}) {
  const w = 324, h = 176; wBox(c, w, h);
  tx(c, '今日课表', 16, 24, fnt(700, 15), C.ink);
  tx(c, `${D.day} · 第 ${D.week} 周`, 308, 24, fnt(500, 11.5), '#64748B', 'right');
  const now = st.now ?? -1;
  D.today.forEach((r, i) => {
    const y = 44 + i * 42, [bg, fg] = COURSE[r[5]], past = now > i + .5, cur = Math.max(0, 1 - Math.abs(now - i) * 2);
    al(c, past ? .45 : 1, () => {
      rr(c, 12, y, 300, 36, 11, bg);
      if (cur > 0) rr(c, 12, y, 300, 36, 11, null, hexA(C.brand, cur), 2.2);
      tx(c, r[0], 24, y + 13, fnt(700, 13), fg);
      tx(c, `${r[1]}-${r[2]} · ${r[3]}`, 24, y + 27, fnt(500, 10.5), hexA(fg, .8));
      if (cur > .05) al(c, cur, () => { rr(c, 248, y + 9, 54, 18, 9, C.brand); tx(c, '下一节', 275, y + 18, fnt(700, 10.5), '#fff', 'center'); });
      else tx(c, `第${r[4]}节`, 300, y + 18, fnt(500, 10.5), hexA(fg, .7), 'right');
    });
  });
}
// e码通 156×176
function wECode(c, st = {}) {
  const w = 156, h = 176; wBox(c, w, h);
  rr(c, 12, 12, 48, 20, 10, C.pc); tx(c, 'e码通', 36, 22, fnt(700, 11), C.onPc, 'center');
  tx(c, '刚刚', 144, 22, fnt(400, 10.5), '#94A3B8', 'right');
  qr(c, 34, 38, 88, st.seed || 3, st.qrK ?? 1);
  tx(c, `校园卡 ${money(st.bal ?? D.bal)}`, 14, 144, fnt(700, 12.5), C.ink);
  tx(c, `网费 ${money(D.fee)}`, 14, 162, fnt(400, 10.5), '#64748B');
}
// 我的考试 156×176
function wExam(c) {
  const w = 156, h = 176; wBox(c, w, h);
  tx(c, '我的考试', 14, 24, fnt(700, 14), C.ink);
  D.exams.slice(0, 2).forEach((e, i) => {
    const y = 42 + i * 64; rr(c, 10, y, 136, 56, 12, COURSE[e[5]][0]);
    tx(c, e[0].replace(/（.*）/, ''), 20, y + 15, fnt(700, 12), COURSE[e[5]][1]);
    tx(c, `${e[1].split(' ')[0]} ${e[2].split('-')[0]}`, 20, y + 31, fnt(500, 10.5), hexA(COURSE[e[5]][1], .85));
    tx(c, `${e[3]} · 座位 ${e[4]}`, 20, y + 45, fnt(400, 10), hexA(COURSE[e[5]][1], .75));
  });
}
// 本周课表 324×262。st: { k (色块逐列出现) }
function wWeek(c, st = {}) {
  const w = 324, h = 262; wBox(c, w, h);
  tx(c, '本周课表', 16, 22, fnt(700, 14), C.ink); tx(c, `第 ${D.week} 周`, 308, 22, fnt(500, 11), '#64748B', 'right');
  const x0 = 28, y0 = 50, cw = (w - x0 - 10) / 7, rh = (h - y0 - 10) / 12;
  ['一', '二', '三', '四', '五', '六', '日'].forEach((d, i) => tx(c, d, x0 + (i + .5) * cw, 38, fnt(i === 2 ? 700 : 500, 10.5), i === 2 ? C.brand : '#64748B', 'center'));
  for (let r = 0; r < 12; r++) tx(c, String(r + 1), 15, y0 + (r + .5) * rh, fnt(400, 8.5), '#94A3B8', 'center');
  c.fillStyle = hexA(C.brand, .06); c.fillRect(x0 + 2 * cw, y0 - 4, cw, h - y0 - 4);
  const k = st.k ?? 1;
  D.week7.forEach(([d, s, n, ci, nm], i) => {
    const x = x0 + d * cw + 1.5, y = y0 + (s - 1) * rh + 1, bw = cw - 3, bh = n * rh - 2;
    const blk = () => { rr(c, x, y, bw, bh, 5, COURSE[ci][0]); tx(c, nm, x + bw / 2, y + bh / 2, fnt(700, 9.5), COURSE[ci][1], 'center'); };
    if (st.drop) { // 按列依次淡入、轻轻上浮
      const a0 = d * .09 + s * .01, e = eio(pr(k, a0, a0 + .4)); if (e <= 0) return;
      c.save(); c.globalAlpha *= e; c.translate(0, (1 - e) * 10); blk(); c.restore(); return;
    }
    const a = back(pr(k, d * .1 + s * .012, d * .1 + s * .012 + .3)); if (a <= 0) return;
    sc(c, x + bw / 2, y + bh / 2, a, blk);
  });
}
// 主屏幕。st: { t, w: [今日, e码通, 考试, 本周] 各自出现进度, time }
const HOME = [[18, 52, 324, 176, wToday], [18, 242, 156, 176, wECode], [186, 242, 156, 176, wExam], [18, 432, 324, 262, wWeek]];
function homeScreen(c, st) {
  const g = c.createLinearGradient(0, 0, 200, 780); g.addColorStop(0, '#0A1A44'); g.addColorStop(.55, '#0F3C9E'); g.addColorStop(1, '#3A73E8');
  c.fillStyle = g; c.fillRect(0, 0, 360, 780);
  al(c, .14, () => logo(c, 190, 600, 420, { fill: '#ffffff', wave: 3, t: (st.t || 0) * .6 }));
  status(c, st.time || '07:52', true);
  HOME.forEach(([x, y, w, h, fn], i) => {
    if (st.layers) return;
    const k = (st.w || [1, 1, 1, 1])[i]; if (k <= 0) return;
    const s = .6 + .4 * back(k);
    c.save(); c.translate(x + w / 2, y + h / 2); c.scale(s, s); c.translate(-w / 2, -h / 2); c.globalAlpha *= Math.min(1, k * 2.5);
    fn(c, (st.ws || [])[i] || {});
    c.restore();
  });
  // 应用图标
  const ik = st.icon ?? 1;
  al(c, ik, () => { rr(c, 28, 708, 52, 52, 14, '#ffffff'); logo(c, 54, 735, 36, { fill: C.brand }); tx(c, '东大码', 54, 770, fnt(500, 10.5), '#fff', 'center'); });
}

// ---------- 画布贴图的手机屏幕 ----------
function screen() {
  const cv = document.createElement('canvas'); cv.width = 720; cv.height = 1560;
  const c = cv.getContext('2d');
  return { cv, c, paint(fn) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, 720, 1560); c.setTransform(2, 0, 0, 2, 0, 0); c.globalAlpha = 1; c.filter = 'none'; fn(c); } };
}

// ---------- 3D 手机 ----------
const PW = 380, PH = 800, PR = 60, PD = 20, BV = 7;
function rrShape(T, w, h, r) {
  const s = new T.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r); s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function shapeUV(geo, w, h) { const p = geo.attributes.position, uv = geo.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + .5, p.getY(i) / h + .5); uv.needsUpdate = true; return geo; }
const col3 = (T, c) => new T.Color(c).convertSRGBToLinear();
let ENV = null, SHT = null;
function shadowTex(T) {
  if (SHT) return SHT;
  const cv = document.createElement('canvas'); cv.width = cv.height = 128; const c = cv.getContext('2d');
  const g = c.createRadialGradient(64, 64, 10, 64, 64, 64); g.addColorStop(0, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, 128, 128);
  SHT = new T.CanvasTexture(cv); return SHT;
}
// 影棚环境：几块柔光板，给金属边框和玻璃一点反光
function env(T, U, scene) {
  if (!ENV && U.renderer) {
    const cv = document.createElement('canvas'); cv.width = 1024; cv.height = 512; const c = cv.getContext('2d');
    const g = c.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#1b2233'); g.addColorStop(.5, '#07080c'); g.addColorStop(1, '#020203'); c.fillStyle = g; c.fillRect(0, 0, 1024, 512);
    c.filter = 'blur(10px)'; c.fillStyle = '#ffffff'; c.fillRect(380, 30, 260, 70); c.fillStyle = '#cfe0ff'; c.fillRect(60, 120, 70, 260); c.fillRect(880, 140, 60, 240); c.fillStyle = '#3d74f0'; c.fillRect(560, 300, 300, 60);
    const t = new T.CanvasTexture(cv); t.mapping = T.EquirectangularReflectionMapping; t.encoding = T.sRGBEncoding;
    const pm = new T.PMREMGenerator(U.renderer); ENV = pm.fromEquirectangular(t).texture; pm.dispose(); t.dispose();
  }
  if (ENV && scene.environment !== ENV) scene.environment = ENV;
}
function lights(T, scene) {
  scene.add(new T.AmbientLight(0xffffff, .25));
  const k = new T.DirectionalLight(0xffffff, .9); k.position.set(-700, 900, 1400); scene.add(k);
  const r = new T.DirectionalLight(0x8fb2ff, .9); r.position.set(1100, -300, -300); scene.add(r);
}
function phone(T) {
  const g = new T.Group(), inner = new T.Group(); g.add(inner);
  const geo = new T.ExtrudeGeometry(rrShape(T, PW - BV * 2, PH - BV * 2, PR - BV), { depth: PD, bevelEnabled: true, bevelThickness: BV, bevelSize: BV, bevelSegments: 8, curveSegments: 28 });
  geo.translate(0, 0, -PD / 2);
  const cap = new T.MeshStandardMaterial({ color: col3(T, '#050608'), metalness: .2, roughness: .16 });
  const side = new T.MeshStandardMaterial({ color: col3(T, '#9aa3b2'), metalness: 1, roughness: .26 });
  inner.add(new T.Mesh(geo, [cap, side]));
  const zf = PD / 2 + BV + .6;
  const sGeo = shapeUV(new T.ShapeGeometry(rrShape(T, PW - 24, PH - 24, PR - 12), 24), PW - 24, PH - 24);
  const scr = screen(), tex = new T.CanvasTexture(scr.cv); tex.encoding = T.sRGBEncoding; tex.anisotropy = 8;
  const sMat = new T.MeshBasicMaterial({ map: tex, toneMapped: false, transparent: true });
  const sMesh = new T.Mesh(sGeo, sMat); sMesh.position.z = zf; inner.add(sMesh);
  // 玻璃反光：一条斜向的高光，跟着转动滑过
  const gl = document.createElement('canvas'); gl.width = 256; gl.height = 512; const gc = gl.getContext('2d');
  const gg = gc.createLinearGradient(0, 0, 256, 512); gg.addColorStop(0, 'rgba(255,255,255,0)'); gg.addColorStop(.42, 'rgba(255,255,255,0)'); gg.addColorStop(.5, 'rgba(255,255,255,.10)'); gg.addColorStop(.58, 'rgba(255,255,255,0)'); gg.addColorStop(1, 'rgba(255,255,255,0)');
  gc.fillStyle = gg; gc.fillRect(0, 0, 256, 512);
  const gTex = new T.CanvasTexture(gl); gTex.wrapS = T.RepeatWrapping;
  const gMat = new T.MeshBasicMaterial({ map: gTex, transparent: true, depthWrite: false, toneMapped: false, blending: T.AdditiveBlending });
  const gMesh = new T.Mesh(shapeUV(new T.ShapeGeometry(rrShape(T, PW - 24, PH - 24, PR - 12), 24), PW - 24, PH - 24), gMat); gMesh.position.z = zf + .4; inner.add(gMesh);
  // 背面：品牌蓝的磨砂玻璃 + 山川
  const bMat = new T.MeshStandardMaterial({ color: col3(T, '#0F45AF'), metalness: .25, roughness: .42 });
  const bMesh = new T.Mesh(new T.ShapeGeometry(rrShape(T, PW - 10, PH - 10, PR - 5), 24), bMat); bMesh.position.z = -zf; bMesh.rotation.y = Math.PI; inner.add(bMesh);
  const lg = new T.Group(), lMat = new T.MeshStandardMaterial({ color: col3(T, '#dfe8ff'), metalness: .6, roughness: .25, side: T.DoubleSide });
  for (const q of LOGO()) { const pts = []; for (let i = 0; i < q.length; i += 2) pts.push(new T.Vector2(q[i] - 54, -(q[i + 1] - 53.5))); lg.add(new T.Mesh(new T.ShapeGeometry(new T.Shape(pts)), lMat)); }
  lg.scale.setScalar(2.4); lg.position.set(0, 80, -zf - .6); lg.rotation.y = Math.PI; inner.add(lg);
  // 侧键
  const kMat = side;
  [[PW / 2 + 1.5, 150, 120], [PW / 2 + 1.5, 20, 70]].forEach(([x, y, h]) => { const m = new T.Mesh(new T.BoxGeometry(5, h, 9), kMat); m.position.set(x, y, 0); inner.add(m); });
  // 浮起的图层：一块圆角卡片（自己的画布贴图），按屏幕逻辑坐标摆在屏幕上方，可以抬高、倾斜；下面带一片软阴影
  const FX = (PW - 24) / 360, FY = (PH - 24) / 780;
  function layer(w, h, r = 22) {
    const cv = document.createElement('canvas'); cv.width = w * 2; cv.height = h * 2; const c = cv.getContext('2d');
    const t = new T.CanvasTexture(cv); t.encoding = T.sRGBEncoding; t.anisotropy = 8;
    const mat = new T.MeshBasicMaterial({ map: t, transparent: true, toneMapped: false, side: T.DoubleSide, depthWrite: false });
    const mesh = new T.Mesh(shapeUV(new T.ShapeGeometry(rrShape(T, w * FX, h * FY, r * FX), 12), w * FX, h * FY), mat); mesh.renderOrder = 3;
    const sh = new T.Mesh(new T.PlaneGeometry(w * FX * 1.3, h * FY * 1.35), new T.MeshBasicMaterial({ map: shadowTex(T), transparent: true, depthWrite: false, opacity: 0, toneMapped: false })); sh.renderOrder = 2;
    inner.add(sh); inner.add(mesh);
    return {
      set(o) {
        const a = o.a ?? 1, z = o.z || 0, x = (o.sx - 180) * FX + (o.dx || 0), y = (390 - o.sy) * FY + (o.dy || 0);
        mesh.visible = a > .01; mat.opacity = a;
        mesh.position.set(x, y, zf + 1.2 + z); mesh.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0); mesh.scale.setScalar(o.s ?? 1);
        sh.visible = mesh.visible && z > 2; sh.position.set(x + z * .12, y - z * .22, zf + 1 + z * .25); sh.scale.setScalar((o.s ?? 1) * (1 + z / 600)); sh.material.opacity = .55 * a * Math.min(1, z / 80);
      },
      paint(fn) { c.setTransform(2, 0, 0, 2, 0, 0); c.clearRect(0, 0, w, h); c.globalAlpha = 1; fn(c); t.needsUpdate = true; },
    };
  }
  // 二维码方块：每个模块是一个小立方体，从四面八方飞来，落在屏幕上二维码的位置
  let qim = null, qseed = -1, qcells = [];
  const QX = 55, QY = 116, QS = 250 / QRN, dummy = new T.Object3D(), cA = new T.Color(), cB = col3(T, '#8FB2FF'), cC = col3(T, '#0F172A');
  function qrFx(seed, k, t) {
    if (!qim) { qim = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshBasicMaterial({ toneMapped: false }), QRN * QRN); qim.renderOrder = 4; inner.add(qim); }
    if (seed !== qseed) {
      qseed = seed; const m = qrMat(seed); qcells = [];
      for (let j = 0; j < QRN; j++) for (let i = 0; i < QRN; i++) {
        let on = m[j][i] === 1;
        for (const [fx, fy] of [[0, 0], [QRN - 7, 0], [0, QRN - 7]]) { const u = i - fx, v = j - fy; if (u >= 0 && v >= 0 && u < 7 && v < 7) { const d = Math.max(Math.abs(u - 3), Math.abs(v - 3)); on = d === 3 || d <= 1; } }
        if (on) qcells.push([i, j]);
      }
    }
    qim.visible = k > 0 && k < 1; if (!qim.visible) return;
    qim.count = qcells.length;
    qcells.forEach(([i, j], n) => {
      const d0 = hash(n * 1.37 + seed) * .4, e = eio(pr(k, d0, d0 + .6));
      const tx0 = (QX + (i + .5) * QS - 180) * FX, ty0 = (390 - QY - (j + .5) * QS) * FY, tz = zf + 2;
      const sx = (hash(n * 2.1) - .5) * 1100, sy = (hash(n * 3.3) - .5) * 900, sz = 260 + hash(n * 4.7) * 520;
      const sw = (1 - e) * (1 - e);
      dummy.position.set(tx0 + (sx - tx0) * sw, ty0 + (sy - ty0) * sw, tz + (sz - tz) * sw);
      dummy.rotation.set((1 - e) * 1.6 * hash(n * 5.1), (1 - e) * 1.6 * hash(n * 6.3), (1 - e) * .8);
      const s = QS * FX * (e >= 1 ? 1 : .92); dummy.scale.set(s, s, 3 + 10 * sw);
      dummy.updateMatrix(); qim.setMatrixAt(n, dummy.matrix);
      qim.setColorAt(n, cA.copy(cB).lerp(cC, Math.pow(e, 3)));
    });
    qim.instanceMatrix.needsUpdate = true; if (qim.instanceColor) qim.instanceColor.needsUpdate = true;
  }
  return {
    g, scr, tex, gTex, layer, qrFx,
    // p: { x, y (画布像素), z, rx, ry, rz, s }
    set(p, U) { U.at(g, p.x ?? 960, p.y ?? 540, p.z || 0); g.rotation.set(p.rx || 0, p.ry || 0, p.rz || 0); g.scale.setScalar(p.s ?? 1); g.visible = (p.s ?? 1) > .001 && p.hide !== true; gTex.offset.x = -(p.ry || 0) * .9 + (p.rx || 0) * .3; },
    paint(fn) { scr.paint(fn); tex.needsUpdate = true; },
  };
}
// 平面兜底：three.js 没加载时，把同一块屏幕画成正面的手机
function phone2D(c, p, scr) {
  const s = p.s ?? 1; if (s <= .001 || p.hide) return;
  const k = 1 - Math.min(.35, Math.abs(p.ry || 0) * .4);
  c.save(); c.translate(p.x ?? 960, p.y ?? 540); c.scale(s * k * (1 + (p.z || 0) / 2000), s * (1 + (p.z || 0) / 2000)); c.rotate(-(p.rz || 0));
  rr(c, -PW / 2, -PH / 2, PW, PH, PR, '#0b0c10', '#8a93a3', 4);
  c.save(); c.beginPath(); c.roundRect(-PW / 2 + 12, -PH / 2 + 12, PW - 24, PH - 24, PR - 12); c.clip(); c.drawImage(scr.cv, -PW / 2 + 12, -PH / 2 + 12, PW - 24, PH - 24); c.restore();
  c.restore();
}
// 世界里用：three 层画手机，失败就画平面版。paint(c) 画屏幕，pose 给姿态
function phoneLayer(cx, L, m) { if (!MK().three(cx, L)) { const p = m.pose(L); if (p.hide || (p.s ?? 1) <= .001) return; if (!m._s2) m._s2 = screen(); m._s2.paint(c => m.paint(c, L, true)); phone2D(cx, p, m._s2); } }
function phoneThree(m) {
  return (T, U) => {
    const scene = new T.Scene(); lights(T, scene); const P = phone(T); scene.add(P.g);
    const ex = m.layers ? m.layers(P) : null;
    return { scene, update(L) { env(T, U, scene); const p = m.pose(L); P.set(p, U); if (!P.g.visible) return false; P.paint(c => m.paint(c, L, false)); if (ex) ex(L); return true; } };
  };
}

// ---------- 标题字：整行淡入、上浮、去模糊；多行依次 ----------
// o: { at, out (小节), x, y, size, w, col, grad [c0, c1], align, lh, st (行间隔，小节), d (淡入时长), fam, ls (字距 em) }
function head(c, L, text, o) {
  const b = L.b, lines = String(text).split('\n'), size = o.size || 96, lh = (o.lh || 1.22) * size, st = o.st ?? .12, d = o.d ?? .45;
  const kout = o.out === undefined ? 0 : eio(pr(b, o.out, o.out + (o.outLen ?? .3)));
  if (b < o.at || kout >= 1) return;
  const y0 = o.y - (lines.length - 1) * lh / 2, fam = o.fam || SANS;
  lines.forEach((ln, i) => {
    const k = eo(pr(b, o.at + i * st, o.at + i * st + d)); if (k <= 0) return;
    c.save(); c.font = fnt(o.w || 700, size, fam); c.textBaseline = 'middle'; c.textAlign = o.align || 'center';
    if (o.ls) c.letterSpacing = (o.ls * size) + 'px';
    const wd = c.measureText(ln).width, x = o.x ?? 960, y = y0 + i * lh + (1 - k) * size * .22 - kout * size * .1;
    c.globalAlpha *= k * (1 - kout);
    const blur = (1 - k) * size * .05 + kout * size * .04; if (blur > .3) c.filter = `blur(${blur.toFixed(1)}px)`;
    let f = o.col || C.white;
    if (o.grad) { const x0 = (o.align === 'left' ? x : o.align === 'right' ? x - wd : x - wd / 2); const g = c.createLinearGradient(x0, y - size / 2, x0 + wd, y + size / 2); o.grad.forEach((cc, j) => g.addColorStop(j / (o.grad.length - 1), cc)); f = g; }
    c.fillStyle = f; c.fillText(ln, x, y);
    c.restore();
    if (o.sweep && window.NEU_FX && k >= 1) window.NEU_FX.sweep(c, ln, x, y, fnt(o.w || 700, size, fam), o.align || 'center', pr(b, o.sweep[0] + i * .08, o.sweep[0] + (o.sweep[1] || .6) + i * .08), o.sweep[2]);
  });
}
const GRAD = ['#8FB2FF', '#5B8CFF', '#7FD6DE'];

// ---------- 配乐：F 大调 I–V–vi–IV，120 BPM ----------
const PROG = ['F', 'C', 'Dm', 'Bb'];
// 主旋律 4 小节一句：[小节, 拍, 音高, 拍数]
const MEL = [
  [0, 0, 77, 1], [0, 1, 81, .5], [0, 1.5, 84, 1], [0, 2.5, 81, .5], [0, 3, 79, 1],
  [1, 0, 76, 1.5], [1, 1.5, 79, .5], [1, 2, 72, 2],
  [2, 0, 74, 1], [2, 1, 77, .5], [2, 1.5, 81, 1], [2, 2.5, 77, .5], [2, 3, 76, 1],
  [3, 0, 74, 2], [3, 2, 70, 1], [3, 3, 72, 1],
];
const MEL2 = [
  [0, 0, 84, 1], [0, 1, 81, .5], [0, 1.5, 77, 1], [0, 2.5, 81, .5], [0, 3, 84, 1],
  [1, 0, 83, 1.5], [1, 1.5, 79, .5], [1, 2, 76, 2],
  [2, 0, 77, 1], [2, 1, 81, .5], [2, 1.5, 86, 1.5], [2, 3, 84, 1],
  [3, 0, 82, 1.5], [3, 1.5, 81, .5], [3, 2, 79, 2],
];
function melody(S, b0, inst, v = 1, tr = 0, mel = MEL, from = 0, to = 4) { for (const [b, bt, m, d] of mel) if (b >= from && b < to) S.add(inst, b0 + b - from, bt, m + tr, d, v); }
// 一段律动：o = { kick, clap, hat, bass, arp, pad, off (和弦起点偏移) }，每项是音量，0 表示不要
function groove(S, H, b0, b1, o = {}) {
  const CH = H.CH, ch = b => CH[PROG[(b - b0 + (o.off || 0)) % 4]];
  for (let b = b0; b < b1; b++) {
    const c = ch(b);
    if (o.kick) for (let j = 0; j < 4; j++) S.add('kick', b, j, 0, 0, o.kick, o.kickKind || 'main');
    if (o.clap) { S.add('clap', b, 1, 0, 0, o.clap); S.add('clap', b, 3, 0, 0, o.clap); }
    if (o.hat) for (let j = 0; j < 8; j++) S.add('hat', b, j / 2, 0, 0, o.hat * (j % 2 ? 1 : .55), j % 2 && o.open ? 'open' : 'closed');
    if (o.bass) { const r = c.r + 12; [[0, r, .7], [.75, r, .45], [1.5, r + 12, .4], [2, r, .7], [2.75, r, .45], [3.5, r + 7, .4]].forEach(([bt, m, d]) => S.add('bass', b, bt, m, d, o.bass, 'pluck')); }
    if (o.sub) S.add('bass', b, 0, c.r, 3.8, o.sub, 'sub');
    if (o.arp) for (let j = 0; j < 8; j++) S.add('arp', b, j / 2, c.arp[[0, 1, 2, 3, 2, 1, 2, 3][j]], .45, o.arp * (j % 2 ? .8 : 1));
    if (o.pluck) for (let j = 0; j < 4; j++) S.add('kalimba', b, j + (j % 2 ? .5 : 0), c.arp[(j + 1) % 4] + 12, .5, o.pluck);
    if (o.pad) S.add('pad', b, 0, c.pad, 4, o.pad, o.padKind || 'string');
  }
}

// 安静的律动（发布会式）：轻底鼓在 1、3 拍，轻沙锤，钢琴琶音，长铺底，低音只在小节头。o 里每项是音量，0 表示不要
function calm(S, H, b0, b1, o0 = {}) {
  const o = {}; for (const k in o0) o[k] = typeof o0[k] === 'number' && k !== 'off' ? o0[k] * 1.3 : o0[k];
  const CH = H.CH, ch = b => CH[PROG[(Math.round(b - b0) + (o.off || 0)) % 4]];
  for (let b = b0; b < b1; b++) {
    const c = ch(b);
    if (o.kick) { S.add('kick', b, 0, 0, 0, o.kick, 'soft'); S.add('kick', b, 2, 0, 0, o.kick * .8, 'soft'); }
    if (o.shaker) for (let j = 0; j < 8; j++) S.add('shaker', b, j / 2, 0, 0, o.shaker * (j % 2 ? 1 : .6));
    if (o.tick) for (let j = 0; j < 4; j++) S.add('tick', b, j + .5, 0, 0, o.tick);
    if (o.sub) S.add('bass', b, 0, c.r, 3.6, o.sub, 'sub');
    if (o.bass) { S.add('bass', b, 0, c.r + 12, 1.4, o.bass, 'upright'); S.add('bass', b, 2.5, c.r + 12, 1, o.bass * .7, 'upright'); }
    if (o.piano) { const a = c.arp || c.pad; [0, 1, 2, 3, 2, 1, 2, 3].forEach((q, j) => S.add('piano', b, j / 2, [a[q % a.length]], 1.2, o.piano * (j % 2 ? .75 : 1))); }
    if (o.keys) S.add('rhodes', b, 0, c.pad, 3.5, o.keys);
    if (o.pad) S.add('pad', b, 0, c.pad, 4, o.pad, o.padKind || 'string');
    if (o.glass) S.add('pad', b, 0, c.pad.map(m => m + 12), 4, o.glass, 'glass');
  }
}

// 全部文案（字体按需加载用）
const TXT = '付款码向收银员出示此码秒后自动刷新正在获取新码校园卡余额网费刚刚更新充值启用e码通自动刷新二维码课表我的内网连接未连接中已连接学生VPN连接后即可访问教务系统等校内接口，其他流量不经过隧道。正在…断开考试成绩同步学年秋季学期场门座位学分今日周第下一节本一二三四五六日东大码' +
  D.today.flat().join('') + D.week7.map(x => x[4]).join('') + D.exams.flat().join('') + D.grades.flat().join('') + '¥0123456789.:-·，。、！？（）「」— ';

window.NEU = { calm, balCard, examCard, bounce, C, COURSE, D, money, rr, tx, al, sc, glow, hexA, fnt, SANS, SERIF, MONO, logo, qr, status, payScreen, vpnScreen, acadScreen, homeScreen, wToday, wECode, wExam, wWeek, HOME,
  screen, phone, phone2D, phoneLayer, phoneThree, lights, env, head, GRAD, PROG, MEL, MEL2, melody, groove, TXT, eo, eio, back, pr, hash };
})();
