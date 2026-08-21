# Quick Start

## เริ่มต้นใช้งาน Anime.js

### การติดตั้ง

```bash
bun add animejs
```

### การ import

```javascript
import anime from 'animejs';
```

### Animation แรกของคุณ

```javascript
// HTML
<div class="box"></div>

// CSS
.box {
  width: 50px;
  height: 50px;
  background: red;
}

// JavaScript
anime({
  targets: '.box',
  translateX: 250
});
```

### Animation พื้นฐาน

#### เลื่อน element

```javascript
anime({
  targets: '.box',
  translateX: 250
});
```

#### เปลี่ยนขนาด

```javascript
anime({
  targets: '.box',
  scale: 1.5
});
```

#### เปลี่ยนสี

```javascript
anime({
  targets: '.box',
  backgroundColor: '#00f'
});
```

#### เปลี่ยนความโปร่งใส

```javascript
anime({
  targets: '.box',
  opacity: 0.5
});
```

### การรวม properties

```javascript
anime({
  targets: '.box',
  translateX: 250,
  translateY: 100,
  scale: 1.5,
  rotate: '45deg',
  opacity: 0.5
});
```

### การตั้งค่า duration

```javascript
anime({
  targets: '.box',
  translateX: 250,
  duration: 2000 // 2 วินาที
});
```

### การใช้ easing

```javascript
anime({
  targets: '.box',
  translateX: 250,
  easing: 'easeInOutQuad'
});
```

### การ loop

```javascript
anime({
  targets: '.box',
  translateX: 250,
  loop: true
});
```

### การใช้ callback

```javascript
anime({
  targets: '.box',
  translateX: 250,
  complete: () => {
    console.log('Animation completed!');
  }
});
```

### การ animate หลาย elements

```javascript
anime({
  targets: '.item',
  translateX: 250
});
```

### การ stagger

```javascript
anime({
  targets: '.item',
  translateX: 250,
  delay: anime.stagger(100) // 100ms ระหว่างแต่ละ element
});
```

### Timeline

```javascript
const tl = anime.timeline();

tl.add({
  targets: '.box',
  translateX: 250
}).add({
  targets: '.circle',
  translateY: 200
});
```

### การควบคุม animation

```javascript
const animation = anime({
  targets: '.box',
  translateX: 250
});

// เล่น
animation.play();

// หยุด
animation.pause();

// เล่นย้อนกลับ
animation.reverse();

// เริ่มใหม่
animation.restart();
```

### ตัวอย่างเต็ม

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    .box {
      width: 50px;
      height: 50px;
      background: red;
      margin: 20px;
    }
  </style>
</head>
<body>
  <div class="box"></div>
  <div class="box"></div>
  <div class="box"></div>
  
  <script type="module">
    import anime from 'https://cdn.jsdelivr.net/bun/animejs@3.2.1/lib/anime.es.js';
    
    anime({
      targets: '.box',
      translateX: 250,
      delay: anime.stagger(100),
      easing: 'easeInOutQuad',
      duration: 1000,
      loop: true,
      direction: 'alternate'
    });
  </script>
</body>
</html>
```

## ตัวอย่างที่ใช้บ่อย

### Fade In

```javascript
anime({
  targets: '.element',
  opacity: [0, 1]
});
```

### Slide Up

```javascript
anime({
  targets: '.element',
  translateY: [30, 0],
  opacity: [0, 1]
});
```

### Bounce

```javascript
anime({
  targets: '.element',
  translateY: [-50, 0],
  easing: 'easeOutBounce'
});
```

### Rotate

```javascript
anime({
  targets: '.element',
  rotate: '1turn'
});
```

### Scale

```javascript
anime({
  targets: '.element',
  scale: [0, 1],
  easing: 'easeOutElastic(1, .6)'
});
```
