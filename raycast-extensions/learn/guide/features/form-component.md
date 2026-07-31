# Form Component

## Text Input

```typescript
<Form.TextField
  title="Name"
  placeholder="Enter your name"
  defaultValue=""
  onChange={(value) => console.log(value)}
/>
```

## Dropdown

```typescript
<Form.Dropdown
  title="Category"
  defaultValue="a"
  onChange={(value) => console.log(value)}
>
  <Form.Dropdown.Item value="a" title="Category A" />
  <Form.Dropdown.Item value="b" title="Category B" />
  <Form.Dropdown.Item value="c" title="Category C" />
</Form.Dropdown>
```

## Checkbox

```typescript
<Form.Checkbox
  label="Enable notifications"
  defaultValue={true}
  onChange={(value) => console.log(value)}
/>
```

## Password Field

```typescript
<Form.PasswordField
  title="API Key"
  placeholder="Enter your API key"
/>
```

## Date Picker

```typescript
<Form.DatePicker
  title="Due Date"
  type={Form.DatePicker.Type.Date}
/>
```

## Slider

```typescript
<Form.Slider
  title="Volume"
  minValue={0}
  maxValue={100}
  defaultValue={50}
/>
```
