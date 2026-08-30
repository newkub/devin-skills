---
name: create-social-cover-image
description: สร้าง cover image สำหรับ social media ตามขนาดและแบรนด์ของแต่ละ platform
argument-hint: "[platform] [topic]"
related:
  - gen-ai-images
  - draw-svg-image
  - follow-design-system
  - report-table
  - create-video-story
  - gen-image-character
  - enhance-prompt
---

## Goal

สร้าง cover image สำหรับ social media ทีตรงตามขนาด platform, brand identity, และเนื้อหาทีต้องการ

## Scope

- รองรับ Twitter/X, Facebook, LinkedIn, YouTube, Instagram เป็นหลัก
- กำหนด dimension ตาม platform
- ใช้ AI image generation หรือ SVG drawing
- รองรับใส่ text, logo, brand color
- ส่งออกเป้นไฟล์ภาพ

## Execute

### 1. Identify Platform And Topic

> Goal: ระบุ platform และเนื้อหา

1. รับ `platform` จาก argument (twitter, facebook, linkedin, youtube, instagram)
2. รับ `topic` หรือ headline ทีต้องการแสดงบน cover
3. ถ้าไม่ระบุ platform → ค่าเริ่มต้น `twitter`
4. ถ้า topic กำกวม → ใช้ `/enhance-prompt` หรือ `/ask-me`

### 2. Select Dimensions

> Goal: เลือกขนาด cover image ตาม platform

1. ใช้ `/report-table` แสดงตัวเลือก platform:
   - `twitter`: 1500 x 500 px (header)
   - `facebook`: 820 x 312 px (cover)
   - `linkedin`: 1584 x 396 px (cover)
   - `youtube`: 2560 x 1440 px (banner)
   - `instagram`: 1080 x 1080 px (post)
2. เลือกขนาดตาม platform ทีระบุ
3. เก็บ width, height, safe zone สำหรับ text

### 3. Design Concept

> Goal: วาง concept ของ cover image

1. ใช้ `/follow-design-system` เพื่อดึง brand colors, typography, logo ถ้ามี
2. กำหนด layout: background, foreground, text position
3. เลือก style: minimal, gradient, illustration, photo, abstract
4. ระบุ text หลัก, รอง, และ CTA (ถ้ามี)

### 4. Generate Background Image

> Goal: สร้าง background image

1. ถ้าใช้ AI generation → ใช้ `/gen-ai-images` ด้วย prompt เฉพาะ
2. ถ้าใช้ vector → ใช้ `/draw-svg-image`
3. ถ้าใช้ geometric → ใช้ `/draw-tldraw` หรือ `/draw-excalidraw`
4. Prompt ควรระบุ aspect ratio, style, และ mood

### 5. Add Text And Branding

> Goal: ใส่ text และ brand element

1. ใช้ `/draw-svg-image` หรือ image editing tool วาง text
2. จัดวาง headline ใน safe zone
3. ใส่ logo หรือ watermark ถ้ามี
4. ตรวจสอบ contrast และ readability
5. ถ้าไม่มี tool แก้ไขภาพ → ใช้ Python (Pillow) หรือ ImageMagick ผ่าน `use-scripts`

### 6. Export And Verify

> Goal: ส่งออกไฟล์ภาพและตรวจสอบ

1. บันทึกไฟล์ด้วยชื่อ `<platform>-cover-<topic>.png` หรือ `.jpg`
2. ตรวจสอบขนาดไฟล์และ dimension
3. ใช้ `/check-size` ดูขนาดไฟล์
4. แสดง preview ถ้าเป้นไปได้

### 7. Report

> Goal: สรุปผล

1. ใช้ `/report-table` แสดง platform, dimension, file path, file size
2. แนะนำการใช้งานบนแต่ละ platform
3. ถ้าต้องการ resize → ใช้ `/draw-svg-image` หรือ `use-scripts`

## Rules

### 1. Platform Dimensions

- ต้องตรง dimension ของ platform
- ระบุ safe zone สำหรับ text (ไม่ให้ถูก crop)
- ไฟล์ไม่ควรเกิน 5 MB สำหรับ social upload

### 2. Brand Consistency

- ใช้ `/follow-design-system` ถ้ามี brand guide
- ใช้ brand colors, fonts, logo
- ไม่ใส่ content ทีขัดแย้งกับ brand

### 3. Text Readability

- ใช้ font ขนาดใหญ่พออ่านได้บน mobile
- ไม่เกิน 2-3 บรรทัดข้อความหลัก
- contrast สูงพอ (light text บน dark bg หรือกลับกัน)

### 4. Copyright

- ไม่ใช้รูปหรือ font ทีมีลิขสิทธิ์โดยไม่ได้รับอนุญาต
- ถ้าใช้ AI generation ระบุแหล่งทีสร้าง
- ไม่สร้างเนื้อหาทีละเมิดเครื่องหมายการค้าหรือลิขสิทธิ์ของผู้อื่น

### 5. File Format

- ส่งออกเป้น `png` ถ้าต้องการ transparency
- ส่งออกเป้น `jpg` ถ้าต้องการขนาดไฟล์เล็ก
- สำหรับ web สามารถใช้ `webp` ได้

## Expected Outcome

- Cover image ทีตรงขนาด platform
- มี headline และ brand elements
- ไฟล์ส่งออกพร้อม path
- รายงาน dimension, file size, platform
- พร้อม upload ไปยัง social media
