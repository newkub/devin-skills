# PR Review

## Goal

Review PR ก่อน merge ครอบคลุม CI, code quality, tests, security, breaking changes

## Scope

ใช้กับ pull request workflow ก่อน merge ไม่รวมการ fix code ระหว่าง review

## Checks

1. ตรวจสอบ CI status ของ PR ก่อน review
2. อ่าน PR diff และ files ที่เปลี่ยน ตรวจสอบว่า changes ตรงกับ PR description
3. ตรวจสอบไม่มี unintended changes, debug code, TODO/MOCK/placeholder ใน production code
4. ตรวจสอบไม่มี `console.log` หรือ debug statements
5. ตรวจสอบมี tests สำหรับ changes ใหม่ และไม่มี breaking changes โดยไม่มี migration guide
6. ตรวจสอบ secrets ไม่ปรากฏใน diff
7. ตรวจสอบ review comments ทีค้างไม่ถูก resolve

## Severity

- Critical: CI fail, secrets in diff, breaking change without migration
- High: missing tests for new code, debug code in production, unresolved review comments
- Medium: outdated docs สำหรับ changes, minor scope creep
- Low: formatting, cosmetic

## Rules

- ทำ review เท่านั้น ไม่ merge หรือ fix ระหว่าง review
- ทุก finding ต้องมี PR number, file path, line number
- ถ้า breaking change → ต้องมี migration guide
- ถ้า CI fail → หยุดและรอแก้ไขก่อน review ต่อ
