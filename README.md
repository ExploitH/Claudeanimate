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
- `mv-voice.js` — 配音数据（`window.MV_VOX`），目前为空占位

各场景/世界模块需要注册到 `window.MV_W[id]` 才能运行。

## 工具（`project/tools/`）

通用工具：构建单文件、截关键帧、**快速导出 mp4**、音轨分析、剧本和配音台本导出、配音合成。任何基于此引擎的动画都可以直接用，用法、项目布局和配置见 [`project/tools/README.md`](project/tools/README.md)。
