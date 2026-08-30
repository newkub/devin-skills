# Deep Analyze

วิเคราะห์ tech stack และ dependencies อย่างลึกซึ้ง

## Goal

ครอบคลุมทุก dimension พร้อม review score

## Execute

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/review-codebase-everythink` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
6. Analyzer ตรวจสอบ framework versions, compatibility matrix, และ EOL status — ดู `references/techstack.md`
7. Analyzer ตรวจสอบ dependency versions, security, unused, circular, license — ดู `references/dependencies.md`
8. Analyzer ตรวจสอบ library API, bundle size, tree-shaking, peer deps, semver — ดู `references/lib-design.md`
9. Review CLI คำนวณ tech stack review score จาก review report — ดู `references/scoring.md`
10. ถ้า review CLI ไม่ผ่าน → ทำ `/review-codebase-everythink` แล้ว re-run ถ้าไม่ผ่านหลังจาก 3 ครั้ง → stop และ report

## Expected Outcome

- ผลจาก `/deep-analyze`, `/review-codebase-everythink`, `/run-review`
- Findings สำหรับ tech stack, dependencies, library design
- Tech stack review score พร้อม grade
