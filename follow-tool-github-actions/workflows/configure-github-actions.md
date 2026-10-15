---
title: Configure GitHub Actions
description: Configure advanced GitHub Actions
---

## Goal

Configure advanced GitHub Actions for production

## Execute

### 1. Configure Permissions

Restrict permissions:

```yaml
permissions:
  contents: read
  pull-requests: write
```

### 2. Configure Environments

Create environments for deployment:

```yaml
jobs:
  deploy:
    environment: production
    runs-on: ubuntu-latest
```

### 3. Configure Timeouts

Set timeouts:

```yaml
jobs:
  test:
    timeout-minutes: 30
```

### 4. Configure Reusable Workflows

Create a reusable workflow:

```yaml
# .github/workflows/build.yml
on:
  workflow_call:
    inputs:
      node-version:
        required: true
        type: string

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v7
        with:
          node-version: ${{ inputs.node-version }}
```

Use the reusable workflow:

```yaml
jobs:
  build:
    uses: ./.github/workflows/build.yml
    with:
      node-version: '20'
```

## Expected Outcome

- Restricted permissions
- Environments for deployment
- Appropriate timeouts
- Reusable workflows
