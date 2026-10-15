# Node Modules Inspector — Best Practices

Interactive node_modules analysis — dep tree, sizes, and health audit

## Recommended Patterns

- `npx node-modules-inspector` (or a devDep) — launches the interactive UI; use for periodic dep audits
- Analyze: install size, duplicate versions, dependency depth, outdated packages, licenses
- Tackle duplicate packages first — several versions of one dep = bundle bloat + potential bugs
- Compare the lockfile vs node_modules — drift indicates a dirty install
- Use as input to `/run-bench-deps` and dep cleanup workflows

## Common Pitfalls

- node_modules size ≠ bundle size — devDeps inflate node_modules; distinguish when interpreting
- The biggest transitive deps usually come from one parent — trace up to the parent before blaming
- Some duplicates are unavoidable (peer range conflicts) — fix via resolutions/overrides only when necessary
- pnpm/bun layouts differ from npm — the inspector reads the real structure; symlink stores can make sizes look off
- Don't audit just once — deps creep over time; check periodically during upgrade reviews

## Action Items

- Dedupe: `bun install`/lockfile regen, or overrides for version unification
- Replace heavy deps: the inspector points out the biggest → find alternatives (`/alternative`)
- Remove unused: combine with `/follow-tool-knip` — the inspector sees what's installed, knip sees what's used

## Do / Don't

| Do | Don't |
|----|-------|
| Periodic dep audits | Install-and-forget |
| Trace the parent of heavy transitive deps | Blame leaf packages |
| Dedupe versions when feasible | Force overrides for every conflict |
| Cross-check with knip unused | Delete by size alone |
