# Sätteri API Reference

Source: https://satteri.bruits.org/docs (read 2026-10-24). Package: `satteri@0.10.5`.

## Entry Points

Entry points parse a source string and return a result object. They are synchronous unless a plugin has an async visitor, in which case they return a `Promise` of the same result.

```ts
markdownToHtml(source: string, options?: CompileOptions): MarkdownToHtmlResult;
mdxToJs(source: string, options?: MdxCompileOptions): MdxToJsResult;
markdownToJs(source: string, options?: MarkdownToJsOptions): MarkdownToJsResult;
evaluate(source: string, runtime): Record<string, unknown>;
```

```ts
interface MarkdownToHtmlResult {
  html: string;
  frontmatter: Frontmatter | null;
  data: Data;
}

interface MdxToJsResult {
  code: string; // compiled JS module source
  frontmatter: Frontmatter | null;
  data: Data;
}
```

`MarkdownToJsResult` matches `MdxToJsResult`. `frontmatter` is `null` when the document has none.

### evaluate

Compiles and runs MDX in one step and returns the module exports; `default` is the component. Requires a JSX runtime:

```ts
import { evaluate } from "satteri";
import * as runtime from "react/jsx-runtime";

const { default: Content } = evaluate("# Hello\n\n<Sparkle />", { ...runtime });
```

Never evaluate MDX from untrusted authors.

## Tree Functions (no rendering, no plugins)

```ts
interface TreeOptions {
  features?: Features;
  position?: boolean;
}

markdownToMdast(source: string, options?: TreeOptions): MdastNode;
mdxToMdast(source: string, options?: TreeOptions): MdastNode;
markdownToHast(source: string, options?: TreeOptions): HastNode;
mdxToHast(source: string, options?: TreeOptions): HastNode;
htmlToHast(html: string): HastNode;
hastToHtml(tree: HastNode | HastNode[]): string;
```

- `position: false` skips recording `node.position` — a large speed and memory win.
- `htmlToHast` parses HTML (not Markdown) with browser-grade recovery; attributes become typed hast properties (`class` → `className`, `tabindex` → number).
- `hastToHtml` has no trailing newline; `markdownToHtml` ends with one.
- `htmlToHast` emits `<template>` content as the element's `children`, not a separate `content` root.

## CompileOptions

Shared by `markdownToHtml`, `mdxToJs`, and `markdownToJs`.

| Option         | Type              | Notes                                              |
| -------------- | ----------------- | -------------------------------------------------- |
| `mdastPlugins` | `MdastPluginList` | MDAST-stage plugins                                |
| `hastPlugins`  | `HastPluginList`  | HAST-stage plugins                                 |
| `features`     | `Features`        | Parser extensions                                  |
| `fileURL`      | `URL`             | Document URL; surfaced to plugins as `ctx.fileURL` |
| `data`         | `Data`            | Initial document data bag (same object returned)   |

`fileURL` must be a `URL`:

```ts
markdownToHtml(source, { fileURL: pathToFileURL("docs/intro.md") });
```

`data` is seeded before plugins run and is the same object plugins mutate through `ctx.data` and the caller reads as `result.data`. Pass a fresh object per compile.

## MDX Options

`mdxToJs` accepts `CompileOptions` plus these; `markdownToJs` accepts them too.

| Option                     | Type                               | Default                 |
| -------------------------- | ---------------------------------- | ----------------------- |
| `optimizeStatic`           | `{ component, prop, wrapPropValue?, ignoreElements? }` | —    |
| `jsx`                      | `boolean`                          | `false`                 |
| `jsxRuntime`               | `"automatic" \| "classic"`         | `"automatic"`           |
| `jsxImportSource`          | `string`                           | `"react"`               |
| `providerImportSource`     | `string`                           | —                       |
| `development`              | `boolean`                          | `false`                 |
| `pragma`                   | `string`                           | `"React.createElement"` |
| `pragmaFrag`               | `string`                           | `"React.Fragment"`      |
| `pragmaImportSource`       | `string`                           | `"react"`               |
| `outputFormat`             | `"program" \| "function-body"`     | `"program"`             |
| `elementAttributeNameCase` | `"react" \| "html"`                | `"react"`               |
| `stylePropertyNameCase`    | `"dom" \| "css"`                   | `"dom"`                 |

`optimizeStatic` collapses static subtrees into one pre-rendered HTML string. Astro style:

```ts
mdxToJs(source, { optimizeStatic: { component: "Fragment", prop: "set:html" } });
```

React style:

```ts
mdxToJs(source, {
  optimizeStatic: { component: "div", prop: "dangerouslySetInnerHTML", wrapPropValue: true },
});
```

## Markdown vs JSX Divergence

- `markdownToJs` treats `{...}`, JSX tags, and `import`/`export` as plain Markdown text.
- HTML in a `markdownToJs` source is dropped when JSX is generated (HAST plugins still see `raw` nodes first). Enable `features: { rawHtml: true }` to parse it into real elements.
- `markdownToHtml` re-emits raw HTML verbatim; JSX output cannot, except inside a subtree collapsed by `optimizeStatic`.

## Plugins

```ts
defineMdastPlugin({ name: "my-plugin", heading(node, ctx) { /* ... */ } });
defineHastPlugin({ name: "my-plugin", element(node, ctx) { /* ... */ } });
```

Entry shapes:

```ts
type MdastPluginEntry =
  | MdastPluginDefinition
  | ((ctx: PluginFactoryContext) => MdastPluginEntry)
  | readonly MdastPluginEntry[]
  | null | undefined | false;
```

- A definition is reused for every document (stateless).
- A factory runs once per compile; close over per-document state there.
- A bundle is a nested array of entries, run in place.
- `null`/`undefined`/`false` skip the entry; any other non-plugin value throws.

Factory context:

```ts
interface PluginFactoryContext {
  readonly fileURL: URL | undefined;
  readonly sourceFormat: "markdown" | "mdx";
  readonly source: string;
  readonly data: Data;
}
```

Visitor results:

```ts
type MdastVisitorResult =
  | MdastNode                                   // replace the node
  | { raw: string; mdxExpressions?: boolean }   // splice in Markdown-reparsed string
  | { rawHtml: string }                         // deprecated
  | undefined | null | void;                    // keep node, apply ctx mutations
```

Inject HTML with `{ raw: "<span>…</span>", mdxExpressions: false }`. An mdast `html` node renders under `markdownToHtml` but throws under `mdxToJs`.

`options: { position: true }` opts a plugin into `node.position`; it costs ~15% of parse time and any one plugin enables it for the whole pipeline.

## Installation Notes

- Native prebuilds: macOS arm64/x64, Linux x86_64 (glibc), Windows x86_64.
- Everything else uses `@bruits/satteri-wasm32-wasi`: opt in via `supportedArchitectures: { cpu: ["wasm32"] }` and serve COOP/COEP headers for `SharedArrayBuffer`.
- Pre-1.0: pin the version; review breaking changes on every minor bump.

## Vite

- `vite-plugin-satteri` with `satteri` as a peer dependency.
- Options: `markdown` (default `true`), `mdx` (default `true`, or `MdxOptions`), `mdastPlugins`, `hastPlugins`, `features`.
- `.md` default export is HTML; `.mdx` default export is a component; `frontmatter` is a named export for both.
- `MdxOptions` mirrors the MDX options minus `outputFormat`.
