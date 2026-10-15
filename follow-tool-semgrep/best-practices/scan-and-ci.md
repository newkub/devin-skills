# Semgrep Scan & CI Best Practices

## Recommended Patterns

- Start from specialized rulesets (`p/security-audit`, `p/owasp-top-ten`, `p/<language>`) — expand once the signal-to-noise ratio is good
- Use `--baseline` on legacy codebases — see only new findings, don't drown in the old backlog
- Use `--exclude`/`--include` or `.semgrepignore` to skip `tests/`, `*.generated.*`, `vendor/`, `dist/` — cuts noise and scan time
- Output `--sarif` for GitHub code scanning integration, `--json` for custom tooling
- Use `semgrep ci` + `semgrep login` when integrating with Semgrep AppSec Platform — get diff-aware scan, triage UI, policy management
- Diff-aware scanning: scan only the code changed in the PR — run full scans scheduled/nightly
- Gate CI with a severity threshold — start by failing only new `ERROR` findings, then tighten
- Triage before reporting: group by severity/confidence, mark false positives with `// nosemgrep` plus the reason

## Common Pitfalls

- Running `p/default` on a large codebase for the first time — thousands of findings, nobody reads them; start narrow
- Scanning `node_modules`/`dist`/generated files — wasted time + high noise
- No baseline for legacy — CI fails immediately from old findings and the team ignores the whole system
- `// nosemgrep` without a reason — impossible to tell intentional from lazy
- Rulesets not pinned — findings change on their own when the registry updates; reproducibility lost
- Dumping raw findings into the CI log — use `--sarif`/`--json` + a report formatter instead

## Do / Don't

| Do | Don't |
|----|-------|
| Baseline before enabling the CI gate | Block merges with all the old findings |
| Pin the ruleset/commit hash in CI | Pull the `latest` ruleset every run |
| Use `--sarif` for GitHub code scanning | Parse text output with regex |
| Add a reason next to `// nosemgrep` | Suppress without context |
| Scan only the PR diff, run full scans on a schedule | Full scan every commit on a big monorepo |

## Config Guidance

- Local dev: `semgrep scan --config=p/security-audit --config=.semgrep src/` — combines registry + custom rules
- CI: pin the config via `--config` pointing to a file in the repo or a locked ruleset
- Use `--metrics=off` in CI if you don't want to send telemetry
- `--max-target-bytes` skips abnormally large files (bundled output, minified files)
- `--jobs` tunes parallelism to the CI runner cores — the default auto-detect is usually enough

## Performance & CI

- Most scan time goes to the file count — `.semgrepignore` is always the first optimization
- Cache the semgrep binary/semgrep-core in the CI image or setup action — don't reinstall every run
- Split jobs: fast pattern rules in PR checks, taint/dataflow rules in nightly — saves PR time
- Findings that survive triage → route to `/deep-review-codebase` or `/fix` for remediation — semgrep is a detection tool, not a fixer
- Track the findings trend — a steadily rising count = the rules or the codebase need a review
