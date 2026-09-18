# Hooks Layer Checklist

ตรวจ hooks config ว่า trigger ถูก event, command มีจริง, ไม่ block workflow

## Config Locations

| Scope | Path |
|-------|------|
| Global | `%APPDATA%\devin\config.json` (หรือ `~/.config/devin/config.json`) |
| Project | `.devin/config.json` ใน workspace |
| Plugin | `.devin/plugins/*/hooks.json` หรือ hooks field ใน plugin config |

## Checks

| No. | Check | Severity เมื่อผิด |
|-----|-------|-------------------|
| 1 | Trigger event ถูกต้อง — `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop` เท่านั้น; event สะกดผิด = hook ไม่รันเงียบๆ | High |
| 2 | `command`/script path มีไฟล์จริง และ executable | Critical |
| 3 | Matcher ไม่กว้างเกิน — hook ที่ match ทุก tool แต่ตั้งใจแค่บางตัว = ชะลอทุก call | Medium |
| 4 | ไม่มี duplicate hooks — hook เดียวกันลงทะเบียนซ้ำใน global + project | Medium |
| 5 | ไม่มี infinite loop — hook ที่เรียก tool เดียวกันที่ trigger มัน (เช่น PostToolUse รัน tool เดิม) | Critical |
| 6 | Timeout เหมาะสม — hook blocking >30s ทุก call = UX พัง | High |
| 7 | Hook fail ไม่ block workflow โดยไม่ตั้งใจ — exit non-zero ใน PreToolUse = เด้ง tool; ยืนยันว่าตั้งใจ | High |
| 8 | Secrets ไม่ฝังใน hook command | Critical |

## Report Format

ต่อ hook: `No.`, `Hook`, `Event`, `Finding`, `Severity`, `Evidence (config path + line)`
