# Storybook — Best Practices

Component development + docs — stories มีคุณภาพ, addons ตามจำเป็น

## Recommended Patterns

- CSF3 format — `export default { component, title }` + `export const Default = { args }`; args-driven stories ไม่ใช่ wrapper components
- Stories = states matrix: default, loading, error, empty, edge data — ครอบคลุม states ที่ routes จริงเจอ
- `play` functions (interaction tests) — click/type assertions ใน story; run ใน test-runner CI
- Decorators สำหรับ providers (theme, router, state) — global decorators ใน `.storybook/preview.ts` ไม่ใช่ per-story
- Addons เฉพาะที่ใช้: essentials, a11y, interactions — addon ทุกตัวเพิ่ม startup/maintenance

## Common Pitfalls

- Stories ≠ docs เดียว — stories ที่ไม่ test จริงกลายเป็น stale; play functions + test-runner ทำให้ stories = tests
- Mock data realism — stories ด้วย fake-shaped data เท่านั้น miss real bugs; mirror real API shapes
- SB ไม่ใช่ที่ fix CSS — visual bugs ที่ stories พบ → fix ใน component ไม่ใช่ story wrapper
- Version upgrades: storybook major migrations มี codemods (`npx storybook upgrade`) — run มันไม่ใช่ manual rewrite
- Build time: storybook build ช้าใน monorepo — cache `.storybook` outputs + lazy compilation flags

## Testing Integration

- `@storybook/test-runner` — run stories เป็น Playwright tests; interactions จาก play functions execute
- Visual regression: Chromatic/self-hosted screenshots — stories = visual test cases
- a11y addon = audit signal ไม่ใช่ gate — integrate axe checks ใน play tests

## Do / Don't

| Do | Don't |
|----|-------|
| CSF3 args-driven stories | duplicate wrapper components per state |
| play functions for interactions | static stories เท่านั้น |
| decorators สำหรับ providers | import providers ทุก story |
| stories = tests via test-runner | stories เป็น docs-only |
