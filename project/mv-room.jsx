// Vibe Coding · 电影版：现实里的那间宿舍（three.js）
// 一间雨夜的宿舍：窗外城市、窗上的雨、书桌、亮着的笔记本、咖啡、台灯、墙上的钟、手机、坐在桌前的「你」（只拍背影）。
// 现实戏都用这一个场景，各场戏只改时间、镜头、屏幕内容和情绪。
// window.MV_REAL(K, cfg) 生成一场现实戏的世界模块；单位是厘米，原点在地板中央，-z 是窗户那面墙。
(() => {
const SHOTS = {
  // [相机位置, 看向, 视场角]
  street: [[112, 160, -480], [60, 120, -150], 34],   // 窗外雨里，看着亮灯的窗
  window: [[108, 150, -250], [45, 108, -150], 40],   // 刚穿过窗户
  wide: [[215, 175, 150], [5, 95, -130], 42],      // 房间全景
  desk: [[-28, 150, -34], [46, 96, -146], 36],     // 过肩看书桌和屏幕
  over: [[-4, 130, -64], [44, 92, -148], 31],      // 更近的过肩
  screen: [[40, 95.5, -88], [40, 90.5, -146], 28], // 屏幕特写
  into: [[40, 90.6, -124], [40, 90.4, -150], 28],  // 推进屏幕里
  note: [[78, 104, -104], [70, 78.5, -123], 34],   // 便利贴
  phone: [[-6, 120, -112], [-6, 77.5, -128], 34],  // 手机
  clock: [[-95, 186, -120], [-122, 198, -198], 26], // 墙上的钟
  mug: [[100, 96, -100], [84, 83, -128], 34],       // 咖啡
  face: [[150, 120, -150], [40, 112, -110], 34],    // 从侧前方看你（逆光剪影）
  lamp: [[-60, 120, -60], [-18, 110, -160], 38],    // 台灯和窗
};
const lerp = (a, b, k) => a + (b - a) * k, clamp01 = x => Math.max(0, Math.min(1, x));
const io = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const shotOf = s => typeof s === 'string' ? SHOTS[s] : s;

// ---------- 画布贴图 ----------
function canvasTex(T, w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; const t = new T.CanvasTexture(c); t.encoding = T.sRGBEncoding; t.anisotropy = 4; return { c, x: c.getContext('2d'), t }; }
function drawCity(x, w, h, dawn) {
  const g = x.createLinearGradient(0, 0, 0, h);
  if (dawn > 0) { g.addColorStop(0, `rgb(${lerp(14, 120, dawn)},${lerp(18, 150, dawn)},${lerp(40, 205, dawn)})`); g.addColorStop(.7, `rgb(${lerp(30, 255, dawn)},${lerp(30, 190, dawn)},${lerp(55, 140, dawn)})`); g.addColorStop(1, `rgb(${lerp(40, 255, dawn)},${lerp(30, 160, dawn)},${lerp(50, 110, dawn)})`); }
  else { g.addColorStop(0, '#05070f'); g.addColorStop(.65, '#121a33'); g.addColorStop(1, '#2a2440'); }
  x.fillStyle = g; x.fillRect(0, 0, w, h);
  let s = 7; const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let layer = 0; layer < 3; layer++) {
    const base = h * (.5 + layer * .12), dark = [`#0b1022`, `#080b18`, `#05070f`][layer];
    for (let bx = -20; bx < w;) {
      const bw = 40 + r() * 110, bh = (90 + r() * 260) * (1 - layer * .2);
      x.fillStyle = dawn > 0 ? `rgba(${lerp(8, 70, dawn * (1 - layer * .3))},${lerp(10, 60, dawn)},${lerp(22, 80, dawn)},1)` : dark; x.fillRect(bx, base - bh, bw, h);
      for (let wy = base - bh + 10; wy < h - 6; wy += 14) for (let wx = bx + 6; wx < bx + bw - 6; wx += 12) {
        if (r() < .32 * (1 - dawn * .8)) { x.fillStyle = r() < .7 ? `rgba(255,${190 + r() * 50},${120 + r() * 60},${.5 + r() * .5})` : `rgba(160,200,255,${.4 + r() * .4})`; x.fillRect(wx, wy, 5, 7); }
      }
      bx += bw + r() * 8;
    }
  }
  if (dawn <= 0) for (let i = 0; i < 60; i++) { const bx = r() * w, by = h * (.55 + r() * .4), rr = 6 + r() * 26, gg = x.createRadialGradient(bx, by, 0, bx, by, rr); const c = r() < .5 ? '255,170,90' : r() < .5 ? '255,80,120' : '120,180,255'; gg.addColorStop(0, `rgba(${c},.55)`); gg.addColorStop(1, `rgba(${c},0)`); x.fillStyle = gg; x.fillRect(bx - rr, by - rr, rr * 2, rr * 2); }
}
function drawWood(x, w, h) {
  x.fillStyle = '#3a2a20'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 12; i++) { const y = i * h / 12; x.fillStyle = i % 2 ? '#43301f' : '#3b2b1d'; x.fillRect(0, y, w, h / 12 - 2); for (let k = 0; k < 30; k++) { x.strokeStyle = `rgba(20,12,6,${.08 + Math.random() * .1})`; x.beginPath(); const yy = y + Math.random() * h / 12; x.moveTo(0, yy); x.bezierCurveTo(w * .3, yy + 3, w * .6, yy - 3, w, yy + 1); x.stroke(); } }
}
function drawClock(x, s, hh, mm) {
  x.clearRect(0, 0, s, s); const c = s / 2;
  x.fillStyle = '#efe9dd'; x.beginPath(); x.arc(c, c, c * .96, 0, 6.283); x.fill();
  x.lineWidth = s * .04; x.strokeStyle = '#2a2a2e'; x.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; x.lineWidth = i % 3 ? s * .012 : s * .028; x.beginPath(); x.moveTo(c + Math.sin(a) * c * .78, c - Math.cos(a) * c * .78); x.lineTo(c + Math.sin(a) * c * .88, c - Math.cos(a) * c * .88); x.stroke(); }
  const ha = ((hh % 12) + mm / 60) / 12 * 6.283, ma = mm / 60 * 6.283;
  x.lineCap = 'round'; x.strokeStyle = '#1d1d22';
  x.lineWidth = s * .045; x.beginPath(); x.moveTo(c, c); x.lineTo(c + Math.sin(ha) * c * .48, c - Math.cos(ha) * c * .48); x.stroke();
  x.lineWidth = s * .03; x.beginPath(); x.moveTo(c, c); x.lineTo(c + Math.sin(ma) * c * .72, c - Math.cos(ma) * c * .72); x.stroke();
  x.fillStyle = '#d97757'; x.beginPath(); x.arc(c, c, s * .035, 0, 6.283); x.fill();
}
function drawNote(x, s, lines, crossed) {
  x.fillStyle = '#ffe27a'; x.fillRect(0, 0, s, s);
  x.fillStyle = 'rgba(0,0,0,.06)'; x.fillRect(0, 0, s, s * .14);
  x.fillStyle = '#3a2f20'; x.textBaseline = 'middle';
  lines.forEach((l, i) => { x.font = `${i ? 600 : 900} ${i ? s * .085 : s * .13}px "Ma Shan Zheng","Noto Sans SC",sans-serif`; x.fillText(l, s * .08, s * (.28 + i * .17)); });
  if (crossed) { x.strokeStyle = 'rgba(200,40,40,.85)'; x.lineWidth = s * .03; x.beginPath(); x.moveTo(s * .06, s * .3); x.lineTo(s * .94 * crossed, s * .3 + s * .02); x.stroke(); }
}

// ---------- 屏幕：IDE + 对话面板 ----------
const CODE = ['public class UserService {', '    private final UserRepository repo;', '', '    public User login(String username, String password) {', '        User u = repo.findByUsername(username);', '        if (u == null) return null;', '        // TODO', '    }', '}'];
function drawScreen(x, w, h, L, cfg, chat, S) {
  const t = L.t;
  x.fillStyle = '#16171c'; x.fillRect(0, 0, w, h);
  x.fillStyle = '#1e1f26'; x.fillRect(0, 0, w, 34);
  ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(20 + i * 20, 17, 6, 0, 6.283); x.fill(); });
  x.font = '500 15px "JetBrains Mono",monospace'; x.fillStyle = '#9aa0ab'; x.fillText('library-system — UserService.java', 90, 22);
  // 左边代码
  const cw = w * .58; x.fillStyle = '#1a1b21'; x.fillRect(0, 34, 46, h - 34);
  const lines = cfg.code || CODE, scroll = cfg.codeScroll ? cfg.codeScroll(L, S) : 0;
  x.save(); x.beginPath(); x.rect(0, 34, cw, h - 34); x.clip();
  lines.forEach((l, i) => {
    const y = 64 + i * 26 - scroll; if (y < 30 || y > h + 20) return;
    x.fillStyle = '#4a4e5a'; x.font = '400 15px "JetBrains Mono",monospace'; x.fillText(String(i + 1), 12, y);
    x.fillStyle = /\/\//.test(l) ? '#6b7280' : /public|private|return|if|final|class|new/.test(l) ? '#c792ea' : '#d6d9e0';
    x.font = '400 16px "JetBrains Mono",monospace'; x.fillText(l, 58, y);
  });
  if (cfg.codeOverlay) cfg.codeOverlay(x, cw, h, L, S);
  x.restore();
  // 右边对话面板
  const px0 = cw + 1; x.fillStyle = '#121318'; x.fillRect(px0, 34, w - px0, h - 34);
  x.fillStyle = '#d97757'; x.fillRect(px0 + 14, 46, 22, 16); x.fillStyle = '#1d1210'; x.fillRect(px0 + 19, 51, 3, 5); x.fillRect(px0 + 28, 51, 3, 5);
  x.font = '700 15px "Noto Sans SC",sans-serif'; x.fillStyle = '#e8e9ee'; x.fillText('Clawd', px0 + 44, 60);
  let y = h - 70;
  const vis = chat.filter(m => L.b >= m.at).slice(-6).reverse();
  for (const m of vis) {
    const me = !!m.me, s = (me ? m.me : m.you).replace(/[‹›«»]/g, ''), n = me ? s.length : Math.min(s.length, Math.floor(clamp01((L.b - m.at - .03) / Math.max(.05, Math.min(.5, s.length * .028))) * s.length + 1e-6));
    if (me && L.b < m.at + .5 + (m.wait || 0)) { x.fillStyle = '#2a1d18'; roundR(x, px0 + 14, y - 26, 60, 30, 10); x.fill(); x.fillStyle = '#d97757'; for (let i = 0; i < 3; i++) { x.globalAlpha = .4 + .6 * (Math.floor(t * 6 + i) % 3 === 0); x.beginPath(); x.arc(px0 + 30 + i * 14, y - 11, 3.5, 0, 6.283); x.fill(); } x.globalAlpha = 1; y -= 44; continue; }
    x.font = '500 15px "Noto Sans SC",sans-serif';
    const wrapped = wrapCJK(x, s.slice(0, n), (w - px0) * .78);
    const bh = wrapped.length * 20 + 14, bw = Math.min((w - px0) * .82, Math.max(...wrapped.map(l => x.measureText(l).width)) + 22);
    const bx = me ? px0 + 14 : w - 14 - bw;
    x.fillStyle = me ? '#2a1d18' : '#e9e9ec'; roundR(x, bx, y - bh, bw, bh, 10); x.fill();
    x.fillStyle = me ? '#f6efe8' : '#16171c'; wrapped.forEach((l, i) => x.fillText(l, bx + 11, y - bh + 20 + i * 20));
    y -= bh + 12; if (y < 80) break;
  }
  // 输入框
  x.fillStyle = '#1c1d24'; roundR(x, px0 + 12, h - 50, w - px0 - 24, 36, 10); x.fill();
  x.fillStyle = '#5d626c'; x.font = '400 14px "Noto Sans SC",sans-serif'; x.fillText(cfg.inputHint || '给 Clawd 发消息', px0 + 24, h - 27);
  if (cfg.screenOverlay) cfg.screenOverlay(x, w, h, L, S);
}
function roundR(x, a, b, w, h, r) { x.beginPath(); x.roundRect(a, b, w, h, r); }
function wrapCJK(x, s, maxW) { const out = []; let l = ''; for (const ch of s) { if (x.measureText(l + ch).width > maxW && l) { out.push(l); l = ''; } l += ch; } out.push(l); return out; }

// ---------- 场景 ----------
let ROOM = null;
function build(T) {
  if (ROOM) return ROOM;
  const scene = new T.Scene();
  scene.fog = new T.FogExp2(0x070910, .0011);
  const std = (c, o = {}) => new T.MeshStandardMaterial({ color: new T.Color(c).convertSRGBToLinear(), roughness: .8, metalness: 0, ...o });
  const box = (w, h, d, m, x, y, z, cast = true) => { const b = new T.Mesh(new T.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = cast; b.receiveShadow = true; scene.add(b); return b; };
  // 地板、墙
  const wood = canvasTex(T, 512, 512); drawWood(wood.x, 512, 512); wood.t.wrapS = wood.t.wrapT = T.RepeatWrapping; wood.t.repeat.set(3, 3);
  const floor = new T.Mesh(new T.PlaneGeometry(700, 700), new T.MeshStandardMaterial({ map: wood.t, roughness: .7 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const wallM = std('#2b2f3a', { roughness: .95 });
  const WX = 60, WY = 170, WW = 180, WH = 130, WZ = -200;
  box(600, WY - WH / 2, 12, wallM, 0, (WY - WH / 2) / 2, WZ - 6, false);
  box(600, 300 - (WY + WH / 2), 12, wallM, 0, (300 + WY + WH / 2) / 2, WZ - 6, false);
  box(300 + WX - WW / 2, WH, 12, wallM, (-300 + WX - WW / 2) / 2, WY, WZ - 6, false);
  box(300 - WX - WW / 2, WH, 12, wallM, (300 + WX + WW / 2) / 2, WY, WZ - 6, false);
  box(12, 300, 600, std('#262a34', { roughness: .95 }), -300, 150, 100, false);
  // 窗框、窗台
  const frameM = std('#8d8a84', { roughness: .6 });
  box(WW + 12, 6, 16, frameM, WX, WY - WH / 2 - 3, WZ - 2); box(WW + 12, 6, 14, frameM, WX, WY + WH / 2 + 3, WZ - 6);
  box(6, WH, 14, frameM, WX - WW / 2 - 3, WY, WZ - 6); box(6, WH, 14, frameM, WX + WW / 2 + 3, WY, WZ - 6); box(4, WH, 6, frameM, WX, WY, WZ - 6);
  // 窗外城市（远处一块大画）
  const city = canvasTex(T, 1024, 512); drawCity(city.x, 1024, 512, 0);
  const cityM = new T.MeshBasicMaterial({ map: city.t, fog: false });
  const cityP = new T.Mesh(new T.PlaneGeometry(1600, 800), cityM); cityP.position.set(WX, 160, -900); scene.add(cityP);
  // 玻璃：雨滴折射城市的灯（只从屋里那面画）
  const glassU = { uT: { value: 0 }, uRain: { value: 1 }, uMap: { value: city.t }, uDawn: { value: 0 } };
  const glass = new T.Mesh(new T.PlaneGeometry(WW, WH), new T.ShaderMaterial({
    uniforms: glassU, transparent: true, depthWrite: false,
    vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: `uniform float uT,uRain,uDawn;uniform sampler2D uMap;varying vec2 vUv;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      vec2 drops(vec2 uv,float t){vec2 o=vec2(0.);for(int i=0;i<3;i++){float fi=float(i);vec2 g=uv*vec2(14.,6.)*(1.+fi*.6);vec2 id=floor(g);float sp=.5+h(id+fi)*1.4;g.y+=t*sp*.35*(1.+fi*.5);id=floor(g);vec2 f=fract(g)-.5;
        float r=h(id+3.1+fi);if(r<.55)continue;float d=length(f*vec2(1.,.6));float m=smoothstep(.22,.0,d);o+=f*m*.9;}
        vec2 g2=uv*vec2(40.,40.);vec2 id2=floor(g2);vec2 f2=fract(g2)-.5;float m2=smoothstep(.12,.0,length(f2))*step(.8,h(id2));o+=f2*m2*.5;return o;}
      void main(){vec2 d=drops(vUv,uT)*uRain;vec2 uv=vec2(.5)+(vUv-.5)*vec2(.22,.3)+vec2(0.,.05)+d*.08;
        vec3 c=texture2D(uMap,uv,2.5*(1.-length(d)*6.)*uRain).rgb;c=mix(c,c*1.35+.03,clamp(length(d)*8.,0.,1.));
        gl_FragColor=vec4(c*(1.+uDawn*.6),.92);}`,
  }));
  glass.position.set(WX, WY, WZ - 4); scene.add(glass);
  // 窗外的雨丝
  const RN = 240, rainG = new T.BufferGeometry(), rp = new Float32Array(RN * 6), rs = [];
  for (let i = 0; i < RN; i++) rs.push([WX - 250 + Math.random() * 500, Math.random() * 360, WZ - 30 - Math.random() * 300, .7 + Math.random() * .6]);
  rainG.setAttribute('position', new T.BufferAttribute(rp, 3));
  const rain = new T.LineSegments(rainG, new T.LineBasicMaterial({ color: 0x8fa6c8, transparent: true, opacity: .35 })); scene.add(rain);
  // 书桌、椅子、书架、床
  const deskM = std('#6b5541', { roughness: .65 });
  box(170, 4, 78, deskM, 40, 75, -158); [[-40, -192], [120, -192], [-40, -124], [120, -124]].forEach(([x, z]) => box(4, 73, 4, deskM, x, 36.5, z));
  const chairM = std('#1f2128', { roughness: .5 });
  const chair = new T.Group(); scene.add(chair);
  const seat = new T.Mesh(new T.BoxGeometry(46, 6, 44), chairM); seat.position.set(0, 48, 0); seat.castShadow = true; chair.add(seat);
  const back = new T.Mesh(new T.BoxGeometry(46, 52, 5), chairM); back.position.set(0, 78, 22); back.castShadow = true; chair.add(back);
  const post = new T.Mesh(new T.CylinderGeometry(2.5, 2.5, 44, 10), std('#8a8d96', { metalness: .7, roughness: .3 })); post.position.y = 24; chair.add(post);
  chair.position.set(40, 0, -88);
  const shelfM = std('#3a3029');
  box(30, 190, 90, shelfM, -282, 95, -120);
  const bookC = ['#7a3b2e', '#2e4a6b', '#c49a3c', '#3d6b4a', '#6b2e5a', '#b9b2a6', '#d97757', '#2a2d36'];
  for (let sh = 0; sh < 4; sh++) for (let i = 0; i < 9; i++) box(16 + (i % 3) * 3, 26 + ((i * 7 + sh) % 5) * 3, 6 + (i % 2), std(bookC[(i + sh * 3) % 8]), -278, 26 + sh * 46 + (((i * 7 + sh) % 5) * 3) / 2, -158 + i * 9);
  box(120, 40, 200, std('#3b4a63', { roughness: 1 }), 236, 20, 40); box(120, 14, 200, std('#cfd6e0', { roughness: 1 }), 236, 47, 40);
  // 海报
  const poster = new T.Mesh(new T.PlaneGeometry(56, 78), std('#d97757', { roughness: .9 })); poster.position.set(-180, 175, WZ + 1); scene.add(poster);
  const poster2 = new T.Mesh(new T.PlaneGeometry(40, 40), std('#e8e2d4')); poster2.position.set(-180, 172, WZ + 1.5); scene.add(poster2);
  // 笔记本
  const lapM = std('#9aa0aa', { metalness: .6, roughness: .35 });
  const lap = new T.Group(); lap.position.set(40, 77.2, -142); scene.add(lap);
  const base = new T.Mesh(new T.BoxGeometry(36, 1.6, 25), lapM); base.castShadow = true; base.receiveShadow = true; lap.add(base);
  const kb = new T.Mesh(new T.PlaneGeometry(31, 11), std('#202228')); kb.rotation.x = -Math.PI / 2; kb.position.set(0, .82, -2); lap.add(kb);
  const lid = new T.Group(); lid.position.set(0, .8, -12.5); lid.rotation.x = -.22; lap.add(lid);
  const lidB = new T.Mesh(new T.BoxGeometry(36, 24, 1), lapM); lidB.position.set(0, 12, -.5); lidB.castShadow = true; lid.add(lidB);
  const scr = canvasTex(T, 1024, 640);
  const scrM = new T.MeshBasicMaterial({ map: scr.t, toneMapped: false });
  const scrP = new T.Mesh(new T.PlaneGeometry(33.4, 20.9), scrM); scrP.position.set(0, 12.2, .02); lid.add(scrP);
  // 咖啡、热气
  const mug = new T.Group(); mug.position.set(84, 77, -128); scene.add(mug);
  const mugM = std('#e9e4da', { roughness: .4 });
  const cup = new T.Mesh(new T.CylinderGeometry(4.2, 3.8, 9.5, 24, 1, true), mugM); cup.position.y = 4.75; cup.castShadow = true; mug.add(cup);
  const cupB = new T.Mesh(new T.CylinderGeometry(3.8, 3.8, .6, 24), mugM); cupB.position.y = .3; mug.add(cupB);
  const coffee = new T.Mesh(new T.CircleGeometry(3.9, 24), std('#2a160c', { roughness: .2 })); coffee.rotation.x = -Math.PI / 2; coffee.position.y = 7.5; mug.add(coffee);
  const handle = new T.Mesh(new T.TorusGeometry(2.4, .55, 8, 16, Math.PI), mugM); handle.position.set(4.2, 5, 0); handle.rotation.z = -Math.PI / 2; mug.add(handle);
  const steamM = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .1, depthWrite: false });
  const steam = Array.from({ length: 6 }, () => { const m = new T.Mesh(new T.SphereGeometry(2.4, 10, 8), steamM.clone()); mug.add(m); return m; });
  // 便利贴（贴在笔记本旁）
  const note = canvasTex(T, 256, 256);
  const noteP = new T.Mesh(new T.PlaneGeometry(9, 9), new T.MeshStandardMaterial({ map: note.t, roughness: .9 })); noteP.rotation.x = -Math.PI / 2 + .02; noteP.rotation.z = .12; noteP.position.set(70, 77.15, -123); noteP.receiveShadow = true; scene.add(noteP);
  // 手机
  const phone = new T.Group(); phone.position.set(-6, 77.4, -128); phone.rotation.y = -.25; scene.add(phone);
  const pb = new T.Mesh(new T.BoxGeometry(7.4, .8, 15), std('#15161a', { metalness: .4, roughness: .3 })); pb.castShadow = true; phone.add(pb);
  const ph = canvasTex(T, 256, 512);
  const phS = new T.Mesh(new T.PlaneGeometry(6.8, 14.2), new T.MeshBasicMaterial({ map: ph.t, toneMapped: false })); phS.rotation.x = -Math.PI / 2; phS.position.y = .42; phone.add(phS);
  // 台灯
  const lampM = std('#2a2c33', { metalness: .5, roughness: .4 });
  const lampB = new T.Mesh(new T.CylinderGeometry(7, 8, 2, 24), lampM); lampB.position.set(-22, 78, -168); lampB.castShadow = true; scene.add(lampB);
  const arm = new T.Mesh(new T.CylinderGeometry(.8, .8, 44, 8), lampM); arm.position.set(-22, 99, -168); scene.add(arm);
  const head = new T.Mesh(new T.ConeGeometry(8, 12, 24, 1, true), std('#d9d4ca', { side: T.DoubleSide, roughness: .5 })); head.position.set(-14, 118, -160); head.rotation.z = -.9; head.rotation.x = .3; scene.add(head);
  const bulb = new T.Mesh(new T.SphereGeometry(2.6, 12, 8), new T.MeshBasicMaterial({ color: 0xffd8a0 })); bulb.position.set(-12, 115, -158); scene.add(bulb);
  // 墙上的钟
  const clk = canvasTex(T, 256, 256);
  const clockM = new T.Mesh(new T.CircleGeometry(16, 48), new T.MeshStandardMaterial({ map: clk.t, roughness: .5 })); clockM.position.set(-122, 198, WZ + 1); scene.add(clockM);
  const clockR = new T.Mesh(new T.TorusGeometry(16, 1.2, 8, 48), std('#2a2a2e', { metalness: .5 })); clockR.position.copy(clockM.position); scene.add(clockR);
  // 你：坐在桌前的背影（连帽衫）
  const you = new T.Group(); you.position.set(40, 0, -92); scene.add(you);
  const hood = std('#3a4a6b', { roughness: .95 }), skin = std('#e2b48f', { roughness: .7 }), hair = std('#2b211c', { roughness: .55 });
  const torso = new T.Mesh(new T.CylinderGeometry(15, 13, 42, 20), hood); torso.position.y = 74; torso.castShadow = true; you.add(torso);
  const shoulders = new T.Mesh(new T.SphereGeometry(15, 20, 12, 0, 6.283, 0, Math.PI / 2), hood); shoulders.position.y = 95; shoulders.scale.set(1.12, .55, .85); shoulders.castShadow = true; you.add(shoulders);
  const neck = new T.Mesh(new T.CylinderGeometry(4, 4.5, 6, 12), skin); neck.position.y = 100; you.add(neck);
  const headG = new T.Group(); headG.position.set(0, 112, 0); you.add(headG);
  const headM = new T.Mesh(new T.SphereGeometry(9.5, 24, 18), skin); headM.scale.set(1, 1.12, 1.02); headM.castShadow = true; headG.add(headM);
  const hairM = new T.Mesh(new T.SphereGeometry(10.1, 24, 18, 0, 6.283, 0, Math.PI * .5), hair); hairM.rotation.x = .55; hairM.position.set(0, 1.6, 1.2); headG.add(hairM);
  [-1, 1].forEach(sd => { const ear = new T.Mesh(new T.SphereGeometry(2.2, 10, 8), skin); ear.scale.set(.5, 1, .8); ear.position.set(sd * 9.4, -.5, .5); headG.add(ear); });
  const hoodBack = new T.Mesh(new T.TorusGeometry(9, 4, 10, 20, Math.PI), hood); hoodBack.position.set(0, 97, 6); hoodBack.rotation.set(-1.1, 0, 0); you.add(hoodBack);
  const arms = [-1, 1].map(sd => { const g = new T.Group(); g.position.set(sd * 15, 92, -2); you.add(g); const up = new T.Mesh(new T.CylinderGeometry(4, 3.6, 26, 10), hood); up.position.y = -12; up.castShadow = true; g.add(up); const fore = new T.Group(); fore.position.y = -24; g.add(fore); const lo = new T.Mesh(new T.CylinderGeometry(3.6, 3, 24, 10), hood); lo.position.y = -11; lo.castShadow = true; fore.add(lo); const hand = new T.Mesh(new T.SphereGeometry(3.2, 10, 8), skin); hand.position.y = -24; fore.add(hand); return { g, fore }; });
  // 灯光
  const amb = new T.HemisphereLight(0x405075, 0x120d0a, .55); scene.add(amb);
  const moon = new T.DirectionalLight(0x8fb0ff, .5); moon.position.set(WX + 40, 260, -420); moon.target.position.set(20, 60, -60); scene.add(moon, moon.target);
  moon.castShadow = true; moon.shadow.mapSize.set(1024, 1024); Object.assign(moon.shadow.camera, { left: -250, right: 250, top: 250, bottom: -250, near: 50, far: 900 }); moon.shadow.bias = -.002;
  const lamp = new T.SpotLight(0xffb978, 2.2, 520, .95, .55, 1.6); lamp.position.set(-12, 115, -158); lamp.target.position.set(40, 60, -110); scene.add(lamp, lamp.target);
  lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); lamp.shadow.bias = -.001; lamp.shadow.camera.near = 5;
  const glow = new T.PointLight(0x9cc0ff, 1.1, 260, 2); glow.position.set(40, 96, -118); scene.add(glow);
  const sun = new T.DirectionalLight(0xffb070, 0); sun.position.set(WX - 60, 230, -520); sun.target.position.set(40, 40, -40); scene.add(sun, sun.target);
  const fill = new T.PointLight(0xffc89a, .25, 600, 2); fill.position.set(200, 200, 200); scene.add(fill);

  ROOM = { scene, scr, ph, note, clk, city, glassU, rain, rs, rp, steam, you, arms, headG, chair, lamp, glow, moon, sun, amb, bulb, cityM, fill, lid, lastNote: '', lastClock: '', lastDawn: -1 };
  return ROOM;
}

// 每帧：按这一场戏的设定摆好房间
function pose(R, T, L, cfg, chat, cam, S, shots) {
  const b = L.b, t = L.t;
  const mood = cfg.room ? cfg.room(L, S) : {};
  const dawn = mood.dawn ?? 0, rainK = mood.rain ?? 1, lampOn = mood.lamp ?? 1, screenOn = mood.screen ?? 1;
  // 钟：开始时间 + 每小节走 clockRate 分钟
  const [h0, m0] = cfg.clock || [21, 0], mins = h0 * 60 + m0 + b * (cfg.clockRate ?? .25), hh = Math.floor(mins / 60) % 24, mm = Math.floor(mins % 60);
  const ck = hh + ':' + mm; if (ck !== R.lastClock) { drawClock(R.clk.x, 256, hh, mm); R.clk.t.needsUpdate = true; R.lastClock = ck; }
  const dq = Math.round(dawn * 20) / 20; if (dq !== R.lastDawn) { drawCity(R.city.x, 1024, 512, dq); R.city.t.needsUpdate = true; R.lastDawn = dq; }
  const nk = JSON.stringify([cfg.note || ['周一 8:00 交', '图书管理系统', '加登录功能'], mood.noteCross || 0]);
  if (nk !== R.lastNote) { drawNote(R.note.x, 256, cfg.note || ['周一 8:00 交', '图书管理系统', '加登录功能'], mood.noteCross || 0); R.note.t.needsUpdate = true; R.lastNote = nk; }
  // 屏幕、手机
  if (screenOn > 0) { drawScreen(R.scr.x, 1024, 640, L, cfg, chat, S); if (screenOn < 1) { R.scr.x.fillStyle = `rgba(0,0,0,${1 - screenOn})`; R.scr.x.fillRect(0, 0, 1024, 640); } }
  else { R.scr.x.fillStyle = '#050506'; R.scr.x.fillRect(0, 0, 1024, 640); }
  R.scr.t.needsUpdate = true;
  const px = R.ph.x; px.fillStyle = '#050608'; px.fillRect(0, 0, 256, 512);
  if (cfg.phone) cfg.phone(px, 256, 512, L, S);
  R.ph.t.needsUpdate = true;
  // 雨
  R.glassU.uT.value = t; R.glassU.uRain.value = rainK; R.glassU.uDawn.value = dawn;
  R.rain.material.opacity = .35 * rainK;
  for (let i = 0; i < R.rs.length; i++) {
    const [x, y0, z, sp] = R.rs[i], y = ((y0 - t * 520 * sp) % 360 + 360) % 360 - 20;
    R.rp.set([x, y, z, x - 3, y + 22 * sp, z], i * 6);
  }
  R.rain.geometry.attributes.position.needsUpdate = true;
  // 热气（越往后越淡）
  const hot = mood.steam ?? 1;
  R.steam.forEach((m, i) => { const k = ((t * .35 + i / 6) % 1); m.position.set(Math.sin(t * .8 + i * 2) * 1.6 * k, 9 + k * 16, Math.cos(t * .6 + i) * 1.2 * k); m.scale.setScalar(.6 + k * 1.4); m.material.opacity = .09 * hot * Math.sin(Math.PI * k); });
  // 灯
  R.lamp.intensity = 2.2 * lampOn; R.bulb.visible = lampOn > .1; R.glow.intensity = 1.1 * screenOn * (mood.glow ?? 1);
  R.moon.intensity = .5 * (1 - dawn) * (mood.moon ?? 1); R.sun.intensity = 2.6 * dawn; R.amb.intensity = .55 + dawn * .6;
  R.fill.intensity = .25 + dawn * .3;
  if (mood.flicker) { const f = mood.flicker; R.lamp.intensity *= 1 - f * (Math.sin(t * 40) > .2 ? .8 : 0); }
  // 你：打字、往后靠、转头
  const p = cfg.figure ? cfg.figure(L, S) : {};
  const typing = p.type ?? 0, lean = p.lean ?? 0, yaw = p.yaw ?? 0, nod = p.nod ?? 0;
  R.you.visible = p.hide ? false : true;
  R.you.rotation.x = -.12 + lean * .28; R.you.position.z = -92 + lean * 6;
  R.headG.rotation.set(-.1 + lean * .15 + nod * Math.sin(t * 7) * .06, yaw, 0);
  R.arms.forEach(({ g, fore }, i) => {
    const sd = i ? 1 : -1, tp = typing * Math.max(0, Math.sin(t * 14 + i * 2.1)) * .12;
    if (p.armsUp) { g.rotation.set(-2.6, 0, sd * -.3); fore.rotation.set(-1.4, 0, 0); return; }
    g.rotation.set(-.95 + lean * .5 + tp, 0, sd * -.08); fore.rotation.set(-.9 - lean * .6 - tp * 1.5, 0, sd * .25);
  });
  R.lid.rotation.x = -.22 + (mood.lidClose ?? 0) * 1.72;
  // 相机：在镜头之间按设定移动；加一点手持晃动
  let k0 = shots[0], k1 = null;
  for (let i = 0; i < shots.length; i++) if (b >= shots[i][0]) { k0 = shots[i]; k1 = shots[i - 1] || null; }
  const [at, name, dur = 1.5, ease = 'io'] = k0, A = shotOf(name), Bp = k1 ? shotOf(k1[1]) : A;
  const kk = dur > 0 ? clamp01((b - at) / dur) : 1, e = ease === 'lin' ? kk : ease === 'in' ? kk * kk * kk : io(kk);
  const P0 = Bp, P1 = A;
  const pos = [0, 1, 2].map(j => lerp(P0[0][j], P1[0][j], e)), tgt = [0, 1, 2].map(j => lerp(P0[1][j], P1[1][j], e)), fov = lerp(P0[2], P1[2], e);
  // 从过肩推向屏幕时走一条从头顶越过去的弧线，不从人物身上穿过去
  if ((name === 'screen' || name === 'into') && k1 && !['screen', 'into'].includes(k1[1])) pos[1] += 26 * Math.sin(Math.PI * e);
  const sway = cfg.steady ? 0 : 1, sw = (a, f) => Math.sin(t * f + a) * sway;
  cam.position.set(pos[0] + sw(1, .37) * .9, pos[1] + sw(2, .29) * .6, pos[2] + sw(3, .23) * .5);
  cam.lookAt(tgt[0] + sw(4, .31) * .3, tgt[1] + sw(5, .27) * .25, tgt[2]);
  cam.fov = fov; cam.near = 1; cam.far = 3000;
  // 镜头贴近或穿过人物（过肩推到屏幕）时把人物拿掉，避免穿模和挡住画面
  const c = cam.position, fz = R.you.position.z;
  const dHead = Math.hypot(c.x - 40, c.y - 112, c.z - fz), dBody = Math.hypot(c.x - 40, c.z - fz);
  if (dHead < 48 || (c.y > 40 && c.y < 110 && dBody < 28)) R.you.visible = false;
}

// ---------- 一场现实戏 ----------
// cfg: { id 场景名 scene, steps（台词步骤表）, shots [[小节, 镜头, 移动小节数, 缓动]], clock [时, 分], clockRate, room(L) → {rain, lamp, dawn, steam, screen, noteCross, flicker, lidClose},
//        figure(L) → {type, lean, yaw, nod, armsUp, hide}, code, codeScroll, codeOverlay, screenOverlay, phone(ctx,w,h,L), stamp ['周五', '21:03'],
//        mood(L) → [曝光, 冷暖, 暗角, 光晕], draw(cx, tx, L) 额外画的东西, music, sfx, enter, lb }
window.MV_REAL = (K, cfg) => {
  const { F, C, E, prog, lerp: lp, rgba, fnt, rr, txt, alpha, lyric, clawd, seq, narrate, scene, wrapText, LOOK, TR } = K;
  const S = seq(cfg.steps, { tail: cfg.tail ?? .5 });
  const shots = typeof cfg.shots === 'function' ? cfg.shots(S) : cfg.shots || [[0, 'desk']];
  const chat = S.items.filter(i => i.me || i.you);
  const hideAt = cfg.chatHide ? cfg.chatHide(S) : 1e9; chat.forEach(m => { m.hide = Math.min(m.out + 6, hideAt); });
  // 对话的提示音：你打字的键声，Clawd 的消息到达
  const sfx = [...(typeof cfg.sfx === 'function' ? cfg.sfx(S) : cfg.sfx || [])];
  for (const m of chat) {
    if (m.you) { const n = m.you.replace(/[‹›«»]/g, '').length, d = Math.min(.5, n * .028); for (let i = 0; i < n; i += 2) sfx.push([m.at + .03 + d * i / n, 'key', .7]); if (m.enter !== false) sfx.push([m.at + d + .1, 'enter']); }
    else sfx.push([m.at + .5 + (m.wait || 0), 'pop']);
  }
  const m = scene({
    scene: cfg.scene, desc: cfg.desc, look: LOOK.FILM, chat: true, noBanner: cfg.noBanner, noInv: cfg.noInv ?? true,
    enter: cfg.enter || { kind: TR.FLASH, a: .25, b: .25, flash: .4 },
    hud: { ink: '#e8e9ee' },
    par: L => cfg.mood ? cfg.mood(L, S) : [.62, .45, .8, .7],
    lb: cfg.lb ? (L => cfg.lb(L, S)) : (L => .45),
    pulse: () => 0,
    sfx, music: cfg.music, bars: cfg.bars,
    three(T, U) {
      const R = build(T);
      return { scene: R.scene, update(L, cam) { U.renderer.toneMapping = T.ACESFilmicToneMapping; U.renderer.toneMappingExposure = cfg.exposure ?? 1.15; pose(R, T, L, cfg, chat, cam, S, shots); return true; } };
    },
    draw(cx, tx, L) {
      const b = L.b;
      K.three(cx, L);
      if (cfg.under) cfg.under(cx, tx, L, S);
      // 时间戳（像电影里的地点字幕）
      if (cfg.stamp) {
        const k = prog(b, .3, .9) * (1 - prog(b, 4, 4.6));
        if (k > 0) alpha(tx, k, () => { txt(tx, cfg.stamp[0], 120, 880, fnt(500, 26, F.sans), rgba('#ffffff', .7)); txt(tx, cfg.stamp[1], 116, 930, fnt(300, 64, F.mono), '#f4efe6'); });
      }
      chatOverlay(tx, L, chat, cfg.chatSide || 'right', K);
      narrate(tx, L, S, cfg.style || { sub: { y: 990, size: 40 } });
      if (cfg.draw) cfg.draw(cx, tx, L, S);
    },
  }, S);
  return m;
};

// 对话气泡（大号，叠在画面一侧，方便读）：最新的在下面，最多留 4 条
function chatOverlay(ctx, L, chat, side, K) {
  const { F, C, prog, fnt, rr, txt, alpha, wrapText, clawd, rgba } = K, b = L.b;
  const shown = chat.filter(m => b >= m.at - .02 && b < m.hide);
  if (!shown.length) return;
  const last = shown.slice(-4), X0 = side === 'right' ? 1060 : 90, W0 = 760;
  let y = 880;
  const items = [];
  for (let i = last.length - 1; i >= 0; i--) {
    const m = last[i], me = !!m.me, raw = (me ? m.me : m.you), n0 = raw.replace(/[‹›«»]/g, '').length;
    const typing = me && b < m.at + .5 + (m.wait || 0);
    let s = raw;
    if (!me) { const d = Math.min(.5, n0 * .028), n = Math.floor(Math.min(1, Math.max(0, (b - m.at - .03) / Math.max(.05, d))) * n0 + 1e-6); s = cut(raw, n); }
    ctx.font = fnt(500, 36, F.sans);
    const lines = typing ? ['···'] : wrapText(ctx, s.replace(/[‹›«»]/g, ''), W0 - 150).split('\n');
    const bw = Math.min(W0 - 90, Math.max(...lines.map(l => ctx.measureText(l).width)) + 48), bh = lines.length * 50 + 30;
    const age = last.length - 1 - i, fade = (age >= 3 ? .35 : age === 2 ? .6 : 1) * (1 - prog(b, m.hide - .3, m.hide));
    items.push({ me, lines, bw, bh, y: y - bh, fade, k: prog(b, m.at, m.at + .15), typing });
    y -= bh + 22;
  }
  for (const it of items) {
    alpha(ctx, it.fade * it.k, () => {
      const yy = it.y + (1 - it.k) * 18;
      if (it.me) {
        const x = X0 + 76;
        clawd(ctx, { x: X0 + 34, y: yy + 52, px: 4.2, pose: 'idle', blink: false, eye: 0 });
        rr(ctx, x, yy, it.bw, it.bh, 22, 'rgba(38,26,21,.92)', 'rgba(217,119,87,.75)', 2);
        if (it.typing) { for (let j = 0; j < 3; j++) { ctx.globalAlpha *= 1; const on = Math.floor(L.t * 5 + j) % 3 === 0; ctx.fillStyle = on ? C.clawd : 'rgba(217,119,87,.4)'; ctx.beginPath(); ctx.arc(x + 30 + j * 22, yy + it.bh / 2, 6, 0, 6.283); ctx.fill(); } }
        else it.lines.forEach((l, j) => txt(ctx, l, x + 24, yy + 40 + j * 50, fnt(500, 36, F.sans), '#f8efe7'));
      } else {
        const x = X0 + W0 - it.bw;
        rr(ctx, x, yy, it.bw, it.bh, 22, 'rgba(240,240,243,.95)');
        it.lines.forEach((l, j) => txt(ctx, l, x + 24, yy + 40 + j * 50, fnt(500, 36, F.sans), '#15161b'));
        txt(ctx, '你', X0 + W0 + 22, yy + 36, fnt(900, 26, F.sans), rgba('#ffffff', .7));
      }
    });
  }
}
function cut(s, n) { let out = '', k = 0; for (const ch of s) { if ('‹›«»'.includes(ch)) { out += ch; continue; } if (k >= n) break; out += ch; k++; } return out; }
window.MV_ROOM_SHOTS = SHOTS;
})();
