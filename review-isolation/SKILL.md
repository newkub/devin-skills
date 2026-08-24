---
name: review-isolation
description: Review isolation ของ project ครอบคลุง boundaries, dependencies, coupling, state isolation, enviro...
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - review-codebase
  - suggest-next-action
  - validate
---

## Goal

Review isolation ของ project ครอบคลุง boundaries, dependency directions, coupling, state separation, environment boundaries พร้อม review score

## Scope

isolation review สำหรับ: module boundaries, package boundaries, dependency directions, coupling, circular dependencies, side effects, global state, singleton/shared state, environment separation, test isolation, process/container isolation, data isolation, leaky abstractions, namespace boundaries, interface boundaries, API boundaries

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ isolation ปัจจุบัน

1. ทำ `/scan-codebase` เพื่อเข้าใจ isolation structure
2. ทำ `/review-codebase` เพื่อหา issues ที่เกี่ยวข้อง
3. ระบุ module/package structure, dependency graph, shared state, test strategy, environment separation ที่ใช้
4. ถ้าไม่พบ issues -> stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุงทุก isolation dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ isolation patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต `ast-grep` rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` -> ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้
5. ทำ `/run-review` เพื่อดึง metrics ล่าสุด
6. ถ้า project มี review CLI ให้รัน `bun --filter tools-review review:json` เพื่อดึง review report พร้อม metrics

### 3. Isolation, Boundaries And Dependencies Review

> Goal: ตรวจสอบ isolation, boundaries, dependencies โดยไม่แก้ไข code

#### 3.1 Isolation Review

1. ตรวจสอบ module isolation: แต่ละ module มี single responsibility หรือไม่, hidden internals, public API ชัดเจน
2. ตรวจสอบ state isolation: global state vs local state, shared mutable state, singleton/shared instances, race conditions
3. ตรวจสอบ side effect isolation: I/O, network, file system, environment, logging ถูกกักกันหรือกระจาย
4. ตรวจสอบ test isolation: tests ไม่ขึ้นต่อลำดับ, shared fixtures, database state, mocked boundaries
5. ตรวจสอบ environment isolation: dev/staging/prod separation, secrets/config isolation, container/process boundaries
6. ตรวจสอบ data isolation: tenant data, user data, session data, cache data แยกกัน

#### 3.2 Boundaries Review

1. ตรวจสอบ module boundaries: clear import/export boundaries, ไม่เข้าถึง internal ข้าม module, ไม่ bypass layers
2. ตรวจสอบ package boundaries: package-level visibility, public vs internal API, barrel exports, cyclic package references
3. ตรวจสอบ interface boundaries: interfaces/ports กั้นระหว่าง domain กับ infrastructure, adapter/facade boundaries
4. ตรวจสอบ API boundaries: service boundaries, version boundaries, contract boundaries
5. ตรวจสอบ namespace/folder boundaries: group by feature/domain, ไม่ผสม concerns ต่างกัน

#### 3.3 Dependencies Review

1. ตรวจสอบ dependency direction: domain ไม่พึ่ง infrastructure, inner layers ไม่พึ่ง outer layers (Dependency Rule)
2. ตรวจสอบ circular dependencies: import cycles ระหว่าง modules/packages, file cycles, type cycles
3. ตรวจสอบ coupling: tight coupling ระหว่าง modules, shared knowledge, hardcoded dependencies
4. ตรวจสอบ dependency graph: depth, fan-in, fan-out, unstable modules ที่หลายส่วนพึ่งพา
5. ตรวจสอบ external dependencies: third-party libraries ถูก isolate ด้วย abstraction/adapter, vendor lock-in
6. ตรวจสอบ transitive dependencies: ไม่ expose internal dependencies ผ่าน public API

#### Severity Notes

- Critical: global mutable state ใน critical path, circular dependency ระหว่าง core modules, broken test isolation ที่ทำให้ flaky, no environment separation ระหว่าง prod กับ non-prod
- High: tight coupling ระหว่าง modules, missing boundaries ระหว่าง layers, shared state ที่ไม่จำเป็น, leaky abstraction, missing dependency direction
- Medium: inconsistent module boundaries, minor side effect leak, missing test isolation, minor namespace misuse
- Low: cosmetic, minor dependency cleanup, documentation gap

### 4. Validate, Rate And Report

> Goal: Issues ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical -> High -> Medium -> Low
4. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) -> weighted average
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี module/package structure -> ข้าม Step 3.2 และ 3.3 item ที่เกี่ยวกับ package boundaries
- ถ้า project ไม่มี tests -> ข้าม Step 3.1 item 4
- ถ้า project ไม่มี container/process separation -> ข้าม Step 3.1 item 5

### 2. Severity Classification

- Critical: global mutable state ใน critical path, circular dependency ระหว่าง core modules, broken test isolation ที่ทำให้ flaky, no environment separation ระหว่าง prod กับ non-prod
- High: tight coupling ระหว่าง modules, missing boundaries ระหว่าง layers, shared state ที่ไม่จำเป็น, leaky abstraction, missing dependency direction
- Medium: inconsistent module boundaries, minor side effect leak, missing test isolation, minor namespace misuse
- Low: cosmetic, minor dependency cleanup, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ระบุ module, package, boundary, หรือ dependency ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ลบไฟล์ ไม่ลบ code ไม่เปลี่ยนแปลง dependencies

### 5. No Deletions

- ห้ามลบไฟล์, โค้ด, dependencies, หรือ configuration ระหว่าง review
- ห้ามทำ destructive changes ใด ๆ

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง findings จากทุก isolation, boundaries, dependencies section
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
