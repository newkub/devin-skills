# Build Packages CLI

## Install

```sh
bun add -D build-packages
```

## Version

- Latest on npm
- Repository: https://github.com/darkflare/build-packages
- Docs: https://github.com/darkflare/build-packages

## Commands

| commands | description | default | options |
|---|---|---|---|
| `build-packages` | Build all packages in workspace | — | --config, --watch, --clean, --output |
| `build-packages --watch` | Watch and rebuild | — | --ignore-watch |
| `build-packages --clean` | Clean output directories | — | --yes |

## Notes

Tooling may vary by package; see project docs for exact flags.
## Examples

```sh
bunx build-packages
```
```sh
bunx build-packages --watch
```
