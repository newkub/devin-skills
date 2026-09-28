---
name: review-security-check-injection
description: Check injection surfaces — SQL/NoSQL/command/template/XSS ที่ trust boundaries
argument-hint: "[scope]"
related:
  - scan-codebase
  - use-astgrep
  - report
---

## Goal

Run the injection prevention dimension of `/review-security` แบบ focused — trace user input ไปถึง sinks ที่อันตรายทุกชนิด

## Scope

- ใช้เมื่อ `/review-security` dispatch มาที่ `injection`/`sqli`/`xss` หรือเรียก standalone
- ครอบคลุม: SQL/NoSQL injection, command injection, template injection/SSTI, XSS (stored/reflected/DOM), path traversal, LDAP/header injection
- ไม่รวม: OWASP Top 10 เต็ม → parent Execute §4 (`references/owasp-top-10.md`)

## Execute

### 1. Map Sources And Sinks

> Goal: รู้ว่า untrusted input ไหลไปไหน

1. sources: request params/body/headers, file uploads, URL segments, env ที่ user-controlled
2. sinks: raw SQL (`query(`, `execute(`, template literals ใน ORM raw), `exec`/`spawn`/`eval`, `dangerouslySetInnerHTML`, `v-html`, file path joins
3. ใช้ `/use-astgrep` หา sink patterns เป็นระบบ — grep เดียวกัน capture pattern ต่างกัน

### 2. Injection Checks

> Goal: ครอบคลุมทุก injection dimension

ทำตาม `../../references/injection.md`

1. parameterized queries ทุกจุด — string concat ใน query = finding
2. escaping/sanitization ที่ boundary — output encoding ตาม context (HTML/attr/JS/URL)
3. command args — ห้าม shell string interpolation; allowlist เมื่อ escape ไม่ได้

### 3. Report

> Goal: findings พร้อม exploit path

1. ทำ `/report` ตาราง: `No.`, `Type`, `Severity`, `Source → Sink`, `Location`, `Fix`
2. ทุก finding ระบุ exploit path สั้นๆ หรือ tag `theoretical`

## Rules

- Review เท่านั้น ไม่แก้ไข code — fix ใน parent `## Fix` (parameterized queries, escaping, validation at boundary)
- ทุก finding ต้องมี file path + line ของทั้ง source และ sink
- SQL/XSS/command injection บน user input = Critical; theoretical ที่มี validation คั่น = Medium

## Expected Outcome

- Injection findings พร้อม source→sink path และ severity
- แยก exploitable vs theoretical ชัดเจน
