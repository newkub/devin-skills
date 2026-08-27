# Src Creation Guide

skill ที่ระบุ CLI, web, หรือ MCP server มี `src/` directory พร้อมรัน

## When To Create Src

ถ้า `## Execute` ระบุว่าต้องใช้ CLI, ทำงานผ่าน terminal, แสดงผล web, browser, หรือ expose MCP server → สร้าง `src/`

## Steps

1. สำหรับ CLI: ใช้ `/follow-create-cli` เลือก stack ที่เหมาะสม (Rust หรือ Bun/TS). ใช้ `/use-scripts` สำหรับ helper scripts
2. สำหรับ web: ใช้ `/review-frontend` เพื่อออกแบบ UI/UX. ใช้ `/visualize-in-web` สร้างไฟล์ HTML entry
3. สำหรับ MCP server: ใช้ `/follow-create-mcp` (พยายาม Rust ก่อน ถ้าไม่เหมาะจึง fallback ไป TypeScript)
4. เลือก entry point ตาม stack เช่น `src/presentation/cli.ts` สำหรับ Bun/TS, `src/main.rs` สำหรับ Rust, หรือ `src/index.ts`/`src/main.rs` สำหรับ MCP
5. รันทดสอบด้วยคำสั่งที่เหมาะสมกับ stack เช่น `bun run dev`, `cargo run`, หรือ `bunx serve src/`. เก็บ generated files ให้ไม่เกิน 250 บรรทัดต่อไฟล์
6. ถ้า skill มี `src/` → ทำ `/convert-to-git-submodules` เพื่อแยกเป็น repo อิสระหลัง validation ผ่าน

## Rules

- ถ้า skill ต้องการ CLI → เรียก `/follow-create-cli` ก่อน validation
- ถ้า skill ต้องการ web → เรียก `/review-frontend` ก่อนสร้าง `src/`
- ถ้า skill ต้องการ MCP server → เรียก `/follow-create-mcp` แล้วอัปเดต `mcp_config.json`
- เลือก entry point ตาม stack ที่เลือก ไม่บังคับ `src/presentation/cli.ts`
- ใช้ `/visualize-in-web` เพื่อสร้าง HTML entry สำหรับ web
- ตรวจสอบว่า dev/build/run ทำงานได้ด้วยคำสั่งของ stack นั้น
- รักษา package structure ที่ไม่เกิน 250 บรรทัด
- skill ที่มี `src/` ต้องถูกแปลงเป็น submodule ผ่าน `/convert-to-git-submodules`
