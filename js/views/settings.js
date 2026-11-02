import { h, toast, select } from '../ui.js';
import { PROVIDERS, getAI, setAI, ask } from '../ai.js';

export function mount(root) {
  const ai = getAI();
  const status = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const rows = Object.entries(PROVIDERS).map(([id, p]) => {
    const key = h('input', { type: 'password', autocomplete: 'off', placeholder: 'Paste API key', value: ai.keys[id] || '', 'aria-label': `${p.name} API key` });
    const model = h('input', { type: 'text', value: ai.models[id] || p.model, 'aria-label': `${p.name} model` });
    key.addEventListener('change', () => { ai.keys[id] = key.value.trim(); if (key.value.trim() && !ai.keys[ai.provider]) ai.provider = id; setAI(ai); provSel.sel.value = ai.provider; toast(`${p.name} key saved on this device`); });
    model.addEventListener('change', () => { ai.models[id] = model.value.trim(); setAI(ai); });
    return h('div', { class: 'keyrow' }, h('div', { class: 'row between' }, h('b', {}, p.name), h('a', { href: p.keyUrl, target: '_blank', rel: 'noopener' }, 'Get a key')),
      h('label', { class: 'field wide' }, h('span', {}, 'API key'), key), h('label', { class: 'field wide' }, h('span', {}, 'Model'), model));
  });
  const provSel = select('Use this AI by default', Object.entries(PROVIDERS).map(([k, p]) => [k, p.name]), ai.provider, (v) => { ai.provider = v; setAI(ai); });
  root.append(
    h('div', { class: 'card' }, h('h2', {}, 'AI keys'), h('p', { class: 'muted small' }, 'Used for Image → JSON and the .md generator. Keys stay in this browser on this device and go only to the AI company you pick. Gemini has a free tier.'), provSel, ...rows,
      h('button', { class: 'ghost', onclick: async () => { status.textContent = 'Testing…'; try { const r = await ask({ prompt: 'Reply with the single word: ready' }); status.textContent = 'Works: ' + r.slice(0, 40); } catch (e) { status.textContent = e.message; } } }, 'Test connection'), status),
    h('div', { class: 'card' }, h('h2', {}, 'Storage'), h('p', { class: 'muted small' }, 'The app saves its engines and AI models on your device after first use so it works offline.'),
      h('button', { class: 'ghost', onclick: async () => { const ks = await caches.keys(); await Promise.all(ks.filter((k) => k.startsWith('vendor') || k.startsWith('ai-models')).map((k) => caches.delete(k))); toast('Cleared downloaded engines and models'); } }, 'Clear downloaded engines & models'),
      h('button', { class: 'ghost', onclick: () => { if (confirm('Remove saved AI keys from this device?')) { localStorage.removeItem('cs.ai.v1'); toast('Keys removed'); location.reload(); } } }, 'Remove AI keys')),
    h('div', { class: 'card' }, h('h2', {}, 'Install'), h('p', { class: 'muted small' }, 'iPhone: open in Safari, tap Share, then Add to Home Screen. Windows: in Edge or Chrome, use the install icon in the address bar.'), h('p', { class: 'muted small' }, 'Version 2.0 · Converter Studio')));
}
