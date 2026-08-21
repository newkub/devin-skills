# Callbacks

## Animation Callbacks

Anime.js รองรับ callbacks หลายประเภท:

- **begin** - เมื่อ animation เริ่มต้น
- **update** - เมื่อ animation update
- **complete** - เมื่อ animation เสร็จ
- **running** - เมื่อ animation กำลังทำงาน

## Using Callbacks

```javascript
anime({
  targets: '.element',
  opacity: 0,
  begin: () => console.log('Animation started'),
  complete: () => console.log('Animation completed'),
});
```

## Promise Support

Anime.js รองรับ promises:
```javascript
const animation = anime({
  targets: '.element',
  opacity: 0,
});

animation.finished.then(() => {
  console.log('Animation completed');
});
```
