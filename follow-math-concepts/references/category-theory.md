# Category Theory

## Goal

Understand category theory: categories, objects, morphisms, functors, natural transformations, monads, and their use in functional programming, type systems, and composition

## Scope

- Use to understand composition, types, functors, monads
- Covers categories, morphisms, composition laws
- Introduces functors, applicatives, monads in code

## Execute

### 1. Understand Categories

> Goal: grasp the base concepts

1. Every category has objects and morphisms (arrows)
2. Morphisms compose: `f: A → B`, `g: B → C` → `g ∘ f: A → C`
3. Every object has an identity morphism `id_A`
4. Must satisfy associativity and identity laws

### 2. Types As Objects

> Goal: view a type system as a category

1. Types are objects
2. Functions are morphisms
3. Function composition is morphism composition
4. The identity function is the identity morphism

### 3. Functors

> Goal: understand mapping between categories

1. A functor maps object → object and morphism → morphism
2. It preserves identity and composition
3. `Array.map` is a functor (lifts a function into a context)
4. `Option/Maybe` is a functor

### 4. Monads

> Goal: use monads in code

1. A monad is a functor with `return` (unit) and `bind` (flatMap)
2. Used to sequence computations that carry context (Promise, Maybe, Result)
3. Promise is a monad: `.then` is `map`; `.then` with a function returning a Promise is `flatMap`
4. Use monadic composition instead of nested callbacks

### 5. Map To Code

> Goal: apply it in FP

1. Use `.map` for pure transformations
2. Use `.flatMap`/`chain` to flatten nested contexts
3. Use `Result`/`Either` to handle errors with composition
4. Use function composition instead of nested calls

## Rules

### 1. Composition Laws

- Must preserve identity: `F(id) = id`
- Must preserve composition: `F(g ∘ f) = F(g) ∘ F(f)`

### 2. Type Safety

- Never use unsafe casts
- Use the type system to enforce the laws
- Beware void/undefined in composition

### 3. Code Mapping

- `Array`, `Promise`, `Maybe`, `Either` are typically functors/monads
- Use `pipe`/`compose` for function composition
- Use a library like `fp-ts` or `effect` when needed

- Use /deep-review if needed
- Use /follow-math-concepts if needed

## Expected Outcome

- Able to explain category, functor, monad
- Able to map a type system to a category
- Able to use monadic composition in code
- Able to refactor nested logic into composed functions
