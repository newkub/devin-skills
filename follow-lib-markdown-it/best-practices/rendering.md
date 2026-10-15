# markdown-it — Rendering Pipeline and Security

## Recommended Patterns

### Presets and Instance Setup

- create one instance and reuse it: `const md = new MarkdownIt()` or `markdown-it()` — don't `new` per render
- presets: `default` (CommonMark + extras: tables, strikethrough, etc.), `commonmark` (strict spec), `zero` (minimal — enable only what you need)
- `zero` preset + `md.enable([...])` when you want a minimal surface — shrinks the attack surface for untrusted input
- key options: `html`, `linkify`, `typographer`, `breaks`, `highlight`

### Security — Untrusted Content

- the default `html: false` — inline HTML is auto-escaped (safe default)
- never enable `html: true` for user content — XSS via inline HTML is immediate
- if you must enable `html: true` → always sanitize the output with DOMPurify (see `/follow-lib-dompurify`)
- `linkify: true` auto-links URLs — beware `javascript:` URIs (markdown-it filters some, but sanitize additionally when untrusted)
- plugins that inject HTML, like raw-attribute plugins — audit before using with untrusted input

### Render Flow

- `md.render(src, env)` returns an HTML string; `md.parse(src, env)` returns the token stream to inspect/transform before rendering
- the `env` object is passed through to rules/plugins — e.g. store references, collect headings (toc)
- for syntax highlighting: `@shikijs/markdown-it` (async — await the setup before rendering) or `highlight.js` via the `highlight` option
- `md.renderer.rules.<name>` overrides output per token type — always wrap the default fallback

## Do / Don't

| Do | Don't |
|---|---|
| reuse one instance across the app | `new MarkdownIt()` on every render call |
| `html: false` for user content | `html: true` without sanitizing |
| sanitize the output with DOMPurify when `html: true` is required | always trusting plugin output |
| use `env` to pass per-render context | mutate shared state through a closure |
| wrap the default rule in renderer overrides | replace a rule and forget the fallback |

## Common Pitfalls

- `html: true` + user input → XSS — the biggest pitfall of this lib
- an async highlighter (`@shikijs/markdown-it`) called with sync `md.render` before setup finishes → code blocks don't highlight
- modifying the shared `md` instance mid-request → rules change across renders in concurrent usage — create separate instances or freeze the config at init
- `env` not passed → plugins that need env (toc collectors) return stale/empty data
- assuming the output is safe because `html: false` — linkify/attrs can still inject via URLs

## Performance Notes

- `md.render` is CPU-bound sync — for repeated content, cache the HTML output (key = content hash)
- markdown-it parses fast but big docs (many MB) are still slow — split the content or render in a worker
- don't re-parse to extract metadata — call `md.parse` once then inspect the tokens
- typographer + linkify add a small cost — turn them off if unused

## Ecosystem / Integration

- if you need a full markdown pipeline with an AST/unist → remark/rehype or a framework integration (VitePress, Slidev) — markdown-it is a token stream, not a full AST
- sanitize → `/follow-lib-dompurify`; syntax highlight → `@shikijs/markdown-it` or `highlight.js`
- v15 is ESM+CJS dual — types are included in the package, no `@types/markdown-it` needed
- CLI for quick renders: `bunx markdown-it file.md` — options `--html`, `--linkify`, `--typographer`
