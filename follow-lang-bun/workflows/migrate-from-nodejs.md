# Migrate From Node.js To Bun Workflow

> Goal: move a Node.js project to Bun safely and reversibly

## 1. Prerequisites

- `bun --version` shows a current supported release installed (see the Install And Setup step in [../SKILL.md](../SKILL.md))
- clean `git status` — commit before migrating

## 2. Replace Package Manager

```bash
rm -rf node_modules package-lock.json   # or yarn.lock / pnpm-lock.yaml
bun install                             # writes bun.lock
```

- `bun pm migrate` — converts the existing lockfile into `bun.lock` preserving resolved versions (before deleting the old lockfile)
- Check `trustedDependencies` — packages that relied on `postinstall` (esbuild, sharp, prisma, puppeteer, etc.) must be declared:

```jsonc
{ "trustedDependencies": ["esbuild", "prisma"] }
```

- Run `bun pm untrusted` to see blocked packages

## 3. Update Scripts

| old | new |
|------|-----|
| `npm run dev` | `bun run dev` or `bun dev` |
| `npm install` | `bun install` |
| `npx <tool>` | `bunx <tool>` |
| `node index.js` | `bun index.js` |
| `node --watch` | `bun --watch` |
| `jest` / `vitest` (basic) | `bun test` |
| `ts-node`, `tsx` | remove — Bun runs TS directly |
| `dotenv` | remove — `.env` auto-load |

- Scripts with a `#!/usr/bin/env node` shebang → `bun run --bun <script>` or `bunx --bun` to force Bun
- `cross-env` → can be removed if it only sets env vars (`KEY=v bun run x` works in the Bun shell)

## 4. Compatibility Checklist

1. `node:*` imports — almost all work (Node.js 26.3.0 compat); for edge cases see /docs/runtime/nodejs-compat
2. Globals: `process`, `Buffer`, `__dirname`, `require` — available, but migrating to ESM is recommended
3. Native addons (`.node`, node-gyp) — Node-API supported; packages relying on V8 internals may break
4. `import.meta.url` patterns work normally; `import.meta.dirname`/`filename` are provided in Bun
5. TypeScript — drop `module: "commonjs"` from `tsconfig`; use `bundler` resolution + `bun-types`
6. Test framework — most jest/vitest APIs map onto `bun:test` (`jest.mock` → `mock.module`)

## 5. Gradual Adoption (no need to migrate everything)

- `bun install` alone as just the PM works — runtime stays node (`node server.js`)
- `bun test` can be adopted separately without changing the main runtime
- Keep `node` fallback script: `"start:node": "node dist/index.js"`

## 6. Verify

```bash
bun run dev          # dev flow works
bun test             # tests pass
bun run build        # build works
bunx tsc --noEmit    # types ok
```

## 7. Rollback

- `bun.lock` doesn't conflict with npm — `npm install` can always regenerate `package-lock.json`
- Keep the original `package-lock.json` in git history — revert anytime
