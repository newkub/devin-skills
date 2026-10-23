| key | value |
|---|---|
| install | none — `vp fmt` ships with Vite+ (Oxfmt), `bun fmt` ships with Bun; `bun add -D @biomejs/biome` or `dprint` only for Node/npm/pnpm repos |
| repository | https://github.com/biomejs/biome |
| docs | https://viteplus.dev/guide/fmt |
| docs (oxfmt) | https://oxc.rs/docs/guide/usage/formatter.html |
| docs (biome) | https://biomejs.dev/reference/cli/ |
| docs (bun fmt) | https://bun.com/docs/format |

| commands | description | default | options |
|---|---|---|---|
| `vp fmt` | Format in place with Oxfmt (Vite+ projects) | all files, respects `fmt.ignorePatterns` | --check, -c/--config |
| `vp check` | Format + lint + type-aware check in one pass | all files | --fix, --no-fmt, --no-lint, --quiet, --deny-warnings |
| `bun fmt` | Format in place with the built-in Bun formatter | respects `.gitignore`, `.prettierignore`, `bunfig.toml [fmt]` | --check, --list-different, --staged, --changed, --stdin-filepath, --no-script, --ignore-pattern |
| `biome format [paths]` | Format files | report only by default | --write, --stdin-file-path, --staged, --changed |
| `dprint fmt [files]` | Format in place | respect .gitignore | --check, --config, --no-gitignore, --incremental |

- `vp fmt` writes in place; `vp fmt --check` only reports and exits non-zero on unformatted files
- Vite+ format options live in the `fmt` block of the root `vite.config.ts` — nested `fmt` configs in packages are ignored
- `bun fmt` exit codes: `0` formatted/clean, `1` unformatted file found with `--check`, `2` formatter error
- `bun fmt` has no linting — run `/follow-tool-linter` or Biome/ESLint alongside it
- `bun fmt --doctor` lists installed Prettier packages the built-in formatter makes removable; Astro files still delegate to Prettier when it is installed
- Prettier is not a choice — migrate an existing `.prettierrc` to `vp fmt` or `bun fmt`
