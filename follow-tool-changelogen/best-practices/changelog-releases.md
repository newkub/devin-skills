# Changelogen Best Practices

Guidelines for using changelogen to generate changelogs + version bumps from conventional commits in a reproducible, safe way

## Recommended Patterns

### Commit Convention Discipline

- A good changelog only happens when commits are conventional — enforce with a PR title check (GitHub Action) or `commitlint` + hooks before relying on changelogen
- Squash merge strategy + conventional PR titles give the cleanest changelog — legacy-style merge commits add noise (wip, fix typo)
- Use scopes consistently (`feat(api):`, `fix(ui):`) — `scopeMap` in the config maps them into readable sections
- Breaking changes must carry `!` or a `BREAKING CHANGE:` footer — if missed, the bump becomes a wrong-semver minor

### Preview Before Release

- Always run `bunx changelogen` (no flags) first to preview the output without touching version/tag
- Use `--bump` when you only need the version number (e.g. to check the bump matches the commits)
- Use `--release` when ready to do everything (bump + changelog + commit + tag + GitHub release) and add `--clean` to require a clean working tree
- In CI, keep the release job separate from build/test — release should run only after quality gates pass

### Monorepo Approach

- changelogen works per single repo — for multi-package versioning run `--dir <pkg>` per package, or switch to changesets when packages are coupled
- Use `scopeMap` to group commits in one shared changelog instead of splitting one changelog per package — suits monorepos that release together

### GitHub Release Sync

- Set `GITHUB_TOKEN`/`GH_TOKEN`/`CHANGELOGEN_TOKENS_GITHUB` in env — without a token you only get a generated link to click manually
- Use `changelogen gh release` to sync release notes from `CHANGELOG.md` to GitHub releases without bumping again — useful after editing the changelog when you want to update an existing release
- `--publish` continues the release into an npm publish — auth via `.npmrc` or `NPM_TOKEN`, separate from the GitHub token

## Common Pitfalls

| Pitfall | Symptom | Avoidance |
|---|---|---|
| Merge commits not conventional | empty changelog or wrong bump | enforce PR title + squash merge |
| Editing `CHANGELOG.md` by hand between releases | next section overwritten/duplicated | edit via `templates`/config, or fix after generate and commit immediately |
| Running `--release` on a dirty tree | commit mixes in unrelated files | use `--clean` to require a clean state |
| Tag format inconsistent with old releases | changelog links/compare broken | keep `templates.tagBody`/`tagMessage` consistent |
| Wrong repo detection | GitHub compare links broken | set `repo` explicitly in config when `package.json` has no `repository` field |
| Releasing from local with a personal token | release author is a person + broad scope | run in CI with a bot token |
| Canary suffix mixed with stable | consumers pull a prerelease unintentionally | use `--canary` only for the prerelease channel + a separate dist-tag |

## Do / Don't

| Do | Don't |
|---|---|
| preview with `changelogen` before `--release` | fire `--release` on the first try without previewing |
| squash merge + conventional titles | rely on raw commit history from merge commits |
| `--clean` in the release script | let release run on a dirty tree |
| set `repo` explicitly when auto-detect fails | assume detection is always right (forks/mirrors break) |
| keep the generated changelog append-only | rewrite changelog history backwards |
| add `--no-github` runs for non-GitHub repos | let the release fail because the repo cannot be found |

## Performance And CI Notes

- `changelogen` parses the whole git log — fetch must include full history: `actions/checkout` needs `fetch-depth: 0`, otherwise the changelog is incomplete
- The release job should have a `concurrency` guard — a double push to main must not create 2 competing releases
- Run release only when there are new commits since the latest tag — changelogen handles this itself, but skipping the job is faster when checking `git log` first
- `--canary` creates a prerelease without committing the full changelog — use it for PR preview packages
- Changelog generation is fast (< seconds for hundreds of commits) — the release job bottleneck is build/test/publish, not changelogen

## Config Guidance

A balanced `changelog.config.ts`:

```ts
import { defineConfig } from 'changelogen'

export default defineConfig({
  types: {
    feat: { title: 'Features', semver: 'minor' },
    fix: { title: 'Bug Fixes', semver: 'patch' },
    perf: { title: 'Performance', semver: 'patch' },
    refactor: { title: 'Refactors' },
    docs: { title: 'Documentation' },
    chore: { title: 'Chores' }
  },
  scopeMap: {
    api: 'API',
    ui: 'UI'
  },
  excludeAuthors: ['bot-name']
})
```

- Set `excludeAuthors` for bot commits (renovate, dependabot) to keep the changelog tidy
- Match `templates.commitMessage`/`tagMessage` to the repo convention (e.g. `chore(release): v{newVersion}`)
- Use a custom `output` path when the changelog lives outside the root — the default `CHANGELOG.md` covers almost every case
- Document the release checklist: preview → `--clean` release → verify tag + GitHub release → publish
