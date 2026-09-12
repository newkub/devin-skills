---
name: follow-lib-remotion-optimize-render
description: Optimize Remotion render — performance, codecs, lambda notes
argument-hint: "[scope]"
related:
  - follow-lib-remotion
  - run-bench
  - check-bottlenecks
  - report-before-after
  - resolve-errors
---

## Goal

ปรับปรุง Remotion render performance — ลด render time, เลือก codec/flags ที่เหมาะ และ cloud rendering notes

## Scope

ใช้เมื่อ render ช้าหรือต้องการ render ที่ scale — ครอบคลุม baseline timing, component optimization, CLI flags และ Lambda/Cloud Run notes (ต้องวัดผลก่อนและหลัง)

## Execute

### 1. Baseline

> Goal: วัด render time ปัจจุบันก่อน optimize

1. จับเวลา render ปัจจุบัน: `bunx remotion render MyComp` — บันทึก duration และ output size
2. ระบุ bottleneck: composition complexity, assets ขนาดใหญ่, codec, concurrency — ทำ `/check-bottlenecks`
3. ใช้ `--log=verbose` ดู render phases ถ้าต้องเจาะลึก

### 2. Optimize Composition

> Goal: ลด per-frame cost ใน components

1. หลีกเลี่ยง expensive computation ใน render body — precompute นอก component หรือ memoize
2. ใช้ `<OffthreadVideo>` สำหรับวิดีโอขนาดใหญ่ — extract frames แบบ offthread ไม่ block
3. optimize assets ก่อน render — compress images/videos, resize ให้พอดี output resolution
4. ใช้ `lazyComponent` สำหรับ compositions ที่ไม่ต้อง render ตอนนี้
5. หลีกเลี่ยง `defaultProps` payload ใหญ่ — props ถูก serialize ทุก render

### 3. Tune Render Flags

> Goal: เลือก codec และ concurrency ที่เหมาะ

1. `--codec`: `h264` (default, balanced), `h265` (เล็กกว่า แต่ช้ากว่า), `vp9` (web), `gif`, `png` sequence
2. `--concurrency` ปรับตาม CPU cores ที่มี — default ค่อนข้างดี ลองเพิ่มถ้า render ช้า
3. `--every-nth-frame` สำหรับ GIF/draft renders — ลด frames ที่ต้อง render
4. `--scale` ลด output resolution สำหรับ preview/draft renders
5. ดู flags เต็มที่ official docs `https://remotion.dev/docs/cli/render` — อย่าเดา flag names

### 4. Cloud Rendering Notes

> Goal: เลือก cloud option เมื่อ local render ไม่พอ

1. `@remotion/lambda` (AWS Lambda) — scale สูงสุด, render แบบ parallel ข้ามหลาย functions; เหมาะกับ volume ใหญ่
2. `@remotion/cloudrun` (Google Cloud Run) — container-based, control มากกว่า lambda
3. `@remotion/vercel` — integrate กับ Vercel
4. Cloud rendering ต้อง setup credentials/infrastructure — ดู official docs และ `/follow-secret-manager` สำหรับ keys ห้าม commit

### 5. Verify And Compare

> Goal: วัดผลหลัง optimize เทียบ baseline

1. Render ซ้ำด้วย settings ใหม่ — compare duration และ output size กับ baseline ด้วย `/report-before-after`
2. ตรวจ output quality — optimize ต้องไม่ลด quality เกินที่ยอมรับ
3. ถ้าไม่ดีขึ้น → revert จุดนั้นแล้ว report

## Rules

- วัด baseline ก่อนเสมอ — ห้าม optimize โดยไม่มีตัวเลขเดิม
- แก้ทีละจุด — แยกผลของแต่ละ optimization ได้
- preserve output quality — ตรวจ output หลังทุกการเปลี่ยน
- `--concurrency` สูงเกิน = memory pressure — ขึ้นทีละน้อย
- ใช้ `/follow-lib-remotion` สำหรับ full reference

## Expected Outcome

- Render time ลดลงเทียบ baseline ด้วยตัวเลขจริง
- Codec/flags เหมาะกับ use case (draft vs production)
- Cloud rendering option ระบุชัดเจนถ้าต้อง scale
