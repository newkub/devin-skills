# Key Concepts - Scalar

## ภาพรวม

Scalar (Scalar API Designer) is a modern tool for designing, testing, and documenting GraphQL APIs visually.

## Key Features

### Schema Designer

- Visual type editor
- Drag-and-drop fields
- Type relationship mapping
- Real-time preview

### API Playground

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
  }
}
```

### Mock Server

Built-in data mocking based on schema types

## Schema Types

```graphql
# Scalar types
type User {
  id: ID!
  name: String!
  email: String!
  createdAt: DateTime!
  profile: Profile
}

type Post {
  id: ID!
  title: String!
  status: PostStatus!
  author: User!
}
```

## Directives

```graphql
@deprecated(reason: "Use 'status' instead")
@lowercase
@uppercase
@trim
```

## Data Sources

Connect APIs to real backends:

- REST APIs
- GraphQL endpoints
- Databases
- Custom resolvers
