# review-platform — Full Dimension Checklist

## 1. Mobile And Desktop

- [ ] native capabilities, permissions, app lifecycle
- [ ] responsive/adaptive layouts, safe areas
- [ ] platform conventions (HIG/Material) respected

## 2. CLI And TUI

- [ ] spot check CLI surface (deep-dive → `/review-cli`)
- [ ] TUI behavior, terminal compat (references/cli-tui.md)

## 3. SSR, State, Routing, PWA

- [ ] SSR/SSG strategy, hydration correctness
- [ ] state management fit, routing conventions
- [ ] PWA: manifest, SW, offline

## 4. i18n

- [ ] locale detection, string externalization
- [ ] pluralization, RTL, date/number formats
- [ ] translation coverage completeness

## 5. SEO

- [ ] meta tags, structured data, sitemap/robots
- [ ] canonical, OG/Twitter cards (deep-dive → `/review-seo`)

## 6. Battery And Energy

- [ ] background activity, wake locks, polling cost
- [ ] animation/render energy, thermal impact

## 7. Performance And Accessibility

- [ ] platform perf budgets, startup time
- [ ] a11y per platform (deep-dive → `/review-accessibility`)

## 8. Compatibility

- [ ] OS version matrix, browser/engine support
- [ ] graceful degradation, feature detection

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
