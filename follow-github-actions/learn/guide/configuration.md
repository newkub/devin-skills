# Configuration

## การตั้งค่า GitHub Actions

### Workflow File Structure

```yaml
name: Workflow Name
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_ENV: test

jobs:
  job-name:
    runs-on: ubuntu-latest
    steps:
      - name: Step Name
        run: command
```

### Common Configurations

#### Matrix Strategy

```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest, windows-latest]
```

#### Caching

```yaml
- name: Cache Dependencies
  uses: actions/cache@v3
  with:
    path: node_modules
    key: ${{ runner.os }}-node-${{ hashFiles('**/bun.lockb') }}
```

#### Artifacts

```yaml
- name: Upload Artifacts
  uses: actions/upload-artifact@v3
  with:
    name: build-output
    path: dist/
```

#### Permissions

```yaml
permissions:
  contents: read
  pull-requests: write
```
