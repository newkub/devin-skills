# Define Ubiquitous Language

## Goal

Ensure consistent terminology

## Execute

Ensure consistent terminology:

```typescript
// Use domain language in code
class Order {
  confirm() { } // Not "Process" or "Complete"
  cancel() { } // Not "Delete" or "Remove"
  ship() { } // Not "Send" or "Deliver"
}

// Avoid technical terms
class Order {
  // ❌ Bad: Technical language
  insertRecord(dto: OrderDto) { }
  updateStatus(statusId: number) { }
  
  // ✅ Good: Domain language
  confirm() { }
  cancel() { }
}
```

## Tips

- Use business terminology in code
- Avoid technical jargon
- Align with stakeholders
- Create a glossary if needed
