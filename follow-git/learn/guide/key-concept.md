# Key Concepts

## Repository

Git repository คือที่เก็บ project ทั้งหมด รวมถึง:
- ไฟล์โค้ดทั้งหมด
- History ของการเปลี่ยนแปลงทุก commit
- Configuration และ metadata
- Branches ทั้งหมด

มี 2 ประเภท:
- **Local Repository**: อยู่บนเครื่องของคุณ
- **Remote Repository**: อยู่บน server (GitHub, GitLab, Bitbucket)

## Commit

Commit คือ snapshot ของ project ในช่วงเวลาหนึ่ง:
- มี unique ID (SHA hash)
- มี author, timestamp, และ commit message
- บันทึกการเปลี่ยนแปลงทั้งหมด
- สามารถ revert กลับได้ทุกเมื่อ

## Branch

Branch คือเส้นทางการพัฒนาที่แยกออกมา:
- ใช้สำหรับ develop features แยกกัน
- ไม่กระทบกับ main branch
- สามารถ merge กลับมาได้เมื่อเสร็จ
- ช่วยลดความขัดแย้งในการทำงาน

## Merge

Merge คือการรวม branches เข้าด้วยกัน:
- รวมการเปลี่ยนแปลงจากหลาย branches
- อาจเกิด conflicts ถ้าแก้ไขไฟล์เดียวกัน
- ต้อง resolve conflicts ก่อน merge เสร็จ
- มีหลาย strategy: merge commit, squash, rebase

## Remote

Remote คือ repository บน server:
- ใช้สำหรับ collaboration
- backup และ sharing
- CI/CD integration
- Code review ผ่าน Pull Requests

## Staging Area

Staging area (index) คือพื้นที่ระหว่าง working directory และ repository:
- เลือกไฟล์ที่จะ commit
- review การเปลี่ยนแปลงก่อน commit
- สามารถ unstage ได้
- ใช้ `git add` เพื่อ stage ไฟล์

## HEAD

HEAD คือ pointer ที่ชี้ไปยัง commit ปัจจุบัน:
- บอกว่าคุณอยู่ที่ branch ไหน
- ใช้สำหรับ navigation ระหว่าง commits
- สามารถ move ไปยัง commit ใดก็ได้ (detached HEAD)
