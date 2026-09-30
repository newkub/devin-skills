| key | value |
|---|---|
| install | `bun add -D aube` |
| repository | https://github.com/aubepkg/aube |
| docs | https://github.com/aubepkg/aube |

| commands | description | default | options |
|---|---|---|---|
| `aube install` | Install dependencies from aube.lock | — | -g, --global, --registry, --save |
| `aube add <pkg>` | Add dependency | — | -D, --dev, -g, --global, --registry |
| `aube remove <pkg>` | Remove dependency | — | -g, --global |
| `aube list` | List installed packages | — | --depth, --json |
| `aube search <pkg>` | Search registry | — | --registry, --limit |
| `aube update` | Update dependencies | — | -g, --global, --interactive |
| `aube run <script>` | Run package script | — | --watch, --env |
