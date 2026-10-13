# Bun Package Manager

`bun install` is a Node.js-compatible package manager up to ~25x faster than npm — works with your existing `package.json` as-is. Docs: https://bun.com/docs/pm/cli/install

## Lockfile

- `bun.lock` — text-based lockfile (JSONC-like), diff-friendly, always commit to git
- `bun install --frozen-lockfile` — install exactly per the lockfile; error if `package.json` doesn't match
- `bun ci` — alias for CI (`--frozen-lockfile` + clean install)
- `bun install --dry-run` — validate without installing; `bun pm migrate` converts `package-lock.json`/`yarn.lock`/`pnpm-lock.yaml` → `bun.lock`

## Installation Strategies

| strategy | behavior | default when |
|----------|----------|---------------|
| `hoisted` | flatten into a single `node_modules` (npm-style) | single package project, existing projects |
| `isolated` | central store `node_modules/.bun/` + symlinks (pnpm-style), blocks phantom deps | new workspaces/monorepo |

- Choose explicitly with `bun install --linker hoisted|isolated` or `[install] linker` in `bunfig.toml`
- `configVersion` in the lockfile controls the default — migration never changes an old project's behavior

## Workspaces & Filtering

```json
{ "workspaces": ["packages/*"] }
```

- `bun install --filter <pat>` — install only matching workspaces (`--filter './packages/a'`, `--filter '!pkg-c'`)
- `bun run --filter <pat> <script>` — run a script in specific workspaces only
- `bun run --workspaces <script>` — run in every workspace; `--parallel`/`--sequential` controls concurrency
- catalogs (`catalog:` protocol) in `package.json` for sharing one version across workspaces

## Dependency Sources

- npm registry (default), scoped registries (`[install.scopes]` or `.npmrc`)
- git/git+ssh, `github:user/repo`, tarball URL, `file:`, `link:`, `workspace:`
- `bun add` flags: `-d` dev, `-g` global, `-E` exact, `--peer`, `--optional`

## Lifecycle Scripts

- **dependency** `postinstall` scripts do not run (security) unless declared in `trustedDependencies` in `package.json`
- `bun pm untrusted` — list packages with scripts that aren't trusted; `bun pm trust <pkg>` — add and run
- `--concurrent-scripts <n>` — controls parallelism (default 2× CPU)

## Overrides & Patches

- `overrides` (npm) / `resolutions` (yarn) ใน `package.json` — pin transitive versions
- `bun patch <pkg>` → edit the package in `node_modules` → `bun patch --commit` → writes `patches/<pkg>.patch` + auto-applies on every install

## Maintenance

- `bun outdated` — list outdated; `bun update` / `bun update <pkg>` — apply; `--latest` ignores semver ranges
- `bun audit` — vuln report; `bun audit fix` — auto-fix (v1.4+)
- `bun dedupe` — merge duplicate versions in the lockfile (v1.4+)
- `bun prune` — remove packages not in the lockfile from `node_modules` (v1.4+); `bun prune --production` removes devDeps
- `bun why <pkg>` — explain the dependency chain; `bun info <pkg>` — registry metadata
- `bun pm ls` — dependency tree; `bun pm bin` — binaries dir; `bun pm cache rm` — clear global cache

## Supply-Chain Security

- `bun add <pkg> --minimum-release-age <seconds>` — reject versions published more recently than the threshold
- `[install] minimumReleaseAge = 259200` in `bunfig.toml` (3 days)
- Security Scanner API — custom scanner hook at install time (`@scanner` in bunfig)
- `.npmrc` supports the existing registry auth/config format

## Global Packages

- `bun add -g <pkg>` / `bun install -g <pkg>` — global install (`~/.bun/install/global`)
- `bun pm -g ls` — list globals; global cache at `~/.bun/install/cache`
- Global virtual store (opt-in v1.4) — shared store across projects, reducing disk/network use

## Offline & Cache

- `bun install --prefer-offline` — use the cache first, fetching only what's missing
- `bun install --offline` — never touch the network (error if the cache is incomplete)
- `--offline --frozen-lockfile` + warm cache = fully deterministic CI install
