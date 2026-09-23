# Finops Checklist — review-cost

## Cost Attribution

- [ ] per-service cost — breakdown by service/resource type
- [ ] per-environment — dev/staging/prod costs separated
- [ ] per-team/feature — cost tagged to owning team or feature
- [ ] per-tenant — multi-tenant unit economics (cost per customer)
- [ ] shared costs — networking, observability, security allocated fairly

## Tagging And Labeling

- [ ] mandatory tags — `env`, `team`, `feature`, `cost-center`, `owner`
- [ ] tag enforcement — IaC requires tags, untagged resources flagged
- [ ] tag coverage % — % of spend properly tagged
- [ ] consistent keys — no `env`/`environment`/`Env` variants
- [ ] cost reports — grouped by tags, not just service

## Commitment And Reserved Pricing

- [ ] reserved instances — baseline compute on 1-3yr commitments
- [ ] savings plans — flexible compute commitments (AWS/Azure/GCP)
- [ ] spot/preemptible — interruptible workloads on spot pricing
- [ ] commitment coverage — % of baseline on commitments vs on-demand
- [ ] commitment utilization — are reserved capacity actually used?

## Egress And Transfer Costs

- [ ] egress visibility — cross-region, cross-AZ, internet egress tracked
- [ ] CDN offload — static/media served from CDN, not origin
- [ ] data locality — compute near data, avoid cross-region transfer
- [ ] compression — responses compressed, images optimized
- [ ] caching — API responses cached, reducing origin calls

## Budgets And Alerts

- [ ] budgets defined — per env/service/team spending limits
- [ ] alert thresholds — 50%, 80%, 100% of budget alerts
- [ ] anomaly detection — unusual spend flagged (ML or threshold)
- [ ] forecast — projected month-end spend visible
- [ ] notifications — alerts to Slack/email/PagerDuty, not just dashboard

## Governance

- [ ] approval workflow — large resources require approval
- [ ] auto-scaling limits — max instances/cost ceiling set
- [ ] TTL policies — dev/test resources auto-expire
- [ ] right-sizing reviews — periodic review of underutilized resources
- [ ] chargeback/showback — teams see their cost, billed internally if needed

## Optimization Strategies

- [ ] serverless vs provisioned — workload pattern matches service model
- [ ] storage tiers — hot/warm/cold/archive appropriate to access pattern
- [ ] lifecycle policies — logs, backups, artifacts auto-expire
- [ ] consolidated billing — volume discounts, reserved capacity sharing
- [ ] multi-cloud arbitrage — cost compare across providers where feasible

## Detection

- billing console — cost explorer, breakdowns by tag/service
- `infracost` — IaC cost estimation before apply
- `kubecost` — K8s cost allocation
- `cloudcustodian` — policy enforcement for tagging/lifecycle
- grep resource tags — `tags =`, `labels:` completeness

Severity: untagged spend >50% = Medium, no budgets = High, no anomaly detection = Medium, missing commitments on stable baseline = Medium
