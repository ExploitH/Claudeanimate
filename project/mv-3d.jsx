// Vibe Coding · 导演剪辑版：Three.js 3D 场景层
// 每个世界注册 3D 场景，渲染后叠加在 Canvas 2D 层之上。
// window.MV_3D.render(worldId, b, t, res) → 返回 OffscreenCanvas 或 null

const MV3D = (() => {
  // ---------- 单例渲染器（复用，不每帧重建）----------
  let renderer = null, camera = null, outCanvas = null, outCtx = null;

  function ensureRenderer(w, h) {
    if (!renderer) {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, premultipliedAlpha: false });
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);
      camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 2000);
      camera.position.set(0, 0, Math.min(w, h) * 0.75);
    }
    if (renderer.domElement.width !== w || renderer.domElement.height !== h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.fov = 50;
      camera.updateProjectionMatrix();
    }
    if (!outCanvas || outCanvas.width !== w || outCanvas.height !== h) {
      outCanvas = document.createElement('canvas');
      outCanvas.width = w; outCanvas.height = h;
      outCtx = outCanvas.getContext('2d');
    }
    return { renderer, camera, outCanvas, outCtx };
  }

  // ---------- 场景缓存 ----------
  const scenes = {};

  // ---------- 工具函数 ----------
  const clamp01 = x => Math.max(0, Math.min(1, x));
  const prog = (x, a, b) => clamp01((x - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;

  // ============================================================
  // W01：3D 肥皂泡（虹彩薄膜球体 + 破碎粒子）
  // ============================================================
  function makeW01() {
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const BUB_DATA = [
      { x: -480, popAt: 11.5, born: 10.5 },
      { x: -160, popAt: 12.0, born: 10.8 },
      { x:  160, popAt: 12.25, born: 11.0 },
      { x:  480, popAt: 12.5, born: 11.2 },
    ];

    // 虹彩薄膜着色器
    const irisVert = `
      varying vec3 vNormal;
      varying vec3 vView;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `;
    const irisFrag = `
      uniform float uT;
      uniform float uAlpha;
      varying vec3 vNormal;
      varying vec3 vView;
      vec3 hsl2rgb(float h, float s, float l) {
        float c = (1.0 - abs(2.0*l - 1.0)) * s;
        float x = c * (1.0 - abs(mod(h*6.0, 2.0) - 1.0));
        float m = l - c*0.5;
        vec3 rgb;
        float hh = mod(h*6.0, 6.0);
        if      (hh < 1.0) rgb = vec3(c, x, 0.0);
        else if (hh < 2.0) rgb = vec3(x, c, 0.0);
        else if (hh < 3.0) rgb = vec3(0.0, c, x);
        else if (hh < 4.0) rgb = vec3(0.0, x, c);
        else if (hh < 5.0) rgb = vec3(x, 0.0, c);
        else               rgb = vec3(c, 0.0, x);
        return rgb + m;
      }
      void main() {
        float fr = pow(1.0 - abs(dot(vNormal, vView)), 1.8);
        float hue = dot(vNormal, vec3(0.577)) * 0.5 + 0.5 + uT * 0.2;
        vec3 film = hsl2rgb(fract(hue), 0.9, 0.55 + fr * 0.2);
        // 内部薄膜透明度
        float filmAlpha = fr * 0.55 + 0.08;
        gl_FragColor = vec4(film, uAlpha * filmAlpha);
      }
    `;

    const bubbles = BUB_DATA.map((d, i) => {
      const geo = new THREE.SphereGeometry(76, 48, 48);
      const mat = new THREE.ShaderMaterial({
        transparent: true, side: THREE.DoubleSide, depthWrite: false,
        uniforms: { uT: { value: 0 }, uAlpha: { value: 0 } },
        vertexShader: irisVert, fragmentShader: irisFrag,
      });
      const mesh = new THREE.Mesh(geo, mat);

      // 高光弧
      const arcGeo = new THREE.TorusGeometry(60, 2.5, 8, 32, Math.PI * 0.7);
      const arcMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 });
      const arc = new THREE.Mesh(arcGeo, arcMat);
      arc.rotation.z = 0.4; arc.rotation.x = 0.5;
      mesh.add(arc);
      mesh.userData = { d, mat, arcMat };
      scene.add(mesh);
      return mesh;
    });

    // 破碎粒子
    const partsByBub = BUB_DATA.map(() => {
      const ps = [];
      for (let j = 0; j < 14; j++) {
        const g = new THREE.SphereGeometry(3 + Math.random() * 4, 6, 6);
        const m = new THREE.MeshBasicMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0 });
        const mesh = new THREE.Mesh(g, m);
        mesh.userData = { a: j / 14 * Math.PI * 2, mat: m };
        scene.add(mesh); ps.push(mesh);
      }
      return ps;
    });

    return {
      scene,
      update(b, t) {
        bubbles.forEach((mesh, i) => {
          const d = mesh.userData.d;
          const appear = prog(b, d.born, d.popAt);
          if (appear <= 0) { mesh.visible = false; return; }
          mesh.visible = true;

          // 位置：从屏幕下方飘入（Three.js Y轴朝上，中心=(0,0)对应画面中心）
          const bx = d.x;
          const targetY = -(520 - (Math.abs(d.x) % 300) * 0.25 - 540); // 从 CSS 坐标转 Three.js
          const startY = -700;
          const fy = lerp(startY, targetY, appear);
          const xOsc = bx + Math.sin(t * 1.3 + d.x) * 14;
          mesh.position.set(xOsc, fy, 0);

          mesh.rotation.y = t * 0.4 + i * 1.1;
          mesh.rotation.x = t * 0.2;
          mesh.userData.mat.uniforms.uT.value = t;
          mesh.userData.arcMat.opacity = 0.65;

          if (b < d.popAt) {
            mesh.userData.mat.uniforms.uAlpha.value = 1;
            mesh.scale.setScalar(1);
            // 隐藏粒子
            partsByBub[i].forEach(p => { p.userData.mat.opacity = 0; });
          } else {
            const p2 = prog(b, d.popAt, d.popAt + 0.45);
            mesh.userData.mat.uniforms.uAlpha.value = 1 - p2;
            mesh.scale.setScalar(1 + p2 * 0.7);
            mesh.userData.arcMat.opacity = (1 - p2) * 0.65;
            // 粒子
            partsByBub[i].forEach((pm, j) => {
              const pd = pm.userData;
              const dist = 76 * (1 + p2 * 1.4);
              pm.position.set(
                xOsc + Math.cos(pd.a) * dist,
                fy + Math.sin(pd.a) * dist * 0.7 + p2 * p2 * 60,
                0
              );
              pd.mat.opacity = (1 - p2) * 0.75;
            });
            if (p2 >= 1) mesh.visible = false;
          }
        });
      },
    };
  }

  // ============================================================
  // W02：3D 上下文窗口圆环（金属圆环 + 流光）
  // ============================================================
  function makeW02() {
    const scene = new THREE.Scene();

    const torusGeo = new THREE.TorusGeometry(290, 16, 48, 128);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x3a70c0, metalness: 0.85, roughness: 0.15,
      transparent: true, opacity: 0,
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torus);

    // 内壁高光条
    const innerGeo = new THREE.TorusGeometry(287, 4, 8, 128);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(innerGeo, innerMat));

    // 流光粒子
    const glowGeo = new THREE.SphereGeometry(12, 12, 12);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    scene.add(glow);

    // 穿越圈壁时的光环（卡片进入效果）
    const rimGeo = new THREE.TorusGeometry(290, 28, 8, 64);
    const rimMat = new THREE.MeshBasicMaterial({ color: 0x9fd8ff, transparent: true, opacity: 0 });
    scene.add(new THREE.Mesh(rimGeo, rimMat));

    const ambient = new THREE.AmbientLight(0x223355, 1.5);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x9fd8ff, 3);
    dirLight.position.set(300, 400, 500);
    scene.add(dirLight);
    const rimLight = new THREE.DirectionalLight(0x334488, 2);
    rimLight.position.set(-200, -150, -300);
    scene.add(rimLight);

    // 卡片进入时的光晕闪烁（b≈3.5~5.5）
    let rimPulse = 0;

    return {
      scene,
      update(b, t) {
        const appear = prog(b, 0.2, 1.2);
        const shrink = prog(b, 15, 15.6);
        const k = appear * (1 - shrink * 0.25);

        torusMat.opacity = k * 0.9;
        innerMat.opacity = k * 0.2;
        glowMat.opacity = k * (0.7 + 0.2 * Math.sin(t * 3.5));

        // 轻微倾斜 + 慢旋
        torus.rotation.x = 0.12 + Math.sin(t * 0.18) * 0.06;
        torus.rotation.y = t * 0.05;
        const innerMesh = scene.children[1];
        innerMesh.rotation.copy(torus.rotation);

        // 流光沿圆环
        const a = t * 1.3;
        glow.position.set(Math.cos(a) * 290, Math.sin(a) * 290, Math.sin(a * 0.5) * 20);

        // 卡片进入闪烁（b=3.5~5.5，4张卡片各 0.5 拍一张）
        rimPulse = 0;
        [3.5, 3.75, 4.0, 4.25].forEach(at => {
          rimPulse = Math.max(rimPulse, Math.exp(-(b - at) * 12) * (b > at ? 1 : 0));
        });
        rimMat.opacity = k * rimPulse * 0.5;

        // 缩移向左（b=15后）
        const wx = lerp(0, -380, shrink);
        torus.position.x = wx;
        scene.children[1].position.x = wx;
        scene.children[2].position.x = wx;
        scene.children[3].position.x = wx;
        glow.position.x += wx;
      },
    };
  }

  // ============================================================
  // W07：3D 存档水晶 + GAME OVER 碎片
  // ============================================================
  function makeW07() {
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x334466, 1.8));
    const pt = new THREE.PointLight(0x9fd8ff, 4, 600);
    pt.position.set(0, 200, 200);
    scene.add(pt);

    // 三颗水晶（位置对应 canvas 坐标：330/600/870 → Three.js X）
    const SAVE_X = [330 - 960, 600 - 960, 870 - 960];
    const crystals = SAVE_X.map((cx, i) => {
      const geo = new THREE.OctahedronGeometry(36, 0);
      const mat = new THREE.MeshPhongMaterial({
        color: 0x29adff, emissive: 0x0a3060,
        shininess: 200, transparent: true, opacity: 0,
      });
      const mesh = new THREE.Mesh(geo, mat);

      // 内核
      const cGeo = new THREE.OctahedronGeometry(20, 0);
      const cMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
      mesh.add(new THREE.Mesh(cGeo, cMat));

      // 小刻面（反光面）
      for (let f = 0; f < 4; f++) {
        const fGeo = new THREE.TetrahedronGeometry(14, 0);
        const fMat = new THREE.MeshPhongMaterial({
          color: 0x9fd8ff, shininess: 300, transparent: true, opacity: 0,
        });
        const fm = new THREE.Mesh(fGeo, fMat);
        const a = f / 4 * Math.PI * 2;
        fm.position.set(Math.cos(a) * 28, Math.sin(a) * 28, 0);
        mesh.add(fm);
      }

      mesh.position.set(cx, -180, 0);
      mesh.userData = { mat, cMat, showAt: 6 + i * 0.5, i };
      scene.add(mesh);
      return mesh;
    });

    // GAME OVER 碎片（三颗心，每心 18 片）
    const shards = [];
    for (let hi = 0; hi < 3; hi++) {
      for (let j = 0; j < 18; j++) {
        const s = 8 + Math.random() * 16;
        const geo = new THREE.BoxGeometry(s, s * (0.5 + Math.random()), s * 0.4);
        const mat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(0.8 + Math.random() * 0.2, 0, 0.2 * Math.random()),
          transparent: true, opacity: 0,
        });
        const m = new THREE.Mesh(geo, mat);
        const a = j / 18 * Math.PI * 2;
        m.userData = {
          mat, hi, dieAt: 13 + hi * 0.5,
          vx: Math.cos(a) * (1.5 + Math.random() * 2.5),
          vy: (0.5 + Math.random() * 2),
          vz: Math.sin(a) * (1 + Math.random() * 2),
          rx: (Math.random() - 0.5) * 0.2,
          ry: (Math.random() - 0.5) * 0.15,
          hx: 1440 + hi * 70 - 960, hy: 150 - 540, // heart center
        };
        scene.add(m);
        shards.push(m);
      }
    }

    return {
      scene,
      update(b, t) {
        crystals.forEach(mesh => {
          const d = mesh.userData;
          const k = prog(b, d.showAt, d.showAt + 0.35);
          const fadeOut = b >= 13 ? prog(b, 13, 13.4) : 0;
          const alpha = k * (1 - fadeOut);
          d.mat.opacity = alpha * 0.88;
          d.cMat.opacity = alpha * (0.3 + 0.25 * Math.sin(t * 4 + d.i));
          mesh.children.slice(1).forEach(fm => { fm.material.opacity = alpha * 0.7; });

          mesh.position.y = -180 + Math.sin(t * 4 + d.i * 1.3) * 7;
          mesh.rotation.y = t * 1.3 + d.i * 2.1;
          mesh.rotation.x = t * 0.45;
        });

        shards.forEach(m => {
          const d = m.userData;
          const k = prog(b, d.dieAt, d.dieAt + 0.55);
          if (k <= 0) { d.mat.opacity = 0; return; }
          const fade = 1 - k;
          d.mat.opacity = Math.min(0.85, k * 4) * fade;
          m.position.set(
            d.hx + d.vx * k * 140,
            d.hy + d.vy * k * 140 - k * k * 120,
            d.vz * k * 80
          );
          m.rotation.x += d.rx;
          m.rotation.y += d.ry;
        });
      },
    };
  }

  // ============================================================
  // W09：3D 服务器机箱 + 删库爆炸
  // ============================================================
  function makeW09() {
    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x111122, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 1.8);
    dir.position.set(400, 600, 400);
    scene.add(dir);

    // 爆炸点光源
    const expLight = new THREE.PointLight(0xff4400, 0, 900);
    expLight.position.set(280, 50, 60);
    scene.add(expLight);

    // 服务器机箱（位置对应画面右侧）
    const boxX = 280, boxY = -50;
    const boxGeo = new THREE.BoxGeometry(260, 160, 110);
    const boxMat = new THREE.MeshPhongMaterial({ color: 0x1a1d24, emissive: 0x060709, shininess: 55 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.set(boxX, boxY, 0);
    scene.add(box);

    // 磁盘托架
    [-35, 35].forEach((dy, i) => {
      const dGeo = new THREE.BoxGeometry(200, 44, 8);
      const dMat = new THREE.MeshPhongMaterial({ color: 0x2a3140, shininess: 30 });
      const d = new THREE.Mesh(dGeo, dMat);
      d.position.set(0, dy, 58);
      box.add(d);
      // LED 指示灯
      const lGeo = new THREE.SphereGeometry(4, 6, 6);
      const lMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x00ff66 : 0x3399ff });
      const l = new THREE.Mesh(lGeo, lMat);
      l.position.set(80, 0, 4.5);
      d.add(l);
    });

    // 60 片爆炸碎片
    const shards = [];
    for (let i = 0; i < 60; i++) {
      const s = 12 + Math.random() * 24;
      const geo = new THREE.BoxGeometry(s, s * (0.4 + Math.random() * 0.8), s * 0.35);
      const lum = 0.15 + Math.random() * 0.25;
      const mat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(lum, lum * 0.8, lum * 0.6),
        transparent: true, opacity: 0,
      });
      const m = new THREE.Mesh(geo, mat);
      const a = Math.random() * Math.PI * 2;
      const el = (Math.random() - 0.5) * Math.PI;
      const spd = 1.8 + Math.random() * 3.2;
      m.userData = {
        mat, depth: 0.35 + Math.random() * 0.65,
        vx: Math.cos(a) * Math.cos(el) * spd,
        vy: Math.sin(el) * spd + 1.2,
        vz: Math.sin(a) * Math.cos(el) * spd,
        rx: (Math.random() - 0.5) * 0.22,
        ry: (Math.random() - 0.5) * 0.16,
      };
      m.position.set(boxX, boxY, 0);
      scene.add(m); shards.push(m);
    }

    // 爆炸火球
    const fireGeo = new THREE.SphereGeometry(1, 16, 16);
    const fireMat = new THREE.MeshBasicMaterial({ color: 0xff6020, transparent: true, opacity: 0 });
    const fire = new THREE.Mesh(fireGeo, fireMat);
    fire.position.set(boxX, boxY, 0);
    scene.add(fire);

    // 白闪遮盖面
    const flashGeo = new THREE.PlaneGeometry(4000, 2000);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
    const flashPlane = new THREE.Mesh(flashGeo, flashMat);
    flashPlane.position.z = 100;
    scene.add(flashPlane);

    return {
      scene,
      update(b, t) {
        // 机箱可见（b=0.95~11.9）
        const boxVis = prog(b, 0.95, 1.15) * (1 - prog(b, 11.85, 12.05));
        box.visible = boxVis > 0.01;
        box.rotation.y = Math.sin(t * 0.3) * 0.05;
        box.rotation.x = Math.sin(t * 0.2) * 0.02;

        // 爆炸（b=11 触发，静音1拍后在 b=12 爆炸）
        const explode = prog(b, 11.75, 12.0); // 静一拍再炸
        const explodeSpread = prog(b, 12.0, 12.8);

        flashMat.opacity = Math.max(0, 1 - b + 12) > 0 ? prog(b, 11.95, 12.05) * 0.95 : 0;
        expLight.intensity = explode * (1 - explodeSpread * 0.6) * 16;

        if (explodeSpread > 0) {
          box.visible = false;
          fire.scale.setScalar(Math.max(1, explodeSpread * 200));
          fireMat.opacity = (1 - explodeSpread) * 0.85;

          shards.forEach(m => {
            const d = m.userData;
            const t2 = explodeSpread;
            d.mat.opacity = Math.min(0.88, t2 * 4) * Math.max(0, 1 - (t2 - 0.3) * 2) * d.depth;
            m.position.set(
              boxX + d.vx * t2 * 180,
              boxY + d.vy * t2 * 180 - t2 * t2 * 90,
              d.vz * t2 * 130
            );
            m.rotation.x += d.rx;
            m.rotation.y += d.ry;
          });
        } else {
          shards.forEach(m => { m.userData.mat.opacity = 0; });
          fire.scale.setScalar(1);
          fireMat.opacity = 0;
        }

        // 平静后（b≥16）：机箱消失
        if (b >= 16) box.visible = false;
      },
    };
  }

  // ============================================================
  // 场景构建器
  // ============================================================
  const BUILDERS = {
    w01: makeW01,
    w02: makeW02,
    w07: makeW07,
    w09: makeW09,
  };

  function getScene(id) {
    if (!scenes[id] && BUILDERS[id]) scenes[id] = BUILDERS[id]();
    return scenes[id] || null;
  }

  // ---------- 公开接口 ----------
  return {
    render(worldId, b, t, res) {
      if (typeof THREE === 'undefined') return null;
      const sc = getScene(worldId);
      if (!sc) return null;

      const [w, h] = res;
      const { renderer: rdr, camera: cam, outCanvas: oc, outCtx: octx } = ensureRenderer(w, h);

      sc.update(b, t);
      rdr.setClearColor(0x000000, 0);
      rdr.clear();
      rdr.render(sc.scene, cam);

      octx.clearRect(0, 0, w, h);
      octx.drawImage(rdr.domElement, 0, 0, w, h);
      return oc;
    },

    warmup(id) { getScene(id); },
  };
})();

window.MV_3D = MV3D;

