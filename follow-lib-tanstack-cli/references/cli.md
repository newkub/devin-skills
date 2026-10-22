| key | value |
|---|---|
| install | `bunx @tanstack/cli` |
| binary | `tanstack` when installed globally |
| package registry | https://www.npmjs.com/org/tanstack |
| repo | https://github.com/TanStack/cli |
| docs | https://tanstack.com/cli/latest/docs |

| Package | Lib |
|---------|-----|
| `@tanstack/cli` | project generator, add-on composer, catalog and docs introspection |
| `@tanstack/create` | programmatic generation (Node/CLI path) |
| `@tanstack/create/edge` | in-memory manifest path for edge runtimes |
| `@tanstack/create/worker` | Worker-compatible generation with explicit manifest loaders |

| Command | Purpose |
|---|---|
| `create` | scaffold a Start app (default) or a Router-only app |
| `add` | add add-ons to the current project |
| `add-on init` / `add-on compile` | extract and rebuild a custom add-on (`.add-on/`) |
| `template init` / `template compile` | author a reusable project template |
| `libraries` | list TanStack libraries, filter by `--group` |
| `doc <library> <path>` | fetch one documentation page, `--docs-version` |
| `search-docs <query>` | search docs, filter by library/framework |
| `ecosystem` | list partner recommendations by category/library |
| `pin-versions` | remove `^` from TanStack packages and add missing peers |

| File | Meaning |
|---|---|
| `.cta.json` | generated app shape, add-ons, deployment, package manager |
| `.add-on/` | custom add-on source (`info.json`, `assets/`) |
| `template-info.json`, `template.json` | custom template source |
