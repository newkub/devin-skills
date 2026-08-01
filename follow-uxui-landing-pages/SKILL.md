---
name: follow-uxui-landing-pages
description: ออกแบบ UX/UI สำหรับ landing pages เน้น conversion, performance และ responsive
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-uxui
  - review-uxui
  - follow-uxui-interaction
  - follow-uxui-accessibility
  - follow-uxui-animation
  - report-format-table
  - suggest-next-action
---

## Goal

สร้าง landing page UX/UI ที่ convert สูง โหลดเร็ว mobile-first และสื่อสาร value ชัดเจน

## Scope

ใช้สำหรับหน้าแรก, marketing pages, subdomain pages, และ promotional landing ไม่รวม authenticated dashboard

## Execute

### 1. Analyze Landing Context

วิเคราะห์ landing page ที่ต้องการ

> Goal: เข้าใจ audience, goal, และ existing patterns

1. ทำ `/scan-codebase` เพื่อหา landing routes เช่น `index.tsx`, `about`, `pricing`, `blog`
2. ระบุ primary CTA ของแต่ละ landing page
3. ระบุ traffic source: organic, ads, referral, subdomain
4. ทำ `/follow-uxui` เพื่อเลือก skill ย่อยที่เหมาะสม

### 2. Design Hero Section

ออกแบบ hero สำหรับ first impression

> Goal: สื่อ value proposition ใน 3 วินาที

1. ใช้ headline สั้น ชัดเจน เน้น benefit
2. ใช้ subheadline 1-2 ประโยคอธิบาย how it works
3. CTA primary สีโดดเด่น action verb ชัดเจน
4. CTA secondary สำหรับผู้ใช้ที่ยังสนใจน้อยกว่า
5. ใช้ social proof ใต้ CTA เช่น stars, trust badges, customer count
6. ใช้ visual สนับสนุน ไม่ distract จาก CTA

### 3. Design Feature And Benefits Sections

ออกแบบ feature showcase

> Goal: ผู้ใช้เข้าใจว่าได้อะไร

1. ใช้ bento grid หรือ card grid 3-6 cards
2. แต่ละ card มี icon, title, short description
3. ใช้ visual หรือ screenshot แทน placeholder
4. จัดลำดับ feature ตาม priority ของ audience
5. ใช้ headings เพื่อ scannability

### 4. Design Trust And Conversion Sections

เพิ่ม credibility และ conversion

> Goal: ลดความกังวล กระตุ้น action

1. แสดง testimonials หรือ logos ของลูกค้า
2. ใช้ stats ที่วัดผลได้ เช่น "ลด no-shows 80%"
3. ใช้ FAQ section สำหรับ common objections
4. CTA section ซ้ำด้านล่างพร้อม urgency ถ้าเหมาะสม
5. ระบุ risk reversal เช่น free trial, no credit card, money-back

### 5. Optimize Performance And SEO

ปรับ performance และ SEO

> Goal: โหลดเร็ว ค้นหาเจอ และ core web vitals ผ่าน

1. ใช้ lazy loading สำหรับ below-the-fold images
2. ใช้ responsive images ด้วย `srcset` หรือ image CDN
3. ใส่ meta tags, Open Graph, JSON-LD structured data
4. ใช้ canonical URL และ hreflang ถ้ามีหลายภาษา
5. ตรวจ Core Web Vitals: LCP, INP, CLS
6. ลด JS bundle ด้วย code splitting และ island architecture ถ้ามี

### 6. Responsive And Accessibility

ตรวจ responsive และ a11y

> Goal: ใช้งานได้ทุก device ทุกความสามารถ

1. ทำ mobile-first layout ก่อน จากนั้น tablet/desktop
2. ระบุ touch target ขั้นต่ำ 44x44px
3. ทำ `/check-accessibility` เพื่อตรวจ WCAG
4. ใช้ semantic heading hierarchy
5. รองรับ `prefers-reduced-motion`
6. ทดสอบ contrast สำหรับ text บน gradient background

## Rules

### 1. One Primary Goal

- หน้า landing มี CTA หลักหนึ่งเดียว
- secondary CTA ไม่่แย่ง attention จาก CTA หลัก
- หลีกเลี่ยง navigation ที่พาผู้ใช้ออกจาก CTA

### 2. Clarity Over Cleverness

- headline อ่านแล้วเข้าใจทันที ไม่่ใช้ slang
- ใช้ bullet points หรือ icons แทนบล็อกข้อความยาว
- ทุก section ตอบคำถาม "ทำไมต้องสนใจ"

### 3. Visual Hierarchy

- ขนาด font แสดง importance
- ใช้ whitespace แยก section
- CTA ต้องเด่นทีสุดในหน้า

### 4. Performance Budget

- LCP ไม่่เกิน 2.5s
- CLS ไม่่เกิน 0.1
- ไม่่โหลด third-party scripts ทีไม่่จำเป็น

### 5. CTA Consistency

- ปุ่ม primary ใช้สีเดียวกันทั่วหน้า
- action ต้องชัดเจน เช่น "เริ่มทดลองฟรี" ไม่่ใช่ "ส่ง"
- ลิงก์ secondary ต้องกดได้ง่ายบน mobile

## Expected Outcome

- Landing page มี hero, features, trust, CTA ที่ convert
- Mobile-first responsive ชัดเจน
- Performance + SEO ผ่าน benchmarks
- ผ่าน accessibility checks
