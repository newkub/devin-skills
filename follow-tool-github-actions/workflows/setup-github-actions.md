---
title: Setup GitHub Actions
description: Configure GitHub Actions for CI/CD
---

## Goal

Configure GitHub Actions for CI/CD in the project

## Execute

### 1. Create Workflow Folder

Create the `.github/workflows/` folder in the repository root

### 2. Create Workflow File

Create the `ci.yml` file:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: '20'
      - run: bun install
      - run: bun test
```

### 3. Push to GitHub

Push the workflow file to the repository

### 4. Verify

Go to the Actions tab to watch the workflow run

## Expected Outcome

- A working GitHub Actions workflow
- CI pipeline for tests
