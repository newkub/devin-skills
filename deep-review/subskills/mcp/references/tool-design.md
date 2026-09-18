# Tool Design Checklist — review-mcp

## Naming And Surface

- [ ] `verb-noun` naming consistent ทั้ง server — `list_issues`, `create_pr` ไม่ปน `issues_list`, `prCreate`
- [ ] names ไม่ชนกัน ไม่ ambiguous — คนอ่านรู้ทันทีว่าทำอะไร
- [ ] prefix/namespace ชัดเมื่อหลาย server — `github_*`, `linear_*`
- [ ] tool count สมเหตุ — ไม่มี 50 tools ที่ overlap กัน (LLM เลือกยาก)

## Descriptions

- [ ] ทุก tool มี description: action + params + return + side effects
- [ ] ไม่มี vague docs — "does stuff", "utility", "helper" = fail
- [ ] params มี description — type, format, example, constraints
- [ ] destructive/side-effect flagged ใน description และ annotations

## Input Schemas

- [ ] JSON Schema types ถูก — `string`/`number`/`integer`/`boolean`/`array`/`object` ไม่ใช่ `any`
- [ ] required vs optional สมเหตุ — ไม่ require ทุกอย่าง ไม่ optional ทุกอย่าง
- [ ] enums ครบสำหรับ closed sets — `status: ["open","closed","merged"]`
- [ ] defaults ระบุเมื่อมี reasonable default
- [ ] `additionalProperties: false` บน strict objects — ไม่ leak unexpected keys
- [ ] pattern/format constraints — `format: "uri"`, `pattern: "^[a-z0-9-]+$"` สำหรับ structured strings

## Output Format

- [ ] structured output — JSON/typed objects ไม่ใช่ free text
- [ ] errors เป็น tool errors (isError + structured) — ไม่ใช่ "Error: ..." ใน text content
- [ ] result size bounded — list tools return paginated/top-N ไม่ใช่ทั้งหมด
- [ ] consistent shape — ทุก list tool return `{ items, nextCursor }` เหมือนกัน

## Pagination

- [ ] `cursor`/`nextCursor` contract ชัด — opaque string, not offset math
- [ ] `limit` param มี max bound — client ขอ 10000 ไม่ได้
- [ ] `hasMore`/`total` สื่อสารชัดเมื่อมี

## Detection

- `list tools` ผ่าน MCP client — inspect schema JSON จริง
- grep tool registration code — descriptions, schemas, handlers

Severity: schema ไม่ validate/wrong types = High, text-dump errors = High, missing descriptions = Medium, naming inconsistency = Low–Medium
