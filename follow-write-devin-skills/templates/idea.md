# idea-* Template

สร้างไอเดีย วิเคราะห์ gaps และ opportunities พร้อม continuous numbering

## Execute Pattern

- ทำ `/deep-analyze`. ทำ `/bench-competitors` ถ้าต้องเปรียบเทียบ. อ่าน feedback, issues, requests. ระบุ constraints (timeline, budget, team size). วิเคราะห์ gaps (missing features, UX issues, bottlenecks). ระบุ opportunities (trends, pain points, advantages). จัดกลุ่ม. จัดลำดับตาม impact และ feasibility
- สร้างไอเดียพร้อม continuous numbering (ไม่ต่อจากเดิมถ้ามีอยู่แล้ว). ระบุ scope (quick win, short-term, long-term), impact, effort. ทำ `/report-table`. คอลัมน์: number, idea, category, impact, effort, scope. จัดลำดับตาม impact/effort ratio
- ทบทวนกับ stakeholders. รวม/แยกไอเดีย. ระบุ dependencies และ prerequisites. ทำ `/suggest-next-action`. ทุกไอเดียต้อง actionable. ถ้าซับซ้อน → แบ่งเป็น sub-ideas. ไม่ reset numbering ระหว่าง runs. เก็บไอเดียเดิมไว้ ไม่ลบ. ทุกไอเดียต้องมีพื้นฐานจาก analysis. ระบุ gap หรือ opportunity ที่ตอบ. ไม่เสนอไอเดียซับซ้อนเกินจำเป็น. ถ้าต้อง refactor ใหญ่ → ระบุเป็น long-term. ทำ `/dont-over-engineer`
