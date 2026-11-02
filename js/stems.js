// AI stem separation (HT-Demucs v4) fully on-device with onnxruntime-web.
const T = self.__csTest || {};
const MODEL_URL = T.stemModel || 'https://huggingface.co/timcsy/demucs-web-onnx/resolve/main/htdemucs_embedded.onnx';
const ORT_CDN = T.ortBase || 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.21.0/dist/';
let processor, loadingP;

async function fetchModel(onDownload) {
  const cache = await caches.open('ai-models-v1').catch(() => null);
  let res = cache && (await cache.match(MODEL_URL));
  if (res) return res.arrayBuffer();
  res = await fetch(MODEL_URL);
  if (!res.ok) throw new Error('Could not download the stem model (' + res.status + ')');
  const total = +res.headers.get('Content-Length') || 180_534_758;
  const reader = res.body.getReader(); const chunks = []; let got = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); got += value.length; onDownload?.(got, total); }
  const blob = new Blob(chunks);
  try { await cache?.put(MODEL_URL, new Response(blob, { headers: { 'Content-Type': 'application/octet-stream' } })); } catch {}
  return blob.arrayBuffer();
}

export async function isModelCached() {
  try { const c = await caches.open('ai-models-v1'); return !!(await c.match(MODEL_URL)); } catch { return false; }
}

export async function loadStems({ onDownload, onStatus } = {}) {
  if (processor) return processor;
  loadingP ??= (async () => {
    onStatus?.('Loading AI engine…');
    const { ort, DemucsProcessor } = await import('../vendor/demucs.mjs');
    ort.env.wasm.wasmPaths = ORT_CDN;
    ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1;
    const hasGPU = !!navigator.gpu && !!(await navigator.gpu.requestAdapter().catch(() => null));
    const p = new DemucsProcessor({ ort, sessionOptions: { executionProviders: hasGPU ? ['webgpu', 'wasm'] : ['wasm'], graphOptimizationLevel: 'basic' } });
    onStatus?.('Downloading stem model (180 MB, one time)…');
    const buf = await fetchModel(onDownload);
    onStatus?.('Starting model…');
    await p.loadModel(buf);
    processor = p; return p;
  })();
  try { return await loadingP; } catch (e) { loadingP = null; throw e; }
}

/** audioBuffer must be 44.1k. Returns {drums, bass, other, vocals}: each {left,right} */
export async function separate(audioBuffer, { onProgress, onDownload, onStatus } = {}) {
  const p = await loadStems({ onDownload, onStatus });
  p.onProgress = (info) => onProgress?.(info.progress ?? info);
  const L = audioBuffer.getChannelData(0), R = audioBuffer.numberOfChannels > 1 ? audioBuffer.getChannelData(1) : L;
  onStatus?.('Separating…');
  return p.separate(new Float32Array(L), new Float32Array(R));
}
