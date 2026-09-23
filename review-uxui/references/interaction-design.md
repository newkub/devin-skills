# Interaction Design Checks

## Goal

ตรวจสอบ micro-interactions, loading states, empty states, error states, feedback, และ gestures

## Checks

### Micro-Interactions

1. มี hover states ไหม (interactive elements)
2. มี focus states ไหม (keyboard navigation)
3. มี active states ไหม (press, click)
4. transitions สม่ำเสมอไหม (duration, easing)
5. มี delight moments ไหม (subtle animation ที่ enhance UX)

### Loading States

1. มี skeletons ไหม (content placeholder)
2. มี spinners ไหม (action feedback)
3. มี progress indicators ไหม (determinate, indeterminate)
4. loading states สม่ำเสมอไหม
5. มี loading state สำหรับทุก async operation ไหม

### Empty States

1. มี empty state design ไหม (no data, no results)
2. มี guidance ไหม (what to do next)
3. มี illustration ไหม (visual cue)
4. empty states สม่ำเสมอไหม
5. มี empty state สำหรับทุก list/table ไหม

### Error States

1. error UI สม่ำเสมอไหม
2. มี inline errors ไหม (form validation)
3. มี error pages ไหม (404, 500)
4. error messages ชัดเจนไหม (not technical jargon)
5. มี recovery guidance ไหม (what to do)

### Feedback

1. toast, snackbar สม่ำเสมอไหม
2. inline feedback สม่ำเสมอไหม
3. มี motion feedback ไหม (shake on error, bounce on success)
4. feedback ไม่ intrusive ไหม
5. มี feedback สำหรับทุก user action ไหม

### Gestures And Touch

1. มี touch-friendly targets ไหม (≥ 44x44px)
2. มี swipe gestures ไหม (mobile)
3. มี haptic feedback ไหม (mobile, if applicable)
4. gesture ไม่ conflict กับ native browser gestures ไหม
5. มี pinch-to-zoom support ไหม

## Severity

- Critical: ไม่มี loading/empty/error states เลย, ไม่มี feedback สำหรับ critical action, no touch targets บน mobile
- High: inconsistent states, missing hover/focus states, no micro-interactions, missing empty states, no error recovery
- Medium: inconsistent transitions, missing skeletons, missing inline feedback, minor gesture issues
- Low: missing delight moments, animation polish, minor feedback inconsistency
