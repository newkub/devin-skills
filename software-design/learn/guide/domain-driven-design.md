# Domain-Driven Design

## Domain-Driven Design (DDD)

### Core Concepts

### Ubiquitous Language

ภาษาที่ใช้ร่วมกันระหว่าง developers และ domain experts:

```typescript
// ✅ Good: Domain language
class Order {
    AddItem(Product product, number quantity) { }
    Confirm() { }
    Ship() { }
    Cancel() { }
}

// ❌ Bad: Technical language
class Order {
    InsertRecord(OrderDto dto) { }
    UpdateStatus(number statusId) { }
}
```

### Bounded Contexts

แบ่ง domain ตาม business boundaries:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   Sales     │  │  Inventory  │  │  Shipping   │
│  Context    │  │   Context   │  │   Context   │
└─────────────┘  └─────────────┘  └─────────────┘
```

**Example**:
- **Sales Context**: Order, Customer, Payment
- **Inventory Context**: Product, Stock, Warehouse
- **Shipping Context**: Shipment, Delivery, Tracking

### Entities vs Value Objects

**Entities**: มี identity และ lifecycle:

```typescript
class Order {
    public string Id { get; } // Identity
    public Date CreatedAt { get; }
    public OrderStatus Status { get; private set; }
    
     Confirm() {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Cannot confirm order");
        Status = OrderStatus.Confirmed;
    }
}
```

**Value Objects**: ไม่มี identity, เท่ากันถ้าค่าเท่ากัน:

```typescript
class Money {
    public decimal Amount { get; }
    public string Currency { get; }
    
    public Money(decimal amount, string currency) {
        if (amount < 0) throw new ArgumentException("Amount cannot be negative");
        Amount = amount;
        Currency = currency;
    }
    
    // Value equality
    public override booleanean Equals(object obj) {
        if (obj is Money other) 
            return Amount == other.Amount && Currency == other.Currency;
        return false;
    }
}
```

### Aggregates

กลุ่ม objects ที่ treat เป็น unit เดียว:

```typescript
// Order Aggregate Root
class Order {
    private OrderItem[] _items = new();
    
    public string Id { get; }
    public IReadOnlyCollection<OrderItem> Items = this.items.AsReadOnly();
    
     AddItem(Product product, number quantity) {
        if (quantity <= 0) throw new ArgumentException("Invalid quantity");
        _items.Add(new OrderItem(product, quantity));
    }
    
    // Invariants enforced by aggregate root
    public decimal Total = this.items.Sum(item => item.Total);
}

class OrderItem {
    // Cannot be accessed directly, only through Order
    numberernal OrderItem(Product product, number quantity) { }
}
```

### Repositories

Abstract data access สำหรับ aggregates:

```typescript
numbererface IOrderRepository {
    Order GetById(string id);
    Save(Order order);
    Delete(Order order);
}

class SqlOrderRepository : OrderRepository {
    private DbContext _context;
    
    public Order GetById(string id) {
        return _context.Orders
            .Include(o => o.Items)
            .FirstOrDefault(o => o.Id == id);
    }
    
     Save(Order order) {
        _context.Orders.Update(order);
        _context.SaveChanges();
    }
}
```

### Domain Events

Events ที่เกิดภายใน domain:

```typescript
// Domain Event
class OrderConfirmedEvent {
    public string OrderId { get; }
    public Date ConfirmedAt { get; }
}

// Entity raises event
class Order {
    private IDomainEvent[] _events = new();
    
     Confirm() {
        Status = OrderStatus.Confirmed;
        _events.Add(new OrderConfirmedEvent(Id, Date.UtcNow));
    }
    
    public IReadOnlyCollection<IDomainEvent> GetEvents() = this.events.AsReadOnly();
}

// Event handler
class OrderConfirmedHandler {
     Handle(OrderConfirmedEvent @event) {
        // Send confirmation email
        // Update inventory
        // Notify shipping
    }
}
```

### Application Services

Orchestrate domain logic:

```typescript
class OrderApplicationService {
    private IOrderRepository _orderRepository;
    private IProductRepository _productRepository;
    
     CreateOrder(CreateOrderCommand command) {
        const order =  new Order(command.CustomerId);
        
        foreach (var item in command.Items) {
            const product =  _productRepository.GetById(item.ProductId);
            order.AddItem(product, item.Quantity);
        }
        
        _orderRepository.Save(order);
    }
}
```

## DDD Patterns

### Strategic Patterns

| Pattern | Description | When to Use |
|---------|-------------|-------------|
| **Bounded Context** | Define boundaries | Large domain with multiple subdomains |
| **Context Mapping** | Define relationships | Multiple bounded contexts |
| **Ubiquitous Language** | Shared language | Communication between devs and experts |

### Tactical Patterns

| Pattern | Description | When to Use |
|---------|-------------|-------------|
| **Entity** | Object with identity | Objects with lifecycle |
| **Value Object** | Immutable value | Objects without identity |
| **Aggregate** | Consistency boundary | Group of related objects |
| **Repository** | Data access abstraction | Persist aggregates |
| **Domain Service** | Stateless logic | Logic not fitting entities |
| **Application Service** | Use case orchestration | Coordinate domain operations |

## Anti-Patterns

### Anemic Domain Model

```typescript
// ❌ Bad: Anemic model - no behavior
class Order {
    public string Id { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }
}

// Logic in service
class OrderService {
     CalculateTotal(Order order) {
        order.Total = order.Items.Sum(i => i.Price * i.Quantity);
    }
}

// ✅ Good: Rich domain model
class Order {
    public string Id { get; }
    public decimal Total => Items.Sum(i => i.Total);
    
     AddItem(Product product, number quantity) {
        // Business logic here
    }
}
```

### God Aggregate

```typescript
// ❌ Bad: Too large aggregate
class Order {
    // 50+ properties
    // Complex invariants
    // Hard to manumberain
}

// ✅ Good: Split numbero smaller aggregates
class Order { }
class OrderItem { }
class Payment { }
class Delivery { }
```

