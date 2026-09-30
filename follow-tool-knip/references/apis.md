| key | value |
|---|---|
| install | `bun add -D knip` |
| version | 6.38.0 |
| package registry | https://www.npmjs.com/package/knip |
| repository | https://github.com/webpro-nl/knip |
| docs | https://knip.dev |

| commands | description | default | options |
|---|---|---|---|
| `install` | Install knip in project | latest version | --save-dev, --save, --global |
| `knip` | Run the knip CLI | current workspace | --help, --version, --config |
| `knip-bun` | Run the knip-bun CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'knip/config'` | Subpath export for config | entry as documented | (none) |
| `import 'knip/session'` | Subpath export for session | entry as documented | (none) |
