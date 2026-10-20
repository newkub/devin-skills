# Use Case — Render Markdown to the Terminal

> Use the ANSI renderer for CLI help, changelog output, and agent transcripts where HTML makes no sense. Source: https://comark.dev/renderers/ansi (accessed 2026-10-20)

## 1. Render to ANSI

```ts
import { renderAnsi } from "@comark/ansi";

const output = await renderAnsi(`
# Deploy

Run **all** checks first:

- install
- typecheck
- test

\`\`\`bash
bun run check
\`\`\`
`);

process.stdout.write(output);
```

`renderAnsi` returns a string with ANSI escape codes, ready for `process.stdout`. Write once at the end instead of per block so the terminal draws a single frame — interleaved writes flicker and can split an escape sequence.

## 2. Keep it inside the terminal width

```ts
import { renderAnsi } from "@comark/ansi";

const width = Math.min(process.stdout.columns ?? 80, 100);
const output = await renderAnsi(source, { width });
```

Tables and wrapped paragraphs depend on the width you declare. Reading `process.stdout.columns` keeps output correct in a split pane; the `?? 80` fallback covers piped output where the terminal reports nothing.

Clamp the upper bound: a 200-column terminal produces unreadable tables in a screenshot or a CI log.

## 3. Decide colour before rendering

```ts
const colour = process.stdout.isTTY && !process.env.NO_COLOR;
const output = await renderAnsi(source, { colour });
```

`NO_COLOR` and `isTTY` are the two signals every CLI respects. Without the check, a redirect to a file writes escape codes into the artifact and `grep` results become unusable.

## 4. Verify

1. `bun run build && ./dist/cli --help | cat` — no stray escape sequences
2. `NO_COLOR=1 ./dist/cli --help` — plain text, same structure
3. Resize the terminal to 40 columns — tables wrap without breaking the layout
4. Pipe to `less -R` — colour survives and no line is truncated

## Pitfalls

- Writing each rendered block separately, which splits ANSI sequences across writes.
- Ignoring `NO_COLOR`, so CI logs are full of escape codes.
- Using `console.log` on already-rendered ANSI, which appends a newline and adds a blank line per block.
- Rendering at a fixed 80 columns while the terminal is narrower, producing wrapped table borders.
- Reaching for the HTML renderer and stripping tags, which loses the structure the ANSI renderer preserves.

## Related

- `references/apis.md`
- `best-practices/comark.md`
- `usecases/render-markdown-html.md`
- `usecases/syntax-highlight-and-plugins.md`
