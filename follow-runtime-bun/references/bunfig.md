# bunfig.toml

`bunfig.toml` คือ config file ของ Bun สำหรับ runtime, package manager, test runner, bundler ดู details เพิ่มเติมที่ https://bun.com/docs/runtime/bunfig

## Runtime

- `preload = ["./preload.ts"]` — scripts/plugins ที่ run ก่อน `bun run`
- `jsx = "react"` — JSX transform
- `jsxFactory = "h"` — JSX factory
- `jsxFragment = "Fragment"` — JSX fragment
- `jsxImportSource = "react"` — JSX import source
- `smol = true` — ลด memory usage แลกกับ performance
- `logLevel = "debug"` — log level (`debug`, `warn`, `error`)
- `define = { "process.env.X" = "'value'" }` — replace global identifiers
- `loader = { ".bagel" = "tsx" }` — custom file loaders
- `telemetry = false` — ปิด telemetry/crash reports
- `env = false` — ปิด automatic `.env` loading
- `[env] file = false` — ปิด automatic `.env` loading ด้วย object syntax
- `[console] depth = 3` — console.log object inspection depth

## Package Manager

`[install]`, `[install.cache]`, `[install.scopes]`, `[install.registry]` สำหรับ config `bun install`

```toml
[install]
cache = true
exact = false
# registry = "https://registry.npmjs.org"

[install.scopes]
"@myorg" = { url = "https://npm.myorg.com" }
```

- `dev = true` — install `devDependencies` by default
- `optional = true` — install `optionalDependencies`
- `peer = true` — install `peerDependencies`
- `exact = false` — ใช้ semver range แทน exact version
- `globalDir` — กำหนด global packages directory

ดู https://bun.com/docs/runtime/bunfig#install

## Serve

- `[serve] port = 3000` — default port สำหรับ `Bun.serve`

## Test Runner

- `[test] root = "./__tests__"` — test root
- `[test] preload = ["./setup.ts"]` — setup ก่อน tests
- `[test] pathIgnorePatterns = ["vendor/**"]` — exclude paths from test discovery
- `[test] coverage = true` — enable coverage
- `[test] coverageThreshold = 0.9` — coverage threshold
- `[test] coverageReporter = ["text", "lcov"]` — coverage reporter
- `[test] coverageDir = "coverage"` — coverage output directory
- `[test] randomize = true` — random test order
- `[test] smol = true` — ลด memory ตอน run tests

## Bundler

`[build]` section สำหรับ `bun build` defaults

```toml
[build]
# target = "browser"
# format = "esm"
# splitting = true
# sourcemap = "external"
# minify = true
```

ดู https://bun.com/docs/runtime/bunfig#build

## Links

- https://bun.com/docs/runtime/bunfig
