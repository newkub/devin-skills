# Use Case — Compile or Evaluate MDX with Components

> Produce a JS module from MDX, or run it immediately with a JSX runtime. Source: https://satteri.bruits.org/docs/entry-points (read 2026-10-24)

## 1. Pick the output

| Need                                         | Use                        | Result           |
| -------------------------------------------- | -------------------------- | ---------------- |
| A module to bundle or write to disk          | `mdxToJs`                  | `code: string`   |
| Markdown-only source compiled to a component  | `markdownToJs`             | `code: string`   |
| A component right now, in the same process   | `evaluate`                 | module exports   |

## 2. Compile to a module

```ts
import { mdxToJs } from "satteri";

const { code, frontmatter } = mdxToJs(source, {
  jsxImportSource: "react",
  providerImportSource: "@mdx-js/react",
  optimizeStatic: { component: "Fragment", prop: "set:html" },
});
```

Write `code` to a file and let your bundler handle the imports, or bundle it in memory.

## 3. Evaluate with a runtime

```ts
import { evaluate } from "satteri";
import * as runtime from "react/jsx-runtime";
import * as provider from "@mdx-js/react";

const { default: Content } = evaluate(source, { ...runtime, ...provider });
```

`evaluate` returns the module exports; `default` is the component.

## 4. Choose the JSX shape

```ts
mdxToJs(source, { jsxRuntime: "classic", pragma: "h", pragmaFrag: "Fragment", pragmaImportSource: "preact" });
mdxToJs(source, { outputFormat: "function-body" });
```

Defaults are `jsxRuntime: "automatic"`, `jsxImportSource: "react"`, `outputFormat: "program"`.

## 5. Collapse static subtrees

```ts
mdxToJs(source, {
  optimizeStatic: { component: "div", prop: "dangerouslySetInnerHTML", wrapPropValue: true },
});
```

This is the only way raw HTML survives MDX output — everything outside a collapsed subtree loses it.

## Pitfalls

- Running `evaluate` on user content → it executes arbitrary code. Compile to a sandbox instead.
- Using `js: true`-style assumptions from other compilers → Sätteri's flag is `jsx`, and it defaults to `false`.
- Expecting `markdownToJs` to understand JSX → braces, tags, and `import`/`export` stay plain text.
- Forgetting `providerImportSource` → `useMDXComponents` is unavailable inside the document.
- Mixing `outputFormat: "function-body"` with a normal `import` in the generated module → the output is a function body, not a module.

## Related

- `references/apis.md`
- `best-practices/satteri.md`
- `usecases/custom-plugins.md`
