# Linter — Best Practices

Linter usage discipline — minimal config, zero-warning policy, and CI parity

## Recommended Patterns

- Primary linter per stack: JS/TS → Biome (`/follow-tool-biome`) or ESLint, Rust → clippy, CSS → stylelint — one tool per domain
- Minimal config: add only the rules that deviate from the recommended preset — `/follow-default-config`
- CI uses exactly the same command as local — parity, no "works on my machine"
- `--fix`/`--unsafe-fixes` in local only — CI uses check mode (fail, no modify)
- Editor integration = format/lint on save — the shortest feedback loop

## Common Pitfalls

- Rule sprawl: enabling every rule = noise → the team ignores it; start from recommended then add per real needs
- Inline disables (`eslint-disable`, `#[allow]`) need a reason — audit periodically; file-level disables = red flag
- Lint doesn't fix architecture — the linter catches style/bugs, design needs review
- Two linters overlapping (ESLint + Biome on the same files) = conflicting fixes — pick one owner per file type
- Version drift between local and CI — pin the version in the manifest + lockfile

## Workflow

- Zero-warning policy: baseline the warnings → ratchet down to 0 — ignored warnings are worse than no lint
- New rules rollout: warn → fix wave → error
- Autofixable rules = gate strict; opinionated manual rules = warn

## Do / Don't

| Do | Don't |
|----|-------|
| one linter per domain | overlapping linters flip-flop |
| recommended preset + minimal overrides | hand-pick 200 rules |
| fix warnings to zero | accumulate warn debt |
| disables with an explanatory comment | file-level disables |
