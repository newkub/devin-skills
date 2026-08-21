---
description: โครงสร้างโปรเจกต์และการจัดระเบียบไฟล์สำหรับ Node.js
---

## Goal

อธิบายโครงสร้างโปรเจกต์ที่เหมาะสมสำหรับการพัฒนาด้วย Node.js

## Scope

สำหรับโปรเจกต์ JavaScript/TypeScript ที่ใช้ Node.js เป็น runtime

## โครงสร้างมาตรฐาน

```
my-node-project/
├── src/                    # Source code
│   ├── index.js           # Entry point
│   ├── lib/               # Utility functions
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── services/          # Business logic
│   └── middleware/        # Express middleware
├── test/                   # Test files
│   └── index.test.js
├── public/                 # Static assets
├── dist/                   # Build output (TypeScript)
├── config/                 # Configuration files
├── package.json           # Dependencies และ scripts
├── package-lock.json      # Lock file
├── tsconfig.json          # TypeScript config
├── .env                   # Environment variables
└── .gitignore             # Git ignore file
```

## การจัดระเบียบ

### src/

- **index.js** - Entry point หลักของ application
- **lib/** - Utility functions และ helpers
- **models/** - Data models และ schemas
- **routes/** - API routes หรือ route handlers
- **controllers/** - Route controllers สำหรับ Express
- **services/** - Business logic
- **middleware/** - Express middleware

### test/

- ใช้ชื่อไฟล์เดียวกับ source แต่เติม `.test.js`
- ใช้ Jest หรือ Mocha สำหรับ testing
- รองรับ mocking และ snapshots

### config/

- **database.js** - Database configuration
- **server.js** - Server configuration
- **logger.js** - Logger configuration

## Best Practices

- ใช้ TypeScript strict mode
- แยก business logic จาก presentation
- ใช้ absolute imports ด้วย module aliases
- จัดระเบียบตาม feature ไม่ใช่ file type
- ใช้ environment variables สำหรับ sensitive data
