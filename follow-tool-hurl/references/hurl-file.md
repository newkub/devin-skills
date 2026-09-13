# Hurl File Format

> Source: https://hurl.dev/docs/hurl-file.html (verified 2026-09-13)

## Basic Entry

```hurl
GET https://example.org/api/items
HTTP 200
[Asserts]
jsonpath "$.items" count >= 1
jsonpath "$.items[0].id" exists
duration < 500
```

- request = method + URL + optional headers/body
- response = `HTTP <status>` + optional expected headers + `[Asserts]`

## Requests

```hurl
POST https://api.example.org/users
Content-Type: application/json
{
  "name": "Alice",
  "email": "alice@example.org"
}
HTTP 201
```

- query params ใน URL หรือ `[Query]` section; form/multipart ผ่าน `[FormParams]`/`[MultipartFormData]`; basic auth `[BasicAuth]`

## Captures → Chaining

```hurl
POST https://example.org/login
[FormParams]
user: toto
password: 1234
HTTP 200
[Captures]
token: jsonpath "$.token"

GET https://example.org/me
Authorization: Bearer {{token}}
HTTP 200
```

## Assert Queries

`jsonpath`, `xpath`, `header`, `status`, `body`, `duration`, `cookie`, `regex`, `sha256`, `md5`, `bytes`, `certificate`, `url`, `ip`

Predicates: `==`, `!=`, `contains`, `startsWith`, `endsWith`, `matches`, `exists`, `>`, `<`, `>=`, `<=`, `count`, `isNumber`, `isString`, `isEmpty`, `isIsoDate`

Filters (chainable): `split`, `replace`, `toInt`, `toFloat`, `daysAfterNow`, `decode`, `format`, `nth`, `regex`, `urlDecode`, `htmlEscape`/`htmlUnescape`

## Variables

`{{name}}` จาก captures, `--variable`, `--variables-file`, หรือ `HURL_*` env vars
