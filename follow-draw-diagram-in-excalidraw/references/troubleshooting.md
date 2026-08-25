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
