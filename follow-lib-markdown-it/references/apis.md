# Lib Markdown It API & Dependencies

## Install

```sh
bun add markdown-it
bun add -D @types/markdown-it   # TypeScript
```

## Version

- Latest: `15.0.1` (verified 2026-09-11)
- [Package Registry](https://www.npmjs.com/package/markdown-it)
- [Repository](https://github.com/markdown-it/markdown-it)

## Dependencies

- Runtime: `entities`, `linkify-it`, `mdurl`, `punycode2`, `uc.micro` (v15: `punycode2` แทน punycode)
- ESM+CJS dual exports

## Common API / Commands

| api | description | default | options |
|---|---|---|---|
| `new MarkdownIt()` / `markdown-it()` | Create parser | CommonMark preset | `'commonmark'`, `'zero'`, `'default'` preset |
| `md.render(src)` | Render HTML string | - | env object |
| `md.parse(src, env)` | Token stream | - | - |
| `md.use(plugin, opts)` | Load plugin | - | plugin fn |
| `md.enable` / `md.disable` | Toggle rules | - | rule names |
| `md.renderer.rules.x` | Override render rule | - | custom fn |
| `markdown-it <file>` CLI | CLI render | stdout | --html, --linkify |

## Source

- Official docs: https://markdown-it.github.io
- Description: Fast pluggable Markdown parser — CommonMark compliant.
