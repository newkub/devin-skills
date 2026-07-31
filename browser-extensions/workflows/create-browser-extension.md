# Create Browser Extension

Workflow for creating a browser extension.

## Steps

1. **Choose the target browser** (Chrome, Firefox, Safari, Edge)
2. **Set up project structure**
   - Create manifest.json
   - Set up source files
   - Configure build tools

3. **Implement core features**
   - Background scripts
   - Content scripts
   - Popup UI
   - Options page

4. **Configure permissions**
   - Add required permissions to manifest
   - Request user consent

5. **Test locally**
   - Load unpacked extension
   - Test functionality
   - Debug with DevTools

6. **Build for production**
   - Minify code
   - Optimize assets
   - Package extension

7. **Publish to store**
   - Submit to Chrome Web Store
   - Submit to Firefox Add-ons
   - Submit to Safari App Store

## Example: Chrome Extension Structure

```json
{
  "manifest_version": 3,
  "name": "My Extension",
  "version": "1.0",
  "permissions": ["activeTab"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"]
    }
  ]
}
```

## Best Practices

- Use Manifest V3
- Follow browser extension guidelines
- Test on multiple browsers
- Use content security policies
- Handle permissions carefully
