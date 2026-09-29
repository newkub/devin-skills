---
name: deduplicate
description: ตัด findings ที่ซ้ำกันข้าม dimensions
---

# Deduplicate

## Goal

ตัด findings ที่ซ้ำกันข้าม dimensions

## Checks

1. จับคู่ findings ที่อ้างถึง issue เดียวกัน
2. รวมเป็น single finding พร้อมระบุทุก source dimensions
3. ใช้ severity สูงสุดจากทุก source

