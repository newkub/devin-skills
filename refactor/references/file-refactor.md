# File Refactor

## Goal

แก้ไขไฟล์ทีระบุให้มี SRP, naming, structure, style ทีดีขึ้น

## Steps

1. อ่านแต่ละไฟล์ใน `@files...`
2. ทำ `/review-quality` เพื่อหา issues เฉพาะไฟล์
3. ทำ `/review-readability` ถ้าไฟล์อ่านยาก
4. บันทึก baseline: responsibilities, imports, exports, public API
5. ระบุ action ทีเหมาะสม:
   - ไฟล์ยาว >250 บรรทัด หรือหลาย responsibility → ทำ SRP refactor
   - ไฟล์อยู่ในตำแหน่งไม่เหมาะสม → ทำ `/relocation`
   - imports/exports ซับซ้อน → ทำ `/review-architecture`
   - naming/style issues → แก้ไขเฉพาะจุด
   - dead code หรือ unused exports → ลบ
6. แก้ไขไฟล์ทีระบุให้สอดคล้องกับ findings
7. ถ้า split ไฟล์ → ทำ SRP refactor
8. รักษา public API ถ้าไม่จำเป็นต้องเปลี่ยน
9. แก้ไขน้อยที่สุด เฉพาะจุดทีจำเป็น
