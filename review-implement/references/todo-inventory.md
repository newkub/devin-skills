# TODO And FIXME Inventory Criteria

## Goal

ระบุ TODO, FIXME, HACK, XXX ที่ต้องแปลงเป็น production code ก่อน `implement-comment-todo` และ `implement-todo-md`

## Search Patterns

ใช้ `Grep` ค้นหา patterns ต่อไปนี้ใน source code:

- `TODO` — tasks ที่ยังไม่เสร็จ
- `FIXME` — code ที่ต้องแก้ไข
- `XXX` — code ที่ต้องระวัง
- `HACK` — workaround ที่ต้องแก้ให้ถูกต้อง
- `// TODO`, `# TODO`, `/* TODO */` — comment markers ในแต่ละภาษา

ค้นหาใน markdown files:

- `TODO.md` — standalone TODO list
- `ROADMAP.md` — roadmap items ที่ยังไม่ทำ
- `QUEUE.md` — queue items ที่ pending
- ไฟล์ markdown อื่นที่มี `- [ ]` checkbox ที่ยังไม่ทำ

## Inventory Criteria

แต่ละ TODO ต้องระบุ:

1. File path และ line number
2. TODO type: `TODO`, `FIXME`, `HACK`, `XXX`
3. Context: feature หรือ module ที่เกี่ยวข้อง
4. Priority: high, medium, low
5. Dependencies: TODO อื่นที่ต้องทำก่อน
6. Effort estimate: `S`, `M`, `L`, `XL`

## Categorization

จัดกลุ่ม TODO ตาม:

1. Critical path: TODO ใน schema, data, API, core flow
2. Non-critical path: TODO ใน utility, helper, non-core feature
3. Markdown TODO: TODO ใน `TODO.md`, `ROADMAP.md`
4. Comment TODO: TODO ใน source code comments

## Severity

- Critical: TODO ใน critical path, FIXME ที่ก่อให้เกิด bug, HACK ใน production path
- High: TODO ใน core feature, FIXME ที่ต้องแก้เร็ว, missing feature ที่มี TODO
- Medium: TODO ใน non-critical path, partial implementation, missing validation
- Low: FIXME ใน non-critical path, cosmetic TODO, missing docs TODO
