# Bunup Best Practices

Guidelines for bundling TypeScript libraries with Bunup — entry/format selection, dts, externals, and quality gates

## Recommended Patterns

### Entry And Format Selection

- Let auto-detect do its job (`index.ts`, `src/index.ts`, `cli.ts`) — set `entry` in `bunup.config.ts` only when the structure is non-standard
- Build `esm` only for modern tooling; add `cjs` only when consumers genuinely need `require()` — dual formats add output/maintenance
- Use `--exports` so Bunup generates the `package.json` `exports` map automatically — never hand-write exports that drift from the real output
- Multi-entry libraries: declare the entry array explicitly and enable `splitting` to share chunks across entries — smaller output than inlining duplicates in every file

### Type Declarations

- Always enable `dts` for public libraries — types are the primary API surface for TS consumers
- Keep `declaration`/`declarationMap` consistent with `tsconfig.json` — dts build failures usually come from tsconfig resolution gaps (paths, project references)
- If the dts build is slow, check whether dependency types get bundled in — external deps should not have their types rolled into the output

### Externals Discipline

- Packages in `package.json` `dependencies`/`peerDependencies` must stay external, never bundled — bundle only your own code
- `peerDependencies` for framework libs (react, vue) — the consumer owns the version
- After each build check that no dep code leaked into the bundle — `bunup` reports output size; if abnormally large, find the dep that slipped in

### Quality Gates

- Run `publint` and `attw --pack` after build in CI — catch wrong exports map/type resolution before publish
- Use `clean: true` (or `--clean`) to wipe `dist/` before building — stale files from old builds are a silent bug at publish
- Use `minify` for production builds only — dev builds must stay readable for debugging

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Bundling runtime deps into the output | bloated package, version conflicts with consumers | keep deps in `dependencies`/`peerDependencies` external |
| Hand-writing `exports` | map does not match real output → import fails | use `--exports` to generate from the build |
| `--watch` in CI | job hangs forever | watch is for local dev only |
| Silent dts failure | published without types | fail the build when dts fails + `attw` in CI |
| Auto-detected entry misses | bundles the wrong entry or finds none | set `entry` explicitly for unusual structures |
| CJS+ESM interop | odd `default` export in CJS | test real require() or use `attw` to catch interop issues |
| Not cleaning dist | publishes mixed with old files | always `clean: true` in config |

## Do / Don't

| Do | Don't |
|---|---|
| `bunup` build in CI then `attw --pack` | publish without checking type resolution |
| set `sourcemap: true` for a library | minify without sourcemaps (undebuggable) |
| keep `bunup.config.ts` minimal — conventions cover it | long configs duplicating defaults |
| publish only `dist/` via the `files` field | publish the whole repo including src/tests |
| exploit Bun native bundler speed — fast CI builds | stack another bundler (rollup over bunup output) needlessly |

## Performance And CI Notes

- Bunup uses the Bun native bundler — builds are very fast; the bottleneck is usually dts generation, not JS output
- If dts is slow: shrink the type surface (less inference, explicit return types on public APIs) or split the types build into a parallel step
- CI: `bun install --frozen-lockfile` → `bunup` → `publint` + `attw` → optional `npm publish --dry-run`
- `--watch` mode suits local library dev paired with `bun link` — never use it in CI
- Build caching is barely needed since Bun is fast — but caching `node_modules` still helps CI a lot
- Splitting only helps multi-entry builds; a single-entry lib should leave it off since there is no shared chunk to split

## Config Guidance

A balanced `bunup.config.ts`:

```ts
import { defineConfig } from 'bunup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  minify: false,
  sourcemap: true
})
```

Relevant `package.json`:

```json
{
  "files": ["dist"],
  "scripts": {
    "build": "bunup",
    "build:watch": "bunup --watch",
    "prepublishOnly": "bun run build && publint && attw --pack ."
  }
}
```

- Match `target` to the real consumer (`node` vs `browser`) — output differs in shims/globals
- When building both lib + CLI: separate the `src/cli.ts` entry and point the `bin` field at the correct output
