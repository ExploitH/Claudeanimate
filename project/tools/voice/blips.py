# 人声碎片库（一字一声，Undertale 式）：生成或打包 mv-voice.js
#   python3 blips.py synth [--n 12]     合成占位碎片（类人声的元音小碎片，不是录音），写进项目的 mv-voice.js
#   python3 blips.py pack <目录>         把录好的碎片打包进 mv-voice.js；目录结构：<目录>/narrator/*.wav、<目录>/user/*.wav
# 两种方式输出同一种格式：window.MV_VOX = { rate, banks: { 说话人: [base64 的 16 位单声道 WAV, ...] } }
# 打包时每个文件转成 24 kHz 单声道、去掉首尾静音、最长 0.3 秒、峰值归一化。
import base64, io, json, math, os, random, struct, subprocess, sys, tempfile, wave

RATE = 24000
ROOT = os.environ.get('MV_ROOT') or os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
OUT = os.path.join(ROOT, 'mv-voice.js')
# 占位碎片的说话人：基频范围（Hz）。旁白低一点，用户那一路高一点
BANK_F0 = {'narrator': (150, 210), 'user': (190, 260)}
# 元音的共振峰 (F1, F2, F3)，带宽 (Hz)
VOWELS = {'a': (800, 1200, 2500), 'e': (500, 1700, 2500), 'i': (300, 2300, 3000), 'o': (450, 850, 2500), 'u': (330, 800, 2300)}
BW = (90, 110, 170)


def bandpass(sig, fc, bw, rate=RATE):
    # RBJ 带通（峰值增益 0 dB），逐样本直接形式 I
    w0 = 2 * math.pi * fc / rate
    q = max(.5, fc / bw)
    alpha = math.sin(w0) / (2 * q)
    b0, b1, b2 = alpha, 0.0, -alpha
    a0, a1, a2 = 1 + alpha, -2 * math.cos(w0), 1 - alpha
    x1 = x2 = y1 = y2 = 0.0
    out = []
    for x in sig:
        y = (b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2) / a0
        x2, x1, y2, y1 = x1, x, y1, y
        out.append(y)
    return out


def synth_fragment(rng, f0lo, f0hi):
    dur = rng.uniform(.085, .13)
    n = int(dur * RATE)
    f0 = rng.uniform(f0lo, f0hi)
    glide = rng.uniform(-.15, .15)
    vowel = rng.choice(list(VOWELS))
    # 声门源：锯齿波，基频随时间滑一点
    src, ph = [], 0.0
    for i in range(n):
        t = i / n
        ph += (f0 * (1 + glide * (t - .5))) / RATE
        ph -= math.floor(ph)
        src.append(2 * ph - 1)
    # 三路共振峰并联
    parts = [bandpass(src, f, b) for f, b in zip(VOWELS[vowel], BW)]
    amp = (1.0, .6, .35)
    sig = [sum(a * p[i] for a, p in zip(amp, parts)) for i in range(n)]
    # 有时在前面加一点辅音式的噪声爆破
    if rng.random() < .6:
        burst_n = int(rng.uniform(.008, .014) * RATE)
        noise = [rng.uniform(-1, 1) for _ in range(burst_n)]
        noise = bandpass(noise, rng.uniform(1500, 3500), 1200)
        for i, v in enumerate(noise):
            sig[i] += .35 * v * (1 - i / burst_n)
    # 包络：4 毫秒起音，指数衰减，末尾 10 毫秒淡出
    att, fade, tc = int(.004 * RATE), int(.01 * RATE), n / 4
    for i in range(n):
        e = min(1.0, i / att) if att else 1.0
        e *= math.exp(-i / tc)
        if i > n - fade: e *= (n - i) / fade
        sig[i] *= e
    return sig


def to_wav(samples, rate=RATE):
    pk = max((abs(v) for v in samples), default=1.0) or 1.0
    g = .85 / pk
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, v * g)) * 32767)) for v in samples))
    return buf.getvalue()


def read_wav(path):
    with wave.open(path, 'rb') as w:
        ch, sw, rate, n = w.getnchannels(), w.getsampwidth(), w.getframerate(), w.getnframes()
        raw = w.readframes(n)
    vals = struct.unpack('<%dh' % (len(raw) // 2), raw)
    return [v / 32768 for v in vals[::ch]], rate


def write_js(banks, source):
    js = '/* 人声碎片库（tools/voice/blips.py 生成，勿手改）。一字一声：每个字从说话人的碎片里挑一个。 */\n'
    js += 'window.MV_VOX = ' + json.dumps({'rate': RATE, 'source': source, 'banks': {
        k: [base64.b64encode(w).decode() for w in v] for k, v in banks.items()}}, ensure_ascii=False, separators=(',', ':')) + ';\n'
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(js)
    print(OUT, {k: len(v) for k, v in banks.items()}, round(len(js) / 1e3), 'KB', 'source=' + source)


def synth(n):
    banks = {}
    for bi, (name, (lo, hi)) in enumerate(BANK_F0.items()):
        rng = random.Random(1000 + bi)
        banks[name] = [to_wav(synth_fragment(rng, lo, hi)) for _ in range(n)]
    write_js(banks, 'synth')


def pack(src_dir):
    banks = {}
    tmp = tempfile.mkdtemp()
    af = ('silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.01,areverse,'
          'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.01,areverse,'
          'atrim=end=0.3,afade=t=out:st=0.2:d=0.1')
    for name in sorted(os.listdir(src_dir)):
        d = os.path.join(src_dir, name)
        if not os.path.isdir(d): continue
        files = sorted(f for f in os.listdir(d) if f.lower().endswith(('.wav', '.mp3', '.m4a', '.flac', '.ogg')))
        wavs = []
        for i, f in enumerate(files):
            dst = os.path.join(tmp, '%s_%03d.wav' % (name, i))
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', os.path.join(d, f), '-af', af, '-ac', '1', '-ar', str(RATE), '-sample_fmt', 's16', dst], check=True)
            samples, _ = read_wav(dst)
            if not samples: print('跳过空碎片：', os.path.join(name, f)); continue
            wavs.append(to_wav(samples))
        if wavs: banks[name] = wavs
    if not banks: sys.exit('没有找到碎片：%s/<说话人>/*.wav' % src_dir)
    write_js(banks, 'pack')


if __name__ == '__main__':
    argv = sys.argv[1:]
    if argv[:1] == ['synth']:
        n = int(argv[argv.index('--n') + 1]) if '--n' in argv else 12
        synth(n)
    elif argv[:1] == ['pack'] and len(argv) == 2:
        pack(argv[1])
    else:
        sys.exit('用法：python3 blips.py synth [--n 12]  |  python3 blips.py pack <目录>')
