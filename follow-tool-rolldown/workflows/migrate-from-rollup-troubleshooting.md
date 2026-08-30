---
title: Migrate from Rollup - Troubleshooting
description: การแก้ปัญหาและประโยชน์ของการ migrate จาก Rollup ไปยัง Rolldown
auto_execution_mode: 3
---

## Goal

แก้ปัญหาที่พบหลัง migration และสรุปประโยชน์

## Scope

- Troubleshooting
- Benefits of migration

## Troubleshooting

### Plugin Not Compatible

Problem: Plugin ไม่ทำงานกับ Rolldown

Solution:
- ตรวจสอบว่ามี Rolldown version หรือไม่
- ใช้ plugin ที่ compatible กับทั้งสอง
- ปรับ plugin ให้ compatible

### Build Error

Problem: Build error หลัง migration

Solution:
- ตรวจสอบ config options
- ตรวจสอบ plugin compatibility
- ตรวจสอบ TypeScript config

### Output Different

Problem: Output ต่างจาก Rollup

Solution:
- ตรวจสอบ tree-shaking options
- ตรวจสอบ minification settings
- ตรวจสอบ output format

## Benefits of Migration

- Performance: 10-100x faster builds
- TypeScript: Built-in TypeScript support
- Minification: Built-in minifier
- Compatibility: Rollup-compatible API

## Rules

- ตรวจสอบ plugin compatibility เมื่อพบปัญหา
- ตรวจสอบ config และ output อย่างละเอียด
- ใช้ประโยชน์จาก built-in features ของ Rolldown

## Expected Outcome

- ปัญหาหลัง migration ได้รับการแก้ไข
- ได้รับประโยชน์จาก performance และ built-in features
