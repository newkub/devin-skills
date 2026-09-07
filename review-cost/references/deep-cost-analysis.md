# Deep Cost Analysis

(merged from: deep-cost-analysis)

ใช้เมื่อต้องวิเคราะห์ cost structure เชิงลึก — ไม่ใช่แค่ดู bill แต่เข้าใจ cost drivers, unit economics และ cost ที่จะโตตาม scale

## Execute

### 1. Inventory Cost Sources

> Goal: map ทุกอย่างที่เสียเงิน

1. รวมบริการ: hosting (Cloudflare/Vercel/Railway/AWS), DB, storage, CDN, third-party APIs, LLM usage, CI/CD, email/SMS services
2. ดึงข้อมูลจริงถ้าเข้าถึงได้: bills, usage dashboards, billing APIs
3. ถ้าไม่มี access → สร้าง cost model จาก architecture + pricing pages โดยระบุว่าเป็น estimate

### 2. Build Cost Model

> Goal: เข้าใจ cost function ของระบบ

1. แยก fixed vs variable costs ต่อ service
2. ระบุ unit economics: cost per user/request/GB — metric ที่ scale กับ usage
3. หา drivers หลัก: อะไรที่ทำให้ bill โต (egress? API calls? token volume? always-on compute?)

### 3. Project At Scale

> Goal: model cost ที่ usage สูงขึ้น

1. คำนวณ cost ที่ 10x, 100x current usage — อะไรโต linear vs superlinear
2. flag: free tiers ที่จะหลุด, rate limits ที่บังคับ paid plans, egress ที่โตเร็ว
3. ระบุ inflection points: usage ระดับไหนที่ architecture ปัจจุบันไม่คุ้ม

### 4. Identify Optimization Levers

> Goal: หาจุดที่ลด cost ได้จริง

1. เรียง levers ตาม savings potential: idle resources, oversized instances, missing caching, chatty APIs, uncompressed transfer, expensive service ที่มีทางเลือก
2. เทียบกับ effort — quick wins vs architectural changes
3. เชื่อมไป section `## Fix` ของ `/review-cost` และ `/review-performance` ตาม domain

### 5. Report

> Goal: cost analysis ที่ decision-ready

1. ใช้ `/report`: `No.`, `Cost Source`, `Current`, `Driver`, `At 10x`, `Lever`, `Savings Est.`
2. ระบุ data quality: actual vs estimated พร้อม assumptions
3. สรุป: top 3 levers + inflection risks + recommended actions

## Rules

- แยกตัวเลขจริงจาก estimates ชัดเจน — ทุก estimate ต้องมี assumption
- ไม่มี access ข้อมูลจริง → บอกความไม่แน่นอน ไม่แสร้งความแม่น
- ไม่เปลี่ยน infra/services — รายงานแล้วให้ section `## Fix` ทำ
- cost optimization ต้องไม่ทำ reliability/security เสีย — ระบุ trade-off เสมอ
- cheapest ≠ best — รวม operational cost (maintenance, lock-in) ใน analysis
