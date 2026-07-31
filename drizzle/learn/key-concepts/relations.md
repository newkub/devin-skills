# Relations

## What are Relations

Relations คือ relationships ระหว่าง tables:
- **One-to-One** - 1:1 relationships
- **One-to-Many** - 1:N relationships
- **Many-to-Many** - N:M relationships

## Defining Relations

```typescript
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  title: text('title').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  author: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));
```
