# Use Case — Side-by-Side Diff With Line Numbers

> Highlight two versions of a file once, then decorate changed lines without re-tokenizing either side. Source: https://tanstack.com/highlight/latest (accessed 2026-10-20)

## 1. Compute the changed line ranges first

```ts
// src/diff/lines.ts
export type Row = { left?: string; right?: string; changed: boolean }

export function diffRows(before: string[], after: string[]): Row[] {
  const rows: Row[] = []
  let i = 0, j = 0

  while (i < before.length || j < after.length) {
    if (before[i] === after[j]) {
      rows.push({ left: before[i], right: after[j], changed: false }); i++; j++
    } else if (before[i + 1] === after[j]) {
      rows.push({ left: before[i], changed: true }); i++
    } else if (before[i] === after[j + 1]) {
      rows.push({ right: after[j], changed: true }); j++
    } else {
      rows.push({ left: before[i], right: after[j], changed: true }); i++; j++
    }
  }
  return rows
}
```

Diffing lines first means the highlighter never sees a line number, a gutter marker, or a background class — it only ever highlights source.

## 2. Highlight each side once, whole file

```ts
// src/diff/highlight.ts
import { highlight } from "@tanstack/highlight"

export function highlightLines(source: string, language: string): string[] {
  const html = highlight(source, { language })
  const split = html.split("\n")

  // Multi-line tokens (template strings, block comments) open a tag on one line
  // and close on another; re-open the tag so each line is valid HTML on its own.
  const open: string[] = []
  return split.map((line) => {
    const withOpens = open.join("") + line
    for (const tag of line.matchAll(/<(\w+)[^>]*>/g)) open.push(`<${tag[1]}>`)
    for (const tag of line.matchAll(/<\/(\w+)>/g)) open.pop()
    return withOpens
  })
}
```

Splitting after highlighting keeps tokens intact; re-opening tags keeps every line a valid fragment when it lands in its own `<td>`. Escape the source before this step if the package's output is not per-line balanced — check the actual output for a multi-line string before trusting it.

## 3. Render rows

```tsx
export function Diff({ rows, before, after, language }: DiffProps) {
  const left = highlightLines(before, language)
  const right = highlightLines(after, language)

  return (
    <table class="diff">
      <tbody>
        {rows.map((row, n) => (
          <tr class={row.changed ? "changed" : undefined}>
            <td class="ln">{row.left !== undefined ? n : ""}</td>
            <td class="code" dangerouslySetInnerHTML={{ __html: left[n] ?? "" }} />
            <td class="ln">{row.right !== undefined ? n : ""}</td>
            <td class="code" dangerouslySetInnerHTML={{ __html: right[n] ?? "" }} />
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

A row index is enough for line numbers when both sides are aligned; if you need true file line numbers, carry `{ leftNo, rightNo }` on the row from `diffRows`.

## 4. Style the gutters with CSS, not conditionals

```css
.diff .ln {
  counter-reset: none;
  color: var(--muted);
  user-select: none;
  width: 3ch;
  text-align: right;
}
.diff tr.changed td.code { background: var(--diff-bg); }
.diff tr.changed td:first-child { box-shadow: inset 3px 0 var(--diff-remove); }
```

The `changed` class is the only per-row signal; colours stay in the theme so light/dark is one variable swap.

## 5. Verify

1. `/run-test` — a file with a multi-line template string renders every line without visible broken markup
2. Diff of a 2-line change in a 500-line file — only those rows carry `changed`
3. Toggle theme — both sides recolour without re-highlighting
4. Scroll a long diff — no horizontal jump as rows mount (fixed gutter width)
5. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Highlighting after injecting gutters/markers → the marker text becomes part of the source and the token output is wrong.
- Splitting the raw source and highlighting each line → a multi-line string or block comment loses its token state on every line after the first.
- Putting line numbers inside `<code>` text → copy-paste includes the numbers; keep them in a separate cell with `user-select: none`.
- Re-highlighting both sides on every scroll or selection change → memoize on `(source, language)`.
- Rendering the diff HTML without checking escaping → a malicious diff string becomes markup; the highlighter escapes, the wrapper must not unescape.

## Related

- `references/apis.md`
- `best-practices/tanstack-highlight.md`
- `usecases/highlight-code-block.md`
- `usecases/markdown-fences-pipeline.md`
