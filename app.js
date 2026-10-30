import { IMAGE_TARGETS, convertImage, prepareCanvas, pdfFromCanvases } from './js/image.js';
import { AUDIO_TARGETS, VIDEO_TARGETS, convertAV } from './js/av.js';

const $ = (s) => document.querySelector(s);
const state = { files: [], targets: { image: 'jpg', audio: 'mp3', video: 'mp4' }, outputs: [] };

// ---------- navigation ----------
const views = { home: $('#view-home'), convert: $('#view-convert') };
const titles = { home: 'Converter Studio', convert: 'Convert' };
function go(name, push = true) {
  Object.entries(views).forEach(([k, v]) => (v.hidden = k !== name));
  $('#title').textContent = titles[name];
  $('#backBtn').hidden = name === 'home';
  if (push) history.pushState({ v: name }, '', name === 'home' ? '#' : '#' + name);
  $('#main').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
window.addEventListener('popstate', (e) => go(e.state?.v || 'home', false));
$('#backBtn').onclick = () => history.length > 1 ? history.back() : go('home');
document.querySelectorAll('.tile').forEach((t) => (t.onclick = () => {
  if (t.dataset.go) go(t.dataset.go);
  else toast(t.dataset.soon);
}));
if (location.hash === '#convert') go('convert', false);

let toastTimer;
function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => (el.hidden = true), 3500);
}

// ---------- file picking ----------
const kindOf = (f) => {
  if (/\.(heic|heif)$/i.test(f.name) || f.type.startsWith('image/')) return 'image';
  if (f.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|flac|ogg|opus|aif|aiff|wma)$/i.test(f.name)) return 'audio';
  if (f.type.startsWith('video/') || /\.(mp4|mov|m4v|webm|mkv|avi|3gp)$/i.test(f.name)) return 'video';
  return null;
};
const LABEL = { image: 'Images', audio: 'Audio', video: 'Videos' };
const TARGETS = { image: IMAGE_TARGETS, audio: AUDIO_TARGETS, video: VIDEO_TARGETS };

function setFiles(list) {
  const all = [...list];
  state.files = all.filter(kindOf);
  const skipped = all.length - state.files.length;
  const counts = {};
  state.files.forEach((f) => (counts[kindOf(f)] = (counts[kindOf(f)] || 0) + 1));
  const parts = Object.entries(counts).map(([k, n]) => `${n} ${LABEL[k].toLowerCase()}`);
  $('#fileSummary').textContent = state.files.length
    ? `${parts.join(', ')} selected` + (skipped ? ` (${skipped} unsupported skipped)` : '')
    : 'No supported files picked.';
  renderTargets(Object.keys(counts));
}
$('#fileInput').onchange = (e) => setFiles(e.target.files);
const drop = $('#drop');
['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
drop.addEventListener('drop', (e) => setFiles(e.dataTransfer.files));

function renderTargets(kinds) {
  $('#optsCard').hidden = !kinds.length;
  const wrap = $('#targets'); wrap.innerHTML = '';
  kinds.forEach((kind) => {
    const fs = document.createElement('fieldset');
    const lg = document.createElement('legend');
    lg.textContent = kinds.length > 1 ? `${LABEL[kind]} to` : 'Convert to';
    const chips = document.createElement('div');
    chips.className = 'chips'; chips.setAttribute('role', 'radiogroup'); chips.setAttribute('aria-label', `${LABEL[kind]} output format`);
    TARGETS[kind].forEach((fmt) => {
      const b = document.createElement('button');
      b.className = 'chip'; b.type = 'button'; b.setAttribute('role', 'radio');
      b.textContent = fmt.toUpperCase(); b.dataset.fmt = fmt;
      b.setAttribute('aria-checked', String(state.targets[kind] === fmt));
      b.onclick = () => {
        state.targets[kind] = fmt;
        chips.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-checked', String(c.dataset.fmt === fmt)));
        updateOpts(kinds);
      };
      chips.appendChild(b);
    });
    fs.append(lg, chips); wrap.appendChild(fs);
  });
  updateOpts(kinds);
}

function updateOpts(kinds) {
  const hasImg = kinds.includes('image'), hasVid = kinds.includes('video'), hasAud = kinds.includes('audio');
  $('#imageOpts').hidden = !hasImg;
  $('#avOpts').hidden = !(hasVid || hasAud);
  $('#resWrap').hidden = !hasVid || !['mp4', 'mov', 'webm', 'gif'].includes(state.targets.video);
  const nImg = state.files.filter((f) => kindOf(f) === 'image').length;
  $('#combineWrap').hidden = !(hasImg && state.targets.image === 'pdf' && nImg > 1);
  const notes = [];
  if (hasImg && state.targets.image === 'svg') notes.push('SVG wraps the photo in an SVG file; it doesn’t trace it into vectors.');
  if (hasImg && state.targets.image === 'avif') notes.push('AVIF is slow to encode on a phone. Give it a moment per photo.');
  if (hasImg && state.targets.image === 'ico') notes.push('ICO is sized to 256 px for app and site icons.');
  if (hasVid) notes.push('Video runs on your device: best for clips under a few minutes. Big 4K jobs move to the server in step 5.');
  $('#formatNote').textContent = notes.join(' ');
}
$('#quality').oninput = (e) => ($('#qOut').textContent = e.target.value);

// ---------- run ----------
const fmtBytes = (n) => n > 1e6 ? (n / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1e3)) + ' KB';
const baseName = (n) => n.replace(/\.[^.]+$/, '');

function addRow(name) {
  const li = document.createElement('li'); li.className = 'res';
  li.innerHTML = `<div class="thumb" aria-hidden="true"></div>
    <div><div class="name"></div><div class="meta">Waiting…</div><div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div></div>
    <span class="act"></span>`;
  li.querySelector('.name').textContent = name;
  $('#results').appendChild(li);
  return {
    li,
    status: (t, err) => { const m = li.querySelector('.meta'); m.textContent = t; m.classList.toggle('err', !!err); },
    progress: (p) => { const b = li.querySelector('.bar'); b.querySelector('i').style.width = Math.round(p * 100) + '%'; b.setAttribute('aria-valuenow', Math.round(p * 100)); },
    done: (out) => {
      const url = URL.createObjectURL(out.blob);
      li.querySelector('.bar').hidden = true;
      const ext = out.name.split('.').pop().toUpperCase();
      const th = li.querySelector('.thumb');
      if (out.blob.type.startsWith('image/') && !/tiff|x-icon|bmp/.test(out.blob.type)) th.style.backgroundImage = `url(${url})`;
      else th.textContent = ext;
      li.querySelector('.name').textContent = out.name;
      const a = document.createElement('a');
      a.href = url; a.download = out.name; a.className = 'dl';
      a.setAttribute('aria-label', `Download ${out.name}`);
      a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v12M7 11l5 5 5-5M4 20h16"/></svg>';
      li.querySelector('.act').appendChild(a);
    },
  };
}

$('#goBtn').onclick = async () => {
  if (!state.files.length) return;
  const btn = $('#goBtn'); btn.disabled = true;
  state.outputs = [];
  $('#results').innerHTML = ''; $('#resultsCard').hidden = false; $('#bulk').hidden = true;
  $('#resultsCard').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  const quality = +$('#quality').value, maxSide = +$('#maxSize').value;
  const avOpts = { abr: $('#abr').value, res: +$('#res').value };
  const imgs = state.files.filter((f) => kindOf(f) === 'image');
  const combine = state.targets.image === 'pdf' && imgs.length > 1 && $('#combinePdf').checked;
  let ok = 0, fail = 0, i = 0;
  const total = state.files.length;
  const tick = () => ($('#overall').textContent = `${ok + fail} of ${total} done${fail ? `, ${fail} failed` : ''}`);
  tick();

  // Combined PDF
  if (combine) {
    const row = addRow(`${imgs.length} images → one PDF`);
    try {
      const pages = [];
      for (const f of imgs) {
        row.status(`Adding page ${pages.length + 1} of ${imgs.length}…`);
        const { canvas } = await prepareCanvas(f, { maxSide, flatten: true });
        pages.push({ canvas, q: quality });
        row.progress(pages.length / imgs.length * 0.9);
      }
      const blob = await pdfFromCanvases(pages);
      pages.forEach((p) => (p.canvas.width = p.canvas.height = 0));
      const out = { blob, name: `Converted_${new Date().toISOString().slice(0, 10)}.pdf` };
      state.outputs.push(out); row.done(out); row.status(fmtBytes(blob.size));
      ok += imgs.length;
    } catch (e) { row.status(e.message || 'Failed', true); fail += imgs.length; }
    tick();
  }

  for (const f of state.files) {
    const kind = kindOf(f);
    if (combine && kind === 'image') continue;
    i++;
    const target = state.targets[kind];
    const row = addRow(f.name);
    row.status('Working…');
    try {
      let res;
      if (kind === 'image') {
        res = await convertImage(f, target, { quality, maxSide });
        row.progress(1);
      } else {
        res = await convertAV(f, target, { ...avOpts, isVideo: kind === 'video' }, row.progress, (s) => row.status(s));
      }
      const out = { blob: res.blob, name: `${baseName(f.name)}.${target}` };
      state.outputs.push(out); row.done(out);
      row.status(`${fmtBytes(f.size)} → ${fmtBytes(res.blob.size)}${res.autoScaled ? ' · resized to fit iPhone memory' : ''}`);
      ok++;
    } catch (e) {
      console.error(e);
      row.status(e.message || 'Failed', true); fail++;
    }
    tick();
  }
  $('#bulk').hidden = state.outputs.length < 1;
  btn.disabled = false;
};

// ---------- save / share ----------
$('#shareAll').onclick = async () => {
  const files = state.outputs.map((o) => new File([o.blob], o.name, { type: o.blob.type }));
  if (navigator.canShare && navigator.canShare({ files })) {
    try { await navigator.share({ files }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  // Fallback: trigger downloads one by one
  for (const o of state.outputs) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(o.blob); a.download = o.name; a.click();
    await new Promise((r) => setTimeout(r, 300));
  }
};

let zipLoaded;
$('#zipAll').onclick = async () => {
  zipLoaded ??= new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'vendor/jszip.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  await zipLoaded;
  const zip = new window.JSZip(); const used = new Set();
  state.outputs.forEach((o) => {
    let n = o.name, k = 1; while (used.has(n)) n = o.name.replace(/(\.[^.]+)$/, ` (${k++})$1`);
    used.add(n); zip.file(n, o.blob);
  });
  toast('Zipping…');
  const blob = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = `converted_${state.outputs.length}_files.zip`; a.click();
};

// ---------- offline / install ----------
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
