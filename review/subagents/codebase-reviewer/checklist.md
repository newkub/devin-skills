# review — Dispatcher Dimension Checklist

## 1. Intent Mapping

- [ ] user intent → correct primary review skill(s)
- [ ] secondary skills for cross-domain findings
- [ ] multi-context prompts → all relevant skills selected

## 2. Domain Coverage Map

- [ ] code quality → `/deep-review`, `/deep-review`
- [ ] structure → `/deep-review`, `/deep-review`, `/deep-review`
- [ ] surface → `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`
- [ ] safety → `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`
- [ ] ops → `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`
- [ ] docs/meta → `/deep-review`, `/deep-review`, `/deep-review`
- [ ] process → `/deep-review`, `/deep-review`, `/deep-review`, `/deep-review`, `/review-github-pr`, `/deep-review`, `/deep-review`
- [ ] persona → `/deep-review` via `/roleplay-by-all-stakeholder`
- [ ] devin repos → `/review-devin-global-harness`, `/update-devin-global-subagents`, `/deep-review`
- [ ] aggregate → `/deep-review`, `/deep-review-then-fix`

## 3. Execution Discipline

- [ ] independent skills → parallel via `/follow-parallel`
- [ ] dependency order respected (plan → implement)
- [ ] deep scans via `/deep-analyze`/`/deep-review` when needed

## 4. Aggregation

- [ ] findings dedup'd, prioritized, routed to `## Fix` owners
- [ ] report table with `No.` column first
