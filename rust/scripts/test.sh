#!/bin/bash
# Test Rust project

set -e

echo "Running cargo test..."
cargo test

echo "Running cargo test --release..."
cargo test --release

echo "All tests passed!"
