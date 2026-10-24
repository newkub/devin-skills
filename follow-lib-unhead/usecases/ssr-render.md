# Use Case — Render Head Tags During SSR

> One head instance per request, one synchronous payload, no hand-merged HTML. Source: https://unhead.unjs.io/ (accessed 2026-10-24)

## 1. Create a head instance per request

```ts
// server.ts
import { createHead } from '@unhead/vue/server'

export async function render(url: string) {
  const head = createHead()          // per request — never module scope
  const app = createSSRApp(App)
  app.use(head)

  return { app, head }
}
```

A module-level instance accumulates entries from every request — the classic SSR head leak.

## 2. Render the app, then serialize the head

```ts
import { renderToString } from 'vue/server-renderer'
import { renderSSRHead } from '@unhead/vue/server'

const { app, head } = await render(url)
const html = await renderToString(app)

const payload = renderSSRHead(head) // synchronous in v3
```

`renderSSRHead` must run after the app has finished rendering so async components and route-level entries are included.

## 3. Inject the payload

```ts
const document = `
<!DOCTYPE html>
<html${payload.htmlAttrs}>
  <head>
    ${payload.headTags}
  </head>
  <body${payload.bodyAttrs}>
    <div id="app">${html}</div>
    ${payload.bodyTagsOpen}
    ${payload.bodyTags}
  </body>
</html>
`
```

Each field goes to its own position. Reordering `headTags` or concatenating them with template literals breaks priority and deduplication.

## 4. Hydrate with the same entries

```ts
// client entry
import { createHead } from '@unhead/vue/client'

const head = createHead()
createApp(App).use(head).mount('#app')
```

The client instance resolves the same entries during hydration; extra client-only entries are hydration mismatches, not enhancements.

## 5. Stream when the framework streams

```ts
import {
  createStreamableHead,
  wrapStream,
  prepareTemplate,
  renderSSRHeadSuspenseChunk,
} from 'unhead/stream/server'

const streamable = createStreamableHead(head)
const shell = prepareTemplate(template, renderSSRHead(head), streamable)
// emit the shell, then per suspended chunk:
const chunk = renderSSRHeadSuspenseChunk(streamable, chunkId)
```

`createBootstrapScript` and `renderShell` cover the initial document and client takeover; do not invent a second partial-injection format.

## Pitfalls

- `await renderSSRHead(head)` — v3 is synchronous.
- Serializing before `renderToString` completes drops lazy/route entries.
- Creating the head instance in a module or a route cache shares state across users.
- Manually escaping values again — the payload is already escaped for HTML context.
- Verifying social previews before the SSR HTML actually contains the tags.

## Related

- `references/apis.md`
- `references/migration-v3.md`
- `usecases/spa-head-setup.md`
- `best-practices/unhead.md`
