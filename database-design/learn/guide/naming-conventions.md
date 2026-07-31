# Naming Conventions

## Table Names

- Use plural nouns: `users`, `orders`
- Use snake_case: `user_profiles`, `order_items`
- Be descriptive: `customer_orders`, not `co`

## Column Names

- Use snake_case: `first_name`, `created_at`
- Be descriptive: `user_id`, not `uid`
- Use consistent prefixes: `user_`, `order_`

## Index Names

- Prefix with `idx_`: `idx_users_email`
- Include table name: `idx_orders_user_date`

## Example

```sql
CREATE TABLE customer_orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_date TIMESTAMP DEFAULT NOW(),
    total_amount DECIMAL(10,2) CHECK (total_amount >= 0),
    status VARCHAR(20) DEFAULT 'pending'
);

CREATE INDEX idx_customer_orders_customer ON customer_orders(customer_id);
CREATE INDEX idx_customer_orders_date ON customer_orders(order_date);
```
