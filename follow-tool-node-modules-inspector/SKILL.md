---
name: follow-tool-node-modules-inspector
description: ตั้งค่าและใช้งาน Node Modules Inspector สำหรับตรวจสอบ node_modules แบบ interactive
related:
  - follow-lang-nodejs
  - follow-lang-typescript
  - follow-tool-knip
  - follow-tool-usage
  - follow-tool-pkg-new
  - follow-tool-renovate
---

## Goal

ตั้งค่าและใช้งาน `node-modules-inspector` เพื่อ inspect, debug และวิเคราะห์ `node_modules` แบบ interactive

## Scope

ใช้สำหรับ Node.js / TypeScript projects ที่ใช้ `npm`, `pnpm` หรือ `bun`

## Execute

### 1. Run Inspector

> Goal: เปิด interactive UI เพื่อตรวจสอบ dependencies

1. รัน `bunx node-modules-inspector` ที่ root ของ project
2. หรือรันด้วย package manager ที่ project ใช้ เช่น `npx node-modules-inspector` หรือ `pnpm dlx node-modules-inspector`
3. รอจน UI เปิดใน browser
4. ดูรายละเอียดใน [references/node-modules-inspector.md](references/node-modules-inspector.md)

### 2. Explore UI

> Goal: ใช้ interactive UI วิเคราะห์ dependencies

1. ดู dependency tree, versions และ installed sizes
2. ค้นหา duplicate packages หรือ multiple versions
3. ตรวจดู publish metadata และ `publint` warnings ถ้าเปิดใช้
4. ดูรายละเอียดใน [references/node-modules-inspector.md](references/node-modules-inspector.md)

### 3. Generate Reports

> Goal: รัน machine-readable reports สำหรับ automation

1. รัน `bunx node-modules-inspector report duplicates`
2. รัน `bunx node-modules-inspector report sizes`
3. รัน `bunx node-modules-inspector report maintainers`
4. ใช้ flag `--json` เพื่อ output เป็น JSON
5. ดูรายละเอียดใน [references/node-modules-inspector.md](references/node-modules-inspector.md)

### 4. MCP Server

> Goal: เปิด MCP server สำหรับ AI tools

1. รัน `bunx node-modules-inspector mcp`
2. ลงทะเบียน stdio server ใน MCP config ของ client
3. ใช้ tools `nmi:report-duplicates`, `nmi:report-sizes`, `nmi:report-maintainers`
4. ดูรายละเอียดใน [references/node-modules-inspector.md](references/node-modules-inspector.md)

### 5. Static Build

> Goal: สร้าง static report สำหรับ hosting หรือ CI artifacts

1. รัน `bunx node-modules-inspector build`
2. ได้ `.node-modules-inspector` directory
3. ใช้ static file server หรือ host บน GitHub Pages
4. ดูรายละเอียดใน [references/node-modules-inspector.md](references/node-modules-inspector.md)

## Rules

### 1. Usage

- ใช้ `bunx` เป็นค่าเริ่มต้น ถ้า project ไม่มี bun ให้ใช้ package manager ของ project
- รองรับ `npm`, `pnpm` และ `bun`
- ไม่ต้องติดตั้งเป็น dependency ถ้าใช้แบบ one-off

### 2. Config

- สร้าง `node-modules-inspector.config.ts` เมื่อต้องการ custom default filters หรือเปิด `publint`
- ไม่ hard-code sensitive paths ใน config

### 3. Reports

- ใช้ `--json` เมื่อต้องการ pipe ไปยัง script หรือ `jq`
- ใช้ `--limit` และ `--depth` เพื่อลดขนาด output
- สำหรับ CI ให้ใช้ `report` subcommands แทน UI

## References

- [CLI reference](references/cli.md)
- [References index](references/index.md)

## Expected Outcome

- `node-modules-inspector` รันได้ทั้ง `bunx` และ package manager ของ project
- Interactive UI ช่วยวิเคราะห์ dependencies ได้ทันที
- Reports สร้างได้ทั้งแบบ text และ JSON
- MCP server เปิดใช้งานได้สำหรับ AI tools
- Static build ใช้สำหรับ share ผลลัพธ์
