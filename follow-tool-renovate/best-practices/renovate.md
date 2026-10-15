# Renovate — Best Practices

Automated dependency updates — config precision and noise control

## Recommended Patterns

- `renovate.json` (or `.github/renovate.json`) — extend the `config:recommended` base, then override selectively
- Group with `packageRules`: group minor+patch of one ecosystem (react*, types/*) — cuts PR spam
- `automerge` only for low-risk: patch/minor devDeps with required tests passing — no automerge for major/peer-sensitive
- Restrict `schedule` by time (`before 5am`, weekends) — so PRs don't scatter all day
- `dependencyDashboard` issue — visibility of pending updates + manual triggers

## Common Pitfalls

- Default config = PR flood — no grouping/schedule = the team starts ignoring renovate PRs (worse than none)
- Automerge needs strong CI — blind merging requires real test coverage
- Lockfile-only updates (`lockFileMaintenance`) — enable weekly to dedupe transitive deps
- Peer dep conflicts: renovate bumps one at a time — grouped ecosystem updates (react+types+plugins) prevent broken intermediate states
- Major updates need reviewing migration guides — the renovate PR body links changelogs, but the agent must check breaking changes

## Workflow

- Triage weekly: dashboard → merge safe batches → investigate majors → close wontfix
- Security: `vulnerabilityAlerts` + `osvVulnerabilityAlerts` — security PRs get a separate automerge policy
- Pin digests: `pinDigests` for Docker/GitHub Actions — supply-chain hardening

## Do / Don't

| Do | Don't |
|----|-------|
| packageRules grouping per ecosystem | Per-package PR floods |
| automerge patch/devDeps only | Automerging majors |
| Schedule + dashboard | Always-on noise |
| pinDigests for actions/docker | Unpinned floating refs |
