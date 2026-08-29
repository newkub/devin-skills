# Tool React Scan API & Dependencies

## Install

```sh
bun add -D react-scan
# or
npm install --save-dev react-scan
```

## Version

- Latest: 0.5.7
- [Package Registry](https://www.npmjs.com/package/react-scan)
- [Repository](https://github.com/aidenybai/react-scan)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install react-scan in project | latest version | --save-dev, --save, --global |
| `react-scan` | Run the react-scan CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'react-scan/all-environments'` | Subpath export for all-environments | entry as documented | (none) |
| `import 'react-scan/install-hook'` | Subpath export for install-hook | entry as documented | (none) |
| `import 'react-scan/lite'` | Subpath export for lite | entry as documented | (none) |
| `import 'react-scan/auto'` | Subpath export for auto | entry as documented | (none) |
| `import 'react-scan/dist/*'` | Subpath export for dist/* | entry as documented | (none) |
| `import 'react-scan/dist/*.js'` | Subpath export for dist/*.js | entry as documented | (none) |
| `import 'react-scan/dist/*.mjs'` | Subpath export for dist/*.mjs | entry as documented | (none) |
| `import 'react-scan/react-component-name/vite'` | Subpath export for react-component-name/vite | entry as documented | (none) |
| `import 'react-scan/react-component-name/webpack'` | Subpath export for react-component-name/webpack | entry as documented | (none) |
| `import 'react-scan/react-component-name/esbuild'` | Subpath export for react-component-name/esbuild | entry as documented | (none) |

## Source

- Official docs: https://react-scan.million.dev
- Description: Scan your React app for renders
