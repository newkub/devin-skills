# Use Case — Order Plugins And Drop Duplicates

> Two plugins that each transform the same source compile it twice, and order decides whether an auto-import plugin sees the file before or after the framework adapter has rewritten it. Both problems look like "the plugin is broken". Source: https://vite.dev/plugins/ (accessed 2026-10-21)

## 1. Inventory what is already there

```ts
// vite.config.ts
export default defineConfig({
  plugins: [AutoImport({ /* ... */ }), Components({ /* ... */ }), solid(), UnoCSS()],
});
```

Write down each plugin's job in one word — transform, resolve, asset, dev DX, platform. Two entries with the same word are the duplicate you are looking for.

## 2. Detect overlap before adding anything

The pairs that keep turning up:

| Job | Two plugins that do it |
|-----|------------------------|
| SVG as components | `vite-plugin-svgr` + `unplugin-icons` |
| Auto-import | `unplugin-auto-import` + a framework's built-in resolver |
| CSS engine | `UnoCSS` + a second atomic-CSS plugin |
| Icons | `unplugin-icons` + a hand-rolled icon loader |

Keep one. Removing the loser also means removing its generated `.d.ts` and its devDependency — a stale `auto-imports.d.ts` keeps the types alive after the plugin is gone.

## 3. Put transforms before the framework adapter

```ts
plugins: [
  AutoImport({ /* ... */ }),
  Components({ /* ... */ }),
  solid(),
]
```

Auto-import and resolver plugins register their transforms on the original source, so they go first; the framework adapter compiles JSX afterwards. Reversing the two produces unresolved identifiers that only appear in the build, not in the editor.

## 4. Reach for `enforce` only when order cannot express it

```ts
plugins: [
  { ...svgr(), enforce: "pre" },
  solid(),
]
```

`enforce: "pre"`/`"post"` moves one plugin to the edge of the list. Using it to fix an ordering bug hides the real dependency instead of stating it — prefer a visible order in the array.

## 5. Let the dev server prove it

1. `bunx vite` — the plugin's output must work in dev, not just compile
2. `bunx vite build` — the production build is the second gate, because some plugins only run in build
3. Run dev once so type-augmentation files (`.d.ts`) are generated, then typecheck

## 6. Verify

1. `plugins` array read top to bottom matches the intended order — transforms, adapters, then post-processing
2. No job has two plugins; the removed one left no generated file and no dependency behind
3. `bunx vite build` clean on a cold `node_modules` (no cached artifacts hiding a missing plugin)
4. Dev server: the transformed output appears (auto-imported symbol resolves, svg renders, icon set loads)
5. `/report` table — `Plugin`, `Purpose`, `Version`, `Status` — so the next reader does not re-litigate the choice

## Pitfalls

- Adding a second plugin for a job the config already covers, because the first one's failure was actually an ordering problem.
- Listing an auto-import plugin after the framework adapter: the transform runs on compiled output and matches nothing.
- `enforce: "post"` on a transform that must run early — it looks like a fix and silently reorders everything.
- Leaving a removed plugin's generated `.d.ts` in the repo, so imports keep typechecking with no provider.
- Upgrading a plugin across a major version in the same change as reordering the array: two variables, one failure.

## Related

- `references/apis.md`
- `best-practices/vite-plugins.md`
- `workflows/frontend-lib/SKILL.md`
- `workflows/unified/SKILL.md`
- `usecases/rolldown-compat-check.md`
