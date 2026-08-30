---
name: follow-math-probability
description: ใช้ probability, expected value, Bayes ใน randomness, testing, A/B tests, และ AI
argument-hint: "[problem]"
related:
  - follow-math-statistics
  - follow-math-combinatorics
  - follow-test
  - follow-incident-triage
  - follow-goal
  - follow-math-concepts
---

## Goal

เข้าใจและประยุกต์ probability: events, random variables, distributions, expected value, conditional probability, Bayes theorem ใน software

## Scope

- ใช้สำหรับ randomness, sampling, A/B testing, risk analysis
- ครอบคลุม probability rules, conditional probability, Bayes
- แนะนำ common distributions: uniform, binomial, normal, Poisson

## Execute

### 1. Define Events And Sample Space

> Goal: ระบุ sample space และ events

1. ระบุ sample space `S` ทั้งหมด
2. ระบุ event `E` ทีสนใจ
3. คำนวณ `P(E) = |E| / |S|`
4. ระบุ complementary event `P(E') = 1 - P(E)`

### 2. Apply Basic Rules

> Goal: คำนวณ probability

1. Addition rule: `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`
2. Multiplication rule: `P(A ∩ B) = P(A) * P(B | A)`
3. Conditional: `P(A | B) = P(A ∩ B) / P(B)`
4. Independence: `P(A ∩ B) = P(A) * P(B)`

### 3. Use Bayes Theorem

> Goal: อัปเดต belief ตาม evidence

1. Bayes: `P(A | B) = P(B | A) * P(A) / P(B)`
2. ใช้ใน anomaly detection
3. ใช้ในประเมินความน่าจะเป็นของ root cause ตาม logs

### 4. Expected Value And Distributions

> Goal: ประเมินค่าเฉลี่ยและแจกแจง

1. Expected value: `E[X] = Σ x * P(X=x)`
2. ใช้ distribution ทีเหมาะสม:
   - Uniform: ทุกค่าเท่ากัน
   - Binomial: จำนวนครั้งสำเร็จจาก n ครั้ง
   - Normal: ข้อมูล continuous
   - Poisson: เหตุการณ์เกิดขึ้นในเวลา
3. ใช้ expected value ใน load balancing, queueing

### 5. Map To Code

> Goal: ประยุกต์ใน code

1. A/B test: เปรียบเทียบ conversion rate ด้วย significance
2. Sampling: ใช้ random seed ให้ reproducible
3. Retry: คำนวณ probability ของ failure ซ้ำ
4. Cache hit rate: model เป็น probability

## Rules

### 1. Independence Check

- อย่าสับสน correlation กับ causation
- ตรวจสอบ independence ก่อนใช้ multiplication rule

### 2. Avoid Misconceptions

- Gambler's fallacy: ผลในอดีตไม่เปลี่ยน probability ในอนาคต
- Base rate fallacy: ต้องคำนึงถึง prior ด้วย

### 3. Code Mapping

- ใช้ random seed เพื่อ reproducibility
- ใช้ Monte Carlo simulation ถ้า analytic ยาก
- ใช้ BigInt หรือ arbitrary precision ถ้าจำเป็น

- ใช้ /follow-math-statistics ถ้าจำเป็น
- ใช้ /follow-math-combinatorics ถ้าจำเป็น
- ใช้ /follow-test ถ้าจำเป็น
- ใช้ /follow-incident-triage ถ้าจำเป็น
- ใช้ /follow-goal ถ้าจำเป็น
- ใช้ /follow-math-concepts ถ้าจำเป็น

## Expected Outcome

- สามารถคำนวณ probability พื้นฐาน
- สามารถใช้ Bayes theorem
- สามารถเลือก distribution ทีเหมาะสม
- สามารถประยุกต์ใน testing, A/B, incident triage
