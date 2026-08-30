---
name: follow-create-raycast-extensions
description: สร้าง Raycast Extensions ด้วย TypeScript, React และ Raycast API สำหรับ macOS productivity
related:
  - follow-create-sdk
  - follow-my-tech-stack
  - review-techstack
  - follow-tool-vite
---
## Goal

สร้าง Raycast Extensions ที่ใช้ TypeScript, React และ Raycast API เพื่อเพิ่ม productivity บน macOS ผ่าน command palette และ menu bar

## Scope

ใช้สำหรับสร้าง Raycast Extensions บน macOS ด้วย TypeScript, React และ Raycast API

## Execute

### 1. Review Tech Stack

> Goal: ตรวจสอบ tech stack ก่อนสร้าง

1. ทำ `/follow-my-tech-stack` เพื่อสรุป tech stack ที่ใช้
2. ทำ `/review-techstack` เพื่อ review tech stack, dependencies, และ library design
3. บันทึกเหตุผลที่เลือก stack และ libraries สำหรับ reference ต่อไป

### 2. Setup Environment

> Goal: เตรียม environment สำหรับ Raycast extension development

1. ติดตั้ง Raycast บน macOS และ Sign in
2. ตรวจสอบ Raycast CLI: `bunx ray --version` และ `bunx ray whoami`
3. ยืนยัน Node.js 18+ และ Bun ติดตั้งแล้ว

### 3. Create Extension Project

> Goal: สร้าง extension project ด้วย CLI

1. รัน `bunx create-raycast-extension@latest {extension-name}`
2. เลือก template: `hello-world`, `detail`, `form`, `list`, `ai`, หรือ `menu-bar`
3. ย้าย project เข้า `desktop-apps/raycast-extensions/{extension-name}/`
4. ตรวจสอบโครงสร้าง: `package.json`, `src/`, `tsconfig.json`

### 4. Configure Manifest

> Goal: กำหนด manifest ใน package.json ตาม Raycast schema

1. แก้ไข `package.json` ตาม Raycast schema:

```json
{
  "$schema": "https://www.raycast.com/schemas/extension.json",
  "name": "{extension-name}",
  "title": "Extension Name",
  "description": "What this extension does",
  "icon": "extension-icon.png",
  "author": "your-username",
  "categories": ["Productivity"],
  "commands": [{ "name": "index", "title": "Command", "mode": "view" }],
  "dependencies": {
    "@raycast/api": "^1.79.0",
    "@raycast/utils": "^1.16.0"
  }
}
```

2. เลือก `mode`: `view`, `no-view`, หรือ `menu-bar`
3. รัน `bun install`

### 5. Develop Commands

> Goal: พัฒนา commands ด้วย Raycast API
1. List Command:

```tsx
import { List, ActionPanel, Action } from "@raycast/api";

export default function Command() {
  return (
    <List>
      <List.Item title="Item" actions={<ActionPanel><Action title="Select" /></ActionPanel>} />
    </List>
  );
}
```

2. Form Command:

```tsx
import { Form, ActionPanel, Action } from "@raycast/api";

export default function Command() {
  return (
    <Form actions={<ActionPanel><Action.SubmitForm title="Create" /></ActionPanel>}>
      <Form.TextField id="title" title="Title" />
    </Form>
  );
}
```

3. ใช้ Raycast API:
   - Clipboard: `Clipboard.copy()`, `Clipboard.readText()`
   - Cache: `new Cache()`, `cache.set()`, `cache.get()`
   - Storage: `LocalStorage.setItem()`, `LocalStorage.getItem()`
   - Preferences: `getPreferenceValues<Preferences>()`

### 6. Test Extension

> Goal: ทดสอบ extension ด้วย develop, lint และ build
1. รัน `bunx ray develop`
2. รัน `bunx ray lint`
3. รัน `bunx ray build`

### 7. Publish Extension

> Goal: เตรียม extension สำหรับ publish สู่ Raycast Store
1. สร้าง screenshots ใน `metadata/`
2. อัปเดต `CHANGELOG.md`
3. Fork https://github.com/raycast/extensions
4. Copy extension เข้า `extensions/{extension-name}/`
5. สร้าง Pull Request
6. สำหรับ update: `bunx ray publish`

## Rules

### 1. Structure

```
desktop-apps/raycast-extensions/{extension}/
├── src/
│   ├── index.tsx
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── assets/
│   └── icon.png (512x512)
├── metadata/
│   └── screenshot-1.png
├── package.json
├── tsconfig.json
├── CHANGELOG.md
└── README.md
```

### 2. Standards

- ใช้ `bunx` สำหรับ Raycast CLI
- ใช้ Raycast UI: `List`, `Grid`, `Form`, `Detail`, `ActionPanel`
- ต้องมี `CHANGELOG.md`
- ใช้ `@raycast/eslint-plugin`

### 3. Command Modes

| Mode | Use Case |
|------|----------|
| `view` | แสดง UI |
| `no-view` | Background script |
| `menu-bar` | Menu bar |

## Expected Outcome

- Extension สร้างด้วย `bunx create-raycast-extension`
- Manifest ถูกต้อง
- Commands ทำงานได้
- Raycast API ใช้งานได้
- Build ผ่าน `bunx ray build`
- พร้อม publish สู่ Raycast Store
