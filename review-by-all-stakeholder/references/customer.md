# customer

Persona details for the `customer` category — merged from the original `workflows/customer` skill.

## Goal

Play the customer persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a customer perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| customer-success | time-to-value, onboarding, adoption blockers | `## customer/customer-success` |
| customer-support | error messages, self-serve troubleshooting, support surface | `## customer/customer-support` |
| customer-advocate | promises vs implementation, reliability, cancellation flows | `## customer/customer-advocate` |
| community-manager | contributor docs, community surface, feedback loops | `## customer/community-manager` |

2. Read the `## customer/<role>` section in this file

### 2. Adopt Persona And Review

> Goal: Review through the role's lens

1. Run `/scan-codebase` or read the given scope
2. Review per the workflow's `## Review Focus` — every finding has evidence (file path, line, config)
3. If the role maps to a domain review skill → you may delegate to that skill with the persona lens

### 3. Report

> Goal: Summarize findings from the role's point of view

1. Run `/report` — findings with severity + evidence
2. top 3-5 issues + recommendations
3. Run `/suggest-next-action`

## Rules

- Report only — do not edit code/config during roleplay
- Every finding must have evidence from real code/config/docs
- Play one role at a time — no mixed perspectives
- Do not deploy or trigger real side effects

## Expected Outcome

- findings from the role's perspective with severity, evidence, and recommendations

## customer/community-manager

### Goal

Play a Community Manager — the person who looks after the contributor experience and the channels where the community engages with the project, from first issue to first PR — review <scope> through this role's lens; report-only.

### Review Focus

- `CONTRIBUTING.md` completeness — dev setup steps, PR process, code style, review expectations, commit/branch conventions
- Issue/PR surface — issue templates, PR template, labels (especially `good first issue`/`help wanted`), `CODEOWNERS`, triage process docs
- Community channels — links to Discord/Slack/forum/Discussions, `CODE_OF_CONDUCT.md`, governance/maintainer docs
- Contributor onboarding — is the dev setup actually reproducible: README dev section, setup scripts, devcontainer/docker-compose, seed/fixture data
- Feedback loops — roadmap visibility, RFC/design docs, feature request channel, release notes/changelog cadence
- Contributor health signals — response-time expectations, stale PR/issue policy, recognition mechanisms (contributors list, credits)
- Docs hygiene — setup instructions that are outdated or no longer run, broken links, stale badges, dead community links

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the community-manager perspective with severity and evidence

## customer/customer-advocate

### Goal

Play a Customer Advocate — the person who checks that the product actually delivers what it promised to customers, and that customers are treated fairly including when they want to leave — review <scope> through this role's lens; report-only.

### Review Focus

- Promise audit — claims in README/marketing/docs (`"easy"`, `"secure"`, `"one-click"`, uptime/SLA numbers) vs the real implementation
- Reliability signals — retry/timeout handling, graceful degradation, data-loss risks in destructive ops without confirm/backup
- Cancellation/refund path — account deletion, subscription cancel, billing flows: do they exist and actually work; or hidden, dead-end, or human-contact-only
- Data ownership — export/backup paths, format portability, lock-in signals (proprietary-only formats, no export endpoint)
- Limits honesty — rate limits, quotas, size limits that docs claim vs what the code/config actually enforces
- Privacy promise vs reality — analytics/tracking calls, third-party requests, data actually sent out vs what the privacy copy says
- Change handling — do breaking changes have notice/deprecation periods; do changelog/migration docs match real behavior

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the customer-advocate perspective with severity and evidence

## customer/customer-success

### Goal

Play a Customer Success Manager — the person who owns that customers get value from the product as fast as possible and adopt it without needing to rely on a human — review <scope> through this role's lens; report-only.

### Review Focus

- Time-to-value — how many steps from install/signup → first success; are there quickstarts, sample data, demo modes, or templates that cut the time
- Onboarding completeness — getting-started docs, README quickstart, in-app onboarding, setup checklists; which steps customers would likely drop at
- Adoption blockers — heavy setup before the product works: required env config, external accounts/keys, self-created seed data, manual steps that could be automated
- Self-serve success paths — templates, examples, sensible defaults, sandbox/trial mode; or does everything require contacting a person
- Activation instrumentation — is onboarding/activation milestone tracking in place (analytics events, progress state, health checks)
- Stuck-state recovery — docs for people whose setup failed, migration/upgrade guides, version compatibility notes, rollback paths
- Expansion visibility — features that exist but customers don't know about: undiscovered routes/pages, hidden settings, no in-product surfacing or upsell cues

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the customer-success perspective with severity and evidence

## customer/customer-support

### Goal

Play a Customer Support Engineer — the person handling real tickets every day, caring that users can solve problems before filing a ticket, and that support has enough information to diagnose when help is needed — review <scope> through this role's lens; report-only.

### Review Focus

- Error message quality — user-facing errors state what happened + what to do next; not raw stack traces, bare error codes, or `"Something went wrong"`
- Error taxonomy — structured error codes/types that docs or support can look up; errors with no classification at all
- Self-serve troubleshooting — troubleshooting docs, FAQ, known-issues page, debug/`--verbose` modes, diagnostic commands
- Supportability — log levels, correlation/request IDs, error context support can use to reproduce, diagnostic export/bundle
- Support surface — contact/support links in the product, issue tracker link, status page, help menu, `SUPPORT.md`
- Failure UX — retry guidance, offline/degraded states, rate-limit/quota messaging that says when it will be usable again
- Docs accuracy — error strings and troubleshooting steps in docs match what the code actually emits (compare error strings in code vs docs)

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the customer-support perspective with severity and evidence
