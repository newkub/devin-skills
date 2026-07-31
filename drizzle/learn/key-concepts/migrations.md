# Migrations

## What are Migrations

Migrations คือ version control สำหรับ database schema:
- **Version Control** - track schema changes
- **Rollback** - rollback changes
- **Team Collaboration** - sync schema ใน team

## Using Migrations

```bash
# Generate migration
bunx drizzle-kit generate:pg

# Apply migration
bunx drizzle-kit migrate:pg

# Push schema (development)
bunx drizzle-kit push:pg
```

## Migration Workflow

1. Update schema
2. Generate migration
3. Review migration
4. Apply migration
5. Test migration
