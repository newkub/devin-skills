# Structure

## Project Structure

```
my-project/
├── src/
│   ├── animations/
│   │   ├── fadeIn.js
│   │   └── slideIn.js
│   └── main.js
├── package.json
└── index.html
```

## Animation Organization

แยก animations ตามประเภท:
- **Entry animations** - animations สำหรับเข้าสู่หน้า
- **Exit animations** - animations สำหรับออกจากหน้า
- **Interaction animations** - animations สำหรับ user interactions
- **Utility animations** - animations ที่ใช้บ่อย

## Reusable Patterns

สร้าง reusable animation functions:
```javascript
export const fadeIn = (element) => {
  return anime({
    targets: element,
    opacity: [0, 1],
    duration: 300,
  });
};
```
