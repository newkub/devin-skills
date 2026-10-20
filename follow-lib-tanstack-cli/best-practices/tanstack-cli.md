# TanStack CLI — Best Practices

Project scaffolding — templates, add-ons, post-scaffold verification

## Recommended Patterns

- Scaffold into an empty directory and confirm the target path before running
- Choose add-ons deliberately: they wire config, env keys and providers that are tedious to remove later
- Confirm the current add-on names and flags with the CLI `--help` before scripting it
- Run the package manager install step, then commit the untouched scaffold as a baseline so later customizations show a readable diff
- Fill the env keys each add-on expects; the app usually fails on the first request otherwise
- Immediately verify with a typecheck, a dev-server boot and a smoke test of the first route
- After scaffolding, keep customizing through the per-library `setup-*` workflows rather than the generator

## Common Pitfalls

- Running the generator in a non-empty directory overwrites or mixes files
- Hardcoding add-on names in scripts breaks when the CLI renames or adds options
- Skipping env setup produces runtime errors that look like code bugs
- Assuming the scaffold pins the newest patch of every dependency
- Adding an add-on that duplicates something already chosen (two auth or two CSS setups)
- Treating the generated project as final architecture instead of a starting point

## Perf Notes

- Pick only the add-ons in use — unused ones ship config, dependencies and bundle weight
- Prefer the lighter template when the feature list is small; adding later is cheaper than deleting
- Check the generated bundler/dev-server config before layering more plugins on it

## Do / Don't

| Do | Don't |
|----|-------|
| scaffold into an empty dir | run over an existing project |
| confirm flags via `--help` | assume add-on names from an old blog post |
| commit the baseline scaffold | hand-edit before the first commit |
| set env keys before first run | debug app code for a missing key |
| verify typecheck + dev + first route | declare done after generation |
