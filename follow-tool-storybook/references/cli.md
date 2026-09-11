# Storybook CLI

## Install

```sh
bun add -D storybook
```

## Version

- Latest: `10.6.x` (verified 2026-09-12)
- Repository: https://github.com/storybookjs/storybook
- Docs: https://storybook.js.org/docs/api/cli-options/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `storybook dev` | Start dev server on port `6006` | — | `-p, --port`, `-h, --host`, `-c, --config-dir`, `--loglevel`, `--https`, `--ssl-cert`, `--ssl-key`, `--smoke-test`, `--no-open` |
| `storybook build` | Build static storybook to `storybook-static/` | — | `-o, --output-dir`, `-c, --config-dir`, `--loglevel`, `--debug`, `--webpack-stats-json` |
| `storybook create` | Initialize Storybook in project (v10+; replaces `init`) | — | `--yes`, `--type`, `--package-manager` |
| `storybook test` | Run component tests (Vitest addon) | — | `--watch`, `--coverage` |
| `storybook automigrate` | Run automatic migrations | — | `--dry-run` |
| `storybook upgrade` | Upgrade Storybook to latest | — | (none) |
| `storybook add <addon>` | Install an addon | — | (none) |
| `storybook doctor` | Diagnose project issues | — | (none) |
| `storybook --help` | Show help | — | (none) |

## Examples

```sh
bunx storybook dev -p 9009
bunx storybook build -o ./dist/storybook
bunx storybook add @storybook/addon-a11y
```
