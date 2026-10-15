# Refactor — Smell → Technique Catalog

Used at detect/analyze time (`/refactor` `### 1. Detect Scope`) — match the observed smell, then apply the technique that fixes the root cause, never mask the symptom. Architecture-level emergent smells are not file refactors → `/deep-review` (domain `review-architecture`)

> Pre-Run: a technique applies only when a test or `/run-verify` proves behavior is unchanged; pick one technique per commit

## Catalog

| Smell | Symptom | Technique |
|-------|---------|-----------|
| Long Method | function long, does several things, commented in slices | Extract Method, Decompose Conditional, Replace Loop with Collection Pipeline |
| Large Class / God Class | one class/file holds many reasons to change | Extract Class per axis of change, Extract Module (SRP split) |
| Long Parameter List | >3-4 params passed as the same set everywhere | Introduce Parameter Object, Preserve Whole Object, Replace Parameter with Query |
| Feature Envy | method uses another type's data more than its own | Move Method/Field to the data's owner, Extract Function there |
| Data Clumps | the same group of fields travels together (start/end, x/y) | Extract Class / value object |
| Primitive Obsession | string/number stands in for a domain concept | Replace Primitive with Object (value type), Introduce Domain-Specific Type |
| Divergent Change | one class changes for several unrelated reasons | Extract Class per reason to change |
| Shotgun Surgery | one concept change forces edits across many files | Move Method/Field to a single owner — canonical source (`/follow-single-of-source`) |
| Duplicated Code | same block/logic in several places | Extract Function/Module; `Pull Up Method` for class hierarchies |
| Speculative Generality | abstraction, hook, or param with no real consumer | Inline / Collapse Class hierarchy (`/dont-over-engineer`) |
| Dead Code | unreachable, unused exports, never-called branch | Remove after `/follow-tool-knip` confirms no consumer |
| Switch/Conditional Sprawl | switch/if-chain repeated per type | Replace Conditional with Polymorphism or a dispatch table |
| Comments As Deodorant | comments explain what the code should say | Rename/Extract so code explains itself, delete the comment |
| Mutable Globals | shared state written from many places | Encapsulate, inject the dependency, narrow the scope |
| Leaky Abstraction | caller must know internal details to use it | Fix the interface boundary — hide the implementation |
| Message Chain / Law of Demeter | `a.b().c().d()` navigation | Hide Delegate, Extract Service, Introduce Facade |
| Middle Man | class mostly forwards calls to another | Remove the middle man, call the real collaborator directly |
| Inappropriate Intimacy | two modules reach into each other's internals | Separate Boundary, Move Function, Hide the shared field |
| Refused Bequest | subclass ignores/overrides most of what it inherits | Replace Inheritance with Delegation / composition |
| Parallel Inheritance Hierarchies | adding a variant means adding a class in two trees | Replace Inheritance with Delegate, merge hierarchies |
| Alternative Classes With Different Interfaces | near-identical classes that cannot be swapped | Introduce consistent interface, Pull Up |
| Data Class | object of fields with no behavior | Move behavior onto the class, Encapsulate collections |
| Lazy Class | class no longer earns its existence | Inline Class, collapse the hierarchy |
| Temporary Field | field meaningful only in one flow | Extract Class for the flow, or move the method that uses it |
| Incomplete Library Use | workarounds sprinkled around a dependency | Wrap the dep in the project's adapter/util |
| Anemic Domain Model | logic lives in services, entities are bags of getters | Move the domain rules into the entity/value object |
| Mutable Shared State In Concurrency | data races, order-dependent results | Isolate mutable state, message passing, immutable snapshots |

## Technique Families

- Compose: Extract / Inline Function, Rename, Introduce Parameter Object, Replace Loop with Pipeline
- Object: Move Method/Field, Extract Class, Pull Up / Push Down Method, Replace Inheritance with Delegation, Introduce Facade/Adapter
- Data: Replace Mutable Data with Immutable, Encapsulate Collection/Field, Split Variable, Self Encapsulate Field
- API surface: Keep public API through barrels, Hidden Method behind an interface, Introduce Local Extension when the vendor type must grow
- Modules: Extract Module/Package, Move Lines to Folder per domain, Replace deep relative import with alias, Convert to explicit dependency

## Rules

### 1. Root Cause First

- Choose the technique from the smell's cause — a symptom-level patch (extra flag, extra branch) is a failed refactor
- If no technique fits, the problem is architectural → `/deep-review` before touching files

### 2. Cheap Reversibility

- One technique per commit, checkpoint with `/git-commit`; a failing verify reverts the last technique, not the whole batch

## Expected Outcome

- Each smell in scope is named with `file:line` evidence, mapped to a technique, and closed by a green verify
- Remaining smells that need a different scope are reported with the routing (`/deep-review`, `### 6`, `/improve-*`)
