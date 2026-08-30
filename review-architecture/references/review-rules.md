# Review Rules

## Goal

กำหนด rules สำหรับ evidence, review independence, scope boundaries, skip conditions, และ formatting

## Evidence-Based Findings

1. ทุก finding ต้องมี file path และ line number
2. ไม่เดา ใช้ tools สำหรับ verification (`madge`, `knip`, `ast-grep`)
3. ระบุ module, package, boundary, dependency, policy, owner ที่เกี่ยวข้อง
4. ระบุ false positives ที่พบ

## Review Independence

1. ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
2. ใช้ `/review-codebase-everythink` สำหรับระบุ issues ใน code
3. แยก review process จาก fix process
4. ห้ามลบไฟล์, โค้ด, dependencies, หรือ configuration ระหว่าง review

## Scope Boundaries

1. ไม่ review code-level structure (symbols, exports, members) ที่ `/check-code-structure` ทำ
2. ไม่ review filesystem organization ที่ `/check-code-structure` ทำ
3. ไม่ review refactor opportunities ลึกที่ `/review-codebase-everythink` ทำ
4. ไม่ review deployment / CI/CD — ใช้ `/review-delivery`
5. ไม่ review security controls — ใช้ `/review-delivery`
6. ไม่ review code quality — ใช้ `/review-quality`
7. focus ที่ system-level: patterns, boundaries, coupling, SOLID, scalability, modularity, isolation, resilience, reliability, governance

## Skip Conditions

1. ถ้า project ไม่มี module/package structure → ข้าม package boundaries checks
2. ถ้า project ไม่มี tests → ข้าม test isolation checks
3. ถ้า project ไม่มี container/process separation → ข้าม environment isolation checks
4. ถ้า project ไม่มี async operations → ข้าม concurrency checks

## Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
