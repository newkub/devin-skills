---
name: follow-math-discrete-math
description: ใช้ number theory, modular arithmetic, gcd, primes ใน hashing, cryptography และ algorithms
argument-hint: "[topic]"
related:
  - follow-math-cryptography
  - follow-math-combinatorics
  - follow-algorithms
  - follow-math-concepts
---

## Goal

เข้าใจ discrete mathematics: number theory, modular arithmetic, gcd, lcm, primes, congruences และประยุกต์ใช้ใน hashing, cryptography, algorithms

## Scope

- ใช้สำหรับ integer math, divisibility, primes, modular arithmetic
- ครอบคลุบ gcd, lcm, prime check, modular inverse, Chinese remainder
- ประยุกต์ใน hashing, RNG, cryptography, scheduling

## Execute

### 1. Number Theory Basics

> Goal: คำนวณพื้นฐาน

1. หา gcd ด้วย Euclidean algorithm
2. หา lcm จาก `lcm(a,b) = |a*b| / gcd(a,b)`
3. ตรวจ prime ด้วย trial division หรือ sieve
4. หา prime factors ของจำนวน
5. ใช้ modular arithmetic: `(a + b) % m`

### 2. Modular Arithmetic

> Goal: คำนวณใน modular space

1. `(a + b) % m = ((a % m) + (b % m)) % m`
2. `(a * b) % m = ((a % m) * (b % m)) % m`
3. หา modular inverse ด้วย extended Euclidean ถ้า gcd(a,m)=1
4. ใช้ exponentiation by squaring สำหรับ `a^b % m`

### 3. Chinese Remainder Theorem

> Goal: รวม congruences

1. ถ้ามี `x ≡ a1 (mod m1)`, `x ≡ a2 (mod m2)` และ gcd(m1,m2)=1
2. หา solution ด้วย CRT
3. ใช้ใน distributed ID generation

### 4. Map To Code

> Goal: ประยุกต์ใน software

1. Hash table size ใช้ prime เพื่อลด collision
2. หา cycle ใน PRNG ด้วย modular arithmetic
3. ใช้ modular inverse ใน cryptography
4. ใช้ gcd/lcm ใน scheduling, aspect ratio

## Rules

### 1. Watch Overflow

- ใช้ `BigInt` ถ้า intermediate values ใหญ่
- ใช้ `mod` ทุกขั้นตอนใน modular exponentiation

### 2. Prime Handling

- trial division ใช้ได้ถ้าตัวเลขไม่ใหญ่
- Miller-Rabin สำหรับตัวเลขใหญ่
- Sieve of Eratosthenes สำหรับหา primes ในช่วง

### 3. Code Mapping

- `%` ใน programming คือ remainder ซึงอาจติดลบกับ negative numbers
- ใช้ `((a % m) + m) % m` เพื่อให้เป็นบวก

- ใช้ /follow-math-cryptography ถ้าจำเป็น
- ใช้ /follow-math-combinatorics ถ้าจำเป็น
- ใช้ /follow-algorithms ถ้าจำเป็น
- ใช้ /follow-math-concepts ถ้าจำเป็น

## Expected Outcome

- สามารถคำนวณ gcd, lcm, modular inverse
- สามารถตรวจ prime และหา factors
- สามารถใช้ modular arithmetic ใน hashing/cryptography
- สามารถประยุกต์ CRT
