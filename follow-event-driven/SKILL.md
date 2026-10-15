---
name: follow-event-driven
description: Implement Event-Driven Architecture for async workflows and loose coupling
argument-hint: "[scope]"
related:
  - deep-review
  - improve
---

## Goal

Implement an Event-Driven Architecture that supports async workflows, scalability, and loose coupling

## Scope

Use for designing and implementing an Event-Driven Architecture for async workflows, loose coupling, and scalability

- Design the event model and message broker
- Build the event bus, handlers, and consumers
- Define delivery guarantees, idempotency, and error handling
- Support event sourcing and observability

## Execute

### 1. Design Event Model

> Goal: design the event model and event catalog

1. Identify key business events:
   - Domain events (business facts)
   - Integration events (cross-system)
   - Notification events (alerts, updates)
2. Define the event schema and versioning strategy
3. Create an event catalog or registry
4. Identify event producers and consumers

### 2. Choose Message Broker

> Goal: choose the message broker based on scalability and delivery requirements

1. Choose the message broker based on requirements:
   - In-memory: Tokio mpsc, channels (single process)
   - Single node: Redis Pub/Sub, SQLite queue
   - Distributed: Apache Kafka, RabbitMQ, NATS
   - Cloud: AWS SNS/SQS, Google Pub/Sub
2. Define durability and delivery guarantees
3. Set up monitoring and observability
4. Build connection management

### 3. Implement Event Bus

> Goal: build the abstraction and adapters for the event bus

1. Build an abstraction layer for the event bus:
   ```rust
   trait EventBus {
       async fn publish(&self, event: Event) -> Result<()>;
       async fn subscribe(&self, topic: &str) -> Stream<Event>;
   }
   ```
2. Implement concrete adapters for each broker
3. Build error handling and retry mechanisms
4. Add a circuit breaker for resilience

### 4. Setup Event Handlers

> Goal: build handlers by event type with idempotency

1. Build a handler registry or dispatcher
2. Implement handlers by event type:
   - Synchronous handlers (quick operations)
   - Asynchronous handlers (background processing)
3. Define handler execution order
4. Implement idempotency for handlers

### 5. Configure Event Sourcing (Optional)

> Goal: decide and configure event sourcing when needed

1. Decide whether event sourcing is required:
   - Event sourcing: Store events as source of truth
   - Event notification: Events notify state changes
2. Create an event store (if needed)
3. Implement projections or read models
4. Set up snapshotting for performance

### 6. Add Observability

> Goal: add tracing, logging, and monitoring for the event flow

1. Implement distributed tracing across events
2. Set up event logging and an audit trail
3. Create dashboards for the event flow
4. Add alerting for failed events

## Rules

### 1. Event Design

Event Naming
- Use past tense for domain events: `OrderPlaced`, `PaymentProcessed`
- Use descriptive names that convey intent
- Avoid generic names like `DataChanged`

Event Payload
- Include the necessary data in the event payload (event-carried state transfer)
- Use event IDs for idempotency
- Include timestamps and metadata
- Avoid large payloads (use references if > 1KB)

Event Versioning
- Use semantic versioning for event schemas
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
- Use exactly-once only when truly necessary

### 3. Error Handling

Retry Strategy
- Implement exponential backoff
- Define max retry attempts
- Use a dead letter queue (DLQ) for failed events
- Separate retryable vs non-retryable errors

Circuit Breaker
- Open the circuit when the failure rate is high
- Close the circuit after recovery
- Use a half-open state for testing

### 4. Idempotency

Consumer Idempotency
- Store processed event IDs
- Use idempotency keys from producers
- Implement deduplication logic
- Set a TTL for idempotency storage

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
- Design the system to tolerate temporary inconsistency
- Use sagas or process managers for long-running transactions
- Implement compensation actions
- Show pending states in the UI

Saga Pattern
- Orchestration saga: Central coordinator
- Choreography saga: Event-driven coordination
- Choose based on complexity and team preference

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
- Using event-driven for simple CRUD operations
- Creating too-granular events
- Premature optimization for low-scale systems

Design Issues
- Synchronous events (use RPC instead)
- Circular event dependencies
- Missing error handling
- No observability

## Expected Outcome

- A scalable and resilient event-driven system
- Loose coupling between components
- Reliable async processing
- Clear event contracts and versioning
- Complete observability of event flows
- A path for scale and evolution

## Guide

- Run `/deep-review` for the base architecture
- Existing event system findings (schemas, ordering, idempotency, DLQ) → `/improve events`
- Run `/deep-review` for distributed event-driven systems
- Run `/deep-review` for event handler structure
