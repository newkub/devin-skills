---
name: follow-git-cleanup
description: ล้างและ optimize Git repository เพื่อลดขนาดและเพิ่มประสิทธิภาพ
---

## Goal

ล้างและ optimize Git repository เพื่อลดขนาดและเพิ่มประสิทธิภาพ

## Scope

ใช้สำหรับ project ที่ต้องการล้างและ optimize Git repository

## Prompt

ใช้ workflow นี้เมื่อต้องการล้างและ optimize Git repository

## Execute

1. Analyze Repository

- ตรวจสอบ repository size
- หา large files ใน history
- ระบุ unreachable objects
- วิเคราะห์ pack files

2. Clean Local Repository

- รัน git gc --aggressive
- ล้าง reflog เก่า
- ลบ orphaned branches
- ล้าง stash ที่ไม่จำเป็น

3. Clean Remote References

- Prune stale remote branches
- Update remote refs
- ลบ deleted remote branches
- Sync with remotes

4. Optimize Large Files

- หา files ที่ควรใช้ LFS
- วิเคราะห์ BLOB size
- Consider rewriting history ถ้าจำเป็น
- Document large files

5. Verify Repository

- รัน git fsck
- ตรวจสอบ integrity
- Test clone/fetch
- ยืนยัน functionality

## Rules

1. Backup First

- สร้าง backup ก่อน rewrite history
- Clone repository ก่อน aggressive gc
- Document original state
- มี rollback plan

2. Collaborative Safety

- ไม่ rewrite shared history โดยไม่แจ้ง
- Coordinate กับ team members
- ใช้ force push อย่างระมัดระวัง
- Communicate changes

3. Incremental Cleanup

- ทำทีละขั้นตอน
- Verify หลังแต่ละ step
- ไม่ rush aggressive operations
- Monitor repository health

## Expected Outcome

- Reduced repository size
- Optimized pack files
- Cleaned unreachable objects
- Improved fetch/clone performance
- Verified repository integrity
