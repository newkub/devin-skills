# Injection Prevention Validation Rules

## SQL Injection

- ตรวจ parameterized queries: ใช้ `?` หรือ named parameter — ห้าม string concatenation
- ตรวจ ORM usage: Drizzle, Prisma, Kysely — ใช้ query builder
- ตรวจ raw query prevention: หลีกเลี่ยง raw query, ถ้าจำเป็น validate input
- ตรวจ dynamic SQL: ไม่ build SQL จาก user input, ใช้ whitelist สำหรับ column/table name
- Detection: `ast-grep` หา template literal ใน query, `grep` หา `query(`, `execute(` ที่มี `${`

## NoSQL Injection

- ตรวจ query sanitization: ไม่ pass user input โดยตรงเป็น query object
- ตรวจ operator injection: ไม่ accept `$where`, `$expr`, `$func` จาก user input
- ตรวจ MongoDB `$where`: ห้ามใช้กับ user input — เป็น JavaScript execution
- Detection: `grep` หา `$where`, `$expr`, `req.body` ใน query

## Command Injection

- ตรวจ `exec`, `spawn`: ใช้ `spawn` กับ args array — ห้าม `exec` กับ string
- ตรวจ shell arguments: ไม่ pass user input โดยตรง, escape special character
- ตรวจ input sanitization: allowlist character, ไม่ allow `;`, `|`, `&`, `$`, backtick
- Detection: `grep` หา `exec(`, `execSync(`, `child_process` ที่มี user input

## XSS

- ตรวจ output encoding: HTML encode, attribute encode, JavaScript encode
- ตรวจ CSP: `default-src 'self'`, `script-src`, `object-src 'none'`
- ตรวจ `innerHTML`: ห้ามใช้กับ user input — ใช้ `textContent`
- ตรวจ `dangerouslySetInnerHTML`: ต้อง sanitize ก่อน (DOMPurify)
- ตรวจ `v-html`: ต้อง sanitize ก่อน
- Detection: `ast-grep` หา `innerHTML`, `dangerouslySetInnerHTML`, `v-html`

## CSRF

- ตรวจ token validation: CSRF token ใน form และ API, validate ที่ server
- ตรวจ SameSite cookies: `SameSite=Strict` หรือ `SameSite=Lax`
- ตรวจ Origin header check: validate `Origin` หรือ `Referer`
- ตรวจ double submit cookie: token ใน cookie และ header

## Path Traversal

- ตรวจ input validation: allowlist character, ไม่ allow `..`, `/`, `\`
- ตรวจ path joining: ใช้ `path.join`, `path.resolve` — ไม่ string concatenation
- ตรวจ `..` prevention: normalize path, check หลัง resolve
- ตรวจ symlink: ไม่ follow symlink จาก user input
- Detection: `grep` หา `path.join`, `fs.readFile` ที่มี user input

## SSRF

- ตรวจ URL validation: validate scheme, host, port
- ตรวจ allowlist: allowlist domain, block internal IP
- ตรวจ internal network block: block `127.0.0.1`, `10.x.x.x`, `172.16.x.x`, `192.168.x.x`
- ตรวจ metadata endpoint block: block `169.254.169.254` (AWS), `metadata.google.internal`
- Detection: `grep` หา `fetch(`, `axios`, `request` ที่มี user input ใน URL

## Deserialization

- ตรวจ unsafe `JSON.parse`: ใช้ schema validation หลัง parse
- ตรวจ `eval`: ห้ามใช้กับ user input
- ตรวจ template injection: ไม่ render template จาก user input
- ตรวจ prototype pollution: ไม่ merge user input โดยไม่ sanitize `__proto__`
- Detection: `grep` หา `eval(`, `Function(`, `Object.assign` ที่มี user input

## Severity Criteria

- Critical: SQL injection on critical path, XSS on user input, command injection, path traversal on file access, SSRF on user URL, prototype pollution
- High: missing parameterized query, missing output encoding, missing CSRF token, unsafe deserialization, missing CSP
- Medium: missing SameSite cookie, suboptimal input validation, missing Origin check
- Low: documentation gap, minor naming
