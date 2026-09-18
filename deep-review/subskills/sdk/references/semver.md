# Semver And Compatibility Checklist — review-sdk

## Breaking Changes

- [ ] API surface diff ระหว่าง current และ last published — removed exports, signature changes, behavior changes
- [ ] ทุก breaking change มี major bump — ไม่มี breaking ใน minor/patch
- [ ] migration notes ต่อ breaking — วิธีอัปเกรด, code mods, search patterns
- [ ] runtime behavior breaking ก็นับ — return value semantics, error types, timing, side effects

## Deprecations

- [ ] `@deprecated` JSDoc บน API ที่จะลบ — มี alternative path ชัด
- [ ] runtime deprecation warnings — console.warn เมื่อใช้ API เก่า (opt-out ได้)
- [ ] removal timeline — "deprecated in 2.x, remove in 3.0" ไม่ใช่หายไปเงียบๆ
- [ ] docs แยก deprecated — ไม่แนะนำของที่จะลบ

## Version Discipline

- [ ] changesets/release notes ต่อ version — ไม่ silent releases
- [ ] changelog ครบ — ทุก user-visible change, เชื่อม commit/PR ได้
- [ ] pre-release tags ถูก — `beta`, `rc`, `next` dist-tags ไม่ปน stable
- [ ] lockstep versions ใน monorepo — related packages bump พร้อมกันถ้า contract เชื่อมกัน

## Peer Dependencies

- [ ] peer ranges ไม่แคบเกิน — `react: "^18"` ไม่ใช่ `react: "18.2.0"` (lock consumers)
- [ ] peer ranges ไม่กว้างเกิน — `*` หรือ `>=16` ที่รับทุกอย่างรวมถึงของที่ยังไม่ทดสอบ
- [ ] optional peers มี `peerDependenciesMeta.optional: true` — ไม่ force install
- [ ] peer conflicts กับ versions หลัก — React 19 ออกแล้ว range รองรับหรือยัง

## API Stability

- [ ] exported types ไม่เปลี่ยน shape โดยไม่ bump — interface fields, union members, enum values
- [ ] default behavior ไม่เปลี่ยน — feature flags, config defaults ที่คน depend on
- [ ] error contract stable — same errors, same codes, same messages structure
- [ ] internal refactor ไม่ leak — implementation details ไม่กลายเป็น API surface

## Detection

- `/check-backward-compatibility` — API diff report
- `api-extractor` / `api-documenter` — public API surface snapshot
- git diff บน `dist/` types ระหว่าง tags

Severity: silent breaking = Critical, no migration notes = High, deprecation without path = Medium, narrow peer range = Medium
