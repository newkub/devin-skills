# VitePress — Best Practices

Docs site — UnoCSS, Shiki Twoslash, Group Icons, Vue components

## Recommended Patterns

- `.vitepress/config.ts` = single config — nav, sidebar, theme config, vite options; typed via `defineConfig`
- Sidebar/nav เป็น explicit config ไม่ใช่ auto — information architecture ต้องคิด; auto-generated = flat chaos
- Custom theme ผ่าน `Layout` slots + `enhanceApp` — extend default theme ไม่ใช่ fork ทั้ง theme
- UnoCSS integration — utility styling ในหน้า docs/custom components; `presetAttributify` optional
- Shiki Twoslash — code blocks ที่ types hover; สำหรับ API docs ที่ต้องการ type context
- Vue components ใน markdown — `<Component />` ผ่าน markdown-it-vue; interactive demos ใน docs

## Common Pitfalls

- Dead links: VitePress build warns — fix ทุก warning; link checker ใน CI (`/check-dead-link` หรือ build --strict)
- Images: `public/` assets + absolute paths — relative paths พังข้าม nested pages
- Group Icons plugin — icon maps สำหรับ nav/sidebar; consistent icon set
- i18n/locales config — `locales` root + per-locale configs; อย่า mix langs ในไฟล์เดียว
- Build size: Twoslash + many components = slow builds — lazy components, split heavy pages

## Content Discipline

- Frontmatter เฉพาะที่ต้องการ — title/description/outline per page
- Markdown extensions: containers (`:::tip`), code groups, line highlights — ใช้เจาะจง
- Search: built-in local search หรือ Algolia — local พอสำหรับ docs เล็ก-กลาง
- Versioned docs = separate concerns — VitePress ไม่มี built-in versioning; consider per-version deploys

## Do / Don't

| Do | Don't |
|----|-------|
| explicit sidebar IA | auto-generated nav chaos |
| extend default theme | fork theme ทั้งชุด |
| fix dead-link warnings | accumulate link rot |
| Twoslash สำหรับ API docs | twoslash ทุก code block |
