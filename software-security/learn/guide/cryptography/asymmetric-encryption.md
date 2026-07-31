# Asymmetric Encryption

## RSA (Rivest-Shamir-Adleman)

**Key Sizes**: 2048, 3072, 4096 bits

**Example (Go)**:

```go
package main

import (
    "crypto/rand"
    "crypto/rsa"
    "encoding/base64"
    "fmt"
)

func generateKeyPair() (*rsa.PrivateKey, *rsa.PublicKey, error) {
    privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
    if err != nil {
        return nil, nil, err
    }
    
    return privateKey, &privateKey.PublicKey, nil
}

func encrypt(publicKey *rsa.PublicKey, plaintext string) (string, error) {
    ciphertext, err := rsa.EncryptPKCS1v15(rand.Reader, publicKey, []byte(plaintext))
    if err != nil {
        return "", err
    }
    
    return base64.URLEncoding.EncodeToString(ciphertext), nil
}

func decrypt(privateKey *rsa.PrivateKey, ciphertext string) (string, error) {
    decoded, err := base64.URLEncoding.DecodeString(ciphertext)
    if err != nil {
        return "", err
    }
    
    plaintext, err := rsa.DecryptPKCS1v15(rand.Reader, privateKey, decoded)
    if err != nil {
        return "", err
    }
    
    return string(plaintext), nil
}

func main() {
    privateKey, publicKey, err := generateKeyPair()
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    plaintext := "secret message"
    
    encrypted, err := encrypt(publicKey, plaintext)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Encrypted: %s\n", encrypted)
    
    decrypted, err := decrypt(privateKey, encrypted)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Decrypted: %s\n", decrypted)
}
```
