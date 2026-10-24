# Use Case — Turn On Parser Features and Read Frontmatter

> Sätteri ships a small core; every non-GFM extension is an explicit flag. Source: https://satteri.bruits.org/docs/features (read 2026-10-24)

## 1. Know what is already on

| Feature       | Default | Notes                                  |
| ------------- | ------- | -------------------------------------- |
| `gfm`         | `true`  | Tables, task lists, strikethrough, autolinks |
| `frontmatter` | `true`  | YAML/TOML block at the top of the file  |

Everything else is opt-in.

## 2. Enable what the content needs

```ts
import { markdownToHtml } from "satteri";

const { html } = markdownToHtml(source, {
  features: {
    math: true,
    headingAttributes: true,
    directive: true,
    smartPunctuation: true,
  },
});
```

## 3. Read the frontmatter

```ts
const { frontmatter } = markdownToHtml(source);

switch (frontmatter?.kind) {
  case "yaml":
    return parseYaml(frontmatter.value);
  case "toml":
    return parseToml(frontmatter.value);
  default:
    return {};
}
```

`satteri` never parses the block; it hands back `{ kind, value }`.

## 4. Choose the heavy flags deliberately

| Flag             | Cost / caveat                                                     |
| ---------------- | ----------------------------------------------------------------- |
| `rawHtml`        | Parses embedded HTML into real elements instead of passing it through |
| `math`           | Emits math markup; rendering (KaTeX/MathJax) is still your job      |
| `directive`      | Adds directive nodes; you must render them with a plugin            |
| `definitionList` | Rarely used outside documentation sites                             |
| `wikilinks`      | Only meaningful if your content actually uses `[[wiki]]` syntax     |

## 5. Disable what you don't want

```ts
markdownToHtml(source, { features: { gfm: false } });
```

Turn `gfm` off for strict CommonMark behaviour: no tables, no strikethrough, no autolinks.

## Pitfalls

- Assuming `math` renders formulas → it produces math nodes/markup only.
- Turning on every flag "just in case" → extra parse work and surprising output for plain content.
- Assuming `frontmatter` is parsed → parse it yourself with a safe YAML loader.
- Enabling `rawHtml` in a pipeline that already trusts raw HTML → double parsing and changed node types.

## Related

- `references/apis.md`
- `best-practices/satteri.md`
- `usecases/render-markdown-html.md`
