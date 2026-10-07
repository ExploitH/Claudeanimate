// Vibe Coding · 导演剪辑版：配乐与音效
// 一首 120 BPM、D 小调的歌，按世界换配器；终章转 E 小调。整首按段落分块离线渲染（立体声），
// 每块多渲染 5 秒尾音，播放时叠加。所有音效也落在拍子上，由世界模块给出（单位：小节）。
const MBPM = 120, MB = 60 / MBPM, SR = 32000, TAIL = 5;
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const hsh = x => { const s = Math.sin(x * 91.7 + 1.3) * 43758.5453; return s - Math.floor(s); };

// ---------- 和弦与主旋律 ----------
const CH = {
  Dm: { r: 38, pad: [57, 62, 65], arp: [62, 65, 69, 74] }, Bb: { r: 34, pad: [58, 62, 65], arp: [62, 65, 70, 74] },
  F: { r: 41, pad: [57, 60, 65], arp: [60, 65, 69, 72] }, C: { r: 36, pad: [55, 60, 64], arp: [60, 64, 67, 72] },
  Eb: { r: 39, pad: [58, 63, 67], arp: [63, 67, 70, 75] }, Cdim: { r: 37, pad: [55, 61, 64], arp: [61, 64, 67, 73] },
  B: { r: 35, pad: [59, 63, 66], arp: [63, 66, 71, 75] },
  Em: { r: 40, pad: [59, 64, 67], arp: [64, 67, 71, 76] }, Ce: { r: 36, pad: [60, 64, 67], arp: [64, 67, 72, 76] },
  G: { r: 43, pad: [59, 62, 67], arp: [62, 67, 71, 74] }, D: { r: 38, pad: [57, 62, 66], arp: [62, 66, 69, 74] },
  E: { r: 40, pad: [56, 59, 64], arp: [64, 68, 71, 76] },
  Dm9: { r: 38, pad: [53, 57, 60, 64] }, Bbj7: { r: 34, pad: [50, 53, 57, 60] }, Gm9: { r: 43, pad: [53, 57, 58, 62] }, A7b9: { r: 33, pad: [55, 58, 61, 64] },
};
const PD = ['Dm', 'Bb', 'F', 'C'], PE = ['Em', 'Ce', 'G', 'D'], PJ = ['Dm9', 'Bbj7', 'Gm9', 'A7b9'], PA = ['Dm', 'Eb', 'Dm', 'Cdim'], PR = ['Bb', 'C', 'Dm', 'F'];
// 主旋律 8 小节：[小节, 拍, 音高, 拍数]
const HOOK = [
  [0, 0, 74, 1.5], [0, 1.5, 76, .5], [0, 2, 77, 1], [0, 3, 76, .5], [0, 3.5, 74, .5],
  [1, 0, 74, 2], [1, 2, 72, 1], [1, 3, 70, 1],
  [2, 0, 72, 1.5], [2, 1.5, 74, .5], [2, 2, 72, 1], [2, 3, 69, 1],
  [3, 0, 67, 2], [3, 2, 69, .5], [3, 2.5, 70, .5], [3, 3, 72, 1],
  [4, 0, 81, 1], [4, 1, 77, .5], [4, 1.5, 76, .5], [4, 2, 74, 1], [4, 3, 77, 1],
  [5, 0, 77, 2], [5, 2, 79, 1], [5, 3, 77, 1],
  [6, 0, 81, 1.5], [6, 1.5, 79, .5], [6, 2, 77, 1], [6, 3, 72, 1],
  [7, 0, 76, 4],
];
// 黑色电影段的小号旋律（摇摆）
const NOIR = [
  [0, 0, 69, 1.5], [0, 1.5, 67, .5], [0, 2, 65, 1], [0, 3, 64, 1],
  [1, 0, 65, 2], [1, 2, 69, 1], [1, 3, 67, 1],
  [2, 0, 70, 1.5], [2, 1.5, 69, .5], [2, 2, 67, 1], [2, 3, 65, 1],
  [3, 0, 70, 1], [3, 1, 69, 1], [3, 2, 67, 1], [3, 3, 64, 1],
  [4, 0, 74, 2], [4, 2, 72, 1], [4, 3, 69, 1],
  [5, 0, 77, 1.5], [5, 1.5, 76, .5], [5, 2, 74, 2],
  [6, 0, 74, 1], [6, 1, 72, 1], [6, 2, 70, 1.5], [6, 3.5, 69, .5],
  [7, 0, 73, 2], [7, 2, 69, 2],
];
const WALK = { Dm9: [38, 40, 41, 45], Bbj7: [46, 45, 41, 42], Gm9: [43, 46, 50, 44], A7b9: [45, 49, 52, 37] };

function mk(w, ev) {
  const S = {
    at: (b, bt = 0) => w.start + (b * 4 + bt) * MB,
    add(i, b, bt, m, d, v, x) { ev.push({ t: S.at(b, bt), i, m, d: (d || 0) * MB, v: v ?? 1, x }); },
    sw: bt => (bt % 1 === .5 ? bt + 1 / 6 : bt),
  };
  return S;
}
const each = (b0, b1, fn) => { for (let b = b0; b < b1; b++) fn(b); };
function hook(S, b0, inst, tr = 0, from = 0, to = 8, v = 1, oct = 0) {
  for (const [b, bt, m, d] of HOOK) if (b >= from && b < to) S.add(inst, b0 + b - from, bt, m + tr + oct, d, v);
}
function pads(S, b0, b1, prog, kind, v = 1, off = 0) { each(b0, b1, b => S.add('pad', b, 0, CH[prog[(b - b0 + off) % 4]].pad, 4, v, kind)); }
function roots(S, b0, b1, prog, kind, v = 1, pat = [[0, 4]], off = 0, oct = 0) {
  each(b0, b1, b => { const r = CH[prog[(b - b0 + off) % 4]].r + oct; for (const [bt, d, o] of pat) S.add('bass', b, bt, r + (o || 0), d, v, kind); });
}
function arps(S, b0, b1, prog, inst, step, pat, v = 1, oct = 0, off = 0) {
  each(b0, b1, b => { const a = CH[prog[(b - b0 + off) % 4]].arp; for (let j = 0; j * step < 4 - 1e-6; j++) S.add(inst, b, j * step, a[pat[j % pat.length]] + oct, step * .9, v); });
}
function four(S, b0, b1, v = 1, kind = 'main') { each(b0, b1, b => { for (let j = 0; j < 4; j++) S.add('kick', b, j, 0, 0, v, kind); }); }
function back(S, b0, b1, inst, v = 1, kind) { each(b0, b1, b => { S.add(inst, b, 1, 0, 0, v, kind); S.add(inst, b, 3, 0, 0, v, kind); }); }
function hats(S, b0, b1, step, v = 1, open = false, offbeat = false, swing = false) {
  each(b0, b1, b => { for (let j = 0; j * step < 4 - 1e-6; j++) { const bt = j * step; if (offbeat && bt % 1 !== .5) continue; S.add('hat', b, swing ? S.sw(bt) : bt, 0, 0, v * (bt % 1 === 0 ? .75 : 1), open ? 'open' : 'closed'); } });
}
function roll(S, b, from, to, inst = 'snare', kind = 'main', v0 = .2, v1 = .9, step = .25) {
  for (let bt = from; bt < to - 1e-6; bt += step) S.add(inst, b, bt, 0, 0, lerpM(v0, v1, (bt - from) / (to - from)), kind);
}
const lerpM = (a, b, k) => a + (b - a) * k;
// 世界模块自己写配乐时用的工具（m.music(S, H, w)）
const MH = { CH, PD, PE, PJ, PA, PR, HOOK, NOIR, WALK, each, hook, pads, roots, arps, four, back, hats, roll, mtof };

// ---------- 各段编曲 ----------
const ARR = {
  w00(S) { // 开机：心跳（两小节只有光标）、音乐盒（打字）、停一拍、渐强
    each(0, 7, b => { S.add('kick', b, 0, 0, 0, .9, 'heart'); S.add('kick', b, 2, 0, 0, .55, 'heart'); });
    S.add('drone', 0, 0, 26, 32, .5);
    S.add('pad', 0, 0, CH.Dm.pad, 8, .55, 'warm');
    ['Dm', 'Bb', 'F', 'C'].forEach((c, i) => S.add('pad', 2 + i, 0, CH[c].pad, 4, .7, 'warm'));
    hook(S, 2, 'box', 0, 0, 4, .9);
    S.add('pad', 6, 0, CH.Dm.pad, 8, .6, 'string');
    S.add('riser', 6, 0, 0, 8, .8);
    roll(S, 7, 0, 4, 'snare', 'main', .1, .75, .25);
    S.add('rev', 7, 0, 0, 4, .7);
  },
  w01(S) { // 梦：lo-fi 摇摆 → 第 8 小节停一拍（只剩流体）→ 肥皂泡 → 第 13 小节冻结成四拍
    pads(S, 0, 22, PD, 'warm', .65);
    arps(S, 0, 13, PD, 'tri', .5, [0, 1, 2, 3, 2, 1, 2, 3], .55);
    S.add('crackle', 0, 0, 0, 52, .5);
    S.add('crash', 0, 0, 0, 0, .5);
    each(4, 13, b => { if (b === 8) return; S.add('kick', b, 0, 0, 0, .8, 'soft'); S.add('kick', b, 2.5, 0, 0, .55, 'soft'); S.add('snare', b, 2, 0, 0, .55, 'lofi'); });
    hats(S, 4, 8, .5, .3, false, false, true); hats(S, 9, 13, .5, .3, false, false, true);
    roots(S, 4, 13, PD, 'sub', .6, [[0, 4]]);
    hook(S, 4, 'flute', 0, 0, 8, .85);
    S.add('lp', 8, 0, 1400, .5); S.add('lp', 8, 3, 15000, 1);
    S.add('rev', 12, 0, 0, 4, .6);
    // 冻结之后：四拍底鼓，琶音变亮
    four(S, 13, 22, .78);
    back(S, 13, 22, 'clap', .55);
    hats(S, 13, 22, .25, .22);
    roots(S, 13, 22, PD, 'saw', .55, [[0, .5], [.5, .5, 12], [1, .5], [1.5, .5, 12], [2, .5], [2.5, .5, 12], [3, .5], [3.5, .5, 12]]);
    arps(S, 13, 22, PD, 'arp', .25, [0, 1, 2, 3, 1, 2, 3, 2], .42, 12);
    S.add('crash', 13, 0, 0, 0, .55);
    roll(S, 21, 2, 4, 'snare', 'main', .2, .8, .25);
  },
  w02(S) { // 轨道：开头只有心跳和弦乐（「我不记得你」停两拍），第 4 小节起合成器进来；绕轨道时钟琴；塞满变闷
    S.add('crash', 0, 0, 0, 0, .6);
    pads(S, 0, 20, PD, 'string', .8);
    each(0, 4, b => { S.add('kick', b, 0, 0, 0, .55, 'heart'); S.add('kick', b, 2, 0, 0, .35, 'heart'); });
    S.add('lp', 0, 0, 2200, .5); S.add('lp', 4, 0, 15000, 1);
    roots(S, 4, 20, PD, 'saw', .6, [[0, .5], [.5, .5], [1, .5], [1.5, .5], [2, .5], [2.5, .5], [3, .5], [3.5, .5]]);
    arps(S, 4, 20, PD, 'arp', .25, [0, 1, 2, 3, 2, 3, 1, 2], .4, 12);
    four(S, 4, 20, .72);
    hats(S, 5, 20, .5, .3, true, true);
    back(S, 6, 20, 'snare', .55);
    each(10, 14, b => [74, 77, 81, 84].forEach((m, j) => S.add('bell', b, j, m, 1, .5)));
    S.add('lp', 14, 0, 650, 2); S.add('lp', 16, 0, 15000, 3);
    [76, 79, 83].forEach((m, j) => S.add('bell', 16, 3 + j * 2, m, 3, .55));
    S.add('crash', 18, 2, 0, 0, .55);
    roll(S, 19, 2, 4, 'snare', 'main', .2, .7, .25);
  },
  w03(S) { // 印刷：放克；第 3、5 小节是两处停顿（只剩贝斯和弦乐），主旋律第 10 小节进
    S.add('crash', 0, 0, 0, 0, .6);
    pads(S, 3, 20, PD, 'string', .5);
    const hold = b => b === 3 || b === 5;
    each(0, 20, b => {
      const c = CH[PD[b % 4]], r = c.r + 12;
      if (hold(b)) { S.add('bass', b, 0, r, 3.5, .6, 'pluck'); S.add('stab', b, 0, c.pad, .5, .4); return; }
      [[0, r], [.75, r], [1.5, r + 12], [2, r], [2.5, r + 7], [3.25, r], [3.5, r + 12]].forEach(([bt, m]) => S.add('bass', b, bt, m, .35, .75, 'pluck'));
      [0, 1.5, 2.5].forEach(bt => S.add('kick', b, bt, 0, 0, bt ? .7 : .9, 'main'));
      S.add('clap', b, 1, 0, 0, .6); S.add('clap', b, 3, 0, 0, .6);
      if (b >= 2) [.5, 1.5, 2.5, 3.5].forEach(bt => S.add('stab', b, bt, c.pad, .2, .45));
      for (let j = 0; j < 16; j++) S.add('hat', b, j / 4, 0, 0, .28 * (j % 4 === 0 ? .75 : 1), 'closed');
    });
    S.add('crash', 6, 0, 0, 0, .5);
    hook(S, 10, 'square', 0, 0, 8, .7);
    roll(S, 19, 3, 4, 'snare', 'main', .3, .8, .125);
  },
  w04(S) { // 纸：拇指琴；Clawd 被纸条埋住时音乐变闷，新纸滑进来时打开
    pads(S, 0, 20, PD, 'organ', .6);
    arps(S, 0, 20, PD, 'kalimba', .5, [0, 1, 2, 3, 1, 2, 3, 2], .6);
    each(0, 20, b => {
      S.add('kick', b, 0, 0, 0, .75, 'soft'); S.add('kick', b, 2.5, 0, 0, .5, 'soft'); S.add('snare', b, 2, 0, 0, .45, 'lofi');
      [.5, 1.5, 2.5, 3.5].forEach((bt, j) => S.add('wood', b, bt, j % 2 ? 1250 : 900, 0, .45));
      for (let j = 0; j < 16; j++) S.add('shaker', b, j / 4, 0, 0, j % 2 ? .35 : .2);
      const r = CH[PD[b % 4]].r + 12; S.add('bass', b, 0, r, 1.5, .7, 'upright'); S.add('bass', b, 2.5, r + 7, 1, .55, 'upright');
    });
    hook(S, 5, 'whistle', 0, 0, 8, .7);
    S.add('lp', 14, 0, 1500, 1.5); S.add('lp', 16, 1, 14000, 1);
  },
  w05(S) { // 霓虹：第一次副歌
    S.add('siren', 0, 0, 0, 4, .45);
    S.add('kick', 0, 0, 0, 0, 1, 'main'); S.add('crash', 0, 0, 0, 0, .7); S.add('bass', 0, 0, 38, 2, .8, 'saw');
    S.add('kick', 0, 2.5, 0, 0, .8, 'main'); S.add('bass', 0, 2.5, 38, 1.5, .7, 'saw');
    pads(S, 1, 20, PD, 'string', .75, 1);
    four(S, 1, 20, .9);
    back(S, 1, 20, 'snare', .7, 'gated');
    hats(S, 1, 20, .5, .32);
    hats(S, 4, 12, .5, .22, true, true);
    roots(S, 1, 20, PD, 'saw', .7, [[0, .5], [.5, .5, 12], [1, .5], [1.5, .5, 12], [2, .5], [2.5, .5, 12], [3, .5], [3.5, .5, 12]], 1);
    arps(S, 1, 20, PD, 'arp', .25, [0, 1, 2, 3], .38, 12, 1);
    S.add('crash', 4, 0, 0, 0, .8);
    hook(S, 4, 'saw', 0, 0, 8, .95);
    hook(S, 8, 'saw', 0, 4, 8, .35, -12);
    [2, 2.5, 3, 3.5].forEach((bt, j) => S.add('tom', 11, bt, [220, 180, 150, 120][j], 0, .7));
    S.add('crash', 12, 0, 0, 0, .6);
    roll(S, 19, 2, 4, 'snare', 'gated', .3, .9, .25);
  },
  w06(S) { // 蓝图：机械音序
    S.add('crash', 0, 0, 0, 0, .55);
    pads(S, 0, 22, PD, 'glass', .7);
    four(S, 0, 22, .8);
    back(S, 3, 22, 'snare', .5);
    each(0, 22, b => { for (let j = 0; j < 16; j++) S.add('tick', b, j / 4, 0, 0, j % 4 === 2 ? .55 : .3); });
    each(0, 22, b => { const r = CH[PD[b % 4]].r + 12; [0, 0, 12, 0, 0, 12, 0, 7, 0, 0, 12, 0, 0, 12, 7, 12].forEach((o, j) => S.add('bass', b, j / 4, r + o, .22, .55, 'seq')); });
    hook(S, 4, 'bell', 0, 4, 8, .7);
    [74, 76, 77, 79, 81, 84].forEach((m, j) => S.add('bell', 11, j * 2, m, 2.5, .75));
    roll(S, 21, 2, 4, 'snare', 'main', .2, .8, .25);
  },
  w07(S) { // 存档：芯片音乐；三颗心灭掉后整段静音（GAME OVER、CONTINUE 菜单），选完再回来
    S.add('kick', 0, 0, 0, 0, 1, 'chip');
    const live = b => !(b >= 13 && b < 16);
    each(0, 20, b => {
      if (!live(b)) return;
      const c = CH[PD[b % 4]], soft = b >= 16 ? .6 : 1;
      [0, 2, 2.5].forEach(bt => S.add('kick', b, bt, 0, 0, .9 * soft, 'chip'));
      [1, 3].forEach(bt => S.add('snare', b, bt, 0, 0, .9 * soft, 'chip'));
      for (let j = 0; j < 8; j++) S.add('hat', b, j / 2, 0, 0, .5 * soft, 'chip');
      [0, .5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((bt, j) => S.add('bass', b, bt, c.r + 12 + (j % 2 ? 12 : 0), .45, .8 * soft, 'chip'));
      for (let j = 0; j < 16; j++) S.add('chiparp', b, j / 4, c.arp[j % 3] + 12, .22, .75 * soft);
    });
    hook(S, 4, 'chip', 0, 0, 8, 1);
    hook(S, 18, 'chip', 0, 0, 2, .5);
  },
  w08(S) { // 黑色电影：爵士；第 2 小节举牌之后一整小节只有贝斯和鼓刷，小号第 5 小节进
    each(0, 20, b => {
      const cn = PJ[b % 4], c = CH[cn], quiet = b >= 16, hush = b === 2;
      WALK[cn].forEach((m, j) => S.add('bass', b, j, m, .95, hush ? .55 : .8, 'upright'));
      if (!hush) [0, 1, 1 + 2 / 3, 2, 3, 3 + 2 / 3].forEach(bt => S.add('ride', b, bt, 0, 0, bt % 1 ? .3 : .45));
      S.add('snare', b, 1, 0, 0, .5, 'brush'); S.add('snare', b, 3, 0, 0, .5, 'brush');
      if (!quiet && !hush) { S.add('kick', b, 0, 0, 0, .35, 'soft'); S.add('kick', b, 2, 0, 0, .25, 'soft'); }
      if (!hush) { S.add('rhodes', b, 0, c.pad, 1.2, .55); S.add('rhodes', b, 1 + 2 / 3, c.pad, 1.6, .45); }
    });
    S.add('bell', 3, 0, 57, 3, .35);
    for (const [b, bt, m, d] of NOIR) S.add('trumpet', 5 + b, S.sw(bt), m, d, .75);
  },
  w09(S) { // 警报：工业 → 删库前静一拍、第 12 小节重击 → 余波 → 重建
    S.add('drone', 0, 0, 26, 48, .7);
    each(0, 12, b => { for (let j = 0; j < 16; j++) S.add('tick', b, j / 4, 0, 0, b >= 10 ? .5 : .28); });
    each(10, 12, b => { for (let j = 0; j < 16; j++) S.add('tick', b, j / 4 + .125, 0, 0, .3); });
    S.add('kick', 0, 0, 0, 0, .7, 'heart'); S.add('kick', 1, 0, 0, 0, .7, 'heart');
    each(2, 10, b => {
      const c = CH[PA[(b - 2) % 4]];
      [0, .75, 2, 2.75].forEach(bt => S.add('kick', b, bt, 0, 0, .9, 'main'));
      S.add('snare', b, 1, 0, 0, .7, 'ind'); S.add('snare', b, 3, 0, 0, .7, 'ind');
      S.add('bass', b, 0, c.r, 3.5, .85, '808');
      S.add('pad', b, 0, c.pad, 4, .7, 'dark');
    });
    hats(S, 2, 10, .25, .22);
    S.add('siren', 2, 0, 0, 8, .35);
    S.add('riser', 10, 0, 0, 7, .9);
    each(10, 12, b => S.add('kick', b, 0, 0, 0, .8, 'main'));
    S.add('kick', 11, 2, 0, 0, .8, 'main');
    S.add('mute', 11, 3, 0, 1);
    S.add('impact', 12, 0, 0, 0, 1);
    S.add('crash', 12, 0, 0, 0, .9);
    S.add('lp', 12, .5, 520, 1); S.add('lp', 15, 0, 15000, 4);
    S.add('drone', 12, 0, 26, 16, .6);
    S.add('rev', 15, 0, 0, 4, .6);
    pads(S, 16, 24, PR, 'warm', .8);
    arps(S, 16, 24, PR, 'tri', .5, [0, 1, 2, 3, 2, 1, 2, 3], .5);
    four(S, 18, 24, .75);
    hats(S, 19, 24, .5, .25);
    back(S, 20, 24, 'snare', .6);
    roots(S, 18, 24, PR, 'saw', .6, [[0, .5], [.5, .5, 12], [1, .5], [1.5, .5, 12], [2, .5], [2.5, .5, 12], [3, .5], [3.5, .5, 12]], 2);
    [[20, 74], [21, 76], [22, 77], [23, 81]].forEach(([b, m]) => S.add('bell', b, 0, m, 4, .55));
    S.add('pad', 24, 0, CH.B.pad, 8, .85, 'string');
    S.add('bass', 24, 0, CH.B.r, 8, .7, 'sub');
    S.add('riser', 24, 0, 0, 8, 1);
    four(S, 24, 25, .8);
    roll(S, 25, 0, 4, 'snare', 'main', .2, 1, .25);
    S.add('rev', 25, 0, 0, 4, .8);
  },
  w10(S) { // 终章：凌晨三点的两小节安静（时钟、音乐盒），第 2 小节重击进 E 小调全编制；副歌 2–10，清单 10–18
    S.add('pad', 0, 0, CH.Em.pad, 8, .55, 'warm');
    each(0, 2, b => { for (let j = 0; j < 4; j++) S.add('tick', b, j, 0, 0, .35); });
    hook(S, 0, 'box', 2, 6, 8, .7);
    S.add('riser', 1, 0, 0, 4, .9);
    roll(S, 1, 2, 4, 'snare', 'main', .2, .9, .25);
    const O = 2;
    S.add('impact', O, 0, 0, 0, .9);
    S.add('crash', O, 0, 0, 0, .9); S.add('crash', O + 8, 0, 0, 0, .8);
    pads(S, O, 18, PE, 'string', .8); pads(S, O, 18, PE, 'choir', .55);
    four(S, O, 18, 1);
    back(S, O, 18, 'snare', .7, 'gated'); back(S, O, 18, 'clap', .5);
    hats(S, O, 18, .25, .24); hats(S, O, 18, .5, .25, true, true);
    roots(S, O, 18, PE, 'saw', .75, [[0, .5], [.5, .5, 12], [1, .5], [1.5, .5, 12], [2, .5], [2.5, .5, 12], [3, .5], [3.5, .5, 12]]);
    arps(S, O, 18, PE, 'arp', .25, [0, 1, 2, 3, 1, 2, 3, 2], .36, 12);
    hook(S, O, 'saw', 2, 0, 8, .95); hook(S, O + 8, 'saw', 2, 0, 8, .95);
    hook(S, O + 8, 'saw', 2, 0, 8, .4, 12);
    [2, 2.5, 3, 3.5].forEach((bt, j) => S.add('tom', 17, bt, [220, 180, 150, 120][j], 0, .7));
  },
  w11(S) { // 片尾：音乐盒、E 大三和弦、两下心跳
    ['Em', 'Ce', 'G', 'D'].forEach((c, i) => S.add('pad', i, 0, CH[c].pad, 4, .6, 'warm'));
    hook(S, 0, 'box', 2, 0, 4, .85);
    S.add('pad', 4, 0, CH.E.pad, 10, .7, 'warm');
    S.add('bass', 4, 0, 40, 10, .5, 'sub');
    [64, 68, 71, 76].forEach((m, j) => S.add('box', 4, j * .5, m, 3, .7));
    S.add('kick', 6, 0, 0, 0, .8, 'heart'); S.add('kick', 6, 2, 0, 0, .6, 'heart');
  },
};

// ---------- 渲染 ----------
let NOISE = null, IR = null, CLIP = null;
function noiseData() { if (!NOISE) { NOISE = new Float32Array(SR * 2); let s = 7; for (let i = 0; i < NOISE.length; i++) { s = (s * 16807) % 2147483647; NOISE[i] = s / 2147483647 * 2 - 1; } } return NOISE; }
function irData() {
  if (!IR) {
    const n = Math.floor(SR * 2.6); IR = [new Float32Array(n), new Float32Array(n)]; let s = 11;
    for (let c = 0; c < 2; c++) { let lp = 0; for (let i = 0; i < n; i++) { s = (s * 16807) % 2147483647; lp = lp * .55 + (s / 2147483647 * 2 - 1) * .45; const k = i / n; IR[c][i] = lp * Math.pow(1 - k, 1.6) * Math.exp(-k * 3) * Math.min(1, i / (SR * .012)) * .5; } }
  }
  return IR;
}
function clipCurve() { if (!CLIP) { CLIP = new Float32Array(2048); for (let i = 0; i < 2048; i++) { const x = i / 1023.5 - 1; CLIP[i] = Math.tanh(x * 1.3) / Math.tanh(1.3); } } return CLIP; }
const WAVES = new WeakMap();
function pulseWave(A, duty) {
  let m = WAVES.get(A); if (!m) { m = {}; WAVES.set(A, m); }
  if (m[duty]) return m[duty];
  const n = 40, re = new Float32Array(n), im = new Float32Array(n);
  for (let k = 1; k < n; k++) re[k] = 2 / (k * Math.PI) * Math.sin(k * Math.PI * duty);
  return (m[duty] = A.createPeriodicWave(re, im));
}

function renderChunk(ev, cs, ce, opt) {
  const len = ce - cs + TAIL, A = new OfflineAudioContext(2, Math.ceil(len * SR), SR);
  const nb = A.createBuffer(1, SR * 2, SR); nb.copyToChannel(noiseData(), 0);
  const irD = irData(), ir = A.createBuffer(2, irD[0].length, SR); ir.copyToChannel(irD[0], 0); ir.copyToChannel(irD[1], 1);
  const lim = A.createWaveShaper(); lim.curve = clipCurve(); lim.connect(A.destination);
  const mute = A.createGain(); mute.connect(lim);
  const master = A.createGain(); master.gain.value = .62 * (opt.vol ?? .8); master.connect(mute);
  const mlp = A.createBiquadFilter(); mlp.type = 'lowpass'; mlp.frequency.value = 15000; mlp.Q.value = .6; mlp.connect(master);
  const music = A.createGain(); music.connect(mlp);
  const synth = A.createGain(); synth.connect(music);
  const drums = A.createGain(); drums.gain.value = .9; drums.connect(music);
  const sfxB = A.createGain(); sfxB.gain.value = .9; sfxB.connect(master);
  const verb = A.createConvolver(); verb.normalize = false; verb.buffer = ir; const vOut = A.createGain(); vOut.gain.value = .55; verb.connect(vOut); vOut.connect(mlp);
  const dIn = A.createGain(), dlp = A.createBiquadFilter(); dlp.type = 'lowpass'; dlp.frequency.value = 2800; dIn.connect(dlp);
  const dl = A.createDelay(2), dr = A.createDelay(2); dl.delayTime.value = MB * .75; dr.delayTime.value = MB * .75;
  const fb = A.createGain(); fb.gain.value = .4; const pl = A.createStereoPanner(), pr = A.createStereoPanner(); pl.pan.value = -.75; pr.pan.value = .75;
  dlp.connect(dl); dl.connect(pl); pl.connect(music); dl.connect(dr); dr.connect(pr); pr.connect(music); dr.connect(fb); fb.connect(dl);
  const R = t => t - cs;
  // 侧链：合成器总线跟着底鼓压一下
  const sc = synth.gain; sc.setValueAtTime(1, 0);
  for (const e of ev) if (e.i === 'kick' && e.x !== 'heart' && e.t >= cs - .3 && e.t < ce + TAIL) {
    const t = R(e.t); if (t < .01) continue; const d = e.x === 'soft' ? .3 : .55;
    sc.setValueAtTime(1, t - .005); sc.linearRampToValueAtTime(1 - d * e.v, t + .015); sc.linearRampToValueAtTime(1, t + .26);
  }
  // 自动化：低通（变闷）和静音
  const lpEv = ev.filter(e => e.i === 'lp'), muteEv = ev.filter(e => e.i === 'mute');
  let f0 = 15000; for (const e of lpEv) if (e.t + e.d <= cs) f0 = e.m;
  mlp.frequency.setValueAtTime(f0, 0);
  for (const e of lpEv) if (e.t + e.d > cs && e.t < ce + TAIL) { const t = Math.max(0, R(e.t)); mlp.frequency.setValueAtTime(f0, t); mlp.frequency.exponentialRampToValueAtTime(e.m, Math.max(t + .01, R(e.t + e.d))); f0 = e.m; }
  mute.gain.setValueAtTime(1, 0);
  for (const e of muteEv) if (e.t + e.d > cs && e.t < ce + TAIL) { const a = Math.max(0, R(e.t)), b = R(e.t + e.d); mute.gain.setValueAtTime(1, a); mute.gain.linearRampToValueAtTime(0, a + .02); mute.gain.setValueAtTime(0, Math.max(a + .02, b - .005)); mute.gain.linearRampToValueAtTime(1, b + .005); }

  // ---------- 基本单元 ----------
  const G = () => A.createGain();
  const O = (type, f, t) => { const o = A.createOscillator(); if (type.startsWith('pulse')) o.setPeriodicWave(pulseWave(A, +type.slice(5) / 100)); else o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); return o; };
  const Fl = (type, f, q = .7) => { const x = A.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q; return x; };
  const perc = (g, t, peak, a, dec) => { const p = g.gain; p.setValueAtTime(.0001, t); p.linearRampToValueAtTime(peak, t + a); p.exponentialRampToValueAtTime(.0001, t + a + dec); return t + a + dec; };
  const adsr = (g, t, peak, a, d, s, hold, r) => {
    const p = g.gain, sv = Math.max(.0001, peak * s); p.setValueAtTime(.0001, t); p.linearRampToValueAtTime(peak, t + a);
    if (hold > t + a + d) { p.linearRampToValueAtTime(sv, t + a + d); p.setValueAtTime(sv, hold); } else p.linearRampToValueAtTime(sv, Math.max(t + a + .002, hold));
    p.linearRampToValueAtTime(.0001, hold + r); return hold + r;
  };
  // 播完的声部要从总线上断开，否则离线渲染会一直带着成千上万个节点跑，越渲越慢
  let curEnd = 0; const live = [];
  const out = (n, bus, pan = 0, rv = 0, dly = 0) => {
    let x = n; if (pan) { const p = A.createStereoPanner(); p.pan.value = pan; n.connect(p); x = p; }
    const v = { x, s: [], end: curEnd }; live.push(v);
    x.connect(bus); if (rv) { const s = G(); s.gain.value = rv; x.connect(s); s.connect(verb); v.s.push(s); } if (dly) { const s = G(); s.gain.value = dly; x.connect(s); s.connect(dIn); v.s.push(s); }
  };
  const sweep = () => { const now = A.currentTime; let j = 0; for (const v of live) { if (v.end < now) { v.x.disconnect(); v.s.forEach(s => s.disconnect()); } else live[j++] = v; } live.length = j; };
  const nz = (t, len, type, f, q, peak, f2, a = .002, seed = 0) => {
    const s = A.createBufferSource(); s.buffer = nb; const fl = Fl(type, f, q); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + len);
    const g = G(); perc(g, t, peak, a, len); s.connect(fl); fl.connect(g); s.start(t, hsh(t * 13.1 + seed) * 1.5, len + a + .05); return g;
  };
  const tn = (t, f, len, peak, type = 'sine', f2, a = .004) => { const o = O(type, f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + len); const g = G(); perc(g, t, peak, a, len); o.connect(g); o.stop(t + a + len + .05); return g; };
  const vib = (o, t, rate, cents, delay = .2) => { const l = O('sine', rate, t); const g = G(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(cents, t + delay + .3); l.connect(g); g.connect(o.detune); return l; };

  // ---------- 乐器 ----------
  const I = {
    kick(e, t) {
      const k = e.x || 'main', v = e.v;
      if (k === 'heart') { const o = O('sine', 75, t); o.frequency.exponentialRampToValueAtTime(40, t + .14); const g = G(); perc(g, t, v * .9, .004, .3); const f = Fl('lowpass', 220); o.connect(f); f.connect(g); out(g, drums); o.stop(t + .4); return; }
      const chip = k === 'chip', soft = k === 'soft';
      const o = O(chip ? 'square' : 'sine', chip ? 140 : soft ? 115 : 155, t); o.frequency.exponentialRampToValueAtTime(chip ? 42 : 45, t + (chip ? .07 : .11));
      const g = G(); perc(g, t, v * (soft ? .75 : chip ? .95 : 1), .002, soft ? .3 : chip ? .12 : .42);
      if (chip) { const f = Fl('lowpass', 1400); o.connect(f); f.connect(g); } else o.connect(g);
      out(g, drums); o.stop(t + .5);
      if (!soft) out(nz(t, .012, 'highpass', 3500, .7, v * (chip ? .15 : .22)), drums);
      if (soft) out(nz(t, .05, 'lowpass', 900, .7, v * .12), drums);
    },
    snare(e, t) {
      const k = e.x || 'main', v = e.v;
      if (k === 'brush') { out(nz(t, .28, 'bandpass', 3200, .6, v * .5, 2000, .035), drums, .1, .15); return; }
      if (k === 'chip') { const s = A.createBufferSource(); s.buffer = nb; s.playbackRate.value = .25; const g = G(); perc(g, t, v * .7, .001, .12); s.connect(g); s.start(t, hsh(t) * 1.5, .2); out(g, drums); out(tn(t, 220, .05, v * .15, 'square', 140), drums); return; }
      if (k === 'lofi') { out(nz(t, .14, 'lowpass', 3200, .7, v * .32), drums, 0, .25); out(tn(t, 330, .04, v * .18, 'triangle'), drums); return; }
      if (k === 'ind') { out(nz(t, .2, 'bandpass', 1300, .9, v * .5), drums, 0, .3); out(tn(t, 180, .12, v * .3, 'sawtooth', 90), drums); out(nz(t, .05, 'highpass', 6000, .7, v * .2), drums); return; }
      const gated = k === 'gated';
      out(nz(t, gated ? .26 : .17, 'bandpass', 1900, .8, v * .45), drums, 0, gated ? .6 : .2);
      out(tn(t, 195, .09, v * .3, 'triangle', 165), drums);
      out(nz(t, .06, 'highpass', 5500, .7, v * .18), drums);
    },
    clap(e, t) { const v = e.v; [0, .011, .022].forEach(d => out(nz(t + d, .012, 'bandpass', 1300, 1.2, v * .3), drums)); out(nz(t + .03, .16, 'bandpass', 1200, 1, v * .3), drums, 0, .3); },
    hat(e, t) {
      const k = e.x || 'closed', v = e.v;
      if (k === 'chip') { const s = A.createBufferSource(); s.buffer = nb; const f = Fl('highpass', 6000); const g = G(); perc(g, t, v * .3, .001, .035); s.connect(f); f.connect(g); s.start(t, hsh(t) * 1.5, .06); out(g, drums, .2); return; }
      out(nz(t, k === 'open' ? .28 : .045, 'highpass', 7200, .6, v * (k === 'open' ? .13 : .16)), drums, hsh(t * 3) * .4 - .2);
    },
    ride(e, t) { const v = e.v; out(nz(t, .7, 'bandpass', 6500, 1.4, v * .38), drums, .25, .1); [3150, 4720].forEach(f => out(tn(t, f, .5, v * .015, 'square'), drums, .25)); },
    crash(e, t) { const v = e.v; out(nz(t, 2.2, 'highpass', 3800, .5, v * .22, 0, .003), drums, 0, .3); out(nz(t, 1.2, 'bandpass', 5000, .8, v * .1), drums, -.3, .2); },
    tom(e, t) { out(tn(t, e.m, .32, e.v * .5, 'sine', e.m * .6), drums, (e.m - 170) / 200, .15); },
    wood(e, t) { out(tn(t, e.m, .06, e.v * .3, 'sine'), drums, e.m > 1000 ? .35 : -.35, .1); out(nz(t, .015, 'bandpass', e.m * 2, 2, e.v * .12), drums); },
    shaker(e, t) { out(nz(t, .05, 'highpass', 6500, .7, e.v * .09, 0, .01), drums, .3); },
    tick(e, t) { out(tn(t, 5200, .018, e.v * .09, 'square'), drums, .35); out(nz(t, .012, 'highpass', 8000, .7, e.v * .08), drums, -.35); },
    pad(e, t) {
      const k = e.x || 'warm', notes = e.m, end = t + e.d, v = e.v;
      notes.forEach((m, j) => {
        const pan = (j - (notes.length - 1) / 2) * .35, f = mtof(m);
        const g = G();
        if (k === 'warm') {
          [-7, 7].forEach(dt => { const o = O('sawtooth', f, t); o.detune.value = dt; const fl = Fl('lowpass', 1300, .5); o.connect(fl); fl.connect(g); o.stop(end + 1.3); });
          const o2 = O('triangle', f / 2, t); const g2 = G(); g2.gain.value = .35; o2.connect(g2); g2.connect(g); o2.stop(end + 1.3);
          adsr(g, t, .036 * v, .7, .5, .85, end, 1.2); out(g, synth, pan, .45);
        } else if (k === 'string') {
          [-11, 0, 11].forEach(dt => { const o = O('sawtooth', f, t); o.detune.value = dt; const fl = Fl('lowpass', 2400, .5); o.connect(fl); fl.connect(g); o.stop(end + 1); });
          adsr(g, t, .026 * v, .35, .4, .8, end, .8); out(g, synth, pan, .45);
        } else if (k === 'glass') {
          const o = O('sine', f, t), o2 = O('triangle', f * 2, t), g2 = G(); g2.gain.value = .35; o.connect(g); o2.connect(g2); g2.connect(g); o.stop(end + 1); o2.stop(end + 1);
          adsr(g, t, .03 * v, .25, .6, .7, end, .8); out(g, synth, pan, .5);
        } else if (k === 'organ') {
          [[1, 1], [2, .45], [3, .2]].forEach(([h, a]) => { const o = O('sine', f * h, t), g2 = G(); g2.gain.value = a; o.connect(g2); g2.connect(g); o.stop(end + .5); });
          adsr(g, t, .05 * v, .05, .3, .8, end, .3); out(g, synth, pan, .3);
        } else if (k === 'choir') {
          const mix = G(); [-9, 9].forEach(dt => { const o = O('sawtooth', f, t); o.detune.value = dt; vib(o, t, 4.8 + j * .3, 9, .3).stop(end + 1.2); o.connect(mix); o.stop(end + 1.2); });
          [[720, 6], [1180, 7], [2500, 8]].forEach(([ff, q], i) => { const bp = Fl('bandpass', ff, q), g3 = G(); g3.gain.value = [1, .6, .25][i]; mix.connect(bp); bp.connect(g3); g3.connect(g); });
          adsr(g, t, .09 * v, .55, .4, .85, end, 1); out(g, synth, pan, .6);
        } else if (k === 'dark') {
          [-15, 15].forEach(dt => { const o = O('sawtooth', f, t); o.detune.value = dt; const fl = Fl('lowpass', 500, 2); const l = O('sine', .5, t), lg = G(); lg.gain.value = 450; l.connect(lg); lg.connect(fl.frequency); o.connect(fl); fl.connect(g); o.stop(end + 1); l.stop(end + 1); });
          adsr(g, t, .034 * v, .4, .4, .85, end, .8); out(g, synth, pan, .4);
        }
      });
    },
    drone(e, t) { const end = t + e.d, f = mtof(e.m), g = G(); [-6, 6].forEach(dt => { const o = O('sawtooth', f, t); o.detune.value = dt; const fl = Fl('lowpass', 260, 1); o.connect(fl); fl.connect(g); o.stop(end + 2); }); adsr(g, t, .08 * e.v, 2, 1, .9, end, 2); out(g, synth, 0, .2); },
    bass(e, t) {
      const k = e.x || 'sub', f = mtof(e.m), end = t + e.d, v = e.v, g = G();
      if (k === 'sub') { const o = O('sine', f, t); o.connect(g); o.stop(end + .3); adsr(g, t, .32 * v, .02, .1, .9, end, .15); out(g, synth); return; }
      if (k === 'saw' || k === 'seq') {
        const o = O(k === 'seq' ? 'square' : 'sawtooth', f, t), fl = Fl('lowpass', 1600, k === 'seq' ? 4 : 2); fl.frequency.exponentialRampToValueAtTime(k === 'seq' ? 380 : 320, t + .16);
        const s = O('sine', f, t), sg = G(); sg.gain.value = .9; s.connect(sg); sg.connect(g); o.connect(fl); fl.connect(g); o.stop(end + .2); s.stop(end + .2);
        adsr(g, t, (k === 'seq' ? .13 : .16) * v, .004, .12, .7, Math.max(t + .05, end - .03), .06); out(g, synth); return;
      }
      if (k === 'pluck') { const o = O('sawtooth', f, t), fl = Fl('lowpass', 2600, 3); fl.frequency.exponentialRampToValueAtTime(380, t + .14); o.connect(fl); fl.connect(g); o.stop(end + .2); const s = O('sine', f, t); s.connect(g); s.stop(end + .2); adsr(g, t, .17 * v, .003, .1, .5, end, .05); out(g, synth); return; }
      if (k === 'upright') { const o = O('triangle', f * 1.012, t); o.frequency.exponentialRampToValueAtTime(f, t + .05); const s = O('sine', f, t); const fl = Fl('lowpass', 900); o.connect(fl); s.connect(fl); fl.connect(g); o.stop(end + .3); s.stop(end + .3); perc(g, t, .24 * v, .006, Math.min(.9, e.d + .1)); out(g, synth, 0, .08); out(nz(t, .02, 'bandpass', 1200, 1.5, v * .05), synth); return; }
      if (k === 'chip') { const o = O('triangle', f, t); o.connect(g); o.stop(end + .1); adsr(g, t, .32 * v, .002, .05, .9, end, .02); out(g, synth); return; }
      if (k === '808') { const o = O('sine', f * 2, t); o.frequency.exponentialRampToValueAtTime(f, t + .08); const ws = A.createWaveShaper(); ws.curve = clipCurve(); const pre = G(); pre.gain.value = 3; o.connect(pre); pre.connect(ws); ws.connect(g); o.stop(end + .3); adsr(g, t, .2 * v, .003, .3, .7, end, .2); const fl = Fl('lowpass', 900); g.connect(fl); out(fl, synth); }
    },
    lead(e, t, k) {
      const f = mtof(e.m), end = t + e.d, v = e.v, g = G();
      if (k === 'saw') {
        [-12, 12].forEach(dt => { const o = O('sawtooth', f, t); o.detune.value = dt; vib(o, t, 5.5, 14, .25).stop(end + .4); const fl = Fl('lowpass', 3600, .8); o.connect(fl); fl.connect(g); o.stop(end + .4); });
        const sq = O('square', f / 2, t), sg = G(); sg.gain.value = .25; sq.connect(sg); sg.connect(g); sq.stop(end + .4);
        adsr(g, t, .09 * v, .015, .2, .8, Math.max(t + .05, end - .02), .25); out(g, synth, 0, .3, .28); return;
      }
      if (k === 'flute') {
        const o = O('sine', f, t), o2 = O('triangle', f, t), g2 = G(); g2.gain.value = .3; vib(o, t, 5, 12, .3).stop(end + .5); o.connect(g); o2.connect(g2); g2.connect(g); o.stop(end + .5); o2.stop(end + .5);
        out(nz(t, Math.min(e.d, .5), 'bandpass', f * 2, 3, v * .02, 0, .06), synth, 0, .4);
        adsr(g, t, .085 * v, .07, .2, .85, end, .3); out(g, synth, -.1, .55, .3); return;
      }
      if (k === 'chip') { const o = O('pulse25', f, t); vib(o, t, 6, 18, .18).stop(end + .1); o.connect(g); o.stop(end + .1); adsr(g, t, .5 * v, .003, .08, .8, Math.max(t + .03, end - .02), .03); out(g, synth, .1, .05); return; }
      if (k === 'trumpet') {
        const o = O('sawtooth', f, t); o.detune.setValueAtTime(-40, t); o.detune.linearRampToValueAtTime(0, t + .07); vib(o, t, 5, 16, .25).stop(end + .3);
        const bp = Fl('bandpass', 1500, 1.6), lp = Fl('lowpass', 2800, .7); o.connect(bp); bp.connect(lp); lp.connect(g); o.stop(end + .3);
        adsr(g, t, .32 * v, .05, .2, .75, Math.max(t + .06, end - .04), .14); out(g, synth, .15, .5); return;
      }
      if (k === 'bell') { [[1, 1, 1.6], [2.76, .35, .5], [5.4, .18, .25]].forEach(([h, a, d]) => out(tn(t, f * h, d * Math.max(1, e.d), .12 * v * a), synth, .2, .5, .25)); return; }
      if (k === 'whistle') { const o = O('sine', f * 2, t); vib(o, t, 6, 20, .15).stop(end + .3); o.connect(g); o.stop(end + .3); adsr(g, t, .09 * v, .04, .1, .8, end, .12); out(g, synth, .2, .45); out(nz(t, Math.min(e.d, .3), 'bandpass', f * 2, 6, v * .012, 0, .03), synth); return; }
      if (k === 'square') { const o = O('pulse40', f, t), fl = Fl('lowpass', 3000, 1); fl.frequency.exponentialRampToValueAtTime(900, t + .3); o.connect(fl); fl.connect(g); o.stop(end + .2); adsr(g, t, .2 * v, .004, .15, .55, end, .1); out(g, synth, .15, .25, .3); return; }
      if (k === 'box') { [[1, 1, 1.4], [3, .25, .45], [4.2, .12, .25]].forEach(([h, a, d]) => out(tn(t, f * h, d, .11 * v * a, 'sine'), synth, .1, .6, .2)); }
    },
    pluck(e, t, k) {
      const f = mtof(e.m), v = e.v;
      if (k === 'tri') { out(tn(t, f, .45, .12 * v, 'triangle'), synth, hsh(t) * .8 - .4, .45, .35); return; }
      if (k === 'arp') { const o = O('sawtooth', f, t), fl = Fl('lowpass', 3600, 2), g = G(); fl.frequency.exponentialRampToValueAtTime(1100, t + .12); o.connect(fl); fl.connect(g); o.stop(t + .3); adsr(g, t, .2 * v, .002, .08, .45, t + .1, .12); out(g, synth, hsh(t * 7) * .6 - .3, .2, .35); return; }
      if (k === 'kalimba') { out(tn(t, f, .7, .1 * v), synth, hsh(t) * .6 - .3, .35, .15); out(tn(t, f * 5.95, .06, .03 * v), synth, 0, .2); out(tn(t, f * 2, .2, .025 * v), synth); return; }
      if (k === 'chiparp') { const o = O('pulse50', f, t), g = G(); o.connect(g); o.stop(t + .16); adsr(g, t, .22 * v, .002, .04, .6, t + .09, .03); out(g, synth, -.15); return; }
      if (k === 'marimba') { out(tn(t, f, .35, .1 * v), synth, 0, .3); out(tn(t, f * 4, .05, .03 * v), synth); }
    },
    stab(e, t) { for (const m of e.m) { const o = O('sawtooth', mtof(m + 12), t), fl = Fl('lowpass', 2600, 1.5), g = G(); fl.frequency.exponentialRampToValueAtTime(800, t + .12); o.connect(fl); fl.connect(g); o.stop(t + .25); adsr(g, t, .09 * e.v, .003, .06, .5, t + .08, .1); out(g, synth, (m % 3 - 1) * .3, .25); } },
    rhodes(e, t) {
      for (const m of e.m) {
        const f = mtof(m), c = O('sine', f, t), md = O('sine', f, t), mg = G(); mg.gain.setValueAtTime(f * 2.2, t); mg.gain.exponentialRampToValueAtTime(f * .25, t + .6); md.connect(mg); mg.connect(c.frequency);
        const g = G(); perc(g, t, .055 * e.v, .004, e.d + .4); c.connect(g); c.stop(t + e.d + .5); md.stop(t + e.d + .5); out(g, synth, (m % 4 - 1.5) * .2, .35);
      }
    },
    riser(e, t) { const end = t + e.d; out(nz(t, e.d, 'bandpass', 250, 2.5, e.v * .12, 7000, e.d * .9), synth, 0, .3); const o = O('sawtooth', 110, t); o.frequency.exponentialRampToValueAtTime(880, end); const g = G(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.025 * e.v, end); g.gain.linearRampToValueAtTime(.0001, end + .05); const fl = Fl('lowpass', 2000); o.connect(fl); fl.connect(g); o.stop(end + .1); out(g, synth, 0, .3); },
    rev(e, t) { const end = t + e.d, s = A.createBufferSource(); s.buffer = nb; const fl = Fl('highpass', 3000), g = G(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.2 * e.v, end - .02); g.gain.linearRampToValueAtTime(.0001, end); s.connect(fl); fl.connect(g); s.start(t, hsh(t) * .2, e.d + .05); out(g, drums, 0, .4); },
    impact(e, t) { out(tn(t, 70, 1.6, .9 * e.v, 'sine', 28), drums, 0, .3); out(nz(t, 1.4, 'lowpass', 1200, .7, .45 * e.v, 120), drums, 0, .6); out(nz(t, .08, 'highpass', 2000, .7, .3 * e.v), drums); },
    siren(e, t) { const end = t + e.d, o = O('sawtooth', 600, t), l = O('sine', 1.2, t), lg = G(); lg.gain.value = 180; l.connect(lg); lg.connect(o.frequency); const bp = Fl('bandpass', 1200, 2), g = G(); o.connect(bp); bp.connect(g); adsr(g, t, .05 * e.v, .2, .2, .9, end, .3); o.stop(end + .4); l.stop(end + .4); out(g, synth, 0, .4, .2); },
    // 雨：循环噪声做雨幕，稀疏的高频点做雨滴（现实戏的环境声）
    rain(e, t) {
      const end = t + e.d, sv = A.createBufferSource(); sv.buffer = nb; sv.loop = true;
      const lp = Fl('lowpass', 2800, .4), hp = Fl('highpass', 380, .5), g = G();
      adsr(g, t, .06 * e.v, 1.2, .4, 1, end, 1.5); sv.connect(lp); lp.connect(hp); hp.connect(g); sv.start(t, hsh(t) * 1.5); sv.stop(end + 1.6); out(g, drums, 0, .25);
      for (let x = t + .05; x < end; x += .09 + hsh(x * 7.7) * .22) out(nz(x, .012, 'highpass', 3500 + hsh(x) * 3000, .7, (.012 + hsh(x * 2) * .03) * e.v), drums, hsh(x * 3.3) * 1.6 - .8, .3);
    },
    // 钢琴：现实戏里的独奏
    piano(e, t) {
      for (const m of [].concat(e.m)) {
        const f = mtof(m), d = Math.max(.6, e.d) + .8;
        [[1, 1], [2, .32], [3, .12], [4.02, .05]].forEach(([h, a]) => out(tn(t, f * h, d / h ** .3, .07 * e.v * a, 'sine'), synth, (m - 64) / 40, .55, .1));
        out(nz(t, .02, 'bandpass', f * 4, 2, .02 * e.v), synth, 0, .3);
      }
    },
    crackle(e, t) { const end = t + e.d; out(nz(t, e.d, 'bandpass', 4000, .5, .012 * e.v, 0, .5), drums); for (let x = t; x < end; x += .07 + hsh(x * 9.3) * .35) out(nz(x, .004, 'highpass', 2500, .7, (.05 + hsh(x) * .12) * e.v), drums, hsh(x * 3) - .5); },
  };
  // ---------- 音效（世界给出） ----------
  const X = {
    key: (t, v = 1) => { out(nz(t, .03, 'bandpass', 2600 + hsh(t) * 1600, 1.4, .16 * v), sfxB, hsh(t * 5) * .4 - .2); out(tn(t, 170 + hsh(t) * 50, .025, .04 * v, 'triangle'), sfxB); },
    type: t => { out(nz(t, .04, 'bandpass', 1800, 1.2, .3), sfxB, 0, .1); out(tn(t, 120, .03, .08, 'square'), sfxB); },
    ding: t => out(tn(t, 2093, .8, .06), sfxB, .3, .4),
    blip: (t, f = 1200) => out(tn(t, f, .06, .05, 'square'), sfxB),
    pop: t => out(tn(t, 380, .09, .12, 'sine', 900), sfxB, 0, .2),
    bubble: t => out(tn(t, 500 + hsh(t) * 500, .12, .08, 'sine', 1500 + hsh(t) * 800), sfxB, hsh(t * 2) - .5, .3),
    chime: (t, f = 1568) => { out(tn(t, f, 1, .05), sfxB, -.2, .5); out(tn(t + .06, f * 1.5, 1.2, .04), sfxB, .2, .5); },
    sparkle: t => { for (let i = 0; i < 6; i++) out(tn(t + i * .06, 1800 + hsh(t + i) * 2200, .25, .02), sfxB, hsh(i + t) - .5, .5); },
    whoosh: t => out(nz(t, .5, 'bandpass', 300, .9, .2, 3600, .25), sfxB, 0, .2),
    swish: t => out(nz(t, .25, 'bandpass', 1500, .7, .16, 5000, .08), sfxB, .3),
    stamp: t => { out(tn(t, 140, .35, .4, 'sine', 45), sfxB, 0, .2); out(nz(t, .1, 'lowpass', 1400, .8, .3), sfxB, 0, .2); },
    thud: t => { out(tn(t, 110, .25, .3, 'sine', 50), sfxB); out(nz(t, .06, 'lowpass', 900, .7, .15), sfxB); },
    snip: t => { out(nz(t, .035, 'bandpass', 5200, 2, .22), sfxB, .2); out(tn(t, 2400, .03, .04, 'square'), sfxB); out(nz(t + .06, .03, 'bandpass', 6400, 2, .18), sfxB, -.2); },
    stick: t => { out(nz(t, .06, 'bandpass', 900, 1, .25), sfxB); out(tn(t, 230, .07, .08, 'triangle', 150), sfxB); },
    paper: t => out(nz(t, .3, 'bandpass', 2400, .6, .12, 900, .05), sfxB, hsh(t) - .5, .15),
    scratch: t => { const s = A.createBufferSource(); s.buffer = nb; s.playbackRate.setValueAtTime(.3, t); s.playbackRate.linearRampToValueAtTime(2.2, t + .12); s.playbackRate.linearRampToValueAtTime(.2, t + .3); const fl = Fl('bandpass', 1400, 1.5), g = G(); perc(g, t, .3, .01, .32); s.connect(fl); fl.connect(g); s.start(t, .3, .4); out(g, sfxB); },
    bonk: t => out(tn(t, 330, .22, .14, 'square', 140), sfxB, 0, .15),
    coin: t => { out(tn(t, 988, .07, .06, 'square'), sfxB); out(tn(t + .07, 1319, .3, .06, 'square'), sfxB); },
    save: t => { [660, 990, 1320].forEach((f, i) => out(tn(t + i * .08, f, i === 2 ? .2 : .08, .05, 'square'), sfxB)); },
    jump: t => out(tn(t, 300, .16, .05, 'square', 820), sfxB),
    hurt: t => { out(tn(t, 520, .25, .07, 'square', 110), sfxB); out(nz(t, .15, 'lowpass', 2000, .7, .1), sfxB); },
    rewind: t => { out(tn(t, 1600, .6, .04, 'sawtooth', 200), sfxB, 0, .2); out(nz(t, .6, 'bandpass', 3000, 1, .1, 600), sfxB); },
    powerup: t => { for (let i = 0; i < 6; i++) out(tn(t + i * .05, 523 * Math.pow(1.19, i), .06, .05, 'square'), sfxB); },
    gameover: t => { [[0, 74], [.3, 70], [.6, 67], [.9, 62]].forEach(([d, m]) => out(tn(t + d, mtof(m), .28, .07, 'square'), sfxB)); out(tn(t + 1.2, mtof(50), .8, .08, 'triangle'), sfxB); },
    menu: t => out(tn(t, 880, .05, .05, 'square'), sfxB),
    whistle: t => { out(tn(t, 1400, .22, .035, 'sine', 1900), sfxB, .3, .3); out(tn(t + .28, 1900, .32, .035, 'sine', 1250), sfxB, .3, .3); },
    camera: t => { out(nz(t, .05, 'highpass', 3000, .7, .25), sfxB); out(tn(t + .02, 2400, .3, .03, 'sine', 1800), sfxB, 0, .3); },
    stinger: t => { [0, .45, .9].forEach((d, i) => [38, 45, 50].forEach(m => { const o = O('sawtooth', mtof(m - (i === 2 ? 1 : 0)), t + d), fl = Fl('lowpass', 900, 1), g = G(); o.connect(fl); fl.connect(g); perc(g, t + d, i === 2 ? .09 : .06, .01, i === 2 ? 1.4 : .35); o.stop(t + d + 1.6); out(g, sfxB, 0, .4); })); },
    lock: t => { out(nz(t, .03, 'bandpass', 3200, 2, .22), sfxB); out(tn(t + .05, 520, .07, .06, 'square'), sfxB); out(tn(t + .1, 780, .1, .05, 'square'), sfxB); },
    click: t => { out(nz(t, .015, 'bandpass', 4000, 2, .25), sfxB); out(tn(t, 1800, .02, .05, 'square'), sfxB); },
    shatter: t => { out(nz(t, .9, 'bandpass', 2600, .5, .45, 300), sfxB, 0, .4); for (let i = 0; i < 9; i++) out(tn(t + i * .045, 2600 - i * 240, .1, .035, 'square'), sfxB, hsh(i) - .5, .3); },
    alarm: t => { [0, .25, .5, .75].forEach(d => out(tn(t + d, d * 4 % 2 ? 880 : 660, .2, .05, 'square'), sfxB, 0, .2)); },
    glitch: t => { for (let i = 0; i < 6; i++) out(nz(t + i * .03, .025, 'bandpass', 400 + hsh(t + i) * 5000, 3, .16), sfxB, hsh(i * t) - .5); out(tn(t, 90, .12, .06, 'sawtooth'), sfxB); },
    zap: t => out(tn(t, 1800, .25, .06, 'sawtooth', 120), sfxB, 0, .3),
    buzz: t => { out(tn(t, 120, .3, .05, 'sawtooth'), sfxB); out(tn(t, 127, .3, .04, 'square'), sfxB); },
    plot: t => out(nz(t, .5, 'bandpass', 2200, 4, .06, 3400, .05), sfxB, .2),
    freeze: t => { out(nz(t, 1.2, 'highpass', 5000, .7, .12, 0, .3), sfxB, 0, .6); for (let i = 0; i < 5; i++) out(tn(t + i * .09, 2600 + i * 400, .5, .02), sfxB, hsh(i) - .5, .6); },
    tape: t => { out(tn(t, 300, .6, .1, 'sawtooth', 40), sfxB); },
    heart: t => { const o = O('sine', 75, t); o.frequency.exponentialRampToValueAtTime(40, t + .14); const g = G(); perc(g, t, .7, .004, .3); o.connect(g); o.stop(t + .4); out(g, sfxB); },
    rule: t => { [1175, 1760, 2349].forEach((f, i) => out(tn(t + i * .07, f, 1.1, .045), sfxB, (i - 1) * .4, .5)); out(tn(t, 587, .6, .05, 'triangle'), sfxB, 0, .3); },
    q: (t, f = 600) => { out(tn(t, f, .08, .06, 'triangle'), sfxB, 0, .2); out(tn(t + .09, f * 1.33, .14, .06, 'triangle'), sfxB, 0, .2); },
    beep: (t, f = 1000) => out(tn(t, f, .12, .05, 'sine'), sfxB, 0, .15),
    notify: t => { [0, .18].forEach(d => { const o = O('sawtooth', 150, t + d), g = G(), fl = Fl('lowpass', 420, 2); perc(g, t + d, .12, .01, .14); o.connect(fl); fl.connect(g); o.stop(t + d + .2); out(g, sfxB, .25); }); out(tn(t + .02, 1568, .25, .03), sfxB, .25, .3); },
    enter: t => { out(nz(t, .05, 'bandpass', 1400, 1.2, .3), sfxB, 0, .1); out(tn(t, 95, .07, .12, 'sine', 60), sfxB); },
    tock: t => { out(tn(t, 1900, .02, .03, 'sine'), sfxB, -.3, .2); out(nz(t, .01, 'bandpass', 3000, 3, .05), sfxB, -.3); },
    thunder: t => { out(nz(t, 3.5, 'lowpass', 420, .7, .4, 90, .25), sfxB, 0, .5); out(nz(t + .05, .4, 'lowpass', 1600, .6, .18), sfxB, -.3, .4); },
    swoosh3d: t => { out(nz(t, .9, 'bandpass', 200, .8, .22, 2400, .45), sfxB, -.4, .3); out(nz(t + .3, .7, 'bandpass', 2400, .8, .12, 400, .2), sfxB, .4, .3); },
  };
  const spawn = e => {
    const t = R(e.t); curEnd = t + (e.d || 0) + 3.5;
    if (e.sfx) { const f = X[e.i]; if (f) f(t, e.a); return; }
    if (e.i === 'lp' || e.i === 'mute') return;
    if (I[e.i]) I[e.i](e, t);
    else if (['saw', 'flute', 'chip', 'trumpet', 'bell', 'whistle', 'square', 'box'].includes(e.i)) I.lead(e, t, e.i);
    else if (['tri', 'arp', 'kalimba', 'chiparp', 'marimba'].includes(e.i)) I.pluck(e, t, e.i);
  };
  // 离线渲染会处理图里的每个节点（哪怕还没开始发声），所以按 2 秒分桶，到点前才创建声部
  const STEP = 2, buckets = [];
  for (const e of ev) { if (e.t < cs || e.t >= ce) continue; const k = Math.floor(R(e.t) / STEP); (buckets[k] = buckets[k] || []).push(e); }
  (buckets[0] || []).forEach(spawn);
  const nq = Math.ceil(len / STEP);
  for (let k = 1; k < nq; k++) {
    const at = Math.round((k * STEP - .03) * SR / 128) * 128 / SR;
    A.suspend(at).then(() => { sweep(); (buckets[k] || []).forEach(spawn); A.resume(); });
  }
  return A.startRendering();
}

// ---------- 分块任务 ----------
const SONG = new Map(), CHUNKS = new Map();
function compose(P) {
  const sig = P.ws.map(w => w.m.id + '@' + w.start).join('|');
  if (SONG.has(sig)) return SONG.get(sig);
  const ev = [];
  for (const w of P.ws) { const f = ARR[w.m.id] || (w.m.music && ((S, w) => w.m.music(S, MH, w))); if (f) f(mk(w, ev), w); for (const a of w.m.auto || []) ev.push({ t: w.start + a[1] * 4 * MB, i: a[0], m: a[2], d: (a[3] || 0) * 4 * MB }); }
  ev.forEach(e => e.mus = true);
  const r = { ev, sig }; SONG.set(sig, r); return r;
}
function spans(P, T0, dur) {
  const out = [];
  for (const w of P.ws) { const a = Math.max(w.start, T0), b = Math.min(w.end, T0 + dur); if (b - a > .01) out.push([a, b]); }
  return out;
}
window.MV_MUSIC = {
  _dbg: { renderChunk, compose },
  count: (P, T0, dur) => spans(P, T0, dur).length,
  job(P, sfx, T0, dur, opt) {
    const song = compose(P), ev = [];
    if (opt.bgm) ev.push(...song.ev); else ev.push(...song.ev.filter(e => e.i === 'mute'));
    if (opt.sfx) for (const [t, i, a] of sfx) ev.push({ t, i, a, sfx: true });
    ev.sort((a, b) => a.t - b.t);
    const key = song.sig + '|' + JSON.stringify(opt) + '|' + sfx.length;
    const J = { done: [], dead: false, cancel() { J.dead = true; },
      async run(cb) {
        for (const [a, b] of spans(P, T0, dur)) {
          if (J.dead) return;
          const k = key + '|' + a + '-' + b;
          let buf = CHUNKS.get(k);
          if (!buf) { await new Promise(r => setTimeout(r, 0)); if (J.dead) return; try { buf = await renderChunk(ev, a, b, opt); } catch (e) { console.warn('音轨渲染失败：', e); return; } CHUNKS.set(k, buf); }
          J.done.push({ t0: a, buf }); cb();
        }
      } };
    return J;
  },
};
