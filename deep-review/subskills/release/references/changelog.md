# Changelog Completeness Checks

## Goal

ตรวจ changelog completeness ก่อน publish

## Checks

### Changelog File

1. ตรวช `CHANGELOG.md` มี entry สำหรับ version ที่จะ release
2. ตรวช changelog ครอบคลุมทุก conventional commits ตั้งแต่ last release
3. ตรวช changelog format: version header, date, categories
4. ตรวช changelog มี categories: `feat`, `fix`, `breaking`, `docs`, `refactor`

### Release Notes

1. ตรวช `CHANGELOG.md` มี release history table สำหรับทุก tag
2. ตรวช release notes มี summary ของ changes
3. ตรวช release notes มี migration notes สำหรับ breaking changes
4. ตรวช GitHub Release notes พร้อมสร้าง

### Conventional Commits Coverage

1. ตรวชทุก `feat` commit มีใน changelog
2. ตรวชทุก `fix` commit มีใน changelog
3. ตรวชทุก `BREAKING CHANGE` มีใน changelog
4. ตรวชทุก `docs`, `refactor`, `perf` commit มีใน changelog (ถ้าเหมาะสม)

### Changelog Tools

1. ตรวช changelog tool ตั้งค่า: `changelogen`, `semantic-release`, `changesets`, `auto`
2. ตรวช changelog config ถูกต้อง
3. ตรวช changelog generation ทำงานอัตโนมัติ
4. ตรวช changelog format สอดคล้องกับ tool config

## Severity

- Critical: changelog ขาด, breaking change ไม่มีใน changelog, version ขาด
- High: conventional commits ไม่ครบ, release notes ขาด, format ผิด
- Medium: categories ไม่ครบ, tool ไม่ตั้งค่า, migration notes ขาด
- Low: formatting ไม่สม่ำเสมอ, missing dates
