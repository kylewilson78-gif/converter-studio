// Audio -> MIDI: Spotify Basic Pitch (pitched parts) + onset/spectral drum transcriber, tempo detection, quantize, .mid writer.
import { resampleMono } from './ui.js';

let bpModel;
async function getBP() {
  const mod = await import('../vendor/bp.mjs');
  if (!bpModel) bpModel = new mod.BasicPitch(new URL('../vendor/bp-model/model.json', import.meta.url).href);
  return { mod, bp: bpModel };
}

/** mode: 'poly' | 'melody' | 'bass' ; sensitivity 0..1 (higher = more notes) */
export async function transcribePitched(audioBuffer, { mode = 'poly', sensitivity = 0.5, onProgress } = {}) {
  const { mod, bp } = await getBP();
  const mono = await resampleMono(audioBuffer, 22050);
  let frames = [], onsets = [], contours = [];
  const runModel = () => bp.evaluateModel(mono, (f, o, c) => { frames.push(...f); onsets.push(...o); contours.push(...c); }, (p) => onProgress?.(p));
  try { await runModel(); }
  catch (e) {
    // GPU path failed (older GPUs / some browsers): fall back to CPU, slower but always works
    console.warn('Basic Pitch GPU failed, using CPU', e);
    await mod.tf.setBackend('cpu'); await mod.tf.ready();
    bpModel = new mod.BasicPitch(new URL('../vendor/bp-model/model.json', import.meta.url).href);
    frames = []; onsets = []; contours = [];
    await bpModel.evaluateModel(mono, (f, o, c) => { frames.push(...f); onsets.push(...o); contours.push(...c); }, (p) => onProgress?.(p));
  }
  const onsetThresh = 0.65 - sensitivity * 0.4;      // 0.65 .. 0.25
  const frameThresh = 0.45 - sensitivity * 0.25;     // 0.45 .. 0.2
  const minLen = mode === 'melody' ? 9 : 6;          // frames (~11.6ms each)
  const maxF = mode === 'bass' ? 400 : null, minF = mode === 'bass' ? 30 : mode === 'melody' ? 70 : null;
  let ev = mod.outputToNotesPoly(frames, onsets, onsetThresh, frameThresh, minLen, true, maxF, minF, mode !== 'poly');
  ev = mod.noteFramesToTime(mod.addPitchBendsToNoteEvents(contours, ev));
  let notes = ev.map((n) => ({ time: n.startTimeSeconds, dur: n.durationSeconds, midi: n.pitchMidi, vel: Math.max(0.15, Math.min(1, n.amplitude * 1.15)) }));
  if (mode === 'melody' || mode === 'bass') notes = monophonic(notes, mode === 'bass' ? 'low' : 'loud');
  return notes.sort((a, b) => a.time - b.time);
}

// Keep one note at a time (hummed melodies / basslines)
function monophonic(notes, prefer) {
  notes = [...notes].sort((a, b) => a.time - b.time || (prefer === 'low' ? a.midi - b.midi : b.vel - a.vel));
  const out = [];
  for (const n of notes) {
    const last = out[out.length - 1];
    if (last && n.time < last.time + last.dur - 0.03) {
      // overlapping: keep the stronger / lower, trim the other
      const better = prefer === 'low' ? n.midi < last.midi - 0 && n.vel > last.vel * 0.6 : n.vel > last.vel * 1.25;
      if (better) { last.dur = Math.max(0.03, n.time - last.time); if (last.dur < 0.06) out.pop(); out.push({ ...n }); }
      continue;
    }
    // merge tiny gaps on same pitch (vibrato / breathy singing)
    if (last && last.midi === n.midi && n.time - (last.time + last.dur) < 0.08) { last.dur = n.time + n.dur - last.time; continue; }
    out.push({ ...n });
  }
  return out.filter((n) => n.dur >= 0.06);
}

// ---------- DSP helpers ----------
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = -2 * Math.PI / len, wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let j = 0; j < len / 2; j++) {
        const a = i + j, b = a + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
        const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

function bandFlux(x, sr, hop = 256, N = 1024) {
  const win = new Float32Array(N).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / N));
  const bin = (hz) => Math.round(hz * N / sr);
  const bands = [[bin(30), bin(150)], [bin(150), bin(2500)], [bin(2500), bin(6000)], [bin(6000), N / 2]];
  const nFrames = Math.max(0, Math.floor((x.length - N) / hop));
  const flux = bands.map(() => new Float32Array(nFrames)), total = new Float32Array(nFrames);
  let prev = new Float32Array(N / 2);
  const re = new Float32Array(N), im = new Float32Array(N);
  for (let f = 0; f < nFrames; f++) {
    for (let i = 0; i < N; i++) { re[i] = x[f * hop + i] * win[i]; im[i] = 0; }
    fft(re, im);
    const mag = new Float32Array(N / 2);
    for (let k = 0; k < N / 2; k++) mag[k] = Math.log1p(10 * Math.hypot(re[k], im[k]));
    bands.forEach(([a, b], bi) => { let s = 0; for (let k = a; k < b; k++) { const d = mag[k] - prev[k]; if (d > 0) s += d; } flux[bi][f] = s / (b - a); });
    let t = 0; for (let k = 1; k < N / 2; k++) { const d = mag[k] - prev[k]; if (d > 0) t += d; } total[f] = t;
    prev = mag;
  }
  return { flux, total, fps: sr / hop };
}

function peaks(env, fps, sensitivity) {
  const out = [], w = Math.round(fps * 0.1), minGap = Math.round(fps * 0.05);
  const k = 1.9 - sensitivity * 1.1; // threshold multiplier
  let mean = 0; for (const v of env) mean += v; mean /= env.length || 1;
  let last = -1e9;
  for (let i = 0; i < env.length - 1; i++) {
    if ((i > 0 && env[i] < env[i - 1]) || env[i] < env[i + 1]) continue;
    let s = 0, c = 0; for (let j = Math.max(0, i - w); j < Math.min(env.length, i + w); j++) { s += env[j]; c++; }
    const local = s / c;
    if (env[i] > local * 1.25 + mean * k * 0.6 && i - last >= minGap) { out.push(i); last = i; }
  }
  return out;
}

/** Drums & beatbox -> GM drum notes (kick 36, snare 38, closed hat 42, open hat 46) */
export async function transcribeDrums(audioBuffer, { sensitivity = 0.5 } = {}) {
  const sr = 22050, N = 1024, hop = 256, x = await resampleMono(audioBuffer, sr);
  const { flux, fps } = bandFlux(x, sr, hop, N);
  const norm = (a) => { let m = 1e-9; for (const v of a) if (v > m) m = v; return a.map((v) => v / m); };
  // onsets from each band, merged
  const cand = [];
  flux.forEach((band, bi) => { const nb = norm(band); for (const i of peaks(nb, fps, sensitivity)) if (nb[i] > 0.2 - sensitivity * 0.12) cand.push(i); });
  cand.sort((p, q) => p - q);
  const on = []; for (const i of cand) if (!on.length || i - on[on.length - 1] > fps * 0.07) on.push(i); else if (i < on[on.length - 1]) on[on.length - 1] = i;
  // classify each hit by where its energy sits (raw power, 60 ms after onset)
  const W = 1024, win = new Float32Array(W).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / W));
  const re = new Float32Array(W), im = new Float32Array(W), bin = (hz) => Math.round(hz * W / sr);
  const hits = [];
  for (const i of on) {
    const start = Math.max(0, Math.round(i * hop + N / 2 - W / 4));
    for (let k = 0; k < W; k++) { re[k] = (x[start + k] || 0) * win[k]; im[k] = 0; }
    fft(re, im);
    const e = (a, b) => { let s = 0; for (let k = bin(a); k < bin(b); k++) s += re[k] * re[k] + im[k] * im[k]; return s; };
    const sub = e(30, 160), low = e(160, 600), mids = e(600, 4000), high = e(4000, 11000), tot = sub + low + mids + high + 1e-12;
    // open vs closed hat: energy still ringing 120 ms later
    const s2 = start + Math.round(sr * 0.12); let late = 0, early = 0;
    for (let k = 0; k < 512; k++) { early += (x[start + k] || 0) ** 2; late += (x[s2 + k] || 0) ** 2; }
    hits.push({ t: Math.max(0, (start + W / 4) / sr + 0.01), sub: sub / tot, low: low / tot, mids: mids / tot, high: high / tot, amp: Math.sqrt(early / 512), ring: late / (early + 1e-12) });
  }
  const maxAmp = Math.max(1e-9, ...hits.map((h) => h.amp));
  const notes = [];
  for (const h of hits) {
    const vel = Math.max(0.25, Math.min(1, Math.sqrt(h.amp / maxAmp) * 1.1));
    if (h.sub > 0.45) notes.push({ time: h.t, dur: 0.1, midi: 36, vel });
    else if (h.high > 0.55 && h.sub + h.low < 0.15) notes.push({ time: h.t, dur: 0.08, midi: h.ring > 0.25 ? 46 : 42, vel: vel * 0.85 });
    else { notes.push({ time: h.t, dur: 0.12, midi: 38, vel }); if (h.sub > 0.25) notes.push({ time: h.t, dur: 0.1, midi: 36, vel: vel * 0.9 }); }
  }
  return notes;
}

/** Tempo from onset-strength autocorrelation (70–180 BPM) */
export async function detectTempo(audioBuffer) {
  const sr = 11025, x = await resampleMono(audioBuffer, sr);
  const hop = 128, N = 512, frames = Math.floor((x.length - N) / hop);
  if (frames < 50) return 120;
  const env = new Float32Array(frames); let prevE = 0;
  for (let f = 0; f < frames; f++) { let e = 0; for (let i = 0; i < N; i++) { const s = x[f * hop + i]; e += s * s; } e = Math.log1p(e * 100); env[f] = Math.max(0, e - prevE); prevE = e; }
  const fps = sr / hop; let best = 120, bestScore = -1;
  for (let bpm = 70; bpm <= 180; bpm += 0.5) {
    const lag = fps * 60 / bpm; let s = 0;
    for (let i = Math.ceil(lag * 2); i < frames; i++) s += env[i] * (env[Math.round(i - lag)] + 0.5 * env[Math.round(i - 2 * lag)]);
    const prior = Math.exp(-0.5 * Math.pow(Math.log2(bpm / 115) / 0.9, 2));
    s *= prior; if (s > bestScore) { bestScore = s; best = bpm; }
  }
  return Math.round(best);
}

export function quantize(notes, bpm, grid, strength = 1) {
  if (!grid) return notes;
  const step = 60 / bpm * 4 / grid;
  return notes.map((n) => {
    const qs = Math.round(n.time / step) * step, end = n.time + n.dur;
    const qe = Math.max(qs + step, Math.round(end / step) * step);
    const t = n.time + (qs - n.time) * strength;
    return { ...n, time: Math.max(0, t), dur: Math.max(step * 0.5, (qe - qs) * strength + n.dur * (1 - strength)) };
  });
}

const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] };
export function snapToKey(notes, key) {
  if (!key) return notes;
  const [rootName, kind] = key.split(' ');
  const root = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].indexOf(rootName);
  const allowed = new Set(SCALES[kind].map((x) => (x + root) % 12));
  return notes.map((n) => { let m = n.midi; for (let d = 0; d < 6 && !allowed.has(((m % 12) + 12) % 12); d++) m = allowed.has(((n.midi + d + 1) % 12 + 12) % 12) ? n.midi + d + 1 : allowed.has(((n.midi - d - 1) % 12 + 12) % 12) ? n.midi - d - 1 : m; return { ...n, midi: m }; });
}

export function detectKey(notes) {
  // Krumhansl-Schmuckler on duration-weighted pitch classes
  const prof = { major: [6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88], minor: [6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17] };
  const pc = new Array(12).fill(0); notes.forEach((n) => (pc[n.midi % 12] += n.dur * n.vel));
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  let best = null, bs = -Infinity;
  for (const kind of ['major', 'minor']) for (let r = 0; r < 12; r++) {
    const p = prof[kind].map((_, i) => prof[kind][(i - r + 12) % 12]);
    const ma = pc.reduce((a, b) => a + b, 0) / 12, mb = p.reduce((a, b) => a + b, 0) / 12;
    let num = 0, da = 0, db = 0; for (let i = 0; i < 12; i++) { num += (pc[i] - ma) * (p[i] - mb); da += (pc[i] - ma) ** 2; db += (p[i] - mb) ** 2; }
    const c = num / Math.sqrt(da * db || 1); if (c > bs) { bs = c; best = `${names[r]} ${kind}`; }
  }
  return notes.length > 4 ? best : null;
}

/** tracks: [{name, notes, drums?, program?}] -> Uint8Array (.mid, type 1) */
export async function buildMidi(tracks, bpm, title = 'Converter Studio') {
  const { Midi } = await import('../vendor/midi.mjs');
  const midi = new Midi();
  midi.header.setTempo(bpm); midi.header.name = title;
  midi.header.timeSignatures.push({ ticks: 0, timeSignature: [4, 4] });
  let ch = 0;
  for (const t of tracks) {
    if (!t.notes.length) continue;
    const tr = midi.addTrack(); tr.name = t.name;
    if (t.drums) tr.channel = 9; else { tr.channel = ch === 9 ? ++ch : ch; ch++; tr.instrument.number = t.program || 0; }
    for (const n of t.notes) tr.addNote({ midi: Math.max(0, Math.min(127, Math.round(n.midi))), time: n.time, duration: Math.max(0.02, n.dur), velocity: Math.max(0.05, Math.min(1, n.vel)) });
  }
  return midi.toArray();
}

// ---------- Preview synth ----------
let actx;
export function playNotes(tracks, { from = 0, onEnd } = {}) {
  actx ??= new (window.AudioContext || window.webkitAudioContext)();
  actx.resume();
  const t0 = actx.currentTime + 0.08;
  const master = actx.createGain(); master.gain.value = 0.35; master.connect(actx.destination);
  let end = 0;
  const noise = (() => { const b = actx.createBuffer(1, actx.sampleRate * 0.5, actx.sampleRate); const d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; })();
  for (const tr of tracks) for (const n of tr.notes) {
    if (n.time + n.dur < from) continue;
    const at = t0 + Math.max(0, n.time - from); end = Math.max(end, n.time + n.dur - from);
    if (tr.drums) {
      const g = actx.createGain(); g.connect(master);
      if (n.midi === 36) { const o = actx.createOscillator(); o.frequency.setValueAtTime(140, at); o.frequency.exponentialRampToValueAtTime(45, at + 0.12); g.gain.setValueAtTime(n.vel, at); g.gain.exponentialRampToValueAtTime(0.001, at + 0.25); o.connect(g); o.start(at); o.stop(at + 0.3); }
      else { const s = actx.createBufferSource(); s.buffer = noise; const f = actx.createBiquadFilter(); f.type = n.midi === 38 ? 'bandpass' : 'highpass'; f.frequency.value = n.midi === 38 ? 1800 : 7000; s.connect(f); f.connect(g); const d = n.midi === 38 ? 0.18 : n.midi === 46 ? 0.25 : 0.06; g.gain.setValueAtTime(n.vel * (n.midi === 38 ? 1 : 0.5), at); g.gain.exponentialRampToValueAtTime(0.001, at + d); s.start(at); s.stop(at + d + 0.02); }
      continue;
    }
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = tr.wave || 'triangle'; o.frequency.value = 440 * Math.pow(2, (n.midi - 69) / 12);
    const v = 0.25 * n.vel, d = Math.max(0.05, n.dur);
    g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(v, at + 0.01); g.gain.setTargetAtTime(v * 0.6, at + 0.02, 0.15); g.gain.setTargetAtTime(0, at + d, 0.05);
    o.connect(g); g.connect(master); o.start(at); o.stop(at + d + 0.4);
  }
  const timer = setTimeout(() => { onEnd?.(); }, (end + 0.5) * 1000);
  return { stop() { clearTimeout(timer); master.gain.setTargetAtTime(0, actx.currentTime, 0.02); setTimeout(() => master.disconnect(), 200); onEnd?.(); }, startedAt: t0, ctx: actx };
}

export function drawRoll(canvas, tracks, colors, playhead = -1) {
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth * dpr, H = canvas.clientHeight * dpr;
  if (canvas.width !== W) canvas.width = W; if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0d0f13'; ctx.fillRect(0, 0, W, H);
  const all = tracks.flatMap((t) => t.notes);
  if (!all.length) { ctx.fillStyle = '#9aa3b2'; ctx.font = `${14 * dpr}px -apple-system,sans-serif`; ctx.fillText('No notes found. Try raising sensitivity.', 16 * dpr, H / 2); return; }
  const dur = Math.max(...all.map((n) => n.time + n.dur)) + 0.2;
  const lo = Math.min(...all.map((n) => n.midi)) - 2, hi = Math.max(...all.map((n) => n.midi)) + 2;
  const rowH = H / (hi - lo + 1);
  for (let m = lo; m <= hi; m++) if ([1, 3, 6, 8, 10].includes(m % 12)) { ctx.fillStyle = '#12151b'; ctx.fillRect(0, H - (m - lo + 1) * rowH, W, rowH); }
  tracks.forEach((t, i) => {
    ctx.fillStyle = colors[i % colors.length];
    for (const n of t.notes) { ctx.globalAlpha = 0.45 + 0.55 * n.vel; ctx.fillRect(n.time / dur * W, H - (n.midi - lo + 1) * rowH, Math.max(2 * dpr, n.dur / dur * W), Math.max(2 * dpr, rowH - 1)); }
  });
  ctx.globalAlpha = 1;
  if (playhead >= 0) { ctx.fillStyle = '#fff'; ctx.fillRect(playhead / dur * W, 0, 2 * dpr, H); }
  return dur;
}
