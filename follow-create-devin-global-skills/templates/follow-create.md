# follow-create-* Template

สร้าง plugins, extensions, CLI, library หรือ project scaffold ตาม target ecosystem

## Execute Pattern

- ระบุ target ที skill ช่วยสร้าง (เช่น CLI, website, MCP server, plugins/extensions, library). ถ้าไม่ชัด → ทำ `/ask-me`
- ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack และ `/review-techstack` เพื่อ review dependencies ถ้ามี dependencies
- ถ้าสร้าง CLI → `/follow-create-cli`; ถ้า website → `/follow-create-web`; ถ้า MCP server → `/follow-create-mcp` (Rust ก่อน แล้ว fallback TypeScript); ถ้า plugins/extensions → หา `follow-create-<target>-*` ทีมีอยู่ หรือทำ `/learn-from-web` จาก official docs
- สร้าง `src/` หรือ scaffold ทีเหมาะสม: CLI → `src/presentation/cli.ts` หรือ `src/main.rs`; web → `src/index.ts`/`src/main.ts`; library → `src/index.ts` หรือ `src/lib.rs`
- รัน dev/build/test ตาม stack จนกว่าจะผ่าน ถ้าไม่ผ่าน → `/resolve-errors`
- ถ้ามี MCP server → อัปเดต `%APPDATA%\devin\mcp_config.json`
- ทำ `/deep-validate` แล้ว `/ship` ถ้าผ่าน
