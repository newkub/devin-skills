---
name: run-stakeholder-reviews
description: เก็บ findings จากแต่ละ roleplay
---

# Run Stakeholder Reviews

## Goal

เก็บ findings จากแต่ละ roleplay

## Checks

1. ทำ `/consider-use-subagents` หรือ `/follow-devin-global-subagents` เพื่อ run แต่ละ `/roleplay-*` ที่เลือกพร้อมกัน
2. ส่ง context ที่พบไปให้ทุก roleplay: project type, stack, critical paths, assumptions
3. ถ้าไม่สามารถ parallel ได้ → ทำ `/roleplay-*` ทีละตัวตามลำดับ priority
4. บันทึก findings จากแต่ละ roleplay

