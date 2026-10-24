# Use Case — Chat-Style Transcript With Lists, Diffs, And Markdown

> Build an agent chat pane where the transcript scrolls bottom-anchored, rows are virtualized, and assistant messages render native code, diffs, and rendered Markdown. Source: <https://gpuix.dev/docs> (accessed 2026-10-23).

## 1. Shape The Layout

Three regions, one flex column: header, transcript, composer. The transcript must own its scroll, so it needs a bounded height and `minHeight: 0` to shrink below content.

```tsx
<div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#111111' }}>
  <div style={{ display: 'flex', padding: 12, borderWidth: 0, borderBottomWidth: 1, borderBottomColor: '#232323' }}>
    <text style={{ color: '#e2e2e2' }}>Agent</text>
  </div>
  <Transcript messages={messages} />
  <Composer onSend={send} />
</div>
```

## 2. Virtualize The Transcript

```tsx
<virtual-list
  alignment="bottom"
  followTail
  estimatedItemHeight={180}
  style={{ flexGrow: 1, minHeight: 0 }}
>
  {messages.map((message) => (
    <MessageRow key={message.id} message={message} />
  ))}
</virtual-list>
```

| Prop | Value here | Why |
|------|-----------|-----|
| `alignment` | `"bottom"` | Chat reads from the newest message up |
| `followTail` | enabled | New messages keep the viewport pinned when already at the end |
| `estimatedItemHeight` | `180` | Seeded row height; rows correct themselves as they measure |
| `overdraw` | default `512` | Only raise it when tall rows flicker at the edges |

A direct host child of `virtual-list` is one row. Give each row a stable `key` and make that child a single host root — wrapping it in a fragment or splitting it into two siblings desynchronizes row identity and breaks scroll anchoring.

## 3. Render Assistant Content By Kind

```tsx
function MessageRow({ message }: { message: Message }) {
  switch (message.kind) {
    case 'text':
      return (
        <div style={{ padding: 12 }}>
          <text style={{ color: '#e2e2e2' }}>{message.content}</text>
        </div>
      )
    case 'code':
      return (
        <div style={{ padding: 12 }}>
          <code
            code={message.content}
            language="typescript"
            showLineNumbers
            style={{ padding: 12, borderRadius: 8, backgroundColor: '#0b0b0b' }}
          />
        </div>
      )
    case 'diff':
      return <DiffRow patch={message.patch} />
    case 'markdown':
      return (
        <div style={{ padding: 12 }}>
          <markdown source={message.content} onLinkClick={(e) => openExternal(e.value)} />
        </div>
      )
  }
}
```

`<code>` has no surface of its own: you supply the padding, radius, and background. It never wraps and owns its own horizontal scroller, so long lines scroll inside the block instead of widening the transcript.

## 4. Collapse Long Diffs

```tsx
function DiffRow({ patch }: { patch: string }) {
  const [open, setOpen] = useState(false)
  return (
    <diff
      patch={patch}
      wordDiff
      maxLines={open ? undefined : 24}
      collapsedPaths={['pnpm-lock.yaml']}
      onShowMore={() => setOpen(true)}
      onToggleFile={(e) => toggleFile(e.value)}
      onLineClick={(e) => e.value && openAt(e.value)}
    />
  )
}
```

`<diff>` flows with the content by default — no fixed height, no scroller. Only wrap it in a bounded, scrolling container when you are building a full-window diff viewer; inside a transcript that would nest two scroll areas.

## 5. Render Markdown, Not HTML

```tsx
<markdown
  source={readme}
  onLinkClick={(e) => openExternal(e.value)}
  theme={{ metrics: { mdCodeFontSize: 13 } }}
/>
```

`<markdown>` renders GFM natively. There is no `dangerouslySetInnerHTML` and no HTML passthrough: links arrive as events, not anchors, so you decide whether a click opens the system browser or stays in-app.

## 6. Keep The Composer Out Of The Transcript

```tsx
function Composer({ onSend }: { onSend: (text: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <div style={{ display: 'flex', padding: 12, gap: 8 }}>
      <input
        value={value}
        onChange={(e) => setValue(e.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            onSend(value)
            setValue('')
          }
        }}
        style={{ flexGrow: 1, padding: 8, backgroundColor: '#1a1a1a', borderRadius: 6 }}
      />
      <div
        onClick={() => onSend(value)}
        style={{ padding: 8, borderRadius: 6, cursor: 'pointer', backgroundColor: '#2563eb' }}
      >
        <text style={{ color: '#ffffff' }}>Send</text>
      </div>
    </div>
  )
}
```

`<input>` has no default inner padding, so the explicit `padding` above is required for it to look right. There is no `<button>`; the send control is a `<div onClick>` with `cursor: 'pointer'`.

## Pitfalls

- Mapping thousands of `div`s instead of using `<virtual-list>`: the frame drops long before the scroll does.
- Nesting `<virtual-list>` inside an unbounded parent: the list measures zero and renders nothing. Every ancestor needs a defined height or `flexGrow` plus `minHeight: 0`.
- Putting `<text>` inside `<text>`: it does not compose. Split paragraphs into sibling `<text>` elements in a flex column.
- Expecting `white-space: pre` on `<text>`: unsupported. Use `<code>` for anything that must preserve spacing.
- Transparent message backgrounds over the transcript: every frame repaints the layers below. Fill rows with an opaque color.
- Unstable row keys: index keys plus virtualized scroll anchoring scroll you to the wrong row after an insert.

## Related

- [apis.md](../references/apis.md)
- [text-and-collections.md](../best-practices/text-and-collections.md)
- [styling-and-events.md](../best-practices/styling-and-events.md)
- [headless-controls-and-overlays.md](./headless-controls-and-overlays.md)
