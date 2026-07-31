# Setup and Wrapper Scripts

## Overview

Setup Scripts และ Wrapper Scripts เป็น features ของ Nextest ที่ช่วยให้ prepare environment ก่อน test execution และ wrap individual test executions ด้วย custom logic

## Setup Scripts

Setup Scripts คือ scripts ที่รันก่อน test execution เพื่อ prepare environment หรือ setup resources ที่จำเป็น

### Use Cases

- **Database Setup**: Start database หรือ run migrations ก่อน tests
- **Service Initialization**: Start mock services หรือ external dependencies
- **Environment Configuration**: Set environment variables หรือ config files
- **Resource Cleanup**: Clean up resources จาก runs ก่อนหน้า

### Configuration

```toml
# .config/nextest.toml
[scripts.setup]
# Setup script สำหรับ database
database = "scripts/setup-db.sh"

# Setup script สำหรับ services
services = "scripts/start-services.sh"

# Setup script สำหรับ environment
env = "scripts/setup-env.sh"
```

### Setup Script Behavior

```
┌─────────────────────────────────────────┐
│  1. Build Test Binaries                 │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  2. Run Setup Scripts (if configured)  │
│     - database.sh                       │
│     - services.sh                       │
│     - env.sh                            │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│  3. Execute Tests                       │
│     - Test 1                            │
│     - Test 2                            │
│     - Test 3                            │
└─────────────────────────────────────────┘
```

### Example: Database Setup

```bash
# scripts/setup-db.sh
#!/bin/bash
set -e

echo "Setting up test database..."

# Start PostgreSQL in Docker
docker-compose -f docker-compose.test.yml up -d postgres

# Wait for database to be ready
until pg_isready -h localhost -p 5432; do
  echo "Waiting for database..."
  sleep 1
done

# Run migrations
cargo install sqlx-cli
sqlx database create
sqlx migrate run

echo "Database setup complete!"
```

```toml
# .config/nextest.toml
[scripts.setup]
database = "scripts/setup-db.sh"
```

### Example: Service Initialization

```bash
# scripts/start-services.sh
#!/bin/bash
set -e

echo "Starting mock services..."

# Start mock API server
cargo run --bin mock-api &

# Start mock auth service
cargo run --bin mock-auth &

# Wait for services to be ready
sleep 5

echo "Services started!"
```

```toml
# .config/nextest.toml
[scripts.setup]
services = "scripts/start-services.sh"
```

## Wrapper Scripts

Wrapper Scripts คือ scripts ที่ wrap individual test executions ด้วย custom logic

### Use Cases

- **Coverage Collection**: Collect code coverage ระหว่าง test execution
- **Profiling**: Profile test performance
- **Custom Logging**: Add custom logging หรือ monitoring
- **Resource Monitoring**: Monitor CPU/memory usage ระหว่าง tests

### Configuration

```toml
# .config/nextest.toml
[scripts.wrapper]
# Wrapper script สำหรับ coverage
coverage = "scripts/coverage-wrapper.sh"

# Wrapper script สำหรับ profiling
profile = "scripts/profile-wrapper.sh"
```

### Wrapper Script Behavior

```
┌─────────────────────────────────────────┐
│  Test Execution with Wrapper            │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ 1. Run Wrapper Script            │  │
│  │    - Setup monitoring            │  │
│  │    - Start coverage collection   │  │
│  └───────────────┬───────────────────┘  │
│                  │                      │
│                  ▼                      │
│  ┌───────────────────────────────────┐  │
│  │ 2. Execute Test                  │  │
│  │    - Run actual test binary       │  │
│  └───────────────┬───────────────────┘  │
│                  │                      │
│                  ▼                      │
│  ┌───────────────────────────────────┐  │
│  │ 3. Run Wrapper Cleanup           │  │
│  │    - Stop monitoring             │  │
│  │    - Save coverage data          │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Example: Coverage Collection

```bash
# scripts/coverage-wrapper.sh
#!/bin/bash
set -e

TEST_BINARY="$1"
TEST_NAME="$2"

echo "Starting coverage collection for $TEST_NAME..."

# Start coverage collection
export LLVM_PROFILE_FILE="coverage-%p-%m.profraw"
export RUSTFLAGS="-C instrument-coverage"

# Run test
"$TEST_BINARY" "$TEST_NAME"

# Generate coverage report
llvm-profdata merge -sparse coverage-*.profraw -o coverage.profdata
llvm-cov report "$TEST_BINARY" -instr-profile=coverage.profdata

echo "Coverage collection complete!"
```

```toml
# .config/nextest.toml
[scripts.wrapper]
coverage = "scripts/coverage-wrapper.sh"
```

### Example: Performance Profiling

```bash
# scripts/profile-wrapper.sh
#!/bin/bash
set -e

TEST_BINARY="$1"
TEST_NAME="$2"

echo "Profiling $TEST_NAME..."

# Start perf profiling
perf record -g "$TEST_BINARY" "$TEST_NAME"

# Generate report
perf report > "profile-$TEST_NAME.txt"

echo "Profiling complete!"
```

```toml
# .config/nextest.toml
[scripts.wrapper]
profile = "scripts/profile-wrapper.sh"
```

## Script Execution Order

```
1. Build Test Binaries
   │
   ▼
2. Run Setup Scripts (all in parallel if possible)
   │
   ├─ database.sh
   ├─ services.sh
   └─ env.sh
   │
   ▼
3. Execute Tests (with wrapper scripts if configured)
   │
   ├─ Test 1 (with wrapper)
   ├─ Test 2 (with wrapper)
   └─ Test 3 (with wrapper)
   │
   ▼
4. Cleanup (if configured)
```

## Best Practices

### 1. Idempotency

Setup scripts ควรเป็น idempotent (สามารถรันซ้ำได้โดยไม่มี side effects):

```bash
#!/bin/bash
# Good: Check if already setup
if [ -f ".setup-complete" ]; then
  echo "Already setup, skipping..."
  exit 0
fi

# Setup logic here
touch .setup-complete
```

### 2. Error Handling

ใช้ `set -e` เพื่อ stop เมื่อเกิด error:

```bash
#!/bin/bash
set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure
```

### 3. Cleanup

เพิ่ม cleanup logic สำหรับ rollback:

```bash
#!/bin/bash
set -e

trap cleanup EXIT

cleanup() {
  echo "Cleaning up..."
  docker-compose down
}

# Setup logic here
```

### 4. Environment Variables

ใช้ environment variables สำหรับ configuration:

```bash
#!/bin/bash
# Use environment variables
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "Connecting to $DB_HOST:$DB_PORT..."
```

## Advanced Configuration

### Per-Profile Scripts

ตั้งค่า scripts สำหรับ profiles ต่างๆ:

```toml
[profile.default.scripts.setup]
database = "scripts/setup-db-dev.sh"

[profile.ci.scripts.setup]
database = "scripts/setup-db-ci.sh"
```

### Conditional Execution

ใช้ environment variables สำหรับ conditional execution:

```bash
#!/bin/bash
if [ "$CI" = "true" ]; then
  echo "Running in CI mode..."
  # CI-specific setup
else
  echo "Running in local mode..."
  # Local-specific setup
fi
```

## Troubleshooting

### Script Not Found

ตรวจสอบว่า script มี execute permission:

```bash
chmod +x scripts/setup-db.sh
```

### Script Fails Silently

ใช้ `set -e` และ check exit codes:

```bash
#!/bin/bash
set -e

# Check command success
if ! command -v docker &> /dev/null; then
  echo "Docker not found!"
  exit 1
fi
```

### Script Timeout

ตั้งค่า timeout สำหรับ scripts:

```toml
[scripts.setup]
database = "scripts/setup-db.sh"
timeout = "300s"  # 5 minutes
```

## See Also

- [Configuration](../guide/configuration.md) - สำหรับ configuration options
- [Test Groups](./test-groups.md) - สำหรับ test organization
- [CI Integration](../principles/ci-integration.md) - สำหรับ CI setup
