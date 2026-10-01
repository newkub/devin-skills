# GitHub Projects (gh project) — Best Practices

CLI-driven project management — scripted + interactive discipline

## Recommended Patterns

- `gh project` commands ทุกอย่าง scriptable — combine `list`, `view`, `item-list`, `field-list` เพื่อ discover IDs ก่อน mutate
- Field/item IDs ไม่ใช่ names — resolve `field-list`/`item-list` → IDs แล้วค่อย `item-edit`; IDs per-project
- JSON output (`--format json`) + `jq` สำหรับ pipelines — table output สำหรับอ่านอย่างเดียว
- Automations: ใช้ built-in workflows ของ Projects (auto-add, status transitions) ก่อน scripted solutions
- `gh project item-add` เชื่อม issues/PRs เข้า project — bulk add ผ่าน loop + repo list

## Common Pitfalls

- Projects v2 (graphQL-backed) ≠ classic projects — `gh project` = v2 เท่านั้น; classic ใช้ `gh api`
- Permissions: project visibility ตาม org — token ต้อง `project` scope; fine-grained PATs ต้อง grant explicit
- `item-edit` ต้องการ `--project-id`, `--id` (item id), `--field-id` ทั้งหมด — ห้ามเดา; fetch list ก่อน
- Single-select/status fields = option IDs ไม่ใช่ label text — resolve ผ่าน `field-list` output

## Scripting Tips

- Idempotent scripts: เช็ค item มีอยู่แล้วก่อน `item-add` — add ซ้ำได้ duplicates
- Rate limits: bulk ops ใส่ sleep ระหว่าง calls
- Export: `gh project item-list --format json` > snapshot เป็น audit trail

## Do / Don't

| Do | Don't |
|----|-------|
| resolve IDs ผ่าน list commands | hardcode field/item IDs |
| `--format json` + jq ใน scripts | parse table output |
| built-in automations ก่อน | scripted status sync ทั้งหมด |
| verify token scopes ก่อน | debug permission errors ทีหลัง |
