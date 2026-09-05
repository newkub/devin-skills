---
name: follow-harness-engineering
description: สร้างและปรับปรุง AI agent harness เพื่อ reliability และ verifiable execution
argument-hint: "[scope]"
related:
  - follow-context-engineering
  - review-codebase-everything
  - deep-validate
  - run-test
---

## Goal

สร้างและปรับปรุง AI agent harness (runtime infrastructure layer) เพื่อ reliability, verifiable execution, และ auditable agent workflows

## Scope

ใช้สำหรับ project ที่มี AI agent infrastructure เช่น MCP servers, agent runtimes, tool interfaces, หรือ coding agent systems ที่ต้องการ harness-level engineering

ดูเพิ่มเติม: /review-codebase-everything

## Execute

### 1. Assess Harness Components

> Goal: Assess Harness Components

ประเมิน harness components ตาม ETCLOVG taxonomy

1. ตรวจสอบ Execution environment: sandbox, runtime, resource limits, isolation
2. ตรวจสอบ Tool interface: tool definitions, input/output schemas, error handling, token efficiency
3. ตรวจสอบ Context management: context selection, compaction, memory ทำ `/follow-context-engineering`
4. ตรวจสอบ Lifecycle/Orchestration: agent loop, state management, retry logic, recovery
5. ตรวจสอบ Observability: logging, tracing, metrics, execution traces ทำ `/deep-review`
6. ตรวจสอบ Verification: test harness, requirement checks, output validation ทำ `/deep-validate`
7. ตรวจสอบ Governance: permissions, access control, audit trail, intervention recording

### 2. Optimize Tool Interface

> Goal: Optimize Tool Interface

ปรับปรุง tool interface ให้มีประสิทธิภาพ

1. ตรวจสอบว่า tools มี input/output schemas ชัดเจน ใช้ `Zod` สำหรับ validation
2. ตรวจสอบว่า tools ไม่มี functionality ซ้ำซ้อนกัน
3. ตรวจสอบว่า tool descriptions ชัดเจน ไม่กำกวม และเพียงพอสำหรับ model เลือกใช้ได้ถูกต้อง
4. ตรวจสอบว่า tools return ข้อมูลกระชับ ไม่ bloated output
5. ตรวจสอบ error handling ของ tools: มี structured error responses ไม่ crash ทั้งระบบ
6. ถ้าเป็น MCP server ให้ทำตาม `mcp-builder` skill

### 3. Strengthen Lifecycle And Orchestration

> Goal: Strengthen Lifecycle And Orchestration

ปรับปรุง agent lifecycle และ orchestration

1. ตรวจสอบ agent loop: มี termination conditions ชัดเจน ไม่วนลูปไม่มีที่สิ้นสุด
2. ตรวจสอบ state management: state ถูก persist และ restore ได้ถูกต้อง
3. ตรวจสอบ retry logic: มี exponential backoff สำหรับ transient failures
4. ตรวจสอบ recovery: มี graceful degradation เมื่อ service ล่ม
5. ถ้ามี multi-agent orchestration: ตรวจสอบ coordination, message passing, และ error propagation

### 4. Improve Observability

> Goal: Improve Observability

เพิ่ม observability สำหรับ auditable execution

1. บันทึก execution traces: action, tool call, context, verification, failure attribution
2. ใช้ structured logging สำหรับทุก tool call และ agent decision
3. บันทึก intervention: เมื่อมี human intervention ให้บันทึก context และ reason
4. ตรวจสอบ entropy: บันทึก unrelated changes ที่ agent ทำเกินจำเป็น
5. ทำ `/deep-review` สำหรับ comprehensive observability improvements

### 5. Implement Verification

> Goal: Implement Verification

สร้าง verification layer สำหรับ verifiable execution

1. กำหนด requirement checks สำหรับทุก task: อะไรบ้างที่ต้องผ่าน
2. สร้าง deterministic checks: test suite, type check, lint, build
3. สร้าง behavioral checks: output format validation, schema compliance
4. บันทึก verification results เป็น structured reports
5. ทำ `/run-test` และ `/deep-validate` สำหรับ comprehensive verification

### 6. Apply Harness Ladder

> Goal: Apply Harness Ladder

ประเมินและปรับปรุง harness level ตาม H0-H3 ladder

1. H0 (Raw model): model ทำงานเอง ไม่มี runtime support ระบุว่า project อยู่ที่ level ใด
2. H1 (Tool harness): model มี tools และ file access ตรวจสอบ tool quality
3. H2 (Context-memory harness): model มี context management และ persistent memory ทำ `/follow-context-engineering`
4. H3 (Full harness): model มี verification, observability, governance ตรวจสอบครบทุก layer
5. วางแผนการยกระดับจาก level ปัจจุบันไปสู่ level ที่สูงขึ้น

### 7. Evaluate Harness Quality

> Goal: Evaluate Harness Quality

ประเมิน harness quality ผ่าน trace-based evaluation

1. รัน agent บน controlled task และบันทึก execution trace
2. วิเคราะห์ trace: ตรวจสอบ action, tool usage, context selection, verification
3. ระบุ execution-alignment failures: reasoning ที่ไม่ตรงกับ tool feedback หรือ workspace state
4. ประเมิน: completion rate, process quality, efficiency, failure behavior
5. สร้าง episode package: final artifact, execution trace, usage stats, validator output

## Rules

### 1. ETCLOVG Coverage

harness ต้องครอบคลุม 7 layers

- Execution environment: sandbox, runtime, isolation
- Tool interface: schemas, validation, token efficiency
- Context management: selection, compaction, memory
- Lifecycle/Orchestration: loop, state, retry, recovery
- Observability: logging, tracing, metrics
- Verification: requirement checks, output validation
- Governance: permissions, audit, intervention

### 2. Verifiable Execution

ทุก agent action ต้อง verifiable ได้

- บันทึก execution trace สำหรับทุก agent run
- มี deterministic checks สำหรับทุก task
- บันทึก failure attribution เมื่อ agent ล้มเหลว
- บันทึก intervention เมื่อมี human แทรกแซง
- สร้าง episode package สำหรับ audit

### 3. Tool Quality

tools ต้องมีคุณภาพสูง

- มี `Zod` schemas สำหรับ input/output validation
- ไม่มี functionality ซ้ำซ้อน
- descriptions ชัดเจน เพียงพอสำหรับ model เลือกใช้
- return ข้อมูลกระชับ ไม่ bloated
- มี structured error handling ไม่ crash ทั้งระบบ

### 4. Model-Harness Separation

แยก model capability จาก harness capability

- ประเมิน performance ที่ model-harness configuration level ไม่ใช่ model เพียงอย่างเดียว
- harness-only gains มี impact มากกว่า model gains ในหลายกรณี
- ปรับปรุง harness ก่อนเปลี่ยน model
- บันทึก harness configuration สำหรับ reproducibility

### 5. Safety And Governance

harness ต้องมี safety measures

- มี permissions สำหรับทุก tool action
- บันทึก audit trail สำหรับทุก action
- มี kill switch สำหรับหยุด agent
- จำกัด resource usage (tokens, time, file access)
- มี human-in-the-loop สำหรับ high-risk actions

## Expected Outcome

- Harness ครอบคลุม ETCLOVG 7 layers ครบถ้วน
- Tool interface มีคุณภาพสูง ไม่ซ้ำซ้อน มี validation
- Execution traces ถูกบันทึกสำหรับ audit
- Verification ครบถ้วน: deterministic + behavioral checks
- Harness level ถูกประเมินและยกระดับ
- Agent reliability ดีขึ้นจาก harness improvements ไม่ใช่ model เพียงอย่างเดียว
