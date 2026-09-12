# review-dependencies — Full Dimension Checklist

## 1. Stack Selection

- [ ] framework/runtime fit for requirements
- [ ] versions current + supported, upgrade path clear
- [ ] no dead/deprecated tech, EOL flagged

## 2. Cloud And Infrastructure

- [ ] infra fit: compute, storage, networking choices
- [ ] managed vs self-hosted trade-offs
- [ ] region/availability strategy

## 3. Language And Tooling

- [ ] language idioms leveraged, toolchain modern
- [ ] build/test/lint tooling appropriate
- [ ] devcontainer/dev-env reproducibility

## 4. Dependencies And Ecosystem

- [ ] ecosystem maturity, community health (เชื่อม `/review-dependencies`)
- [ ] lock-in assessment, portability
- [ ] hiring/maintenance implications

## 5. Architecture Fit

- [ ] stack supports target architecture (เชื่อม `/review-architecture`)
- [ ] scalability/performance characteristics match needs
- [ ] security posture of stack choices

## 6. Cost And Alternatives

- [ ] TCO per choice, licensing costs
- [ ] alternatives scored where high-stakes

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
