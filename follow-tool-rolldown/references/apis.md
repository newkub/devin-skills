# Tool Rolldown API & Dependencies

## Install

```sh
bun add -D rolldown
# or
npm install --save-dev rolldown
```

## Version

- Latest: 1.2.6
- [Package Registry](https://www.npmjs.com/package/rolldown)
- [Repository](https://github.com/rolldown-rs/rolldown)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install rolldown in project | latest version | --save-dev, --save, --global |
| `rolldown` | Run the rolldown CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'rolldown/utils'` | Subpath export for utils | entry as documented | (none) |
| `import 'rolldown/config'` | Subpath export for config | entry as documented | (none) |
| `import 'rolldown/filter'` | Subpath export for filter | entry as documented | (none) |
| `import 'rolldown/plugins'` | Subpath export for plugins | entry as documented | (none) |
| `import 'rolldown/parseAst'` | Subpath export for parseAst | entry as documented | (none) |
| `import 'rolldown/experimental'` | Subpath export for experimental | entry as documented | (none) |
| `import 'rolldown/getLogFilter'` | Subpath export for getLogFilter | entry as documented | (none) |
| `import 'rolldown/parallelPlugin'` | Subpath export for parallelPlugin | entry as documented | (none) |
| `import 'rolldown/experimental/runtime'` | Subpath export for experimental/runtime | entry as documented | (none) |
| `import 'rolldown/experimental/runtime-types'` | Subpath export for experimental/runtime-types | entry as documented | (none) |

## Source

- Official docs: https://rolldown.rs/
- Description: Fast JavaScript/TypeScript bundler in Rust with Rollup-compatible API.
