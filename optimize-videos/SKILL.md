---
name: optimize-videos
description: Optimize video delivery — compression, formats, poster frames และ lazy loading
argument-hint: "[path-or-page]"
related:
  - optimize-web-vitals
  - report-before-after
---

## Goal

ลด cost ของ video content — file size, bandwidth, LCP impact และ playback overhead — ด้วย compression, modern formats, poster frames และ lazy loading

## Scope

- ตรวจ video usage: `<video>` tags, background videos, hero videos, embedded media
- ครอบคลุม: encoding (H.264/H.265/AV1), resolution/bitrate, streaming (HLS/DASH) vs progressive, poster images, preload behavior, autoplay cost
- Action-oriented: optimize assets/markup จริง — วัด bytes ก่อน-หลัง

## Execute

### 1. Inventory Video Usage

> Goal: map videos ทั้งหมดและบทบาท

1. หา `<video>`, background videos, iframes embeds (YouTube/Vimeo)
2. จัดประเภท: hero/background (decorative), content (user watches), product demos
3. วัดขนาดไฟล์จริงแต่ละตัว — flag ตัวใหญ่เกินความจำเป็น

### 2. Measure Impact

> Goal: ผลกระทบต่อ performance

1. videos ใน LCP path — hero videos ที่ block/ช้า
2. `preload="auto"`/`metadata` ที่ดึง video มาก่อนจำเป็น
3. autoplay videos บน mobile — data + battery cost
4. embeds ที่ load iframes หนักทันที

### 3. Apply Optimizations

> Goal: แก้ตามประเภท

1. Compress: transcode ด้วย ffmpeg — target bitrate ตาม content, CRF-based (ไม่ใช่ขนาดตายตัว)
2. Formats: H.264 baseline สำหรับ compat + AV1/H.265 สำหรับ modern — multiple sources
3. Posters: `poster` attr ทุก video — รูปเบาแทน first-frame fetch
4. Preload: `preload="none"` + poster สำหรับ non-critical; `metadata` สำหรับที่เห็นทันที
5. Lazy: `loading="lazy"` iframes, facade pattern สำหรับ embeds (thumbnail → click → load)
6. Background videos: พิจารณาแทนด้วย image/animation เบากว่า — หรือ `muted playsinline` + compress หนัก
7. Streaming: HLS/DASH สำหรับ videos ยาว — progressive เฉพาะสั้นๆ

### 4. Verify

> Goal: ยืนยันเล่นได้และเบาลง

1. ทดสอบ playback ทุก video ที่แก้ — formats fallback ทำงาน
2. เทียบ bytes — `/report-before-after` แสดง savings
3. วัด LCP impact ถ้า video อยู่ใน critical path — `/optimize-web-vitals`

## Rules

### 1. Quality Preserved

- compression ต้องดูผลจริง — visually lossless เป้าหมาย
- อย่าบีบจน artifact เห็นชัดเพื่อเลขสวย

### 2. Accessibility

- videos ที่มีเสียงต้องมี captions; autoplay ต้อง `muted` + `playsinline`
- respect `prefers-reduced-motion` สำหรับ background videos

### 3. Measure First

- มี bytes/impact baseline — รายงาน delta จริง
- อย่า transcode ทุกไฟล์ถ้าไม่มีปัญหา

## Expected Outcome

- Video payload ลดลงพร้อมตัวเลข per asset
- Loading behavior ถูกต้อง — poster + lazy สำหรับ non-critical
- Playback ทำงานครบทุก browser target
