// 10 清单 · 回声：E 小调终章，每两小节回到一个世界的画风，规则大字落下；11 片尾：干净的清单卡片，Clawd 道别，光标熄灭
(function () {
const R = (window.MV_W = window.MV_W || {});
let cache = null;
const build = K => (cache && cache.K === K ? cache : (cache = { K, ...make(K) }));
R.w10 = K => build(K).finale;
R.w11 = K => build(K).outro;
function make(K) {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, lyric, clawd, sing } = K;
// [世界号, 画风, 画风参数, 规则, 字体, 字色, 强调色, 打扮]
const SEG = [
  ['01', LOOK.DREAM, [1, 0, .7, 0], '先判断这个项目在轴的哪一端', F.serif, '#fff6ff', '#ffd38a', { skin: 'glow', col: '#ff7d55', hi: '#ffa27f', glow: '#ff5fa8' }],
  ['03', LOOK.RISO, [.8, 1, 0, 0], '提示词写清目标、背景、约束、验收标准', F.poster, '#2a4fd0', '#ff3d9a', { col: '#ff6a2a', hi: '#ff9a6a' }],
  ['04', LOOK.PAPER, [1, .3, 0, 0], '规则文件自己写，写短', F.sans, '#2b2d42', '#e07a5f', { skin: 'paper', col: '#e07a5f', hi: '#ef9a7f', line: '#f7f0e1' }],
  ['05', LOOK.NEON, [.45, 1, .55, .75], '按任务选模型，按任务算费用', F.sans, '#ffe8fb', '#3ef0ff', { skin: 'neon', col: '#ff4fb8', glow: '#ff4fb8' }],
  ['06', LOOK.PRINT, [.12, 0, 0, 0], '弄清工具的权限设置和撤销方式', F.sans, '#eaf4ff', '#ffd75e', { skin: 'wire', col: '#ffd75e' }],
  ['07', LOOK.PIXEL, [6, 1, 2.5, 0], '先出计划，小步提交', F.sans, '#fff1e8', '#ffec27', { col: '#ffa300', hi: '#ffccaa', eyeC: '#000', hat: 'cap8', hatC: '#ff004d' }],
  ['08', LOOK.NOIR, [1, .9, 0, 0], '看 diff、自己运行、确认依赖真实存在', F.serif, '#f2efe8', '#e0242f', { hat: 'fedora' }],
  ['09', LOOK.ALERT, [0, .3, 1, .75], '密钥不进代码，危险命令手动确认', F.sans, '#ffffff', '#3ff0d0', {}],
];
const segAt = b => Math.max(0, Math.min(7, Math.floor(b / 2)));
function motif(cx, tx, i, b, t) { // 每个世界的一个小标志物
  const k = prog(b % 2, .1, .4, E.out);
  if (i === 0) { const x0 = 560, x1 = 1360, y = 760; seg(cx, x0, y, x0 + (x1 - x0) * k, y, '#ffd0f0', 4); [['作业', .45], ['给别人用', .72], ['上线', 1]].forEach(([n, p]) => { if (k >= p) { cx.fillStyle = '#ffffff'; cx.fillRect(x0 + (x1 - x0) * p - 3, y - 16, 6, 32); txt(cx, n, x0 + (x1 - x0) * p, y + 44, fnt(700, 28), '#ffffff', 'center'); } }); circ(cx, x0 + (x1 - x0) * .45 * k, y, 16, '#ffb3e6'); }
  if (i === 1) ['#2a4fd0', '#14a05a', '#ff6a2a', '#ff3d9a'].forEach((c, j) => { const kk = prog(b % 2, .1 + j * .1, .3 + j * .1, E.back); scaleAt(cx, 620 + j * 230, 760, kk, () => rr(cx, 540 + j * 230, 700, 160, 120, 4, c)); txt(cx, ['目标', '背景', '约束', '验收'][j], 620 + j * 230, 760, fnt(400, 44, F.poster), '#fff6ea', 'center'); });
  if (i === 2) rotAt(cx, 960, 760, -.03, () => { rr(cx, 700, 690, 520, 140, 4, '#f7f0e1'); rr(cx, 706, 696, 508, 128, 4, '#e8b04a'); txt(cx, 'AGENTS.md · 3 行', 960, 760, fnt(700, 36, F.mono), '#2b2d42', 'center'); });
  if (i === 3) { cx.save(); cx.shadowColor = '#ff4fb8'; cx.shadowBlur = 14; rr(cx, 640, 700, 300, 110, 20, null, '#ff4fb8', 5); rr(cx, 980, 700, 300, 110, 20, null, '#3ef0ff', 5); cx.restore(); txt(cx, '旗舰 · 主力 · 轻量', 960, 860, fnt(700, 30), '#ffe8fb', 'center'); txt(cx, '任务', 790, 755, fnt(900, 44), '#ffe8fb', 'center'); txt(cx, '总价', 1130, 755, fnt(900, 44), '#e8feff', 'center'); }
  if (i === 4) { cx.strokeStyle = '#eaf4ff'; cx.lineWidth = 3; cx.strokeRect(700, 700, 520, 120); seg(cx, 700, 860, 700 + 520 * k, 860, '#ffd75e', 3); txt(tx, '权限 · 检查点 · 撤销', 960, 760, fnt(700, 34), '#eaf4ff', 'center'); }
  if (i === 5) [0, 1, 2, 3].forEach(j => { if (b % 2 < .1 + j * .2) return; const x = 640 + j * 210, y = 760; cx.fillStyle = '#29adff'; cx.fillRect(x - 24, y - 30, 48, 48); cx.fillStyle = '#fff1e8'; cx.fillRect(x - 8, y - 48, 16, 16); cx.fillStyle = '#ffec27'; cx.fillRect(x + 30, y - 6, 150, 12); });
  if (i === 6) { rr(cx, 640, 700, 640, 120, 6, '#e9e6de'); txt(cx, '+ // assertTrue(isLocked(...))', 670, 760, fnt(700, 30, F.mono), '#e0242f'); cx.strokeStyle = '#e0242f'; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(720, 760, 70 * k, 34 * k, 0, 0, 6.283); cx.stroke(); }
  if (i === 7) { rr(cx, 800, 690, 320, 160, 20, '#1d2a2e', '#3ff0d0', 4); circ(cx, 960, 770, 46, null, '#3ff0d0', 6); rr(cx, 1160, 740, 120, 56, 8, '#ffb020'); txt(cx, '.env', 1220, 768, fnt(700, 28, F.mono), '#1a1a1a', 'center'); }
}
const ITEMS = SEG.map(s => [s[3], s[0]]);
const outro = {
  scene: '11 片尾', bars: 8, look: LOOK.PRISM,
  enter: { kind: TR.INK, a: 0, b: 4, p: [.5, .5, 0, 0] },
  hud: { ink: '#e8e9ee' },
  noInv: true,
  par: L => [1 - prog(L.b, 7.4, 7.95), 0, 0, 0],
  cam: L => [1.02 - .02 * prog(L.b, 0, 4, E.io), 0, 0, 0],
  lb: L => prog(L.b, 7.3, 7.9, E.io) * 4.2,
  sfx: [[.25, 'chime', 1175], [1.25, 'chime', 1568], [2.6, 'jump'], ...ITEMS.map((_, i) => [3 + i * .25, 'blip', 900 + i * 80]), [6, 'heart'], [6.5, 'heart']],
  text: ITEMS.flat().join('') + 'Vibe Coding 清单清单截个图存好。我是 Clawd，下次见。周一早上。作业，交了。周一 08:00需要注意的细节 · 导演剪辑版信息截至 2026 年 10 月',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, k = prog(b, 2.7, 3.1, E.out), fade = 1 - prog(b, 7.2, 7.6);
    alpha(cx, k * fade, () => {
      const X = 340, Y = 150, Wd = 1240, Hd = 760;
      rr(cx, X, Y + 20 * (1 - k), Wd, Hd, 22, 'rgba(18,18,24,.92)', 'rgba(255,255,255,.14)', 2);
      txt(cx, 'Vibe Coding', X + 60, Y + 74, fnt(700, 44, F.mono), '#f4f1ea'); txt(cx, '清单', X + 400, Y + 74, fnt(900, 44), C.clawd);
      txt(cx, '需要注意的细节 · 导演剪辑版', X + Wd - 60, Y + 74, fnt(500, 24), 'rgba(255,255,255,.5)', 'right');
      seg(cx, X + 60, Y + 124, X + Wd - 60, Y + 124, 'rgba(255,255,255,.14)', 2);
      ITEMS.forEach(([s, n], i) => {
        const at = 2.9 + i * .25, ki = prog(b, at, at + .2, E.out); if (ki <= 0) return;
        const y = Y + 186 + i * 70, col = SEG[i][6];
        alpha(cx, ki, () => {
          rr(cx, X + 60, y - 20, 40, 40, 8, rgba(C.clawd, .25), C.clawd, 2.5);
          const kc = prog(b, at + .1, at + .3, E.back); if (kc > 0) scaleAt(cx, X + 80, y, kc, () => { cx.strokeStyle = '#a5d67a'; cx.lineWidth = 5; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(X + 69, y); cx.lineTo(X + 77, y + 8); cx.lineTo(X + 92, y - 9); cx.stroke(); });
          txt(cx, s, X + 130 + 14 * (1 - ki), y, fnt(700, 36), '#f4f1ea');
          circ(cx, X + Wd - 150, y, 8, col === '#ffffff' ? '#3ff0d0' : col); txt(cx, '// ' + n, X + Wd - 60, y, fnt(400, 24, F.mono), 'rgba(255,255,255,.45)', 'right');
        });
      });
    });
    // 最后的光标
    if (b >= 6) { const on = (b >= 6 && b < 6.15) || (b >= 6.5 && b < 6.65) || (b >= 7 && b < 7.6); if (on) { cx.fillStyle = C.clawd; cx.fillRect(960 - 20, 960 - 40, 40, 80); } }
    // Clawd 道别
    const away = prog(b, 2.6, 3.1, E.io), jump = Math.sin(Math.PI * away) * 140;
    clawd(cx, { x: lerp(960, 1720, away), y: lerp(800, 990, away) - jump, px: lerp(22, 12, away), pose: (b >= .25 && b < 2.5) || (b >= 4 && b < 5.5) ? 'wave' : 'idle', ph: t * 12, blink: (t % 3) < .1, eye: away > .9 ? -1 : 0, alpha: (b < 2.6 ? prog(b, 0, .25) * (1 - k * .0) : 1) * fade, eyeShape: b >= 4 && b < 5.5 ? 'happy' : null });
    // 歌词（先于清单出现，Clawd 在卡片前）
    lyric(tx, L, { at: .25, out: 2.5, text: '周一早上。作业，交了。', x: 960, y: 370, size: 64, w: 900, col: '#ffffff', align: 'center', anim: 'rise', outAnim: 'up' });
    lyric(tx, L, { at: 1.25, out: 2.5, text: '清单截个图存好。\n我是 ‹Clawd›，下次见。', x: 960, y: 510, size: 44, w: 700, col: '#e8e9ee', acc: [C.clawd], align: 'center', anim: 'rise', outAnim: 'up' });
    alpha(tx, prog(b, 0, .3) * (1 - prog(b, 7.2, 7.6)), () => txt(tx, '周一 08:00', 70, 66, fnt(400, 22, F.mono), 'rgba(255,255,255,.5)'));
  },
};
const segBar = b => Math.max(0, Math.min(7, Math.floor(b % 8)));
const lightLook = i => [LOOK.RISO, LOOK.PAPER].includes(SEG[i][1]);
const finale = {
  scene: '10 回声 · 清单', bars: 16,
  look: L => SEG[segBar(L.b)][1],
  enter: { kind: TR.FLASH, a: .5, b: .5, flash: 1 },
  hud: { num: '10', name: '清单', time: '03:00', line: '能跑，也能讲清', small: true, ink: L => lightLook(segBar(L.b)) ? '#1f1b2e' : '#ffffff', acc: C.clawd },
  you: [[0, 1.6, '能跑了。diff 看过，测试也自己跑过了。']],
  noBanner: true,
  par: L => SEG[segBar(L.b)][2],
  cam: L => { const k = L.b % 1; return [1.05 - .05 * E.out(Math.min(1, k * 3)), 0, 0, 0]; },
  flash: L => L.b >= 1 ? .35 * Math.exp(-(L.b % 1) * 18) : 0,
  pulse: L => 1,
  sfx: [[0, 'sparkle'], ...SEG.flatMap((_, i) => [[8 + i, 'stamp'], [8 + i + .05, 'blip', 900 + i * 90]]), [15.5, 'rule']],
  text: SEG.map(s => s[3]).join('') + '能跑了。diff 看过，测试也自己跑过了。作业给别人用上线目标背景约束验收AGENTS.md · 3 行旗舰 · 主力 · 轻量任务总价权限 · 检查点 · 撤销+ // assertTrue(isLocked(...)).env清单',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, i = segBar(b), s = SEG[i], lb = b % 1;
    const [num, look, , rule, fam, col, acc, skin] = s;
    // Clawd 每小节换一身打扮，跳一下
    const hopK = prog(lb, 0, .25, E.out);
    clawd(cx, { x: 1640, y: 960 - Math.sin(Math.PI * hopK) * 70, px: 16, pose: b < 8 ? 'wave' : 'idle', ph: t * 12, blink: (t % 3) < .1, eye: -1, ...skin });
    if (b < 8.1) {
      // 副歌：逐字点亮；下面是这个世界的标志物
      motif(cx, tx, i, lb * 2, t);
      sing(tx, L, { at: 0, x: 960, y: 470, size: 96, fam: F.sans, w: 900, col: k => SEG[Math.max(0, Math.min(7, k))][5], glow: k => SEG[Math.max(0, Math.min(7, k))][6], hold: 8.05 });
    } else {
      // 清单在八个世界里一条条攒起来
      const n = Math.min(8, Math.floor(b - 8) + 1), ink = col, f = fam === F.poster ? fnt(400, 44, F.poster) : fnt(900, 42, fam);
      txt(tx, '清单', 330, 190, fnt(900, 40, fam === F.poster ? F.poster : F.sans), acc);
      for (let j = 0; j < n; j++) {
        const y = 260 + j * 76, fresh = j === n - 1, k = fresh ? prog(b - 8 - j, 0, .12, E.out) : 1;
        alpha(tx, Math.min(1, k * 2), () => scaleAt(tx, 330, y, fresh ? lerp(1.25, 1, k) : 1, () => {
          tx.strokeStyle = ink; tx.lineWidth = 3; tx.strokeRect(330, y - 18, 36, 36);
          tx.strokeStyle = acc; tx.lineWidth = 6; tx.lineCap = 'round'; tx.beginPath(); tx.moveTo(337, y); tx.lineTo(346, y + 9); tx.lineTo(361, y - 10); tx.stroke();
          txt(tx, SEG[j][3], 392, y, f, ink);
          txt(tx, '// ' + SEG[j][0], 1560, y, fnt(700, 24, F.mono), acc, 'right');
        }));
      }
    }
  },
};
return { finale, outro };
}
})();
