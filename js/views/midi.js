import { h, toast, fmtTime, baseName, saveFiles, filePicker, select, slider, chipGroup, decodeAudioFile, handoff, downloadBlob } from '../ui.js';
import { transcribePitched, transcribeDrums, detectTempo, quantize, snapToKey, detectKey, buildMidi, playNotes, drawRoll } from '../midi-core.js';

const COLORS = ['#ff4f8b', '#8b6cff', '#00e5d1', '#ff8a00', '#3ea6ff'];
const MODES = [
  ['melody', 'Hum / sing'],
  ['poly', 'Instrument / chords'],
  ['bass', 'Bassline'],
  ['drums', 'Drums / beatbox'],
  ['song', 'Full song (AI stems)'],
];

export function mount(root) {
  const st = { file: null, buf: null, mode: 'melody', sens: 0.5, bpm: 0, grid: 16, qStrength: 1, key: '', raw: null, tracks: [], player: null, stems: null };
  const picker = filePicker({ accept: 'audio/*,video/*,.m4a,.mp3,.wav,.flac,.aiff,.mov,.mp4', title: 'Choose audio to turn into MIDI', hint: 'A voice memo of you humming, a guitar riff, a beatbox, or a whole song.', onFiles: (f) => load(f[0]) });
  const info = h('p', { class: 'muted', 'aria-live': 'polite' });
  const modeHelp = h('p', { class: 'muted small' });
  const HELP = {
    melody: 'One note at a time, tuned for voices and whistling. Hum clearly, one note per syllable ("da da da").',
    poly: 'Keys, guitar, synths: catches chords and several notes at once.',
    bass: 'Low notes only, one at a time.',
    drums: 'Kicks, snares and hats (beatbox works great: "boots and cats") mapped to FL Studio’s drum notes: kick C1 (36), snare D1 (38), hat F#1 (42).',
    song: 'Splits the song with AI into vocals, bass, drums and other, then makes a MIDI track for each. Needs the 180 MB stem model; best on your laptop.',
  };
  const modeChips = chipGroup('What is it?', MODES, st.mode, (v) => { st.mode = v; modeHelp.textContent = HELP[v]; });
  modeHelp.textContent = HELP.melody;
  const sens = slider({ label: 'Sensitivity', min: 0, max: 100, value: 50, unit: '%', onInput: (v) => { st.sens = v / 100; } });
  const goBtn = h('button', { class: 'primary', onclick: run, disabled: true }, 'Make MIDI');
  const status = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const bar = h('div', { class: 'bar', hidden: true }, h('i'));

  // Result / editing
  const roll = h('canvas', { class: 'roll', role: 'img', 'aria-label': 'Piano roll preview of the notes' });
  const legend = h('div', { class: 'legend' });
  const bpmIn = h('input', { type: 'number', min: 40, max: 240, step: 1, inputmode: 'numeric', 'aria-label': 'Tempo BPM', onchange: () => { st.bpm = +bpmIn.value || 120; refine(); } });
  const keySel = select('Snap to key', [['', 'Off'], ...['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].flatMap((n) => [[`${n} major`, `${n} major`], [`${n} minor`, `${n} minor`]])], '', (v) => { st.key = v; refine(); });
  const keyInfo = h('small', { class: 'muted' });
  const playBtn = h('button', { class: 'ghost', onclick: togglePlay }, '▶︎ Preview');
  const resCard = h('div', { class: 'card', hidden: true },
    h('h2', {}, 'Your MIDI'), roll, legend,
    h('div', { class: 'opts' },
      h('label', { class: 'field' }, h('span', {}, 'Tempo (BPM)'), bpmIn),
      select('Quantize', [[0, 'Off (keep feel)'], [8, '1/8'], [16, '1/16'], [32, '1/32'], [12, '1/8 triplet'], [24, '1/16 triplet']], 16, (v) => { st.grid = +v; refine(); }),
      select('Quantize strength', [[1, '100%'], [0.75, '75%'], [0.5, '50%']], 1, (v) => { st.qStrength = +v; refine(); }),
      keySel),
    keyInfo,
    h('div', { class: 'row gap' }, playBtn,
      h('button', { class: 'primary', onclick: exportMidi }, 'Save .mid')),
    h('button', { class: 'ghost', onclick: exportSplit }, 'Save each track as its own .mid'),
    h('p', { class: 'muted small' }, 'FL Studio: drag the .mid onto the Playlist or a Channel’s Piano roll. On Windows it opens straight from Downloads; from iPhone, AirDrop or save to OneDrive/iCloud first.'));

  root.append(h('div', { class: 'card' }, picker, info), h('div', { class: 'card' }, h('h2', {}, 'What is it?'), modeChips, modeHelp, sens, goBtn, bar, status), resCard);

  const fromStems = handoff.take('stems');
  if (fromStems) { st.stems = fromStems; st.mode = 'song'; modeChips.set('song'); modeHelp.textContent = HELP.song; info.textContent = `Using the 4 stems from “${fromStems.name}”.`; goBtn.disabled = false; st.file = { name: fromStems.name }; }

  async function load(file) {
    st.file = file; st.stems = null; info.textContent = 'Reading audio…';
    try { st.buf = await decodeAudioFile(file, 44100); info.textContent = `${file.name} · ${fmtTime(st.buf.duration)}`; goBtn.disabled = false; }
    catch (e) { info.textContent = 'Could not read this file: ' + e.message; }
  }

  const bufFrom = (stem, sr) => { const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext; const c = new Ctx(2, stem.left.length, sr); const b = c.createBuffer(2, stem.left.length, sr); b.copyToChannel(stem.left, 0); b.copyToChannel(stem.right, 1); return b; };

  async function run() {
    goBtn.disabled = true; bar.hidden = false; status.textContent = 'Listening…'; stopPlay();
    const setP = (p) => (bar.firstChild.style.width = Math.round(p * 100) + '%');
    try {
      let raw = [];
      if (st.mode === 'song') {
        let stems = st.stems;
        if (!stems) {
          const { separate } = await import('../stems.js');
          const r = await separate(st.buf, { onDownload: (g, t) => { status.textContent = `Downloading stem model ${Math.round(g / 1e6)} of ${Math.round(t / 1e6)} MB`; setP(g / t); }, onStatus: (s) => (status.textContent = s), onProgress: (p) => { status.textContent = `Splitting stems… ${Math.round(p * 100)}%`; setP(p); } });
          stems = { raw: r, sr: 44100, name: baseName(st.file.name) };
        }
        const steps = [['vocals', 'Vocal melody', 'melody', 0], ['bass', 'Bass', 'bass', 33], ['other', 'Chords & keys', 'poly', 0], ['drums', 'Drums', 'drums', 0]];
        let i = 0;
        for (const [k, name, mode, program] of steps) {
          status.textContent = `Transcribing ${name.toLowerCase()}…`;
          const b = bufFrom(stems.raw[k], stems.sr);
          const notes = mode === 'drums' ? await transcribeDrums(b, { sensitivity: st.sens }) : await transcribePitched(b, { mode, sensitivity: st.sens, onProgress: (p) => setP((i + p) / steps.length) });
          raw.push({ name, notes, drums: mode === 'drums', program });
          i++; setP(i / steps.length);
        }
        if (!st.bpm) { status.textContent = 'Finding tempo…'; st.bpm = await detectTempo(bufFrom(stems.raw.drums, stems.sr)); }
      } else if (st.mode === 'drums') {
        raw = [{ name: 'Drums', notes: await transcribeDrums(st.buf, { sensitivity: st.sens }), drums: true }];
        setP(1);
      } else {
        const name = { melody: 'Melody', poly: 'Instrument', bass: 'Bass' }[st.mode];
        raw = [{ name, notes: await transcribePitched(st.buf, { mode: st.mode, sensitivity: st.sens, onProgress: setP }), program: st.mode === 'bass' ? 33 : 0 }];
      }
      if (!st.bpm) { status.textContent = 'Finding tempo…'; st.bpm = await detectTempo(st.buf); }
      st.raw = raw;
      const pitched = raw.filter((t) => !t.drums).flatMap((t) => t.notes);
      const key = detectKey(pitched);
      keyInfo.textContent = key ? `Sounds like ${key}.` : '';
      bpmIn.value = st.bpm;
      refine();
      resCard.hidden = false;
      const count = raw.reduce((a, t) => a + t.notes.length, 0);
      status.textContent = count ? `Found ${count} notes at about ${st.bpm} BPM.` : 'No clear notes found. Try raising sensitivity or a cleaner recording.';
      resCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) { console.error(e); status.textContent = 'Something went wrong: ' + e.message; }
    goBtn.disabled = false; bar.hidden = true;
  }

  function refine() {
    if (!st.raw) return;
    st.tracks = st.raw.map((t) => ({ ...t, notes: quantize(t.drums ? t.notes : snapToKey(t.notes, st.key), st.bpm, st.grid, st.qStrength) }));
    legend.innerHTML = '';
    st.tracks.forEach((t, i) => legend.append(h('span', {}, h('i', { style: { background: COLORS[i % COLORS.length] } }), `${t.name} (${t.notes.length})`)));
    requestAnimationFrame(() => drawRoll(roll, st.tracks, COLORS));
  }
  window.addEventListener('resize', () => st.tracks.length && drawRoll(roll, st.tracks, COLORS));

  let raf;
  function togglePlay() {
    if (st.player) return stopPlay();
    st.player = playNotes(st.tracks.map((t, i) => ({ ...t, wave: ['triangle', 'sawtooth', 'square', 'sine'][i % 4] })), { onEnd: () => { st.player = null; cancelAnimationFrame(raf); playBtn.textContent = '▶︎ Preview'; drawRoll(roll, st.tracks, COLORS); } });
    playBtn.textContent = '■ Stop';
    const tick = () => { if (!st.player) return; const t = st.player.ctx.currentTime - st.player.startedAt; drawRoll(roll, st.tracks, COLORS, t); raf = requestAnimationFrame(tick); };
    tick();
  }
  function stopPlay() { st.player?.stop(); st.player = null; }

  async function exportMidi() {
    const data = await buildMidi(st.tracks, st.bpm, baseName(st.file.name));
    await saveFiles([{ blob: new Blob([data], { type: 'audio/midi' }), name: `${baseName(st.file.name)}_${st.bpm}bpm.mid` }]);
  }
  async function exportSplit() {
    const outs = [];
    for (const t of st.tracks) if (t.notes.length) outs.push({ blob: new Blob([await buildMidi([t], st.bpm, t.name)], { type: 'audio/midi' }), name: `${baseName(st.file.name)}_${t.name.replace(/\W+/g, '_')}_${st.bpm}bpm.mid` });
    await saveFiles(outs);
  }
}
