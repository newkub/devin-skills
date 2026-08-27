## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี EU users → ข้าม Section 2
- ถ้า project ไม่มี California users → ข้าม Section 3
- ถ้า project ไม่มี health data → ข้าม Section 4
- ถ้า project ไม่มี payment processing → ข้าม Section 5
- ถ้า project ไม่ใช่ SaaS → ข้าม Section 6
- ถ้า project ไม่มี Thailand users หรือไม่อยู่ในเขต PDPA → ข้าม Section 7
- ถ้า project ไม่มี consent collection → ข้าม Section 8
- ถ้า project ไม่มี cross-border transfer → ข้าม Section 12

### 2. Severity Classification

- Critical: no lawful basis, no consent mechanism, no DSAR process, CVV storage, unencrypted PHI, no audit log on data access, no retention policy, no transfer mechanism, no breach notification, no sensitive data protection (PDPA Section 26), no privacy notice (PDPA Section 23)
- High: missing consent withdrawal, missing MFA for CDE, incomplete DSAR, no DPIA, missing BAA, no anomaly detection, no legal hold, missing SCC, no DPA with processor (PDPA), no DPO when required (PDPA), no minor protection (PDPA Section 20)
- Medium: incomplete privacy policy, inconsistent consent record, missing retention documentation, suboptimal audit review
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ regulation, article, control, data category, หรือ process ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ซ้ำกับ `/review-security` — ใช้ workflow นั้นสำหรับ security controls
- ไม่ซ้ำกับ `/review-delivery` Section 15 — ใช้ workflow นี้สำหรับ compliance เชิงลึก
- ใช้ `/roleplay-compliance-officer` สำหรับ perspective-based review

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
