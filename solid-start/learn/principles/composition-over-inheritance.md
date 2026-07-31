# Composition Over Inheritance

## แนวคิดหลัก

ใช้ composition แทน inheritance สำหรับสร้าง components ที่ reusable และ flexible

## Component Composition

### ❌ ไม่ควรทำ (Inheritance)

```typescript
// Base component
class BaseButton {
  props: any;
  constructor(props: any) {
    this.props = props;
  }
  render() {
    return <button>{this.props.children}</button>;
  }
}

// Inherited component (ไม่ recommended ใน SolidJS)
class PrimaryButton extends BaseButton {
  render() {
    return <button class="primary">{this.props.children}</button>;
  }
}
```

### ✅ ควรทำ (Composition)

```typescript
// Base component
export function Button(props: ButtonProps) {
  return (
    <button class={props.class}>
      {props.children}
    </button>
  );
}

// Composed component
export function PrimaryButton(props: ButtonProps) {
  return (
    <Button {...props} class="primary" />
  );
}

// Usage
<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>
```

## Higher-Order Components

ใช้ HOC สำหรับ cross-cutting concerns:

```typescript
// HOC for authentication
export function withAuth(Component: any) {
  return (props: any) => {
    const user = useAuth();
    if (!user()) return <Login />;
    return <Component {...props} user={user()} />;
  };
}

// Usage
const ProtectedPage = withAuth(Dashboard);
```

## Render Props

ใช้ render props สำหรับ sharing logic:

```typescript
export function MouseTracker(props: {
  children: (mouse: { x: number; y: number }) => JSX.Element
}) {
  const [mouse, setMouse] = createSignal({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      {props.children(mouse())}
    </div>
  );
}

// Usage
<MouseTracker>
  {(mouse) => <div>Mouse: {mouse.x}, {mouse.y}</div>}
</MouseTracker>
```

## Component Slots

ใช้ slots สำหรับ flexible composition:

```typescript
export function Card(props: {
  header?: JSX.Element;
  body: JSX.Element;
  footer?: JSX.Element;
}) {
  return (
    <div class="card">
      {props.header && <div class="card-header">{props.header}</div>}
      <div class="card-body">{props.body}</div>
      {props.footer && <div class="card-footer">{props.footer}</div>}
    </div>
  );
}

// Usage
<Card
  header={<h2>Title</h2>}
  body={<p>Content</p>}
  footer={<button>Action</button>}
/>
```

## Benefits

- **Flexible**: Components สามารถ combine ได้หลายวิธี
- **Reusable**: Logic สามารถ reuse ได้ง่าย
- **Type-Safe**: TypeScript support ดีกว่า inheritance
- **Predictable**: Behavior ชัดเจนกว่า inheritance chains
