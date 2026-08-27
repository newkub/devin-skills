---
name: feature-flags-review
description: ครอบคลุมทุก feature flag dimension
---

# Feature Flags Review

Review feature flag management ครอบคลุม rollout strategy, flag cleanup, default values, flag governance

## Goal

ครอบคลุมทุก feature flag dimension

## Checks

1. ตรวจสอบ flag definition: naming convention, description, default value, flag type
2. ตรวจสอบ flag evaluation: server-side vs client-side, evaluation context, fallback behavior
3. ตรวจสอบ rollout strategy: percentage rollout, user targeting, segment-based rollout
4. ตรวจสอบ flag lifecycle: stale flags, orphaned flags, flags without cleanup plan
5. ตรวจสอบ flag governance: flag ownership, flag documentation, flag audit trail
6. ตรวจสอบ flag coupling: flags depending on other flags, flag conflict detection
7. Critical: flag ที่ควรเป็น production-safe ไม่ได้, flag ที่ทำให้ app crash เมื่อ off
8. High: stale flags ที่ควรลบ, missing default value, flag ที่ไม่มี cleanup plan

