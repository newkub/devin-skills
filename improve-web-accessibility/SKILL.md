---
name: improve-web-accessibility
description: ตรวจสอบ accessibility ตามมาตรฐาน WCAG
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
related: []
---

## Goal

ตรวจสอบ accessibility ตามมาตรฐาน WCAG เพื่อให้ทุกคนใช้งานได้

## Scope

Use `check-accessibility` for the specific tasks and workflows it covers

## Execute

### 1. Check Keyboard Navigation
> Goal: Check Keyboard Navigation

1. ทดสอบ navigation ด้วย keyboard เท่านั้น
2. ตรวจสอบ tab order ที่เหมาะสม
3. ตรวจสอบ focus indicators ชัดเจน
4. ทดสอบ keyboard shortcuts

### 2. Check Screen Reader
> Goal: Check Screen Reader

1. ทดสอบด้วย screen reader (NVDA, JAWS, VoiceOver)
2. ตรวจสอบ ARIA labels และ roles
3. ตรวจสอบ alt text สำหรับ images
4. ตรวจสอบ semantic HTML

### 3. Check Color Contrast
> Goal: Check Color Contrast

1. ตรวจสอบ contrast ratio ตาม WCAG AA/AAA
2. ใช้ tools เช่น axe DevTools, Lighthouse
3. ตรวจสอบว่าไม่ใช้สีเพียงอย่างเดียวในการสื่อความหมาย
4. ตรวจสอบ text กับ background contrast

### 4. Check Forms
> Goal: Check Forms

1. ตรวจสอบ form labels ชัดเจน
2. ตรวจสอบ error messages สามารถเข้าถึงได้
3. ตรวจสอบ validation messages
4. ตรวจสอบ form controls สามารถใช้ keyboard ได้

### 5. Check Media
> Goal: Check Media

1. ตรวจสอบ captions สำหรับ videos
2. ตรวจสอบ audio descriptions
3. ตรวจสอบ autoplay ไม่รบกวน
4. ตรวจสอบ controls สามารถ pause ได้

### 6. Run Automated Tests
> Goal: Run Automated Tests

1. รัน accessibility audit tools
2. ตรวจสอบ automated violations
3. แก้ไข issues ที่พบ
4. ทำ manual testing สำหรับสิ่งที่ automated ไม่ตรวจได้

## Rules

### 1. WCAG Compliance

- ตรวจสอบตาม WCAG 2.1 AA ขั้นต่ำ
- พิจารณา AAA สำหรับ critical applications
- ตรวจสอบทั้ง Perceivable, Operable, Understandable, Robust

### 2. Testing Scope

- ทดสอบด้วย keyboard เสมอ
- ทดสอบด้วย screen reader
- ทดสอบด้วย zoom tools
- ทดสอบด้วย color blindness simulators

### 3. Priority Levels

- Critical: ขัดขวางการใช้งานอย่างสิ้นเชิง
- High: ทำให้ใช้งานยากอย่างมาก
- Medium: ทำให้ใช้งานยากเล็กน้อย
- Low: เป็น best practices

## Expected Outcome

- Accessibility ผ่าน WCAG AA ขั้นต่ำ
- Keyboard navigation ทำงานได้
- Screen reader สามารถใช้งานได้
- Color contrast ผ่านมาตรฐาน
- Forms สามารถใช้งานได้โดยทุกคน
