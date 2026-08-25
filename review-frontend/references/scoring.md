# Frontend Review Score Formula

## Severity Weights

- Critical: 0
- High: 25
- Medium: 50
- Low: 75
- Info: 100

## Score Calculation

- คำนวณ score ต่อ dimension: weighted average ของ findings ใน dimension นั้น
- overall score: weighted average ของทุก dimension
- weight ของแต่ละ finding: severity weight
- formula: `sum(severity_weight * count) / sum(count)`

## Dimensions

- `components`: component structure, props, events, reactivity, composition, reusability, testing, isolation
- `forms`: validation, field rules, error messages, state, submit, loading, accessibility, UX
- `hooks-composables`: design, parameters, return values, reactivity, lifecycle, cleanup
- `state-management`: store, mutation, persistence, sync, derivation, SSR, performance
- `event-handling`: listener cleanup, delegation, memory leak, passive listeners, debounce/throttle, custom events
- `performance`: Core Web Vitals, bundle size, rendering efficiency
- `assets`: images, fonts, static files
- `hydration`: SSR/CSR hydration, mismatch
- `rendering`: re-renders, memoization, code splitting, DOM size
- `ux-ui`: visual hierarchy, typography, color, spacing, layout, micro-interactions
- `accessibility`: keyboard navigation, WCAG 2.1 AA, screen reader
- `responsive`: viewport, breakpoints, mobile-first
- `browser-compat`: browserslist, polyfills, feature detection
- `css`: architecture, naming, CSS-in-JS
- `ux-writing`: voice, tone, copy clarity
- `design-system`: tokens, dark mode, component library

## Report Format

- รายงาน score ต่อ dimension และ overall
- รายงาน findings เป็นตารางด้วย `/report-table`: file, line, severity, dimension, description
- จัดลำดับตาม severity: Critical → High → Medium → Low
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
