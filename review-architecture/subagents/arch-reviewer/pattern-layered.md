# Pattern: Layered Architecture

กำหนดโครงสร้างด้วย Layered Architecture — presentation, domain, data ชี้ลงทางเดียว ไม่ bypass — เหมาะกับ app เดียว (single app) ที่ไม่ต้องแชร์ modules ข้าม entry points

#### Execute — Layered

##### 1. Choose Variant

1. Traditional — `presentation/` `domain/` `data/` ตรงๆ (app เล็ก-กลาง)
2. Feature-based — `features/<name>/{presentation,domain,data}` (app โตขึ้น หลาย capabilities)
3. Four-layer — เพิ่ม `application/` ระหว่าง presentation กับ domain เมื่อมี orchestration ซับซ้อน
4. Hybrid — ผสมตามขนาดจริง; Nuxt → map `pages/`+`components/` → presentation, `composables/`+`server/services/` → domain, `server/api/`+`server/db/` → data

##### 2. Structure Layers

1. วาง file structure ตาม `follow-layered-arch/templates/file-structure.md` — `presentation/` (routes/pages/components/middleware), `domain/` (services/models ต่อ capability), `data/` (repositories/clients/database), `shared/` (pure utils), `config/`
2. ย้าย UI/routes → `presentation/`; business rules → `domain/`; persistence/external calls → `data/` — concerns ปนกัน → `/separate-of-concerns` ก่อนจัด layer
3. แต่ละ layer มี `index` barrel — public API ของ layer เท่านั้น

##### 3. Enforce Boundaries

1. `presentation` → `domain` → `data` เท่านั้น — ห้าม bypass (presentation เรียก data ตรง) และห้ามชี้ขึ้น
2. ใช้ path aliases ของ project แทน relative imports ข้าม layer
3. `shared/` pure เท่านั้น — ทุก layer ใช้ได้ ห้ามใส่ business logic/IO

##### 4. Validate Boundaries

1. ไม่มี layer bypass และไม่มี deep imports ข้าม layer
2. รัน `madge` หา circular dependencies
3. tests align ตาม layers: unit → `domain/`, integration → `data/`, e2e → `presentation/`
4. ทำ `/refactor` structure scope หลัง restructure

#### Rules — Layered

##### 1. Single Direction

- dependencies ชี้ลงทางเดียวเสมอ — ห้าม bypass หรือชี้ขึ้น
- public API ผ่าน `index` entry point ของแต่ละ layer

##### 2. Layer Responsibilities

- `presentation/` = handlers/controllers เท่านั้น — ห้ามมี business rules หรือ queries
- `domain/` = services/use cases/models — ไม่รู้จัก transport details
- `data/` = repositories/clients/migrations — leaf layer

##### 3. When To Use

- app เดียว — `apps/*` ตัวเดียวหรือ single-app project, UI-driven/CRUD
- หลาย apps ต้อง unified support หรือ `packages/`/`crates/` → ใช้ `pattern-clean.md`

##### 4. Language Support

- TypeScript, Python, Java, C#, Kotlin — map layers ตาม module/package system ของภาษา

- ใช้ /follow-monorepo ถ้าจำเป็น
- ใช้ /separate-of-concerns ถ้าจำเป็น

#### Expected Outcome — Layered

- layers แยกชัดตาม variant ที่เลือก — ไม่ bypass, dependencies ชี้ลงทางเดียว
- barrel exports สม่ำเสมอ; ไม่มี circular dependencies
- routes/pages ทำงานเหมือนก่อน restructure
