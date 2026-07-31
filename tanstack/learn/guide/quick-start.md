# Quick Start

## TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('https://api.example.com/posts').then(r => r.json()),
  });

  if (isLoading) return <div>Loading...</div>;
  return <div>{data.map(post => <div key={post.id}>{post.title}</div>)}</div>;
}
```

## TanStack Table

```tsx
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';

function Table({ data, columns }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>{header.renderHeader()}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>{cell.renderCell()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```
