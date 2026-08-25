# Reference Index — follow-create-vite-plugins

อ้างอิงสำหรับการสร้าง Vite plugins ด้วย Plugin API และ Library Mode
โดยรองรับ Rolldown compatibility (Vite 8+ ใช้ Rolldown เป็น bundler)

## Files

| File | Responsibility |
|------|---------------|
| `plugin-api.md` | Vite Plugin API reference — โครงสร้าง plugin object, `name`, `enforce`, `apply`, universal hooks (Rolldown), Vite-specific hooks, และ Rolldown compatibility notes |
| `library-mode.md` | Vite library mode build reference — `build.lib` config, `entry`, `name`, `fileName`, `formats`, `external`, `tsconfig`, และ `package.json` scripts |

## Usage

- อ่าน `plugin-api.md` ก่อนเสมอเมื่อต้องสร้าง plugin ใหม่
- อ่าน `library-mode.md` เมื่อต้อง build library สำหรับ distribution
- ทั้งสองไฟล์อ้างอิง Vite 8.x (Rolldown-powered) พร้อม notes สำหรับ backward compatibility

## Sources

- Plugin API: https://vite.dev/guide/api-plugin.html
- Library Mode: https://vite.dev/guide/build.html#library-mode
- Rolldown Plugin API: https://rolldown.rs/apis/plugin-api
