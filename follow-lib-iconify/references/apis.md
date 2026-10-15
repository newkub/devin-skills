| key | value |
|---|---|
| package registry | https://www.npmjs.com/package/@iconify/vue |
| repository | https://github.com/iconify/iconify |
| docs | https://iconify.design/docs/ |

| api | description | default | options |
|---|---|---|---|
| `<Icon icon="mdi:home" />` | Render an icon in a component | inline SVG | `width`, `height`, `color`, `rotate`, `flip` |
| `addIcon(name, data)` | Register icon data | - | offline mode |
| `addCollection(data)` | Register the whole set | - | - |
| `getIcon(name)` | Lookup icon data | - | - |
| `iconToSVG(data)` | Build the SVG yourself | - | `customisations` |
