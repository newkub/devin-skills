# Form Validation

## TanStack Form Validation

TanStack Form ใช้ Zod สำหรับ validation:
```typescript
import { createForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';

const form = createForm({
  validatorAdapter: zodValidator(),
  defaultValues: { email: '', password: '' },
  onSubmit: async ({ value }) => {
    // submit logic
  },
});
```

## Type-Safe Forms

- Schema ถูก infer จาก Zod schema
- Form values ถูก type-safe
- Error messages ถูก type-safe

## Validation Strategies

- **Client-side** - validate ก่อน submit
- **Server-side** - validate บน server
- **Async validation** - validate async fields
