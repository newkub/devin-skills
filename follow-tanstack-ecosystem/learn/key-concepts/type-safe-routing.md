# Type-Safe Routing

## Route Types

TanStack Router สร้าง types อัตโนมัติจาก route tree:
- Type-safe route params
- Type-safe search params
- Type-safe loader data

## Usage

```typescript
const navigate = useNavigate({ from: '/posts' });
navigate({ to: '/posts/$postId', params: { postId: '1' } });

const { postId } = useParams({ from: '/posts/$postId' });
```

## Type Inference

```typescript
type PostRoute = RouteById<typeof router, '/posts/$postId'>;
// postId: string
```
