# Hashing

## SHA-256

**Example (Go)**:

```go
package main

import (
    "crypto/sha256"
    "encoding/hex"
    "fmt"
)

func hash(data string) string {
    hash := sha256.Sum256([]byte(data))
    return hex.EncodeToString(hash[:])
}

func main() {
    data := "important data"
    hashValue := hash(data)
    
    fmt.Printf("Data: %s\n", data)
    fmt.Printf("Hash: %s\n", hashValue)
}
```
