# Use Case — Require a Changeset on Every Package PR

> Block a PR that changes a published package without declaring a semver intent. Source: https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md (accessed 2026-10-20)

## 1. The check

```bash
# fails when a changed package has no pending changeset
bunx changeset status --since=origin/main
```

`changeset status` exits non-zero when a package touched by the diff has neither a changeset nor is listed in `ignore`.

## 2. Wire it into CI

```yaml
- name: Changeset present
  if: github.event_name == 'pull_request'
  run: |
    git fetch origin main --depth=1
    bunx changeset status --since=origin/main
```

`--since` needs the base branch locally: fetch it first, or the command compares against an empty diff and always passes.

## 3. Let maintainers opt out

```json
// .changeset/config.json
{ "ignore": ["@acme/docs", "@acme/e2e"], "privatePackages": { "version": false } }
```

Apps that are never published belong in `ignore`; otherwise every internal tweak demands a changeset.

## 4. Make the failure actionable

```yaml
- name: Changeset present
  if: github.event_name == 'pull_request'
  run: |
    git fetch origin main --depth=1
    if ! bunx changeset status --since=origin/main; then
      echo "::error::Run 'bunx changeset add' and commit the generated file."
      exit 1
    fi
```

## Pitfalls

- Running the check on `push` to `main` → the changeset is already consumed by `changeset version`; only PRs can carry it.
- `--since` pointing at a branch that does not exist locally → the check silently passes; always `git fetch` first.
- A bot commit that adds an empty changeset to satisfy the gate → semver intent becomes meaningless; review the summary line.
- Skipping the check for "docs only" by path filter → a docs edit inside a package's `README` still ships; filter by package, not by file extension.

## Related

- `references/cli.md`
- `best-practices/changesets.md`
- `usecases/monorepo-release-workflow.md`
