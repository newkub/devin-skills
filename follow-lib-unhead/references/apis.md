# Unhead — Module Map And API Surface

> Source: https://unhead.unjs.io/ (accessed 2026-10-24), npm export map of `unhead@3.4.3`

## Packages

| package | use for | entry points |
|---|---|---|
| `unhead` | framework-agnostic core | `unhead/client`, `unhead/server`, `unhead/plugins`, `unhead/scripts`, `unhead/parser`, `unhead/validate`, `unhead/stream/*`, `unhead/types`, `unhead/utils`, `unhead/legacy`, `unhead/minify` |
| `@unhead/vue` | Vue 3 + Nuxt internals | `@unhead/vue/client`, `@unhead/vue/server` |
| `@unhead/react` | React 18/19 | `@unhead/react` |
| `@unhead/solid-js` | SolidJS | `@unhead/solid-js` |
| `@unhead/svelte` | Svelte 4/5 | `@unhead/svelte` |
| `@unhead/angular` | Angular 16+ | `@unhead/angular` |
| `@unhead/bundler` | build-time auto-import + tree-shaking (renamed from `@unhead/addons` in v3) | bundler plugin |
| `@unhead/schema-org` | Schema.org JSON-LD | `UnheadSchemaOrg` plugin |
| `unhead/stream/server` | streaming SSR | `createStreamableHead`, `wrapStream`, `prepareTemplate`, `renderSSRHeadSuspenseChunk`, `renderShell`, `createBootstrapScript` |

All `@unhead/*` packages share the core version — upgrade them together.

## Core API

| api | description | signature/example |
|---|---|---|
| `createHead` | create a head instance | `createHead({ plugins: [] })` |
| `head.push` | register an entry imperatively, returns a dispose handle | `const entry = head.push({ title: 'A' }); entry.dispose()` |
| `head.patch` | replace an existing entry by handle | `entry.patch({ title: 'B' })` |
| `useHead` | reactive head entry composable | `useHead({ title, meta: [{ name: 'description', content: desc }] })` |
| `useSeoMeta` | flat-key SEO/social tags | `useSeoMeta({ title, description, ogTitle, twitterCard: 'summary_large_image' })` |
| `useHeadSafe` | allowlisted tags/attributes only | `useHeadSafe({ meta: [{ name: 'description', content: userInput }] })` |
| `useScript` | script loader with API proxying | `useScript(url, { use: () => window.sdk })` |
| `renderSSRHead` | serialize the resolved head to a payload (sync in v3) | `const payload = renderSSRHead(head)` |
| `renderDOMHead` | apply entries to the real DOM | `renderDOMHead(head)` |
| `defineHeadPlugin` | declare a plugin | `defineHeadPlugin({ key: 'my-plugin', hooks })` |
| `parseHtmlForUnheadExtraction` | extract entries from rendered HTML | `unhead/parser` |
| `renderSSRHeadSuspenseChunk` | stream one suspended chunk's head | `unhead/stream/server` |

## Entry Shape

| field | type | notes |
|---|---|---|
| `title` | `string` | one resolved title, last/highest priority wins |
| `titleTemplate` | `string \| ((title) => string)` | `'%s — Site'` |
| `meta` | `MetaFlat` object or array | `name`/`property`/`content`, `key` for identity |
| `link` | array | `rel`, `href`, `hreflang`, `as` |
| `script` | array | `src`, `innerHTML`, `type`, `tagPosition` |
| `htmlAttrs` / `bodyAttrs` | object | `lang`, `class`, `dir` |
| `tagPriority` | `'critical' \| 'high' \| 'low' \| number` | ordering in the payload |
| `key` | `string` | deduplication identity — replaced `hid`/`vmid` in v3 |
| `tagPosition` | `'head' \| 'bodyOpen' \| 'bodyClose'` | replaced `body: true` in v3 |

## SSR Payload

```ts
interface SSRHeadPayload {
  headTags: string
  bodyTags: string
  bodyTagsOpen: string
  htmlAttrs: string
  bodyAttrs: string
}
```

Inject each field verbatim into the matching document position — never re-parse or re-order it.

## Hooks

| hook | when | typical use |
|---|---|---|
| `tags:resolve` | after all entries are collected, before DOM/SSR output | rewrite, filter, or inject tags |
| `ssr:render` | before serialization on the server | mutate the resolved tag set |
| `ssr:rendered` | after serialization | post-process `ctx.html` |
| `dom:beforeRender` / `dom:rendered` | around DOM application | measure or patch the real DOM |

## Plugins

| plugin | package | default in v3 |
|---|---|---|
| `ValidatePlugin` | `unhead/plugins` | no — enable during a v2 migration |
| `TemplateParamsPlugin` | `unhead/plugins` | no — register explicitly for `%param%` templates |
| `AliasSortingPlugin` | `unhead/plugins` | no — register explicitly for alias ordering |
| `UnheadSchemaOrg` | `@unhead/schema-org` | no |

## Related

- `references/migration-v3.md`
- `best-practices/unhead.md`
