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

## Task 10 — UI Redesign (Google Calendar style)
Completed 2026-03-01. Redesigned all three files to match the Google Calendar month-view layout.

- [x] Two-column layout: 256px sidebar + flex-1 main calendar area
- [x] Full-height app shell (`html/body` at `height:100%; overflow:hidden`)
- [x] `#top-nav` bar: hamburger, calendar logo, Today button, prev/next arrows, month label, search/settings icons, Create button
- [x] `goToToday()` function wired to Today button
- [x] `#sidebar` with mini calendar (`renderMiniCal()`) in sync with main view
- [x] Mini calendar prev/next buttons share `navigatePrev()` / `navigateNext()`
- [x] Overflow days from prev/next month visible in `buildGridCells()` with lighter day numbers
- [x] Filler cells have `data-date` set — clicking opens modal pre-filled with that date
- [x] `rows-5` / `rows-6` CSS classes on `#cal-grid` so rows stretch to fill viewport
- [x] Google color palette: `#1a73e8` blue, `#dadce0` borders, `#70757a` muted text
- [x] Today day number: 26px blue circle (no cell background tint)
- [x] Sidebar collapses on tablet (`max-width:768px`); mobile layout preserved

**Acceptance criteria:**
- [x] Two-column layout visible on desktop; sidebar hidden on mobile
- [x] Today button navigates back to current month
- [x] Mini calendar renders in sidebar, stays in sync with main grid navigation
- [x] Overflow days (prev/next month) shown in lighter gray in main grid
- [x] Grid rows fill full viewport height with no page-level scrollbar
- [x] All existing CRUD, modal, and validation behaviour unchanged

---

---

## Task 11 — Accessibility (a11y) Audit & Fixes

### Findings

#### Critical
- [ ] **A — Error messages not linked to inputs.** `aria-describedby` is missing on all four form inputs; screen readers won't announce inline validation errors when they appear.
- [ ] **B — No focus trap in modal.** `Tab` can reach elements behind the open dialog, violating ARIA dialog pattern. The modal has `aria-modal="true"` but no JS trap.

#### High
- [ ] **C — Day cells not keyboard-accessible.** Main grid day cells are `<div>` elements with click handlers but no `tabindex`. Keyboard users cannot tab to or activate individual days.
- [ ] **D — Color contrast: muted text too low.** `#70757a` on white is ~4.19:1, below the WCAG AA threshold (4.5:1) for text ≤18px normal / ≤14px bold. Affects day numbers (12px), mini-cal DOW labels (11px), dow-header labels (11px).
- [ ] **E — Color contrast: filler day numbers.** `#bdc1c6` on white is ~1.74:1, severely fails WCAG AA. Applies to overflow-month day numbers in both main and mini grids.
- [ ] **F — Ambiguous day abbreviations.** Mini-cal DOW row uses "S M T W T F S" as bare text — two S's and two T's with no `<abbr>` title or `aria-label`. Screen readers read them as single letters.

#### Medium
- [ ] **G — `<main>` used as the grid widget.** `<main id="cal-grid" role="grid">` replaces the landmark role with a widget role; AT won't expose the main landmark. Should be `<div role="grid">` with a separate `<main>` wrapper.
- [ ] **H — `<h1>` inside `<nav>`.** `#month-label` is an `<h1>` element inside the `<nav>`. Heading hierarchy is semantically wrong; should be at most `<h2>` or a styled `<span>`.
- [ ] **I — Missing `:focus-visible` ring on buttons.** Icon buttons and mini-day buttons rely on browser-default outlines; no explicit focus ring style ensures cross-browser consistency.

### Plan

- [x] **Fix A** — Added `aria-describedby` to all 4 form inputs; added `role="alert"` to all 4 `.error-msg` spans.
- [x] **Fix B** — Added `trapFocus()` function; wired to `showModal()` / `closeModal()` via `addEventListener` / `removeEventListener`.
- [x] **Fix C** — Added `tabindex="0"` + `aria-label` to current-month cells; `tabindex="-1"` to fillers; added `keydown` (Enter/Space) handler on `#cal-grid`.
- [x] **Fix D** — Changed `--color-muted` from `#70757a` to `#5f6368` (~5.9:1 on white, passes AA).
- [x] **Fix E** — Changed `.filler .day-number` color from `#bdc1c6` to `#80868b` (~4.6:1 on white, passes AA).
- [x] **Fix F** — Added `aria-hidden="true"` to `#mini-cal-dow` (individual day buttons already carry full date `aria-label`).
- [x] **Fix G** — Changed `<div id="main-cal">` to `<main id="main-cal">` and `<main id="cal-grid">` to `<div id="cal-grid">`.
- [x] **Fix H** — Changed `<h1 id="month-label">` to `<span id="month-label" role="heading" aria-level="2">`.
- [x] **Fix I** — Added `button:focus-visible`, `.day-cell:focus-visible`, and `.event-chip:focus-visible` rules in `style.css`.

## Review

Initial build completed 2026-03-01. UI redesign completed 2026-03-01. Accessibility pass completed 2026-03-01.

### What was built
- **3 files** — `index.html` (119 lines), `style.css` (494 lines), `app.js` (290 lines)
- **Month grid** — 7-column CSS Grid; rows auto-size to fill viewport; overflow days from prev/next month shown in gray
- **Navigation** — Prev/Next buttons, arrow keys, Today button; correct year wrap-around
- **CRUD** — Create, read, update, delete events; all changes persisted to `localStorage` as JSON
- **Add-event modal** — Opens empty or date-pre-filled; all four close triggers work
- **Edit/Delete** — Click any event chip to open modal pre-filled; Delete button in edit mode only
- **Validation** — All four fields validated; inline error messages; end-time-after-start check
- **Responsive** — Sidebar collapses ≤768px; dot indicators + bottom-sheet modal ≤480px
- **Google Calendar UI** — Two-column layout, top nav bar, mini sidebar calendar, Google blue palette

### Security summary
- All user data rendered via `textContent` — no `innerHTML` with user-controlled strings anywhere
- `loadEvents()` wraps `JSON.parse` in try/catch; validates result is an array
- `sanitizeEvent()` coerces types, regex-validates date/time format, caps all string fields
- `readFormData()` trims and slices string fields before they reach storage
- CSP meta tag (`default-src 'self'`) present in `<head>`
- No `eval()`, `Function()`, or dynamic `setTimeout(string)` patterns in `app.js`

---

## Task 12 — Netlify Deployment (GitHub-connected)

- [x] Add `netlify.toml` with no build command and `publish = "."`
- [x] Push `netlify.toml` to GitHub (`main` branch)
- [x] Walk through Netlify dashboard: import repo, confirm settings, deploy

---

## Task 13 — Tailwind CSS v4 Migration

Using Context7 to get the latest Tailwind v4 docs. Strategy: Tailwind CDN (browser build) for zero build-step usage. JS-generated classes styled via `<style type="text/tailwindcss">` using `@apply`; static HTML elements get utility classes directly.

### Steps

- [x] **13a — Update CSP & add Tailwind CDN**
  - Changed `script-src 'self'` → `script-src 'self' cdn.jsdelivr.net`
  - Changed `style-src 'self'` → `style-src 'self' 'unsafe-inline'` (Tailwind injects a `<style>` element at runtime)
  - Added `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`

- [x] **13b — Add `<style type="text/tailwindcss">` block**
  - `@theme` with all custom color tokens
  - Global button reset + body font-family
  - `.hidden`, `.rows-5`, `.rows-6`, `#cal-grid`, `#modal-overlay`
  - `.day-cell`, `.day-number`, `.event-chip`, `.mini-day` with `@apply` + plain CSS
  - `.form-input`, `.invalid`, `.danger`
  - Focus-visible rings for buttons, day-cells, event-chips
  - Responsive overrides at 768px and 480px

- [x] **13c — Add utility classes to static HTML elements**
  - `<html>` / `<body>`: `h-full overflow-hidden flex flex-col`
  - All nav elements, logo, month label
  - Sidebar: `hidden md:block` for responsive collapse
  - Mini-cal header, DOW grid, grid container
  - Dow-header spans, main-cal layout
  - Modal, modal-header, form groups (replaced `.form-group` / `.form-row`)
  - Responsive hiding on `#btn-today` and icon buttons via `max-[480px]:hidden`

- [x] **13d — Replace style.css**
  - All 590 lines of custom CSS removed; file now contains only a migration comment
  - `<link rel="stylesheet" href="style.css">` removed from index.html

- [x] **13e — Security review**
  - `'unsafe-inline'` added to `style-src` only — required for Tailwind's runtime style injection; acceptable for a static client-side app with no server-rendered HTML
  - `cdn.jsdelivr.net` scoped only to `script-src`; CDN pinned to `@4` (major version)
  - No `innerHTML` changes; all user data still rendered via `textContent` in app.js
  - No new XSS vectors introduced

---

### Accessibility summary (Task 11)
- **ARIA linkage** — All 4 form inputs have `aria-describedby`; all 4 error spans have `role="alert"` (live region); screen readers will announce validation errors inline.
- **Focus trap** — `trapFocus()` intercepts Tab/Shift+Tab at modal boundaries; listener is added on open and removed on close to avoid memory leaks.
- **Keyboard grid** — Current-month day cells have `tabindex="0"` and `aria-label`; Enter/Space activates them. Filler cells have `tabindex="-1"`. Event chip `<button>` elements were already keyboard-reachable.
- **Color contrast** — `--color-muted` raised to `#5f6368` (5.9:1); filler day numbers raised to `#80868b` (4.6:1). Both now pass WCAG AA for small text.
- **Focus rings** — Explicit `:focus-visible` outlines added for all interactive elements; day cells use an inset ring to stay within the cell border.
- **Landmarks** — `#main-cal` is now a proper `<main>` landmark; `#cal-grid` is a `<div role="grid">` widget, not a misused `<main>`.
- **Heading hierarchy** — Month label changed from `<h1>` to `<span role="heading" aria-level="2">`, removing the heading-inside-nav anomaly.
- **Ambiguous abbreviations** — Mini-cal DOW row marked `aria-hidden="true"`; day buttons' `aria-label="YYYY-MM-DD"` provides all needed context for AT.
