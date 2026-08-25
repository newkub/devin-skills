# CLI Creation Guide

skill ที่ระบุ CLI มี entry point และรันผ่าน `bun run dev`

## When To Create CLI

ถ้า `## Execute` ระบุว่าต้องใช้ CLI หรือทำงานผ่าน terminal → สร้าง CLI

## Steps

1. ใช้ `/follow-create-bun-cli` หรือ `/follow-create-cli` เลือก framework. ใช้ `/use-scripts` สำหรับ helper scripts
2. วาง entry point ที่ `src/presentation/cli.ts`. รันทดสอบด้วย `bun run dev` หรือ `bun run src/presentation/cli.ts -- --help`. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์

## Rules

- ถ้า skill ต้องการ CLI → เรียก `/follow-create-bun-cli` หรือ `/follow-create-cli` ก่อน validation
- ใช้ `src/presentation/cli.ts` เป็น entry point
- ตรวจสอบว่า `bun run dev` และ `bun run build` ทำงานได้
- รักษา package structure ที่ไม่เกิน 250 บรรทัด
