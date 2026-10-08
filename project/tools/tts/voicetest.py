# 试音色：python3 voicetest.py <voice>[,<voice>…] [文本] [--inst 指令]，输出 samples/<voice>.mp3
import os, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsapi import synth, HERE
args = sys.argv[1:]; inst = None
if '--inst' in args: i = args.index('--inst'); inst = args[i + 1]; del args[i:i + 2]
text = args[1] if len(args) > 1 else '晚上好。我是 Clawd，你的 AI 编程助手。'
os.makedirs(os.path.join(HERE, 'samples'), exist_ok=True)
for v in args[0].split(','):
    t = time.time()
    try:
        a = synth(text, v, inst); open(os.path.join(HERE, 'samples', v + '.mp3'), 'wb').write(a); print(v, len(a), round(time.time() - t, 1), 's')
    except Exception as e: print(v, 'ERR', e)
