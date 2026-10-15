---
title: Use GitHub Actions
description: Use GitHub Actions for automation
---

## Goal

Use GitHub Actions for various automation tasks

## Execute

### 1. Use Caching

Add caching for dependencies:

```yaml
- name: Cache Dependencies
  uses: actions/cache@v6
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/bun.lockb') }}
```

### 2. Use Matrix Strategy

Test on multiple platforms:

```yaml
strategy:
  matrix:
    node-version: [22, 24]
    os: [ubuntu-latest, windows-latest]
```

### 3. Use Secrets

Use secrets in the workflow:

```yaml
- name: Deploy
  run: bun run deploy
  env:
    API_KEY: ${{ secrets.API_KEY }}
```

### 4. Use Artifacts

Upload build artifacts:

```yaml
- name: Upload Artifacts
  uses: actions/upload-artifact@v7
  with:
    name: build-output
    path: dist/
```

## Expected Outcome

- Workflow with caching
- Tests on multiple platforms
- Secrets handled safely
- Artifacts stored
