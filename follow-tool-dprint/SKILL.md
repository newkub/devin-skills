---
name: follow-tool-dprint
description: ตั้งค่าและใช้งาน dprint สำหรับ formatting code หลายภาษาด้วย pluggable architecture
argument-hint: "[scope]"
related:
  - use-agent-browser
  - use-astgrep
  - follow-tool-aube
  - follow-tool-usage
  - follow-best-practice
  - setup-cicd
---

## Goal

ตั้งค่าและใช้งาน dprint สำหรับ formatting code หลายภาษาด้วย pluggable architecture

## Scope

ใช้สำหรับ project ที่ต้องการ code formatting หลายภาษา

## Execute

1. Precondition Check

ตรวจสอบ environment ก่อนเริ่มติดตั้ง

- ตรวจสอบว่ามี Bun ติดตั้งแล้ว
- ตรวจสอบว่ามี package.json อยู่แล้ว
- ตรวจสอบว่า project มี structure ที่ถูกต้อง

2. Install Dprint

ติดตั้ง dprint ด้วย Bun

- รันคำสั่ง `bun add -D dprint` เพื่อติดตั้ง dprint เป็น dev dependency
- ตรวจสอบว่า installation สำเร็จโดยตรวจสอบ bun.lock และ package.json
- ตรวจสอบว่าสามารถรัน `dprint --version` ได้

3. Create Configuration File

สร้าง dprint.json config file

- ดาวน์โหลด config จาก reference repository ด้วย `gh download https://github.com/newkub/my-config/blob/main/dprint.json`
- หรือสร้าง dprint.json ใหม่ด้วย configuration พื้นฐาน:

```json [dprint.json]
{
  "includes": [
    "/*.{ts,tsx,js,jsx,json,md,toml,yaml,yml,css,scss,sass,less,html,vue,svelte,astro,py,go}"
  ],
  "excludes": [
    "/node_modules",
    "/dist",
    "/.git"
  ],
  "plugins": [
    "https://plugins.dprint.dev/typescript-0.96.1.wasm",
    "https://plugins.dprint.dev/json-0.23.0.wasm",
    "https://plugins.dprint.dev/markdown-0.23.3.wasm",
    "https://plugins.dprint.dev/toml-0.8.0.wasm",
    "npm:dprint-plugin-yaml@0.6.0",
    "https://plugins.dprint.dev/dockerfile-0.6.0.wasm",
    "npm:dprint-plugin-malva@0.16.0",
    "npm:dprint-plugin-markup@0.27.3",
    "https://plugins.dprint.dev/ruff-0.8.6.wasm",
    "npm:@jakebailey/dprint-plugin-gofumpt@0.0.17",
    "https://plugins.dprint.dev/mago-0.25.5.wasm"
  ]
}
```

- ตรวจสอบว่า dprint.json ถูกสร้างขึ้นอย่างถูกต้อง
- ปรับแต่ง configuration ตามความต้องการของ project (ถ้าจำเป็น)

4. Add Format Scripts

เพิ่ม scripts ใน package.json

- เพิ่ม script `format` สำหรับ format files อัตโนมัติ

```json [package.json]
{
  "scripts": {
    "format": "dprint fmt"
  }
}
```

- ตรวจสอบว่า scripts ถูกเพิ่มเข้าไปใน package.json อย่างถูกต้อง
- ตรวจสอบว่าไม่มี conflict กับ scripts ที่มีอยู่แล้ว

5. Verify Installation

ทดสอบการทำงานของ dprint

- รัน `bun run format` เพื่อ format files ทั้งหมด
- ตรวจสอบว่า dprint ทำงานได้ถูกต้องกับทุก file types ที่ระบุ
- ตรวจสอบว่า plugins ถูก download และใช้งานได้

## Rules

ต้องปฏิบัติตามกฏและข้อกำหนดเหล่านี้เสมอ

- ต้องใช้ Bun เป็น package manager เสมอสำหรับการติดตั้ง dprint
- ต้องติดตั้ง dprint เป็น dev dependency เสมอด้วย flag -D
- ต้องดาวน์โหลด config จาก reference repository ก่อน ถ้ามี
- ต้องระบุ plugins สำหรับทุกภาษาที่ต้องการรองรับ
- ต้องกำหนด excludes patterns สำหรับ node_modules, dist, .git เสมอ
- ต้องเพิ่ม format script ใน package.json
- ต้องใช้ indentWidth: 2 สำหรับ TypeScript และ JSON
- ต้องใช้ lineWidth: 100 สำหรับ TypeScript
- ต้องใช้ quoteStyle: alwaysSingle สำหรับ TypeScript
- ต้องใช้ semiColons: asi สำหรับ TypeScript

- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /follow-tool-aube ถ้าจำเป็น
- ใช้ /follow-tool-usage ถ้าจำเป็น
- ใช้ /follow-best-practice ถ้าจำเป็น
- ใช้ /setup-cicd ถ้าจำเป็น

## References

- [CLI reference](references/cli.md)


## Expected Outcome

- dprint ติดตั้งและกำหนดค่าใน project
- รองรับหลายภาษาด้วย pluggable architecture
- มี `dprint.json` พร้อม plugins และ config
- มี format script ใน package.json
