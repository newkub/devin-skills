# Memory Troubleshooting

## Problem: Out of Memory

**Symptoms**:
- Database crashes
- OOM killer kills process
- Poor performance

**Causes**:
1. Large work_mem
2. Too many connections
3. Large result sets

**Solutions**:

```ini
# PostgreSQL: Reduce work_mem
work_mem = 16MB

# PostgreSQL: Reduce shared_buffers
shared_buffers = 128MB

# PostgreSQL: Reduce max_connections
max_connections = 50
```
