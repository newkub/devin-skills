# Lib Markdown It Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs site | https://markdown-it.github.io |
| Plugins list | https://www.npmjs.com/browse/keyword/markdown-it-plugin |
| Architecture (parse/render) | https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md |
| Development | https://github.com/markdown-it/markdown-it/tree/master/docs |
| Demo playground | https://markdown-it.github.io/ |
| CommonMark spec | https://spec.commonmark.org |

## Key Concepts

- Token stream architecture: `parse` → tokens → `render` → HTML
- Plugins ใช้ `md.use(plugin)` — ecosystem: `markdown-it-anchor`, `markdown-it-toc-done-right`, `markdown-it-footnote`
- Presets: `default` (GFM-like extras), `commonmark` (strict), `zero` (minimal)
- Custom render rules: `md.renderer.rules.fence = fn` เช่น syntax highlighting
