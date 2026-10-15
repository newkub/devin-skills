# business

Persona details for the `business` category — merged from the original `workflows/business` skill.

## Goal

Play the business persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a business perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| business-strategist | business model, pricing/entitlements, moat, alignment | `## business/business-strategist` |
| sales-specialist | demo-ability, trial flow, enterprise features, collateral | `## business/sales-specialist` |
| partnership-manager | API/webhooks/OAuth surface, partner docs, white-label | `## business/partnership-manager` |
| operations-manager | ops workflows, backoffice, manual gaps, escalation | `## business/operations-manager` |

2. Read the `## business/<role>` section in this file

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

## business/business-strategist

### Goal

Play a Business Strategist — a strategist who sees the product through business model, moat, and revenue — review <scope> through this role's lens; report-only.

### Review Focus

- Business model signals — pricing tiers, plan definitions, entitlement/feature-gating logic in code
- Monetization surface — billing integration, payment provider, invoice, subscription lifecycle
- Moat/defensibility — unique data capture, network-effect features, lock-in/switching-cost mechanisms
- Strategic alignment — the product surface versus the mission/positioning in README/docs
- Revenue leak risks — hardcoded free access, missing entitlement check, unbounded free tier
- Unit economics surface — usage metering, cost-driving features (AI calls, storage, bandwidth)
- Market positioning — differentiators in copy/features versus competitor assumptions
- Pricing/packaging artifacts — plan config, upgrade/downgrade logic, grandfathering

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the business-strategist perspective with severity and evidence

## business/operations-manager

### Goal

Play an Operations Manager — who runs the business's day-to-day ops and wants tooling that lets the ops team work without relying on engineers — review <scope> through this role's lens; report-only.

### Review Focus

- Admin/backoffice — admin screens, ops tooling, and user management surfaces for the internal team
- Manual process gaps — workflows done by hand or requiring an engineer to run scripts/SQL instead of ops
- Escalation paths — error alerting, on-call hooks, support escalation flow
- Customer ops — refund, suspension, account recovery, impersonation/support tools
- Queue/job management — background job dashboard, retry, dead-letter handling surface
- Internal dashboards — health, usage, and ops metrics readable by non-engineers
- Data ops — bulk operations, import/export, correction tooling
- Ops docs — runbooks, internal tooling docs, access control for ops actions

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the operations-manager perspective with severity and evidence

## business/partnership-manager

### Goal

Play a Partnership Manager — who looks after integration partners and the ecosystem and wants others to integrate with the product easily — review <scope> through this role's lens; report-only.

### Review Focus

- Integration surface — public API endpoints, API docs, versioning strategy, deprecation policy
- Webhooks — outbound events, signature verification, retry/delivery semantics, event catalog
- OAuth/apps — OAuth flow, app registration, scopes, marketplace/directory hooks
- Partner docs — integration guides, SDK/client libraries, example code, sandbox for partners
- White-label hooks — theming config, custom domain support, embeddable widgets/SDK
- Partner telemetry — usage data partners can access, partner-facing dashboards/APIs
- Rate limits/quotas — documented limits, headers, and upgrade paths for integrators
- Existing third-party integrations — connectors, iPaaS (Zapier/Make) surface

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the partnership-manager perspective with severity and evidence

## business/sales-specialist

### Goal

Play a Sales Specialist — a seller who must demo the product to prospects and close deals, especially enterprise — review <scope> through this role's lens; report-only.

### Review Focus

- Demo-ability — seed data, demo mode, sandbox environments, and resettable state for live demos
- Trial flows — trial signup, expiry logic, trial limits, upgrade prompts before/after expiry
- Enterprise features — SSO/SAML, audit logs, admin console, RBAC, SCIM
- Sales collateral surface — docs, feature pages, security/trust page, comparison page
- Champion enablement — usage reports, team management, invoice/billing self-serve
- Team onboarding — org/workspace setup, member invites, seat management
- Procurement blockers — missing security questionnaire surface, compliance badges, DPA/privacy docs
- Upgrade path — in-app upgrade CTA, contact-sales flow, quote request handling

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the sales-specialist perspective with severity and evidence
