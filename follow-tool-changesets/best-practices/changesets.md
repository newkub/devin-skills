# Changesets — Best Practices

Versioning + changelog automation for monorepos

## Recommended Patterns

- One changeset file per behavior-changing PR — `bunx changeset` (or `pnpm changeset`) creates `.changeset/*.md`; enforce in CI with changeset-bot/a status check
- Pick the bump by real semver: `patch` = fixes/internal, `minor` = backward-compatible features, `major` = breaking — never bump major "just in case"
- `changesets/action` in CI — it auto-creates the "Version Packages" PR; merging it publishes + tags
- Use `linked`/`fixed` packages in the config for packages that must always bump together
- Changelog: the changeset's commit summary is user-facing — write it from the consumer's perspective, not the implementer's

## Common Pitfalls

- Forgetting a changeset = no version bump = silently broken release — enforce in CI or the PR template
- Private packages: `"private": true` must also be ignored in the config (`ignore` list) — otherwise changesets tries to publish them
- Snapshot releases (`--snapshot`) are for pre-release testing — never merge snapshot versions into main
- Fixed vs linked: `fixed` bumps every member together even when unchanged; `linked` only when one of them bumps — choose per release cadence
- The version PR must be merged quickly — a stale version PR with new changesets landing behind it = conflicts

## Workflow Tips

- `changeset status` checks for pending changesets — use it in CI or as a pre-release check
- `changeset publish` = publish + git tags — don't hand-tag on top of it
- Pre-release mode (`changeset pre enter beta`) for beta/alpha channels — exit with `pre exit` before going stable

## Do / Don't

| Do | Don't |
|----|-------|
| one changeset per user-facing change | batch changesets right before release |
| semver by real impact | bump by default "just in case"/minor |
| `linked`/`fixed` by real coupling | auto-link every package |
| ignore private packages | publish internal apps |
