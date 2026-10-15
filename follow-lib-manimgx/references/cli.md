| command | description | options |
|---|---|---|
| `manimgx --version` | prints the version, confirming the right tool is installed | --version, --help |
| `manimgx inspect <file> [Scene]` | run the scene without making a video — prints the timeline (each play with its code line), checks 2D layout, writes `<Scene>.storyboard.png`; exit 1 when there are layout problems | -t/--time `<sec>|end` (repeat or comma-separated), -o/--output `<path>` |
| `manimgx render <file> [Scene]` | makes the MP4 next to the file then prints the path (+ `.storyboard.png`, `.srt` when the scene speaks) | -o/--output (default `<Scene>.mp4`), -r/--resolution `WxH` (default 1920x1080), --fps `<int≥1>` (default 60), --preset `ultrafast…placebo` (default medium), --crf `<0–51>` (default 23.0) |
| `manimgx preview <file> [Scene]` | opens a window playing the scene and replays on every save of the file or a module imported next to it | keys: Space play/pause, ←/→ ±5s, `,`/`.` one frame at a time, Ctrl/Option+←/→ one play at a time, N/P switch scene, ? shows keys, Ctrl+C/close window stops |
| `manimgx present <file> [Scene]` | makes the video then shows sections as slides in the browser (pairs with `self.next_section()`) | like `render` |
| `uv tool install --python 3.14 manimgx` | installs the CLI on PATH (recommended for agents) | keep `--python 3.14`; PATH missing `~/.local/bin` → `uv tool update-shell` then reopen the shell |
| `uvx --python 3.14 manimgx <command>` | run the CLI without a permanent install | — |
| `pip install manimgx` | install inside a Python 3.13/3.14 venv | older interpreters won't find the package |
| `npm install manimgx` | installs the web player (`<manimgx-player>` + Pyodide/WebGPU) | — |
| `ty check <file>` | type-check the scene (catches unknown keywords/API names before render) | --python `<interpreter that has manimgx installed>` — otherwise it reports `unresolved-import`; venv = `.venv/Scripts/python.exe` (Windows) / `.venv/bin/python`, uv tool = `<uv tool dir>/manimgx/Scripts/python.exe` or `/bin/python`; https://docs.astral.sh/ty/ |
