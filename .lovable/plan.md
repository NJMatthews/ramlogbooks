
# VoC-Driven Prototype Changes (revised)

You're right — tablet form factor, location pinning, and PIN/badge auth on submit already exist. The kiosk pattern is mostly there; we just need to **close the loop on login** and focus the rest of the work on the higher-leverage VoC items.

## Tier 1 — Adoption-critical

### 1. Simulated PIN / badge login (NEW, lightweight)
Reuse the existing PIN + badge-tap animations from `ESignDrawer` for session start, not just signing.
- New `/login` (or kiosk-mode lock screen) showing "Tap badge or enter PIN" — same visuals as the e-sign drawer.
- On success, set a mock `currentUser` in context (e.g., "J. Martinez, Operator"). No backend; pure prototype.
- Idle timeout on the location-pinned tablet: after N minutes of inactivity, snap back to the lock screen. Reinforces the "no full RAM login" story Pablo described.
- Show the active user as a small chip in `StatusBar` with a "Switch user" affordance (tap badge → swap).

### 2. Compress Execute to "scan → action menu → sign" (Cindy, Pablo)
Today: Execute → Asset → Logbook → Form (4 taps). Target: 2 taps for repeat entries.
- After scan/asset select, show a **What do you want to do?** sheet: *Log a reading*, *Report an issue*, *View history*, *Start PM*. Mirrors Cindy's quote verbatim.
- Auto-apply Quick Fill silently for repeat-cadence logbooks (keep banner only for first-of-shift) so the form opens pre-filled and one tap from signing.

### 3. Soft review gate, not a hard block (Vicki — the abandonment story)
Biggest risk in the spec. Rework P0.5 wiring:
- Add `reviewPolicy` to template: `none | notify | block`, plus `reviewCadence` (every N entries, on exception, by logbook type).
- In `LogbookEntryForm`, when cadence is hit and policy = `notify`: show a non-blocking banner ("Review due — reviewer notified") and allow the next entry to proceed.
- Add a fourth e-sign meaning: **Documented** (self-certifying, no review required) alongside Performed/Verified/Reviewed in `ESignDrawer`.
- Surface a "Review backlog" badge on `ReviewDashboard` instead of blocking capture.

### 4. Promote attachments to P0 (Brian — "pictures tell 1000 words")
- New `photo` field type in `mockLogbooks.ts` and `CreateTemplate` field library.
- Camera/upload affordance in `LogbookEntryForm`, thumbnail strip on the entry.
- In `EntryDetailDrawer`, render a **photo timeline comparison** strip (Vicki's gauge-over-days concern) — same field across recent entries.
- Auto-attach selected photos when an exception drafts a Work Request.

## Tier 2 — Configurability & linkage

### 5. Per-asset / per-type template binding UX (Vicki, Cindy — "work plan template" model)
- In `TemplateDetail`, present "Associations" as a Work-Plan-style **Scope bindings** matrix: asset type × site × role with chip selectors.
- Show "Copies from" lineage when forking.
- Field library additions in `CreateTemplate`: numeric+limits, pass/fail, controlled list, photo, calculated field, e-sign meaning.

### 6. Calculated fields with test bench (Sandeep — fridge delta example)
- Add `calculated` field type: formula references other fields by id (e.g. `display - reference`), with a `limits` block.
- Mini test bench in `CreateTemplate`: enter sample values, see verdict trace live. Reuses `src/lib/evaluation.ts`.

### 7. Bidirectional event ↔ logbook linkage (Vicki, Brian)
- In `LinkedRamContext`, add "Auto-generated entries": PM/calibration completion shows up as a system-authored entry on the timeline.
- On `LogbookHistory`, unified asset timeline: entries + work orders + PMs + permits interleaved (Mathew/Vicki's mental model), with filter toggle.
- Free-text linkage chips for **work order #** and **permit #** (Brian, Graham) that resolve to mock RAM records.

### 8. Multi-asset / room-level entry (Graham, Pablo, Phyllis)
- Allow an entry to bind to a **location node** or **parent system** in addition to a single asset.
- On bind, checklist of child assets with "apply to all / select subset" toggle.
- Child asset timelines show parent entry with a "Room-level" chip.

## Tier 3 — Access model & polish

### 9. Lighter access tier (Pablo, Cindy, Mathew)
- Introduce a `logbookOnly` role for the mock user from #1.
- "License: Logbook user (no seat consumed)" pill in `LocationSettings` to make the licensing story visible to Vicki/Cindy.

### 10. Required-field nuance & edit justification (Vicki, Cindy)
- Templates declare `required` per field with a "soft required" option (warn, don't block).
- Any post-sign edit opens a Justification drawer; reason + e-sign captured in audit trail (RAM Request #10 with Vicki's audit nuance).

### 11. Validation niceties (Cindy, Jonathan)
- Number fields reject alpha input.
- Block entry creation against retired assets (banner on `AssetLogbooks`).
- Start/end date sanity check.

## Tier 4 — Parking lot

R3→R4 migration UX, voice-to-text, supervisor rounds dashboard.

## Files touched (high level)

- `src/App.tsx` — `/login` route + idle-timeout wrapper.
- New: `src/pages/Login.tsx`, `src/components/ram/ActionMenuSheet.tsx`, `src/components/ram/PhotoField.tsx`, `src/components/ram/AssetTimeline.tsx`, `src/components/ram/JustificationDrawer.tsx`, `src/hooks/useCurrentUser.tsx`.
- `src/components/ram/ESignDrawer.tsx` — extract PIN/badge visuals into a shared component, add `documented` meaning.
- `src/components/ram/StatusBar.tsx` — current-user chip, switch-user.
- `src/components/ram/EntryDetailDrawer.tsx` — photo comparison strip, justification trail.
- `src/components/ram/LinkedRamContext.tsx` — auto-generated entries section.
- `src/pages/LogbookEntryForm.tsx` — action menu integration, photo field, soft review banner, room-level binding control.
- `src/pages/LogbookHistory.tsx` — unified timeline toggle.
- `src/pages/TemplateDetail.tsx` + `src/pages/CreateTemplate.tsx` — scope-binding matrix, expanded field library, formula test bench.
- `src/pages/ReviewDashboard.tsx` — review-backlog badge, policy-aware filtering.
- `src/pages/LocationSettings.tsx` — logbook-user license pill.
- `src/data/mockLogbooks.ts`, `src/data/mockAssets.ts` — `reviewPolicy`/`reviewCadence`, `photo` + `calculated` field types, auto-generated entry samples, permit/WO link fields.

## Suggested sequencing

1. **Phase 1:** Login (PIN/badge) + idle reset, action menu, soft review gate + Documented meaning, photo attachments.
2. **Phase 2:** Scope-binding matrix, calculated fields + test bench, event-to-logbook reverse flow, multi-asset binding.
3. **Phase 3:** Logbook-only license tier, edit justification, validation niceties.

Want me to kick off Phase 1, or start with just the login + idle-reset slice so we can demo the full "tablet wakes → tap badge → enter → sign → idle → lock" loop first?
