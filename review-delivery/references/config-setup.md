# Config Setup And Review

## Goal
ตั้งค่า configuration ตาม dependencies และ tech stack ที่ใช้ใน project
## Scope
ใช้สำหรับตั้งค่า configuration ทั้งใน root workspace และ packages/apps ใน monorepo
## Execute
### 1. Identify Target
> Goal: ระบุ target ที่จะตั้งค่า config
1. ถ้ามี target จาก context หรือ argument ให้ใช้ target นั้น
2. ถ้ามี argument workspace/file path → ทำเฉพาะ workspace นั้น
3. ถ้าไม่มี target ให้ทำ root และทุก workspace ใน monorepo
4. บันทึก target list ก่อนไป step ถัดไป
### 2. Analyze Dependencies
> Goal: ตรวจสอบ dependencies และ config files ใน target
1. อ่าน `package.json` ใน root และ target workspaces
2. ตรวจสอบ config files ที่มีอยู่ (`biome.jsonc`, `tsconfig.json`, `moon.yml`, `lefthook.yml`)
3. ระบุ tech stack ที่ใช้ (Bun, TypeScript, Biome, Moonrepo, Drizzle, etc.)
### 3. Check Workflows And Skills
> Goal: ตรวจสอบ global workflows และ skills ที่เกี่ยวข้อง
1. อ่าน `related` ของ skills ที่เกี่ยวข้องกับ config (เช่น `/follow-package-manifest`, `/follow-tool-biome`)
2. ตรวจสอบ skills ที่เกี่ยวข้องกับ stack ที่ใช้
3. ระบุ workflows ที่ต้องรันตาม stack (เช่น `/follow-tool-biome`, `/follow-tool-moonrepo`, `/follow-lang-typescript`)
### 4. Run Required Workflows
> Goal: รัน workflows ที่จำเป็นตาม stack ที่ใช้
1. รัน `/follow-package-manifest` สำหรับ scripts ใน `package.json`
2. รัน workflows ตาม tech stack (เช่น `/follow-tool-biome`, `/follow-tool-moonrepo`, `/follow-lang-typescript`)
3. รัน workflows สำหรับ tools ที่มี (เช่น `/follow-tool-hk`, `/follow-tool-ast-grep`)
4. รัน `/follow-dot-vscode` สำหรับ `.vscode/` directory setup
5. รัน `/follow-dot-github` สำหรับ `.github/` directory setup
6. ตรวจสอบว่า config files ถูกต้องและสอดคล้องกัน
### 5. Coordinate With Build And Tasks
> Goal: ประสานงานกับ build และ task configuration
1. ถ้ายังไม่ได้รัน → ทำ `/follow-tasks` สำหรับ target workspaces
2. ถ้ามี build config ให้รัน build script จาก `package.json` หรือทำ `/follow-package-manifest`
3. บันทึก dependencies ระหว่าง config, scripts, build ที่ต้อง sync
4. ถ้าถูกเรียกจาก skill orchestrator อื่น ให้รายงานผลกลับไปยัง orchestrator
## Rules
### 1. Integration With Orchestrator
รองรับการถูกเรียกจากภายนอกและ monorepo context
- สามารถถูกเรียกโดย skill อื่นหรือ standalone
- รับ target เป็น root, workspace, หรือทุก workspace
- ถ้าถูกเรียกจาก skill อื่น ให้รายงานผลกลับไปยัง caller
- ประสานงานกับ `/follow-tasks` และ build scripts เพื่อ sync config, scripts, build
### 2. Stack-Specific Configuration
ตั้งค่าตาม tech stack ที่ใช้
- ใช้ `bun` สำหรับ package manager และ runtime
- ใช้ `biome` สำหรับ linting และ formatting
- ใช้ `Moonrepo` สำหรับ monorepo management
- ใช้ `typescript` สำหรับ type safety
- ใช้ `lefthook` สำหรับ git hooks
- ใช้ `ast-grep` สำหรับ code search และ transformation
### 3. Minimal And Necessary
รันเฉพาะที่จำเป็น
- รันเฉพาะ workflows ที่เกี่ยวข้องกับ stack ที่ใช้
- ไม่รัน workflows ที่ไม่จำเป็น
- ตรวจสอบ dependencies ก่อนรัน workflows
- รัน workflows ตามลำดับที่เหมาะสม (foundation ก่อน)
### 4. Consistency Across Workspaces
รักษาความสม่ำเสมอทั่ว monorepo
- Config files ใน root ควรเป็น base สำหรับทุก workspace
- Workspace-specific config ควร override เฉพาะที่จำเป็น
- Scripts ใน `package.json` ควรสอดคล้องกัน
- Linting rules ควรสอดคล้องกันทั่วทั้ง project
## Expected Outcome
- Configuration files ตั้งค่าถูกต้องตาม tech stack
- Workflows ที่จำเป็นถูกรันและผ่าน
- Config สอดคล้องกันทั่ว monorepo
- Scripts ใน `package.json` พร้อมใช้งาน