# Define Bounded Contexts

## Goal

Identify business boundaries in your domain

## Execute

Identify business boundaries:

```yaml
# Example: E-commerce bounded contexts
bounded_contexts:
  sales:
    entities: [Order, Customer, Payment]
    services: [OrderService, PaymentService]
  
  inventory:
    entities: [Product, Stock, Warehouse]
    services: [InventoryService, StockService]
  
  shipping:
    entities: [Shipment, Delivery, Tracking]
    services: [ShippingService, TrackingService]
```

## Tips

- Each bounded context should have its own language
- Define clear boundaries between contexts
- Map contexts to teams or modules
- Identify shared kernel if needed
