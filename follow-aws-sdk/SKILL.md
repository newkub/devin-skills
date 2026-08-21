---
name: follow-aws-sdk
description: AWS SDK for JavaScript. Use for interacting with AWS services like S3, Lambda, DynamoDB, and...
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ใช้ AWS SDK ตาม best practices สำหรับการเชื่อมต่อกับ AWS cloud services


## Scope

ใช้สำหรับการพัฒนา applications ที่ต้องการ interact กับ AWS services เช่น S3, Lambda, DynamoDB และอื่นๆ


## Execute

- Install SDK ด้วย `bun add @aws-sdk/client-s3` สำหรับ service ที่ต้องการ
- Configure credentials ด้วย IAM roles สำหรับ production หรือ environment variables สำหรับ development
- Create client instance ด้วย `new S3Client({ region: 'us-east-1' })`
- Make API calls ด้วย command pattern เช่น `await client.send(new PutObjectCommand(...))`
- Handle errors ด้วย try-catch และใช้ built-in retry logic
- ใช้ TypeScript สำหรับ type safety และ autocomplete


## Rules

- ใช้ `bun add` หรือ `bun add -D` แทน `bun install`
- Install เฉพาะ clients ที่ต้องการ (modular v3)
- ใช้ IAM roles สำหรับ production
- ใช้ environment variables สำหรับ development
- ไม่ hardcode credentials ใน code
- Handle AWS SDK errors อย่างเหมาะสม
- Implement retry logic ด้วย built-in retries
- Log errors สำหรับ debugging
- ใช้ TypeScript สำหรับ type safety
- ใช้ streaming สำหรับ large files
- ใช้ pagination helpers สำหรับ large datasets


## Expected Outcome

- Integration กับ AWS services ที่ reliable
- Code ที่ follow best practices
- Error handling ที่ robust
- Security ที่เหมาะสม
