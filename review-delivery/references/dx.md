# Developer Experience Checks

## Goal

Review developer experience ด้าน tooling, onboarding, docs, และ feedback loops

## Scope

DX review สำหรับ: package scripts, dev server, build, lint, test, README, setup guide, contributing guide, documentation, error messages, HMR, pre-commit hooks, และ feedback loops — ไม่รวมการ fix

## Checks

### Tooling

1. ตรวจสอบ package scripts (`dev`, `build`, `test`, `lint`, `typecheck`) ใช้งานได้และไม่ซ้ำซ้อน
2. ตรวจสอบ dev server startup time และ hot reload / HMR
3. ตรวจสอบ build time, incremental build, และ cache usage
4. ตรวจสอบ lint, format, type check runtime เร็วพอ
5. ตรวจสอบ IDE integrations, extensions, และ editor config (`editorconfig`, `.vscode/settings.json`)
6. ตรวจสอบ pre-commit hooks ไม่ช้าและไม่ block

### Onboarding

1. ตรวจสอบ README มี overview, installation, usage, contributing
2. ตรวจสอบ setup guide เป็น step-by-step บน clean environment
3. ตรวจสอบ prerequisites, env vars, และ secrets setup
4. ตรวจสอบ one-command setup เช่น `bun install && bun dev`
5. ตรวจสอบ troubleshooting guide สำหรับข้อผิดพลาดทั่วไป

### Docs

1. ตรวจสอบ API docs / `JSDoc` / `TSDoc` ครอบคลุม public API
2. ตรวจสอบ examples runnable และ up-to-date
3. ตรวจสอบ changelog / migration guide ถ้ามี breaking changes
4. ตรวจสอบ doc tools (`VitePress`, `Docusaurus`, `Storybook`) ตรงกับ code
5. ตรวจสอบ docs ไม่มี broken links, missing pages, stale screenshots

### Feedback Loops

1. ตรวจสอบ error messages บอกสาเหตุ, วิธีแก้, และตำแหน่ง
2. ตรวจสอบ stack traces อ่านง่ายและมี context
3. ตรวจสอบ test feedback loop เร็ว (unit, integration, watch mode)
4. ตรวจสอบ lint / type check feedback ใน IDE และ CI
5. ตรวจสอบ observability สำหรับ debug: logs, metrics, tracing
6. ตรวจสอบ build / deploy error feedback ชัดเจน

## Severity

- Critical: ไม่สามารถ run dev/build ได้, broken setup, no onboarding guide, unrecoverable error
- High: no HMR, slow build > 1 นาที, missing debug tooling, unclear error messages, missing contributing guide
- Medium: poor error messages, missing docs, suboptimal feedback loop
- Low: cosmetic improvement

## Rules

- ทำ review เท่านั้น ไม่ fix, ไม่ลบ, และไม่แก้ไข code ระหว่าง review
- Build ควรใช้เวลา < 1 นาที, tests รันเร็ว, linting เร็ว, HMR instant
- ทุก finding ต้องมี file path, line number, หรือ doc URL
- รายละเอียด config review อยู่ใน `/update-review-codebase-cli-and-run` แล้ว
