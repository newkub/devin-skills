# ESLint Rule Structure Reference

อ้างอิงโครงสร้างของ custom ESLint rule ครอบคลุม `meta` object, `create` function, `context.report`, `context.sourceCode` และ AST traversal

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

**สำคัญ:** `fixable` เป็น mandatory สำหรับ fixable rules ถ้าไม่ระบุ ESLint จะ throw error เมื่อ rule พยายาม produce fix ถ้า rule ไม่ fix ได้ให้ omit คุณสมบัตินี้

### hasSuggestions

`boolean` ระบุว่า rule สามารถ return suggestions ได้หรือไม่ (default `false`)

**สำคัญ:** `hasSuggestions` เป็น mandatory สำหรับ rules ที่ provide suggestions ต้องตั้งเป็น `true` ไม่งั้น ESLint จะ throw error

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

## create Function

`create()` รับ `context` เป็น argument เดียว แล้ว return object ที่มี methods สำหรับ "visit" nodes ขณะ traverse AST:

```javascript
create(context) {
  return {
    ReturnStatement(node) {
      // ถูกเรียกตอน going down ที่ ReturnStatement node
    },
    "FunctionExpression:exit": checkLastSegment,
    "ArrowFunctionExpression:exit": checkLastSegment,
    onCodePathStart(codePath, node) {
      // ตอนเริ่ม code path analysis
    },
    onCodePathEnd(codePath, node) {
      // ตอนจบ code path analysis
    },
  };
}
```

- key เป็น node type หรือ selector → ESLint เรียก visitor ตอน going **down**
- key เป็น node type/selector + `:exit` → ESLint เรียก visitor ตอน going **up**
- key เป็น event name → ESLint เรียก handler สำหรับ code path analysis

## context Object

### Properties

| Property | Type | รายละเอียด |
|----------|------|-----------|
| `id` | `string` | rule ID |
| `filename` | `string` | filename ของ source |
| `physicalFilename` | `string` | full path บน disk |
| `cwd` | `string` | current working directory |
| `options` | `array` | configured options ของ rule (ไม่รวม severity) |
| `sourceCode` | `object` | `SourceCode` object |
| `settings` | `object` | shared settings จาก configuration |
| `languageOptions` | `object` | `sourceType`, `ecmaVersion`, `parser`, `parserOptions`, `globals` |

### context.report()

Method หลักสำหรับ report ปัญหา รับ object ที่มี properties:

```javascript
context.report({
  node,                          // AST node, token, หรือ comment (ต้องมี node หรือ loc)
  loc: {                         // ระบุตำแหน่ง (ใช้แทน node)
    start: { line: 1, column: 0 },
    end: { line: 1, column: 5 },
  },
  messageId: "avoidName",        // แนะนำให้ใช้ messageId แทน message
  message: "Unexpected identifier", // ใช้แทน messageId ได้
  data: { name: "foo" },         // placeholder data สำหรับ message
  fix(fixer) {                   // ฟังก์ชัน fix (ต้องตั้ง meta.fixable)
    return fixer.insertTextAfter(node, ";");
  },
  suggest: [                     // suggestions (ต้องตั้ง meta.hasSuggestions: true)
    {
      messageId: "removeEscape",
      data: { character },
      fix(fixer) {
        return fixer.removeRange(range);
      },
    },
  ],
});
```

### context.options

array ของ configured options ไม่รวม severity:

```javascript
// config: "quotes": ["error", "double"]
// context.options[0] === "double"
create(context) {
  const isDouble = context.options[0] === "double";
  // ...
}
```

### context.sourceCode

`SourceCode` object สำหรับเข้าถึง source code:

```javascript
create(context) {
  const sourceCode = context.sourceCode;
  // ...
}
```

Methods ที่ใช้บ่อย:

- `getText(node)` — source code ของ node (omit node เพื่อ get ทั้งหมด)
- `getAllComments()` / `getCommentsBefore(node)` / `getCommentsAfter(node)` / `getCommentsInside(node)` — เข้าถึง comments
- `isSpaceBetween(a, b)` — `true` ถ้ามี whitespace ระหว่างสอง tokens/nodes
- `getFirstToken(node)` / `getLastToken(node)` / `getTokenBefore(node)` / `getTokenAfter(node)` / `getTokens(node)` — เข้าถึง tokens
- `getAncestors(node)` — ancestors ของ node จาก root ถึง parent
- `getScope(node)` — scope ของ node
- `getDeclaredVariables(node)` — variables ที่ node ประกาศ

Properties:

- `text` — full source text
- `ast` — `Program` node ของ AST
- `scopeManager` — ScopeManager object
- `visitorKeys` — visitor keys สำหรับ traverse AST
- `parserServices` — services จาก custom parser (เช่น TypeScript type info)

## fixer Object

`fix(fixer)` รับ `fixer` object มี methods:

```javascript
fix(fixer) {
  return fixer.insertTextAfter(node, ";");      // แทรก text หลัง node
  // fixer.insertTextBefore(node, text)
  // fixer.insertTextAfterRange(range, text)
  // fixer.insertTextBeforeRange(range, text)
  // fixer.remove(nodeOrToken)
  // fixer.removeRange(range)
  // fixer.replaceText(nodeOrToken, text)
  // fixer.replaceTextRange(range, text)
}
```

`fix()` สามารถ return `fixing` object, array ของ `fixing` objects, หรือ iterable (generator):

```javascript
*fix(fixer) {
  yield fixer.replaceText(node, replacementText);
  yield fixer.insertTextBefore(node.parent, "");
  yield fixer.insertTextAfter(node.parent, "");
}
```

Best practices สำหรับ fixes:

- หลีกเลี่ยง fixes ที่เปลี่ยน runtime behavior
- ทำ fixes ให้เล็กที่สุดเพื่อลด conflict
- ทำ fix เดียวต่อ message
- ESLint รัน rules ซ้ำหลัง fix (สูงสุด 10 รอบ) ไม่ต้องกังวลเรื่อง style conflict

## ตัวอย่าง Rule แบบสมบูรณ์

```javascript
// no-console.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: { description: "Disallow the use of console" },
    hasSuggestions: true,
    messages: {
      unexpectedConsole: "Unexpected console statement.",
      removeConsole: "Remove the console statement.",
    },
    schema: [{
      type: "object",
      properties: {
        allow: { type: "array", items: { enum: ["log", "warn", "error", "info", "debug"] } },
      },
      additionalProperties: false,
    }],
  },
  create(context) {
    const allowed = context.options[0]?.allow || [];
    return {
      MemberExpression(node) {
        if (node.object.name === "console" && !allowed.includes(node.property.name)) {
          context.report({
            node,
            messageId: "unexpectedConsole",
            suggest: [{
              messageId: "removeConsole",
              fix(fixer) {
                const stmt = node.parent?.parent;
                return stmt?.type === "ExpressionStatement" ? fixer.remove(stmt) : null;
              },
            }],
          });
        }
      },
    };
  },
};
```

## Sources

- https://eslint.org/docs/latest/extend/custom-rules
- https://eslint.org/docs/latest/extend/custom-rule-tutorial
- https://eslint.org/docs/latest/extend/plugins
