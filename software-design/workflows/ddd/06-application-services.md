# Create Application Services

## Goal

Implement use case orchestration

## Execute

Implement use case orchestration:

```typescript
class OrderApplicationService {
  constructor(
    private orderRepository: IOrderRepository,
    private productRepository: IProductRepository,
    private eventDispatcher: IDomainEventDispatcher
  ) {}
  
  createOrder(command: CreateOrderCommand): void {
    const order = new Order(command.customerId);
    
    for (const item of command.items) {
      const product = this.productRepository.getById(item.productId);
      order.addItem(product, item.quantity);
    }
    
    this.orderRepository.save(order);
    
    // Dispatch domain events
    for (const event of order.getEvents()) {
      this.eventDispatcher.dispatch(event);
    }
    
    order.clearEvents();
  }
}
```

## Tips

- Application services orchestrate use cases
- One service per use case
- Keep them thin and focused
- Handle transactions here
