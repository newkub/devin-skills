---
name: follow-tool-vite-optimize-build
description: ปรับ Vite build — chunk splitting, minify options, sourcemap strategy
argument-hint: "[target-area]"
related:
  - follow-tool-vite
  - run-bench
  - check-bottlenecks
  - check-bundle-regression
  - report-before-after
---

## Goal

ลด production bundle size และเวลา build ของ Vite project ด้วย chunk splitting, minify options และ sourcemap strategy ที่เหมาะสม — วัดผลก่อนและหลังเสมอ

## Scope

- ครอบคลุม `build.rolldownOptions.output` (`advancedChunks`, `minify`), `build.sourcemap`, `build.reportCompressedSize`, `chunkSizeWarningLimit`
- ใช้กับ Vite 8+ (Rolldown bundler) — ถ้า project ยังเป็น Vite ≤7 ดู official docs สำหรับ `rollupOptions` equivalents
- config structure พื้นฐาน → ใช้ `subskills/config-vite/SKILL.md`

## Execute

### 1. Baseline

> Goal: เก็บตัวเลขก่อนแก้ ห้ามเดา bottleneck

1. รัน `bunx vite build` เก็บ build time และขนาด output ต่อ chunk
2. เปิด `build.reportCompressedSize` เพื่อดู gzip size ใน output (หรือใช้ bundle visualizer — ดู official docs)
3. ทำ `/check-bottlenecks` ถ้าต้องหา chunk ที่ใหญ่ผิดปกติ

### 2. Chunk Splitting

> Goal: แยก vendor/route chunks อย่างมีเหตุผล

1. ใช้ `build.rolldownOptions.output.advancedChunks` สำหรับ grouping เช่น แยก `vendor` สำหรับ `node_modules`
2. แยกตาม route ผ่าน dynamic `import()` ใน source — config splitting ไม่แทน lazy loading
3. หลีกเลี่ยง chunk เล็กเกิน — request overhead มากกว่าประโยชน์
4. ปรับ `chunkSizeWarningLimit` ให้สอดคล้อง budget ของ project — ไม่ใช่แค่ปิด warning

### 3. Minify Options

> Goal: minify โดยไม่เปลี่ยน behavior

1. Vite 8 ใช้ Oxc minifier ผ่าน `build.rolldownOptions.output.minify` — options ใน `minify.compress` เช่น `dropConsole`, `dropDebugger`
2. เปิด `dropConsole`/`dropDebugger` เฉพาะ production ผ่าน conditional config by `mode`
3. ห้ามเปิด compress options ที่เปลี่ยน semantics โดยไม่ test — ดู official docs ต่อ option

### 4. Sourcemap Strategy

> Goal: เลือก sourcemap ตาม use case

1. `build.sourcemap: true` → external `.map` — ใช้กับ staging/internal tools
2. `build.sourcemap: 'hidden'` → สร้าง map แต่ไม่ใส่ comment — ใช้กับ error reporting เช่น Sentry
3. เก็บ default `false` สำหรับ public production ถ้าไม่ต้องการ expose source

### 5. Measure Again

> Goal: compare กับ baseline

1. รัน `bunx vite build` ซ้ำ — compare bundle size, chunk count, build time
2. ถ้า regression หรือ behavior เปลี่ยน → revert จุดนั้นแล้ว report
3. รัน `vite preview` + smoke test หน้าเว็บจริง
4. report ตัวเลขด้วย `/report-before-after`

## Rules

### 1. Behavior Preservation

- optimize ≠ เปลี่ยน output — runtime behavior ต้องเหมือนเดิม
- แก้ทีละจุด วัดทีละจุด — ห้ามแก้หลาย options พร้อมกันถ้าแยกผลไม่ได้

### 2. Options

- ใช้เฉพาะ options ใน official docs (`vite.dev`, `rolldown.rs`) — ห้ามเดา
- `esbuild.*` options deprecated ใน Vite 8 — ใช้ `oxc`/`rolldownOptions` แทน

## Expected Outcome

- bundle size/build time ดีขึ้นเทียบ baseline ที่วัดได้
- chunk layout สมเหตุสมผล sourcemap ตรง deployment strategy
