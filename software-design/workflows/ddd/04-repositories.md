# Implement Repositories

## Goal

Create repository interfaces and implementations

## Execute

Create repository interfaces and implementations:

```typescript
// Repository interface
interface IOrderRepository {
  getById(id: string): Order;
  save(order: Order): void;
  delete(order: Order): void;
}

// SQL implementation
class SqlOrderRepository implements IOrderRepository {
  constructor(private context: DbContext) {}
  
  getById(id: string): Order {
    return this.context.orders
      .find(o => o.id === id);
  }
  
  save(order: Order): void {
    const existing = this.context.orders.find(o => o.id === order.id);
    
    if (!existing) {
      this.context.orders.push(order);
    } else {
      Object.assign(existing, order);
    }
    
    this.context.saveChanges();
  }
  
  delete(order: Order): void {
    const index = this.context.orders.indexOf(order);
    if (index > -1) {
      this.context.orders.splice(index, 1);
    }
    this.context.saveChanges();
  }
}
```

## Tips

- Repository interface belongs to domain
- Implementation belongs to infrastructure
- Use repositories for aggregate roots only
- Hide data access details
