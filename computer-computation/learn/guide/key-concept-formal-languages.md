# Formal Languages

แนวคิดหลักและคำศัพท์สำคัญสำหรับ Formal Languages

## Chomsky Hierarchy

```text
┌─────────────────────────────────────────────────┐
│           Chomsky Hierarchy                      │
├─────────────────────────────────────────────────┤
│                                                  │
│   Type 3: Regular Languages                     │
│   ├── Regex: (a|b)*abb                          │
│   ├── DFA/NFA recognizible                      │
│   └── Applications: Lexing, regex               │
│                                                  │
│   Type 2: Context-Free Languages (CFL)         │
│   ├── Grammar: S → aSb | ε                      │
│   ├── PDA recognizible                          │
│   └── Applications: Parsing, programming lang  │
│                                                  │
│   Type 1: Context-Sensitive Languages (CSL)    │
│   ├── Grammar: αAβ → αγβ                        │
│   ├── LBA recognizible                           │
│   └── Applications: Natural language            │
│                                                  │
│   Type 0: Recursively Enumerable (RE)           │
│   ├── Grammar: No restrictions                  │
│   ├── Turing Machine recognizible              │
│   └── Applications: Any computable language     │
│                                                  │
└─────────────────────────────────────────────────┘
```

## ตัวอย่าง Regular Expression

```text
Email pattern:
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$

Binary numbers divisible by 3:
^(0|(1(01*0)*1))*$

Phone number:
^\+?[1-9]\d{1,14}$
```

## สรุป

- Formal languages มี grammar ตาม type
- Chomsky hierarchy จำแนก languages 4 ระดับ
- Regular languages ง่ายที่สุด (DFA/NFA)
- Context-free สำหรับ parsing
- Context-sensitive ซับซ้อนกว่า
- Recursively enumerable ครอบคลุมทุกอย่าง
