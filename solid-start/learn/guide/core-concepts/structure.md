# Project Structure - SolidStart

## โครงสร้างมาตรฐาน

```
my-app/
├── src/
│   ├── routes/              # File-based routing
│   │   ├── index.tsx       # Home page (/)
│   │   ├── about.tsx       # About page (/about)
│   │   ├── blog/           # Blog routes
│   │   │   ├── index.tsx   # Blog listing (/blog)
│   │   │   └── [slug].tsx  # Blog post (/blog/:slug)
│   │   └── api/            # API routes
│   │       └── hello.ts    # API endpoint (/api/hello)
│   ├── components/         # Reusable components
│   │   ├── ui/            # UI components
│   │   │   ├── Button.tsx
│   │   │   └── Input.tsx
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── features/      # Feature components
│   │       └── UserCard.tsx
│   ├── lib/               # Utility functions
│   │   ├── api.ts        # API calls
│   │   ├── utils.ts      # General utilities
│   │   └── validation.ts # Validation logic
│   ├── stores/            # State management
│   │   └── userStore.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   ├── app.tsx           # Root component
│   ├── entry-client.tsx  # Client entry
│   └── entry-server.tsx  # Server entry
├── public/               # Static assets
│   ├── favicon.ico
│   └── images/
├── app.config.ts         # SolidStart config
├── vite.config.ts        # Vite config
├── tsconfig.json         # TypeScript config
├── package.json          # Dependencies
└── README.md
```

## คำอธิบาย Directory

| Directory | คำอธิบาย |
|-----------|-----------|
| **src/routes/** | File-based routing - กำหนด routes ด้วยโครงสร้างไฟล์ |
| **src/components/** | Reusable components - UI, layout, features |
| **src/lib/** | Utility functions - API calls, helpers, validation |
| **src/stores/** | State management - Global state และ stores |
| **src/types/** | TypeScript types - Type definitions |
| **public/** | Static assets - Images, fonts, favicon |
| **app.config.ts** | SolidStart configuration |
| **vite.config.ts** | Vite bundler configuration |

## File Naming Conventions

| ประเภท | รูปแบบ | ตัวอย่าง |
|--------|---------|---------|
| **Components** | PascalCase | `Button.tsx`, `UserCard.tsx` |
| **Utilities** | camelCase | `api.ts`, `formatDate.ts` |
| **Types** | camelCase | `user.ts`, `api.types.ts` |
| **Routes** | kebab-case | `about-us.tsx`, `user-profile.tsx` |

## Component Organization

### UI Components

```
components/ui/
├── Button.tsx
├── Input.tsx
├── Modal.tsx
└── index.ts          # Re-export all
```

### Layout Components

```
components/layout/
├── Header.tsx
├── Footer.tsx
├── Sidebar.tsx
└── index.ts
```

### Feature Components

```
components/features/
├── auth/
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
└── blog/
    ├── BlogCard.tsx
    └── BlogList.tsx
```

## Route Organization

### Route Groups

ใช้ parentheses สำหรับจัดกลุ่มโดยไม่กระทบ URL:

```
routes/
├── (app)/              # App routes
│   ├── layout.tsx
│   ├── index.tsx
│   └── about.tsx
├── (auth)/             # Auth routes
│   ├── login.tsx
│   └── register.tsx
└── (dashboard)/        # Dashboard routes
    ├── layout.tsx
    └── index.tsx
```

### Nested Routes

ใช้สำหรับ layouts และ shared UI:

```
routes/
├── blog/
│   ├── layout.tsx      # Blog layout
│   ├── index.tsx       # /blog
│   └── [slug].tsx      # /blog/:slug
```

## Best Practices

- **Separation of Concerns**: แยก UI, logic, และ data
- **Feature-Based**: จัดกลุ่มตาม features ไม่ใช่ file types
- **Reusability**: Components ควร reusable
- **Type Safety**: ใช้ TypeScript ทุกที่
- **Consistency**: ใช้ naming conventions สม่ำเสมอ
