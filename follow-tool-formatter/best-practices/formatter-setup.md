# Formatter Best Practices

Guidance for selecting, configuring, and integrating a formatter so the team stays consistent — prettier, biome, dprint, rustfmt, ruff, gofmt

## Recommended Patterns

### 1. One formatter per language, one source of truth

- pick one formatter per language and commit the config at the root: `biome.json`, `.prettierrc`, `rustfmt.toml`
- never let 2 formatters touch the same file (e.g. prettier + eslint stylistic rules) → endless conflict loops
- monorepo: config at the root for sub-packages to inherit — override only when truly necessary

### 2. Standard scripts

```json
{
  "scripts": {
    "format": "biome format --write .",
    "format:check": "biome format ."
  }
}
```

- `format` = write mode for local/pre-commit
- `format:check` = read-only for CI — exits non-zero when a file is unformatted
- every formatter has a check mode: `prettier --check`, `dprint fmt --check`, `cargo fmt --check`, `ruff format --check`

### 3. Complete ignores

```text
# .prettierignore / ignores in config
node_modules/
dist/
coverage/
*.lock
*.min.js
.generated/
```

- generated files, vendored files, lock files must be ignored — formatting them = massive diff noise and slow
- most tools respect `.gitignore` already (biome, dprint) — prettier needs a separate `.prettierignore`

### 4. Format on save + pre-commit gate

- editor `formatOnSave` + pointing the formatter as the default formatter → nobody commits unformatted code
- pre-commit hook (hk/lefthook/moon `vcs.hooks`) runs format on staged files only — fast and doesn't touch files you didn't change
- CI `format:check` is the last gate — catches those who bypass the hook

## Do / Don't

| Do | Don't |
|---|---|
| formatter fixes style, linter fixes quality — separate duties | let linter rules act as the formatter (e.g. eslint indent rules) |
| use `--write` locally, `--check` in CI | run write mode in CI hoping someone commits it back |
| format only staged files in pre-commit | format the whole repo on every commit (slow) |
| reformat the whole repo in one PR when changing formatter/config | change config and let format drift happen gradually |
| pin the formatter version in devDependencies | let each machine use a different global formatter version |

## Common Pitfalls

- Editor extension on a different version than the repo: the VS Code prettier extension uses its bundled prettier unless `prettier.prettierPath` is set → formatting differs from CI; point it at the `node_modules` version
- Format + lint fix colliding: `eslint --fix` with style rules + prettier → back-and-forth edits — use `eslint-config-prettier` to disable style rules
- Line endings on Windows: mismatched `endOfLine` / `core.autocrlf` → the formatter flip-flops every file — set `endOfLine: "lf"` in config and `* text=auto eol=lf` in `.gitattributes`
- Format-migration PR too large: switching formatters and reformatting the whole repo → a PR diff that swallows review — split a pure reformat PR with no logic change and add its commit to `.git-blame-ignore-revs`
- Slow pre-commit: formatting the whole repo in the hook → devs bypass with `--no-verify` — use staged-only (hk `fix` step, `lint-staged`, `dprint fmt --staged`)

## Performance / CI Notes

- Typical speed ranking: `biome`/`dprint` (Rust, parallel) > `prettier` — on large codebases this matters for pre-commit latency
- `dprint --incremental` / `biome --changed` save time in big repos
- CI: `format:check` as a separate job or inside the lint job — fast-fail before heavier test jobs
- cache the formatter binary/config in CI (`actions/cache` for cargo tools or bun install)
- `.editorconfig` as the cross-editor baseline (`indent_style`, `indent_width`) — many formatters read it as a fallback
