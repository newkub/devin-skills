# How It Works

## Rust Compiler Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Rust Compiler (rustc)                 │
├─────────────────────────────────────────────────────────┤
│  1. Lexer/Tokenizer    →  Token Stream                   │
│  2. Parser             →  AST (Abstract Syntax Tree)     │
│  3. Name Resolution    →  Resolved AST                   │
│  4. Type Checking      →  Type-checked AST               │
│  5. Borrow Checking    →  Validated AST                  │
│  6. MIR Lowering       →  Mid-Level IR                   │
│  7. Optimizations      →  Optimized MIR                  │
│  8. Code Generation    →  LLVM IR → Machine Code        │
└─────────────────────────────────────────────────────────┘
```

## Ownership System

Rust ใช้ ownership system เพื่อจัดการ memory โดยมี 3 rules หลัก:

```
┌─────────────────────────────────────────────────────────┐
│                   Ownership Rules                        │
├─────────────────────────────────────────────────────────┤
│  1. Each value has an owner                             │
│  2. Only one owner at a time                            │
│  3. Owner goes out of scope → value is dropped           │
└─────────────────────────────────────────────────────────┘
```

### Example: Ownership Transfer (Move)

```rust
fn main() {
    let s1 = String::from("hello");    // s1 owns the String
    let s2 = s1;                       // Ownership moved to s2
    // println!("{}", s1);             // ERROR: s1 is no longer valid
    println!("{}", s2);                // OK: s2 is the owner
}
```

### Example: Clone (Deep Copy)

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();               // Deep copy, s1 still valid
    println!("s1: {}, s2: {}", s1, s2); // OK: both valid
}
```

## Borrowing System

```
┌─────────────────────────────────────────────────────────┐
│                    Borrowing Rules                       │
├─────────────────────────────────────────────────────────┤
│  1. Multiple immutable references OR one mutable ref     │
│  2. References must always be valid (no dangling)        │
│  3. Borrow scope ends when reference is last used        │
└─────────────────────────────────────────────────────────┘
```

### Example: Immutable Borrow

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);    // Pass reference, not ownership
    println!("Length of '{}' is {}", s, len); // s still valid
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```

### Example: Mutable Borrow

```rust
fn main() {
    let mut s = String::from("hello");
    append_world(&mut s);
    println!("{}", s);                 // "hello world"
}

fn append_world(s: &mut String) {
    s.push_str(" world");
}
```

## Borrow Checker Visualization

```
┌────────────────────────────────────────────────────────┐
│              Borrow Checker Validation                  │
├────────────────────────────────────────────────────────┤
│                                                        │
│   let s = String::from("hi");      // s owns the data  │
│   let r1 = &s;                     // r1 borrows s      │
│   let r2 = &s;                     // r2 borrows s      │
│   println!("{} and {}", r1, r2);   // ✓ OK: immutable   │
│   let r3 = &mut s;                 // ✗ ERROR: can't mix │
│   r3.push_str("!");                // ✗ immutable and   │
│                                     //   mutable refs    │
└────────────────────────────────────────────────────────┘
```

## Lifetimes

Lifetimes ช่วยให้ compiler ตรวจสอบว่า references จะ valid เสมอ:

```rust
// Lifetime annotation: 'a means both refs live at least as long
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("xyz");
        result = longest(s1.as_str(), s2.as_str());
        println!("Longest: {}", result); // ✓ OK: result used here
    }
    // println!("{}", result); // ✗ ERROR: s2 dropped, result invalid
}
```

## Data Types Categories

```
┌─────────────────────────────────────────────────────────┐
│                   Data Types                            │
├──────────────────────┬──────────────────────────────────┤
│     Scalar Types     │        Compound Types           │
├──────────────────────┼──────────────────────────────────┤
│ - i8, i16, i32, i64 │ - Tuple: (i32, String)           │
│ - u8, u16, u32, u64 │ - Array: [i32; 3]                │
│ - f32, f64          │ - Slice: &[i32]                 │
│ - bool              │ - String: String                │
│ - char              │ - Struct: User { name, age }    │
│ - isize, usize      │ - Enum: Option<T>, Result<T,E>  │
└──────────────────────┴──────────────────────────────────┘
```

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────┐
│               Error Handling Pattern                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   fn read_file() -> Result<String, io::Error> {         │
│       let content = fs::read_to_string("file.txt")      │
│           .map_err(|e| handle_error(e))?;              │
│       Ok(content)                                       │
│   }                                                     │
│                                                         │
│   match read_file() {                                  │
│       Ok(content) => println!("{}", content),           │
│       Err(e) => eprintln!("Error: {}", e),             │
│   }                                                     │
└─────────────────────────────────────────────────────────┘
```