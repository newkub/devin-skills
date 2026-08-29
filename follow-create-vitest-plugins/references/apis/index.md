# Create Vitest Plugins API & Dependencies

## Install

```sh
bun add -D vitest
# or
npm install --save-dev vitest
```

## Version

- Latest: 4.1.11
- [Package Registry](https://www.npmjs.com/package/vitest)
- [Repository](https://github.com/vitest-dev/vitest)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install vitest in project | latest version | --save-dev, --save, --global |
| `vitest` | Run the vitest CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'vitest/node'` | Subpath export for node | entry as documented | (none) |
| `import 'vitest/jsdom'` | Subpath export for jsdom | entry as documented | (none) |
| `import 'vitest/src/*'` | Subpath export for src/* | entry as documented | (none) |
| `import 'vitest/suite'` | Subpath export for suite | entry as documented | (none) |
| `import 'vitest/config'` | Subpath export for config | entry as documented | (none) |
| `import 'vitest/worker'` | Subpath export for worker | entry as documented | (none) |
| `import 'vitest/browser'` | Subpath export for browser | entry as documented | (none) |
| `import 'vitest/globals'` | Subpath export for globals | entry as documented | (none) |
| `import 'vitest/runners'` | Subpath export for runners | entry as documented | (none) |
| `import 'vitest/runtime'` | Subpath export for runtime | entry as documented | (none) |

## Source

- Official docs: https://vitest.dev
- Description: Next generation testing framework powered by Vite
