# gitleaks — Best Practices

Secret scanning for working tree, staged changes and history

## Recommended Patterns

- Match the command to the stage: `gitleaks dir .` for the working tree, `gitleaks git --staged` in pre-commit, `gitleaks git .` for full history
- Always pass `--redact` in hooks and CI so a match never lands in logs
- Rotate a leaked credential first, then add it to the baseline — never the other way around
- Keep the `[allowlist]` narrow: a specific path plus a specific regex, and only for fixtures, docs examples and placeholders
- Pin the gitleaks version in the toolchain and use the same binary across every workspace
- Fail the CI job on findings; a warning-only step gets ignored
- Store the baseline file in the repo and review changes to it like code
- Re-scan full history after rewriting it, so removed secrets are actually gone

## Common Pitfalls

- A broad allowlist (whole directory or generic regex) hides real leaks
- Using the baseline to silence new findings turns the scanner into decoration
- Scanning only the working tree leaves secrets already committed in history
- Echoing the finding details without redaction publishes the secret in CI logs
- Hooks bypassed with `--no-verify` let staged secrets through — CI must still enforce
- Rotating nothing and just deleting the line: the secret stays valid in git history
- Version drift between local hooks and CI produces inconsistent results

## Perf Notes

- Run staged scans in hooks (fast) and history scans in CI or on demand
- Scope history scans to changed paths for large monorepos when a full scan is too slow
- Keep custom rules few and precise; every extra regex costs scan time

## Do / Don't

| Do | Don't |
|----|-------|
| `--redact` everywhere | raw matches in logs |
| rotate then baseline | baseline to hide a live secret |
| narrow path+regex allowlist | allowlist a whole directory |
| fail CI on findings | warn and continue |
| pin one version | local/CI version drift |
