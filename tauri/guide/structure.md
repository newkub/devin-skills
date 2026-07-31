# โครงสร้างโฟลเดอร์และไฟล์ใน Tauri Projects

## โครงสร้าง Directory มาตรฐาน

```
my-tauri-app/
├── src-tauri/              # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point ของ Rust application
│   │   ├── lib.rs         # Library exports
│   │   └── commands.rs    # Tauri commands (IPC handlers)
│   ├── Cargo.toml         # Rust dependencies
│   ├── tauri.conf.json    # Tauri configuration
│   ├── build.rs           # Build scripts
│   └── icons/             # Application icons
├── src/                   # Frontend (web technologies)
│   ├── App.vue           # Main component (Vue)
│   ├── main.ts           # Entry point
│   └── assets/           # Static assets
├── public/               # Public static files
├── index.html            # HTML entry point
├── package.json          # Node.js dependencies
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

## ส่วนประกอบหลัก

### src-tauri/

**src/**
- `main.rs` - Entry point ของ Rust application, setup Tauri app
- `lib.rs` - Library exports สำหรับ external usage
- `commands.rs` - Tauri commands ที่เชื่อมต่อกับ frontend ผ่าน IPC

**Configuration Files**
- `Cargo.toml` - Rust dependencies และ metadata
- `tauri.conf.json` - Tauri-specific configuration (window settings, permissions)
- `build.rs` - Build-time scripts

**Assets**
- `icons/` - Application icons สำหรับแต่ละ platform

### src/

Frontend code ขึ้นอยู่กับ framework ที่เลือก (Vue, React, Svelte, etc.)

- Component files
- State management
- API calls ไปยัง Rust backend
- UI/UX logic

### Configuration Files

- `package.json` - Node.js dependencies และ scripts
- `vite.config.ts` - Vite bundler configuration
- `tsconfig.json` - TypeScript configuration

## Best Practices

### 1. Separation of Concerns

- Rust backend ใน `src-tauri/` สำหรับ system operations
- Frontend ใน `src/` สำหรับ UI และ user interactions
- IPC commands ควรเป็น thin layer ที่เรียก business logic

### 2. File Organization

- Group related Rust modules ใน `src-tauri/src/`
- ใช้ subdirectories สำหรับ features ที่ซับซ้อน
- เก็บ assets แยกจาก source code

### 3. Configuration Management

- ใช้ environment variables สำหรับ sensitive data
- แยก configuration ตาม environment (dev, prod)
- ใช้ `tauri.conf.json` สำหรับ platform-specific settings

## ตัวอย่าง Project Structure ขนาดใหญ่

```
large-tauri-app/
├── src-tauri/
│   ├── src/
│   │   ├── main.rs
│   │   ├── commands/
│   │   │   ├── file.rs
│   │   │   ├── system.rs
│   │   │   └── network.rs
│   │   ├── services/
│   │   │   ├── database.rs
│   │   │   └── auth.rs
│   │   └── utils/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/
│   ├── components/
│   ├── views/
│   ├── stores/
│   ├── api/
│   └── utils/
├── public/
└── tests/
```
