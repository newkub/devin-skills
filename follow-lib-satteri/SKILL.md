---
name: follow-lib-satteri
description: Use Sätteri — fast Rust Markdown/MDX parser and renderer for JS
argument-hint: "[scope]"
related:
  - follow-lib-shiki
  - follow-lib-dompurify
  - follow-create-web-docs
  - follow-tool-vite
  - improve
---

## Goal

Use Sätteri (`satteri`) as the default Markdown/MDX engine — parse Markdown to HTML, compile MDX to JS, or get a plain MDAST/HAST tree — with native Rust speed and JS plugins

## Scope

Use for any JS/TS project that parses or renders Markdown or MDX: docs sites, blogs, CMS content, AI chat output, Vite app content imports

- Boundary: Sätteri is the Markdown/MDX parse + render pipeline. Syntax highlighting is a HAST plugin step (`/follow-lib-shiki`); sanitizing untrusted HTML is `/follow-lib-dompurify`; full docs-site scaffolding is `/follow-create-web-docs`
- It replaces `marked`, `markdown-it`, and `comark` for Markdown work — do not install those alongside it
- Sätteri is pre-1.0: minor bumps may break. Pin the version and re-read the changelog before upgrading
- Latest: `satteri@0.10.5` (verified 2026-10-24)
- References: [apis](references/apis.md) | [features, plugins, and pitfalls](best-practices/satteri.md)

## Execute

### 1. Install And Pick An Entry Point

> Goal: get the right function for the job and a first successful render

1. Install `bun add satteri` — napi-rs prebuilds cover macOS (arm64/x64), Linux x86_64 glibc, and Windows x86_64
2. Other targets fall back to WASI: add `@bruits/satteri-wasm32-wasi`, opt in with `supportedArchitectures: { cpu: ["wasm32"] }`, and serve COOP/COEP headers for `SharedArrayBuffer`
3. Choose the entry point:
   - `markdownToHtml(source, options?)` → `{ html, frontmatter, data }` — Markdown to HTML string
   - `mdxToJs(source, options?)` / `markdownToJs(source, options?)` → `{ code, frontmatter, data }` — compile to a JS module
   - `evaluate(source, runtime)` — compile + run MDX, returns the module exports (`default` is the component)
   - `markdownToMdast` / `mdxToMdast` / `markdownToHast` / `mdxToHast` / `htmlToHast` / `hastToHtml` — trees without rendering
1. Treat MDX as code: never compile or `evaluate` MDX from untrusted authors

### 2. Configure Features

> Goal: enable only the syntax the content actually needs

1. Defaults: `gfm: true` and `frontmatter: true`; every other feature is off
2. Turn on per need: `math`, `headingAttributes`, `directive`, `superscript`, `subscript`, `wikilinks`, `definitionList`, `smartPunctuation`, `rawHtml`
3. `rawHtml: true` reparses raw HTML into real HAST elements — use it when a HAST plugin must see inside HTML blocks; positions are lost through the reparse
4. Frontmatter comes back as the raw fence (`{ kind: "yaml" | "toml", value }`) — parse the value yourself with the project's YAML/TOML parser
5. Read `references/apis.md` for the full option table before reaching for anything uncommon

### 3. Add Plugins

> Goal: extend the pipeline at the right AST stage

1. Write plugins with `defineMdastPlugin` / `defineHastPlugin`: an object with `name` and one visitor per node type
2. Pass them as `mdastPlugins` / `hastPlugins`; entries may be a plugin, a factory `(ctx) => entry`, a nested array bundle, or `null`/`undefined`/`false` to skip
3. Use a factory when state must reset per document, or to skip a plugin for some files via `ctx.fileURL` / `ctx.sourceFormat`
4. Opt into `options: { position: true }` only when a visitor reads `node.position` — it costs ~15% of parse time
5. To inject HTML return `{ raw: "<span>…</span>", mdxExpressions: false }` — an `html` node renders in HTML but throws under `mdxToJs`

### 4. Wire Into Vite

> Goal: import `.md`/`.mdx` as modules

1. Install `bun add --dev vite-plugin-satteri satteri` (`satteri` is a peer dependency)
2. Add `satteri({ features, mdastPlugins, hastPlugins, mdx })` to `plugins` in `vite.config.ts`
3. `.md` default export is the rendered HTML string, with `frontmatter` as a named export; `.mdx` exports a component
4. Add `src/satteri-modules.d.ts` declarations so TypeScript resolves `.md`/`.mdx` imports

### 5. Verify

> Goal: confirm output and integrations

1. Run `/run-verify` for lint and typecheck
2. Run `/run-test` when a render pipeline test exists
3. Check the official docs at https://satteri.bruits.org/docs before using an uncertain option

### Use Cases

| Scenario | Use case |
|----------|----------|
| Render Markdown to an HTML string, with frontmatter | `usecases/render-markdown-html.md` |
| Import `.md`/`.mdx` in a Vite app or docs site | `usecases/vite-md-mdx-imports.md` |
| Compile/evaluate MDX with components | `usecases/mdx-components-and-evaluate.md` |
| Enable math, directives, attributes, smart punctuation | `usecases/features-and-frontmatter.md` |
| Write MDAST/HAST plugins and bundles | `usecases/custom-plugins.md` |
| Get a tree and hand off to remark/rehype | `usecases/parse-tree-and-remark-pipeline.md` |

## Rules

### 1. One Markdown Engine

- Sätteri is the catalog default — do not add `marked`, `markdown-it`, or `comark` to a new project
- A project that already ships one of those keeps it until a deliberate migration; swapping engines is a planned change, not a drive-by edit

### 2. Pin And Read Changelogs

- Pre-1.0: pin the exact version and review breaking changes on every minor bump
- Never enable a feature or option not covered by the docs for the pinned version

### 3. Trust Boundary

- MDX is executable — never `evaluate` content from untrusted authors
- Rendered HTML from user content is sanitized with `/follow-lib-dompurify` unless `rawHtml` stays off and only known-safe syntax is allowed
- Component names in MDX resolve only when provided — content is data, not imports

### 4. Performance Defaults

- Pass `position: false` to tree functions when nothing reads positions
- Prefer `markdownToHtml` over a hand-rolled tree + serializer for plain HTML output
- Parse once and cache; these functions are synchronous unless an async plugin is present

- Use `/follow-lib-shiki` for code-block highlighting in a HAST plugin
- Use `/follow-lib-dompurify` when HTML output must be sanitized
- Use `/follow-tool-vite` for Vite config conventions
- See `best-practices/` for recommended patterns and pitfalls

## References

- [API reference](references/apis.md)

- References: [Sätteri — Features, Plugins, and Pitfalls](best-practices/satteri.md)

## Expected Outcome

- Sätteri is installed and rendering Markdown (and MDX where needed)
- Features are enabled deliberately; frontmatter is parsed by the project
- Plugins run at the intended MDAST/HAST stage with correct state lifetime
- Vite imports work with TypeScript declarations
- No second Markdown engine is introduced alongside it
