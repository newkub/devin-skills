# Caching Checklist — review-backend

## Strategy

- [ ] cache strategy ระบุชัดต่อ data class — cache-aside, read/write-through, write-behind
- [ ] what gets cached เหตุผลชัด — hot reads, expensive computes, external API responses
- [ ] cache keys namespaced — version/tenant/user scope ใน key, ไม่ชนกัน
- [ ] cache layering — local (in-process) vs shared (Redis/Memcached) เลือกถูกตาม consistency need

## Invalidation

- [ ] invalidation path ชัด — write → invalidate/update ทุก key ที่เกี่ยว
- [ ] TTL สมเหตุต่อ data volatility — session data สั้น, reference data ยาว
- [ ] event-driven invalidation สำหรับ shared entities — publish change → invalidate subscribers
- [ ] stale-while-revalidate ถ้าใช้ — stale tolerance ระบุ, background refresh
- [ ] delete/update ordering — write-then-delete vs delete-then-write race ระบุ

## Stampede Protection

- [ ] hot key expiry — request coalescing/single-flight หรือ jittered TTL
- [ ] cache miss storm — probabilistic early refresh หรือ lock-on-miss สำหรับ expensive rebuilds
- [ ] negative caching — misses ก็ cache (สั้นๆ) ป้องกัน DB hammering บน keys ที่ไม่มีจริง

## Correctness

- [ ] serialization round-trip — values encode/decode ครบ (types, dates, unicode)
- [ ] cache poisoning — user input ใน key ไม่ inject ข้าม namespace
- [ ] PII/sensitive data — TTL สั้น หรือไม่ cache ตาม policy; encryption at rest ถ้าจำเป็น
- [ ] cache vs DB consistency — acceptable staleness window ระบุ, reads-after-writes ไม่ confuse

## Sizing And Eviction

- [ ] memory bound — max keys/size cap, eviction policy (LRU/LFU) เหมาะ workload
- [ ] per-key size bound — giant values ไม่ล้น cache
- [ ] hit-rate monitoring — cache จริงช่วยหรือเปล่า (low hit rate = overhead)

## HTTP/Client Caching

- [ ] `Cache-Control`/`ETag`/`Last-Modified` ถูกตาม resource type
- [ ] private vs public cache ถูก — user data `private, no-store`, shared assets `public`
- [ ] cache-busting สำหรับ static assets — content hash ใน filename

## Detection

- grep cache libs — `redis`, `ioredis`, `node-cache`, `lru-cache`, `cache-control` headers
- ตรวจ TTL values, invalidation calls รอบ writes

Severity: stale sensitive data / no invalidation on writes = High, no stampede protection on hot path = Medium, no hit monitoring = Low
