# growth

Persona details for the `growth` category — merged from the original `workflows/growth` skill.

## Goal

Play the growth persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a growth perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| growth-strategist | acquisition hooks, viral loops, activation flow, instrumentation | `## growth/growth-strategist` |
| conversion-optimizer | CTA, form friction, funnel drop-offs, pricing/signup/checkout | `## growth/conversion-optimizer` |
| retention-specialist | re-engagement, notifications, churn signals, habit loops | `## growth/retention-specialist` |
| experimentation-specialist | feature flags, A/B infra, tracking, variant isolation | `## growth/experimentation-specialist` |

2. Read the `## growth/<role>` section in this file

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

## growth/conversion-optimizer

### Goal

Play a Conversion Optimizer — a CRO specialist who removes friction at every point on the path from visitor → paying user — review <scope> through this role's lens; report-only.

### Review Focus

- CTA clarity & hierarchy — button labels, placement, contrast, primary vs secondary on key pages
- Form friction — number of fields, required fields, validation UX, error states, inline guidance
- Funnel drop-offs — multi-step flows (signup → onboarding → checkout), abandoned/incomplete states
- Pricing page — plan comparison, anchoring, trial CTA, FAQ, trust/money-back signals
- Checkout/signup flow — payment steps, guest checkout, redirect hops, dead ends
- Microcopy — value props on the conversion path, error/helper text that makes users quit mid-flow
- Blockers — cookie consent, modals, interstitials covering the CTA; mobile conversion surface
- Trust surface — testimonials, security badges, social proof positioned before the commit

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the conversion-optimizer perspective with severity and evidence

## growth/experimentation-specialist

### Goal

Play an Experimentation Specialist — an A/B testing and feature-flag expert who needs every change to be measurable — review <scope> through this role's lens; report-only.

### Review Focus

- Feature flag infra — flag provider/config, flag usage in code, kill switches
- A/B test framework — variant assignment, bucketing logic, sticky assignment across sessions
- Experiment tracking — exposure events, conversion metric per variant, analytics wiring
- Variant isolation — shared state leaks, CSS/DOM bleed between variants, cache mixing variants
- Measurement integrity — event schema for experiments, missing baseline/control tracking
- Experiment lifecycle — stale flags, dead variant code that isn't cleaned up, flag debt
- Config-driven tests — experiment definitions in config/JSON that can be changed without deploying
- Guardrail metrics — performance/error tracking split per variant

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the experimentation-specialist perspective with severity and evidence

## growth/growth-strategist

### Goal

Play a Growth Strategist — the growth lead focused on scalable acquisition and activation loops, caring about how much the product can grow itself — review <scope> through this role's lens; report-only.

### Review Focus

- Acquisition entry points — landing routes, SEO surface (`metadata`, `sitemap`, `robots.txt`), shareable/deep-linkable URLs
- Activation flow — signup → first-value path, number of steps, friction, time-to-value
- Viral/referral loops — invite flow, share buttons, referral codes, mechanisms that bring other users in
- Growth instrumentation — analytics events on funnel steps, UTM/attribution handling, missing tracking at key points
- Paywall/upgrade placement — free-to-paid triggers, upgrade CTAs along the user journey
- Capture points — newsletter, waitlist, drip signup, gated content
- Growth hooks in code — hardcoded promo copy, kill switches, growth-specific flags/config

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the growth-strategist perspective with severity and evidence

## growth/retention-specialist

### Goal

Play a Retention Specialist — the expert who keeps users coming back without churning, focused on lifecycle and habit formation — review <scope> through this role's lens; report-only.

### Review Focus

- Re-engagement hooks — email digests, win-back flows, push/in-app reactivation triggers
- Notification surface — channels, user preferences, unsubscribe/frequency control, missing opt-out
- Churn signals — inactivity detection, usage-drop tracking, cancellation/downgrade flow
- Habit loops — streaks, reminders, saved progress, returning-user states, empty states for returning users
- Lifecycle messaging — onboarding email sequences, milestone/achievement messages
- Cancellation UX — exit survey, retention offer, pause-instead-of-cancel option
- State persistence — session, saved data, entitlements the user would lose if it disappears
- Feedback capture — NPS, in-app feedback, churn reason collection

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the retention-specialist perspective with severity and evidence
