import { h, toast, fmtBytes, baseName, saveFiles, filePicker, select, slider, chipGroup, handoff, downloadBlob } from '../ui.js';
import { decodeImage, encodeCanvas, encodeUnder, MAX_PIXELS } from '../image.js';
import { DEFAULT_ADJ, FILTERS, applyAdjust, autoLevels, analyzeColors } from '../imgfx.js';
import { ask, canvasToB64, activeProvider } from '../ai.js';

const isPhone = () => /iPhone|iPad|Android/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.userAgent));
const bgModel = () => (isPhone() ? 'isnet_quint8' : 'isnet_fp16');
const ASPECTS = [['free', 'Free'], ['orig', 'Original'], ['1:1', '1:1'], ['4:5', '4:5'], ['9:16', '9:16'], ['16:9', '16:9'], ['3:2', '3:2'], ['4:3', '4:3']];

export function mount(root, nav) {
  const st = { file: null, src: null, cut: null, bg: 'transparent', bgColor: '#ffffff', rot: 0, flipH: false, flipV: false, straighten: 0, crop: { x: 0, y: 0, w: 1, h: 1 }, aspect: 'free', adj: { ...DEFAULT_ADJ }, filter: 'none', tab: 'adjust', json: null };
  const hist = []; let future = [];
  const snap = () => JSON.stringify({ rot: st.rot, flipH: st.flipH, flipV: st.flipV, straighten: st.straighten, crop: st.crop, adj: st.adj, filter: st.filter, bg: st.bg, bgColor: st.bgColor });
  const commit = () => { hist.push(snap()); if (hist.length > 60) hist.shift(); future = []; };
  const restore = (s) => { Object.assign(st, JSON.parse(s)); syncControls(); draw(); };

  const picker = filePicker({ accept: 'image/*,.heic,.heif,.dng,.cr2,.nef,.arw,.psd,.tif,.tiff', title: 'Choose a photo', hint: 'HEIC, JPG, PNG, RAW, PSD and more.', onFiles: (f) => load(f[0]) });
  const view = h('canvas', { class: 'img-view', role: 'img', 'aria-label': 'Photo preview' });
  const cropBox = h('div', { class: 'crop-box', hidden: true }, ...['nw', 'ne', 'sw', 'se'].map((c) => h('span', { class: 'hdl ' + c, 'data-h': c })));
  const stage = h('div', { class: 'stage' }, view, cropBox);
  const undoBtn = h('button', { class: 'iconbtn sm', 'aria-label': 'Undo', onclick: () => { if (hist.length) { future.push(snap()); restore(hist.pop()); } }, html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 010 10h-3"/></svg>' });
  const redoBtn = h('button', { class: 'iconbtn sm', 'aria-label': 'Redo', onclick: () => { if (future.length) { hist.push(snap()); restore(future.pop()); } }, html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 14l5-5-5-5"/><path d="M20 9H9a5 5 0 000 10h3"/></svg>' });
  const compareBtn = h('button', { class: 'ghost chipbtn', 'aria-label': 'Hold to see original' }, 'Hold: original');
  ['pointerdown'].forEach((e) => compareBtn.addEventListener(e, () => draw(true)));
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((e) => compareBtn.addEventListener(e, () => draw()));
  const resetBtn = h('button', { class: 'ghost chipbtn', onclick: () => { commit(); Object.assign(st, { rot: 0, flipH: false, flipV: false, straighten: 0, crop: { x: 0, y: 0, w: 1, h: 1 }, adj: { ...DEFAULT_ADJ }, filter: 'none' }); syncControls(); draw(); } }, 'Reset');
  const meta = h('p', { class: 'muted small', 'aria-live': 'polite' });

  // ---- tabs ----
  const tabs = [['adjust', 'Adjust'], ['filters', 'Filters'], ['crop', 'Crop'], ['bg', 'Remove BG'], ['json', 'To JSON'], ['export', 'Export']];
  const tabBar = h('div', { class: 'tabs', role: 'tablist' }, tabs.map(([k, l]) => h('button', { role: 'tab', class: 'tab', 'data-k': k, 'aria-selected': String(k === st.tab), onclick: () => setTab(k) }, l)));
  const panels = {};

  // Adjust
  const adjSliders = {};
  const mk = (key, label, min = -100, max = 100) => (adjSliders[key] = slider({ label, min, max, value: 0, onInput: (v) => { st.adj[key] = v; scheduleDraw(); } }));
  const adjWrap = h('div', { class: 'opts sliders' }, mk('exposure', 'Exposure'), mk('contrast', 'Contrast'), mk('highlights', 'Highlights'), mk('shadows', 'Shadows'), mk('saturation', 'Saturation'), mk('vibrance', 'Vibrance'), mk('warmth', 'Warmth'), mk('tint', 'Tint'), mk('fade', 'Fade', 0, 100), mk('vignette', 'Vignette', 0, 100), mk('sharpen', 'Sharpen', 0, 100), mk('grain', 'Grain', 0, 100));
  adjWrap.addEventListener('change', commit);
  panels.adjust = h('div', {}, h('button', { class: 'primary alt', onclick: autoEnhance }, '✨ Auto-enhance'), adjWrap);

  // Filters
  const filterGrid = h('div', { class: 'filter-grid' });
  panels.filters = h('div', {}, filterGrid, h('p', { class: 'muted small' }, 'Filters stack with your Adjust settings.'));

  // Crop
  const aspectChips = chipGroup('Crop shape', ASPECTS, 'free', (v) => { st.aspect = v; commit(); fitAspect(); draw(); });
  panels.crop = h('div', {}, aspectChips,
    h('div', { class: 'row gap wrap' },
      h('button', { class: 'ghost chipbtn', onclick: () => { commit(); st.rot = (st.rot + 270) % 360; st.crop = { x: 0, y: 0, w: 1, h: 1 }; fitAspect(); draw(); } }, '⟲ Rotate left'),
      h('button', { class: 'ghost chipbtn', onclick: () => { commit(); st.rot = (st.rot + 90) % 360; st.crop = { x: 0, y: 0, w: 1, h: 1 }; fitAspect(); draw(); } }, '⟳ Rotate right'),
      h('button', { class: 'ghost chipbtn', onclick: () => { commit(); st.flipH = !st.flipH; draw(); } }, '⇋ Flip'),
      h('button', { class: 'ghost chipbtn', onclick: () => { commit(); st.flipV = !st.flipV; draw(); } }, '⇵ Flip vertical')),
    (st.straightenS = slider({ label: 'Straighten', min: -15, max: 15, step: 0.5, value: 0, unit: '°', onInput: (v) => { st.straighten = v; scheduleDraw(); } })),
    h('p', { class: 'muted small' }, 'Drag the corners or the box itself.'));

  // Remove BG
  const bgStatus = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const bgBar = h('div', { class: 'bar', hidden: true }, h('i'));
  const bgBtn = h('button', { class: 'primary alt', onclick: removeBg }, 'Remove background');
  const bgChips = chipGroup('Background', [['transparent', 'Transparent'], ['white', 'White'], ['black', 'Black'], ['color', 'Color'], ['blur', 'Blur original'], ['keep', 'Original']], st.bg, (v) => { commit(); st.bg = v; draw(); });
  const colorIn = h('input', { type: 'color', value: '#ffffff', 'aria-label': 'Background color', oninput: (e) => { st.bgColor = e.target.value; st.bg = 'color'; bgChips.set('color'); scheduleDraw(); } });
  const bgOpts = h('div', { hidden: true }, bgChips, h('label', { class: 'field inline' }, h('span', {}, 'Color'), colorIn));
  panels.bg = h('div', {}, h('p', { class: 'muted small' }, `AI cut-out on your device. First use downloads the model (about ${isPhone() ? 45 : 90} MB), then it works offline.`), bgBtn, bgBar, bgStatus, bgOpts);

  // JSON
  const jsonOut = h('pre', { class: 'code', tabindex: '0', 'aria-label': 'Image JSON' });
  const jsonStatus = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const jsonDetail = select('Detail', [['standard', 'Standard'], ['deep', 'Deep (more fields)'], ['prompt', 'Recreate-it prompts']], 'standard', () => {});
  const jsonBtns = h('div', { class: 'row gap wrap', hidden: true },
    h('button', { class: 'ghost chipbtn', onclick: () => { navigator.clipboard?.writeText(JSON.stringify(st.json, null, 2)); toast('Copied JSON'); } }, 'Copy'),
    h('button', { class: 'ghost chipbtn', onclick: () => saveFiles([{ blob: new Blob([JSON.stringify(st.json, null, 2)], { type: 'application/json' }), name: baseName(st.file.name) + '.json' }]) }, 'Save .json'),
    h('button', { class: 'ghost chipbtn', onclick: () => { handoff.set('imageJson', st.json); nav('md'); } }, 'Make .md from this'));
  panels.json = h('div', {}, h('p', { class: 'muted small' }, 'Colors and stats are measured on-device. With an AI key in Settings it adds a detailed description of the subject, style, lighting and mood.'), jsonDetail,
    h('button', { class: 'primary alt', onclick: toJSON }, 'Describe as JSON'), jsonStatus, jsonBtns, jsonOut);

  // Export
  let exFmt = 'jpg', exQ = 90, exMax = 0, exFit = 0;
  const exStatus = h('p', { class: 'muted small', 'aria-live': 'polite' });
  panels.export = h('div', {},
    chipGroup('Format', [['jpg', 'JPG'], ['png', 'PNG'], ['webp', 'WebP'], ['avif', 'AVIF'], ['jxl', 'JPEG XL'], ['pdf', 'PDF'], ['tiff', 'TIFF']], exFmt, (v) => (exFmt = v)),
    h('div', { class: 'opts' },
      slider({ label: 'Quality', min: 40, max: 100, value: 90, unit: '%', onInput: (v) => (exQ = v) }),
      select('Size', [[0, 'Full'], [4096, '4096 px'], [2048, '2048 px'], [1920, '1920 px'], [1080, '1080 px (Instagram)'], [512, '512 px']], 0, (v) => (exMax = +v)),
      select('Fit under', [[0, 'No limit'], [5000, '5 MB'], [2000, '2 MB'], [1000, '1 MB'], [500, '500 KB'], [200, '200 KB']], 0, (v) => (exFit = +v))),
    h('button', { class: 'primary', onclick: doExport }, 'Save photo'), exStatus);

  const panelWrap = h('div', { class: 'panel' }, ...Object.values(panels));
  const editor = h('div', { hidden: true },
    h('div', { class: 'card stage-card' }, stage, h('div', { class: 'row between' }, h('div', { class: 'row' }, undoBtn, redoBtn), h('div', { class: 'row gap0' }, compareBtn, resetBtn)), meta),
    h('div', { class: 'card' }, tabBar, panelWrap));
  root.append(h('div', { class: 'card' }, picker), editor);
  setTab('adjust');

  for (const [k, f] of Object.entries(FILTERS)) {
    const b = h('button', { class: 'filt', 'aria-pressed': String(k === st.filter), 'data-k': k, onclick: () => { commit(); st.filter = k; [...filterGrid.children].forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.k === k))); draw(); } }, h('canvas', { width: 72, height: 72, 'aria-hidden': 'true' }), h('span', {}, f.label));
    filterGrid.append(b);
  }

  function setTab(k) {
    st.tab = k;
    [...tabBar.children].forEach((t) => t.setAttribute('aria-selected', String(t.dataset.k === k)));
    Object.entries(panels).forEach(([pk, p]) => (p.hidden = pk !== k));
    cropBox.hidden = k !== 'crop';
    draw();
  }

  async function load(file) {
    meta.textContent = 'Opening…'; editor.hidden = false;
    try {
      const bmp = await decodeImage(file);
      st.file = file; st.src = bmp; st.cut = null; st.json = null; jsonOut.textContent = ''; jsonBtns.hidden = true; bgOpts.hidden = true; bgStatus.textContent = '';
      Object.assign(st, { rot: 0, flipH: false, flipV: false, straighten: 0, crop: { x: 0, y: 0, w: 1, h: 1 }, adj: { ...DEFAULT_ADJ }, filter: 'none', bg: 'transparent' });
      hist.length = 0; future = [];
      syncControls(); draw(); thumbs();
      meta.textContent = `${file.name} · ${bmp.width}×${bmp.height} · ${fmtBytes(file.size)}`;
    } catch (e) { meta.textContent = 'Could not open this image: ' + e.message; }
  }

  function syncControls() {
    for (const [k, s] of Object.entries(adjSliders)) s.set(st.adj[k] || 0);
    st.straightenS.set(st.straighten);
    [...filterGrid.children].forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.k === st.filter)));
    bgChips.set(st.bg);
  }

  // ---- rendering ----
  function layer(scale) {
    const W = Math.round(st.src.width * scale), H = Math.round(st.src.height * scale);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    if (st.cut && st.bg !== 'keep') {
      if (st.bg === 'white' || st.bg === 'black' || st.bg === 'color') { x.fillStyle = st.bg === 'color' ? st.bgColor : st.bg; x.fillRect(0, 0, W, H); }
      if (st.bg === 'blur') { const t = document.createElement('canvas'); t.width = Math.max(1, W >> 4); t.height = Math.max(1, H >> 4); t.getContext('2d').drawImage(st.src, 0, 0, t.width, t.height); x.imageSmoothingQuality = 'high'; x.drawImage(t, 0, 0, W, H); }
      x.drawImage(st.cut, 0, 0, W, H);
    } else x.drawImage(st.src, 0, 0, W, H);
    return c;
  }
  function geometry(src, noCrop) {
    const rot90 = st.rot % 180 !== 0;
    const RW = rot90 ? src.height : src.width, RH = rot90 ? src.width : src.height;
    const g = document.createElement('canvas'); g.width = RW; g.height = RH; const x = g.getContext('2d');
    const a = st.straighten * Math.PI / 180, zoom = Math.abs(a) ? Math.cos(Math.abs(a)) + Math.sin(Math.abs(a)) * Math.max(RW / RH, RH / RW) : 1;
    x.translate(RW / 2, RH / 2); x.rotate(st.rot * Math.PI / 180 + a); x.scale((st.flipH ? -1 : 1) * zoom, (st.flipV ? -1 : 1) * zoom);
    x.imageSmoothingQuality = 'high'; x.drawImage(src, -src.width / 2, -src.height / 2);
    if (noCrop) return g;
    const c = st.crop; if (c.x === 0 && c.y === 0 && c.w === 1 && c.h === 1) return g;
    const o = document.createElement('canvas'); o.width = Math.max(1, Math.round(RW * c.w)); o.height = Math.max(1, Math.round(RH * c.h));
    o.getContext('2d').drawImage(g, -RW * c.x, -RH * c.y); return o;
  }
  const adjFor = () => { const f = FILTERS[st.filter] || {}; const a = { ...st.adj }; for (const k of Object.keys(DEFAULT_ADJ)) if (k !== 'levels' && f[k]) a[k] = (a[k] || 0) + f[k]; return a; };
  function render(maxSide, { noCrop = false, original = false } = {}) {
    const s = Math.min(1, maxSide / Math.max(st.src.width, st.src.height), Math.sqrt(MAX_PIXELS / (st.src.width * st.src.height)));
    if (original) { const c = document.createElement('canvas'); c.width = Math.round(st.src.width * s); c.height = Math.round(st.src.height * s); c.getContext('2d').drawImage(st.src, 0, 0, c.width, c.height); return c; }
    const out = geometry(layer(s), noCrop);
    applyAdjust(out.getContext('2d', { willReadFrequently: true }), out.width, out.height, adjFor());
    return out;
  }
  let pending;
  function scheduleDraw() { cancelAnimationFrame(pending); pending = requestAnimationFrame(() => draw()); }
  function draw(original = false) {
    if (!st.src) return;
    const max = Math.min(1600, Math.round((stage.clientWidth || 360) * (window.devicePixelRatio || 1)));
    const c = render(max, { noCrop: st.tab === 'crop', original });
    view.width = c.width; view.height = c.height; const x = view.getContext('2d'); x.clearRect(0, 0, c.width, c.height); x.drawImage(c, 0, 0);
    stage.classList.toggle('checker', !!st.cut && st.bg === 'transparent');
    placeCrop();
  }
  function thumbs() {
    const s = 72 / Math.min(st.src.width, st.src.height);
    const base = document.createElement('canvas'); base.width = 72; base.height = 72;
    base.getContext('2d').drawImage(st.src, (72 - st.src.width * s) / 2, (72 - st.src.height * s) / 2, st.src.width * s, st.src.height * s);
    for (const b of filterGrid.children) {
      const c = b.querySelector('canvas'), x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(base, 0, 0);
      const f = FILTERS[b.dataset.k]; const a = { ...DEFAULT_ADJ }; for (const k of Object.keys(a)) if (f[k]) a[k] = f[k];
      applyAdjust(x, 72, 72, a);
    }
  }

  // ---- crop interaction ----
  function placeCrop() {
    if (cropBox.hidden) return;
    const r = view.getBoundingClientRect(), sr = stage.getBoundingClientRect();
    Object.assign(cropBox.style, { left: (r.left - sr.left + st.crop.x * r.width) + 'px', top: (r.top - sr.top + st.crop.y * r.height) + 'px', width: st.crop.w * r.width + 'px', height: st.crop.h * r.height + 'px' });
  }
  function ratio() {
    if (st.aspect === 'free') return null;
    const rot90 = st.rot % 180 !== 0; const RW = rot90 ? st.src.height : st.src.width, RH = rot90 ? st.src.width : st.src.height;
    const [a, b] = st.aspect === 'orig' ? [RW, RH] : st.aspect.split(':').map(Number);
    return (a / b) / (RW / RH); // ratio in normalized units (w/h)
  }
  function fitAspect() {
    const r = ratio(); if (!r) return;
    let w = 1, hh = 1; if (r > 1) hh = 1 / r; else w = r;
    st.crop = { x: (1 - w) / 2, y: (1 - hh) / 2, w, h: hh };
  }
  let drag = null;
  cropBox.addEventListener('pointerdown', (e) => {
    e.preventDefault(); cropBox.setPointerCapture(e.pointerId);
    drag = { hdl: e.target.dataset.h || 'move', x0: e.clientX, y0: e.clientY, c0: { ...st.crop } };
  });
  cropBox.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const r = view.getBoundingClientRect(); const dx = (e.clientX - drag.x0) / r.width, dy = (e.clientY - drag.y0) / r.height;
    let { x, y, w, h: hh } = drag.c0; const min = 0.05, rr = ratio();
    if (drag.hdl === 'move') { x = Math.min(1 - w, Math.max(0, x + dx)); y = Math.min(1 - hh, Math.max(0, y + dy)); }
    else {
      const L = drag.hdl.includes('w'), T = drag.hdl.includes('n');
      let nx = L ? x + dx : x, ny = T ? y + dy : y, nw = L ? w - dx : w + dx, nh = T ? hh - dy : hh + dy;
      nw = Math.max(min, nw); nh = Math.max(min, nh);
      if (rr) { nh = nw / rr; if (T) ny = y + hh - nh; }
      if (L) nx = x + w - nw;
      if (nx < 0) { nw += nx; nx = 0; if (rr) nh = nw / rr; } if (ny < 0) { nh += ny; ny = 0; if (rr) nw = nh * rr; }
      if (nx + nw > 1) { nw = 1 - nx; if (rr) nh = nw / rr; } if (ny + nh > 1) { nh = 1 - ny; if (rr) nw = nh * rr; }
      x = nx; y = ny; w = nw; hh = nh;
    }
    st.crop = { x, y, w, h: hh }; placeCrop();
  });
  cropBox.addEventListener('pointerup', () => { if (drag) { hist.push(JSON.stringify({ ...JSON.parse(snap()), crop: drag.c0 })); drag = null; } });
  window.addEventListener('resize', () => draw());

  // ---- actions ----
  function autoEnhance() {
    commit();
    const c = render(600, { noCrop: true });
    const lv = autoLevels(c.getContext('2d'), c.width, c.height);
    const a = analyzeColors(c);
    st.adj = { ...DEFAULT_ADJ, levels: lv, vibrance: a && a.saturation < 0.35 ? 22 : 8, contrast: a && a.contrast < 0.35 ? 10 : 2, shadows: a && a.brightness < 0.4 ? 18 : 6, highlights: a && a.brightness > 0.65 ? -18 : -6, sharpen: 15 };
    syncControls(); draw(); toast('Enhanced. Tweak in Adjust or tap Undo.');
  }

  async function removeBg() {
    bgBtn.disabled = true; bgBar.hidden = false; bgStatus.textContent = 'Loading AI cut-out…';
    try {
      const { removeBackground } = await import('../../vendor/bg.mjs');
      const s = Math.min(1, 2048 / Math.max(st.src.width, st.src.height));
      const c = document.createElement('canvas'); c.width = Math.round(st.src.width * s); c.height = Math.round(st.src.height * s); c.getContext('2d').drawImage(st.src, 0, 0, c.width, c.height);
      const input = await new Promise((r) => c.toBlob(r, 'image/png'));
      const blob = await removeBackground(input, {
        model: bgModel(), ...(self.__csTest?.imglyPath ? { publicPath: self.__csTest.imglyPath } : {}), output: { format: 'image/png', type: 'foreground' },
        progress: (key, cur, tot) => { if (tot) bgBar.firstChild.style.width = (cur / tot * 100) + '%'; bgStatus.textContent = key.startsWith('fetch') ? `Downloading model ${Math.round(cur / tot * 100)}%` : 'Cutting out…'; },
      });
      const mask = await createImageBitmap(blob);
      // build full-res cutout: original * mask alpha
      const cut = document.createElement('canvas'); cut.width = st.src.width; cut.height = st.src.height; const x = cut.getContext('2d');
      x.drawImage(mask, 0, 0, cut.width, cut.height);
      const md = x.getImageData(0, 0, cut.width, cut.height);
      x.clearRect(0, 0, cut.width, cut.height); x.drawImage(st.src, 0, 0);
      const od = x.getImageData(0, 0, cut.width, cut.height);
      for (let i = 0; i < od.data.length; i += 4) od.data[i + 3] = Math.min(od.data[i + 3], md.data[i + 3]);
      x.putImageData(od, 0, 0);
      commit(); st.cut = cut; st.bg = 'transparent'; bgChips.set('transparent'); bgOpts.hidden = false;
      bgStatus.textContent = 'Done. Pick a background below, then Export as PNG to keep transparency.';
      draw();
    } catch (e) { console.error(e); bgStatus.textContent = 'Background removal failed: ' + e.message; }
    bgBtn.disabled = false; bgBar.hidden = true;
  }

  async function toJSON() {
    jsonStatus.textContent = 'Analyzing…'; jsonBtns.hidden = true;
    const c = render(1600);
    const colors = analyzeColors(c);
    const g = (a, b) => { while (b) [a, b] = [b, a % b]; return a; }; const d = g(c.width, c.height);
    const json = {
      file: { name: st.file.name, type: st.file.type || 'image', size_bytes: st.file.size },
      dimensions: { width: c.width, height: c.height, original_width: st.src.width, original_height: st.src.height, megapixels: +(c.width * c.height / 1e6).toFixed(1), aspect_ratio: `${c.width / d}:${c.height / d}`.length < 9 ? `${c.width / d}:${c.height / d}` : (c.width / c.height).toFixed(2), orientation: c.width > c.height ? 'landscape' : c.width < c.height ? 'portrait' : 'square' },
      colors,
    };
    const p = activeProvider();
    if (p) {
      jsonStatus.textContent = 'Asking AI for a detailed description…';
      const detail = jsonDetail.sel.value;
      const schema = `{
 "subject": "main subject in a few words",
 "description": "2-4 sentence detailed description",
 "objects": ["notable objects"],
 "people": [{"count_or_role":"", "appearance":"", "clothing":"", "expression":"", "pose":""}],
 "setting": {"location":"", "time_of_day":"", "weather":"", "era":""},
 "visual_style": {"medium":"photo|illustration|3D render|painting|...", "genre":"", "aesthetic":"", "influences":[]},
 "lighting": {"type":"", "direction":"", "quality":"", "color":""},
 "composition": {"framing":"", "angle":"", "focal_point":"", "depth_of_field":"", "rule_of_thirds": true},
 "camera": {"shot_type":"", "lens_guess":"", "aperture_guess":""},
 "colors_described": {"palette_words": [], "contrast":"", "grading":""},
 "mood": ["words"],
 "text_in_image": "any visible text or empty string",
 "tags": ["10-20 tags"]${detail !== 'standard' ? `,
 "textures_materials": [],
 "background": "",
 "notable_details": []` : ''}${detail === 'prompt' || detail === 'deep' ? `,
 "recreate_prompts": {"midjourney": "", "stable_diffusion": "", "flux": "", "negative_prompt": ""}` : ''}
}`;
      try {
        json.ai = await ask({ prompt: `Describe this image in detail as JSON exactly matching this shape (fill every field you can, keep keys):\n${schema}\nMeasured palette (for reference): ${colors?.palette?.slice(0, 6).map((x) => x.hex + ' ' + x.name).join(', ')}`, image: await canvasToB64(c), json: true });
        json.ai_provider = p.id + ':' + p.model;
      } catch (e) { jsonStatus.textContent = 'AI step failed (' + e.message + '). Showing on-device analysis.'; }
    } else jsonStatus.textContent = 'Add an AI key in Settings for subject, style and mood. Showing on-device analysis.';
    json.generated = new Date().toISOString();
    st.json = json;
    jsonOut.textContent = JSON.stringify(json, null, 2);
    jsonBtns.hidden = false;
    if (json.ai) jsonStatus.textContent = 'Done.';
  }

  async function doExport() {
    exStatus.textContent = 'Rendering full size…';
    await new Promise((r) => setTimeout(r, 30));
    try {
      let c = render(exMax || 100000);
      let blob;
      if (exFit && ['jpg', 'webp', 'avif', 'jxl'].includes(exFmt)) blob = await encodeUnder(c, exFmt, exFit * 1000);
      else blob = await encodeCanvas(c, exFmt, exQ);
      const name = `${baseName(st.file.name)}_edit.${exFmt}`;
      exStatus.textContent = `${c.width}×${c.height} · ${fmtBytes(blob.size)}`;
      await saveFiles([{ blob, name }]);
    } catch (e) { exStatus.textContent = 'Export failed: ' + e.message; }
  }
}
