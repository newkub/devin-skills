# Quick Start - Scalar

## สร้าง Schema ใหม่

1. Click "New Schema"
2. Choose template or blank
3. Add types
4. Test in Playground

## Add a Type

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: DateTime!
}
```

## Add Fields

Click "+" to add fields:

| Field | Type | Required |
|-------|------|----------|
| id | ID | Yes |
| name | String | Yes |
| email | String | Yes |
| bio | String | No |

## Add Query Resolver

```graphql
type Query {
  user(id: ID!): User
  users: [User!]!
}
```

## Test Query

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

Variables:
```json
{
  "id": "1"
}
```

## Generate Documentation

Click "Generate Docs" to create API reference
