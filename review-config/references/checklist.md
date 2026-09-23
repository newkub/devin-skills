# review-config — Full Dimension Checklist

## 1. Inventory And Coverage

- [ ] config files ทั้งหมด mapped: build, lint, test, CI, runtime, editor
- [ ] tools มี config ครบตาม ecosystem, ไม่มี orphan configs
- [ ] `.example` files สำหรับทุก required config

## 2. Correctness

- [ ] schema-valid (JSON schema, tool validators)
- [ ] no deprecated keys/options, version constraints ตรง
- [ ] extends/inheritance chains resolve ถูกต้อง

## 3. Consistency And Dedup

- [ ] shared config opportunities (monorepo root configs)
- [ ] ไม่มี conflicting rules ข้าม configs (eslint vs biome, prettier vs editorconfig)
- [ ] version pins consistent ข้าม tools (engines, volta, mise)

## 4. Secrets And Security

- [ ] ไม่มี secrets/keys ใน config ที่ commit
- [ ] `.env` patterns: `.env.example` มี, `.env` ไม่ commit
- [ ] permissions/private settings ไม่ over-broaden

## 5. Environment Strategy

- [ ] env-specific overrides (dev/staging/prod) ชัดเจน
- [ ] precedence documented: flags > env > file > defaults
- [ ] no localhost/hardcoded URLs ใน shared configs

## 6. Drift And Freshness

- [ ] config drift ข้าม workspaces/envs (เชื่อม `/check-config-drift` report-drift subskill)
- [ ] stale options หลัง upgrades, TODO/FIXME ใน config

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
