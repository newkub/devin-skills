# Use Case — Make a Package Publish-Ready

> Take a workspace package from "builds locally" to "installs correctly for every consumer". Source: https://tanstack.com/config/latest/docs/package-structure (accessed 2026-10-20)

## 1. Confirm the package contract

```json
{
  "name": "@acme/my-lib",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "files": ["dist"],
  "sideEffects": false
}
```

Every TanStack package sets `"type": "module"` and an explicit `exports` map, and keeps `main`, `module`, and `types` for older resolvers. `files` is an allowlist — anything not listed is published anyway only if npm defaults apply, which is how test fixtures leak.

## 2. Emit every promised format

```bash
pnpm build
```

Then confirm `dist/` contains exactly the files the map names: ESM, CJS, and the declaration file each condition points at. A path in `exports` that does not exist fails for consumers even though the build exited zero.

## 3. Check what would ship

```bash
npm pack --dry-run
```

Read the file list, not just the size. `src/`, tests, fixtures, and stray config files must not appear. If `dist/` is missing from the list, `files` or `.npmignore` excludes it.

## 4. Run the publish gates

```bash
pnpm test:build
bunx publint
bunx @arethetypeswrong/cli --pack .
```

`publint --strict` catches exports-map and format mismatches and fails on warnings. `attw` proves the declarations resolve under each `moduleResolution` a consumer may set. The build alone validates neither.

## 5. Prove it as a consumer

1. `pnpm pack` and install the tarball into a scratch project
2. `import` it from an ESM file, then `require` it from a CJS file
3. `/run-typecheck` under `"moduleResolution": "bundler"` and again under `"node16"`

A package that only ever gets imported by its own tests is unverified — the tarball is the real artifact.

## 6. Cap the published surface

1. `exports` seals every path it does not list; add a subpath deliberately, never with `"./*": "./dist/*"`
2. Keep `peerDependencies` for host-provided libraries and `devDependencies` for type-only packages
3. Remove `src` from `files` if it was added to make the build look complete
4. Re-run `npm pack --dry-run` after any metadata change

## Verify

- `npm pack --dry-run` lists only `dist/`, `package.json`, `README.md`, and `LICENSE`
- `publint --strict` reports zero warnings
- `attw` shows no red rows
- The scratch consumer imports and typechecks under both resolvers
- No dependency sits in `dependencies` that is only needed for types

## Pitfalls

- Shipping `src/` in `files` because `dist/` looked incomplete, leaking sources and doubling the tarball.
- `"type": "module"` with a `.js` CJS output, so `require` fails while the build stays green.
- Adding a top-level `types` field while `exports` exists and expecting consumers to use it.
- Trusting `pnpm build` alone; the build never validates the exports map.
- Packing from a stale `dist/` after changing source without rebuilding.
- Publishing peer-provided libraries as regular dependencies, which duplicates them in the consumer.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/build-published-package.md`
- `usecases/fix-exports-resolution.md`
- `usecases/release-with-changesets.md`
