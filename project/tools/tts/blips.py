# 一字一个人声碎片（Undertale 式）：python3 blips.py
# 用百炼 TTS 合成一批单音节，从有声段里切出约 85 ms 的碎片（每个音节两片：带起音的、稳定段的），
# 统一响度，存成 24 kHz 单声道 wav，打包进 ../../mv-voice.js。引擎按字取碎片、按字定音高（见 mv-music.jsx 的 blip）。
# 碎片的顺序有含义：第 2j、2j+1 片来自第 j 个音节；英文 a/o/e/i/u 会取对应音节（SYL 前五个）。
import base64, io, json, os, struct, sys, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from dsapi import synth, HERE

VOICES = {'clawd': 'yezhiqing_v3.1', 'you': 'longanyang_v3.1'}
SYL = ['啊', '哦', '呃', '咿', '呜', '诶', '哎', '哇', '呀', '嘿', '哈', '嗯']   # 前五个对应 a o e i u
SR, FL = 24000, .085
OUT = os.path.join(HERE, 'blips')

def pcm(b):
    i = b.find(b'data'); return np.frombuffer(b[i + 8:], dtype='<i2').astype(np.float64) / 32768   # 流式 wav 的头里长度是占位值，直接取数据段

def zc(x, i, w):   # 在 i 附近 w 个采样里找最近的过零点，起止点落在过零点上才不会咔哒
    lo, hi = max(1, i - w), min(len(x) - 1, i + w)
    s = np.where(np.signbit(x[lo - 1:hi - 1]) != np.signbit(x[lo:hi]))[0]
    return lo + int(s[np.argmin(np.abs(s + lo - i))]) if len(s) else i

def cut(x):
    hop = int(SR * .005); env = np.array([np.sqrt(np.mean(x[i:i + hop * 2] ** 2)) for i in range(0, len(x) - hop * 2, hop)])
    on = env > .12 * env.max(); idx = np.where(on)[0]
    s, e = idx[0] * hop, (idx[-1] + 2) * hop
    n = int(FL * SR)
    a0 = zc(x, max(0, s - int(.012 * SR)), 40)                 # 带起音：从有声段开头往前一点
    mid = (s + e) // 2 - n // 2
    b0 = zc(x, max(0, min(mid, len(x) - n - 1)), 40)           # 稳定段：有声段正中
    if abs(b0 - a0) < n // 3: b0 = zc(x, min(len(x) - n - 1, a0 + n // 2), 40)
    out = []
    for k, st in enumerate((a0, b0)):
        f = x[st:st + n].copy()
        fi, fo = int(SR * (.002 if k == 0 else .006)), int(SR * .03)
        f[:fi] *= np.linspace(0, 1, fi); f[-fo:] *= np.linspace(1, 0, fo)
        out.append(f)
    return out

def f0(f):
    r = np.correlate(f, f, 'full')[len(f) - 1:]; lo, hi = int(SR / 420), int(SR / 70)
    return SR / (lo + int(np.argmax(r[lo:hi]))) if r[lo:hi].max() > .2 * r[0] else 0

def wav(f):
    b = io.BytesIO(); w = wave.open(b, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(f, -1, 1) * 32767).astype('<i2').tobytes()); w.close(); return b.getvalue()

def main():
    os.makedirs(OUT, exist_ok=True); bank = {}
    for sp, v in VOICES.items():
        fr = []
        for t in SYL:
            fs = cut(pcm(synth(t, v, fmt='wav', rate=SR)))
            fr += fs
        rms = [np.sqrt(np.mean(f ** 2)) for f in fr]; tgt = float(np.median(rms))
        fr = [np.clip(f * tgt / max(r, 1e-6), -.95, .95) for f, r in zip(fr, rms)]    # 统一响度
        for i, f in enumerate(fr): open(os.path.join(OUT, f'{sp}_{i:02d}.wav'), 'wb').write(wav(f))
        bank[sp] = [base64.b64encode(wav(f)).decode() for f in fr]
        print(sp, v, len(fr), '片  rms', round(tgt, 3), ' 音高 Hz:', [int(f0(f)) for f in fr])
    p = os.path.join(HERE, '..', '..', 'mv-voice.js')
    open(p, 'w').write('/* Vibe Coding 电影版：一字一个人声碎片（tools/tts/blips.py 生成，勿手改） */\nwindow.MV_VOX = ' + json.dumps({'blips': bank}) + ';\n')
    print('写入', os.path.normpath(p), os.path.getsize(p) // 1024, 'KB')

if __name__ == '__main__': main()
