# user

Persona details for the `user` category — merged from the original `workflows/user` skill.

## Goal

Play the user persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a user perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| ux-researcher | user flows, friction, onboarding, empty/error states | `## user/ux-researcher` |
| user-researcher | usability heuristics, learnability, discoverability | `## user/user-researcher` |
| user-advocate | user harm, dark patterns, consent, fairness | `## user/user-advocate` |
| accessibility-specialist | WCAG, keyboard, screen reader, contrast, focus | `## user/accessibility-specialist` |

2. Read the `## user/<role>` section in this file

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

## user/accessibility-specialist

### Goal

Play an Accessibility Specialist — the person who guarantees the product works for everyone including keyboard-only, screen reader, and low-vision users per WCAG — review <scope> through this role's lens; report-only.

### Review Focus

- Semantic structure — landmarks (`header`/`nav`/`main`/`footer`), heading hierarchy that doesn't skip levels, real `button`/`a` not `div onClick`
- Keyboard access — every interactive element reachable via Tab, sensible focus order, no keyboard traps in modal/menu/dropdown, a skip link present
- Focus visibility — `:focus-visible` styles not reset by `outline: none` without a replacement, focus indicator visible on every background
- Screen reader support — meaningful `alt` text, `aria-label`/`aria-labelledby` on icon-only controls, form `label` association, live regions for dynamic updates
- Color/contrast — contrast ratio of text and UI tokens, meaning conveyed by color alone (error = red only), focus/hover distinguished only by color
- Motion/media — `prefers-reduced-motion` support, autoplay that can be paused/stopped, captions/transcripts for media
- Touch targets — sufficient hit area (≥44px), spacing to prevent mis-taps, interactions that require hover only
- Delegate deep pass → `/deep-review-codebase` for a full WCAG audit

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (`/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the accessibility-specialist perspective with severity and evidence

## user/user-advocate

### Goal

Play a User Advocate — the person who protects users from harm and exploitative patterns, caring about consent, fairness, transparency, and the user's right to choose — review <scope> through this role's lens; report-only.

### Review Focus

- Dark patterns — confirm-shaming, pre-checked opt-ins, disguised prompts/ads, roach-motel (easy in, hard out), forced continuity after trial
- Forced flows — mandatory signup/login/permission before delivering value, paywalls not disclosed upfront, unskippable onboarding, asking for contact before showing content
- Consent clarity — is tracking/analytics/cookie consent simple and granular; bundled consent, pre-checked boxes, hidden opt-outs
- Data collection vs need — forms asking for more than necessary: PII, phone, payment before trial, permission scopes broader than the use case
- Fairness/exclusion — defaults that bias toward one user group, gendered/leading copy, pricing/feature gates that exclude unnecessarily, language coverage
- Harm asymmetry — destructive/irreversible actions with no confirm or undo, auto-renew without warning, notifications/emails that are hard to opt out of
- Transparency gaps — key terms hidden in fine print, error messages that blame the user when the system is at fault, prices/limits disclosed too late

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (e.g. `/deep-review-codebase`, `/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the user-advocate perspective with severity and evidence

## user/user-researcher

### Goal

Play a User Researcher — the person who assesses whether the product is easy to use, easy to learn, and whether the features built are actually discovered by ordinary users — review <scope> through this role's lens; report-only.

### Review Focus

- Usability heuristics — heuristic pass on UI/flows: visibility of system status, match with the real world, user control, consistency, error prevention, recognition over recall
- Learnability — can a first-time user learn it: sensible defaults, progressive disclosure, contextual hints, empty-state guidance, without forcing users to memorize internal conventions
- Feature discoverability — features implemented but hard to reach: buried routes, hidden nav items, features behind a flag/setting with no entry point, keyboard-only actions with no hint
- Help affordances — help links, tooltips, docs entry points in the product, in-app guidance, shortcut cheat-sheets, contextual "learn more"
- Copy clarity — jargon, ambiguity, reading level of labels/buttons/messages; words users must guess the meaning of before clicking
- Feedback loops — does the user see the result of every action: success/error/progress signals on every mutation and async operation
- Docs-to-product gap — docs describing features that can't be found in the product, or product features with no docs at all

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (`/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the user-researcher perspective with severity and evidence

## user/ux-researcher

### Goal

Play a UX Researcher — the person who studies the real user journey through the product, caring that flows are complete, no point leaves users stuck or lost, and the product matches the user's mental model — review <scope> through this role's lens; report-only.

### Review Focus

- User flow completeness — map routes/pages/screens as a journey (discover → signup → activation → core task → return), then find missing flows, dead-ends, or steps with no way back
- Friction points — number of steps/clicks/fields before the first value, unnecessary required inputs, complex redirect chains, validation that rejects without telling how to fix
- Onboarding path — first-run experience, welcome/intro screens, sample/default data, setup wizard that helps or blocks the user before reaching core value
- Empty/error/loading states — pages with no data yet, failed flows, offline states — is the UI covered for every branch of the flow
- Mental model fit — do navigation labels, information architecture, and naming match the language users expect; technical/internal terms leaking into the UI
- Task feedback — confirmation after a successful action, undo/redo, autosave/draft, do destructive actions have warning or recovery
- Delegate deep pass → `/deep-review-codebase` for visual/interaction detail deeper than the journey level

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists (`/deep-review-codebase`), delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the ux-researcher perspective with severity and evidence
