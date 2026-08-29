# Reference Index

รายการ reference files สำหรับ skill `follow-create-biome-plugins` พร้อมหน้าที่ของแต่ละไฟล์

## Files

| File | Responsibility |
|------|----------------|
| `index.md` | ไฟล์นี้ — แสดงรายการ reference files ทั้งหมดและหน้าที่ของแต่ละไฟล์ |
| `gritql-patterns.md` | GritQL pattern syntax reference — metavariables, regex, conditions, pattern modifiers, rewrites, `or` blocks |
| `biome-config.md` | Biome plugin configuration reference — `plugins` array, `includes`, glob patterns, `biome.jsonc` format |
| [website.md](website.md) | Official resources and links |
| [apis/index.md](apis/index.md) | API, dependencies, and programmatic usage |

## When To Use Each Reference

- **`gritql-patterns.md`**: ใช้เมื่อเขียน `.grit` plugin file, ออกแบบ patterns, ใช้ metavariables, regex, conditions หรือ rewrites
- **`biome-config.md`**: ใช้เมื่อกำหนดค่า plugin ใน `biome.jsonc`, ตั้งค่า `includes` หรือ glob patterns สำหรับจำกัดไฟล์

## Related Resources

- [SKILL.md](../SKILL.md) — skill หลักสำหรับการสร้าง Biome linter plugins
- [Biome Linter Plugins](https://biomejs.dev/linter/plugins/)
- [GritQL Plugin Recipes](https://biomejs.dev/recipes/gritql-plugins/)
- [GritQL Reference](https://biomejs.dev/reference/gritql/)
- [Biome Configuration](https://biomejs.dev/reference/configuration/)
- [Biome Playground](https://biomejs.dev/playground/)

## Sources

- https://biomejs.dev/linter/plugins/
- https://biomejs.dev/reference/gritql/
- https://biomejs.dev/recipes/gritql-plugins/
- https://biomejs.dev/reference/configuration/
