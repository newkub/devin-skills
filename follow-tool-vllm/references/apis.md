# vLLM API Reference

Source: https://docs.vllm.ai/en/stable/getting_started/quickstart/ · https://docs.vllm.ai/en/stable/serving/online_serving/openai_compatible_server/ · https://pypi.org/project/vllm/ (retrieved 2026-10-18)

## Metadata

| key | value |
|-----|-------|
| package | `vllm` |
| install cmd | `uv pip install vllm --torch-backend=auto` (NVIDIA) · `uv pip install vllm --extra-index-url https://wheels.vllm.ai/rocm/` (AMD) |
| post-install | `vllm download-kernels` (FlashInfer precompiled kernels; repeat after every install/upgrade) |
| stable version | 0.31.0 (PyPI, published 2026-10-05) |
| requires-python | `>=3.10,<3.15` (ROCm prebuilt wheels: 3.12 only) |
| license | Apache-2.0 |
| docs | https://docs.vllm.ai/en/stable/ |
| repo | https://github.com/vllm-project/vllm |
| site | https://vllm.ai/ |
| docker | `vllm/vllm-openai` · `vllm/vllm-openai-rocm` · `vllm/vllm-openai-xpu` |
| platform | Linux (CUDA/ROCm/XPU/TPU), macOS (vLLM-Metal), WSL2, Docker — no native Windows |

## Python API

| api | description | signature/example |
|-----|-------------|-------------------|
| `vllm.LLM` | offline engine for one model | `llm = LLM(model="facebook/opt-125m")` |
| `LLM.generate` | batch completion over prompt strings | `outputs = llm.generate(prompts, sampling_params)` |
| `LLM.chat` | batch chat over message lists (applies chat template) | `outputs = llm.chat(messages_list, sampling_params)` |
| `RequestOutput` | one generated result | `output.prompt`, `output.outputs[0].text` |
| `vllm.SamplingParams` | sampling options | `SamplingParams(temperature=0.8, top_p=0.95, max_tokens=...)` |
| chat template (offline) | render messages before `generate` | `AutoTokenizer.from_pretrained(path).apply_chat_template(messages_list, tokenize=False, add_generation_prompt=True)` |
| ModelScope source | use ModelScope hub instead of HF | `export VLLM_USE_MODELSCOPE=True` |

## OpenAI-Compatible HTTP API (served by `vllm serve`)

| endpoint | description | example |
|----------|-------------|---------|
| `GET /v1/models` | list served models | `curl http://localhost:8000/v1/models` |
| `POST /v1/completions` | text completions | `{"model": "...", "prompt": "San Francisco is a", "max_tokens": 7, "temperature": 0}` |
| `POST /v1/chat/completions` | chat completions | `{"model": "...", "messages": [{"role": "user", "content": "..."}]}` |
| `POST /v1/chat/completions/batch` | OpenAI batch chat format | batch request files (see `vllm run-batch`) |
| `POST /v1/responses` | Responses API (`GET /v1/responses/{id}`, `POST .../cancel`) | text generation models only |
| `POST /v1/embeddings` | embeddings | embedding models only |
| `POST /v1/audio/transcriptions` | speech to text | ASR models only |
| `openai` SDK client | point official SDK at vLLM | `OpenAI(api_key="EMPTY", base_url="http://localhost:8000/v1")` |

## Environment variables

| variable | description | value |
|----------|-------------|-------|
| `HF_TOKEN` | Hugging Face access token for gated weights | secret, via env only |
| `VLLM_API_KEY` | server API key (alternative to `--api-key`) | secret |
| `VLLM_USE_MODELSCOPE` | pull models from ModelScope | `True` |
| `VLLM_TARGET_DEVICE` | build target for source install | `cuda`, `cpu`, `empty`, `xpu`, ... |
| `VLLM_USE_PRECOMPILED` | editable install using precompiled binaries | `1` |
