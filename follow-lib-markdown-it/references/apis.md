| key | value |
|---|---|
| version | 15.0.2 |
| package registry | https://www.npmjs.com/package/markdown-it |
| repository | https://github.com/markdown-it/markdown-it |
| docs | https://markdown-it.github.io |

| api | description | default | options |
|---|---|---|---|
| `new MarkdownIt()` / `markdown-it()` | Create parser | CommonMark preset | `'commonmark'`, `'zero'`, `'default'` preset |
| `md.render(src)` | Render HTML string | - | env object |
| `md.parse(src, env)` | Token stream | - | - |
| `md.use(plugin, opts)` | Load plugin | - | plugin fn |
| `md.enable` / `md.disable` | Toggle rules | - | rule names |
| `md.renderer.rules.x` | Override render rule | - | custom fn |
| `markdown-it <file>` CLI | CLI render | stdout | --html, --linkify |
