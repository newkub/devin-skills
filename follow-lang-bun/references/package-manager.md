# Bun Package Manager

`bun install` คือ Node.js-compatible package manager ที่เร็วกว่า npm ถึง ~25x — ทำงานกับ `package.json` เดิมได้เลย Docs: https://bun.com/docs/pm/cli/install

## Lockfile

- `bun.lock` — text-based lockfile (JSONC-like) diff-friendly, commit เข้า git เสมอ
- `bun install --frozen-lockfile` — install ตาม lockfile เป๊ะ, error ถ้า `package.json` ไม่ตรง
- `bun ci` — alias สำหรับ CI (`--frozen-lockfile` + clean install)
- `bun install --dry-run` — validate โดยไม่ install; `bun pm migrate` แปลง `package-lock.json`/`yarn.lock`/`pnpm-lock.yaml` → `bun.lock`

## Installation Strategies

| strategy | behavior | default เมื่อ |
|----------|----------|---------------|
| `hoisted` | flatten เข้า `node_modules` เดียว (npm-style) | single package project, existing projects |
| `isolated` | central store `node_modules/.bun/` + symlinks (pnpm-style), กัน phantom deps | workspaces/monorepo ใหม่ |

- เลือกเองด้วย `bun install --linker hoisted|isolated` หรือ `[install] linker` ใน `bunfig.toml`
- `configVersion` ใน lockfile คุม default — migration ไม่เปลี่ยน behavior ของ project เก่า

## Workspaces & Filtering

```json
{ "workspaces": ["packages/*"] }
```

- `bun install --filter <pat>` — install เฉพาะ workspace ที่ match (`--filter './packages/a'`, `--filter '!pkg-c'`)
- `bun run --filter <pat> <script>` — รัน script เฉพาะ workspace
- `bun run --workspaces <script>` — รันทุก workspace; `--parallel`/`--sequential` คุม concurrency
- catalogs (`catalog:` protocol) ใน `package.json` สำหรับ share version เดียวข้าม workspaces

## Dependency Sources

- npm registry (default), scoped registries (`[install.scopes]` หรือ `.npmrc`)
- git/git+ssh, `github:user/repo`, tarball URL, `file:`, `link:`, `workspace:`
- `bun add` flags: `-d` dev, `-g` global, `-E` exact, `--peer`, `--optional`

## Lifecycle Scripts

- `postinstall` ของ **dependencies ไม่ถูกรัน** (security) เว้นแต่ declare ใน `trustedDependencies` ของ `package.json`
- `bun pm untrusted` — list packages ที่มี scripts แต่ไม่ trusted; `bun pm trust <pkg>` — add แล้ว run
- `--concurrent-scripts <n>` — คุม parallelism (default 2× CPU)

## Overrides & Patches

- `overrides` (npm) / `resolutions` (yarn) ใน `package.json` — pin transitive versions
- `bun patch <pkg>` → แก้ package ใน `node_modules` → `bun patch --commit` → เขียน `patches/<pkg>.patch` + apply อัตโนมัติทุก install

## Maintenance

- `bun outdated` — list outdated; `bun update` / `bun update <pkg>` — apply; `--latest` ข้าม semver range
- `bun audit` — vuln report; `bun audit fix` — auto-fix (v1.4+)
- `bun dedupe` — รวม duplicate versions ใน lockfile (v1.4+)
- `bun prune` — ลบ packages ที่ไม่อยู่ใน lockfile ออกจาก `node_modules` (v1.4+); `bun prune --production` ลบ devDeps
- `bun why <pkg>` — อธิบาย dependency chain; `bun info <pkg>` — registry metadata
- `bun pm ls` — dependency tree; `bun pm bin` — binaries dir; `bun pm cache rm` — clear global cache

## Supply-Chain Security

- `bun add <pkg> --minimum-release-age <seconds>` — ปฏิเสธ versions ที่ publish ใหม่กว่า threshold
- `[install] minimumReleaseAge = 259200` ใน `bunfig.toml` (3 วัน)
- Security Scanner API — custom scanner hook ตอน install (`@scanner` ใน bunfig)
- `.npmrc` รองรับ registry auth/config เดิม

## Global Packages

- `bun add -g <pkg>` / `bun install -g <pkg>` — global install (`~/.bun/install/global`)
- `bun pm -g ls` — list globals; global cache ที่ `~/.bun/install/cache`
- Global virtual store (opt-in v1.4) — shared store ข้าม projects ลด disk/network

## Offline & Cache

- `bun install --prefer-offline` — ใช้ cache ก่อน fetch เฉพาะที่ขาด
- `bun install --offline` — ไม่แตะ network เลย (error ถ้า cache ไม่ครบ)
- `--offline --frozen-lockfile` + warm cache = fully deterministic CI install
