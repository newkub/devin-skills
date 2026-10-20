# Nitro — CLI

Run through the package manager (`bunx nitro ...`) or a `package.json` script.

| command | description | options |
|---|---|---|
| `nitro dev` | dev server with hot reload | `--dir`, `--port`, `--host` |
| `nitro build` | production build into `.output/` | `--dir`, `--preset`, `--minify` / `--no-minify`, `--builder`, `--compatibility-date` |
| `nitro preview` | serve the production build locally | `--dir`, `--port`, `--host` |
| `nitro serve` (`nitro start`) | run from sources without a build (experimental) | `--dir`, `--port`, `--host`, `--dev` |
| `nitro deploy` | build, then run the selected preset's deploy command | `--dir`, `--prebuilt`, all build flags, `-- <args>` |
| `nitro task list` | list tasks — needs a running `nitro dev` | `--dir` |
| `nitro task run <name>` | run a task, optionally with a JSON payload | `--dir`, `--payload` |
| `nitro docs [page]` | open the docs site at an optional page path | page path |

| flag | default |
|---|---|
| `--dir` | current directory |
| `--port` | `NITRO_PORT` / `PORT`, then `3000` |
| `--preset` | `NITRO_PRESET` env — the flag wins when both are set |
| `--builder` | `NITRO_BUILDER` env — no built-in default |
