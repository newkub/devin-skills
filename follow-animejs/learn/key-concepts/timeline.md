# Timeline

## What is Timeline

Timeline เป็น feature สำคัญของ Anime.js สำหรับ:
- จัดการ multiple animations
- ควบคุม sequencing และ timing
- รองรับ parallel และ sequential animations

## Creating Timeline

```javascript
const timeline = anime.timeline();
```

## Adding Animations

```javascript
timeline
  .add({
    targets: '.element1',
    opacity: 0,
  })
  .add({
    targets: '.element2',
    opacity: 0,
  });
```

## Timeline Controls

- **play()** - เล่น timeline
- **pause()** - หยุด timeline
- **seek()** - ไปยังเวลาที่กำหนด
- **reverse()** - เล่นย้อนกลับ
