# Formatter Best Practices

Guidance for selecting, configuring, and integrating a formatter so the team stays consistent — `vp fmt` (Oxfmt), `bun fmt`, biome, dprint, rustfmt, ruff, gofmt

## Recommended Patterns

### 1. One formatter per language, one source of truth

- pick one formatter per language and commit the config at the root:
  - Vite+: the `fmt` block in the root `vite.config.ts` (nested `fmt` configs in packages are ignored)
  - Bun: `bunfig.toml` `[fmt]`
  - Node/npm/pnpm: `biome.json` or `dprint.jsonc`
  - Rust: `rustfmt.toml`; Python: `ruff.toml`/`pyproject.toml`; Go: `gofmt` needs none
- never let 2 formatters touch the same file (e.g. `vp fmt` plus a linter's fixer, or `bun fmt` plus biome) → endless conflict loops
- monorepo: config at the root for sub-packages to inherit — override only when truly necessary (Vite+ `fmt.overrides`)

### 2. Standard scripts

Vite+ project:

```json
{
  "scripts": {
    "format": "vp fmt",
    "format:check": "vp fmt --check"
  }
}
```

Bun project:

```json
{
  "scripts": {
    "format": "bun fmt",
    "format:check": "bun fmt --check"
  }
}
```

- `format` = write mode for local/pre-commit
- `format:check` = read-only for CI — exits non-zero when a file is unformatted
- every formatter has a check mode: `vp fmt --check`, `bun fmt --check`, `dprint fmt --check`, `cargo fmt --check`, `ruff format --check`; Vite+ also runs everything at once with `vp check`
- a `fmt` script in `package.json` shadows the built-in `bun fmt` command — name the script `format`/`format:check`, or call the built-in as `bun fmt --no-script`
- Prettier is not an option — migrate `.prettierrc` to `vp fmt` (Vite+) or `bun fmt` (Bun)

### 3. Complete ignores

```text
# fmt.ignorePatterns (Vite+) / .gitignore for bun fmt, biome, dprint
node_modules/
dist/
coverage/
*.lock
*.min.js
.generated/
```

- generated files, vendored files, lock files must be ignored — formatting them = massive diff noise and slow
- `vp fmt` uses `fmt.ignorePatterns`; `bun fmt` reads `.gitignore` and `.prettierignore`; biome/dprint respect `.gitignore` by default
- keep ignore entries in one place per repo — do not split between `.prettierignore`, `.gitignore`, and config

### 4. Format on save + pre-commit gate

- editor `formatOnSave` + pointing the formatter as the default formatter → nobody commits unformatted code; Vite+ projects use the Oxc extension pack with `"oxc.fmt.disableNestedConfig": true`
- pre-commit hook runs format on staged files only — `vp staged` on Vite+, `bun fmt --staged` / `--changed`, `dprint fmt --staged`, or an hk/lefthook/moon `vcs.hooks` step
- CI `format:check` is the last gate — catches those who bypass the hook

## Do / Don't

| Do | Don't |
|---|---|
| formatter fixes style, linter fixes quality — separate duties | let linter rules act as the formatter (e.g. eslint indent rules) |
| use write mode locally, `--check` in CI | run write mode in CI hoping someone commits it back |
| format only staged files in pre-commit (`vp staged`, `bun fmt --staged`) | format the whole repo on every commit (slow) |
| reformat the whole repo in one PR when changing formatter/config | change config and let format drift happen gradually |
| pin the formatter version in devDependencies | let each machine use a different global formatter version |

## Common Pitfalls

- Editor extension on a different formatter than the repo: the editor uses its bundled binary → formatting differs from CI; point it at the repo formatter (Oxc extension for Vite+, the repo-installed biome/dprint binary otherwise)
- Format + lint fix colliding: a linter's fixer and the formatter editing the same lines → back-and-forth edits — keep style rules out of the linter
- Line endings on Windows: mismatched `endOfLine` / `core.autocrlf` → the formatter flip-flops every file — set `endOfLine: "lf"` in config and `* text=auto eol=lf` in `.gitattributes`
- Format-migration PR too large: switching formatters and reformatting the whole repo → a PR diff that swallows review — split a pure reformat PR with no logic change and add its commit to `.git-blame-ignore-revs`
- Slow pre-commit: formatting the whole repo in the hook → devs bypass with `--no-verify` — use staged-only (`vp staged`, `bun fmt --staged`, `dprint fmt --staged`)

## Performance / CI Notes

- Typical speed ranking: `oxfmt`/`biome`/`dprint` (native, parallel) > JS formatters — on large codebases this matters for pre-commit latency; `bun fmt` is built into the runtime (no separate binary)
- `dprint --incremental`, `vp staged` (staged-only), and `bun fmt --changed` save time in big repos
- CI: `format:check` as a separate job or inside the lint job — fast-fail before heavier test jobs
- cache the formatter binary/config in CI (`actions/cache` for cargo tools or bun install)
- `.editorconfig` as the cross-editor baseline (`indent_style`, `indent_width`) — many formatters read it as a fallback (`bun fmt` reads it too)
