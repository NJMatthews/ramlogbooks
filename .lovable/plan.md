
# Core Problems → Prototype Alignment (v1 logbook families)

Mapping the Core Problems doc against the current build. The end-to-end walkthrough (create → bind → execute → exception → sign/lock → review → export) is already wired. The gaps are about **logbook family taxonomy, family-specific field patterns, and three sign-off behaviors** that the walkthroughs assume.

## What we already have ✅

- ALCOA++ entry surface with limits, verdicts, "Why?" traces (`evaluation.ts`, `FieldVerdict`).
- Exception flow → impact assessment → escalation preview → auto-draft WR (`ExceptionDrawer`, `SuccessDrawer`).
- E-sign meanings Performed / Verified / Reviewed (`ESignDrawer`).
- Review-by-exception with SLA, filters, audit trail, export bundle (`ReviewDashboard`, `ExportBundleModal`).
- Linked RAM context, offline status, captured-vs-synced (`LinkedRamContext`, `StatusBar`).
- PIN + badge login (just shipped).

## What's missing for the 4 in-scope families

### 1. Logbook family taxonomy
- Add `family: "equipment-status" | "maintenance" | "cleaning" | "calibration" | "rounds" | "handover"` and `scope: "primary" | "adjacent" | "oos"` to `Logbook`.
- Family chip + filter on Execute, AssetLogbooks, Manage, Review.
- Out-of-scope families render with a muted "Not in v1" badge so the prioritization story is visible.

### 2. Seed the eight example logbooks
Replace/extend `mockLogbooks` and `logbooksByLocation` with the doc's examples so each walkthrough is demoable:

| Family | Example | New patterns it surfaces |
|---|---|---|
| Equipment Status | Autoclave A-101 Daily Use | Pre-fill status + last cycle, fail-forces-photo + WR draft |
| Equipment Status | Torque Wrench TW-044 Checkout/Return | Two-step record (out → in), damage path |
| Cleaning | Line P-2 Clearance | Required photos, dual sign-off (Lead + QA) |
| Cleaning | CIP-03 Post-Clean | Numeric tolerance, forced re-rinse follow-up |
| Maintenance | Filler F-220 Downtime Troubleshoot | Symptom taxonomy, troubleshooting steps, parts used |
| Maintenance | AHU-7 Temporary Mitigation | Authorized meaning, daily reminder, close-on-WR |
| Calibration | Scale S-015 Daily Verify | Tolerance verdict, stop-use confirm on OOT |
| Calibration | PT-88 Post-Maintenance | As-found / adjustment / as-left triplet |

### 3. Three new sign-off behaviors
- **Dual sign-off** (`requireDualSignoff: true`): after first e-sign, entry sits in "Awaiting verifier" state; second user must sign with "Verified" meaning before lock. Show pending-verifier banner on entry detail.
- **Authorized meaning** (5th meaning) for mitigations: added to `ESignDrawer` meanings list; rendered with shield icon and "Authorizes a temporary deviation from procedure" copy.
- **Stop-use confirmation** on OOT calibration: when verdict fails on a calibration logbook, exception drawer adds a required "Place asset out of service" checkbox; on submit, asset status flips to `out-of-service` in mock state and a banner appears on the asset card.

### 4. Field-library additions
- `attachment` field type with a `requiredOnFail` flag — used by Autoclave, Line Clearance, troubleshooting photos.
- `parts-used` field type — chip picker (mock parts list) with qty and optional lot.
- `triplet` field — expected / observed / as-left with shared limits; auto-computes verdict.
- `symptom` controlled list — Leak / Sensor Fault / Jam / Electrical / Other.
- `status` field — In Service / Out of Service / Under Maintenance; pre-fills from asset and writes back on submit.
- `linked-wo` field — free text → resolves to mock WO chip.

### 5. Rework + recurring-entry rules
- `followUpOnFail: "same-template"` for the CIP re-rinse case: on failed lock, immediately offer a "Log re-rinse" prompt that opens a fresh entry pre-linked to the failing one.
- `recurrence: "daily-until-closed"` for mitigation: open mitigations show on Execute as "Daily check due" cards, and the mitigation closes when its referenced WO is completed.

### 6. Review extensions
- Failure-mode tag picker on review (planner tags by symptom for trending).
- "Awaiting verifier" filter chip (dual sign-off queue).
- "Open mitigations" filter chip.

### 7. Manage / Authoring
- Family selector in CreateTemplate ("Equipment Status / Maintenance / Cleaning / Calibration / …") with scope badge auto-set.
- Toggles in template settings: `requireDualSignoff`, `attachmentRequiredOnFail`, `followUpOnFail`, `recurrence`.
- Field-library palette updated with the six new types above.

## Files touched (high level)

- `src/data/mockLogbooks.ts` — add `family`/`scope`, new field types (`attachment`, `parts-used`, `triplet`, `symptom`, `status`, `linked-wo`), seed 8 example templates' field sets, dual-signoff + followUpOnFail metadata.
- `src/data/mockLocations.ts` + `src/data/mockAssets.ts` — bind new logbook ids to assets (Autoclave A-101, CIP-03, Filler F-220, AHU-7, Scale S-015, PT-88, Line P-2, TW-044) and add asset `status`.
- `src/lib/evaluation.ts` — extend to support `triplet` evaluation and per-field `requiredOnFail` checks.
- `src/components/ram/ESignDrawer.tsx` — add `authorized` meaning; expose `requireDualSignoff` state.
- `src/components/ram/ExceptionDrawer.tsx` — required attachment slot, "Place asset OOS" checkbox for calibration family.
- `src/components/ram/SuccessDrawer.tsx` — handle "Awaiting verifier" copy; "Log re-rinse" follow-up CTA.
- `src/components/ram/StatusChip.tsx` — render asset In Service / OOS / Under Maintenance.
- New components: `FamilyChip`, `AttachmentField`, `PartsUsedField`, `TripletField`, `StatusField`, `LinkedWOField`, `DualSignoffBanner`.
- `src/pages/LogbookEntryForm.tsx` — render new field types, follow-up prompt.
- `src/pages/Execute.tsx` + `src/pages/AssetLogbooks.tsx` — family chips, "Daily check due" cards for active mitigations.
- `src/pages/ReviewDashboard.tsx` — failure-mode tagging, dual-signoff and open-mitigation filters.
- `src/pages/CreateTemplate.tsx` + `src/pages/TemplateDetail.tsx` — family selector, scope badge, new template toggles, expanded field palette.

## Suggested sequencing

1. **Slice A — Taxonomy + seed data.** Add family/scope, swap in the 8 example logbooks with their fields. Lowest-risk, biggest demo lift; everything below builds on it.
2. **Slice B — Field-library additions** (attachment with requiredOnFail, status, triplet, parts-used, symptom, linked-wo) wired into LogbookEntryForm.
3. **Slice C — Sign-off behaviors:** dual sign-off, Authorized meaning, stop-use confirmation.
4. **Slice D — Rework + recurrence:** CIP re-rinse follow-up, mitigation daily-check + close-on-WR.
5. **Slice E — Review/authoring polish:** failure-mode tagging, new review chips, CreateTemplate family + toggles.

Want me to start with Slice A (taxonomy + seed the 8 example logbooks), or combine A+B so the new logbooks open with their real field patterns from the first commit?
