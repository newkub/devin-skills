# Probability

## Goal

Understand and apply probability: events, random variables, distributions, expected value, conditional probability, Bayes theorem in software

## Scope

- Use for randomness, sampling, A/B testing, risk analysis
- Covers probability rules, conditional probability, Bayes
- Introduces common distributions: uniform, binomial, normal, Poisson

## Execute

### 1. Define Events And Sample Space

> Goal: identify the sample space and events

1. Identify the whole sample space `S`
2. Identify the event `E` of interest
3. Compute `P(E) = |E| / |S|`
4. Identify the complementary event `P(E') = 1 - P(E)`

### 2. Apply Basic Rules

> Goal: compute probability

1. Addition rule: `P(A ∪ B) = P(A) + P(B) - P(A ∩ B)`
2. Multiplication rule: `P(A ∩ B) = P(A) * P(B | A)`
3. Conditional: `P(A | B) = P(A ∩ B) / P(B)`
4. Independence: `P(A ∩ B) = P(A) * P(B)`

### 3. Use Bayes Theorem

> Goal: update belief according to evidence

1. Bayes: `P(A | B) = P(B | A) * P(A) / P(B)`
2. Use in anomaly detection
3. Use in estimating root-cause probability from logs

### 4. Expected Value And Distributions

> Goal: estimate the mean and the distribution

1. Expected value: `E[X] = Σ x * P(X=x)`
2. Use the suitable distribution:
   - Uniform: all values equal
   - Binomial: number of successes out of n trials
   - Normal: continuous data
   - Poisson: events occurring over time
3. Use expected value in load balancing, queueing

### 5. Map To Code

> Goal: apply in code

1. A/B test: compare conversion rates with significance
2. Sampling: use a random seed for reproducibility
3. Retry: compute the probability of repeated failure
4. Cache hit rate: model it as a probability

## Rules

### 1. Independence Check

- Don't confuse correlation with causation
- Verify independence before using the multiplication rule

### 2. Avoid Misconceptions

- Gambler's fallacy: past outcomes don't change future probability
- Base rate fallacy: must account for the prior

### 3. Code Mapping

- Use a random seed for reproducibility
- Use Monte Carlo simulation when the analytic form is hard
- Use BigInt or arbitrary precision when needed

- Use /follow-math-concepts if needed
- Use /deep-test if needed
- Use /deep-debug (Triage Incident) if needed
- Use /follow-goal if needed

## Expected Outcome

- Able to compute basic probability
- Able to use Bayes theorem
- Able to choose the suitable distribution
- Able to apply it in testing, A/B, incident triage
