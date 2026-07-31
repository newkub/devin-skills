# Error Handling

### Result Type

```rust
use std::fs::File;
use std::io::Read;

fn read_file(path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

// Using match
match read_file("test.txt") {
    Ok(content) => println!("{}", content),
    Err(e) => eprintln!("Error: {}", e),
}
```

### Option Type

```rust
fn find_first_word(s: &str) -> Option<&str> {
    let bytes = s.as_bytes();
    for (i, &byte) in bytes.iter().enumerate() {
        if byte == b' ' {
            return Some(&s[0..i]);
        }
    }
    None
}

// Using unwrap/expect
let word = find_first_word("hello world").unwrap();

// Using unwrap_or
let word = find_first_word("hello").unwrap_or("");

// Using if let
if let Some(word) = find_first_word("hello world") {
    println!("First word: {}", word);
}
```
