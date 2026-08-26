# GitHub Action Reference

## Official Sources

- GitHub Actions Docs: https://docs.github.com/en/actions
- Creating Actions: https://docs.github.com/en/actions/creating-actions
- Actions Toolkit: https://github.com/actions/toolkit
- Marketplace Publishing: https://docs.github.com/en/actions/creating-actions/publishing-actions-in-github-marketplace

## action.yml Examples

### Node.js Action

```yaml
name: 'My Action'
description: 'Does something useful'
author: 'Your Name'
inputs:
  who-to-greet:
    description: 'Who to greet'
    required: true
    default: 'World'
outputs:
  time:
    description: 'Current time'
runs:
  using: 'node20'
  main: 'dist/index.js'
branding:
  icon: 'award'
  color: 'blue'
```

### Composite Action

```yaml
name: 'Composite Setup'
description: 'Sets up environment'
inputs:
  node-version:
    description: 'Node version'
    required: false
    default: '20'
runs:
  using: 'composite'
  steps:
    - name: Setup Node
      uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
    - name: Install
      shell: bash
      run: npm ci
```

### Docker Action

```yaml
name: 'Docker Action'
description: 'Runs a script in a container'
inputs:
  name:
    required: true
runs:
  using: 'docker'
  image: 'Dockerfile'
  args:
    - ${{ inputs.name }}
```

## TypeScript Template

```typescript
import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    const name = core.getInput('who-to-greet', { required: true })
    core.info(`Hello, ${name}!`)
    const time = new Date().toTimeString()
    core.setOutput('time', time)
  } catch (error) {
    core.setFailed(error instanceof Error ? error.message : String(error))
  }
}

run()
```

## package.json

```json
{
  "name": "my-action",
  "version": "1.0.0",
  "scripts": {
    "build": "ncc build src/index.ts -o dist --license licenses.txt",
    "test": "vitest"
  },
  "dependencies": {
    "@actions/core": "^1.11.0",
    "@actions/github": "^6.0.0"
  },
  "devDependencies": {
    "@vercel/ncc": "^0.38.0",
    "typescript": "^5.8.0"
  }
}
```

## Build With esbuild

```bash
bun build --target=node --outfile=dist/index.js --format=cjs src/index.ts
```

## Release Tags

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
git tag -fa v1 -m "Update v1 tag"
git push origin v1 --force-with-lease
```

## Marketplace Requirements

- ต้องเป็น public repo
- ต้องมี `action.yml` ที root
- `name` ไม่ซ้ำกับ action อื่น
- `description` ต้องมี
- ต้อง accept GitHub Marketplace ใน release

## Best Practices

- ใช้ `core.getInput` สำหรับ inputs
- ใช้ `core.setOutput` สำหรับ outputs
- ใช้ `core.setFailed` สำหรับ fail action
- ไม่ log `GITHUB_TOKEN` หรือ secrets
- สร้าง major version tag (`v1`) เสมอ
