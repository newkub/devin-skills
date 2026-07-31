# Password Hashing

## Bcrypt

**Example (Go)**:

```go
package main

import (
    "fmt"
    "golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
    bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
    return string(bytes), err
}

func checkPassword(password, hash string) bool {
    err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
    return err == nil
}

func main() {
    password := "my-secure-password"
    
    hash, err := hashPassword(password)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Hash: %s\n", hash)
    
    valid := checkPassword(password, hash)
    fmt.Printf("Valid: %v\n", valid)
}
```

## PBKDF2

**Example (Go)**:

```go
package main

import (
    "crypto/rand"
    "crypto/sha256"
    "encoding/base64"
    "fmt"
    "golang.org/x/crypto/pbkdf2"
)

func deriveKey(password, salt string) (string, error) {
    saltBytes := []byte(salt)
    passwordBytes := []byte(password)
    
    key := pbkdf2.Key(passwordBytes, saltBytes, 100000, 32, sha256.New)
    
    return base64.URLEncoding.EncodeToString(key), nil
}

func main() {
    password := "my-password"
    salt := "random-salt"
    
    key, err := deriveKey(password, salt)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Derived Key: %s\n", key)
}
```
