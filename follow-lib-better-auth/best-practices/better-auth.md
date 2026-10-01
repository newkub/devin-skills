# Better Auth — Best Practices

Recommended patterns, security และ pitfalls สำหรับ Better Auth

## Recommended Patterns

- ใช้ plugin architecture — enable เฉพาะ plugins ที่ใช้จริง (`twoFactor`, `organization`, `admin`) — ทุก plugin เพิ่ม surface area
- Database adapter เลือกตาม ORM ที่มีอยู่ (drizzle/prisma/kysely) — อย่าใช้ 2 ORM ใน project เดียว
- Session: `useSession` (client) / `auth.api.getSession({ headers })` (server) — server-side check ทุก protected route ไม่ trust client state
- ใช้ `auth.handler` mount ที่ route เดียว (`/api/auth/*`) — ไม่ wrap handler เองยกเว้นจำเป็น
- Hooks (`before`/`after`) สำหรับ side effects: audit log, user provisioning — ไม่ใส่ business logic ใน component

## Common Pitfalls

- `BETTER_AUTH_SECRET` ต้อง strong + จาก env เท่านั้น — ห้าม commit/hardcode; เปลี่ยน secret = invalidate ทุก session
- `trustedOrigins` ต้องระบุ explicit — wildcard เปิด CSRF; production ≠ localhost list เดียวกัน
- Social providers: callback URL ต้องตรงกับ provider console เป๊ะ (protocol+host+path) — mismatch = silent redirect fail
- Rate limiting: เปิด built-in rate limiter บน sign-in/sign-up endpoints — auth endpoints เป็น brute-force target แรกเสมอ

## Security Notes

- CSRF: Better Auth ใช้ cookie-based auth → ต้อง `trustedOrigins` ถูกต้อง + SameSite cookies (default lax อยู่แล้ว)
- เก็บ sessions ใน DB adapter — stateless JWT mode เหมาะ edge แต่ revoke ยาก; เลือกตาม revocation needs
- Admin/plugin endpoints: guard ด้วย role checks ของ plugin ไม่ใช่แค่ route hiding

## Do / Don't

| Do | Don't |
|----|-------|
| plugin เท่าที่จำเป็น | enable ทุก plugin "เผื่อ" |
| server-side session check ทุก route | trust client `useSession` อย่างเดียว |
| rate-limit auth endpoints | ปล่อย sign-in ไม่จำกัด |
| env secret + trustedOrigins explicit | wildcard origins / hardcoded secret |
