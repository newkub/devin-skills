# InstantDB Core API

## Init

```ts
import { init } from "@instantdb/react";
import schema from "../instant.schema";

export const db = init({
  appId: process.env.NEXT_PUBLIC_INSTANT_APP_ID!,
  schema,
  useDateObjects: true,
});
```

## Schema

```ts
import { i } from "@instantdb/core";

const schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
    }),
    todos: i.entity({
      text: i.string(),
      done: i.boolean(),
      createdAt: i.date(),
    }),
  },
  links: {
    todosOwner: {
      forward: { on: "todos", has: "one", label: "owner", onDelete: "cascade" },
      reverse: { on: "$users", has: "many", label: "todos" },
    },
  },
  rooms: {},
});

export default schema;
```

## Query

```ts
const { isLoading, error, data } = db.useQuery({ todos: {} });
const { todos } = data || {};
```

## Transaction

```ts
import { id } from "@instantdb/react";

// Create
db.transact(db.tx.todos[id()].update({ text: "Buy milk", done: false }));

// Update
db.transact(db.tx.todos[todo.id].update({ done: true }));

// Delete
db.transact(db.tx.todos[todo.id].delete());

// Batch
db.transact([db.tx.todos[id1].update({ ... }), db.tx.todos[id2].delete()]);
```

## Type Helpers

```ts
import type { InstaQLEntity } from "@instantdb/react";
type Todo = InstaQLEntity<typeof schema, "todos">;
```

For full API see https://www.instantdb.com/docs
