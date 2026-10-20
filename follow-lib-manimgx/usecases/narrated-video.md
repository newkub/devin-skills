# Use Case — Narrated Video With Synced Captions

> Add spoken narration that starts on specific words, cache the audio, and ship the matching `.srt`. Source: https://manimgx.academa.ai/llms.txt (accessed 2026-10-20)

## 1. Put the voice key in the environment

```bash
manimgx --version   # voice comes from fal.ai and needs FAL_KEY
```

Store `FAL_KEY` with the secret manager or the machine environment. Never write it in the scene, the repo, or a prompt.

## 2. Narrate with animation anchors

```python
import manimgx as m


class Derivative(m.Scene):
    def construct(self):
        x2 = m.MathTex(r"x^2")
        two_x = m.MathTex(r"2x")

        self.play(m.Write(x2))
        self.wait(1)

        self.say(
            "The derivative of [x squared] is [two x].",
            m.Transform(x2, two_x),
        )
```

Bracketed words are the anchors: the first animation starts at "x squared", the next content lands on "two x".

## 3. Choose the voice in the class

```python
class DeriativeNarrated(m.Scene):
    voice = m.voices.Fal("<model>")
```

The default voice is ElevenLabs via fal.ai; override per scene when a project needs a consistent voice.

## 4. Render and check the captions

```bash
manimgx render scene.py
```

A narrated scene writes both the MP4 and a `.srt` next to it. Spoken lines are cached in `voice/`, so a re-render works offline and reuses the same audio.

## 5. Present as slides when needed

```python
self.next_section("derivative")
self.play(m.Write(two_x))
```

```bash
manimgx present scene.py
```

Sections become slide boundaries without changing the recorded video.

## Pitfalls

- Committing `FAL_KEY` to make CI render → the key leaks in history; provide it through machine env in CI secrets.
- Editing narration text and expecting new audio without clearing the cache → the cached line is reused; check `voice/`.
- Adding `m.Sound(...)` to a play with no run time → the sound is cut off; give the play enough `run_time`.
- Ignoring the `.srt` → captions drift when narration is edited; regenerate them with the render.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/scene-authoring.md`
- `usecases/first-math-scene.md`
