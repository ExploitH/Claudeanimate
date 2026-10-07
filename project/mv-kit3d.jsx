// Vibe Coding 电影版：3D 道具箱（各章共用）
// window.MV_K3 = { clawd, label, rig, shards, key, dust, proj, glassBox, mat }
// 约定：世界单位随场景自定（多数用厘米）；所有 update 都只依赖传进来的时间，可以随意跳转。
(() => {
const clamp01 = x => Math.max(0, Math.min(1, x));
const prog = (x, a, b) => clamp01((x - a) / (b - a));
const io = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const out = k => 1 - Math.pow(1 - clamp01(k), 3);
const rnd = seed => { let s = (seed * 9301 + 49297) % 233280 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
const col = (T, c) => new T.Color(c).convertSRGBToLinear();

// ---------- 材质 ----------
function mat(T, c, o = {}) { return new T.MeshStandardMaterial({ color: col(T, c), roughness: o.r ?? .55, metalness: o.m ?? .1, emissive: o.e ? col(T, o.e) : 0x000000, emissiveIntensity: o.ei ?? 1, transparent: !!o.a, opacity: o.a ?? 1, flatShading: !!o.flat }); }

// ---------- 体素 Clawd：和 2D 的像素 Clawd 同一张点阵，挤出成方块 ----------
// const c = clawd(T, { px: 10 }); scene.add(c.g); c.set({ pose, walk, eye, blink, sweat, col, alpha })
function clawd(T, o = {}) {
  const px = o.px || 10, D = px * (o.depth || 4.2), N = 90;
  const g = new T.Group();
  const body = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ roughness: .6, metalness: 0 }), N);
  body.castShadow = true; body.receiveShadow = true; g.add(body);
  const eyes = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ color: 0x120c0a, roughness: .3 }), 2); g.add(eyes);
  const sweat = new T.Mesh(new T.SphereGeometry(px * .45, 10, 8), new T.MeshStandardMaterial({ color: col(T, '#9fd8ff'), roughness: .1, transparent: true, opacity: .85 })); g.add(sweat);
  const M = new T.Matrix4(), C = new T.Color();
  const st = { pose: 'idle', walk: -1, eye: 0, blink: 0, ph: 0, col: o.col || '#d97757', hi: o.hi || '#e8936f' };
  function set(s = {}) {
    Object.assign(st, s);
    const K = window.MV_K, cells = K.clawdCells({ pose: st.pose, walk: st.walk, ph: st.ph, col: st.col, hi: st.hi });
    let i = 0;
    for (const [c, r, cc] of cells) {
      if (i >= N) break;
      const leg = r >= 6, arm = c < 2 || c > 9, d = leg ? D * .55 : arm ? D * .5 : D;
      M.makeScale(px * .985, px * .985, d); M.setPosition((c - 5.5) * px, (7.5 - r) * px, 0);
      body.setMatrixAt(i, M); body.setColorAt(i, C.set(cc).convertSRGBToLinear()); i++;
    }
    for (; i < N; i++) { M.makeScale(1e-4, 1e-4, 1e-4); body.setMatrixAt(i, M); }
    body.instanceMatrix.needsUpdate = true; if (body.instanceColor) body.instanceColor.needsUpdate = true;
    const hide = st.pose === 'cover', bl = st.blink ? .2 : 1;
    [3, 8].forEach((c, j) => {
      if (hide) M.makeScale(1e-4, 1e-4, 1e-4);
      else { M.makeScale(px * .9, px * 2 * bl, px * .6); M.setPosition((c - 5.5 + (st.eye || 0) * .35) * px, (7.5 - 2.5) * px, D / 2 + px * .2); }
      eyes.setMatrixAt(j, M);
    });
    eyes.instanceMatrix.needsUpdate = true;
    sweat.visible = !!st.sweat; if (st.sweat) { const k = (st.sweat * 2) % 1; sweat.position.set(px * 4.6, px * (7 - k * 3), D / 2); sweat.material.opacity = .85 * (1 - k); }
    body.material.transparent = (st.alpha ?? 1) < 1; body.material.opacity = st.alpha ?? 1;
    g.visible = (st.alpha ?? 1) > .01;
  }
  set();
  return { g, set, px, D };
}

// ---------- 3D 文字牌：画布贴图，字体加载好后自动重画 ----------
const LABELS = [];
if (typeof document !== 'undefined' && document.fonts) document.fonts.ready.then(() => LABELS.forEach(f => f()));
function label(T, text, o = {}) {
  const S = 2, size = (o.size || 44) * S, pad = (o.pad ?? 18) * S, fam = o.font || '"Noto Sans SC",sans-serif', w0 = o.weight || 700;
  const cv = document.createElement('canvas'), x = cv.getContext('2d');
  const lines = String(text).split('\n');
  x.font = `${w0} ${size}px ${fam}`;
  const tw = Math.max(...lines.map(l => x.measureText(l).width)), lh = size * 1.25;
  cv.width = Math.ceil(tw + pad * 2 + (o.extraW || 0) * S); cv.height = Math.ceil(lh * lines.length + pad * 2 - size * .25);
  const tex = new T.CanvasTexture(cv); tex.encoding = T.sRGBEncoding; tex.anisotropy = 4;
  const draw = () => {
    x.clearRect(0, 0, cv.width, cv.height);
    if (o.bg) { x.fillStyle = o.bg; const r = (o.radius ?? 12) * S; x.beginPath(); x.roundRect(0, 0, cv.width, cv.height, r); x.fill(); if (o.border) { x.strokeStyle = o.border; x.lineWidth = 3 * S; x.stroke(); } }
    x.font = `${w0} ${size}px ${fam}`; x.textBaseline = 'middle'; x.fillStyle = o.col || '#ffffff';
    x.textAlign = o.align === 'left' ? 'left' : 'center';
    lines.forEach((l, i) => x.fillText(l, o.align === 'left' ? pad : cv.width / 2, pad + lh * i + size * .5));
    tex.needsUpdate = true;
  };
  draw(); LABELS.push(draw);
  const h = o.h || 40, w = h * cv.width / cv.height;
  const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: T.DoubleSide, toneMapped: false }));
  m.userData = { w, h, redraw: draw, canvas: cv };
  if (o.order != null) m.renderOrder = o.order;
  return m;
}

// ---------- 运镜：关键帧 [小节, 位置, 看向, fov, 移动时长, 缓动] ----------
// 每个关键帧从上一个关键帧的终点出发；handheld 给一点手持感（按时间算，可跳转）
function rig(keys, o = {}) {
  const ks = keys.slice().sort((a, b) => a[0] - b[0]);
  const lerp3 = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
  return function (b, t, cam) {
    let i = 0; while (i + 1 < ks.length && b >= ks[i + 1][0]) i++;
    const k1 = ks[i], k0 = ks[Math.max(0, i - 1)];
    const e = k1[5] === 'lin' ? (x => x) : k1[5] === 'out' ? out : io;
    const k = i === 0 ? 1 : e(prog(b, k1[0], k1[0] + (k1[4] ?? 2)));
    const p = lerp3(k0[1], k1[1], k), q = lerp3(k0[2], k1[2], k), fov = k0[3] + (k1[3] - k0[3]) * k;
    const hh = (o.handheld ?? 1) * (k1[6] ?? 1), s = (a, f) => Math.sin(t * f + a) * hh;
    cam.position.set(p[0] + s(0, .31) * 4 + s(2, .73) * 1.5, p[1] + s(1, .27) * 3, p[2] + s(3, .23) * 4);
    cam.up.set(0, 1, 0);
    cam.lookAt(q[0] + s(4, .19) * 2, q[1] + s(5, .29) * 2, q[2]);
    cam.fov = fov; cam.near = o.near || 5; cam.far = o.far || 20000;
    cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    return { p, q, fov };
  };
}

// 世界坐标 → 1920×1080 画布坐标（[x, y, 在镜头前]）
function proj(T, cam, v) {
  const V = (proj.V = proj.V || new T.Vector3());
  V.copy(v).project(cam);
  return [(V.x + 1) / 2 * 1920, (1 - V.y) / 2 * 1080, V.z < 1 && V.z > -1];
}

// ---------- 碎裂：从一个盒子体积里飞出的碎块 ----------
// const s = shards(T, { n, size:[w,h,d], col:[...], seed }); s.mesh 加进场景；s.set(k, origin)（k 0..1）
function shards(T, o = {}) {
  const n = o.n || 120, [W, H, D] = o.size || [100, 100, 100], r = rnd(o.seed || 3);
  const mesh = new T.InstancedMesh(new T.BoxGeometry(1, 1, 1), new T.MeshStandardMaterial({ roughness: .45, metalness: o.metal ?? .4, emissive: o.glow ? col(T, o.glow) : 0x000000, emissiveIntensity: .6 }), n);
  mesh.castShadow = true;
  const C = new T.Color(), cols = o.col || ['#3a4250', '#59627a', '#ff5a3a'];
  const P = Array.from({ length: n }, (_, i) => {
    mesh.setColorAt(i, C.set(cols[i % cols.length]).convertSRGBToLinear());
    const p = [(r() - .5) * W, (r() - .5) * H, (r() - .5) * D];
    const dir = new T.Vector3(p[0] / W + (r() - .5) * .8, p[1] / H + r() * .9 + .1, p[2] / D + (r() - .5) * .8).normalize();
    return { p, dir, v: (o.speed || 1) * (W + H) * (.6 + r() * 1.4), s: [W * (.04 + r() * .12), H * (.04 + r() * .12), D * (.04 + r() * .12)], rot: [(r() - .5) * 12, (r() - .5) * 12, (r() - .5) * 8] };
  });
  const M = new T.Matrix4(), Q = new T.Quaternion(), E = new T.Euler(), V = new T.Vector3(), S = new T.Vector3();
  function set(k, at, floor = -1e9) {
    mesh.visible = k > 0;
    if (k <= 0) return;
    const ko = out(k);
    P.forEach((d, i) => {
      const dist = d.v * ko;
      let y = at.y + d.p[1] + d.dir.y * dist - (o.grav ?? 1) * (H + W) * 1.2 * k * k;
      y = Math.max(floor + d.s[1] / 2, y);
      V.set(at.x + d.p[0] + d.dir.x * dist, y, at.z + d.p[2] + d.dir.z * dist);
      E.set(d.rot[0] * ko, d.rot[1] * ko, d.rot[2] * ko); Q.setFromEuler(E);
      const sc = 1 - .35 * k; M.compose(V, Q, S.set(d.s[0] * sc, d.s[1] * sc, d.s[2] * sc)); mesh.setMatrixAt(i, M);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  return { mesh, set };
}

// ---------- 钥匙：环 + 杆 + 齿 ----------
function key(T, c = '#ffb020', s = 1, o = {}) {
  const g = new T.Group(), m = mat(T, c, { m: .85, r: .25, e: o.glow ? c : null, ei: o.ei ?? .35 });
  const ring = new T.Mesh(new T.TorusGeometry(9 * s, 3 * s, 10, 24), m); ring.position.x = -14 * s; g.add(ring);
  const bar = new T.Mesh(new T.BoxGeometry(34 * s, 5 * s, 4 * s), m); bar.position.x = 8 * s; g.add(bar);
  [[18, -5], [24, -6]].forEach(([x, y]) => { const t = new T.Mesh(new T.BoxGeometry(4 * s, 8 * s, 4 * s), m); t.position.set(x * s, y * s, 0); g.add(t); });
  g.traverse(o => { if (o.isMesh) o.castShadow = true; });
  g.userData.mat = m;
  return g;
}

// ---------- 浮尘 ----------
function dust(T, n = 400, box = [2000, 800, 2000], c = '#ffffff', size = 3, seed = 7) {
  const r = rnd(seed), pos = new Float32Array(n * 3), base = [];
  for (let i = 0; i < n; i++) base.push([(r() - .5) * box[0], r() * box[1], (r() - .5) * box[2], r() * 6.28]);
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
  const pts = new T.Points(geo, new T.PointsMaterial({ color: col(T, c), size, transparent: true, opacity: .5, depthWrite: false, sizeAttenuation: true }));
  pts.userData.tick = t => { base.forEach((b, i) => { pos[i * 3] = b[0] + Math.sin(t * .2 + b[3]) * 20; pos[i * 3 + 1] = (b[1] + t * 6) % box[1]; pos[i * 3 + 2] = b[2] + Math.cos(t * .17 + b[3]) * 20; }); geo.attributes.position.needsUpdate = true; };
  return pts;
}

// ---------- 玻璃盒（沙箱、柱子） ----------
function glassBox(T, w, h, d, c = '#9ff0e0', o = {}) {
  const g = new T.Group();
  const glass = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshStandardMaterial({ color: col(T, c), transparent: true, opacity: o.a ?? .12, roughness: .05, metalness: .1, depthWrite: false, side: T.DoubleSide }));
  const edge = new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(w, h, d)), new T.LineBasicMaterial({ color: col(T, c), transparent: true, opacity: o.edge ?? .8 }));
  g.add(glass, edge); g.userData = { glass, edge };
  return g;
}

window.MV_K3 = { clawd, label, rig, proj, shards, key, dust, glassBox, mat, col, rnd, prog, io, out };
})();
