# Monitoring and Observability

## Metrics

**Counter**: Monotonically increasing value

```typescript
counter.Increment("orders.created");
```

**Gauge**: Point-in-time value

```typescript
gauge.Set("active.users", currentUserCount);
```

**Histogram**: Distribution of values

```typescript
histogram.Record("request.duration", requestDurationMs);
```

## Logging

**Log Levels**:
- **ERROR**: Errors requiring attention
- **WARN**: Warning conditions
- **INFO**: Informational messages
- **DEBUG**: Debugging information

**Structured Logging**:

```typescript
logger.LogInformation("Order created", new {
  OrderId = order.Id,
  UserId = order.UserId,
  Total = order.Total,
  Timestamp = Date.UtcNow
});
```

## Tracing

**Distributed Tracing**: Track requests across services

```
Request → Service A → Service B → Service C
   │         │           │           │
   └─────────┴───────────┴───────────┘
              Trace ID
```

**Example**:

```typescript
using (const activity = activitySource.StartActivity("ProcessOrder")) {
  activity?.SetTag("order.id", order.Id);
  
  await ProcessPayment(order);
  await UpdateInventory(order);
  await SendConfirmation(order);
}
```
