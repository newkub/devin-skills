# Table Virtualization

## Row Virtualization

Render เฉพาะ rows ที่ visible:
- ลด DOM nodes
- ปรับปรุง performance สำหรับ large tables
- ใช้ react-window หรือ @tanstack/react-virtual

## Implementation

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: rows.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
});
```

## Benefits

- **Performance** - render เฉพาะ visible rows
- **Memory** - ลบ DOM nodes ที่ไม่ visible
- **Scroll** - smooth scrolling สำหรับ large datasets
