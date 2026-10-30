// On-device audio/video conversion with ffmpeg.wasm (single-thread core, no special headers needed).
let ff, loading;
let progressCb = () => {};

async function getFF(onStatus) {
  if (ff) return ff;
  if (!loading) {
    loading = (async () => {
      onStatus?.('Loading the audio/video engine (first time only, ~32 MB)…');
      const { FFmpeg } = await import('../vendor/ffmpeg/index.js');
      const inst = new FFmpeg();
      inst.on('progress', ({ progress }) => progressCb(Math.max(0, Math.min(1, progress))));
      const base = new URL('../vendor/ffmpeg-core/', import.meta.url).href;
      await inst.load({ coreURL: base + 'ffmpeg-core.js', wasmURL: base + 'ffmpeg-core.wasm' });
      ff = inst;
      return inst;
    })();
    loading.catch(() => { loading = null; });
  }
  return loading;
}

export const AUDIO_TARGETS = ['mp3', 'wav', 'm4a', 'flac', 'ogg', 'opus'];
export const VIDEO_TARGETS = ['mp4', 'mov', 'webm', 'gif', 'mp3', 'wav', 'm4a'];

const MIME = { mp3: 'audio/mpeg', wav: 'audio/wav', m4a: 'audio/mp4', flac: 'audio/flac', ogg: 'audio/ogg', opus: 'audio/ogg',
  mp4: 'video/mp4', mov: 'video/quicktime', webm: 'video/webm', gif: 'image/gif' };

function argsFor(target, { abr = '192k', res = 0, isVideo }) {
  const scale = res ? ['-vf', `scale=-2:'min(${res},ih)'`] : [];
  switch (target) {
    case 'mp3': return ['-vn', '-c:a', 'libmp3lame', '-b:a', abr];
    case 'wav': return ['-vn', '-c:a', 'pcm_s16le'];
    case 'm4a': return ['-vn', '-c:a', 'aac', '-b:a', abr];
    case 'flac': return ['-vn', '-c:a', 'flac'];
    case 'ogg': return ['-vn', '-c:a', 'libvorbis', '-b:a', abr];
    case 'opus': return ['-vn', '-c:a', 'libopus', '-b:a', abr];
    case 'mp4':
    case 'mov': return [...scale, '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '23', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', abr, '-movflags', '+faststart'];
    case 'webm': return [...scale, '-c:v', 'libvpx', '-deadline', 'realtime', '-cpu-used', '8', '-b:v', '2M', '-c:a', 'libvorbis', '-b:a', abr];
    case 'gif': return ['-vf', `fps=12,scale=${res ? `-2:'min(${res},ih)'` : "'min(480,iw)':-2"}:flags=lanczos`, '-loop', '0'];
    default: throw new Error('Unsupported format');
  }
}

let queue = Promise.resolve();
export function convertAV(file, target, opts, onProgress, onStatus) {
  // ffmpeg runs one job at a time
  const job = queue.then(() => run(file, target, opts, onProgress, onStatus));
  queue = job.catch(() => {});
  return job;
}

async function run(file, target, opts, onProgress, onStatus) {
  const inst = await getFF(onStatus);
  progressCb = onProgress || (() => {});
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const inName = `in_${Date.now()}.${ext}`, outName = `out_${Date.now()}.${target}`;
  await inst.writeFile(inName, new Uint8Array(await file.arrayBuffer()));
  try {
    const code = await inst.exec(['-i', inName, ...argsFor(target, opts), '-y', outName]);
    if (code !== 0) throw new Error('Conversion failed. This file or format combo isn’t supported on-device.');
    const data = await inst.readFile(outName);
    return { blob: new Blob([data.buffer], { type: MIME[target] || 'application/octet-stream' }) };
  } finally {
    try { await inst.deleteFile(inName); } catch {}
    try { await inst.deleteFile(outName); } catch {}
  }
}
