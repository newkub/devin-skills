# Installation

## Learning Computation Theory

ไม่มีการติดตั้ง software เนื่องจากนี่เป็น theoretical topic แต่ต้องมี tools สำหรับศึกษา

## Recommended Tools

### Simulators

| Tool | Description | Language |
|------|-------------|----------|
| **JFLAP** | Automata simulator | Java |
| **Turing Machine Simulator** | TM visualization | Web |
| **Automata Tutor** | Learning platform | Web |

### Programming Languages for Theory

| Language | Use Case |
|----------|----------|
| **Python** | Algorithm implementation |
| **Haskell** | Lambda calculus, functional |
| **Prolog** | Logic programming |

## Installation Steps

### 1. JFLAP

```bash
# Download from jflap.org
# Requires Java 8+
java -jar JFLAP.jar
```

### 2. Python (for implementation)

```bash
pip install automata-lib
pip install networkx  # For graph algorithms
```

### 3. VS Code Extensions

```json
{
  "recommendations": [
    "ms-python.python",
    "haskell.haskell"
  ]
}
```

## Resources for Learning

### Books

| Book | Level | Topics |
|------|-------|--------|
| **Sipser - Intro to Theory of Computation** | Beginner | All basics |
| **Hopcroft - Automata** | Intermediate | Automata theory |
| **Arora Barak - Computational Complexity** | Advanced | Complexity |

### Online Courses

| Course | Platform | Link |
|--------|----------|------|
| **Automata Theory** | Stanford | web.stanford.edu |
| **Theory of Computation** | MIT OCW | ocw.mit.edu |
| **Computational Complexity** | Complexity Zoo | complexityzoo.net |

## Setup Environment

```python
# Example: Automata library in Python
from automata.fa.dfa import DFA

# Create a simple DFA
dfa = DFA(
    states={'q0', 'q1', 'q2'},
    input_symbols={'0', '1'},
    transitions={
        'q0': {'0': 'q0', '1': 'q1'},
        'q1': {'0': 'q2', '1': 'q1'},
        'q2': {'0': 'q2', '1': 'q2'}
    },
    initial_state='q0',
    final_states={'q1'}
)

# Test
print(dfa.accepts_input('1'))  # True
print(dfa.accepts_input('0'))  # False
```