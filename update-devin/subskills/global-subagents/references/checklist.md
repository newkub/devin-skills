# update-devin-global-subagents — Full Dimension Checklist

## 1. Frontmatter

- [ ] name ตรง directory, description ชัด, tools declared
- [ ] model/permission fields valid ตาม spec ปัจจุบัน

## 2. Prompt Quality

- [ ] system prompt เฉพาะเจาะจง, single responsibility ชัด
- [ ] input/output contract ระบุ, guardrails มี
- [ ] ไม่ซ้ำ agent อื่น, scope boundaries ระบุ

## 3. Safety

- [ ] least-privilege tools, no unnecessary write/exec
- [ ] destructive ops gated, secrets handling rules
- [ ] failure/report behavior defined

## 4. Integration

- [ ] อ้างอิง skills/rules ที่มีอยู่จริง
- [ ] AGENTS.md/registry consistent, related links valid

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
