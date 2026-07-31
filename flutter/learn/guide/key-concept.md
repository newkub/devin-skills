# Key Concept

## แนวคิดพื้นฐานของ Flutter

Flutter เป็น framework สำหรับพัฒนาแอปพลิเคชัน cross-platform ที่ใช้ Dart เป็นภาษาหลัก

## หลักการทำงาน

```
┌─────────────────────────────────────────────────────────────┐
│                    Flutter Framework                        │
├─────────────────────────────────────────────────────────────┤
│  Flutter Engine (C++)                                       │
│  ├─ Skia (Graphics)                                         │
│  ├─ Dart VM                                                 │
│  └─ Text (Font rendering)                                   │
├─────────────────────────────────────────────────────────────┤
│  Framework Layer (Dart)                                     │
│  ├─ Widgets                                                 │
│  ├─ Rendering                                               │
│  ├─ Gestures                                                │
│  └─ Animation                                               │
├─────────────────────────────────────────────────────────────┤
│  Application Layer (Your Code)                              │
│  └─ Widgets, State Management, Business Logic               │
└─────────────────────────────────────────────────────────────┘
```

## Widget Tree

```
MyApp
 └─ MaterialApp
     └─ Scaffold
         ├─ AppBar
         └─ Body
             └─ Column
                 ├─ Text
                 └─ ElevatedButton
```

## Key Concepts

| Concept | Description |
|---------|-------------|
| **Widget** | หน่วยพื้นฐานของ UI ทุกอย่างคือ widget |
| **StatelessWidget** | Widget ที่ไม่มี state เปลี่ยนแปลง |
| **StatefulWidget** | Widget ที่มี state เปลี่ยนแปลงได้ |
| **BuildContext** | Context สำหรับ widget tree |
| **InheritedWidget** | ส่งข้อมูลลงไปใน widget tree |
