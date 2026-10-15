# Semantic Release Best Practices

## Recommended Patterns

- Enforce conventional commits from the start — use commitlint + git hooks (`/follow-tool-hk` or husky) to reject badly formatted commits
- Use squash merge into the release branch — the PR title becomes one conventional commit, keeping history clean and version bumps predictable
- Set `version` in `package.json` to a placeholder such as `0.0.0-development` — semantic-release always derives the version from commits, never reads this value
- Order the plugins: `@semantic-release/commit-analyzer` → `release-notes-generator` → `changelog` → `npm` → `git` → `github` — wrong order = the changelog is committed before it is generated
- Define `branches` clearly: `main` for stable, `{ name: 'beta', prerelease: true }` for a prerelease channel
- Use a `tagFormat` consistent with monorepo/tag conventions, e.g. `v${version}` or `pkg-name@${version}`
- Run `semantic-release --dry-run` on the PR or locally before merge — see the resulting version and release notes in advance

## Common Pitfalls

- A non-conventional commit slips into main — the release doesn't trigger or bumps the wrong level
- Squash merge drops the `BREAKING CHANGE:` footer — the major bump is lost; check the commit message at merge time
- Forgetting the `@semantic-release/git` plugin — `CHANGELOG.md` is generated but never committed back to the repo
- Running `semantic-release` directly from local — it publishes for real without CI checks; use `--dry-run` only
- Releasing from multiple branches without setting `branches` — tags/publishes collide
- The default `GITHUB_TOKEN` lacks `contents: write` — pushing the tag/release fails
- npm publish with an expired classic token — migrate to OIDC trusted publishing

## Do / Don't

| Do | Don't |
|----|-------|
| Release in CI only, after tests pass | Run publish from a local machine |
| Use OIDC trusted publishing for npm | Keep a long-lived `NPM_TOKEN` in secrets if avoidable |
| Dry-run before every real release when the config changes | Assume the version output without checking |
| Set a clear `branches` allowlist | Leave default branches in a repo with many long-lived branches |
| Squash merge with a conventional title | Merge a commit mixing several types without review |

## Config Guidance

- Use a separate `.releaserc`/`release.config.cjs` file — easier to diff/review than the `release` field in `package.json`
- `changelog` plugin: set `changelogFile: 'CHANGELOG.md'` and add it to the `assets` of the `git` plugin
- `npm` plugin: set `npmPublish: false` if the package is private and only needs a GitHub release
- Prerelease workflow: `fix` → `main` (patch/minor); big `feat` → merge through the `beta` branch first to test `beta.x` versions
- Commit analyzer defaults: `feat` = minor, `fix` = patch, `BREAKING CHANGE` = major, others don't bump — adjust `releaseRules` if you want `perf`/`refactor` bumps too

## Performance & CI

- The release job should run after test/lint/build jobs pass — use a `needs:` chain in GitHub Actions
- Minimum permissions: `contents: write` (tags/releases), `id-token: write` (OIDC), `pull-requests: write` (comments)
- A dry-run on the PR catches config mistakes before merge — add a separate job without publish credentials
- The release job should be idempotent — if it fails midway, re-running must not publish twice (semantic-release already checks tags/the npm registry, but verify for sure)
- Never put the release in the same workflow as PR checks — use a separate workflow triggered only on push to release branches
