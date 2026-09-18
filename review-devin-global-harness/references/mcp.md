# MCP Layer Checklist

ตรวจ MCP servers ว่า enable/ใช้งานจริง, ไม่ซ้ำ, ไม่ dead config

## Config Locations

| Scope | Path |
|-------|------|
| Global | `%APPDATA%\devin\config.json` → `mcpServers` (หรือ `~/.config/devin/config.json`) |
| Project | `.devin/config.json` → `mcpServers` ใน workspace |

## Checks

| No. | Check | Severity เมื่อผิด |
|-----|-------|-------------------|
| 1 | Server ตอบจริง — `command`/`url` reachable; `npx` package มีจริง (ไม่ใช่ชื่อผิด) | Critical |
| 2 | `env` vars ครบ — token/API key ที่ server ต้องการมีค่า (ไม่ใช่ placeholder) | High |
| 3 | ไม่มี duplicate servers — server เดียวกันลงทะเบียน 2 ชื่อ (เช่น global + project) | Medium |
| 4 | Tool names ไม่ชน — 2 servers expose tool ชื่อเดียวกัน = call ชนกัน | High |
| 5 | ไม่มี dead config — server disabled/comment-out ค้างไว้, หรือ env var อ้างตัวแปรที่ไม่มี | Medium |
| 6 | Scope ถูก — global tools ไม่ควรอยู่ใน project config และกลับกัน | Low |
| 7 | Server ที่ไม่เคยถูกเรียก (unused) — ตรวจกับ usage evidence ถ้ามี | Low |
| 8 | `minimumReleaseAge`/pinning ตาม security policy — `@latest` ใน npx = supply chain risk | High |

## Report Format

ต่อ server: `No.`, `Server`, `Transport`, `Finding`, `Severity`, `Evidence (config path + line)`
