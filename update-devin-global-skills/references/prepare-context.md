# Prepare Context

## Goal

รู้ environment, conventions, และ scope ก่อนลงมือ

## Steps

1. ตรวจจับ AI tool และ skills directory จาก path:
   - Windsurf → `~/.codeium/windsurf/skills/` หรือ `%APPDATA%\Codeium\Windsurf\skills\`
   - Codex → `~/.codex/skills/`
   - Claude → `~/.claude/skills/`
   - OpenCode → `~/.opencode/skills/`
   - Devin CLI → `~/.config/devin/skills/` หรือ `%APPDATA%\devin\skills\`
   - ถ้าตรวจจับไม่ได้ → ถามผู้ใช้ด้วย `/ask-me`
2. อ่าน `global_rules.md` และ `AGENTS.md` ของ AI tool ที่ตรวจจับได้
3. ทำ `/check-skills-related` และ `/check-reference` เพื่อดู skills ที่เกี่ยวข้อง
4. ถ้า update เป็น long-horizon task หรือ context ใกล้เต็ม → ใช้ `/follow-context-engineering`
5. ถ้า context ไม่พร้อม หรือ reference จำเป็นไม่มี → stop และ report
