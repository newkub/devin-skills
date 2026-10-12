---
name: follow-lib-tanstack-hotkeys
description: ใช้ TanStack Hotkeys ครบวงจร — shortcuts, modifiers, sequences, scopes, recording
argument-hint: "[framework]"
related:
  - follow-lib-tanstack-ecosystem
  - run-test
  - resolve-errors
---

## Goal

ใช้ TanStack Hotkeys ครบ — type-safe keyboard shortcuts: modifier combos, key sequences, scoped contexts, recording/user-remapping, key state tracking

## Scope

ใช้สำหรับ keyboard shortcuts — command palette, navigation, editor actions — **0.x**: ตรวจ `https://tanstack.com/hotkeys/latest` ก่อน implement เสมอ

- part of TanStack ecosystem — selection/dispatch อยู่ที่ `/follow-lib-tanstack-ecosystem`

## Execute

### 1. Install

```bash
bun add @tanstack/react-hotkeys   # framework adapters ตาม project
```

### 2. Register Shortcuts

> Goal: hotkeys typed + declarative

```tsx
import { useHotkey } from '@tanstack/react-hotkeys'

useHotkey('Mod+K', () => setPaletteOpen(true))     // Mod = Cmd (mac) / Ctrl (others)
useHotkey('G>G', () => navigate('/top'))           // sequence: กด g แล้ว g
useHotkey(['ArrowUp', 'K'], () => moveUp())        // aliases
useHotkey('Shift+?', () => setHelpOpen(true), { preventDefault: true })
```

- Modifiers: `Mod`, `Shift`, `Alt`, `Ctrl`, `Meta` — type-checked strings, typo ติด typecheck
- Options: `preventDefault`, `enabled` (conditional), `target` element, `ignoreInputs`

### 3. Scopes And Conflicts

> Goal: shortcuts respect context

1. `HotkeysProvider` scope boundaries — modal/ editor/ global แยกกัน; innermost scope ชนะเมื่อ key ซ้ำ
2. Editable elements — default ไม่ trigger ใน input/textarea/contentEditable; `enableOnFormTags` เมื่อต้องการ
3. `useKeyHold`/`useKeyState` — key state tracking (press-and-hold patterns เช่น push-to-talk)
4. Recording UI: `useHotkeysRecorder`-style API — จับ key combo จาก user เพื่อ remap (ตรวจ docs ล่าสุด)

### 4. Patterns

> Goal: shortcut UX ที่ดี

1. **Command palette** = canonical use case — `Mod+K` palette + register commands ผ่าน hotkeys เดียวกัน
2. **Help overlay** — `Shift+?` แสดง shortcut cheat sheet ของ app
3. **Conflict audit** — maintain registry ของ shortcuts ทั้ง app (code review checklist)
4. **Accessibility** — shortcuts เสริม ไม่แทน pointer paths; document ใน help

### 5. Verify

1. `/run-test` — dispatch keydown events assert handlers
2. Input contexts: ไม่ trigger เมื่อพิมพ์อยู่ (เว้น intended)
3. Sequences: timing window ทำงาน, partial sequence reset
4. ถ้า fail → `/resolve-errors` max 3 รอบ

## Rules

- ใช้ `Mod` แทน `Ctrl`/`Cmd` แยก — cross-platform ในตัวเดียว
- หลีกเลี่ยงชน browser defaults (`Mod+T`, `Mod+W`, `Mod+N`) — override เฉพาะเมื่อจำเป็นจริง
- Sequence สูงสุด 2-3 keys — ยาวกว่านั้น UX แย่
- 0.x API — pin version; verify signatures กับ docs ล่าสุด
- ใช้ `/follow-lib-tanstack-ecosystem` สำหรับ library selection

## Expected Outcome

- Shortcuts type-safe ครบ modifiers/sequences
- Scopes + input contexts ทำงานถูก
- User-remappable hotkeys พร้อม (ถ้าใช้)
