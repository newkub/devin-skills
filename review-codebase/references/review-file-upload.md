---
name: review-file-upload
description: Review file upload validation, sanitization, storage, access control, CDN, virus scan, review score
---

## Goal

Review file upload ครอบคลุม validation, sanitization, storage, access control, CDN, virus scan พร้อม review score

## Scope

file upload review สำหรับ: file size validation, MIME type checking, extension validation, magic number verification, file name sanitization, path traversal prevention, storage strategy, access control, CDN integration, virus scan, upload error handling, chunked upload, resumable upload, upload progress, upload rate limiting

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ file upload patterns และ storage setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ file upload structure
2. ระบุ storage provider (S3, R2, local, GCS), upload patterns, validation strategy, access control approach ที่ใช้
3. ถ้า project ไม่มี file upload → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก file upload dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ file upload patterns
2. ทำ `/update-review-cli` — `/update-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 3. Validation And Sanitization Review

> Goal: ครอบคลุม file validation, sanitization, path traversal prevention

1. ตรวจสอบ file size validation: max file size config, file size enforcement, file size per type, total upload size limit, chunk size for chunked uploads, size error handling
2. ตรวจสอบ MIME type checking: MIME type whitelist, MIME type from header (not extension), MIME type spoofing prevention, missing MIME check, MIME type blacklist (if used)
3. ตรวจสอบ extension validation: extension whitelist, double extension prevention (file.php.jpg), extension case sensitivity, extension from filename, extension vs MIME mismatch
4. ตรวจสอบ magic number verification: file signature verification, magic number for common types (JPEG, PNG, PDF, ZIP), missing magic number check, magic number vs MIME consistency
5. ตรวจสอบ file name sanitization: file name character sanitization, unicode normalization, file name length limit, file name uniqueness (UUID, hash), original name preservation, file name collision prevention
6. ตรวจสอบ path traversal prevention: path sanitization, directory traversal (../), null byte injection, absolute path prevention, symlink prevention, storage path construction
7. จัด severity ตาม `## Rules` → Severity Classification

### 4. Storage, Access Control, CDN And Virus Scan Review

> Goal: ครอบคลุม storage, access control, CDN, virus scan, upload UX

1. ตรวจสอบ storage strategy: storage provider config, bucket/container naming, storage path structure, storage lifecycle, storage cost optimization, storage redundancy, storage region
2. ตรวจสอบ access control: upload auth, file access auth, signed URL, access token expiration, public vs private files, per-user access, role-based file access
3. ตรวจสอบ CDN integration: CDN delivery for public files, CDN cache config, CDN purge on update, CDN signed URL, CDN bandwidth optimization, CDN region
4. ตรวจสอบ virus scan: virus scan integration, scan before storage, scan after upload, scan result handling, infected file handling, scan timeout, scan queue
5. ตรวจสอบ upload error handling: upload failure handling, partial upload recovery, upload retry, upload timeout, upload cancellation, upload error messages
6. ตรวจสอบ upload UX: upload progress indicator, upload cancel button, upload drag-and-drop, multi-file upload, upload preview, upload success feedback, upload error feedback
7. จัด severity ตาม `## Rules` → Severity Classification

### 5. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี file upload → ข้ามทั้งหมด
- ถ้า project ไม่มี CDN → ข้าม Step 4 item 3
- ถ้า project ไม่มี virus scan → ข้าม Step 4 item 4

### 2. Severity Classification

- Critical: no file type validation, path traversal vulnerability, no size limit ที่ก่อให้เกิด DoS, missing magic number verification, no sanitization ที่ก่อให้เกิด XSS, insecure storage ที่ก่อให้เกิด data leak, no access control on private files, missing virus scan on user uploads
- High: missing MIME type check, missing extension validation, missing file name sanitization, weak size limit, missing CDN, missing signed URL, missing upload progress, weak access control
- Medium: suboptimal storage path, missing upload retry, minor access control gap, missing upload preview, suboptimal CDN config
- Low: cosmetic, minor upload UX, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ upload handler, validation rule, หรือ storage config ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก file upload section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
