

# RAM Logbooks — Full Build Plan

## Overview
Build all 7 screens of the RAM Logbooks module with a complete design token system, shared component library, and tablet-first (834px) responsive layout. All data is mock/local state. No dark mode, no real APIs.

---

## Phase 1: Design System Foundation

### 1A. CSS Custom Properties (`src/index.css`)
Replace the default shadcn color variables with the RAM design tokens:

- **Brand blues**: 900 (#0F1B33) through 100 (#F1F5FF) mapped to `--brand-*` variables
- **Grays**: 900 (#4B5362) through 100 (#F8F8FA) mapped to `--gray-*` variables
- **Semantic colors**: error (900/600/400/100), warning (800/400/100), success (900/800/400/100)
- **Spacing scale**: `--spacing-xxs` (2px) through `--spacing-7xl` (64px)
- **Radii**: `--radius-xs` (4px), `--radius-md` (8px), `--radius-xl` (12px), `--radius-3xl` (20px), `--radius-4xl` (24px)
- **Shadows**: `--shadow-sm` and `--shadow-lg`
- Remap shadcn semantic variables (`--primary`, `--destructive`, etc.) to use the RAM palette
- Add global `letter-spacing: 0.0144px`
- Remove the `.dark` block (no dark mode)

### 1B. Tailwind Config (`tailwind.config.ts`)
Extend with:
- Full brand/gray/error/warning/success color palette as direct hex values
- Spacing tokens mapped to the design scale
- Border radius tokens
- Shadow tokens
- Type scale utilities (font sizes with line heights matching the spec)
- Keyframe animations: pulse-border (scanner), fade-in, slide-up (drawers)

---

## Phase 2: Shared Components

All components go in `src/components/ram/`. Each is a self-contained file.

### Layout Components
- **`AppLayout.tsx`** — Tablet sidebar (226px) + main content area + bottom nav on mobile. Uses `useIsMobile()` hook for responsive switching.
- **`HeaderNav.tsx`** — Top header bar (98-110px). Props: `type` (back, workAgenda, record, scan), `title`, `onBack`. Back arrow icon, centered title in Avenir Heavy 24px.
- **`BottomNav.tsx`** — 4-tab bottom bar (Work Requests, Work Agenda, Settings, Assets). Active state: brand-500 blue icon+text with 3px top indicator. Only shows on mobile.
- **`SidebarNav.tsx`** — 226px sidebar for tablet. Same 4 nav items as bottom nav, vertical layout.
- **`StatusBar.tsx`** — Full-width bar for offline mode (brand-500 bg, white text) and sync progress.

### Form Components
- **`RAMInput.tsx`** — Custom input with all 6 states. Props: `state`, `leadingIcon`, `trailingButton`, `leadingText`. 4px radius, state-driven border/label colors per spec.
- **`RAMTextarea.tsx`** — Textarea with collapsed (152px) / expanded (256px) height variants. Same state colors as input.
- **`RAMToggle.tsx`** — Pass/Fail toggle switch. 2-state (60x31px) and 3-state (77x31px) variants. Brand blue when active.
- **`PinInput.tsx`** — 4-digit PIN entry. Four 47px square inputs, centered text, auto-advance on digit entry.

### Data Display Components
- **`WorkCard.tsx`** — Logbook card (407px tablet, 378px mobile). Shows title, location, timestamp, status chip. States: default, selected, offline. Expandable (140px collapsed, 243px open). Small shadow on hover.
- **`StatusChip.tsx`** — Pill badge (24px tall, 12px radius). Color-coded by status: Open (gray), In Progress (brand blue), Done (green), Error (red), etc.
- **`FilterChip.tsx`** — Pill filter (17px radius). White bg default, brand-500 bg when active. Count badge ("+2").
- **`ConfidenceChip.tsx`** — For form review screen. Green (>90%), yellow (70-90%), red (<70%).
- **`SearchBar.tsx`** — 40px height, magnify icon, clear X when typing, blue border on focus.

### Overlay Components
- **`RAMDrawer.tsx`** — Bottom sheet using vaul. 20px top radius, 36x4px handle, header with cancel/title/action, footer with buttons. Swipe-to-dismiss.
- **`RAMModal.tsx`** — Centered modal (358px, 20px radius, large shadow). 1/2/3 button configs. Semi-transparent overlay.
- **`SuccessDrawer.tsx`** — Specialized drawer with green checkmark, title, body, Done button.
- **`ESignDrawer.tsx`** — Specialized drawer with PinInput, signature meaning text, Cancel/Sign buttons.

### Feedback Components
- **`EmptyState.tsx`** — Centered icon + title (Heavy 18px) + body (Medium 14px). Types: no results, error, offline.
- **`SyncQueueCard.tsx`** — Entry card for offline queue. Shows entry name, logbook, timestamp, sync status chip.

---

## Phase 3: Mock Data & State

### `src/data/mockLogbooks.ts`
- 5 logbook entries with id, name, location, lastEntry, status
- Pre-filled form field values for the Clean Room Environmental Log
- Mock scan results (8 fields with names, values, confidence scores)
- Mock sync queue entries (3 items: awaiting, issue, success)

### `src/hooks/useLogbookState.ts`
- `useReducer` managing: selected logbook, form values, confirmation states, offline mode, sync queue
- Actions: SELECT_LOGBOOK, UPDATE_FIELD, CONFIRM_FIELD, SIGN_ENTRY, TOGGLE_OFFLINE, QUEUE_ENTRY

---

## Phase 4: Screens & Routing

### Routes (`src/App.tsx`)
```
/              -> LogbookList (Work Agenda)
/entry/:id     -> LogbookEntryForm
/scan          -> ScanCamera
/review        -> FormReview
/queue         -> OfflineQueue
```

Drawers (E-Sign, Success) render as overlays on their parent screens, not separate routes.

### Screen 1: Logbook List (`src/pages/LogbookList.tsx`)
- AppLayout wrapper with HeaderNav (type: workAgenda, title: "Work Agenda")
- Tab bar: Work / Asset / Work Plan (only Work is functional)
- SearchBar + FilterChip row (Location, Status, Date) + sort chip
- Scrollable list of 5 WorkCards from mock data
- Tapping a card navigates to `/entry/:id`
- Tablet: 2-column card grid. Mobile: single column.

### Screen 2: Logbook Entry Form (`src/pages/LogbookEntryForm.tsx`)
- HeaderNav (type: back, title from logbook name)
- Scrollable form with 10 fields using RAMInput, RAMTextarea, RAMToggle
- Pre-filled fields (Date/Time, Operator, Room) show "Filled" state
- Time-sensitive fields (Date/Time, Temperature, Humidity, Pressure, Particle Counts) show yellow left-border until confirmed (tap to confirm)
- Sticky footer with full-width "Sign & Submit" primary button
- Button opens ESignDrawer overlay

### Screen 3: E-Signature Drawer (overlay on Screen 2)
- ESignDrawer component with PinInput (4 digits)
- Signature meaning: "I confirm this entry is accurate and complete"
- Cancel (secondary) and Sign (primary) buttons
- On Sign: show SuccessDrawer, then navigate back to list

### Screen 4: Scan Camera (`src/pages/ScanCamera.tsx`)
- Full-screen dark background (mocking camera)
- Scanner overlay with animated pulsing border (brand-500)
- HeaderNav overlay (back, "Scan Logbook Page")
- Flashlight and camera-switch icon buttons
- Tap-to-capture triggers loading state (2s mock delay), then navigates to `/review`

### Screen 5: Form Review (`src/pages/FormReview.tsx`)
- Sheet/page layout with HeaderNav ("Review Proposed Fields")
- List of 8 mock extracted fields as cards
- Each card: field name (Heavy), extracted value (Medium), ConfidenceChip, edit button, approve/reject toggle
- Footer: "Approve All" (primary) + "Send to Review Queue" (secondary)
- Approve All shows success toast and returns to list

### Screen 6: Success Confirmation (overlay)
- SuccessDrawer rendered after signing
- Green checkmark circle icon, "Entry Submitted" title
- Body: "Logbook entry signed and saved at [current timestamp]"
- "Done" button returns to `/`

### Screen 7: Offline Queue (`src/pages/OfflineQueue.tsx`)
- StatusBar (offline mode, blue)
- HeaderNav ("Sync Queue")
- Tab bar: Awaits / Issues / Success
- SyncQueueCards listed under each tab from mock data
- EmptyState for tabs with no items

---

## Phase 5: Responsive Layout

- **Tablet (834px+)**: SidebarNav visible (226px), no BottomNav, 2-column card grid, forms use 2-column layout for numeric field pairs
- **Mobile (<834px)**: No sidebar, BottomNav visible, single-column cards, full-width forms
- **Tablet Landscape (1194px+)**: Split view on LogbookList — list on left, selected entry form on right

---

## Technical Notes

- No new dependencies needed beyond what's installed (vaul for drawers, lucide-react for icons, react-router-dom for routing)
- All colors stored as direct hex in Tailwind config (no HSL conversion needed for brand colors — we'll keep shadcn HSL vars for the base theme but add RAM colors as hex utilities)
- Form state managed via `useReducer` in a context provider wrapping the app
- Animations use Tailwind `animate-*` classes and CSS keyframes (no Framer Motion needed for this scope)
- Total new files: ~25 (components, pages, data, hooks)

