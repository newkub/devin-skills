---
name: follow-incident-triage
description: จัดลำดับความสำคัญของ incident และกำหนด action ที่เหมาะสม
---

## Goal

จัดลำดับความสำคัญของ incident และกำหนด action ที่เหมาะสมตามความรุนแรงและผลกระทบ

## Execute

### 1. Assess Severity

ประเมินความรุนแรงของ incident ตามผลกระทบต่อผู้ใช้และระบบ

- Critical: ระบบหยุดทำงานทั้งหมด หรือ data loss
- High: ฟีเจอร์หลักใช้งานไม่ได้ แต่ระบบยังทำงาน
- Medium: ฟีเจอร์รองใช้งานไม่ได้ หรือ performance ลดลงมาก
- Low: UI glitch หรือปัญหาเล็กน้อยที่ไม่กระทบการใช้งานหลัก

### 2. Determine Impact

ประเมินผลกระทบต่อผู้ใช้และธุรกิจ

- จำนวนผู้ใช้ที่ได้รับผลกระทบ
- ระยะเวลาที่เกิดปัญหา
- ผลกระทบทางธุรกิจ (revenue, reputation, compliance)

### 3. Assign Priority

กำหนด priority ตาม severity และ impact

| Severity | Impact | Priority | Response Time |
|----------|--------|----------|---------------|
| Critical | High    | P0       | 15 min        |
| Critical | Medium  | P0       | 30 min        |
| High     | High    | P1       | 1 hour        |
| High     | Medium  | P1       | 2 hours       |
| Medium   | High    | P2       | 4 hours       |
| Medium   | Medium  | P2       | 8 hours       |
| Low      | Any     | P3       | 24 hours      |

### 4. Assign Owner

มอบหมายผู้รับผิดชอบตามประเภทของ incident

- P0-P1: Senior engineer หรือ on-call engineer
- P2: Engineer ที่มีความเชี่ยวชาญใน domain นั้น
- P3: ทีมที่เกี่ยวข้องสามารถจัดการได้

### 5. Define Action Plan

กำหนด action plan ตาม priority

- P0: ทำ `/debug-issue` ทันที แล้วทำ `/resolve-errors`
- P1: ทำ `/debug-issue` ภายใน 1 ชั่วโมง
- P2: ทำ `/debug-issue` ภายใน 4 ชั่วโมง
- P3: ทำ `/debug-issue` ภายใน 24 ชั่วโมง

### 6. Communicate

สื่อสารสถานะแก่ stakeholder ตาม priority

- P0-P1: แจ้งทันที อัพเดททุก 15-30 นาที
- P2: แจ้งภายใน 1 ชั่วโมง อัพเดททุก 2 ชั่วโมง
- P3: แจ้งใน next standup หรือ scheduled update

## Rules

### 1. Severity Classification

ใช้เกณฑ์ที่ชัดเจนในการจัดประเภท severity

- Critical: ระบบหยุดทำงานทั้งหมด หรือ data loss
- High: ฟีเจอร์หลักใช้งานไม่ได้
- Medium: ฟีเจอร์รองใช้งานไม่ได้ หรือ performance ลดลง
- Low: UI glitch หรือปัญหาเล็กน้อย

### 2. Priority Matrix

ใช้ matrix ในการกำหนด priority ตาม severity และ impact

- P0: Critical + High/Medium impact
- P1: High + High/Medium impact
- P2: Medium + High/Medium impact
- P3: Low + Any impact

### 3. Response Time SLA

กำหนด response time ตาม priority

- P0: 15-30 min
- P1: 1-2 hours
- P2: 4-8 hours
- P3: 24 hours

### 4. Communication Protocol

สื่อสารตาม priority และ severity

- P0-P1: Real-time communication
- P2: Scheduled updates
- P3: Next scheduled meeting

## Expected Outcome

- Incident ถูกจัดลำดับความสำคัญอย่างถูกต้อง
- Action plan ชัดเจนและเหมาะสม
- Stakeholder ได้รับการแจ้งเตือนตามเวลา
- Owner ได้รับมอบหมายอย่างชัดเจน
