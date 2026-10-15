# Storybook — Best Practices

Component development + docs — quality stories, addons only as needed

## Recommended Patterns

- CSF3 format — `export default { component, title }` + `export const Default = { args }`; args-driven stories, not wrapper components
- Stories = a states matrix: default, loading, error, empty, edge data — cover the states real routes actually hit
- `play` functions (interaction tests) — click/type assertions inside the story; run in test-runner CI
- Decorators for providers (theme, router, state) — global decorators in `.storybook/preview.ts`, not per-story
- Addons only for what you use: essentials, a11y, interactions — every addon adds startup/maintenance cost

## Common Pitfalls

- Stories ≠ docs alone — stories that aren't really tested go stale; play functions + test-runner make stories = tests
- Mock data realism — stories with fake-shaped data only miss real bugs; mirror real API shapes
- SB is not where you fix CSS — visual bugs found in stories → fix the component, not the story wrapper
- Version upgrades: storybook major migrations have codemods (`npx storybook upgrade`) — run them instead of a manual rewrite
- Build time: storybook build is slow in monorepos — cache `.storybook` outputs + lazy compilation flags

## Testing Integration

- `@storybook/test-runner` — run stories as Playwright tests; interactions from play functions execute
- Visual regression: Chromatic/self-hosted screenshots — stories = visual test cases
- a11y addon = an audit signal, not a gate — integrate axe checks in play tests

## Do / Don't

| Do | Don't |
|----|-------|
| CSF3 args-driven stories | duplicate wrapper components per state |
| play functions for interactions | Static stories only |
| decorators for providers | Import providers in every story |
| stories = tests via test-runner | Docs-only stories |
