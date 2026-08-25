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
