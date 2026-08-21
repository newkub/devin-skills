# How It Works

## Architecture

Nextest เป็น next-generation test runner สำหรับ Rust ที่เร็วกว่า cargo test ถึง 3 เท่า:

```
┌─────────────────────────────────────┐
│          Nextest Architecture           │
├─────────────────────────────────────┤
│  Test Discovery  │  Parallel Execution │
├─────────────────────────────────────┤
│  Per-test Isolation  │  Smart Scheduling │
├─────────────────────────────────────┤
│  CI Integration  │  Test Reporting    │
├─────────────────────────────────────┤
│  Re-run Recording  │  Binary Management │
└─────────────────────────────────────┘
```

## Workflow

1. **Install** - Install cargo-nextest ด้วย pre-built binaries
2. **Discover** - Discover tests จาก workspace
3. **Execute** - Execute tests แบบ parallel ด้วย smart scheduling
4. **Isolate** - Per-test isolation สำหรับ reliability
5. **Report** - Generate test reports พร้อม CI integration
6. **Re-run** - Re-run failed tests ด้วย recording

## Key Concepts

- **Modern Execution Model** - Faster, more reliable test runs
- **Per-test Isolation** - Each test runs in isolated environment
- **Smart Scheduling** - Optimizes test execution order
- **Parallel Execution** - Runs tests in parallel สำหรับ speed
- **CI Support** - First-class CI integration พร้อม JUnit reports
- **Test Recording** - Records every test run สำหรับ replay
- **Binary Management** - Efficient binary caching และ reuse
- **User-friendly Reports** - Clear, actionable test output
