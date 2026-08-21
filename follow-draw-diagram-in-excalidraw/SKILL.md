---
name: follow-draw-diagram-in-excalidraw
description: วาด diagram ด้วย Excalidraw สำหรับ architecture และ flows
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

วาด diagram ด้วย Excalidraw เพื่อสื่อสาร architecture, flows, และโครงสร้างต่างๆ

## Scope

ใช้สำหรับการวาด diagram เมื่อต้องการสื่อสารแนวคิดแบบ visual

## Execute

### 1. When to Use

ใช้ Excalidraw เมื่อต้องวาด diagram

> Goal: รู้ว่าเมื่อไหร่ควรใช้ Excalidraw

1. วาด architecture diagrams
2. วาด process flows
3. วาด system diagrams
4. วาด sequence diagrams

### 2. Quick Start

เริ่มวาด diagram อย่างรวดเร็ว

> Goal: สร้าง diagram ได้อย่างรวดเร็ว

1. เปิด Excalidraw ที่ `https://excalidraw.com`
2. เลือก shapes จาก toolbar
3. ใช้ text tool สำหรับ labels
4. ใช้ arrows สำหรับเชื่อม components

### 3. Diagram Elements

ใช้ elements ต่างประเภทใน diagram

> Goal: รู้วิธีใช้ elements ต่างประเภท

1. ใช้ rectangles สำหรับ components/boxes
2. ใช้ diamonds สำหรับ decisions
3. ใช้ arrows สำหรับ data flow
4. ใช้ text สำหรับ labels

### 4. Styling

จัดรูปแบบ diagram ให้อ่านง่าย

> Goal: diagram อ่านง่ายและสื่อความหมาย

1. ใช้ colors สำหรับแยก layers หรือ types
2. ใช้ stroke styles (solid, dashed, dotted) สำหรับแยกประเภท connections
3. จัด layout ให้ flow จากซ้ายไปขวา หรือบนลงล่าง

### 5. Verification

ตรวจสอบ diagram ก่อนใช้งาน

> Goal: diagram ถูกต้องและสื่อความหมายชัดเจน

1. ตรวจสอบว่าทุก component มี label
2. ตรวจสอบว่า arrows ชี้ทิศทางถูกต้อง
3. ตรวจสอบว่า layout อ่านง่าย

## Rules

- ใช้ Excalidraw สำหรับ diagram ที่ต้องการความ hand-drawn หรือ informal
- ทุก component ต้องมี label
- ใช้ arrows สำหรับเชื่อม components
- จัด layout ให้ flow จากซ้ายไปขวา หรือบนลงล่าง
- ใช้ colors สำหรับแยก layers หรือ types

## Expected Outcome

- Diagram สื่อสาร architecture หรือ flow ได้ชัดเจน
- ทุก component มี label
- Layout อ่านง่ายและเข้าใจได้
- Colors แยก layers หรือ types ชัดเจน

# Draw Diagram in Excalidraw

## When to Use

Use this workflow when you need to:

- Create visual diagrams for documentation
- Design system architecture diagrams
- Create flowcharts for processes
- Generate wireframes or mockups
- Illustrate complex concepts visually

## Quick Start

Follow these steps to create professional diagrams:

1. Plan diagram structure - Sketch layout and identify key components
2. Create diagrams directory - Place at same level as target documentation
3. Generate .excalidraw file - Use proper JSON structure with metadata
4. Add diagram elements - Place shapes, text, and connections systematically
5. Apply consistent styling - Use colors, fonts, and spacing uniformly
6. Review and refine - Test readability and visual hierarchy
7. Export and integrate - Save in multiple formats for documentation

## File Structure

```text
[parent-folder]/
├── [target-folder]/
│   └── [target-files]
├── diagrams/
│   ├── diagram.excalidraw    # Main diagram file
│   └── exports/              # Optional exported images
│       ├── diagram.png
│       └── diagram.svg
```

## Diagram Elements

### Basic Shapes

- Rectangle: Use for containers, processes, and components
- Text: Add labels, descriptions, and annotations
- Arrow: Connect elements and show data/process flow
- Circle: Represent entities, endpoints, or decision points
- Diamond: Use for decision nodes in flowcharts
- Ellipse: Highlight important concepts or states

### Advanced Elements

- Group: Combine multiple elements as logical units
- Image: Add screenshots, logos, or icons
- Line: Create boundaries and separations
- Frame: Group related sections with visual containers

### Styling Options

- Colors: Use consistent color scheme with semantic meaning
  - Blue: Data/Information flow
  - Green: Success/Completed processes
  - Red: Errors/Warning states
  - Yellow: Warning/Attention areas
  - Purple: External systems/APIs
  - Gray: Infrastructure/background
- Stroke: Adjust line width (1-3px) and style (solid/dashed)
- Fill: Apply background colors with 80-90% opacity
- Opacity: Control transparency (100% for text, 80-90% for shapes)
- Font Size: Use hierarchy (16px headers, 14px labels, 12px notes)

### Layout Principles

- Alignment: Use grid alignment (20px spacing)
- Spacing: Maintain consistent padding (10-20px between elements)
- Hierarchy: Larger elements for important components
- Flow: Arrange left-to-right or top-to-bottom for natural reading
- Balance: Distribute visual weight evenly across diagram

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

## Implementation Steps

### 1. Plan Diagram Structure

- Identify key components and relationships
- Sketch rough layout on paper or digital tool
- Determine color scheme and visual hierarchy
- Plan element positioning and spacing

### 2. Create diagrams directory

   ```bash
   mkdir -p "[parent-folder]/diagrams/exports"
   ```

### 3. Generate diagram file

   ```bash
   # Create .excalidraw file with complete JSON structure
   cat > "[parent-folder]/diagrams/diagram.excalidraw" << 'EOF'
   {
     "type": "excalidraw",
     "version": 2,
     "source": "https://excalidraw.com",
     "elements": [
       // Add your diagram elements here
       // Each element needs: type, id, x, y, width, height
       // Optional: text, backgroundColor, strokeColor, strokeWidth
     ],
     "appState": {
       "gridSize": 20,
       "viewBackgroundColor": "#ffffff",
       "currentItemStrokeColor": "#000000",
       "currentItemBackgroundColor": "transparent",
       "currentItemFillStyle": "solid",
       "currentItemStrokeWidth": 2,
       "currentItemFontFamily": 1,
       "currentItemFontSize": 16,
       "currentItemTextAlign": "left",
       "currentItemStartArrowhead": null,
       "currentItemEndArrowhead": "arrow"
     },
     "files": {}
   }
   EOF
   ```

### 4. Add diagram elements systematically

  - Start with main containers and components
  - Add connecting arrows and relationships
  - Include text labels and descriptions
  - Apply consistent styling throughout

### 5. Open and refine in Windsurf

   ```bash
   # Open the diagram file for editing
   code "[parent-folder]/diagrams/diagram.excalidraw"
   ```

  - Use Windsurf's Excalidraw preview
  - Adjust positions and styling interactively
  - Test visual clarity and readability

### 6. Export and integrate

   ```bash
   # Export to multiple formats
   # PNG for documentation
   # SVG for web integration
   # JSON for version control
   ```

## Verification Steps

### Structure Verification

- [ ] Diagrams directory created at the same level as target path
- [ ] Exports subdirectory exists for multiple format outputs
- [ ] .excalidraw file created with valid JSON structure
- [ ] All elements have unique IDs and proper positioning

### Content Verification

- [ ] Diagram elements properly positioned and aligned
- [ ] Text labels are readable and properly sized
- [ ] Color scheme is consistent and semantically meaningful
- [ ] Arrows and connections show clear relationships
- [ ] Visual hierarchy guides the viewer's attention

### Functionality Verification

- [ ] File opens correctly in Windsurf with Excalidraw preview
- [ ] Interactive editing works (drag, resize, style changes)
- [ ] Export functionality works for PNG and SVG formats
- [ ] Diagram remains readable at different zoom levels
- [ ] All text is legible and properly formatted

### Integration Verification

- [ ] Exported images display correctly in documentation
- [ ] File size is appropriate for web use (< 500KB for PNG)
- [ ] SVG maintains quality when scaled
- [ ] Diagram updates propagate to exported formats
- [ ] Version control tracks changes effectively

## Best Practices

### Planning and Design

- Sketch first: Always create a rough sketch before implementation
- Define purpose: Clearly identify what the diagram should communicate
- Know your audience: Adjust complexity level for intended viewers
- Limit scope: Focus on essential elements, avoid information overload

### Visual Design

- Use consistent color schemes: Apply semantic meaning to colors
- Maintain visual hierarchy: Size and position indicate importance
- Ensure readability: Use adequate font sizes and contrast
- Apply grid alignment: Use 20px grid for professional appearance
- White space matters: Leave adequate spacing between elements

### Content Organization

- Group related elements: Use frames or proximity to show relationships
- Follow natural flow: Arrange left-to-right or top-to-bottom
- Use clear labels: Be concise but descriptive
- Add annotations: Include notes for complex areas
- Limit text density: Avoid overcrowding with text

### Technical Implementation

- Use unique IDs: Ensure every element has a unique identifier
- Validate JSON: Check syntax before saving
- Test in Windsurf: Verify preview functionality
- Export multiple formats: PNG for docs, SVG for web, JSON for versioning
- Version control: Track changes in Git

### Documentation Integration

- Store close to related content: Place diagrams near relevant documentation
- Use descriptive filenames: Include context in file names
- Add alt text: Describe diagrams for accessibility
- Link from text: Reference diagrams in related documentation
- Update consistently: Keep diagrams in sync with content changes

## Troubleshooting

### File Issues

File won't open:

- Check JSON syntax validity using online validator
- Verify all required fields are present (type, version, elements)
- Ensure element IDs are unique and properly formatted
- Check for trailing commas or missing brackets

Elements missing:

- Verify element IDs are unique throughout the file
- Check coordinates are within reasonable bounds
- Ensure required properties (x, y, width, height) are present
- Validate element type is supported

### Display Issues

Text not readable:

- Increase font size to minimum 12px
- Check contrast between text and background
- Verify font family is supported
- Ensure text container is large enough

Colors not displaying:

- Use hex color format (#RRGGBB)
- Verify color values are valid
- Check opacity settings (80-90% for shapes)
- Ensure sufficient contrast for accessibility

### Export Issues

Export fails:

- Ensure write permissions in diagrams directory
- Check available disk space
- Verify file name doesn't contain special characters
- Close file before exporting

Poor image quality:

- Increase canvas size before export
- Use SVG format for scalable graphics
- Check resolution settings for PNG export
- Verify anti-aliasing is enabled

### Performance Issues

File loading slowly:

- Reduce number of elements (< 200 recommended)
- Optimize image sizes if using external images
- Remove unused elements and groups
- Split complex diagrams into multiple files

Windsurf preview lag:

- Close other heavy applications
- Reduce diagram complexity
- Use simpler styling
- Clear browser cache if applicable
