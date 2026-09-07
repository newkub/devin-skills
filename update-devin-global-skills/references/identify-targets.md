# Identify Targets

## Goal

รู้ว่าต้องสร้าง อัปเดต หรือ refactor skill ใด

## Steps

1. รับ `@files...` หรือ `topic` จาก argument หรือ context
2. ถ้าไม่มี `@files` → ทำ bulk orchestration ตาม [references/bulk-update.md](references/bulk-update.md)
3. ถ้ามี `@files` → อัปเดตเฉพาะ skill ที่ระบุ
4. ถ้า `SKILL.md` ยังไม่มี → ส่งต่อ `/new-skills`
5. ถ้าชื่อไม่ชัด → ทำ `/ask-me` ก่อนดำเนินการ
6. ทำ `/use-related-skills` และ `/follow-skills-map` เพื่อหากลุ่ม skills ที่เกี่ยวข้อง
