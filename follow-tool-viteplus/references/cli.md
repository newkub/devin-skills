| key | value |
|---|---|
| install (global) | Windows `irm https://vite.plus/ps1 \| iex`; macOS/Linux `curl -fsSL https://vite.plus \| bash` |
| install (project) | `vp add -D vite-plus` — then `vp` or `./node_modules/.bin/vp` |
| install (CI) | `setup-vp` step before install/build |
| docs | https://viteplus.dev/guide/ |
| config | https://viteplus.dev/config/ |
| repository | https://github.com/voidzero-dev/vite-plus |

| commands | description | default | options |
|---|---|---|---|
| `vp create` | Scaffold a project | interactive | template/scaffold defaults from the `create` block |
| `vp migrate` | Migrate a Vite project to Vite+ | interactive | `--full`, `--hooks`, `--agent`, `--editor`, `--no-interactive` |
| `vp install` | Install dependencies with the detected package manager | current workspace | `--frozen-lockfile`, `--filter <pkg>`, `-w` |
| `vp add` / `vp remove` / `vp update` / `vp dedupe` | Dependency management | current workspace | package-manager flags pass through |
| `vp dev` | Built-in Vite dev server | current package | `-C <dir>`; `defaultPackage` when bare at a workspace root |
| `vp build` | Built-in Vite production build | current package | `-C <dir>` |
| `vp preview` | Built-in preview server | current package | `-C <dir>` |
| `vp check` | Oxfmt + Oxlint + type-aware check | read-only | `--fix`, `--quiet`, `--deny-warnings`, `--no-fmt`, `--no-lint` |
| `vp fmt` | Oxfmt | write mode | `-c` / `--config <path>` |
| `vp lint` | Oxlint | report mode | lint rule flags from the `lint` block |
| `vp test` | Vitest 5 | single run | `watch` subcommand |
| `vp pack` | tsdown library build | current package | `--watch`, `--exe` (Node 25.7+) |
| `vp run <task>` (`vpr`) | Vite Task runner | cached task graph | `-r`, `-t`, `--filter`, `-w`, `--cache` |
| `vp vpx <pkg>` | One-off binary execution | — | like `npx` inside the toolchain |
| `vp toolchain` | Show bundled tool versions | — | — |
| `vp env` | Manage the Node environment | — | see `vp env --help` |
| `vp config` | Inspect resolved config | — | — |
| `vp hooks enable` / `disable` / `status` | Manage git hooks (`.vite-hooks/`) | — | — |
| `vp staged` | Run the `staged` block on staged files (lint-staged 17) | staged files only | git hook integration |
| `vp upgrade` | Update the global `vp` | — | — |
| `vp implode` | Remove the global `vp` install | — | — |

- `vp` reads `vite.config.ts` for `create`, `run`, `fmt`, `lint`, `check`, `test`, `pack`, `staged`, and `defaultPackage`
- `vp check` type-checks only when both `lint.options.typeAware` and `lint.options.typeCheck` are enabled
- `vp fmt`/`vp check` use the workspace-root `fmt` block; package configs cannot replace root format/lint settings
- `vp pack --exe` requires Node 25.7+; `vp staged` requires Node 22.22.1+/24.11+ and Git 2.32+
- Run `vp <command> --help` for the exact flag set of the installed version — no version is pinned in this skill
