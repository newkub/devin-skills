# TanStack CLI — Best Practices

Project scaffolding — templates, add-ons, catalog introspection, post-scaffold verification

## Recommended Patterns

- Read `create --list-add-ons` and `--addon-details <id>` from the installed CLI before choosing anything
- Pass explicit `--framework`, `--package-manager`, `--deployment`, and `--add-ons` so the command is reproducible
- Use `--json` when a script or agent consumes the output; use human output for the final review
- Use `add` for an existing project and `create` only for a new target directory
- Prefer `--blank` or `--router-only` when the spec is small; add capabilities later with `add`
- Fill every key in `.env.example` that the chosen add-ons read before the first run
- Run `pin-versions` after generation to drop `^` from TanStack packages and add missing peers
- Commit the untouched scaffold as the green baseline, then customize
- Keep `.cta.json` committed and accurate — add-on and template authoring read it
- Read docs with `doc`/`search-docs` instead of trusting a blog post for a current API

## Common Pitfalls

- Running `create` over a non-empty project — use `add` or `--force` deliberately
- Passing `--add-ons`, `--deployment`, or `--template` together with `--router-only`, which disables them
- Hardcoding add-on IDs in a script; they change between releases
- Assuming `--tailwind`/`--no-tailwind` still shape standard projects — they are deprecated compatibility flags
- Accepting two add-ons that provide the same concern (two auth or two styling setups)
- Using `add --forced` before understanding the reported conflict
- Debugging app code for a failure that is actually a missing env key
- Treating the generated project as final architecture instead of a starting point

## Perf Notes

- Pick only the add-ons in use — unused ones add dependencies, config, and bundle weight
- Prefer `--blank` for services and small apps; the starter UI is dead code you must delete
- Check the generated bundler/dev-server config before layering more plugins on it
- Use `--no-install` in CI when the install is a separate cached step

## Do / Don't

| Do | Don't |
|----|-------|
| inspect the catalog first | assume add-on IDs from an old guide |
| explicit flags + `-y` | rely on remembered prompt answers |
| `add` on an existing project | re-run `create` over it |
| `--blank` for a small service | ship starter UI you will delete |
| fill env keys before first run | debug code for a missing key |
| commit the untouched scaffold | hand-edit before the first commit |
