// 单文件构建：入口 dc 的全部模块预编译后内联成一个 html（顶部章节栏 + 画质切换 + 声音开关）。
// 用法：node mvbuild.js [out.html] [--dc 入口.dc.html] [--title 标题]
const fs = require('fs'), path = require('path');
const L = require('./mv-lib');

function build(dcFile, out, title) {
  const e = L.readEntry(dcFile), cfg = L.config();
  const TITLE = title || cfg.title || path.basename(dcFile).replace(/\.dc\.html$/, '');
  const scenes = e.scenes;
  const scriptBundle = L.bundle(e);
  const voxScript = e.hasVox && fs.existsSync(path.join(L.ROOT, 'mv-voice.js')) ? '<script>\n' + fs.readFileSync(path.join(L.ROOT, 'mv-voice.js'), 'utf8') + '\n</script>\n' : '';
  const playback = (e.html.match(/window\.OM_PLAYBACK = '(.*?)';/) || [, '{"mode":"loop"}'])[1];
  let t = 0;
  const starts = scenes.map(s => { const r = t; t += s.dur; return r; });
  const total = t, mmss = x => `${Math.floor(x / 60)}:${String(Math.round(x % 60)).padStart(2, '0')}`;
  const btns = scenes.map((s, i) => {
    const m = s.name.match(/^(\S+)\s*·?\s*(.*)$/), num = m ? m[1] : s.name, label = (m && m[2]) || '';
    return `      <button class="ch" type="button" data-t="${starts[i]}" title="${s.name} · ${mmss(starts[i])}"><b>${num}</b><span>${label}</span></button>`;
  }).join('\n');
  const fontLink = e.font ? `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${e.font.replace(/&/g, '&amp;')}">` : '';
  const html = `<title>${TITLE}</title>
${fontLink}
<style>
/* 顶部一条章节栏（点击跳到该段），下方是播放区；全片一条时间轴 */
:root {
  color-scheme: dark;
  --bg: #0b0b0e; --bar: #131417; --line: #2a2c33; --fg: #e6e8ee; --dim: #9aa0ab; --faint: #5d626c;
  --accent: #d97757; --stage: #000;
  --sans: "Noto Sans SC", "PingFang SC", system-ui, sans-serif;
  --mono: "JetBrains Mono", "Noto Sans SC", ui-monospace, monospace;
}
html, body { height: 100%; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 400 14px/1.4 var(--sans); display: flex; flex-direction: column; overflow: hidden; }
.bar { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; padding: 10px 16px; background: var(--bar); border-bottom: 1px solid var(--line); }
.brand { display: flex; align-items: baseline; gap: 8px; white-space: nowrap; }
.brand b { font: 700 16px var(--mono); }
.brand span { color: var(--dim); font-weight: 500; font-variant-numeric: tabular-nums; }
.chs { display: flex; gap: 2px; overflow-x: auto; min-width: 0; flex: 1 1 420px; scrollbar-width: thin; }
.ch { display: flex; align-items: baseline; gap: 6px; padding: 6px 10px; border: 1px solid transparent; border-radius: 8px; background: none; color: var(--dim); font: inherit; cursor: pointer; white-space: nowrap; }
.ch b { font: 600 13px var(--mono); color: var(--faint); }
.ch span { font-size: 13px; }
.ch:hover { color: var(--fg); background: rgba(230, 232, 238, .04); }
.ch[aria-current="true"] { color: var(--fg); border-color: var(--line); background: var(--bg); box-shadow: inset 0 -2px 0 var(--accent); }
.ch[aria-current="true"] b { color: var(--accent); }
.ch:focus-visible, .seg button:focus-visible, .sound:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.tools { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.seg { display: flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
.seg button { background: none; border: 0; color: var(--dim); font: 500 12px var(--sans); padding: 6px 10px; cursor: pointer; }
.seg button[aria-pressed="true"] { background: var(--line); color: var(--fg); }
.sound { background: none; border: 1px dashed var(--accent); color: var(--fg); border-radius: 8px; font: 500 12px var(--sans); padding: 6px 10px; cursor: pointer; }
.sound[data-on="1"] { border-style: solid; border-color: var(--line); color: var(--faint); }
.label { font-size: 12px; color: var(--faint); letter-spacing: .04em; }
#stage { position: relative; flex: 1; min-height: 0; background: var(--stage); }
#stage > div { position: absolute; inset: 0; }
.note { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: var(--faint); font: 500 13px var(--mono); pointer-events: none; text-align: center; }
@media (max-width: 640px) { .tools { margin-left: 0; } .ch span { display: none; } }
</style>

<header class="bar">
  <div class="brand"><b>${TITLE}</b><span>${mmss(total)}</span></div>
  <nav class="chs" aria-label="跳到段落">
${btns}
  </nav>
  <div class="tools">
    <span class="label">画质</span>
    <div class="seg" role="group" aria-label="渲染画质">
      <button type="button" data-q="流畅" aria-pressed="true">流畅</button>
      <button type="button" data-q="高" aria-pressed="false">高</button>
    </div>
    <button type="button" class="sound" id="sound" data-on="0">点这里开声音</button>
  </div>
</header>
<main id="stage" aria-label="动画播放区"><div class="note" id="note">正在加载…</div></main>

<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
window.OM_SCENES = ${JSON.stringify(JSON.stringify(scenes.map(s => ({ name: s.name, dur: s.dur }))))};
window.OM_PLAYBACK = '${playback}';
</script>
${voxScript}<script>
${scriptBundle.replace(/<\/script/gi, '<\\/script')}
</script>
<script>
(function () {
  var stage = document.getElementById('stage'), note = document.getElementById('note'), soundBtn = document.getElementById('sound');
  var SEL = 'svg[data-om-exportable-video-with-duration-secs]', root = null, quality = '流畅';
  var TWEAKS = ${JSON.stringify(e.tweaks)};
  var chs = Array.prototype.slice.call(document.querySelectorAll('.ch')), starts = chs.map(function (c) { return +c.dataset.t; });
  try { window.__mvAudio = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { window.__mvAudio = null; }
  function soundState() {
    var ac = window.__mvAudio, on = ac && ac.state === 'running';
    soundBtn.dataset.on = on ? '1' : '0';
    soundBtn.textContent = !ac ? '这个浏览器不支持声音' : on ? '声音已开' : '点这里开声音';
  }
  function unlock() { var ac = window.__mvAudio; if (ac && ac.state !== 'running') ac.resume().then(soundState, soundState); }
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, unlock, true); });
  if (window.__mvAudio) window.__mvAudio.onstatechange = soundState;
  soundState();
  function mount(keepTime) {
    if (!window.MVApp) { note.textContent = '动画脚本没有加载成功，请刷新重试'; return; }
    if (!keepTime) { try { localStorage.removeItem('animstage-v3:t'); } catch (e) {} }
    window.TWEAK_DEFAULTS = Object.assign({}, TWEAKS, { quality: quality });
    if (root) root.unmount();
    stage.textContent = '';
    var host = document.createElement('div'); stage.appendChild(host);
    root = ReactDOM.createRoot(host); root.render(React.createElement(window.MVApp));
  }
  function seek(t) { var el = document.querySelector(SEL); if (el) el.dispatchEvent(new CustomEvent('data-om-seek-to-time-frame', { detail: { time: t, sync: true } })); }
  var last = -1;
  function mark() {
    var t = NaN;
    try { t = parseFloat(localStorage.getItem('animstage-v3:t')); } catch (e) {}
    if (isFinite(t)) {
      var i = 0; while (i + 1 < starts.length && t >= starts[i + 1] - .01) i++;
      if (i !== last) { last = i; chs.forEach(function (c, j) { c.setAttribute('aria-current', j === i ? 'true' : 'false'); }); if (chs[i].scrollIntoView) chs[i].scrollIntoView({ block: 'nearest', inline: 'nearest' }); }
    }
    setTimeout(mark, 400);
  }
  chs.forEach(function (c) { c.addEventListener('click', function () { seek(+c.dataset.t + .01); }); });
  document.querySelectorAll('.seg button').forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.dataset.q === quality) return;
      quality = b.dataset.q;
      document.querySelectorAll('.seg button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      mount(true);
    });
  });
  soundBtn.addEventListener('click', unlock);
  mount(false);
  mark();
})();
</script>
`;
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log(out, (html.length / 1024).toFixed(0) + ' KB', 'total', total + 's', scenes.length, 'scenes');
  return { out, total, scenes };
}

module.exports = { build };

if (require.main === module) {
  const { o, pos } = L.args(process.argv.slice(2), ['--dc', '--title']);
  build(L.entry(o.dc), path.resolve(pos[0] || path.join(L.BUILD_DIR, 'index.html')), o.title);
}
