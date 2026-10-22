# Use Case — Check A Plugin Against Rolldown Before Committing To It

> Vite 8 builds on Rolldown. A plugin written against Rollup internals installs cleanly, passes review, and then fails — or worse, silently produces nothing — at build time. Check the coupling before the dependency lands. Source: https://vite.dev/plugins/ (accessed 2026-10-21)

## 1. Read the plugin's declared support

Open the plugin's `package.json` on the registry page (or in `node_modules/<plugin>/package.json`) and read `peerDependencies.vite`. A range that predates Vite 8 is a warning, not a verdict — the entries in `workflows/frontend-lib/SKILL.md` and `workflows/unified/SKILL.md` exist to compare against.

## 2. Look for Rollup coupling

The parts that do not port cleanly are the ones touching Rollup itself:

- a runtime `import ... from "rollup"` (types-only imports are fine)
- reaching into `this.parse`, `this.getModuleInfo`, or mutating the module graph
- patching another plugin's `transform`/`renderChunk` output positionally
- relying on `output` option shapes that Rolldown renames

A plugin that only implements `resolveId`/`load`/`transform` over strings is usually safe; one that manipulates the bundle is the one to test.

## 3. Prove it in a real build, not in dev

```bash
bun add -D <plugin>
bunx vite build
```

`vite build` is the gate: dev serves modules unbundled, so a bundle-stage incompatibility does not appear there. Build twice — cold and with the cache warm — because plugin caches are where a half-working plugin hides.

## 4. Treat a silent no-op as a failure

The dangerous case is a plugin that throws nothing and emits nothing: assets are not inlined, the `.d.ts` is not written, the icon set is empty. Assert the output, not the exit code:

```bash
bunx vite build && ls dist/**/*.svg dist/*.html
```

If the artifact the plugin is supposed to produce is missing, it is unsupported regardless of a clean exit.

## 5. Decide, then record it

Three honest outcomes:

1. A maintained alternative does the job — swap it (same job, one plugin only).
2. No alternative exists — keep the project on the Vite version the plugin supports, and say so in the config comment.
3. The plugin is optional — drop it and reproduce the behaviour with a few lines of local plugin code.

Whichever it is, it belongs in the `/report` table (`Plugin`, `Purpose`, `Version`, `Status`) — otherwise the next person adds the same plugin again.

## 6. Verify

1. `bunx vite build` clean from a cold `node_modules`
2. The plugin's own artifact exists in `dist/` (that is the real proof)
3. `bunx vite` dev server still works — the swap did not break the fast path
4. No Rollup-only plugin left in `plugins` with a comment explaining why
5. Bundle size compared before/after when the swap replaced a transform

## Pitfalls

- Judging compatibility by "it installed" or by the dev server alone.
- A `peerDependencies` range of `>=4` read as "supports Vite 8" — an unbounded range is a claim, not a test.
- Keeping a Rollup-only plugin and losing tree-shaking silently, because the plugin still emits valid but unoptimized output.
- Chaining two plugins that both patch `renderChunk` — under Rolldown the second one may see a different shape.
- Removing the old plugin without removing its generated files, so the build keeps working for the wrong reason.

## Related

- `references/apis.md`
- `best-practices/vite-plugins.md`
- `workflows/frontend-lib/SKILL.md`
- `workflows/unified/SKILL.md`
- `usecases/plugin-order-and-duplicates.md`
