---
name: follow-regression-test
description: ทดสอบเพื่อตรวจสอบว่าการเปลี่ยนแปลงไม่ได้ทำลายฟีเจอร์ที่มีอยู่
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตรวจสอบว่าการเปลี่ยนแปลงใหม่ไม่ได้ทำลายฟีเจอร์ที่มีอยู่เดิม

## Scope

ทดสอบ regression สำหรับทุกประเภทของการเปลี่ยนแปลงใน codebase

## Execute

### 1. Analyze Change Impact

1. ระบุ files และ modules ที่ถูกเปลี่ยนแปลง
2. วิเคราะห์ dependencies และ downstream effects
3. ระบุ critical paths ที่อาจได้รับผลกระทบ
4. ตรวจสอบ integration points ที่เกี่ยวข้อง

### 2. Select Test Cases

1. เลือก test cases ที่ครอบคลุม changed code
2. รวม test cases สำหรับ critical paths
3. เพิ่ม test cases สำหรับ edge cases ที่เกี่ยวข้อง
4. จัดลำดับ test cases ตามความสำคัญ

### 3. Run Test Suite

1. รัน unit tests สำหรับ modules ที่เปลี่ยนแปลง
2. รัน integration tests สำหรับ affected flows
3. รัน e2e tests สำหรับ critical user journeys
4. รัน performance tests หากมีการเปลี่ยนแปลง performance-critical code

### 4. Analyze Results

1. ตรวจสอบ test failures และ errors
2. จัดกลุ่ม failures ตาม root cause
3. ระบุ regressions จากการเปลี่ยนแปลงใหม่
4. ตรวจสอบ flaky tests และ environment issues

### 5. Fix And Verify

1. แก้ไข regressions ที่พบ
2. เพิ่ม test cases ใหม่หากจำเป็น
3. รัน tests ซ้ำจนผ่านทั้งหมด
4. ตรวจสอบ coverage ยังคงเหมาะสม

## Rules

### 1. Change Impact Analysis

วิเคราะห์ผลกระทบของการเปลี่ยนแปลง:

- ใช้ `git diff` เพื่อดูการเปลี่ยนแปลง
- ตรวจสอบ dependency graph สำหรับ downstream effects
- ระบุ shared modules และ utilities ที่ถูกใช้ร่วมกัน
- ตรวจสอบ API contracts และ interfaces ที่เปลี่ยนแปลง

### 2. Test Selection Strategy

เลือก test cases อย่างมีประสิทธิภาพ:

- ใช้ test impact analysis tools หากมี
- รัน tests ที่ cover changed lines ก่อน
- รวม smoke tests สำหรับ critical functionality
- พิจารณา risk-based testing สำหรับ high-risk changes

### 3. Test Execution

รัน tests อย่างเป็นระบบ:

- ใช้ CI/CD pipeline สำหรับ automated regression
- รัน tests บน environment ที่ใกล้เคียง production
- ใช้ parallel execution สำหรับ speed
- ตรวจสอบ test isolation และ determinism

### 4. Failure Analysis

วิเคราะห์ test failures อย่างเป็นระบบ:

- จัดกลุ่ม failures ตาม error patterns
- ตรวจสอบ logs และ stack traces
- ระบุว่าเป็น regression หรือ pre-existing bug
- ตรวจสอบ flaky tests ด้วย reruns

### 5. Regression Prevention

ป้องกัน regressions ในอนาคต:

- เพิ่ม test cases สำหรับ bugs ที่พบ
- ใช้ mutation testing สำหรับ critical code
- ตั้งค่า automated regression ใน CI/CD
- ตรวจสอบ code review guidelines สำหรับ risky changes

## Expected Outcome

- การเปลี่ยนแปลงไม่ได้ทำลายฟีเจอร์ที่มีอยู่
- Test failures ถูกแก้ไขและ verify แล้ว
- Test coverage ยังคงเหมาะสม
- Regression suite พร้อมสำหรับ CI/CD

## Common Mistakes

ข้อผิดพลาดที่พบบ่อย:

- ไม่วิเคราะห์ impact ของการเปลี่ยนแปลง
- รัน test suite ทั้งหมดโดยไม่เลือกเฉพาะ
- ไม่แยกแยะระหว่าง regression และ flaky tests
- ไม่เพิ่ม test cases สำหรับ bugs ที่พบ

## Anti-Patterns

รูปแบบที่ไม่ควรทำ:

- ❌ ข้าม regression testing เพื่อ save time
- ❌ รันเฉพาะ unit tests และข้าม integration/e2e
- ❌ ไม่แก้ไข test failures ที่เกิดจาก changes
- ❌ พึ่งพา manual testing สำหรับ regression
