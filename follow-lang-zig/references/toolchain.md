# Zig Toolchain

| key | value |
|-----|-------|
| language | Zig (pre-1.0 — the installed `zig version` decides the build-system/module API) |
| runtime install | `mise use -g zig` |
| package manager | built-in: `build.zig.zon` + `zig fetch` (community `zigmod` only when the project already uses it) |
| official docs | https://ziglang.org/documentation/ · Zig Guide: https://zig.guide/ |
| version policy | never pinned here — live-check the current version and breaking changes via `/deep-research` at use time (`/follow-up-to-date`) |

| tool | role | command/install |
|------|------|-----------------|
| `zig` | compiler, build system, formatter, test runner in one | `mise use -g zig` |
| `zig init` | scaffold `build.zig` + `build.zig.zon` + `src/main.zig` | bundled |
| `zig build` | build; `run`/`test` steps wired in `build.zig` | bundled |
| `zig build -Doptimize=...` | ReleaseFast/ReleaseSafe/ReleaseSmall selects | bundled |
| `zig build -Dtarget=...` | cross-compile targets | bundled |
| `zig fmt` | the formatter — never fight it | bundled |
| `zig fetch` | resolve/add a dependency URL + hash into `build.zig.zon` | bundled |
| `zig translate-c` | C header translation (build-system form, e.g. `b.addTranslateC`) | bundled |
| `zls` | language server for editor integration | `mise use -g zls` |
| `build.zig` / `build.zig.zon` | project build graph + dependency declarations | project files |
