# usage — Best Practices

CLI spec DSL — generate completions, docs, SDKs จาก spec เดียว

## Recommended Patterns

- `usage.kdl` spec file = single source — commands, args, flags, help text; generate completions/docs/manpages/SDK จากมัน
- Declare args/flags typed (`flag "name" { help "..."; default "..." }`) — types → validation + completion ฟรี
- Help text เขียนให้ผู้ใช้ — สั้น, actionable, examples; generated docs ดีเท่า spec
- Pair กับ mise tasks — usage เป็น mise task spec backend; `mise tasks` integration
- Version spec กับ CLI — spec drift = broken completions; spec tests ใน CI

## Common Pitfalls

- Spec ไม่ enforce runtime behavior — validate logic ใน code ต้อง mirror spec constraints
- Completions generated ต้อง install ลง shell — docs step ในติดตั้งไม่ใช่ assume
- Breaking spec changes = breaking CLI — rename/remove flags = major bump discipline
- หลาย spec files ต่อ CLI = แยก subcommand trees; shared types/args ใน common sections
- Positional vs flags: required positionals ทำ completion ยาก — flags เมื่อ optional, positionals เมื่อ core

## Generation Targets

- Shell completions: bash/zsh/fish — test install script จริงทุก shell
- Markdown docs → commit ลง docs/ หรือ generated site
- JSON spec → SDK/tooling consumers

## Do / Don't

| Do | Don't |
|----|-------|
| spec = source of truth | hand-write completions แยก |
| typed args + defaults | untyped strings ทุกอย่าง |
| test generated completions | assume generation correct |
| version spec changes เหมือน API | silent spec drift |
