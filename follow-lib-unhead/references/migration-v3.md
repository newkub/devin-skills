# Unhead — v2 → v3 Migration

> Source: https://unhead.unjs.io/ (accessed 2026-10-24), v3 release notes

v3 removes compatibility shims instead of keeping them. Migrate mechanically with the CLI, then finish the behavioural changes by hand.

## 1. Run the codemod

```bash
unhead migrate --dry-run
unhead migrate
```

Review the diff before committing. The CLI covers import paths and property renames; it cannot fix ordering, duplication, or plugin defaults.

## 2. Property renames

| v2 | v3 | note |
|---|---|---|
| `children` | `innerHTML` | script/style content |
| `hid` | `key` | tag identity |
| `vmid` | `key` | Vue-specific identity |
| `body: true` | `tagPosition: 'bodyClose'` | body placement |
| `body: 'start'` | `tagPosition: 'bodyOpen'` | body placement |
| `useServerHead` | `useHead` | server/client unified |
| `useServerHeadSafe` | `useHeadSafe` | server/client unified |
| `useServerSeoMeta` | `useSeoMeta` | server/client unified |

## 3. Entry points

| v2 | v3 |
|---|---|
| `createHeadCore` | `createHead` from `unhead/client` or `unhead/server` |
| `createHead` from `unhead` | framework package (`@unhead/vue/client`, …) |
| `extractUnheadInputFromHtml` | `parseHtmlForUnheadExtraction` from `unhead/parser` |
| `@unhead/addons` | `@unhead/bundler` |
| `renderSSRHead` returning a promise | `renderSSRHead` returning a payload synchronously |

## 4. Types

| v2 | v3 |
|---|---|
| `Head` | `SerializableHead` |
| `MetaFlatInput` | `MetaFlat` |
| `RuntimeMode` | removed — split by entry point instead |
| `HeadEntry` with `_h`/`_d` | handle API (`push` returns `{ dispose, patch }`) |

## 5. Behaviour changes

1. **ESM only** — Node 20+, `"type": "module"`, no CJS build. A `require()` failure is a broken install.
2. **Synchronous render** — `renderSSRHead()` and `renderDOMHead()` return values directly; remove `await` and any promise plumbing.
3. **`init` hook removed** — move setup into `createHead({ plugins })` or a plugin's `tags:resolve` hook.
4. **`TemplateParamsPlugin` and `AliasSortingPlugin` are opt-in** — a project relying on `%param%` templates or alias ordering must register them.
5. **`useServer*` composables removed** — one composable now works on both sides; do not branch by runtime to pick a different name.
6. **Legacy compat plugin deleted** — legacy props are gone, not deprecated.

## 6. Migration checklist

1. `unhead migrate --dry-run`, inspect, then apply.
2. Add `ValidatePlugin` from `unhead/plugins` and run the app — it warns about removed properties.
3. Replace every `await renderSSRHead(...)` / `await renderDOMHead(...)`.
4. Register `TemplateParamsPlugin` / `AliasSortingPlugin` where the app depended on defaults.
5. Verify per-framework package versions are all v3 and identical.
6. Remove `ValidatePlugin` and the legacy compat imports once the warnings are clean.
7. SSR pass: compare server HTML against client-rendered `<head>`; duplicates after upgrade usually mean a removed `hid` that is now an unkeyed duplicate.

## Related

- `references/apis.md`
- `usecases/ssr-render.md`
- `best-practices/unhead.md`
