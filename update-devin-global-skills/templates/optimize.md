# optimize-* Template

ปรับปรุง performance, bundle size, cost หรือ resource usage ของสิ่งที่มีอยู่แล้ว — ต้องวัดผลก่อนและหลัง

## Execute Pattern

- baseline ก่อนเสมอ — ทำ `/run-bench`, `/check-size`, หรือ `/report-bundle` เพื่อเก็บตัวเลขเดิม. ระบุ bottleneck จริงด้วย profiling ห้ามเดา ทำ `/deep-optimize` หรือ `/check-bottlenecks` ก่อนแก้
- แก้ทีละจุดเรียง impact มาก → น้อย — algorithm/complexity ก่อน micro-optimizations, config/flags ก่อน rewrite. ห้ามแก้หลายจุดพร้อมกันถ้าแยกผลไม่ได้. preserve behavior ทุกครั้ง — optimize ≠ เปลี่ยน output
- วัดซ้ำหลังแก้และ compare กับ baseline — report ตัวเลขก่อน/หลัง (ใช้ `/report-before-after`). ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report. ผ่าน → `/ship`
