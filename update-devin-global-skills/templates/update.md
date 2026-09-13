# update-* Template

อัปเดตไฟล์/docs/config/dependency ที่มีอยู่ให้ทันสมัย โดย preserve intent เดิม

## Execute Pattern

- อ่านของเดิมก่อนเสมอ — เข้าใจ intent และ format ปัจจุบัน ห้าม rewrite ทั้งไฟล์ถ้า diff เล็ก. ถ้าเนื้อหาเชื่อมกับ source อื่น (code, schema, API) → ตรวจ source นั้นก่อนเขียน
- อัปเดตแบบ minimal + idempotent — เปลี่ยนเฉพาะส่วนที่ต่างจาก current state; รันซ้ำต้องไม่เกิด side effects. อัปเดต references ที่เกี่ยวข้องด้วย (`/update-references` ถ้า move/rename/delete)
- verify — diff before/after ให้ user เห็น, ตรวจว่า links/refs ยังใช้ได้, ถ้าเป็น docs → ไม่มี stale commands/versions. ผ่าน → report ด้วย `/report-before-after`

