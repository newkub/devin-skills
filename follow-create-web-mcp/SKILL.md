---
name: follow-create-web-mcp
description: เพิ่ม WebMCP tools ให้ web page ผ่าน document.modelContext ให้ agent discover+invoke
argument-hint: "[feature-or-tool-name]"
related:
  - follow-create-web
  - follow-create-mcp
  - use-agent-browser
  - use-chrome-devtools
  - deep-review
  - deep-research
  - follow-best-practice
  - deep-validate
---

## Goal

เพิ่ม WebMCP tools ให้ web page/web app (page-provided tools ที่ agent discover และ invoke ผ่าน `document.modelContext`) — เว็บทำหน้าที่เหมือน "MCP server ใน client-side script" แทนที่จะเป็น process ภายนอก

## Scope

- เฉพาะฝั่ง page (producer) — implement/register tools ในเว็บที่มีอยู่หรือกำลังสร้าง
- ขอบเขต skills ที่เกี่ยวข้อง:
  - external MCP server (stdio/HTTP process ที่ client spawn) → `/follow-create-mcp`
  - consume/invoke WebMCP ของเว็บที่มีอยู่ → `/use-agent-browser` (`webmcp list`/`invoke`)
  - inspect/debug browser ระหว่างพัฒนา → `/use-chrome-devtools`
  - เลือก framework/สร้าง web project ใหม่ → `/follow-create-web`
- WebMCP เป็น experimental spec (W3C Web Machine Learning CG draft) — declarative form-based API ยังเป็น TODO ใน spec → ใช้ imperative API และ research ก่อนเสมอ
- browser support: Chrome launch feature เท่านั้น (`agent-browser` เปิด default, `--no-webmcp` ปิด) — Safari/Firefox/remote providers ยังไม่รองรับ → เว็บต้องทำงานได้เต็มรูปแบบโดยไม่มี WebMCP

## Execute

### 1. Research Spec

> Goal: ยืนยัน API ล่าสุดก่อนเขียน — spec เป็น draft เปลี่ยนได้

1. ทำ `/deep-research` + `/follow-best-practice` — sources: `https://webmachinelearning.github.io/webmcp/` (spec) และ `https://agent-browser.dev/webmcp` (consumer reference)
2. ยืนยัน shape ปัจจุบันของ `document.modelContext` และ status ของ declarative API ก่อน implement

### 2. Design Tool Surface

> Goal: ตัดสินใจ expose อะไรให้ agent

1. เริ่มจาก read/query tools (`readOnlyHint: true`) ก่อน — เช่น search, get-state, filter; เพิ่ม mutation tools เฉพาะที่จำเป็น
2. `name`: 1-128 chars, เฉพาะ `[A-Za-z0-9_.-]` — ใช้ verb_noun เช่น `search_products`, `cart.add`
3. `description`: บอก when/how to use ตรงๆ — agent อ่าน description เพื่อตัดสินใจเรียก; ห้ามใส่ hidden instructions หรือ prompt injection
4. `inputSchema`: JSON Schema object — เก็บเฉพาะ fields ที่จำเป็น (over-parameterization = privacy risk ตาม spec §6.3.3)
5. `annotations`: `readOnlyHint`, `consequentialHint`, `untrustedContentHint`, `debugging` — ตั้งให้ตรง behavior จริง

### 3. Implement Registration

> Goal: register tools ถูก lifecycle

1. Feature-detect ก่อนเสมอ: `if (!('modelContext' in document)) return` — API เป็น SecureContext (ต้อง HTTPS/localhost)
2. Register เมื่อ document fully active (DOM ready หรือ framework mount) — register เร็วเกินได้ `InvalidStateError`
3. `document.modelContext.registerTool({ name, title, description, inputSchema, execute, annotations }, { signal })` — เก็บ `AbortController` ไว้ unregister ตอน teardown หรือ SPA route change
4. `execute: async (inputObject, { signal }) => {...}` — validate input ใน callback เสมอ (inputSchema ไม่ enforce ให้), honor `signal` สำหรับ cancellation, return JSON-serializable result
5. Cross-origin iframe tools: `registerTool(tool, { exposedTo: [origins] })`; in-page agent query ด้วย `getTools({ fromOrigins: [...] })`

### 4. Safety And UX

> Goal: tools ปลอดภัยสำหรับ agent และ user

1. consequential actions (payment, delete, irreversible) → `consequentialHint: true` + UI confirmation จริง — agent อาจ trigger โดยไม่ได้ตั้งใจ (spec §6.3.2)
2. output ที่มี third-party/user-generated content → `untrustedContentHint: true`
3. `title` ควร localize ตาม user language สำหรับ browser UI
4. อย่า leak session/auth/private data ผ่าน tool output — tools รันใน authenticated context ของ user (spec §6.3.4)
5. embedder ที่ไม่ต้องการให้เพจ register tools → ใช้ Permissions-Policy `tools=()`

### 5. Fallback

> Goal: เว็บใช้งานได้เต็มรูปแบบโดยไม่มี WebMCP

1. WebMCP เป็น enhancement — UI ปกติต้องทำงานครบทุก flow; tools เรียก app logic เดียวกับ UI handlers ไม่เขียน logic แยก
2. อย่า assume agent จะใช้ WebMCP — หน้าที่ยังไม่ register จะ expose `tools: []` เสมอ

### 6. Test Discovery And Invocation

> Goal: verify agent เจอและเรียก tools ได้จริง

1. dev server รันอยู่ → `/use-agent-browser`: `agent-browser webmcp list --json` ต้องเห็น tools ที่ register
2. `agent-browser webmcp invoke <name> --params '{...}'` — ทดสอบ happy path, invalid input, consequential confirm และ cancellation
3. debug page-side ด้วย `/use-chrome-devtools`: `evaluate_script` → `await document.modelContext.getTools()` และ `list_console_messages` ดู registration errors
4. unit-test logic ของ `execute` callback แยกจาก registration (WebMCP ต้อง Chrome flag — e2e ใน `/run-test e2e` ทำได้แต่ต้องเปิด feature)
5. SPA/iframe: ตรวจ tools ขึ้น/ลงถูกตาม route ผ่าน `toolchange` event

### 7. Ship

> Goal: review และ validate ก่อนส่งมอบ

1. ทำ `/deep-review` — domains `review-frontend` และ `review-mcp` มี `### WebMCP` checklist สำหรับ review implementation นี้
2. ทำ `/deep-validate` แล้ว `/ship-to-dev-branch` ตาม flow ของ project

## Rules

### 1. Trust Boundary

- tool metadata (name/description) และ output เป็น untrusted input สำหรับ agent — เขียนให้ตรงกับพฤติกรรมจริง ไม่ embed instructions
- agent input เป็น untrusted สำหรับเว็บ — validate `inputObject` ทุก field ใน `execute` ก่อนประมวลผล
- ห้าม auto-execute consequential tools โดยไม่มี user-visible confirmation

### 2. Tool Design

- เริ่ม read-only ก่อน — เพิ่ม mutation/consequential เมื่อมีเหตุผลชัดเจน
- schema minimal: required fields เท่าที่จำเป็น, `enum` สำหรับค่าจำกัด, `title` สำหรับ display
- tools ควร idempotent เท่าที่ทำได้ — agent อาจ retry หรือ invoke ซ้ำ

### 3. Lifecycle

- register หลัง document fully active; abort `signal` เพื่อ unregister ตอน unmount/navigation
- duplicate `name` ใน document เดียว → `InvalidStateError` — namespace tools ด้วย `.` หรือ `_` เมื่อมีหลาย widgets

### 4. Formatting

- ห้ามใช้ `**` (bold markers); ใช้ backticks สำหรับ API, commands, paths, skill names
- รายงานผลด้วย `/report`

- ใช้ /follow-create-mcp ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /use-agent-browser ถ้าจำเป็น
- ใช้ /use-chrome-devtools ถ้าจำเป็น

## Expected Outcome

- `agent-browser webmcp list` เห็น tools ทั้งหมดที่ register
- `agent-browser webmcp invoke` ทำงานถูกทั้ง success, error และ cancel paths
- เว็บใช้งานได้เต็มรูปแบบบน browser ที่ไม่รองรับ WebMCP
- consequential tools มี `consequentialHint` + user confirmation ครบ
- ผ่าน `/deep-review` และ `/deep-validate`
