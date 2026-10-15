# template-starter (degit) — Best Practices

Scaffold projects from template repos with degit — clean copies without git history

## Recommended Patterns

- `degit <user>/<repo>[/<subdir>] <target>` — copies files without `.git`; the subdir syntax is for monorepo templates
- `#branch`/`#tag` suffix pins the template version — default main = a moving target; pin for reproducible scaffolds
- `--force` only when overwriting is intended — degit refuses non-empty dirs by default (good)
- Post-scaffold checklist: rename the package, install deps, replace README/LICENSE, init git fresh
- Your own template repos: keep minimal + documented placeholders — the scaffold comes out ready to use

## Common Pitfalls

- degit does not resolve git submodules — templates with submodules need a manual init
- Placeholder tokens in templates (project name, author) — script the rename or sed after scaffolding
- Cache: degit caches GitHub tarballs — for a stale template use `--force` or clear the cache
- Private repos: degit supports them via auth (`--mode git` fallback) — the https download path needs public repos
- Never scaffold on an existing project root — always a new target dir, merge manually if needed

## Workflow

1. Pick the template (official/community/mine) + pin a tag
2. `degit user/repo target`
3. `cd target` → install → rename placeholders → `git init` → first commit
4. Verify dev/build/test pass before writing real code

## Do / Don't

| Do | Don't |
|----|-------|
| pin the template `#tag` | scaffold from a moving main |
| always a new target dir | degit into an existing project |
| rename placeholders immediately | commit template branding |
| verify the scaffold runs first | assume the template works |
