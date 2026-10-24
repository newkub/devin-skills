# Repo Health Scorecard

Scope: `[repo-or-all]` · Weights: Hygiene 20% Deps 20% CI 20% Activity 15% Security 15% Clean 10% · Date: `[...]`

| No. | Repo | Hygiene | Deps | CI | Activity | Security | Clean | Grade |
|---|---|---|---|---|---|---|---|---|
| `1` | `[...]` | `✅` | `⚠️` | `ℹ️` | `✅` | `❌` | `✅` | `B` |

## Fill Rules

- `No.` runs 1..N; sort rows by grade (worst first) so attention-needed repos lead.
- Each dimension cell carries a status symbol plus its 0-100 score: `✅ pass`, `⚠️ warning`, `❌ fail`, `ℹ️ n/a`.
- A signal that is absent (e.g. no CI configured) is `ℹ️ n/a`, never scored `0`.
- `Grade` is A-F from the weighted overall; same rubric and weights for every repo so rows compare.
- Every cell must trace to a real collected signal, not a guess.
- Below the table give per-repo top issues dragging the score down, then the quick-win / archive-or-revive recommendations.
