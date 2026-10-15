---
title: Development Pages Reference
description: Reference for the shared development page group
---

# Development Pages Reference

The development page group is shared by all docs types — used for `docs/index.md` TOC and the VitePress sidebar (`update-vitepress-docs/SKILL.md` → `### Template: Sidebar Sections`, **Development**).

## Pages

| Page | Purpose |
|------|---------|
| `setup.md` | Environment setup and installation |
| `architecture.md` | Project structure, conventions, and design |
| `workflows.md` | Development workflows and slash commands |
| `testing.md` | Testing strategy and commands |
| `deployment.md` | Deployment pipeline, secrets, rollback |
| `troubleshooting.md` | Common issues and debug tips |

## Content Format

- Use frontmatter with `title` and `description`
- Start with a single-paragraph overview
- Use `##` for sections: `Requirements`, `Installation`, `Commands`, `Verification`
- Include real commands from `package.json`
- Use bullet checklists for verification steps
- Keep examples runnable
