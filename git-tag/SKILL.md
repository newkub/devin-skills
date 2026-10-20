---
name: git-tag
description: Manage git tags — annotated release tags, semver, sync with manifest and remote
argument-hint: "[create|list|push|delete] [version]"
related:
  - deep-review-codebase
  - run-release
  - report
---

## Goal

Create and manage git tags per convention — annotated tags for releases, clear semver, synced with the manifest version and the remote

## Scope

- create annotated/lightweight tags, list, push, delete (local + remote)
- connects with `/deep-review-codebase` — the tag must match the `package.json`/manifest version
- does not cover the full release process → `/run-release` (this skill handles tags only)

## Execute

### 1. Verify Version Target

> Goal: the tagged version matches the real release

1. check the version in the manifest (`package.json`, `Cargo.toml`, `pyproject.toml`)
2. `git tag -l` + `git ls-remote --tags origin` — the tag is not a duplicate, no drift (`/deep-review-codebase`)
3. the tag must point at the actual release commit — usually the release's merge commit on main

### 2. Create Tag

> Goal: the tag has full information and follows convention

```bash
git tag -a v1.2.3 -m "Release v1.2.3"     # annotated — always choose this for releases
git tag v1.2.3                             # lightweight — temp/internal markers only
git tag -a v1.2.3 <sha> -m "..."           # tag an older commit
```

1. release tags always use annotated (`-a`) — includes tagger, date, message
2. the tag name matches the version: `v<semver>` per the project's convention (check `git tag -l` whether the `v` prefix is used)

### 3. Push And Sync

> Goal: the tag reaches the remote and is picked up by the CI release pipeline

1. `git push origin <tag>` — push only that tag, not all `--tags` (prevents leaking local tags)
2. check the CI/release workflow trigger if the project is tag-driven (GitHub release, publish)
3. report: tag, commit, version, remote status

### 4. Fix Mistakes

> Goal: a wrong tag is corrected safely

1. local only: `git tag -d <tag>` then recreate
2. already pushed: never move a tag silently — `git push origin :refs/tags/<tag>` to delete the remote one, recreate, push — notify the team because consumers may pin the tag

## Rules

- release tag = annotated always; lightweight only for temporary markers
- a pushed tag is immutable — moving it = a breaking change for consumers
- the tag name must match the manifest version — drift = a `/deep-review-codebase` finding
- do not push all `--tags` — push only the intended tag
- Use /deep-review-codebase if needed

## Expected Outcome

- the tag is created, matching the version and the released commit
- remote is synced, no tag drift
