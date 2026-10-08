// 从世界模块导出剧本：node script.js page.html out.md
const path = require('path'), fs = require('fs'), http = require('http');
const D = process.env.MV_DEPS || path.join(__dirname, 'node_modules'), { chromium } = require(path.join(D, 'playwright'));
const MAP = { 'https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js': D + '/react/umd/react.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js': D + '/react-dom/umd/react-dom.production.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js': D + '/three/build/three.min.js' };
(async () => {
  const [file, out] = process.argv.slice(2);
  const srv = http.createServer((q, r) => { r.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); r.end(fs.readFileSync(file)); }).listen(0);
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const pg = await b.newPage();
  await pg.route('**/*', rt => { const u = rt.request().url(); if (MAP[u]) return rt.fulfill({ path: MAP[u], contentType: 'text/javascript' }); return rt.continue(); });
  await pg.goto(`http://127.0.0.1:${srv.address().port}/`);
  await pg.waitForFunction(() => window.__mvPlan, null, { timeout: 60000 });
  const ws = await pg.evaluate(() => window.__mvPlan.ws.map(w => ({ id: w.m.id, scene: w.m.scene, desc: w.m.desc || '', start: w.start, dur: w.m.bars * 2, items: (w.m.S ? w.m.S.items : []).map(i => ({ id: i.id, at: i.at, say: i.say, you: i.you, me: i.me, big: i.big, sub: i.sub, gloss: i.gloss, src: i.src, rule: i.rule })) })));
  await b.close(); srv.close();
  const ts = s => { s = Math.round(s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const clean = s => String(s).replace(/[‹›«»]/g, '');
  const L = ['# Vibe Coding 需要注意的细节 · 电影版剧本', '', '由片子里的世界模块直接导出，台词、词条、出处和规则与成片一致。时间码是成片里的位置。', '',
    '- **你**：输入框里你打的字', '- **Clawd**：对话框里 Clawd 的回复', '- **旁白**：Clawd 在画面里讲的话（字幕）', '- 【词条】【出处】【规则】【大字】是画面上出现的卡片', '', `全片约 ${Math.round(ws.reduce((a, w) => a + w.dur, 0) / 60)} 分钟，共 ${ws.length} 场。`, ''];
  let ch = '';
  for (const w of ws) {
    const c = (w.scene.match(/^(序幕|片尾|\d+)/) || [''])[0];
    if (c !== ch) { ch = c; L.push('', '---', ''); }
    L.push(`## ${w.scene}`, '', `\`${ts(w.start)}–${ts(w.start + w.dur)}\` · ${w.dur} 秒`, '', `> ${w.desc}`, '');
    for (const i of w.items) {
      const t = ts(w.start + i.at * 2);
      if (i.id === 'ref') L.push(`- \`${t}\` 【副歌】顺着感觉走，别闭眼；说清要啥，再按回车。我会犯错的，别全信；小步存档——走。`);
      if (i.you) L.push(`- \`${t}\` **你**：${clean(i.you)}`);
      if (i.me) L.push(`- \`${t}\` **Clawd**：${clean(i.me)}`);
      if (i.big) L.push(`- \`${t}\` 【大字】${clean(i.big)}${i.sub ? ' / ' + clean(i.sub) : ''}`);
      if (i.say) L.push(`- \`${t}\` **旁白**：${clean(i.say)}`);
      if (i.gloss) L.push(`  - 【词条】${i.gloss[0]}${i.gloss[1] ? '（' + i.gloss[1] + '）' : ''}：${i.gloss[2]}`);
      if (i.src) L.push(`  - 【出处】${i.src}`);
      if (i.rule) L.push(`- \`${t}\` 【规则 ${i.rule[0]}】${i.rule[1]}`);
    }
    L.push('');
  }
  fs.writeFileSync(out, L.join('\n'));
  console.log(out, ws.length, 'scenes');
})().catch(e => { console.error(e); process.exit(1); });
