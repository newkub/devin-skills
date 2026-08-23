# InstantDB Configuration

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_INSTANT_APP_ID` | App ID for Next.js |
| `VITE_INSTANT_APP_ID` | App ID for Vite |
| `INSTANT_APP_ID` | App ID for vanilla/other |

## Schema Options

- `i.string()` - text field
- `i.boolean()` - boolean field
- `i.date()` - date field
- `i.number()` - number field
- `.unique()` - unique constraint
- `.indexed()` - indexed for queries
- `.optional()` - nullable field

## Permission Rules

```ts
const rules = {
  todos: {
    bind: { isOwner: "auth.id == data.creator" },
    allow: {
      view: "true",
      create: "isOwner",
      update: "isOwner",
      delete: "isOwner",
    },
  },
};
```

## Auth Methods

- Magic codes
- Google OAuth
- Sign in with Apple
- GitHub OAuth
- LinkedIn OAuth
- Clerk
- Firebase Auth

## Advanced Features

- Storage: upload/download files via `$files` entity
- Presence: real-time user activity
- Streams: broadcast large data
- Webhooks: HTTP callbacks
- Admin HTTP API: server-side operations

See https://www.instantdb.com/docs/auth and https://www.instantdb.com/docs/permissions
