# Performance-First Design

## Principle

Anime.js ออกแบบมาเพื่อ performance:
- **60 FPS** - เป้าหมาย 60 frames per second
- **GPU Acceleration** - ใช้ GPU เมื่อเป็นไปได้
- **Minimal Reflows** - ลด layout thrashing

## Application

- **Use Transforms** - ใช้ transform แทน position
- **Batch Operations** - รวม operations ใน timeline
- **Debounce** - debounce scroll-triggered animations
- **Cleanup** - cleanup animations เมื่อไม่ใช้
