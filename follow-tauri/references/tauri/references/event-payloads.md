---
title: Event Payloads
description: Event Payload Types ใน Tauri
---

```typescript
// Window events
interface ResizeEvent {
  size: { width: number; height: number };
}

interface MoveEvent {
  position: { x: number; y: number };
}

// File drop event
interface FileDropEvent {
  paths: string[];
  position: { x: number; y: number };
}
```
