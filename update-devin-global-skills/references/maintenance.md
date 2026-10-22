# Maintenance

> Read-only audits and living-document sync. Cited as `update-devin-global-skills` `## Conventions → Skill Usage Audit` / `→ Living Documents` — keep the section names stable.

## Skill Usage Audit

Audit dead/dying skills (argument `usage`/`skill-usage` — read-only): parse `related:` from every `SKILL.md` → count inbound + `/review-devin-global-harness`; classify Orphaned (0 inbound + not referenced in `AGENTS.md`/`global_rules.md`), Leaf (0 inbound but an entry-point — not dead), Hub, Self-referencing; flag overly broad/duplicate ones; report via `/report` with columns No./Skill/Inbound/Tier/Recommendation (`keep`/`integrate`/`merge`/`delete`) — "0 references ≠ worthless"; deletion must go through `/delete` + `/update-references`

## Living Documents

Documents storing data (not workflows) — sync immediately when what they reference changes:

| Document | Path | Sync When |
|----------|------|-----------|
| CLI inventory | `check-my-global-cli/references/global-cli-commands.md` | tool newly installed / list older than 30 days |
| Tool map | `check-my-global-cli/references/tool-map.md` | skill/tool added/removed/merged |
| Tech catalog | `../follow-my-techstack/references/techstack-catalog.md` | new dep chosen / lib EOL / major release |
| Skills index | `skills/AGENTS.md` | skill added/removed/merged/renamed |
| Subagent registry | `use-subagents/SKILL.md` | profile added/removed in any skill's `SKILL.md ## Subagents` |
| `related:` frontmatter | every `SKILL.md` | a referenced skill merged/renamed/deleted |

Triggers: `mise use -g`/`scoop install` → 1+2; create skill → 2,4,6; delete/merge → 2,4,5,6; rename → 4,6 + every referencing file; new dep → 3. Verify: `rg "<old-name>" skills/` — only intentional mentions remain (e.g. "merged from …")
