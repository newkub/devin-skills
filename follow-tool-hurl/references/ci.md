# Hurl CI Integration

> Source: https://hurl.dev/docs/tutorial/ci-cd-integration.html

## GitHub Actions

ไม่มี official action — install binary ใน workflow:

```yaml
- name: Install Hurl
  run: |
    curl --location --remote-name https://github.com/Orange-OpenSource/hurl/releases/download/8.0.1/hurl-8.0.1-x86_64-unknown-linux-gnu.tar.gz
    tar xvf hurl-8.0.1-x86_64-unknown-linux-gnu.tar.gz
    echo "$PWD/hurl-8.0.1-x86_64-unknown-linux-gnu/bin" >> "$GITHUB_PATH"

- name: Run API tests
  run: hurl --test --report-junit build/junit.xml --report-html build/reports tests/api/
```

ทางเลือก: npm binary `bunx @orangeopensource/hurl` หรือ Docker `ghcr.io/orange-opensource/hurl:latest`

## Pairing

- JUnit: `dorny/test-reporter` หรือ `EnricoMi/publish-unit-test-result-action`
- Artifacts: `actions/upload-artifact` สำหรับ `--report-html`/`--report-json`
- Secrets: `--variable token=${{ secrets.API_TOKEN }}` — ไม่ commit `.env` variables files
