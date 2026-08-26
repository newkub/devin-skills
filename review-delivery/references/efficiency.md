# Build Efficiency Checks

## Goal

ปรับปรุง build และ resource cost ของ project ให้ build เร็วขึ้น output เล็กลง และใช้ resource คุ้มค่า

## Scope

ใช้กับ project ที่มี build tool หรือ infrastructure ที่ต้องการปรับปรุง build time, output size, dependencies, และ cost

## Checks

### Baseline Analysis

1. ทำ `/analyze-project` เพื่อระบุ project type, package manager, build tool
2. ตรวจหา build config (`bunup.config.ts`, `tsdown.config.ts`, `vite.config.ts`, `tauri.conf.json`)
3. บันทึก build time และ output size baseline
4. ถ้าไม่พบ build config → stop และ report

### Build Configuration

1. เปิด minify, ปิด sourcemap สำหรับ production ถ้าไม่จำเป็น
2. ตั้งค่า `target`, `external`, tree-shaking, `sideEffects: false` ถ้าเหมาะสม
3. ตรวจ output format, minify, sourcemap, external dependencies

### Dependencies And Code Splitting

1. ทำ `/check-unused-deps` เพื่อหา dependencies ที่ไม่ใช้
2. ทำ `/review-architecture` เพื่อตรวจ barrel files และ import paths
3. ใช้ `/scan-codebase` หา unused files, dead code, unused exports
4. ใช้ dynamic `import()` หรือ route-based lazy loading ถ้าเหมาะสม
5. ลบหรือ refactor imports ที่ยก module ทั้งหมดมา แต่ใช้บางส่วน

### Assets And Build Artifacts

1. ตรวจหา assets ขนาดใหญ่ใน `src/` หรือ `public/`
2. ลบ unused assets, ใช้ compression, convert format ถ้าจำเป็น
3. ทำ `/run-clean` เพื่อลบ artifacts และ cache เก่า
4. รัน build ใหม่และเปรียบเทียบกับ baseline

### Cost Optimization

1. ระบุ services ที่กิน cost สูง (compute, storage, bandwidth, logs)
2. ลด unnecessary resources, right-size instances, ใช้ spot/preemptible ถ้าเหมาะสม
3. ปิด environments/integrations ที่ไม่ใช้
4. ตรวจ logs retention, observability cost, data transfer
5. ใช้ `/follow-best-practice` หรือ `/learn-from-web` สำหรับ cloud stack

## Rules

- บันทึก build time, output size, cost baseline ก่อน optimize
- หยุดเมื่อไม่มีการปรับปรุงที่ significant
- ไม่ลบ source code หรือ config ที่จำเป็น
- ไม่ลบ dependencies ที่ยังถูกใช้งาน
- ตรวจสอบว่า output ยังทำงานได้หลัง optimize
- ขั้นตอน assets ทำเฉพาะเมื่อ project มี assets
- ขั้นตอน barrel files ทำเฉพาะเมื่อ project มี barrel exports
