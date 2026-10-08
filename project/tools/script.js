// 从世界模块导出剧本：node script.js <out.md> [--html f | --dc 入口] [--title 标题]
// 台词字段的标签在 mv.config.json 的 script.labels 里配，默认：you 你 / me 角色 / say 旁白 / big 大字 / gloss 词条 / src 出处 / rule 规则。
// 小节点（S.items）上有哪些字段就导出哪些，时间码是成片里的位置。
const fs = require('fs');
const L = require('./mv-lib');

(async () => {
  const { o, pos } = L.args(process.argv.slice(2), ['--html', '--dc', '--title']);
  const [out] = pos;
  if (!out) { console.error('用法：node script.js <out.md> [--html f | --dc 入口] [--title 标题]'); process.exit(1); }
  const cfg = L.config(), title = o.title || cfg.title || 'Animation';
  const labels = Object.assign({ you: '你', me: '角色', say: '旁白', big: '大字', gloss: '词条', src: '出处', rule: '规则' }, (cfg.script || {}).labels);
  const { page, close } = await L.openPage(L.pageFor(o));
  let ws, BAR;
  try {
    await L.ready(page);
    ({ ws, BAR } = await page.evaluate(() => ({
      BAR: window.MV_K.BAR,
      ws: window.__mvPlan.ws.map(w => ({ id: w.m.id, scene: w.m.scene, desc: w.m.desc || '', start: w.start, dur: w.m.bars * window.MV_K.BAR, items: (w.m.S ? w.m.S.items : []).map(i => ({ ...i })) })),
    })));
  } finally { await close(); }
  const ts = s => { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const clean = s => String(s).replace(/[‹›«»]/g, '');
  const group = s => (s.match(/^\S+/) || [''])[0];
  const lines = [`# ${title} · 剧本`, '', '由画面里的世界模块直接导出，台词、词条、出处和规则与成片一致。时间码是成片里的位置。', '',
    `- **${labels.you}**：输入框里的字`, `- **${labels.me}**：对话框里的回复`, `- **${labels.say}**：画面里念出来的字幕`,
    `- 【${labels.big}】【${labels.gloss}】【${labels.src}】【${labels.rule}】是画面上出现的卡片`, '',
    `全片约 ${Math.round(ws.reduce((a, w) => a + w.dur, 0) / 60)} 分钟，共 ${ws.length} 场。`, ''];
  let ch = '';
  for (const w of ws) {
    const c = group(w.scene);
    if (c !== ch) { ch = c; lines.push('', '---', ''); }
    lines.push(`## ${w.scene}`, '', `\`${ts(w.start)}–${ts(w.start + w.dur)}\` · ${w.dur} 秒`, '', `> ${w.desc}`, '');
    for (const i of w.items) {
      const t = ts(w.start + i.at * BAR);
      if (i.you) lines.push(`- \`${t}\` **${labels.you}**：${clean(i.you)}`);
      if (i.me) lines.push(`- \`${t}\` **${labels.me}**：${clean(i.me)}`);
      if (i.big) lines.push(`- \`${t}\` 【${labels.big}】${clean(i.big)}${i.sub ? ' / ' + clean(i.sub) : ''}`);
      if (i.say) lines.push(`- \`${t}\` **${labels.say}**：${clean(i.say)}`);
      if (i.gloss) lines.push(`  - 【${labels.gloss}】${i.gloss[0]}${i.gloss[1] ? '（' + i.gloss[1] + '）' : ''}：${i.gloss[2]}`);
      if (i.src) lines.push(`  - 【${labels.src}】${i.src}`);
      if (i.rule) lines.push(`- \`${t}\` 【${labels.rule} ${i.rule[0]}】${i.rule[1]}`);
    }
    lines.push('');
  }
  fs.writeFileSync(out, lines.join('\n'));
  console.log(out, ws.length, 'scenes');
})().catch(e => { console.error(e); process.exit(1); });
