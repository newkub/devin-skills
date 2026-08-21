# Key Concept

## แนวคิดหลักของ Anime.js

Anime.js เป็น JavaScript animation library ที่ใช้สร้าง animation บน web ด้วย API ที่เรียบง่ายและมีประสิทธิภาพสูง

## แนวคิดสำคัญ

| Concept | Description |
|---------|-------------|
| **Animation Instance** | แต่ละ animation เป็น instance ที่สามารถควบคุมได้ |
| **Targets** | Elements ที่จะถูก animate (CSS selector, DOM elements, หรือ objects) |
| **Properties** | CSS properties หรือ attributes ที่จะเปลี่ยนแปลง |
| **Easing** | Timing function ที่ควบคุมความเร็วของ animation |
| **Timeline** | การจัดลำดับ animations หลายๆ ตัวให้ทำงานต่อเนื่อง |
| **Callbacks** | Functions ที่ทำงานในช่วงเวลาต่างๆ ของ animation |

## โครงสร้าง Animation

```
┌─────────────────────────────────────┐
│         Animation Instance           │
├─────────────────────────────────────┤
│  Targets: '.box'                     │
│  Properties: translateX, opacity     │
│  Duration: 1000ms                    │
│  Easing: easeOutQuad                 │
│  Callbacks: begin, complete          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│         Animation Engine             │
├─────────────────────────────────────┤
│  Calculate values per frame          │
│  Apply to DOM/Canvas                │
│  Trigger callbacks                  │
└─────────────────────────────────────┘
```

## การทำงานของ Animation Engine

1. **Initialization** - สร้าง animation instance พร้อม parameters
2. **Start** - เริ่ม animation loop
3. **Update Loop** - คำนวณค่าใหม่ทุก frame
4. **Render** - อัปเดต DOM หรือ Canvas
5. **Complete** - ทำงานเมื่อ animation จบ

## ประเภทของ Targets

| Type | Example |
|------|---------|
| CSS Selector | `'.box'`, `#header` |
| DOM Elements | `document.querySelector('.box')` |
| Node List | `document.querySelectorAll('.item')` |
| Array | `[element1, element2]` |
| Object | `{ value: 0 }` |
| SVG Elements | `path`, `circle`, `rect` |

## ประเภทของ Properties

| Type | Example |
|------|---------|
| CSS Transform | `translateX`, `scale`, `rotate` |
| CSS Opacity | `opacity` |
| CSS Color | `backgroundColor`, `color` |
| SVG Attributes | `strokeDashoffset`, `fill` |
| Object Properties | `value`, `count` |
| Custom Properties | ใช้ `update` callback สำหรับ custom logic |
