# Troubleshooting

## Common Issues

### Animation Not Playing

- **Target Not Found** - ตรวจสอบว่า target elements มีอยู่
- **Duration Zero** - ตรวจสอบว่า duration ไม่ใช่ 0
- **Auto-play** - ตรวจสอบว่า auto-play ไม่ถูก disabled

### Performance Issues

- **Too Many Animations** - ลดจำนวน animations
- **Complex Selectors** - ใช้ selectors ที่เรียบง่าย
- **Layout Thrashing** - ใช้ transforms แทน position

### Memory Leaks

- **Not Removing Listeners** - remove event listeners เมื่อไม่ใช้
- **Timeline References** - clear timeline references
- **Plugin Cleanup** - cleanup plugins เมื่อไม่ใช้
