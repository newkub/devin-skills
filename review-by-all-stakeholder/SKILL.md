---
name: review-by-all-stakeholder
description: Review dispatcher — review a project from stakeholder/persona views defined in references/
argument-hint: "<category-or-role> [role]"
related:
  - deep-review
  - scan-codebase
  - review
  - ask-me
  - report-review
  - suggest-next-action
  - deep-thinking
  - deep-analyze
  - deep-validate
  - use-subagents
---

## Goal

Play the persona or stakeholder the user selects, read the role details from `references/<category>.md` (section `## <category>/<role>`), then review the project from that point of view.

## Scope

Use for any project that needs an outside perspective — covers 18 categories in `references/` (75 roles): product, engineering, quality, user, customer, research, marketing, growth, business, data, operations, finance, legal, content, creative, communication, management, technical — does not edit code directly.

If you need feedback from real stakeholders (not roleplay) → use `/deep-review` instead.

## Execute

Every run starts with the deep pre-pass — run `/deep-thinking` → `/deep-analyze` → `/deep-validate` before identifying/roleplaying any role (convention: `update-devin-global-skills` `## Conventions → Templates` row `review-*`).

### 1. Identify Role

> Goal: Know the persona to play

1. If a `<role-or-category>` argument is given → use that role/category
2. If not → show the Category Mapping table and use `/ask-me` to let the user choose
3. If the role is not in the table → notify the user and ask which closest role to use

### 2. Map To Category Reference

> Goal: Find the right `references/<category>.md` and role section

| No. | Category Reference | Roles (`## <category>/<role>`) |
|----:|--------------------|--------------------------------|
| 1 | `references/product.md` | product-manager, product-designer, business-analyst, product-analyst |
| 2 | `references/engineering.md` | software-architect, frontend-developer, backend-developer, fullstack-developer, database-engineer, devops-engineer |
| 3 | `references/quality.md` | qa-engineer, test-engineer, code-reviewer, debugger, security-engineer, performance-engineer |
| 4 | `references/user.md` | ux-researcher, user-researcher, user-advocate, accessibility-specialist |
| 5 | `references/customer.md` | customer-success, customer-support, customer-advocate, community-manager |
| 6 | `references/research.md` | researcher, market-researcher, competitive-analyst, trend-analyst |
| 7 | `references/marketing.md` | marketing-strategist, content-marketer, seo-specialist, brand-strategist, social-media-manager |
| 8 | `references/growth.md` | growth-strategist, conversion-optimizer, retention-specialist, experimentation-specialist |
| 9 | `references/business.md` | business-strategist, sales-specialist, partnership-manager, operations-manager |
| 10 | `references/data.md` | data-analyst, data-scientist, ml-engineer, ai-engineer |
| 11 | `references/operations.md` | process-analyst, automation-specialist, release-manager, compliance-specialist |
| 12 | `references/finance.md` | financial-analyst, pricing-analyst, cost-analyst, accountant |
| 13 | `references/legal.md` | legal-advisor, privacy-specialist, compliance-advisor, risk-analyst |
| 14 | `references/content.md` | copywriter, editor, content-strategist, technical-writer |
| 15 | `references/creative.md` | visual-designer, brand-designer, creative-director |
| 16 | `references/communication.md` | communications-strategist, presenter, public-relations |
| 17 | `references/management.md` | project-manager, engineering-manager, technical-lead, scrum-master |
| 18 | `references/technical.md` | researcher, code-optimizer, refactoring-specialist, documentation-writer |

1. Use the Category Mapping table above — each category maps to `references/<category>.md`; role details are in the `## <category>/<role>` section inside that file
2. For roles in the security/compliance domain → hand off to `/deep-review` instead
3. If a role falls under multiple categories → have the user confirm
4. Open `references/<category>.md` → read the role table at the top + the `## <category>/<role>` section of the chosen role

### 3. Roleplay And Collect

> Goal: Review through the role's lens from the reference details

1. Run `/scan-codebase` first to gather context
2. Play the role per the persona details (Goal/Scope/Execute/focus areas in the section)
3. Collect findings, severity, and recommendations
4. Score: Critical 0, High 25, Medium 50, Low 75, Info 100 → weighted average; grade A ≥90, B ≥80, C ≥70, D ≥60, F <60

### 4. Report

> Goal: Summarize the result from the persona's point of view

1. Run `/report-review` with findings and recommendations (chat table, no files)
2. Highlight the top 3-5 most important issues
3. Run `/suggest-next-action`

## Rules

- Do not edit code during a roleplay review
- Every finding must have evidence from code or config
- If the role is unclear → ask first
- Hand off to one role at a time — no mixed perspectives; for multiple viewpoints, run one role at a time or use `/deep-review`
- Use `/use-subagents` if needed — review independent areas through different roles in parallel, one subagent per role
- Do not deploy or run anything for real

## Expected Outcome

- A findings report from the chosen persona's point of view, with one score and grade
- Top issues with recommendations
- A clear severity report
- Next actions via `/suggest-next-action`
