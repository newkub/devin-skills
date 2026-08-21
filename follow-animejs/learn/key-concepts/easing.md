# Easing

## What is Easing

Easing คือการควบคุมความเร็วของ animation ตลอดเวลา:
- **Linear** - ความเร็วคงที่
- **Ease In** - เริ่มช้าแล้วเร็วขึ้น
- **Ease Out** - เริ่มเร็วแล้วช้าลง
- **Ease In Out** - เริ่มช้าแล้วเร็วขึ้นแล้วช้าลง

## Built-in Easings

Anime.js มี built-in easings:
- `easeInQuad`, `easeOutQuad`, `easeInOutQuad`
- `easeInCubic`, `easeOutCubic`, `easeInOutCubic`
- `easeInElastic`, `easeOutElastic`, `easeInOutElastic`
- และอื่นๆ อีกมากมาย

## Custom Easing

```javascript
anime({
  targets: '.element',
  translateX: 100,
  easing: 'spring(1, 80, 10, 0)',
});
```
