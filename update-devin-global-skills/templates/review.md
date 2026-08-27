# review-* Template

วิเคราะห์ quality พร้อม severity ratings และ review score

## Execute Pattern

- ระบุ review target. อ่าน configs, dependencies. ทำ `/scan-codebase`. ถ้า web project → เพิ่ม `/run-dev`. ทำ `/deep-analyze`. ทำ `/update-review-codebase-cli-and-run` (เรียก `/update-project-rules` ภายใน). รัน `bunx ast-grep scan --inspect summary`. รัน `bun --filter tools-review-codebase review-codebase:json`. จับ findings พร้อม evidence
- ทำ `/run-review` เพื่อดึง review report พร้อม metrics. ทำ `/deep-validate`. cross-check evidence (file, line, code). กรอง false positives. ถ้าซ้อนทับ → อ้างอิงแทน. ถ้านอก scope → info เท่านั้น. Severity: Critical, High, Medium, Low, Info. review score = weighted average (Critical=0, High=25, Medium=50, Low=75, Info=100). จัดลำดับตาม severity
- แนะนำ fix หรือ skill. จัดกลุ่ม: immediate, short-term, long-term. ระบุ estimated effort. ทำ `/report-review`, `/report-table`. ทำ `/realize-implementation` เพื่อตรวจ implementation completeness. ถ้าพบ incomplete → เพิ่มเป็น findings. รายงานทั้ง strengths และ weaknesses. ห้ามใช้ bold markers. ใช้ backticks สำหรับ emphasis. รายงานเป็นตารางด้วย `/report-table`
