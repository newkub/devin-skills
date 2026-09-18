# Prompts And Resources Checklist — review-mcp

## Prompts

- [ ] ทุก prompt มี `name`, `description`, `arguments` schema ครบ
- [ ] arguments typed + required/optional ถูก — user เติมอะไรได้บ้างชัดเจน
- [ ] prompt content ไม่ leak secrets/internal paths — template ก่อน fill ต้องอ่านได้ปลอดภัย
- [ ] injection surface — argument values ไปอยู่ตำแหน่ง "data" ไม่ใช่ "instruction" ใน template
- [ ] prompt list ไม่ซ้ำกับ built-in client prompts — ไม่ override ของที่มีอยู่แล้วโดยไม่ตั้งใจ

## Resources

- [ ] URI scheme ชัดและ consistent — `file:///`, `custom://`, `data:` — ไม่ปนกัน
- [ ] `mimeType` ถูก — `text/markdown`, `application/json`, `image/png` ตามจริง
- [ ] `name`/`description`/`title` ครบ — resource readable โดยไม่ต้อง fetch ก่อน
- [ ] `uriTemplate` valid — `{param}` syntax ถูก, params typed + described
- [ ] subscriptions ทำงาน — `subscribe`/`listChanged` semantics implement จริง
- [ ] resource size bounded — ไม่ return 50MB file โดยไม่เตือน

## Capability Declarations

- [ ] `capabilities` object ตรงกับสิ่งที่ server implement จริง — ไม่ declare แล้วทำไม่ได้
- [ ] `tools.listChanged`, `resources.subscribe`, `prompts.listChanged` — flags ตรง behavior

## Detection

- `list prompts`, `list resources` ผ่าน MCP client
- inspect `capabilities` ใน init handshake
- grep prompt/resource registration — templates, schemas, handlers

Severity: injection ใน prompt template = High, resources MIME ผิด/leak = Medium, capabilities ไม่ตรง = Medium
