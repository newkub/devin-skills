# Use Case — 3D Scene and Camera

> Build a `ThreeDScene` with axes and a solid, drive the camera through orientations, and remember that 3D skips the layout gate. Source: https://manimgx.academa.ai/llms.txt (accessed 2026-10-20)

## 1. Subclass `ThreeDScene`

```python
import manimgx as m


class RotatingCube(m.ThreeDScene):
    def construct(self):
        self.set_camera_orientation(phi=70 * m.DEGREES, theta=-45 * m.DEGREES)

        axes = m.ThreeDAxes()
        cube = m.Cube(side_length=2, fill_opacity=0.6)

        self.play(m.Create(axes), run_time=1.5)
        self.play(m.FadeIn(cube), run_time=1)
```

`ThreeDScene` is the 3D counterpart of `Scene`; the 2D frame rules still apply to the projected result, so a solid far from the origin can leave the visible area even though its coordinates are small.

## 2. Animate an object in 3D

```python
        self.play(cube.animate.rotate(m.PI / 4, axis=m.UP), run_time=2)
        self.play(cube.animate.shift(m.RIGHT * 1.5 + m.UP * 0.5), run_time=1)
        self.wait(1)
```

`.animate` interpolates the mobject's own transform, so rotation, shift, and scale compose without a separate animation class. Rotating about `m.UP` turns the cube around the vertical axis; `m.OUT` gives the axis pointing at the viewer.

## 3. Move the camera deliberately

```python
        self.move_camera(phi=90 * m.DEGREES, theta=0, zoom=0.8, run_time=2)
        self.wait(1)
```

`phi` tilts from the top down (90° is edge-on), `theta` spins around the vertical axis, and `zoom` shrinks the visible area. A cut between camera positions is a `wait(0)`; a transition is a `move_camera` with `run_time`.

## 4. Rotate continuously, then stop

```python
        self.begin_ambient_camera_rotation(rate=0.15)
        self.wait(3)
        self.stop_ambient_camera_rotation()
```

Ambient rotation is the cheapest way to show that a shape is three-dimensional. It keeps running until stopped, so a scene that ends while it is active leaves the final frame mid-rotation — stop it before the last `wait` if the closing frame matters.

## 5. Label with 3D-aware mobjects

```python
        label = m.Text("unit cube").scale(0.6).move_to(m.RIGHT * 3 + m.DOWN * 2)
        self.add_fixed_in_frame_mobjects(label)
        self.play(m.Write(label))
```

A text mobject placed in 3D turns with the camera and becomes unreadable from the side. `add_fixed_in_frame_mobjects` pins it to the screen plane so it stays legible while the scene rotates behind it.

## 6. Inspect, expecting notes rather than failures

```bash
manimgx inspect scene.py
manimgx inspect scene.py -t 1.5,4.0,end -o edges.png
```

3D scenes get the timeline and storyboard but skip the 2D layout checks, and notes such as a graph running off-screen do not set exit 1. That means the storyboard is the only gate — open it and look at where the camera actually points at each sampled moment.

## 7. Render

```bash
manimgx render scene.py RotatingCube
manimgx render scene.py RotatingCube -r 1280x720 --fps 30
```

A file with more than one scene needs the class name, and a draft resolution is the right first pass for a 3D scene where every frame is a full re-render.

## Pitfalls

- Treating a 3D inspect exit 0 as approval — layout checks do not run in 3D.
- Leaving ambient rotation on at the end, so the last frame is not the composition you designed.
- Placing labels in world space and expecting them to stay readable while the camera turns.
- Forgetting that `phi=90°` is edge-on, then wondering why a flat surface collapsed to a line.
- Using 2D coordinates as if they were screen coordinates — the camera projection changes both axes.
- Rendering a long 3D scene at 60 fps before checking the storyboard, which is minutes per mistake.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/scene-authoring.md`
- `best-practices/inspect-and-render.md`
- `usecases/first-math-scene.md`
- `usecases/ty-typecheck-setup.md`
