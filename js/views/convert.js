import { h, toast, fmtBytes, baseName, extOf, saveFiles, zipOutputs, downloadBlob, chipGroup, filePicker, select, slider, resultRow, reduceMotion } from '../ui.js';
import { IMAGE_TARGETS, RAW_EXT, convertImage, prepareCanvas, pdfFromCanvases, decodeImage, encodeUnder, toCanvas } from '../image.js';
import { AUDIO_TARGETS, VIDEO_TARGETS, VIDEO_LABELS, AUDIO_LABELS, PRESETS, convertAV, outExt } from '../av.js';
import { DOC_KINDS, docKindOf, convertDoc, mergePdfs, gzip } from '../docs.js';

const KIND_LABEL = { image: 'Images', audio: 'Audio', video: 'Videos', pdf: 'PDFs', word: 'Word docs', markdown: 'Markdown', html: 'HTML', text: 'Text', data: 'Data & sheets', subs: 'Subtitles', ebook: 'eBooks', archive: 'Archives' };
const IMG_LABELS = { jxl: 'JPEG XL', svg: 'SVG' };

export function kindOf(f) {
  const n = f.name || '';
  if (/\.(heic|heif|psd)$/i.test(n) || RAW_EXT.test(n)) return 'image';
  if (/\.(svg)$/i.test(n)) return 'image';
  const dk = docKindOf(f); if (dk) return dk;
  if (f.type.startsWith('image/') || /\.(jpe?g|png|webp|avif|gif|bmp|tiff?|ico|jfif|jxl|tga)$/i.test(n)) return 'image';
  if (f.type.startsWith('audio/') || /\.(mp3|wav|m4a|aac|flac|ogg|oga|opus|aiff?|wma|ac3|amr|caf|m4r|mp2|wv|alac|mka)$/i.test(n)) return 'audio';
  if (f.type.startsWith('video/') || /\.(mp4|mov|m4v|webm|mkv|avi|3gp|3g2|flv|wmv|mpe?g|ts|mts|m2ts|ogv|vob|f4v|asf)$/i.test(n)) return 'video';
  return 'other';
}
const targetsFor = (k) => k === 'image' ? IMAGE_TARGETS : k === 'audio' ? AUDIO_TARGETS : k === 'video' ? VIDEO_TARGETS : k === 'other' ? ['zip', 'gz'] : DOC_KINDS[k].targets;
const labelFor = (k, t) => (k === 'image' ? IMG_LABELS[t] : k === 'video' ? VIDEO_LABELS[t] : k === 'audio' ? AUDIO_LABELS[t] : DOC_KINDS[k]?.labels?.[t]) || t.toUpperCase();
const DEFAULTS = { image: 'jpg', audio: 'mp3', video: 'mp4', pdf: 'jpg', word: 'pdf', markdown: 'pdf', html: 'md', text: 'pdf', data: 'json', subs: 'srt', ebook: 'txt', archive: 'extract', other: 'zip' };

export function mount(root) {
  const st = { files: [], targets: { ...DEFAULTS }, outputs: [], running: false };
  const summary = h('p', { class: 'muted', 'aria-live': 'polite' });
  const fileList = h('ul', { class: 'flist', role: 'list' });
  const targetsWrap = h('div');
  const note = h('p', { class: 'muted small' });

  // Options
  const o = { quality: 85, maxSide: 0, combine: true, fitImgKB: 0, preset: 'none', res: 0, abr: '192k', fps: 0, speed: 1, start: '', end: '', mute: false, maxMB: 0, frameEvery: 1 };
  const imgOpts = h('div', { class: 'opts' },
    slider({ label: 'Quality', min: 30, max: 100, value: 85, unit: '%', onInput: (v) => (o.quality = v) }),
    select('Max size', [[0, 'Original'], [4096, '4096 px'], [2048, '2048 px'], [1920, '1920 px'], [1080, '1080 px'], [720, '720 px'], [512, '512 px']], 0, (v) => (o.maxSide = +v)),
    select('Fit under', [[0, 'No limit'], [2000, '2 MB'], [1000, '1 MB'], [500, '500 KB'], [200, '200 KB'], [100, '100 KB']], 0, (v) => (o.fitImgKB = +v)));
  const combineBox = h('label', { class: 'check' }, h('input', { type: 'checkbox', checked: true, onchange: (e) => (o.combine = e.target.checked) }), ' Combine into one file');
  const avOpts = h('div', { class: 'opts' },
    select('Social preset', Object.entries(PRESETS).map(([k, v]) => [k, v.label]), 'none', (v) => (o.preset = v)),
    select('Resolution', [[0, 'Original'], [2160, '4K (2160p)'], [1440, '1440p'], [1080, '1080p'], [720, '720p'], [480, '480p'], [360, '360p']], 0, (v) => (o.res = +v)),
    select('Frame rate', [[0, 'Original'], [60, '60 fps'], [30, '30 fps'], [24, '24 fps'], [15, '15 fps']], 0, (v) => (o.fps = +v)),
    select('Speed', [[0.25, '0.25×'], [0.5, '0.5×'], [0.75, '0.75×'], [1, '1×'], [1.25, '1.25×'], [1.5, '1.5×'], [2, '2×'], [4, '4×']], 1, (v) => (o.speed = +v)),
    select('Audio quality', [['320k', '320 kbps'], ['256k', '256 kbps'], ['192k', '192 kbps'], ['128k', '128 kbps'], ['96k', '96 kbps'], ['64k', '64 kbps']], '192k', (v) => (o.abr = v)),
    select('Fit under (send limits)', [[0, 'No limit'], [8, '8 MB (Discord)'], [16, '16 MB (WhatsApp)'], [25, '25 MB (email)'], [50, '50 MB'], [100, '100 MB']], 0, (v) => (o.maxMB = +v)),
    h('label', { class: 'field' }, h('span', {}, 'Trim start (sec)'), h('input', { type: 'number', min: 0, step: 0.1, inputmode: 'decimal', placeholder: '0', oninput: (e) => (o.start = e.target.value) })),
    h('label', { class: 'field' }, h('span', {}, 'Trim end (sec)'), h('input', { type: 'number', min: 0, step: 0.1, inputmode: 'decimal', placeholder: 'end', oninput: (e) => (o.end = e.target.value) })),
    select('Frames every', [[0.5, '0.5 s'], [1, '1 s'], [2, '2 s'], [5, '5 s'], [10, '10 s']], 1, (v) => (o.frameEvery = +v)),
    h('label', { class: 'check' }, h('input', { type: 'checkbox', onchange: (e) => (o.mute = e.target.checked) }), ' Remove audio'));
  const imgSec = h('details', { class: 'adv' }, h('summary', {}, 'Image options'), imgOpts);
  const avSec = h('details', { class: 'adv' }, h('summary', {}, 'Audio & video options'), avOpts);
  const goBtn = h('button', { class: 'primary', onclick: run }, 'Convert');
  const clearBtn = h('button', { class: 'ghost small-btn', onclick: () => setFiles([], true) }, 'Clear');
  const optsCard = h('div', { class: 'card', hidden: true }, targetsWrap, combineBox, imgSec, avSec, note, goBtn);

  const overall = h('span', { class: 'muted', 'aria-live': 'polite' });
  const results = h('ul', { class: 'results', role: 'list' });
  const bulk = h('div', { class: 'row gap', hidden: true },
    h('button', { class: 'primary', onclick: () => saveFiles(st.outputs) }, 'Save / Share all'),
    h('button', { class: 'ghost', onclick: async () => { toast('Zipping…'); const z = await zipOutputs(st.outputs, `converted_${st.outputs.length}_files.zip`); downloadBlob(z.blob, z.name); } }, 'Download .zip'));
  const resultsCard = h('div', { class: 'card', hidden: true }, h('div', { class: 'row between' }, h('h2', {}, 'Results'), overall), results, bulk);

  root.append(
    h('div', { class: 'card' },
      filePicker({ multiple: true, accept: '*/*', title: 'Choose files', hint: '150+ formats: photos, RAW, music, video, PDF, Word, sheets, subtitles, eBooks, zips.', onFiles: (f) => setFiles(f) }),
      h('div', { class: 'row between' }, summary, clearBtn), fileList),
    optsCard, resultsCard,
    h('p', { class: 'muted small center' }, 'Everything runs on your device. Nothing is uploaded.'));
  clearBtn.hidden = true;

  function setFiles(list, replace = false) {
    st.files = replace ? list : [...st.files, ...list];
    const counts = {};
    st.files.forEach((f) => (counts[kindOf(f)] = (counts[kindOf(f)] || 0) + 1));
    summary.textContent = st.files.length ? Object.entries(counts).map(([k, n]) => `${n} ${(KIND_LABEL[k] || 'Other files').toLowerCase()}`).join(', ') + ` · ${fmtBytes(st.files.reduce((a, f) => a + f.size, 0))}` : '';
    clearBtn.hidden = !st.files.length;
    fileList.innerHTML = '';
    st.files.slice(0, 60).forEach((f, i) => fileList.append(h('li', {}, h('span', { class: 'fx' }, extOf(f.name).toUpperCase() || '?'), h('span', { class: 'fn' }, f.name), h('span', { class: 'fs' }, fmtBytes(f.size)),
      h('button', { class: 'iconbtn sm', 'aria-label': `Remove ${f.name}`, onclick: () => { st.files.splice(i, 1); setFiles([], false); }, html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' }))));
    if (st.files.length > 60) fileList.append(h('li', { class: 'muted' }, `+ ${st.files.length - 60} more`));
    renderTargets(Object.keys(counts));
  }

  function renderTargets(kinds) {
    optsCard.hidden = !kinds.length;
    targetsWrap.innerHTML = '';
    for (const k of kinds) {
      targetsWrap.append(h('fieldset', {}, h('legend', {}, kinds.length > 1 ? `${KIND_LABEL[k] || 'Other files'} to` : 'Convert to'),
        chipGroup(`${KIND_LABEL[k] || 'Files'} output format`, targetsFor(k).map((t) => [t, labelFor(k, t)]), st.targets[k], (v) => { st.targets[k] = v; update(kinds); })));
    }
    update(kinds);
  }

  function update(kinds) {
    const has = (k) => kinds.includes(k);
    const nOf = (k) => st.files.filter((f) => kindOf(f) === k).length;
    imgSec.hidden = !(has('image') || (has('pdf') && ['jpg', 'png', 'webp'].includes(st.targets.pdf)));
    avSec.hidden = !(has('audio') || has('video'));
    const canCombine = (has('image') && st.targets.image === 'pdf' && nOf('image') + nOf('pdf') > 1) || (nOf('pdf') > 1 && !has('image')) || (has('other') || nOf('archive') === 0 && false);
    combineBox.hidden = !canCombine;
    combineBox.lastChild.textContent = has('image') ? ' Combine into one PDF (adds any PDFs too)' : ' Merge PDFs into one (skips the format above)';
    const n = [];
    const t = st.targets;
    if (has('image') && t.image === 'svg') n.push('SVG wraps the photo in an SVG; it doesn’t trace vectors.');
    if (has('image') && ['avif', 'jxl'].includes(t.image)) n.push(`${t.image.toUpperCase()} is slow on a phone; give it a few seconds per photo.`);
    if (has('image') && t.image === 'ico') n.push('ICO is sized to 256 px for icons.');
    if (st.files.some((f) => RAW_EXT.test(f.name))) n.push('RAW files use the camera’s full-size embedded preview.');
    if (has('video')) n.push('Video encodes on your device: fastest for clips under a few minutes.');

    if (has('audio') && t.audio === 'm4r') n.push('Ringtones are capped at 40 seconds. Use trim start to pick the part.');
    if (has('other')) n.push('Unknown files can be packed into a ZIP or GZ.');
    note.textContent = n.join(' ');
  }

  async function run() {
    if (!st.files.length || st.running) return;
    st.running = true; goBtn.disabled = true; goBtn.textContent = 'Converting…';
    st.outputs = []; results.innerHTML = ''; resultsCard.hidden = false; bulk.hidden = true;
    resultsCard.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth', block: 'start' });
    let ok = 0, fail = 0;
    const work = [...st.files];
    const total = work.length;
    const tick = () => (overall.textContent = `${ok + fail} of ${total} done${fail ? ` · ${fail} failed` : ''}`);
    const addRow = (name) => { const r = resultRow(name); results.append(r.li); return r; };
    const push = (row, out, note) => { st.outputs.push(out); row.done(out); row.status(note || fmtBytes(out.blob.size)); };
    tick();
    const avOpts = { abr: o.abr, res: o.res, preset: o.preset, fps: o.fps, speed: o.speed, start: +o.start || 0, end: +o.end || 0, mute: o.mute, maxMB: o.maxMB, frameEvery: o.frameEvery };
    const wakeLock = await navigator.wakeLock?.request('screen').catch(() => null);

    try {
      // Combine images (+ PDFs) into one PDF
      const imgs = work.filter((f) => kindOf(f) === 'image'), pdfs = work.filter((f) => kindOf(f) === 'pdf');
      if (!combineBox.hidden && o.combine) {
        const set = st.targets.image === 'pdf' && imgs.length ? [...imgs, ...pdfs] : pdfs;
        const row = addRow(`${set.length} files → one PDF`);
        try {
          let blob;
          if (set.some((f) => kindOf(f) === 'image')) {
            const pages = [];
            for (const f of set.filter((x) => kindOf(x) === 'image')) { row.status(`Page ${pages.length + 1}…`); const { canvas } = await prepareCanvas(f, { maxSide: o.maxSide, flatten: true }); pages.push({ canvas, q: o.quality }); row.progress(pages.length / set.length * 0.8); }
            blob = await pdfFromCanvases(pages); pages.forEach((p) => (p.canvas.width = p.canvas.height = 0));
            if (pdfs.length) blob = await mergePdfs([new File([blob], 'a.pdf'), ...pdfs]);
          } else blob = await mergePdfs(set);
          push(row, { blob, name: `Combined_${new Date().toISOString().slice(0, 10)}.pdf` });
          ok += set.length;
        } catch (e) { row.status(e.message || 'Failed', true); fail += set.length; }
        set.forEach((f) => work.splice(work.indexOf(f), 1));
        tick();
      }

      for (const f of work) {
        const kind = kindOf(f), target = st.targets[kind];
        const row = addRow(f.name); row.status('Working…');
        try {
          if (kind === 'image') {
            let blob, autoScaled;
            if (o.fitImgKB && ['jpg', 'webp', 'avif', 'jxl'].includes(target)) {
              const bmp = await decodeImage(f); const c = toCanvas(bmp, o.maxSide, target === 'jpg'); bmp.close?.();
              blob = await encodeUnder(c, target, o.fitImgKB * 1000); c.width = c.height = 0;
            } else ({ blob, autoScaled } = await convertImage(f, target, { quality: o.quality, maxSide: o.maxSide }));
            push(row, { blob, name: `${baseName(f.name)}.${target}` }, `${fmtBytes(f.size)} → ${fmtBytes(blob.size)}${autoScaled ? ' · resized to fit iPhone memory' : ''}`);
          } else if (kind === 'audio' || kind === 'video') {
            const res = await convertAV(f, target, avOpts, row.progress, (s) => row.status(s));
            const ext = res.ext || outExt(target);
            push(row, { blob: res.blob, name: `${baseName(f.name)}${target === 'frames' ? '_frames' : ''}.${ext}` }, `${fmtBytes(f.size)} → ${fmtBytes(res.blob.size)}${res.count ? ` · ${res.count} frames` : ''}`);
          } else if (kind === 'other') {
            if (target === 'gz') push(row, { blob: await gzip(f), name: f.name + '.gz' });
            else { const z = await zipOutputs([{ blob: f, name: f.name }], baseName(f.name) + '.zip'); push(row, z); }
          } else {
            const outs = await convertDoc(f, kind, target, { quality: o.quality, onProgress: row.progress });
            if (outs.length === 1) push(row, outs[0], `${fmtBytes(f.size)} → ${fmtBytes(outs[0].blob.size)}`);
            else {
              row.status(`${outs.length} files`); row.progress(1);
              outs.forEach((x) => st.outputs.push(x));
              const z = await zipOutputs(outs, `${baseName(f.name)}_${target}.zip`);
              row.done({ blob: z.blob, name: z.name }); row.status(`${outs.length} files (tap to get them as a .zip)`);
            }
          }
          ok++;
        } catch (e) { console.error(e); row.status(e.message || 'Failed', true); fail++; }
        tick();
      }
    } finally {
      wakeLock?.release?.();
      bulk.hidden = !st.outputs.length;
      st.running = false; goBtn.disabled = false; goBtn.textContent = 'Convert';
      if (fail === 0 && ok) toast(`Done: ${ok} file${ok > 1 ? 's' : ''} converted`);
    }
  }
}
