# Create TypeScript Component

## Context

ต้องการสร้าง React component ใหม่ด้วย TypeScript

## Steps

### 1. Setup Component Structure

```
src/components/
└── UserCard/
    ├── index.ts          # exports
    ├── UserCard.tsx      # component
    ├── UserCard.test.tsx # tests
    └── types.ts          # component types
```

### 2. Define Props Type

```typescript
// types.ts

export interface UserCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading?: boolean;
}
```

### 3. Create Component

```typescript
// UserCard.tsx

import { useState } from "react";
import type { UserCardProps } from "./types";

export function UserCard({ user, onEdit, onDelete, isLoading }: UserCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div className="user-card">
      <img src={user.avatar ?? "/default-avatar.png"} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      
      {onEdit && (
        <button onClick={() => onEdit(user.id)}>Edit</button>
      )}
    </div>
  );
}
```

### 4. Export Component

```typescript
// index.ts

export { UserCard } from "./UserCard";
export type { UserCardProps } from "./types";
```

### 5. Write Tests

```typescript
// UserCard.test.tsx

import { render, screen } from "@testing-library/react";
import { UserCard } from "./UserCard";

describe("UserCard", () => {
  const mockUser = {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
  };

  it("should render user name", () => {
    render(<UserCard user={mockUser} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("should call onEdit when edit button clicked", async () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);
    
    fireEvent.click(screen.getByText("Edit"));
    expect(onEdit).toHaveBeenCalledWith("1");
  });
});
```

## Principles

- **Type Props**: กำหนด props interface ชัดเจน
- **Optional Handlers**: ทำให้ callbacks เป็น optional
- **Composition**: แบ่ง component เล็กๆ
- **Testing**: เขียน tests ควบคู่กับ component

## Related

- [principles/testing.md](../principles/testing.md)
- [principles/type-safety.md](../principles/type-safety.md)
