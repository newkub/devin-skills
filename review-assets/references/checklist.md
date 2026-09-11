# review-assets — Full Dimension Checklist

## 1. Images

- [ ] modern formats: AVIF/WebP พร้อม fallback
- [ ] responsive: srcset/sizes, art direction ถ้าจำเป็น
- [ ] lazy loading, `decoding="async"`, width/height ป้องกัน CLS
- [ ] compression level เหมาะสม, ไม่มี oversized assets
- [ ] alt text coverage (เชื่อม `/review-accessibility`)

## 2. Fonts

- [ ] subset fonts, variable fonts เมื่อเหมาะ
- [ ] `font-display: swap` หรือ strategy ที่เหมาะ
- [ ] preload critical fonts, ไม่ preload เกิน
- [ ] fallback metrics เพื่อลด layout shift

## 3. Media

- [ ] video/audio: format, bitrate, poster, lazy init
- [ ] streaming (HLS/DASH) สำหรับ video ยาว
- [ ] captions/subtitles (a11y overlap)

## 4. Icons And Vectors

- [ ] SVG optimized (svgo), icon strategy: sprite/component/font
- [ ] favicon set ครบ (ico, png, apple-touch, manifest icons)

## 5. Delivery And Caching

- [ ] CDN/edge caching, immutable content-hashed URLs
- [ ] cache headers เหมาะสม, compression (brotli/gzip)
- [ ] preconnect/dns-prefetch สำหรับ asset origins
- [ ] no missing/404 assets, no unused bundled assets

## 6. Licensing And Governance

- [ ] license attribution สำหรับ third-party assets
- [ ] asset inventory: owner, source, expiry

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
