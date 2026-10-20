# Use Case — Relational Queries with `db.query`

> Read a nested object graph in one query instead of hand-writing joins, using the relations already declared on the schema. Source: https://orm.drizzle.team/docs/rqb (accessed 2026-10-20)

## 1. Declare the relations once

```ts
import { relations } from "drizzle-orm";
import { comments, posts, users } from "./tables";

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, { fields: [posts.authorId], references: [users.id] }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
}));
```

Relations are metadata, not columns: they do not add foreign keys and do not change the migration. The `fields`/`references` pair must match an actual FK, or the join silently returns nothing.

Pass the tables with relations into `drizzle({ schema })` — without that, `db.query` does not exist on the client.

## 2. Query with `with`

```ts
const feed = await db.query.posts.findMany({
  columns: { id: true, title: true, publishedAt: true },
  with: {
    author: { columns: { id: true, name: true } },
    comments: {
      columns: { id: true, body: true },
      orderBy: (c, { desc }) => [desc(c.createdAt)],
      limit: 3,
    },
  },
  orderBy: (p, { desc }) => [desc(p.publishedAt)],
  limit: 20,
});
```

`columns` narrows the payload before it leaves the database. Selecting whole rows and stripping fields in JS is the usual cause of a 300KB page payload.

Nested `ordinal`/`limit` run per parent in the generated query strategy, so `limit: 3` means three comments per post, not three total.

## 3. Filter at the top level, not after

```ts
const drafts = await db.query.posts.findMany({
  where: (p, { and, eq, isNull }) => and(eq(p.authorId, userId), isNull(p.publishedAt)),
  with: { author: true },
});
```

`where` receives the table plus the operators, so the callback stays typed and composable. Conditions on a nested relation belong to that relation's `where`, not to `with`.

Returning the whole author row here is deliberate — a single post page needs it. The feed above narrows instead.

## 4. Verify

1. `/run-typecheck` — `feed[0].comments[0].body` is typed; a typo in the relation name fails
2. Enable `logger: true` for one run — confirm the number of statements, not one per row
3. `/run-test` — a post with no comments returns `comments: []`, not `undefined`
4. `/deep-test database` — `EXPLAIN` the generated SQL; the FK columns must be indexed

## Pitfalls

- Using `db.query` without passing `schema` to `drizzle()`, then wondering why the API is missing.
- Declaring `relations()` without matching FKs, which produces empty arrays instead of an error.
- Fetching `with: { comments: true }` for a list page and loading every comment for every post.
- Adding `where` inside `with` for a top-level filter — it filters the children, not the parents.
- Assuming `limit` on a nested relation limits the total rows.

## Related

- `references/apis.md`
- `best-practices/drizzle.md`
- `usecases/schema-and-relations.md`
- `usecases/driver-setup-and-client.md`
