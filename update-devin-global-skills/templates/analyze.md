# analyze-* Template

ให้ agents ลอง analyze codebase เองก่อน แล้วค่อยใช้ scripts ถ้าข้อมูลไม่พอ

## Execute Pattern

- ทำ `/scan-codebase`, อ่าน manifests, configs, key files ด้วย agent. ให้ agent วิเคราะห์ structure, dependencies, patterns, strengths, weaknesses, gaps, และ root causes เองก่อน
- ถ้าข้อมูลไม่เพียงพอ หรือต้องการ cross-check หลายมิติ → ทำ `/deep-analyze`
- ถ้าซับซ้อนหรือต้องการ repeatable analysis → ค่อยทำ `/use-scripts` เป็น helper สำหรับ agent ไม่ใช่แทนที่ agent analysis
- ทำ `/report-table`. จัดลำดับ findings ตาม impact. ระบุ evidence. ทำ `/suggest-next-action`. ทุก finding ต้องมี evidence. ถ้าเป็น assumption → ระบุชัดเจน. ใช้ ast-grep สำหรับ structural analysis. ใช้ review CLI สำหรับ project review
- ครอบคลุมทุก workspaces. ไม่ข้าม dependencies และ configs. รวม external references ถ้าเกี่ยวข้อง
