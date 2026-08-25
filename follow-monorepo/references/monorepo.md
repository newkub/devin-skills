# Monorepo Architecture Reference

## Workspace Catalog

### pnpm catalog

pnpm 9.5+ รองรับ `catalog:` protocol สำหรับ centralize shared dependency versions

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
catalog:
  react: 18.3.1
  typescript: 5.5.4
  vitest: 2.0.5
```

```json
// packages/ui/package.json
{
  "dependencies": {
    "react": "catalog:"
  }
}
```

### Bun catalog

Bun 1.1+ รองรับ `catalog` และ `resolutions` ใน root `package.json`

```json
// root package.json
{
  "workspaces": ["apps/*", "packages/*"],
  "catalog": {
    "react": "18.3.1",
    "typescript": "5.5.4"
  }
}
```

```json
// packages/ui/package.json
{
  "dependencies": {
    "react": "catalog:react"
  }
}
```

### npm overrides

npm 8.3+ รองรับ `overrides` สำหรับ force dependency versions ทั้ง monorepo

```json
// root package.json
{
  "workspaces": ["apps/*", "packages/*"],
  "overrides": {
    "react": "18.3.1",
    "typescript": "5.5.4"
  }
}
```

### Yarn resolutions

Yarn 1/2+ รองรับ `resolutions` ใน root `package.json`

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "resolutions": {
    "react": "18.3.1"
  }
}
```

## Workspace Protocol

### npm/yarn/Bun

```json
// packages/ui/package.json
{
  "dependencies": {
    "@myorg/utils": "workspace:*"
  }
}
```

### pnpm

```json
{
  "dependencies": {
    "@myorg/utils": "workspace:*"
  }
}
```

### Cargo (Rust)

```toml
# crates/ui/Cargo.toml
[dependencies]
my-utils = { path = "../utils", version = "0.1.0" }
# หรือใช้ workspace dependencies
my-utils = { workspace = true }
```

```toml
# root Cargo.toml
[workspace]
members = ["crates/*"]

[workspace.dependencies]
my-utils = { path = "crates/utils", version = "0.1.0" }
```

## Directory Structure Patterns

### TypeScript/JavaScript Monorepo

```
.
├── apps/
│   ├── web/          # Next.js, Nuxt, etc.
│   ├── api/          # Backend API
│   └── admin/        # Admin dashboard
├── packages/
│   ├── ui/           # Shared UI components
│   ├── utils/        # Shared utilities
│   ├── config/       # Shared configs (eslint, tsconfig)
│   └── types/        # Shared TypeScript types
├── package.json
├── pnpm-workspace.yaml  # หรือ turbo.json / .moon/
└── tsconfig.json
```

### Rust Monorepo

```
.
├── crates/
│   ├── core/         # Core library
│   ├── api/          # API server
│   └── cli/          # CLI tool
└── Cargo.toml
```

### Mixed Ecosystem Monorepo

```
.
├── apps/
│   ├── web/          # TypeScript frontend
│   └── desktop/      # Tauri desktop app
├── packages/
│   └── shared/       # TypeScript shared code
├── crates/
│   └── native/       # Rust native code
├── package.json
└── Cargo.toml
```

## Build System Comparison

| Tool | Ecosystem | Caching | Remote Cache | Task Pipeline |
|---|---|---|---|---|
| Turborepo | Node.js | Local + Remote | Yes (Vercel) | Yes |
| moonrepo | Multi-language | Local + Remote | Yes | Yes |
| Nx | Node.js | Local + Remote | Yes | Yes |
| pnpm | Node.js | No | No | No |
| Cargo | Rust | No | No | No |

## Common Issues And Solutions

### Circular Dependencies

```bash
# ตรวจสอบ circular dependencies
pnpm dlx madge --circular apps/web/src/index.ts
```

### Version Conflicts

```json
// ใช้ overrides หรือ catalog เพื่อบังคับ version
{
  "overrides": {
    "react": "18.3.1"
  }
}
```

### Missing Exports

```json
// ทุก package ต้องมี exports field
{
  "name": "@myorg/ui",
  "exports": {
    ".": "./dist/index.js",
    "./button": "./dist/button.js"
  }
}
```

### TypeScript Project References

```json
// root tsconfig.json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "packages/ui" },
    { "path": "packages/utils" }
  ]
}
```
