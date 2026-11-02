import { $, toast } from './js/ui.js';

const TOOLS = {
  convert: { title: 'Convert', load: () => import('./js/views/convert.js') },
  image: { title: 'Image', load: () => import('./js/views/image.js') },
  audio: { title: 'Audio', load: () => import('./js/views/audio.js') },
  midi: { title: 'Audio → MIDI', load: () => import('./js/views/midi.js') },
  md: { title: '.md Generator', load: () => import('./js/views/md.js') },
  settings: { title: 'Settings', load: () => import('./js/views/settings.js') },
};

const home = $('#view-home'), tool = $('#view-tool');
let current = 'home';

async function go(name, push = true) {
  if (!TOOLS[name]) name = 'home';
  if (push && name !== current) history.pushState({ v: name }, '', name === 'home' ? location.pathname : '#' + name);
  current = name;
  $('#backBtn').hidden = name === 'home';
  $('#settingsBtn').hidden = name === 'settings';
  if (name === 'home') { $('#title').textContent = 'Converter Studio'; tool.hidden = true; tool.innerHTML = ''; home.hidden = false; }
  else {
    $('#title').textContent = TOOLS[name].title;
    home.hidden = true; tool.hidden = false; tool.innerHTML = '<p class="muted">Loading…</p>';
    try {
      const mod = await TOOLS[name].load();
      if (current !== name) return;
      tool.innerHTML = '';
      mod.mount(tool, (n) => go(n));
    } catch (e) {
      console.error(e);
      tool.innerHTML = '';
      tool.append(Object.assign(document.createElement('p'), { className: 'err', textContent: 'Could not open this tool. Check your connection and try again. (' + e.message + ')' }));
    }
  }
  $('#main').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

window.addEventListener('popstate', (e) => go(e.state?.v || (location.hash.slice(1) || 'home'), false));
$('#backBtn').onclick = () => (history.state?.v && history.length > 1 ? history.back() : go('home'));
$('#settingsBtn').onclick = () => go('settings');
document.querySelectorAll('.tile').forEach((t) => (t.onclick = () => (t.dataset.go ? go(t.dataset.go) : toast(t.dataset.soon, 5000))));
history.replaceState({ v: location.hash.slice(1) || 'home' }, '');
if (location.hash.length > 1) go(location.hash.slice(1), false);

// Offline + updates
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then((reg) => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      nw?.addEventListener('statechange', () => { if (nw.state === 'installed' && navigator.serviceWorker.controller) toast('Updated. Reopen the app to get the newest version.', 5000); });
    });
  }).catch(() => {});
}

// Share Target / files opened from other apps could land here in future.
window.addEventListener('error', (e) => console.error('Uncaught', e.error || e.message));
