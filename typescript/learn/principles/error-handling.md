# Error Handling Rules

## Rationale

Proper error handling ช่วยให้ application reliable, debuggable, และ provide better user experience

## Bad Practice

```typescript
// ❌ Swallowing errors
try {
  await fetchUser(id);
} catch (e) {
  // Empty catch - lost error
}

// ❌ Generic catch
try {
  await processPayment(order);
} catch (e: any) {
  console.log(e); // ❌ Generic handling
}

// ❌ Throwing strings
function validateEmail(email: string) {
  if (!email) {
    throw "Email is required"; // ❌ Should be Error
  }
}

// ❌ Not handling async errors
function fetchData() {
  fetch("/api").then(r => r.json()); // ❌ Unhandled rejection
}
```

## Good Practice

```typescript
// ✅ Typed errors
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateEmail(email: string): void {
  if (!email) {
    throw new ValidationError("email", "Email is required");
  }
}

// ✅ Try-catch with proper handling
try {
  await processPayment(order);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log(`Validation failed: ${error.field}`);
  } else if (error instanceof NetworkError) {
    console.log("Network issue - please retry");
  } else {
    throw error; // Re-throw unknown errors
  }
}
```

## Rules

### 1. Use Result Pattern for Expected Errors

```typescript
// ✅ Result type for expected failures
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

async function findUser(id: string): Promise<Result<User>> {
  try {
    const user = await db.findById(id);
    return { ok: true, value: user };
  } catch (error) {
    return { ok: false, error: new Error("User not found") };
  }
}

// Usage
const result = await findUser("123");
if (result.ok) {
  console.log(result.value);
} else {
  console.log(result.error);
}
```

### 2. Never Throw in Async Code Without Handling

```typescript
// ✅ Proper async error handling
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw new UserNotFoundError(id);
    }
    throw new UnexpectedError(error);
  }
}

// ✅ Handle at the call site
try {
  const user = await fetchUser("123");
} catch (error) {
  if (error instanceof UserNotFoundError) {
    // Handle not found
  } else {
    // Handle unexpected
  }
}
```

### 3. Create Custom Error Classes

```typescript
// ✅ Custom error hierarchy
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR", 400);
  }
}

class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, "NOT_FOUND", 404);
  }
}

class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized access", "UNAUTHORIZED", 401);
  }
}
```

### 4. Use Error Boundaries (Frontend)

```typescript
// ✅ React error boundary
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

### 5. Log Errors with Context

```typescript
// ✅ Structured logging
function handleError(error: Error, context: Record<string, unknown>) {
  logger.error({
    message: error.message,
    stack: error.stack,
    name: error.name,
    ...context,
    timestamp: new Date().toISOString(),
  });
}

try {
  await processOrder(order);
} catch (error) {
  handleError(error, { orderId: order.id, userId: order.userId });
}
```

## Error Handling in Different Layers

### API Layer

```typescript
// Express error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.message, field: err.field });
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message });
  }
  logger.error(err);
  res.status(500).json({ error: "Internal server error" });
});
```

### Service Layer

```typescript
// Service should throw domain errors
class UserService {
  async createUser(data: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new ConflictError("User already exists");
    }
    return this.userRepo.create(data);
  }
}
```

## References

- [TypeScript Error Handling](https://blog.logrocket.com/understanding-error-handling-typescript/)
- [Exception Handling Best Practices](https://docs.microsoft.com/en-us/dotnet/standard/exceptions/best-practices-for-exceptions)