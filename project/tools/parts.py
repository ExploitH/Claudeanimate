# 从主 dc（Vibe Coding 电影版.dc.html）切出分段 dc：python3 parts.py
# 每段 ≤5 分钟（dc 预览的上限）。配音拉长时长后先跑 mvscenes.js 更新主 dc，再跑这个，看打印的秒数，超了就改 GROUPS。
import os, re, json
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
GROUPS = [['序幕', '01'], ['02'], ['03'], ['04'], ['05'], ['06 · ', '06 蓝图 · Harness', '06 蓝图 3D'], ['06 蓝图 · 选工具'], ['07'], ['08'],
          ['09 · ', '09 一行', '09 警报', '09 短片'], ['09 从今晚起', '10 · '], ['10 回声', '11', '片尾']]
main = open('Vibe Coding 电影版.dc.html').read()
m = re.search(r"window\.OM_SCENES = '(.*?)';</script>", main)
sc = json.loads(m.group(1).replace("\\'", "'"))
chapfile = lambda n: 'mv-f00.jsx' if n.startswith('序幕') else ('mv-f10.jsx' if n.startswith(('10', '11', '片尾')) else 'mv-f%s.jsx' % n[:2])
for f in os.listdir('.'):
    if re.fullmatch(r'Vibe Coding 电影版 \d+\.dc\.html', f): os.remove(f)
used = set()
for gi, g in enumerate(GROUPS):
    sel = [s for s in sc if any(s['name'].startswith(p) for p in g) and s['name'] not in used]
    for s in sel: used.add(s['name'])
    files = []
    for s in sel:
        f = chapfile(s['name'])
        if f not in files: files.append(f)
    imp = './animations-v3.jsx ./tweaks-panel.jsx ' + ' '.join('./' + f for f in files) + ' ./mv-music.jsx ./mv-3d.jsx ./mv-kit3d.jsx ./mv-room.jsx ./mv-core.jsx'
    txt = main[:m.start()] + "window.OM_SCENES = '" + json.dumps(sel, ensure_ascii=False, separators=(',', ':')).replace("'", "\\'") + "';</script>" + main[m.end():]
    txt = re.sub(r'from="\./animations-v3\.jsx[^"]*"', 'from="' + imp + '"', txt)
    open('Vibe Coding 电影版 %d.dc.html' % (gi + 1), 'w').write(txt)
    dur = sum(s['dur'] for s in sel)
    print(gi + 1, dur, 's', '  <-- 超过 300s' if dur > 300 else '', '|'.join(s['name'] for s in sel))
assert len(used) == len(sc), '有场次没分进任何一段：' + str([s['name'] for s in sc if s['name'] not in used])
