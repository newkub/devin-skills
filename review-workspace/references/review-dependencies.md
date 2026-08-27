---
name: review-dependencies
description: dependencies ถูกต้อง ไม่ซ้ำซ้อน ไม่ขาด ไม่เกิน
---

# Review Dependencies

ตรวจสอบ dependencies ของ workspace

## Goal

dependencies ถูกต้อง ไม่ซ้ำซ้อน ไม่ขาด ไม่เกิน

## Checks

1. แยก `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`
2. ระบุ `workspace:*` dependencies และตรวจสอบว่ามีอยู่จริง
3. ทำ `/check-unused-deps` เพื่อหา unused dependencies
4. ทำ `/run-audit` เพื่อตรวจ security vulnerabilities
5. ตรวจสอบ version constraints ระหว่าง workspaces ว่าสอดคล้องกัน

