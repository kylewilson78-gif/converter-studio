import { h, toast, saveFiles, chipGroup, select, handoff } from '../ui.js';
import { ask, activeProvider } from '../ai.js';

const TYPES = [
  ['prompt', 'Prompt'], ['system', 'AI instructions'], ['agent', 'Agent rules file'], ['skill', 'Skill (SKILL.md)'],
  ['brief', 'Project brief'], ['image', 'Image prompt'], ['readme', 'README'],
];
const MODELS = [['claude', 'Claude'], ['grok', 'Grok'], ['gemini', 'Gemini'], ['chatgpt', 'ChatGPT'], ['cursor', 'Cursor'], ['generic', 'Any AI']];

// Which fields each doc type shows: [key, label, kind, placeholder]
const F = {
  title: ['title', 'Title / name', 'input', 'e.g. Beat tag generator'],
  role: ['role', 'Who should the AI be?', 'input', 'e.g. a senior music producer and mix engineer'],
  goal: ['goal', 'What do you want?', 'area', 'Describe the task in plain words'],
  context: ['context', 'Background / context', 'area', 'Anything the AI should know first'],
  reqs: ['reqs', 'Must do (one per line)', 'area', 'Use short sentences\nInclude BPM and key'],
  cons: ['cons', 'Must not do (one per line)', 'area', 'No filler\nDon’t invent facts'],
  format: ['format', 'Output format', 'select', ''],
  tone: ['tone', 'Tone', 'select', ''],
  examples: ['examples', 'Examples (optional)', 'area', 'Paste a good example of the result'],
  audience: ['audience', 'Audience', 'input', 'Who is this for?'],
  stack: ['stack', 'Tech stack / tools', 'area', 'e.g. Vanilla JS PWA, ffmpeg.wasm, GitHub Pages'],
  commands: ['commands', 'Key commands (one per line)', 'area', 'npm run dev\nnpm test'],
  style: ['style', 'Conventions & style (one per line)', 'area', '2-space indent\nSmall focused commits'],
  when: ['when', 'When should it be used?', 'area', 'Use when the user asks to…'],
  steps: ['steps', 'Steps (one per line)', 'area', 'Read the input\nDo X\nReturn Y'],
  deliver: ['deliver', 'Deliverables (one per line)', 'area', 'Working app\nDocs'],
  timeline: ['timeline', 'Timeline / milestones', 'area', 'Week 1: …'],
  success: ['success', 'Success looks like', 'area', 'What does done mean?'],
  subject: ['subject', 'Subject', 'area', 'What’s in the picture'],
  imgstyle: ['imgstyle', 'Style', 'area', 'e.g. cinematic photo, 35mm, moody'],
  ratio: ['ratio', 'Aspect ratio', 'select', ''],
};
const FIELDS = {
  prompt: ['title', 'role', 'goal', 'context', 'reqs', 'cons', 'format', 'tone', 'examples'],
  system: ['title', 'role', 'goal', 'context', 'reqs', 'cons', 'format', 'tone', 'audience'],
  agent: ['title', 'goal', 'stack', 'commands', 'style', 'reqs', 'cons'],
  skill: ['title', 'goal', 'when', 'steps', 'reqs', 'cons', 'examples'],
  brief: ['title', 'goal', 'context', 'audience', 'deliver', 'reqs', 'cons', 'timeline', 'success'],
  image: ['title', 'subject', 'imgstyle', 'context', 'cons', 'ratio'],
  readme: ['title', 'goal', 'stack', 'commands', 'reqs'],
};
const FORMATS = [['', 'Let the AI decide'], ['markdown', 'Markdown with headings'], ['bullets', 'Bullet points'], ['steps', 'Numbered steps'], ['table', 'A table'], ['json', 'JSON'], ['code', 'Code only'], ['short', 'Short answer (under 100 words)'], ['email', 'Email']];
const TONES = [['', 'Default'], ['direct', 'Direct & concise'], ['friendly', 'Friendly'], ['expert', 'Expert / technical'], ['creative', 'Creative'], ['hype', 'Hype / energetic'], ['formal', 'Formal']];
const RATIOS = [['', 'Any'], ['1:1', '1:1'], ['9:16', '9:16'], ['16:9', '16:9'], ['4:5', '4:5'], ['3:2', '3:2']];
const FORMAT_TEXT = { markdown: 'Use Markdown with clear headings.', bullets: 'Answer in concise bullet points.', steps: 'Answer as numbered steps.', table: 'Present the answer as a Markdown table.', json: 'Return only valid JSON, no prose.', code: 'Return only the code, in one fenced block.', short: 'Keep it under 100 words.', email: 'Write it as a ready-to-send email with a subject line.' };
const TONE_TEXT = { direct: 'Be direct and concise. No filler.', friendly: 'Be warm and friendly.', expert: 'Write like a senior expert; be precise and technical.', creative: 'Be imaginative and original.', hype: 'Be energetic and hype.', formal: 'Use a formal, professional tone.' };

const LS = 'cs.md.v1';
const lines = (s) => (s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const slug = (s) => (s || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'untitled';

export function generate(type, model, v) {
  const L = (k) => lines(v[k]);
  const fmt = FORMAT_TEXT[v.format], tone = TONE_TEXT[v.tone];
  const title = v.title || { prompt: 'Prompt', system: 'Instructions', agent: 'Project rules', skill: 'my-skill', brief: 'Project brief', image: 'Image prompt', readme: 'Project' }[type];
  const bullets = (arr) => arr.map((x) => `- ${x}`).join('\n');
  const num = (arr) => arr.map((x, i) => `${i + 1}. ${x}`).join('\n');

  // ---- Image prompt (from fields or JSON) ----
  if (type === 'image') {
    const parts = [v.subject, v.imgstyle, v.context].filter(Boolean).map((x) => x.replace(/\s+/g, ' ').trim().replace(/[.\s]+$/, ''));
    const neg = L('cons').join(', ');
    const ar = v.ratio;
    const mj = parts.join(', ') + (ar ? ` --ar ${ar}` : '') + ' --style raw --v 7' + (neg ? ` --no ${neg}` : '');
    const sd = parts.join(', ') + ', highly detailed, sharp focus';
    const natural = `Create an image of ${(v.subject || 'the subject').replace(/[.\s]+$/, '')}${v.imgstyle ? `, in the style of ${v.imgstyle.replace(/[.\s]+$/, '')}` : ''}.${v.context ? ' ' + v.context.replace(/[.\s]+$/, '') + '.' : ''}${ar ? ` Aspect ratio ${ar}.` : ''}${neg ? ` Avoid: ${neg}.` : ''}`;
    const forModel = model === 'claude' ? `<image_request>\n${natural}\n</image_request>` : natural;
    return `# ${title}\n\n## ${model === 'generic' ? 'Prompt' : MODELS.find((m) => m[0] === model)[1] + ' / natural-language prompt'}\n\n${forModel}\n\n## Midjourney\n\n\`\`\`\n${mj}\n\`\`\`\n\n## Stable Diffusion / Flux\n\n**Prompt**\n\n\`\`\`\n${sd}\n\`\`\`\n${neg ? `\n**Negative prompt**\n\n\`\`\`\n${neg}\n\`\`\`\n` : ''}`;
  }

  // ---- Skill file ----
  if (type === 'skill') {
    const name = slug(v.title);
    const desc = (v.goal || '').replace(/\s+/g, ' ').trim() + (v.when ? ' ' + v.when.replace(/\s+/g, ' ').trim() : '');
    const fm = model === 'cursor' ? `---\ndescription: ${desc.slice(0, 300)}\nglobs:\nalwaysApply: false\n---\n` : `---\nname: ${name}\ndescription: ${desc.slice(0, 1000)}\n---\n`;
    return `${fm}\n# ${v.title || name}\n\n## When to use\n\n${v.when || v.goal || ''}\n\n## Steps\n\n${num(L('steps'))}\n${L('reqs').length ? `\n## Rules\n\n${bullets(L('reqs'))}\n` : ''}${L('cons').length ? `\n## Never\n\n${bullets(L('cons'))}\n` : ''}${v.examples ? `\n## Examples\n\n${v.examples}\n` : ''}`;
  }

  // ---- Agent rules file ----
  if (type === 'agent') {
    const fname = { claude: 'CLAUDE.md', gemini: 'GEMINI.md', cursor: '.cursor/rules/project.mdc', chatgpt: 'AGENTS.md', grok: 'AGENTS.md', generic: 'AGENTS.md' }[model];
    const head = model === 'cursor' ? `---\ndescription: ${(v.goal || title).replace(/\s+/g, ' ').slice(0, 200)}\nglobs:\nalwaysApply: true\n---\n\n` : '';
    const sec = (t, body) => (body ? `## ${t}\n\n${body}\n\n` : '');
    let out = `${head}# ${title}\n\n<!-- Save as ${fname} in your project root -->\n\n`;
    out += sec('Project overview', v.goal) + sec('Tech stack', v.stack) + sec('Commands', L('commands').length ? '```bash\n' + L('commands').join('\n') + '\n```' : '') + sec('Conventions', bullets(L('style'))) + sec('Always', bullets(L('reqs'))) + sec('Never', bullets(L('cons')));
    if (model === 'claude') out += '## Working style\n\n- Read the relevant files before editing.\n- Make the smallest change that solves the task, then run the tests.\n- Explain what changed and why in one short summary.\n';
    if (model === 'gemini') out += '## Working style\n\n- Plan before large changes and list the files you will touch.\n- Verify with the commands above before finishing.\n';
    return out.trim() + '\n';
  }

  // ---- README ----
  if (type === 'readme') {
    return `# ${title}\n\n${v.goal || ''}\n\n${L('reqs').length ? `## Features\n\n${bullets(L('reqs'))}\n\n` : ''}${v.stack ? `## Built with\n\n${v.stack}\n\n` : ''}${L('commands').length ? `## Getting started\n\n\`\`\`bash\n${L('commands').join('\n')}\n\`\`\`\n\n` : ''}## License\n\nMIT\n`;
  }

  // ---- Project brief ----
  if (type === 'brief') {
    const sec = (t, body) => (body ? (model === 'claude' ? `<${slug(t).replace(/-/g, '_')}>\n${body}\n</${slug(t).replace(/-/g, '_')}>\n\n` : `## ${t}\n\n${body}\n\n`) : '');
    return `# ${title}\n\n` + sec('Overview', v.goal) + sec('Background', v.context) + sec('Audience', v.audience) + sec('Deliverables', bullets(L('deliver'))) + sec('Requirements', bullets(L('reqs'))) + sec('Out of scope', bullets(L('cons'))) + sec('Timeline', v.timeline) + sec('Success criteria', v.success);
  }

  // ---- Prompt / system instructions, tailored per model ----
  const R = L('reqs'), C = L('cons');
  const isSys = type === 'system';
  if (model === 'claude') {
    const tag = (t, b) => (b ? `<${t}>\n${b}\n</${t}>\n\n` : '');
    return `# ${title}\n\n` + (v.role ? `You are ${v.role.replace(/^you are\s*/i, '')}.\n\n` : '') + tag('context', v.context) + tag(isSys ? 'purpose' : 'task', v.goal) + tag('audience', v.audience) + tag('requirements', bullets(R)) + tag('constraints', bullets(C)) + tag('examples', v.examples ? `<example>\n${v.examples}\n</example>` : '') + tag('output_format', [fmt, tone].filter(Boolean).join(' ')) + (isSys ? '' : 'Think through the task step by step before you answer, then give only the final result.\n');
  }
  if (model === 'gemini') {
    // Gemini: context first, the actual ask last
    const sec = (t, b) => (b ? `## ${t}\n\n${b}\n\n` : '');
    return `# ${title}\n\n` + sec('Role', v.role ? `You are ${v.role.replace(/^you are\s*/i, '')}.` : '') + sec('Context', v.context) + sec('Audience', v.audience) + sec('Examples', v.examples) + sec('Constraints', bullets([...R, ...C.map((c) => `Do not: ${c.replace(/^(don'?t|do not|no)\s*/i, '')}`)])) + sec('Output format', [fmt, tone].filter(Boolean).join(' ')) + sec(isSys ? 'Your job' : 'Task', v.goal);
  }
  if (model === 'grok') {
    return `# ${title}\n\n` + (v.role ? `**Role:** ${v.role}\n\n` : '') + `**${isSys ? 'Job' : 'Task'}:** ${v.goal || ''}\n\n` + (v.context ? `**Context:** ${v.context}\n\n` : '') + (R.length ? `**Do:**\n${bullets(R)}\n\n` : '') + (C.length ? `**Don’t:**\n${bullets(C)}\n\n` : '') + (v.examples ? `**Example:**\n${v.examples}\n\n` : '') + `**Format:** ${[fmt, tone || 'Be direct. Skip the preamble.'].filter(Boolean).join(' ')}\n` + (isSys ? '' : '\nIf current info matters, check real-time sources (X and web) and cite them.\n');
  }
  if (model === 'chatgpt') {
    const sec = (t, b) => (b ? `### ${t}\n${b}\n\n` : '');
    return `# ${title}\n\n` + sec('Role', v.role ? `You are ${v.role.replace(/^you are\s*/i, '')}.` : '') + sec(isSys ? 'Instructions' : 'Task', v.goal) + sec('Context', v.context ? `"""\n${v.context}\n"""` : '') + sec('Audience', v.audience) + sec('Requirements', bullets(R)) + sec('Avoid', bullets(C)) + sec('Example', v.examples ? `"""\n${v.examples}\n"""` : '') + sec('Output', [fmt, tone].filter(Boolean).join(' '));
  }
  if (model === 'cursor') {
    return `---\ndescription: ${(v.goal || title).replace(/\s+/g, ' ').slice(0, 200)}\nglobs:\nalwaysApply: false\n---\n\n# ${title}\n\n${v.goal || ''}\n\n${v.context ? `## Context\n\n${v.context}\n\n` : ''}${R.length ? `## Rules\n\n${bullets(R)}\n\n` : ''}${C.length ? `## Avoid\n\n${bullets(C)}\n\n` : ''}`;
  }
  const sec = (t, b) => (b ? `## ${t}\n\n${b}\n\n` : '');
  return `# ${title}\n\n` + sec('Role', v.role) + sec('Task', v.goal) + sec('Context', v.context) + sec('Requirements', bullets(R)) + sec('Avoid', bullets(C)) + sec('Examples', v.examples) + sec('Output', [fmt, tone].filter(Boolean).join(' '));
}

function fromImageJson(j) {
  const a = j.ai || {};
  const style = [a.visual_style?.medium, a.visual_style?.aesthetic, a.visual_style?.genre, a.lighting?.type && `${a.lighting.type} lighting`, a.camera?.shot_type, a.camera?.lens_guess, a.colors_described?.grading].filter(Boolean).join(', ');
  const palette = (j.colors?.palette || []).slice(0, 5).map((p) => `${p.name} ${p.hex}`).join(', ');
  return {
    title: a.subject ? `Image: ${a.subject}` : `Image prompt: ${j.file?.name || ''}`,
    subject: a.description || a.subject || '',
    imgstyle: style || `${j.colors?.tone || ''}, ${j.colors?.colorfulness || ''} colors`,
    context: [a.setting && Object.values(a.setting).filter(Boolean).join(', '), a.mood && `Mood: ${[].concat(a.mood).join(', ')}`, palette && `Palette: ${palette}`, a.composition?.framing && `Composition: ${a.composition.framing}`].filter(Boolean).join('. '),
    cons: 'blurry\nwatermark\nextra fingers\ntext artifacts',
    ratio: ['1:1', '9:16', '16:9', '4:5', '3:2'].includes(j.dimensions?.aspect_ratio) ? j.dimensions.aspect_ratio : '',
  };
}

export function mount(root) {
  let saved = {}; try { saved = JSON.parse(localStorage.getItem(LS)) || {}; } catch {}
  const st = { type: saved.type || 'prompt', model: saved.model || 'claude', v: saved.v || {}, manual: false };
  const img = handoff.take('imageJson');
  if (img) { st.type = 'image'; st.v = { ...st.v, ...fromImageJson(img) }; st.json = img; }

  const typeChips = chipGroup('Document type', TYPES, st.type, (v) => { st.type = v; renderFields(); update(); });
  const modelChips = chipGroup('Target AI', MODELS, st.model, (v) => { st.model = v; update(); });
  const fieldsWrap = h('div', { class: 'md-fields' });
  const out = h('textarea', { class: 'md-out', spellcheck: 'false', 'aria-label': 'Generated markdown', oninput: () => (st.manual = true) });
  const aiStatus = h('p', { class: 'muted small', 'aria-live': 'polite' });
  const idea = h('input', { type: 'text', placeholder: 'One-line idea, e.g. “a prompt that writes TikTok hooks for my beats”', 'aria-label': 'Idea' });

  root.append(
    h('div', { class: 'card' }, h('h2', {}, 'What are you making?'), typeChips, h('h2', { class: 'mt' }, 'For which AI?'), modelChips),
    h('div', { class: 'card' }, h('h2', {}, 'Quick start with AI'), h('div', { class: 'row gap0' }, idea, h('button', { class: 'primary alt short', onclick: expand }, 'Fill it in')), h('p', { class: 'muted small' }, 'Uses your AI key from Settings. Or just fill in the boxes below.')),
    h('div', { class: 'card' }, h('h2', {}, 'Details'), fieldsWrap),
    h('div', { class: 'card' }, h('div', { class: 'row between' }, h('h2', {}, 'Your .md'), h('button', { class: 'ghost chipbtn', onclick: () => { st.manual = false; update(); } }, 'Regenerate')), out,
      h('div', { class: 'row gap wrap' },
        h('button', { class: 'primary', onclick: () => { navigator.clipboard?.writeText(out.value).then(() => toast('Copied')); } }, 'Copy'),
        h('button', { class: 'ghost', onclick: save }, 'Save .md'),
        h('button', { class: 'ghost', onclick: polish }, '✨ Polish with AI')), aiStatus));

  function renderFields() {
    fieldsWrap.innerHTML = '';
    for (const key of FIELDS[st.type]) {
      const [k, label, kind, ph] = F[key];
      let el;
      if (kind === 'select') {
        const opts = k === 'format' ? FORMATS : k === 'tone' ? TONES : RATIOS;
        el = select(label, opts, st.v[k] || '', (val) => { st.v[k] = val; update(); });
      } else {
        const inp = kind === 'area' ? h('textarea', { rows: k === 'goal' || k === 'context' || k === 'subject' ? 3 : 2, placeholder: ph }) : h('input', { type: 'text', placeholder: ph });
        inp.value = st.v[k] || '';
        inp.addEventListener('input', () => { st.v[k] = inp.value; update(); });
        el = h('label', { class: 'field wide' }, h('span', {}, label), inp);
      }
      fieldsWrap.append(el);
    }
  }
  function update() {
    localStorage.setItem(LS, JSON.stringify({ type: st.type, model: st.model, v: st.v }));
    if (!st.manual) out.value = generate(st.type, st.model, st.v);
  }
  function fileName() {
    if (st.type === 'agent') return { claude: 'CLAUDE.md', gemini: 'GEMINI.md', cursor: 'project.mdc' }[st.model] || 'AGENTS.md';
    if (st.type === 'skill') return st.model === 'cursor' ? `${slug(st.v.title)}.mdc` : 'SKILL.md';
    if (st.type === 'readme') return 'README.md';
    return `${slug(st.v.title || st.type)}-${st.model}.md`;
  }
  function save() { saveFiles([{ blob: new Blob([out.value], { type: 'text/markdown' }), name: fileName() }]); }

  async function expand() {
    if (!idea.value.trim()) return toast('Type an idea first');
    if (!activeProvider()) return toast('Add an AI key in Settings first');
    aiStatus.textContent = 'Thinking…';
    try {
      const keys = FIELDS[st.type].map((k) => F[k][0]);
      const res = await ask({ prompt: `Fill in a "${TYPES.find((t) => t[0] === st.type)[1]}" for this idea: "${idea.value}".\nReturn JSON with these string keys: ${keys.join(', ')}.\nFor list fields (reqs, cons, steps, commands, style, deliver) put one item per line separated by \\n. For "format" use one of: ${FORMATS.map((f) => f[0]).filter(Boolean).join(', ')}. For "tone" use one of: ${TONES.map((t) => t[0]).filter(Boolean).join(', ')}. Be specific and practical.`, json: true });
      for (const k of keys) if (res[k] != null) st.v[k] = Array.isArray(res[k]) ? res[k].join('\n') : String(res[k]);
      st.manual = false; renderFields(); update(); aiStatus.textContent = 'Filled in. Edit anything you like.';
    } catch (e) { aiStatus.textContent = 'AI error: ' + e.message; }
  }
  async function polish() {
    if (!activeProvider()) return toast('Add an AI key in Settings first');
    aiStatus.textContent = 'Polishing…';
    try {
      const m = MODELS.find((x) => x[0] === st.model)[1];
      const tips = { claude: 'Use XML tags for sections, be explicit, put examples in <example> tags.', gemini: 'Use clear Markdown headings, give context first and put the main instruction last.', grok: 'Keep it tight and direct with bold labels and bullets.', chatgpt: 'Use ### headings and """ delimiters around pasted context.', cursor: 'Keep the .mdc front matter and write short actionable rules.', generic: 'Clear Markdown headings and bullets.' }[st.model];
      out.value = await ask({ system: 'You are an expert prompt engineer. Return only the improved markdown document, no commentary, no code fences around the whole thing.', prompt: `Improve this ${TYPES.find((t) => t[0] === st.type)[1]} so it works as well as possible with ${m}. ${tips} Keep the author's intent and every requirement; tighten wording; fill obvious gaps.\n\n${out.value}` , maxTokens: 4000 });
      st.manual = true; aiStatus.textContent = 'Polished. Tap Regenerate to go back to the template.';
    } catch (e) { aiStatus.textContent = 'AI error: ' + e.message; }
  }
  renderFields(); update();
  if (img) aiStatus.textContent = 'Loaded from your image JSON.';
}
