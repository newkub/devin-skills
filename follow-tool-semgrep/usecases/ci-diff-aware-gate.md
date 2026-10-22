# Use Case — Gate Pull Requests On New Findings Only

> Turning Semgrep on as a blocking gate over a legacy repo means hundreds of pre-existing findings and a team that disables the gate within a week. Gate what the change introduces, report the rest. Source: https://semgrep.dev/docs/ (accessed 2026-10-21)

## 1. Start with a narrow ruleset

```bash
semgrep scan --config=p/security-audit src/
```

`p/security-audit` and `p/owasp-top-ten` are focused; `p/default` across a whole repo is the usual first-run mistake.

## 2. Choose the baseline strategy that fits the repo

With a Semgrep AppSec Platform account (`SEMGREP_APP_TOKEN` held as a CI secret), a diff-aware scan reports only what the branch adds:

```bash
semgrep ci --baseline-commit=<main-sha>
```

Without an account, the honest alternative is two jobs: a scheduled full scan for the backlog, and a PR job limited to a severity threshold so it never blocks on old findings:

```bash
semgrep scan --config=p/security-audit --severity=ERROR src/
```

## 3. Publish SARIF instead of scraping logs

```yaml
      - run: semgrep scan --config=p/security-audit --sarif --output=semgrep.sarif --metrics=off
      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: semgrep.sarif
```

`--sarif` picks the format, `--output` the file; the upload step puts findings in the repository's code-scanning view, where they are triaged once instead of in every log.

## 4. Cut the file count before tuning rules

```
# .semgrepignore
dist/
node_modules/
*.generated.*
public/
```

Most scan time is file count, so `.semgrepignore` is the first optimization and the first noise reduction. `--max-target-bytes` handles the oversized bundle that slips past it, and `--exclude` covers a one-off path.

## 5. Prove the gate can fail

Create a scratch branch with a known-bad pattern (a string-built SQL query, `eval` on request input), push it, and confirm the job goes red. Then delete the branch. A gate nobody has seen fail is a gate nobody knows works.

## 6. Verify

1. The PR job passes on a clean branch and fails on the scratch branch
2. SARIF reaches code scanning — the findings appear with file:line, not as log text
3. Scheduled full scan is separate from the PR job, and its findings are triaged, not blocking
4. `--metrics=off` where telemetry must not leave the runner
5. Ruleset pinned — a file in the repo or a fixed registry reference, so findings do not change on their own

## Pitfalls

- Enabling the blocking gate over the whole legacy backlog — the team disables it, and the tool loses credibility.
- Scanning `dist/` and generated files: slow, and the findings are not actionable.
- Suppressing with `// nosemgrep` and no reason — the next reader cannot tell intentional from lazy.
- Unpinned rulesets: a registry update changes the result set with no code change.
- One job doing both full and diff-aware scans, so PR time is the full-scan time.
- Dumping raw text findings into the log instead of SARIF/JSON.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/scan-and-ci.md`
- `workflows/config-rules/SKILL.md`
- `usecases/custom-rule-with-tests.md`
