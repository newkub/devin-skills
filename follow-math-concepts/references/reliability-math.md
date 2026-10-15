# Reliability Math

## Goal

Understand the mathematics of reliability: availability, MTBF/MTTR, uptime SLA, series/parallel composition, error budget, and their application in SLO design, redundancy, incident decisions

## Scope

- Use to compute and interpret the uptime/availability of systems and services
- Covers MTBF, MTTR, exponential lifetime, series/parallel reliability, error budget
- Applied in SLO/SLA design, redundancy planning, restore vs prevent tradeoff

## Execute

### 1. Compute Basic Availability

> Goal: find the fraction of time the system works

1. `A = MTBF / (MTBF + MTTR)` — mean time between failures vs mean time to restore
2. uptime tiers: `99% = 3.65 days/year`, `99.9% = 8.77 minutes/month`, `99.99% = 52.6 seconds/month`, `99.999% = 5.26 seconds/year`
3. Lesson: going from 99.9 to 99.99 gets harder nonlinearly — you must cut both failure rate and restore time
4. MTTR is often overlooked — a system that restores fast beats a system that fails less, in many cases

### 2. Compose Systems In Series And Parallel

> Goal: combine the availability of multiple components

1. series (all must work): `A_total = A1 × A2 × ... × An` — the longer the chain, the lower it drops
   - Example: LB 99.9% × app 99.9% × DB 99.9% ≈ 99.7% — the system SLA is lower than every component
2. parallel (one is enough): `A_total = 1 - (1-A1)(1-A2)` — redundancy helps exponentially per replica count
   - Example: two 99% nodes → 99.99% effective (if truly independent and failover actually succeeds)
3. Beware common-mode failure: shared infra/version/config breaks the independence assumption — redundancy stops working
4. failover itself has MTTR: auto-failover ≠ zero downtime — include detection + switch time

### 3. Model Failure Processes

> Goal: apply probability to lifetime

1. constant failure rate → exponential lifetime: `P(survive t) = e^(-t/MTBF)`
2. "random failures" means the chance of breaking in 1 hour is always equal, regardless of age — but hardware has wear-out (use Weibull/bathtub curve when needed)
3. error rate per request `p` → chance a session/flow of N calls succeeds = `(1-p)^N` — long flows survive less often than intuition suggests
4. retry with independent failure: `p^(retries+1)` cuts the error rate fast but adds load as feedback (see queueing-theory)

### 4. Manage Error Budget

> Goal: turn the SLO into a decision policy

1. error budget = `1 - SLO target`, e.g. 99.9% over 30 days → budget ≈ 43.2 minutes of downtime
2. budget remaining → ship fast/experiment; budget exhausted → freeze risky changes, focus on reliability
3. burn-rate alerting: burning the budget in 1 hour vs 1 week must trigger different reactions (multi-window burns)
4. the budget is an agreement between the team — use data, not beliefs, when arguing priority

### 5. Map To Code

> Goal: apply in software

1. health check + auto-restart reduce MTTR — measure both detection time and restore time
2. circuit breaker + retry budget: prevent a retry storm from cascading (failures become dependent, not independent)
3. SLA in contracts must be computed from the real composition, not marketing numbers
4. chaos testing: inject failures to verify the MTTR/failover assumptions you set

## Rules

### 1. Independence Is The Expensive Assumption

- Redundancy's value lies in independence — a shared AZ/version/human process = common mode
- Before claiming `1-(1-A)^n`, be able to answer whether the failures are truly independent

### 2. Measure What You Compute

- MTBF/MTTR must come from real incident data, not estimates
- Availability must count only user-facing success — latency beyond the SLI can count as failure (per the definition)

### 3. Code Mapping

- Release hygiene (tests, canary, staged rollout) reduces the failure types that prevention can address
- Track budget consumption with real monitoring (SLO tool / Prometheus recording rules)
- Include graceful degradation as part of the math — partial availability > binary thinking

- Use /follow-math-concepts (probability, statistics) if needed
- Use /deep-retro if needed

## Expected Outcome

1. Compute and interpret availability tiers and MTBF/MTTR
2. Assess the effect of redundancy and chain composition on the real SLA
3. Set and use the error budget as a decision policy
4. Identify the common-mode failures that break the assumptions
