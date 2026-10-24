# Use Case — Get a Tree and Hand It to remark/rehype

> Skip HTML rendering when a downstream tool needs the tree, or keep the tree for analysis. Source: https://satteri.bruits.org/docs/asts (read 2026-10-24)

## 1. Parse to the tree you need

```ts
import { markdownToMdast, markdownToHast } from "satteri";

const mdast = markdownToMdast(source);
const hast = markdownToHast(source, { position: false });
```

Tree functions take no plugins — `TreeOptions` is only `{ features, position }`.

## 2. Decide what to skip

`position: false` drops `node.position`, which is most of the tree's memory and a large share of parse time. Skip it unless a downstream plugin needs source locations.

## 3. Hand off to unified

MDAST/HAST node shapes match the remark/rehype contracts, so existing plugins keep working:

```ts
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { markdownToMdast } from "satteri";

const mdast = markdownToMdast(source);

const html = String(
  await unified()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .run(mdast),
);
```

Do not re-parse with `remark-parse`: that is the work Sätteri already did.

## 4. Or stay native

If no existing plugin is needed, `markdownToHast` + `hastToHtml` is faster than routing through unified:

```ts
import { hastToHtml } from "satteri";

const html = hastToHtml(markdownToHast(source));
```

## 5. Parse HTML back when needed

```ts
import { htmlToHast } from "satteri";

const tree = htmlToHast('<p class="lead">Hi <b>there</b></p>');
```

Browser-grade recovery, typed properties (`className`), and `<template>` content exposed as `children`.

## Pitfalls

- Passing `markdownToMdast` output to a plugin that depends on `position` → opt into `position: true` on the tree call.
- Assuming `hastToHtml` ends with a newline → only `markdownToHtml` does.
- Expecting `htmlToHast` to validate or sanitize → it parses, it does not enforce a policy.
- Chaining remark and Sätteri repeatedly on the same source → each re-parse costs the full parse.

## Related

- `references/apis.md`
- `best-practices/satteri.md`
- `usecases/custom-plugins.md`
