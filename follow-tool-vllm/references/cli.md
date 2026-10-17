# vLLM CLI Reference

Source: https://docs.vllm.ai/en/stable/cli/ · https://docs.vllm.ai/en/stable/cli/serve/ (retrieved 2026-10-18)

## Commands

| command | description | options |
|---------|-------------|---------|
| `vllm --help` | top-level help | — |
| `vllm serve <model>` | start the OpenAI-compatible API server | positional `<model>`, all engine/API flags below |
| `vllm chat` | interactive chat client against a running server | `--url http://host:port/v1`, `--quick "hi"`, `--stats` |
| `vllm complete` | interactive completion client against a running server | `--url ...`, `--quick "..."`, `--stats` |
| `vllm launch render <model>` | launch the rendering server component only | `--help=all` for flags |
| `vllm bench latency` | offline latency benchmark | `--model`, `--input-len`, `--output-len`, `--enforce-eager`, `--load-format dummy` |
| `vllm bench throughput` | offline throughput benchmark | `--model`, `--input-len`, `--output-len`, `--enforce-eager`, `--load-format dummy` |
| `vllm bench serve` | benchmark a live server | `--model`, `--host`, `--port`, `--num-prompts`, `--random-input-len`, `--random-output-len` |
| `vllm run-batch` | run OpenAI batch-format jsonl against a model | `-i <file-or-url>.jsonl`, `-o results.jsonl`, `--model` |
| `vllm preload` | one weight-cache daemon per GPU, engines load via `--load-format ipc_cache` | `--model`, `--tensor-parallel-size` |
| `vllm collect-env` | dump environment info for bug reports | — |
| `vllm download-kernels` | install FlashInfer precompiled kernels for the installed FlashInfer/CUDA | `--dry-run` |

## Help discovery

| command | description |
|---------|-------------|
| `vllm serve --help=all` | list every flag |
| `vllm serve --help=ModelConfig` | show one argument group |
| `vllm serve --help=max-num-seqs` | show one argument |
| `vllm serve --help=max` | search flags by keyword |

## Common `vllm serve` flags

| flag | default | description |
|------|---------|-------------|
| `--port` | 8000 | HTTP port |
| `--host` | — | bind address |
| `--uds` | — | unix domain socket instead of TCP (`/tmp/vllm.sock`) |
| `--api-key` | none | require key in header for `/v1`, `/v2`, `/inference` only (env `VLLM_API_KEY`) |
| `--served-model-name` | model id | name clients pass in requests |
| `--max-model-len` | from model config | context length; accepts k/m/g human-readable suffixes |
| `--gpu-memory-utilization` (alias `--device-memory-utilization`) | 0.92 | fraction (0–1) of GPU memory for the model executor (per-instance limit) |
| `--tensor-parallel-size`, `-tp` | 1 | tensor parallel groups (split one model across GPUs) |
| `--pipeline-parallel-size` | 1 | pipeline parallel stages |
| `--data-parallel-size`, `-dp` | 1 | data parallel groups |
| `--dtype` | `auto` | `half`/`float16`, `bfloat16`, `float`/`float32`; `half` recommended for AWQ |
| `--quantization` | auto-detect | quantization method for checkpoints (fp8/AWQ/GPTQ-style) |
| `--load-format` | auto | e.g. `dummy` (no weights, smoke tests), `ipc_cache` (from preload daemons) |
| `--enforce-eager` | off | disable CUDA graphs (faster startup, slower serving) |
| `--enable-prefix-caching` / `--no-enable-prefix-caching` | — | cache shared prompt prefixes (`--prefix-caching-hash-algo`: `sha256`, `xxhash`, ...) |
| `--enable-chunked-prefill` / `--no-enable-chunked-prefill` | — | chunk prefill by remaining `max_num_batched_tokens` |
| `--attention-backend` | auto | e.g. `FLASH_ATTN`, `FLASHINFER` (offline scripts pass the same flag) |
| `--seed` | — | random seed for reproducible runs |
| `--distributed-executor-backend` | auto | e.g. `mp` (multi-process; Ray for clusters) |

## Model source flags/env

| key | value |
|-----|-------|
| model id | Hugging Face Hub repo id (`Qwen/Qwen2.5-1.5B-Instruct`) or local path |
| `--revision` | HF branch/tag/commit for the weights |
| `HF_TOKEN` | env — access token for gated models |
| `VLLM_USE_MODELSCOPE=True` | env — pull from ModelScope instead |
