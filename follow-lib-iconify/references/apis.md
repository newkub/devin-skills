| key | value |
|---|---|
| package registry | https://www.npmjs.com/package/@iconify/vue |
| repository | https://github.com/iconify/iconify |
| docs | https://iconify.design/docs/ |

| api | description | default | options |
|---|---|---|---|
| `<Icon icon="mdi:home" />` | Render icon ใน component | inline SVG | `width`, `height`, `color`, `rotate`, `flip` |
| `addIcon(name, data)` | Register icon data | - | offline mode |
| `addCollection(data)` | Register ทั้ง set | - | - |
| `getIcon(name)` | Lookup icon data | - | - |
| `iconToSVG(data)` | Build SVG เอง | - | `customisations` |
