# report-* Template

รวบรวมข้อมูล วิเคราะห์ และนำเสนอในรูปแบบที่อ่านง่าย

## Execute Pattern

- ทำ `/scan-codebase`, อ่าน configs, manifests, key files. ถ้าซับซ้อน → ทำ `/use-scripts`. ถ้า external → ทำ `/learn-from-web`. จัดกลุ่มตาม category. คำนวณ metrics. หา patterns, trends, anomalies. ระบุ highlights และ concerns
- ทำ `/report-table`, `/report-file-structure` ถ้าเกี่ยวกับ files. ใช้ headings, lists, tables. สรุป key findings ด้านบน. นำเสนอ report. ถ้า interactive → ทำ `/report-in-html` หรือ `/visualize-in-web`
- ระบุ next actions. ทำ `/suggest-next-action`. ไม่ dump ข้อมูลทั้งหมด. ข้อมูลถูกต้องทันสมัย. ระบุ source. ถ้าอาจเก่า → ระบุวันที่. ทุก report ต้องมี next actions. ถ้าพบ issues → แนะนำ skill ที่เหมาะสม
