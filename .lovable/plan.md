
# RAM Logbooks — Three Workflows (Revised Plan)

## Overview
Restructure the app from a single "My Logbooks" list into three role-based workflows: **Execute** (technician), **Manage** (admin), and **Review** (QA). This revised plan incorporates all 6 feedback points: data helpers, responsive review grid, drawer behavior, mock scan simulation, field-type-specific validation UI, and simplified associations.

---

## Phase 1: Mock Data Layer with Helper Functions

**New file: `src/data/mockAssets.ts`**

Interfaces:
- `Asset` — id, name, assetId, type, locationId, logbookCount, status
- `LogbookTemplate` — id, name, version, status, fieldCount, locationCount, assetCount, totalEntries, fields array, modifiedAgo
- `LogbookInstance` — instanceId, templateId, locationId, assetId (nullable), name, assetName (nullable), lastEntry, lastOperator, schedule, isOverdue, fieldCount
- `ReviewEntry` — id, date, logbook, location, asset (nullable), operator, status, version, fields, auditTrail
- `TemplateVersion` — version, date, author, changeSummary, status, entryCount

Export all mock arrays: 7 assets, 6 templates (with field definitions for Cleaning Log), 7+ instances, 20 review entries — all exactly as specified in the addendum.

**Helper functions (exported from same file):**
- `getAssetsByLocation(locationId)` — filters assets by location
- `getInstancesByAsset(assetId)` — filters instances where assetId matches
- `getInstancesByLocation(locationId)` — all instances for a location (both asset-level and location-level)
- `getLocationLevelInstances(locationId)` — instances where assetId is null
- `getEntriesBySlice(sliceMode, filterId?)` — groups review entries by "logbook", "location", or "asset"; returns grouped structure with headers and counts
- `getTemplateById(templateId)` — resolves a single template by ID

Every screen uses these helpers. When device location changes via `useDeviceLocation`, Execute and Review screens re-filter automatically because they call these functions with `currentLocation.id`.

---

## Phase 2: Navigation Overhaul

**Edit: `src/components/ram/SidebarNav.tsx`**
- Primary nav: Execute (`ClipboardCheck`, `/execute`), Manage (`Settings2`, `/manage`), Review (`CheckSquare`, `/review`)
- Divider: 1px solid border, 12px vertical margin
- Secondary nav: Scan & Convert (`ScanLine`, `/scan`), Sync Queue (`RefreshCw`, `/queue`)
- Active state uses `startsWith` matching (e.g., `/execute/assets` highlights Execute)
- Location context block and Settings button unchanged

**Edit: `src/components/ram/BottomNav.tsx`**
- 3 primary tabs: Execute, Manage, Review
- Scan & Convert and Sync Queue accessible from header icons on mobile (added per-screen in HeaderNav)

**Edit: `src/App.tsx`**
- Add all new routes:
  - `/execute`, `/execute/assets`, `/execute/asset/:id`
  - `/manage`, `/manage/template/:id`, `/manage/template/new`
  - `/review`
- Redirect `/` to `/execute`
- Keep all existing routes unchanged

---

## Phase 3: Execute Workflow (3 screens)

**New: `src/pages/Execute.tsx`** — route `/execute`
- Header: "Execute" title, scan button pill (top right)
- Two-card split: "Scan or Tap Asset" (large ScanLine icon on blue circle, taps to open simulated scanner) and "Select from List" (List icon, navigates to `/execute/assets`)
- Below: "Location-Level Logbooks" section using `getLocationLevelInstances(currentLocation.id)`, rendered with existing `WorkCard` component
- **Mock scan behavior**: On scan, simulate 2-second delay then navigate to `/execute/asset/asset-001` (Reactor R-201, 3 logbooks). Include a small toggle "Simulate single logbook" — when active, navigates directly to `/entry/inst-004` (Autoclave's single Cleaning Log) to demo the shortcut

**New: `src/pages/AssetList.tsx`** — route `/execute/assets`
- HeaderNav with back arrow + "Assets at [location name]"
- SearchBar at top (reuse existing component)
- Asset cards from `getAssetsByLocation(currentLocation.id)`: name (bold), asset ID (muted), type badge (pill), logbook count, status dot (green = current, yellow = overdue), chevron right
- Tap navigates to `/execute/asset/:id`

**New: `src/pages/AssetLogbooks.tsx`** — route `/execute/asset/:id`
- HeaderNav: asset name, subtitle "RAM-XXXX . Location Name"
- Logbook instance cards from `getInstancesByAsset(assetId)`: name, last entry + operator, schedule or overdue indicator (red text + AlertTriangle), field count badge
- "View History" and "New Entry" action buttons per card
- "New Entry" navigates to `/entry/:instanceId`

---

## Phase 4: Manage Workflow (3 screens)

**New: `src/pages/ManageTemplates.tsx`** — route `/manage`
- Header: "Manage Templates" + "Create Template" primary button
- Template cards from mock templates: name, version badge (blue pill), association summary, field count, total entries, last modified, status chip (Published/Draft/Archived)
- Tap navigates to `/manage/template/:id`

**New: `src/pages/TemplateDetail.tsx`** — route `/manage/template/:id`
- Header: back arrow + template name, "Edit Template" secondary button
- Three tabs: Fields (default), Associations, Versions

**Fields tab:**
- Ordered field list: drag handle (GripVertical, visual only), field name, type badge pill, required asterisk, validation summary, edit button
- "Add Field" full-width secondary button at bottom
- "Add Field" opens a RAMDrawer with field-type-specific validation UI:
  - **Number**: min/max inputs
  - **Text**: max character count input
  - **Dropdown**: editable options list (add/remove string items)
  - **Date**: "Restrict to" toggle — past only, future only, any
  - **Toggle**: two editable label inputs (default "Pass" / "Fail")
  - **Textarea**: max character count input
  - All visual only for the prototype — no real validation logic

**Associations tab (simplified chip approach):**
- Flat list of locations with on/off toggle switches
- When a location is toggled on, a row of asset name chips appears below it (all-on by default)
- Each chip has an X button to remove individual assets
- "Save Associations" sticky footer button
- This is functionally equivalent to the full expandable matrix but simpler to build

**Versions tab:**
- Version timeline list: version number, date, author, change summary, status pill (Active/Superseded), entry count
- "Create New Version" button shows informational modal: "Version management is available in the full release..." with "Got It" button

**New: `src/pages/CreateTemplate.tsx`** — route `/manage/template/new`
- Template name (RAMInput), description (RAMTextarea)
- Fields section: empty state message, "Add Field" button (same drawer as TemplateDetail)
- Associations section: same simplified chip-based toggle matrix
- Footer: "Save as Draft" secondary + "Publish" primary

---

## Phase 5: Review Workflow (1 screen + drawer)

**New: `src/pages/ReviewDashboard.tsx`** — route `/review`
- **Slice selector**: horizontal chips — "By Logbook" (default), "By Location", "By Asset". Active: brand-500 bg white text. Inactive: white bg, gray text, border
- **Filter bar**: date range dropdown (Today / Last 7 days / Last 30 days / Custom), status chips (multi-select: All / Pending Review / Approved / Rejected), search input
- **Summary stats**: 4 cards — Pending (#EDA101), Approved (#00825D), Rejected (#D14343), Total (#0F1B33)
- **Desktop/tablet (>=834px)**: Table layout with columns: checkbox (40px), date (120px), logbook (160px), location (140px), asset (130px), operator (120px), status chip (100px), actions (80px). Header row `bg-gray-100`, alternating row tint, 52px rows, hover state `bg-brand-100`. Rows grouped under collapsible headers per active slice mode (e.g., "Cleaning Log (8 entries, 3 pending)")
- **Mobile (<834px)**: Card list layout. Each card: date (top-left), status chip (top-right), logbook name (bold), location + asset on second line, operator third line, Approve/Reject/View buttons as bottom action row. Bulk select via a "Select" toggle button in the header (not per-row checkboxes)
- **Bulk actions bar**: fixed bottom bar when rows selected — dark background (#0F1B33), white text, "X entries selected" + "Approve Selected" (green) + "Reject Selected" (red). Confirmation modal on action
- Data sourced from `getEntriesBySlice(activeSlice)`, filtered by location via `currentLocation.id`

**New: `src/components/ram/EntryDetailDrawer.tsx`**
- **Tablet (>=834px)**: Right-side panel, 420px wide, overlays the grid. Stays open while reviewer clicks different rows (content updates without close/reopen animation). Close button (X) top right
- **Mobile (<834px)**: Full-screen sheet with back arrow to return to grid
- Content: logbook name + date header, meta section (operator, location, asset, submitted time, e-signature chip, version), read-only field values with pre-fill indicators and modification callouts, audit trail timeline, footer with Approve/Reject/Request Correction buttons
- "Request Correction" opens modal with textarea + "Send to Operator" button, changes status to "Correction Requested"

---

## Phase 6: StatusChip Updates

**Edit: `src/components/ram/StatusChip.tsx`**
Add new statuses to the config map:
- `"pending-review"` — label "Pending Review", bg `#FEEBCD`, text `#EDA101`
- `"approved"` — label "Approved", bg `#ECFDF3`, text `#00825D`
- `"rejected"` — label "Rejected", bg `#FFDEDE`, text `#D14343`
- `"correction-requested"` — label "Correction Requested", bg `#E0F2FE`, text `#0088CE`
- `"published"` — label "Published", bg success-100, text success-400
- `"draft"` — label "Draft", bg warning-100, text warning-400
- `"archived"` — label "Archived", bg gray-200, text gray-800

---

## Files Summary

| Action | File |
|--------|------|
| Create | `src/data/mockAssets.ts` (interfaces, mock data, helper functions) |
| Create | `src/pages/Execute.tsx` |
| Create | `src/pages/AssetList.tsx` |
| Create | `src/pages/AssetLogbooks.tsx` |
| Create | `src/pages/ManageTemplates.tsx` |
| Create | `src/pages/TemplateDetail.tsx` |
| Create | `src/pages/CreateTemplate.tsx` |
| Create | `src/pages/ReviewDashboard.tsx` |
| Create | `src/components/ram/EntryDetailDrawer.tsx` |
| Edit   | `src/App.tsx` |
| Edit   | `src/components/ram/SidebarNav.tsx` |
| Edit   | `src/components/ram/BottomNav.tsx` |
| Edit   | `src/components/ram/StatusChip.tsx` |

No existing components, design tokens, or screens are removed. All existing routes (entry form, scan flow, sync queue, location settings) remain unchanged.
