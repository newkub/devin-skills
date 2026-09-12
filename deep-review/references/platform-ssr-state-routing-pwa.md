---
name: ssr-state-routing-pwa
description: SSR, state management, routing, and PWA review checklist
---

# SSR, State Management, Routing, PWA Review

## Goal

Review SSR, state management, routing, PWA compliance

## Checks

1. ตรวจสอบ SSR implementation, hydration correctness, SSR-compatible code, streaming SSR
2. ตรวจสอบ store organization, reactivity patterns, side effect management, state persistence
3. ตรวจสอบ route definitions, navigation guards, lazy loading, params validation
4. ตรวจสอบ service worker, web manifest, offline support, install prompt, background sync, push notifications

## Severity

- Critical: hydration mismatch, SSR พัง, state corruption, ไม่มี auth guard, ไม่มี service worker บน production
- High: ไม่มี hydration, unnecessary re-render, ไม่มี lazy load, cache เก่าหลัง update, ไม่มี offline fallback
- Medium: missing state persistence, suboptimal routing, partial PWA manifest
- Low: minor config gap, documentation gap
