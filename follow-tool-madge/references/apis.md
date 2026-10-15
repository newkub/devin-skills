| key | value |
|---|---|
| version | 8.0.0 |
| package registry | https://www.npmjs.com/package/madge |
| repository | https://github.com/pahen/madge |
| docs | https://github.com/pahen/madge |

| commands | description | default | options |
|---|---|---|---|
| `madge <path>` | Dependency graph analysis | - | --ts-config, --extensions |
| `madge --circular` | Find circular deps | - | - |
| `madge --depends <mod>` | Modules that depend on X | - | - |
| `madge --orphans` | Modules with no parent | - | - |
| `madge --leaves` | Modules with no deps | - | - |
| `madge --image out.svg` | Export graph | - | requires graphviz |
| `madge --json` | JSON output | - | for CI checks |
