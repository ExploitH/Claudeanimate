# 百炼非实时语音合成（HTTP）。key 只从环境变量 DASHSCOPE_API_KEY 或本目录的 .key（已 gitignore）读，绝不写进仓库
import json, os, urllib.request, time
HERE = os.path.dirname(os.path.abspath(__file__))
KEY = os.environ.get('DASHSCOPE_API_KEY') or open(os.path.join(HERE, '.key')).read().strip()
URL = os.environ.get('VOX_URL', 'https://llm-rn6r3clw907289cr.cn-beijing.maas.aliyuncs.com/api/v1/services/audio/tts/SpeechSynthesizer')
MODEL = 'qwen-audio-3.1-tts-flash'

def synth(text, voice, instruction=None, model=MODEL, text_prompt=None, fmt='mp3', rate=24000, timeout=90):
    inp = {'text': text, 'voice': voice, 'format': fmt, 'sample_rate': rate}
    if instruction: inp['instruction'] = instruction
    if text_prompt: inp['text_prompt'] = text_prompt  # -next 模型：用自然语言描述声音，voice 可省
    if not voice: del inp['voice']
    req = urllib.request.Request(URL, json.dumps({'model': model, 'input': inp}).encode(),
                                 {'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json'})
    try: r = json.load(urllib.request.urlopen(req, timeout=timeout))
    except urllib.error.HTTPError as e: raise RuntimeError(e.read().decode()[:300])
    a = r['output']['audio']
    if a.get('data'):
        import base64; return base64.b64decode(a['data'])
    return urllib.request.urlopen(a['url'], timeout=timeout).read()
