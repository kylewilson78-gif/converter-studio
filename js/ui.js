// Shared UI helpers
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

export function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const k of kids.flat()) if (k != null && k !== false) el.append(k instanceof Node ? k : String(k));
  return el;
}

let toastTimer;
export function toast(msg, ms = 3200) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), ms);
}

export const fmtBytes = (n) => n >= 1e9 ? (n / 1e9).toFixed(2) + ' GB' : n >= 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB';
export const fmtTime = (s) => { s = Math.max(0, s); const m = Math.floor(s / 60); return `${m}:${(s % 60).toFixed(1).padStart(4, '0')}`; };
export const baseName = (n) => n.replace(/\.[^.]+$/, '');
export const extOf = (n) => (n.match(/\.([^.]+)$/)?.[1] || '').toLowerCase();

export function downloadBlob(blob, name) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
}

// iPhone: share sheet lets you Save to Photos / Files / AirDrop. Falls back to downloads.
export async function saveFiles(outputs) {
  const files = outputs.map((o) => new File([o.blob], o.name, { type: o.blob.type || 'application/octet-stream' }));
  if (navigator.canShare && files.length && navigator.canShare({ files })) {
    try { await navigator.share({ files }); return true; }
    catch (e) { if (e.name === 'AbortError') return false; }
  }
  for (const o of outputs) { downloadBlob(o.blob, o.name); await new Promise((r) => setTimeout(r, 350)); }
  return true;
}

const scripts = {};
export function loadScript(src) {
  return (scripts[src] ??= new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => { delete scripts[src]; rej(new Error('Could not load ' + src + '. Check your connection.')); };
    document.head.appendChild(s);
  }));
}

export async function zipOutputs(outputs, name = 'converted.zip') {
  await loadScript('vendor/jszip.min.js');
  const zip = new window.JSZip(); const used = new Set();
  for (const o of outputs) {
    let n = o.name, k = 1;
    while (used.has(n)) n = o.name.replace(/(\.[^.]+)?$/, (m) => ` (${k++})${m}`);
    used.add(n); zip.file(n, o.blob);
  }
  return { blob: await zip.generateAsync({ type: 'blob' }), name };
}

// Accessible chip radio group
export function chipGroup(label, options, value, onChange) {
  const wrap = h('div', { class: 'chips', role: 'radiogroup', 'aria-label': label });
  const render = (v) => [...wrap.children].forEach((c) => c.setAttribute('aria-checked', String(c.dataset.v === v)));
  for (const o of options) {
    const [v, text] = Array.isArray(o) ? o : [o, o.toUpperCase()];
    wrap.append(h('button', { type: 'button', class: 'chip', role: 'radio', 'data-v': v, 'aria-checked': String(v === value),
      onclick: () => { render(v); onChange(v); } }, text));
  }
  wrap.set = (v) => { render(v); };
  return wrap;
}

export function filePicker({ accept = '*/*', multiple = false, title = 'Choose files', hint = '', onFiles }) {
  const input = h('input', { type: 'file', accept, ...(multiple ? { multiple: true } : {}) });
  const lab = h('label', { class: 'drop' }, input,
    h('span', { class: 'drop-ic', html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 20h16"/></svg>' }),
    h('span', {}, h('strong', {}, title), h('br'), h('small', {}, hint)));
  input.addEventListener('change', () => { if (input.files.length) onFiles([...input.files]); input.value = ''; });
  ['dragenter', 'dragover'].forEach((ev) => lab.addEventListener(ev, (e) => { e.preventDefault(); lab.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => lab.addEventListener(ev, (e) => { e.preventDefault(); lab.classList.remove('over'); }));
  lab.addEventListener('drop', (e) => e.dataTransfer.files.length && onFiles([...e.dataTransfer.files]));
  return lab;
}

export function slider({ label, min, max, step = 1, value, unit = '', onInput }) {
  const out = h('output', {}, value + unit);
  const inp = h('input', { type: 'range', min, max, step, value, 'aria-label': label });
  inp.addEventListener('input', () => { out.textContent = inp.value + unit; onInput?.(+inp.value); });
  const el = h('label', { class: 'slider' }, h('span', { class: 'sl-top' }, h('span', {}, label), out), inp);
  el.input = inp; el.set = (v) => { inp.value = v; out.textContent = v + unit; };
  return el;
}

export function select(label, options, value, onChange) {
  const s = h('select', { 'aria-label': label, onchange: () => onChange?.(s.value) },
    options.map(([v, t]) => h('option', { value: v, ...(String(v) === String(value) ? { selected: true } : {}) }, t)));
  const el = h('label', { class: 'field' }, h('span', {}, label), s);
  el.sel = s; return el;
}

export function resultRow(name) {
  const thumb = h('div', { class: 'thumb', 'aria-hidden': 'true' });
  const nm = h('div', { class: 'name' }, name);
  const meta = h('div', { class: 'meta' }, 'Waiting…');
  const bar = h('div', { class: 'bar', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': 0, 'aria-label': 'Progress' }, h('i'));
  const act = h('span', { class: 'act' });
  const li = h('li', { class: 'res' }, thumb, h('div', { class: 'mid' }, nm, meta, bar), act);
  return {
    li,
    status(t, err) { meta.textContent = t; meta.classList.toggle('err', !!err); },
    progress(p) { p = Math.max(0, Math.min(1, p || 0)); bar.firstChild.style.width = Math.round(p * 100) + '%'; bar.setAttribute('aria-valuenow', Math.round(p * 100)); },
    done(out) {
      bar.hidden = true;
      const url = URL.createObjectURL(out.blob);
      if (/^image\/(png|jpeg|webp|gif|avif|svg)/.test(out.blob.type)) thumb.style.backgroundImage = `url("${url}")`;
      else thumb.textContent = extOf(out.name).toUpperCase().slice(0, 4);
      nm.textContent = out.name;
      act.append(h('a', { href: url, download: out.name, class: 'dl', 'aria-label': `Download ${out.name}`,
        html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16"/></svg>' }));
    },
  };
}

export const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

// Decode any audio file to an AudioBuffer (falls back to ffmpeg for formats Safari can't decode)
export async function decodeAudioFile(file, sampleRate) {
  const buf = await file.arrayBuffer();
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const ctx = new Ctx(2, 1, sampleRate || 44100);
  try {
    return await ctx.decodeAudioData(buf.slice(0));
  } catch {
    const { ffmpegToWav } = await import('./av.js');
    const wav = await ffmpegToWav(file, sampleRate || 44100);
    return await ctx.decodeAudioData(await wav.arrayBuffer());
  }
}

export function resampleMono(audioBuffer, rate) {
  const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  const len = Math.ceil(audioBuffer.duration * rate);
  const ctx = new Ctx(1, len, rate);
  const src = ctx.createBufferSource(); src.buffer = audioBuffer; src.connect(ctx.destination); src.start();
  return ctx.startRendering().then((b) => b.getChannelData(0));
}

export function encodeWav(channels, sampleRate) {
  const n = channels[0].length, ch = channels.length;
  const buf = new ArrayBuffer(44 + n * ch * 2), v = new DataView(buf);
  const ws = (o, s) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  ws(0, 'RIFF'); v.setUint32(4, 36 + n * ch * 2, true); ws(8, 'WAVE'); ws(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true); v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * ch * 2, true); v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true); ws(36, 'data'); v.setUint32(40, n * ch * 2, true);
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < ch; c++) { const s = Math.max(-1, Math.min(1, channels[c][i])); v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7fff, true); o += 2; }
  return new Blob([buf], { type: 'audio/wav' });
}

export function drawWave(canvas, audioBuffer, color = '#00e5d1') {
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth * dpr, hgt = canvas.clientHeight * dpr;
  canvas.width = w; canvas.height = hgt;
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, w, hgt);
  const d = audioBuffer.getChannelData(0), step = Math.max(1, Math.floor(d.length / w));
  ctx.fillStyle = color;
  for (let x = 0; x < w; x++) {
    let mn = 1, mx = -1;
    for (let i = x * step, e = Math.min(d.length, i + step); i < e; i += Math.max(1, step >> 4)) { const s = d[i]; if (s < mn) mn = s; if (s > mx) mx = s; }
    ctx.fillRect(x, (1 + mn) * hgt / 2, 1, Math.max(1, (mx - mn) * hgt / 2));
  }
}

// Hand-off between tools (e.g. image JSON -> .md generator, stems -> MIDI)
export const handoff = { set(k, v) { window.__handoff = window.__handoff || {}; window.__handoff[k] = v; }, take(k) { const v = window.__handoff?.[k]; if (window.__handoff) delete window.__handoff[k]; return v; } };
