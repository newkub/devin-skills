# Project Structure

## Standard Structure

```
my-bun-project/
├── src/                    # Source code
│   ├── index.ts           # Entry point
│   ├── lib/               # Utility functions
│   ├── components/        # UI components (ถ้ามี)
│   └── routes/            # API routes (ถ้ามี)
├── test/                   # Test files
│   └── index.test.ts
├── public/                 # Static assets
├── dist/                   # Build output
├── package.json           # Dependencies และ scripts
├── tsconfig.json          # TypeScript config
├── bun.lockb              # Bun lock file
└── .env                   # Environment variables
```

## Organization

### src/

- index.ts - Entry point หลักของ application
- lib/ - Utility functions และ helpers
- components/ - UI components (สำหรับ web applications)
- routes/ - API routes หรือ route handlers
- types/ - TypeScript type definitions
- config/ - Configuration files

### test/

- ใช้ชื่อไฟล์เดียวกับ source แต่เติม `.test.ts`
- ใช้ `bun test` สำหรับรัน tests
- รองรับ snapshots และ mocking

### public/

- Static assets เช่น images, fonts, CSS
- Serve โดย Bun โดย default

## Best Practices

- ใช้ TypeScript strict mode
- แยก business logic จาก presentation
- ใช้ absolute imports ด้วย `bun.config.ts`
- จัดระเบียบตาม feature ไม่ใช่ file type
