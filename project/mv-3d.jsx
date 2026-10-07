// Vibe Coding · 导演剪辑版：Three.js 3D 层
// 世界模块里写 three: (T, U) => ({ scene, update(L, cam) })，T 是 THREE，U 是这里的工具。
// 坐标和 2D 画布一致：1 个单位 = 1920×1080 画布上的 1 像素，用 U.x(px)、U.y(py) 换算；z 朝向镜头。
// 每帧由 mv-core 在世界的 draw 之后调用 MV_3D.draw(ctx, m, L)，渲染结果画进该世界自己的内容层，
// 所以 3D 物体同样经过这个世界的画风着色器，并跟着转场一起走。也可以在 draw 里手动调用 K.three(cx, L) 控制叠放顺序。
// update 必须只依赖 L（随时可以跳到任意时间点），随机数用 U.rnd(seed)。
(() => {
  const SRC = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  const W = 1920, H = 1080, FOV = 30, Z0 = (H / 2) / Math.tan(FOV / 2 * Math.PI / 180);
  let loading = false, rd = null, cam = null;
  function load() {
    if (window.THREE || loading || typeof document === 'undefined') return;
    loading = true;
    const ready = () => window.dispatchEvent(new Event('mv3d-ready'));
    // 页面（dc 文件的 helmet、单文件版）已经引了 three.js 就等它，不重复加载
    const has = document.querySelector('script[src*="three"]');
    if (has) { has.addEventListener('load', ready); return; }
    const s = document.createElement('script'); s.src = SRC; s.async = true;
    s.onload = ready;
    s.onerror = () => console.warn('three.js 没加载成功，3D 层跳过');
    document.head.appendChild(s);
  }
  load();

  const clamp01 = x => Math.max(0, Math.min(1, x));
  const U = {
    W, H, Z0,
    x: px => px - W / 2, y: py => H / 2 - py,
    prog: (x, a, b) => clamp01((x - a) / (b - a)),
    lerp: (a, b, k) => a + (b - a) * k,
    ease: k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2,
    out: k => 1 - Math.pow(1 - clamp01(k), 3),
    back: k => { const c = 1.70158; k = clamp01(k) - 1; return 1 + (c + 1) * k * k * k + c * k * k; },
    rnd: seed => { let s = (seed * 9301 + 49297) % 233280 || 1; return () => (s = (s * 16807) % 2147483647) / 2147483647; },
    // 虹彩薄膜：菲涅耳边缘亮、中间透
    film(T, opts = {}) {
      return new T.ShaderMaterial({
        transparent: true, depthWrite: false, side: T.DoubleSide,
        uniforms: { uT: { value: 0 }, uA: { value: 1 }, uTint: { value: new T.Color(opts.tint || '#ffffff') } },
        vertexShader: 'varying vec3 vN;varying vec3 vV;varying vec3 vP;void main(){vN=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);vV=normalize(-mv.xyz);vP=position;gl_Position=projectionMatrix*mv;}',
        fragmentShader: 'uniform float uT,uA;uniform vec3 uTint;varying vec3 vN;varying vec3 vV;varying vec3 vP;' +
          'vec3 pal(float t){return .55+.45*cos(6.2832*(vec3(0.,.33,.67)+t));}' +
          'void main(){float c=abs(dot(normalize(vN),normalize(vV)));float fr=pow(1.-c,2.2);' +
          'float th=fr*1.6+vP.y*.004+sin(vP.x*.02+uT*.8)*.15+uT*.05;vec3 col=pal(th)*uTint;' +
          'float spec=pow(max(0.,dot(normalize(vN),normalize(vec3(-.4,.6,.7)))),40.);' +
          'gl_FragColor=vec4(col+spec*1.2,uA*(fr*.85+.06+spec*.8));}',
      });
    },
    // 把一个物体在画布坐标 (px, py) 处放好
    at(o, px, py, z = 0) { o.position.set(px - W / 2, H / 2 - py, z); return o; },
  };

  const cache = new WeakMap();
  function sceneFor(m) {
    let s = cache.get(m);
    if (!s) { s = m.three(window.THREE, U); cache.set(m, s); }
    return s;
  }
  function renderer(w, h) {
    const T = window.THREE;
    if (!rd) {
      rd = new T.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true, premultipliedAlpha: true });
      rd.setPixelRatio(1); rd.setClearColor(0x000000, 0);
      rd.outputEncoding = T.sRGBEncoding;
      rd.shadowMap.enabled = true; rd.shadowMap.type = T.PCFSoftShadowMap;
      cam = new T.PerspectiveCamera(FOV, W / H, 10, 8000);
    }
    const c = rd.domElement;
    if (c.width !== w || c.height !== h) rd.setSize(w, h, false);
    return rd;
  }
  // ctx 是该世界内容层的 2D 上下文（已按 res/W 缩放），画进 0..W × 0..H
  function draw(ctx, m, L, opts = {}) {
    if (!m.three || !window.THREE) return false;
    let s;
    try { s = sceneFor(m); } catch (e) { console.warn('3D 场景构建失败', m.id, e); m.three = null; return false; }
    const r = renderer(ctx.canvas.width, ctx.canvas.height);
    cam.position.set(0, 0, Z0); cam.up.set(0, 1, 0); cam.fov = FOV; cam.zoom = 1; cam.near = 10; cam.far = 8000; cam.lookAt(0, 0, 0);
    r.toneMapping = window.THREE.NoToneMapping; r.toneMappingExposure = 1;
    U.renderer = r;
    const vis = s.update(L, cam, U);
    if (vis === false) return false;
    cam.updateProjectionMatrix();
    r.clear(); r.render(s.scene, cam);
    ctx.save();
    if (opts.alpha != null) ctx.globalAlpha *= opts.alpha;
    if (opts.blend) ctx.globalCompositeOperation = opts.blend;
    ctx.drawImage(r.domElement, 0, 0, W, H);
    ctx.restore();
    return true;
  }
  window.MV_3D = { draw, U, load, ready: () => !!window.THREE };
})();
