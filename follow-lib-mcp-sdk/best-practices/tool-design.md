# MCP SDK — Tool Design และ Schema

## Recommended Patterns

### Naming และ Description

- tool name = verb-noun snake_case — `get_user`, `list_issues`, `create_ticket` — LLM เลือก tool จาก name + description
- description เขียนให้ LLM เข้าใจ: ทำอะไร, เมื่อไหร่ควรใช้, input/output คืออะไร — ทุก tool ต้องมี description ชัดเจน
- title (human-readable) แยกจาก name — `title` สำหรับ UI, `name` สำหรับ machine
- จำนวน tools น้อยแต่กว้างดีกว่าเยอะแต่แคบ — LLM สับสนเมื่อ tools ซ้ำซ้อน (~10-20 tools ต่อ server เป็น sweet spot)

### Input Schema (zod)

- `inputSchema` เป็น zod raw shape: `{userId: z.string().describe('...'), limit: z.number().optional()}` — `.describe()` ทุก field ช่วย LLM map args
- เลือก types ให้แคบ: `z.enum` แทน free string, `z.number().int().positive()` แทน `z.number()`
- optional fields + defaults เมื่อ sensible — ลด friction ให้ LLM ไม่ต้องเดา
- nested objects flatten เมื่อทำได้ — deep nesting เพิ่ม validation errors

### Output / Response

- return `{content: [{type: 'text', text: ...}]}` เสมอ — text เป็น format หลัก
- `structuredContent` + `outputSchema` เมื่อ client ต้อง parse response โปรแกรมมาติก — dual-format: text summary + structured data
- จำกัด response size — truncate/paginate results; LLM context ไม่ใช่ database dump
- annotations: `readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint` — ช่วย client UX (confirm destructive ops)

### Elicitation

- tool ต้องการ input เพิ่มระหว่าง execute → elicitation — `mode: 'form'` สำหรับ non-sensitive, `mode: 'url'` สำหรับ secrets/OAuth
- ใช้เมื่อ schema input ไม่ครบและต้องถาม user — ดีกว่า fail ด้วย validation error

## Do / Don't

| Do | Don't |
|---|---|
| `describe()` ทุก field ใน inputSchema | schema เปลือยที่ LLM ต้องเดา |
| `z.enum` สำหรับ constrained values | free `z.string()` เมื่อค่ามีจำกัด |
| return `isError: true` + text message | throw หรือ return malformed response |
| paginate/truncate list results | return หมื่น rows ในเครื่องเดียว |
| ตั้ง `readOnlyHint`/`destructiveHint` | ปล่อยให้ client ไม่รู้ว่า tool กระทบ state |
| name ชัดเจน consistent | name กำกวม `handle_data`, `process_stuff` |

## Common Pitfalls

- description ว่าง/สั้นเกิน → LLM เลือกผิด tool หรือ call ด้วย args ผิด
- response ใหญ่เกิน → LLM context overflow, truncate กลาง — จำกัด + paginate เสมอ
- tool ทำ side-effect แต่ไม่มี `destructiveHint` → client auto-run โดยไม่ confirm
- inputSchema เป็น zod object ไม่ใช่ raw shape → registration fail (`{field: z.string()}` ไม่ใช่ `z.object({...})` ใน registerTool)
- สร้าง tool ต่อ CRUD endpoint → ระเบิด tool count; รวมเป็น parameterized tools

## Performance Notes

- handler ควร async + fast — long ops ส่ง progress ผ่าน `reportProgress`
- หลีกเลี่ยง serial API calls ใน handler — `Promise.all` สำหรับ independent fetches
- cache external API responses ใน handler เมื่อเหมาะ — tool ถูก call บ่อย
- schema validation เกิดก่อน handler — invalid input fail fast ไม่เสียเวลา

## Ecosystem / Integration

- schemas ซับซ้อน → `/follow-lib-zod`
- test ด้วย MCP Inspector — interact tools/resources/prompts ผ่าน UI
- tool ที่ต้อง auth → OAuth flow ผ่าน SDK auth helpers หรือ elicitation `mode: 'url'`
- resources/prompts เสริม tools: resource = data source, prompt = reusable template — ไม่ใช่ทุกอย่างเป็น tool
