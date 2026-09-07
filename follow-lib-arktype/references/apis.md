# Lib Arktype API & Dependencies

## Install

```sh
bun add -D arktype
# or
npm install --save-dev arktype
```

## Version

- Latest: 2.2.3
- [Package Registry](https://www.npmjs.com/package/arktype)
- [Repository](https://github.com/arktypeio/arktype)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install arktype in project | latest version | --save-dev, --save, --global |
| `import` | Import from 'arktype' | default or named | (none) |
| `configure` | Configure project settings | project defaults | --config, --file |
| `use` | Use the main API / runtime | as documented | (none) |
| `import 'arktype/config'` | Subpath export for config | entry as documented | (none) |
| `import 'arktype/internal/*.ts'` | Subpath export for internal/*.ts | entry as documented | (none) |
| `import 'arktype/internal/*.js'` | Subpath export for internal/*.js | entry as documented | (none) |

## Source

- Official docs: https://arktype.io
- Description: TypeScript's 1:1 validator, optimized from editor to runtime
