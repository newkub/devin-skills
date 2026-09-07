# Freshness And Compatibility

## Goal

ค้นหาข้อมูลล่าสุดและตรวจ compatibility

## Steps

1. ค้นหาด้วย keywords ที่ระบุปี เช่น `<topic> 2025`, `<topic> 2026`, `<topic> latest`
2. ใช้ `search_web` กับ query ที่มีปีปัจจุบัน
3. ตรวจสอบ publish dates และ release dates จากทุก sources
4. เปรียบเทียบปีจาก NPM registry, GitHub releases, และ official documentation
5. ตรวจสอบ version compatibility กับปีล่าสุด
6. เลือกข้อมูลที่มีปีล่าสุดเป็น primary source
7. ตรวจ breaking changes และ migration guides
