---
name: caching
description: Caching and complexity performance review checklist
---

# Caching And Complexity

## Goal

caching และ algorithms มีประสิทธิภาพ

## Checks

1. ตรวจสอบ cache invalidation, TTL, key design, storage
2. ตรวจสอบ cache stampede, thundering herd, warming
3. ดู `references/time-complexity.md` เพื่อวิเคราะห์ Big O และ data structure บน critical paths
4. ตรวจสอบ data structure selection กับ input size

## Severity

- Critical: cache poisoning, stampede on critical path, wrong data structure causing O(n^2) on large input
- High: missing cache on hot path, missing TTL, suboptimal algorithm
- Medium: suboptimal cache key, missing warming
- Low: minor cache tuning
