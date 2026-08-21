# Structure

## Project Structure

```
src/
├── components/
│   ├── table/
│   │   ├── columns.tsx
│   │   └── Table.tsx
│   └── ui/
├── hooks/
│   ├── usePosts.ts
│   └── useUsers.ts
├── routes/
│   ├── index.tsx
│   └── posts.tsx
└── lib/
    ├── queryClient.ts
    └── router.ts
```

## File Organization

- **Columns** - แยก columns definition ไว้ในไฟล์แยก
- **Hooks** - แยก custom hooks สำหรับ data fetching
- **Routes** - แยก route components ตาม routes
- **Lib** - แยก shared utilities และ configurations
