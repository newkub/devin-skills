# vLLM Inference And Serving Best Practices

Written from official docs research (docs.vllm.ai stable, 2026-10-18) — no version pins; live-check current practice via `/deep-research` at use time.

## Choose The Right Entry Point

- One-off / batch generation inside Python → offline `LLM` API (`llm.generate` / `llm.chat`) — no server overhead
- Applications consuming an API, multi-client, tooling built on the OpenAI SDK → `vllm serve` and point clients at `http://localhost:8000/v1`
- Quick manual checks without writing client code → `vllm chat` / `vllm complete --quick` (add `--stats` for TTFT/throughput)
- Don't run a server just to test one prompt offline, and don't embed `LLM` in a web app that could use the OpenAI-compatible server

## Install Hygiene

- On NVIDIA Hopper/Blackwell always run `vllm download-kernels` after each install or upgrade — without the FlashInfer precompiled kernels, startup compiles for several minutes; kernels are tied to the FlashInfer version and refuse to import on mismatch, so an upgrade without a refresh breaks
- Use a dedicated venv (`uv venv --python 3.12`); ROCm prebuilt wheels exist for Python 3.12 only — another version silently falls back to the CUDA wheel and fails later with confusing `libcudart.so` errors
- On Windows there is no native wheel: use WSL2 or the official `vllm/vllm-openai` Docker image; treat third-party Windows forks as unofficial
- Docker needs `--ipc=host` (shared memory for the engine) and a mounted `~/.cache/huggingface` to avoid re-downloading weights

## Memory And Throughput Tuning

- Order of attack when the model does not fit: reduce `--max-model-len` (KV cache shrinks with context) → lower `--gpu-memory-utilization` (default 0.92) on shared GPUs → add `--tensor-parallel-size` → quantize (`--quantization`, `--dtype half` for AWQ)
- Measure, don't guess: baseline with `vllm bench throughput` (offline) or `vllm bench serve` (live server) before every tuning change, re-run the same command after, report the delta
- `--load-format dummy --enforce-eager` is for smoke/bench plumbing only — results are not representative; never report them as model performance
- `--enable-prefix-caching` pays off when many requests share prompt prefixes (system prompts, few-shot templates); `--enable-chunked-prefill` smooths prefill/decode interference under mixed load
- Multi-GPU: `-tp` splits one model across GPUs; `-dp` replicates for aggregate throughput; MoE sharding follows the product of parallel sizes — verify with `vllm serve --help=all` rather than assuming
- `vllm preload` + `--load-format ipc_cache` avoids reloading identical weights across engines on the same host

## Serving Correctly And Safely

- `--api-key`/`VLLM_API_KEY` authenticates only `/v1`, `/v2`, `/inference` paths — `/invocations` and other endpoints on the same server stay unauthenticated: never rely on the key alone for a public host, keep the server behind network policy
- Use `--served-model-name` when clients should not know the real checkpoint id
- Parallel tool calls in chat are model-dependent — the server gives no guarantee of more than one tool call per request; set the option explicitly only when the model supports it
- Pin `--seed` when A/B comparing outputs across runs; temperature 0 alone is not enough for reproducibility on some kernels
- Weight caches are large — check free disk before pulling 70B-class models; cache lives in `~/.cache/huggingface`

## Upgrading

- Breaking changes land frequently in 0.x releases: before upgrading read the release notes (`/deep-research` on the GitHub releases page), then re-run install + `vllm download-kernels` + the bench baseline in the same session
- Custom container images based on `vllm/vllm-openai`: keep the pip `vllm[...]` extra version equal to the base image tag — mismatched pairs break imports
