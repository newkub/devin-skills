# GitHub Actions — Best Practices

CI/CD workflow discipline — security, caching และ maintainability

## Recommended Patterns

- Pin actions ด้วย commit SHA หรือ tag เวอร์ชันเต็ม (`actions/checkout@v4`) — ห้าม `@main`/branch refs ใน supply-chain-sensitive repos
- Minimal permissions: `permissions:` block ต่อ job — `contents: read` default, เพิ่มเฉพาะที่ต้อง
- Cache deps: `actions/setup-*` มี `cache:` built-in (bun/pnpm/npm/cargo) — ใช้แทน actions/cache มือ
- Matrix builds สำหรับ OS/version coverage — `fail-fast: false` เมื่อต้องการเห็นทุก failure
- `concurrency` group + `cancel-in-progress` สำหรับ PR workflows — ไม่เผา runner บน stale pushes

## Common Pitfalls

- Secrets ใน logs: `mask` อัตโนมัติแต่ multiline/transformed secrets leak ได้ — อย่า echo secrets หรือทำ string ops บนมัน
- `pull_request_target` อันตราย — run บน base repo context พร้อม secrets; ห้าม checkout PR code + run ใน trigger นี้
- Job outputs/`GITHUB_OUTPUT` แทน `::set-output` (deprecated)
- Reusable workflows vs composite actions — reusable = job-level isolation, composite = step bundling; เลือกตาม scope
- `if: always()` + status checks — cleanup jobs ต้อง `if: always()` ไม่งั้นไม่รันเมื่อ fail

## Perf Notes

- Dependent jobs serialize — parallelize independent jobs; needs chain เฉพาะที่จำเป็น
- `paths:`/`paths-ignore:` filters ข้าม docs-only changes
- Self-hosted runners สำหรับ heavy builds — cache ค้างเครื่อง

## Do / Don't

| Do | Don't |
|----|-------|
| pin action versions | `@main`/`@master` refs |
| least-privilege `permissions:` | default write-all token |
| `pull_request` trigger สำหรับ PR code | `pull_request_target` + checkout PR |
| concurrency cancel-in-progress | queue builds ซ้อนบน stale commits |
