# Numerical Methods

## Goal

Understand numerical methods: floating point representation, rounding errors, approximation, interpolation, and their application in code for mathematical correctness

## Scope

- Use for financial calc, physics simulation, scientific computing
- Covers IEEE 754, epsilon comparison, numerical stability
- Introduces Newton-Raphson, bisection, interpolation

## Execute

### 1. Understand Floating Point

> Goal: know the limits of float

1. Decimal numbers in binary may be an approximation
2. `0.1 + 0.2 !== 0.3` in floating point
3. There are single (32-bit) and double (64-bit) precision
4. There are special values: NaN, Infinity, -0

### 2. Compare Floating Point

> Goal: compare safely

1. Use absolute epsilon: `abs(a - b) < epsilon`
2. Use relative epsilon for large values: `abs(a - b) < epsilon * max(abs(a), abs(b))`
3. Use `Number.EPSILON` for comparisons near 1
4. Beware `NaN !== NaN`

### 3. Reduce Rounding Errors

> Goal: make computation stable

1. Add the small numbers first, then the large ones (Kahan summation)
2. Avoid subtracting near-equal numbers
3. Use `BigInt` or a decimal library for financial
4. Use fixed-point arithmetic when appropriate

### 4. Approximation Methods

> Goal: find approximate values

1. Bisection: find the root of a function
2. Newton-Raphson: faster when a derivative exists
3. Linear interpolation: estimate a value between 2 points
4. Taylor series: approximate functions

### 5. Map To Code

> Goal: apply in software

1. Use `decimal.js` or `BigNumber` for money
2. Use epsilon in float assertions
3. Use numerical integration for simulation
4. Check overflow/underflow

## Rules

### 1. Never Use Exact Equality For Floats

- `===` with floats can make tests wrong
- Always use epsilon comparison

### 2. Choose Right Type

- double precision for general use
- decimal/rational for financial
- fixed-point for embedded

### 3. Code Mapping

- `Math.abs(a - b) < 1e-9` instead of `a === b`
- `Number.isNaN()` to check NaN
- Use libraries for decimal when needed

- Use /deep-debug if needed
- Use /deep-test if needed
- Use /follow-math-concepts if needed

## Expected Outcome

- Able to explain floating point errors
- Able to compare floats safely
- Able to choose the right type/library
- Able to use basic approximation methods
