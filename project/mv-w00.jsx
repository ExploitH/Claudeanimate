// 00 开机：全黑、心跳光标，打出 vibe coding（每个字母落在音乐盒的音上），标题碎成像素聚成 Clawd
(window.MV_W = window.MV_W || {}).w00 = K => {
const { F, C, E, prog, lerp, bump, hash, rgba, fnt, lyric, clawd, clawdCells } = K;
const TITLE = 'vibe coding';
// 每个字母的出现时间（小节）：对齐音乐盒主旋律的音符
const AT = [2, 2.375, 2.5, 2.75, 2.86, 2.875, 3, 3.5, 3.625, 3.75, 4];
const CX = 960, CY = 470, SZ = 132, CL = { x: 960, y: 760, px: 16 };
let PTS = null;
function points() { // 标题文字采样成点
  if (PTS) return PTS;
  const c = document.createElement('canvas'), x = c.getContext('2d'), s = 6, fs = SZ / s;
  x.font = fnt(700, fs, F.mono); const w = Math.ceil(x.measureText(TITLE).width) + 4, h = Math.ceil(fs * 1.4);
  c.width = w; c.height = h; x.font = fnt(700, fs, F.mono); x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText(TITLE, 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data, pts = [];
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) if (d[(j * w + i) * 4 + 3] > 120) pts.push([CX - w * s / 2 + i * s, CY + (j - h / 2) * s]);
  return (PTS = pts);
}
const typedW = (ctx, n) => { ctx.font = fnt(700, SZ, F.mono); return ctx.measureText(TITLE.slice(0, n)).width; };
return {
  scene: '00 开机', bars: 6, look: 0,
  par: L => [.15 + .9 * (L.hit(Math.floor(L.b * 2) / 2, .18)) * (L.b < 4 ? 1 : 0) + .5 * prog(L.b, 4.6, 5.2) , .4 * prog(L.b, 3, 5), 0, 0],
  cam: L => [lerp(1.0, 1.07, prog(L.b, 0, 6, E.io)), 0, 0, 0],
  lb: L => .7 * (1 - prog(L.b, 3.6, 4.4, E.io)),
  pulse: L => L.b >= 5.5 ? 1 : 0,
  hud: { ink: C.ink },
  noInv: true,
  sfx: [...AT.filter((_, i) => TITLE[i] !== ' ').map(b => [b, 'key']), [3, 'sparkle'], [4.6, 'whoosh'], [5.1, 'pop'], [5.35, 'blip'], [5.6, 'jump']],
  text: TITLE + '需要注意的细节导演剪辑版 DIRECTOR\'S CUT 信息截至 2026 年 10 月',
  draw(cx, tx, L) {
    const b = L.b, shown = AT.filter(a => b >= a).length;
    const boom = prog(b, 4.6, 5.15, E.in);
    // 光标：心跳闪烁，之后跟在字后面
    const heart = Math.max(L.hit(Math.floor(b * 2) / 2, .2), 0);
    const w = typedW(cx, shown), x0 = CX - typedW(cx, TITLE.length) / 2;
    if (boom <= 0) {
      const curX = shown ? x0 + w + 8 : CX - 34, on = b < 2 ? true : Math.floor(L.bt * 2) % 2 === 0 || b < AT[10] + .1;
      if (on) { cx.fillStyle = C.clawd; cx.globalAlpha = b < 2 ? .35 + .65 * heart : 1; cx.fillRect(curX, CY - SZ * .5, SZ * .55, SZ); cx.globalAlpha = 1; }
      // 打出的字
      cx.font = fnt(700, SZ, F.mono); cx.textBaseline = 'middle'; cx.fillStyle = '#f4f1ea';
      let xx = x0;
      for (let i = 0; i < shown; i++) {
        const a = AT[i], k = prog(b, a, a + .06, E.out), ch = TITLE[i];
        cx.save(); cx.translate(xx + cx.measureText(ch).width / 2, CY - (1 - k) * 18);
        cx.fillText(ch, -cx.measureText(ch).width / 2, 0); cx.restore();
        xx += cx.measureText(ch).width;
      }
    }
    // 标题碎成像素，飞向 Clawd
    const cells = clawdCells({ pose: 'idle' }), P = points();
    if (boom > 0 && b < 5.6) {
      P.forEach(([px, py], i) => {
        const h = hash(i * .73), cell = cells[Math.floor(hash(i * 1.91) * cells.length)];
        const tx0 = CL.x + (cell[0] - 6) * CL.px + CL.px / 2, ty0 = CL.y - (8 - cell[1]) * CL.px + CL.px / 2;
        const k = prog(b, 4.6 + h * .25, 5.15 + h * .2, E.io);
        const ox = (hash(i * 3.3) - .5) * 600, oy = (hash(i * 5.7) - .5) * 400;
        const x = lerp(px, tx0, k) + ox * Math.sin(Math.PI * k), y = lerp(py, ty0, k) + oy * Math.sin(Math.PI * k);
        const s = lerp(5, 3, k);
        cx.globalAlpha = 1 - prog(b, 5.1 + h * .3, 5.4 + h * .3);
        cx.fillStyle = h > .9 ? C.clawd : h > .75 ? C.kw : '#f4f1ea'; cx.fillRect(x - s / 2, y - s / 2, s, s);
      });
      cx.globalAlpha = 1;
    }
    const ka = prog(b, 5.05, 5.35);
    if (ka > 0) {
      const jump = b >= 5.6 ? Math.sin(Math.PI * prog(b, 5.6, 5.95, E.lin)) * 70 : 0;
      clawd(cx, { x: CL.x, y: CL.y - jump, px: CL.px, alpha: ka, pose: b >= 5.35 && b < 5.6 ? 'wave' : 'idle', ph: L.t * 12, blink: b > 5.25 && b < 5.3, squash: b >= 5.95 ? 1 - .2 * Math.sin(Math.PI * prog(b, 5.95, 6.05, E.lin)) : 1 });
    }
    // 字幕层：副标题
    const out = 4.55;
    lyric(tx, L, { at: 3, out, text: '需要注意的细节', x: 960, y: 640, size: 60, fam: F.serif, w: 700, align: 'center', anim: 'blur', st: .3, d: .25, col: '#efeae0', outAnim: 'blur' });
    lyric(tx, L, { at: 3.75, out, text: '导演剪辑版  ·  DIRECTOR\'S CUT', x: 960, y: 730, size: 26, fam: F.mono, w: 400, align: 'center', anim: 'fade', st: .06, col: C.clawd, ls: .12 });
    lyric(tx, L, { at: 4, out, text: '信息截至 2026 年 10 月', x: 960, y: 790, size: 22, fam: F.mono, w: 400, align: 'center', anim: 'type', st: .1, col: rgba('#ffffff', .45) });
  },
};
};
