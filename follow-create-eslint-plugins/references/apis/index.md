# Create Eslint Plugins API & Dependencies

## Install

```sh
bun add -D eslint
# or
npm install --save-dev eslint
```

## Version

- Latest: 10.9.1
- [Package Registry](https://www.npmjs.com/package/eslint)
- [Repository](https://github.com/eslint/eslint)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install eslint in project | latest version | --save-dev, --save, --global |
| `eslint` | Run the eslint CLI | current workspace | --help, --version, --config |
| `configure` | Configure via config file | project defaults | --config, --file |
| `import 'eslint/rules'` | Subpath export for rules | entry as documented | (none) |
| `import 'eslint/config'` | Subpath export for config | entry as documented | (none) |
| `import 'eslint/universal'` | Subpath export for universal | entry as documented | (none) |
| `import 'eslint/use-at-your-own-risk'` | Subpath export for use-at-your-own-risk | entry as documented | (none) |

## Source

- Official docs: https://eslint.org
- Description: An AST-based pattern checker for JavaScript.
