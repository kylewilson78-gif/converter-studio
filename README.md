# Converter Studio

iPhone-first installable web app (also runs on Windows). Everything runs on the device.

- **Convert** – 150+ input types: photos (HEIC, RAW, PSD, TIFF, WebP, AVIF…), audio, video, PDF, Word, Markdown, HTML, CSV/JSON/XML/YAML/Excel, subtitles, EPUB, ZIP/GZ. Batch, zip, social presets, fit-under-size.
- **Image** – adjust, auto-enhance, 12 filters, crop/rotate/straighten, AI background removal, Image → JSON (+ optional AI description).
- **Audio** – noise cleanup, hum removal, vocal clarity, loudness, pitch/speed, EQ, reverb, fades, vocal remover, AI 4-stem split (Demucs).
- **MIDI** – hum/sing, instrument, bass, drums/beatbox, or full song (stems → 4 tracks) to FL-Studio-ready .mid with tempo/key detection and quantize.
- **.md** – prompts, AI instructions, CLAUDE.md/GEMINI.md/AGENTS.md/.mdc, SKILL.md, briefs, image prompts, READMEs tailored to Claude, Gemini, Grok, ChatGPT, Cursor.

AI features that call a model (Image → JSON description, .md fill/polish) use your own key, stored only in the browser (Settings).

Deploy: push `main` and `main:gh-pages`. Bump `VERSION` in `sw.js` each release.
