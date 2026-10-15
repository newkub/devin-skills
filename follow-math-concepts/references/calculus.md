# Calculus

## Goal

Understand basic calculus: limits, derivatives, integrals, chain rule, partial derivatives, and their use in optimization, simulation, and metrics

## Scope

- Use to understand gradient descent, rate of change, area under a curve, and simulating physical/continuous systems
- Covers limit, derivative, integral, partial derivative, Taylor series
- Applied in ML, physics simulation, accumulating metrics, growth modeling

## Execute

### 1. Understand Limits And Continuity

> Goal: grasp the limit concept, the foundation of derivatives/integrals

1. A limit is the value `f(x)` approaches as `x` nears a point
2. A function is continuous when the limit equals the function's actual value
3. Watch for discontinuity in data: step functions, retry backoff, cache expiry
4. Discrete domains don't use limits directly — use differences instead

### 2. Use Derivatives

> Goal: measure rate of change

1. derivative = rate of change: `f'(x) = lim h→0 (f(x+h)-f(x))/h`
2. Basic rules: `d/dx x^n = n·x^(n-1)`, product rule, quotient rule
3. Chain rule: `d/dx f(g(x)) = f'(g(x)) · g'(x)` — the root of backpropagation
4. Use to find optima: where `f'(x)=0`, and `f''(x)` tells min/max
5. Example: latency growing as `1/(1-ρ)` (queueing) — the derivative shows where the curve shoots up

### 3. Use Partial Derivatives And Gradients

> Goal: work with multi-variable functions

1. Partial derivative: change one variable while holding the others fixed: `∂f/∂x`
2. Gradient `∇f` = the vector of all partial derivatives — points in the steepest-increase direction
3. Gradient descent: `x ← x - η·∇f(x)` reduces loss in ML, hyperparameter tuning
4. Beware local minima, saddle points, and a learning rate `η` that's too large

### 4. Use Integrals

> Goal: accumulate continuous quantities

1. Integral = area under the curve = continuous sum: `∫ f(x) dx`
2. Fundamental theorem: integration is the inverse of differentiation
3. Applications: total requests from a rate curve, energy from power, distance from velocity
4. On a computer this is numeric summation/integration (see numerical-methods: trapezoid, Simpson)

### 5. Approximate With Taylor Series

> Goal: approximate complex functions with polynomials

1. `f(x) ≈ f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...`
2. Use linear approximation when `x` is near `a`: `eˣ ≈ 1+x`, `ln(1+x) ≈ x`
3. Explains why floating-point error grows fast when values are far from the center (see numerical-methods)
4. Use to approximate cost curves and asymptotic behavior

### 6. Map To Code

> Goal: apply it in software

1. ML training: gradient descent + chain rule (backprop) — use libraries (`numpy`, `torch`), never hand-derive in production
2. Simulation: integrate velocity/position, use a fixed timestep
3. Metrics: rate from a derivative, total from the integral of a rate
4. Auto-scaling: the growth rate (derivative) of load as a signal to scale before saturation

## Rules

### 1. Continuous vs Discrete

- Most software is discrete — calculus is an approximating model, map it back correctly
- Don't conclude exact discrete behavior (e.g. off-by-one) from continuous results
- Use finite differences for a numeric derivative: `(f(x+h)-f(x))/h` with a suitable `h`

### 2. Correctness First

- Check units/dimensions every time (rate × time = total)
- Numerical integration/derivation has error — compare with the analytic result when possible
- Beware division near zero, log(0), and overflow in exponentials

### 3. Code Mapping

- `sympy` for symbolic derivation
- `numpy.gradient` for a numeric derivative
- `scipy.integrate` for a numeric integral

- Use /follow-math-concepts (optimization, numerical-methods) if needed
- Use /deep-review-codebase if needed

## Expected Outcome

1. Understand limits, derivatives, and integrals and how they connect to code
2. Able to use the chain rule/gradients to explain ML and optimization
3. Able to approximate functions with Taylor series
4. Able to pick a continuous model appropriately for discrete systems
