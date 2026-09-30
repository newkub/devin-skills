| key | value |
|---|---|
| install | `bun add -D tsdown` |
| version | 0.23.0 |
| package registry | https://www.npmjs.com/package/tsdown |
| repository | https://github.com/rolldown/tsdown |
| docs | http://tsdown.dev/ |

| commands | description | default | options |
|---|---|---|---|
| `install` | Install tsdown in project | latest version | --save-dev, --save, --global |
| `tsdown` | Run the tsdown CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'tsdown/run'` | Subpath export for run | entry as documented | (none) |
| `import 'tsdown/client'` | Subpath export for client | entry as documented | (none) |
| `import 'tsdown/config'` | Subpath export for config | entry as documented | (none) |
| `import 'tsdown/plugins'` | Subpath export for plugins | entry as documented | (none) |
| `import 'tsdown/internal'` | Subpath export for internal | entry as documented | (none) |
