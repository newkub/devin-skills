---
name: check-reference
description: อ่าน reference จาก sources ต่างๆ เพื่อตรวจสอบความถูกต้อง
related:
  - check-broken-skills-references
  - check-skills-related
  - update-references
---
## Goal

อ่านและตรวจสอบ reference จาก sources ต่างๆ เพื่อยืนยันความถูกต้องของข้อมูล

## Scope

ตรวจสอบ reference จาก files, web, CLI help, GitHub README, issues, package registry

## Execute

### 1. Read File References

> Goal: Read File References

1. อ่าน reference จากไฟล์ใน project
2. ตรวจสอบว่าข้อมูลถูกต้องและเป็นปัจจุบัน
3. เปรียบเทียบกับ implementation จริง

### 2. Read Web References

> Goal: Read Web References

1. ค้นหาข้อมูลจาก official documentation
2. ตรวจสอบความถูกต้องของข้อมูล
3. ตรวจสอบว่าเป็น version ล่าสุด

### 3. Read CLI Help

> Goal: Read CLI Help

1. รัน `--help` หรือ `-h` สำหรับ CLI tools
2. ตรวจสอบ options และ parameters
3. ตรวจสอบ examples ใน help

### 4. Read GitHub References

> Goal: Read GitHub References

1. อ่าน README.md จาก GitHub repositories
2. อ่าน issues และ discussions
3. ตรวจสอบ changelog และ releases

### 5. Read Package Registry

> Goal: Read Package Registry

1. ตรวจสอบ package information จาก npm, crates.io, PyPI
2. ตรวจสอบ version และ dependencies
3. ตรวจสอบ documentation links

## Rules

### 1. Source Priority

ใช้ sources ตามลำดับความน่าเชื่อถือ:
- Official documentation (สูงสุด)
- GitHub README และ issues
- CLI help
- Package registry
- Community resources

### 2. Verification

ตรวจสอบความถูกต้อง:
- เปรียบเทียบกับหลาย sources
- ตรวจสอบ version compatibility
- ทดสอบ examples จริง

### 3. Currency

ตรวจสอบว่าข้อมูลเป็นปัจจุบัน:
- ตรวจสอบ last updated
- ตรวจสอบ version ล่าสุด
- ตรวจสอบ deprecation notices

## Expected Outcome

- Reference จาก sources ต่างๆ ถูกตรวจสอบครบถ้วน
- ข้อมูลถูกต้องและเป็นปัจจุบัน
- มีความมั่นใจในความถูกต้องของข้อมูล