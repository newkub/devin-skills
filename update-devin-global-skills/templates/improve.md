# improve-* Template

ปรับปรุงคุณภาพของสิ่งที่มีอยู่ — code quality, DX, UX, docs — ไม่ใช่ bug fix และไม่ใช่ feature ใหม่

## Execute Pattern

- review ก่อนปรับปรุงเสมอ — ทำ `/review-*` หรือ `/check-*` ที่ตรง domain เพื่อหา improvement targets จริง ห้ามเดา. เก็บ list ของ improvements พร้อม priority
- apply ทีละ improvement เรียง priority — preserve behavior ทุกครั้ง ไม่ผสม refactor กับ behavior change ใน commit เดียว. ถ้า scope ใหญ่ → ทำ `/use-subagents` หรือแยก commits
- verify หลังแต่ละ improvement — รัน lint/typecheck/tests ที่มี. ถ้า tests เดิม fail จาก behavior เดิม → ตรวจว่า improvement ผิดหรือ test ต้องอัปเดตจริง แล้ว `/resolve-errors`. เสร็จ → `/report` สรุปสิ่งที่ดีขึ้น
