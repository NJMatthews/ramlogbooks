
# Logbook v1 Spec — Gap Analysis & Plan

Mapping the spec (Draft v0.3) against the current prototype (Execute / Manage / Review workflows).

## 1. What we have right

- **Three-surface model** Execute / Manage / Review maps cleanly to the spec's mobile execution + web authoring + QA review split.
- **Execute as primary capture surface** — asset-led, scan-to-start, single-tap entry, View History on the card. Matches "mobile-first, point-of-capture" intent.
- **Asset binding** — every instance is bound to an asset (or location), matching P0.4 "Native RAM linkage" at the UI level.
- **Review-by-exception scaffolding** — ReviewDashboard with slice-by-logbook (grouped per asset), pending/approved/rejected statuses, batch grid view. Aligns with P0.5.
- **Template versioning** — TemplateDetail shows immutable v1.0/v2.0/v2.1 with "Active/Superseded", entry counts, change summary, revert/fork. Aligns with story §Template Author #4.
- **Template authoring entry points** — "Scan Paper" vs "Create from Scratch" (Manage) matches P2.1 paper-to-digital posture (scan today, AI-assist later).
- **E-sign drawer** with QR/NFC animations — covers the "Performed / Verified / Reviewed" capture moment.
- **Offline queue page** exists as a surface (OfflineQueue route).

## 2. What needs iteration

- **E-sign meaning is not explicit.** Drawer captures a signature but doesn't make the operator pick **Performed / Verified / Reviewed** (P0 story #5). Needs a meaning selector + display on the entry.
- **Review queue filters are thin.** Spec P0.5 calls for filters by *exception, overdue review, logbook type, site, assignee*, sorted oldest-exception-first, with **SLA breach flags**. Current slices group but don't filter by exception/SLA/assignee.
- **Audit trail surface is minimal.** Mock `auditTrail` has 3 generic entries. Spec P0.2 requires ALCOA++ fields: actor, timestamp, prior→new value, reason code, chain-of-trust hash, template version hash, plus **captured vs synced timestamps**. EntryDetailDrawer should expose these.
- **Trace visibility.** Spec requires the Evaluation Service trace inline next to each verdict (story #7, P0.7/P0.8). We have no concept of a per-field verdict/trace yet.
- **Offline indicator.** OfflineQueue exists but Execute has no persistent "offline / X queued / last sync" status bar to make offline-first tangible.
- **Template version binding on entries.** Review entries carry a `version` string but the entry detail doesn't show "bound template version hash" or warn on version drift.
- **Manage > scope binding.** Templates list locations/assets counts but there's no UI for binding **who can initiate / perform / verify / review** per scope (story Sys Admin #3).

## 3. Missing / changes our implementation

- **Exception handling flow (P0.3).** When an out-of-limit value is entered the operator must be forced through:
  1. impact assessment text,
  2. optional attachment,
  3. escalation-path preview,
  before e-sign is allowed. Currently the entry form doesn't evaluate limits or block sign.
- **Auto-drafted RAM work request (P0.3 / story Maint #6).** No "draft work request" affordance from a failed entry.
- **Audit-ready export bundle (P0.6).** No Export action anywhere in Review (manifest + entries + audit + signatures + traces + linked WOs + SHA-256 hash + <90s for single-asset/quarter scope).
- **Criteria tree + formula editor with test bench (P0.9, story Author #2).** CreateTemplate has fields but no visual criteria tree (AND/OR), no equation editor, no test bench.
- **Field library parity with Evaluation Service.** Current field types (Text/Number/Date/Time/Textarea/Toggle/Dropdown) need: **numeric with limits, pass/fail, controlled list, photo, controlled text, e-sign meaning**.
- **Linked RAM context inside entries (P0.4).** No "latest calibration / open WO" panel on an entry against an instrument.
- **SLA / overdue-review concept** on review entries.
- **Captured-vs-synced timestamp** on entries.
- **Photo / attachment capture (P1.1)** and **voice-to-text (P1.2)** — not present.
- **Supervisor real-time rounds view (P1.3 web at GA)** — no supervisor dashboard.

## 4. Proposed plan (phased)

### Phase A — Make execution feel ALCOA++ (highest spec leverage)
1. **E-sign meaning** — add Performed / Verified / Reviewed selector in `ESignDrawer`; display chosen meaning on entry detail + audit trail.
2. **Per-field limits + verdict + trace** — extend `TemplateField` with `limits`/`criteria`; render inline Pass/Fail chip and a "Why?" popover showing the trace (comparison, value, outcome) in `LogbookEntryForm` and `EntryDetailDrawer`.
3. **Exception flow** — when a verdict fails, block submit; require impact text + optional photo, show escalation preview, then allow sign.
4. **Auto-draft work request** — on failed sign, generate a mock WR card linked back to the entry; show on entry detail.

### Phase B — Review-by-exception parity with P0.5/P0.6
5. **Filter chips** in `ReviewDashboard`: Exceptions only, Overdue (SLA), My logbooks, Logbook type, Site, Assignee. Sort: oldest-exception first when "Exceptions" active.
6. **SLA breach flag** on review cards.
7. **Full ALCOA++ audit trail** in `EntryDetailDrawer` (actor, prior→new, reason code, version hash, captured + synced timestamps, trace).
8. **Export bundle** action — generates a manifest preview (entries / audit / signatures / linked WOs / traces / SHA-256) for the selected scope.

### Phase C — Offline + RAM linkage signal
9. Add persistent **offline status bar** + queued-count to AppLayout; surface captured-vs-synced timestamps on entries.
10. On instrument entries, render a **"Linked RAM context"** panel (latest calibration, open WOs) — mock data.

### Phase D — Authoring catches up to Evaluation Service vocabulary
11. Extend field library in `CreateTemplate` with **numeric+limits, pass/fail, controlled list, photo, controlled text, e-sign meaning**.
12. Add a **visual criteria tree** (AND/OR comparisons) and a **formula editor with test bench** on TemplateDetail.
13. Add **scope binding** UI: per (site/area/asset) assign who can Initiate / Perform / Verify / Review.

### Phase E — P1 polish
14. Mobile **photo/attachment capture** affordance in entry form.
15. **Voice-to-text** mic on Textarea fields.
16. Supervisor **rounds-completion** view (small dashboard).

### Out of scope for now (P2 / Non-Goals)
- Utility/Facility Rounds, Shift Handover, full MES/eQMS, customer-authored AI, unit dimensional analysis.

## 5. Recommended next step

Start with **Phase A (items 1–4)** since it's where the spec is most differentiated ("logbook entry as evidence, not as form") and where our current Execute flow visibly diverges. Each item is a small, independent UI change against existing files (`ESignDrawer`, `LogbookEntryForm`, `EntryDetailDrawer`, `mockAssets.ts`).

Want me to kick off Phase A, or pick specific items first?
