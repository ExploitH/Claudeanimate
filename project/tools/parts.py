# 把入口 dc 切成分段 dc（每段不超过 --max 秒，默认 300，dc 预览的上限）：python3 parts.py [--max 300] [--dc 入口.dc.html]
# 按场次原顺序贪心分组；段文件是 <入口名>.part<N>.dc.html，模块列表不变（每段都注册全部世界，全片时间才算得对）。
# 配音拉长时长后先跑 mvscenes.js 更新入口，再跑这个，看打印的秒数。
import os, re, json, sys, glob

ROOT = os.environ.get('MV_ROOT') or os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SC_RE = r"window\.OM_SCENES = '(.*?)';</script>"


def config():
    for p in (os.path.join(ROOT, 'mv.config.json'), os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mv.config.json')):
        if os.path.exists(p):
            return json.load(open(p, encoding='utf-8'))
    return {}


def entry(arg):
    f = arg or os.environ.get('DC') or config().get('dc')
    if f:
        return os.path.join(ROOT, f)
    cands = [f for f in os.listdir(ROOT) if re.search(r'\.dc\.html$', f) and not re.search(r'\.part\d+\.dc\.html$', f)
             and 'window.OM_SCENES' in open(os.path.join(ROOT, f), encoding='utf-8').read()]
    if len(cands) != 1:
        sys.exit('找不到唯一的入口 dc（找到 %d 个）。用 --dc 指定，或在 mv.config.json 里写 "dc"。' % len(cands))
    return os.path.join(ROOT, cands[0])


def main():
    argv = sys.argv[1:]
    cap = 300
    dc_arg = None
    if '--max' in argv:
        cap = float(argv[argv.index('--max') + 1])
    if '--dc' in argv:
        dc_arg = argv[argv.index('--dc') + 1]
    path = entry(dc_arg)
    stem = os.path.basename(path)[:-len('.dc.html')]
    main_txt = open(path, encoding='utf-8').read()
    m = re.search(SC_RE, main_txt)
    sc = json.loads(m.group(1).replace("\\'", "'"))

    groups, cur, tot = [], [], 0
    for s in sc:
        if cur and tot + s['dur'] > cap:
            groups.append(cur); cur, tot = [], 0
        cur.append(s); tot += s['dur']
    if cur:
        groups.append(cur)
    for s in sc:
        if s['dur'] > cap:
            print('警告：场次 %s 自己就超过 %s 秒' % (s['name'], cap))

    for old in glob.glob(os.path.join(ROOT, '%s.part*.dc.html' % stem)):
        os.remove(old)
    for gi, g in enumerate(groups):
        txt = main_txt[:m.start()] + "window.OM_SCENES = '" + json.dumps(g, ensure_ascii=False, separators=(',', ':')).replace("'", "\\'") + "';</script>" + main_txt[m.end():]
        out = os.path.join(ROOT, '%s.part%d.dc.html' % (stem, gi + 1))
        open(out, 'w', encoding='utf-8').write(txt)
        dur = sum(s['dur'] for s in g)
        print(gi + 1, dur, 's', '  <-- 超过 %s 秒' % cap if dur > cap else '', '|'.join(s['name'] for s in g))


if __name__ == '__main__':
    main()
