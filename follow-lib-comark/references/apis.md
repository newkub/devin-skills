| key | value |
|---|---|
| package | `comark` + `@comark/<target>` renderers |
| install | `bun add comark @comark/vue` (pick the renderer by target) |
| stable version | 0.7.0 (verified 2026-10-03) |
| license | MIT (maintained by Vercel) |
| docs | https://comark.dev |
| repository | https://github.com/comarkdown/comark |

| api | description | signature/example |
|---|---|---|
| `parseMarkdown` | parse CommonMark/GFM → `MarkdownDocument` (serializable) | `const doc = await parseMarkdown(content, { plugins })` |
| `MarkdownDocument` | compact serializable AST — inspect/transform/cache/serialize | output of `parseMarkdown` |
| `@comark/html` | string renderer → HTML (SSG, RSS, email) | `await renderHtml(content)` |
| `@comark/ansi` | ANSI terminal renderer (CLIs, scripts) | `await renderAnsi(content)` |
| `@comark/vue` | Vue `Markdown` component — must be inside `<Suspense>` | `<Markdown :components :plugins>{{ content }}</Markdown>` |
| `@comark/react` | React `Markdown` component (supports RSC/Next.js) | `<Markdown plugins={[...]}>{content}</Markdown>` |
| `@comark/svelte` | Svelte 5 `Markdown` component (runes) | `<Markdown value={content} />` |
| `@comark/angular` | Angular 17+ standalone `Markdown` component | `<comark-markdown [value]="content" />` |
| `@comark/nuxt` | Nuxt module integration | `modules: ['@comark/nuxt']` |
| components syntax | block `::name{props}` + inline `:name[text]{props}` — props, slots, nested md | `::alert{type="info"}...::` |
| attributes syntax | classes/ids/data attrs on markdown elements | `**text**{.class #id}`, `[link](u){target="_blank"}` |
| frontmatter | YAML block at the start → metadata | `--- title: x ---` |
| `comark/plugins/shiki` | syntax highlighting plugin (multi-theme, on-demand langs) | `plugins: [shiki({ themes: { light, dark } })]` |
| `comark/plugins/rangi` | lightweight highlighting (~13kB sync, peer dep `rangi`) | `plugins: [rangi({ theme: github })]` — theme from `rangi/themes` |
| mermaid plugin | render `mermaid` code blocks as diagrams | `plugins: [mermaid()]` + `components: { mermaid: Mermaid }` |
| json-render plugin | declarative UI specs in code blocks → components | `@comark/react/plugins/json-render` |
| math / toc plugins | math rendering, table of contents | see https://comark.dev/plugins |
| streaming | auto-close incomplete syntax; framework renderers have a streaming prop | `<Markdown :streaming="true">` |
| markdown-it compat | reuse markdown-it plugins (built on markdown-exit) | via the same plugin API |
