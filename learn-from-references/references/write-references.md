# Write References

เขียน reference files จริงเมื่อถูกเรียกเพื่อ dependency ของ skill (บังคับ ห้ามข้าม)

## 1. Write Reference Files

1. ตรวจ context การเรียก: ถ้าถูกเรียกจาก `/update-devin-global-skills` หรือ skill ที่มี dependencies → ต้องเขียน reference files จริง ไม่ใช่แค่ research
2. ระบุ target `references/` directory ของ skill ที่เรียก (เช่น `<skill-dir>/references/<dep>.md`)
3. เขียน reference file สำหรับทุก dependency ที่ research ครอบคลุม โดยแต่ละไฟล์ต้องมีอย่างน้อย: install command จริง, version ที่ stable, peer dependencies, configuration examples, code examples จาก official docs, และ source URL
4. ใช้ข้อมูลจาก Knowledge Extraction เป็นเนื้อหา reference — ห้ามใช้ placeholder หรือ TODO ทุก code example ต้องมาจาก official docs จริง
5. ตรวจว่าทุกไฟล์ไม่เกิน 250 บรรทัด — ถ้าเกิน → แบ่งเป็น sub-files (เช่น `references/<dep>/api.md`, `references/<dep>/config.md`)
6. ถ้า library มี CLI → เขียน `references/<dep>/cli.md` แยก — ถ้ามี components/API หลายส่วน → เขียน `references/<dep>/api/` แยกตามส่วน
7. หลังเขียน → ทำ `/check-reference` เพื่อยืนยันว่า reference มีอยู่จริงและเนื้อหาครบถ้วน
8. ถ้าเขียน reference ไม่สำเร็จ → stop และ report ไม่ผ่านการ validate ของ `/update-devin-global-skills`

## 2. Extract Website Routes

สร้าง route reference สำหรับ website project เมื่อจำเป็น:

1. ถ้า skill หรือ project มี dependencies กับ website framework/library/tool → ทำ `/report-uxui-all-routes`
2. ระบุ framework จาก `package.json` ก่อน
3. รวบรวม page routes, API routes, redirects, catch-all, dynamic segments และ auth-required routes
4. จัดกลุ่ม routes ตาม feature/module (auth, billing, settings, admin)
5. หา patterns ที่ซ้ำ เช่น nested resources `/resource/:id/subresource`
6. สร้างหรืออัปเดต `references/routes.md` ใน project หรือ skill directory
7. ใช้ sections: `## Page Routes`, `## API Routes`, `## Dynamic Patterns`, `## Authentication Required`
8. ไม่รวม test routes หรือ mock routes ยกเว้นระบุชัดเจน
9. ทำ `/check-reference` เพื่อตรวจ broken links
