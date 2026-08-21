---
name: software-security
description: พัฒนา software อย่างปลอดภัย defensive security
triggers:
  - user
  - model
related:
  - review-security
  - follow-auth
  - follow-best-practice
---

## Goal

ออกแบบและเขียน software ทีปลอดภัยจาก threats ทั่วไป

## Scope

ใช้กับทุก project ที่ต้องการ secure coding, auth, data protection

## Execute

### 1. Identify Threats

1. ระบุ assets ที่ต้องปกป้อง
2. หา attack surface
3. ใช้ STRIDE หรือ OWASP สำหรับ threat modeling

### 2. Secure Code

1. Validate input ทุกช่องทาง
2. Output encode ก่อน render
3. ใช้ parameterized queries
4. หลีกเลี่ยง secrets ใน source

### 3. Authentication And Authorization

1. ใช้ standard auth (OAuth, OIDC, SAML) ถ้าเป็นไปได้
2. กำหนด least privilege
3. ใช้ RBAC/ABAC ถ้าจำเป็น
4. ทำ /follow-auth หรือ /follow-workos ถ้าใช้ service

### 4. Data Protection

1. Encrypt at rest และ in transit
2. Hash passwords ด้วย bcrypt/argon2
3. ลบ sensitive data ที่ไม่จำเป็น
4. ใช้ secure headers

### 5. Scan And Test

1. รัน SAST/DAST
2. ตรวจ dependencies vulnerabilities
3. ทำ security review
4. ติดตั้ง monitoring

## Rules

- Never trust input
- Fail securely
- Keep secrets out of code
- Use least privilege

## Expected Outcome

- ไม่มี common vulnerabilities
- Auth/AuthZ ถูกต้อง
- Sensitive data ปลอดภัย
- ผ่าน security review
