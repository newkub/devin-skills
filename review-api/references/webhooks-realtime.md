# Webhooks And Realtime Checklist — review-api

## Webhook Delivery

- [ ] signature verification — HMAC signature header per delivery, timestamped (replay protection)
- [ ] retry policy — exponential backoff, max attempts, dead-letter after exhaustion
- [ ] delivery timeout — bounded per attempt, ไม่ค้าง worker
- [ ] ordering — at-least-once + ไม่ guarantee order ชัดเจนใน docs (หรือ sequencing field)
- [ ] idempotent receivers — event id + dedup guidance, `event_id` unique per logical event
- [ ] payload schema — versioned event types (`type`, `api_version`), typed payload

## Webhook Management

- [ ] endpoint registration — URL validation (https-only on prod), secret rotation path
- [ ] subscription scoping — which events per endpoint, ไม่ blast ทุกอย่าง
- [ ] failure visibility — delivery logs, last-attempt status, manual replay
- [ ] SSRF safety — webhook target URL validation (no internal IPs/localhost on prod)

## WebSocket / SSE

- [ ] auth on connect — token in handshake/first message, expiry re-check
- [ ] authorization per channel — subscribe scope enforced server-side
- [ ] message schema — typed events, version field, consistent envelope
- [ ] reconnect contract — resume token / `Last-Event-ID` / catch-up strategy
- [ ] backpressure — slow consumers don't OOM server (bounded buffers, drop policy)
- [ ] heartbeat/ping-pong — dead connection detection + cleanup

## Event Versioning

- [ ] event schema changes — additive vs breaking, version negotiation
- [ ] payload docs — every event type documented with example payloads
- [ ] replay/re-drive — historical events re-deliverable สำหรับ late subscribers (ถ้า claim)
- [ ] secret hygiene — webhook secrets in env/secret store, rotation procedure

## Realtime Resilience

- [ ] connection limits — per-user/per-IP caps
- [ ] graceful drain — server restart ไม่ตัดทุก connection พร้อมกัน
- [ ] multi-instance fan-out — pub/sub layer (Redis/NATS) สำหรับ >1 replica
- [ ] offline queue — missed messages สำหรับ reconnecting clients (ถ้า claim)

## Detection

- grep webhook sender code — signature, retry, timeout config
- grep `ws`, `socket.io`, `EventSource`, `sendBeacon` server-side handlers
- ทำ `/review-api` ถ้ามี

Severity: unsigned webhooks = Critical, SSRF-able target URLs = Critical, no auth on channels = High, no dedup guidance = Medium
