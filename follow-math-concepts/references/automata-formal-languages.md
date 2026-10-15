# Automata And Formal Languages

## Goal

Understand automata theory and formal languages: state machines, regular expressions, context-free grammars, Chomsky hierarchy, computability, and their application in parsing, validation, and protocol design

## Scope

- Use for designing state machines, parsers, regex, protocols, validation
- Covers DFA/NFA, regular languages, CFG, pushdown automata, Turing machines
- Applied in lexical analysis, input validation, workflow engines, language tooling

## Execute

### 1. Model With Finite Automata

> Goal: use state machines for systems with bounded states

1. DFA: states + transitions + accept states — clearly defined, easy to read
2. NFA: multiple transitions per state — equivalent to DFA in expressive power but more compact
3. States grow exponentially when more memory is needed — DFA can't match regex/CFG if the language isn't regular
4. Map to: order status, connection lifecycle, game state, workflow engine — use the state pattern or a state machine library

### 2. Use Regular Expressions And Regular Languages

> Goal: handle pattern matching while understanding the limits

1. regular expressions = the definition of regular languages — closed under union, concatenation, Kleene star
2. Suitable for: validating email-ish formats, tokenization, find-replace, routing matching
3. Not suitable for: nested brackets, balanced pairs, counting aⁿbⁿ — must go up a level of automata
4. Beware catastrophic backtracking in regex engines — use possessive/atomic groups or a parser instead

### 3. Parse With Context-Free Grammars

> Goal: analyze nested structure

1. CFG supports nesting: expressions, JSON, HTML-ish, source code
2. The reader is a pushdown automaton (a stack remembers the nesting levels)
3. Top-down (recursive descent, LL) is easier to hand-write, Bottom-up (LR) is more covering — choose per tooling
4. Ambiguity in a grammar = problem — must resolve with precedence/associativity rules

### 4. Know The Chomsky Hierarchy

> Goal: choose the language level matching the problem

1. Type 3 regular (regex/DFA) → Type 2 CFG (parser/stack) → Type 1 context-sensitive (limited, rarely needed) → Type 0 recursively enumerable (Turing complete)
2. The further left, the faster to interpret and the more analyzable — don't use Turing complete when regular suffices
3. Rule of thumb: validation is regular, structure is CFG, general computation is Type 0

### 5. Understand Computability Limits

> Goal: know what cannot be solved by algorithm

1. halting problem: no algorithm can decide whether every program halts or loops — Turing
2. implication: no static analyzer is 100% complete (lint having false positives/negatives is natural)
3. Rice's theorem: every behavioral property of a program is undecidable
4. Use as a guide: set the tool's boundary so it verifies only structural/type properties

### 6. Map To Code

> Goal: apply in software

1. validate with correct regex — use grammar-based libraries for complex input
2. lexical analysis uses DFA (generated, e.g. a lexer generator); parsers use CFG/PEG
3. workflows use an explicit state machine with typed states + transitions (state pattern, XState)
4. DSL/template engine = grammar design — maintain the grammar in 1 source only (single source of truth)

## Rules

### 1. Right Tool Per Level

- If the pattern is regular → don't write a parser; if nested → don't use regex (especially HTML parsing with regex)
- A regex that parses recursive-like structure = smell → move to a proper parser

### 2. Determinism

- A state machine must be exhaustive: every state, every input event has a transition or a clear reject
- Don't have implicit state (e.g. boolean flags combining into n states) — separate into distinct states
- Every state transition must be testable — use the property: reachable from initial to accept

### 3. Code Mapping

- regex: each language's engine has different syntax — check compatibility before porting
- parser combinators are easier to integrate; parser generators are faster than maintaining a separate grammar

- Use /follow-math-concepts (graph-theory, proofs) if needed
- Use /deep-debug if needed

## Expected Outcome

1. Design a state machine that is exhaustive and testable
2. Choose correctly which of regex/grammar/automaton level suits the problem
3. Understand tooling limits arising from undecidability
4. Map correctly to validation, parsing, and workflow in code
