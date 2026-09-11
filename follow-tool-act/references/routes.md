# Tool Act Routes / Topics

| Route / Topic | URL |
|---|---|
| Docs | https://nektosact.com |
| Repository | https://github.com/nektos/act |
| Runner images | https://github.com/catthehacker/docker_images |
| Installation | https://nektosact.com/installation/index.html |
| Known limitations | https://nektosact.com/not_supported.html |
| .actrc config | https://nektosact.com/usage/index.html#actrc |

## Key Concepts

- รัน `.github/workflows/` ใน Docker containers — จำลอง GitHub-hosted runners
- Image sizes: `act-latest` (medium ~recommended), `full-*` (large, เหมือน GitHub จริง)
- Limitations: `services`, GitHub-specific context (`github.token`), `runs-on` ≠ ubuntu
- ใช้คู่กับ `/follow-tool-github-actions` สำหรับ debug workflow local
