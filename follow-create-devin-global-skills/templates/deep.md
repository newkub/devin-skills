# deep-* Template

วิเคราะห์หลายมิติอย่างลึกซึ้ง พร้อม cross-reference

## Execute Pattern

- ระบุ target, dimensions (architecture, performance, security, maintainability), criteria. ถ้า target ไม่ชัด → ทำ `/ask-me`. ทำ `/deep-research`, `/learn-from-web`, `/check-reference`. ถ้าข้อมูลไม่พอ → ระบุความไม่แน่นอน
- ทำ `/deep-analyze` สำหรับแต่ละ dimension. จับ findings พร้อม evidence (file, line, code, metric). ระบุ root cause. ถ้า analysis ยาว → ทำ `/follow-context-engineering` เพื่อ review context rot. หา findings ที่ซ้ำซ้อนระหว่าง dimensions. หา root causes ที่ส่งผลต่อหลาย dimensions. จัดกลุ่ม. ระบุ dependencies ระหว่าง issues
- ทำ `/report-table`. จัดลำดับตาม impact และ effort. ระบุ immediate และ long-term actions. ทำ `/suggest-next-action`. วิเคราะห์ให้ลึก. ถ้าไม่แน่ใจ → ค้นคว้าเพิ่ม. ระบุ assumptions. ทุก finding ต้องมี evidence. ถ้าเป็น opinion → ระบุ. ครบทุก dimensions. ถ้า dimension ไม่มี findings → ระบุ "no issues". ไม่ข้าม dimensions
