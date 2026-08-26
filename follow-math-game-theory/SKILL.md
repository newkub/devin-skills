---
name: follow-math-game-theory
description: ใช้ minimax, Nash equilibrium, zero-sum games ใน AI opponents, scheduling และ decision systems
argument-hint: "[problem]"
related:
  - follow-math-optimization
  - follow-goal
  - follow-parallel
  - follow-math-probability
  - follow-math-concepts
---

## Goal

เข้าใจ game theory: minimax, Nash equilibrium, zero-sum games, dominant strategies, prisoner's dilemma และประยุกต์ใช้ใน AI opponents, scheduling, auctions, decision systems

## Scope

- ใช้สำหรับ multi-agent systems, AI opponents, resource contention
- ครอบคลุม normal form games, extensive form, mixed strategies
- แนะนำ minimax, alpha-beta pruning, Nash equilibrium

## Execute

### 1. Model The Game

> Goal: ระบุ players, strategies, payoffs

1. ระบุ players ทั้งหมด
2. ระบุ strategies ของแต่ละ player
3. ระบุ payoff matrix
4. ระบุ zero-sum หรือ non-zero-sum
5. ระบุ perfect information หรือไม่

### 2. Find Dominant Strategies

> Goal: หา strategy ทีดีทีสุด

1. ตรวจ dominant strategy: ดีกว่า whatever opponent ทำ
2. ตรวจ dominated strategies และลบ
3. หา pure strategy Nash equilibrium
4. ถ้าไม่มี pure → หา mixed strategy

### 3. Minimax For Zero-Sum Games

> Goal: หา optimal strategy ใน zero-sum

1. Player A ต้องการ maximize minimum payoff
2. Player B ต้องการ minimize maximum payoff
3. หา saddle point ถ้ามี
4. ใช้ alpha-beta pruning ลด search space

### 4. Nash Equilibrium

> Goal: หาจุดทีทุก player ไม่อยากเปลี่ยน

1. ใน Nash equilibrium แต่ละ player เลือก best response
2. อาจมีหลาย equilibrium
3. ใช้ใน auctions, negotiations, routing

### 5. Map To Code

> Goal: ประยุกต์ใน software

1. AI opponent ใช้ minimax ในเกม 2 คน
2. Scheduling ใช้ Nash equilibrium สำหรับ resource contention
3. Load balancing ใช้ mixed strategy
4. ใช้ game theory ใน auction/bidding systems

## Rules

### 1. Game Type

- ระบุ zero-sum vs non-zero-sum
- ระบุ cooperative vs non-cooperative
- ระบุ perfect vs imperfect information

### 2. Assumptions

- rational players
- common knowledge of payoffs
- ถ้าไม่เชื่อ assumptions → ใช้ behavioral game theory

### 3. Code Mapping

- ใช้ recursion สำหรับ minimax
- ใช้ memoization สำหรับ repeated subgames
- ใช้ simulation ถ้า payoff ไม่ชัดเจน

## Expected Outcome

- สามารถ model game ด้วย players/strategies/payoffs
- สามารถหา dominant/Nash equilibrium
- สามารถใช้ minimax/alpha-beta
- สามารถประยุกต์ใน AI และ multi-agent systems
