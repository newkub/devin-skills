# Devin CLI — Best Practices

Devin/Cascade AI coding assistant — session, skills และ harness discipline

## Recommended Patterns

- ให้ context ครบตั้งแต่ต้น: files, errors, intent — Devin ทำงานดีเมื่อ scope ชัด
- ใช้ skills (`/<name>`) ที่ตรงงาน — repo มี dispatcher ครอบไว้; อย่าอธิบายวิธีทำซ้ำถ้ามี skill
- Sessions: task เดียวต่อ session — context pollution ทำ output เสีย; spawn child sessions สำหรับ parallel independent work
- ตรวจ `git status` ก่อน/หลังเสมอ — agent changes ต้อง reviewable
- Subagents สำหรับงานอิสระหลายชิ้น — fan-out ผ่าน `/use-subagents` ไม่ใช่ sequential ใน session เดียว

## Common Pitfalls

- Instructions คลุมเครือ = output คลุมเครือ — ระบุ files/paths, acceptance criteria, constraints
- Long sessions drift — summarize/checkpoint; context near full → `/follow-context-engineering`
- Secrets ใน prompts = leak risk — ใช้ env vars/secret managers; ห้าม paste credentials
- อย่า assume tools: verify ว่า command/skill มีจริงก่อนสั่ง — หลาย skill เป็น workflows ไม่ใช่ executables
- Destructive ops (rm, migrations, pushes) ต้อง explicit confirm — agent ไม่ควรสันนิษฐาน

## Workflow Tips

- `/deep-research` สำหรับ current docs — training data stale สำหรับ fast-moving tools
- `/update-devin-global-skills` conventions เมื่อเขียน skills — รูปแบบมี spec
- Report-first flow: findings → confirm → fix — หลีกเลี่ยง auto-fix ก่อน review เมื่อ scope ใหญ่

## Do / Don't

| Do | Don't |
|----|-------|
| ระบุ scope/files/criteria ชัด | briefs คลุมเครือแบบ "fix this" |
| spawn subagents สำหรับ parallel work | serial multi-domain tasks ในเธรดเดียว |
| env/secret-manager สำหรับ credentials | paste secrets ใน prompt |
| verify diffs ก่อน commit | trust agent output โดยไม่ review |
