# Agent Browser Commands

## Open And Navigate

```bash
agent-browser open <url> --viewport <width> <height> --device <device>
agent-browser navigate <url>
agent-browser reload
agent-browser close
```

## Capture

```bash
agent-browser screenshot <file.png> --viewport <w> <h>
agent-browser snapshot -i > snapshot.json
agent-browser pdf <file.pdf>
```

## Interactions

```bash
agent-browser click @<ref>
agent-browser click <selector>
agent-browser type @<ref> "text"
agent-browser select @<ref> "option"
agent-browser hover @<ref>
agent-browser press Tab
agent-browser press Enter
agent-browser press Escape
```

## Inspection

```bash
agent-browser get text @<ref>
agent-browser get html @<ref>
agent-browser get value @<ref>
agent-browser get attr @<ref> <attr>
agent-browser get title
agent-browser get url
agent-browser get count <selector>
agent-browser is visible @<ref>
agent-browser is enabled @<ref>
```

## Wait

```bash
agent-browser wait @<ref>
agent-browser wait --load networkidle
agent-browser wait --load domcontentloaded
agent-browser wait 2000
```

## Snapshot Refs

- ใช้ `@<ref>` จาก `agent-browser snapshot -i` แทน CSS selector เมื่อได้
- ถ้าไม่มี `@ref` ให้ใช้ stable selector เช่น `[data-testid="..."]`
