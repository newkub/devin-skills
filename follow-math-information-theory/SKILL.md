---
name: follow-math-information-theory
description: ใช้ entropy, encoding, compression, KL-divergence ใน data, logs, และ AI
argument-hint: "[topic]"
related:
  - follow-math-probability
  - follow-math-statistics
  - follow-context-engineering
  - follow-tool-knip
  - follow-math-concepts
---

## Goal

เข้าใจ information theory: entropy, information content, encoding, compression, KL-divergence และประยุกต์ใช้ใน data analysis, logs, compression, AI

## Scope

- ใช้สำหรับวิเคราะห์ uncertainty, predictability, encoding efficiency
- ครอบคลุบ Shannon entropy, Huffman coding, source coding
- แนะนำ KL-divergence, mutual information

## Execute

### 1. Calculate Entropy

> Goal: หา uncertainty ของข้อมูล

1. ระบุ probability distribution `P(x_i)`
2. คำนวณ entropy: `H(X) = -Σ P(x_i) * log2(P(x_i))`
3. หน่วยเป็น bits
4. entropy สูง = uncertainty สูง = ยากทำนาย

### 2. Information Content

> Goal: หา information ของ event

1. `I(x) = -log2(P(x))`
2. event ที rare มี information สูง
3. ใช้วัดความสำคัญของ log event

### 3. Encoding And Compression

> Goal: หา efficient encoding

1. ใช้ Huffman coding สำหรับ symbol ทีมี frequency ต่างกัน
2. ใช้ prefix codes หลีกเลี่ยง ambiguity
3. หา expected code length: `Σ P(x_i) * length(code_i)`
4. เปรียบเทียบกับ entropy เพื่อดู efficiency

### 4. KL-Divergence And Mutual Information

> Goal: เปรียบเทียบ distributions

1. KL-divergence: `D_KL(P || Q) = Σ P(x) * log(P(x)/Q(x))`
2. วัดความต่างระหว่าง 2 distributions
3. Mutual information: `I(X;Y) = H(X) - H(X|Y)`
4. วัดความสัมพันธ์ระหว่าง variables

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. วิเคราะห์ logs: event ไหน predictable, ไหน surprising
2. หา compression opportunity ใน data
3. ใช้ entropy ใน feature selection สำหรับ ML
4. ใช้ KL-divergence ใน comparing models/distributions

## Rules

### 1. Probability Distribution

- ต้องมี valid distribution (sum to 1, non-negative)
- ระวัง `log(0)` ใช้ limit หรือ smoothing

### 2. Log Base

- base 2 = bits
- base e = nats
- ใช้ base 2 สำหรับ information/compression

### 3. Code Mapping

- ใช้ `Math.log2()` ถ้ามี
- ใช้ streaming algorithm สำหรับ large datasets
- ใช้ histogram หรือ count-min sketch ประมาณ distribution

## Expected Outcome

- สามารถคำนวณ entropy
- สามารถ design Huffman-like encoding
- สามารถใช้ KL-divergence เปรียบเทียบ distributions
- สามารถวิเคราะห์ predictability ของ logs/data
