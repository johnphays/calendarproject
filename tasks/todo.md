# Calendar App — Todo Checklist

## Task 1 — Project Scaffold
Create stub versions of all three files with correct structure.

- [x] `index.html` created with `#cal-header`, `#dow-header`, `#cal-grid`, `#modal-overlay`, `#event-form`, CSP meta tag, and links to style.css/app.js
- [x] `style.css` created with CSS custom properties, box-sizing reset, body font
- [x] `app.js` created with IIFE wrapper, state declarations, `init()` stub, `DOMContentLoaded` listener

**Acceptance criteria:**
- [x] Page loads with no console errors
- [x] Header, empty grid area visible; modal hidden
- [x] CSS variables applied (background color, font)

---

## Task 2 — Calendar Grid Render
Implement month grid rendering logic.

- [x] `init()` sets today's year/month, calls `loadEvents()`, `renderCalendar()`, binds all listeners
- [x] `renderCalendar()` updates `#month-label`, rebuilds grid via `buildGridCells()`
- [x] `buildGridCells(year, month)` returns DocumentFragment with correct filler and day cells
- [x] `getEventsForDate(dateStr)` filters and sorts events
- [x] `renderEventChip(event)` creates chip button using `textContent` (no innerHTML)
- [x] CSS: 7-column grid, `.day-cell` with min-height, `.today` highlighting, `.event-chip` style

**Acceptance criteria:**
- [x] Grid shows 35 or 42 cells (5 or 6 rows × 7 columns)
- [x] Day numbers correct for current month; filler cells for padding
- [x] Today's date visually highlighted
- [x] Events from localStorage render as chips on correct dates

---

## Task 3 — Month Navigation
- [x] `navigatePrev()` decrements month, wraps year correctly
- [x] `navigateNext()` increments month, wraps year correctly
- [x] Left/right arrow keys navigate when modal is closed

**Acceptance criteria:**
- [x] Prev/next buttons navigate correctly across year boundaries
- [x] Month label updates immediately
- [x] Arrow keys navigate when modal is closed

---

## Task 4 — localStorage CRUD
- [x] `loadEvents()` uses try/catch, validates array, calls `sanitizeEvent()` on each item
- [x] `saveEvents()` stringifies to localStorage
- [x] `generateId()` uses `crypto.randomUUID()` with fallback
- [x] `createEvent(data)` / `updateEvent(id, data)` / `deleteEvent(id)` mutate array, save, re-render
- [x] `sanitizeEvent(e)` enforces shape, regex-validates date/time, slices string lengths

**Acceptance criteria:**
- [x] Events persist across page reloads
- [x] Corrupt/missing localStorage does not crash the app
- [x] Multiple events on the same date all stored and rendered
- [x] Delete removes event from storage and re-renders immediately

---

## Task 5 — Add-Event Modal
- [x] `openModalForAdd(dateStr)` resets form, optionally pre-fills date, hides Delete button
- [x] `showModal()` removes hidden class, focuses first input
- [x] `closeModal()` adds hidden class, clears errors
- [x] `modalIsOpen()` returns boolean
- [x] All four close triggers work: X button, Cancel, click outside overlay, Escape key
- [x] CSS: fixed overlay backdrop, centered card max-width 480px, scrollable

**Acceptance criteria:**
- [x] "+ Add Event" opens modal with empty fields
- [x] Clicking a day cell opens modal with date pre-filled
- [x] All four close triggers work
- [x] Modal is centered and scrollable on short screens
- [x] Focus moves to first input on open

---

## Task 6 — Edit / Delete Event Flow
- [x] `openModalForEdit(id)` looks up event, populates all form fields, shows Delete button
- [x] Form submit handler: if `editingId` set → `updateEvent()`; else → `createEvent()`
- [x] Delete button calls `deleteEvent()` after `window.confirm()`
- [x] Chip click uses `e.stopPropagation()` to prevent day-cell click also firing

**Acceptance criteria:**
- [x] Clicking a chip opens modal pre-filled with all fields
- [x] Saving edits updates event in storage and re-renders
- [x] Delete button visible only in edit mode
- [x] Confirm required before delete; cancel leaves event untouched

---

## Task 7 — Form Validation
- [x] `validateForm()` orchestrates all validators, returns boolean
- [x] `validateTitle()` — required, non-empty trimmed value
- [x] `validateDate()` — required, must parse to valid Date
- [x] `validateStartTime()` — required
- [x] `validateEndTime()` — required, must be after start time
- [x] `setError(errId, msg)` / `clearError(errId)` show/hide inline error messages

**Acceptance criteria:**
- [x] Submitting empty form shows all four errors simultaneously
- [x] Fixing one field clears only that field's error on re-submit
- [x] Invalid date triggers date error
- [x] End time ≤ start time triggers end time error
- [x] Valid form submits successfully with no errors shown

---

## Task 8 — Responsive CSS
- [x] Desktop (default): full cells with chip text visible
- [x] Tablet (`max-width:768px`): shorter cells, smaller chip text
- [x] Mobile (`max-width:480px`): compact cells, events as colored dots, header wraps, modal bottom sheet

**Acceptance criteria:**
- [x] No horizontal scrollbar on viewports ≥ 320px
- [x] Tablet: chips legible, cells shorter
- [x] Mobile: cells compact, events as dots, modal full-width bottom sheet
- [x] Time inputs stack vertically on mobile

---

## Task 9 — Security Review
- [x] No `innerHTML` calls receive user-supplied data
- [x] `loadEvents()` has try/catch and array validation
- [x] `sanitizeEvent()` validates date/time with regex
- [x] `readFormData()` trims and slices all strings
- [x] CSP meta tag present in `<head>`
- [x] No `eval()`, `Function()`, or `setTimeout(string)` in app.js

**Acceptance criteria:**
- [x] Grep confirms no innerHTML receives user data
- [x] CSP meta tag present in index.html
- [x] loadEvents try/catch confirmed
- [x] All form string values trimmed + length-capped before save

---

## Review

All 9 tasks completed on 2026-03-01. Summary of what was built and the security posture:

### What was built
- **3 files** — `index.html` (93 lines), `style.css` (423 lines), `app.js` (381 lines)
- **Month grid** — 7-column CSS Grid with filler cells for correct day alignment; today highlighted in blue
- **Navigation** — Prev/Next buttons + arrow keys; correct year wrap-around (Dec→Jan and Jan→Dec)
- **CRUD** — Create, read, update, delete events; all changes persisted to `localStorage` as JSON
- **Add-event modal** — Opens empty (via header button) or date-pre-filled (via day cell click); all four close triggers work
- **Edit/Delete** — Click any event chip to open modal pre-filled; Delete button shows only in edit mode with a confirmation dialog
- **Validation** — All four fields (title, date, start time, end time) validated on submit; inline error messages; end-time-after-start-time check
- **Responsive** — Three breakpoints: desktop (full chips), tablet (smaller chips), mobile (dot indicators, bottom-sheet modal)

### Security summary
- All user data rendered via `textContent` — no `innerHTML` with user-controlled strings anywhere
- `loadEvents()` wraps `JSON.parse` in try/catch; validates result is an array
- `sanitizeEvent()` coerces types, regex-validates date/time format, and caps all string fields at maximum lengths
- `readFormData()` trims and slices string fields before they reach storage
- CSP meta tag (`default-src 'self'`) present in `<head>` to block inline scripts and external resources
- No `eval()`, `Function()`, or dynamic `setTimeout(string)` patterns in `app.js`
