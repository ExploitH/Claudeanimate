// 07 工作流程 · 存档：8-bit 游戏。抱着五个文件跑、冒烟；关卡地图六个节点在「你看计划」停下等盖章；存档点、被 bug 打中后读档；开分支；GAME OVER 后的 CONTINUE 三选一
(window.MV_W = window.MV_W || {}).w07 = K => {
const { F, C, E, TR, prog, lerp, bump, hash, rgba, mixC, fnt, rr, circ, seg, txt, tw, scaleAt, rotAt, alpha, lyric, clawd } = K;
// PICO-8 调色板
const P = { blk: '#000000', navy: '#1d2b53', plum: '#7e2553', dg: '#008751', brn: '#ab5236', dgy: '#5f574f', lgy: '#c2c3c7', wht: '#fff1e8', red: '#ff004d', org: '#ffa300', yel: '#ffec27', grn: '#00e436', blu: '#29adff', lav: '#83769c', pnk: '#ff77a8', pch: '#ffccaa' };
const GY = 870, NODES = [['读代码', 260], ['出计划', 540], ['你看计划', 820], ['改代码', 1100], ['验证', 1380], ['提交', 1660]];
const HOPS = [3.25, 3.5, 3.75, 5, 5.25, 5.5];
const SAVES = [[6, 330], [6.5, 600], [7, 870]];
const MENU = ['回退到上一个提交', '补充信息，新开对话', '你自己写'];
const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x / 6) * 6, Math.round(y / 6) * 6, Math.round(w / 6) * 6, Math.round(h / 6) * 6); };
function ground(ctx, x0, x1, y) { for (let x = x0; x < x1; x += 48) { px(ctx, x, y, 48, 24, P.grn); px(ctx, x, y + 24, 48, 200, P.brn); px(ctx, x + 6, y + 36, 12, 12, P.pch); px(ctx, x + 30, y + 72, 12, 12, P.pch); } }
function file(ctx, x, y, c = P.wht) { px(ctx, x - 24, y - 30, 48, 60, c); px(ctx, x - 24, y - 30, 48, 12, P.blu); px(ctx, x - 12, y - 6, 24, 6, P.dgy); px(ctx, x - 12, y + 6, 24, 6, P.dgy); }
function crystal(ctx, x, y, t, c = P.blu) { const bob = Math.sin(t * 4) * 6; px(ctx, x - 6, y - 48 + bob, 12, 12, P.wht); px(ctx, x - 18, y - 36 + bob, 36, 36, c); px(ctx, x - 6, y + bob, 12, 12, c); px(ctx, x - 12, y - 30 + bob, 6, 18, P.wht); }
function bug(ctx, x, y, t) { const l = Math.floor(t * 8) % 2; px(ctx, x - 24, y - 36, 48, 36, P.red); px(ctx, x - 12, y - 30, 6, 6, P.yel); px(ctx, x + 6, y - 30, 6, 6, P.yel); px(ctx, x - 30, y - 6 + l * 6, 6, 12, P.red); px(ctx, x + 24, y - 6 + (1 - l) * 6, 6, 12, P.red); px(ctx, x - 12, y - 48, 6, 12, P.red); px(ctx, x + 6, y - 48, 6, 12, P.red); }
function heart(ctx, x, y, on) { const c = on ? P.red : P.dgy; px(ctx, x, y, 12, 12, c); px(ctx, x + 18, y, 12, 12, c); px(ctx, x - 6, y + 6, 42, 12, c); px(ctx, x, y + 18, 30, 6, c); px(ctx, x + 6, y + 24, 18, 6, c); }
return {
  scene: '07 存档 · 工作流程', bars: 20, look: 7,
  enter: { kind: TR.PIXEL, a: 2, b: 2, col: '#ffec27' },
  hud: { num: '07', name: '工作流程', time: '23:40', line: '一口气改完', ink: P.wht, acc: P.yel },
  you: [[.95, 2.0, '一口气全改完吧，快点']],
  rule: { n: 6, at: 18.5, text: '先出计划，小步提交' },
  src: [[8.25, 9, 'Anthropic, Prompting best practices']],
  par: L => { const b = L.b, go = b >= 14 && b < 16.5; return [go ? 9 : 6, b < 13 ? 1 : 0, 2.5, 0]; },
  cam: L => [1, 0, (L.b >= 7.5 && L.b < 7.75 ? (hash(Math.floor(L.t * 30)) - .5) * .01 : 0), 0],
  focus: L => [.5, .5, .2, .8 * prog(L.b, 14, 14.1) * (1 - prog(L.b, 16.2, 16.3))],
  pulse: L => L.b >= 13 && L.b < 16 ? 0 : .7,
  sfx: [[1, 'jump'], [1.5, 'glitch'], [1.75, 'q', 600], [2.5, 'blip', 700], ...HOPS.map(b => [b, 'jump']), [4.75, 'stamp'], [5.5, 'powerup'], ...SAVES.map(s => [s[0], 'save']), [7.5, 'hurt'], [8, 'rewind'],
    [9, 'jump'], [10, 'coin'], [11.25, 'buzz'],
    // 心逐一灭：13.0 / 13.5 / 14.0，各一个 hurt
    [13, 'hurt'], [13.5, 'hurt'], [14, 'hurt'],
    [14, 'gameover'],
    [14.75, 'menu'], [15.25, 'menu'], [15.75, 'menu'], [16.25, 'coin']],
  text: NODES.map(n => n[0]).join('') + MENU.join('') + '我一口气改了五个文件——坏了一处。是哪一处？改得越多，出错时要翻的范围越大把每次出错的范围，控制在一步之内换个打法，一关一关过：这一关是你的：看计划、改计划。我在这儿等你盖章每过一关、验证通过，就 commit 一次也能让我冒险的尝试，开个分支去试把测试当终点线：自己跑测试、但得防着我耍小聪明（下一章）你自己写不出来的代码作业能不能用 AI、用到什么程度——一口气改了五个文件坏了一处，是哪一处？一次改得越多，出错时要翻的范围越大把出错的范围，控制在一步之内推荐的顺序在这一步停下，等你盖章OK多数工具都有计划模式验证通过，就 commit 一次Git 提交 = 存档点SAVE LOAD commit改坏了？直接读档git 记录和检查点，能帮模型在多次会话之间接着干有风险的尝试，开个分支try/jwt先有测试，再改到测试通过我能自己跑测试，自己发现问题但要防着我耍小聪明 → 08 TESTS ✓同一个问题失败三次GAME OVER CONTINUE?还在学基础语法？先别用我自己写不出来的代码，你也看不出我错在哪课程作业能不能用 AI，听老师的',
  draw(cx, tx, L) {
    const b = L.b, t = L.t, step = Math.floor(t * 8) / 8;
    // ---------- 开场跑酷 ----------
    if (b < 3) {
      ground(cx, 0, 1920, GY);
      const ks = prog(b, 2.25, 2.6, E.io), sx = lerp(940, 1100, prog(b, 1, 1.5, E.lin));
      for (let i = 0; i < 5; i++) {
        const fx = b < 2.2 ? sx + (i - 2) * 56 : lerp(sx + (i - 2) * 56, 400 + i * 240, ks), fy = b < 2.2 ? GY - 190 - (i % 2) * 20 : lerp(GY - 190, 520, ks);
        file(cx, fx, fy, i === 3 && b >= 1.5 ? P.lgy : P.wht);
        if (i === 3 && b >= 1.5) for (let j = 0; j < 4; j++) { const k = ((t * 1.5 + j * .25) % 1); px(cx, fx - 12 + Math.sin(k * 9 + j) * 18, fy - 40 - k * 120, 18 + k * 12, 18 + k * 12, k > .6 ? P.lgy : P.dgy); }
      }
      if (b >= 2.5) { const k = prog(b, 2.5, 2.9, E.io), x0 = lerp(340, 940, k), x1 = lerp(1400, 1060, k); cx.setLineDash([18, 12]); cx.strokeStyle = P.red; cx.lineWidth = 6; cx.strokeRect(x0, 440, x1 - x0, 160); cx.setLineDash([]); }
    }
    // ---------- 关卡地图 ----------
    if (b >= 2.95 && b < 6) {
      ground(cx, 0, 1920, GY);
      for (let i = 0; i < NODES.length - 1; i++) for (let x = NODES[i][1] + 40; x < NODES[i + 1][1] - 30; x += 36) px(cx, x, 600, 18, 12, P.yel);
      NODES.forEach(([n, x], i) => {
        const human = i === 2, done = b >= HOPS[i];
        px(cx, x - 36, 570, 72, 72, human ? P.blu : done ? P.grn : P.dgy); px(cx, x - 24, 582, 48, 48, human ? P.wht : P.navy);
        if (human) { px(cx, x + 30, 470, 6, 100, P.wht); px(cx, x + 36, 470, 48, 36, P.blu); }
      });
      const ok = prog(b, 4.75, 4.85, E.out);
      if (ok > 0) scaleAt(cx, 820, 500, lerp(2.2, 1, ok), () => { px(cx, 760, 470, 120, 60, P.red); px(cx, 772, 482, 96, 36, P.wht); txt(cx, 'OK', 820, 502, fnt(400, 30, F.pixel), P.red, 'center'); });
      if (b >= 5.5) for (let j = 0; j < 8; j++) { const a = j / 8 * 6.283 + t * 2, r = 60 + ((t * 2) % 1) * 60; px(cx, 1660 + Math.cos(a) * r, 600 + Math.sin(a) * r, 12, 12, P.yel); }
    }
    // ---------- 存档点时间线 ----------
    if (b >= 5.95 && b < 10) {
      ground(cx, 0, 1920, GY);
      const back = prog(b, 8, 8.35, E.io), redA = prog(b, 7.5, 7.6) * (1 - prog(b, 8.1, 8.5));
      if (redA > 0) alpha(cx, redA, () => px(cx, 870, GY - 6, 420, 18, P.red));
      SAVES.forEach(([at, x]) => { if (b >= at) { crystal(cx, x, GY - 70, t); txt(tx, 'commit', x, GY - 150, fnt(400, 20, F.pixel), P.yel, 'center'); } });
      if (b >= 7.2 && b < 8.1) bug(cx, lerp(1500, 1180, prog(b, 7.2, 7.5)), GY, t);
      // 分支
      const kbr = prog(b, 9, 9.3, E.out);
      if (kbr > 0) { for (let i = 0; i < 12 * kbr; i++) px(cx, 900 + i * 22, GY - 40 - i * 34, 18, 12, P.yel); px(cx, 1150, 420, 300 * kbr, 24, P.grn); alpha(tx, kbr, () => txt(tx, 'try/jwt', 1300, 480, fnt(400, 26, F.pixel), P.grn, 'center')); }
      if (b >= 8 && b < 8.5) alpha(tx, 1 - prog(b, 8.3, 8.5), () => txt(tx, 'LOAD', 870, 600, fnt(400, 56, F.pixel), P.yel, 'center'));
    }
    // ---------- 测试终点 ----------
    if (b >= 9.95 && b < 12) {
      ground(cx, 0, 1920, GY);
      px(cx, 1500, 520, 12, 350, P.wht); const wave = Math.floor(t * 6) % 2 * 6;
      px(cx, 1512, 520 + wave, 150, 90, P.grn); txt(tx, 'TESTS ✓', 1587, 565 + wave, fnt(400, 22, F.pixel), P.wht, 'center');
      if (b >= 11.25) { const f = Math.floor(t * 8) % 2; px(cx, 1060, 600, 180, 150, f ? P.yel : P.org); txt(tx, '//', 1150, 676, fnt(400, 56, F.pixel), P.blk, 'center'); }
    }
    // ---------- GAME OVER（扩展：心逐一灭 + 静止 1 拍 + CONTINUE 菜单慢速逐项亮出）----------
    if (b >= 11.95 && b < 16.5) {
      // 三颗心：每隔半拍逐一灭掉，各自有碎裂粒子
      for (let i = 0; i < 3; i++) {
        const dieAt = 13 + i * .5; // 13.0 / 13.5 / 14.0
        const alive = b < dieAt;
        const dying = !alive && b < dieAt + .3;
        const kd = dying ? prog(b, dieAt, dieAt + .3, E.out) : 0;
        if (alive || dying) heart(cx, 1440 + i * 70, 150, alive);
        // 碎裂粒子（心灭时向外弹射，3D 感：粒子从中心向外爆散）
        if (dying) for (let j = 0; j < 8; j++) {
          const a = j / 8 * 6.283, r = kd * 60;
          alpha(cx, 1 - kd, () => px(cx, 1440 + i * 70 + Math.cos(a) * r, 150 + Math.sin(a) * r, 6, 6, P.red));
        }
      }
      // 静止1拍：b=14~14.5 只显示 GAME OVER，不出 CONTINUE
      const go = prog(b, 14, 14.1);
      if (go > 0) alpha(tx, 1 - prog(b, 16.35, 16.5), () => {
        // GAME OVER 文字从深处飞向镜头：用 scaleAt 模拟
        const zScale = lerp(2.4, 1, prog(b, 14, 14.25, E.out));
        scaleAt(tx, 960, 300, zScale, () => {
          alpha(tx, Math.min(1, go * 4), () => txt(tx, 'GAME OVER', 960, 300, fnt(400, 84, F.pixel), P.red, 'center'));
        });
        // CONTINUE 菜单从 b=14.5 开始逐项亮出，每项间隔 0.5 拍
        if (b >= 14.5) {
          txt(tx, 'CONTINUE?', 960, 430, fnt(400, 40, F.pixel), P.wht, 'center');
          const sel = b < 14.75 ? -1 : Math.min(2, Math.floor((b - 14.75) * 2)); // 每 0.5 拍亮一项
          MENU.forEach((s, i) => {
            const menuK = prog(b, 14.75 + i * .5, 14.85 + i * .5, E.back);
            if (menuK <= 0) return;
            const y = 540 + i * 90, on = i === sel;
            alpha(tx, menuK, () => {
              if (on) txt(tx, '▶', 640, y, fnt(400, 40, F.pixel), P.yel, 'center');
              txt(tx, s, 700, y, fnt(900, 48), on ? P.yel : P.wht);
            });
          });
        }
      });
    }
    // ---------- 收尾：Clawd 在地上 ----------
    if (b >= 16.3) ground(cx, 0, 1920, GY);
    // ---------- Clawd ----------
    let st = { x: 940, y: GY, px: 18, col: P.org, hi: P.pch, eyeC: P.blk, hat: 'cap8', hatC: P.red, pose: 'idle', ph: step * 10, blink: (t % 3) < .1, eye: 1 };
    if (b < 1) st.alpha = prog(b, .5, .9);
    if (b >= 1 && b < 1.5) { st.x = lerp(940, 1100, prog(b, 1, 1.5, E.lin)); st.walk = step * 20; st.pose = 'up'; }
    if (b >= 1.5 && b < 2.25) { st.x = 1100; st.pose = 'up'; st.eye = Math.floor(t * 6) % 2 ? 1 : -1; st.q = b >= 1.75 ? 1 : 0; st.sweat = b - 1.5; }
    if (b >= 2.25 && b < 3) { st.x = 1100; st.eye = -1; }
    if (b >= 2.95 && b < 6) {
      let i = 0; while (i + 1 < HOPS.length && b >= HOPS[i + 1]) i++;
      const from = b < HOPS[0] ? 100 : NODES[i][1], nxt = b < HOPS[0] ? 0 : i + 1 < NODES.length ? i + 1 : i, ht = b < HOPS[0] ? HOPS[0] : HOPS[nxt];
      const k = b < HOPS[0] ? prog(b, 3, 3.25) : nxt === i ? 1 : prog(b, ht - .2, ht, E.io);
      const x = lerp(from, b < HOPS[0] ? NODES[0][1] : NODES[nxt][1], k);
      st.x = x; st.y = 560 - Math.sin(Math.PI * k) * 80; st.px = 12;
      if (b >= 3.75 && b < 4.75) { st.q = 1; st.eye = -1; st.pose = 'up'; }
      if (b >= 5.5) st.pose = 'both';
    }
    if (b >= 6 && b < 10) {
      const k7 = prog(b, 6, 7.4, E.lin); st.x = lerp(330, 1180, k7); st.y = GY; st.px = 14; st.walk = step * 20;
      if (b >= 7.5) { st.x = 1180; st.walk = -1; st.eyeShape = 'x'; st.pose = 'cover'; }
      if (b >= 8) { st.x = lerp(1180, 870, prog(b, 8, 8.35, E.io)); st.eyeShape = null; st.pose = 'idle'; st.alpha = .4 + .6 * (Math.floor(t * 16) % 2); }
      if (b >= 8.4) st.alpha = 1;
      if (b >= 9) { const k = prog(b, 9.05, 9.35, E.io); st.x = lerp(870, 1260, k); st.y = lerp(GY, 420, k) - Math.sin(Math.PI * k) * 60; st.pose = 'idle'; }
    }
    if (b >= 10 && b < 13) { st.x = lerp(400, 1440, prog(b, 10, 11, E.lin)); st.walk = step * 20; st.px = 14; if (b >= 11) { st.x = 1440; st.walk = -1; st.eye = -1; st.pose = 'pointL'; } if (b >= 11.25) { st.sweat = b; st.eye = 1; } }
    // GAME OVER 期间：Clawd 在中央，叉眼，半透明
    if (b >= 13 && b < 16.4) { st.x = 960; st.y = 880; st.px = 14; st.eyeShape = b >= 14 ? 'x' : null; st.alpha = b >= 14 ? .5 : 1; }
    if (b >= 16.4) { st.x = 1560; st.y = GY; st.px = 16; st.pose = b >= 17.75 && b < 18.4 ? 'up' : 'idle'; }
    clawd(cx, st);
    // ---------- 歌词 ----------
    const LX = 110, ink = { col: P.wht, acc: [P.yel, P.pnk] }, p8 = { fam: F.sans, w: 900 };
    lyric(tx, L, { at: 1.2, out: 2.15, text: '我一口气改了‹五个文件›——', x: LX, y: 230, size: 56, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 1.5, out: 2.15, text: '坏了一处。', x: LX, y: 330, size: 48, ...p8, ...ink, anim: 'type' });
    // 停一拍（b=2）：Clawd 站在原地，头顶问号
    lyric(tx, L, { at: 2.25, out: 2.95, text: '是哪一处？', x: LX, y: 230, size: 56, ...p8, ...ink, anim: 'blur' });
    lyric(tx, L, { at: 2.25, out: 2.95, text: '改得越多，出错时要翻的范围越大', x: LX, y: 330, size: 40, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 2.6, out: 2.95, text: '把每次出错的范围，控制在‹一步›之内', x: LX, y: 420, size: 52, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 3, out: 5.9, text: '换个打法，一关一关过：', x: LX, y: 230, size: 52, ...p8, ...ink, anim: 'type' });
    NODES.forEach(([n, x], i) => lyric(tx, L, { at: 3.05 + i * .06, out: 5.9, text: n, x, y: 700, size: 34, ...p8, col: i === 2 ? P.blu : P.wht, align: 'center', anim: 'type' }));
    lyric(tx, L, { at: 3.8, out: 4.9, text: '这一关是«你的»：看计划、改计划。我在这儿等你盖章', x: LX, y: 330, size: 40, ...p8, ...ink, acc: [P.yel, P.blu], anim: 'type' });
    lyric(tx, L, { at: 5, out: 5.9, text: '多数工具都有‹计划模式›', x: LX, y: 330, size: 44, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 6, out: 7.4, text: '每过一关、验证通过，就 commit 一次', x: LX, y: 230, size: 52, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 6.25, out: 7.4, text: 'Git 提交 = ‹存档点›', x: LX, y: 330, size: 60, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 7.5, out: 8.9, text: '改坏了？直接‹读档›', x: LX, y: 230, size: 60, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 8.25, out: 8.9, text: 'git 记录和检查点，也能让我\n在多次会话之间接着干', x: LX, y: 360, size: 32, ...p8, w: 700, ...ink, anim: 'type' });
    lyric(tx, L, { at: 9, out: 9.9, text: '冒险的尝试，‹开个分支›去试', x: LX, y: 230, size: 56, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 10, out: 11.9, text: '把测试当终点线：先有测试，再改到‹通过›', x: LX, y: 230, size: 52, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 10.5, out: 11.9, text: '我能自己跑测试、自己发现问题——', x: LX, y: 320, size: 38, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 11.25, out: 11.9, text: '但得防着我«耍小聪明»（下一章）', x: LX, y: 400, size: 44, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 12, out: 12.7, text: '同一个问题，‹失败三次›——', x: LX, y: 230, size: 56, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 14.5, out: 17.8, text: '还在学基础语法？‹先别用我›', x: LX, y: 260, size: 52, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 15, out: 17.8, text: '你自己写不出来的代码，也看不出我错在哪', x: LX, y: 350, size: 36, ...p8, ...ink, anim: 'type' });
    lyric(tx, L, { at: 15.75, out: 17.8, text: '作业能不能用 AI、用到什么程度——‹听老师的›', x: LX, y: 460, size: 44, ...p8, ...ink, anim: 'type' });
  },
};
};
