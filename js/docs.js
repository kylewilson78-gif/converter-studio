// Documents, data, subtitles, ebooks and archives — all on-device.
import { loadScript, baseName, extOf } from './ui.js';
import { pdfFromCanvases, canvasBlob, encodeCanvas } from './image.js';

const T = (s, type = 'text/plain') => new Blob([s], { type: type + ';charset=utf-8' });
const readText = (f) => f.text();

// ---------------- PDF ----------------
let pdfjs;
async function getPdfjs() {
  if (pdfjs) return pdfjs;
  pdfjs = await import('../vendor/pdfjs/pdf.min.mjs');
  pdfjs.GlobalWorkerOptions.workerSrc = new URL('../vendor/pdfjs/pdf.worker.min.mjs', import.meta.url).href;
  return pdfjs;
}
async function openPdf(file) {
  const lib = await getPdfjs();
  return lib.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise;
}

export async function pdfToImages(file, fmt = 'jpg', { scale = 2, quality = 88, onProgress } = {}) {
  const doc = await openPdf(file); const out = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    let vp = page.getViewport({ scale });
    const maxPx = 16_000_000; if (vp.width * vp.height > maxPx) vp = page.getViewport({ scale: scale * Math.sqrt(maxPx / (vp.width * vp.height)) });
    const c = document.createElement('canvas'); c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    out.push({ blob: await encodeCanvas(c, fmt, quality), name: `${baseName(file.name)}_page${String(i).padStart(3, '0')}.${fmt}` });
    c.width = c.height = 0; onProgress?.(i / doc.numPages);
  }
  return out;
}

export async function pdfToText(file) {
  const doc = await openPdf(file); let s = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const tc = await (await doc.getPage(i)).getTextContent();
    let line = '', lastY = null;
    for (const it of tc.items) {
      const y = it.transform?.[5];
      if (lastY !== null && Math.abs(y - lastY) > 2) { s += line.trimEnd() + '\n'; line = ''; }
      line += it.str + (it.hasEOL ? '\n' : ''); lastY = y;
    }
    s += line.trimEnd() + '\n\n';
  }
  return s.replace(/\n{3,}/g, '\n\n');
}

async function pdfLib() { return import('../vendor/pdf-lib.mjs'); }

export async function mergePdfs(files) {
  const { PDFDocument } = await pdfLib();
  const out = await PDFDocument.create();
  for (const f of files) {
    if (extOf(f.name) === 'pdf') {
      const src = await PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true });
      (await out.copyPages(src, src.getPageIndices())).forEach((p) => out.addPage(p));
    }
  }
  return new Blob([await out.save()], { type: 'application/pdf' });
}

export async function splitPdf(file) {
  const { PDFDocument } = await pdfLib();
  const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
  const outs = [];
  for (const i of src.getPageIndices()) {
    const d = await PDFDocument.create(); const [p] = await d.copyPages(src, [i]); d.addPage(p);
    outs.push({ blob: new Blob([await d.save()], { type: 'application/pdf' }), name: `${baseName(file.name)}_p${i + 1}.pdf` });
  }
  return outs;
}

export async function compressPdf(file, quality = 60) {
  // Re-render each page as a JPEG at 1.5x: big savings for scanned/photo PDFs
  const doc = await openPdf(file); const pages = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i); const vp = page.getViewport({ scale: 1.5 });
    const c = document.createElement('canvas'); c.width = Math.floor(vp.width); c.height = Math.floor(vp.height);
    const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;
    pages.push({ canvas: c, q: quality });
  }
  const blob = await pdfFromCanvases(pages);
  pages.forEach((p) => (p.canvas.width = p.canvas.height = 0));
  return blob.size < file.size ? blob : file;
}

// Simple, clean text/markdown -> PDF typesetter (Letter size)
export async function textToPdf(text, { markdown = false, title = '' } = {}) {
  const { PDFDocument, StandardFonts, rgb } = await pdfLib();
  const doc = await PDFDocument.create();
  const reg = await doc.embedFont(StandardFonts.Helvetica), bold = await doc.embedFont(StandardFonts.HelveticaBold), mono = await doc.embedFont(StandardFonts.Courier);
  const W = 612, H = 792, M = 56, maxW = W - M * 2;
  const clean = (s) => s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\u2026/g, '...').replace(/\t/g, '    ')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
  let page = doc.addPage([W, H]), y = H - M;
  const newPage = () => { page = doc.addPage([W, H]); y = H - M; };
  const draw = (str, font, size, indent = 0, color = rgb(0.1, 0.1, 0.12)) => {
    const words = clean(str).split(/(\s+)/); let line = '';
    const flush = () => { if (y < M + size) newPage(); page.drawText(line, { x: M + indent, y: y - size, size, font, color }); y -= size * 1.4; line = ''; };
    for (const w of words) {
      const test = line + w;
      if (font.widthOfTextAtSize(test, size) > maxW - indent && line.trim()) { flush(); line = w.trimStart(); } else line = test;
    }
    if (line.trim() || !str.trim()) flush();
  };
  if (title) { draw(title, bold, 20); y -= 8; }
  let inCode = false;
  for (const raw of text.split('\n')) {
    if (markdown && raw.trim().startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) { draw(raw || ' ', mono, 9.5, 12, rgb(0.2, 0.2, 0.25)); continue; }
    if (!markdown) { draw(raw || ' ', reg, 11); continue; }
    const m = raw.match(/^(#{1,6})\s+(.*)/);
    const strip = (s) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/\*(.+?)\*/g, '$1').replace(/`([^`]+)`/g, '$1').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    if (m) { y -= 6; draw(strip(m[2]), bold, [22, 18, 15, 13, 12, 11][m[1].length - 1]); y -= 2; }
    else if (/^\s*[-*+]\s+/.test(raw)) draw('•  ' + strip(raw.replace(/^\s*[-*+]\s+/, '')), reg, 11, 10 + (raw.match(/^\s*/)[0].length * 4));
    else if (/^\s*\d+[.)]\s+/.test(raw)) draw(strip(raw.trim()), reg, 11, 10);
    else if (/^>\s?/.test(raw)) draw(strip(raw.replace(/^>\s?/, '')), reg, 11, 16, rgb(0.35, 0.35, 0.4));
    else if (/^(-{3,}|\*{3,})\s*$/.test(raw)) { y -= 6; page.drawLine({ start: { x: M, y }, end: { x: W - M, y }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) }); y -= 10; }
    else draw(strip(raw) || ' ', reg, 11);
  }
  return new Blob([await doc.save()], { type: 'application/pdf' });
}

// ---------------- Word / Markdown / HTML / Text ----------------
async function mammoth() { await loadScript('vendor/mammoth.browser.min.js'); return window.mammoth; }
async function marked() { return (await import('../vendor/marked.mjs')).marked; }
async function turndown() { const { default: T } = await import('../vendor/turndown.mjs'); return new T({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' }); }

const htmlDoc = (body, title = 'Document') => `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title.replace(/</g, '&lt;')}</title><style>body{font:16px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;max-width:760px;margin:40px auto;padding:0 20px;color:#1b1b1f}pre,code{background:#f3f3f6;border-radius:6px}pre{padding:12px;overflow:auto}img{max-width:100%}table{border-collapse:collapse}td,th{border:1px solid #ddd;padding:6px 10px}blockquote{border-left:4px solid #ddd;margin:0;padding-left:16px;color:#555}</style></head><body>${body}</body></html>`;
const htmlToText = (html) => { const d = new DOMParser().parseFromString(html, 'text/html'); d.querySelectorAll('script,style').forEach((e) => e.remove()); d.querySelectorAll('br').forEach((b) => b.replaceWith('\n')); d.querySelectorAll('p,div,h1,h2,h3,h4,h5,h6,li,tr').forEach((e) => e.append('\n')); return (d.body?.textContent || '').replace(/\n{3,}/g, '\n\n').trim() + '\n'; };
const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function docxToHtml(file) { const m = await mammoth(); return (await m.convertToHtml({ arrayBuffer: await file.arrayBuffer() })).value; }

// ---------------- Data ----------------
async function xlsx() { await loadScript('vendor/xlsx.full.min.js'); return window.XLSX; }
async function yaml() { return import('../vendor/js-yaml.mjs'); }

function parseCSV(text, delim) {
  if (!delim) { const first = text.split('\n')[0]; delim = [',', '\t', ';', '|'].reduce((a, b) => (first.split(b).length > first.split(a).length ? b : a), ','); }
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === delim) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.length > 1 || r[0] !== '');
}
const toCSV = (rows, d = ',') => rows.map((r) => r.map((v) => { v = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); return /["\n\r,;\t|]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v; }).join(d)).join('\n') + '\n';
const autoType = (v) => (v === '' ? '' : /^-?\d+(\.\d+)?$/.test(v) && !/^0\d/.test(v) ? +v : v === 'true' ? true : v === 'false' ? false : v);
function rowsToObjects(rows) { const [head, ...rest] = rows; return rest.map((r) => Object.fromEntries(head.map((k, i) => [k || `col${i + 1}`, autoType(r[i] ?? '')]))); }
function flatten(o, pre = '', out = {}) { for (const [k, v] of Object.entries(o)) { const key = pre ? `${pre}.${k}` : k; if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out); else out[key] = Array.isArray(v) ? JSON.stringify(v) : v; } return out; }
function objectsToRows(data) {
  let arr = Array.isArray(data) ? data : (Object.values(data).find(Array.isArray) || [data]);
  arr = arr.map((x) => (x && typeof x === 'object' ? flatten(x) : { value: x }));
  const keys = [...new Set(arr.flatMap(Object.keys))];
  return [keys, ...arr.map((o) => keys.map((k) => o[k] ?? ''))];
}
function xmlToObj(node) {
  const el = node.nodeType === 9 ? node.documentElement : node;
  const kids = [...el.children];
  const attrs = Object.fromEntries([...el.attributes].map((a) => ['@' + a.name, a.value]));
  if (!kids.length) { const t = el.textContent.trim(); return Object.keys(attrs).length ? { ...attrs, ...(t ? { '#text': t } : {}) } : autoType(t); }
  const o = { ...attrs };
  for (const k of kids) { const v = xmlToObj(k); if (k.tagName in o) { if (!Array.isArray(o[k.tagName])) o[k.tagName] = [o[k.tagName]]; o[k.tagName].push(v); } else o[k.tagName] = v; }
  return o;
}
function objToXml(v, tag = 'root', ind = '') {
  const safe = (t) => String(t).replace(/[^A-Za-z0-9_.-]/g, '_').replace(/^([^A-Za-z_])/, '_$1');
  if (Array.isArray(v)) return v.map((x) => objToXml(x, tag, ind)).join('');
  if (v && typeof v === 'object') {
    const attrs = Object.entries(v).filter(([k]) => k.startsWith('@')).map(([k, x]) => ` ${safe(k.slice(1))}="${escapeHtml(String(x))}"`).join('');
    const kids = Object.entries(v).filter(([k]) => !k.startsWith('@') && k !== '#text');
    const text = v['#text'] != null ? escapeHtml(String(v['#text'])) : '';
    if (!kids.length) return `${ind}<${safe(tag)}${attrs}>${text}</${safe(tag)}>\n`;
    return `${ind}<${safe(tag)}${attrs}>\n${kids.map(([k, x]) => objToXml(x, Array.isArray(x) ? (tag === 'root' && k === 'items' ? 'item' : k) : k, ind + '  ')).join('')}${ind}</${safe(tag)}>\n`;
  }
  return `${ind}<${safe(tag)}>${escapeHtml(String(v ?? ''))}</${safe(tag)}>\n`;
}

async function readData(file) {
  const e = extOf(file.name);
  if (['xlsx', 'xls', 'ods', 'numbers'].includes(e)) {
    const X = await xlsx(); const wb = X.read(await file.arrayBuffer());
    const sheets = Object.fromEntries(wb.SheetNames.map((n) => [n, X.utils.sheet_to_json(wb.Sheets[n], { header: 1, defval: '' })]));
    return { rows: sheets[wb.SheetNames[0]], sheets };
  }
  const text = await readText(file);
  if (e === 'json') { const data = JSON.parse(text); return { data }; }
  if (e === 'yaml' || e === 'yml') { const Y = await yaml(); return { data: Y.load(text) }; }
  if (e === 'xml') { const d = new DOMParser().parseFromString(text, 'application/xml'); if (d.querySelector('parsererror')) throw new Error('Invalid XML'); return { data: { [d.documentElement.tagName]: xmlToObj(d) } }; }
  return { rows: parseCSV(text, e === 'tsv' ? '\t' : undefined) };
}

export async function convertData(file, target) {
  const src = await readData(file);
  const rows = () => src.rows || objectsToRows(src.data);
  const data = () => src.data ?? rowsToObjects(src.rows);
  switch (target) {
    case 'csv': return T(toCSV(rows()), 'text/csv');
    case 'tsv': return T(toCSV(rows(), '\t'), 'text/tab-separated-values');
    case 'json': return T(JSON.stringify(data(), null, 2) + '\n', 'application/json');
    case 'yaml': { const Y = await yaml(); return T(Y.dump(data(), { lineWidth: 120 }), 'application/yaml'); }
    case 'xml': { const d = data(); const top = Array.isArray(d) ? { items: d } : d; const k = Object.keys(top); return T('<?xml version="1.0" encoding="UTF-8"?>\n' + (k.length === 1 && !Array.isArray(top[k[0]]) ? objToXml(top[k[0]], k[0]) : objToXml(top, 'root')), 'application/xml'); }
    case 'md': { const r = rows(); const esc = (v) => String(v ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' '); return T(`| ${r[0].map(esc).join(' | ')} |\n| ${r[0].map(() => '---').join(' | ')} |\n` + r.slice(1).map((x) => `| ${r[0].map((_, i) => esc(x[i])).join(' | ')} |`).join('\n') + '\n', 'text/markdown'); }
    case 'html': { const r = rows(); return T(htmlDoc(`<table><thead><tr>${r[0].map((c) => `<th>${escapeHtml(String(c))}</th>`).join('')}</tr></thead><tbody>${r.slice(1).map((x) => `<tr>${r[0].map((_, i) => `<td>${escapeHtml(String(x[i] ?? ''))}</td>`).join('')}</tr>`).join('')}</tbody></table>`, baseName(file.name)), 'text/html'); }
    case 'xlsx': case 'ods': {
      const X = await xlsx(); const wb = X.utils.book_new();
      if (src.sheets) for (const [n, r] of Object.entries(src.sheets)) X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(r), n.slice(0, 31));
      else X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet(rows()), 'Sheet1');
      const out = X.write(wb, { bookType: target, type: 'array' });
      return new Blob([out], { type: target === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/vnd.oasis.opendocument.spreadsheet' });
    }
    default: throw new Error('Unsupported');
  }
}

// ---------------- Subtitles ----------------
const ts = (t) => { const p = t.trim().replace(',', '.').split(':').map(Number); return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p.length === 2 ? p[0] * 60 + p[1] : p[0]; };
const fmt = (s, sep = ',') => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60), ms = Math.round((s % 1) * 1000); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}${sep}${String(ms).padStart(3, '0')}`; };
function parseSubs(text, ext) {
  text = text.replace(/\r/g, '').replace(/^\uFEFF/, '');
  const cues = [];
  if (ext === 'ass' || ext === 'ssa') {
    for (const l of text.split('\n')) { const m = l.match(/^Dialogue:\s*[^,]*,([^,]+),([^,]+),(?:[^,]*,){6}(.*)$/); if (m) cues.push({ start: ts(m[1]), end: ts(m[2]), text: m[3].replace(/\{[^}]*\}/g, '').replace(/\\N/gi, '\n') }); }
  } else if (ext === 'lrc') {
    const lines = []; for (const l of text.split('\n')) { const tags = [...l.matchAll(/\[(\d+):(\d+(?:\.\d+)?)\]/g)]; const t = l.replace(/\[[^\]]*\]/g, '').trim(); tags.forEach((m) => lines.push({ start: +m[1] * 60 + +m[2], text: t })); }
    lines.sort((a, b) => a.start - b.start).forEach((c, i, a) => cues.push({ ...c, end: a[i + 1]?.start ?? c.start + 4 }));
  } else if (ext === 'sbv') {
    for (const b of text.split(/\n\n+/)) { const [t, ...rest] = b.trim().split('\n'); const m = t?.match(/([\d:.]+),([\d:.]+)/); if (m) cues.push({ start: ts(m[1]), end: ts(m[2]), text: rest.join('\n') }); }
  } else { // srt / vtt
    for (const b of text.split(/\n\n+/)) { const lines = b.trim().split('\n'); const i = lines.findIndex((l) => l.includes('-->')); if (i < 0) continue; const [a, z] = lines[i].split('-->'); cues.push({ start: ts(a), end: ts(z.trim().split(' ')[0]), text: lines.slice(i + 1).join('\n').replace(/<[^>]+>/g, '') }); }
  }
  return cues;
}
function writeSubs(cues, t) {
  switch (t) {
    case 'srt': return cues.map((c, i) => `${i + 1}\n${fmt(c.start)} --> ${fmt(c.end)}\n${c.text}\n`).join('\n');
    case 'vtt': return 'WEBVTT\n\n' + cues.map((c) => `${fmt(c.start, '.')} --> ${fmt(c.end, '.')}\n${c.text}\n`).join('\n');
    case 'ass': return `[Script Info]\nScriptType: v4.00+\nPlayResX: 1920\nPlayResY: 1080\n\n[V4+ Styles]\nFormat: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding\nStyle: Default,Arial,64,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,-1,0,0,0,100,100,0,0,1,3,1,2,40,40,60,1\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n` + cues.map((c) => `Dialogue: 0,${fmt(c.start, '.').slice(1, -1)},${fmt(c.end, '.').slice(1, -1)},Default,,0,0,0,,${c.text.replace(/\n/g, '\\N')}`).join('\n') + '\n';
    case 'lrc': return cues.map((c) => `[${String(Math.floor(c.start / 60)).padStart(2, '0')}:${(c.start % 60).toFixed(2).padStart(5, '0')}]${c.text.replace(/\n/g, ' ')}`).join('\n') + '\n';
    case 'sbv': return cues.map((c) => `${fmt(c.start, '.').slice(1)},${fmt(c.end, '.').slice(1)}\n${c.text}\n`).join('\n');
    case 'txt': return cues.map((c) => c.text).join('\n') + '\n';
  }
}

// ---------------- EPUB ----------------
async function epubToHtml(file) {
  await loadScript('vendor/jszip.min.js');
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const container = await zip.file('META-INF/container.xml')?.async('string');
  const opfPath = container?.match(/full-path="([^"]+)"/)?.[1];
  if (!opfPath) throw new Error('Not a valid EPUB');
  const opf = new DOMParser().parseFromString(await zip.file(opfPath).async('string'), 'application/xml');
  const dir = opfPath.includes('/') ? opfPath.replace(/[^/]+$/, '') : '';
  const items = Object.fromEntries([...opf.getElementsByTagName('item')].map((i) => [i.getAttribute('id'), i.getAttribute('href')]));
  const title = opf.getElementsByTagName('dc:title')[0]?.textContent || baseName(file.name);
  let body = `<h1>${escapeHtml(title)}</h1>`;
  for (const ref of opf.getElementsByTagName('itemref')) {
    const href = items[ref.getAttribute('idref')]; if (!href) continue;
    const f = zip.file(decodeURIComponent(dir + href)); if (!f) continue;
    const d = new DOMParser().parseFromString(await f.async('string'), 'text/html');
    d.querySelectorAll('img,image,svg,script,style,link').forEach((e) => e.remove());
    body += `<section>${d.body?.innerHTML || ''}</section>`;
  }
  return { html: body, title };
}

async function makeEpub(title, html) {
  await loadScript('vendor/jszip.min.js');
  const zip = new window.JSZip();
  const id = 'urn:uuid:' + (crypto.randomUUID?.() || Date.now());
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });
  zip.file('META-INF/container.xml', '<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  const xhtml = new XMLSerializer().serializeToString(new DOMParser().parseFromString(`<div>${html}</div>`, 'text/html').body.firstChild);
  zip.file('OEBPS/book.xhtml', `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml"><head><title>${escapeHtml(title)}</title></head><body>${xhtml}</body></html>`);
  zip.file('OEBPS/nav.xhtml', `<?xml version="1.0" encoding="utf-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol><li><a href="book.xhtml">${escapeHtml(title)}</a></li></ol></nav></body></html>`);
  zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="utf-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="id">${id}</dc:identifier><dc:title>${escapeHtml(title)}</dc:title><dc:language>en</dc:language><meta property="dcterms:modified">${new Date().toISOString().slice(0, 19)}Z</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="book" href="book.xhtml" media-type="application/xhtml+xml"/></manifest><spine><itemref idref="book"/></spine></package>`);
  return zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
}

// ---------------- Archives ----------------
export async function unzipFile(file) {
  await loadScript('vendor/jszip.min.js');
  const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
  const outs = [];
  for (const e of Object.values(zip.files)) if (!e.dir && !e.name.startsWith('__MACOSX/') && !/(^|\/)\.DS_Store$/.test(e.name)) outs.push({ blob: await e.async('blob'), name: e.name.split('/').pop() });
  return outs;
}
async function gunzip(file) {
  if (!('DecompressionStream' in window)) throw new Error('This browser can’t unzip .gz');
  return new Response(file.stream().pipeThrough(new DecompressionStream('gzip'))).blob();
}
export async function gzip(file) {
  if (!('CompressionStream' in window)) throw new Error('This browser can’t make .gz');
  return new Blob([await new Response(file.stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer()], { type: 'application/gzip' });
}

// ---------------- Registry ----------------
export const DOC_KINDS = {
  pdf: { exts: ['pdf'], targets: ['jpg', 'png', 'webp', 'txt', 'md', 'split', 'compress'], labels: { split: 'Split pages', compress: 'Compress' } },
  word: { exts: ['docx'], targets: ['html', 'md', 'txt', 'pdf', 'epub'] },
  markdown: { exts: ['md', 'markdown'], targets: ['html', 'pdf', 'txt', 'epub'] },
  html: { exts: ['html', 'htm'], targets: ['md', 'txt', 'pdf', 'epub'] },
  text: { exts: ['txt', 'rtf', 'log'], targets: ['pdf', 'md', 'html', 'epub'] },
  data: { exts: ['csv', 'tsv', 'json', 'xml', 'yaml', 'yml', 'xlsx', 'xls', 'ods', 'numbers'], targets: ['csv', 'json', 'xlsx', 'tsv', 'xml', 'yaml', 'md', 'html', 'ods'], labels: { md: 'MD table', html: 'HTML table' } },
  subs: { exts: ['srt', 'vtt', 'ass', 'ssa', 'lrc', 'sbv'], targets: ['srt', 'vtt', 'ass', 'lrc', 'sbv', 'txt'] },
  ebook: { exts: ['epub'], targets: ['txt', 'html', 'md', 'pdf'] },
  archive: { exts: ['zip', 'gz'], targets: ['extract'], labels: { extract: 'Extract files' } },
};
export function docKindOf(file) {
  const e = extOf(file.name);
  for (const [k, v] of Object.entries(DOC_KINDS)) if (v.exts.includes(e)) return k;
  if (file.type === 'application/pdf') return 'pdf';
  if (file.type === 'text/plain') return 'text';
  return null;
}

const rtfToText = (s) => s.replace(/\\par[d]?/g, '\n').replace(/\{\\\*[^}]*\}/g, '').replace(/\\'([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h, 16))).replace(/\\[a-z]+-?\d* ?/gi, '').replace(/[{}]/g, '').trim();

/** Returns array of {blob, name} */
export async function convertDoc(file, kind, target, { quality = 85, onProgress } = {}) {
  const b = baseName(file.name), e = extOf(file.name);
  const one = (blob, ext) => [{ blob, name: `${b}.${ext}` }];
  switch (kind) {
    case 'pdf':
      if (['jpg', 'png', 'webp'].includes(target)) return pdfToImages(file, target, { quality, onProgress });
      if (target === 'txt') return one(T(await pdfToText(file)), 'txt');
      if (target === 'md') return one(T(await pdfToText(file), 'text/markdown'), 'md');
      if (target === 'split') return splitPdf(file);
      if (target === 'compress') return [{ blob: await compressPdf(file, Math.min(quality, 70)), name: `${b}_compressed.pdf` }];
      break;
    case 'word': {
      const html = await docxToHtml(file);
      if (target === 'html') return one(T(htmlDoc(html, b), 'text/html'), 'html');
      if (target === 'md') return one(T((await turndown()).turndown(html), 'text/markdown'), 'md');
      if (target === 'txt') return one(T(htmlToText(html)), 'txt');
      if (target === 'pdf') return one(await textToPdf((await turndown()).turndown(html), { markdown: true }), 'pdf');
      if (target === 'epub') return one(await makeEpub(b, html), 'epub');
      break;
    }
    case 'markdown': {
      const md = await readText(file);
      if (target === 'html') return one(T(htmlDoc(await (await marked())(md), b), 'text/html'), 'html');
      if (target === 'pdf') return one(await textToPdf(md, { markdown: true }), 'pdf');
      if (target === 'txt') return one(T(htmlToText(await (await marked())(md))), 'txt');
      if (target === 'epub') return one(await makeEpub(b, await (await marked())(md)), 'epub');
      break;
    }
    case 'html': {
      const html = await readText(file);
      if (target === 'md') return one(T((await turndown()).turndown(html), 'text/markdown'), 'md');
      if (target === 'txt') return one(T(htmlToText(html)), 'txt');
      if (target === 'pdf') return one(await textToPdf((await turndown()).turndown(html), { markdown: true }), 'pdf');
      if (target === 'epub') return one(await makeEpub(b, new DOMParser().parseFromString(html, 'text/html').body.innerHTML), 'epub');
      break;
    }
    case 'text': {
      let txt = await readText(file); if (e === 'rtf') txt = rtfToText(txt);
      if (target === 'pdf') return one(await textToPdf(txt), 'pdf');
      if (target === 'md') return one(T(txt, 'text/markdown'), 'md');
      if (target === 'html') return one(T(htmlDoc(`<pre style="white-space:pre-wrap;background:none">${escapeHtml(txt)}</pre>`, b), 'text/html'), 'html');
      if (target === 'epub') return one(await makeEpub(b, txt.split(/\n\n+/).map((p) => `<p>${escapeHtml(p)}</p>`).join('')), 'epub');
      break;
    }
    case 'data': return one(await convertData(file, target), target);
    case 'subs': return one(T(writeSubs(parseSubs(await readText(file), e), target)), target);
    case 'ebook': {
      const { html, title } = await epubToHtml(file);
      if (target === 'html') return one(T(htmlDoc(html, title), 'text/html'), 'html');
      if (target === 'txt') return one(T(htmlToText(html)), 'txt');
      if (target === 'md') return one(T((await turndown()).turndown(html), 'text/markdown'), 'md');
      if (target === 'pdf') return one(await textToPdf((await turndown()).turndown(html), { markdown: true }), 'pdf');
      break;
    }
    case 'archive':
      if (e === 'gz') return [{ blob: await gunzip(file), name: b }];
      return unzipFile(file);
  }
  throw new Error('Unsupported conversion');
}
