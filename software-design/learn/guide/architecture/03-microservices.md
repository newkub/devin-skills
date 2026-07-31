# Microservices Architecture

## Overview

```
┌─────────┐  ┌─────────┐  ┌─────────┐
│ Service │  │ Service │  │ Service │
│    A    │  │    B    │  │    C    │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┴────────────┘
                  │
         ┌────────┴────────┐
         │   API Gateway   │
         └─────────────────┘
```

## Components

| Component | Description |
|-----------|-------------|
| **API Gateway** | Single entry point, routing, authentication |
| **Service Discovery** | Dynamic service registration |
| **Message Broker** | Async communication between services |
| **Database per Service** | Each service has its own database |

## Communication Patterns

**Synchronous (REST/gRPC)**:
```typescript
// Service A calls Service B
class OrderService {
  constructor(private httpClient: HttpClient) {}
  
  async createOrder(order: Order): Promise<void> {
    // Call inventory service
    const response = await this.httpClient.post(
      'http://inventory-service/check',
      JSON.stringify(order)
    );
  }
}
```

**Asynchronous (Message Queue)**:
```typescript
// Service A publishes event
class OrderService {
  constructor(private messageBus: IMessageBus) {}
  
  async createOrder(order: Order): Promise<void> {
    await this.messageBus.publish(new OrderCreatedEvent(order));
  }
}

// Service B subscribes to event
class InventoryService {
  @Subscribe()
  async handle(event: OrderCreatedEvent): Promise<void> {
    // Update inventory
  }
}
```
