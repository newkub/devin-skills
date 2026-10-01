# Semantic Release Best Practices

## Recommended Patterns

- บังคับ conventional commits ตั้งแต่ต้น — ใช้ commitlint + git hooks (`/follow-tool-hk` หรือ husky) เพื่อ reject commit ที่ format ผิด
- ใช้ squash merge เข้า release branch — PR title เป็น conventional commit เดียว ทำให้ history สะอาดและ version bump คาดเดาได้
- ตั้ง `version` ใน `package.json` เป็น placeholder เช่น `0.0.0-development` — semantic-release derive version จาก commits เสมอ ไม่อ่านค่านี้
- เรียง plugins ตามลำดับ: `@semantic-release/commit-analyzer` → `release-notes-generator` → `changelog` → `npm` → `git` → `github` — ลำดับผิด = changelog ถูก commit ก่อน generate
- กำหนด `branches` ชัดเจน: `main` สำหรับ stable, `{ name: 'beta', prerelease: true }` สำหรับ prerelease channel
- ใช้ `tagFormat` ที่สอดคล้องกับ monorepo/tag conventions เช่น `v${version}` หรือ `pkg-name@${version}`
- รัน `semantic-release --dry-run` บน PR หรือ local ก่อน merge — เห็น version ที่จะได้และ release notes ล่วงหน้า

## Common Pitfalls

- commit ที่ไม่ใช่ conventional format หลุดเข้า main — release ไม่ trigger หรือ bump ผิดระดับ
- squash merge ตัด `BREAKING CHANGE:` footer ทิ้ง — major bump หาย; ตรวจ commit message ตอน merge
- ลืม `@semantic-release/git` plugin — `CHANGELOG.md` generate แล้วแต่ไม่ถูก commit กลับเข้า repo
- รัน `semantic-release` จาก local โดยตรง — publish ของจริงโดยไม่ผ่าน CI checks; ใช้ `--dry-run` เท่านั้น
- release จากหลาย branch โดยไม่ตั้ง `branches` — tag/publish ชนกัน
- `GITHUB_TOKEN` default ไม่มี `contents: write` — push tag/release ล้ม
- npm publish ด้วย classic token ที่หมดอายุ — migrate ไป OIDC trusted publishing

## Do / Don't

| Do | Don't |
|----|-------|
| release ใน CI เท่านั้น หลัง tests ผ่าน | รัน publish จากเครื่อง local |
| ใช้ OIDC trusted publishing สำหรับ npm | เก็บ long-lived `NPM_TOKEN` ใน secrets ถ้าเลี่ยงได้ |
| dry-run ก่อน release จริงทุกครั้งที่ config เปลี่ยน | assume version output โดยไม่ตรวจ |
| ตั้ง `branches` allowlist ชัดเจน | ปล่อย default branches ใน repo ที่มีหลาย long-lived branches |
| squash merge พร้อม conventional title | merge commit ที่รวมหลาย type ปนกันโดยไม่ review |

## Config Guidance

- ใช้ `.releaserc`/`release.config.cjs` แยกไฟล์ — diff review ง่ายกว่า `release` field ใน `package.json`
- `changelog` plugin: ระบุ `changelogFile: 'CHANGELOG.md'` และเพิ่มเข้า `assets` ของ `git` plugin
- `npm` plugin: ตั้ง `npmPublish: false` ถ้า package เป็น private ที่ต้องการแค่ GitHub release
- prerelease workflow: `fix` → `main` (patch/minor), `feat` ใหญ่ → merge ผ่าน `beta` branch ก่อนเพื่อทดสอบ `beta.x` versions
- commit analyzer defaults: `feat` = minor, `fix` = patch, `BREAKING CHANGE` = major, อื่นๆ ไม่ bump — ปรับ `releaseRules` ถ้าต้องการ `perf`/`refactor` bump ด้วย

## Performance & CI

- release job ควรรันหลัง test/lint/build jobs ผ่าน — ใช้ `needs:` chain ใน GitHub Actions
- permissions ขั้นต่ำ: `contents: write` (tags/releases), `id-token: write` (OIDC), `pull-requests: write` (comments)
- dry-run บน PR ช่วยจับ config ผิดก่อน merge — เพิ่ม job แยกที่ไม่มี publish credentials
- release job ควร idempotent — ถ้า fail กลางทาง รันใหม่ต้องไม่ publish ซ้ำ (semantic-release เช็ค tags/npm registry ให้แล้ว แต่ตรวจให้ชัวร์)
- อย่าใส่ release ใน workflow เดียวกับ PR checks — แยก workflow ที่ trigger เฉพาะ push to release branches
