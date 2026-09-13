# Validate And Update References

## Goal

skill ผ่านเกณฑ์ทั้งหมด

## Steps

1. ทำ `/review-devin-global-harness` เพื่อตรวจ conventions, naming, structure
2. ทำ `/check-correctness` เพื่อ verify ว่า commands/APIs/claims ใน skill ถูกต้องตามจริง
3. ทำ `/think-reframe` เมื่อ skill ใหม่หรือ rewrite ใหญ่ — เช็คว่า frame/มุมที่เขียนเหมาะสมก่อน finalize
4. ทำ `/deep-validate` เพื่อตรวจ frontmatter, sections, ความยาว, `related` missing/unused, TODO/MOCK/placeholder
5. ทำ `/check-repo-hygiene circular-dependencies` ถ้ามีการแก้ `related`
6. ทำ `/update-references` เพื่อ sync references ทั่ว repo
7. ทำ `/use-related-skills` เพื่อหา skills อื่นที่ควร integrate หรือขยายจาก skill ใหม่/อัปเดต
8. อัปเดต `AGENTS.md` ถ้ามีการ rename หรือย้าย skill
9. ถ้า skill เกี่ยวข้องกับ global rules → อัปเดต `global_rules.md` และ `/update-devin-global-rules`
10. ถ้าไม่ผ่าน → แก้และ recheck (max 3 รอบ → stop และ report)
