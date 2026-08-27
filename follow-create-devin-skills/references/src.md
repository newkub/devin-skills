# Src Creation Guide

skill ที่ระบุ CLI หรือ web มี `src/` directory พร้อมรัน

## When To Create Src

ถ้า `## Execute` ระบุว่าต้องใช้ CLI, ทำงานผ่าน terminal, แสดงผล web หรือ browser → สร้าง `src/`

## Steps

1. สำหรับ CLI: ใช้ `/follow-create-bun-cli` หรือ `/follow-create-cli` เลือก framework. ใช้ `/use-scripts` สำหรับ helper scripts
2. สำหรับ web: ใช้ `/review-frontend` เพื่อออกแบบ UI/UX. ใช้ `/visualize-in-web` สร้างไฟล์ HTML entry
3. วาง entry point ที่ `src/presentation/cli.ts` สำหรับ CLI. เก็บ web app code ใน `src/`
4. รันทดสอบด้วย `bun run dev` หรือ `bunx serve src/`. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์
5. ถ้า skill มี `src/` → ทำ `/convert-to-git-submodules` เพื่อแยกเป็น repo อิสระหลัง validation ผ่าน

## Rules

- ถ้า skill ต้องการ CLI → เรียก `/follow-create-bun-cli` หรือ `/follow-create-cli` ก่อน validation
- ถ้า skill ต้องการ web → เรียก `/review-frontend` ก่อนสร้าง `src/`
- ใช้ `src/presentation/cli.ts` เป็น entry point สำหรับ CLI
- ใช้ `/visualize-in-web` เพื่อสร้าง HTML entry สำหรับ web
- ตรวจสอบว่า `bun run dev`, `bun run build` และ `bunx serve src/` ทำงานได้
- รักษา package structure ที่ไม่เกิน 250 บรรทัด
- skill ที่มี `src/` ต้องถูกแปลงเป็น submodule ผ่าน `/convert-to-git-submodules`
