# UX/UI Test Plan

## Goal

กำหนดสิ่งต้อง test ต่อ route/component เพื่อให้ coverage ชัดเจนและไม่ซ้ำซ้อน

## Plan Template

```yaml
route: /dashboard
viewports: [375x667, 768x1024, 1280x720]
flows:
  - name: load
    steps:
      - open route
      - wait --load networkidle
    assertions:
      - no layout shift
      - no console error
  - name: add-item
    steps:
      - click @add-button
      - type @input "New item"
      - click @submit
    assertions:
      - new item visible
      - input cleared
      - focus returns to list
  - name: keyboard-nav
    steps:
      - press Tab 3 times
      - press Enter
    assertions:
      - action triggered
      - focus visible
```

## Viewport Defaults

- mobile: 375x667 (iPhone SE)
- tablet: 768x1024 (iPad mini)
- desktop: 1280x720 หรือ 1440x900
- ถ้า project กำหนด breakpoints ต่างกัน → ใช้ breakpoints ของ project

## Assertions Categories

| No. | Category | ตัวอย่าง |
|-----|----------|---------|
| 1 | visual | text ไม่หาย, ไม่เกิด overflow, layout ตรง |
| 2 | interaction | click/type/select/hover ทำงาน |
| 3 | keyboard | Tab, Enter, Escape, Arrow keys ใช้ได้ |
| 4 | responsive | breakpoints ทำงานถูกต้อง |
| 5 | a11y | focus visible, semantic roles, alt text |
| 6 | error | ไม่มี console error หรือ failed request |

## Coverage Rules

- 1 รอบ test ควรครอบ routes ที่ user ใช้บ่อยสุด (top 3-5)
- แต่ละ route อย่างน้อย 2 viewports
- ทุก flow ต้องมี expected result วัดผลได้
