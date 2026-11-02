// Pixel pipeline for the Image editor + color analysis for Image→JSON
export const DEFAULT_ADJ = { exposure: 0, contrast: 0, highlights: 0, shadows: 0, saturation: 0, vibrance: 0, warmth: 0, tint: 0, fade: 0, vignette: 0, sharpen: 0, grain: 0, split: 0, levels: null };

export const FILTERS = {
  none: { label: 'Original' },
  vivid: { label: 'Vivid', contrast: 12, vibrance: 35, saturation: 10 },
  punch: { label: 'Punch', contrast: 28, saturation: 22, shadows: -10, sharpen: 25 },
  warm: { label: 'Golden', warmth: 28, vibrance: 12, exposure: 4 },
  cool: { label: 'Cool', warmth: -25, tint: -4, contrast: 6 },
  film: { label: 'Film', contrast: -8, fade: 22, warmth: 10, saturation: -12, grain: 18 },
  teal: { label: 'Cinematic', split: 40, contrast: 14, saturation: -6, vignette: 25 },
  fade: { label: 'Matte', fade: 35, contrast: -12, saturation: -15 },
  mono: { label: 'Mono', saturation: -100, contrast: 10 },
  noir: { label: 'Noir', saturation: -100, contrast: 45, vignette: 45, shadows: -20, grain: 12 },
  vintage: { label: 'Vintage', warmth: 22, fade: 25, saturation: -30, vignette: 30, tint: 6 },
  drama: { label: 'Drama', contrast: 35, highlights: -30, shadows: 25, vibrance: 20, vignette: 30, sharpen: 30 },
};

const clamp = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

export function applyAdjust(ctx, w, h, a) {
  const any = Object.entries(a).some(([k, v]) => k === 'levels' ? !!v : v);
  if (!any) return;
  const img = ctx.getImageData(0, 0, w, h), d = img.data;
  const exp = Math.pow(2, a.exposure / 50), con = 1 + a.contrast / 100, sat = 1 + a.saturation / 100, vib = a.vibrance / 100;
  const warm = a.warmth * 0.6, tint = a.tint * 0.5, fade = a.fade * 0.6, hi = a.highlights / 100, sh = a.shadows / 100, split = a.split / 100;
  const L = a.levels;
  // tone LUT for exposure/contrast/highlights/shadows/fade
  const lut = new Uint8ClampedArray(256);
  for (let i = 0; i < 256; i++) {
    let v = i / 255 * exp;
    v = (v - 0.5) * con + 0.5;
    if (hi) v += hi * 0.35 * Math.max(0, v - 0.5) * 2 * v;
    if (sh) v += sh * 0.35 * Math.max(0, 0.5 - v) * 2 * (1 - v);
    v = v * 255;
    v = fade + v * (1 - fade / 255);
    lut[i] = clamp(v);
  }
  const cx = w / 2, cy = h / 2, maxR = Math.hypot(cx, cy), vig = a.vignette / 100, grain = a.grain * 0.5;
  for (let y = 0, p = 0; y < h; y++) {
    const dy = (y - cy) / maxR;
    for (let x = 0; x < w; x++, p += 4) {
      let r = d[p], g = d[p + 1], b = d[p + 2];
      if (L) { r = (r - L[0][0]) * 255 / (L[0][1] - L[0][0] || 1); g = (g - L[1][0]) * 255 / (L[1][1] - L[1][0] || 1); b = (b - L[2][0]) * 255 / (L[2][1] - L[2][0] || 1); r = clamp(r); g = clamp(g); b = clamp(b); }
      r = lut[r | 0]; g = lut[g | 0]; b = lut[b | 0];
      r += warm; b -= warm; g += tint;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      if (sat !== 1 || vib) {
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), s = (mx - mn) / 255;
        const k = sat * (1 + vib * (1 - s));
        r = lum + (r - lum) * k; g = lum + (g - lum) * k; b = lum + (b - lum) * k;
      }
      if (split) { const t = lum / 255; r += split * 30 * (t - 0.5) * 2; g += split * 4 * (0.5 - t); b += split * 30 * (0.5 - t) * 2; }
      if (vig) { const dx = (x - cx) / maxR, rr = Math.sqrt(dx * dx + dy * dy); const f = 1 - vig * Math.max(0, rr - 0.35) * 1.6; r *= f; g *= f; b *= f; }
      if (grain) { const n = (Math.random() - 0.5) * grain; r += n; g += n; b += n; }
      d[p] = r; d[p + 1] = g; d[p + 2] = b;
    }
  }
  if (a.sharpen) sharpen(d, w, h, a.sharpen / 100);
  ctx.putImageData(img, 0, 0);
}

function sharpen(d, w, h, amt) {
  const src = new Uint8ClampedArray(d);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const p = (y * w + x) * 4;
    for (let c = 0; c < 3; c++) {
      const v = src[p + c] * 5 - src[p - 4 + c] - src[p + 4 + c] - src[p - w * 4 + c] - src[p + w * 4 + c];
      d[p + c] = src[p + c] + (v - src[p + c]) * amt;
    }
  }
}

export function autoLevels(ctx, w, h) {
  const d = ctx.getImageData(0, 0, w, h).data, hist = [new Uint32Array(256), new Uint32Array(256), new Uint32Array(256)];
  for (let i = 0; i < d.length; i += 16) { hist[0][d[i]]++; hist[1][d[i + 1]]++; hist[2][d[i + 2]]++; }
  const total = d.length / 16;
  return hist.map((hst) => { let a = 0, lo = 0, hi = 255; for (let i = 0; i < 256; i++) { a += hst[i]; if (a > total * 0.005) { lo = i; break; } } a = 0; for (let i = 255; i >= 0; i--) { a += hst[i]; if (a > total * 0.005) { hi = i; break; } } return [Math.min(lo, 60), Math.max(hi, 190)]; });
}

// ---------- Color analysis ----------
const NAMED = [['black', 0, 0, 0], ['charcoal', 54, 69, 79], ['gray', 128, 128, 128], ['silver', 192, 192, 192], ['white', 255, 255, 255], ['ivory', 255, 248, 231], ['beige', 222, 202, 168], ['tan', 210, 180, 140], ['brown', 120, 72, 40], ['chocolate', 74, 44, 28], ['maroon', 128, 0, 0], ['red', 220, 30, 40], ['crimson', 180, 20, 60], ['coral', 255, 127, 80], ['salmon', 250, 128, 114], ['orange', 255, 140, 0], ['amber', 255, 191, 0], ['gold', 212, 175, 55], ['yellow', 250, 220, 40], ['olive', 128, 128, 0], ['lime', 150, 220, 60], ['green', 40, 150, 60], ['forest green', 34, 85, 40], ['mint', 170, 240, 200], ['teal', 0, 128, 128], ['turquoise', 64, 224, 208], ['cyan', 0, 200, 230], ['sky blue', 135, 200, 235], ['blue', 30, 90, 220], ['navy', 20, 30, 90], ['indigo', 75, 0, 130], ['purple', 128, 50, 160], ['lavender', 200, 180, 240], ['magenta', 220, 40, 180], ['pink', 255, 170, 200], ['hot pink', 255, 80, 160], ['peach', 255, 210, 170], ['rose', 200, 90, 110], ['skin tone', 225, 180, 150], ['sand', 194, 178, 128]];
const hex = (r, g, b) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
const nameOf = (r, g, b) => NAMED.reduce((best, c) => { const dd = (r - c[1]) ** 2 * 0.3 + (g - c[2]) ** 2 * 0.59 + (b - c[3]) ** 2 * 0.11; return dd < best[1] ? [c[0], dd] : best; }, ['', Infinity])[0];

export function analyzeColors(canvas) {
  const S = 96, s = Math.min(1, S / Math.max(canvas.width, canvas.height));
  const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(canvas.width * s)); c.height = Math.max(1, Math.round(canvas.height * s));
  const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(canvas, 0, 0, c.width, c.height);
  const d = x.getImageData(0, 0, c.width, c.height).data;
  const px = []; let transparent = 0;
  for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 128) { transparent++; continue; } px.push([d[i], d[i + 1], d[i + 2]]); }
  if (!px.length) return null;
  // k-means (k=7) seeded by spread
  const k = Math.min(7, px.length);
  let cents = Array.from({ length: k }, (_, i) => [...px[Math.floor((i + 0.5) * px.length / k)]]);
  const assign = new Uint8Array(px.length);
  for (let it = 0; it < 10; it++) {
    const sums = cents.map(() => [0, 0, 0, 0]);
    px.forEach((p, i) => { let bi = 0, bd = Infinity; cents.forEach((cc, j) => { const dd = (p[0] - cc[0]) ** 2 + (p[1] - cc[1]) ** 2 + (p[2] - cc[2]) ** 2; if (dd < bd) { bd = dd; bi = j; } }); assign[i] = bi; const s2 = sums[bi]; s2[0] += p[0]; s2[1] += p[1]; s2[2] += p[2]; s2[3]++; });
    cents = sums.map((s2, j) => (s2[3] ? [s2[0] / s2[3], s2[1] / s2[3], s2[2] / s2[3]] : cents[j]));
  }
  const counts = new Array(k).fill(0); assign.forEach((a) => counts[a]++);
  const palette = cents.map((cc, i) => ({ hex: hex(...cc), rgb: cc.map(Math.round), name: nameOf(...cc), share: +(counts[i] / px.length).toFixed(3) }))
    .filter((p) => p.share > 0.01).sort((a, b) => b.share - a.share);
  // merge near-duplicates
  const merged = []; for (const p of palette) { const m = merged.find((q) => Math.hypot(q.rgb[0] - p.rgb[0], q.rgb[1] - p.rgb[1], q.rgb[2] - p.rgb[2]) < 22); if (m) m.share = +(m.share + p.share).toFixed(3); else merged.push(p); }
  let lum = 0, lum2 = 0, sat = 0, warm = 0, ar = 0, ag = 0, ab = 0;
  for (const [r, g, b] of px) { const l = 0.299 * r + 0.587 * g + 0.114 * b; lum += l; lum2 += l * l; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); sat += mx ? (mx - mn) / mx : 0; warm += r - b; ar += r; ag += g; ab += b; }
  const n = px.length; lum /= n; const std = Math.sqrt(lum2 / n - lum * lum); sat /= n; warm /= n;
  const brightness = +(lum / 255).toFixed(3);
  return {
    palette: merged,
    dominant: merged[0]?.hex, average: hex(ar / n, ag / n, ab / n),
    brightness, contrast: +(std / 128).toFixed(3), saturation: +sat.toFixed(3),
    temperature: warm > 18 ? 'warm' : warm < -12 ? 'cool' : 'neutral',
    tone: brightness < 0.3 ? 'dark / low-key' : brightness > 0.7 ? 'bright / high-key' : 'balanced mid-tones',
    colorfulness: sat < 0.12 ? 'near monochrome' : sat < 0.3 ? 'muted' : sat < 0.5 ? 'natural' : 'vivid',
    has_transparency: transparent > 0,
  };
}
