// 第十章 · 03:00「能跑，也能讲清」+ 周一 08:00「交了」
// f10a 现实：凌晨三点，你自己看过 diff、跑过测试，也讲得清每一步；Clawd 说这回是真的做完了
// f10b 回声：副歌八小节，每小节翻进一章的画风，Clawd 跟着换装、旁边是那一章的标志物；清单八条，每条落在它那一章的画风里，最后转正停住
// f10c 现实：周一早上，天亮了，便利贴划掉，作业交了；Clawd 道别，合上屏幕，镜头退回窗外
// f10d 片尾：清单逐条打勾，来源，信息截至 2026 年 10 月；音乐盒、两下心跳、光标闪两下熄灭
(() => {
const R = (window.MV_W = window.MV_W || {});
const RULES = ['先判断这个项目在轴的哪一端', '提示词写清目标、背景、约束、验收标准', '规则文件自己写，写短', '按任务选模型，按任务算费用', '弄清工具的权限设置和撤销方式', '先出计划，小步提交', '看 diff、自己运行、确认依赖真实存在', '密钥不进代码，危险命令手动确认'];
const RULE_CH = ['01', '03', '04', '05', '06', '07', '08', '09'];
const SOURCES = ['Karpathy, 2025-02', 'Collins Dictionary, 2025-11', 'Simon Willison', 'Chroma, Context Rot, 2025-07', 'Anthropic, Prompting best practices', 'Gloaguen et al., ETH Zurich / ICLR 2026', 'Princeton HAL / Sayash Kapoor, 2025-12', 'RedAccess via Security Boulevard, 2026-05', 'Churilov via InfoWorld, 2026-04', 'METR, 2025-07 & 2026-02', 'GitGuardian 2026', 'Veracode 2026', 'TechCentral, 2026-04'];

// ======================================================================
R.f10a = K => window.MV_REAL(K, {
  scene: '10 · 03:00 能跑，也能讲清',
  desc: '凌晨三点，你自己看过 diff、跑过测试，也讲得清每一步在干什么；Clawd 说这回是真的做完了。',
  clock: [3, 0], stamp: ['周六', '03:00'],
  steps: [
    { pause: .75 },
    { id: 'run', you: '能跑了。diff 看过，测试也自己跑过了。' },
    { id: 'ok', me: '四个测试，全部通过。这回是真的。' },
    { id: 'explain', you: '每一步在干什么，我也讲得清了。' },
    { id: 'done', me: '那今晚就没白熬。', wait: .5 },
    { id: 'quiet', pause: 2.75 },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'wide', 0], [S.t('run') - .2, 'over', 1.2], [S.t('ok'), 'screen', 0], [S.t('explain'), 'face', 1.2], [S.t('quiet'), 'clock', 1.4], [S.t('quiet') + 1.8, 'desk', 1], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('quiet') + 1.6,
  room: () => ({ steam: .05, rain: .35 }),
  mood: () => [.6, .5, .85, .7],
  codeOverlay: (x, w, h, L, S) => {
    const k = K.prog(L.b, S.t('run') + .4, S.t('run') + .6); if (k <= 0) return;
    x.globalAlpha = k; x.fillStyle = '#0c0d10'; x.fillRect(0, h - 200, w, 200); x.fillStyle = '#2a2c33'; x.fillRect(0, h - 200, w, 2);
    x.font = '500 17px "JetBrains Mono",monospace';
    ['$ git diff --stat', '  4 files changed, 86 insertions(+), 3 deletions(-)', '$ mvn test'].forEach((s, i) => { x.fillStyle = '#e8e9ee'; x.fillText(s, 20, h - 168 + i * 30); });
    if (L.b >= S.t('ok')) { x.fillStyle = '#7ee0a0'; x.fillText('Tests run: 4, Failures: 0  ✓', 20, h - 168 + 3 * 30); }
    x.globalAlpha = 1;
  },
  figure: (L, S) => ({ type: (L.b >= S.t('run') && L.b < S.t('run') + .8) || (L.b >= S.t('explain') && L.b < S.t('explain') + .7) ? 1 : 0, lean: -.2 * K.prog(L.b, S.t('done'), S.t('done') + .6) }),
  sfx: S => [[S.t('ok') + .6, 'ding'], [S.t('quiet') + .3, 'tock'], [S.t('quiet') + .8, 'tock'], [S.t('quiet') + 1.3, 'tock'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .35);
    S.add('pad', 0, 0, H.CH.F.pad, 8, .3, 'warm');
    S.add('pad', Math.floor(M.t('explain')), 0, H.CH.C.pad, 8, .32, 'warm');
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .6);
  },
});

// ======================================================================
R.f10b = K => {
const { F, C, E, TR, LOOK, prog, lerp, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, clawd, seq, narrate, scene, sing } = K;
// 每个世界：[画风, 画风参数, 字体, 字色, 强调色, 卡片底色, Clawd 打扮, 亮底？]
const W = {
  dream: [LOOK.DREAM, [1, 0, .7, 0], F.serif, '#fff6ff', '#ffd38a', 'rgba(40,18,60,.78)', { skin: 'glow', col: '#ff7d55', hi: '#ffa27f', glow: '#ff5fa8' }],
  orbit: [LOOK.ORBIT, [.5, .45, .95, .05], F.sans, '#eef3ff', '#9fd8ff', 'rgba(8,12,30,.85)', { hat: 'helmet' }],
  riso: [LOOK.RISO, [.8, 1, 0, 0], F.poster, '#2a4fd0', '#ff3d9a', '#f3ecdc', { col: '#ff6a2a', hi: '#ff9a6a' }, 1],
  paper: [LOOK.PAPER, [1, .3, 0, 0], F.sans, '#2b2d42', '#e07a5f', '#f7f0e1', { skin: 'paper', col: '#e07a5f', hi: '#ef9a7f', line: '#f7f0e1' }, 1],
  neon: [LOOK.NEON, [.5, 1.2, .55, .5], F.sans, '#ffe8fb', '#3ef0ff', 'rgba(20,6,30,.86)', { skin: 'neon', col: '#ff4fb8', glow: '#ff4fb8' }],
  print: [LOOK.PRINT, [.12, 0, 0, 0], F.sans, '#eaf4ff', '#ffd75e', 'rgba(14,40,90,.9)', { skin: 'wire', col: '#ffd75e' }],
  pixel: [LOOK.PIXEL, [6, 1, 1.5, 0], F.sans, '#fff1e8', '#ffec27', '#1d2b53', { col: '#ffa300', hi: '#ffccaa', eyeC: '#000', hat: 'cap8', hatC: '#ff004d' }],
  noir: [LOOK.NOIR, [1, .9, 0, 0], F.serif, '#2a2a2a', '#e0242f', '#e9e6de', { hat: 'fedora' }, 0],
  alert: [LOOK.ALERT, [.06, .4, 1, 0], F.sans, '#ffffff', '#3ff0d0', 'rgba(6,18,18,.9)', {}],
};
const CHORUS = ['dream', 'orbit', 'riso', 'paper', 'neon', 'print', 'pixel', 'noir'];
const LISTW = ['dream', 'riso', 'paper', 'neon', 'print', 'pixel', 'noir', 'alert'];
const S = seq([
  { id: 'in', pause: 1.75 },
  { id: 'ref', pause: 8.25 },
  { id: 'list0', say: '今晚这八条，收成一张清单：' },
  ...RULES.map((r, i) => ({ id: 'r' + i, say: r + '。', hold: .5 })),
  { id: 'settle', pause: 2 },
], { start: .25, tail: .25 });
const t = S.t;
const R0 = Math.ceil(t('ref'));
const RT = RULES.map((_, i) => t('r' + i));
// 当前在哪个世界
const worldAt = b => {
  if (b >= R0 && b < R0 + 8) return CHORUS[Math.floor(b - R0)];
  if (b >= RT[0] - .1 && b < t('settle') + .2) { let i = 0; RT.forEach((a, j) => { if (b >= a - .1) i = j; }); return LISTW[i]; }
  return null;
};
const light = b => { const w = worldAt(b); return w && W[w][7]; };
// 每个世界的标志物（片里那一章出现过的东西）
function motif(cx, tx, name, k, tt) {
  const [, , fam, ink, acc] = W[name];
  alpha(cx, k, () => alpha(tx, k, () => {
    if (name === 'dream') { seg(cx, 560, 700, 560 + 800 * k, 700, ink, 5); [['作业', .2], ['给别人用', .6], ['上线', 1]].forEach(([n, p]) => { if (k >= p) { cx.fillStyle = ink; cx.fillRect(560 + 800 * p - 4, 680, 8, 40); txt(tx, n, 560 + 800 * p, 750, fnt(800, 32, fam), ink, 'center'); } }); }
    if (name === 'orbit') { circ(cx, 960, 690, 120, null, acc, 4); for (let i = 0; i < 4; i++) { const a = tt * .8 + i * 1.571; circ(cx, 960 + Math.cos(a) * 120, 690 + Math.sin(a) * 120, 12, ink); } txt(tx, '上下文窗口', 960, 690, fnt(800, 30, fam), ink, 'center'); }
    if (name === 'riso') ['目标', '背景', '约束', '验收'].forEach((n, i) => { const kk = prog(k, i * .15, i * .15 + .4, E.back); scaleAt(cx, 615 + i * 230, 700, kk, () => rr(cx, 535 + i * 230, 640, 160, 120, 4, ['#2a4fd0', '#14a05a', '#ff6a2a', '#ff3d9a'][i])); if (kk > .5) txt(tx, n, 615 + i * 230, 700, fnt(900, 40, fam), '#ffffff', 'center'); });
    if (name === 'paper') { for (let i = 0; i < 4; i++) rotAt(cx, 960, 700 - i * 22, (i - 1.5) * .03, () => rr(cx, 760, 660 - i * 22, 400, 90, 4, i === 0 ? '#e8b04a' : '#fffaf0', '#2b2d42', 2)); txt(tx, 'AGENTS.md', 960, 708, fnt(700, 30, F.mono), ink, 'center'); }
    if (name === 'neon') { cx.save(); cx.shadowColor = acc; cx.shadowBlur = 16; cx.strokeStyle = '#b45cff'; cx.lineWidth = 6; cx.beginPath(); cx.ellipse(960, 700, 300, 110, 0, 0, 6.283); cx.stroke(); [[tt * 1.6, acc], [tt * .9 + 2, '#ff4fb8']].forEach(([a, c]) => { cx.fillStyle = c; cx.shadowColor = c; cx.fillRect(960 + Math.cos(a) * 300 - 18, 700 + Math.sin(a) * 110 - 9, 36, 18); }); cx.restore(); }
    if (name === 'print') { cx.strokeStyle = ink; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(700, 740); cx.lineTo(700, 700); cx.lineTo(790, 680); cx.lineTo(860, 620); cx.lineTo(1060, 620); cx.lineTo(1130, 680); cx.lineTo(1220, 700); cx.lineTo(1220, 740); cx.closePath(); cx.stroke(); [800, 1120].forEach(x => circ(cx, x, 745, 44, 'rgba(18,58,122,1)', ink, 3)); cx.strokeStyle = acc; cx.strokeRect(910, 650, 100, 60); txt(tx, '模型', 960, 680, fnt(800, 24, fam), acc, 'center'); }
    if (name === 'pixel') { [0, 1, 2].forEach(i => { const x = 760 + i * 200; cx.fillStyle = '#29adff'; cx.fillRect(x - 36, 664, 72, 72); cx.fillStyle = '#fff1e8'; cx.fillRect(x - 24, 664, 48, 24); cx.fillStyle = '#c2c3c7'; cx.fillRect(x - 24, 700, 48, 30); }); txt(tx, 'SAVE', 960, 780, fnt(400, 30, F.pixel), acc, 'center'); }
    if (name === 'noir') { rotAt(cx, 960, 700, -.04, () => { rr(cx, 720, 620, 480, 170, 2, '#e9e6de'); }); rotAt(tx, 960, 700, -.04, () => { txt(tx, '测试全部通过 ✓', 900, 690, fnt(900, 40, F.serif), '#2a2a2a', 'center'); rr(tx, 1040, 700, 130, 60, 4, null, acc, 5); txt(tx, '待查', 1105, 731, fnt(900, 34, F.serif), acc, 'center'); }); }
  }));
}
return scene({
  scene: '10 回声 · 清单',
  desc: '副歌八小节，每小节翻进一章的画风，Clawd 跟着换装，旁边是那一章的标志物；然后八条规则落进一张清单，每条用它那一章的画风，最后清单转正停住。',
  look: L => { const w = worldAt(L.b); return w ? W[w][0] : LOOK.PRISM; },
  enter: { kind: TR.FLASH, a: 0, b: .5, flash: .8 },
  hud: { num: '10', name: '清单', time: '03:00', line: '能跑，也能讲清', small: true, ink: L => light(L.b) ? '#1f1b2e' : '#ffffff', acc: C.clawd },
  par: L => { const w = worldAt(L.b); return w ? W[w][1] : [.6 + .4 * prog(L.b, 0, R0), 0, 0, 0]; },
  cam: L => { if (L.b >= R0 && L.b < R0 + 8) { const k = L.b % 1; return [1.04 - .04 * E.out(Math.min(1, k * 3)), 0, 0, 0]; } return [1, 0, 0, 0]; },
  flash: L => L.b >= R0 && L.b < R0 + 8 ? .45 * Math.exp(-(L.b % 1) * 16) : 0,
  pulse: L => L.b >= R0 && L.b < R0 + 8 ? 1 : .4,
  sfx: [[.2, 'chime', 1319], [R0, 'sparkle'], ...CHORUS.map((_, i) => [R0 + i, 'swish']), ...RT.flatMap((a, i) => [[a + .05, 'stamp'], [a + .1, 'blip', 900 + i * 90]]), [t('settle') + .3, 'rule']],
  text: RULES.join('') + RULE_CH.join('') + 'Vibe Coding 清单作业给别人用上线上下文窗口目标背景约束验收AGENTS.md模型SAVE测试全部通过 ✓待查第章',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    // ---------- 开场：安静的回声 ----------
    if (b < R0) {
      const k = prog(b, .2, .8) * (1 - prog(b, R0 - .3, R0));
      alpha(tx, k, () => { txt(tx, '03:00', 960, 420, fnt(700, 180, F.mono), rgba('#ffffff', .12 + .04 * Math.sin(tt * 3)), 'center'); txt(tx, '今晚的事，再唱一遍。', 960, 600, fnt(800, 56, F.serif), '#f4f1ea', 'center'); });
      clawd(cx, { x: 960, y: 860, px: 14, pose: 'idle', ph: tt * 6, blink: (tt % 2.4) < .2, eye: 0, alpha: k });
    }
    // ---------- 副歌：每小节一个世界 ----------
    if (b >= R0 - .05 && b < R0 + 8.3) {
      const i = Math.max(0, Math.min(7, Math.floor(b - R0))), name = CHORUS[i], [, , fam, ink, acc] = W[name], lb = (b - R0) % 1;
      motif(cx, tx, name, prog(lb, .05, .45, E.out) * (1 - prog(b, R0 + 8, R0 + 8.3)), tt);
      const jump = Math.sin(Math.min(1, lb * 2.2) * Math.PI) * 70;
      clawd(cx, { x: 1560, y: 880 - jump, px: 16, pose: lb < .5 ? 'up' : 'idle', ph: tt * 10, blink: false, eye: 0, eyeShape: 'happy', ...W[name][6] });
      const lc = name === 'noir' ? '#f2efe8' : ink; sing(tx, L, { at: R0, x: 960, y: 330, size: 84, col: lc, dim: rgba(lc, name === 'pixel' ? .55 : .25), glow: acc, fam, hold: 8.15 });
    }
    // ---------- 清单 ----------
    const kl = prog(b, t('list0'), t('list0') + .4, E.out);
    if (kl > 0) {
      let wi = 0; RT.forEach((a, j) => { if (b >= a - .1) wi = j; });
      const name = b >= RT[0] - .1 ? LISTW[wi] : 'dream', [, , fam, ink, acc, bg] = W[name];
      const settle = prog(b, t('settle'), t('settle') + 1.2, E.io), rot = (1 - settle) * (wi % 2 ? .018 : -.018) * (b >= RT[0] ? 1 : 0);
      const X = 330, Y = 130, Wd = 1260, Hd = 790;
      alpha(cx, kl, () => alpha(tx, kl, () => {
        rotAt(cx, 960, 525, rot, () => { rr(cx, X, Y + (1 - kl) * 40, Wd, Hd, name === 'pixel' ? 0 : 18, bg, rgba(acc, .6), 3); if (name === 'print') { cx.strokeStyle = rgba(ink, .12); cx.lineWidth = 1; for (let x = X + 40; x < X + Wd; x += 40) { cx.beginPath(); cx.moveTo(x, Y); cx.lineTo(x, Y + Hd); cx.stroke(); } } });
        rotAt(tx, 960, 525, rot, () => {
          txt(tx, 'Vibe Coding', X + 60, Y + 72, fnt(700, 44, F.mono), ink); txt(tx, '清单', X + 400, Y + 72, fnt(900, 44, fam), acc);
          seg(tx, X + 60, Y + 118, X + Wd - 60, Y + 118, rgba(ink, .25), 2);
          RULES.forEach((r, i) => {
            const ki = prog(b, RT[i], RT[i] + .25, E.out); if (ki <= 0) return;
            const y = Y + 180 + i * 76 - (1 - ki) * 30, cur = i === wi && b < t('settle');
            alpha(tx, ki, () => {
              if (cur) { tx.fillStyle = rgba(acc, .18); tx.fillRect(X + 40, y - 34, Wd - 80, 68); }
              txt(tx, String(i + 1), X + 80, y, fnt(800, 34, F.mono), acc, 'center');
              txt(tx, r, X + 130, y, fnt(cur ? 900 : 700, 36, fam), ink);
              txt(tx, '第 ' + RULE_CH[i] + ' 章', X + Wd - 60, y, fnt(500, 24, F.sans), rgba(ink, .5), 'right');
            });
          });
        });
      }));
      if (b >= RT[0] - .1) {
        const hop = Math.sin(Math.min(1, prog(b, RT[wi], RT[wi] + .4)) * Math.PI) * 60;
        clawd(cx, { x: 1740, y: 900 - hop, px: 13, pose: b >= t('settle') ? 'both' : 'pointL', ph: tt * 10, blink: (tt % 3) < .1, eye: -1, eyeShape: b >= t('settle') ? 'happy' : null, ...W[name][6] });
      } else clawd(cx, { x: 1740, y: 900, px: 13, pose: 'idle', ph: tt * 10, eye: -1, alpha: kl });
    }
    narrate(tx, L, S, { sub: { y: 1000, size: 38, col: light(b) ? '#1f1b2e' : '#ffffff', shadow: light(b) ? 'rgba(255,255,255,.9)' : 'rgba(0,0,0,1)' } });
  },
  music(Sm, H, w) {
    const B = w.m.bars, PD = H.PD, CH = H.CH;
    Sm.add('pad', 0, 0, CH.F.pad, (R0) * 4, .35, 'glass');
    H.roll(Sm, R0 - 1, 2, 4, 'snare', 'gated', .2, .8, .25);
    Sm.add('crash', R0, 0, 0, 0, .85);
    H.hook(Sm, R0, 'saw', 0, 0, 8, .95);
    H.each(R0, R0 + 8, b => { for (let j = 0; j < 4; j++) Sm.add('kick', b, j, 0, 0, .85, 'main'); Sm.add('snare', b, 1, 0, 0, .65, 'gated'); Sm.add('snare', b, 3, 0, 0, .65, 'gated'); const c = CH[PD[(b - R0) % 4]]; Sm.add('pad', b, 0, c.pad, 4, .55, 'warm'); Sm.add('bass', b, 0, c.r, 3.5, .7, '808'); });
    H.hats(Sm, R0, R0 + 8, .5, .2, true, true);
    const L0 = R0 + 8;
    H.each(L0, B, b => { const c = CH[PD[(b - L0) % 4]]; Sm.add('pad', b, 0, c.pad, 4, .45, 'warm'); Sm.add('kick', b, 0, 0, 0, .5, 'soft'); Sm.add('kick', b, 2, 0, 0, .4, 'soft'); Sm.add('snare', b, 3, 0, 0, .35, 'lofi'); for (let j = 0; j < 8; j++) Sm.add('chiparp', b, j / 2, c.arp[j % 4], .4, .3); });
    RT.forEach((a, i) => Sm.add('bell', Math.floor(a), (a % 1) * 4, [72, 74, 76, 77, 79, 81, 83, 84][i], 2, .45));
  },
}, S);
};

// ======================================================================
R.f10c = K => window.MV_REAL(K, {
  scene: '11 · 周一 08:00 交了',
  desc: '周一早上，天亮了，雨停了；便利贴被划掉，作业交了；Clawd 让你把清单截图存好，道别，你合上屏幕，镜头退回窗外。',
  clock: [8, 0], stamp: ['周一', '08:00'],
  steps: [
    { id: 'open', pause: 3 },
    { id: 'sub', me: '周一早上。作业，交了。' },
    { id: 'shot', me: '今晚那张清单，截个图存好。' },
    { id: 'bye', me: '我是 Clawd，下次见。', wait: .5 },
    { id: 'close', pause: 2.5 },
    { id: 'out', pause: 2.5 },
  ],
  shots: S => [[0, 'street', 0], [.3, 'window', 2.5, 'io'], [S.t('open') + .2, 'note', 1.2], [S.t('sub') - .2, 'desk', 1.4], [S.t('bye'), 'over', 1.5], [S.t('close') + .4, 'wide', 2, 'io'], [S.t('out'), 'street', 2.5, 'io']],
  chatHide: S => S.t('close') + .6,
  room: (L, S) => ({ dawn: 1, rain: 0, lamp: 0, steam: 0, noteCross: K.prog(L.b, S.t('open') + .9, S.t('open') + 1.6), lidClose: K.prog(L.b, S.t('close') + .3, S.t('close') + 1.4, K.E.io), screen: 1 - K.prog(L.b, S.t('close') + .8, S.t('close') + 1.4) }),
  mood: (L, S) => [.9, .82, .55, .7],
  exposure: 1.6,
  lb: (L, S) => .35 + .3 * K.prog(L.b, S.t('out'), S.t('out') + 2),
  codeOverlay: (x, w, h, L, S) => {
    x.fillStyle = '#f4f6f8'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1f2a37'; x.font = '700 30px "Noto Sans SC",sans-serif'; x.fillText('课程作业提交', 40, 70);
    x.font = '400 22px "Noto Sans SC",sans-serif'; x.fillStyle = '#4b5563'; x.fillText('图书管理系统 · 加登录功能', 40, 120); x.fillText('截止：周一 08:00', 40, 156);
    x.fillStyle = '#e5e7eb'; x.fillRect(40, 190, w - 80, 2);
    x.fillStyle = '#16a34a'; x.font = '700 34px "Noto Sans SC",sans-serif'; x.fillText('✓ 已提交', 40, 250);
    x.fillStyle = '#6b7280'; x.font = '400 20px "Noto Sans SC",sans-serif'; x.fillText('提交时间：周一 07:52', 40, 292);
  },
  figure: (L, S) => ({ type: 0, lean: -.25, yaw: .1, hide: true }), // 整场不放人：合盖时手会穿进屏幕和键盘之间，而这一场是连续运镜，没有剪切点可以中途藏人
  sfx: S => [[.3, 'chime', 1319], [S.t('open') + 1, 'scratch'], [S.t('close') + .5, 'thud'], [S.t('out'), 'whoosh']],
  music(S, H, w) {
    const M = w.m.S, B = w.m.bars;
    H.each(0, B, b => { const c = H.CH[H.PD[b % 4]]; S.add('pad', b, 0, c.pad, 4, .38, 'warm'); });
    H.hook(S, 1, 'box', 0, 0, 4, .55);
  },
  draw(cx, tx, L, S) {
    const k = K.prog(L.b, S.t('open') + .7, S.t('open') + 1.1) * (1 - K.prog(L.b, S.t('sub') - .3, S.t('sub')));
    if (k > 0) K.alpha(tx, k, () => K.txt(tx, '周一 8:00 交 · 图书管理系统：加登录功能  ✓', 960, 900, K.fnt(500, 34), 'rgba(255,240,200,.95)', 'center'));
  },
});

// ======================================================================
R.f10d = K => {
const { F, C, E, TR, LOOK, prog, lerp, rgba, fnt, rr, circ, seg, txt, scaleAt, alpha, clawd, seq, scene } = K;
const S = seq([
  { id: 'card', pause: 4.5 },
  { id: 'src', pause: 3.5 },
  { id: 'end', pause: 2.5 },
], { start: .25, tail: .25 });
const t = S.t;
const TICK = RULES.map((_, i) => t('card') + .9 + i * .3);
const END = t('end');
return scene({
  scene: '片尾',
  desc: '清单逐条打勾；来源；信息截至 2026 年 10 月；音乐盒弹一遍主旋律，两下心跳，光标闪两下，熄灭。',
  look: LOOK.PRISM,
  enter: { kind: TR.INK, a: 0, b: 1.5, p: [.5, .5, 0, 0] },
  hud: { ink: '#e8e9ee' },
  noInv: true,
  par: L => [1 - prog(L.b, END + 1.2, END + 2.2), 0, 0, 0],
  lb: L => prog(L.b, END + 1.8, END + 2.4, E.io) * 4.2,
  sfx: [...TICK.map((a, i) => [a, 'blip', 900 + i * 80]), [t('src') + .2, 'paper'], [END + .2, 'heart'], [END + .7, 'heart']],
  text: RULES.join('') + SOURCES.join('') + 'Vibe Coding 清单需要注意的细节 · 电影版信息截至 2026 年 10 月来源周一 08:00示意第章',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t, fade = 1 - prog(b, END + 1.2, END + 2);
    // 清单卡片
    const kc = prog(b, t('card') + .3, t('card') + .9, E.out) * (1 - prog(b, t('src') - .2, t('src') + .3));
    if (kc > 0) alpha(cx, kc, () => alpha(tx, kc, () => {
      const X = 330, Y = 120, Wd = 1260, Hd = 790;
      rr(cx, X, Y + 20 * (1 - kc), Wd, Hd, 22, 'rgba(18,18,24,.92)', 'rgba(255,255,255,.14)', 2);
      txt(tx, 'Vibe Coding', X + 60, Y + 72, fnt(700, 44, F.mono), '#f4f1ea'); txt(tx, '清单', X + 400, Y + 72, fnt(900, 44), C.clawd);
      txt(tx, '需要注意的细节 · 电影版', X + Wd - 60, Y + 72, fnt(500, 24), 'rgba(255,255,255,.5)', 'right');
      seg(tx, X + 60, Y + 118, X + Wd - 60, Y + 118, 'rgba(255,255,255,.14)', 2);
      RULES.forEach((r, i) => {
        const y = Y + 180 + i * 76;
        rr(tx, X + 60, y - 20, 40, 40, 8, rgba(C.clawd, .2), C.clawd, 2.5);
        const k = prog(b, TICK[i], TICK[i] + .2, E.back);
        if (k > .01) scaleAt(tx, X + 80, y, k, () => { tx.strokeStyle = '#a5d67a'; tx.lineWidth = 5; tx.lineCap = 'round'; tx.beginPath(); tx.moveTo(X + 69, y); tx.lineTo(X + 77, y + 8); tx.lineTo(X + 92, y - 9); tx.stroke(); });
        txt(tx, r, X + 130, y, fnt(700, 36), '#f4f1ea');
        txt(tx, '第 ' + RULE_CH[i] + ' 章', X + Wd - 60, y, fnt(400, 24), 'rgba(255,255,255,.4)', 'right');
      });
    }));
    // 来源
    const ks = prog(b, t('src'), t('src') + .5) * fade;
    if (ks > 0) alpha(tx, ks, () => {
      txt(tx, '来源', 960, 190, fnt(900, 40), '#f4f1ea', 'center');
      SOURCES.forEach((s, i) => { const col = i % 2, row = Math.floor(i / 2); txt(tx, s, col ? 1000 : 920, 270 + row * 56, fnt(500, 28, F.mono), 'rgba(244,241,234,.8)', col ? 'left' : 'right'); });
      txt(tx, '信息截至 2026 年 10 月', 960, 720, fnt(700, 34), C.clawd, 'center');
      txt(tx, '包名、代码里的密码、作业提交页都是示意', 960, 772, fnt(500, 26), 'rgba(244,241,234,.55)', 'center');
    });
    // Clawd 在右下角
    const kw = prog(b, t('card') + .2, t('card') + .8, E.io);
    clawd(cx, { x: lerp(960, 1700, kw), y: lerp(620, 960, kw) - Math.sin(Math.PI * kw) * 120, px: lerp(18, 10, kw), pose: kw < 1 ? 'up' : b >= END ? 'idle' : 'both', ph: tt * 10, blink: (tt % 2.6) < .15, eye: 0, eyeShape: kw >= 1 && b < END ? 'happy' : null, alpha: (b < END + .9 ? 1 : 1 - prog(b, END + .9, END + 1.3)) });
    // 光标闪两下，熄灭
    if (b >= END + .9 && b < END + 2.2) { const on = Math.floor((b - END - .9) * 3) % 2 === 0 && b < END + 1.9; if (on) { cx.fillStyle = '#e8e9ee'; cx.fillRect(950, 520, 22, 44); } }
  },
  music(Sm, H, w) {
    H.hook(Sm, 0, 'box', 0, 0, 8, .7);
    H.each(0, Math.floor(END), b => { const c = H.CH[H.PD[b % 4]]; Sm.add('pad', b, 0, c.pad, 4, .25, 'glass'); });
  },
}, S);
};
})();
