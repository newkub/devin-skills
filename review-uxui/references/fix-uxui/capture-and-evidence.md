# Capture And Evidence

## Goal

เก็บ before/after evidence ที่เปรียบเทียบได้จริงสำหรับทุก UX/UI improvement

## Before Capture

1. capture ทุก route/component ที่จะ review ลง `public/screenshots/` หรือ path ที่ project กำหนด
2. ตั้งชื่อไฟล์ด้วย route + timestamp เช่น `home-2026-01-15-before.png`
3. ใช้ `agent-browser snapshot -i` เก็บ interactive elements คู่กับภาพ
4. capture หลาย viewport ถ้าเป้าหมายรองรับ responsive

## During Review

- ใช้ `agent-browser screenshot --annotate` เพื่อทำเครื่องหมายจุดที่มีปัญหา
- ผูก annotation กับ finding id เพื่อ trace ได้

## After Capture

1. ใช้ viewport และ route เดิมกับ before เสมอ
2. ตั้งชื่อ `*-after.png` ให้จับคู่กับ before ได้
3. เปรียบเทียบแบบ side-by-side ใน report

## Evidence Rules

- ทุก improvement ต้องมี before/after คู่กัน
- ไม่ใช้ภาพที่ capture คนละ state กัน (เช่น scroll position, auth state)
- เก็บ console errors ที่เกี่ยวข้องไว้เป็นหลักฐานเสริม
