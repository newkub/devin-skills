# Best Practices - Scalar

## การออกแบบ Schema

### Naming Conventions

```graphql
# Types: PascalCase
type UserAccount {}
type ProductReview {}

# Fields: camelCase
type User {
  firstName: String!
  lastName: String!
  emailAddress: String!
}

# Mutations: verbNoun
type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): Boolean!
}
```

### Type Organization

```graphql
# 1. Define enums first
enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

# 2. Input types
input CreateUserInput {
  name: String!
  email: String!
}

# 3. Object types
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}
```

## API Design

### Pagination

Use cursor-based pagination:

```graphql
type Connection {
  edges: [Edge!]!
  pageInfo: PageInfo!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

### Error Handling

```graphql
type Mutation {
  createUser(input: CreateUserInput!): CreateUserResult!
}

union CreateUserResult = User | UserError
```

## Versioning

### Approach

1. Additive changes first
2. Deprecate before removing
3. Document breaking changes
4. Use version prefixes in URLs
