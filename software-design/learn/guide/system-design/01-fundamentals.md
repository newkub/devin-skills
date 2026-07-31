# System Design Fundamentals

## Scalability

**Vertical Scaling**: Add more resources to single server

**Horizontal Scaling**: Add more servers

```
Vertical:    Horizontal:
┌──────┐     ┌──────┐  ┌──────┐  ┌──────┐
│Server│     │Server│  │Server│  │Server│
│  8GB │ →   │  2GB │  │  2GB │  │  2GB │
└──────┘     └──────┘  └──────┘  └──────┘
```

**Load Balancing**:

```
        ┌──────────┐
        │  Client  │
        └────┬─────┘
             │
        ┌────▼─────┐
        │  Load    │
        │ Balancer │
        └────┬─────┘
             │
      ┌──────┴──────┐
      │             │
┌─────▼────┐  ┌────▼────┐
│ Server 1 │  │ Server 2│
└──────────┘  └─────────┘
```

## Availability

**High Availability**: System remains operational even when components fail

**Strategies**:
- **Redundancy**: Multiple instances of critical components
- **Failover**: Automatic switching to backup systems
- **Health Checks**: Monitor component health

**Example**:

```
┌─────────────┐
│   Primary   │
│   Database  │
└──────┬──────┘
       │ (replication)
┌──────▼──────┐
│   Replica   │
│   Database  │
└─────────────┘
```

## Reliability

**Reliability**: System performs correctly over time

**Strategies**:
- **Error Handling**: Graceful degradation
- **Retry Logic**: Transient failures
- **Circuit Breaker**: Prevent cascading failures

**Circuit Breaker Pattern**:

```typescript
class CircuitBreaker {
  private _failureCount: number = 0;
  private _state: CircuitState = CircuitState.Closed;
  
  public async ExecuteAsync<T>(operation: () => Promise<T>): Promise<T> {
    if (this._state === CircuitState.Open)
      throw new CircuitBreakerOpenException();
    
    try {
      const result = await operation();
      this._failureCount = 0;
      return result;
    }
    catch (ex) {
      this._failureCount++;
      if (this._failureCount >= Threshold) {
        this._state = CircuitState.Open;
      }
      throw;
    }
  }
}
```

## Performance

**Latency**: Time to respond to request

**Throughput**: Number of requests per second

**Optimization Strategies**:

| Strategy | When to Use | Example |
|----------|-------------|---------|
| **Caching** | Read-heavy workloads | Redis, Memcached |
| **CDN** | Static content delivery | Cloudflare, AWS CloudFront |
| **Database Indexing** | Slow queries | Index on frequently queried columns |
| **Connection Pooling** | High database load | HikariCP, pgBouncer |

**Caching Layers**:

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
┌────▼─────┐
│  CDN     │ ← Edge cache
└────┬─────┘
     │
┌────▼─────┐
│  App     │ ← Application cache
└────┬─────┘
     │
┌────▼─────┐
│  Redis   │ ← Distributed cache
└────┬─────┘
     │
┌────▼─────┐
│ Database │ ← Source of truth
└──────────┘
```
