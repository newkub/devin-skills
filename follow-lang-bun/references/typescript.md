# TypeScript On Bun

Bun runs `.ts` and `.tsx` directly — internal transpilation, no need for `tsc`, `ts-node`, `tsx`, or a build step. Docs: https://bun.com/docs/typescript

## Key Facts

- **The runtime does not typecheck** — Bun strips types and runs; typecheck separately with `bunx tsc --noEmit`
- Type-aware rules are not supported at runtime (e.g. `const enum`, `import =`) — use plain `enum` + ESM imports instead
- JSX/TSX supported directly — configured via `tsconfig.json` (`jsx`, `jsxFactory`, `jsxImportSource`) or `bunfig.toml`
- Decorators, `emitDecoratorMetadata` — per `tsconfig.json` (experimental support)

## bun-types

```bash
bun add -d bun-types
```

Provides type definitions for the `Bun.*` globals, `bun:test`, `bun:jsc`, `bun:sqlite`, `bun:ffi`, etc.

```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "types": ["bun-types"],   // or "bun" in newer tsconfig versions
    "module": "esnext",
    "moduleResolution": "bundler",
    "target": "esnext",
    "lib": ["esnext"],
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true
  }
}
```

- `bun-types` installs into `node_modules/@types/bun` — `@types/node` can still be used alongside it if you need node compat types
- `/// <reference types="bun" />` is an alternative that requires no tsconfig changes

## Recommended tsconfig (official)

```jsonc
{
  "compilerOptions": {
    "lib": ["ESNext"],
    "target": "ESNext",
    "module": "Preserve",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "types": ["bun-types"]
  }
}
```

- `allowImportingTsExtensions` — Bun allows `import "./x.ts"` directly
- `moduleResolution: "bundler"` — matches Bun's resolution algorithm
- `noEmit` — typecheck only (Bun handles execution)

## Typecheck In Workflow

```bash
bunx tsc --noEmit            # one-shot
bunx tsc --noEmit --watch    # watch mode
```

- package.json script: `"typecheck": "tsc --noEmit"`
- CI: `bun install && bunx tsc --noEmit && bun test`

## TypeScript Versions

- Use `typescript` from devDependencies for typechecking (`bun add -d typescript`)
- Dedicated docs: https://bun.com/docs/typescript-6 for TypeScript 6/7 (tsgo native compiler) — the runtime doesn't depend on the TS version because the transpiler is Bun's own

## Common Gotchas

- `import type` / `export type` are always safe; `verbatimModuleSyntax` helps keep type imports from slipping through
- `enum` (plain) works; `const enum` is inlined only in some cases — avoid it in libraries
- `paths` aliases in tsconfig — Bun honors `tsconfig.json` paths at runtime
- `.d.ts` files never run — Bun skips type declarations
- `tsc --noEmit` is still required for CI — Bun won't warn about type errors at runtime
