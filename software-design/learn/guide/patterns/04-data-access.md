# Data Access Patterns

## Repository Pattern

**Intent**: Mediate between domain and data mapping

**When to use**:
- Need to separate domain logic from data access
- Want to test domain logic without database

**Example**:

```typescript
interface IUserRepository {
  getById(id: string): User;
  getAll(): User[];
  add(user: User): void;
  update(user: User): void;
  delete(id: string): void;
}

class SqlUserRepository implements IUserRepository {
  constructor(private context: DbContext) {}
  
  getById(id: string): User {
    return this.context.users.find(id);
  }
  
  getAll(): User[] {
    return this.context.users;
  }
  
  add(user: User): void {
    this.context.users.push(user);
  }
  
  update(user: User): void {
    const index = this.context.users.findIndex(u => u.id === user.id);
    if (index > -1) {
      this.context.users[index] = user;
    }
  }
  
  delete(id: string): void {
    const index = this.context.users.findIndex(u => u.id === id);
    if (index > -1) {
      this.context.users.splice(index, 1);
    }
  }
}
```

## Unit of Work Pattern

**Intent**: Maintain list of objects affected by transaction

**When to use**:
- Need to commit multiple operations as single transaction
- Want to track changes

**Example**:

```typescript
interface IUnitOfWork {
  users: IUserRepository;
  orders: IOrderRepository;
  saveChanges(): number;
  dispose(): void;
}

class UnitOfWork implements IUnitOfWork {
  constructor(private context: DbContext) {}
  
  get users(): IUserRepository {
    return new SqlUserRepository(this.context);
  }
  
  get orders(): IOrderRepository {
    return new SqlOrderRepository(this.context);
  }
  
  saveChanges(): number {
    return this.context.saveChanges();
  }
  
  dispose(): void {
    this.context.dispose();
  }
}

// Usage
const uow = new UnitOfWork(context);
try {
  const user = uow.users.getById(userId);
  const order = new Order(user);
  uow.orders.add(order);
  uow.saveChanges();
} finally {
  uow.dispose();
}
```
