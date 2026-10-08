# 试一个音色：python3 voicetest.py <voice> [文本]，输出 samples/<voice>.mp3
import os, sys, dashscope, time
from dashscope.audio.tts_v2 import *
HERE = os.path.dirname(os.path.abspath(__file__))
dashscope.api_key = os.environ.get('DASHSCOPE_API_KEY') or open(os.path.join(HERE, '.key')).read().strip()
dashscope.base_websocket_api_url = os.environ.get('VOX_WS', 'wss://llm-rn6r3clw907289cr.cn-beijing.maas.aliyuncs.com/api-ws/v1/inference')
voice = sys.argv[1] if len(sys.argv) > 1 else ''
s = SpeechSynthesizer(model='qwen-audio-3.1-tts-next', voice=voice)
t = time.time()
try:
    a = s.call(sys.argv[2] if len(sys.argv) > 2 else '晚上好。我是 Clawd，你的 AI 编程助手。')
    print('bytes', None if a is None else len(a), 'sec', round(time.time()-t, 2), 'reqid', s.get_last_request_id())
    if a: os.makedirs(os.path.join(HERE, 'samples'), exist_ok=True); open(os.path.join(HERE, 'samples', '%s.mp3' % (voice or 'default')), 'wb').write(a)
except Exception as e:
    print('ERR', type(e).__name__, e)
