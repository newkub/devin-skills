---
name: follow-math-linear-algebra
description: ใช้ vectors, matrices, dot product ใน ML, graphics, embeddings และ transformations
argument-hint: "[topic]"
related:
  - follow-math-concepts
  - follow-math-optimization
  - follow-math-probability
  - follow-math-statistics
---

## Goal

เข้าใจ linear algebra: vectors, matrices, dot product, cross product, matrix multiplication, transformations และประยุกต์ใช้ใน ML, graphics, embeddings

## Scope

- ใช้สำหรับ embeddings, graphics, transformations, ML basics
- ครอบคลุบ vectors, matrices, dot/cross product, norm, transpose, inverse
- แนะนำ eigenvalues/eigenvectors เบื้องต้น

## Execute

### 1. Work With Vectors

> Goal: คำนวณ vector operations

1. ระบุ vector เป็น tuple `(x, y, z)`
2. หา length/norm: `||v|| = sqrt(x^2 + y^2 + z^2)`
3. บวก/ลบ vectors ทีละ component
4. คูณด้วย scalar
5. หา dot product: `a · b = Σ a_i * b_i`

### 2. Use Dot Product

> Goal: หา similarity หรือ projection

1. Cosine similarity: `(a · b) / (||a|| ||b||)`
2. ใช้เปรียบเทียบ embeddings
3. หา projection ของ vector a ลง b
4. ใช้ dot product ตรวจ orthogonality

### 3. Work With Matrices

> Goal: คำนวณ matrix operations

1. บวก/ลบ matrices ทีมีขนาดเดียวกัน
2. คูณ matrix: `(AB)_ij = Σ_k A_ik * B_kj`
3. หา transpose `A^T`
4. หา identity matrix `I`
5. ใช้ transformations: scale, rotate, translate

### 4. Apply To Code

> Goal: ประยุกต์ใน software

1. ใช้ embeddings similarity ใน search/AI
2. ใช้ matrix transformations ใน graphics/WebGL
3. ใช้ linear regression กับ least squares
4. ใช้ PCA ลด dimension

## Rules

### 1. Dimensions Must Match

- vector/matrix operations ต้องมี dimensions ถูกต้อง
- dot product ต้องมีขนาดเท่ากัน
- matrix multiplication ต้อง columns ของ A = rows ของ B

### 2. Avoid Misuse

- cosine similarity วัด direction ไม่ใช่ magnitude
- Euclidean distance ต่างกับ dot product
- ใช้ normalized vectors ถ้าต้องการ compare direction

### 3. Code Mapping

- ใช้ TypedArrays สำหรับ performance
- ใช้ libraries เช่น `mathjs`, `numpy` ถ้าซับซ้อน
- ใช้ WebGL matrices สำหรับ graphics

- ใช้ /follow-math-concepts ถ้าจำเป็น
- ใช้ /follow-math-optimization ถ้าจำเป็น
- ใช้ /follow-math-probability ถ้าจำเป็น
- ใช้ /follow-math-statistics ถ้าจำเป็น

## Expected Outcome

- สามารถคำนวณ vector/matrix operations
- สามารถหา cosine similarity
- สามารถใช้ linear algebra ใน embeddings/graphics/ML
- สามารถระบุเมื่อควรใช้ library
