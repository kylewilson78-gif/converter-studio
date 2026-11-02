import { h, toast, fmtBytes, fmtTime, baseName, saveFiles, filePicker, select, slider, chipGroup, decodeAudioFile, encodeWav, drawWave, handoff, downloadBlob } from '../ui.js';
import { processAudio, AUDIO_TARGETS, AUDIO_LABELS, outExt } from '../av.js';

const STEM_COLORS = { vocals: '#ff4f8b', drums: '#ff8a00', bass: '#8b6cff', other: '#00e5d1', instrumental: '#3ea6ff' };

export function mount(root, nav) {
  const st = { file: null, buf: null, start: 0, end: 0, playing: null, stems: null };
  const fx = { denoise: 0, hum: false, voice: false, bass: 0, treble: 0, pitch: 0, speed: 1, reverb: 0, silence: false, mono: false, karaoke: false, reverse: false, gain: 0, fadeIn: 0, fadeOut: 0, normalize: 0 };
  let target = 'wav';

  const picker = filePicker({ accept: 'audio/*,video/*,.m4a,.mp3,.wav,.flac,.aiff,.ogg,.opus,.mov,.mp4', title: 'Choose a song, beat or recording', hint: 'Audio or video. Voice memos work too.', onFiles: (f) => load(f[0]) });
  const info = h('p', { class: 'muted' });
  const wave = h('canvas', { class: 'wave', role: 'img', 'aria-label': 'Waveform' });
  const sel = h('div', { class: 'wave-sel', 'aria-hidden': 'true' });
  const waveWrap = h('div', { class: 'wave-wrap' }, wave, sel);
  const startS = slider({ label: 'Start', min: 0, max: 1, step: 0.01, value: 0, unit: 's', onInput: (v) => { st.start = Math.min(v, st.end - 0.1); startS.set(+st.start.toFixed(2)); paintSel(); } });
  const endS = slider({ label: 'End', min: 0, max: 1, step: 0.01, value: 1, unit: 's', onInput: (v) => { st.end = Math.max(v, st.start + 0.1); endS.set(+st.end.toFixed(2)); paintSel(); } });
  const playBtn = h('button', { class: 'ghost', onclick: togglePlay }, '▶︎ Play selection');

  // touch-drag on waveform sets selection
  let dragFrom = null;
  waveWrap.addEventListener('pointerdown', (e) => { if (!st.buf) return; waveWrap.setPointerCapture(e.pointerId); dragFrom = xToT(e); });
  waveWrap.addEventListener('pointermove', (e) => { if (dragFrom == null) return; const t = xToT(e); if (Math.abs(t - dragFrom) > 0.05) { st.start = Math.min(dragFrom, t); st.end = Math.max(dragFrom, t); syncSliders(); } });
  waveWrap.addEventListener('pointerup', () => (dragFrom = null));
  const xToT = (e) => { const r = waveWrap.getBoundingClientRect(); return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * st.buf.duration; };
  function syncSliders() { startS.set(+st.start.toFixed(2)); endS.set(+st.end.toFixed(2)); paintSel(); }
  function paintSel() { if (!st.buf) return; const d = st.buf.duration; sel.style.left = (st.start / d * 100) + '%'; sel.style.width = ((st.end - st.start) / d * 100) + '%'; info.textContent = `${st.file.name} · ${fmtTime(st.buf.duration)} · selection ${fmtTime(st.end - st.start)}`; }

  const tog = (key, label, desc) => h('label', { class: 'tog' }, h('input', { type: 'checkbox', onchange: (e) => (fx[key] = e.target.checked) }), h('span', {}, h('b', {}, label), h('small', {}, desc)));
  const fxCard = h('div', { class: 'card' }, h('h2', {}, 'Clean up & effects'),
    h('div', { class: 'opts' },
      select('Noise cleanup', [[0, 'Off'], [8, 'Light'], [16, 'Medium'], [28, 'Strong'], [40, 'Max']], 0, (v) => (fx.denoise = +v)),
      select('Loudness', [[0, 'Leave as is'], [-14, 'Streaming (−14 LUFS)'], [-9, 'Loud master (−9 LUFS)'], [-16, 'Podcast (−16 LUFS)'], [-23, 'Broadcast (−23 LUFS)']], 0, (v) => (fx.normalize = +v)),
      select('Speed', [[0.5, '0.5×'], [0.75, '0.75×'], [0.9, '0.9×'], [1, '1×'], [1.1, '1.1×'], [1.25, '1.25× (sped up)'], [1.5, '1.5×'], [2, '2×']], 1, (v) => (fx.speed = +v)),
      slider({ label: 'Pitch', min: -12, max: 12, value: 0, unit: ' st', onInput: (v) => (fx.pitch = v) }),
      slider({ label: 'Bass', min: -12, max: 12, value: 0, unit: ' dB', onInput: (v) => (fx.bass = v) }),
      slider({ label: 'Treble', min: -12, max: 12, value: 0, unit: ' dB', onInput: (v) => (fx.treble = v) }),
      slider({ label: 'Reverb', min: 0, max: 2, step: 0.1, value: 0, onInput: (v) => (fx.reverb = v) }),
      slider({ label: 'Volume', min: -20, max: 20, value: 0, unit: ' dB', onInput: (v) => (fx.gain = v) }),
      slider({ label: 'Fade in', min: 0, max: 10, step: 0.5, value: 0, unit: 's', onInput: (v) => (fx.fadeIn = v) }),
      slider({ label: 'Fade out', min: 0, max: 10, step: 0.5, value: 0, unit: 's', onInput: (v) => (fx.fadeOut = v) })),
    h('div', { class: 'togs' },
      tog('voice', 'Vocal clarity', 'EQ, de-ess, gentle compression'),
      tog('hum', 'Remove hum', 'Cuts 60/120 Hz electrical buzz'),
      tog('silence', 'Trim silences', 'Removes long quiet gaps'),
      tog('karaoke', 'Quick vocal remover', 'Phase trick, instant, works on many songs'),
      tog('mono', 'Mono', 'Fold to one channel'),
      tog('reverse', 'Reverse', 'Play backwards')));
  const fmtChips = chipGroup('Export format', AUDIO_TARGETS.map((t) => [t, AUDIO_LABELS[t] || t.toUpperCase()]), target, (v) => (target = v));
  const exportBtn = h('button', { class: 'primary', onclick: doExport }, 'Export');
  const expStatus = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const expBar = h('div', { class: 'bar', hidden: true }, h('i'));
  const exportCard = h('div', { class: 'card' }, h('h2', {}, 'Export'), fmtChips, h('div', { class: 'gap' }), exportBtn, expBar, expStatus);

  // Stems
  const stemStatus = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const stemBar = h('div', { class: 'bar', hidden: true }, h('i'));
  const stemList = h('ul', { class: 'results', role: 'list' });
  const stemBtn = h('button', { class: 'primary alt', onclick: doStems }, 'Split into 4 stems (AI)');
  const stemActions = h('div', { class: 'row gap', hidden: true },
    h('button', { class: 'ghost', onclick: () => saveFiles(st.stems.outs) }, 'Save all stems'),
    h('button', { class: 'ghost', onclick: () => { handoff.set('stems', st.stems); nav('midi'); } }, 'Stems → MIDI'));
  const stemCard = h('div', { class: 'card' }, h('h2', {}, 'Stem splitter'),
    h('p', { class: 'muted small' }, 'Vocals, drums, bass and everything else, using the same Demucs AI pro tools use. Runs on your device: first use downloads a 180 MB model. Fastest on your laptop; on iPhone keep songs under ~4 minutes.'),
    stemBtn, stemBar, stemStatus, stemList, stemActions);

  const editor = h('div', { hidden: true },
    h('div', { class: 'card' }, info, waveWrap, h('div', { class: 'opts' }, startS, endS), playBtn),
    fxCard, exportCard, stemCard);
  root.append(h('div', { class: 'card' }, picker), editor);

  async function load(file) {
    stopPlay();
    st.file = file; info.textContent = 'Reading audio…'; editor.hidden = false;
    try {
      st.buf = await decodeAudioFile(file, 44100);
      st.start = 0; st.end = st.buf.duration;
      [startS, endS].forEach((s) => { s.input.max = st.buf.duration.toFixed(2); });
      syncSliders();
      requestAnimationFrame(() => drawWave(wave, st.buf));
      stemList.innerHTML = ''; stemActions.hidden = true; st.stems = null;
    } catch (e) { info.textContent = 'Could not read this file: ' + e.message; }
  }
  window.addEventListener('resize', () => st.buf && drawWave(wave, st.buf));

  let actx;
  function togglePlay() { if (st.playing) return stopPlay(); if (!st.buf) return;
    actx ??= new (window.AudioContext || window.webkitAudioContext)(); actx.resume();
    const s = actx.createBufferSource(); s.buffer = st.buf; s.connect(actx.destination); s.start(0, st.start, st.end - st.start);
    s.onended = () => { if (st.playing === s) stopPlay(); }; st.playing = s; playBtn.textContent = '■ Stop'; }
  function stopPlay() { try { st.playing?.stop(); } catch {} st.playing = null; playBtn.textContent = '▶︎ Play selection'; }

  async function doExport() {
    if (!st.file) return;
    exportBtn.disabled = true; expBar.hidden = false; expStatus.textContent = 'Processing…';
    try {
      const full = st.start <= 0.01 && st.end >= st.buf.duration - 0.01;
      const blob = await processAudio(st.file, { ...fx, start: full ? 0 : st.start, end: full ? 0 : st.end, total: st.buf.duration }, target,
        { onProgress: (p) => (expBar.firstChild.style.width = p * 100 + '%'), onStatus: (s) => (expStatus.textContent = s) });
      const name = `${baseName(st.file.name)}_edit.${outExt(target)}`;
      expStatus.textContent = `Done · ${fmtBytes(blob.size)}`;
      await saveFiles([{ blob, name }]);
    } catch (e) { expStatus.textContent = e.message; }
    exportBtn.disabled = false; expBar.hidden = true;
  }

  async function doStems() {
    if (!st.buf) return;
    stemBtn.disabled = true; stemBar.hidden = false; stemList.innerHTML = '';
    const wl = await navigator.wakeLock?.request('screen').catch(() => null);
    try {
      const { separate } = await import('../stems.js');
      // Use only the selection to save time/memory
      const sr = st.buf.sampleRate, a = Math.floor(st.start * sr), b = Math.floor(st.end * sr);
      const sub = { numberOfChannels: st.buf.numberOfChannels, getChannelData: (c) => st.buf.getChannelData(c).subarray(a, b) };
      const t0 = performance.now();
      const res = await separate(sub, {
        onDownload: (g, t) => { stemStatus.textContent = `Downloading model ${fmtBytes(g)} of ${fmtBytes(t)}`; stemBar.firstChild.style.width = (g / t * 100) + '%'; },
        onStatus: (s) => (stemStatus.textContent = s),
        onProgress: (p) => { stemBar.firstChild.style.width = (p * 100) + '%'; const el = (performance.now() - t0) / 1000; stemStatus.textContent = `Separating… ${Math.round(p * 100)}%${p > 0.05 ? ` · about ${Math.round(el / p - el)}s left` : ''}`; },
      });
      const outs = [], raw = {};
      for (const k of ['vocals', 'drums', 'bass', 'other']) { raw[k] = res[k]; outs.push({ blob: encodeWav([res[k].left, res[k].right], sr), name: `${baseName(st.file.name)}_${k}.wav`, key: k }); }
      // instrumental = everything but vocals
      const n = res.vocals.left.length, iL = new Float32Array(n), iR = new Float32Array(n);
      for (let i = 0; i < n; i++) { iL[i] = res.drums.left[i] + res.bass.left[i] + res.other.left[i]; iR[i] = res.drums.right[i] + res.bass.right[i] + res.other.right[i]; }
      outs.push({ blob: encodeWav([iL, iR], sr), name: `${baseName(st.file.name)}_instrumental.wav`, key: 'instrumental' });
      st.stems = { outs, raw, sr, name: baseName(st.file.name) };
      for (const o of outs) {
        const url = URL.createObjectURL(o.blob);
        stemList.append(h('li', { class: 'res' }, h('div', { class: 'thumb', style: { background: STEM_COLORS[o.key] }, 'aria-hidden': 'true' }),
          h('div', { class: 'mid' }, h('div', { class: 'name' }, o.key[0].toUpperCase() + o.key.slice(1)), h('audio', { controls: true, src: url, preload: 'none', 'aria-label': o.key })),
          h('span', { class: 'act' }, h('a', { href: url, download: o.name, class: 'dl', 'aria-label': `Download ${o.key}`, html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16"/></svg>' }))));
      }
      stemActions.hidden = false;
      stemStatus.textContent = `Done in ${Math.round((performance.now() - t0) / 1000)}s`;
    } catch (e) {
      console.error(e);
      stemStatus.textContent = (/memory|allocation|Aborted/i.test(e.message) ? 'Ran out of memory. Trim to a shorter section or use your laptop. ' : '') + e.message;
    }
    wl?.release?.(); stemBtn.disabled = false; stemBar.hidden = true;
  }
}
