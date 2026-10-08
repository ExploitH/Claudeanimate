# 动画工具（通用）

基于 Vibe Coding 动画引擎的任何动画都可以用这套工具调试和导出。工具放在项目的 `tools/` 目录里，项目根目录就是 `tools/` 的上一级（可用 `MV_ROOT` 覆盖）。

## 安装

```bash
cd tools && npm install
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 npm install   # 不下载浏览器
```

- 浏览器默认用 `/opt/pw-browsers/chromium`，换一个就设 `MV_CHROME=/path/to/chrome`
- 快速导出、配音打包需要 `ffmpeg` / `ffprobe`；`sheet.sh` 需要 ImageMagick 的 `montage`；配音合成需要 `pip install dashscope`

## 项目布局

项目根目录需要：

- **内核**（引擎本身）：`support.js`、`mv-core.jsx`、`animations-v3.jsx`（`CompositionStage` 和快速导出的同步定格都在这里）、`tweaks-panel.jsx`、`mv-3d.jsx`、`mv-kit3d.jsx`、`mv-music.jsx`、`mv-voice.js`
- **世界模块**：每个模块注册 `window.MV_W[id] = K => ({ scene, bars, desc, S: { at, items }, sfx, vox, three, ... })`
- **入口**：一个 `*.dc.html`，里面有 `window.OM_SCENES`（场次表，`{name, dur, desc}`）和 `component-from-global-scope="MVApp"` 的 x-import，列出要加载的模块

入口可以用 `--dc` 指定。如果项目根目录里只有一个含 `OM_SCENES` 的 `*.dc.html`，就会自动选它。

## 项目配置（可选）

`mv.config.json` 放在项目根目录：

```json
{
  "dc": "我的动画.dc.html",
  "title": "我的动画",
  "script": { "labels": { "you": "你", "me": "角色", "say": "旁白" } },
  "tts": {
    "model": "qwen-audio-3.1-tts-next",
    "subs": [["==", "双等号"], ["——", "，"]]
  }
}
```

- `dc`：入口文件名
- `title`：页面标题和剧本标题
- `script.labels`：剧本里各字段的标签（字段名：`you` `me` `say` `big` `gloss` `src` `rule`）
- `tts.subs`：念出来和写出来不一样的地方，`[正则, 替换]`，按顺序替换

## 命令

| 命令 | 用途 |
| --- | --- |
| `node mvbuild.js [out.html]` | 把入口和全部模块打成一个 html（章节栏、画质切换、声音开关）。默认输出到 `tools/mv/index.html` |
| `node plan.js [世界id]` | 看时间表：每个世界的起点、小节数；给了 id 就列它每个小节点的绝对秒数 |
| `node mvshot.js <目录> <t1> [t2 ...] [--hi]` | 截指定秒数的关键帧，用来看画面 |
| `node mvexport.js <out.mp4> [--from --to --fps --hi --audio --keep]` | **快速导出**，见下 |
| `node mvaudio.js <目录> [--wav out.wav] [--from --dur]` | 离线渲染音轨，输出频谱图和每段的 RMS/峰值，可写 WAV |
| `node mvscenes.js [dc ...]` | 从世界模块算每场时长，写回 `OM_SCENES`（改了 bars 之后跑） |
| `node script.js <out.md>` | 从世界模块导出剧本（台词、词条、出处、规则，时间码与成片一致） |
| `node voxlist.js <out.json>` | 导出全片配音台本，去重后每句一条 |
| `python3 parts.py [--max 300]` | 把入口按场次切成不超过 `--max` 秒的分段 dc（`<入口>.part<N>.dc.html`） |
| `python3 tts/gen.py lines.json --voice sp=音色 ...` | 批量合成配音，每句存成 `tts/clips/<md5>.mp3`，已有的跳过 |
| `python3 tts/pack.py lines.json tts/clips mv-voice.js` | 把配音片段去静音、压缩、量时长，打包成 `mv-voice.js` |
| `python3 tts/voicetest.py <音色> [文本]` | 试一个音色，输出 `tts/samples/<音色>.mp3` |
| `./sheet.sh <目录>` | 把 `t*.png` 每 6 张拼成一张 3×2 联系表 |

`--html <file>` 可以代替 `--dc`，直接用已经构建好的页面。所有截图和导出都默认用入口现构建。

`tts/lines.json` 只是格式示例，台词是虚构的，不对应任何真实动画。换成 `voxlist.js` 导出的真实台词即可。说话人键 `clawd`（旁白、大字、角色对话、规则）和 `you`（用户输入）由引擎 `mv-core.jsx` 的 `voxLines` 决定，`--voice` 要为它们都指定音色。

## 快速导出（`mvexport.js`）

引擎的可导出根节点是 `svg[data-om-exportable-video-with-duration-secs]`，它支持同步定格：`data-om-seek-to-time-frame` 事件带 `sync: true` 时，引擎会用 `flushSync` 立刻提交这一帧。引擎广告了 `data-om-sync-seek` 之后，导出器就不用等两帧刷新。

`mvexport.js` 做的事情：

1. 按入口构建页面，等字体内联完（`data-om-fonts-inlined`）
2. 去掉舞台缩放，让 svg 保持原始 1920×1080
3. 逐帧：同步定格 → 直接截 svg（不等两帧，有广告时）
4. `--audio` 时用 `mvaudio.js` 同一套渲染器离线渲染对应时间段的音轨
5. ffmpeg 编码成 H.264 mp4（音频 AAC）

`--from`/`--to` 可以只导出一段；`--hi` 切到「高」画质。中间帧默认删掉，`--keep` 保留。

## 世界模块依赖的全局量

工具读取这些，项目里要保持不变：

- `window.MV_W`：世界注册表；`window.MV_K`：工具集，工具要用它的 `BAR`（一小节的秒数）
- `window.__mvPlan`：时间表（`ws`、`rules`、`total`）
- `window.MV_MUSIC.job`：离线音频渲染
- `window.MV_VOXLINES` / `window.MV_VOXKEY`：配音台本的句子和键
- `window.MVApp`：入口挂载的根组件
