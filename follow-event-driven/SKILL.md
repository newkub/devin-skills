---
name: follow-event-driven
description: Implement Event-Driven Architecture สำหรับ async workflows และ loose coupling
---

## Goal

Implement Event-Driven Architecture ที่รองรับ async workflows, scalability, และ loose coupling

## Scope

ใช้สำหรับออกแบบและ implement Event-Driven Architecture สำหรับ async workflows, loose coupling, และ scalability

- ออกแบบ event model และ message broker
- สร้าง event bus, handlers, และ consumers
- กำหนด delivery guarantees, idempotency, และ error handling
- รองรับ event sourcing และ observability

## Execute

### 1. Design Event Model

> Goal: ออกแบบ event model และ event catalog
> Goal: มี event contracts ที่ชัดเจนและ versionable

1. ระบุ business events ที่สำคัญ:
   - Domain events (business facts)
   - Integration events (cross-system)
   - Notification events (alerts, updates)
2. กำหนด event schema และ versioning strategy
3. สร้าง event catalog หรือ registry
4. ระบุ event producers และ consumers

### 2. Choose Message Broker

> Goal: เลือก message broker ตาม scalability และ delivery requirements
> Goal: broker เหมาะสมกับระบบ

1. เลือก message broker ตาม requirements:
   - In-memory: Tokio mpsc, channels (single process)
   - Single node: Redis Pub/Sub, SQLite queue
   - Distributed: Apache Kafka, RabbitMQ, NATS
   - Cloud: AWS SNS/SQS, Google Pub/Sub
2. กำหนด durability และ delivery guarantees
3. Setup monitoring และ observability
4. สร้าง connection management

### 3. Implement Event Bus

> Goal: สร้าง abstraction และ adapters สำหรับ event bus
> Goal: event bus พร้อม error handling และ resilience

1. สร้าง abstraction layer สำหรับ event bus:
   ```rust
   trait EventBus {
       async fn publish(&self, event: Event) -> Result<()>;
       async fn subscribe(&self, topic: &str) -> Stream<Event>;
   }
   ```
2. Implement concrete adapters สำหรับแต่ละ broker
3. สร้าง error handling และ retry mechanisms
4. Add circuit breaker สำหรับ resilience

### 4. Setup Event Handlers

> Goal: สร้าง handlers ตาม event types พร้อม idempotency
> Goal: consumers process events ได้ถูกต้องและ reliable

1. สร้าง handler registry หรือ dispatcher
2. Implement handlers ตาม event types:
   - Synchronous handlers (quick operations)
   - Asynchronous handlers (background processing)
3. กำหนด handler execution order
4. Implement idempotency สำหรับ handlers

### 5. Configure Event Sourcing (Optional)

> Goal: ตัดสินใจและตั้งค่า event sourcing ถ้าจำเป็น
> Goal: ใช้ event sourcing ได้ถูกต้องเมื่องจำเป็น

1. ตัดสินใจว่าต้องการ event sourcing หรือไม่:
   - Event sourcing: Store events as source of truth
   - Event notification: Events notify state changes
2. สร้าง event store (if needed)
3. Implement projections หรือ read models
4. Setup snapshotting สำหรับ performance

### 6. Add Observability

> Goal: เพิ่ม tracing, logging, และ monitoring สำหรับ event flow
> Goal: เห็น event flow และ failed events ชัดเจน

1. Implement distributed tracing ผ่าน events
2. Setup event logging และ audit trail
3. Create dashboards สำหรับ event flow
4. Add alerting สำหรับ failed events

## Rules

### 1. Event Design

Event Naming
- ใช้ past tense สำหรับ domain events: `OrderPlaced`, `PaymentProcessed`
- ใช้ descriptive names ที่บ่งบอก intent
- หลีกเลี่ยง generic names เช่น `DataChanged`

Event Payload
- รวมข้อมูลที่จำเป็นใน event payload (event-carried state transfer)
- ใช้ event IDs สำหรับ idempotency
- รวม timestamps และ metadata
- หลีกเลี่ยง large payloads (reference แทน if > 1KB)

Event Versioning
- ใช้ semantic versioning สำหรับ event schemas
- Implement schema evolution strategies:
  - Tolerant reader (ignore unknown fields)
  - Schema registry
  - Event migration scripts

### 2. Delivery Guarantees

| Guarantee | Use Case | Implementation |
|-----------|----------|----------------|
| At-most-once | Idempotent ops, metrics | Fire and forget |
| At-least-once | General purpose | Retry with deduplication |
| Exactly-once | Critical financial | Idempotent consumers + deduplication |

Recommendations
- Default to at-least-once delivery
- Implement idempotent consumers
- ใช้ exactly-once เฉพาะเมื่อจำเป็นจริงๆ

### 3. Error Handling

Retry Strategy
- Implement exponential backoff
- กำหนด max retry attempts
- ใช้ dead letter queue (DLQ) สำหรับ failed events
- แยก retryable vs non-retryable errors

Circuit Breaker
- เปิด circuit เมื่อ failure rate สูง
- ปิด circuit หลังจาก recovery
- ใช้ half-open state สำหรับ testing

### 4. Idempotency

Consumer Idempotency
- เก็บ processed event IDs
- ใช้ idempotency keys จาก producers
- Implement deduplication logic
- Set TTL สำหรับ idempotency storage

Example Pattern
```rust
async fn handle_event(event: Event) -> Result<()> {
    if idempotency_store.contains(&event.id).await? {
        return Ok(()); // Already processed
    }

    // Process event
    process(&event).await?;

    // Mark as processed
    idempotency_store.add(event.id).await?;
    Ok(())
}
```

### 5. Eventual Consistency

Handling Inconsistency
- ออกแบบระบบรองรับ temporary inconsistency
- ใช้ sagas หรือ process managers สำหรับ long-running transactions
- Implement compensation actions
- แสดง pending states ใน UI

Saga Pattern
- Orchestration saga: Central coordinator
- Choreography saga: Event-driven coordination
- เลือกตาม complexity และ team preference

### 6. Testing Strategy

Unit Tests
- Test event handlers in isolation
- Mock event bus dependencies
- Test idempotency logic

Integration Tests
- Test producer-consumer pairs
- Verify event serialization/deserialization
- Test error handling paths

End-to-End Tests
- Test complete event flows
- Verify eventual consistency
- Test failure scenarios

### 7. Anti-Patterns

Over-Engineering
- ใช้ event-driven สำหรับ simple CRUD operations
- สร้าง too granular events
- Premature optimization สำหรับ low-scale systems

Design Issues
- Synchronous events (use RPC แทน)
- Circular event dependencies
- Missing error handling
- No observability

## Expected Outcome

- Event-driven system ที่ scalable และ resilient
- Loose coupling ระหว่าง components
- Async processing ที่ reliable
- Clear event contracts และ versioning
- Complete observability ของ event flows
- Path สำหรับ scale และ evolution

## Guide

- ทำ `/follow-modular-monolith` สำหรับ base architecture
- ทำ `/follow-microservices-architecture` สำหรับ distributed event-driven systems
- ทำ `/follow-clean-architecture` สำหรับ event handler structure
