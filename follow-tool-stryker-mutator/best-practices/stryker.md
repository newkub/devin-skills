# Stryker Mutator — Best Practices

Mutation testing สำหรับ JS/TS — วัดคุณภาพ tests จริงไม่ใช่ coverage

## Recommended Patterns

- `stryker init` → `stryker.conf.json` — testRunner (vitest/jest), mutate globs, reporters
- `mutate` scope เจาะจง: `src/**/*.ts` minus tests/generated — ห้าม mutate test files เอง
- Incremental ใน CI — Stryker รันเฉพาะ mutants ที่ touch changed code; full runs เป็น scheduled job
- `thresholds` config: `high: 80, low: 60, break: <baseline>` — CI fail เมื่อต่ำกว่า break
- Surviving mutants = test backlog — prioritize by criticality ของโค้ด ไม่ใช่ count

## Common Pitfalls

- Mutation score ≠ coverage — tests รันผ่านทุก line แต่ไม่ assert = mutants survive; coverage โกหก
- Runtime cost: mutants × test suite = heavy — scope files + incremental + parallel (`--concurrency`)
- False survivors: logging statements, error messages, edge conditions — `ignore` comments/config เฉพาะ justified
- Flaky tests = noise mutants — fix flakiness ก่อน mutation testing มีค่า
- Timeouts: mutants สร้าง infinite loops — Stryker kills ด้วย timeout; mark `timeout` vs `survived` ต่างกัน

## Workflow

- Baseline run → report → prioritize surviving mutants ใน core logic → write tests → re-verify
- Ratchet `thresholds.break` ขึ้นเรื่อยๆ — เริ่มจาก current score แล้วก้าวขึ้น
- Vitest runner (`@stryker-mutator/vitest-runner`) เร็วกว่า jest สำหรับโปรเจกต์ใหม่

## Do / Don't

| Do | Don't |
|----|-------|
| mutate src only | include tests/generated code |
| incremental + scheduled full runs | full mutants ทุก commit |
| thresholds ratchet ขึ้นเรื่อยๆ | threshold 0 = noise |
| survivors → prioritized backlog | chase score 100% |
