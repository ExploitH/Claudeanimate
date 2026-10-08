# 动画工具（通用）

基于 Vibe Coding 动画引擎的任何动画都可以用这套工具调试和导出。工具放在项目的 `tools/` 目录里，项目根目录就是 `tools/` 的上一级（可用 `MV_ROOT` 覆盖）。

## 安装

```bash
cd tools && npm install
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install   # 不下载浏览器
```

- 浏览器默认用 `/opt/pw-browsers/chromium`，换一个就设 `MV_CHROME=/path/to/chrome`
- 快速导出、人声碎片打包需要 `ffmpeg` / `ffprobe`；`sheet.sh` 需要 ImageMagick 的 `montage`

## 项目布局

项目根目录需要：

- **内核**（引擎本身）：`support.js`、`mv-core.jsx`、`animations-v3.jsx`（`CompositionStage` 和快速导出的同步定格都在这里）、`tweaks-panel.jsx`、`mv-3d.jsx`、`mv-kit3d.jsx`、`mv-music.jsx`、`mv-voice.js`（人声碎片库）
- **世界模块**：每个模块注册 `window.MV_W[id] = K => ({ scene, bars, desc, S: { at, items }, sfx, vox, three, ... })`
- **入口**：一个 `*.dc.html`，里面有 `window.OM_SCENES`（场次表，`{name, dur, desc}`）和 `component-from-global-scope="MVApp"` 的 x-import，列出要加载的模块

入口可以用 `--dc` 指定。如果项目根目录里只有一个含 `OM_SCENES` 的 `*.dc.html`，就会自动选它。

## 项目配置（可选）

`mv.config.json` 放在项目根目录：

```json
{
  "dc": "我的动画.dc.html",
  "title": "我的动画",
  "script": { "labels": { "you": "你", "me": "角色", "say": "旁白" } }
}
```

- `dc`：入口文件名
- `title`：页面标题和剧本标题
- `script.labels`：剧本里各字段的标签（字段名：`you` `me` `say` `big` `gloss` `src` `rule`）

## 命令

| 命令 | 用途 |
| --- | --- |
| `node mvbuild.js [out.html]` | 把入口和全部模块打成一个 html（章节栏、画质切换、声音开关）。默认输出到 `tools/mv/index.html` |
| `node plan.js [世界id]` | 看时间表：每个世界的起点、小节数；给了 id 就列它每个小节点的绝对秒数 |
| `node mvshot.js <目录> <t1> [t2 ...] [--hi]` | 截指定秒数的关键帧，用来看画面 |
| `node mvexport.js <out.mp4> [--from --to --fps --hi --audio --no-keys --keep]` | **快速导出**，见下 |
| `node mvaudio.js <目录> [--wav out.wav] [--from --dur --no-keys]` | 离线渲染音轨，输出频谱图和每段的 RMS/峰值，可写 WAV |
| `node mvscenes.js [dc ...]` | 从世界模块算每场时长，写回 `OM_SCENES`（改了 bars 之后跑） |
| `node script.js <out.md>` | 从世界模块导出剧本（台词、词条、出处、规则，时间码与成片一致） |
| `node voxlist.js <out.json>` | 导出全片台词，去重后每句一条，用来对着台本录人声碎片 |
| `python3 parts.py [--max 300]` | 把入口按场次切成不超过 `--max` 秒的分段 dc（`<入口>.part<N>.dc.html`） |
| `python3 voice/blips.py synth [--n 12]` | 合成占位碎片，写进项目的 `mv-voice.js` |
| `python3 voice/blips.py pack <目录>` | 把录好的碎片打包进 `mv-voice.js`，目录结构见下 |
| `./sheet.sh <目录>` | 把 `t*.png` 每 6 张拼成一张 3×2 联系表 |

`--html <file>` 可以代替 `--dc`，直接用已经构建好的页面。所有截图和导出都默认用入口现构建。

## 人声碎片（一字一声）

字幕的配音不用 TTS。每个念出来的字都触发一个人声碎片，像 Undertale 的文字音。

- **说话人**：`narrator` 念旁白、大字、角色对话和规则；`user` 念「你」自己打的字。引擎 `mv-core.jsx` 的 `voxLines` 决定哪句归哪个说话人。
- **碎片库**：`mv-voice.js` 里 `window.MV_VOX = { rate, source, banks: { 说话人: [WAV, ...] } }`。每个字用 `seed` 挑一个碎片，音高和音量各抖一点，同一个字每次都一样。没有碎片库的说话人不出声。
- **字幕是打字机**：每个字在它念出来的那一刻出现，每字 0.06 秒（和 `typeSfx` 的默认打字节奏一样）。标点和空白不念，但它们和字一样占一个时刻，所以停顿跟屏上一致。画面和声音用同一个 `typeStep` 算时刻，逐字对得上。没有大字的字幕才念（有大字时字幕不画，也不念）。
- **大字、规则、角色对话**：仍是整段淡入，念的节奏按读字的速度排开，同一项里几句依次念，不叠在一起。
- **「你」**：「你」的气泡跟着打字的节奏念，碎片用 `user` 的那一库。
- **音量**：念的时候背景音乐会压低，和之前的配音一样。

**「你打字的按键声」开关**：设置面板里有一个开关（默认开）。打开时，「你」在打字的时间段里的键盘声都会响；关掉后这些键盘声全部去掉，别的打字声（代码、标题、Clawd 的回复）不受影响。判断的依据是时间段：落在某一句「你」的时间段里、类型为按键声的，就算「你」的。聊天风的世界自己放按键声，也按这个规则处理。`user` 的碎片不受这个开关控制。

导出时同样生效：`mvaudio.js` 和 `mvexport.js` 加 `--no-keys` 即可去掉「你」的按键声。

**占位与录音**：`synth` 生成的碎片是合成的类人声元音，只是占位，`mv-voice.js` 的 `source` 会写着 `synth`。真正的人声要自己录：

```
碎片目录/
  narrator/  01.wav 02.wav ...   旁白、角色用的碎片，每个 0.3 秒以内最好
  user/      01.wav ...          「你」用的碎片
```

录完执行 `python3 voice/blips.py pack 碎片目录`，会把每个文件转成 24 kHz 单声道、去掉首尾静音、截到 0.3 秒、峰值归一化，然后覆盖 `mv-voice.js`。

`voice/lines.json` 是台本的格式示例，台词是虚构的。换成 `voxlist.js` 导出的真实台词即可。

## 快速导出（`mvexport.js`）

引擎的可导出根节点是 `svg[data-om-exportable-video-with-duration-secs]`，它支持同步定格：`data-om-seek-to-time-frame` 事件带 `sync: true` 时，引擎会用 `flushSync` 立刻提交这一帧。引擎广告了 `data-om-sync-seek` 之后，导出器就不用等两帧刷新。

`mvexport.js` 做的事情：

1. 按入口构建页面，等字体内联完（`data-om-fonts-inlined`）
2. 去掉舞台缩放，让 svg 保持原始 1920×1080
3. 逐帧：同步定格 → 直接截 svg（不等两帧，有广告时）
4. `--audio` 时用 `mvaudio.js` 同一套渲染器离线渲染对应时间段的音轨（包括人声碎片）
5. ffmpeg 编码成 H.264 mp4（音频 AAC）

`--from`/`--to` 可以只导出一段；`--hi` 切到「高」画质。中间帧默认删掉，`--keep` 保留。

## 世界模块依赖的全局量

工具读取这些，项目里要保持不变：

- `window.MV_W`：世界注册表；`window.MV_K`：工具集，工具要用它的 `BAR`（一小节的秒数）
- `window.__mvPlan`：时间表（`ws`、`rules`、`total`）
- `window.MV_MUSIC.job`：离线音频渲染
- `window.MV_SFXLIST(P, opt)`：这一份时间表上的全部声音事件（页面和导出用的是同一个）
- `window.MV_VOX`：人声碎片库
- `window.MV_VOXLINES` / `window.MV_VOXKEY`：台词和键
- `window.MVApp`：入口挂载的根组件
