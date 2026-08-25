# Configuration Reference

## Purpose

Configuration options reference สำหรับ Supabase CLI

## Scope

- config.toml
- Environment Variables
- Docker Configuration

## config.toml

### Basic Structure

```toml
[project]
project_id = "local-project-123"

[api]
enabled = true
port = 54321
max_rows = 1000
```

### Project Section

| Key | Type | Description |
|-----|------|-------------|
| `project_id` | string | Project identifier |

### API Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable API |
| `port` | number | `54321` | API port |
| `max_rows` | number | `1000` | Max rows per request |

### DB Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `port` | number | `54322` | Database port |
| `major_version` | number | `15` | Postgres version |

### Studio Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable Studio |
| `port` | number | `54323` | Studio port |

### Auth Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable auth |
| `port` | number | `54321` | Auth port |

### Storage Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable storage |
| `port` | number | `54321` | Storage port |

### Realtime Section

| Key | Type | Default | Description |
|-----|------|---------|-------------|
| `enabled` | boolean | `true` | Enable realtime |
| `port` | number | `54321` | Realtime port |

## Environment Variables

### CLI Variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_ACCESS_TOKEN` | CLI access token |
| `SUPABASE_DB_PASSWORD` | Database password |
| `SUPABASE_WORKDIR` | Working directory |

### Local Development

```bash
export SUPABASE_URL="http://127.0.0.1:54321"
export SUPABASE_ANON_KEY="eyJhbGci..."
export SUPABASE_SERVICE_ROLE_KEY="eyJhbGci..."
```

### CI/CD

```bash
export SUPABASE_ACCESS_TOKEN=${{ secrets.SUPABASE_ACCESS_TOKEN }}
export SUPABASE_DB_PASSWORD=${{ secrets.DB_PASSWORD }}
```

## Docker Configuration

### Exclude Services

```bash
supabase start -x gotrue,imgproxy
supabase start -x gotrue,realtime,storage-api
```

### Services List

| Service | Port | Description |
|---------|------|-------------|
| `gotrue` | - | Authentication |
| `realtime` | - | WebSocket |
| `storage-api` | - | Storage |
| `imgproxy` | - | Image transforms |
| `kong` | 54321 | API gateway |
| `studio` | 54323 | Dashboard |
| `postgres-meta` | 54321 | Postgres meta |
| `postgrest` | 54321 | REST API |
| `vector` | 54321 | Vector search |

## Migration Directory

```
supabase/
├── config.toml
├── migrations/
│   ├── 20230101000000_initial.sql
│   ├── 20230102000000_add_users.sql
│   └── 20230103000000_add_profiles.sql
└── seed.sql
```

### Migration File Format

```sql
-- Migration name
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);
```

### Seed File

```sql
-- supabase/seed.sql
INSERT INTO profiles (display_name) VALUES ('Admin');
```

## Summary

| Category | Options |
|----------|---------|
| **Config** | project_id, api, db, studio |
| **Env** | SUPABASE_ACCESS_TOKEN, DB_PASSWORD |
| **Services** | -x flag to exclude services |
