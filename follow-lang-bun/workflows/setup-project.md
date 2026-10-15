# Setup Bun Project Workflow

> Goal: create a new Bun project with a standard structure

## 1. Scaffold

```bash
bun init            # interactive: blank | react | library
bun init -y         # defaults
bun create <tpl>    # community templates (vite, elysia, next)
```

`bun init` creates `package.json`, `tsconfig.json`, `index.ts`, `.gitignore`, `bunfig.toml` (per the template)

## 2. Directory Structure

```text
my-app/
  src/
    index.ts        # entry point
    lib/            # modules
  tests/ or src/**/*.test.ts
  package.json
  bunfig.toml
  tsconfig.json
  bun.lock          # generated — always commit
  .env              # auto-loaded — gitignore
  .env.example      # commit this instead of .env
```

- Single package: a flat `src/` is enough — don't over-engineer the structure
- Monorepo: `packages/<name>/` + root `package.json` with `"workspaces": ["packages/*"]`

## 3. package.json Essentials

```jsonc
{
  "name": "my-app",
  "module": "src/index.ts",     // entry for bundlers
  "type": "module",
  "scripts": {
    "dev": "bun --watch src/index.ts",
    "start": "bun src/index.ts",
    "test": "bun test",
    "typecheck": "tsc --noEmit",
    "build": "bun build src/index.ts --outdir dist"
  },
  "devDependencies": {
    "bun-types": "latest",
    "typescript": "^5"
  }
}
```

- `module`/`main` may point at `.ts` — Bun/bundlers understand it
- Don't add `engines.bun` unless needed — the `packageManager` field isn't necessary (`bun.lock` suffices)

## 4. bunfig.toml Skeleton

```toml
# runtime
# preload = ["./src/preload.ts"]

[test]
coverage = true

[install]
# minimumReleaseAge = 259200

[build]
# sourcemap = "linked"
```

## 5. tsconfig

Use the recommended tsconfig from the Configure step in [../SKILL.md](../SKILL.md)

## 6. Verify

```bash
bun run src/index.ts     # runs TS directly
bun test                 # zero tests pass
bunx tsc --noEmit        # typecheck
```

## 7. Git Hygiene

Minimum `.gitignore`: `node_modules`, `dist`, `.env`, `*.log`, `coverage`
Commit: `bun.lock`, `bunfig.toml`, `tsconfig.json`, `.env.example`
