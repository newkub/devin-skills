---
name: delete-submodules
description: Steps to delete a git submodule
---

1. เข้า folder submodules
2. ลบออกจาก .gitmodules และถ้าในนั้นเหลือเป็นอันสุดท้ายให้ลบ .gitmodule
3. cd .git/modules/ และลบ module นั้นๆ
5. git gc
