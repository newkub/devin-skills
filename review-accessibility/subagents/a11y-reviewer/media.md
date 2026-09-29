# Media Checklist — review-accessibility

## Images

- [ ] informative images — `alt` conveys meaning/purpose, not filename/"image"
- [ ] decorative images — `alt=""` or `aria-hidden`, CSS background for pure decoration
- [ ] complex images — charts/infographics have `longdesc`, `figure`/`figcaption`, or adjacent text
- [ ] functional images — icons in buttons have action name ("Search" not "magnifier")
- [ ] image maps — `area` elements have `alt` text
- [ ] CAPTCHA — non-visual alternative provided (audio, logic question)

## Video

- [ ] captions — synchronized, accurate, speaker-identified (WCAG 1.2.2)
- [ ] transcripts — full text alternative for audio+video content
- [ ] audio descriptions — visual actions described in audio track or separate version
- [ ] no auto-play — or auto-play muted + pausable (WCAG 1.4.2)
- [ ] controls — keyboard operable, labelled, accessible timeline/volume
- [ ] no flashing — <3 flashes/second, or warning provided

## Audio

- [ ] transcripts — podcasts, interviews, voice content
- [ ] captions — live audio has real-time captions or transcript after
- [ ] visual alternatives — audio-only content has text summary
- [ ] no auto-play sound — unexpected audio disorients screen reader users
- [ ] volume controls — accessible sliders, not just mute

## Animated Content

- [ ] GIFs — pausable/stoppable if >5s or auto-start
- [ ] CSS animations — `prefers-reduced-motion` respected
- [ ] loading spinners — `aria-busy` or `role="status"` announced
- [ ] parallax — optional, doesn't cause vestibular issues

## Carousels And Sliders

- [ ] controls — prev/next buttons, not just swipe/drag
- [ ] auto-rotation — pausable, doesn't auto-advance
- [ ] indicators — slide position announced (e.g., "3 of 5")
- [ ] keyboard — arrow key navigation, `Tab` reaches controls
- [ ] screen reader — `aria-roledescription="carousel"`, `aria-live` for changes

## Data Visualizations

- [ ] charts — `role="img"` + `aria-label` summary, or accessible data table
- [ ] data tables — `<table>` alternative for chart data
- [ ] color independence — patterns/shapes, not just color series
- [ ] interactive charts — keyboard navigable data points, tooltips accessible
- [ ] sonification — audio alternative for trend data (advanced)

## Interactive Media

- [ ] maps — `role="application"` or accessible alternative, keyboard pan/zoom
- [ ] 360°/VR — keyboard controls, motion alternative
- [ ] games — accessibility mode, not required for core content
- [ ] live regions — dynamic media changes announced appropriately

## Documents And Embeds

- [ ] PDFs — tagged, readable order, alt text on images, or HTML alternative
- [ ] iframes — `title` attribute describes content
- [ ] embedded widgets — third-party a11y evaluated, fallback provided
- [ ] downloadable files — format + size indicated, accessible alternative

## Media Queries And Preferences

- [ ] `prefers-reduced-motion` — animations disabled/reduced
- [ ] `prefers-reduced-transparency` — blur/transparency reduced
- [ ] `forced-colors` — Windows High Contrast mode support
- [ ] `inverted-colors` — inverted scheme doesn't break contrast
- [ ] `prefers-contrast` — high-contrast variant provided

## Detection

- axe rules — `image-alt`, `video-caption`, `audio-caption`, `frame-title`, `object-alt`
- grep `<img>` without `alt`, `<video>`/`<audio>` without `controls`/`track`
- grep `autoplay`, `loop`, animated content
- manual — screen reader announces media correctly, keyboard operates controls

Severity: missing alt on informative image = Critical, auto-play audio = Critical, no captions on required video = High, inaccessible carousel = Medium
