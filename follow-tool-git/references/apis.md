# Tool Git API & Dependencies

## Install

```sh
bun add -D git
# or
npm install --save-dev git
```

## Version

- Latest: 0.1.5
- [Package Registry](https://www.npmjs.com/package/git)
- [Repository](git@github.com:christkv/node-git)

## Dependencies

- See package registry for transitive dependencies.

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `install` | Install git in project | latest version | --save-dev, --save, --global |
| `git` | Run the tool CLI | current workspace | see cli.md |
| `configure` | Configure via config file | project defaults | --config, --file |

## Source

- Official docs: https://www.npmjs.com/package/git
- Description: A node.js library for git
