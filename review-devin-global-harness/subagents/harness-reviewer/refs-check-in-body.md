---
name: check-in-body-references
description: ตรวจอ้างอิงในเนื้อหา
---

# Check In-Body References

## Goal

ตรวจอ้างอิงในเนื้อหา

## Checks

1. ค้นหา backtick references เช่น `/skill-name`, `skill-name`, `update-references`
2. ระบุ references ทีไม่มี skill ตรงกัน
3. ตรวจ `/command-name` ว่ามี skill หรือ command จริง
4. บันทึก false positives (เช่น tools/commands ทั่วไป)

