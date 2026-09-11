# review-cost — Full Dimension Checklist

## 1. Cost Inventory

- [ ] compute, storage, bandwidth, third-party costs mapped
- [ ] cost per unit metric (per user/request/build)
- [ ] current spend vs budget, trend

## 2. Compute And Concurrency

- [ ] over-provisioned instances/memory, idle resources
- [ ] autoscaling tuned, spot/preemptible candidates
- [ ] serverless: cold starts vs provisioned, timeout waste

## 3. Storage And Bandwidth

- [ ] storage classes, lifecycle policies, orphan volumes/snapshots
- [ ] egress costs, CDN offload, compression
- [ ] log retention costs, high-cardinality metrics

## 4. Third-Party Services

- [ ] API call costs: LLM tokens, maps, email, payments fees
- [ ] plan fit: tier vs actual usage, reserved vs on-demand
- [ ] per-seat licenses จริงใช้, zombie subscriptions

## 5. Efficiency Wins

- [ ] caching ROI, batch API calls, request dedup
- [ ] LLM: model tiering, prompt caching, token budgets
- [ ] build/CI minutes optimization

## 6. Governance

- [ ] cost alerts/budgets set, tagging for attribution
- [ ] cost review cadence, anomaly detection

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
