# Test Aggregates

## Goal

Write tests for aggregate invariants

## Execute

Write tests for aggregate invariants:

```typescript
// Order_AddItem_ShouldAddItemToOrder
const order = new Order(customerId);
const product = new Product('Test Product', 10.00);

order.addItem(product, 2);

assert.strictEqual(order.Items.length, 1);
assert.strictEqual(order.total, 20.00);

// Order_Confirm_ShouldThrowWhenEmpty
const order = new Order(customerId);

assert.throws(() => order.confirm());

// Order_Confirm_ShouldChangeStatus
const order = new Order(customerId);
const product = new Product('Test Product', 10.00);
order.addItem(product, 1);

order.confirm();

assert.strictEqual(order.status, OrderStatus.Confirmed);
```

## Tips

- Test all invariants
- Test edge cases
- Test error conditions
- Keep tests focused
