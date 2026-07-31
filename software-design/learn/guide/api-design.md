# API Design

## RESTful API Design

### Resource Naming

Use nouns, not verbs:

```http
# ✅ Good: Resource-based
GET    /users
POST   /users
GET    /users/{id}
PUT    /users/{id}
DELETE /users/{id}

# ❌ Bad: Action-based
GET    /getUsers
POST   /createUser
GET    /getUserById
PUT    /updateUser
DELETE /deleteUser
```

### HTTP Methods

Use appropriate HTTP methods:

| Method | Operation | Idempotent | Safe |
|--------|-----------|------------|------|
| **GET** | Read resource | Yes | Yes |
| **POST** | Create resource | No | No |
| **PUT** | Replace resource | Yes | No |
| **PATCH** | Update resource | No | No |
| **DELETE** | Delete resource | Yes | No |

### URL Structure

Use consistent hierarchy:

```http
# ✅ Good: Hierarchical
GET    /users/{id}/orders
GET    /users/{id}/orders/{orderId}
POST   /users/{id}/orders
GET    /orders/{id}/items

# ❌ Bad: Flat
GET    /userOrders
GET    /userOrderItems
POST   /createUserOrder
```

### Status Codes

Use appropriate status codes:

| Code | Category | When to Use |
|------|----------|-------------|
| **200** | Success | GET, PUT, DELETE successful |
| **201** | Created | POST successful |
| **204** | No Content | DELETE successful, PUT with no body |
| **400** | Bad Request | Invalid input |
| **401** | Unauthorized | Missing or invalid auth |
| **403** | Forbidden | Authenticated but not authorized |
| **404** | Not Found | Resource doesn't exist |
| **409** | Conflict | Resource conflict (duplicate) |
| **422** | Unprocessable Entity | Validation error |
| **500** | Server Error | Unexpected server error |

### Request/Response Format

Use consistent JSON structure:

```json
// ✅ Good: Consistent structure
{
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}

// ❌ Bad: nconsistent
{
  "user_id": "123",
  "userName": "John Doe",
  "user_email": "john@example.com"
}
```

### Pagination

Use standard pagination:

```http
GET /users?page=1&limit=20&sort=name&order=asc

Response:
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Filtering and Sorting

Use query parameters:

```http
# Filtering
GET /users?status=active&role=admin

# Sorting
GET /users?sort=name&order=asc

# Combined
GET /users?status=active&sort=name&order=asc&page=1&limit=20
```

### Versioning

Version your APIs:

```http
# URL versioning
GET /api/v1/users
GET /api/v2/users

# Header versioning
GET /api/users
Headers: API-Version: 1

# Query versioning
GET /api/users?version=1
```

## GraphQL API Design

### Schema Design

Define clear types:

```graphql
type User {
  id: D!
  name: string!
  email: string!
  orders: [Order!]!
}

type Order {
  id: D!
  total: number!
  items: [OrderItem!]!
  createdAt: Date!
}

type Query {
  user(id: D!): User
  users(limit: nt, offset: nt): [User!]!
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: D!, input: UpdateUserInput!): User!
}
```

### Naming Conventions

Use consistent naming:

```graphql
# ✅ Good: Descriptive
type User {
  id: D!
  fullName: string!
  emailAddress: string!
}

# ❌ Bad: Abbreviated
type User {
  id: D!
  nm: string!
  eml: string!
}
```

### Error Handling

Use proper error types:

```graphql
type MutationError {
  field: string!
  message: string!
  code: string!
}

type MutationResponse {
  success: booleaneanean!
  errors: [MutationError!]!
  data: User
}
```

## API Security

### Authentication

Use standard authentication:

```http
# JWT Bearer Token
GET /api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

# API Key
GET /api/users
X-API-Key: your-api-key-here
```

### Rate Limiting

Implement rate limiting:

```http
# Rate limit headers
GET /api/users
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1609459200

# 429 Too Many Requests
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

### Input Validation

Validate all inputs:

```typescript
class CreateUserRequest {
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    
    [Required]
    [MinLength(2)]
    [MaxLength(50)]
    public string Name { get; set; }
    
    [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$")]
    public string Password { get; set; }
}
```

## API Documentation

### OpenAPI/Swagger

Document your API:

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get all users
      parameters:
        - name: page
          in: query
          schema:
            type: nteger
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
```

### API Examples

Provide clear examples:

```http
# Request Example
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

# Response Example
201 Created
Location: /api/users/123

{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

