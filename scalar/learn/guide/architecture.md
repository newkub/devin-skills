# Architecture

สถาปัตยกรรมของ Scalar API Designer และวิธีการจัดระเบียบโปรเจกต์

## Scalar Architecture

### Core Components

Scalar ประกอบด้วย components หลักต่อไปนี้:

1. **Visual Editor** - ตัวออกแบบ schema แบบ visual
2. **Mock Server** - Server สำหรับทดสอบ API
3. **Documentation Generator** - สร้างเอกสารอัตโนมัติ
4. **CLI Tools** - Command-line interface สำหรับ automation
5. **Workspace Manager** - จัดการโปรเจกต์และ collaboration

### Data Flow

```
┌─────────────┐
│   GraphQL   │
│   Schema    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Visual     │
│  Editor     │
└──────┬──────┘
       │
       ├─────────────┬─────────────┐
       ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌─────────────┐
│   Mock   │  │   Docs   │  │  Validation │
│  Server  │  │ Generator│  │   Engine    │
└──────────┘  └──────────┘  └─────────────┘
```

## Project Structure

### Standard Structure

โครงสร้างโปรเจกต์ Scalar ที่แนะนำ

```text
my-api/
├── scalar.config.yaml
├── schema/
│   ├── base.graphql
│   ├── types.graphql
│   └── queries.graphql
├── mock/
│   ├── rules.yaml
│   └── resolvers.js
├── docs/
│   ├── configuration.md
│   └── examples.md
└── .scalar/
    └── cache/
```

### Monorepo Structure

สำหรับโปรเจกต์ขนาดใหญ่ที่มีหลาย services

```text
monorepo/
├── services/
│   ├── users/
│   │   ├── schema.graphql
│   │   └── scalar.config.yaml
│   └── posts/
│       ├── schema.graphql
│       └── scalar.config.yaml
├── shared/
│   └── types.graphql
└── scalar.config.yaml
```

## Schema Organization

### Schema Composition

แยก schema ตาม domain และ responsibility

```graphql
# types.graphql - ประเภทข้อมูลทั่วไป
scalar DateTime
scalar JSON

# users.graphql - domain: users
type User {
  id: ID!
  name: String!
}

# posts.graphql - domain: posts
type Post {
  id: ID!
  author: User!
}
```

### Schema Stitching

รวม schemas หลายๆ อันเข้าด้วยกัน

```yaml
# scalar.config.yaml
schema:
  sources:
    - file: "./schema/users.graphql"
    - file: "./schema/posts.graphql"
    - file: "./schema/comments.graphql"
```

## Mock Architecture

### Mock Data Generation

Mock server สร้าง data ตาม rules ที่กำหนด

```yaml
mock:
  strategy: "smart"
  persistence: "memory"
  rules:
    - type: User
      count: 10
      fields:
        id: uuid
        name: firstName
```

### Custom Resolvers

ใช้ custom resolvers สำหรับ logic ที่ซับซ้อน

```javascript
export default {
  Query: {
    search: (_, { query }) => {
      return database.search(query);
    },
  },
};
```

## Documentation Architecture

### Documentation Sources

เอกสารสามารถมาจากหลายแหล่ง

```yaml
documentation:
  sources:
    - type: schema
      path: "./schema.graphql"
    - type: markdown
      path: "./docs/**/*.md"
    - type: examples
      path: "./examples/*.graphql"
```

### Documentation Output

สร้างเอกสารในรูปแบบต่างๆ

```yaml
documentation:
  output:
    - format: html
      path: "./docs/html"
    - format: json
      path: "./docs/schema.json"
```

## Integration Architecture

### API Gateway Integration

เชื่อมต่อ Scalar กับ API Gateway

```yaml
integration:
  gateway:
    type: apollo
    endpoint: "https://api.example.com/graphql"
    headers:
      Authorization: "Bearer ${API_KEY}"
```

### Version Control Integration

ติดตามการเปลี่ยนแปลง schema ผ่าน Git

```yaml
git:
  hooks:
    pre-commit: "scalar validate"
    pre-push: "scalar test"
```

## Best Practices

- แยก schema ตาม domain และ responsibility
- ใช้ schema composition สำหรับโปรเจกต์ขนาดใหญ่
- จัดระเบียบ mock rules ตาม type
- Document สถาปัตยกรรมและ decisions
- ใช้ version control สำหรับทุก configuration
- Test mock data ก่อนใช้งานจริง
