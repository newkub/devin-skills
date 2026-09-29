# Transport And Auth Checklist — review-mcp

## Stdio Transport

- [ ] spawn command/args ถูก — binary exists, args order correct, cwd sensible
- [ ] env pass minimal — เฉพาะที่ server ต้องใช้, ไม่ inherit ทั้ง process env
- [ ] child process cleanup — SIGTERM/SIGKILL on client exit, ไม่มี zombie
- [ ] stderr handling — log แยก, ไม่ pollute protocol stream
- [ ] startup timeout — server ช้าเกิน threshold → fail fast + message ชัด

## SSE/HTTP Transport

- [ ] TLS บังคับ — `https://` เท่านั้นสำหรับ remote, `http://localhost` ยอมรับได้เฉพาะ local
- [ ] auth — bearer token/API key ใน header, ไม่ใน URL (leak ผ่าน logs)
- [ ] origin/host validation — server ไม่รับ connection จากทุก origin
- [ ] CORS จำกัด — ไม่ `*` บน authenticated endpoints
- [ ] SSE reconnect — `Last-Event-ID` resume หรือ graceful re-init

## OAuth (HTTP transport)

- [ ] client registration flow — dynamic registration หรือ pre-registered client_id
- [ ] scopes minimal — ขอเฉพาะที่ tools ใช้จริง
- [ ] token storage — secure (OS keychain/encrypted), ไม่ plaintext file
- [ ] refresh + expiry handling — silent refresh, ไม่ force re-login ทุกครั้ง
- [ ] revocation path — disconnect แล้ว token ถูก revoke

## Session Lifecycle

- [ ] init handshake — `initialize` + `initialized` notification ถูก protocol version
- [ ] protocol version negotiation — server รองรับ versions ที่ client ใช้
- [ ] keep-alive — ping/heartbeat หรือ timeout detection
- [ ] reconnect strategy — auto-reconnect + backoff เมื่อ transport drop
- [ ] graceful shutdown — `shutdown`/`exit` sequence, in-flight calls resolve/abort ชัดเจน

## Detection

- inspect MCP config files — transport type, URL, env
- test connect + `initialize` handshake จริง
- grep server startup code — spawn args, env passthrough, TLS setup

Severity: no TLS on remote / secrets in URL = Critical, no auth on HTTP transport = High, no cleanup/reconnect = Medium
