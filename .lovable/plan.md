

# Drag-and-Drop Form Builder for Layout Editing

## Overview
When clicking "Edit Layout" from the Publish step, instead of going back to the layout selection screen, users will enter a visual form builder where they can rearrange, resize, add, and remove fields using drag-and-drop.

## New Phase: `layout-edit`
Add a new `FlowPhase` value `"layout-edit"` that renders the form builder. The "Edit Layout" button on the Publish step will navigate to this phase instead of going back to `"layout"`.

## Form Builder Features

### 1. Drag-and-Drop Reordering
- Each field rendered as a draggable card with a grip handle
- Use HTML5 Drag and Drop API (no new dependencies needed)
- Visual drop indicator (blue line) shows where the field will land
- Fields can be moved up/down in the list

### 2. Grid Layout with Width Control
- Fields sit on a 2-column grid (matching the paper layout concept)
- Each field has a width toggle: **Half (1 col)** or **Full (2 cols)**
- Height option for text areas: **Short** (single line) or **Tall** (multi-line/textarea)

### 3. Spacing Control
- A simple spacing toggle at the top: **Compact**, **Normal**, **Relaxed**
- Adjusts the gap between all fields uniformly

### 4. Add and Remove Fields
- "Add Field" button (dashed border card) at the bottom of the grid
- Each field card has a delete (trash) icon button
- New fields default to half-width, Text type

### 5. Field Editing Inline
- Tap a field card to edit its label and type inline
- Shows field type badge on each card

### 6. Live Preview
- The grid updates in real time as fields are dragged, resized, or removed
- A "Done" button saves and returns to Publish, which re-renders using the updated field layout data

## Data Model Changes
Add `colSpan` (1 or 2) and `rowHeight` ("short" | "tall") properties to the `ScanField` interface in `mockLogbooks.ts`.

## Files to Modify

1. **`src/data/mockLogbooks.ts`** -- Add `colSpan` and `rowHeight` to `ScanField` interface, set defaults on mock data
2. **`src/pages/ScanCamera.tsx`** -- Main changes:
   - Add `"layout-edit"` to `FlowPhase`
   - Change "Edit Layout" button to navigate to `layout-edit` instead of `layout`
   - Build the full form builder UI in a new conditional block for `phase === "layout-edit"`
   - Implement drag handlers (`onDragStart`, `onDragOver`, `onDrop`) for reordering
   - Add width/height toggle buttons per field card
   - Add spacing selector (Compact/Normal/Relaxed)
   - Add/remove field functionality
   - "Done" button returns to `publish` phase

## Technical Details

- **Drag-and-drop**: Pure HTML5 drag API with `draggable` attribute, `onDragStart`/`onDragOver`/`onDrop` handlers, and `useState` for tracking drag index and drop target
- **Grid rendering**: CSS Grid with `grid-cols-2`, fields use `col-span-1` or `col-span-2` based on their `colSpan` property
- **No new dependencies required** -- all built with existing React, Tailwind, and Lucide icons

