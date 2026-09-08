# Edge.js Syntax Quick Reference

## Interpolation

ใช้ `{{ expression }}` สำหรับ JavaScript expression ใดก็ได้

```edge
{{ user.username }}
{{ user.username.toUpperCase() }}
{{ (2 + 2) * 3 }}
{{ (await getUser()).username }}
```

- output ถูก convert เป็น string โดยอัตโนมัติ
- array จะถูก stringified ด้วย `String(array)` ค่า default คั้นด้วย comma
- ใช้ `.join(', ')` ถ้าต้องการกำหนด format

## Multiline expressions

เปิด `{{` และปิด `}}` ต้องอยู่บน line เดียวกัน

```edge
{{
  users.map((user) => {
    return user.username
  }).join(', ')
}}
```

## Escaped HTML output

```edge
{{ '<span>safe</span>' }}
```

output จะถูก HTML-escape อัตโนมัติ

ถ้าต้องการ raw HTML ใช้ triple braces

```edge
{{{
  '<span>raw html</span>'
}}}
```

หรือใช้ `html.safe()`

```edge
{{ html.safe('<span>raw html</span>') }}
```

## Skip curly braces

ใช้ `@` นำหน้า `{{` เมื่อต้องการให้ Edge ไม่ประมวลผล

```edge
@{{ username }}
```

## Comments

```edge
{{-- inline comment --}}

{{--
  multi-line
  comment
--}}
```

## Conditionals

```edge
@if(user)
  <p>{{ user.username }}</p>
@elseif(user.email)
  <p>{{ user.email }}</p>
@else
  <p>Guest</p>
@end
```

`@unless` สำหรับ `not if`

```edge
@unless(account.isActive)
  <p>Please activate your account</p>
@end
```

Ternary operator ใช้ใน interpolation ได้

```edge
<input class="input {{ hasError ? 'error' : '' }}" />
```

## Loops

Loop over array

```edge
@each(user in users)
  <li>{{ user.username }}</li>
@end
```

Loop with index

```edge
@each((user, index) in users)
  <li>{{ index + 1 }}. {{ user.username }}</li>
@end
```

Loop over object

```edge
@each((amount, ingredient) in food)
  <li>{{ ingredient }}: {{ amount }}</li>
@end
```

Fallback content

```edge
@each(comment in post.comments)
  @include('partials/comment')
@else
  <p>No comments</p>
@end
```

## Partials

```edge
@include('partials/header')

<main>
  Main content
</main>

@include('partials/footer')
```

From named disk

```edge
@include('shared::partials/header')
```

Conditional include

```edge
@includeIf(post.comments.length, 'partials/comments')
```

## Tags rules

- ทุก Edge tag ต้องอยู่บน line ของตัวเอง
- ใช้ `~` นำหน้า newline เมื่อต้องการลบ newline ระหว่าง blocks

```edge
Hello
@let(username = 'virk')~
{{ username }}
```

output: `Hello virk` โดยไม่มี newline
