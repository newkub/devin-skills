# Advanced APIs - Bun

## Overview

Bun provides advanced APIs for specialized use cases.

## Image Processing

```typescript
const image = Bun.image("photo.jpg")
const resized = image.resize(200, 200)
const converted = resized.convert("png")
await Bun.write("output.png", converted)
```

## WebView

```typescript
const webview = new Bun.WebView({
  url: "https://example.com",
  width: 800,
  height: 600
})
```

## Cron Jobs

```typescript
Bun.cron("* * * * *", () => {
  console.log("Run every minute")
})
```

## Terminal

```typescript
const term = new Bun.Terminal({
  stdout: process.stdout,
  stderr: process.stderr
})
```

## HTTP Client

### fetch

```typescript
const response = await fetch("https://api.example.com")
const data = await response.json()
```

### Bun.curl

```typescript
const response = await Bun.curl("https://example.com")
```

---

**See also:**
- [Image Processing](https://bun.sh/docs/runtime/bun-image)
