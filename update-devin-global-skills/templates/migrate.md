# migrate-* Template

ย้ายจาก tool/library/version/pattern หนึ่งไปอีกอันหนึ่งอย่างปลอดภัย — ต้อง rollback ได้และไม่ทำพร้อมกับงานอื่น

## Execute Pattern

- วางแผน migration ก่อน — ทำ `/plan`: ระบุ from→to, อ่าน official migration guide/breaking changes, map ทุกจุดที่กระทบ (ทำ `/deep-impact`, `scan-codebase`). เขียน rollback path ชัดเจนก่อนเริ่ม ถ้า data migration → backup ก่อนเสมอ
- migrate ทีละชั้น incremental — config → deps → code → data. ใช้ codemods/ast-grep (ทำ `/use-astgrep`, `/migration-by-astgrep`) แทน manual edit เมื่อมี. ห้ามผสม migration กับ feature work ใน commit เดียว — แยก commit ต่อ step ให้ bisect ได้
- verify หลัง migrate — lint/typecheck/tests ผ่านทั้งหมด, runtime smoke test, เช็ค deprecated APIs เหลือด้วย `/check-deprecated-apis`. ถ้าค้าง → สร้าง TODO list ชัดเจน. เสร็จ → `/report-before-after` แล้ว `/ship`
