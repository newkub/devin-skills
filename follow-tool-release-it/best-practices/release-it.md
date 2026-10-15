# release-it — Best Practices

Automated releases — version bump, changelog, tag, publish in one command

## Recommended Patterns

- `.release-it.json` at the root — `git` (tag/commit), `npm` (publish), `github` (release notes), `hooks` sections
- Conventional commits + `@release-it/conventional-changelog` — auto changelog from commit history
- Consistent `git.tagName`/`git.commitMessage` templates — `v${version}` convention
- Always `--dry-run` before real runs — check the version bump + files that will change
- Hooks: `before:bump` (tests), `after:release` (post-release tasks) — fail fast before tagging

## Common Pitfalls

- release-it runs from a clean working tree — dirty tree = abort; commit everything first
- npm publish needs auth — `npm whoami` first; CI uses the `NPM_TOKEN` env
- `--ci` mode in pipelines (no prompts); interactive locally
- Changelog quality = commit quality — garbage in commits = garbage in changelog; squash merge discipline
- Major bumps: explicit `release-it major` — don't let auto-increment decide breaking releases

## CI / Automation

- Workflow: version → changelog → commit → tag → GitHub release → npm publish — atomic sequence
- Pair with `/follow-tool-changesets` in monorepos — release-it suits a single package more
- `github.release: true` + generated `releaseNotes` — attach artifacts via hooks if wanted

## Do / Don't

| Do | Don't |
|----|-------|
| `--dry-run` before every release | Blind releases |
| Conventional commits → auto changelog | Hand-editing CHANGELOG then generating over it |
| Clean tree + tests pass before bump | Releasing from a dirty state |
| `--ci` non-interactive in pipelines | Prompts in automation |
