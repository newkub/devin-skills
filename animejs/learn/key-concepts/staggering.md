# Staggering

## What is Staggering

Staggering คือการ delay animations ของ multiple elements:
- สร้าง effect ที่สวยงาม
- ลด cognitive load
- ดึงความสนใจไปยัง elements ตามลำดับ

## Using Stagger

```javascript
anime({
  targets: '.item',
  translateX: 100,
  delay: anime.stagger(100),
});
```

## Stagger Options

- **anime.stagger(value)** - fixed delay
- **anime.stagger(start, end)** - range delay
- **anime.stagger(grid)** - grid-based stagger
- **anime.stagger(function)** - custom stagger function
