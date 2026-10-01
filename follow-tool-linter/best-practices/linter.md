# Linter — Best Practices

Linter usage discipline — config minimal, zero-warning policy และ CI parity

## Recommended Patterns

- Linter หลักของ stack: JS/TS → Biome (`/follow-tool-biome`) หรือ ESLint, Rust → clippy, CSS → stylelint — ตัวเดียวต่อ domain
- Config minimal: เพิ่มเฉพาะ rules ที่ deviate จาก recommended preset — `/follow-default-config`
- CI ใช้ command เดียวกับ local เป๊ะ — parity ไม่มี "works on my machine"
- `--fix`/`--unsafe-fixes` ที่ local เท่านั้น — CI ใช้ check mode (fail, no modify)
- Editor integration = format/lint on save — feedback loop สั้นสุด

## Common Pitfalls

- Rule sprawl: เปิด rules ทุกตัว = noise → team ignore; เริ่ม recommended แล้วเพิ่มตามจริง
- Inline disables (`eslint-disable`, `#[allow]`) ต้องมีเหตุผล — audit เป็นระยะ, disable-file-level = red flag
- Lint ไม่ fix architecture — linter catches style/bugs, design ต้อง review
- Two linters overlap (ESLint + Biome บนเดียวกัน) = conflicting fixes — เลือก owner ต่อ file type
- Version drift local vs CI — pin version ใน manifest + lockfile

## Workflow

- Zero-warning policy: baseline warnings → ratchet ลง 0 — warnings ที่ ignore = worse than no lint
- New rules rollout: warn → fix wave → error
- Autofixable rules = gate strict; opinionated manual rules = warn

## Do / Don't

| Do | Don't |
|----|-------|
| one linter per domain | overlapping linters flip-flop |
| recommended preset + minimal overrides | hand-pick 200 rules |
| fix warnings to zero | accumulate warn debt |
| disables มี comment เหตุผล | file-level disables |
