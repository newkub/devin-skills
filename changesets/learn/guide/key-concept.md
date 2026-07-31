# Key Concepts

แนวคิดพื้นฐานและ key terms ของ Changesets

## What is Changesets?

Changesets เป็น tool สำหรับ:
- Version management ใน monorepos
- Automated changelog generation
- Release automation
- Semantic versioning

## Core Concepts

### Changeset
ไฟล์ `.md` ที่บันทึกการเปลี่ยนแปลง:
- ระบุ packages ที่มีการเปลี่ยนแปลง
- กำหนด version bump type (major, minor, patch)
- เขียน changelog message

### Version Bump Types

- **major**: Breaking changes
- **minor**: New features, backward compatible
- **patch**: Bug fixes, backward compatible

### Monorepo Support
Changesets ออกแบบมาสำหรับ monorepos:
- Track changes ข้าม packages
- Handle dependencies ระหว่าง packages
- Version packages พร้อมกัน

### Changelog Generation
สร้าง changelog อัตโนมัติ:
- Aggregate changesets
- Generate markdown changelog
- Organize by version

## Workflow

1. **Create Changeset**: `bunx changeset`
2. **Version Packages**: `bunx changeset version`
3. **Publish**: `bunx changeset publish`

## Key Terms

- **Changeset**: ไฟล์ที่บันทึกการเปลี่ยนแปลง
- **Version Bump**: การเพิ่ม version number
- **Changelog**: บันทึกการเปลี่ยนแปลง
- **Release**: การ publish packages
- **Monorepo**: Repository ที่มีหลาย packages
