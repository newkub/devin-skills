# Build Artifact And Config Checks

## Goal

ตรวจ build artifacts และ config ถูกต้องก่อน deploy

## Checks

### Build Process

1. ตรวจ build command ทำงานได้: `bun run build`, `nitro build`, `cargo build`
2. ตรวจ build สำเร็จไม่มี errors
3. ตรวจ build output ถูกสร้างใน directory ที่ถูกต้อง
4. ตรวจ bundle size ไม่เกิน limit

### Output Directory

1. ตรวจ output directory ถูกต้อง: `dist`, `build`, `.next`, `.output`
2. ตรวจ output directory ระบุใน platform config
3. ตรวจ static assets รวมอยู่ใน output
4. ตรวช source maps สำหรับ debugging (ถ้าต้องการ)

### Platform Config

1. ตรวจ `vercel.json` มี builds, routes, env ที่ถูกต้อง
2. ตรวจ `wrangler.jsonc` มี compatibilityDate, deployConfig
3. ตรวช `railway.json` มี settings ที่ถูกต้อง
4. ตรวช `Dockerfile` มี FROM, WORKDIR, COPY, RUN ที่ถูกต้อง

### Ignore Files

1. ตรวจ `.gitignore` ครบถ้วน
2. ตรวจ `.dockerignore` มีสำหรับ Docker deploy
3. ตรวช `.railwayignore` มีสำหรับ Railway deploy
4. ตรวช ignore patterns ไม่ exclude files ที่จำเป็น

## Severity

- Critical: build ไม่สำเร็จ, output directory ผิด, platform config ขาด
- High: bundle size เกิน, ignore files ขาด, config ไม่ถูกต้อง
- Medium: source maps ขาด, static assets ไม่ครบ, config ไม่ละเอียด
- Low: ignore patterns ไม่สม่ำเสมอ, config formatting
