# Step

## ความหมาย

Step คืองานเดียวที่รัน command หรือ action แต่ละ step รันตามลำดับใน job เดียวกัน

## ประเภท

### Run Step

รัน command บน runner

```yaml
- name: Install Dependencies
  run: bun install
```

### Action Step

ใช้ action จาก GitHub Marketplace

```yaml
- name: Checkout
  uses: actions/checkout@v4
```

### Shell Step

รัน command ด้วย shell เฉพาะ

```yaml
- name: Run Script
  shell: pwsh
  run: ./script.ps1
```
