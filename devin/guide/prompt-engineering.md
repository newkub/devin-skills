# Prompt Engineering for Devin/Cascade

## Overview

Prompt engineering เป็น skill สำคัญในการทำให้ Devin/Cascade ทำงานได้อย่างมีประสิทธิภาพ คู่มือนี้จะสอนเทคนิคขั้นสูงสำหรับเขียน prompts ที่ทำให้ agents ทำงานได้ดีขึ้น

## Core Principles

### 1. Clarity & Specificity

Prompts ที่ชัดเจนและเฉพาะเจาะจงทำให้ agents เข้าใจสิ่งที่คุณต้องการได้ดีขึ้น

**❌ Bad:**
```
Fix this code
```

**✅ Good:**
```
Debug this function. It's returning None when it should return a number.
The function is supposed to calculate the average of a list of numbers.
Check for edge cases like empty lists and None values.
```

### 2. Provide Context

ให้ context เพียงพอเพื่อให้ agents เข้าใจสถานการณ์

**❌ Bad:**
```
Add error handling
```

**✅ Good:**
```
Add error handling to this API endpoint.
It should handle:
- Network timeouts (retry 3 times with exponential backoff)
- Invalid JSON responses (return 400 with error message)
- Server errors (return 503 with retry-after header)
```

### 3. Use Examples

Examples ช่วยให้ agents เข้าใจ pattern ที่คุณต้องการ

**❌ Bad:**
```
Create a function similar to this one
```

**✅ Good:**
```
Create a function similar to this `calculate_discount` function,
but for calculating tax instead:

```python
def calculate_discount(price: float, discount_rate: float) -> float:
    return price * (1 - discount_rate)
```

The tax function should:
- Take price and tax_rate as parameters
- Return the tax amount
- Handle negative values
```

### 4. Break Down Complex Tasks

แบ่ง tasks ที่ซับซ้อนเป็น sub-tasks ที่ manageable

**❌ Bad:**
```
Build a full-stack e-commerce application
```

**✅ Good:**
```
Build an e-commerce application in phases:

Phase 1: Database Schema
- Create tables for users, products, orders
- Define relationships and constraints
- Add indexes for performance

Phase 2: API Endpoints
- Implement CRUD operations for products
- Add authentication middleware
- Create order processing logic

Phase 3: Frontend
- Build product listing page
- Create shopping cart component
- Implement checkout flow
```

### 5. Specify Requirements

ระบุ requirements อย่างชัดเจนเกี่ยวกับ tech stack, style, แล constraints

**❌ Bad:**
```
Add this feature
```

**✅ Good:**
```
Add user authentication with the following requirements:
- Use JWT tokens for authentication
- Implement refresh token rotation
- Follow the existing code style in auth/ directory
- Add unit tests with pytest
- Include error handling for expired tokens
```

## Advanced Techniques

### 1. Chain of Thought

ให้ agents คิด step-by-step ก่อน execute

```
Think through this problem step by step:
1. First, analyze the current code structure
2. Identify the root cause of the bug
3. Propose a solution
4. Implement the fix
5. Add tests to prevent regression
```

### 2. Few-Shot Learning

ให้ examples หลายๆ ตัวเพื่อให้ agents เรียนรู้ pattern

```
Here are examples of how to format API responses:

Example 1: Success response
```json
{
  "status": "success",
  "data": { "id": 1, "name": "Product" }
}
```

Example 2: Error response
```json
{
  "status": "error",
  "error": { "code": "VALIDATION_ERROR", "message": "Invalid input" }
}
```

Now, format this response following the same pattern:
[include data]
```

### 3. Role-Based Prompting

กำหนด role ให้ agents เพื่อให้มี perspective ที่ชัดเจน

```
Act as a senior software engineer with 10 years of experience.
Review this code for:
- Performance issues
- Security vulnerabilities
- Code smell
- Best practices violations

Provide specific recommendations with code examples.
```

### 4. Constraint-Based Prompting

ระบุ constraints อย่างชัดเจนเพื่อ control output

```
Refactor this code with the following constraints:
- Maximum 50 lines per function
- No functions with more than 3 parameters
- Use type hints everywhere
- Add docstrings to all public functions
- Maintain the same functionality
```

### 5. Iterative Refinement

ใช้ iterative approach สำหรับ tasks ที่ซับซ้อน

```
Implement this feature in iterations:

Iteration 1: Basic functionality
- Create the core function
- Add basic error handling
- Write simple tests

Iteration 2: Edge cases
- Handle empty inputs
- Add validation
- Improve error messages

Iteration 3: Optimization
- Improve performance
- Add caching if needed
- Refactor for readability
```

## Common Patterns

### Code Generation

```
Write a [language] function that [does what].
Include:
- Type hints
- Docstring
- Error handling
- Examples in docstring
```

### Debugging

```
Debug this [file/function].
The issue is: [describe problem].
Expected behavior: [what should happen]
Actual behavior: [what's happening]
Check for: [potential causes]
```

### Refactoring

```
Refactor this code to [goal]:
- [specific improvement 1]
- [specific improvement 2]
- [specific improvement 3]
Maintain the same functionality and add tests.
```

### Testing

```
Write [test framework] tests for this [file/function].
Test cases should cover:
- Happy path
- Edge cases
- Error conditions
- Boundary values
```

### Documentation

```
Add comprehensive documentation to this [file/module].
Include:
- Module-level docstring
- Function docstrings with parameters and returns
- Usage examples
- Notes on implementation details
```

## Anti-Patterns to Avoid

### 1. Vague Instructions

❌ "Make it better"
✅ "Improve performance by reducing database queries"

### 2. Missing Context

❌ "Fix the bug"
✅ "Fix the bug in the user registration flow where duplicate emails are allowed"

### 3. Overloading

❌ "Build a full app with auth, database, frontend, backend, deployment"
✅ "Start with the authentication module. We'll build other parts later."

### 4. Ambiguous Requirements

❌ "Use good practices"
✅ "Follow SOLID principles and use dependency injection"

### 5. No Constraints

❌ "Refactor this"
✅ "Refactor this to be more readable while maintaining performance"

## Measuring Prompt Quality

### Good Prompt Checklist

- [ ] Clear and specific goal
- [ ] Sufficient context provided
- [ ] Examples included (if applicable)
- [ ] Constraints specified
- [ ] Success criteria defined
- [ ] Tech stack specified
- [ ] Error handling requirements
- [ ] Testing requirements

### Evaluating Results

After Cascade responds, evaluate:
1. **Accuracy**: Does it solve the problem?
2. **Completeness**: Are all requirements met?
3. **Quality**: Is the code well-structured?
4. **Performance**: Is it efficient?
5. **Maintainability**: Is it easy to understand and modify?

## Iterative Improvement

If the result isn't satisfactory:

1. **Analyze what went wrong**
   - Was the prompt unclear?
   - Was context missing?
   - Were constraints not specified?

2. **Refine the prompt**
   - Add more details
   - Provide better examples
   - Clarify requirements

3. **Try again**
   - Test the refined prompt
   - Compare results
   - Continue iterating

## Examples by Use Case

### API Development

```
Create a REST API endpoint for [resource]:
- Use [framework]
- Implement CRUD operations
- Add authentication middleware
- Include input validation
- Return proper HTTP status codes
- Add error handling
- Write API documentation
```

### Frontend Development

```
Create a [framework] component for [feature]:
- Use [UI library]
- Make it responsive
- Add loading states
- Handle errors gracefully
- Include accessibility features
- Follow existing design system
```

### Database Operations

```
Write a database query to [operation]:
- Use [SQL dialect/ORM]
- Optimize for performance
- Handle NULL values
- Add proper indexing
- Include transaction handling
- Write migration script
```

### DevOps/Deployment

```
Create a deployment configuration for [service]:
- Use [tool: Docker/Kubernetes/Terraform]
- Include environment variables
- Set up health checks
- Configure logging
- Add monitoring
- Document the setup
```

## Next Steps

- Practice with real projects
- Review prompts that worked well
- Build a library of reusable prompt templates
- Share successful prompts with your team
- Stay updated with new Cascade features
