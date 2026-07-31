---
name: raycast-extensions
description: "Guidelines for creating Raycast extensions using React, TypeScript, and Node.js. Includes..."
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

สร้าง Raycast extensions ด้วย React, TypeScript และ Node.js


## Scope

ใช้สำหรับการสร้าง extensions ที่ add commands, integrate กับ external APIs, automate workflows และ create custom UI components


## Execute

### 1. Create Project

```bash
bun create raycast-extension
```

### 2. Develop Commands

Implement commands ด้วย React components

### 3. Test Locally

Test ใน Raycast ด้วย development mode

### 4. Publish

Publish ไปยัง Raycast Store


## Rules

### Development

- ใช้ React สำหรับ UI components
- ใช้ TypeScript สำหรับ type safety
- Follow Raycast API guidelines

### Best Practices

- ใช้ hooks สำหรับ state management
- Implement error handling
- Test commands อย่างเหมาะสม


## References

- [Raycast API Docs](https://developers.raycast.com)
- [Raycast Extensions](https://www.raycast.com/store)
- [Raycast GitHub](https://github.com/raycast)
- [Raycast CLI](https://developers.raycast.com/cli)


## Expected Outcome

- Raycast extensions ที่ integrate กับ Raycast ecosystem
- Commands ที่ responsive และ user-friendly
- Code ที่ follow Raycast best practices
