---
name: follow-tool-vllm
description: "vLLM LLM inference and serving — offline LLM API, OpenAI-compatible server, tuning, benchmarking"
argument-hint: "[offline|serve|tune|bench]"
related:
  - follow-lang-python
  - follow-my-techstack
  - follow-secret-manager
  - check-open-ports
  - deep-research
---

## Goal

Run LLM inference with vLLM (vllm.ai) — a high-throughput, memory-efficient inference and serving engine — offline batch inference via the `vllm.LLM` Python API, or online serving via the OpenAI-compatible server `vllm serve`

## Scope

Use when a Python project installs the `vllm` package or needs self-hosted LLM inference/serving — choosing the inference stack itself → `/follow-my-techstack`; platform/language rules (uv, venv) → `/follow-lang-python`

- Runs on Linux, macOS (via vLLM-Metal), WSL2, and Docker — no native Windows build
- Covers offline inference, OpenAI-compatible serving, parallelism/quantization tuning, benchmarking
- Per-topic guidance beyond this workflow → `best-practices/inference-serving.md`
- API/CLI lookup tables → `references/apis.md`, `references/cli.md`

## Execute

### 1. Check Environment And Install

> Goal: correct platform, Python, and wheels before anything runs

1. Platform gate: native Windows → stop; use WSL2 or the `vllm/vllm-openai` Docker image instead (the PyPI `vllm` wheel targets Linux CUDA/ROCm/XPU)
2. Python gate: vLLM requires `>=3.10,<3.15` (ROCm prebuilt wheels: 3.12 only) — create the env with `uv venv --python 3.12 --seed`
3. Check the installed version against the latest stable — run `/deep-research` to live-check version and breaking changes before pinning or upgrading
4. Install (NVIDIA): `uv pip install vllm --torch-backend=auto` then `vllm download-kernels` — installs FlashInfer precompiled kernels; without them startup compiles kernels for minutes on Hopper/Blackwell. Re-run after every vLLM install or upgrade (kernels are tied to the FlashInfer version)
5. Install (AMD ROCm ≥6.3): `uv pip install vllm --extra-index-url https://wheels.vllm.ai/rocm/`
6. Install (container): `docker run --runtime nvidia --gpus all -v ~/.cache/huggingface:/root/.cache/huggingface -p 8000:8000 --ipc=host vllm/vllm-openai:latest --model <model>` — `--ipc=host` is required for shared memory
7. Model weights come from Hugging Face Hub — gated models need `HF_TOKEN`; pass it via env per `/follow-secret-manager`, never commit it

### 2. Offline Inference

> Goal: batch-generate locally with the Python API

```python
from vllm import LLM, SamplingParams

llm = LLM(model="facebook/opt-125m")
prompts = ["Hello, my name is", "The future of AI is"]
sampling_params = SamplingParams(temperature=0.8, top_p=0.95)

outputs = llm.generate(prompts, sampling_params)
for output in outputs:
    print(f"Prompt: {output.prompt!r}, Generated: {output.outputs[0].text!r}")
```

- Chat models: `llm.chat(messages_list, sampling_params)` where `messages_list` is `[[{"role": "user", "content": ...}]]`, or apply the tokenizer chat template manually and use `llm.generate`
- Alternative model source: `export VLLM_USE_MODELSCOPE=True`
- More API surface → `references/apis.md`

### 3. Serve (OpenAI-Compatible)

> Goal: expose the model over an OpenAI-compatible HTTP API

1. Port gate before starting: run `/check-open-ports` on 8000 (or the chosen `--port`)
2. Start: `vllm serve <model>` (e.g. `vllm serve Qwen/Qwen2.5-1.5B-Instruct`); options `--port 8100` or `--uds /tmp/vllm.sock`
3. Endpoints: `/v1/models`, `/v1/completions`, `/v1/chat/completions`, `/v1/responses`, `/v1/chat/completions/batch`, `/v1/embeddings` (embedding models), `/v1/audio/transcriptions` (ASR models)
4. Client: point the `openai` SDK at the server — `OpenAI(api_key="EMPTY", base_url="http://localhost:8000/v1")` — or use the built-in clients `vllm chat` / `vllm complete --quick "..."` (`--stats` prints TTFT/throughput)
5. Public exposure: set `--api-key` (or `VLLM_API_KEY`) — warning: it authenticates only `/v1`, `/v2`, `/inference`; `/invocations` on the same server stays unauthenticated, so protect the host with network policy regardless

### 4. Tune Parallelism, Memory, Quantization

> Goal: fit the model and raise throughput without OOM

1. Context length first: `--max-model-len 4096` (accepts k/m/g suffixes) shrinks the KV cache — biggest memory win before touching anything else
2. Memory fraction: `--gpu-memory-utilization 0.9` (0–1) — lower it when the GPU is shared
3. Parallelism: `--tensor-parallel-size 4` (`-tp`) splits one model across GPUs; `--data-parallel-size` (`-dp`) replicates for throughput; `--pipeline-parallel-size` stages layers
4. Precision/quantization: `--dtype` (default `auto`; `bfloat16` balances precision/range, `half` recommended for AWQ) and `--quantization` for fp8/AWQ/GPTQ-style checkpoints
5. Throughput features: `--enable-prefix-caching` (shared prompt prefixes), `--enable-chunked-prefill`, `--attention-backend FLASH_ATTN|FLASHINFER`
6. Full flag list and defaults → `references/cli.md`; enumerate live with `vllm serve --help=all` or one group with `vllm serve --help=ModelConfig`

### 5. Benchmark And Debug

> Goal: measure, then prove the change improved something

1. Quick smoke without real weights: `vllm bench latency --model <model> --input-len 32 --output-len 1 --enforce-eager --load-format dummy`
2. Offline throughput: `vllm bench throughput ...`; live server: `vllm bench serve --model <model> --host <h> --port <p> --num-prompts 5 --random-input-len 32 --random-output-len 4`
3. Batch files (OpenAI batch format): `vllm run-batch -i requests.jsonl -o results.jsonl --model <model>`
4. Bug report/diagnosis: `vllm collect-env` dumps environment info; `vllm download-kernels --dry-run` shows the kernel install commands
5. Always record a baseline before tuning — re-run the same bench command after each change and report the delta via `/report`

## Rules

### 1. Platform And Version Facts

- No native Windows support — WSL2 or Docker only; third-party Windows forks are not official and out of scope
- Never hardcode a vLLM version in commands at use time — live-check latest stable and breaking changes via `/deep-research` (principle: `/follow-up-to-date`); `references/apis.md` records the version at research date only
- Run `vllm download-kernels` in the same Python environment after every install or upgrade

### 2. Secrets And Exposure

- `HF_TOKEN`, `--api-key`, `VLLM_API_KEY` come from env/secret manager per `/follow-secret-manager` — never in files or command history logged in reports
- Never expose a vLLM server publicly relying on `--api-key` alone (see endpoint caveat in step 3.5)

### 3. Reproducibility

- Pass `--seed` when comparing runs; use `--load-format dummy --enforce-eager` only for smoke tests, never for results you report
- Weights cache in `~/.cache/huggingface` — check free disk space before pulling large models

- Use /deep-research when version or API details look stale
- Use /follow-my-techstack when choosing between vLLM and other inference stacks

## Expected Outcome

- vLLM installed on a supported platform with kernels refreshed
- Offline generation and/or an OpenAI-compatible server verified with a real request
- Tuning choices backed by before/after `vllm bench` numbers
- No secrets in files; server exposure gated with key + network policy
