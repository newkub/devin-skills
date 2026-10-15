# Discrete Math

## Goal

Understand discrete mathematics: number theory, modular arithmetic, gcd, lcm, primes, congruences, and their use in hashing, cryptography, and algorithms

## Scope

- Use for integer math, divisibility, primes, modular arithmetic
- Covers gcd, lcm, prime check, modular inverse, Chinese remainder
- Applied in hashing, RNG, cryptography, scheduling

## Execute

### 1. Number Theory Basics

> Goal: compute the basics

1. Find gcd with the Euclidean algorithm
2. Find lcm from `lcm(a,b) = |a*b| / gcd(a,b)`
3. Check primes with trial division or a sieve
4. Find a number's prime factors
5. Use modular arithmetic: `(a + b) % m`

### 2. Modular Arithmetic

> Goal: compute in modular space

1. `(a + b) % m = ((a % m) + (b % m)) % m`
2. `(a * b) % m = ((a % m) * (b % m)) % m`
3. Find the modular inverse with the extended Euclidean algorithm when gcd(a,m)=1
4. Use exponentiation by squaring for `a^b % m`

### 3. Chinese Remainder Theorem

> Goal: combine congruences

1. Given `x ≡ a1 (mod m1)`, `x ≡ a2 (mod m2)` with gcd(m1,m2)=1
2. Find the solution with CRT
3. Used in distributed ID generation

### 4. Map To Code

> Goal: apply it in software

1. Hash table sizes use primes to reduce collisions
2. Find cycles in a PRNG with modular arithmetic
3. Use the modular inverse in cryptography
4. Use gcd/lcm in scheduling and aspect ratios

## Rules

### 1. Watch Overflow

- Use `BigInt` when intermediate values are large
- Apply `mod` at every step in modular exponentiation

### 2. Prime Handling

- Trial division is fine for small numbers
- Miller-Rabin for large numbers
- Sieve of Eratosthenes for finding primes in a range

### 3. Code Mapping

- `%` in programming is the remainder, which can go negative with negative numbers
- Use `((a % m) + m) % m` to force a positive result

- Use /follow-math-concepts if needed

## Expected Outcome

- Able to compute gcd, lcm, and the modular inverse
- Able to check primes and find factors
- Able to use modular arithmetic in hashing/cryptography
- Able to apply CRT
