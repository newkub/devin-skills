| key | value |
|---|---|
| version | 8.0.0 |
| package registry | https://www.npmjs.com/package/madge |
| repository | https://github.com/pahen/madge |
| docs | https://github.com/pahen/madge |

| commands | description | default | options |
|---|---|---|---|
| `madge <path>` | Dependency graph analysis | - | --ts-config, --extensions |
| `madge --circular` | หา circular deps | - | - |
| `madge --depends <mod>` | Modules ที่ depend on X | - | - |
| `madge --orphans` | Modules ไม่มี parent | - | - |
| `madge --leaves` | Modules ไม่มี deps | - | - |
| `madge --image out.svg` | Export graph | - | requires graphviz |
| `madge --json` | JSON output | - | สำหรับ CI checks |
