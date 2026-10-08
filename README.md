# Vibe Coding 动画引擎内核（base）

只保留制作动画所需的内核文件，所有画面内容（章节、世界、电影版场景、工具链）已移除。

## 文件

- `project/support.js` — 运行时（由 dc-runtime 生成，勿手改）
- `project/mv-core.jsx` — 引擎：节拍时间、片元着色器画风、转场、动态字、音轨调度
- `project/mv-3d.jsx` — Three.js 3D 层，世界模块通过 `three: (T, U) => ({ scene, update })` 接入
- `project/mv-kit3d.jsx` — 3D 道具箱（`window.MV_K3`），各场景共用
- `project/mv-music.jsx` — 配乐与音效的离线渲染
- `project/mv-voice.js` — 配音数据（`window.MV_VOX`），目前为空占位

各场景/世界模块需要重新接入到 `window.MV_W[id]` 才能运行。
