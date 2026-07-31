# Structure

## โครงสร้างโปรเจกต์ Vite

โครงสร้างโปรเจกต์มาตรฐานของ Vite ที่เหมาะสำหรับการพัฒนา frontend applications

### โครงสร้างพื้นฐาน

```text
my-vite-app/
├── public/                 # Static assets ที่ไม่ผ่านการ process
│   └── favicon.ico
├── src/                    # Source code หลัก
│   ├── assets/            # Assets ที่ผ่านการ process
│   │   └── logo.png
│   ├── components/        # Vue/React components
│   ├── App.vue/App.jsx    # Root component
│   └── main.ts/main.jsx   # Entry point
├── index.html              # HTML entry point
├── vite.config.ts         # Vite configuration
├── package.json           # Dependencies และ scripts
├── tsconfig.json          # TypeScript configuration
└── README.md
```

### โครงสร้างสำหรับ Production

```text
my-vite-app/
├── .github/               # GitHub workflows
│   └── workflows/
├── .vscode/               # VS Code settings
│   └── settings.json
├── public/                # Static assets
├── src/
│   ├── api/               # API calls
│   ├── assets/            # Processed assets
│   ├── components/        # Reusable components
│   ├── composables/       # Vue composables / React hooks
│   ├── layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── router/            # Router configuration
│   ├── stores/            # State management
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── App.vue/App.jsx
│   └── main.ts/main.jsx
├── tests/                 # Test files
│   ├── unit/
│   └── e2e/
├── .env                   # Environment variables
├── .env.production        # Production env
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Naming Conventions

### Files

- **Components**: PascalCase (e.g., `UserProfile.vue`, `Button.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`, `apiClient.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL.ts`)
- **Types**: PascalCase (e.g., `UserTypes.ts`, `ApiResponse.ts`)

### Folders

- **Components**: lowercase with hyphens (e.g., `user-profile/`, `button-group/`)
- **Features**: lowercase with hyphens (e.g., `auth/`, `dashboard/`)
- **Utilities**: lowercase (e.g., `utils/`, `helpers/`)

## File Organization Patterns

### Feature-Based Organization

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── api/
│   │   ├── types/
│   │   └── index.ts
│   └── dashboard/
│       ├── components/
│       ├── api/
│       └── index.ts
└── shared/
    ├── components/
    ├── utils/
    └── types/
```

### Type-Based Organization

```text
src/
├── components/
├── composables/
├── services/
├── stores/
├── utils/
├── types/
└── styles/
```

## Best Practices

### 1. Entry Point

- `index.html` ต้องอยู่ที่ root directory
- ใช้ `<script type="module" src="/src/main.ts">` สำหรับ ESM
- อย่าใส่ logic ใน HTML file

### 2. Source Code

- ใส่ source code ทั้งหมดใน `src/`
- ใช้ subdirectories สำหรับจัดกลุ่มตามหน้าที่
- ใช้ `index.ts` สำหรับ export หลายไฟล์

### 3. Static Assets

- ใช้ `public/` สำหรับ assets ที่ไม่ต้องการ processing
- ใช้ `src/assets/` สำหรับ assets ที่ต้องการ processing
- อ้างอิงจาก root ด้วย `/` prefix

### 4. Configuration

- ใช้ `vite.config.ts` สำหรับ Vite config
- ใช้ `.env` สำหรับ environment variables
- ใช้ `tsconfig.json` สำหรับ TypeScript config

## ตารางสรุป Folder และ File

| Folder/File | Purpose | Required |
|-------------|---------|----------|
| `public/` | Static assets ที่ไม่ผ่าน processing | ✅ |
| `src/` | Source code หลัก | ✅ |
| `src/assets/` | Assets ที่ผ่าน processing | ⭕ |
| `src/components/` | UI components | ⭕ |
| `src/main.ts` | Entry point | ✅ |
| `index.html` | HTML entry point | ✅ |
| `vite.config.ts` | Vite configuration | ✅ |
| `package.json` | Dependencies และ scripts | ✅ |
| `tsconfig.json` | TypeScript configuration | ⭕ |
| `.env` | Environment variables | ⭕ |
