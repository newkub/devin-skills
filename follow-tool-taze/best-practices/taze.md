# Taze — Best Practices

Dependency updater CLI — interactive + CI modes for version bumps

## Recommended Patterns

- `taze` interactive — grouped view (major/minor/patch), pick the bump per dep
- `taze -w` writes into package.json — review the diff before committing; a bare `taze` = dry run
- `taze major` only when upgrading majors is intended — the default respects semver ranges
- Monorepo: `-r` recurses every workspace — consistent bumps across packages
- `taze --include locked` or filters per dep patterns — scope updates, e.g. types-only

## Common Pitfalls

- After bumping you must install + test — a version change ≠ installed deps; always `bun install` + `run-check`
- Lockfile sync: a package.json bump must regen the lockfile — commit both
- Peer dep warnings after a bump — majors with peer conflicts = upgrade the whole cluster's chain
- New versions younger than 7 days = supply-chain risk — check publish dates, prefer stable
- Beta/alpha tags: taze may offer prereleases — verify the tag before accepting

## Workflow

- Periodic: `taze` → review grouped list → bump safe set → install → typecheck+test → commit
- Pair with `/run-bench-deps` — the bench report flags outdated deps, taze executes the bump
- Renovate in CI with taze locally = complementary — don't run both in conflict

## Do / Don't

| Do | Don't |
|----|-------|
| dry-run and review before `-w` | blind `taze major -w` |
| bump → install → test → commit | bump and forget the lockfile |
| grouped minor/patch first | major bumps at once |
| check publish dates | accept day-old versions |
