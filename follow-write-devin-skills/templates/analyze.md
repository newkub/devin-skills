# analyze-* Template

วิเคราะห์ codebase ด้วย scripts, tools และหลายมิติ

## Execute Pattern

- ทำ `/scan-codebase`, อ่าน manifests, configs, key files. ถ้าซับซ้อน → ทำ `/use-scripts`. ถ้าข้อมูลไม่พอ → ทำ `/deep-analyze`. วิเคราะห์ structure, dependencies, patterns. ระบุ strengths, weaknesses, gaps. หา root causes. จัดกลุ่ม findings ตาม category
- ทำ `/report-markdown-table`. จัดลำดับ findings ตาม impact. ระบุ evidence. ทำ `/suggest-next-action`. ทุก finding ต้องมี evidence. ถ้าเป็น assumption → ระบุชัดเจน. ใช้ ast-grep สำหรับ structural analysis. ใช้ review CLI สำหรับ project review
- ครอบคลุมทุก workspaces. ไม่ข้าม dependencies และ configs. รวม external references ถ้าเกี่ยวข้อง
