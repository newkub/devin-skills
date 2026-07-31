# Symmetric Encryption

## AES (Advanced Encryption Standard)

**Key Sizes**: 128, 192, 256 bits

**Example (Go)**:

```go
package main

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "fmt"
    "io"
)

func encrypt(key []byte, plaintext string) (string, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }
    
    ciphertext := make([]byte, aes.BlockSize+len(plaintext))
    iv := ciphertext[:aes.BlockSize]
    
    if _, err := io.ReadFull(rand.Reader, iv); err != nil {
        return "", err
    }
    
    stream := cipher.NewCFBEncrypter(block, iv)
    stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(plaintext))
    
    return base64.URLEncoding.EncodeToString(ciphertext), nil
}

func decrypt(key []byte, ciphertext string) (string, error) {
    block, err := aes.NewCipher(key)
    if err != nil {
        return "", err
    }
    
    decoded, err := base64.URLEncoding.DecodeString(ciphertext)
    if err != nil {
        return "", err
    }
    
    if len(decoded) < aes.BlockSize {
        return "", fmt.Errorf("ciphertext too short")
    }
    
    iv := decoded[:aes.BlockSize]
    decoded = decoded[aes.BlockSize:]
    
    stream := cipher.NewCFBDecrypter(block, iv)
    stream.XORKeyStream(decoded, decoded)
    
    return string(decoded), nil
}

func main() {
    key := []byte("32-byte-long-key-123456789012345")
    plaintext := "secret message"
    
    encrypted, err := encrypt(key, plaintext)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Encrypted: %s\n", encrypted)
    
    decrypted, err := decrypt(key, encrypted)
    if err != nil {
        fmt.Printf("Error: %v\n", err)
        return
    }
    
    fmt.Printf("Decrypted: %s\n", decrypted)
}
```
