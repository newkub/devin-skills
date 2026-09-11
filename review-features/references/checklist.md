# review-features — Full Dimension Checklist

## 1. Format And Structure

- [ ] FEATURES.md format ตาม convention, sections ครบ
- [ ] feature entries consistent: name, status, description
- [ ] status values valid (done/wip/planned)

## 2. Coverage

- [ ] features ใน docs ตรงกับ code จริง (no phantom/missing)
- [ ] public API surface documented
- [ ] edge capabilities: flags, experimental, deprecated marked

## 3. Consistency

- [ ] no duplication ข้าม docs (FEATURES vs README vs docs/)
- [ ] naming ตรงกับ code (commands, components, modules)
- [ ] versions/compatibility notes current

## 4. Navigation

- [ ] sidebar/nav ครบทุก feature page
- [ ] cross-links ระหว่าง related features
- [ ] monorepo: per-package feature coverage

## 5. Freshness

- [ ] drift check: features removed/renamed ใน code
- [ ] screenshots/demos current กับ UI จริง

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
