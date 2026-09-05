---
title: Development Sidebar Reference
description: Reference for the shared development sidebar
---

# Development Sidebar Reference

The development sidebar is shared between `product`, `open-source`, and `cli` docs.

## Pages

| Page | Purpose |
|------|---------|
| `setup.md` | Environment setup and installation |
| `architecture.md` | Project structure, conventions, and design |
| `workflows.md` | Development workflows and slash commands |
| `testing.md` | Testing strategy and commands |
| `ci-cd.md` | CI/CD pipeline and release process |
| `scripts.md` | Bun shell scripts and common commands |
| `troubleshooting.md` | Common issues and debug tips |

## Content Format

- Use frontmatter with `title` and `description`
- Start with a single-paragraph overview
- Use `##` for sections: `Requirements`, `Installation`, `Commands`, `Verification`
- Include real commands from `package.json`
- Use bullet checklists for verification steps
- Keep examples runnable
