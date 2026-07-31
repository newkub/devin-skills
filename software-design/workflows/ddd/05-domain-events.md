# Implement Domain Events

## Goal

Create domain event system

## Execute

Create domain event system:

```typescript
// Domain event interface
interface IDomainEvent {
  occurredOn: Date;
}

// Domain event
class OrderConfirmedEvent implements IDomainEvent {
  constructor(
    public orderId: string,
    public occurredOn: Date = new Date()
  ) {}
}

// Entity with events
class Order {
  private events: IDomainEvent[] = [];
  
  getEvents(): ReadonlyArray<IDomainEvent> {
    return this.events;
  }
  
  clearEvents(): void {
    this.events = [];
  }
  
  confirm(): void {
    this.status = OrderStatus.Confirmed;
    this.events.push(new OrderConfirmedEvent(this.id));
  }
}

// Event handler
class OrderConfirmedHandler {
  constructor(private emailService: IEmailService) {}
  
  handle(event: OrderConfirmedEvent): void {
    const order = this.orderRepository.getById(event.orderId);
    this.emailService.sendConfirmationEmail(order.customerEmail);
  }
}
```

## Tips

- Events represent something that happened
- Use events to trigger side effects
- Dispatch events after transaction commits
- Keep events simple and focused
