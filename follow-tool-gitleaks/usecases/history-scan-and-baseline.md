# Use Case — Scan History Once, Then Keep A Honest Baseline

> A full-history scan on an old repository always finds something; the work is deciding which findings are already dead and keeping that decision from turning into a blanket suppressor. Sources: https://github.com/gitleaks/gitleaks and `gitleaks --help` (accessed 2026-10-21)

## 1. Scan the history and keep the report

```sh
gitleaks git . --redact -r gitleaks-report.json
```

`gitleaks git` walks `git log -p`; the report lands on disk with every finding and its commit. Run it from a full clone — a shallow or partial clone has truncated history, so a clean result means "nothing in the last N commits", not "nothing ever".

## 2. Triage before baselining

For each finding, the answer is one of three:

1. The credential is still live → revoke it at the provider, replace it, and treat the rotation as the fix
2. The credential is already revoked → it is history noise; a candidate for the baseline
3. The match is a fixture, an example, or an obvious placeholder → path-scoped allowlist entry

Only case 2 belongs in a baseline. A baseline created before triage is a list of findings nobody read.

## 3. Create and use the baseline

```sh
# first run records the current findings into the baseline
gitleaks git . -b .gitleaks-baseline.json
# later runs ignore what the baseline recorded
```

```sh
gitleaks git . -b .gitleaks-baseline.json --redact
```

The second run reports only findings that are not in the baseline and exits 0 when there are none. Commit the baseline together with a note on why each entry is safe, because the file is otherwise indistinguishable from a list of ignored secrets.

## 4. Give CI a format it understands

```sh
gitleaks git . --redact -f sarif -r report.sarif
gitleaks git . --redact -f junit -r report.xml
```

SARIF uploads to code scanning so a finding is attached to the commit; JUnit fits a test-report view. Both keep the pipeline failure readable without printing the secret.

## 5. Bound the runtime on a large repository

```sh
gitleaks git . --log-opts="--since=2024-01-01" --max-target-megabytes 5 --timeout 600
```

`--log-opts` limits which commits are walked, `--max-target-megabytes` skips huge blobs, and `--timeout` stops a runaway scan. A narrower range makes the job finish; it also means older commits are no longer covered — say so where the job is configured.

## 6. Verify

1. The scan with `-b` exits 0 on `main`
2. Introduce a new fake secret in a new commit and confirm the same command exits non-zero
3. Confirm the report file is not tracked by git — a report without `--redact` contains the secrets it found
4. Re-run the full scan without `-b` periodically and confirm the baseline entries are still revoked, not merely old

## Pitfalls

- Creating the baseline before triage, which converts "we have not looked" into "we decided to ignore".
- Committing `gitleaks-report.json` produced without `--redact` — the report is a credential dump.
- A baseline file that grows on every scan instead of shrinking as credentials are rotated.
- Scanning a shallow clone in CI and reading the clean result as a clean history.
- Narrowing `--log-opts` and dropping the very range that contains the known leak.
- Rotating a credential but leaving the old value in the repository, so the baseline entry stays valid forever.
- Using the baseline to silence a finding that is still live because the rotation is "planned".

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/gitleaks.md`
- `usecases/pre-commit-secret-guard.md`
