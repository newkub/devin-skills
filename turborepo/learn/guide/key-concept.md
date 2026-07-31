# Key Concepts

## แนวคิดหลักของ Turborepo

Turborepo เป็น build system สำหรับ JavaScript/TypeScript monorepos ที่ออกแบบมาเพื่อ:
- **Intelligent Caching** - Cache ผลลัพธ์ของ tasks และนำกลับมาใช้ใหม่
- **Task Scheduling** - จัดลำดับและ run tasks แบบ parallel
- **Remote Cache** - แชร์ cache ระหว่างทีมและ CI/CD
- **Affected Mode** - Run เฉพาะ tasks ที่ได้รับผลกระทบจากการเปลี่ยนแปลง

## Core Concepts

### Tasks

Tasks คือคำสั่งที่ define ไว้ใน `turbo.json` เช่น `build`, `test`, `lint`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    }
  }
}
```

### Cache

Turborepo cache ผลลัพธ์ของ tasks โดยใช้:
- **Input Hashing** - Hash inputs และ environment variables
- **Local Cache** - Cache ในเครื่อง (`.turbo/cache`)
- **Remote Cache** - Cache บน cloud (Vercel, S3, etc.)

### Dependencies

Task dependencies กำหนดลำดับการทำงาน:
- `^build` - Run build ของ dependencies ก่อน
- `build` - Run build ของ workspace ปัจจุบัน

### Workspace Filtering

Filter workspaces ด้วย:
- `--filter=web` - Run เฉพาะ workspace ชื่อ web
- `--filter=web...` - Run web และ dependencies
- `--filter=!docs` - Exclude workspace ชื่อ docs

## Workflow

```
Code Change → Hash Inputs → Check Cache → Cache Miss → Run Task → Cache Result
              ↓
         Cache Hit → Return Cached Result
```
