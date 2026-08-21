# Type Safety with Zod

## Why Zod?

Zod ให้:
- **Type-safe Props** - Validate props ที่ runtime
- **Auto-completion** - TypeScript auto-completion
- **Schema Validation** - Validate data structures
- **Error Messages** - Clear error messages

## Define Schema

ใช้ Zod schema สำหรับ props:

```tsx
import { z } from 'zod';
import { Composition } from 'remotion';

const schema = z.object({
  title: z.string(),
  color: z.string(),
  duration: z.number(),
});

<Composition
  id="MyVideo"
  component={MyVideo}
  schema={schema}
  defaultProps={{
    title: 'Hello World',
    color: '#ffffff',
    duration: 150,
  }}
/>
```

## Type Inference

Infer types จาก schema:

```tsx
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  color: z.string(),
});

type VideoProps = z.infer<typeof schema>;

const MyVideo: React.FC<VideoProps> = ({ title, color }) => {
  // TypeScript knows title is string
  // TypeScript knows color is string
};
```

## Common Schemas

### String

```tsx
const schema = z.object({
  title: z.string(),
  description: z.string().optional(),
});
```

### Number

```tsx
const schema = z.object({
  duration: z.number(),
  fps: z.number().min(1).max(60),
});
```

### Boolean

```tsx
const schema = z.object({
  enabled: z.boolean(),
});
```

### Enum

```tsx
const schema = z.object({
  theme: z.enum(['light', 'dark']),
});
```

### Array

```tsx
const schema = z.object({
  items: z.array(z.string()),
});
```

### Object

```tsx
const schema = z.object({
  config: z.object({
    width: z.number(),
    height: z.number(),
  }),
});
```

### Union

```tsx
const schema = z.object({
  content: z.union([z.string(), z.number()]),
});
```

## Advanced Schemas

### Custom Validation

```tsx
const schema = z.object({
  hexColor: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid hex color'),
});
```

### Transform

```tsx
const schema = z.object({
  percentage: z.string().transform((val) => parseFloat(val)),
});
```

### Default Values

```tsx
const schema = z.object({
  title: z.string().default('Hello'),
  color: z.string().default('#ffffff'),
});
```

## Default Props

ใช้ defaultProps สำหรับ default values:

```tsx
<Composition
  id="MyVideo"
  component={MyVideo}
  schema={schema}
  defaultProps={{
    title: 'Hello World',
    color: '#ffffff',
    duration: 150,
  }}
/>
```

## Runtime Validation

Zod validate props ที่ runtime:

```tsx
// ถ้า props ไม่ match schema
// Remotion จะ throw error พร้อม message ที่ชัดเจน
```

## Type-safe Components

สร้าง components ที่ type-safe:

```tsx
import { z } from 'zod';

const schema = z.object({
  title: z.string(),
  color: z.string(),
});

type VideoProps = z.infer<typeof schema>;

export const MyVideo: React.FC<VideoProps> = ({ title, color }) => {
  return (
    <div style={{ color }}>
      <h1>{title}</h1>
    </div>
  );
};
```

## Nested Schemas

ใช้ nested schemas สำหรับ complex data:

```tsx
const schema = z.object({
  title: z.string(),
  config: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number(),
  }),
  items: z.array(
    z.object({
      text: z.string(),
      color: z.string(),
    })
  ),
});
```

## Optional Fields

ใช้ optional สำหรับ fields ที่ไม่จำเป็น:

```tsx
const schema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
});
```

## Nullable Fields

ใช้ nullable สำหรับ fields ที่สามารถเป็น null:

```tsx
const schema = z.object({
  title: z.string(),
  subtitle: z.string().nullable(),
});
```

## Best Practices

1. **Always Use Schema** - ใช้ Zod schema สำหรับทุก composition
2. **Infer Types** - Infer types จาก schema
3. **Default Props** - ให้ defaultProps เสมอ
4. **Validate Input** - Validate input data ก่อนส่งเข้า composition
5. **Clear Error Messages** - ใช้ custom error messages
6. **Optional Fields** - ใช้ optional สำหรับ fields ที่ไม่จำเป็น
7. **Nested Schemas** - ใช้ nested schemas สำหรับ complex data
