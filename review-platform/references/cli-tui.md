# CLI And TUI Platform Checks

## CLI Design And UX

1. ตรวจสอบ command structure: subcommands, nesting, naming convention
2. ตรวจสอบ options: short flags, long flags, defaults, required, validation
3. ตรวจสอบ `--help`, `--version`, และ examples ใน help text
4. ตรวจสอบ output formatting: colors, tables, JSON, progress, spinner
5. ตรวจสอบ stdout vs stderr: ข้อมูลผลลัพธ์ไป stdout, errors/warnings ไป stderr
6. ตรวจสอบ piping และ stream compatibility (non-interactive mode)
7. ตรวจสอบ interactive prompts ถ้ามี: confirm, select, input, cancellation
8. ตรวจสอบ shell completions และ man page / docs

## Error Handling And Resilience

1. ตรวจสอบ error types และ messages ที่ actionable
2. ตรวจสอบ exit codes: 0 สำหรับ success, non-zero สำหรับ errors
3. ตรวจสอบไม่มี `unwrap`/`expect`/`panic` ใน production code ยกเว้น invariant ที่ชัดเจน
4. ตรวจสอบไม่มี `throw` ที่ไม่มี catch หรือ unhandled promise rejection
5. ตรวจสอบ input validation สำหรับ args, flags, files, env vars
6. ตรวจสอบ logging/tracing: level, context, PII scrubbing
7. ตรวจสอบ retry, timeout, graceful degradation สำหรับ external calls

## Tests

1. ตรวจสอบ unit tests สำหรับ pure functions และ internal logic
2. ตรวจสอบ integration tests สำหรับ command invocation, options, exit codes
3. ตรวจสอบ snapshot tests สำหรับ output format ถ้าเหมาะสม
4. ตรวจสอบ fixtures, mocks ไม่ over-mock external systems
5. ตรวจสอบ test isolation และไม่ depend on global state
6. ตรวจสอบ coverage thresholds และ untested critical paths
7. ตรวจสอบ `CI=true` หรือ `NO_COLOR=1` testing path

## Build And Distribution

1. ตรวจสอบ build configuration: release profile, target, minify, sourcemap
2. ตรวจสอบ build artifacts: binary name, executable permission, artifact size
3. ตรวจสอบ cross-compilation หรือ multi-platform builds ถ้ามี
4. ตรวจสอบ packaging: tarball, zip, installer, npm package, crate
5. ตรวจสอบ distribution channels: GitHub Releases, homebrew, scoop, winget, apt, crates.io, npm
6. ตรวจสอบ release automation: CI/CD pipeline, checksums, signing
7. ตรวจสอบ installation docs และ upgrade path

## Config

1. ทำ `/review-delivery` เพื่อตรวจสอบ root และ workspace config
2. ตรวจสอบ package manifest scripts: `dev`, `build`, `test`, `lint`, `format`, `typecheck`, `check`, `verify`, `ci`
3. ตรวจสอบ build tool config: `Cargo.toml`, `tsup.config.ts`, `vite.config.ts`, `esbuild`, `webpack`
4. ตรวจสอบ shared config: `tsconfig.json`, `biome.jsonc`, `lefthook.yml`, `turbo.json`, `.gitignore`
5. ตรวจสอบ workspace overrides extend จาก root ได้ถูกต้อง
6. ตรวจสอบ env vars: validation, `.env.example`, secret management, client/server exposure
7. ตรวจสอบ config consistency ระหว่าง root และ CLI workspace

## TUI Specific

1. ตรวจสอบ TUI layout, component composition, resize handling, และ focus management
2. ตรวจสอบ TUI color support, terminal compatibility, และ rendering performance
3. ตรวจสอบ input handling: keyboard, mouse, paste, resize events
4. ตรวจสอบ terminal detection: `TERM`, `COLORTERM`, `NO_COLOR`, `CI`

## Severity

- Critical: command พัง, command ที่จำเป็นหายไป, exit code ผิด, TUI layout พัง, input ไม่ถูกจัดการ, terminal crash
- High: ไม่มี help text, error message สับสน, ไม่มี required option, rendering glitch, ไม่รองรับ resize, focus พัง, build suboptimal
- Medium: output ไม่สวย, naming ไม่ consistent, coverage ต่ำ, config ขาดหรือผิด
- Low: docs ขาด, minor refactor, cosmetic UX
