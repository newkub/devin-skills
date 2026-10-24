# Findings — schema, migration, and data-integrity risks in the scope

Scope: [data layer/migration/app reviewed] · Source: [schema of record + migrations + real query]
Order: backup and rollback path first; `No.` is the first column

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[integrity risk the schema or a query proves]` | `[reversible migration or constraint fix]` | `[table/column/migration/query plan + path that reaches it + blast radius]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` |

## Fill Rules

- `Evidence`: the table, column, migration, or query plan and the path that reaches it — a column or constraint existing in only one of declared schema / generated migration / actual query is a finding
- `Severity`: from the matrix `Default severity` and its trigger; a constraint missing on a table nobody writes is downgraded with the reason
- `Owner skill`: the skill that runs the fix; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Dispatch through `/improve data`, `/improve database`, `/improve migration`, `/improve consistency`, `/improve retention`
- Never run a destructive migration without an explicit confirmation and a backup; migrations stay forward-only
- Apply confirmed set via `/deep-review <scope> then-fix`
