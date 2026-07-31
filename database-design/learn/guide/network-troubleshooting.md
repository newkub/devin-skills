# Network Troubleshooting

## Problem: Connection Timeout

**Symptoms**:
- Cannot connect
- Timeout errors
- Intermittent failures

**Causes**:
1. Network latency
2. Firewall blocking
3. DNS issues

**Solutions**:

```bash
# Test connectivity
ping database-server
telnet database-server 5432

# Check firewall
sudo ufw status

# Check DNS
nslookup database-server
```
