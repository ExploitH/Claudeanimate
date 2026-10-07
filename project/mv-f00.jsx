// 序幕 · 周五 21:00：雨夜，窗外推进宿舍；便利贴写着周一交作业；手机上室友的消息；你坐下打开电脑，Clawd 打招呼；片名
(window.MV_W = window.MV_W || {}).f00 = K => {
const { F, C, E, TR, prog, lerp, bump, rgba, fnt, rr, txt, alpha, lyric, clawd } = K;
const PHONE_MSG = ['室友', '听说现在用 AI 写代码，半小时就能搞定一个功能？'];
return window.MV_REAL(K, {
  scene: '序幕 · 周五 21:00',
  desc: '雨夜，镜头从窗外推进宿舍；便利贴写着周一交作业，手机上室友说用 AI 半小时就能写完；你打开电脑，Clawd 打招呼；片名。',
  clock: [20, 58], clockRate: .2,
  stamp: ['周五 · 宿舍', '21:00'],
  chatHide: S => S.t('push') + .6,
  steps: [
    { id: 'open', pause: 4 },
    { id: 'note', pause: 3.5 },
    { id: 'phone', pause: 4.5 },
    { id: 'sit', pause: 2.5 },
    { id: 'hi', me: '晚上好。我是 Clawd，你的 AI 编程助手。' },
    { me: '今晚要做什么？' },
    { id: 'task', you: '作业。给图书管理系统加一个登录功能，周一早上交。' },
    { me: '好。开始之前——' },
    { id: 'show', me: '我想先带你看看：我们俩一起写代码的时候，屏幕两边到底在发生什么。', hold: .5 },
    { id: 'push', pause: 1.5 },
    { id: 'title', big: 'Vibe Coding 需要注意的细节', sub: '一个晚上的故事 · 导演剪辑版', dur: 5.5, y: 470, bigS: { size: 92, anim: 'blur', st: .14, d: .4, col: '#f6f1e8', fam: F.serif, glow: [30, 'rgba(255,190,140,.35)'] } },
  ],
  shots: S => [[0, 'street', 0], [.5, 'window', 3.5, 'io'], [S.t('note'), 'note', 1.2], [S.t('phone'), 'phone', 1.2], [S.t('sit'), 'wide', 1.5], [S.t('hi') - .2, 'desk', 1.5], [S.t('show'), 'over', 3], [S.t('push'), 'into', 1.4, 'in'], [S.t('title'), 'into', 0]],
  room: (L, S) => ({ rain: 1, lamp: 1, screen: prog(L.b, S.t('sit') + .8, S.t('sit') + 1.6) * (1 - .8 * prog(L.b, S.t('title') - .2, S.t('title') + .6)), lidClose: 1 - prog(L.b, S.t('sit') + .2, S.t('sit') + 1.2, E.io), steam: 1 }),
  figure: (L, S) => ({ hide: L.b < S.t('sit'), type: L.b >= S.t('task') && L.b < S.t('task') + 1 ? 1 : 0, lean: 0 }),
  mood: (L, S) => [lerp(.45, .66, prog(L.b, 0, 4)), .5, .85, .8],
  lb: (L, S) => .55 * (1 - prog(L.b, S.t('title'), S.t('title') + 1)) + .2,
  phone: (x, w, h, L, S) => {
    const k = prog(L.b, S.t('phone') + .4, S.t('phone') + .6);
    if (k <= 0) return;
    x.fillStyle = `rgba(30,32,40,${k})`; x.fillRect(0, 0, w, h);
    x.globalAlpha = k; x.fillStyle = '#e8e9ee'; x.font = '300 64px "JetBrains Mono",monospace'; x.textAlign = 'center'; x.fillText('21:00', w / 2, 110); x.textAlign = 'left';
    x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.roundRect(14, 170, w - 28, 120, 18); x.fill();
    x.fillStyle = '#ffffff'; x.font = '700 22px "Noto Sans SC",sans-serif'; x.fillText(PHONE_MSG[0], 30, 205);
    x.font = '400 19px "Noto Sans SC",sans-serif'; x.fillText('听说现在用 AI 写代码，', 30, 240); x.fillText('半小时就能搞定一个功能？', 30, 268);
    x.globalAlpha = 1;
  },
  sfx: S => [[.3, 'thunder'], [S.t('phone') + .4, 'notify'], [S.t('sit') + .2, 'click'], [S.t('sit') + 1, 'beep', 880], [S.t('title'), 'whoosh']],
  draw(cx, tx, L, S) {
    const b = L.b;
    // 手机通知的放大版，方便看清
    const kp = prog(b, S.t('phone') + .5, S.t('phone') + .8, E.out) * (1 - prog(b, S.t('sit') - .3, S.t('sit')));
    if (kp > 0) alpha(tx, kp, () => {
      const x = 560, y = 760 + (1 - kp) * 30;
      rr(tx, x, y, 800, 150, 28, 'rgba(28,30,38,.88)', 'rgba(255,255,255,.12)', 2);
      rr(tx, x + 28, y + 34, 56, 56, 14, '#4f8f6b'); txt(tx, '室', x + 56, y + 63, fnt(900, 30), '#fff', 'center');
      txt(tx, PHONE_MSG[0], x + 108, y + 52, fnt(700, 30), '#ffffff'); txt(tx, '现在', x + 760, y + 52, fnt(400, 24), 'rgba(255,255,255,.5)', 'right');
      txt(tx, PHONE_MSG[1], x + 108, y + 104, fnt(500, 32), 'rgba(255,255,255,.92)');
    });
    // 便利贴的放大字（3D 里也能看见，这里再给一行）
    const kn = prog(b, S.t('note') + .6, S.t('note') + 1) * (1 - prog(b, S.t('phone') - .3, S.t('phone')));
    if (kn > 0) alpha(tx, kn, () => { txt(tx, '周一 8:00 交 · 图书管理系统：加登录功能', 960, 900, fnt(500, 34), 'rgba(255,240,200,.9)', 'center'); });
    // 片名下的小字
    const kt = prog(b, S.t('title') + 1, S.t('title') + 1.6);
    if (kt > 0) alpha(tx, kt * (1 - prog(b, S.e('title') - .3, S.e('title'))), () => txt(tx, '信息截至 2026 年 10 月', 960, 640, fnt(400, 24, F.mono), 'rgba(255,255,255,.5)', 'center'));
  },
  music(S, H, w) {
    const M = w.m.S;
    S.add('rain', 0, 0, 0, w.m.bars * 4, 1);
    S.add('pad', 0, 0, H.CH.Dm.pad, 16, .35, 'warm');
    // 音乐盒：主旋律前四小节，坐下以后进
    H.hook(S, Math.ceil(M.t('sit')), 'box', 0, 0, 4, .7);
    ['Dm', 'Bb', 'F', 'C', 'Dm', 'Bb'].forEach((c, i) => S.add('pad', Math.ceil(M.t('sit')) + i, 0, H.CH[c].pad, 4, .45, 'warm'));
    S.add('piano', 1, 0, [50, 57, 62], 6, .5); S.add('piano', 3, 0, [46, 53, 62], 6, .45);
    S.add('riser', Math.floor(M.t('push')), 0, 0, 6, .7);
    S.add('impact', Math.round(M.t('title') * 4) / 4, 0, 0, 0, .55);
    S.add('pad', Math.floor(M.t('title')), 0, H.CH.Dm.pad, 22, .55, 'string');
    S.add('drone', Math.floor(M.t('title')), 0, 26, 22, .5);
  },
});
};
