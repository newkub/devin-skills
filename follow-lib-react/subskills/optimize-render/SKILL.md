---
name: follow-lib-react-optimize-render
description: Optimize React renders — memo/useMemo/useCallback, React Compiler, profiling
argument-hint: "[scope]"
related:
  - follow-lib-react
  - follow-tool-react-scan
  - run-bench
  - run-profiler
  - check-bottlenecks
  - report-before-after
---

## Goal

ลด re-renders ที่ไม่จำเป็นใน React app — `memo`/`useMemo`/`useCallback` discipline, React Compiler notes และ profiling workflow

## Scope

ใช้เมื่อต้อง optimize render performance ของ React 19 app — ครอบคลุม baseline profiling, memoization discipline, compiler interplay และ verify (ต้องวัดผลก่อนและหลัง)

## Execute

### 1. Baseline And Profile

> Goal: ระบุ re-render bottleneck จริงก่อนแก้ ห้ามเดา

1. ใช้ React DevTools Profiler หรือ `react-scan` (`/follow-tool-react-scan`) — บันทึก components ที่ re-render บ่อย/ช้า
2. ทำ `/check-bottlenecks` — แยกปัญหา: unnecessary re-renders vs expensive render vs state กว้างเกิน
3. เก็บ baseline numbers (render count, render duration) สำหรับ compare หลังแก้

### 2. Fix Root Causes First

> Goal: แก้ structural issues ก่อน memoization

1. ย้าย state ลงให้ใกล้ component ที่ใช้ (state colocation) — state สูงเกิน = re-render ทั้ง tree
2. แยก component ที่เปลี่ยนบ่อยออกจาก static children — ใช้ children prop / composition แทน memo
3. ใช้ `useTransition`/`useDeferredValue` สำหรับ expensive updates ที่ไม่ critical
4. Context: แยก contexts ตามค่าที่เปลี่ยนบ่อย — context value เปลี่ยน = ทุก consumer re-render

### 3. Apply Memoization Discipline

> Goal: ใช้ `memo`/`useMemo`/`useCallback` เฉพาะที่จำเป็นและถูกจุด

1. ถ้าเปิด React Compiler (`babel-plugin-react-compiler`) — ห้ามเพิ่ม manual memoization ใหม่; compiler memoize ให้อัตโนมัติ ตรวจ lint ด้วย `eslint-plugin-react-hooks` ล่าสุด
2. ถ้าไม่มี Compiler:
   - `React.memo` เฉพาะ leaf components ที่ props เดิมบ่อยและ render แพง
   - `useMemo` เฉพาะ computation ที่แพงจริง — ห้าม memo ทุกค่า
   - `useCallback` เฉพาะเมื่อ function ถูกส่งให้ memoized child หรืออยู่ใน effect deps
3. Memoization ไม่ช่วยถ้า props เปลี่ยนทุก render — แก้ที่ parent ก่อน (stable references, ห้ามสร้าง object/function inline ใหม่ทุก render ให้ memoized children)

### 4. Verify And Compare

> Goal: วัดผลหลังแก้เทียบ baseline

1. Profile ซ้ำ — render count/duration ต้องลดลงเทียบ baseline ด้วย `/report-before-after`
2. รัน tests — behavior ต้องเหมือนเดิม (optimize ≠ เปลี่ยน output)
3. ถ้าไม่ดีขึ้นหรือ regression → revert จุดนั้นแล้ว report

## Rules

- Profile ก่อนเสมอ — ห้ามเพิ่ม memoization โดยไม่มี evidence
- แก้ root cause (state placement, composition) ก่อน memoize
- React Compiler + manual memoization ไม่ผสมกัน — เลือกอย่างใดอย่างหนึ่งต่อ component
- ห้าม over-memoization — memo ทุกอย่างเพิ่ม memory/complexity โดยไม่ช่วย
- preserve behavior เสมอ — `useMemo`/`useCallback` ต้องไม่มี side effects
- ใช้ `/follow-lib-react` สำหรับ React 19 standards

## Expected Outcome

- Re-render hotspots ลดลงเทียบ baseline ด้วยตัวเลขจริง
- Memoization ใช้เฉพาะจุดที่จำเป็น — ไม่มี over-memoization
- Behavior เหมือนเดิมทุกครั้ง tests ผ่าน
