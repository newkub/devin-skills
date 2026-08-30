# Refactor Guide

## Plan Refactor

### Categories

- Split: skill เกิน 250 บรรทัดหรือหลาย responsibilities
- Merge: skill คู่มี scope ซ้อนทับหรือเนื้อหาซ้ำ
- Restructure: ตรวจลำดับ sections รวม steps ลดไม่เกิน 10
- Deduplicate: แทนที่ซ้ำด้วย references ใช้ `related` สำหรับ dependencies
- Relocate: ย้าย skills ไปยังตำแหน่งที่สอดคล้องกับ prefix

### Priority

- High redundancy ก่อน
- Large files ก่อน
- Broken structure ก่อน
- พิจารณา change frequency และ usage patterns — ไม่ over-refactor

## Execute Refactor

1. Split: แยก skill เกิน 250 บรรทัดหรือหลาย responsibilities แต่ละ skill มี SRP ชัดเจน
2. Merge: รวม skill คู่ที่ scope ซ้อนทับหรือเนื้อหาซ้ำ รักษา intent เดิม ลบ skill ที่ถูกรวม
3. Restructure: ตรวจลำดับ sections รวม steps ลด steps ไม่เกิน 10
4. Deduplicate: แทนที่เนื้อหาซ้ำด้วย references ไปยัง skill ต้นทาง
5. Relocate: ทำ `/relocation` เพื่อย้าย skills ไปยังตำแหน่งที่สอดคล้องกับ prefix
6. ถ้าสร้าง sub-skills ใหม่ → ทำ `/update-devin-global-skills` สำหรับแต่ละ sub-skill

## Cross-Skill Consistency

1. ทำ `/review-consistency` เพื่อตรวจภาษา, format, terminology, frontmatter ข้าม skill
2. ทำ `/review-redundancy` เพื่อลบเนื้อหาซ้ำซ้อนข้าม skill
3. ทำ `/update-references` หลังการรวม/แยก/ย้าย skill หรือ sections
4. ยืนยันไม่มี broken references และ bidirectional references ครบ
