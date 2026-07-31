#!/bin/bash
# Check Rust project

set -e

echo "Running cargo check..."
cargo check

echo "Running cargo clippy..."
cargo clippy -- -D warnings

echo "Running cargo fmt --check..."
cargo fmt --check

echo "All checks passed!"
