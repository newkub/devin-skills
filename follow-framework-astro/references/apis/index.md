# Framework Astro API & Dependencies

## Install

```sh
bun add -D astro
# or
npm install --save-dev astro
```

## Version

- Latest: 7.2.9
- [Package Registry](https://www.npmjs.com/package/astro)
- [Repository](https://github.com/withastro/astro)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install astro in project | latest version | --save-dev, --save, --global |
| `astro` | Run the astro CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'astro/app'` | Subpath export for app | entry as documented | (none) |
| `import 'astro/env'` | Subpath export for env | entry as documented | (none) |
| `import 'astro/zod'` | Subpath export for zod | entry as documented | (none) |
| `import 'astro/hono'` | Subpath export for hono | entry as documented | (none) |
| `import 'astro/debug'` | Subpath export for debug | entry as documented | (none) |
| `import 'astro/fetch'` | Subpath export for fetch | entry as documented | (none) |
| `import 'astro/types'` | Subpath export for types | entry as documented | (none) |
| `import 'astro/assets'` | Subpath export for assets | entry as documented | (none) |
| `import 'astro/client'` | Subpath export for client | entry as documented | (none) |
| `import 'astro/config'` | Subpath export for config | entry as documented | (none) |

## Source

- Official docs: https://astro.build
- Description: Astro is a modern site builder with web best practices, performance, and DX front-of-mind.
