
# Global Workflows

<div align="center">
  <img src="https://placehold.co/120x120/6366f1/ffffff?text=GW" alt="Global Workflows Logo" width="80" />
  <h1>Global Workflows</h1>
  <h3>Standardized workflows for Windsurf IDE development</h3>
  <p>A comprehensive collection of 295+ workflows providing systematic approaches to common development tasks across all workspaces.<br/>Automated, repeatable, and consistent development practices.</p>

  <p>
    <a href="https://github.com/newkub/global_workflows/stargazers"><img src="https://img.shields.io/github/stars/newkub/global_workflows?style=flat-square&color=f59e0b" alt="Stars" /></a>
    <a href="https://github.com/newkub/global_workflows/releases/latest"><img src="https://img.shields.io/github/v/release/newkub/global_workflows?style=flat-square&color=10b981" alt="Release" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License" /></a>
    <a href="https://github.com/newkub/global_workflows/issues"><img src="https://img.shields.io/github/issues/newkub/global_workflows?style=flat-square&color=ef4444" alt="Issues" /></a>
  </p>

  <p>
    <a href="#introduction">Introduction</a> ·
    <a href="#features">Features</a> ·
    <a href="#installation">Installation</a> ·
    <a href="#usage">Usage</a> ·
    <a href="#reference">Reference</a>
  </p>
</div>

> [!TIP]
> Quick Start: Copy workflows to your Windsurf global workflows directory and start using them immediately with slash commands (`workflow-name`).

> [!NOTE]
> Coverage: Workflows cover all aspects of development - from project setup to deployment, testing to maintenance, and everything in between.

> [!WARNING]
> Beta: Some workflows are in active development. Report issues via GitHub issues for rapid fixes and improvements.

> [!IMPORTANT]
> Version: Workflows are continuously updated. Check the latest version before using to ensure you have the most recent improvements.

> [!CAUTION]
> Breaking Changes: Some workflows may introduce breaking changes. Always test workflows in a non-production environment first.

<br/>

<div align="center">
  <img src="https://placehold.co/1280x720/6366f1/ffffff?text=Global+Workflows" alt="Global Workflows Banner">
</div>

## Reference

| Topic | Description |
|-------|-------------|
| Core Workflows | Project analysis, code quality, development, deployment, and maintenance workflows |
| Architecture Workflows | Clean Architecture, DDD, Microservices, and Monorepo patterns |
| Framework Workflows | Vue, React, Rust, and Bun framework-specific workflows |
| Utility Workflows | Git, testing, and documentation utilities |
| Configuration | Workflow, CLI, and environment variable configuration |

### Core Workflows

| Category | Workflows |
|----------|-----------|
| Project Analysis | `/analyze-project`, `/deep-analyze`, `/review-codebase` |
| Code Quality | `/run-lint`, `/run-test`, `/run-typecheck`, `/run-verify` |
| Development | `/run-dev`, `/run-build`, `/run-watch-build` |
| Deployment | `/follow-deploy`, `/follow-deploy-to-cloudflare`, `/follow-vercel` |
| Maintenance | `/update-dependencies-latest`, `/run-cleanup`, `/refactor` |

### Architecture Workflows

| Pattern | Workflows |
|---------|-----------|
| Clean Architecture | `/follow-clean-architecture` |
| DDD | `/follow-design-pattern` |
| Microservices | `/follow-microservices-architecture` |
| Monorepo | `/follow-monorepo`, `/follow-turborepo`, `/follow-moonrepo` |

### Framework Workflows

| Framework | Workflows |
|-----------|-----------|
| Vue | `/follow-vue`, `/follow-nuxt`, `/follow-vueuse` |
| React | `/follow-react`, `/follow-next` |
| Rust | `/follow-rust` |
| Bun | `/follow-bun`, `/use-bun-native-instead-nodejs` |

### Utility Workflows

| Category | Workflows |
|----------|-----------|
| Git | `/follow-git-branch`, `/follow-git` |
| Testing | `/run-test`, `/run-test-e2e`, `/run-test-integration` |
| Documentation | `/update-readme`, `/update-docs` |

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

## Release

<details>
<summary><strong>v1.0.0</strong> (2024-01-15)</summary>

<table>
<tr>
<td width="50%" valign="top">
<img src="https://api.iconify.design/mdi:rocket-launch.svg?color=%236366f1" width="32" height="32">
<h3>Initial Release</h3>
<p>First stable release with comprehensive workflow coverage for all development aspects.</p>
</td>
<td width="50%" valign="top">

- 295+ standardized workflows
- Complete project structure
- Full documentation
- Integration guides

</td>
</tr>
</table>

</details>

<details>
<summary><strong>v0.9.0</strong> (2024-01-10)</summary>

<table>
<tr>
<td width="50%" valign="top">
<img src="https://api.iconify.design/mdi:handshake.svg?color=%23f59e0b" width="32" height="32">
<h3>Contribution Guide</h3>
<p>Added comprehensive contribution guidelines with numbered steps for easier onboarding.</p>
</td>
<td width="50%" valign="top">

- Contribution accordion with numbered steps
- Setup, Development, Submit PR, Sync workflows
- Git workflow documentation
- PR template guidelines

</td>
</tr>
</table>

</details>

<details>
<summary><strong>v0.8.0</strong> (2024-01-05)</summary>

<table>
<tr>
<td width="50%" valign="top">
<img src="https://api.iconify.design/mdi:table-column.svg?color=%2310b981" width="32" height="32">
<h3>Usage Layout</h3>
<p>Redesigned Usage section with 2-column layout and inline icons for better readability.</p>
</td>
<td width="50%" valign="top">

- 2-column table layout
- Inline icons with titles
- Visual code examples
- Improved accessibility

</td>
</tr>
</table>

</details>

<details>
<summary><strong>v0.7.0</strong> (2024-01-01)</summary>

<table>
<tr>
<td width="50%" valign="top">
<img src="https://api.iconify.design/mdi:alert-circle.svg?color=%23ef4444" width="32" height="32">
<h3>Enhanced Callouts</h3>
<p>Added IMPORTANT and CAUTION callouts to hero section for better information hierarchy.</p>
</td>
<td width="50%" valign="top">

- [!IMPORTANT] callout for version info
- [!CAUTION] callout for breaking changes
- Improved information hierarchy
- Better user guidance

</td>
</tr>
</table>

</details>

<details>
<summary><strong>v0.6.0</strong> (2023-12-28)</summary>

<table>
<tr>
<td width="50%" valign="top">
<img src="https://api.iconify.design/mdi:image-multiple.svg?color=%238b5cf6" width="32" height="32">
<h3>Hero Section</h3>
<p>Restructured README with Hero Section, Callouts, and Banner Image for professional presentation.</p>
</td>
<td width="50%" valign="top">

- Hero Section with logo and badges
- 5 types of callouts
- 16:9 banner image
- Improved visual hierarchy

</td>
</tr>
</table>

</details>

## MIT License

[LICENSE.md](LICENSE.md)

- Free to use
- Modify
- Distribute

## Contribution

### 1. Setup

1. Fork the repository
2. Clone your fork locally

```bash
git clone https://github.com/YOUR_USERNAME/global_workflows.git
cd global_workflows
```

3. Add upstream remote

```bash
git remote add upstream https://github.com/newkub/global_workflows.git
```

### 2. Development

1. Create a new branch for your workflow

```bash
git checkout -b feature/my-workflow
```

2. Follow `/follow-write-devin-skills` for workflow structure
3. Follow `/follow-content-quality` for content standards
4. Test workflows thoroughly before submitting
5. Commit your changes

```bash
git add .
git commit -m "Add: my-workflow description"
```

### 3. Submit PR

1. Push your branch to your fork

```bash
git push origin feature/my-workflow
```

2. Create a Pull Request on GitHub
3. Update this README with new workflow descriptions
4. Wait for review and merge

### 4. Sync

1. After merge, sync your fork with upstream

```bash
git checkout main
git fetch upstream
git merge upstream/main
git push origin main
```
