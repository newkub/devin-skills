# Breaking Changes Identification

## Goal

ระบุ breaking changes ก่อน publish

## Checks

### Conventional Commit Detection

1. ตรวช conventional commits มี `BREAKING CHANGE:` ใน footer
2. ตรวช commits มี `feat!:` หรือ `fix!:` syntax
3. ตรวช `BREAKING CHANGE` ระบุว่าอะไร break และ migration path
4. ตรวช breaking changes จัดกลุ่มตาม impact area

### API Changes

1. ตรวช API endpoints ที่เพิ่ม, ลบ, หรือเปลี่ยน signature
2. ตรวช public interfaces ที่เปลี่ยน
3. ตรวช exported functions ที่เปลี่ยน signature
4. ตรวช types ที่เปลี่ยน structure

### Configuration Changes

1. ตรวช config format ที่เปลี่ยน
2. ตรวช env vars ที่เปลี่ยนชื่อหรือลบ
3. ตรวช default values ที่เปลี่ยน
4. ตรวช CLI flags ที่เปลี่ยน

### Migration Notes

1. ตรวช breaking changes มี migration notes
2. ตรวช migration notes บันทึกใน changelog
3. ตรวช migration notes บันทึกใน release notes
4. ตรวช migration steps ชัดเจนและ actionable

## Severity

- Critical: breaking change ไม่มี migration notes, API break ไม่ระบุ
- High: breaking change ไม่มีใน changelog, migration notes ไม่ชัด
- Medium: breaking change ระบุแต่ขาดรายละเอียด, config change ไม่ระบุ
- Low: breaking change ระบุแต่ formatting ไม่สม่ำเสมอ
