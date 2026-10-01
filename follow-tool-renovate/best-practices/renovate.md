# Renovate — Best Practices

Automated dependency updates — config precision และ noise control

## Recommended Patterns

- `renovate.json` (หรือ `.github/renovate.json`) — extend `config:recommended` base แล้ว override เจาะจง
- `packageRules` จัดกลุ่ม: group minor+patch ของ ecosystem เดียว (react*, types/*) — ลด PR spam
- `automerge` เฉพาะ low-risk: patch/minor devDeps + tests pass required — major/peer-sensitive ไม่ automerge
- `schedule` จำกัดเวลา (`before 5am`, weekends) — ไม่ให้ PRs กระจายทั้งวัน
- `dependencyDashboard` issue — visibility ของ pending updates + manual triggers

## Common Pitfalls

- Default config = PR flood — ไม่มี grouping/schedule = team เริ่ม ignore renovate PRs (worse than none)
- Automerge ต้องมี CI แข็งแรง — merge ตาไม่เปิดต้อง test coverage จริง
- Lockfile-only updates (`lockFileMaintenance`) — enable weekly เพื่อ dedupe transitive deps
- Peer dep conflicts: renovate bump ทีละตัว — grouped ecosystem updates (react+types+plugins) ป้องกัน broken intermediate states
- Major updates ต้อง review migration guides — renovate PR body link changelogs แต่ agent ต้องตรวจ breaking

## Workflow

- Triage weekly: dashboard → merge safe batches → investigate majors → close wontfix
- Security: `vulnerabilityAlerts` + `osvVulnerabilityAlerts` — security PRs แยก automerge policy
- Pin digests: `pinDigests` สำหรับ Docker/GitHub Actions — supply-chain hardening

## Do / Don't

| Do | Don't |
|----|-------|
| packageRules grouping per ecosystem | per-package PR floods |
| automerge patch/devDeps เท่านั้น | automerge majors |
| schedule + dashboard | always-on noise |
| pinDigests for actions/docker | unpinned floating refs |
