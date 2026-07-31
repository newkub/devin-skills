---
name: review-images
description: Review image format, responsive images, lazy loading, CDN, compression, EXIF stripping, thumbnail generation
---

## Goal

Review image optimization ครอบคลุม format, responsive, lazy loading, CDN, compression พร้อม health score

## Scope

image review สำหรับ: image format (WebP/AVIF, fallback), responsive images (srcset, sizes, art direction), lazy loading (native, intersection observer, above-the-fold), CDN configuration, compression strategy, image metadata (EXIF stripping, thumbnail generation), image sizing, image delivery, SVG optimization

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ image usage และ optimization setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ image structure
2. ระบุ image optimization tools, CDN provider, image component patterns, lazy loading strategy ที่ใช้
3. ถ้า project ไม่มี images → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก image dimension พร้อม health score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ image patterns
2. ทำ `/update-codebase-health-cli` — `/update-codebase-health-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-codebase-health-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-health` เพื่อดึง metrics ล่าสุด

### 3. Format And Responsive Images Review

> Goal: ครอบคลุม format, responsive images, art direction

1. ตรวจสอบ image format: WebP/AVIF usage, format fallback (picture element), JPEG/PNG for legacy, SVG for icons, format selection per image type, animated image format
2. ตรวจสอบ responsive images: srcset attribute, sizes attribute, art direction with picture element, breakpoint-specific images, DPR (device pixel ratio) handling, width/height attributes for CLS prevention
3. ตรวจสอบ image sizing: appropriate image dimensions, no oversized images, image resize on upload, image resize at build time, image dimensions match display size
4. ตรวจสอบ SVG optimization: SVG minification, unused SVG elements, SVG accessibility (title, desc), SVG sprite usage, inline SVG vs external SVG
5. Critical: no image optimization, huge images ใน initial load, no format fallback, images ที่ก่อให้เกิด CLS
6. High: missing responsive images, no WebP/AVIF, missing srcset, missing width/height, oversized images, no SVG optimization

### 4. Lazy Loading, CDN And Compression Review

> Goal: ครอบคลุม lazy loading, CDN, compression, metadata

1. ตรวจสอบ lazy loading: native loading="lazy", intersection observer implementation, above-the-fold images (no lazy), below-the-fold images (lazy), placeholder strategy, blur placeholder, skeleton placeholder
2. ตรวจสอบ CDN configuration: CDN delivery, CDN image transformation, CDN resize on-the-fly, CDN format negotiation, CDN cache headers, CDN purge strategy
3. ตรวจสอบ compression strategy: lossy vs lossless selection, compression quality settings, compression per format, compression per image type, compression automation
4. ตรวจสอบ image metadata: EXIF stripping, GPS data removal, metadata for SEO (alt text, title), metadata size impact, thumbnail generation
5. ตรวจสอบ image delivery: preload critical images, preload config, image priority hints (fetchpriority), connection preload for image CDN, HTTP/2 multiplexing
6. Critical: no lazy loading on below-the-fold images, EXIF/GPS data exposed, no CDN delivery on image-heavy pages
7. High: missing CDN, missing compression, missing EXIF stripping, missing preload on critical image, missing thumbnail generation, no placeholder

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ health score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี images → ข้ามทั้งหมด
- ถ้า project ไม่มี CDN → ข้าม Step 4 item 2
- ถ้า project ไม่มี SVG → ข้าม Step 3 item 4

### 2. Severity Classification

- Critical: no image optimization, huge images ใน initial load, no format fallback, images ที่ก่อให้เกิด CLS, no lazy loading on below-the-fold, EXIF/GPS data exposed
- High: missing responsive images, no WebP/AVIF, missing srcset, missing width/height, oversized images, missing CDN, missing compression, missing preload on critical image
- Medium: suboptimal compression quality, missing placeholder, missing thumbnail, minor SVG optimization, missing fetchpriority
- Low: cosmetic, minor optimization, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ image, component, หรือ page ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก image section
- Health score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
