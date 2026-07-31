# Configuration

## Database Configuration

### PostgreSQL Configuration

### postgresql.conf

```ini
# Connection Settings
listen_addresses = 'localhost'
port = 5432
max_connections = 100

# Memory Settings
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
work_mem = 16MB

# WAL Settings
wal_level = replica
max_wal_size = 1GB
min_wal_size = 80MB

# Query Tuning
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_min_duration_statement = 1000
```

### pg_hba.conf

```ini
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             all                                     md5
host    all             all             127.0.0.1/32            md5
host    all             all             ::1/128                 md5
host    all             all             0.0.0.0/0               md5
```

### MySQL Configuration

### my.cnf

```ini
[mysqld]
# Connection Settings
port = 3306
max_connections = 151

# InnoDB Settings
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2

# Query Cache
query_cache_type = 1
query_cache_size = 64M

# Logging
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### MongoDB Configuration

### mongod.conf

```yaml
storage:
  dbPath: /var/lib/mongo
  journal:
    enabled: true

systemLog:
  destination: file
  path: /var/log/mongodb/mongod.log
  logAppend: true

net:
  port: 27017
  bindIp: 127.0.0.1

replication:
  replSetName: "myReplicaSet"
```

### Redis Configuration

### redis.conf

```ini
# Network
bind 127.0.0.1
port 6379

# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
save 900 1
save 300 10
save 60 10000

# Logging
loglevel notice
logfile /var/log/redis/redis.log
```

### ORM Configuration

### Prisma

**schema.prisma**:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int    @id @default(autoincrement())
  name  String
  email String @unique
}
```

**.env**:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```

### Drizzle

**drizzle.config.ts**:

```typescript
import type { PostgresJsQuery } from 'drizzle-orm/postgres-js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
```

### Connection Pooling

### PgBouncer

**pgbouncer.ini**:

```ini
[databases]
mydb = host=localhost port=5432 dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 25
listen_addr = 127.0.0.1
listen_port = 6432
```

### Environment Variables

### PostgreSQL

```bash
export PGHOST=localhost
export PGPORT=5432
export PGDATABASE=mydb
export PGUSER=user
export PGPASSWORD=password
```

### MySQL

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_DATABASE=mydb
export MYSQL_USER=user
export MYSQL_PASSWORD=password
```

### MongoDB

```bash
export MONGO_URI="mongodb://localhost:27017/mydb"
```

### Security Configuration

### SSL/TLS

**PostgreSQL**:

```ini
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

**MongoDB**:

```yaml
net:
  ssl:
    mode: requireSSL
    PEMKeyFile: /etc/ssl/mongodb.pem
```

### Authentication

**PostgreSQL**:

```sql
-- Create user with password
CREATE USER myuser WITH PASSWORD 'mypassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
```

**MongoDB**:

```javascript
// Create user
db.createUser({
  user: "myuser",
  pwd: "mypassword",
  roles: [{ role: "readWrite", db: "mydb" }]
});
```

### Backup Configuration

### PostgreSQL

```bash
# Automated backup script
pg_dump -U user -h localhost mydb > backup_$(date +%Y%m%d).sql
```

### MongoDB

```bash
# Automated backup script
mongodump --uri="mongodb://localhost:27017/mydb" --out=/backup/$(date +%Y%m%d)
```

### Monitoring Configuration

### PostgreSQL

```sql
-- Enable statistics
ALTER SYSTEM SET track_activities = on;
ALTER SYSTEM SET track_counts = on;
ALTER SYSTEM SET track_io_timing = on;
```

### MySQL

```sql
-- Enable performance schema
UPDATE performance_schema.setup_instruments
SET ENABLED = 'YES', TIMED = 'YES';
```
