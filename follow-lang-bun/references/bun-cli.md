# Bun CLI Commands

`bun --help` output from `Bun 1.4.2 (verified 2026-09-18)`. Docs: https://bun.com/docs

## Run & Execute

| commands | description | default | options |
|----------|-------------|---------|---------|
| `bun run <file>` / `bun <file>` | execute JS/TS/JSX file directly | — | `--watch`, `--hot`, `--smol`, `-r/--preload <m>` |
| `bun run <script>` / `bun <script>` | run package.json script | — | `--filter <pat>`, `--workspaces`, `--parallel`, `--sequential`, `--shell bun|system` |
| `bun test` | run test runner | — | `--watch`, `--coverage`, `--parallel`, `--bail`, `--timeout <ms>` |
| `bun x <pkg>` / `bunx <pkg>` | execute package binary, auto-install if needed | — | `-p <pkg>`, `-b/--bun` (force Bun runtime) |
| `bun repl` | start REPL session | — | — |
| `bun exec <cmd>` | run shell script directly with Bun | — | — |

## Package Manager

| commands | description | default | options |
|----------|-------------|---------|---------|
| `bun install` / `bun i` | install all dependencies, write `bun.lock` | — | `--production`, `--frozen-lockfile`, `--dry-run`, `--offline`, `--prefer-offline`, `--omit dev|peer|optional`, `--linker hoisted|isolated`, `--filter <pat>`, `--concurrent-scripts <n>` |
| `bun add <pkg>` / `bun a` | add dependency | — | `-d/--dev`, `-g/--global`, `-E/--exact`, `--optional`, `--peer`, `--minimum-release-age <s>` |
| `bun remove <pkg>` / `bun rm` | remove dependency | — | `-g/--global` |
| `bun update [pkg]` | update outdated dependencies | all | `-i/--interactive`, `--latest`, `-r/--recursive` |
| `bun outdated` | list outdated dependencies | — | `--filter <pat>` |
| `bun audit` | vulnerability audit | — | `bun audit fix` to auto-fix |
| `bun dedupe` | remove duplicate versions from lockfile | — | — |
| `bun prune` | remove packages not in lockfile from node_modules | — | `--production` removes devDeps too |
| `bun link [pkg]` / `bun unlink` | register/link local package | — | — |
| `bun publish` | publish to npm registry | — | `--tag`, `--access`, `--dry-run`, `--provenance` |
| `bun patch <pkg>` | prepare package for patching | — | `bun patch --commit` to apply |
| `bun pm <sub>` | extra PM utilities | — | `ls`, `cache`, `bin`, `hash`, `pkg`, `version`, `migrate`, `untrusted`, `trust`, `default-trusted` |
| `bun info <pkg>` | show package metadata from registry | — | — |
| `bun why <pkg>` | explain why package is installed | — | — |

## Build & Scaffold

| commands | description | default | options |
|----------|-------------|---------|---------|
| `bun build <entry...>` | bundle TS/JS into single file | — | `--outdir`, `--target browser|bun|node`, `--format esm|cjs|iife`, `--splitting`, `--minify`, `--sourcemap`, `--compile` (standalone exe), `--define`, `--external`, `--packages external|bundle`, `--watch` |
| `bun init` | scaffold empty project from template | — | `-y` defaults |
| `bun create <tpl>` / `bun c` | create project from template | — | — |
| `bun upgrade` | upgrade Bun itself | latest | `--canary`, `--stable`, `<version>` |

## Global Flags

- `-v/--version`, `--revision` — version info
- `-F/--filter <pat>` — target workspace packages matching pattern
- `-b/--bun` — force script/package to use Bun runtime instead of Node
- `--watch` — restart on file change; `--hot` — hot reload; `--no-clear-screen`
- `--smol` — less memory, more GC
- `-r/--preload <m>` / `--import <m>` / `--require <m>` — load module first
- `--inspect[=port]`, `--inspect-wait`, `--inspect-brk` — debugger (chrome://inspect, VSCode)
- `--env-file <f>` — load specific env file
- `--cwd <dir>` — working directory
- `--silent` — don't print script command
- `--no-orphans` — kill descendants on exit
- `--parallel` / `--sequential` — run multiple scripts with Foreman-style output
- `--no-exit-on-error` — continue other scripts when one fails (with --parallel)
- `--elide-lines <n>` — lines of script output shown with --filter
- `--title <t>` — process title
- `--user-agent <ua>` — default User-Agent for fetch
- `--port <n>` — default port for Bun.serve
- `--print <code>` — evaluate and print result
- `-e/--eval <code>` — evaluate script
- `--bake` — TanStack Start / framework SSR dev (experimental)
