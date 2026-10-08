# 批量合成配音：python3 gen.py lines.json --voice <说话人>=<音色> [--voice ...] [--model M] [--jobs 4] [--only 说话人] [--limit N]
# lines.json 来自 voxlist.js；说话人（sp）每个都要给一个 --voice。每句存成 clips/<md5>.mp3，已存在就跳过；失败的记进 failed.json。
# 念法替换（比如把 == 念成「双等号」）写在项目 mv.config.json 的 tts.subs 里：[[正则, 替换], ...]
import argparse, hashlib, json, os, re, sys, time, threading
from concurrent.futures import ThreadPoolExecutor
import dashscope
from dashscope.audio.tts_v2 import SpeechSynthesizer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.environ.get('MV_ROOT') or os.path.dirname(os.path.dirname(HERE))


def config():
    for p in (os.path.join(ROOT, 'mv.config.json'), os.path.join(os.path.dirname(HERE), 'mv.config.json')):
        if os.path.exists(p):
            return json.load(open(p, encoding='utf-8'))
    return {}


CFG = config().get('tts', {})
# key 只从环境变量 DASHSCOPE_API_KEY 或本目录的 .key（已 gitignore）读，绝不写进仓库
KEY = os.path.join(HERE, '.key')
dashscope.api_key = os.environ.get('DASHSCOPE_API_KEY') or open(KEY).read().strip()
dashscope.base_websocket_api_url = os.environ.get('VOX_WS', 'wss://llm-rn6r3clw907289cr.cn-beijing.maas.aliyuncs.com/api-ws/v1/inference')
SUBS = [(a, b) for a, b in CFG.get('subs', [])] + [(r'\s+', ' ')]


def speak_text(s):
    for a, b in SUBS: s = re.sub(a, b, s)
    return s.strip()
def clip_name(k): return hashlib.md5(k.encode('utf-8')).hexdigest()[:16] + '.mp3'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('lines'); ap.add_argument('--voice', action='append', required=True, metavar='SP=音色')
    ap.add_argument('--model', default=CFG.get('model', 'qwen-audio-3.1-tts-next')); ap.add_argument('--jobs', type=int, default=4)
    ap.add_argument('--only'); ap.add_argument('--limit', type=int, default=0); ap.add_argument('--out', default=os.path.join(HERE, 'clips'))
    a = ap.parse_args()
    voices = dict(v.split('=', 1) for v in a.voice)
    L = json.load(open(a.lines, encoding='utf-8')); os.makedirs(a.out, exist_ok=True)
    unknown = sorted({x['sp'] for x in L} - set(voices))
    if unknown: sys.exit('缺少这些说话人的音色（用 --voice 说话人=音色 指定）：' + ', '.join(unknown))
    todo = [x for x in L if (not a.only or x['sp'] == a.only) and not os.path.exists(os.path.join(a.out, clip_name(x['k'])))]
    if a.limit: todo = todo[:a.limit]
    print(len(L), 'lines,', len(todo), 'to synthesize', flush=True)
    failed, lock, n = [], threading.Lock(), [0]
    def one(x):
        voice = voices[x['sp']]
        for tries in range(3):
            try:
                audio = SpeechSynthesizer(model=a.model, voice=voice).call(speak_text(x['text']))
                if not audio: raise RuntimeError('empty audio')
                open(os.path.join(a.out, clip_name(x['k'])), 'wb').write(audio)
                with lock: n[0] += 1; print(f"[{n[0]}/{len(todo)}] {x['sp']} {x['text'][:30]}", flush=True)
                return
            except Exception as e:
                err = f'{type(e).__name__}: {e}'; time.sleep(2 * (tries + 1))
        with lock: failed.append({**x, 'err': err}); print('FAIL', x['text'][:30], err, flush=True)
    with ThreadPoolExecutor(a.jobs) as ex: list(ex.map(one, todo))
    json.dump(failed, open(os.path.join(HERE, 'failed.json'), 'w'), ensure_ascii=False, indent=1)
    print('done, failed:', len(failed))

if __name__ == '__main__': main()
