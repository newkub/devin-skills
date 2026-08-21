---
name: follow-migration
description: วางแผนและ execute migration สำหรับ dependencies, frameworks, และ infrastructure
allowed-tools:
- read
- edit
- grep
- glob
- exec
triggers:
- user
- model
---

## Goal

วางแผนและ execute migration อย่างเป็นระบบเพื่อลดความเสี่ยงและ downtime

## Scope

Migration ทุกประเภท: dependencies, frameworks, databases, APIs, infrastructure

## Execute

### 1. Assessment And Planning

1. ระบุสิ่งที่ต้อง migration (dependencies, frameworks, databases)
2. วิเคราะห์ impact และ dependencies ที่เกี่ยวข้อง
3. ประเมินความเสี่ยงและ complexity ของ migration
4. ทำ pre-migration profiling และ data quality assessment
5. ตรวจสอบ system compatibility ระหว่าง versions
6. สร้าง migration plan พร้อม timeline และ rollback strategy

### 2. Preparation

1. สร้าง feature branch สำหรับ migration
2. ติดตั้ง dependencies ใหม่หรือ setup environment ใหม่
3. เขียน migration scripts หรือ codemods
4. สร้าง backup ของ data และ configuration
5. สร้าง staging environment สำหรับ testing
6. ตั้งค่า automated monitoring และ alerts

### 3. Code Transformation

1. ใช้ `/gritql` หรือ `/follow-ast-grep` สำหรับ automated code changes
2. อัพเดท imports และ API calls
3. แก้ไข breaking changes ใน code
4. อัพเดท configuration files

### 4. Testing

1. รัน unit tests สำหรับ changed code
2. รัน integration tests สำหรับ affected flows
3. ทำ `/regression-test` เพื่อตรวจสอบว่าไม่มี regressions
4. ทำ manual testing สำหรับ critical functionality
5. ทำ automated validation สำหรับ data integrity
6. ทำ load testing สำหรับ performance-critical migrations
7. ทดสอบ rollback plan บน staging environment

### 5. Deployment

1. ทำ deployment แบบ phased หรือ canary
2. ใช้ blue-green deployment สำหรับ zero-downtime
3. monitor logs และ metrics อย่างใกล้ชิด
4. มี rollback plan พร้อมใช้งาน
5. ตรวจสอบ data integrity หลัง migration
6. ตรวจสอบว่า migration สำเร็จ

### 6. Cleanup

1. ลบ dependencies ที่ไม่ได้ใช้แล้ว
2. อัพเดท documentation
3. ปิด feature branches
4. สรุป lessons learned

### 7. Commit Changes

1. ทำตาม `/git-commit` เพื่อ commit migration changes
2. ใช้ conventional commit format (เช่น `feat(migration): migrate from X to Y`)
3. รวม breaking changes และ migration notes ใน commit body
4. Push ไปยัง remote และสร้าง pull request
5. รวม feature branch เข้า main branch หลัง review ผ่าน

## Rules

### 1. Risk Assessment

ประเมินความเสี่ยงก่อน migration:

- ระบุ critical paths ที่อาจได้รับผลกระทบ
- ประเมิน complexity ของ breaking changes
- วิเคราะห์ dependencies ที่เกี่ยวข้อง
- ทำ pre-migration profiling และ data quality assessment
- ตรวจสอบ system compatibility ระหว่าง versions
- สร้าง rollback strategy ชัดเจน
- ประเมิน technical, operational, และ compliance risks

### 2. Code Transformation Tools

เลือก tools ที่เหมาะสมสำหรับ code changes:

- ใช้ `/gritql` สำหรับ Biome projects และ custom linting
- ใช้ `/follow-ast-grep` สำหรับ complex codemods และ multi-language support
- ใช้ official codemods หากมีให้
- ใช้ automated tools แทน manual changes เมื่อเป็นไปได้

### 3. Testing Strategy

ทดสอบอย่างครอบคลุมก่อน deployment:

- รัน tests ทุกประเภท (unit, integration, e2e)
- ทำ `/regression-test` เพื่อตรวจสอบ existing functionality
- ทำ automated validation สำหรับ data integrity
- ทำ load testing สำหรับ performance-critical migrations
- ทำ manual testing สำหรับ critical user journeys
- ทดสอบ rollback plan บน staging environment
- ทำ performance monitoring ระหว่าง testing

### 4. Deployment Strategy

ใช้ deployment strategy ที่ปลอดภัย:

- ใช้ phased deployment สำหรับ large migrations
- ใช้ canary deployment สำหรับ high-risk changes
- ใช้ blue-green deployment สำหรับ zero-downtime
- ใช้ expand-contract pattern สำหรับ database schema changes
- มี rollback plan พร้อมใช้งานเสมอ
- monitor อย่างใกล้ชิดหลัง deployment
- ตรวจสอบ data integrity หลัง migration
- ใช้ automated monitoring และ alerts

### 5. Documentation

บันทึกทุกอย่างอย่างละเอียด:

- บันทึก migration plan และ decisions
- บันทึก breaking changes และ workarounds
- อัพเดท API documentation
- อัพเดท README และ guides
- บันทึก data mapping และ transformation rules
- บันทึก rollback procedures และ runbooks

### 6. Communication

สื่อสารกับทีมอย่างชัดเจน:

- แจ้ง timeline และ impact ก่อน migration
- แจ้ง progress อย่างสม่ำเสมอ
- แจ้ง issues และ blockers ทันที
- สรุป results หลัง migration เสร็จ

### 7. Commit Strategy

ใช้ conventional commits สำหรับ migration:

- ใช้ type `feat` หรือ `refactor` สำหรับ migration
- ระบุ scope เป็น `migration` หรือ component ที่ migrate
- อธิบาย breaking changes ใน commit body
- บันทึก migration notes และ references

## Expected Outcome

- Migration สำเร็จโดยไม่มี downtime ที่ไม่คาดคิด
- Code ถูก transform อย่างถูกต้อง
- Tests ผ่านทั้งหมด
- Documentation อัพเดทครบถ้วน

## Common Mistakes

ข้อผิดพลาดที่พบบ่อย:

- ไม่ทำ risk assessment ก่อน migration
- ไม่มี rollback plan
- ไม่ทดสอบอย่างครอบคลุม
- ไม่ monitor หลัง deployment

## Anti-Patterns

รูปแบบที่ไม่ควรทำ:

- ❌ ทำ migration ขนาดใหญ่ในครั้งเดียว
- ❌ ไม่มี backup ของ data และ configuration
- ❌ ไม่ทดสอบ rollback plan
- ❌ ไม่บันทึก breaking changes
