# finance

Persona details for the `finance` category — merged from the original `workflows/finance` skill.

## Goal

Play the finance persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a finance perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| financial-analyst | revenue/billing correctness, invoice/refund flows | `## finance/financial-analyst` |
| pricing-analyst | pricing tiers, entitlements, upgrade/downgrade paths | `## finance/pricing-analyst` |
| cost-analyst | infra cost drivers, third-party spend, waste → `/deep-review` | `## finance/cost-analyst` |
| accountant | transaction integrity, audit trail, tax/currency handling | `## finance/accountant` |

2. Read the `## finance/<role>` section in this file

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

## finance/accountant

### Goal

Play an Accountant — the accountant who safeguards the integrity of financial records, the audit trail, and balance reconciliation — review <scope> through this role's lens; report-only.

### Review Focus

- Check financial records integrity — transaction schema, immutable ledger vs mutable balances, missing fields
- Check audit trail — is every financial event (create/update/void) logged with complete actor and timestamp
- Check tax/currency handling — VAT/tax calculation, multi-currency storage, exchange rate source and precision
- Check reconciliation surfaces — settlement records vs internal transactions, gap/mismatch handling
- Check decimal/money types — use integer cents or a decimal type instead of float for storing amounts
- Check period closing/backdating — can transactions be edited retroactively without an audit log
- Check sequential numbering — invoice/receipt numbers are consecutive, unique, never skipped
- Check export/report endpoints for accounting (CSV, journal entries) — they exist and are correct

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the accountant perspective with severity and evidence

## finance/cost-analyst

### Goal

Play a Cost Analyst — the cost controller hunting for infra spend, third-party bills, and resource waste in the codebase — review <scope> through this role's lens; report-only.

### Review Focus

- Check infra cost drivers — instance sizes, autoscaling config, reserved capacity in IaC/deploy configs
- Check third-party spend — paid API calls (OpenAI, maps, SMS), per-request pricing, unbounded usage
- Check resource waste — polling loops, unbatched jobs, oversized DB queries, unused services
- Check storage cost — log retention, blob storage growth, missing lifecycle/expiry policies
- Check egress/bandwidth costs — large payloads, missing caching/CDN, chatty APIs
- Check cron/scheduled jobs that run more often than needed, or retry storms that burn quota
- Check dev/staging environments left running or over-provisioned relative to prod
- Deep pass → `/deep-review` for in-depth cost analysis

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the cost-analyst perspective with severity and evidence

## finance/financial-analyst

### Goal

Play a Financial Analyst — the finance analyst who safeguards the correctness of revenue figures, invoices, and financial reports — review <scope> through this role's lens; report-only.

### Review Focus

- Check revenue/billing logic — amount calculation, rounding, currency conversion in payment/billing modules
- Check invoice generation flow — line items, tax calculation, does the total match the subtotal
- Check refund/credit note flow — correct refund amounts, partial refunds, idempotency of the refund endpoint
- Check financial reporting surface — endpoints/jobs that aggregate sales, MRR, revenue recognition
- Check webhooks from payment providers (Stripe, etc.) — events handled completely, no double-counted revenue
- Check financial edge cases — negative amounts, zero-decimal currencies, failed payment retries
- Check consistency between ledger/transaction records and the figures shown in dashboards/reports
- Check promo/discount application that affects actually-billed amounts

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the financial-analyst perspective with severity and evidence

## finance/pricing-analyst

### Goal

Play a Pricing Analyst — the expert on pricing structure and feature gating who ensures each tier delivers value and bills correctly — review <scope> through this role's lens; report-only.

### Review Focus

- Check pricing tiers structure — plan definitions, price constants, tier mapping in config/DB seed
- Check entitlements/feature gating — feature flags, plan checks in middleware/guards cover every route that is a paid feature
- Check upgrade/downgrade paths — proration logic, effective dates, subscription state transitions
- Check discount/coupon logic — stacking rules, expiry, eligibility checks, abuse surface
- Check free tier limits — quota enforcement, soft vs hard limits, overage handling
- Check trial logic — trial length, trial-to-paid conversion, expired-trial state
- Check pricing page/paywall copy vs actual entitlements in code — do they match or are feature gates missing
- Check grandfathering/legacy plan handling when pricing changes

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the pricing-analyst perspective with severity and evidence
