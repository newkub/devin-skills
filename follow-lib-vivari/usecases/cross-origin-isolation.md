# Cross-Origin Isolation Recipes

Vivari needs `SharedArrayBuffer`, which requires a cross-origin isolated page.

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

## Vite (dev + preview)

```ts
import { defineConfig } from "vite"

const isolation = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
}

export default defineConfig({
  server: { headers: isolation },
  preview: { headers: isolation },
})
```

Scope it when only one route needs isolation — a Vite plugin can add headers per path:

```ts
function isolationPlugin() {
  return {
    name: "coop-coep",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/playground")) {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        }
        next()
      })
    },
  }
}
```

## Cloudflare Pages / Workers

`public/_headers`:

```text
/playground/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

Workers equivalent:

```ts
const isolation = {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
}

export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)
    const headers = new Headers(response.headers)
    for (const [k, v] of Object.entries(isolation)) headers.set(k, v)
    return new Response(response.body, { status: response.status, headers })
  },
}
```

## Netlify

`_headers`:

```text
/playground/*
  Cross-Origin-Opener-Policy: same-origin
  Cross-Origin-Embedder-Policy: require-corp
```

## Nginx

```nginx
location /playground/ {
  add_header Cross-Origin-Opener-Policy same-origin;
  add_header Cross-Origin-Embedder-Policy require-corp;
}
```

## Express

```ts
app.use("/playground", (_req, res, next) => {
  res.set("Cross-Origin-Opener-Policy", "same-origin")
  res.set("Cross-Origin-Embedder-Policy", "require-corp")
  next()
})
```

## Iframes

A nested document does not inherit the embedder's policy. Every document you frame must send its own `require-corp` (or `credentialless`) response, even same-origin — otherwise the browser renders "refused to connect".

Chromium-only alternative for framed apps:

```text
Document-Isolation-Policy: isolate-and-require-corp
```

Then declare it at boot so the preview Service Worker mirrors it:

```ts
await Vivari.boot({ documentIsolationPolicy: "isolate-and-require-corp" })
```

The declared value must match the header the page is really served with. Other browsers ignore it and still need host COOP/COEP.

## Verifying

```ts
import { isCrossOriginIsolated } from "@vivari/core"

if (!isCrossOriginIsolated()) {
  // render "isolation headers missing" state
}
```

Check `crossOriginIsolated` in DevTools console, or inspect response headers on the top-level document and on the `sw.js` response.
