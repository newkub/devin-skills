# Skills

## Purpose

Skills คือ reusable knowledge packages สำหรับ specific domains หรือ frameworks

## Overview

Skills ช่วยให้:
- Package domain-specific knowledge
- Share across projects
- Automatic invocation
- Custom behavior patterns

## Creating a Skill

### Using the UI (Easiest)

1. Right-click in project
2. "Create Skill"
3. Fill in frontmatter
4. Add supporting content
5. Save

### Manual Creation

Create directory structure:
```
skill-name/
├── SKILL.md
├── guide/
├── key-concepts/
├── principles/
├── references/
├── workflows/
├── templates/
└── scripts/
```

## SKILL.md File Format

### Required Frontmatter Fields

```yaml
---
title: Skill Name
description: Brief description
auto_execution_mode: 3
---
```

### Example Skill

```yaml
---
title: React
description: React development best practices and patterns
auto_execution_mode: 3
---

## Goal

Use React best practices for component development

## Scope

React applications, hooks, state management

## Execute

1. Use functional components
2. Prefer hooks over class components
3. Follow React best practices

## Rules

- Use TypeScript for type safety
- Follow naming conventions
- Write tests for components
```

## Adding Supporting Resources

### Guide Files

Step-by-step instructions:
- `guide/installation.md`
- `guide/quick-start.md`
- `guide/configuration.md`

### Key Concepts

Core concepts:
- `key-concepts/components.md`
- `key-concepts/hooks.md`
- `key-concepts/state-management.md`

### Principles

Best practices:
- `principles/performance.md`
- `principles/testing.md`
- `principles/accessibility.md`

### References

API documentation:
- `references/api.md`
- `references/cli.md`
- `references/configuration.md`

## Invoking Skills

### Automatic Invocation

Windsurf automatically invokes skills when:
- Project matches skill scope
- User mentions related concepts
- File patterns match skill domain

### Manual Invocation

Invoke skill explicitly:
```
/react create a new component
```

## Skill Scopes

### Project-Level Skills

Stored in project:
- `.windsurf/skills/`
- Project-specific knowledge
- Not shared across projects

### System-Level Skills (Enterprise)

Stored globally:
- Admin-controlled
- Shared across organization
- Enforced standards

## Example Use Cases

### Deployment Workflow

Skill for deployment process:
- CI/CD pipeline knowledge
- Deployment commands
- Environment configuration

### Code Review Guidelines

Skill for code review:
- Review checklist
- Common issues
- Best practices

### Testing Procedures

Skill for testing:
- Test patterns
- Framework-specific tests
- Coverage requirements

## Best Practices

1. **Focused Scope** - Keep skills domain-specific
2. **Clear Documentation** - Well-structured guides
3. **Examples** - Include working examples
4. **Updates** - Keep skills current
5. **Testing** - Test skill invocation

## Skills vs Rules vs Workflows

| Feature | Skills | Rules | Workflows |
|---------|--------|-------|----------|
| **Purpose** | Domain knowledge | Behavior patterns | Multi-step processes |
| **Scope** | Projects/domains | Codebase-wide | Specific tasks |
| **Invocation** | Auto/Manual | Automatic | Manual |
| **Structure** | Full documentation | Simple rules | Step-by-step |

## Related Documentation

- [Workflows](workflows.md)
- [Rules](../memories-and-rules.md)
- [Memories](../memories-and-rules.md)

## Summary

| Feature | Description |
|---------|-------------|
| **Creation** | UI or manual |
| **Structure** | SKILL.md + supporting files |
| **Invocation** | Automatic or manual |
| **Scopes** | Project or system-level |
| **Use Cases** | Deployment, review, testing |
