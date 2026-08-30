# ESLint Rule Structure: meta Object Reference

อ้างอิงโครงสร้างพื้นฐานของ custom ESLint rule และ `meta` object ครอบคลุม `type`, `docs`, `messages`, `fixable`, `hasSuggestions` และ `schema`

## โครงสร้างพื้นฐาน

Rule file ส่งออก object ที่มี `meta` และ `create`:

```javascript
// customRule.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Description of the rule",
    },
    fixable: "code",
    schema: [], // no options
  },
  create(context) {
    return {
      // callback functions (visitors)
    };
  },
};
```

## meta Object

### type

`type` ระบุประเภทของ rule มี 3 ค่า:

- `"problem"` — code ที่อาจทำให้เกิด error หรือ behavior สับสน ควรแก้ไขเร่งด่วน
- `"suggestion"` — code ที่ทำได้ดีกว่า แต่ไม่มี error ถ้าไม่เปลี่ยน
- `"layout"` — เกี่ยวกับ whitespace, semicolons, commas, parentheses ส่วนที่กำหนดหน้าตา code ไม่ใช่การทำงาน

ใช้กับ CLI option `--fix-type` เพื่อระบุประเภท fix ที่ต้องการ apply

### docs

```javascript
docs: {
  description: "Description of the rule",
  dialects: ["JavaScript", "TypeScript"],
  url: "https://example.com/docs/rule-name",
}
```

- `description` — คำอธิบายสั้นๆ ของ rule
- `dialects` — dialect ของภาษาที่ rule รองรับ เช่น `["JavaScript", "TypeScript"]`
- `url` — URL เอกสารเต็ม ใช้ใน editor เพื่อแสดง link บน violation

### messages

object ที่เก็บ violation และ suggestion messages อ้างอิงด้วย key (`messageId`) ใน `context.report()`:

```javascript
messages: {
  avoidName: "Avoid using variables named '{{ name }}'",
  unexpected: "Unexpected identifier: {{ identifier }}",
}
```

### fixable

ระบุ `"code"` หรือ `"whitespace"` ถ้า `--fix` สามารถแก้ปัญหาอัตโนมัติได้

สำคัญ: `fixable` เป็น mandatory สำหรับ fixable rules ถ้าไม่ระบุ ESLint จะ throw error เมื่อ rule พยายาม produce fix ถ้า rule ไม่ fix ได้ให้ omit คุณสมบัตินี้

### hasSuggestions

`boolean` ระบุว่า rule สามารถ return suggestions ได้หรือไม่ (default `false`)

สำคัญ: `hasSuggestions` เป็น mandatory สำหรับ rules ที่ provide suggestions ต้องตั้งเป็น `true` ไม่งั้น ESLint จะ throw error

### schema

ระบุ options ของ rule เป็น JSON Schema format เพื่อให้ ESLint validate configuration และป้องกัน invalid inputs:

```javascript
// array format — แต่ละ element ตรวจสอบกับ context.options ตามตำแหน่ง
schema: [
  {
    enum: ["single", "double", "backtick"],
  },
  {
    type: "object",
    properties: {
      exceptRange: { type: "boolean" },
    },
    additionalProperties: false,
  },
],
```

- ถ้า rule ไม่มี options ให้ omit `schema` หรือใช้ `schema: []`
- ถ้าต้องการ opt-out validation ใช้ `schema: false` (ไม่แนะนำ)
- ใช้ `defaultOptions` เพื่อระบุ default options ที่ user options จะ merge ทับ
