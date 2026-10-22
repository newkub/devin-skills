| key | value |
|---|---|
| install | `bun add -d @tanstack/cli` |
| run without install | `bunx @tanstack/cli` |
| package registry | https://www.npmjs.com/org/tanstack |
| repo | https://github.com/TanStack/cli |
| docs | https://tanstack.com/cli/latest/docs/cli-reference |

| Area | Entry point |
|---|---|
| Scaffold | `create` with `--add-ons`, `--template`, `--deployment`, `--framework`, `--package-manager` |
| Extend | `add <add-on...>` |
| Catalog | `create --list-add-ons`, `create --addon-details <id>`, `libraries` |
| Docs | `doc <library> <path>`, `search-docs <query>` |
| Ecosystem | `ecosystem --category`, `ecosystem --library` |
| Versions | `pin-versions` |
| Authoring | `add-on init/compile`, `template init/compile` |
| Automation | `--json` on catalog, docs, and create operations |
