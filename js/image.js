// On-device image conversion. Decode (incl. HEIC) -> canvas -> encode.
const MAX_PIXELS = 16_000_000; // iOS Safari canvas limit is ~16.7MP

let heicLoaded;
function loadScript(src) {
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = src; s.onload = res; s.onerror = () => rej(new Error('Could not load ' + src));
    document.head.appendChild(s);
  });
}

export function isHeic(file) {
  return /image\/hei[cf]/i.test(file.type) || /\.(heic|heif)$/i.test(file.name);
}

async function decode(file) {
  // Safari (iPhone) decodes HEIC natively; Chrome/Edge on Windows does not.
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch (e) {
    if (!isHeic(file)) {
      // Fallback via <img> for formats createImageBitmap rejects (e.g. SVG)
      return await imgDecode(file);
    }
  }
  heicLoaded ??= loadScript('vendor/heic2any.min.js');
  await heicLoaded;
  let out = await window.heic2any({ blob: file, toType: 'image/png' });
  if (Array.isArray(out)) out = out[0];
  return await createImageBitmap(out);
}

function imgDecode(blob) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error('This file type can’t be read here')); };
    img.src = url;
  });
}

function fitSize(w, h, maxSide) {
  let s = 1;
  if (maxSide && Math.max(w, h) > maxSide) s = maxSide / Math.max(w, h);
  if (w * h * s * s > MAX_PIXELS) s = Math.sqrt(MAX_PIXELS / (w * h));
  return { w: Math.max(1, Math.round(w * s)), h: Math.max(1, Math.round(h * s)), scaled: s < 1 };
}

function toCanvas(bmp, maxSide, flatten) {
  const { w, h } = fitSize(bmp.width, bmp.height, maxSide);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  if (flatten) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(bmp, 0, 0, w, h);
  return c;
}

const canvasBlob = (c, type, q) => new Promise((res, rej) =>
  c.toBlob(b => b ? res(b) : rej(new Error('Encoding failed')), type, q));

// ---------- simple writers ----------
function bmpEncode(c) {
  const { width: w, height: h } = c;
  const px = c.getContext('2d').getImageData(0, 0, w, h).data;
  const rowSize = Math.ceil((24 * w) / 32) * 4, size = 54 + rowSize * h;
  const buf = new ArrayBuffer(size), v = new DataView(buf);
  v.setUint16(0, 0x4d42, true); v.setUint32(2, size, true); v.setUint32(10, 54, true);
  v.setUint32(14, 40, true); v.setInt32(18, w, true); v.setInt32(22, h, true);
  v.setUint16(26, 1, true); v.setUint16(28, 24, true); v.setUint32(34, rowSize * h, true);
  const u8 = new Uint8Array(buf);
  for (let y = 0; y < h; y++) {
    let o = 54 + (h - 1 - y) * rowSize;
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, a = px[i + 3] / 255;
      u8[o++] = px[i + 2] * a + 255 * (1 - a);
      u8[o++] = px[i + 1] * a + 255 * (1 - a);
      u8[o++] = px[i] * a + 255 * (1 - a);
    }
  }
  return new Blob([buf], { type: 'image/bmp' });
}

function tiffEncode(c) {
  const { width: w, height: h } = c;
  const px = c.getContext('2d').getImageData(0, 0, w, h).data;
  const n = 11, ifdSize = 2 + n * 12 + 4, dataOff = 8 + ifdSize, bpsOff = dataOff, imgOff = bpsOff + 8;
  const buf = new ArrayBuffer(imgOff + px.length), v = new DataView(buf);
  v.setUint16(0, 0x4949); v.setUint16(2, 42, true); v.setUint32(4, 8, true);
  let p = 8; v.setUint16(p, n, true); p += 2;
  const tag = (t, type, count, val) => { v.setUint16(p, t, true); v.setUint16(p + 2, type, true); v.setUint32(p + 4, count, true);
    if (type === 3 && count === 1) v.setUint16(p + 8, val, true); else v.setUint32(p + 8, val, true); p += 12; };
  tag(256, 4, 1, w); tag(257, 4, 1, h); tag(258, 3, 4, bpsOff); tag(259, 3, 1, 1); tag(262, 3, 1, 2);
  tag(273, 4, 1, imgOff); tag(277, 3, 1, 4); tag(278, 4, 1, h); tag(279, 4, 1, px.length); tag(284, 3, 1, 1); tag(338, 3, 1, 2);
  v.setUint32(p, 0, true);
  for (let i = 0; i < 4; i++) v.setUint16(bpsOff + i * 2, 8, true);
  new Uint8Array(buf, imgOff).set(px);
  return new Blob([buf], { type: 'image/tiff' });
}

async function icoEncode(bmp) {
  const c = toCanvas(bmp, 256, false);
  const png = new Uint8Array(await (await canvasBlob(c, 'image/png')).arrayBuffer());
  const head = new DataView(new ArrayBuffer(22));
  head.setUint16(2, 1, true); head.setUint16(4, 1, true);
  head.setUint8(6, c.width >= 256 ? 0 : c.width); head.setUint8(7, c.height >= 256 ? 0 : c.height);
  head.setUint16(10, 1, true); head.setUint16(12, 32, true);
  head.setUint32(14, png.length, true); head.setUint32(18, 22, true);
  return new Blob([head.buffer, png], { type: 'image/x-icon' });
}

async function svgEncode(c) {
  const png = await canvasBlob(c, 'image/png');
  const b64 = await new Promise(r => { const fr = new FileReader(); fr.onload = () => r(fr.result); fr.readAsDataURL(png); });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${c.width}" height="${c.height}" viewBox="0 0 ${c.width} ${c.height}"><image width="${c.width}" height="${c.height}" href="${b64}"/></svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}

async function gifEncode(c) {
  const { GIFEncoder, quantize, applyPalette } = await import('../vendor/gifenc.esm.js');
  const { data } = c.getContext('2d').getImageData(0, 0, c.width, c.height);
  const palette = quantize(data, 256);
  const index = applyPalette(data, palette);
  const gif = GIFEncoder();
  gif.writeFrame(index, c.width, c.height, { palette });
  gif.finish();
  return new Blob([gif.bytes()], { type: 'image/gif' });
}

async function webpEncode(c, q) {
  const native = await canvasBlob(c, 'image/webp', q / 100);
  if (native.type === 'image/webp') return native;
  const { default: encode } = await import('../vendor/jsquash/webp/encode.js');
  const img = c.getContext('2d').getImageData(0, 0, c.width, c.height);
  return new Blob([await encode(img, { quality: q })], { type: 'image/webp' });
}

async function avifEncode(c, q) {
  const { default: encode } = await import('../vendor/jsquash/avif/encode.js');
  const img = c.getContext('2d').getImageData(0, 0, c.width, c.height);
  return new Blob([await encode(img, { quality: q, speed: 8 })], { type: 'image/avif' });
}

// ---------- PDF (JPEG pages) ----------
export async function pdfFromCanvases(pages) {
  // pages: [{canvas, q}]
  const enc = new TextEncoder();
  const parts = []; const offsets = []; let len = 0;
  const push = (x) => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; };
  push('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  const nPages = pages.length;
  // objects: 1 catalog, 2 pages, then per page: page, content, image
  const kids = pages.map((_, i) => `${3 + i * 3} 0 R`).join(' ');
  offsets[1] = len; push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n');
  offsets[2] = len; push(`2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${nPages} >>\nendobj\n`);
  for (let i = 0; i < nPages; i++) {
    const { canvas, q } = pages[i];
    const jpg = new Uint8Array(await (await canvasBlob(canvas, 'image/jpeg', q / 100)).arrayBuffer());
    const w = canvas.width, h = canvas.height;
    // Fit to points (72dpi), cap page at 14400pt
    const s = Math.min(1, 14400 / Math.max(w, h));
    const pw = (w * s).toFixed(2), ph = (h * s).toFixed(2);
    const pageN = 3 + i * 3, contN = pageN + 1, imgN = pageN + 2;
    const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
    offsets[pageN] = len; push(`${pageN} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 ${imgN} 0 R >> >> /Contents ${contN} 0 R >>\nendobj\n`);
    offsets[contN] = len; push(`${contN} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`);
    offsets[imgN] = len; push(`${imgN} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${w} /Height ${h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
    push(jpg); push('\nendstream\nendobj\n');
  }
  const total = 3 + nPages * 3;
  const xref = len;
  let x = `xref\n0 ${total}\n0000000000 65535 f \n`;
  for (let i = 1; i < total; i++) x += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  push(x + `trailer\n<< /Size ${total} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  return new Blob(parts, { type: 'application/pdf' });
}

export const IMAGE_TARGETS = ['jpg', 'png', 'webp', 'avif', 'gif', 'tiff', 'bmp', 'ico', 'pdf', 'svg'];

export async function prepareCanvas(file, { maxSide = 0, flatten = false } = {}) {
  const bmp = await decode(file);
  const c = toCanvas(bmp, maxSide, flatten);
  const scaled = fitSize(bmp.width, bmp.height, maxSide).scaled && !maxSide;
  bmp.close?.();
  return { canvas: c, autoScaled: scaled };
}

export async function convertImage(file, target, { quality = 85, maxSide = 0 } = {}) {
  if (target === 'ico') {
    const bmp = await decode(file); const b = await icoEncode(bmp); bmp.close?.(); return { blob: b };
  }
  const flatten = ['jpg', 'bmp', 'pdf'].includes(target);
  const { canvas: c, autoScaled } = await prepareCanvas(file, { maxSide, flatten });
  let blob;
  switch (target) {
    case 'jpg': blob = await canvasBlob(c, 'image/jpeg', quality / 100); break;
    case 'png': blob = await canvasBlob(c, 'image/png'); break;
    case 'webp': blob = await webpEncode(c, quality); break;
    case 'avif': blob = await avifEncode(c, quality); break;
    case 'gif': blob = await gifEncode(c); break;
    case 'tiff': blob = tiffEncode(c); break;
    case 'bmp': blob = bmpEncode(c); break;
    case 'svg': blob = await svgEncode(c); break;
    case 'pdf': blob = await pdfFromCanvases([{ canvas: c, q: quality }]); break;
    default: throw new Error('Unsupported format');
  }
  c.width = c.height = 0; // free memory on iOS
  return { blob, autoScaled };
}
