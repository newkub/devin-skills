---
name: create-vscode-extensions
description: สร้าง VS Code extensions ด้วย TypeScript และ VS Code API
allowed-tools:
  - read
  - write
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

สร้าง VS Code extensions ด้วย TypeScript และ VS Code API

## Scope

ใช้สำหรับสร้าง extensions ที่ add commands, extend editor functionality, integrate กับ external tools และสร้าง language support

## Execute

### 1. Install Prerequisites

> Goal: ติดตั้ง tools สำหรับสร้าง VS Code extension
> Goal: environment พร้อมสำหรับ development

1. ติดตั้ง `yo` และ `generator-code`:
   ```bash
   bun install -g yo generator-code
   ```
2. ติดตั้ง `vsce` สำหรับ package/publish:
   ```bash
   bun install -g vsce
   ```

### 2. Generate Extension

> Goal: สร้างโครงสร้าง extension
> Goal: มา project template สำหรับ VS Code extension

1. รัน `yo code`
2. เลือกประเภท:
   - New Extension
   - Color Theme
   - Language Support
   - Code Snippets
   - Keymap
   - Extension Pack
3. ตั้งชื่อ extension และกำหนด identifier

### 3. Configure package.json

> Goal: กำหนด manifest และ contribution points
> Goal: `package.json` ถูกต้องและพร้อม activate

1. ตั้งชื่อ extension, version, publisher
2. กำหนด `activationEvents` (เช่น `onCommand`)
3. ลงทะเบียน `commands` ใน `contributes`
4. กำหนด `main` เป็น `out/extension.js` หรือ compiled entry

### 4. Implement Extension Logic

> Goal: เขียน TypeScript code สำหรับ extension
> Goal: features ทำงานตาม requirement

1. สร้าง `src/extension.ts` หรือ `src/extension.js`
2. implement `activate(context: vscode.ExtensionContext)`
3. สร้าง command handlers และ register กับ `vscode.commands`
4. เพิ่ม UI components, tree view, webview, หรือ language provider ตามประเภท

### 5. Test Locally

> Goal: ทดสอบ extension ใน VS Code
> Goal: extension ทำงานถูกต้องบน development host

1. เปิด project ใน VS Code
2. กด `F5` เพื่อเปิด Extension Development Host
3. ทดสอบ commands และ features
4. ตรวจสอบ console errors

### 6. Build And Package

> Goal: Build สำหรับ production
> Goal: ได้ไฟล์ `.vsix` พร้อม publish

1. รัน `bun run compile` เพื่อ compile TypeScript
2. รัน `vsce package` เพื่อสร้าง `.vsix`
3. ตรวจสอบว่า package มีไฟล์ครบถ้วน

### 7. Publish To Marketplace

> Goal: Publish extension ไปยัง VS Code Marketplace
> Goal: extension ใช้ได้ผ่าน VS Code Marketplace

1. สร้าง publisher ใน Marketplace
2. รัน `vsce publish`
3. ตรวจสอบว่า extension ปรากฏใน Marketplace

## Rules

### 1. Project Structure

- ใช้ TypeScript สำหรับ type safety
- แยก `src/` สำหรับ source, `out/` หรือ `dist/` สำหรับ compiled output
- ใช้ `package.json` เป็น manifest
- ใช้ `tsconfig.json` กับ `strict: true`

### 2. Activation

- กำหนด `activationEvents` เฉพาะทีจำเป็น
- หลีกเลี่ยง activate ทุกครั้งที VS Code เปิด
- ใช้ `onCommand` ถ้า extension มี commands

### 3. Best Practices

- Implement error handling ทุก command
- ใช้ `context.subscriptions.push` สำหรับ disposables
- ทดสอบบน multiple VS Code versions
- Follow VS Code API guidelines

## Expected Outcome

- VS Code extension ที build แล้ว
- `package.json` กำหนด commands, activation events, contribution points ถูกต้อง
- Extension ทำงานใน Extension Development Host
- ได้ไฟล์ `.vsix` สำหรับ distribution
- Extension publish ไป Marketplace ได้ (ถ้าจำเป็น)

## Examples

### Simple Command

```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
    vscode.window.showInformationMessage('Hello World!');
  });

  context.subscriptions.push(disposable);
}
```

### Run Development Host

```bash
code .
# กด F5 เพื่อเปิด Extension Development Host
```

### Build And Package

```bash
bun run compile
vsce package
```

## Guide

### Documentation

| Resource | URL |
|----------|-----|
| VS Code API | https://code.visualstudio.com/api |
| Extension Guide | https://code.visualstudio.com/api/get-started/your-first-extension |
| Extension Anatomy | https://code.visualstudio.com/api/get-started/extension-anatomy |

### References

| Resource | URL |
|----------|-----|
| Extension Manifest | https://code.visualstudio.com/api/references/extension-manifest |
| Contribution Points | https://code.visualstudio.com/api/references/contribution-points |
| Activation Events | https://code.visualstudio.com/api/references/activation-events |
| VS Code API | https://code.visualstudio.com/api/references/vscode-api |

### Guides

| Resource | URL |
|----------|-----|
| Command | https://code.visualstudio.com/api/extension-guides/command |
| Tree View | https://code.visualstudio.com/api/extension-guides/tree-view |
| WebView | https://code.visualstudio.com/api/extension-guides/webview |
| Custom Editors | https://code.visualstudio.com/api/extension-guides/custom-editors |
| Language Support | https://code.visualstudio.com/api/extension-guides/language-support |
| Testing | https://code.visualstudio.com/api/working-with-extensions/testing-extension |

### Publishing

| Resource | URL |
|----------|-----|
| Publishing Guide | https://code.visualstudio.com/api/working-with-extensions/publishing-extension |
| Marketplace | https://marketplace.visualstudio.com/ |
