# Use Case — Stop Secrets At The Commit

> A secret is cheap to block before the commit and expensive after the push: blocking it costs one hook run, removing it costs a rotation plus a history rewrite. Sources: https://github.com/gitleaks/gitleaks and `gitleaks --help` (accessed 2026-10-21)

## 1. Scan once by hand before enabling a hook

```sh
gitleaks dir . -v
```

Run it on a clean checkout first. If the baseline is already noisy, a hook added today fails every commit and gets bypassed within a week — tune the rules and allowlists before wiring anything.

## 2. Narrow the allowlist to real fixtures

```toml
[[allowlists]]
description = "test fixtures and docs examples"
paths = ['''tests/fixtures/.*''', '''docs/.*\.md''']
regexes = ['''YOUR_API_KEY_HERE''']
```

Commit `.gitleaks.toml` at the repo root so every machine and CI evaluate the same rules. An allowlist entry that is a bare regex on a token prefix will hide the leak you are looking for; keep entries scoped to a path.

## 3. Wire the hook

```yaml
# .pre-commit-config.yaml — rev is required; use the same release tag the toolchain pins
repos:
  - repo: https://github.com/gitleaks/gitleaks
    hooks:
      - id: gitleaks
```

Keep `rev` identical to the tag in `mise.toml`, otherwise the hook and CI scan with different rules. With hk the builtin replaces the wrapper:

```pkl
local linters = new Mapping<String, Step> {
  ["gitleaks"] = (Builtins.gitleaks) { scan = "staged" }
}
```

For a one-off check of what is staged right now:

```sh
git diff --cached | gitleaks stdin --redact -v
```

## 4. Redact everywhere the output can be read

```sh
gitleaks dir . --redact -v
```

`--redact` masks the value in logs and stdout. A secret printed to a CI log is a leaked secret even when the scan fails the job, so redaction belongs in the hook and the pipeline command, not only in the manual run.

## 5. Decide what happens when the hook fires

1. The finding is a real credential → revoke and rotate it with the provider first, then remove it from the file
2. The finding is a fixture or example → add a path-scoped allowlist entry and re-run
3. The finding is in a file that should not be committed at all → add the file to `.gitignore` and unstage it
4. Never bypass with `git commit --no-verify` to "deal with it later" — that is the one commit that reaches the remote

## 6. Verify

1. Create a file containing a fake key and stage it — the commit must be blocked and the value must appear redacted
2. Remove the file and commit — the commit must pass
3. Run the hook on a fresh clone, not only on your machine, to confirm the config is committed
4. Run `/check-secrets` to confirm the environment and configuration side is also clean

## Pitfalls

- Adding a broad allowlist regex to make the hook quiet — that silences the class of secret the project is most likely to leak.
- Running the scan with no `--redact` in CI, so the failure report itself publishes the key.
- Leaving `.gitleaks.toml` uncommitted, so each developer scans with different rules and CI disagrees with every local run.
- Using the deprecated `detect` and `protect` commands copied from older docs; the current surface is `git`, `dir`, and `stdin`.
- Scanning only tracked files and missing a new file that is already staged.
- Treating a rotated credential as fixed without removing it from the file — the next scan still finds it and the next reader still copies it.
- Bypassing the hook once "because the push was urgent"; the secret is then in the history that everyone clones.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/gitleaks.md`
- `usecases/history-scan-and-baseline.md`
