# How SolidStart Works

## สถาปัตยกรรมโดยรวม

```
┌─────────────────────────────────────────────────────────────┐
│                     SolidStart Application                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │   Routes     │      │  Components  │      │  Server      │ │
│  │  (File-based)│─────▶│   (SolidJS)   │─────▶│  Functions   │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│         │                     │                     │        │
│         ▼                     ▼                     ▼        │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐ │
│  │ <FileRoutes/>│      │  Reactivity  │      │   Nitro      │ │
│  │  Component   │      │   System     │      │   Server     │ │
│  └──────────────┘      └──────────────┘      └──────────────┘ │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                    Vinxi Bundler                              │
│  (Combines Vite + Nitro for dev & production)                │
└─────────────────────────────────────────────────────────────┘
```

## ขั้นตอนการทำงาน

### 1. Project Initialization

```bash
bun create solid
```

- สร้าง project structure ใหม่
- เลือก template ตามที่ต้องการ
- ตั้งค่า configuration เบื้องต้น

### 2. Development Mode

```bash
bun run dev
```

- Vinxi เริ่ม development server ด้วย Vite
- File-based routing scan ทำงานอัตโนมัติ
- HMR (Hot Module Replacement) ทำงานตลอดเวลา

### 3. Build Process

```bash
bun run build
```

- Vinxi ใช้ Nitro สำหรับ build production assets
- Generate static files (SSG) หรือ server functions (SSR)
- Optimize assets และ bundle code

### 4. Production Serve

```bash
bun run start
```

- Nitro server เริ่มทำงาน
- Serve ตาม rendering mode ที่เลือก
- Handle API routes และ middleware

## File-Based Routing Flow

```
File System                    Route Generation
───────────                    ┌─────────────────┐
routes/                        │                 │
├── index.tsx       ──────────▶│  /              │
├── about.tsx       ──────────▶│  /about         │
├── blog/                       │                 │
│   ├── index.tsx  ──────────▶│  /blog          │
│   └── [slug].tsx ──────────▶│  /blog/:slug    │
└── api/                        │                 │
    └── hello.ts    ──────────▶│  /api/hello     │
                               │                 │
                               │  <FileRoutes/>  │
                               │                 │
                               └─────────────────┘
```

## Request Lifecycle

### SSR Mode

```
Client Request
     │
     ▼
Nitro Server
     │
     ├─▶ Route Matching
     │
     ├─▶ Component Rendering (Server)
     │
     ├─▶ Data Fetching
     │
     ├─▶ HTML Generation
     │
     ├─▶ Send HTML to Client
     │
     ▼
Client Hydration
     │
     └─▶ SolidJS Reactivity Activation
```

### CSR Mode

```
Client Request
     │
     ▼
Serve Static HTML Shell
     │
     ▼
Client Loads JavaScript
     │
     ├─▶ Component Rendering (Client)
     │
     ├─▶ Data Fetching (Client)
     │
     └─▶ SolidJS Reactivity Activation
```

### SSG Mode

```
Build Time
     │
     ▼
Pre-render All Routes
     │
     ├─▶ Component Rendering
     │
     ├─▶ Data Fetching
     │
     └─▶ Generate Static HTML Files
          │
          ▼
Production Serve (Static Files)
```

## Component Lifecycle

```
Component Creation
     │
     ├─▶ Server-Side (SSR/SSG)
     │   │
     │   ├─▶ Execute Component
     │   ├─▶ Fetch Data
     │   └─▶ Generate HTML
     │
     ▼
Client-Side (All Modes)
     │
     ├─▶ Receive HTML
     ├─▶ Hydrate (SSR) or Mount (CSR)
     ├─▶ Activate SolidJS Signals
     └─▶ Enable Reactivity
```

## Data Flow

```
User Action
     │
     ▼
Signal Update
     │
     ▼
Component Re-render
     │
     ▼
DOM Update (Fine-grained)
     │
     ▼
User Interface Update
```
