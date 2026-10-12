# Vibe Coding 动画引擎内核（base）

只保留动画引擎的内核文件和通用工具。章节、世界、电影版场景、HTML 页面和旧对话记录已移除。

## 内核（`project/`）

- `support.js` — 运行时（由 dc-runtime 生成，勿手改）
- `mv-core.jsx` — 引擎：节拍时间、片元着色器画风、转场、动态字、音轨调度
- `animations-v3.jsx` — 舞台 `CompositionStage` 和导出的同步定格（快速导出依赖它）
- `tweaks-panel.jsx` — 调节面板
- `mv-3d.jsx` — Three.js 3D 层，世界模块通过 `three: (T, U) => ({ scene, update })` 接入
- `mv-kit3d.jsx` — 3D 道具箱（`window.MV_K3`），各场景共用
- `mv-music.jsx` — 配乐与音效的离线渲染
- `mv-voice.js` — 人声碎片库（`window.MV_VOX`）：一字一声，每个字从说话人的碎片里挑一个。当前是 `tools/voice/blips.py synth` 生成的占位碎片，录好的碎片用 `pack` 重新打包替换

各场景/世界模块需要注册到 `window.MV_W[id]` 才能运行。

## 工具（`project/tools/`）

通用工具：构建单文件、截关键帧、**快速导出 mp4**、音轨分析、剧本和配音台本导出、人声碎片库的生成和打包。任何基于此引擎的动画都可以直接用，用法、项目布局和配置见 [`project/tools/README.md`](project/tools/README.md)。

## 作品：东大码宣传片（`project/东大码宣传片.dc.html`）

发布会式的克制基调：场与场之间柔和溶解，动作都是长时间的缓入缓出，不闪白、不抖、不故障；配乐是钢琴琶音、长铺底和轻柔的底鼓。

给 [NEU-ECode-Android](https://github.com/ExploitH/NEU-ECode-Android)（东大码）做的约 2 分钟发布会风格宣传片，主线是「从早八，到深夜」：一个学生的一天，每章用翻页时钟开场——07:52 宿舍（桌面小组件）、12:08 食堂（付款码）、12:09（校园卡余额）、21:30 校外（校园内网）、21:32（考试与成绩），开场和收尾各一场。

- `neu-logo.jsx` — 山川图标轮廓（取自 App 的 `ic_launcher_foreground.xml`）
- `neu-kit.jsx` — 共用道具 `window.NEU`：3D 手机（屏幕是每帧重画的画布贴图）、App 的付款码 / 内网连接 / 考试成绩 / 主屏幕界面、四款桌面小组件、标题字、配乐（F 大调 I–V–vi–IV）
- `neu-fx.jsx` — 特效 `window.NEU_FX`：粒子汇聚成图标、平滑跳动的时间与滚轮数字、散景、天色、扫光、章节卡与角标、缓慢推镜；也留着翻页时钟、冲击波、光速隧道、撞色大字等更激烈的效果，这部片子没有用
- `neu-film.jsx` — 七个世界模块 `n0`–`n6`；手机上的小组件、余额卡、考试卡片可以作为 3D 图层浮起（爆炸图），付款码由 3D 小方块飞来拼成
- `mv.config.json` 指向这个入口，`tools/` 里的构建、截图、导出命令可以直接用
