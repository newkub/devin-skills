# Pattern: Clean Architecture

กำหนดโครงสร้างด้วย Clean Architecture — pure domain core, use cases orchestrate ผ่าน ports, infrastructure implement adapters — dependency ชี้เข้าหา domain เท่านั้น; เหมาะกับหลาย apps/entry points ที่ต้อง unified support (modules แชร์ข้าม apps) และ `packages/*`/`crates/*`

#### Execute — Clean

##### 1. Map Concerns To Layers

1. ระบุ pure domain logic — types, rules, calculations ที่ไม่มี IO/framework imports
2. ระบุ use cases/orchestration — transaction boundaries, workflows
3. ระบุ IO/framework code — database, http, queue, external services
4. ระบุ public API (barrel `index`, exported symbols) ที่ต้องรักษา

##### 2. Structure Modules

1. วาง file structure ตาม `follow-clean-arch/templates/file-structure.md` — `modules/<name>/{domain,features,ports,adapters}` + `index.ts`, `core/` (+`ports/`), `adapters/`, `infra/`, `contracts/`, `config/`, `app/` composition root
2. แต่ละ module มี `index.ts` barrel — public API เท่านั้น
3. ย้าย pure logic → `domain/`; use cases → `features/`; interfaces → `ports/`; IO → `infra/`/`adapters/` — concerns ปนกัน → `/separate-of-concerns` ก่อนจัด layer

##### 3. Enforce Dependency Direction

1. `core` ← `modules` ← `adapters`/`infra` ← `app` — ห้ามกลับทิศ
2. `app/runtime.ts` เป็น composition root เดียวที่ wire ports → implementations
3. modules ข้ามกันผ่าน `contracts/` events หรือ ports — ห้าม import module อื่นตรงๆ

##### 4. Validate Boundaries

1. ไม่มี import จาก `core/`/`modules/*/domain`/`features` ไป `infra/`/`adapters/`
2. รัน `madge` หา circular dependencies
3. domain unit tests ไม่ mock IO (pure); features tests mock ports เท่านั้น
4. ทำ `/refactor` structure scope หลัง restructure

#### Rules — Clean

##### 1. Domain Purity

- `domain/` + `core/` ต้อง pure — ไม่มี IO, framework imports, side effects
- `ports/` เป็น interfaces เท่านั้น — ไม่มี implementation
- ไม่มี `fx/` layer — side effects อยู่ `infra/` orchestrate ผ่าน `features/` + ports

##### 2. Boundaries

- public API ผ่าน `index` เท่านั้น — ห้าม deep imports ข้าม layer/module จากภายนอก
- infrastructure เปลี่ยนได้โดยไม่แก้ `domain/`/`features/`
- `contracts/` + `config/` เป็น leaf — ทุก layer ใช้ได้แต่ห้าม import กลับ

##### 3. Splitting Thresholds

- module ใหญ่เกิน/หลาย bounded context → แยกเป็น module ใหม่
- port ต่อ external dependency เดียว — ห้าม port รวมหลาย service
- ไฟล์ >250 บรรทัด → split ตาม `/refactor` structure scope

##### 4. When To Use

- หลาย `apps/*` ต้องแชร์ `modules/`/`core/`/`contracts/` ร่วมกัน (unified support)
- `packages/*`, `crates/*` shared libraries, domain packages
- domain-heavy, testability สูง — app เดียว UI-driven/CRUD → ใช้ `pattern-layered.md`

##### 5. Language Support

- TypeScript, Rust, Go, Python, Kotlin, Swift — map layers ตาม module system ของภาษา (crate/module/package)

- ใช้ /follow-event-driven ถ้าจำเป็น
- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /separate-of-concerns ถ้าจำเป็น

#### Expected Outcome — Clean

- `modules/` แยกตาม bounded context — `domain/` pure, `features/` orchestrate ผ่าน `ports/`, `infra/`/`adapters/` implement adapters
- `app/` composition root wire ทั้งหมด — entry points (api/web/cli/worker/cron) แชร์ modules เดียวกัน
- ไม่มี circular dependencies; public API เดิมใช้ได้
