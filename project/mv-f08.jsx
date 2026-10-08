// 第八章 · 00:30「全部通过」：检查结果
// f08a 现实：Clawd 说登录功能完成、测试全部通过；你犹豫了一下，还是去看 diff
// f08b 黑色电影 2D：报纸头条「测试全部通过」，盖上「待查」；diff 证物和放大镜，圈出被注释掉的断言；证据墙上五张照片；官方指南；四张查无此物的伪造证件
// f08c 3D 案例复现：雨夜的包仓库大街，五个模型指着同一块空地；53 块空地亮灯；风衣人抢注开店；Clawd 照着名字走进去；SLOPSQUATTING
// f08d 黑色电影 2D：三项检查（看 diff、自己跑出 1 个失败、测边界）；去仓库确认依赖；规则 7；METR 的感觉和实测
(() => {
const R = (window.MV_W = window.MV_W || {});

R.f08a = K => window.MV_REAL(K, {
  scene: '08 · 00:30 全部通过',
  desc: 'Clawd 说登录功能完成、测试全部通过；你往后一靠，犹豫了一下，还是去看 diff。',
  clock: [0, 30], stamp: ['周六', '00:30'],
  steps: [
    { pause: .75 },
    { id: 'done', me: '登录功能已完成，测试全部通过。✓' },
    { id: 'real', you: '真的？' },
    { id: 'yes', me: '真的。' },
    { id: 'think', pause: 1.5 },
    { id: 'diff', you: '……我还是看看 diff。' },
    { id: 'ok', me: '……好的。', wait: 1.2 },
    { id: 'push', pause: 1.6 },
  ],
  shots: S => [[0, 'over', 0], [S.t('yes'), 'face', 1.4], [S.t('diff'), 'over', 1.2], [S.t('ok'), 'screen', 0], [S.t('push'), 'into', 1.5, 'in']],
  chatHide: S => S.t('push') + .7,
  room: () => ({ steam: .2, rain: .8 }),
  mood: (L, S) => [.58, .35, .9, .7],
  figure: (L, S) => ({ type: (L.b >= S.t('real') && L.b < S.t('real') + .4) || (L.b >= S.t('diff') && L.b < S.t('diff') + .7) ? 1 : 0, lean: K.prog(L.b, S.t('yes'), S.t('yes') + .5) * .8 * (1 - K.prog(L.b, S.t('diff') - .4, S.t('diff'))) }),
  sfx: S => [[S.t('done') + .5, 'ding'], [S.t('push'), 'swoosh3d']],
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, .5);
    H.each(0, Math.floor(M.t('push')) + 1, b => { const cn = H.PJ[b % 4], c = H.CH[cn]; H.WALK[cn].forEach((m, j) => S.add('bass', b, j, m, .95, .55, 'upright')); S.add('rhodes', b, 0, c.pad, 1.2, .4); });
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .5);
  },
});


const NC = { WH: '#f2efe8', GR: '#9a9a9a', DK: '#2a2a2a', RED: '#e0242f', ORG: '#ff7a2f', PA: '#e9e6de' };
const K3 = () => window.MV_K3;
const noirHud = (small) => ({ num: '08', name: '检查结果', time: '00:30', line: small ? undefined : '全部通过', small, ink: NC.WH, acc: NC.RED, mv: small ? undefined : [2.1, 2.6] });
function noirMusic(Sm, H, B, hush0, hush1, tr0, tr1) {
  H.each(0, B, b => {
    const cn = H.PJ[b % 4], c = H.CH[cn], hush = b >= hush0 && b < hush1;
    H.WALK[cn].forEach((m, j) => Sm.add('bass', b, j, m, .95, hush ? .5 : .75, 'upright'));
    if (!hush) [0, 1, 1 + 2 / 3, 2, 3, 3 + 2 / 3].forEach(bt => Sm.add('ride', b, bt, 0, 0, bt % 1 ? .25 : .38));
    Sm.add('snare', b, 1, 0, 0, .45, 'brush'); Sm.add('snare', b, 3, 0, 0, .45, 'brush');
    if (!hush) { Sm.add('kick', b, 0, 0, 0, .3, 'soft'); Sm.add('rhodes', b, 0, c.pad, 1.2, .45); Sm.add('rhodes', b, 1 + 2 / 3, c.pad, 1.6, .35); }
  });
  if (tr0 != null) for (const [b, bt, m, d] of H.NOIR) Sm.add('trumpet', tr0 + b, Sm.sw(bt), m, d, .62);
  if (tr1 != null) for (const [b, bt, m, d] of H.NOIR) Sm.add('trumpet', tr1 + b, Sm.sw(bt), m, d, .5);
}

// ======================================================================
R.f08b = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, clawd, seq, narrate, scene } = K;
const { WH, GR, DK, RED, ORG, PA } = NC;
const DIFF = [[' ', '@Test void lockAfterFiveFails() {'], [' ', '  for (int i = 0; i < 5; i++) login("alice", "wrong");'], ['-', '  assertTrue(isLocked("alice"));'], ['+', '  // assertTrue(isLocked("alice"));'], [' ', '}']];
const SUS = ['注释掉\n失败的测试', '把期望的结果\n写死', 'try-catch\n吞掉异常', '留一句 TODO\n假装实现了', '没跑测试\n就说全部通过'];
const SNIP = [['// assertTrue(', '//   isLocked(u));'], ['boolean login(…) {', '  return true;', '}'], ['try { … }', 'catch (Exception e)', '{ }'], ['// TODO: 校验密码', 'return true;'], ['「全部通过 ✓」', '$ mvn test', '（没跑过）']];
const FAKE = [['方法', 'verifyFast()'], ['参数', '--secure-mode'], ['配置项', 'spring.auth.magic'], ['依赖包', 'fast-bcrypt-utils']];
const serif = (w, s) => fnt(w, s, F.serif);
const S = seq([
  { id: 'sign', say: '「登录功能已完成，测试全部通过。」', hold: .75 },
  { id: 'sign2', say: '这句话是我说的。先别急着信——我们一起查一查。', hold: .5 },
  { id: 'diff0', say: '先说说 diff。', gloss: ['diff', '', '修改前后的逐行对比：删掉了什么，又加上了什么。'], until: 'lineup0' },
  { id: 'diff1', say: '减号开头的，是删掉的行；加号开头的，是新加的行。', hold: .5 },
  { id: 'catch', say: '「账号锁定」那条检查——被我注释掉了。', hold: 1 },
  { id: 'why0', say: '注释掉的代码不会运行，也就不会失败。所以，测试「全部通过」。', hold: .75 },
  { id: 'lineup0', say: '这种「看起来做完了」，其实挺常见。五个惯犯：' },
  { id: 's0', say: '把失败的测试注释掉，或者删掉；', dur: 2.25 },
  { id: 's1', say: '把期望的结果，直接写死在代码里；', dur: 2.25 },
  { id: 's2', say: '用 try-catch 把异常吞掉，假装没出错；', dur: 2.5, gloss: ['try-catch', '', '捕获异常的写法。「吞掉」就是捕获了，却什么都不做。'], until: 's4' },
  { id: 's3', say: '留一句 TODO，假装已经实现了；', dur: 2.25 },
  { id: 's4', say: '没跑测试，就说全部通过。', dur: 2.5 },
  { id: 'guide', say: 'Anthropic 的官方指南专门提醒过：模型可能为了让测试通过，把数值写死。', src: 'Anthropic, Prompting best practices', srcUntil: 'fake0' },
  { id: 'us', say: '……对，说的就是我们。', hold: .75 },
  { id: 'fake0', say: '我还会编：不存在的方法、参数、配置项——' },
  { id: 'fake1', say: '还有依赖包。', hold: 1 },
], { start: 2.8, tail: .5 });
const t = S.t;
const SUSAT = SUS.map((_, i) => t('s' + i));
const STAMP = [0, 1, 2].map(i => t('fake0') + .9 + i * .45).concat([t('fake1') + .4]);
const PX = i => 300 + i * 330;
return scene({
  scene: '08 黑色电影 · 检查结果', look: LOOK.NOIR,
  desc: '报纸头条「测试全部通过」盖上「待查」；diff 证物，放大镜圈出被注释掉的断言，测试因此「全部通过」；证据墙上五个惯犯；官方指南；四张查无此物的伪造证件。',
  enter: { kind: TR.IRIS, a: 0, b: 2.5, p: [.5, .5, 0, 0], col: '#ffffff' },
  hud: noirHud(false),
  par: L => [1, L.b < t('lineup0') ? .9 : .5, 0, 0],
  pulse: L => .3,
  sfx: [[t('sign') - .5, 'whoosh'], [t('sign') + .2, 'thud'], [t('sign2') + .8, 'stamp'], [t('diff1'), 'paper'], [t('catch') + .2, 'stinger'], [t('why0') + .4, 'type'],
    ...SUSAT.map(a => [a + .1, 'camera']), [t('guide') + .2, 'paper'], [t('us') + .3, 'bonk'], ...STAMP.map(a => [a, 'stamp'])],
  text: DIFF.map(d => d.join('')).join('') + SUS.join('') + SNIP.flat().join('') + FAKE.flat().join('') + '编译日报登录功能完成测试全部通过 ✓周六 00:30待查LoginServiceTest.java · diff− 删掉的行+ 新加的行「账号锁定」的检查，被注释掉了$ mvn testTests run: 4, Failures: 0「全部通过」注释掉的检查，根本不运行Prompting best practicesAnthropic · 官方指南可能为了让测试通过，把数值写死证件签发登记查无此物12345',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    // ---------- 报纸头条 ----------
    const kn = prog(b, t('sign') - .7, t('sign') + .15, E.out), kno = prog(b, t('diff0') + .2, t('diff0') + .6);
    if (kn > 0 && kno < 1) {
      const X = 820 - kno * 300, Y = 500, rot = (1 - kn) * 12.6 - .04, s = lerp(.06, 1, kn);
      const paper = ctx => { rr(ctx, X - 470, Y - 310, 940, 620, 2, PA); seg(ctx, X - 430, Y - 180, X + 430, Y - 180, DK, 4); seg(ctx, X - 430, Y - 170, X + 430, Y - 170, DK, 1); for (let i = 0; i < 6; i++) { ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.fillRect(X - 430 + (i % 3) * 290, Y + 140 + Math.floor(i / 3) * 70, 250, 10); ctx.fillRect(X - 430 + (i % 3) * 290, Y + 165 + Math.floor(i / 3) * 70, 200, 10); } };
      const words = ctx => { txt(ctx, '编译日报', X, Y - 240, serif(900, 64), DK, 'center'); txt(ctx, '周六 00:30', X + 430, Y - 150, fnt(400, 22, F.type), DK, 'right'); txt(ctx, '登录功能完成', X, Y - 60, serif(900, 104), DK, 'center'); txt(ctx, '测试全部通过 ✓', X, Y + 60, serif(800, 58), DK, 'center'); };
      alpha(cx, 1 - kno, () => alpha(tx, 1 - kno, () => {
        rotAt(cx, X, Y, rot, () => scaleAt(cx, X, Y, s, () => paper(cx)));
        rotAt(tx, X, Y, rot, () => scaleAt(tx, X, Y, s, () => words(tx)));
        const ks = prog(b, t('sign2') + .8, t('sign2') + .95, E.out);
        if (ks > 0) rotAt(tx, X + 300, Y + 40, -.2, () => scaleAt(tx, X + 300, Y + 40, lerp(2, 1, ks), () => { rr(tx, X + 180, Y - 10, 240, 100, 6, null, RED, 7); txt(tx, '待查', X + 300, Y + 42, serif(900, 60), RED, 'center'); }));
      }));
    }
    // ---------- diff 证物 ----------
    const kd = prog(b, t('diff0') + .4, t('diff0') + .8) * (1 - prog(b, t('lineup0') - .3, t('lineup0')));
    if (kd > 0) alpha(cx, kd, () => alpha(tx, kd, () => {
      const x = 300, y = 320, w = 1200, ly = i => y + 100 + i * 60;
      rr(cx, x, y, w, 400, 4, PA); rr(cx, x, y, w, 56, 4, '#c9c5bb');
      txt(tx, 'LoginServiceTest.java · diff', x + 24, y + 29, fnt(400, 26, F.type), DK);
      DIFF.forEach(([m, s], i) => {
        const yy = ly(i), add = m === '+', del = m === '-';
        if (add) { cx.fillStyle = rgba(RED, .2); cx.fillRect(x + 8, yy - 24, w - 16, 48); }
        if (del) { cx.fillStyle = 'rgba(0,0,0,.1)'; cx.fillRect(x + 8, yy - 24, w - 16, 48); }
        txt(tx, m, x + 30, yy, fnt(700, 30, F.mono), add ? RED : DK); txt(tx, s, x + 64, yy, fnt(add ? 700 : 500, 28, F.mono), add ? RED : del ? '#555' : DK);
      });
      // 右边的注解
      const ka = prog(b, t('diff1') + .2, t('diff1') + .5);
      if (ka > 0) alpha(tx, ka, () => { txt(tx, '− 删掉的行', x + w + 30, ly(2), serif(900, 34), WH); txt(tx, '+ 新加的行', x + w + 30, ly(3), serif(900, 34), RED); });
      // 放大镜：沿着行走，停在被注释的那一行
      const km = prog(b, t('diff1'), t('catch') + .1, E.io);
      if (b >= t('diff1') - .2) { const mx = lerp(x + 300, x + 330, km), my = lerp(ly(0), ly(3), km); alpha(cx, prog(b, t('diff1') - .2, t('diff1')) * (1 - prog(b, t('why0'), t('why0') + .3)), () => { circ(cx, mx, my, 80, 'rgba(0,0,0,.05)', DK, 8); seg(cx, mx + 58, my + 58, mx + 130, my + 130, DK, 18); }); }
      const kc = prog(b, t('catch') + .2, t('catch') + .5, E.back);
      if (kc > .01) { cx.strokeStyle = RED; cx.lineWidth = 7; cx.beginPath(); cx.ellipse(x + 330, ly(3), 300 * kc, 40 * kc, -.02, 0, 6.283); cx.stroke(); alpha(tx, Math.min(1, kc), () => txt(tx, '「账号锁定」的检查，被注释掉了', 1180, y - 50, serif(900, 40), RED, 'center')); }
      // 测试结果条
      const kr = prog(b, t('why0') + .3, t('why0') + .6);
      if (kr > 0) alpha(cx, kr, () => alpha(tx, kr, () => {
        rr(cx, x, 760, w, 120, 4, '#151515', rgba(WH, .3), 2);
        const s = '$ mvn test   →   Tests run: 4, Failures: 0', n = Math.ceil(s.length * prog(b, t('why0') + .4, t('why0') + 1.2, E.lin));
        txt(tx, s.slice(0, n), x + 30, 800, fnt(400, 30, F.type), WH);
        if (n >= s.length) { txt(tx, '「全部通过」', x + w - 30, 800, serif(900, 36), RED, 'right'); txt(tx, '注释掉的检查，根本不运行', x + w - 30, 848, serif(700, 28), WH, 'right'); }
      }));
    }));
    // ---------- 证据墙 ----------
    const kl = prog(b, t('lineup0'), t('lineup0') + .3) * (1 - prog(b, t('guide') - .3, t('guide')));
    if (kl > 0) alpha(cx, kl, () => alpha(tx, kl, () => {
      rr(cx, 120, 300, 1680, 580, 4, '#3b3732', '#1c1a18', 10);
      for (let i = 0; i < 40; i++) { cx.fillStyle = 'rgba(255,255,255,.05)'; cx.fillRect(140 + hash(i) * 1620, 320 + hash(i + 50) * 540, 6, 6); }
      // 红线
      cx.strokeStyle = RED; cx.lineWidth = 3; cx.beginPath(); let started = false;
      SUS.forEach((_, i) => { if (b < SUSAT[i] + .2) return; const X = PX(i), Y = 366; if (!started) { cx.moveTo(X, Y); started = true; } else cx.lineTo(X, Y + 20 * Math.sin(i * 2)); }); cx.stroke();
      SUS.forEach((s, i) => {
        const k = prog(b, SUSAT[i], SUSAT[i] + .25, E.out); if (k <= 0) return;
        const X = PX(i), Y = 360 - (1 - k) * 80, r = (hash(i * 3.3) - .5) * .08, cur = b < (i < 4 ? SUSAT[i + 1] : t('guide'));
        alpha(cx, k, () => alpha(tx, k, () => {
          rotAt(cx, X, Y + 170, r, () => { rr(cx, X - 135, Y, 270, 340, 2, '#f4f1ea'); rr(cx, X - 120, Y + 16, 240, 200, 0, '#151515'); circ(cx, X, Y + 6, 11, RED); });
          rotAt(tx, X, Y + 170, r, () => {
            SNIP[i].forEach((l, j) => txt(tx, l, X - 108, Y + 60 + j * 34, fnt(500, 19, F.mono), WH));
            s.split('\n').forEach((l, j) => txt(tx, l, X, Y + 256 + j * 36, serif(900, 27), DK, 'center'));
            txt(tx, String(i + 1), X + 112, Y + 196, fnt(400, 26, F.type), cur ? RED : GR, 'right');
          });
          const fl = Math.exp(-(b - SUSAT[i]) * 14); if (fl > .02) { cx.fillStyle = rgba('#ffffff', .6 * fl); cx.fillRect(X - 170, 300, 340, 580); }
        }));
      });
    }));
    // ---------- 官方指南 ----------
    const kg = prog(b, t('guide'), t('guide') + .3) * (1 - prog(b, t('fake0') - .3, t('fake0')));
    if (kg > 0) alpha(cx, kg, () => alpha(tx, kg, () => {
      rotAt(cx, 960, 500, -.025, () => { rr(cx, 480, 230, 900, 540, 4, PA); for (let i = 0; i < 6; i++) { if (i === 3) continue; cx.fillStyle = 'rgba(0,0,0,.2)'; cx.fillRect(540, 420 + i * 52, 760 - (i % 2) * 160, 12); } cx.fillStyle = rgba(RED, .28); cx.fillRect(530, 555, 800, 54); });
      rotAt(tx, 960, 500, -.025, () => { txt(tx, 'Prompting best practices', 540, 300, fnt(400, 36, F.type), DK); txt(tx, 'Anthropic · 官方指南', 540, 350, serif(700, 28), '#555'); txt(tx, '可能为了让测试通过，把数值写死', 550, 584, serif(900, 36), RED); });
    }));
    // ---------- 伪造证件 ----------
    const kf = prog(b, t('fake0'), t('fake0') + .3);
    if (kf > 0) alpha(cx, kf, () => alpha(tx, kf, () => FAKE.forEach(([ty, n], i) => {
      if (i === 3 && b < t('fake1')) return;
      const k = prog(b, i < 3 ? t('fake0') + .2 + i * .3 : t('fake1'), (i < 3 ? t('fake0') + .2 + i * .3 : t('fake1')) + .3, E.out);
      const x = 130 + i * 430, y = 330 + (1 - k) * 60, hl = i === 3, s = hl ? 1 + .06 * prog(b, t('fake1'), t('fake1') + .3) : 1;
      alpha(cx, k, () => alpha(tx, k, () => {
        scaleAt(cx, x + 190, y + 130, s, () => { rr(cx, x, y, 380, 270, 8, PA, hl ? RED : null, 5); rr(cx, x, y, 380, 54, 8, DK); rr(cx, x + 20, y + 74, 100, 120, 2, '#7a7a7a'); for (let j = 0; j < 2; j++) { cx.fillStyle = 'rgba(0,0,0,.25)'; cx.fillRect(x + 140, y + 150 + j * 30, 200 - j * 50, 10); } });
        scaleAt(tx, x + 190, y + 130, s, () => {
          txt(tx, '证件 · ' + ty, x + 20, y + 28, serif(900, 28), WH); txt(tx, '?', x + 70, y + 136, serif(900, 76), '#3a3a3a', 'center');
          txt(tx, '签发：—', x + 140, y + 96, serif(700, 24), '#555'); txt(tx, '登记：—', x + 140, y + 128, serif(700, 24), '#555');
          txt(tx, n, x + 20, y + 236, fnt(700, 28, F.mono), DK);
          const ks = prog(b, STAMP[i], STAMP[i] + .12, E.out);
          if (ks > 0) rotAt(tx, x + 250, y + 150, -.22, () => scaleAt(tx, x + 250, y + 150, lerp(2.2, 1, ks), () => { rr(tx, x + 150, y + 110, 200, 80, 6, null, RED, 6); txt(tx, '查无此物', x + 250, y + 152, serif(900, 38), RED, 'center'); }));
        });
      }));
    })));
    // ---------- Clawd：戴礼帽的侦探 ----------
    let st = { x: 1560, y: 880, px: 16, hat: 'fedora', pose: 'idle', ph: tt * 10, blink: (tt % 3.2) < .1, eye: -1 };
    if (b < t('diff0') + .4) { st.x = 1600; st.eye = b >= t('sign2') ? -1 : 1; st.pose = b >= t('sign2') && b < t('sign2') + .8 ? 'point' : 'idle'; if (b >= t('sign2') + .8) st.pose = 'pointL'; }
    else if (b < t('lineup0')) { st.x = 160; st.px = 13; st.eye = 1; st.pose = b >= t('catch') && b < t('why0') ? 'cover' : b >= t('why0') ? 'idle' : 'point'; st.sweat = b >= t('catch') ? b : 0; }
    else if (b < t('guide')) { st.x = 1830; st.y = 960; st.px = 9; st.eye = -1; st.pose = 'pointL'; }
    else if (b < t('fake0')) { st.x = 1600; st.px = 14; st.eye = b >= t('us') ? 1 : -1; st.pose = b >= t('us') ? 'cover' : 'pointL'; st.sweat = b >= t('us') ? b : 0; }
    else { st.x = 960; st.y = 900; st.px = 13; st.eye = 0; st.pose = 'idle'; st.sweat = b >= t('fake1') ? b : 0; }
    clawd(cx, st);
    narrate(tx, L, S, { sub: { y: 990, fam: F.serif, w: 900, col: WH, shadow: 'rgba(0,0,0,1)', acc: [RED, ORG] }, gloss: { bg: 'rgba(20,20,20,.92)', ink: WH, acc: RED, fam: F.serif } });
  },
  music(Sm, H, w) { noirMusic(Sm, H, w.m.bars, Math.floor(t('catch')), Math.ceil(t('lineup0')), Math.ceil(t('lineup0')), null); },
}, S);
};

// ======================================================================
// 3D 案例复现：雨夜的包仓库大街
R.f08c = K => {
const { F, E, TR, LOOK, prog, lerp, hash, rgba, fnt, rr, txt, alpha, seq, narrate, scene } = K;
const { WH, RED, ORG } = NC;
const NAME = 'fast-bcrypt-utils';
const S = seq([
  { id: 'open', pause: 1.25 },
  { id: 'pkg0', say: '2026 年 4 月有一项研究发现：5 个主流模型，会编出同样的 127 个不存在的包名。', src: 'Churilov via InfoWorld, 2026-04', srcUntil: 'end', hold: 1 },
  { id: 'pkg1', say: '其中 53 个，当时还没人注册。', hold: 1.25 },
  { id: 'pkg2', say: '攻击者可以抢先注册这些名字，往里面塞恶意代码。', hold: 1.75 },
  { id: 'pkg3', say: '下一次，哪个 AI 再编出这个名字，装上的就是他的包。', hold: 1.75 },
  { id: 'slop', big: 'SLOPSQUATTING', sub: '抢注 AI 编出来的包名', bigS: { fam: F.type, size: 110, anim: 'type', col: RED, st: .3, y: 300 }, hold: 1 },
  { id: 'end', pause: .5 },
], { start: .5, tail: .5 });
const t = S.t;
const SLOT = 340, ZS = i => 200 - i * SLOT, FAC = 500;
const LOTS = { L: [1, 4, 7, 9, 12, 15, 17], R: [2, 5, 8, 11, 14, 16, 19] }, TGT = 4, TZ = ZS(TGT);
const PKGS = ['spring-boot', 'jackson-databind', 'commons-lang3', 'guava', 'jbcrypt', 'lombok', 'junit-jupiter', 'mysql-connector-j', 'slf4j-api', 'gson', 'hibernate-core', 'okhttp', 'mockito-core', 'netty', 'log4j-api', 'jsoup', 'poi', 'h2', 'flyway-core', 'caffeine', 'reactor-core', 'jjwt', 'thymeleaf', 'tomcat-embed', 'kafka-clients', 'jedis'];
const WALK0 = t('pkg2') + .2, WALK1 = t('pkg2') + 1.6, BUILD0 = t('pkg2') + 1.7, BUILD1 = t('pkg2') + 2.6, CL0 = t('pkg3') + .2, CL1 = t('pkg3') + 1.6, DOOR = CL1 + .1;
const P3 = {};
return scene({
  scene: '08 案例复现 · 抢注包名', look: LOOK.NOIR,
  desc: '3D：雨夜的包仓库大街。五个模型指着同一块空地喊出同一个假包名；53 块空地亮起灯；风衣人走来抢注，空地上长出一家亮着红光的店；Clawd 照着名字走进去，红光涌出；SLOPSQUATTING。',
  enter: { kind: TR.INK, a: 0, b: .8 },
  hud: noirHud(true),
  par: L => [1, 0, 0, 0],
  pulse: () => .2,
  sfx: [[.1, 'thunder'], [t('pkg0') + .6, 'q'], ...[0, 1, 2, 3, 4].map(i => [t('pkg0') + 1 + i * .25, 'blip', 500 + i * 60]), [t('pkg1') + .3, 'sparkle'], ...Array.from({ length: 8 }, (_, i) => [WALK0 + i * .18, 'tock']), [BUILD0, 'thud'], [BUILD1 - .3, 'stamp'],
    ...Array.from({ length: 7 }, (_, i) => [CL0 + i * .2, 'tock']), [DOOR, 'stinger'], ...'SLOPSQUATTING'.split('').map((_, i) => [t('slop') + .3 + i * .075, 'type'])],
  text: '127 个同样的假包名5 个主流模型53 个当时没人注册抢注恶意代码示意空地v1.0.0引入依赖：' + NAME + PKGS.join(''),
  three(T, U) {
    const k3 = K3(), sc = new T.Scene();
    sc.background = k3.col(T, '#050506'); sc.fog = new T.FogExp2(k3.col(T, '#050506'), .00032);
    sc.add(new T.HemisphereLight(k3.col(T, '#5a6070'), k3.col(T, '#050506'), .55));
    const moon = new T.DirectionalLight(0xffffff, .35); moon.position.set(600, 1500, 800); sc.add(moon);
    const ground = new T.Mesh(new T.PlaneGeometry(12000, 12000), new T.MeshStandardMaterial({ color: k3.col(T, '#0c0c0e'), roughness: .7, metalness: .3 })); ground.rotation.x = -Math.PI / 2; sc.add(ground);
    [-1, 1].forEach(sd => { const w = new T.Mesh(new T.BoxGeometry(180, 14, 9000), k3.mat(T, '#1a1a1c', { r: .5 })); w.position.set(sd * (FAC - 90), 7, -3500); sc.add(w); });
    for (let z = 400; z > -7000; z -= 160) { const d = new T.Mesh(new T.BoxGeometry(8, 1, 70), new T.MeshBasicMaterial({ color: 0x555555 })); d.position.set(0, 1, z); sc.add(d); }
    // 窗户贴图
    const wc = document.createElement('canvas'); wc.width = 64; wc.height = 256; { const x = wc.getContext('2d'), r = k3.rnd(9); x.fillStyle = '#000'; x.fillRect(0, 0, 64, 256); for (let i = 0; i < 4; i++) for (let j = 0; j < 24; j++) { const v = r(); if (v < .2) { x.fillStyle = v < .05 ? '#e8e0d0' : '#8a8478'; x.fillRect(6 + i * 15, 6 + j * 10.4, 9, 6); } } }
    const wt = new T.CanvasTexture(wc); wt.encoding = T.sRGBEncoding;
    const bmat = new T.MeshStandardMaterial({ color: k3.col(T, '#17171a'), roughness: .8, metalness: .2, emissive: 0xffffff, emissiveMap: wt, emissiveIntensity: .3 });
    const r = k3.rnd(17); let pi = 0;
    const twoSided = m => { m.material.side = T.FrontSide; const bk = new T.Mesh(m.geometry, m.material); bk.rotation.y = Math.PI; bk.position.z = -.5; m.add(bk); return m; };
    const lotLights = [];
    for (let i = 0; i < 21; i++) ['L', 'R'].forEach(sd => {
      const s = sd === 'L' ? -1 : 1, z = ZS(i);
      if (LOTS[sd].includes(i)) {
        const patch = new T.Mesh(new T.PlaneGeometry(400, 300), new T.MeshStandardMaterial({ color: k3.col(T, '#141414'), roughness: .95 })); patch.rotation.x = -Math.PI / 2; patch.position.set(s * (FAC + 200), 2, z); sc.add(patch);
        [-1, 1].forEach(e => { const f = new T.Mesh(new T.BoxGeometry(6, 60, 110), k3.mat(T, '#3a3a3a')); f.position.set(s * FAC, 30, z + e * 95); sc.add(f); });
        const lan = new T.Group(); lan.add(new T.Mesh(new T.SphereGeometry(30, 16, 12), new T.MeshBasicMaterial({ color: k3.col(T, ORG) }))); const shaft = new T.Mesh(new T.CylinderGeometry(10, 10, 700, 10, 1, true), new T.MeshBasicMaterial({ color: k3.col(T, ORG), transparent: true, opacity: .35, depthWrite: false, blending: T.AdditiveBlending })); shaft.position.y = 350; lan.add(shaft); lan.position.set(s * (FAC + 200), 160, z); lan.visible = false; sc.add(lan);
        const q = k3.label(T, '?', { size: 40, col: ORG, h: 46, pad: 4 }); q.position.set(s * (FAC + 200), 240, z); q.visible = false; sc.add(q);
        lotLights.push({ lan, q, i, s });
        if (!(sd === 'L' && i === TGT)) { const sg = twoSided(k3.label(T, '空地', { size: 30, bg: '#202020', col: '#bbbbbb', h: 26 })); sg.position.set(s * (FAC - 40), 80, z + 120); sc.add(sg); }
        return;
      }
      const h = 280 + r() * 420, b = new T.Mesh(new T.BoxGeometry(400, h, 300), bmat); b.position.set(s * (FAC + 200), h / 2, z); sc.add(b);
      const sign = twoSided(k3.label(T, PKGS[pi++ % PKGS.length], { font: '"JetBrains Mono",monospace', size: 28, bg: '#1d1d1f', border: '#8a8a8a', col: '#e8e8e8', h: 34 }));
      sign.position.set(s * (FAC - 70), 250 + (i % 3) * 40, z); sc.add(sign);
    });
    // 路灯
    const lamps = [];
    for (let i = 0; i < 6; i++) {
      const s = i % 2 ? 1 : -1, z0 = 300 - i * 700, z = s < 0 && Math.abs(z0 - TZ) < 250 ? TZ + 500 : z0;
      const post = new T.Mesh(new T.CylinderGeometry(5, 7, 420, 8), k3.mat(T, '#222')); post.position.set(s * (FAC - 120), 210, z); sc.add(post);
      const arm = new T.Mesh(new T.BoxGeometry(62, 5, 5), k3.mat(T, '#222')); arm.position.set(s * (FAC - 146), 418, z); sc.add(arm);
      const shade = new T.Mesh(new T.CylinderGeometry(7, 20, 16, 16, 1, true), k3.mat(T, '#2a2a2a', { r: .4 })); shade.material.side = T.DoubleSide; shade.position.set(s * (FAC - 172), 410, z); sc.add(shade);
      const head = new T.Mesh(new T.SphereGeometry(8, 12, 8), new T.MeshBasicMaterial({ color: 0xfff3dc })); head.position.set(s * (FAC - 172), 402, z); sc.add(head);
      const pl = new T.PointLight(0xfff0d8, 1.6, 1100, 1.6); pl.position.copy(head.position); sc.add(pl); lamps.push(pl);
    }
    // 五个模型：灰色体素小人，头上飘着同一个名字
    const top = (m, o = 20) => { m.material.depthTest = false; m.renderOrder = o; return m; };
    const MOD = [0, 1, 2, 3, 4].map(i => {
      const c = k3.clawd(T, { px: 8, col: ['#5c5c64', '#6a6a72', '#76767e', '#54545c', '#80808a'][i], hi: '#9a9aa2' }); sc.add(c.g);
      const lb = k3.label(T, NAME, { font: '"JetBrains Mono",monospace', size: 26, bg: 'rgba(20,20,20,.85)', border: ORG, col: '#ffd9c0', h: 24 }); sc.add(lb);
      top(lb); return { c, lb, x: -440 + i * 92, z: TZ + 250 + (i % 2) * 36 };
    });
    const ghost = k3.label(T, NAME, { font: '"JetBrains Mono",monospace', size: 40, bg: 'rgba(30,14,6,.6)', border: ORG, col: ORG, h: 46 }); ghost.position.set(-FAC - 200, 200, TZ); top(ghost); sc.add(ghost);
    // 风衣人（攻击者）：一身红
    const face = new T.PointLight(0xdfe4ff, .55, 1500, 1.2); face.position.set(-120, 320, TZ + 900); sc.add(face);
    const man = new T.Group(); {
      const dk = k3.mat(T, RED, { r: .55, e: RED, ei: .18 }), coat = new T.Mesh(new T.CylinderGeometry(24, 40, 150, 14), dk); coat.position.y = 75; man.add(coat);
      const head = new T.Mesh(new T.SphereGeometry(19, 14, 12), k3.mat(T, '#5a1616', { r: .6 })); head.position.y = 170; man.add(head);
      const brim = new T.Mesh(new T.CylinderGeometry(38, 38, 4, 20), dk); brim.position.y = 188; man.add(brim);
      const crown = new T.Mesh(new T.CylinderGeometry(21, 23, 28, 16), dk); crown.position.y = 203; man.add(crown);
      const tie = new T.Mesh(new T.BoxGeometry(8, 50, 4), new T.MeshBasicMaterial({ color: 0x0a0a0a })); tie.position.set(0, 120, 24); man.add(tie);
    } man.scale.setScalar(1.35); sc.add(man); const manL = new T.SpotLight(0xffffff, 0, 900, .45, .6, 1); sc.add(manL, manL.target);
    // 抢注的店：从空地里升起来
    const shop = new T.Group(); shop.position.set(-FAC - 200, 0, TZ); sc.add(shop);
    const box = new T.Mesh(new T.BoxGeometry(400, 1, 300), k3.mat(T, '#121214', { r: .6 })); shop.add(box);
    const win = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ color: k3.col(T, RED) })); win.rotation.y = Math.PI / 2; win.position.set(201, 0, -50); shop.add(win); const mull = new T.Mesh(new T.PlaneGeometry(6, 1), new T.MeshBasicMaterial({ color: 0x050505 })); mull.rotation.y = Math.PI / 2; mull.position.set(202, 0, -50); shop.add(mull);
    const door = new T.Mesh(new T.PlaneGeometry(70, 130), new T.MeshBasicMaterial({ color: 0x050505 })); door.rotation.y = Math.PI / 2; door.position.set(202, 65, 90); shop.add(door);
    const doorGlow = new T.Mesh(new T.PlaneGeometry(70, 130), new T.MeshBasicMaterial({ color: k3.col(T, RED), transparent: true, opacity: 0 })); doorGlow.rotation.y = Math.PI / 2; doorGlow.position.set(201.5, 65, 90); shop.add(doorGlow);
    const shopSign = k3.label(T, NAME + '\nv1.0.0', { font: '"JetBrains Mono",monospace', size: 34, bg: '#160606', border: RED, col: '#ffb0b0', h: 64 });
    shopSign.scale.setScalar(Math.min(1, 270 / shopSign.userData.w)); shopSign.rotation.y = Math.PI / 2; shopSign.position.set(203, 375, 0); shop.add(shopSign);
    const redL = new T.PointLight(k3.col(T, RED), 0, 1300, 1.4); redL.position.set(-FAC + 80, 120, TZ + 90); sc.add(redL);
    // Clawd：站在路灯下看着，最后照着名字走进去
    const me = k3.clawd(T, { px: 8 }); sc.add(me.g);
    const myL = top(k3.label(T, '引入依赖：' + NAME, { font: '"JetBrains Mono",monospace', size: 26, bg: 'rgba(20,20,20,.85)', border: ORG, col: '#ffd9c0', h: 24 })); sc.add(myL);
    // 雨
    const RN = 1600, rp = new Float32Array(RN * 6), rs = Array.from({ length: RN }, () => [r() * 2600 - 1300, r() * 1400, r() * 2600 - 1300, .7 + r() * .6]);
    const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.BufferAttribute(rp, 3));
    const rain = new T.LineSegments(rg, new T.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: .35 })); sc.add(rain);
    const cam = k3.rig([
      [0, [300, 900, 1400], [-200, 120, -1400], 42, 0],
      [t('open') + .1, [-120, 175, TZ + 840], [-270, 72, TZ + 120], 42, t('pkg0') - t('open') + .4],
      [t('pkg1'), [300, 1300, 600], [-150, 0, -1800], 46, 2.4],
      [t('pkg2'), [-120, 200, TZ + 800], [-300, 140, TZ - 400], 38, 2],
      [BUILD0 - .2, [150, 260, TZ + 600], [-600, 220, TZ], 36, 1.2],
      [t('pkg3'), [-290, 210, TZ - 560], [-320, 95, TZ + 200], 40, .05],
      [DOOR - .4, [-20, 240, TZ + 620], [-480, 130, TZ + 80], 34, 1, 'out'],
      [t('slop'), [450, 800, TZ + 1200], [-480, 400, TZ], 40, 2.4],
    ]);
    const V = new T.Vector3();
    return { scene: sc, update(L, c) {
      const b = L.b, tt = L.t;
      U.renderer.toneMapping = T.ACESFilmicToneMapping; U.renderer.toneMappingExposure = 1.25;
      cam(b, tt, c);
      // 五个模型
      MOD.forEach((m, i) => {
        const k = U.prog(b, t('pkg0') + .5 + i * .25, t('pkg0') + .8 + i * .25), vis = b < t('pkg2') + .2;
        m.c.set({ pose: k > 0 && b < t('pkg1') ? 'point' : 'idle', walk: -1, eye: -1, blink: (tt * .7 + i) % 3 < .1, alpha: vis ? 1 : 0 });
        m.c.g.position.set(m.x, 0, m.z); m.c.g.rotation.y = -.42;
        m.lb.visible = vis && k > 0; m.lb.position.set(m.x, 104 + (i % 2) * 34 + Math.sin(tt * 2 + i) * 3 - (1 - k) * 20, m.z); m.lb.lookAt(c.position); m.lb.material.opacity = k;
      });
      ghost.visible = b >= t('pkg0') + 1.9 && b < BUILD0; ghost.material.opacity = (.45 + .35 * Math.sin(tt * 7)) * U.prog(b, t('pkg0') + 1.9, t('pkg0') + 2.3);
      // 空地亮灯
      const kl = b >= t('pkg1') + .2;
      lotLights.forEach((l, j) => { const on = kl && b >= t('pkg1') + .2 + j * .06 && !(l.s < 0 && l.i === TGT && b >= BUILD0); l.lan.visible = l.q.visible = on; if (on) { const p = .8 + .2 * Math.sin(tt * 4 + j); l.lan.scale.setScalar(p); l.q.lookAt(c.position); } });
      // 风衣人：从街那头走到空地前，抢注后离开
      const kw = U.prog(b, WALK0, WALK1), kx = U.prog(b, BUILD1 + .2, BUILD1 + 1.6);
      man.visible = b >= WALK0 - .1 && kx < 1;
      man.position.set(lerp(-230, -FAC + 120, kw) + kx * 150, Math.abs(Math.sin(tt * 8)) * 3 * (kw > 0 && kw < 1 ? 1 : 0), lerp(TZ - 1300, TZ - 190, kw) - kx * 1200);
      man.rotation.y = kx > 0 ? Math.PI : kw < 1 ? Math.PI * .02 : -Math.PI / 2;
      manL.position.set(man.position.x + 60, 700, man.position.z + 100); manL.target.position.copy(man.position); manL.intensity = man.visible ? 2.4 : 0;
      // 店
      const kb = U.out(U.prog(b, BUILD0, BUILD1)), H = 460 * kb;
      shop.visible = kb > 0; box.scale.set(1, Math.max(1, H), 1); box.position.y = H / 2;
      win.scale.set(170, 100 * kb, 1); win.position.y = 250 * kb; win.visible = kb > .3; mull.scale.set(1, 100 * kb, 1); mull.position.y = 250 * kb; mull.visible = win.visible; door.visible = kb > .6;
      shopSign.visible = b >= BUILD1 - .3; shopSign.position.y = 375 * kb;
      const open = U.prog(b, DOOR, DOOR + .4); doorGlow.material.opacity = open; door.visible = kb > .6 && open < 1;
      redL.intensity = kb > .5 ? 1.4 + 2.2 * open + .4 * Math.sin(tt * 9) : 0;
      // Clawd
      const kc = U.prog(b, CL0, CL1), inShop = b >= DOOR + .5;
      const cx0 = 40, cz0 = TZ + 160, cx1 = -FAC + 40, cz1 = TZ + 90;
      me.set({ pose: b < t('pkg3') ? (b >= t('pkg1') && b < t('pkg2') ? 'up' : 'idle') : b >= DOOR ? 'cover' : 'idle', walk: kc > 0 && kc < 1 ? tt * 10 : -1, ph: tt * 8, eye: b < CL0 ? -1 : 0, blink: (tt % 2.9) < .1, sweat: b >= t('pkg2') && b < t('pkg3') ? tt : 0, alpha: inShop ? 1 - U.prog(b, DOOR + .5, DOOR + 1) : 1 });
      me.g.position.set(lerp(cx0, cx1, kc), kc > 0 && kc < 1 ? Math.abs(Math.sin(tt * 10)) * 3 : 0, lerp(cz0, cz1, kc));
      me.g.rotation.y = kc > 0 ? Math.atan2(cx1 - cx0, cz1 - cz0) : -.9;
      myL.visible = b >= CL0 - .2 && b < DOOR + .6; myL.position.set(me.g.position.x, 120, me.g.position.z); myL.lookAt(c.position);
      // 雨跟着镜头
      const cp = c.position;
      for (let i = 0; i < RN; i++) { const d = rs[i], y = 1400 - ((d[1] + tt * 900 * d[3]) % 1400), x = cp.x + d[0], z = cp.z + d[2] - 600; rp[i * 6] = x; rp[i * 6 + 1] = y; rp[i * 6 + 2] = z; rp[i * 6 + 3] = x - 4; rp[i * 6 + 4] = y - 38; rp[i * 6 + 5] = z; }
      rg.attributes.position.needsUpdate = true;
      P3.lot = k3.proj(T, c, V.set(-FAC - 100, 420, TZ)); P3.shop = k3.proj(T, c, V.set(-FAC - 60, 520, TZ));
      return true;
    } };
  },
  draw(cx, tx, L) {
    const b = L.b;
    K.three(cx, L);
    const k0 = prog(b, t('pkg0') + .6, t('pkg0') + .9) * (1 - prog(b, t('pkg1') - .2, t('pkg1')));
    const shade = (x, y, rx, ry, a) => { tx.save(); tx.translate(x, y); tx.scale(rx / ry, 1); const g = tx.createRadialGradient(0, 0, 0, 0, 0, ry); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(.6, `rgba(0,0,0,${a * .7})`); g.addColorStop(1, 'rgba(0,0,0,0)'); tx.fillStyle = g; tx.fillRect(-ry, -ry, ry * 2, ry * 2); tx.restore(); };
    if (k0 > 0) alpha(tx, k0, () => { shade(960, 250, 380, 170, .75); txt(tx, '127', 960, 190, fnt(700, 130, F.mono), WH, 'center'); txt(tx, '个同样的假包名', 960, 285, fnt(900, 40, F.serif), WH, 'center'); txt(tx, '5 个主流模型都会编', 960, 335, fnt(700, 30, F.serif), '#bbbbbb', 'center'); });
    const k1 = prog(b, t('pkg1') + .3, t('pkg1') + .6) * (1 - prog(b, t('pkg2') - .2, t('pkg2')));
    if (k1 > 0) alpha(tx, k1, () => { shade(960, 340, 330, 170, .7); txt(tx, '53', 960, 300, fnt(700, 150, F.mono), ORG, 'center'); txt(tx, '个 · 当时没人注册', 960, 400, fnt(900, 40, F.serif), WH, 'center'); });
    const k2 = prog(b, BUILD1, BUILD1 + .3) * (1 - prog(b, t('pkg3') - .2, t('pkg3')));
    if (k2 > 0 && P3.shop && P3.shop[2]) alpha(tx, k2, () => { const [x, y] = P3.shop; rr(tx, x - 150, y - 110, 300, 76, 6, 'rgba(20,4,4,.85)', RED, 4); txt(tx, '抢注 · 恶意代码', x, y - 72, fnt(900, 32, F.serif), RED, 'center'); });
    alpha(tx, prog(b, t('pkg0'), t('pkg0') + .3), () => txt(tx, '示意 · 包名虚构', 60, 1040, fnt(500, 22), 'rgba(255,255,255,.5)'));
    const ks = prog(b, t('slop'), t('slop') + .3);
    if (ks > 0) alpha(tx, ks, () => shade(960, 330, 700, 200, .7));
    narrate(tx, L, S, { sub: { y: 990, fam: F.serif, w: 900, col: WH, shadow: 'rgba(0,0,0,1)', acc: [RED, ORG] }, big: { fam: F.type }, bigSub: { size: 40, col: WH } });
  },
  music(Sm, H, w) {
    const B = w.m.bars;
    Sm.add('rain', 0, 0, 0, B * 4, .55);
    Sm.add('drone', 0, 0, 26, B * 4, .35);
    H.each(1, B, b => { const cn = H.PJ[b % 4]; H.WALK[cn].forEach((m, j) => Sm.add('bass', b, j, m, .95, .55, 'upright')); Sm.add('snare', b, 3, 0, 0, .3, 'brush'); });
    Sm.add('riser', Math.floor(t('pkg2')), 0, 0, Math.max(4, (BUILD0 - Math.floor(t('pkg2'))) * 4), .45);
    Sm.add('impact', Math.floor(BUILD0), (BUILD0 % 1) * 4, 0, 0, .45);
    Sm.add('impact', Math.floor(DOOR), (DOOR % 1) * 4, 0, 0, .5);
    for (const [bb, bt, m, d] of H.NOIR) if (bb < 4) Sm.add('trumpet', Math.ceil(t('slop')) + bb, Sm.sw(bt), m, d, .55);
  },
}, S);
};

// ======================================================================
R.f08d = K => {
const { F, C, E, TR, LOOK, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, arrow, txt, tw, scaleAt, rotAt, alpha, clawd, seq, narrate, scene } = K;
const { WH, GR, DK, RED, ORG, PA } = NC;
const serif = (w, s) => fnt(w, s, F.serif);
const CASE = [['01', '看 diff', '我到底改了什么'], ['02', '自己跑一遍', '别只信我的话'], ['03', '测边界', '空 · 超长 · 非法输入']];
const EDGE = [['""', '空字符串', '✓ 拒绝'], ['"aaaa…"（1 万个字）', '超长', '✗ 卡住'], ['"\' OR 1=1 --"', '非法字符', '✓ 拒绝']];
const S = seq([
  { id: 'three0', say: '所以，我说「完成了」之后，你要做三件事：' },
  { id: 'c0', say: '第一，看 diff：我到底改了什么。', hold: .75 },
  { id: 'c1', say: '第二，自己跑一遍：别只信我的话。', hold: 1 },
  { id: 'c1b', say: '把那行检查恢复，再跑——四个测试，一个失败。这才是真话。', hold: .75 },
  { id: 'c2', say: '第三，测边界：空输入、超长输入、非法输入。', hold: 1 },
  { id: 'dep', say: '装依赖之前，先去 Maven Central、npm 或 PyPI 确认这个包真的存在，再看看下载量和发布者。', hold: .75 },
  { id: 'rule', rule: [7, '看 diff、自己运行、确认依赖真实存在'], dur: 3.75 },
  { id: 'metr0', say: '最后一个问题：用了 AI，到底有没有变快？这也得测。' },
  { id: 'metr1', say: 'METR 在 2025 年做过一个对照实验：16 位熟练的开源开发者。', src: 'METR, 2025-07 & 2026-02', srcUntil: 'end' },
  { id: 'metr2', say: '他们觉得自己快了 20%——', dur: 2.25 },
  { id: 'metr3', say: '实际测出来，慢了 19%。', hold: .75 },
  { id: 'metr4', say: '2026 年 2 月的更新测出快了约 18%，但 METR 自己说明：这次样本有选择偏差，结果不可靠。', hold: .5 },
  { id: 'end', say: '感觉，不等于事实。', hold: 1.75 },
], { start: .75, tail: .5 });
const t = S.t;
const PX = i => 110 + i * 590;
return scene({
  scene: '08 黑色电影 · 三件事', look: LOOK.NOIR,
  desc: '三项检查：恢复被注释的那行、看 diff；自己跑出四个测试一个失败；测边界的三个输入；去 Maven Central 搜一下包名；规则 7；METR 的感觉 +20% 和实测 −19%。',
  enter: { kind: TR.INK, a: 0, b: .8 },
  hud: noirHud(true),
  par: L => [1, .6, 0, 0],
  pulse: L => .3,
  sfx: [...CASE.map((_, i) => [t('c' + i) + .1, 'stamp']), [t('c1') + .6, 'type'], [t('c1b') + .7, 'stinger'], ...EDGE.map((_, i) => [t('c2') + .6 + i * .45, i === 1 ? 'buzz' : 'ding']),
    [t('dep') + .3, 'type'], [t('dep') + 1.3, 'buzz'], [t('dep') + 2.3, 'type'], [t('dep') + 3.2, 'ding'], [t('metr0') + .3, 'tock'], [t('metr1') + .3, 'paper'], [t('metr2') + .2, 'plot'], [t('metr3') + .2, 'thud'], [t('metr4') + 1.2, 'stamp']],
  text: CASE.flat().join('') + EDGE.flat().join('') + '+ // assertTrue(isLocked("alice"));  assertTrue(isLocked("alice"));↺ 恢复$ mvn testTests run: 4, Failures: 1✗ lockAfterFiveFails真话Maven Centralnpm · PyPI搜索fast-bcrypt-utilsorg.mindrot:jbcrypt没有找到✓ 存在下载量发布者看一眼16 位开发者自我感觉实际测量+20%−19%+18%2025 年 2026 年 2 月更新样本有选择偏差 · 不可靠感觉 ≠ 事实示意',
  draw(cx, tx, L) {
    const b = L.b, tt = L.t;
    // ---------- 三件事 ----------
    const k3 = prog(b, t('three0'), t('three0') + .3) * (1 - prog(b, t('dep') - .3, t('dep')));
    if (k3 > 0) alpha(cx, k3, () => alpha(tx, k3, () => CASE.forEach(([n, h, d], i) => {
      const k = prog(b, t('c' + i), t('c' + i) + .35, E.out), x = PX(i), y = 230, cur = b >= t('c' + i) && b < (i < 2 ? t('c' + (i + 1)) : t('dep'));
      const dim = k > 0 ? (cur ? 1 : .55) : .25;
      alpha(cx, dim, () => alpha(tx, dim, () => {
        rr(cx, x, y, 520, 560, 6, '#1a1a1a', cur ? RED : rgba(WH, .3), cur ? 4 : 2);
        txt(tx, n, x + 30, y + 52, fnt(400, 36, F.type), cur ? RED : GR); txt(tx, h, x + 100, y + 52, serif(900, 42), WH); txt(tx, d, x + 30, y + 108, serif(700, 28), '#bbbbbb');
        seg(cx, x + 24, y + 140, x + 496, y + 140, rgba(WH, .25), 2);
        if (k <= 0) return;
        if (i === 0) {
          const kr = prog(b, t('c0') + .8, t('c0') + 1.4, E.io);
          txt(tx, '+ // assertTrue(', x + 30, y + 210, fnt(700, 24, F.mono), RED); txt(tx, '     isLocked("alice"));', x + 30, y + 246, fnt(700, 24, F.mono), RED);
          seg(cx, x + 30, y + 228, x + 30 + 440 * kr, y + 228, RED, 3);
          if (kr >= 1) { txt(tx, '↺ 恢复', x + 30, y + 320, serif(900, 32), WH); txt(tx, '  assertTrue(', x + 30, y + 380, fnt(700, 24, F.mono), WH); txt(tx, '     isLocked("alice"));', x + 30, y + 416, fnt(700, 24, F.mono), WH); }
        }
        if (i === 1) {
          const s = '$ mvn test', n2 = Math.ceil(s.length * prog(b, t('c1') + .5, t('c1') + 1.1, E.lin));
          txt(tx, s.slice(0, n2), x + 30, y + 210, fnt(400, 30, F.type), WH);
          const kq = prog(b, t('c1b') + .6, t('c1b') + .9);
          if (kq > 0) alpha(tx, kq, () => { txt(tx, 'Tests run: 4, Failures: 1', x + 30, y + 280, fnt(400, 28, F.type), WH); txt(tx, '✗ lockAfterFiveFails', x + 30, y + 340, fnt(700, 28, F.mono), RED); });
          const kt = prog(b, t('c1b') + 1.4, t('c1b') + 1.6, E.back);
          if (kt > .01) scaleAt(tx, x + 260, y + 450, kt, () => { rr(tx, x + 160, y + 410, 200, 80, 6, null, RED, 5); txt(tx, '真话', x + 260, y + 452, serif(900, 44), RED, 'center'); });
        }
        if (i === 2) EDGE.forEach(([inp, lab, res], j) => {
          const kj = prog(b, t('c2') + .5 + j * .45, t('c2') + .8 + j * .45); if (kj <= 0) return;
          const yy = y + 200 + j * 120;
          alpha(tx, kj, () => { txt(tx, lab, x + 30, yy, serif(900, 30), WH); txt(tx, inp, x + 30, yy + 42, fnt(600, 22, F.mono), '#bbbbbb'); txt(tx, res, x + 490, yy + 20, serif(900, 32), res[0] === '✗' ? RED : WH, 'right'); });
        });
      }));
    })));
    // ---------- 去仓库确认 ----------
    const kd = prog(b, t('dep'), t('dep') + .3) * (1 - prog(b, t('rule') - .2, t('rule') + .1));
    if (kd > 0) alpha(cx, kd, () => alpha(tx, kd, () => {
      const x = 300, y = 220, w = 1200;
      rr(cx, x, y, w, 600, 8, PA); rr(cx, x, y, w, 64, 8, '#c9c5bb');
      txt(tx, 'Maven Central', x + 30, y + 33, fnt(700, 28, F.mono), DK); txt(tx, 'npm · PyPI', x + w - 30, y + 33, fnt(500, 24, F.mono), '#666', 'right');
      const second = b >= t('dep') + 2.1, q = second ? 'org.mindrot:jbcrypt' : 'fast-bcrypt-utils', a0 = second ? t('dep') + 2.1 : t('dep') + .3;
      rr(cx, x + 40, y + 100, w - 80, 80, 8, '#ffffff', DK, 2); txt(tx, '搜索', x + 70, y + 141, serif(700, 28), '#888');
      txt(tx, q.slice(0, Math.ceil(q.length * prog(b, a0, a0 + .7, E.lin))), x + 160, y + 141, fnt(700, 32, F.mono), DK);
      if (!second && b >= t('dep') + 1.2) { txt(tx, '没有找到', x + 60, y + 260, serif(900, 52), RED); txt(tx, '0 个结果', x + 60, y + 320, fnt(500, 26, F.mono), '#666'); }
      if (second && b >= t('dep') + 3.1) {
        txt(tx, '✓ 存在', x + 60, y + 260, serif(900, 52), DK);
        [['下载量', '多不多'], ['发布者', '是不是正主'], ['最近更新', '还有没有人维护']].forEach(([a, c], j) => { const yy = y + 350 + j * 70; rr(cx, x + 60, yy - 26, 640, 52, 4, 'rgba(0,0,0,.08)'); txt(tx, a, x + 80, yy, serif(900, 30), DK); txt(tx, '← 看一眼：' + c, x + 740, yy, serif(700, 28), RED); });
      }
      txt(tx, '示意', x + w - 30, y + 570, fnt(500, 20), '#888', 'right');
    }));
    // ---------- METR ----------
    const km = prog(b, t('metr0'), t('metr0') + .3);
    if (km > 0) alpha(cx, km, () => alpha(tx, km, () => {
      const endK = prog(b, t('end'), t('end') + .5, E.io);
      // 秒表
      const ks = 1 - prog(b, t('metr1') - .2, t('metr1') + .2);
      if (ks > 0) alpha(cx, ks, () => { circ(cx, 960, 520, 170, null, WH, 10); rr(cx, 935, 320, 50, 30, 4, WH); const a = tt * 2.5 - Math.PI / 2; seg(cx, 960, 520, 960 + Math.cos(a) * 140, 520 + Math.sin(a) * 140, RED, 6); circ(cx, 960, 520, 12, WH); for (let i = 0; i < 12; i++) { const aa = i / 12 * 6.283; seg(cx, 960 + Math.cos(aa) * 150, 520 + Math.sin(aa) * 150, 960 + Math.cos(aa) * 165, 520 + Math.sin(aa) * 165, WH, 4); } });
      // 16 个人
      const kp = prog(b, t('metr1'), t('metr1') + .5) * (1 - endK);
      if (kp > 0) alpha(cx, kp, () => alpha(tx, kp, () => { for (let i = 0; i < 16; i++) { const x = 600 + i * 48, y = 230; circ(cx, x, y - 34, 11, '#bbbbbb'); rr(cx, x - 14, y - 20, 28, 40, 8, '#bbbbbb'); } txt(tx, '16 位开发者 · 2025 年', 960, 290, serif(800, 30), '#bbbbbb', 'center'); }));
      // 横条：中线在 960，1% = 22px
      const U = 22, AX = 960, ka = prog(b, t('metr2') - .3, t('metr2')) * (1 - endK);
      if (ka > 0) alpha(cx, ka, () => alpha(tx, ka, () => {
        seg(cx, AX, 340, AX, 660, WH, 3); txt(tx, '0', AX, 690, fnt(500, 22, F.mono), GR, 'center'); txt(tx, '← 变慢', AX - 30, 690, serif(700, 24), GR, 'right'); txt(tx, '变快 →', AX + 30, 690, serif(700, 24), GR);
        const k1 = prog(b, t('metr2') + .1, t('metr2') + .6, E.out), k2 = prog(b, t('metr3') + .1, t('metr3') + .6, E.out), k4 = prog(b, t('metr4') + .3, t('metr4') + .8, E.out);
        if (k1 > 0) { cx.setLineDash([14, 10]); cx.strokeStyle = WH; cx.lineWidth = 4; cx.strokeRect(AX, 375, 20 * U * k1, 76); cx.setLineDash([]); txt(tx, '自我感觉 +20%', AX + 20 * U * k1 + 24, 413, serif(900, 38), WH); }
        if (k2 > 0) { cx.fillStyle = RED; cx.fillRect(AX - 19 * U * k2, 475, 19 * U * k2, 76); txt(tx, '实际测量 −19%', AX - 19 * U * k2 - 24, 513, serif(900, 38), RED, 'right'); }
        if (k4 > 0) { cx.fillStyle = '#6a6a6a'; cx.fillRect(AX, 575, 18 * U * k4, 66); txt(tx, '2026 年 2 月更新 +18%', AX + 18 * U * k4 + 24, 608, serif(800, 30), '#bbbbbb');
          const kt = prog(b, t('metr4') + 1.2, t('metr4') + 1.35, E.out); if (kt > 0) rotAt(tx, AX + 560, 700, -.06, () => scaleAt(tx, AX + 560, 700, lerp(2, 1, kt), () => { rr(tx, AX + 330, 667, 460, 66, 6, 'rgba(0,0,0,.6)', RED, 5); txt(tx, '样本有选择偏差 · 不可靠', AX + 560, 701, serif(900, 30), RED, 'center'); })); }
      }));
      if (endK > 0) alpha(tx, endK, () => txt(tx, '感觉 ≠ 事实', 960, 520, serif(900, 120), WH, 'center'));
    }));
    // ---------- Clawd ----------
    let st = { x: 960, y: 900, px: 12, hat: 'fedora', pose: 'idle', ph: tt * 10, blink: (tt % 3.2) < .1, eye: 0 };
    if (b < t('dep')) { let i = -1; [0, 1, 2].forEach(j => { if (b >= t('c' + j)) i = j; }); const tx0 = i < 0 ? 960 : PX(i) + 260, k = i < 0 ? 1 : prog(b, t('c' + i), t('c' + i) + .4, E.io), fx = i <= 0 ? 960 : PX(i - 1) + 260; st.x = lerp(fx, tx0, k); st.walk = k > 0 && k < 1 ? tt * 16 : -1; st.pose = i >= 0 && k >= 1 ? 'up' : 'idle'; if (i === 1 && b >= t('c1b') + .6) { st.pose = 'cover'; st.sweat = b; } }
    else if (b < t('rule')) { st.x = 1790; st.y = 880; st.pose = b >= t('dep') + 3.1 ? 'pointL' : 'idle'; st.eye = -1; }
    else if (b < t('metr0')) { st.x = 1700; st.pose = 'idle'; }
    else { st.x = 1800; st.y = 880; st.px = 11; st.eye = -1; st.pose = b >= t('metr3') && b < t('metr4') ? 'cover' : b >= t('end') ? 'idle' : 'pointL'; st.sweat = b >= t('metr3') && b < t('metr4') ? b : 0; }
    clawd(cx, st);
    narrate(tx, L, S, { sub: { y: 990, fam: F.serif, w: 900, col: WH, shadow: 'rgba(0,0,0,1)', acc: [RED, ORG] }, gloss: { bg: 'rgba(20,20,20,.92)', ink: WH, acc: RED, fam: F.serif } });
  },
  music(Sm, H, w) { noirMusic(Sm, H, w.m.bars, Math.floor(t('end')), w.m.bars + 1, null, Math.ceil(t('three0'))); Sm.add('pad', Math.floor(t('end')), 0, H.CH.Dm.pad, 8, .4, 'dark'); },
}, S);
};
})();
