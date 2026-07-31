# Create Value Objects

## Goal

Implement immutable value objects

## Execute

Implement immutable value objects:

```typescript
class Money {
  constructor(
    public amount: number,
    public currency: string = 'USD'
  ) {
    if (amount < 0)
      throw new Error('Amount cannot be negative');
    
    if (!currency)
      throw new Error('Currency is required');
  }
  
  add(other: Money): Money {
    if (this.currency !== other.currency)
      throw new Error('Cannot add different currencies');
    
    return new Money(this.amount + other.amount, this.currency);
  }
  
  equals(obj: any): boolean {
    if (obj instanceof Money)
      return this.amount === obj.amount && this.currency === obj.currency;
    return false;
  }
  
  hashCode(): number {
    return this.amount + this.currency.length;
  }
}
```

## Tips

- Value objects should be immutable
- Override equals and hashCode
- No identity, only value equality
- Use for domain concepts without identity
