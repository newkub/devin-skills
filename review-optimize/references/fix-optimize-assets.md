# Fix Guide — Assets

## Goal

fonts/icons/media load เฉพาะตอนใช้ — boot ไม่แบก assets ของ features ทั้งหมด

## Scope

ใช้กับ font loading, icon strategy, images, media — preserve rendering/UX เดิมทุกประการ

## Execute

### 1. Defer Non-Critical Fonts

> Goal: เหลือเฉพาะ UI default font ตอน boot

1. แยก font families: UI default (eager) vs feature fonts (whiteboard, slides, mono, print) → ย้ายไป idle import module (`fonts-extra.ts` pattern)
2. `requestIdleCallback`/`setTimeout` fallback — load หลัง first paint
3. เช็ค feature entry — fonts ต้องพร้อมก่อน feature เปิดจริง (idle มาช้า → preload ตอน hover/route prefetch)
4. `font-display: swap`/`optional` ครบทุก face — ไม่มี invisible text ตอน load

### 2. Subset And Slim Icon Payload

> Goal: icon bytes เฉพาะที่ render จริง

1. `@iconify-json/<set>/icons.json` → per-icon path imports (`@iconify-json/<set>/<icon>`) หรือ icon component ที่ tree-shake
2. หลาย icons จาก set เดียว → shared import module เดียว ไม่ใช่กระจาย
3. icon CSS (UnoCSS safelist) — audit ว่า safelist ไม่ generate ทั้ง set
4. icons ที่ lazy อยู่แล้ว (separate chunk) — คงเดิม ห้ามดึงกลับเข้า entry

### 3. Lazy And Format Images

> Goal: ไม่ decode/download สิ่งที่ไม่เห็น

1. `loading="lazy"` + `decoding="async"` บน below-fold images; `fetchpriority="high"` เฉพาะ LCP image
2. `width`/`height` attributes ครบ — ป้องกัน CLS
3. เสนอ webp/avif เมื่อ source เป็น png/jpg ใหญ่ — คง fallback
4. `srcset`/`sizes` เมื่อ render หลายขนาด

### 4. Bound Media Cost

> Goal: media ไม่ download/decode ก่อนจำเป็น

1. `preload="none"`/`metadata` บน video/audio ที่ไม่ autoplay
2. poster image แทน decode first frame
3. streaming/hls สำหรับไฟล์ใหญ่แทน full download

### 5. Verify

> Goal: boot bytes ลด, UX เหมือนเดิม

1. dist/asset listing before/after — fonts/icons chunk แยกออกจาก entry
2. features เปิดแล้ว fonts/icons โหลดทัน — ไม่มี FOUT/placeholder ค้าง
3. images ไม่ CLS — layout stable ตอน load
4. typecheck + tests + build ผ่าน

## Rules

- UI default font ต้อง eager — defer font หลัก = text กระพริบทั้ง app
- feature fonts ต้องพร้อมก่อน feature ใช้ — idle defer อย่างเดียวไม่พอถ้า feature เปิดเร็ว
- ห้ามลบ deliberate icon chunk splits — ดู manualChunks/comments ก่อน
- ทุก deferral มี fallback เมื่อ idle callback ไม่มา (`setTimeout` cap)
- ใช้ /loop-until-complete ถ้า verify ต้อง iterate

## Expected Outcome

- boot payload ลด — เหลือเฉพาะ UI font + icons ที่ render จริง
- feature assets โหลดตอน idle/ตอนเปิด — ไม่มี flash หรือ missing fonts
- images/media ไม่กิน bandwidth/decode ก่อนเห็น
