'use strict';

(function () {

  // ── Constants ────────────────────────────────────────────────────────────
  const STORAGE_KEY = 'calendarEvents';
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // ── State ────────────────────────────────────────────────────────────────
  let currentYear;
  let currentMonth;   // 0-indexed (0 = January)
  let events = [];
  let editingId = null;
  let previouslyFocused = null;

  // ── DOM helpers ──────────────────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ── Initialisation ───────────────────────────────────────────────────────
  function init() {
    const today = new Date();
    currentYear  = today.getFullYear();
    currentMonth = today.getMonth();

    loadEvents();
    renderCalendar();
    bindListeners();
  }

  function bindListeners() {
    $('btn-prev').addEventListener('click', navigatePrev);
    $('btn-next').addEventListener('click', navigateNext);
    $('btn-add-event').addEventListener('click', () => openModalForAdd());
    $('btn-modal-close').addEventListener('click', closeModal);
    $('btn-cancel').addEventListener('click', closeModal);
    $('btn-delete').addEventListener('click', handleDelete);
    $('event-form').addEventListener('submit', handleFormSubmit);

    // Click outside modal content closes it
    $('modal-overlay').addEventListener('click', function (e) {
      if (e.target === this) closeModal();
    });

    // Grid delegation: chip click → edit; day cell click → add
    $('cal-grid').addEventListener('click', function (e) {
      const chip = e.target.closest('.event-chip');
      if (chip) {
        e.stopPropagation();
        openModalForEdit(chip.dataset.id);
        return;
      }
      const cell = e.target.closest('.day-cell:not(.filler)');
      if (cell) {
        openModalForAdd(cell.dataset.date);
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalIsOpen()) {
        closeModal();
        return;
      }
      if (!modalIsOpen()) {
        if (e.key === 'ArrowLeft')  navigatePrev();
        if (e.key === 'ArrowRight') navigateNext();
      }
    });
  }

  // ── Navigation ───────────────────────────────────────────────────────────
  function navigatePrev() {
    currentMonth -= 1;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear -= 1;
    }
    renderCalendar();
  }

  function navigateNext() {
    currentMonth += 1;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear += 1;
    }
    renderCalendar();
  }

  // ── Calendar render ──────────────────────────────────────────────────────
  function renderCalendar() {
    $('month-label').textContent = MONTH_NAMES[currentMonth] + ' ' + currentYear;
    const grid = $('cal-grid');
    grid.textContent = ''; // clear safely — no user data here
    grid.appendChild(buildGridCells(currentYear, currentMonth));
  }

  function buildGridCells(year, month) {
    const fragment    = document.createDocumentFragment();
    const firstDay    = new Date(year, month, 1).getDay();          // 0–6
    const daysInMonth = new Date(year, month + 1, 0).getDate();     // 28–31
    const today       = new Date();
    const todayStr    = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

    // Total cells: round up to the next multiple of 7
    const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - firstDay + 1;
      const cell = document.createElement('div');
      cell.setAttribute('role', 'gridcell');

      if (dayNumber < 1 || dayNumber > daysInMonth) {
        cell.className = 'day-cell filler';
      } else {
        const dateStr = formatDate(year, month + 1, dayNumber);
        cell.className = 'day-cell' + (dateStr === todayStr ? ' today' : '');
        cell.dataset.date = dateStr;

        const numSpan = document.createElement('span');
        numSpan.className = 'day-number';
        numSpan.textContent = String(dayNumber);
        cell.appendChild(numSpan);

        // Append event chips
        getEventsForDate(dateStr).forEach(function (evt) {
          cell.appendChild(renderEventChip(evt));
        });
      }

      fragment.appendChild(cell);
    }

    return fragment;
  }

  function getEventsForDate(dateStr) {
    return events
      .filter(function (e) { return e.date === dateStr; })
      .sort(function (a, b) { return a.startTime.localeCompare(b.startTime); });
  }

  function renderEventChip(evt) {
    const btn = document.createElement('button');
    btn.className = 'event-chip';
    btn.type = 'button';
    btn.textContent = evt.title;                              // XSS-safe
    btn.dataset.id = evt.id;
    btn.setAttribute('aria-label', 'Edit: ' + evt.title + ' at ' + evt.startTime);
    return btn;
  }

  // ── Date helper ──────────────────────────────────────────────────────────
  function formatDate(y, m, d) {
    return y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
  }

  // ── localStorage CRUD ────────────────────────────────────────────────────
  function loadEvents() {
    try {
      const raw    = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      events = Array.isArray(parsed) ? parsed.map(sanitizeEvent) : [];
    } catch (_) {
      events = [];
    }
  }

  function saveEvents() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }

  function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  function sanitizeEvent(e) {
    return {
      id:          String(e.id          ?? generateId()).slice(0, 50),
      title:       String(e.title       ?? '').trim().slice(0, 80),
      date:        /^\d{4}-\d{2}-\d{2}$/.test(e.date) ? e.date : '',
      startTime:   /^\d{2}:\d{2}$/.test(e.startTime)  ? e.startTime : '00:00',
      endTime:     /^\d{2}:\d{2}$/.test(e.endTime)    ? e.endTime   : '00:00',
      description: String(e.description ?? '').slice(0, 500),
    };
  }

  function createEvent(data) {
    const evt = Object.assign({ id: generateId() }, data);
    events.push(evt);
    saveEvents();
    renderCalendar();
  }

  function updateEvent(id, data) {
    const idx = events.findIndex(function (e) { return e.id === id; });
    if (idx === -1) return;
    events[idx] = Object.assign(events[idx], data);
    saveEvents();
    renderCalendar();
  }

  function deleteEvent(id) {
    events = events.filter(function (e) { return e.id !== id; });
    saveEvents();
    renderCalendar();
  }

  // ── Modal control ────────────────────────────────────────────────────────
  function modalIsOpen() {
    return !$('modal-overlay').classList.contains('hidden');
  }

  function showModal() {
    $('modal-overlay').classList.remove('hidden');
    $('modal-overlay').setAttribute('aria-hidden', 'false');
    // Small delay ensures element is visible before focusing
    setTimeout(function () { $('f-title').focus(); }, 50);
  }

  function closeModal() {
    $('modal-overlay').classList.add('hidden');
    $('modal-overlay').setAttribute('aria-hidden', 'true');
    editingId = null;
    clearAllErrors();
    if (previouslyFocused) {
      previouslyFocused.focus();
      previouslyFocused = null;
    }
  }

  function openModalForAdd(dateStr) {
    previouslyFocused = document.activeElement;
    editingId = null;
    $('modal-title').textContent = 'Add Event';
    $('event-form').reset();
    if (dateStr) $('f-date').value = dateStr;
    $('btn-delete').classList.add('hidden');
    showModal();
  }

  function openModalForEdit(id) {
    const evt = events.find(function (e) { return e.id === id; });
    if (!evt) return;

    previouslyFocused = document.activeElement;
    editingId = id;
    $('modal-title').textContent = 'Edit Event';

    $('f-title').value = evt.title;
    $('f-date').value  = evt.date;
    $('f-start').value = evt.startTime;
    $('f-end').value   = evt.endTime;
    $('f-desc').value  = evt.description;

    $('btn-delete').classList.remove('hidden');
    showModal();
  }

  // ── Form submit ──────────────────────────────────────────────────────────
  function handleFormSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    const data = readFormData();
    if (editingId) {
      updateEvent(editingId, data);
    } else {
      createEvent(data);
    }
    closeModal();
  }

  function handleDelete() {
    if (!editingId) return;
    if (window.confirm('Delete this event?')) {
      deleteEvent(editingId);
      closeModal();
    }
  }

  function readFormData() {
    return {
      title:       $('f-title').value.trim().slice(0, 80),
      date:        $('f-date').value,
      startTime:   $('f-start').value,
      endTime:     $('f-end').value,
      description: $('f-desc').value.trim().slice(0, 500),
    };
  }

  // ── Validation ───────────────────────────────────────────────────────────
  function validateForm() {
    const v1 = validateTitle();
    const v2 = validateDate();
    const v3 = validateStartTime();
    const v4 = validateEndTime();
    return v1 && v2 && v3 && v4;
  }

  function validateTitle() {
    const val = $('f-title').value.trim();
    if (!val) {
      setError('err-title', 'f-title', 'Title is required');
      return false;
    }
    clearError('err-title', 'f-title');
    return true;
  }

  function validateDate() {
    const val = $('f-date').value;
    if (!val) {
      setError('err-date', 'f-date', 'Date is required');
      return false;
    }
    const d = new Date(val + 'T00:00:00');
    if (isNaN(d.getTime())) {
      setError('err-date', 'f-date', 'Enter a valid date');
      return false;
    }
    clearError('err-date', 'f-date');
    return true;
  }

  function validateStartTime() {
    const val = $('f-start').value;
    if (!val) {
      setError('err-start', 'f-start', 'Start time is required');
      return false;
    }
    clearError('err-start', 'f-start');
    return true;
  }

  function validateEndTime() {
    const endVal   = $('f-end').value;
    const startVal = $('f-start').value;
    if (!endVal) {
      setError('err-end', 'f-end', 'End time is required');
      return false;
    }
    if (startVal && endVal <= startVal) {
      setError('err-end', 'f-end', 'End time must be after start time');
      return false;
    }
    clearError('err-end', 'f-end');
    return true;
  }

  function setError(errId, inputId, message) {
    const errEl   = $(errId);
    const inputEl = $(inputId);
    if (errEl)   errEl.textContent = message;
    if (inputEl) inputEl.classList.add('invalid');
  }

  function clearError(errId, inputId) {
    const errEl   = $(errId);
    const inputEl = $(inputId);
    if (errEl)   errEl.textContent = '';
    if (inputEl) inputEl.classList.remove('invalid');
  }

  function clearAllErrors() {
    [['err-title', 'f-title'], ['err-date', 'f-date'],
     ['err-start', 'f-start'], ['err-end', 'f-end']].forEach(function (pair) {
      clearError(pair[0], pair[1]);
    });
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', init);

})();
