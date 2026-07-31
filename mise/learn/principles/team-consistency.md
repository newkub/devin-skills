# Team Consistency

ทุกคนใน team ควรใช้ environment เดียวกัน

## หลักการ

- Commit `.mise.toml` ใน repository
- ใช้ mise ใน CI/CD
- Document setup process

## การทำงาน

```yaml
# .github/workflows/ci.yml
- uses: jdx/mise-action@v2
  with:
    version: latest
```

## ประโยชน์

- ลด "works on my machine" issues
- ทำให้ debugging ง่ายขึ้น
- เพิ่ม confidence ใน deployments
