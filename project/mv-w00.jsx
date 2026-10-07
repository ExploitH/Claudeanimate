// 00 开机：全黑、心跳光标（3D 发光方块），打出 vibe coding（每个字母落在音乐盒的音上，落点有冲击光圈），
// 字发光停一拍，副标题；最后标题碎成 3D 像素方块，带着纵深飞散后聚成 Clawd
(window.MV_W = window.MV_W || {}).w00 = K => {
const { F, C, E, prog, lerp, bump, hash, rgba, fnt, lyric, clawd, clawdCells, typeSfx } = K;
const TITLE = 'vibe coding';
// 每个字母的出现时间（小节）：落在音乐盒主旋律的音上（第 2–4 小节），空格不发声
const AT = [2, 2.375, 2.5, 2.75, 2.875, 3, 3.5, 3.75, 4, 4.375, 4.5];
const GLOW = 4.75, BOOM = 6.6, CX = 960, CY = 470, SZ = 132, CL = { x: 960, y: 760, px: 16 };
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
let MEAS = null;
function measure(ctx) { // 每个字母的宽度（光标、冲击圈都按它定位）
  if (MEAS) return MEAS;
  ctx.font = fnt(700, SZ, F.mono);
  const ws = [...TITLE].map(ch => ctx.measureText(ch).width), tot = ws.reduce((a, b) => a + b, 0);
  return (MEAS = { ws, tot, x0: CX - tot / 2 });
}
const typedW = n => MEAS ? MEAS.ws.slice(0, n).reduce((a, b) => a + b, 0) : 0;
// 像素飞散的路径：起点（字上的点）→ 终点（Clawd 身上的格子），中途向四周和纵深炸开
function burst(i, b, P, cells) {
  const [px, py] = P[i], h = hash(i * .73), cell = cells[Math.floor(hash(i * 1.91) * cells.length)];
  const tx0 = CL.x + (cell[0] - 6) * CL.px + CL.px / 2, ty0 = CL.y - (8 - cell[1]) * CL.px + CL.px / 2;
  const k = prog(b, BOOM + h * .25, BOOM + .55 + h * .2, E.io), s = Math.sin(Math.PI * k);
  return { k, h, x: lerp(px, tx0, k) + (hash(i * 3.3) - .5) * 700 * s, y: lerp(py, ty0, k) + (hash(i * 5.7) - .5) * 460 * s, z: (hash(i * 8.1) - .35) * 1400 * s, fade: 1 - prog(b, BOOM + .5 + h * .3, BOOM + .8 + h * .3) };
}
return {
  scene: '00 开机', bars: 8, look: 0,
  par: L => [.15 + .9 * (L.hit(Math.floor(L.b * 2) / 2, .18)) * (L.b < 2 ? 1 : .35) + .9 * bump(L.b, GLOW + .4, .6) + .5 * prog(L.b, BOOM, BOOM + .6), .4 * prog(L.b, 3, 6), 0, 0],
  cam: L => [lerp(1.0, 1.07, prog(L.b, 0, 8, E.io)) + .02 * L.hit(BOOM + .45, .3), 0, 0, 0],
  lb: L => .7 * (1 - prog(L.b, 6.3, 7.1, E.io)),
  pulse: L => L.b >= 7.5 ? 1 : 0,
  hud: { ink: C.ink },
  noInv: true,
  sfx: [...typeSfx(.5, '周五晚上九点。作业，周一交。', .15), ...typeSfx(1.5, '你打开了编辑器。', .15), ...AT.filter((_, i) => TITLE[i] !== ' ').map(b => [b, 'key']),
    [GLOW, 'sparkle'], [5, 'swish'], [BOOM, 'whoosh'], [BOOM + .5, 'pop'], [BOOM + .75, 'blip'], [BOOM + 1, 'jump']],
  text: TITLE + '需要注意的细节导演剪辑版 DIRECTOR\'S CUT 信息截至 2026 年 10 月周五晚上九点。作业，周一交。你打开了编辑器。',
  three(T, U) {
    const scene = new T.Scene();
    scene.add(new T.AmbientLight(0xffffff, .35));
    const key = new T.PointLight(0xffd2b8, 2.2, 0, 2); key.position.set(-300, 400, 900); scene.add(key);
    // 光标：有厚度的发光方块
    const cur = new T.Mesh(new T.BoxGeometry(SZ * .55, SZ, 46), new T.MeshStandardMaterial({ color: new T.Color(C.clawd).convertSRGBToLinear(), emissive: new T.Color(C.clawd).convertSRGBToLinear(), emissiveIntensity: .4, roughness: .3, metalness: .15 }));
    scene.add(cur);
    // 字母落地的冲击光圈
    const rings = AT.map(() => { const r = new T.Mesh(new T.RingGeometry(.86, 1, 64), new T.MeshBasicMaterial({ color: 0xffc9a8, transparent: true, side: T.DoubleSide, depthWrite: false })); scene.add(r); return r; });
    // 像素方块（实例化）
    let vox = null;
    const M = new T.Matrix4(), Q = new T.Quaternion(), V = new T.Vector3(), S3 = new T.Vector3(), EU = new T.Euler(), COL = new T.Color();
    return {
      scene,
      update(L) {
        const b = L.b;
        // 光标
        const shown = AT.filter(a => b >= a).length, heart = L.hit(Math.floor(b * 2) / 2, .2);
        const on = b < 2 || b < AT[10] + .1 || Math.floor(L.bt * 2) % 2 === 0;
        cur.visible = b < BOOM && on && !!MEAS;
        if (MEAS) {
          const cx = shown ? MEAS.x0 + typedW(shown) + 8 + SZ * .275 : CX;
          U.at(cur, cx, CY, 0);
          const pulse = b < 2 ? heart : L.hit(AT[Math.max(0, shown - 1)], .12) * .6;
          cur.scale.setScalar(1 + .08 * pulse);
          cur.rotation.set(-.12 + .05 * Math.sin(L.t * .9), .38 + .08 * Math.sin(L.t * .6), 0);
          cur.position.z = 40 + 60 * pulse;
          cur.material.emissiveIntensity = (b < 2 ? .15 + .5 * heart : .35) + .5 * bump(b, GLOW + .4, .6);
        }
        // 冲击光圈：躺在字的基线上，向外扩散
        rings.forEach((r, i) => {
          const k = prog(b, AT[i], AT[i] + .45);
          r.visible = MEAS && TITLE[i] !== ' ' && k > 0 && k < 1;
          if (!r.visible) return;
          const x = MEAS.x0 + typedW(i) + MEAS.ws[i] / 2;
          U.at(r, x, CY + SZ * .48, 0);
          r.rotation.set(-1.25, 0, 0);
          r.scale.setScalar(20 + 150 * U.out(k));
          r.material.opacity = .85 * (1 - k);
        });
        // 像素方块炸开
        const P = PTS, live = b >= BOOM && b < BOOM + 1.2 && P;
        if (live && !vox) {
          vox = new T.InstancedMesh(new T.BoxGeometry(7, 7, 7), new T.MeshStandardMaterial({ roughness: .4, metalness: .2, emissive: 0x332018 }), P.length);
          P.forEach((_, i) => { const h = hash(i * .73); vox.setColorAt(i, COL.set(h > .9 ? C.clawd : h > .75 ? C.kw : '#f4f1ea').convertSRGBToLinear()); });
          scene.add(vox);
        }
        if (vox) {
          vox.visible = !!live;
          if (live) {
            const cells = clawdCells({ pose: 'idle' });
            for (let i = 0; i < P.length; i++) {
              const p = burst(i, b, P, cells), sc = Math.max(.001, lerp(1, .5, p.k) * p.fade);
              EU.set(p.k * 6 * (hash(i * 2.2) - .5), p.k * 8 * (hash(i * 4.4) - .5), 0); Q.setFromEuler(EU);
              M.compose(V.set(p.x - U.W / 2, U.H / 2 - p.y, p.z), Q, S3.set(sc, sc, sc)); vox.setMatrixAt(i, M);
            }
            vox.instanceMatrix.needsUpdate = true;
          }
        }
        return cur.visible || rings.some(r => r.visible) || !!(vox && vox.visible);
      },
    };
  },
  draw(cx, tx, L) {
    const b = L.b, m = measure(cx), shown = AT.filter(a => b >= a).length, has3d = !!window.THREE;
    const glow = bump(b, GLOW + .4, .6);
    if (b < BOOM) {
      // 没有 3D 时，2D 光标兜底
      if (!has3d) {
        const heart = L.hit(Math.floor(b * 2) / 2, .2), curX = shown ? m.x0 + typedW(shown) + 8 : CX - 34, on = b < 2 || Math.floor(L.bt * 2) % 2 === 0 || b < AT[10] + .1;
        if (on) { cx.fillStyle = C.clawd; cx.globalAlpha = b < 2 ? .35 + .65 * heart : 1; cx.fillRect(curX, CY - SZ * .5, SZ * .55, SZ); cx.globalAlpha = 1; }
      }
      // 打出的字：从上方落下，带一点回弹；打完停一拍发光
      cx.font = fnt(700, SZ, F.mono); cx.textBaseline = 'middle';
      cx.save();
      if (glow > 0) { cx.shadowColor = rgba('#ffb38f', .9); cx.shadowBlur = 40 * glow; }
      cx.fillStyle = '#f4f1ea';
      let xx = m.x0;
      for (let i = 0; i < shown; i++) {
        const a = AT[i], k = prog(b, a, a + .12, E.back), ch = TITLE[i];
        cx.save(); cx.translate(xx, CY - (1 - k) * 140); cx.globalAlpha = Math.min(1, prog(b, a, a + .05) * 1.5);
        cx.fillText(ch, 0, 0); cx.restore();
        xx += m.ws[i];
      }
      cx.restore();
    }
    // 没有 3D 时，像素在 2D 里飞
    const P = points();
    if (!has3d && b >= BOOM && b < BOOM + 1.2) {
      const cells = clawdCells({ pose: 'idle' });
      P.forEach((_, i) => {
        const p = burst(i, b, P, cells), s = lerp(5, 3, p.k);
        cx.globalAlpha = p.fade; cx.fillStyle = p.h > .9 ? C.clawd : p.h > .75 ? C.kw : '#f4f1ea'; cx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
      });
      cx.globalAlpha = 1;
    }
    const ka = prog(b, BOOM + .45, BOOM + .75);
    if (ka > 0) {
      const j0 = BOOM + 1, jump = b >= j0 ? Math.sin(Math.PI * prog(b, j0, j0 + .35, E.lin)) * 70 : 0;
      clawd(cx, { x: CL.x, y: CL.y - jump, px: CL.px, alpha: ka, pose: b >= BOOM + .75 && b < j0 ? 'wave' : 'idle', ph: L.t * 12, blink: b > BOOM + .65 && b < BOOM + .7, squash: b >= j0 + .35 ? 1 - .2 * Math.sin(Math.PI * prog(b, j0 + .35, j0 + .45, E.lin)) : 1 });
    }
    // 字幕层
    const out = 6.55;
    lyric(tx, L, { at: .5, out: 1.4, text: '周五晚上九点。作业，周一交。', x: 960, y: 640, size: 34, fam: F.sans, w: 500, align: 'center', anim: 'type', rev: .6, col: rgba('#ffffff', .7) });
    lyric(tx, L, { at: 1.5, out: 1.98, text: '你打开了编辑器。', x: 960, y: 640, size: 34, fam: F.sans, w: 500, align: 'center', anim: 'type', rev: .3, col: rgba('#ffffff', .55) });
    lyric(tx, L, { at: 5, out, text: '需要注意的细节', x: 960, y: 640, size: 60, fam: F.serif, w: 700, align: 'center', anim: 'blur', st: .3, d: .25, col: '#efeae0', outAnim: 'blur' });
    lyric(tx, L, { at: 5.75, out, text: '导演剪辑版  ·  DIRECTOR\'S CUT', x: 960, y: 730, size: 26, fam: F.mono, w: 400, align: 'center', anim: 'fade', st: .06, col: C.clawd, ls: .12 });
    lyric(tx, L, { at: 6, out, text: '信息截至 2026 年 10 月', x: 960, y: 790, size: 22, fam: F.mono, w: 400, align: 'center', anim: 'type', st: .1, col: rgba('#ffffff', .45) });
  },
};
};
