# Findings — API contract, webhook, and idempotency risks in the scope

Scope: [endpoint/service/SDK/spec reviewed] · Source: [published spec + handler + replayed response]
Order: active consumer break first; `No.` is the first column

| No. | Finding | Action | Evidence | Severity | Risk | Priority | Owner skill | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | `[contract break a consumer can actually hit]` | `[spec + handler + client change]` | `[endpoint + spec/handler file:line + replayed request/response]` | `[Critical/High/Medium/Low]` | `[rank]` | `[rank]` | `[skill that runs the fix]` | `[Open/Fixed/Accepted]` |

## Fill Rules

- `Evidence`: the endpoint, the spec or handler `file:line`, and the request/response that proves the mismatch — a field, status, or error shape existing in only one of the three is a finding
- `Severity`: from the matrix `Default severity` and its trigger; an internal-only endpoint is downgraded with the reason
- `Owner skill`: the skill that runs the fix; `Status`: `Open`/`Fixed`/`Accepted`

## Fix Route

- Dispatch through `/improve api`, `/improve events`, and `/improve auth`; update spec, handler, and client together
- A breaking change ships behind a new version or a documented deprecation window — never a silent shape change
- Apply confirmed set via `/deep-review <scope> then-fix`
