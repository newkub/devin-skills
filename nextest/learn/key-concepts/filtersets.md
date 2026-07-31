# Filter Expression Language

## Overview

Filter Expression Language (Filtersets) เป็น DSL (Domain-Specific Language) ของ Nextest ที่ใช้สำหรับ select tests ตาม criteria ต่างๆ เช่น name, package, platform, หรือ kind

## Why Filtersets?

การใช้ filtersets มีประโยชน์หลายอย่าง:

- **Precise Test Selection**: Select tests ที่ต้องการอย่างเฉพาะเจาะจง
- **Complex Filtering**: รวม conditions หลายๆ ด้วย logical operators
- **Platform-Specific Tests**: Run tests ตาม platform ที่ต้องการ
- **Test Organization**: Group tests ตาม criteria ที่ซับซ้อน
- **CI Optimization**: Run subsets ของ tests ใน CI stages ต่างๆ

## Filter Predicates

### Basic Predicates

| Predicate | Description | Example |
|-----------|-------------|---------|
| `test(name)` | Match test name pattern | `test(smoke_)` |
| `package(name)` | Match package name | `package(my-crate)` |
| `kind(lib)` | Match test kind | `kind(lib)`, `kind(bin)`, `kind(test)` |
| `binary(name)` | Match binary name | `binary(my-crate-test)` |
| `platform(host)` | Match platform | `platform(x86_64-unknown-linux-gnu)` |

### Logical Operators

| Operator | Description | Example |
|----------|-------------|---------|
| `not expr` | Negate expression | `not test(slow_)` |
| `expr and expr` | Logical AND | `test(smoke_) and kind(lib)` |
| `expr or expr` | Logical OR | `test(smoke_) or test(critical_)` |

### Three-Valued Logic

Nextest ใช้ three-valued logic สำหรับ binary-level filtering:

| Value | Meaning |
|-------|---------|
| `Some(true)` | Match - include binary |
| `Some(false)` | No match - exclude binary |
| `None` | Unknown - enumerate tests |

สำหรับ test-level filtering ใช้ boolean logic (true/false)

## Usage Examples

### Command Line

```bash
# Run tests matching pattern
cargo nextest run test_name

# Run tests in specific package
cargo nextest run -p my_crate

# Run tests with filter expression
cargo nextest run -E 'test(smoke_) or test(critical_)'

# Exclude tests
cargo nextest run -E 'not test(slow_)'

# Complex filter
cargo nextest run -E 'package(my-crate) and kind(lib) and not test(integration_)'
```

### Configuration

```toml
# .config/nextest.toml
[[test-groups]]
name = "smoke"
filter = "test(smoke_)"

[[test-groups]]
name = "integration"
filter = "test(integration_) and kind(test)"

[[test-groups]]
name = "unit"
filter = "not test(slow_) and not test(integration_)"
```

## Common Patterns

### 1. Smoke Tests

```bash
# Run smoke tests
cargo nextest run -E 'test(smoke_)'

# Run smoke tests in specific package
cargo nextest run -E 'test(smoke_) and package(my-crate)'
```

### 2. Exclude Slow Tests

```bash
# Exclude slow tests
cargo nextest run -E 'not test(slow_)'

# Exclude slow tests from specific package
cargo nextest run -E 'package(my-crate) and not test(slow_)'
```

### 3. Integration Tests Only

```bash
# Run integration tests only
cargo nextest run -E 'test(integration_) and kind(test)'

# Run integration tests in specific packages
cargo nextest run -E 'test(integration_) and (package(api) or package(db))'
```

### 4. Platform-Specific Tests

```bash
# Run Linux-specific tests
cargo nextest run -E 'test(linux_) and platform(x86_64-unknown-linux-gnu)'

# Run Windows-specific tests
cargo nextest run -E 'test(windows_) and platform(x86_64-pc-windows-msvc)'
```

### 5. Library Tests Only

```bash
# Run library tests only
cargo nextest run --lib

# Run library tests with filter
cargo nextest run -E 'kind(lib) and not test(slow_)'
```

### 6. Binary Tests Only

```bash
# Run binary tests only
cargo nextest run --bins

# Run specific binary tests
cargo nextest run -E 'binary(my-crate)'
```

## Advanced Filtering

### Nested Expressions

```bash
# Complex nested expression
cargo nextest run -E '(test(smoke_) or test(critical_)) and kind(lib) and not test(slow_)'
```

### Package Sets

```bash
# Run tests in multiple packages
cargo nextest run -E 'package(api) or package(db) or package(auth)'

# Run tests in all packages except one
cargo nextest run -E 'not package(legacy)'
```

### Test Kinds

```bash
# Run library and binary tests
cargo nextest run -E 'kind(lib) or kind(bin)'

# Run integration tests only
cargo nextest run -E 'kind(test) and test(integration_)'

# Run benchmarks
cargo nextest run --benches
```

### Combined Filters

```bash
# Smoke tests in library
cargo nextest run -E 'test(smoke_) and kind(lib)'

# Critical integration tests
cargo nextest run -E 'test(critical_) and test(integration_) and kind(test)'

# Fast unit tests
cargo nextest run -E 'not test(slow_) and not test(integration_) and kind(lib)'
```

## Filter Expression Syntax

### Grammar

```
expr ::= or_expr
or_expr ::= and_expr ('or' and_expr)*
and_expr ::= not_expr ('and' not_expr)*
not_expr ::= 'not' not_expr | primary
primary ::= predicate | '(' expr ')'
predicate ::= 'test' '(' string ')'
           | 'package' '(' string ')'
           | 'kind' '(' string ')'
           | 'binary' '(' string ')'
           | 'platform' '(' string ')'
```

### String Patterns

- **Exact Match**: `test(my_test)` - matches exact name
- **Prefix Match**: `test(smoke_)` - matches names starting with "smoke_"
- **Substring Match**: ไม่รองรับโดย default
- **Regex**: ไม่รองรับโดย default

## Best Practices

### 1. Use Descriptive Test Names

```rust
#[test]
fn smoke_test_api_connectivity() {
    // Clear prefix for filtering
}

#[test]
fn integration_test_user_flow() {
    // Clear prefix for filtering
}

#[test]
fn slow_test_large_dataset() {
    // Clear prefix for filtering
}
```

### 2. Group Tests by Purpose

```rust
#[test]
fn smoke_test_basic() { /* ... */ }
#[test]
fn smoke_test_auth() { /* ... */ }

#[test]
fn integration_test_db() { /* ... */ }
#[test]
fn integration_test_api() { /* ... */ }
```

### 3. Use Configuration for Complex Filters

```toml
# .config/nextest.toml
[[test-groups]]
name = "fast-unit"
filter = "not test(slow_) and not test(integration_) and kind(lib)"

[[test-groups]]
name = "slow-integration"
filter = "test(slow_) or test(integration_)"
```

### 4. Test Filter Expressions

```bash
# Test filter before running
cargo nextest list -E 'test(smoke_)'

# Verify filter matches expected tests
cargo nextest list -E 'package(my-crate) and kind(lib)'
```

### 5. Document Filter Logic

```toml
# .config/nextest.toml
# Smoke tests: Fast, critical functionality tests
[[test-groups]]
name = "smoke"
filter = "test(smoke_)"

# Integration tests: Tests requiring external dependencies
[[test-groups]]
name = "integration"
filter = "test(integration_) and kind(test)"
```

## Performance Considerations

### Binary-Level Filtering

Binary-level filtering ใช้ three-valued logic เพื่อ avoid unnecessary test enumeration:

```bash
# Efficient: filters at binary level
cargo nextest run -E 'package(my-crate)'

# Less efficient: filters at test level
cargo nextest run -E 'test(specific_test)'
```

### Filter Evaluation Order

Nextest evaluates filters ในลำดับนี้:

1. Binary-level filters (package, kind, binary, platform)
2. Test enumeration (if needed)
3. Test-level filters (test name)

### Optimization Tips

- **Use Binary Filters First**: Filter ที่ binary level ก่อนเสมอ
- **Avoid Complex Test Filters**: Complex test filters ต้อง enumerate ทุก tests
- **Use Test Groups**: Pre-define common filters ใน configuration

## Troubleshooting

### Filter Not Matching Tests

ตรวจสอบ filter expression:

```bash
# List tests that match filter
cargo nextest list -E 'test(smoke_)'

# List all tests for comparison
cargo nextest list
```

### Too Many Tests Matched

ทำ filter ให้ specific ขึ้น:

```bash
# Too broad
cargo nextest run -E 'test(test_)'

# More specific
cargo nextest run -E 'test(smoke_) and package(my-crate)'
```

### Filter Syntax Error

ตรวจสอบ syntax:

```bash
# Show help for filter expressions
cargo nextest run --help

# Test simple filter first
cargo nextest run -E 'test(smoke_)'
```

## Examples by Use Case

### CI Stages

```yaml
# Stage 1: Smoke tests
- run: cargo nextest run -E 'test(smoke_)'

# Stage 2: Unit tests
- run: cargo nextest run -E 'not test(integration_) and kind(lib)'

# Stage 3: Integration tests
- run: cargo nextest run -E 'test(integration_) and kind(test)'
```

### Local Development

```bash
# Quick feedback
cargo nextest run -E 'test(smoke_)'

# Full test suite
cargo nextest run

# Exclude slow tests
cargo nextest run -E 'not test(slow_)'
```

### Pre-Commit Hooks

```bash
# Run fast tests only
cargo nextest run -E 'not test(slow_) and not test(integration_)'
```

## See Also

- [Test Groups](./test-groups.md) - สำหรับ organizing tests
- [Test Priorities](./test-priorities.md) - สำหรับ execution order
- [Configuration](../guide/configuration.md) - สำหรับ setup options
