---
name: follow-math-statistics
description: ใช้ descriptive statistics, distributions, hypothesis testing ใน metrics, logs, benchmarks
argument-hint: "[data]"
related:
  - follow-math-probability
  - follow-test
  - follow-incident-triage
  - follow-goal
  - follow-math-concepts
---

## Goal

เข้าใจ statistics สำหรับ software: descriptive stats, percentiles, distributions, hypothesis testing, regression และประยุกต์ใช้ใน metrics, logs, benchmarks

## Scope

- ใช้สำหรับวิเคราะห์ performance metrics, error rates, user behavior
- ครอบคลุบ mean, median, mode, variance, standard deviation, percentiles
- แนะนำ hypothesis testing และ confidence intervals

## Execute

### 1. Descriptive Statistics

> Goal: สรุปชุดข้อมูล

1. หา mean (ค่าเฉลี่ย), median (ค่ากลาง), mode (ค่าทีซ้ำบ่อย)
2. หา variance และ standard deviation
3. หา min, max, range
4. หา percentiles: p50, p90, p95, p99
5. ใช้ histogram ดู distribution

### 2. Choose Central Tendency

> Goal: เลือกตัววัดทีเหมาะสม

1. ใช้ mean ถ้าไม่มี outliers
2. ใช้ median ถ้ามี outliers หรือ distribution skewed
3. ใช้ mode สำหรับ categorical data
4. ใช้ percentiles สำหรับ latency / response time

### 3. Hypothesis Testing

> Goal: ทดสอบสมมติฐาน

1. กำหนด null hypothesis และ alternative hypothesis
2. เลือก test: t-test, chi-square, Mann-Whitney U
3. ระบุ significance level `α` (เช่น 0.05)
4. คำนวณ p-value
5. ถ้า p < α → ปฏิเสธ null hypothesis

### 4. Compare Distributions

> Goal: เปรียบเทียบกลุ่มข้อมูล

1. ใช้ box plot เปรียบเทียบ percentiles
2. ใช้ CDF เปรียบเทียบ distribution
3. ใช้ KS test เปรียบเทียบ 2 distributions

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. วิเคราะห์ latency: mean, p95, p99
2. A/B test: เปรียบเทียบ conversion ด้วย t-test
3. ตรวจ anomalies: หาค่าเกิน 3 standard deviation
4. Capacity planning: ใช้ percentiles กำหนด resources

## Rules

### 1. Data Quality

- ตรวจ missing values ก่อนวิเคราะห์
- ระวัง outliers
- ระบุ sample size

### 2. Distribution Awareness

- อย่าคิดว่าข้อมูลเป็น normal เสมอ
- ใช้ non-parametric test ถ้า distribution ไม่ทราบ

### 3. Code Mapping

- ใช้ streaming สำหรับ percentiles ถ้าข้อมูลใหญ่
- ใช้ reservoir sampling สำหรับ large datasets
- ใช้ time-series ถ้ามี temporal data

- ใช้ /follow-math-probability ถ้าจำเป็น
- ใช้ /follow-test ถ้าจำเป็น
- ใช้ /follow-incident-triage ถ้าจำเป็น
- ใช้ /follow-goal ถ้าจำเป็น
- ใช้ /follow-math-concepts ถ้าจำเป็น

## Expected Outcome

- สามารถหา descriptive statistics
- สามารถเลือก central tendency ทีเหมาะสม
- สามารถทำ hypothesis testing พื้นฐาน
- สามารถวิเคราะห์ metrics/logs/benchmarks
