# File-based Magic

## หลักการ

SvelteKit ใช้ file system เป็น routing convention ที่ทำให้การสร้าง routes เป็นเรื่องง่ายและ predictable

## ใน SvelteKit

```
src/routes/
├── +page.svelte          → /
├── about/
│   └── +page.svelte      → /about
├── blog/
│   └── [slug]/
│       └── +page.svelte  → /blog/:slug
└── (group)/
    └── +page.svelte      → /group (ไม่มีใน URL)
```

## Special Files

| File | Purpose |
|------|---------|
| `+page.svelte` | Page component |
| `+page.server.ts` | Server-side data loading |
| `+page.ts` | Universal data loading |
| `+layout.svelte` | Layout wrapper |
| `+error.svelte` | Error page |
| `+server.ts` | API endpoints |

## ประโยชน์

- **Intuitive** เข้าใจง่ายจาก folder structure
- **Scalable** จัดการ routes จำนวนมากได้
- **Type-safe** TypeScript รู้จัก routes
- **No config** ไม่ต้องกำหนด routing manually
