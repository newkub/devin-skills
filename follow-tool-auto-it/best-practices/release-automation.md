# Auto Best Practices

Guidelines for using `auto` (intuit/auto) for automated releases — label-driven versioning, config, tokens, and CI workflow

## Recommended Patterns

### Label-Driven Versioning

- Auto computes the semver bump from PR labels (default: `major`, `minor`, `patch`), not from commit messages — teach the team to label every PR that should release
- Use the `skip-release` or `internal`/`documentation` labels for PRs that should not trigger a release (configured via the `labels` section in `.autorc`)
- Enable a required-labels check in CI (`auto pr-check` or the GitHub Action equivalent) to enforce a version label on every PR before merge
- A PR without a version label counts as no bump — if several PRs merge with no labels at all, `shipit` skips the release (it is not an error)

### Config Structure

- Keep config in a separate `.autorc` file when options get long — the `package.json` `auto` field suits short configs
- Always set `author` (name + email) — Auto uses it for the changelog/tag commits; without it the release fails
- Set `baseBranch` to match the real branch (`main`/`master`) — a mismatch makes `shipit` compute the diff wrong
- Use `onlyPublishWithReleaseLabel: true` when merges should not release until the `release` label is applied — good for batching

### Plugins

- `released` plugin: comments back on PRs/issues with which version shipped — keep it on for traceability
- `conventional-commits` plugin: parses commit messages to add labels automatically — use as a safety net, labels remain the source of truth
- The `npm` plugin is the default for JS packages — set `subPackageChangelogs` for monorepos if used
- Choose the minimal complete plugin set — each plugin adds surface to maintain

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| No `author` in config | release commit fails | add `author` in `.autorc` or `package.json` |
| Expecting commit `feat:` to bump alone | merged but no release | Auto reads labels, not commits — label the PR or use the conventional-commits plugin |
| Workflow missing `permissions` | push tag/release fails 403 | `contents: write` + `pull-requests: write` in the workflow |
| Shallow `fetch-depth` | changelog missing commits | `actions/checkout` needs `fetch-depth: 0` |
| Fork PR runs the release job | secrets not injected | the release job must trigger only on push to the base branch, not `pull_request` |
| NPM_TOKEN is a Publish token but 2FA enforced | publish fails | use an Automation token or a granular token that bypasses 2FA |
| First scoped package | publish fails 404 | publish manually once with `--access public` or set `publishConfig` |
| Duplicate release on job re-run | duplicate tag error | guard with `concurrency` and check the tag before publishing |

## Do / Don't

| Do | Don't |
|---|---|
| add a pr-check step enforcing the version label | let PRs merge without labels |
| use prerelease branches (`next`, `beta`) with `auto shipit` on that branch | ship prereleases directly from main |
| store tokens in repo secrets via `/follow-secret-manager` | hardcode `GH_TOKEN`/`NPM_TOKEN` in workflow files |
| review the generated CHANGELOG in the release PR | hand-edit the CHANGELOG after auto-generate (next round conflicts) |
| use `--dry-run`/`auto shipit --dry-run` before setup is complete | fire the first real release without testing |
| lock action versions and pin the workflow trigger | run the release job on multiple events at once |

## Performance And CI Notes

- The release job is light — no build matrix or heavy dependency caching needed; `bun install` suffices to run `auto shipit`
- Use `concurrency: release-${{ github.ref }}` to prevent double-releases on rapid successive pushes
- Separate the release workflow from the test workflow — release should trigger after CI passes (via `workflow_run` or branch protection), not race it
- `auto shipit` does bump+changelog+tag+release+publish in one command — to split the steps use `auto version`, `auto changelog`, `auto publish` instead
- The label check (`auto pr-check`) is fast and can run in the PR workflow without impacting CI time

## Config Guidance

A balanced example `.autorc`:

```json
{
  "baseBranch": "main",
  "author": "team-bot <bot@example.com>",
  "labels": [
    { "name": "major", "releaseType": "major" },
    { "name": "minor", "releaseType": "minor" },
    { "name": "patch", "releaseType": "patch" },
    { "name": "skip-release", "releaseType": "skip" },
    { "name": "internal", "releaseType": "none" }
  ],
  "plugins": ["released", "conventional-commits"]
}
```

- Use `auto info` to verify the config loads and tokens are ready
- Document the label taxonomy in `CONTRIBUTING.md` — contributors must know what each label does
- For canary releases from PRs: `auto canary` in the PR workflow (do not use the same NPM_TOKEN scope as production)
