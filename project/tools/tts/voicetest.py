# 试一个音色：python3 voicetest.py <voice> [文本] [--model M]，输出 samples/<voice>.mp3
import os, sys, dashscope, time, json
from dashscope.audio.tts_v2 import *
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('MV_ROOT') or os.path.dirname(os.path.dirname(HERE))
CFG = {}
for p in (os.path.join(ROOT, 'mv.config.json'), os.path.join(os.path.dirname(HERE), 'mv.config.json')):
    if os.path.exists(p): CFG = json.load(open(p, encoding='utf-8')).get('tts', {}); break
dashscope.api_key = os.environ.get('DASHSCOPE_API_KEY') or open(os.path.join(HERE, '.key')).read().strip()
dashscope.base_websocket_api_url = os.environ.get('VOX_WS', 'wss://llm-rn6r3clw907289cr.cn-beijing.maas.aliyuncs.com/api-ws/v1/inference')
args = [x for x in sys.argv[1:]]
model = CFG.get('model', 'qwen-audio-3.1-tts-next')
if '--model' in args:
    i = args.index('--model'); model = args[i + 1]; del args[i:i + 2]
voice = args[0] if args else ''
s = SpeechSynthesizer(model=model, voice=voice)
t = time.time()
try:
    a = s.call(args[1] if len(args) > 1 else '你好，这是一段试听。')
    print('bytes', None if a is None else len(a), 'sec', round(time.time()-t, 2), 'reqid', s.get_last_request_id())
    if a: os.makedirs(os.path.join(HERE, 'samples'), exist_ok=True); open(os.path.join(HERE, 'samples', '%s.mp3' % (voice or 'default')), 'wb').write(a)
except Exception as e:
    print('ERR', type(e).__name__, e)
