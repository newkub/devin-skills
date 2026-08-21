---
name: follow-remotion
description: "Framework สำหรับสร้างวิดีโอแบบโปรแกรมมิ่งโดยใช้ React"
triggers: ['user', 'model']
allowed-tools: ['read', 'edit', 'grep', 'glob', 'exec']
---
## Goal

ใช้งาน Remotion สำหรับสร้างวิดีโอแบบโปรแกรมมิ่งด้วย React


## Scope

ใช้สำหรับ:
- สร้างวิดีโอแบบโปรแกรมมิ่งด้วย React
- Video generation ด้วย component model
- Animations ด้วย hooks เช่น useCurrentFrame()
- Programmatic video creation
- Cloud rendering (AWS Lambda, GCP Cloud Run)


## Execute

### 1. Create Project

สร้างโปรเจกต์ใหม่:
```bash
bunx create-video@latest
```

### 2. Start Preview

เริ่มต้น preview:
```bash
bun run dev
# หรือ
bunx remotion studio
```

### 3. Render Video

Render วิดีโอ:
```bash
bunx remotion render MyComposition
```

### 4. Render GIF

Render เป็น GIF:
```bash
bunx remotion render MyComposition --output.gif
```


## Rules

- ใช้ `useCurrentFrame()` เสมอ - ไม่ใช้ CSS animations
- ใช้ Zod สำหรับ props - ทำให้ parameters มี type ที่ปลอดภัย
- แปลงวินาทีเป็น frames - ใช้ `time * fps`
- ใช้ `staticFile()` สำหรับ assets - path แบบ relative ไม่รองรับ
- ใช้ `interpolate()` สำหรับ smooth transitions
- ใช้ `<OffthreadVideo>` สำหรับ videos ขนาดใหญ่
- Test ใน Studio ก่อน render
- Optimize assets ก่อน rendering


## Expected Outcome

- วิดีโอแบบโปรแกรมมิ่งด้วย React
- Animations ที่ smooth และ consistent
- Video generation ที่ automated
- Programmatic video creation ที่ flexible
- Cloud rendering ที่ scalable
- Type-safe components ด้วย Zod
