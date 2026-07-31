# How It Works

## การทำงานของ tsdown

```
┌─────────────────────────────────────────────────────────────┐
│                     Input Source                             │
│  TypeScript/JavaScript files (.ts, .tsx, .js, .jsx)         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Type Checking                               │
│  - TypeScript compiler                                      │
│  - Generate type information                                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                Rolldown Bundling                             │
│  - Module resolution                                         │
│  - Tree shaking                                              │
│  - Code splitting                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Multiple Output Formats                         │
│  - ESM (ES Modules)                                          │
│  - CJS (CommonJS)                                            │
│  - IIFE (browser)                                            │
│  - UMD (universal)                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│           Declaration Generation (Oxc)                       │
│  - Extract type information                                  │
│  - Generate .d.ts files                                      │
│  - Optimize declarations                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Output Files                              │
│  - dist/index.mjs (ESM)                                      │
│  - dist/index.cjs (CJS)                                      │
│  - dist/index.d.ts (declarations)                            │
└─────────────────────────────────────────────────────────────┘
```

## Pipeline หลัก

### Phase 1: Source Analysis
1. **Entry Point Detection** - ค้นหา entry point จาก package.json
2. **Module Resolution** - แก้ไข module paths
3. **Dependency Graph** - สร้าง dependency graph

### Phase 2: Type Processing
1. **Type Checking** - TypeScript type checking
2. **Type Extraction** - ดึง type information
3. **Type Optimization** - ลดขนาด type declarations

### Phase 3: Bundling
1. **Tree Shaking** - ลบ code ที่ไม่ได้ใช้
2. **Code Transformation** - แปลง code ตาม target
3. **Minification** (optional) - ลดขนาด bundle

### Phase 4: Output Generation
1. **Format Generation** - สร้าง multiple formats
2. **Declaration Files** - สร้าง .d.ts files
3. **Source Maps** (optional) - สร้าง source maps

## Plugin System

```
┌────────────────┐
│   Input Code   │
└────────┬───────┘
         │
         ▼
┌───────────────────────────────────────┐
│         Plugin Pipeline                │
│  ┌─────────┐  ┌─────────┐             │
│  │ Plugin 1│→ │ Plugin 2│→ ... →      │
│  └─────────┘  └─────────┘             │
└───────────────┬───────────────────────┘
                │
                ▼
┌────────────────┐
│  Output Code   │
└────────────────┘
```

### ประเภท Plugins
- **Rollup plugins** - รองรับ plugins จาก Rollup ecosystem
- **unplugin** - Universal plugin system
- **Vite plugins** - บาง plugins จาก Vite
- **Custom plugins** - เขียน custom plugins ได้
