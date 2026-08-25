# VitePress Config Check

ตรวจ `docs/.vitepress/config.ts` nav และ sidebar

## Config File

- ต้องมี `docs/.vitepress/config.ts`
- ต้องเป็น valid TypeScript
- ต้อง export default `defineConfig(...)`

## Nav Validation

- ต้องมีอย่างน้อย 6 items: Project, Features, Getting Started, Roadmap, Development, References
- แต่ละ item ต้องมี `text` และ `link`
- `link` ต้องเริ่มต้นด้วย `/`

## Sidebar Validation

- ต้องมีอย่างน้อย 5 หมวด:
  - `/project/` — overview, features, workspaces (monorepo)
  - `/getting-started/` — installation, usage
  - `/roadmap/` — index, idea-features
  - `/development/` — setup, architecture, workflows, testing
  - `/references/` — index + ตาม distribution type
- แต่ละหมวดที่มี >5 หน้า ต้องใช้ `collapsed: true`
- แต่ละ item ต้องมี `text` และ `link`
- `link` ต้องเริ่มต้นด้วย `/`

## Restrictions

- ไม่ต้องใช้ Vue components ซับซ้อน
- ใช้ markdown ธรรมดา
- ใช้ `:::` ของ VitePress เมื่อจำเป็นเท่านั้น

## Scoring

- Critical: ไม่มี config.ts, config invalid
- High: nav ขาด, sidebar ขาดหมวดสำคัญ
- Medium: `collapsed` ขาด, path ไม่เริ่มด้วย `/`
- Low: ใช้ Vue components ซับซ้อน
