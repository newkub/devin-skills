# GitHub Projects (gh project) — Best Practices

CLI-driven project management — scripted + interactive discipline

## Recommended Patterns

- Every `gh project` command is scriptable — combine `list`, `view`, `item-list`, `field-list` to discover IDs before mutating
- Field/item IDs are not names — resolve `field-list`/`item-list` → IDs, then `item-edit`; IDs are per-project
- JSON output (`--format json`) + `jq` for pipelines — table output for reading only
- Automations: use Projects' built-in workflows (auto-add, status transitions) before scripted solutions
- `gh project item-add` links issues/PRs into the project — bulk add via a loop + repo list

## Common Pitfalls

- Projects v2 (graphQL-backed) ≠ classic projects — `gh project` = v2 only; classic needs `gh api`
- Permissions: project visibility follows the org — the token must have the `project` scope; fine-grained PATs must be granted explicitly
- `item-edit` requires all of `--project-id`, `--id` (item id), `--field-id` — never guess; fetch the lists first
- Single-select/status fields = option IDs, not label text — resolve via `field-list` output

## Scripting Tips

- Idempotent scripts: check the item doesn't already exist before `item-add` — repeated adds create duplicates
- Rate limits: insert sleep between calls in bulk ops
- Export: `gh project item-list --format json` > snapshot as an audit trail

## Do / Don't

| Do | Don't |
|----|-------|
| resolve IDs via list commands | hardcode field/item IDs |
| `--format json` + jq in scripts | parse table output |
| built-in automations first | scripted status sync for everything |
| verify token scopes first | debug permission errors afterwards |
