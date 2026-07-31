# Contract-First Development

หลักการ contract-first สำหรับ oRPC

## Define Contract First

กำหนด contract ก่อน implementation:

```typescript
// contracts/user.ts
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
})

export const createUserInput = z.object({
  name: z.string().min(1),
  email: z.string().email()
})
```

## Shared Contracts

ใช้ contracts ร่วมกันระหว่าง server และ client:

```typescript
// shared/contracts.ts
export const userSchema = z.object({ ... })
```

## Input Validation

Validate inputs ด้วย contracts:

```typescript
.input(createUserInput)
```

## Output Validation

Validate outputs ด้วย contracts:

```typescript
.output(userSchema)
```

## Error Contracts

กำหนด error contracts:

```typescript
export const errorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST'
} as const
```

## Contract Testing

ทดสอบ contracts:

```typescript
describe('user contract', () => {
  it('should validate user schema', () => {
    expect(() => userSchema.parse({ ... })).not.toThrow()
  })
})
```

## Contract Versioning

ใช้ versioning สำหรับ contracts:

```typescript
const v1Router = orpc.router({ ... })
const v2Router = orpc.router({ ... })
```
