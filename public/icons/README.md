# ThyBarberShop · App Icons

Drop the four PNGs referenced by `manifest.json` into this folder:

| File | Size | Purpose |
| --- | --- | --- |
| `icon-192.png` | 192×192 | Android home-screen + service-worker badge |
| `icon-512.png` | 512×512 | Android splash + maskable icon |
| `apple-touch-icon.png` | 180×180 | iOS Safari home-screen |
| `favicon-32.png` | 32×32 | Browser tab favicon + push-notification badge |

## Style guide

- Background: `#0a0a2e` (navy)
- Mark: amber `#F5A623`
- Wordmark: "Thy" white + "BarberShop" amber, Syne 800
- Maskable icon: include 12% safe-zone padding
- Square corners; OS handles rounding/squircle

## Generating

Use any of:

- `https://realfavicongenerator.net/` (recommended; free, browser-based)
- `npx pwa-asset-generator <source.svg> ./public/icons --background "#0a0a2e" --opaque false`
- Figma export: 4× scale source artboard, export at the four sizes above

`source.svg` in this folder is a starting point. Replace it with the
finalized brand mark before generating production icons.
