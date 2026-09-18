---
name: network-and-api
description: Network and API performance review checklist
---

# Network And API Performance

## Goal

API calls และ network layer มีประสิทธิภาพ

## Checks

1. ตรวจสอบ HTTP client, API endpoints, CDN, proxy, load balancer
2. ตรวจสอบ DNS records, TTL, prefetch/preconnect สำหรับ third-party origins
3. ตรวจสอบ connection pooling, keep-alive, HTTP/2, HTTP/3, compression
4. ตรวจสอบ latency, payload size, cache headers, retry strategy
5. ถ้าไม่มี network layer → ข้าม step นี้

## Severity

- Critical: connection leak, no retry on critical path, DNS failure causing outage
- High: missing connection pooling, no compression, large payload on hot path
- Medium: suboptimal cache headers, missing prefetch
- Low: minor DNS TTL tuning
