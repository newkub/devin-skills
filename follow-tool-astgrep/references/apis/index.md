# Tool Ast Grep API & Dependencies

## Install

```sh
bun add -D @ast-grep/cli
# or
npm install --save-dev @ast-grep/cli
```

## Version

- Latest: 0.45.2
- [Package Registry](https://www.npmjs.com/package/@ast-grep/cli)
- [Repository](https://github.com/ast-grep/ast-grep)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install @ast-grep/cli in project | latest version | --save-dev, --save, --global |
| `sg` | Run the sg CLI | current workspace | --help, --version, --config |
| `ast-grep` | Run the ast-grep CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://ast-grep.github.io
- Description: Search and Rewrite code at large scale using precise AST pattern
