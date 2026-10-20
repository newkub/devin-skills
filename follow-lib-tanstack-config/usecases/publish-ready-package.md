# Use Case — Make a Package Publish-Ready

> Take a workspace package from "builds locally" to "installs correctly for every consumer". Source: https://tanstack.com/config/latest (accessed 2026-10-20)

## 1. Install the toolchain

```bash
bun add -D @tanstack/config
```

Read the current page before writing config: the file name and the available checks change between minor releases.

## 2. Describe the published surface

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "sideEffects": false,
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
  }
}
```

`types` must be the first condition inside each entry. A `types` that comes after `import`/`require` is never reached, and every consumer silently gets `any`.

## 3. Emit every promised format

1. `/run-build`
2. Confirm `dist/` really contains the three files the exports map promises — ESM, CJS, and `.d.ts`
3. Confirm internal imports use extensions the ESM output can resolve

## 4. Check what would be published

```bash
npm pack --dry-run
bunx publint
bunx @arethetypeswrong/cli --pack .
```

`npm pack --dry-run` prints the file list. `publint` catches exports-map and format mismatches. `attw` proves the types resolve under each `moduleResolution` a consumer may set.

## 5. Prove it as a consumer

1. `bun pm pack` and install the tarball into a scratch project
2. `import` it from an ESM file, then `require` it from a CJS file
3. `/run-typecheck` in the scratch project under `"moduleResolution": "bundler"` and again under `"node16"`

A package that only ever gets imported by its own tests is unverified — the tarball is the real artifact.

## Pitfalls

- Shipping `src/` in `files` because `dist/` looked incomplete, which leaks sources and doubles the tarball.
- `"type": "module"` with a `.js` CJS output, so `require` fails at runtime while the build stays green.
- Dependency listed in `dependencies` when it is only used for types — use `devDependencies` plus `peerDependencies` for host-provided packages.
- Trusting `/run-build` alone; the build never validates the exports map.

## Related

- `references/apis.md`
- `best-practices/tanstack-config.md`
- `usecases/fix-exports-resolution.md`
