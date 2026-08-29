# Create Vite Plugins API & Dependencies

## Install

```sh
bun add -D vite
# or
npm install --save-dev vite
```

## Version

- Latest: 8.2.2
- [Package Registry](https://www.npmjs.com/package/vite)
- [Repository](https://github.com/vitejs/vite)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install vite in project | latest version | --save-dev, --save, --global |
| `vite` | Run the vite CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'vite/client'` | Subpath export for client | entry as documented | (none) |
| `import 'vite/types/*'` | Subpath export for types/* | entry as documented | (none) |
| `import 'vite/internal'` | Subpath export for internal | entry as documented | (none) |
| `import 'vite/dist/client/*'` | Subpath export for dist/client/* | entry as documented | (none) |
| `import 'vite/module-runner'` | Subpath export for module-runner | entry as documented | (none) |
| `import 'vite/types/internal/*'` | Subpath export for types/internal/* | entry as documented | (none) |

## Source

- Official docs: https://vite.dev
- Description: Native-ESM powered web dev build tool
