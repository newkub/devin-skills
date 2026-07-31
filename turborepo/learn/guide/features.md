# Features

## ฟีเจอร์หลักของ Turborepo

### 1. Intelligent Caching

Cache ผลลัพธ์ของ tasks และนำกลับมาใช้ใหม่:
- **Local Cache** - Cache ในเครื่อง
- **Remote Cache** - Cache บน cloud (Vercel, S3, Azure)
- **Cache Signing** - HMAC signing สำหรับความปลอดภัย
- **Cache Invalidation** - Auto invalidate เมื่อ inputs เปลี่ยน

### 2. Task Scheduling

จัดลำดับและ run tasks แบบ parallel:
- **Dependency Graph** - Build graph จาก task dependencies
- **Topological Sort** - เรียงลำดับ tasks อัตโนมัติ
- **Parallel Execution** - Run tasks พร้อมกันตาม graph
- **Concurrency Control** - จำกัดจำนวน tasks ที่ run พร้อมกัน

### 3. Workspace Filtering

Filter workspaces ที่ต้องการ run:
- **Name Filter** - Filter ตามชื่อ workspace
- **Dependency Filter** - Filter ตาม dependencies
- **Path Filter** - Filter ตาม path
- **Affected Mode** - Run เฉพาะ workspaces ที่ได้รับผลกระทบ

### 4. Remote Cache

แชร์ cache ระหว่างทีมและ CI/CD:
- **Vercel Remote Cache** - Integration กับ Vercel
- **Custom Remote Cache** - S3, Azure, custom API
- **Cache Compression** - Compress artifacts ก่อน upload
- **Cache Deduplication** - ลดขนาด cache

### 5. Environment Variables

จัดการ environment variables:
- **Global Env** - Env ที่ส่งผลต่อทุก tasks
- **Task Env** - Env ที่ส่งผลต่อ task เฉพาะ
- **Env Hashing** - Hash env เพื่อ cache key
- **Env Mode** - Strict, loose, หรือ none

### 6. Output Management

จัดการ outputs ของ tasks:
- **Output Patterns** - ระบุ files ที่ต้อง caching
- **Output Logs** - Control log output mode
- **Output Caching** - Cache outputs ไปยัง local/remote

### 7. Observability

ตรวจสอบและ monitor builds:
- **Run Summary** - Summary ของ task execution
- **Task Details** - Details ของแต่ละ task
- **OpenTelemetry** - Integration กับ observability tools
- **Metrics** - Export metrics ไปยัง Datadog, etc.

### 8. Package Manager Support

รองรับ package managers หลายตัว:
- **bun** - Default package manager
- **bun** - Fast, disk space efficient
- **yarn** - Plugable architecture
- **bun** - All-in-one toolkit

### 9. CI/CD Integration

Integration กับ CI/CD tools:
- **GitHub Actions** - Official action
- **GitLab CI** - Integration guide
- **CircleCI** - Orb support
- **Vercel** - Native integration

### 10. Pruning

สร้าง monorepo ที่ pruned สำหรับ CI:
- **Minimal Clone** - Clone เฉพาะ files ที่จำเป็น
- **Dependency Only** - Clone เฉพาะ dependencies
- **CI Optimization** - เร่ง CI builds
