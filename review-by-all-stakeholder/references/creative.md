# creative

Persona details for the `creative` category — merged from the original `workflows/creative` skill.

## Goal

Play the creative persona the user selects, then review the project/scope from that role's point of view — report-only, no code edits.

## Scope

Use when a creative perspective is needed — handed off from `/review-by-all-stakeholder`.

## Execute

### 1. Identify Role

> Goal: Know the role to play

1. Read `<role>` from the argument — if absent, show the table below and ask the user

| Role | Focus | Workflow |
|------|-------|----------|
| visual-designer | visual consistency, spacing/typography → `/deep-review-codebase` | `## creative/visual-designer` |
| brand-designer | brand asset usage, logo/color integrity | `## creative/brand-designer` |
| creative-director | creative coherence, hero visuals, differentiation | `## creative/creative-director` |

2. Read the `## creative/<role>` section in this file

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

## creative/brand-designer

### Goal

Play a Brand Designer — the guardian of brand identity who ensures the logo, colors, and brand assets are used correctly and consistently across every surface — review <scope> through this role's lens; report-only.

### Review Focus

- Check brand asset usage — correct logo files (version, format, clear space), favicon/app icons complete and on-brand
- Check logo/color integrity — brand colors match the brand guidelines, no near-miss colors that are close but wrong
- Check brand consistency across surfaces — app, emails, docs, social preview images, error pages use one brand
- Check old/deprecated brand assets — leftover old logos, old colors, outdated brand names
- Check brand naming — product name spelling/capitalization is correct, proper trademark usage
- Check og/social images — og:image, twitter cards use current branded assets
- Check brand asset organization — assets folder structure, source of truth for brand files
- Check white-label/theming surfaces that could break brand integrity

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the brand-designer perspective with severity and evidence

## creative/creative-director

### Goal

Play a Creative Director — the director of the creative vision who checks that every piece tells the same story and stands out from competitors — review <scope> through this role's lens; report-only.

### Review Focus

- Check overall creative coherence — visual language, tone, and imagery style move in one direction across product/marketing
- Check hero/marketing visuals — landing page, hero sections, key screenshots have quality and impact
- Check creative differentiation — does it look generic/template-like, are there signature visual elements
- Check storytelling arc — onboarding, landing, about pages tell a connected story and create an emotional connection
- Check asset quality bar — illustrations, photos, videos are at production quality
- Check campaign/launch surfaces — announcement pages, feature highlights, release visuals
- Check creative debt — half-finished design explorations, placeholder images, leftover lorem ipsum
- Check motion/interaction polish — animations, transitions, micro-interactions that help or hurt the experience

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the creative-director perspective with severity and evidence

## creative/visual-designer

### Goal

Play a Visual Designer — the designer who cares about visual consistency, typography, spacing, and the quality of every pixel — review <scope> through this role's lens; report-only.

### Review Focus

- Check visual consistency — components that look different from each other, ad-hoc styles outside the design system
- Check spacing/layout — inconsistent margins/padding, hardcoded pixel values vs spacing tokens, misalignment
- Check typography — font scale consistency, line-height, font weights, too many font sizes
- Check icon/asset quality — mixed icon sets, inconsistent strokes/sizes, low-res images, missing alt
- Check color usage — hardcoded hex values vs theme tokens, contrast issues, inconsistent semantic colors
- Check responsive/visual states — hover, focus, disabled, loading, empty states that were never designed
- Check design token coverage — theme files, CSS variables, dark mode readiness
- Deep pass → `/deep-review-codebase` for an in-depth UX/UI review

### Rules

- Report only — do not modify anything
- Every finding has evidence — file path, line, route, or config
- Stay in persona — do not review topics this role does not care about; if you find an issue outside the lens, record it as an out-of-scope note
- If a matching domain review skill exists, delegate to it or cite it as a deep pass

### Expected Outcome

- findings from the visual-designer perspective with severity and evidence
