# jscpd — Best Practices

Copy-paste detection — thresholds, ignores, and CI discipline

## Recommended Patterns

- Config in `.jscpd.json` or the `package.json` key — `threshold` (default 5%), `minTokens` (50-70 sweet spot), `reporters`
- Excludes: generated code, lockfiles, `*.min.*`, snapshots, fixtures — via `ignore` patterns
- Raise `minLines`/`minTokens` for strict mode — low defaults = false positives from boilerplate
- CI: `jscpd --exitCode 1` fails when the threshold is exceeded — baseline the current % first, then ratchet down
- Reporters: `console` for dev + `html`/`badge` for reports

## Common Pitfalls

- Test files = legit duplication (setup patterns) — ignore `**/*.test.*` or accept a higher threshold for tests
- jscpd detects cross-language clones — near-identical `.tsx` vs `.ts` files get flagged; treat as a signal, not always noise
- Generated code (proto, gql codegen) must be ignored — that duplication isn't fixable
- Threshold 0 = too noisy to use — start at 5-10% then reduce gradually
- Ignore blocks (`/* jscpd:ignore-start */`) — use only for justified cases (protocol-mandated boilerplate)

## Workflow

- Baseline → ratchet: measure current dup % → set threshold = current → ticket to reduce → lower the threshold
- Findings = refactor targets: extract a shared module/hook — but not every clone must be fixed (similar ≠ same abstraction)

## Do / Don't

| Do | Don't |
|----|-------|
| threshold + ignores in a config file | CLI flags scattered per invocation |
| ignore generated/test boilerplate | tune minTokens until silent |
| ratchet the threshold down gradually | set 0% and let the team mute it |
| review clones as refactor signals | auto-extract every match |
