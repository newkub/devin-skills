# Digital Signatures

## RSA Signatures

**Example (Go)**:

```go
package main

import (
    "crypto"
    "crypto/rand"
    "crypto/rsa"
    "crypto/sha256"
    "encoding/base64"
    "fmt"
)

func sign(privateKey *rsa.PrivateKey, message string) (string, error) {
    hashed := sha256.Sum256([]byte(message))
    
    signature, err := rsa.SignPKCS1v15(rand.Reader, privateKey, crypto.SHA256, hashed[:])
    if err != nil {
        return "", err
    }
    
    return base64.URLEncoding.EncodeToString(signature), nil
}

func verify(publicKey *rsa.PublicKey, message, signature string) (bool, error) {
    hashed := sha256.Sum256([]byte(message))
    
    decoded, err := base64.URLEncoding.DecodeString(signature)
    if err != nil {
        return false, err
    }
    
    err = rsa.VerifyPKCS1v15(publicKey, crypto.SHA256, hashed[:], decoded)
    return err == nil, nil
}

func main() {
    privateKey, publicKey, err := rsa.GenerateKey(rand.Reader, 2048)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    message := "important message"
    
    signature, err := sign(privateKey, message)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Signature: %s\n", signature)
    
    valid, err := verify(publicKey, message, signature)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Valid: %v\n", valid)
}
```
