# ai

Row bundle for the `ai` review dimension — the matrix rows below are the contract; this file never re-decides eligibility.

| Matrix row | Tier | Evidence | CLI domain | Fix owner |
|---|---|---|---|---|
| `llm-security` | `artifact-match` | `capture` | `security` | `/improve ai` |
| `llm-cost-latency` | `artifact-match` | `capture` | `—` | `/optimize llm` |
| `agent-memory-integrity` | `artifact-match` | `capture` | `security` | `/improve ai` |
| `llm-eval` | `on-demand` | `capture` | `—` | `/improve ai` |
| `rag-retrieval-quality` | `artifact-match` | `capture` | `—` | `/improve ai` |

## Run

- `/deep-review <scope> llm-security, llm-cost-latency, agent-memory-integrity, llm-eval, rag-retrieval-quality` — adds the `always` tier and runs the full pipeline; this file only selects the rows
- eligibility: `Applies to`, `Default severity`, and `N/A condition` live in `../dimension-matrix.md`; the proof statement is the same-named row in `../dimension-checks.md`
- `llm-eval` is `on-demand` — run it only when the user asks for an eval pass
- evidence: every row takes the `capture` route — run `promptfoo`, `garak`, the provider usage CLI, and `ragas` first, then pass that output in as the slice
- boundaries: multi-dimension → `/deep-review`; provably wrong behavior → `/review-issues`; promised-but-absent → `/review-gaps`
- fix: `/improve ai` for the security, memory, eval, and retrieval rows; `/optimize llm` for `llm-cost-latency` — applied only through `/deep-review <scope> then-fix` after confirmation
