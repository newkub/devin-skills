# Workflows

## Purpose

Workflows คือ multi-step processes ที่ Cascade สามารถ execute อัตโนมัติ

## Overview

Workflows ช่วยให้:
- Automate repetitive tasks
- Standardize processes
- Share across team
- Execute complex sequences

## How It Works

1. Define workflow steps
2. Cascade executes each step
3. Tools used as needed
4. Results aggregated

## Creating a Workflow

### Manual Creation

Create `.windsurf/workflows/workflow-name.md`:

```yaml
---
description: Deploy application to production
---

## Steps

1. Run tests
2. Build application
3. Deploy to staging
4. Run smoke tests
5. Deploy to production
6. Verify deployment
```

### Generate with Cascade

Ask Cascade to create workflow:
```
Create a workflow for deploying this React app to Vercel
```

## Workflow Discovery

### Storage Locations

**Project Workflows**
- `.windsurf/workflows/`
- Project-specific
- Not shared

**Global Workflows**
- `~/.windsurf/global_workflows/`
- Shared across projects
- Personal standards

**System-Level (Enterprise)**
- Admin-controlled
- Organization-wide
- Enforced standards

### Workflow Precedence

1. System-level (highest priority)
2. Global
3. Project (lowest priority)

## Example Workflows

### Code Review Workflow

```yaml
---
description: Comprehensive code review process
---

## Steps

1. Check for TODO comments
2. Verify test coverage
3. Run linter
4. Check for security issues
5. Review performance
6. Check documentation
```

### Deployment Workflow

```yaml
---
description: Safe deployment process
---

## Steps

1. Run full test suite
2. Build production bundle
3. Run security scan
4. Deploy to staging
5. Run integration tests
6. Deploy to production
7. Monitor for errors
```

### Feature Development Workflow

```yaml
---
description: End-to-end feature development
---

## Steps

1. Create feature branch
2. Write specification
3. Implement feature
4. Write tests
5. Update documentation
6. Create pull request
7. Address feedback
8. Merge to main
```

## System-Level Workflows (Enterprise)

Admins can create organization-wide workflows:
- Enforce standards
- Ensure compliance
- Automate processes
- Track execution

## Best Practices

1. **Clear Steps** - Each step should be clear
2. **Atomic** - Steps should be independent
3. **Testable** - Verify each step
4. **Documented** - Explain purpose
5. **Versioned** - Track changes

## Related Documentation

- [Skills](skills.md)
- [Rules](../memories-and-rules.md)
- [Cascade](cascade.md)

## Summary

| Feature | Description |
|---------|-------------|
| **Creation** | Manual or Cascade-generated |
| **Storage** | Project, global, system |
| **Precedence** | System > global > project |
| **Examples** | Review, deploy, feature dev |
| **Enterprise** | Admin-controlled workflows |
