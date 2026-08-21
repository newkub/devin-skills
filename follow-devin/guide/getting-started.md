# Getting Started with Devin/Cascade

## What is Devin/Cascade?

Devin/Cascade เป็น AI coding assistant ที่ขับเคลื่อนโดย SWE-1.6 model จาก Cognition ซึ่งออกแบบมาเพื่อ autonomous software engineering โดยเฉพาะ:

- **SWE-1.6**: Model ล่าสุดที่ optimized สำหรับ software engineering agents ด้วย intelligence และ model UX ที่สมดุล
- **Cascade**: AI assistant ใน Windsurf IDE ที่ใช้ SWE models สำหรับ code generation, debugging, และ testing
- **Devin Desktop**: IDE ที่ออกแบบมาสำหรับ managing fleets ของ local และ cloud agents

## Key Benefits

### 1. Speed & Efficiency
- SWE-1.6 ใช้ parallel tool calls บ่อยกว่า และ loop น้อยลง
- Rely บน tools ของตัวเองมากกว่า terminal
- Efficient trajectories และ smoother user experience

### 2. Intelligence
- SWE-1.6 มี performance ใกล้เคียง SOTA บน SWE-Bench Pro
- Improved จาก SWE-1.5 มากกว่า 10%
- Near Claude 4.5-level performance ที่ 13x speed

### 3. Context Awareness
- Fast Context สำหรับ context retrieval ที่รวดเร็ว
- swe-grep สำหรับ intelligent code search
- Spaces สำหรับ shared context ระหว่าง agents

## Installation

### Step 1: Install Windsurf IDE

1. Download Windsurf IDE จาก [windsurf.ai](https://windsurf.ai)
2. Install ตาม OS ของคุณ (Windows, macOS, Linux)
3. Launch Windsurf และ sign in ด้วย account ของคุณ

### Step 2: Setup Devin/Cascade

1. เปิด Windsurf IDE
2. ไปที่ Settings → AI Models
3. เลือก SWE-1.6 หรือ SWE-1.6 Fast จาก model selector
4. Confirm model selection และ quota

### Step 3: Create Your First Space

1. ไปที่ File → New Space
2. ตั้งชื่อ Space ของคุณ
3. เลือก Git repository หรือ create new project
4. Devin จะสร้าง shared context สำหรับ agents

## Your First Prompt

### Hello World Example

เปิดไฟล์ใหม่และพิมพ์:

```
Create a simple Python function that calculates the factorial of a number n.
Include error handling for negative numbers and non-integer inputs.
Add docstring and type hints.
```

Cascade จะ:
1. Analyze prompt ของคุณ
2. Generate code ที่ตรงตาม requirements
3. Add error handling แล documentation
4. Review และ refine code

### Result

```python
def factorial(n: int) -> int:
    """
    Calculate the factorial of a non-negative integer n.
    
    Args:
        n: A non-negative integer
        
    Returns:
        The factorial of n
        
    Raises:
        ValueError: If n is negative
        TypeError: If n is not an integer
    """
    if not isinstance(n, int):
        raise TypeError("n must be an integer")
    if n < 0:
        raise ValueError("n must be non-negative")
    
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result
```

## Understanding the Interface

### Cascade Panel

- **Chat Panel**: สำหรับ conversation กับ Cascade
- **Context Panel**: แสดง files แล context ที่ Cascade เห็น
- **Tools Panel**: แสดง tools ที่ Cascade ใช้ (terminal, file operations, etc.)
- **Model Selector**: เลือก AI model ที่ต้องการ

### Spaces

- **Space Overview**: ดู agents ทั้งหมดใน space
- **Agent Sessions**: ดู sessions ของแต่ละ agent
- **Git Worktrees**: Manage Git branches และ worktrees
- **Shared Context**: Files แล context ที่ shared ระหว่าง agents

## Common Workflows

### 1. Code Generation

```
Write a React component that displays a user profile with:
- Avatar image
- Name and bio
- Edit button
- Responsive design
```

### 2. Debugging

```
Debug this function. It's returning None when it should return a number:
[include code]
```

### 3. Refactoring

```
Refactor this code to follow SOLID principles:
[include code]
```

### 4. Testing

```
Write unit tests for this function using pytest:
[include code]
```

### 5. Documentation

```
Add comprehensive documentation to this module:
[include code]
```

## Tips for Better Results

### 1. Be Specific
- ✅ Good: "Create a REST API endpoint for user authentication with JWT"
- ❌ Bad: "Create an API"

### 2. Provide Context
- ✅ Good: "Add error handling to this function that handles network timeouts"
- ❌ Bad: "Fix this function"

### 3. Use Examples
- ✅ Good: "Create a function similar to this one but for [different use case]"
- ❌ Bad: "Create a function"

### 4. Break Down Complex Tasks
- ✅ Good: "First, create the database schema. Then, build the API endpoints. Finally, add the frontend."
- ❌ Bad: "Build a full-stack application"

### 5. Specify Requirements
- ✅ Good: "Use TypeScript, Tailwind CSS, and follow the existing code style"
- ❌ Bad: "Build this feature"

## Next Steps

- อ่าน `guide/prompt-engineering.md` เพื่อเรียนรู้ advanced prompt techniques
- อ่าน `key-concepts/swe-models.md` เพื่อเข้าใจ SWE models ต่างๆ
- อ่าน `principles/prompt-best-practices.md` เพื่อเรียนรู้ best practices
- ใช้ `workflows/setup-devin.md` สำหรับ advanced setup
