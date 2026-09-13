# review — Dispatcher Dimension Checklist

## 1. Intent Mapping

- [ ] user intent → correct primary review skill(s)
- [ ] secondary skills for cross-domain findings
- [ ] multi-context prompts → all relevant skills selected

## 2. Domain Coverage Map

- [ ] code quality → `/review-quality`, `/review-writing`
- [ ] structure → `/review-architecture`, `/review-refactor`, `/review-workspace`
- [ ] surface → `/review-frontend`, `/review-cli`, `/deep-review`, `/review-api`, `/review-backend`
- [ ] safety → `/review-security`, `/review-auth`, `/review-compliance`, `/review-data-validation`
- [ ] ops → `/review-release`, `/review-delivery`, `/review-observability`, `/review-stability`, `/review-cost`
- [ ] docs/meta → `/review-docs`, `/review-writing`, `/review-rules`
- [ ] process → `/review-plan`, `/review-implement`, `/review-risk`, `/review-idea`, `/review-issue`, `/review-github-pr`, `/review-diff`, `/review-migration`, `/review-update`
- [ ] persona → `/review-by-stakeholder` via `/roleplay-stakeholder`
- [ ] devin repos → `/review-devin-global-skills`, `/review-devin-global-subagents`, `/review-dot-devin`
- [ ] aggregate → `/review-gaps`, `/deep-review-then-fix`

## 3. Execution Discipline

- [ ] independent skills → parallel via `/follow-parallel`
- [ ] dependency order respected (plan → implement)
- [ ] deep scans via `/deep-analyze`/`/deep-review` when needed

## 4. Aggregation

- [ ] findings dedup'd, prioritized, routed to `## Fix` owners
- [ ] report table with `No.` column first
