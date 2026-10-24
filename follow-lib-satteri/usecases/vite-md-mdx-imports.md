# Use Case — Import `.md` and `.mdx` Files in Vite

> Let Vite turn every Markdown file into an HTML module and every MDX file into a component, with no loader of your own. Source: https://satteri.bruits.org/docs/vite (read 2026-10-24)

## 1. Install the plugin

```bash
bun add -d vite-plugin-satteri
bun add satteri
```

`vite-plugin-satteri` has `satteri` as a peer dependency, so install both.

## 2. Register it

```ts
// vite.config.ts
import { defineConfig } from "vite";
import satteri from "vite-plugin-satteri";

export default defineConfig({
  plugins: [satteri()],
});
```

Defaults: `markdown: true`, `mdx: true`.

## 3. Type the module shapes

```ts
// src/satteri-modules.d.ts
declare module "*.md" {
  const html: string;
  export const frontmatter: { kind: "yaml" | "toml"; value: string } | null;
  export default html;
}

declare module "*.mdx" {
  import type { ComponentType } from "react";
  const Content: ComponentType;
  export const frontmatter: { kind: "yaml" | "toml"; value: string } | null;
  export default Content;
}
```

## 4. Import

```tsx
import html, { frontmatter } from "./intro.md";
import Content from "./interactive.mdx";

export const Post = () => <article dangerouslySetInnerHTML={{ __html: html }} />;
export const Interactive = () => <Content />;
```

## 5. Pass options through

```ts
satteri({
  features: { math: true, headingAttributes: true },
  mdx: { jsxImportSource: "react" },
  hastPlugins: [anchorHeadings],
});
```

`mdx` accepts `true` or an `MdxOptions` object (MDX options minus `outputFormat`).

## Pitfalls

- Forgetting `src/satteri-modules.d.ts` → TypeScript rejects the import even though the build works.
- Importing `satteri` only as a dev dependency → the plugin's peer dependency must resolve at build time.
- Expecting `.mdx` to export HTML → it exports a component; render it with your framework.
- Assuming WASM fallback works without headers → non-native targets need COOP/COEP for `SharedArrayBuffer`.

## Related

- `references/apis.md`
- `best-practices/satteri.md`
- `usecases/mdx-components-and-evaluate.md`
