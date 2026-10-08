# Vibe Coding 动画引擎内核（base）

只保留制作动画所需的内核文件和工具链，章节、世界、电影版场景、HTML 页面和旧对话记录已移除。

## 内核（`project/`）

- `support.js` — 运行时（由 dc-runtime 生成，勿手改）
- `mv-core.jsx` — 引擎：节拍时间、片元着色器画风、转场、动态字、音轨调度
- `mv-3d.jsx` — Three.js 3D 层，世界模块通过 `three: (T, U) => ({ scene, update })` 接入
- `mv-kit3d.jsx` — 3D 道具箱（`window.MV_K3`），各场景共用
- `mv-music.jsx` — 配乐与音效的离线渲染
- `mv-voice.js` — 配音数据（`window.MV_VOX`），目前为空占位

各场景/世界模块需要重新接入到 `window.MV_W[id]` 才能运行。

## 工具（`project/tools/`）

构建、截图、音频检查、配音（`tts/`）等脚本，依赖见 `package.json`，`tts/.key` 等敏感文件已在 `.gitignore` 中排除。
