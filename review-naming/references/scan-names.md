---
name: scan-names
description: รวบรวมชื่อทีต้อง review
---

# Scan Names

## Goal

รวบรวมชื่อทีต้อง review

## Checks

1. ทำ `/scan-codebase` หา identifiers, file paths, skill names
2. รวบรวม skill names จาก `AGENTS.md` และ directory names
3. ระบุ public API, class names, function names, variable names, constants
4. หา duplicate names, shadowing, หรือชื่อทีตีความได้หลายทาง
