# Feedback States Review

## Goal

ตรวจ feedback states จากมุม stakeholder — โฟกัสว่า user รู้เสมอว่าระบบกำลังทำอะไร

## Checklist

- ทุก async action มี loading state ทันที (spinner, skeleton, progress)
- Loading > 3 วินาที ต้องมีข้อความบอกว่ากำลังทำอะไร
- Success feedback ชัดเจน (toast, inline, redirect)
- Error message บอกสาเหตุและวิธีแก้ ไม่ใช่แค่ "Something went wrong"
- Empty state มี next action ที่ชัดเจน
- Destructive action มี confirm หรือ undo
- Disabled buttons มี tooltip/เหตุผลว่าทำไม disable
- Optimistic update มี rollback feedback เมื่อ fail

## Common Issues

- Skeleton กะพริบเพราะ loading เร็วเกินไป
- Toast หายเร็วเกินไปอ่านไม่ทัน
- หลาย toasts ซ้อนกันบังเนื้อหา
