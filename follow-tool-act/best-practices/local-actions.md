# act Best Practices

แนวทางใช้ `act` (nektos/act) รัน GitHub Actions บน local อย่างมีประสิทธิภาพ ลดเวลา debug และหลีกเลี่ยง pitfalls ที่เจอบ่อย

## Recommended Patterns

### วินัยในการรัน

- รัน `act -n` (dry run) ก่อนเสมอเพื่อดู execution plan — ถ้า plan ผิดจะเสียเวลา pull image และรัน container ฟรี
- รันเฉพาะ job ที่แก้ด้วย `act <event> -j <job>` ไม่ใช่รันทั้ง workflow ทุกครั้ง
- ใช้ `--matrix` เพื่อรัน matrix combination เดียว เช่น `act -j test --matrix node:20` แทนการรันทั้ง matrix
- ใช้ `-W <path>` เลือก workflow file เฉพาะเมื่อ repo มีหลาย workflows
- สร้าง event payload จริงด้วย `-e event.json` เมื่อ workflow อ่าน `github.event` fields เช่น `pull_request.number` หรือ `workflow_dispatch.inputs`

### Image Selection

- Default micro image (`node:16-buster-slim` based) เบาแต่ขาด tools หลายตัว — ถ้า job ใช้ `python`, `gcc`, หรือ common system tools ให้เปลี่ยนเป็น medium หรือ large image
- Medium image `ghcr.io/catthehacker/ubuntu:act-latest` คุ้มสุดสำหรับงานทั่วไป — มี tools ครบพอแต่ยังเล็กกว่า full image (large อาจเกิน 20GB)
- Map platform เฉพาะที่ใช้: `-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest` แทนการ override ทุก platform
- บนเครื่อง ARM (Apple Silicon) ใส่ `--container-architecture linux/amd64` เสมอเพื่อเลียนแบบ GitHub-hosted runners

### Secrets And Env

- แยก secrets ออกจาก env: secrets ใช้ `-s KEY=value` หรือ `--secret-file`, env ปกติใช้ `--env-file`
- ใช้ `.env` หรือ `.secrets` file ที่ gitignore ไว้แทนการส่ง `-s` ยาวๆ ทุกครั้ง
- `act` สร้าง `GITHUB_TOKEN` ปลอมให้เอง — ถ้า step เรียก GitHub API จริงต้องส่ง token จริงผ่าน `-s GITHUB_TOKEN=$(gh auth token)` แต่ระวังอย่า log ค่าออกมา
- ตั้ง `.actrc` ที่ repo root สำหรับ default flags เช่น platform map, container architecture — ทีมจะได้ config เดียวกัน (commit ได้ แต่ห้ามใส่ secrets)

## Common Pitfalls

| Pitfall | อาการ | วิธีหลีกเลี่ยง |
|---|---|---|
| Docker daemon ไม่ได้รัน | `Cannot connect to the Docker daemon` | เช็ค `docker info` ก่อนเสมอ |
| `runs-on: windows/macos` | job ไม่รันหรือ map ผิด | act รันเฉพาะ Linux containers — skip jobs เหล่านี้ ไป test บน remote |
| OIDC / `id-token: write` | token request fail | act ไม่รองรับ OIDC — mock หรือ skip step นั้น |
| Reusable workflows บางรูปแบบ | parse/resolve error | inline workflow หรือ test บน remote แทน |
| `github.event` ว่าง | inputs/paths เป็น null | ส่ง `-e event.json` ที่มี fields ครบ |
| first pull ช้ามาก | ดูเหมือนค้าง | large image หลาย GB — ใช้ medium image หรือ pull ล่วงหน้า |
| Artifact/cache ข้าม job | job ถัดไปหาไฟล์ไม่เจอ | ใช้ `--artifact-server-path` สำหรับ artifacts; actions/cache ต้องมี cache server เสริม |
| Host path ใน container | volume mount พลาด | ใช้ `--bind` ให้ workspace mount แทนการ copy |

## Do / Don't

| Do | Don't |
|---|---|
| dry run (`-n`) ก่อนรันจริง | รันทุก workflow ทุกครั้งที่แก้ YAML |
| ใส่ `.secrets` ใน `.gitignore` | commit secrets file หรือส่ง `-s` ใน script ที่ commit |
| เทียบผลกับ runner จริงเมื่อ log ต่าง | สมมติว่าผ่าน act แล้วผ่าน GitHub เสมอ |
| แยก workflow bug กับ act limitation | แก้ workflow ให้ผ่าน act จนเสีย remote behavior |
| ใช้ `-v` เมื่อ log ไม่พอ | เปิด verbose ตลอดจนอ่าน log ไม่รอด |

## Performance And CI Notes

- First run ช้าเพราะ pull image — run ถัดไปเร็วเพราะ Docker cache; `--reuse` ใช้ container เดิมซ้ำได้ (state ค้าง ระวัง stale artifacts)
- `--rm` default จะลบ container หลังจบ — ดีสำหรับ CI-clean behavior แต่ debug ยาก; ถ้าต้องเข้าไป inspect ให้รัน job เดียวแล้ว exec เข้า container ก่อนปิด
- matrix jobs รัน sequential ใน act — ถ้า matrix ใหญ่ให้ filter ด้วย `--matrix` เสมอ
- ใช้ act เป็น pre-push gate ใน local workflow; ไม่ควรเอา act ไปรันใน CI จริง (ซ้ำซ้อนกับ runner จริง)
- Output ยาว → pipe ผ่าน `tee` เก็บ log ไว้เทียบกับ remote run ภายหลัง

## Config Guidance

`.actrc` (per-repo, commit ได้):

```text
-P ubuntu-latest=ghcr.io/catthehacker/ubuntu:act-latest
--container-architecture linux/amd64
--env-file .env
```

- หนึ่ง flag ต่อบรรทัด; comment ด้วย `#`
- เพิ่ม `.env`, `.secrets`, `event.json` (ถ้ามี credentials) ใน `.gitignore`
- เก็บ `event.json` template ใน repo เช่น `.github/act/pull_request.json` เพื่อให้ทีมใช้ payload เดียวกัน
