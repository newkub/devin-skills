---
name: realtime-review
description: ครอบคลุมทุก realtime dimension
---

# Realtime Review

Review realtime และ notification ครอบคลุม SSE/WebSocket, reconnection, notification channels, availability updates

## Goal

ครอบคลุมทุก realtime dimension

## Checks

1. ตรวจสอบ SSE/WebSocket patterns, connection lifecycle, และ error handling
2. ตรวจสอบ reconnection logic, backoff strategy, และ connection state recovery
3. ตรวจสอบ message ordering, data sync, และ availability update patterns
4. ตรวจสอบ notification channels, delivery patterns, template management, และ batching logic
5. ตรวจสอบ user preferences, notification routing, delivery reliability, และ retry logic
6. Critical: broken connection, data loss during reconnect, no error handling, broken delivery channel, no user preferences, notification spam
7. High: missing reconnection, no backoff strategy, broken message ordering, missing retry logic, no deduplication, broken template

