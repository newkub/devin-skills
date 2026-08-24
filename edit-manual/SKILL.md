---
name: edit-manual
description: แก้ไข configuration files ด้วยมืออย่างปลอดภัย ควบคุมการเปลี่ยนแปลงแบบ precise พร้อม rollback
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
---

## Goal

แก้ไข configuration files ด้วยมืออย่างปลอดภัย ควบคุมการเปลี่ยนแปลงแบบ precise พร้อม backup, rollback และ validation ครบทุกด้าน

## Scope

ใช้สำหรับการแก้ไข configuration files ด้วยมือ เช่น `vite.config.ts`, `turbo.json`, `package.json`, `tsconfig.json`, `biome.jsonc`, `lefthook.yml`, `uno.config.ts`, `drizzle.config.ts`, `.github/workflows/*.yml` และ config files อื่นๆ

ไม่ใช้สำหรับการสร้าง configuration ใหม่ทั้งหมด (ใช้ `/follow-config` แทน)

## Execute

### 1. Pre-Edit Safety Check

> Goal: ตรวจสอบสภาพแวดล้อมก่อนแก้ไขเพื่อให้สามารถ rollback ได้เสมอ
> Goal: รู้ git state และมี rollback path ชัดเจนก่อนแก้

1. ตรวจสอบ git working tree สะอาด: รัน `git status --porcelain` ถ้ามี unstaged changes → ถามผู้ใช้ก่อนดำเนินการ (ใช้ `/ask-me`)
2. บันทึก hash ของไฟล์ก่อนแก้: รัน `git rev-parse HEAD` เพื่อเก็บ commit hash ปัจจุบันสำหรับ rollback
3. ถ้าไฟล์ยังไม่ถูก track โดย git → สร้างสำเนาสำรองไว้ใน `temp/` ก่อนแก้
4. ถ้าเป็น monorepo ระบุ workspace ที่ได้รับผลกระทบ

### 2. Read And Understand

> Goal: อ่าน config file และ official docs ก่อนแก้เพื่อเข้าใจผลกระทบของการเปลี่ยนแปลง
> Goal: เข้าใจ config ปัจจุบัน ผลกระทบ และ available options ก่อนแก้

1. อ่าน config file ที่ต้องการแก้ไขให้เข้าใจโครงสร้างและ settings ปัจจุบัน
2. ทำ `/learn-from-web` หรือ `/follow-best-practice` สำหรับ tool ที่ config เกี่ยวข้อง
3. ระบุว่าการเปลี่ยนแปลงนี้กระทบ workspace ใดบ้าง และต้อง sync ข้าม workspaces หรือไม่
4. ตรวจสอบ version compatibility ของ dependencies ที่เกี่ยวข้องกับ config ที่จะแก้

### 3. Plan And Preview Changes

> Goal: วางแผนการแก้ไขและ preview diff ก่อน apply เพื่อลดความเสี่ยง
> Goal: รู้ exact changes ก่อน apply และมี impact analysis ชัดเจน

1. ระบุจุดที่ต้องแก้ไขและค่าใหม่ที่ต้องการ
2. ตรวจสอบ dependencies และ constraints (เช่น version compatibility, plugin requirements, CI/CD pipeline impact)
3. ทำ `/dont-over-engineer` เพื่อวางแผน minimal changes ที่จำเป็น
4. จดบันทึก impact analysis: ไฟล์ใดจะได้รับผลกระทบ, CI/CD pipeline ใดเปลี่ยน, workspace ใดต้อง sync
5. ถ้าเป็น monorepo และมีหลาย workspaces ที่ต้องแก้ (> 5 ไฟล์) → ใช้ `/use-scripts` เพื่อสร้าง validation script

### 4. Apply Edits

> Goal: แก้ไข config file อย่าง precise โดยเปลี่ยนเฉพาะจุดที่จำเป็น
> Goal: การแก้ไข minimal, precise, ไม่กระทบ settings อื่น

1. ใช้ `edit` หรือ `multi_edit` สำหรับการแก้ไข config file
2. แก้ไขเฉพาะจุดที่จำเป็น ไม่เปลี่ยน settings อื่นที่ไม่เกี่ยวข้อง
3. รักษา indentation และ style เดิมของ config file
4. ถ้าเกิน 10 ไฟล์ → ใช้ `/use-scripts` เพื่อ automate การแก้และ validate
5. ทำ `/update-reference` เพื่ออัปเดต references ที่เกี่ยวข้อง

### 5. Post-Edit Validation

> Goal: ตรวจสอบความถูกต้องของ config หลังแก้ไขครบทุกด้าน
> Goal: config ผ่าน validation ครบทุกประเภท ไม่มี secrets รั่ว

1. ทำ `/check-reference` เพื่อตรวจสอบไม่มี broken references
2. สแกน secrets: ตรวจสอบว่าการแก้ไขไม่ได้แนบ secrets, API keys, หรือ credentials เข้าไป — ถ้า config มี sensitive values ให้ใช้ environment variables แทน
3. ทำ `/run-check` เพื่อตรวจสอบ lint, typecheck, และ scan
4. ทำ config-specific validation ตามตารางใน Rules section `Config-Specific Validation`
5. ถ้ามี errors ให้ทำ `/resolve-errors` ก่อน — ถ้าแก้ไม่ได้ภายใน 3 ครั้ง → rollback และ report
6. ถ้าเป็น `.github/workflows/*.yml` → ตรวจสอบว่า workflow syntax ถูกต้องและ secrets อ้างอิงถูกทุกตัว

### 6. Verify And Finalize

> Goal: ยืนยันว่าการเปลี่ยนแปลงทำงานได้จริงและไม่ทำลายอะไร
> Goal: ยืนยันการทำงานจริง ลบ temp files และสรุปผล

1. ถ้าเป็น build config → ทดสอบ `bun run build` ว่าผ่าน
2. ถ้าเป็น CI/CD config → ตรวจสอบว่า pipeline จะไม่ fail จากการเปลี่ยนแปลง
3. ลบไฟล์สำรองใน `temp/` หลังยืนยันว่าการแก้ไขผ่านทุก validation
4. ถ้า validation ไม่ผ่านและแก้ไม่ได้ → rollback ด้วย `git checkout <hash> -- <file>` และ report
5. สรุปการเปลี่ยนแปลง: ไฟล์ที่แก้, ค่าที่เปลี่ยน, impact ที่ตรวจสอบแล้ว

## Rules

### 1. Safety And Rollback

- ตรวจสอบ git working tree สะอาดก่อนแก้เสมอ — ถ้าไม่สะอาด → ถามผู้ใช้ก่อน
- เก็บ commit hash ก่อนแก้เสมอเพื่อใช้ rollback ด้วย `git checkout <hash> -- <file>`
- ไฟล์ที่ไม่ถูก track โดย git → สร้างสำเนาใน `temp/` ก่อนแก้
- ถ้า validation ไม่ผ่านภายใน 3 ครั้ง → rollback และ report (ไม่ฝืนแก้ต่อ)
- ห้ามแก้ไข config หลายไฟล์พร้อมกันโดยไม่มี rollback plan

### 2. Understand Before Edit

- อ่านและเข้าใจ config file ก่อนแก้ไขเสมอ
- ทำ `/follow-best-practice` หรือ `/learn-from-web` สำหรับ tool ที่ไม่คุ้นเคย
- ตรวจสอบ official documentation ของ tool นั้นๆ ก่อนเปลี่ยน settings
- ไม่เดาค่า config โดยไม่เข้าใจผลกระทบ — ถ้าไม่แน่ใจ → ถามผู้ใช้

### 3. Minimal And Precise

- แก้ไขเฉพาะจุดที่จำเป็น ไม่เปลี่ยน settings อื่นที่ไม่เกี่ยวข้อง
- ทำ `/dont-over-engineer` เสมอ
- ห้าม auto-format หรือ restructure config file ทั้งหมดเพื่อแก้จุดเดียว
- รักษา indentation และ style เดิมของ config file

### 4. Secrets And Security

- ห้ามใส่ secrets, API keys, passwords, หรือ credentials ลงใน config file โดยตรง
- ใช้ environment variables หรือ secrets manager (เช่น Infisical) สำหรับ sensitive values
- หลังแก้ไข → ตรวจสอบว่าไม่มี secrets รั่วในไฟล์ที่แก้
- ถ้า config มี `env` หรือ `secrets` field → ตรวจสอบว่าอ้างอิง environment variables ไม่ใช่ hardcoded values
- ทำ `/run-audit` ถ้าการแก้ไขเกี่ยวข้องกับ dependencies หรือ security settings

### 5. Consistency Across Workspaces

- ถ้าเป็น monorepo ตรวจสอบว่าการเปลี่ยนแปลงต้อง sync ข้าม workspaces หรือไม่
- Config ใน root ควรเป็น base สำหรับ workspaces
- Workspace-specific config ควร override เฉพาะที่จำเป็น
- ตรวจสอบความสม่ำเสมอของ terminology และ format ทั่วทั้ง configs

### 6. Config-Specific Validation

หลังแก้ไข ต้อง validate ตามประเภทของ config file:

| Config File | Validation Command | Pass Condition |
|-------------|-------------------|----------------|
| `vite.config*.ts` | `bun --filter website build` | Build สำเร็จไม่มี error |
| `turbo.json` | `bun run build` | Turbo รันได้ไม่มี config error |
| `package.json` | `bun install --frozen-lockfile` | Install สำเร็จ lockfile ไม่ conflict |
| `tsconfig.json` | `bun run typecheck` | Typecheck ผ่าน |
| `biome.jsonc` | `bunx biome lint` | Lint รันได้ไม่มี config error |
| `lefthook.yml` | `bunx lefthook validate` | Validate ผ่าน |
| `uno.config.ts` | `bun --filter website build` | Build สำเร็จ CSS ไม่ broken |
| `drizzle.config.ts` | `bun --filter website db:generate` | Migration generate สำเร็จ |
| `.github/workflows/*.yml` | ตรวจสอบ syntax ด้วย YAML parser | YAML valid, secrets อ้างอิงถูก |
| `playwright.config.ts` | `bun run test:e2e --list` | Test list ไม่มี error |

### 7. Use Scripts For Complex Edits

- ถ้าต้องแก้ config มากกว่า 5 ไฟล์ → ใช้ `/use-scripts` เพื่อ automate การแก้และ validate
- Script ต้องมี dry run mode เพื่อ preview ก่อน execute จริง
- Script ต้อง validate config structure หลังแก้ (เช่น JSON/YAML schema validation)
- ลบ scripts จาก `temp/` และ `.devin/scripts/temp/` หลังใช้งาน

## Expected Outcome

- Configuration files ถูกแก้ไขอย่าง precise, minimal และปลอดภัย
- มี rollback path ชัดเจนหากการแก้ไขไม่ผ่าน validation
- การเปลี่ยนแปลงผ่าน validation ครบทุกประเภทตาม Config-Specific Validation table
- ไม่มี broken references และไม่มี secrets รั่วหลังการแก้ไข
- Config สอดคล้องกันทั่ว monorepo ถ้ามีการ sync ข้าม workspaces
- ไฟล์สำรองใน `temp/` ถูกลบหลังยืนยันการแก้ไขสำเร็จ
