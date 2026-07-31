# Configuration

การตั้งค่า Scalar API Designer สำหรับการออกแบบและจัดการ GraphQL APIs

## Scalar Configuration

### การตั้งค่าโปรเจกต์

Scalar รองรับการตั้งค่าผ่านไฟล์ configuration และ environment variables

```yaml
# scalar.config.yaml
version: "1.0"
project:
  name: "my-api"
  description: "My GraphQL API"
  schema: "./schema.graphql"
```

### Environment Variables

ตั้งค่า environment variables สำหรับ Scalar

```bash
SCALAR_API_KEY=your-api-key
SCALAR_WORKSPACE=your-workspace-id
SCALAR_ENVIRONMENT=production
```

## Schema Configuration

### GraphQL Schema

กำหนด schema หลักสำหรับโปรเจกต์

```graphql
# schema.graphql
type Query {
  users: [User]
  user(id: ID!): User
}

type User {
  id: ID!
  name: String!
  email: String!
}
```

### Schema Extensions

ใช้ schema extensions สำหรับขยาย schema ที่มีอยู่

```graphql
extend type Query {
  posts: [Post]
}

type Post {
  id: ID!
  title: String!
  content: String!
}
```

## Mock Server Configuration

### Mock Data Rules

กำหนด rules สำหรับการสร้าง mock data

```yaml
mock:
  enabled: true
  rules:
    - type: User
      fields:
        id: uuid
        name: firstName
        email: email
```

### Custom Resolvers

สร้าง custom resolvers สำหรับ mock server

```javascript
// scalar.mock.js
export default {
  User: {
    fullName: (parent) => `${parent.firstName} ${parent.lastName}`,
  },
};
```

## Documentation Configuration

### Documentation Theme

ตั้งค่า theme สำหรับเอกสาร

```yaml
documentation:
  theme: light
  branding:
    logo: "./logo.png"
    colors:
      primary: "#3b82f6"
      secondary: "#6366f1"
```

### Navigation

กำหนด navigation structure สำหรับเอกสาร

```yaml
documentation:
  navigation:
    - title: "Getting Started"
      items:
        - "installation"
        - "quick-start"
    - title: "API Reference"
      items:
        - "queries"
        - "mutations"
```

## Integration Configuration

### Git Integration

ตั้งค่าการเชื่อมต่อกับ Git

```yaml
git:
  enabled: true
  remote: "https://github.com/user/repo"
  branch: "main"
```

### CI/CD Integration

ตั้งค่าการทำงานร่วมกับ CI/CD pipelines

```yaml
ci:
  provider: github
  workflow: .github/workflows/scalar.yml
```

## Best Practices

- ใช้ environment variables สำหรับ sensitive data
- แยก configuration ตาม environment (dev, staging, prod)
- Version control configuration files
- Document custom configuration options
- Test configuration ก่อน deploy
