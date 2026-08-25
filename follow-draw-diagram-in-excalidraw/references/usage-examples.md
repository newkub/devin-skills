## Usage Examples

### Process Flow Diagram

```json
{
  "elements": [
    {
      "type": "rectangle",
      "id": "start",
      "x": 100, "y": 100, "width": 120, "height": 60,
      "text": "Start Process",
      "backgroundColor": "#a5d8ff",
      "strokeColor": "#1971c2",
      "strokeWidth": 2,
      "fontSize": 14
    },
    {
      "type": "arrow",
      "id": "flow1",
      "points": [[220, 130], [280, 130]],
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "startArrowhead": null,
      "endArrowhead": "arrow"
    },
    {
      "type": "rectangle",
      "id": "process",
      "x": 280, "y": 100, "width": 120, "height": 60,
      "text": "Process Data",
      "backgroundColor": "#ffd43b",
      "strokeColor": "#fab005",
      "strokeWidth": 2,
      "fontSize": 14
    }
  ]
}
```

### System Architecture Diagram

```json
{
  "elements": [
    {
      "type": "rectangle",
      "id": "frontend",
      "x": 50, "y": 50, "width": 150, "height": 100,
      "text": "Frontend\nReact App",
      "backgroundColor": "#ffec99",
      "strokeColor": "#f08c00",
      "strokeWidth": 2,
      "fontSize": 16,
      "verticalAlign": "middle"
    },
    {
      "type": "rectangle",
      "id": "api",
      "x": 250, "y": 50, "width": 150, "height": 100,
      "text": "API Gateway\nREST/GraphQL",
      "backgroundColor": "#d0bfff",
      "strokeColor": "#7950f2",
      "strokeWidth": 2,
      "fontSize": 16,
      "verticalAlign": "middle"
    },
    {
      "type": "rectangle",
      "id": "database",
      "x": 450, "y": 50, "width": 150, "height": 100,
      "text": "Database\nPostgreSQL",
      "backgroundColor": "#b2f2bb",
      "strokeColor": "#37b24d",
      "strokeWidth": 2,
      "fontSize": 16,
      "verticalAlign": "middle"
    },
    {
      "type": "arrow",
      "id": "connection1",
      "points": [[200, 100], [250, 100]],
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "endArrowhead": "arrow"
    },
    {
      "type": "arrow",
      "id": "connection2",
      "points": [[400, 100], [450, 100]],
      "strokeColor": "#495057",
      "strokeWidth": 2,
      "endArrowhead": "arrow"
    }
  ]
}
```
