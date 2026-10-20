# Use Case — Type-Check Scenes with ty Before Rendering

> ManimGX swallows unknown keywords at runtime, so `ty` is the only thing that catches `m.Circle(colour=m.BLUE)` — point it at the interpreter that actually has `manimgx` installed. Source: https://manimgx.academa.ai/llms.txt (accessed 2026-10-20)

## 1. Understand why runtime is not enough

```python
circle = m.Circle(radius=1.0, colour=m.BLUE)   # typo: should be color=
```

This renders a black circle with exit code 0. Mobjects accept `**kwargs`, so a misspelled keyword is stored and ignored — the animation runs, the color never applies, and the MP4 looks wrong with no error to read. The same happens with `fill_oppacity=`, `font_szie=`, and any renamed-API call that still takes `**kwargs`.

`ty` reads ManimGX's annotations, including keyword arguments and the `.animate` chain, so the typo becomes an error before a render burns minutes.

## 2. Install ty

```bash
# one-off, nothing to manage
uvx ty check --python .venv/Scripts/python.exe scene.py

# pinned in the project (recommended for a scene repo)
uv add --dev ty
uv run ty check scene.py
```

```bash
# machine-wide, next to the manimgx tool install
uv tool install ty
ty --version
```

## 3. Point ty at the interpreter that has manimgx

`ty` resolves imports with the interpreter you give it. Give it the machine default and every `m.<Name>` becomes `unresolved-import` — the checker goes quiet exactly when it matters.

```bash
uv tool dir
# e.g. C:\Users\<you>\AppData\Roaming\uv\tools
```

| Where manimgx lives | `--python` value |
|---------------------|------------------|
| `uv tool install manimgx` on Windows | `<uv tool dir>\manimgx\Scripts\python.exe` |
| `uv tool install manimgx` on unix | `<uv tool dir>/manimgx/bin/python` |
| Project venv on Windows | `.venv\Scripts\python.exe` |
| Project venv on unix | `.venv/bin/python` |

```bash
# Windows
uvx ty check --python "$(uv tool dir)\manimgx\Scripts\python.exe" scene.py

# unix
uvx ty check --python "$(uv tool dir)/manimgx/bin/python" scene.py
```

Inside a project where `ty` is already a dependency of the same venv, drop `--python` — `ty` picks up the environment it was installed into.

## 4. Read the three findings that matter

```text
error[unknown-argument]: Argument `colour` does not match any known parameter of `Circle`
error[unresolved-import]: Module `manimgx` could not be resolved
error[invalid-argument-type]: Argument to `shift` is not assignable to `Vector3`
```

- `unknown-argument` — a real typo; rename it now
- `unresolved-import` — wrong interpreter, not wrong code; go back to step 3
- `invalid-argument-type` — usually `m.RIGHT` where a 3-vector was expected, or a float where a color was expected

## 5. Animate custom methods through a lambda

`ty` only knows ManimGX's own methods on `.animate`. Animating a method that belongs to your own mobject class resolves to `unknown-argument`:

```python
class Box(m.Rectangle):
    def grow(self, factor: float) -> "Box":
        return self.scale(factor)


box = Box(width=2, height=1)

self.play(box.animate(lambda b: b.grow(2)))   # ty-clean
# self.play(box.animate.grow(2))              # ty flags this
```

## 6. Wire it into the edit loop and CI

```bash
# before every render — cheapest gate after inspect
uv run ty check scene.py
manimgx inspect scene.py
manimgx render scene.py
```

```yaml
# .github/workflows/scene.yml (excerpt)
- run: uv sync --all-extras
- run: uv run ty check .
```

`/run-verify` runs lint, typecheck, and tests for the changed scene file; `ty` is the typecheck half. Keep `ty` in the editor too, so the underline appears while the scene is being written rather than at the end.

## 7. Verify

1. `ty --version` prints a version and `uv tool dir` prints a real path
2. `ty check --python <manimgx python> scene.py` exits 0 on the clean scene and prints no `unresolved-import`
3. Deliberately write `m.Circle(colour=m.BLUE)` — `ty` reports `unknown-argument`; revert it
4. Point `--python` at the machine default — the same file now reports `unresolved-import`, proving the interpreter choice matters
5. Add `box.animate.grow(2)` for a custom method — `ty` flags it; the lambda form passes
6. `/run-verify` — lint, typecheck, and tests all pass with the scene unchanged

## Pitfalls

- Running `ty check` without `--python` and believing "no errors" — you got no analysis at all.
- Using the `manimgx` CLI path instead of the interpreter path; `--python` wants `...\Scripts\python.exe`, not `...\Scripts\manimgx.exe`.
- Checking only on the developer's machine — CI must install `manimgx` into the same environment `ty` reads, or CI reports `unresolved-import` forever.
- Fixing `unresolved-import` by adding `# type: ignore` instead of correcting the interpreter.
- Expecting `ty` to catch layout problems — it checks names and types; `manimgx inspect` is the layout gate.
- Trusting `.animate.<customMethod>()` after a green run — it needs the lambda form to type-check.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/scene-authoring.md`
- `best-practices/from-manim-ce.md`
- `usecases/first-math-scene.md`
- `usecases/3d-scene-and-camera.md`
