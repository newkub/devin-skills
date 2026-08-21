# CI Integration

## Definition

CI integration คือการเชื่อมต่อ Nextest กับ CI/CD:
- Run tests ใน CI pipeline
- Parallel execution ใน CI
- Report results
- Cache dependencies

## GitHub Actions

### Basic Setup

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
      - uses: taiki-e/install-action@nextest
      - run: cargo nextest run
```

### With Caching

```yaml
- uses: Swatinem/rust-cache@v2
- run: cargo nextest run
```

## GitLab CI

```yaml
test:
  image: rust:latest
  script:
    - cargo install nextest
    - cargo nextest run
```

## Best Practices

1. **Parallel Jobs**: ใช้ parallel jobs ใน CI
2. **Cache Dependencies**: Cache cargo dependencies
3. **Fail Fast**: Stop on first failure
4. **Report Results**: Report test results
5. **Artifact Storage**: Store test artifacts
