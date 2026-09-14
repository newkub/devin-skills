# review-uxui — Full Dimension Checklist

## 1. Design System

- [ ] tokens: color, spacing, typography, radius, shadow consistent
- [ ] component variants, states complete (default/hover/active/disabled)
- [ ] dark mode coverage, theme consistency

## 2. Visual Design

- [ ] hierarchy, alignment, spacing rhythm
- [ ] typography scale, readability, contrast
- [ ] visual consistency across pages/states

## 3. Interaction Design

- [ ] affordances clear, feedback on every action
- [ ] loading/empty/error/success states
- [ ] micro-interactions, transitions appropriate
- [ ] destructive actions guarded (confirm/undo)

## 4. Settings And Preferences

- [ ] expected sections: profile, appearance/theme, shortcuts, notifications, privacy, data, about
- [ ] nav grouped, deep-linkable routes, save model consistent, danger zone แยก
- [ ] interactive controls: theme preview, shortcut recorder, toggles มี feedback

## 5. Motion And Delight

- [ ] motion tokens (duration/easing), consistent easing, `prefers-reduced-motion` respected
- [ ] skeleton/shimmer loading, micro-interactions, spatial continuity
- [ ] no blocking animation, 60fps properties only

## 6. Flows And UX

- [ ] critical journeys: minimal steps, clear progress
- [ ] onboarding, first-run experience
- [ ] error recovery paths, dead ends eliminated
- [ ] forms UX: inline validation, smart defaults

## 7. Accessibility Overlap

- [ ] basic a11y signals (deep-dive → `/review-accessibility`)
- [ ] keyboard operable, focus visible

## 8. Design-Dev Handoff

- [ ] spec fidelity, assets exportable
- [ ] naming alignment design ↔ code

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
