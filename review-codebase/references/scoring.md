# Codebase Review Score Formula

## Purpose

สูตรการคำนวณ review score และ health indicator ของ codebase

## Score Calculation

คำนวณ review score เป็น percentage (0-100):

- `0` = ทุก finding เป็น Critical
- `100` = ไม่มี finding

## Score Breakdown

แสดง score ทั้งสองระดับ:

- overall score: คะแนนรวมของทั้ง codebase
- domain score: คะแนนแยกตาม domain

## Grade Mapping

แปลง score เป็น letter grade:

- `A`: score >= 90
- `B`: score >= 80
- `C`: score >= 70
- `D`: score >= 60
- `F`: score < 60

## Before-After Comparison

ใช้ score เปรียบเทียบ before/after ในการปรับปรุง:

1. บันทึก before score ก่อนรัน improvement
2. ทำ improvement ตาม findings
3. รัน `/run-review` เพื่อวัด after score
4. เปรียบเทียบ delta เพื่อวัดผลการปรับปรุง

## Category Coverage

`categories` metric วัดความครอบคลุมของ review:

- target: `categories >= 60`
- ถ้าต่ำกว่า 60 → ทำ `/update-create-review-cli` เพื่อเพิ่ม categories

## Health Indicator

สรุป overall assessment เป็น health indicator:

- พิจารณาจาก overall score, grade, และ severity distribution ของ findings
- แสดงในรายงานพร้อมตาราง findings
