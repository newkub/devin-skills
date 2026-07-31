# Distributed Systems

## Consistency Models

**Strong Consistency**: All reads return latest write

**Eventual Consistency**: Reads may return stale data

**Causal Consistency**: Causally related operations seen in order

**Example**:

```typescript
// Strong consistency (immediate)
user.Name = "John";
const name = user.Name; // Returns "John"

// Eventual consistency (delayed)
user.Name = "John";
await Task.Delay(100);
const name = user.Name; // May return old value
```

## Distributed Transactions

**Two-Phase Commit (2PC)**:

```
Phase 1: Prepare
┌──────────┐     ┌──────────┐     ┌──────────┐
│Coordinator│────→│ Database │────→│ Database │
└──────────┘     └──────────┘     └──────────┘
                 Can commit?      Can commit?
                    ↓                ↓
                 Yes              Yes

Phase 2: Commit
┌──────────┐     ┌──────────┐     ┌──────────┐
│Coordinator│────→│ Database │────→│ Database │
└──────────┘     └──────────┘     └──────────┘
                 Commit          Commit
```

**Saga Pattern**:

```typescript
class OrderSaga {
  public async Execute(order: Order): Promise<void> {
    try {
      await CreateOrder(order);
      await ReserveInventory(order);
      await ProcessPayment(order);
      await ConfirmOrder(order);
    }
    catch (ex) {
      await Compensate(order);
    }
  }
  
  private async Compensate(order: Order): Promise<void> {
    await CancelPayment(order);
    await ReleaseInventory(order);
    await CancelOrder(order);
  }
}
```

## Message Queues

**Use Cases**:
- Async processing
- Decoupling services
- Load leveling

**Example**:

```typescript
// Producer
class OrderService {
  constructor(private messageBus: IMessageBus) {}
  
  public async CreateOrder(order: Order): Promise<void> {
    await repository.Save(order);
    await messageBus.PublishAsync(new OrderCreatedEvent(order));
  }
}

// Consumer
class InventoryService {
  @Subscribe("order.created")
  public async Handle(event: OrderCreatedEvent): Promise<void> {
    await ReserveInventory(event.Order);
  }
}
```
