# review-by-stakeholder — Full Dimension Checklist

## 1. Persona Selection

- [ ] persona/sub-role mapped correctly from argument
- [ ] lens-specific questions used per persona table
- [ ] multi-persona runs use select-stakeholders + run-stakeholder-reviews

## 2. Evidence Quality

- [ ] findings backed by code/config/docs/screenshots
- [ ] context noted: route, viewport, role, environment
- [ ] no speculation — verified per finding

## 3. Coverage Per Family

- [ ] Engineering: architecture, debt, onboarding, ops, docs
- [ ] Product: value, priority, funnel, positioning, economics
- [ ] Data: quality, tracking, pipelines, dashboards
- [ ] Design: consistency, interaction, research gaps
- [ ] QA: edge cases, boundaries, regression risk
- [ ] User: journey friction, onboarding, churn, support gaps
- [ ] Stakeholder (real): feedback recorded with decision+role+date

## 4. Feedback Process (real stakeholder)

- [ ] specific questions + options, not open-ended only
- [ ] decisions recorded: accept/reject/defer/needs-design
- [ ] conflicts escalated via `/ask-me`

## 5. Prioritization And Routing

- [ ] impact/effort ordering, acceptance criteria
- [ ] findings routed to correct `## Fix` domain skill

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
