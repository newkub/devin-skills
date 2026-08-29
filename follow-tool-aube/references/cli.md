# Aube CLI

## Install

```sh
bun add -D aube
```

## Version

- Latest on npm
- Repository: https://github.com/aubejs/aube
- Docs: https://github.com/aubejs/aube

## Commands

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `aube install` | Install dependencies from aube.lock | -g, --global, --registry, --save |
| `aube add <pkg>` | Add dependency | -D, --dev, -g, --global, --registry |
| `aube remove <pkg>` | Remove dependency | -g, --global |
| `aube list` | List installed packages | --depth, --json |
| `aube search <pkg>` | Search registry | --registry, --limit |
| `aube update` | Update dependencies | -g, --global, --interactive |
| `aube run <script>` | Run package script | --watch, --env |
## Examples

```sh
bunx aube install
```
```sh
bunx aube add lodash -D
```
