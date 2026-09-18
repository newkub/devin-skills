# Versioning Checks

## Goal

Review versioning strategy, changelog, release notes และ deprecation policy

## Scope

ใช้กับ project ที่มี versioning, releases หรือ changelogs

## Checks

1. ตรวจสอบ semver compliance, changelog format (Keep a Changelog), release notes, migration paths
2. ตรวจสอบ deprecation policy: notices, sunset timeline, migration guides, backward compatibility

## Severity

- Critical: no versioning strategy, breaking change ไม่มี migration path, ไม่มี changelog
- High: semver violation, missing release notes, deprecation ไม่มี sunset timeline
- Medium: incomplete changelog entry, missing migration guide
- Low: format inconsistency, documentation gap

## Rules

- ถ้า project ไม่มี versioning strategy → ข้าม checks นี้
- ทุก finding ต้องมี release, tag หรือ changelog ที่เกี่ยวข้อง
- ทำ review เท่านั้น ไม่แก้ไข version หรือ changelog ระหว่าง review
