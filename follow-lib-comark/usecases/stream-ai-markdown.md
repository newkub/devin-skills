# Use Case — Stream AI Output as Stable Markdown

> Render tokens as they arrive without broken markup from unfinished code fences, bold, or components. Source: https://comark.dev (accessed 2026-10-20)

## 1. Install the framework renderer

```bash
bun add comark @comark/react   # or @comark/vue, @comark/svelte, @comark/angular
```

## 2. Feed partial content to the streaming component

```tsx
import { Markdown } from "@comark/react"

export function Answer({ text }: { text: string }) {
  return <Markdown streaming>{text}</Markdown>
}
```

The auto-closing parser completes unfinished syntax on each frame, so a half-written code fence still renders as a code block instead of leaking raw backticks into the page.

## 3. Keep the full text as the source of truth

```tsx
const [text, setText] = useState("")

for await (const chunk of stream) {
  setText((prev) => prev + chunk)
}
```

Do not render only the newest chunk — the component expects the accumulated text so it can close open constructs.

## 4. Vue and Svelte

```vue
<Suspense>
  <Markdown :streaming="true">{{ text }}</Markdown>
</Suspense>
```

```svelte
<Markdown value={text} streaming />
```

Vue parsing is async internally, so the component must sit inside `<Suspense>`.

## 5. Bound what the stream may render

Register only the components the chat supports; anything else stays inert text. When messages can contain raw HTML from tools, sanitize before rendering.

## Pitfalls

- Rendering chunk-by-chunk instead of the accumulated buffer → markdown constructs split across frames and flicker.
- Mounting the markdown component outside `<Suspense>` in Vue → warnings and blank output.
- Allowing arbitrary component names from model output → content becomes executable UI; register an allowlist.
- Re-parsing the whole document on every token for long answers → throttle updates or virtualize once the message is large.

## Related

- `references/apis.md`
- `best-practices/comark.md`
- `usecases/render-markdown-html.md`
