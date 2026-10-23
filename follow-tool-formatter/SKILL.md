---
name: follow-tool-formatter
description: Use a code formatter in the project to keep style consistent
argument-hint: "[scope]"
related:
  - follow-tool-linter
  - follow-tool-data-validation
  - follow-tool-viteplus
  - follow-tool-biome
  - follow-tool-dprint
  - run-verify
  - update-references
  - run-lint
  - run-format

---

## Goal

Use a code formatter in the project to format code consistently per the style guide

## Scope

Use for projects needing a formatter supporting TypeScript, JavaScript, Rust, Python, Go, per tech stack

- Boundary: this skill helps select and wire a formatter into the repo/CI — after choosing a tool use its dedicated skill (`/follow-tool-viteplus`, `/follow-tool-biome`, `/follow-tool-dprint`) for detailed config; linting lives in `/follow-tool-linter`
- Vite+ projects: `vp fmt` (Oxfmt) is the formatter — options live in the `fmt` block of the root `vite.config.ts`, nested format configs are ignored, and `vp check` runs format + lint + type-aware checks together; the full toolchain lives in `/follow-tool-viteplus`
- Bun runtime: `bun fmt` is built in (no install) and is the default formatter for Bun projects — it cannot lint, has no dedicated editor extension, and is invoked as `bun fmt --no-script` when a `fmt` script exists
- Latest: `dprint@0.57.4` / `@biomejs/biome@2.5.14` (verified 2026-09-26) for non-Vite+, non-Bun repos; `vp fmt` and `bun fmt` ship with their toolchains — no version pin
- Prettier is not a new-project choice: migrate an existing `.prettierrc`/`.prettierignore`/`prettier` dependency to `vp fmt` (Vite+), `bun fmt` (Bun), or Oxfmt; `bun fmt --doctor` lists Prettier packages that become removable
- References: [cli](references/cli.md) | [apis](references/apis.md) 
- References: [Formatter Best Practices](best-practices/formatter-setup.md)

## Execute

### 1. Select Formatter

> Goal: pick the formatter by tech stack

1. Check the project's tech stack
2. Pick a formatter by fit:
   - Vite+ project (`vite-plus` dependency or a `fmt` block in the root `vite.config.ts`): `vp fmt` (Oxfmt) — format, lint, and type-aware checks run together via `vp check`
   - TypeScript/JavaScript on Bun outside Vite+: `bun fmt` (built in, zero install) — lint separately with `/follow-tool-biome`, `/follow-tool-eslint`, or `/follow-tool-viteplus`
   - TypeScript/JavaScript on Node/npm/pnpm without Vite+: `@biomejs/biome` or `dprint`
   - Rust: rustfmt
   - Python: ruff format, black
   - Go: gofmt
3. If the project already has a formatter → keep using it
4. If the existing formatter is Prettier → plan a migration to `vp fmt` or `bun fmt` in a single reformat commit, then delete `.prettierrc`, `.prettierignore`, and the `prettier` dependency

### 2. Configure Formatter

> Goal: configure the formatter to match the style guide

1. Create the config file per formatter:
   - Vite+: the `fmt` block in the root `vite.config.ts` — this is the single source of truth; nested format configs inside packages are ignored
   - Biome: `biome.json` / `biome.jsonc`; dprint: `dprint.jsonc`; Rust: `rustfmt.toml`
2. Set quote, semicolon, tab width, line width per project convention
3. Vite+: `fmt` accepts `singleQuote`, `semi`, `printWidth`, `tabWidth`, `useTabs`, `trailingComma`, `ignorePatterns`, `sortPackageJson`, `sortImports`; per-package overrides go in `fmt.overrides`; `vp fmt -c <path>` selects another config
4. `bun fmt`: put options in `bunfig.toml` `[fmt]` (`printWidth`, `tabWidth`, `useTabs`, `semi`, `singleQuote`, `trailingComma`) — it also reads `.prettierignore` and `.editorconfig`, never `.prettierrc`; opt in to sorts (`sortImports`, `sortPackageJson`, `sortTailwindcss`, `jsdoc`) only when the project wants them
5. Use `ignore`/`exclude`/`ignorePatterns` for generated files, vendored files, lock files
6. Keep the config at the root or in `.config/` per project structure
7. If `package.json` scripts exist, add `"format": "vp fmt"` + `"format:check": "vp fmt --check"` for Vite+ projects, or `bun fmt` equivalents for Bun projects — then invoke the built-in explicitly as `bun fmt --no-script` because a `fmt` script shadows it

### 3. Run Formatter

> Goal: format all code

1. Run the formatter over every relevant file — `vp fmt` and `bun fmt` write in place; `vp fmt --check` / `bun fmt --check` only report
2. Review the diff for unintended changes
3. Unintended changes → adjust the config and re-format
4. Run `format:check` or the equivalent to verify in CI (`vp fmt --check` or `vp check` for Vite+, `bun fmt --check` for Bun)
5. Fast pre-commit runs: `vp staged` (Vite+, lint-staged backed by `.vite-hooks/`), `bun fmt --staged` / `--changed`, `dprint fmt --staged`
6. Keep `bun fmt --stdin-filepath <file>` for editor integrations on Bun projects; `vp fmt -c <path>` selects another config for Vite+
7. `bun fmt` covers JS/TS/JSX, CSS/SCSS/Less, HTML/Vue/Svelte/Angular, JSON/YAML/TOML, Markdown/MDX, GraphQL, Handlebars; `vp fmt` covers the Oxfmt-supported set — for Python, Go, PHP, or Rust keep that language's own formatter

### 4. Integrate With Lint And CI

> Goal: the formatter works with lint and CI

1. Keep `format` separate from `lint` (format may fix files; lint only checks) — `bun fmt` never lints, and Vite+ exposes format and lint as separate `fmt`/`lint` blocks even though `vp check` runs both
2. Use a read-only check in CI: `vp fmt --check` or `vp check` for Vite+, `bun fmt --check` for Bun, `prettier --check` is not an option anymore; `bun fmt --doctor` reports Prettier packages the built-in formatter makes redundant
3. Git hooks for format (fix): Vite+ projects → `vp staged` with `staged: { '*': 'vp check --fix' }`; repos with `.moon/workspace.yml` → add `moon run :format --affected --status=staged` to moon's `vcs.hooks`; other repos → an hk/lefthook `pre-commit` step
4. Run `/run-verify` to verify format + lint + typecheck

### 5. Editor And Onboarding

> Goal: the team uses the formatter consistently

1. Add editor integration — Vite+ projects use the Oxc extension pack with `"oxc.fmt.disableNestedConfig": true` so the root `fmt` block wins; Bun/Biome/dprint projects point the editor at the repo-installed formatter binary
2. Keep `.editorconfig` as the cross-editor baseline for indent/line endings
3. Document how to format before commit
4. If using `formatOnSave` → state it in the editor config
5. Confirm CI catches unformatted code

## Rules

### 1. Format Separate From Lint

- the formatter handles style (spacing, quote, semicolon)
- the linter handles code quality (unused, errors, patterns)
- never let the linter be the primary formatter

### 2. Config In Version Control

- the config file must live in the repo
- do not commit personal/IDE-specific format settings
- use root-level config for consistency

### 3. Fast And Deterministic

- the formatter must be fast enough for pre-commit
- deterministic output (re-running yields the same result)
- do not format generated or vendored files

### 4. No Manual Formatting Battles

- never commit unformatted code
- do not switch formatters often
- changing formatter → run `/update-references` and note it in the CHANGELOG

### 5. One Formatter Per Repo

- never combine `vp fmt`, `bun fmt`, biome, dprint, or a linter's fixer on the same files
- Vite+ format config lives only in the root `vite.config.ts` `fmt` block; a Bun project keeps format options only in `bunfig.toml [fmt]`
- migrating off Prettier → one reformat commit, delete `.prettierrc` + `.prettierignore` + the `prettier` dependency, move ignore entries into `fmt.ignorePatterns` or `.gitignore`, then run `/update-references`

- Use `/follow-tool-linter` if needed
- Use `/follow-tool-data-validation` if needed
- Use `/follow-tool-viteplus` if needed
- Use `/follow-tool-biome` if needed
- Use `/follow-tool-dprint` if needed
- Use `/run-verify` to verify format + lint + typecheck
- Use `/update-references` when changing formatter
- Use `/run-lint` if needed
- Use `/run-format` if needed

- See best-practices/ for recommended patterns and pitfalls

## Expected Outcome

- Formatter selected and configured correctly for the stack (`vp fmt` on Vite+, `bun fmt` on Bun, biome/dprint elsewhere)
- `format` and `format:check` scripts work (`vp fmt` / `vp fmt --check` or `bun fmt` / `bun fmt --check`)
- CI catches unformatted code
- Editor settings support format on save
- Code style stays consistent across the project
