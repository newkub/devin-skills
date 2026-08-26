
# Global Workflows — Workflows & Configuration

> Part of [sample-readme-overview.md](sample-readme-overview.md)

### Core Workflows

| Category | Workflows |
|----------|-----------|
| Project Analysis | `/analyze-project`, `/deep-analyze`, `/update-review-codebase-cli-and-run` |
| Code Quality | `/run-lint`, `/run-test`, `/run-typecheck`, `/run-verify` |
| Development | `/run-dev`, `/run-build`, `/run-watch-build` |
| Deployment | `/follow-deploy`, `/follow-service-deploy-to-cloudflare`, `/follow-service-vercel` |
| Maintenance | `/update-dependencies-latest`, `/run-cleanup`, `/refactor` |

### Architecture Workflows

| Pattern | Workflows |
|---------|-----------|
| Clean Architecture | `/follow-architecture` (Clean pattern) |
| DDD | `/follow-design-pattern` |
| Microservices | `/follow-architecture` (Microservices pattern) |
| Monorepo | `/follow-monorepo`, `/follow-tool-turborepo`, `/follow-tool-moonrepo` |

### Framework Workflows

| Framework | Workflows |
|-----------|-----------|
| Vue | `/follow-lib-vue`, `/follow-framework-nuxt`, `/follow-lib-vueuse` |
| React | `/follow-lib-react`, `/follow-framework-nextjs` |
| Rust | `/follow-lang-rust` |
| Bun | `/follow-lang-bun`, `/use-bun-native-api` |

### Utility Workflows

| Category | Workflows |
|----------|-----------|
| Git | `/follow-tool-git-branch`, `/follow-tool-git` |
| Testing | `/run-test`, `/run-test-e2e`, `/run-test-integration` |
| Documentation | `/update-readme-md`, `/update-docs` |

### Configuration

#### Workflow Configuration

Workflows can be configured through `.windsurf/` directory:

- `.windsurf/rules` - Project-specific rules
- `.windsurf/workflows/` - Custom workflows
- `.windsurf/skills/` - Custom skills

#### CLI Configuration

CLI tools use standard configuration files:

- `biome.jsonc` - Linting and formatting rules
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Test configuration

#### Environment Variables

Optional environment variables for customization:

```bash
# Set custom workflow directory
export WINDSURF_WORKFLOWS_PATH="/path/to/workflows"

# Enable verbose logging
export WINDSURF_VERBOSE=true
```
