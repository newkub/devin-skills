# Design Aggregates

## Goal

Define aggregate roots and boundaries

## Execute

Define aggregate roots and boundaries:

```typescript
// Order Aggregate Root
class Order {
  private items: OrderItem[] = [];
  
  constructor(
    public id: string,
    public customerId: string,
    private status: OrderStatus = OrderStatus.Pending
  ) {}
  
  get Items(): ReadonlyArray<OrderItem> {
    return this.items;
  }
  
  addItem(product: Product, quantity: number): void {
    if (this.status !== OrderStatus.Pending)
      throw new Error('Cannot add items to confirmed order');
    
    if (quantity <= 0)
      throw new Error('Quantity must be positive');
    
    this.items.push(new OrderItem(product, quantity));
  }
  
  confirm(): void {
    if (this.status !== OrderStatus.Pending)
      throw new Error('Order already confirmed');
    
    if (this.items.length === 0)
      throw new Error('Cannot confirm empty order');
    
    this.status = OrderStatus.Confirmed;
  }
  
  get total(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }
}

// OrderItem - part of Order aggregate
class OrderItem {
  constructor(
    public productId: string,
    public productName: string,
    public quantity: number,
    public unitPrice: number
  ) {}
  
  get total(): number {
    return this.quantity * this.unitPrice;
  }
}
```

## Tips

- Aggregate root controls access to internal entities
- Ensure invariants are maintained
- Keep aggregates small and focused
- One aggregate per transaction
