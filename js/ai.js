// Bring-your-own-key AI calls straight from the device (keys never leave the phone except to the provider).
export const PROVIDERS = {
  gemini: { name: 'Gemini', model: 'gemini-2.5-flash', keyUrl: 'https://aistudio.google.com/apikey' },
  anthropic: { name: 'Claude', model: 'claude-sonnet-4-5', keyUrl: 'https://console.anthropic.com/settings/keys' },
  openai: { name: 'ChatGPT', model: 'gpt-4.1-mini', keyUrl: 'https://platform.openai.com/api-keys' },
  xai: { name: 'Grok', model: 'grok-4', keyUrl: 'https://console.x.ai' },
};
const LS = 'cs.ai.v1';
export function getAI() { try { return JSON.parse(localStorage.getItem(LS)) || { provider: 'gemini', keys: {}, models: {} }; } catch { return { provider: 'gemini', keys: {}, models: {} }; } }
export function setAI(v) { localStorage.setItem(LS, JSON.stringify(v)); }
export function activeProvider() { const a = getAI(); const p = a.keys[a.provider] ? a.provider : Object.keys(PROVIDERS).find((k) => a.keys[k]); return p ? { id: p, key: a.keys[p], model: a.models[p] || PROVIDERS[p].model } : null; }

function parseJSON(text) {
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { return JSON.parse(t); } catch { const m = t.match(/\{[\s\S]*\}/); if (m) return JSON.parse(m[0]); throw new Error('The AI reply wasn’t valid JSON'); }
}

async function post(url, headers, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
  const txt = await r.text();
  if (!r.ok) { let msg = txt; try { const j = JSON.parse(txt); msg = j.error?.message || j.message || txt; } catch {} throw new Error(`${r.status}: ${String(msg).slice(0, 200)}`); }
  return JSON.parse(txt);
}

/** image: {data (base64, no prefix), mime} optional. Returns string (or object when json=true). */
export async function ask({ system = '', prompt, image = null, json = false, maxTokens = 2500 }) {
  const p = activeProvider();
  if (!p) throw new Error('Add an AI key in Settings first (Gemini has a free tier).');
  let text;
  if (p.id === 'gemini') {
    const parts = [{ text: prompt }]; if (image) parts.push({ inline_data: { mime_type: image.mime, data: image.data } });
    const r = await post(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(p.model)}:generateContent?key=${encodeURIComponent(p.key)}`, {},
      { ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}), contents: [{ role: 'user', parts }], generationConfig: { maxOutputTokens: maxTokens, ...(json ? { responseMimeType: 'application/json' } : {}) } });
    text = r.candidates?.[0]?.content?.parts?.map((x) => x.text || '').join('') || '';
  } else if (p.id === 'anthropic') {
    const content = []; if (image) content.push({ type: 'image', source: { type: 'base64', media_type: image.mime, data: image.data } }); content.push({ type: 'text', text: prompt + (json ? '\n\nReply with only the JSON object.' : '') });
    const r = await post('https://api.anthropic.com/v1/messages', { 'x-api-key': p.key, 'anthropic-version': '2023-06-01', 'anthropic-dangerous-direct-browser-access': 'true' },
      { model: p.model, max_tokens: maxTokens, ...(system ? { system } : {}), messages: [{ role: 'user', content }] });
    text = r.content?.map((x) => x.text || '').join('') || '';
  } else {
    const url = p.id === 'xai' ? 'https://api.x.ai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
    const content = [{ type: 'text', text: prompt }]; if (image) content.push({ type: 'image_url', image_url: { url: `data:${image.mime};base64,${image.data}` } });
    const r = await post(url, { Authorization: `Bearer ${p.key}` },
      { model: p.model, max_tokens: maxTokens, messages: [...(system ? [{ role: 'system', content: system }] : []), { role: 'user', content }], ...(json ? { response_format: { type: 'json_object' } } : {}) });
    text = r.choices?.[0]?.message?.content || '';
  }
  return json ? parseJSON(text) : text.trim();
}

export async function canvasToB64(canvas, maxSide = 1280) {
  const s = Math.min(1, maxSide / Math.max(canvas.width, canvas.height));
  const c = document.createElement('canvas'); c.width = Math.round(canvas.width * s); c.height = Math.round(canvas.height * s);
  const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(canvas, 0, 0, c.width, c.height);
  const url = c.toDataURL('image/jpeg', 0.85);
  return { mime: 'image/jpeg', data: url.split(',')[1] };
}
