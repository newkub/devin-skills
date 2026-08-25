---
name: follow-service-aws-sdk
description: ใช้ AWS SDK ตาม best practices สำหรับการเชื่อมต่อกับ AWS cloud services
---

## Goal

ใช้ AWS SDK ตาม best practices สำหรับการเชื่อมต่อกับ AWS cloud services

## Scope

ใช้สำหรับการพัฒนา applications ที่ต้องการ interact กับ AWS services เช่น S3, Lambda, DynamoDB และอื่นๆ

## Execute

### 1. Install And Configure

> Goal: ติดตั้ง AWS SDK และกำหนดค่า credentials

1. Install SDK ด้วย `bun add @aws-sdk/client-s3` สำหรับ service ที่ต้องการ
2. Configure credentials ด้วย IAM roles สำหรับ production หรือ environment variables สำหรับ development
3. Create client instance ด้วย `new S3Client({ region: 'us-east-1' })`
4. ใช้ TypeScript สำหรับ type safety และ autocomplete

### 2. Make API Calls

> Goal: เรียกใช้ AWS services ด้วย command pattern

1. Make API calls ด้วย command pattern เช่น `await client.send(new PutObjectCommand(...))`
2. Handle errors ด้วย try-catch และใช้ built-in retry logic
3. ใช้ streaming สำหรับ large files
4. ใช้ pagination helpers สำหรับ large datasets

## Rules

### 1. Installation

- ใช้ `bun add` หรือ `bun add -D` แทน `bun install`
- Install เฉพาะ clients ที่ต้องการ (modular v3)

### 2. Security

- ใช้ IAM roles สำหรับ production
- ใช้ environment variables สำหรับ development
- ไม่ hardcode credentials ใน code

### 3. Error Handling

- Handle AWS SDK errors อย่างเหมาะสม
- Implement retry logic ด้วย built-in retries
- Log errors สำหรับ debugging

### 4. Type Safety

- ใช้ TypeScript สำหรับ type safety
- ใช้ streaming สำหรับ large files
- ใช้ pagination helpers สำหรับ large datasets

## Expected Outcome

- Integration กับ AWS services ที่ reliable
- Code ที่ follow best practices
- Error handling ที่ robust
- Security ที่เหมาะสม
