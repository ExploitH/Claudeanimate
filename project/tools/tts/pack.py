# 把配音片段打包成 mv-voice.js：去掉首尾静音、转成单声道 24kHz 48kbps MP3、量时长、base64
# python3 pack.py lines.json clips_dir out.js
import base64, hashlib, json, os, subprocess, sys, tempfile
lines, clips, out = sys.argv[1:4]
L = json.load(open(lines))
name = lambda k: hashlib.md5(k.encode('utf-8')).hexdigest()[:16] + '.mp3'
D, A, miss = {}, {}, []
tmp = tempfile.mkdtemp()
for x in L:
    src = os.path.join(clips, name(x['k']))
    if not os.path.exists(src): miss.append(x['text']); continue
    dst = os.path.join(tmp, name(x['k']))
    # 首尾静音（-45dB 以下）裁掉，两头各留 40ms
    af = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.04,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.06,areverse,alimiter=limit=0.89'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-af', af, '-ac', '1', '-ar', '24000', '-b:a', '32k', dst], check=True)
    dur = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', dst], capture_output=True, text=True).stdout.strip())
    D[x['k']] = round(dur, 3); A[x['k']] = base64.b64encode(open(dst, 'rb').read()).decode()
js = '/* 配音数据（pack.py 自动生成，勿手改） */\nwindow.MV_VOX = ' + json.dumps({'d': D, 'a': A}, ensure_ascii=False, separators=(',', ':')) + ';\n'
open(out, 'w').write(js)
print(out, len(D), 'clips,', round(sum(D.values()) / 60, 1), 'min,', round(len(js) / 1e6, 2), 'MB; missing', len(miss))
for m in miss[:10]: print('  missing:', m)
