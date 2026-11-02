// On-device audio/video engine: ffmpeg.wasm single-thread core (works on GitHub Pages, no special headers).
let ff, loading, logBuf = [];
let progressCb = () => {};

export async function getFF(onStatus) {
  if (ff) return ff;
  if (!loading) {
    loading = (async () => {
      onStatus?.('Loading the audio/video engine (first time only, ~32 MB)…');
      const { FFmpeg } = await import('../vendor/ffmpeg/index.js');
      const inst = new FFmpeg();
      inst.on('progress', ({ progress }) => progressCb(Math.max(0, Math.min(1, progress))));
      inst.on('log', ({ message }) => { logBuf.push(message); if (logBuf.length > 400) logBuf.shift(); });
      const base = new URL('../vendor/ffmpeg-core/', import.meta.url).href;
      await inst.load({ coreURL: base + 'ffmpeg-core.js', wasmURL: base + 'ffmpeg-core.wasm' });
      ff = inst;
      return inst;
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

// One job at a time
let queue = Promise.resolve();
function enqueue(fn) { const job = queue.then(fn); queue = job.catch(() => {}); return job; }

let seq = 0;
const safeExt = (name) => ((name.match(/\.([^.]+)$/)?.[1] || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '') || 'bin');

/** Run ffmpeg on one input file. args: array after -i input. Returns Uint8Array of output. */
function resetFF() { try { ff?.terminate(); } catch {} ff = null; loading = null; }
const isCrash = (e) => /RuntimeError|memory access|Aborted|unreachable|terminated|out of memory/i.test(String(e?.message || e));

export function runFF(file, args, outExt, opts = {}) {
  return enqueue(async () => {
    try { return await runOnce(file, args, outExt, opts); }
    catch (e) {
      if (!isCrash(e)) throw e;
      resetFF(); // engine crashed: restart it and retry once
      try { return await runOnce(file, args, outExt, opts); }
      catch (e2) { if (isCrash(e2)) { resetFF(); throw new Error('The engine ran out of memory on this file. Try a shorter clip, a lower resolution, or use your laptop.'); } throw e2; }
    }
  });
}
async function runOnce(file, args, outExt, { onProgress, onStatus, pre = [], extraFiles = [] } = {}) {
  {
    const inst = await getFF(onStatus);
    progressCb = onProgress || (() => {});
    const id = ++seq;
    const inName = `in${id}.${safeExt(file.name || 'x.bin')}`, outName = `out${id}.${outExt}`;
    await inst.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
    for (const f of extraFiles) await inst.writeFile(f.name, f.data);
    logBuf = [];
    try {
      onStatus?.('Working…');
      const code = await inst.exec([...pre, '-i', inName, ...args, '-y', outName]);
      if (code !== 0) {
        const tail = logBuf.slice(-6).join(' ').slice(0, 220);
        throw new Error('Conversion failed on-device. ' + (tail.includes('Invalid data') ? 'The file looks damaged or unsupported.' : tail ? 'Details: ' + tail : ''));
      }
      const data = await inst.readFile(outName);
      return data;
    } finally {
      try { await inst.deleteFile(inName); } catch {}
      try { await inst.deleteFile(outName); } catch {}
      for (const f of extraFiles) { try { await inst.deleteFile(f.name); } catch {} }
    }
  }
}

/** Probe duration (seconds) and whether a video stream exists, using ffmpeg's log */
export function probe(file) {
  return enqueue(async () => {
    const inst = await getFF();
    const id = ++seq, inName = `p${id}.${safeExt(file.name)}`;
    await inst.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
    logBuf = [];
    try { await inst.exec(['-hide_banner', '-i', inName]); } catch {}
    try { await inst.deleteFile(inName); } catch {}
    const log = logBuf.join('\n');
    const m = log.match(/Duration: (\d+):(\d+):([\d.]+)/);
    const dur = m ? +m[1] * 3600 + +m[2] * 60 + +m[3] : 0;
    const v = log.match(/Video: .*?, (\d{2,5})x(\d{2,5})/);
    return { duration: dur, hasVideo: !!v, width: v ? +v[1] : 0, height: v ? +v[2] : 0, log };
  });
}

export const AUDIO_TARGETS = ['mp3', 'wav', 'm4a', 'aac', 'flac', 'alac', 'ogg', 'opus', 'aiff', 'm4r', 'wma', 'ac3', 'mp2', 'caf', 'wv'];
export const VIDEO_TARGETS = ['mp4', 'mov', 'prores', 'mkv', 'webm', 'avi', 'm4v', 'wmv', 'flv', 'mpg', 'ts', '3gp', 'ogv', 'gif', 'webp', 'apng', 'frames', 'mp3', 'wav', 'm4a'];
export const VIDEO_LABELS = { hevc: 'MP4 HEVC', prores: 'MOV ProRes', frames: 'JPG frames', webp: 'WebP anim', apng: 'APNG' };
export const AUDIO_LABELS = { alac: 'ALAC (lossless m4a)', m4r: 'M4R ringtone', wv: 'WavPack' };

const MIME = { mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', aac: 'audio/aac', flac: 'audio/flac', ogg: 'audio/ogg', opus: 'audio/ogg',
  aiff: 'audio/aiff', m4r: 'audio/mp4', wma: 'audio/x-ms-wma', ac3: 'audio/ac3', mp2: 'audio/mpeg', caf: 'audio/x-caf', wv: 'audio/wavpack',
  mp4: 'video/mp4', mov: 'video/quicktime', mkv: 'video/x-matroska', webm: 'video/webm', avi: 'video/x-msvideo', m4v: 'video/x-m4v',
  wmv: 'video/x-ms-wmv', flv: 'video/x-flv', mpg: 'video/mpeg', ts: 'video/mp2t', '3gp': 'video/3gpp', ogv: 'video/ogg', gif: 'image/gif',
  webp: 'image/webp', apng: 'image/apng', png: 'image/png', zip: 'application/zip' };

export const outExt = (t) => ({ hevc: 'mp4', prores: 'mov', alac: 'm4a', apng: 'png' }[t] || t);

// Social & quality presets
export const PRESETS = {
  none: { label: 'No preset' },
  tiktok: { label: 'TikTok / Reels / Shorts 9:16', vf: "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1", fps: 30 },
  tiktokfit: { label: '9:16 with blurred bars', complex: "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:5[bg];[0:v]scale=1080:1920:force_original_aspect_ratio=decrease[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[v]", fps: 30 },
  square: { label: 'Instagram square 1:1', vf: "scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080,setsar=1" },
  portrait: { label: 'Instagram feed 4:5', vf: "scale=1080:1350:force_original_aspect_ratio=increase,crop=1080:1350,setsar=1" },
  youtube: { label: 'YouTube 1080p 16:9', vf: "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2,setsar=1" },
};

function scaleFilter(res) { return res ? `scale=-2:'min(${res},ih)'` : null; }

export function avArgs(target, o = {}) {
  const abr = o.abr || '192k';
  const crf = String(o.crf ?? 23);
  const vfParts = [];
  const pre = o.preset && PRESETS[o.preset] ? PRESETS[o.preset] : null;
  let complex = null;
  if (pre?.complex) complex = pre.complex;
  else if (pre?.vf) vfParts.push(pre.vf);
  else if (o.res) vfParts.push(scaleFilter(o.res));
  if (o.fps) vfParts.push(`fps=${o.fps}`); else if (pre?.fps) vfParts.push(`fps=${pre.fps}`);
  if (o.speed && o.speed !== 1) vfParts.push(`setpts=PTS/${o.speed}`);
  const vf = vfParts.length ? ['-vf', vfParts.join(',')] : [];
  const vmap = complex ? ['-filter_complex', complex + (vfParts.length ? '' : ''), '-map', '[v]', '-map', '0:a?'] : vf;
  const af = [];
  if (o.speed && o.speed !== 1) af.push(atempoChain(o.speed));
  if (o.mute) af.push(null);
  const aargs = o.mute ? ['-an'] : af.length ? ['-af', af.join(',')] : [];
  const trim = [...(o.start ? ['-ss', String(o.start)] : []), ...(o.end ? ['-to', String(o.end)] : [])];
  const vbr = o.vbitrate ? ['-b:v', o.vbitrate, '-maxrate', o.vbitrate, '-bufsize', o.vbitrate] : null;
  const x264 = (pf = 'yuv420p') => ['-c:v', 'libx264', '-preset', o.fast === false ? 'veryfast' : 'ultrafast', ...(vbr || ['-crf', crf]), '-pix_fmt', pf];
  switch (target) {
    // ---- audio ----
    case 'mp3': return [...trim, '-vn', ...aargs, '-c:a', 'libmp3lame', '-b:a', abr];
    case 'wav': return [...trim, '-vn', ...aargs, '-c:a', o.bits === 24 ? 'pcm_s24le' : 'pcm_s16le'];
    case 'm4a': return [...trim, '-vn', ...aargs, '-c:a', 'aac', '-b:a', abr];
    case 'aac': return [...trim, '-vn', ...aargs, '-c:a', 'aac', '-b:a', abr, '-f', 'adts'];
    case 'flac': return [...trim, '-vn', ...aargs, '-c:a', 'flac'];
    case 'alac': return [...trim, '-vn', ...aargs, '-c:a', 'alac'];
    case 'ogg': return [...trim, '-vn', ...aargs, '-c:a', 'libvorbis', '-b:a', abr];
    case 'opus': return [...trim, '-vn', ...aargs, '-c:a', 'opus', '-strict', '-2', '-b:a', abr, '-ar', '48000', '-ac', '2', '-f', 'ogg'];
    case 'aiff': return [...trim, '-vn', ...aargs, '-c:a', 'pcm_s16be'];
    case 'm4r': return [...(o.start ? ['-ss', String(o.start)] : []), '-t', String(Math.min(40, o.end ? o.end - (o.start || 0) : 40)), '-vn', ...aargs, '-c:a', 'aac', '-b:a', abr, '-f', 'ipod'];
    case 'wma': return [...trim, '-vn', ...aargs, '-c:a', 'wmav2', '-b:a', abr, '-f', 'asf'];
    case 'ac3': return [...trim, '-vn', ...aargs, '-c:a', 'ac3', '-b:a', '384k'];
    case 'mp2': return [...trim, '-vn', ...aargs, '-c:a', 'mp2', '-b:a', abr];
    case 'caf': return [...trim, '-vn', ...aargs, '-c:a', 'pcm_s16le', '-f', 'caf'];
    case 'wv': return [...trim, '-vn', ...aargs, '-c:a', 'wavpack'];
    // ---- video ----
    case 'mp4': case 'm4v': return [...trim, ...vmap, ...x264(), ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', abr]), '-movflags', '+faststart'];
    case 'mov': return [...trim, ...vmap, ...x264(), ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', abr]), '-movflags', '+faststart'];
    case 'hevc': return [...trim, ...vmap, '-c:v', 'libx265', '-preset', 'ultrafast', ...(vbr || ['-crf', String((+crf) + 5)]), '-pix_fmt', 'yuv420p', '-tag:v', 'hvc1', ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', abr]), '-movflags', '+faststart'];
    case 'prores': return [...trim, ...vmap, '-c:v', 'prores_ks', '-profile:v', '2', '-pix_fmt', 'yuv422p10le', ...aargs, ...(o.mute ? [] : ['-c:a', 'pcm_s16le'])];
    case 'mkv': return [...trim, ...vmap, ...x264(), ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', abr])];
    case 'webm': return [...trim, ...vmap, '-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', ...(vbr || ['-b:v', '2M', '-crf', '10']), ...aargs, ...(o.mute ? [] : ['-c:a', 'libvorbis', '-b:a', abr])];
    case 'avi': return [...trim, ...vmap, '-c:v', 'mpeg4', '-q:v', '4', ...aargs, ...(o.mute ? [] : ['-c:a', 'libmp3lame', '-b:a', abr])];
    case 'wmv': return [...trim, ...vmap, '-c:v', 'wmv2', '-q:v', '4', ...aargs, ...(o.mute ? [] : ['-c:a', 'wmav2', '-b:a', abr])];
    case 'flv': return [...trim, ...vmap, ...x264(), ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', abr, '-ar', '44100'])];
    case 'mpg': return [...trim, ...vmap, '-c:v', 'mpeg2video', '-q:v', '4', ...aargs, ...(o.mute ? [] : ['-c:a', 'mp2', '-b:a', abr])];
    case 'ts': return [...trim, ...vmap, ...x264(), ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', abr]), '-f', 'mpegts'];
    case '3gp': return [...trim, '-vf', [...vfParts.filter(Boolean), "scale='min(640,iw)':-2"].join(','), ...x264(), '-profile:v', 'baseline', ...aargs, ...(o.mute ? [] : ['-c:a', 'aac', '-b:a', '96k', '-ac', '1'])];
    case 'ogv': return [...trim, ...vmap, '-c:v', 'libtheora', '-q:v', '7', ...aargs, ...(o.mute ? [] : ['-c:a', 'libvorbis', '-b:a', abr])];
    case 'gif': {
      const base = [...vfParts.filter(Boolean)]; if (!o.res && !pre) base.push("scale='min(480,iw)':-2:flags=lanczos");
      if (!o.fps) base.push('fps=12');
      return [...trim, '-filter_complex', `[0:v]${base.join(',')},split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=3`, '-loop', '0'];
    }
    case 'webp': { const base = [...vfParts.filter(Boolean)]; if (!o.res && !pre) base.push("scale='min(720,iw)':-2"); if (!o.fps) base.push('fps=15');
      return [...trim, '-vf', base.join(','), '-c:v', 'libwebp_anim', '-quality', '75', '-loop', '0', '-an']; }
    case 'apng': { const base = [...vfParts.filter(Boolean)]; if (!o.res && !pre) base.push("scale='min(480,iw)':-2"); if (!o.fps) base.push('fps=12');
      return [...trim, '-vf', base.join(','), '-plays', '0', '-f', 'apng', '-an']; }
    default: throw new Error('Unsupported format: ' + target);
  }
}

export function atempoChain(speed) {
  const parts = []; let s = speed;
  while (s > 2) { parts.push('atempo=2'); s /= 2; }
  while (s < 0.5) { parts.push('atempo=0.5'); s /= 0.5; }
  parts.push(`atempo=${s.toFixed(4)}`);
  return parts.join(',');
}

export async function convertAV(file, target, opts = {}, onProgress, onStatus) {
  if (target === 'frames') return extractFrames(file, opts, onProgress, onStatus);
  let args = avArgs(target, opts);
  // Fit-under-size: compute bitrate from duration
  if (opts.maxMB && !['gif', 'webp', 'apng'].includes(target)) {
    const { duration } = await probe(file);
    const dur = Math.max(1, (opts.end || duration) - (opts.start || 0));
    const isAudio = AUDIO_TARGETS.includes(target);
    const totalKbps = Math.floor((opts.maxMB * 8 * 1000 * 0.94) / dur);
    if (isAudio) {
      const k = Math.max(32, Math.min(320, totalKbps));
      args = avArgs(target, { ...opts, abr: k + 'k' });
    } else {
      const a = opts.mute ? 0 : Math.min(128, Math.max(48, Math.floor(totalKbps * 0.12)));
      const v = Math.max(80, totalKbps - a);
      args = avArgs(target, { ...opts, abr: (a || 64) + 'k', vbitrate: v + 'k' });
    }
  }
  const data = await runFF(file, args, outExt(target), { onProgress, onStatus });
  return { blob: new Blob([data.buffer], { type: MIME[outExt(target)] || 'application/octet-stream' }) };
}

async function extractFrames(file, opts, onProgress, onStatus) {
  // Every N seconds -> JPGs, zipped. Done in one ffmpeg run into a numbered sequence.
  const inst = await getFF(onStatus);
  return enqueue(async () => {
    progressCb = onProgress || (() => {});
    const id = ++seq, inName = `f${id}.${safeExt(file.name)}`;
    await inst.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
    const every = opts.frameEvery || 1;
    const vf = [`fps=1/${every}`]; if (opts.res) vf.push(scaleFilter(opts.res));
    const code = await inst.exec(['-i', inName, '-vf', vf.join(','), '-q:v', '3', '-frames:v', '600', `fr${id}_%04d.jpg`]);
    if (code !== 0) throw new Error('Could not extract frames');
    const list = (await inst.listDir('/')).filter((e) => e.name.startsWith(`fr${id}_`));
    const { loadScript } = await import('./ui.js');
    await loadScript('vendor/jszip.min.js');
    const zip = new window.JSZip();
    for (const e of list) { zip.file(e.name.replace(`fr${id}_`, 'frame_'), await inst.readFile(e.name)); await inst.deleteFile(e.name); }
    await inst.deleteFile(inName);
    return { blob: await zip.generateAsync({ type: 'blob' }), ext: 'zip', count: list.length };
  });
}

export async function ffmpegToWav(file, rate = 44100) {
  const data = await runFF(file, ['-vn', '-ac', '2', '-ar', String(rate), '-c:a', 'pcm_s16le'], 'wav');
  return new Blob([data.buffer], { type: 'audio/wav' });
}

// ---- Audio studio effect chain ----
export function audioFilterChain(fx) {
  const f = [];
  if (fx.denoise) f.push('highpass=f=70', `afftdn=nr=${fx.denoise}:nf=-40:tn=1`);
  if (fx.hum) f.push('bandreject=f=60:width_type=q:w=8', 'bandreject=f=120:width_type=q:w=8');
  if (fx.voice) f.push('highpass=f=90', 'equalizer=f=3000:t=q:w=1.2:g=3', 'deesser=i=0.4', 'acompressor=threshold=-20dB:ratio=3:attack=10:release=120');
  if (fx.bass) f.push(`bass=g=${fx.bass}:f=100`);
  if (fx.treble) f.push(`treble=g=${fx.treble}:f=6000`);
  if (fx.pitch) { const r = Math.pow(2, fx.pitch / 12); f.push(`asetrate=44100*${r.toFixed(5)}`, 'aresample=44100', atempoChain(1 / r)); }
  if (fx.speed && fx.speed !== 1) f.push(atempoChain(fx.speed));
  if (fx.reverb) f.push(`aecho=0.8:0.85:${[40, 70, 110].map((x) => Math.round(x * fx.reverb)).join('|')}:${[0.4, 0.3, 0.2].map((x) => (x * Math.min(1, fx.reverb)).toFixed(2)).join('|')}`);
  if (fx.silence) f.push('silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_duration=0.6:stop_threshold=-45dB');
  if (fx.mono) f.push('pan=mono|c0=0.5*c0+0.5*c1');
  if (fx.karaoke) f.push('pan=stereo|c0=c0-c1|c1=c1-c0', 'highpass=f=120');
  if (fx.reverse) f.push('areverse');
  if (fx.gain) f.push(`volume=${fx.gain}dB`);
  if (fx.fadeIn) f.push(`afade=t=in:st=0:d=${fx.fadeIn}`);
  if (fx.fadeOut && fx.duration) f.push(`afade=t=out:st=${Math.max(0, fx.duration - fx.fadeOut).toFixed(2)}:d=${fx.fadeOut}`);
  if (fx.normalize) f.push(`loudnorm=I=${fx.normalize}:TP=-1.0:LRA=11`);
  f.push('alimiter=limit=0.98');
  return f.join(',');
}

export async function processAudio(file, fx, target, { abr = '320k', onProgress, onStatus } = {}) {
  const trim = [...(fx.start ? ['-ss', String(fx.start)] : []), ...(fx.end ? ['-to', String(fx.end)] : [])];
  const chain = audioFilterChain({ ...fx, duration: (fx.end || fx.total) - (fx.start || 0) });
  const base = avArgs(target, { abr }).filter((x, i, a) => !(x === '-vn'));
  const data = await runFF(file, ['-vn', '-af', chain, ...base], outExt(target), { onProgress, onStatus, pre: trim });
  return new Blob([data.buffer], { type: MIME[outExt(target)] || 'application/octet-stream' });
}
