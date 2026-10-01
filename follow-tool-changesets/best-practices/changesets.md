# Changesets — Best Practices

Versioning + changelog automation สำหรับ monorepo

## Recommended Patterns

- Changeset file ต่อ PR ที่เปลี่ยน behavior — `bunx changeset` (หรือ `pnpm changeset`) สร้าง `.changeset/*.md`; CI บังคับด้วย changeset-bot/status check
- Bump เลือกตาม semver จริง: `patch` = fixes/internal, `minor` = features backward-compat, `major` = breaking — อย่า bump major "เผื่อ"
- `changesets/action` ใน CI — สร้าง "Version Packages" PR อัตโนมัติ; merge แล้ว publish+tag
- `linked`/`fixed` packages ใน config สำหรับ packages ที่ต้อง bump พร้อมกันเสมอ
- Changelog: commit summaries ใน changeset เป็น user-facing — เขียนจากมุม consumer ไม่ใช่ implementer

## Common Pitfalls

- ลืม changeset = version ไม่ bump = release พังเงียบ — enforce ใน CI หรือ PR template
- Private packages: `"private": true` ต้อง ignore ใน config (`ignore` list) — มิฉะนั้น changesets พยายาม publish
- Snapshot releases (`--snapshot`) สำหรับ pre-release testing — ห้าม merge snapshot versions เข้า main
- Fixed vs linked: `fixed` bump ทุกตัวพร้อมกันแม้ไม่เปลี่ยน, `linked` เฉพาะเมื่อตัวใดตัวหนึ่ง bump — เลือกตาม release cadence
- Version PR ต้อง merge เร็ว — stale version PR ที่มี changesets ใหม่ตามหลัง = conflicts

## Workflow Tips

- `changeset status` ตรวจว่า changesets pending — ใช้ใน CI หรือ pre-release check
- `changeset publish` = publish + git tags — อย่า tag มือซ้อน
- Pre-release mode (`changeset pre enter beta`) สำหรับ beta/alpha channels — exit ด้วย `pre exit` ก่อน stable

## Do / Don't

| Do | Don't |
|----|-------|
| changeset ต่อ user-facing change | batch changesets ก่อน release |
| semver ตาม impact จริง | bump เผื่อ/by default minor |
| `linked`/`fixed` ตาม coupling จริง | link ทุก package อัตโนมัติ |
| ignore private packages | publish internal apps |
