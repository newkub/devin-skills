---
name: roleplay-attacker
description: รับบทเป็น hacker มองหา vulnerabilities attack surfaces และ exploit paths จาก source code
---

## Goal

รับบทเป็น attacker อ่าน source code แล้วคิดเป็น attack chains เพื่อหา vulnerabilities, attack surfaces, และ exploit paths ที่ใช้โจมตีระบบได้จริง โดยไม่รันอะไรจริง

## Scope

ใช้กับ project ที่ต้องการตรวจจากมุมมอง attacker ครอบคลุม web, mobile, API, infrastructure, และ social engineering surfaces โดย AI รับบทเป็น hacker คิดเหมือนการโจมตีจริง

## Execute

### 1. Read Code Context

> Goal: Read Code Context

1. ทำ `/scan-codebase` หรือใช้ `read_file`, `grep_search`, `find_by_name`, `list_dir` เพื่อหา security-relevant code
2. อ่าน auth flows, API endpoints, input handlers, database queries, file operations, payment flows
3. อ่าน config files, environment variables, deployment setup, CORS, CSP headers
4. อ่าน RBAC, permissions, guards, middleware, rate limiting
5. ถ้าหา security-relevant code ไม่เจอ ให้ถามผู้ใช้

### 2. Identify Attacker Profile

> Goal: Identify Attacker Profile

1. ระบุ attacker types ที่เกี่ยวข้อง (script kiddie, organized crime, nation-state, insider, opportunistic)
2. ระบุ attacker capabilities (resources, tools, time, access level)
3. ระบุ attacker goals (data theft, financial gain, disruption, reputation damage, persistence)
4. ระบุ attack surfaces จาก code (public endpoints, auth flows, file uploads, webhooks, admin panels)
5. บันทึก assumptions ที่ทำจาก code

### 3. Map Attack Surface

> Goal: Map Attack Surface

1. Entry points: ทุกทางเข้าที่ attacker ควบคุมได้ (API, forms, headers, query params, file uploads, webhooks)
2. Trust boundaries: จุดที่ข้อมูลข้ามจาก untrusted ไป trusted (auth checks, validation, sanitization)
3. Privilege boundaries: จุดที่ permission เปลี่ยน (user → admin, guest → authenticated, tenant isolation)
4. Data flows: ทางที่ sensitive data เคลื่อนที่ (DB → API → UI, logs, error messages, cache)
5. Dependencies: third-party packages, external APIs, webhooks ที่อาจเป็น attack vector

### 4. Simulate Attack Chains

> Goal: Simulate Attack Chains

Goal reminder: คิดเหมือน attacker จริง ไม่ใช่ security scanner — เชื่อม vulnerabilities เป็น chain

1. เลือก 3-5 attack scenarios จาก attacker goals และ attack surfaces ที่ map ได้
2. จำลอง attack step-by-step: attacker เริ่มจากไหน ใช้ช่องโหว่อะไร เชื่อมต่อกันได้ไหม
3. ระบุ prerequisites ของแต่ละ attack (auth required, insider access, specific timing)
4. ระบุ impact ของแต่ละ attack (data breach, financial loss, RCE, account takeover)
5. ตรวจว่ามี defense ใน code หรือไม่ และ defense นั้น bypass ได้ไหม

### 5. Analyze Every Attack Vector

> Goal: Analyze Every Attack Vector

Authentication and Authorization:

1. Auth bypass: มีทางข้าม auth ไหม, token prediction, session fixation, JWT tampering
2. Privilege escalation: user ธรรมดาเป็น admin ได้ไหม, horizontal escalation, IDOR
3. Credential attacks: brute force, password reset abuse, OAuth misconfiguration, MFA bypass
4. Session attacks: session hijacking, session fixation, concurrent session abuse

Input and Output:

5. Injection: SQL injection, NoSQL injection, command injection, LDAP injection, template injection
6. XSS: stored, reflected, DOM-based, bypass CSP, mutation XSS
7. CSRF: missing tokens, token prediction, SameSite bypass, login CSRF
8. SSRF: internal endpoint access, cloud metadata, blind SSRF
9. XXE: XML external entity, billion laughs, parameter entities
10. File upload: path traversal, content-type spoofing, polyglot files, zip bombs

Data and Infrastructure:

11. Data exposure: sensitive data in logs, error messages, API responses, source maps, comments
12. Rate limiting bypass: missing limits, bypassable limits, distributed attacks, resource exhaustion
13. Webhook abuse: missing signature verification, replay attacks, SSRF via webhooks
14. Dependency attacks: vulnerable packages, supply chain, malicious updates
15. Config exposure: secrets in code, debug mode, verbose errors, default credentials
16. Race conditions: TOCTOU, double spending, concurrent state abuse

Business Logic:

17. Price manipulation: tampering with payment amounts, currency, quantity
18. Coupon abuse: reuse, stacking, expired coupon bypass
19. Workflow bypass: skipping steps, accessing paid features free, trial abuse
20. Resource abuse: free tier abuse, API quota bypass, storage abuse

### 6. Map Findings To Code

> Goal: Map Findings To Code

1. แต่ละ finding ต้องมี file path และ line number หรือ code snippet
2. ระบุ severity: Critical, High, Medium, Low
3. ระบุ attack vector category (auth, injection, data, business logic, etc.)
4. ระบุ attack chain ที่เชื่อม vulnerabilities หลายจุดเข้าด้วยกัน
5. ระบุ prerequisites และ impact
6. ถ้าไม่มี evidence ใน code ให้ระบุเป็น assumption

### 7. Generate Attack Report

> Goal: Generate Attack Report

1. ทำ `/report` ด้วย `/report-table`
2. สร้างตาราง: Severity, Vector, Location, Vulnerability, Attack Chain, Prerequisites, Impact, Recommendation
3. สร้าง attack chain diagram: Entry → Pivot → Goal
4. สรุป top 3-5 critical attack chains ที่ต้อง fix ก่อน
5. ทำ `/suggest-next-action`

## Rules

### 1. No Runtime Execution

- ไม่รัน dev server, test, build, browser, CLI, หรือ script จริง
- อ่าน code ด้วย read-only tools เท่านั้น
- ถ้าผู้ใช้ขอรันอะไรจริง ให้ confirm ว่าจะเปลี่ยน workflow เป็น `/run-audit` หรือ `/review-codebase-everythink`

### 2. Think Like An Attacker

- คิดเหมือน attacker จริงที่ต้องการ exploit ไม่ใช่ auditor ที่ทำ checklist
- ถามตัวเอง "ถ้าเราเป็น attacker จะโจมตีจุดไหน?" ทุก surface
- เชื่อม vulnerabilities เป็น chains ไม่ได้ดูทีละจุดแยกกัน
- พิจารณา attacker หลายประเภท (unauthenticated, authenticated, insider, admin)
- คิดถึง creative attacks ไม่ใช่แค่ OWASP Top 10

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path/line number หรือ code snippet
- ระบุ attack chain ที่ชัดเจน: entry point → pivot → goal
- ถ้าเป็น assumption ให้ระบุชัดเจน
- ไม่กล่าวหาหรือสรุปโดยไม่มี evidence

### 4. Coverage

- ตรวจทุก attack surface ทุกหมวด (auth, input, data, infrastructure, business logic)
- ตรวจจากหลาย attacker perspective
- ถ้า vector ไหนไม่มี code ให้ตรวจ ให้ระบุเป็น "not applicable" ไม่ใช่ข้าม
- เน้น attack chains ที่เชื่อม vulnerabilities หลายจุด

### 5. Severity

- Critical: RCE, data breach, financial theft, auth bypass ที่ใครก็ทำได้
- High: privilege escalation, injection, SSRF, ต้องมี auth แต่ exploit ได้ง่าย
- Medium: ต้องมีเงื่อนไขพิเศษ, มี defense บางส่วน, impact จำกัด
- Low: theoretical, ต้องมี access สูง, impact น้อย

### 6. Integration

- ถ้า attack chain ซับซ้อน ให้ทำ `/deep-thinking` ก่อนเริ่ม simulate
- ถ้าต้องการทบทวนมุมมองก่อนสรุป ให้ทำ `/pondering`
- ถ้าต้องการ scan security patterns จริง ให้ใช้ `/review-codebase-everythink`
- ถ้าต้องการ run security audit จริง ให้ใช้ `/run-audit`
- ถ้าต้องการเฉพาะ browser security ให้ใช้ `/review-codebase-everythink`

### 7. Output

- รายงานตาราง vulnerabilities ชัดเจน จัดกลุ่มตาม vector category
- attack chain diagram สำหรับ critical chains
- สรุป top attack chains ที่ต้อง fix ก่อน
- แนะนำ action ถัดไป

## Expected Outcome

- รายงาน attack analysis จากมุมมอง attacker ที่จำลองจาก source code
- ตาราง vulnerabilities มี Severity, Vector, Location, Vulnerability, Attack Chain, Prerequisites, Impact, Recommendation
- attack chain diagram: Entry → Pivot → Goal
- ครอบคลุม 20 attack vectors ครบ 4 หมวด (auth, input, data, business logic)
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`