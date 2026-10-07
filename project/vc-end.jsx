// 片尾　清单
(window.VC_CH = window.VC_CH || {})[10] = V => {
const { COL, MONO, font, MOTION, prog, lerp, bump, heat, popScale, jumpPos } = V;
const { Easing } = window;
const N = ['片尾 清单'];
const CE0 = [960, 700, 16], CE1 = [1730, 860, 8];
const LIST = [['先判断这个项目在轴的哪一端', '01'], ['提示词写清目标、背景、约束、验收标准', '03'], ['规则文件自己写，写短', '04'], ['按任务选模型，按任务算费用', '05'],
  ['弄清工具的权限设置和撤销方式', '06'], ['先出计划，小步提交', '07'], ['看 diff、自己运行、确认依赖真实存在', '08'], ['密钥不进代码，危险命令手动确认', '09']];
const CD = { x: 360, y: 180, w: 1200, h: 660 }, AXL = { x: 1080, w: 400, y: 236 }, AXT = [['作业', .45], ['给别人用', .72], ['上线', 1]];

function plan(C, total) {
  if (C[N[0]] === undefined) return null;
  const Ed = C[N[0]], end = total || Ed + 24;
  const tm = { Ed, end, wave: Ed + .4, away: Ed + 2.3, card: Ed + 2.5, axis: Ed + 3, items: LIST.map((_, i) => Ed + 3.3 + i * .5), bye: Ed + 4.4, rest: Ed + 7.4 };
  const caps = [[Ed + .4, Ed + 4.2, '清单给你放这儿了，截个图存好。'], [Ed + 4.2, Ed + 7.2, '我是 Clawd，下次见。']].map(([at, until, text]) => ({ at, until, text }));
  const cam = [[Ed + .6, 1.44, 0, .03, 0, 0, -.04], [Ed + 2.6, 1.56, 0, .03, 0, 0, 0], [Ed + 7.4, 1.54, 0, .03, 0, 0, 0], [end - 1, 1.52, 0, .03, 0, 0, 0]];
  const sfx = [[Ed - .2, 'jump'], [tm.wave, 'hi'], [tm.away, 'jump'], [tm.card, 'on'], [tm.axis, 'sweep'], ...tm.items.flatMap(t => [[t, 'pix'], [t + .2, 'blip']]), [tm.items[7] + .5, 'sparkle'], [tm.bye, 'hi']];
  const text = LIST.flat().join('') + 'Vibe Coding 清单截图存好作业给别人用上线 EOF';
  return { start: Ed, actorFrom: Ed - .55, tm, ty: {}, caps, cam, sfx, text,
    bounds: [[Ed, 'dis']], rips: [[tm.items[7] + .5, 960 / 1920, 500 / 1080]], shakes: [],
    quiet: [[tm.rest, end + 1]], lp: [[tm.rest, end + 1, 1100]],
    hud: { num: 'EOF', name: ' 清单', from: Ed + .3, srcs: [] },
  };
}

function box(ctx, x, y, w, h, fill, stroke, lw = 2, r = 14) {
  if (h < .5 || w < .5) return;
  ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw;
  ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, h / 2, w / 2)); ctx.fill(); ctx.stroke();
}
function check(ctx, x, y, s, c) { ctx.strokeStyle = c; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - s, y); ctx.lineTo(x - s * .3, y + s * .7); ctx.lineTo(x + s, y - s * .7); ctx.stroke(); }

function scene(ctx, T, pl) {
  const { tm } = pl, k = prog(T, tm.card, tm.card + .6);
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha = k; ctx.translate(0, 24 * (1 - k));
  box(ctx, CD.x, CD.y, CD.w, CD.h, COL.card, COL.line, 2, 20);
  ctx.font = font(700, 40, MONO); ctx.fillStyle = COL.text; ctx.fillText('Vibe Coding', CD.x + 56, CD.y + 62);
  ctx.font = font(600, 40); ctx.fillStyle = COL.kw; ctx.fillText('清单', CD.x + 56 + 300, CD.y + 62);
  // 顶部缩小的项目轴
  const ka = prog(T, tm.axis, tm.axis + .8, MOTION.draw);
  if (ka > 0) {
    const { x, w, y } = AXL, sp = lerp(0, .45, ka), sx = x + w * sp;
    ctx.fillStyle = '#5a5f6b'; ctx.fillRect(x, y - 2, w * ka, 4);
    const g = ctx.createLinearGradient(x, 0, Math.max(x + 1, sx), 0); g.addColorStop(0, COL.str); g.addColorStop(1, heat(sp)); ctx.fillStyle = g; ctx.fillRect(x, y - 3, sx - x, 6);
    ctx.textAlign = 'center';
    AXT.forEach(([s, p]) => { if (p > ka) return; const lit = sp >= p - 1e-3, tx = x + w * p; ctx.fillStyle = lit ? heat(p) : '#4a4e57'; ctx.fillRect(tx - 3, y - 12, 6, 24); ctx.font = font(lit ? 600 : 400, 20); ctx.fillStyle = lit ? COL.text : COL.dim; ctx.fillText(s, tx, y + 32); });
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(19,20,23,.95)'; ctx.beginPath(); ctx.arc(sx, y, 15, 0, 6.283); ctx.fill(); ctx.fillStyle = heat(sp); ctx.beginPath(); ctx.arc(sx, y, 10, 0, 6.283); ctx.fill();
  }
  ctx.fillStyle = COL.line; ctx.fillRect(CD.x + 56, CD.y + 118, CD.w - 112, 2);
  const done = bump(T, tm.items[7] + .6, .4);
  LIST.forEach(([s, ch], i) => {
    const t = tm.items[i], ki = prog(T, t, t + .4), kc = prog(T, t + .2, t + .5, MOTION.pop), y = CD.y + 172 + i * 62;
    if (ki <= 0) return;
    ctx.globalAlpha = k * ki;
    ctx.fillStyle = kc > .01 ? `rgba(165,214,122,${.18 + .2 * done})` : COL.bg; ctx.strokeStyle = kc > .01 ? COL.str : COL.dim; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.roundRect(CD.x + 56, y - 18, 36, 36, 6); ctx.fill(); ctx.stroke();
    if (kc > .01) popScale(ctx, CD.x + 74, y, kc, () => check(ctx, CD.x + 74, y, 10, COL.str));
    ctx.font = font(500, 34); ctx.fillStyle = COL.text; ctx.fillText(s, CD.x + 120 + 14 * (1 - ki), y);
    ctx.font = font(400, 22, MONO); ctx.fillStyle = COL.faint; ctx.textAlign = 'right'; ctx.fillText('// ' + ch, CD.x + CD.w - 56, y); ctx.textAlign = 'left';
  });
  ctx.restore();
}

function clawd(T, pl) {
  const { tm } = pl, prev = pl.prev || [960, 600, 12];
  const J = [[tm.Ed - .55, tm.Ed + .3, prev, CE0], [tm.away, tm.away + .7, CE0, CE1]];
  const jp = jumpPos(T, J, prev), [x, y, px] = jp.p;
  const st = { x, y, px, pose: 'idle', ph: T * 14, walk: -1, eye: 0, blink: (T % 3.3) < .12, squash: 1, alpha: 1 };
  if (jp.air) st.squash = 1 + .1 * Math.sin(Math.PI * jp.k);
  const ld = J.map(j => j[1]).find(t => T >= t && T < t + .25);
  if (ld !== undefined) st.squash = 1 - .2 * Math.sin(Math.PI * (T - ld) / .25);
  if (T >= tm.wave && T < tm.away - .1) st.pose = 'wave';
  if (T >= tm.away + .7 && T < tm.bye) st.eye = -1;
  if (T >= tm.bye && T < tm.bye + 2.2) st.pose = 'wave';
  if (T >= tm.rest) st.eye = -1;
  return st;
}

function fx(T, pl) {
  const { tm } = pl;
  return { gl: 0, rays: .35 * bump(T, tm.items[7] + .6, .5), light: [960 / 1920, 500 / 1080],
    energy: .38 + .12 * bump(T, tm.items[7] + .6, .6), warm: .15, floor: .35 * (1 - prog(T, tm.card, tm.card + 1)) };
}

const TL_PARTS = {"片尾 清单":[["片尾 清单",24]]};

return { plan, scene, clawd, fx, parts: TL_PARTS };
};
