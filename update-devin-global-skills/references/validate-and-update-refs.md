# Validate And Update References

## Goal

skill ผ่านเกณฑ์ทั้งหมด

## Steps

1. ทำ `/review-devin-global-skills` เพื่อตรวจ conventions, naming, structure
2. ทำ `/deep-validate` เพื่อตรวจ frontmatter, sections, ความยาว, `related` missing/unused, TODO/MOCK/placeholder
3. ทำ `/check-circular-dependencies` ถ้ามีการแก้ `related`
4. ทำ `/update-references` เพื่อ sync references ทั่ว repo
5. ทำ `/use-related-skills` เพื่อหา skills อื่นที่ควร integrate หรือขยายจาก skill ใหม่/อัปเดต
6. อัปเดต `AGENTS.md` ถ้ามีการ rename หรือย้าย skill
7. ถ้า skill เกี่ยวข้องกับ global rules → อัปเดต `global_rules.md` และ `/update-devin-global-rules`
8. ถ้าไม่ผ่าน → แก้และ recheck (max 3 รอบ → stop และ report)
