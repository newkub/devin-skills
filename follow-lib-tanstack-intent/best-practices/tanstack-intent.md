# TanStack Intent — Best Practices

Shipping agent skills inside an npm package — layout, publish, discovery

## Recommended Patterns

- Ship one small skill per capability the package owns, each with valid frontmatter and a scenario-focused body
- Keep the skills directory inside the package root and list it in `files` so it lands in the tarball
- Version skill content with the package: when an API changes, update the skill in the same release
- Verify with `npm pack --dry-run` that the skills directory is present before publishing
- Install the packed tarball into a throwaway project and confirm intent tooling discovers the skill
- Write examples against the released API only — no unreleased flags or internal notes
- Link each skill to the package's docs URL so consumers can reach the canonical reference

## Common Pitfalls

- `files` omits the skills directory, so the published package has no skills at all
- Skill text describes an older API and misleads consumers on the new major
- One oversized skill mixing install, API, migration and troubleshooting is hard to route
- Missing or invalid frontmatter makes the skill undiscoverable
- Publishing internal roadmap or credentials inside skill files
- Assuming app projects need this tooling — it is for package authors

## Perf Notes

- Small skills load faster into an agent context; split by task rather than by API surface
- Reference the docs instead of duplicating large tables that go stale
- Keep examples minimal so the skill stays cheap to read

## Do / Don't

| Do | Don't |
|----|-------|
| one skill per capability | one giant catch-all skill |
| `files` includes the skills dir | rely on npm defaults |
| update skills with the API change | ship stale examples |
| verify by packing and installing | assume discovery works |
| docs URL for depth | duplicate the full manual |
