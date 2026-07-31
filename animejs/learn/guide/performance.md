# Performance

## Performance Tips

- **Use transforms** - ใช้ transform แทน top/left สำหรับ better performance
- **GPU Acceleration** - ใช้ properties ที่ GPU-accelerated
- **Batch Animations** - รวม animations ใน timeline เพื่อ reduce reflows
- **Avoid Layout Thrashing** - หลีกเลี่ยงการอ่าน/เขียน layout ซ้ำๆ

## Optimizations

### Transform vs Position

```javascript
// Good - GPU accelerated
anime({
  targets: element,
  translateX: 100,
});

// Avoid - Layout thrashing
anime({
  targets: element,
  left: 100,
});
```

### Will-Change

ใช้ `will-change` สำหรับ elements ที่จะ animate:
```css
.animated {
  will-change: transform, opacity;
}
```
