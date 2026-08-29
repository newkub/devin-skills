## Introduction

This repository contains over 295+ standardized workflows that cover every aspect of software development, from project setup to maintenance. Each workflow is designed to be automated, repeatable, and consistent across all workspaces, ensuring uniform development practices regardless of project context.

## Why

<table border="1">
<tr>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:lightning-bolt.svg?color=%23f59e0b" width="32" height="32">
    <h3>Efficiency</h3>
    <p>Standardized workflows reduce development time by providing proven solutions to common problems.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:target.svg?color=%236366f1" width="32" height="32">
    <h3>Consistency</h3>
    <p>Uniform practices across all workspaces ensure code quality and maintainability.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:trending-up.svg?color=%2310b981" width="32" height="32">
    <h3>Scalability</h3>
    <p>Reusable workflows scale with your team and project complexity.</p>
  </td>
</tr>
</table>

## Key Concepts (What + Mental Model)

<table border="1">
<tr>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:book-multiple.svg?color=%236366f1" width="32" height="32">
    <h3>Standardized Workflows</h3>
    <p>A library of reusable, well-documented workflows that can be applied to any project type, ensuring consistency across development teams.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:autorenew.svg?color=%23f59e0b" width="32" height="32">
    <h3>Automation First</h3>
    <p>Every workflow is designed to be automated and repeatable, reducing manual effort and human error in development processes.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:earth.svg?color=%2310b981" width="32" height="32">
    <h3>Global Consistency</h3>
    <p>Workflows are shared across all workspaces, maintaining uniform development practices regardless of project context.</p>
  </td>
</tr>
</table>

## Principles (Why + Rules)

<table border="1">
<tr>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:check-circle.svg?color=%2310b981" width="32" height="32">
    <h3>Deterministic Execution</h3>
    <p>Every workflow must produce the same result when run multiple times with the same inputs. No ambiguous or subjective steps.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:layers.svg?color=%236366f1" width="32" height="32">
    <h3>Layered Architecture</h3>
    <p>Workflows follow a clear structure: Prepare → Analyze → Planning → Write → Reflex → Report. Never skip steps.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:code-tags-check.svg?color=%23ef4444" width="32" height="32">
    <h3>Code Quality First</h3>
    <p>All workflows enforce best practices for linting, formatting, type checking, and testing before any code changes.</p>
  </td>
</tr>
<tr>
  <td align="center" valign="top">
    <img src="https://api.iconify.design/mdi:git.svg?color=%23f97316" width="32" height="32">
    <h3>Git-Native Operations</h3>
    <p>Prefer git commands for file operations. Fall back to pwsh only when git is not available.</p>
  </td>
  <td align="center" valign="top">
    <img src="https://api.iconify.design/mdi:rocket-launch.svg?color=%236366f1" width="32" height="32">
    <h3>Bun-First Automation</h3>
    <p>Use Bun shell for all automation tasks. Use `bunx` instead of `npx` for package execution.</p>
  </td>
</tr>
</table>

## Features

<table border="1">
<tr>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:book-multiple.svg?color=%236366f1" width="32" height="32">
    <h3>Comprehensive Workflow Library</h3>
    <p>Over 295+ workflows covering every aspect of software development from project setup to maintenance.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:tools.svg?color=%23f59e0b" width="32" height="32">
    <h3>CLI Commands</h3>
    <p>Built-in CLI tools for workflow management including unused workflow detection and file length validation.</p>
  </td>
  <td align="center" width="33%">
    <img src="https://api.iconify.design/mdi:sync.svg?color=%2310b981" width="32" height="32">
    <h3>Workflow Interconnectivity</h3>
    <p>Workflows reference and build upon each other, creating a cohesive system with standards for creation and linking.</p>
  </td>
</tr>
<tr>
  <td align="center" valign="top">
    <img src="https://api.iconify.design/mdi:target.svg?color=%23ef4444" width="32" height="32">
    <h3>Specialized Workflows</h3>
    <p>Domain-specific workflows for advanced use cases including testing, performance, security, and documentation.</p>
  </td>
</tr>
</table>

## Quick Start

### Installation

#### Clone the Repository

```bash
git clone https://github.com/newkub/global_workflows.git
cd global_workflows
```

#### Install CLI Commands

Navigate to the commands directory and install dependencies:

```bash
cd commands
bun install
bun run build
```

This will build the CLI tools and make them available globally via npm.

#### Add to Windsurf

Copy the workflow files to your Windsurf global workflows directory:

```bash
# Windows
xcopy /E /I . "C:\Users\YourUsername\.codeium\windsurf\global_workflows"

# macOS/Linux
cp -r . ~/.codeium/windsurf/global_workflows/
```

## Usage

### 1. Usage via CLI

<table>
<tr>
<td width="50%" valign="top">
<h3><img src="https://api.iconify.design/mdi:terminal.svg?color=%236366f1" width="32" height="32" style="vertical-align: middle; margin-right: 8px;"> CLI Commands</h3>
<p>The CLI commands provide direct access to workflow management utilities for quick automation and batch processing.</p>
</td>
<td width="50%" valign="top">

```bash
# Check for unused workflows
check-unused-workflows

# Validate workflow file lengths
check-file-length
```

</td>
</tr>
</table>

### 2. Usage via Windsurf IDE

<table>
<tr>
<td width="50%" valign="top">
<h3><img src="https://api.iconify.design/mdi:chat.svg?color=%23f59e0b" width="32" height="32" style="vertical-align: middle; margin-right: 8px;"> Windsurf Integration</h3>
<p>Workflows are integrated directly into Windsurf through slash commands for seamless development workflow.</p>
</td>
<td width="50%" valign="top">

```bash
# Analyze a project
/analyze-project

# Fix errors systematically
/resolve-errors

# Deploy to Cloudflare
/deploy-to-cloudflare

# Update all versions (runtime + deps + tools + config)
/update-version-latest

# Update runtime only
/update-runtime-latest

# Update dependencies
/update-dependencies-latest
```

</td>
</tr>
</table>

### 3. Usage via Programmatic API

<table>
<tr>
<td width="50%" valign="top">
<h3><img src="https://api.iconify.design/mdi:code-braces.svg?color=%2310b981" width="32" height="32" style="vertical-align: middle; margin-right: 8px;"> Programmatic API</h3>
<p>For advanced users, workflows can be executed programmatically for custom integrations and automation pipelines.</p>
</td>
<td width="50%" valign="top">

```typescript
import { executeWorkflow } from 'global-workflows-commands';

// Execute a specific workflow
await executeWorkflow('analyze-project', {
  target: './my-project',
  options: {
    deep: true
  }
});
```

</td>
</tr>
</table>
