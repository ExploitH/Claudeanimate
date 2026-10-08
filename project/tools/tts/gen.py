# 批量合成配音：python3 gen.py lines.json --clawd <音色> --you <音色> [--clawd-inst 指令] [--you-inst 指令] [--model qwen-audio-3.1-tts-flash] [--jobs 4] [--only clawd|you] [--limit N]
# 每句存成 clips/<md5>.mp3，已存在就跳过；失败的句子记进 failed.json
import argparse, hashlib, json, os, re, sys, time, threading
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsapi import synth, MODEL

HERE = os.path.dirname(os.path.abspath(__file__))
# 念出来和写出来不一样的地方
SUB = [(r'==', '双等号'), (r'(?<![A-Za-z])\.env\b', '点 env'), (r'\.gitignore\b', '点 gitignore'), (r'AGENTS\.md', 'AGENTS 点 md'),
       (r'——$', '……'), (r'——', '，'), (r'「|」', ''), (r'\s+', ' ')]
def speak_text(s):
    for a, b in SUB: s = re.sub(a, b, s)
    return s.strip()
def clip_name(k): return hashlib.md5(k.encode('utf-8')).hexdigest()[:16] + '.mp3'

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('lines'); ap.add_argument('--clawd', required=True); ap.add_argument('--you', required=True)
    ap.add_argument('--model', default=MODEL); ap.add_argument('--clawd-inst'); ap.add_argument('--you-inst'); ap.add_argument('--jobs', type=int, default=4)
    ap.add_argument('--only'); ap.add_argument('--limit', type=int, default=0); ap.add_argument('--out', default=os.path.join(HERE, 'clips'))
    a = ap.parse_args()
    L = json.load(open(a.lines)); os.makedirs(a.out, exist_ok=True)
    todo = [x for x in L if (not a.only or x['sp'] == a.only) and not os.path.exists(os.path.join(a.out, clip_name(x['k'])))]
    if a.limit: todo = todo[:a.limit]
    print(len(L), 'lines,', len(todo), 'to synthesize', flush=True)
    failed, lock, n = [], threading.Lock(), [0]
    def one(x):
        voice = a.clawd if x['sp'] == 'clawd' else a.you
        for tries in range(3):
            try:
                audio = synth(speak_text(x['text']), voice, a.clawd_inst if x['sp'] == 'clawd' else a.you_inst, a.model)
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
