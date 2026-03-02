import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GripVertical, Pencil, PlusCircle, X, Eye, RotateCcw, GitBranch } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { StatusChip } from "@/components/ram/StatusChip";
import { RAMDrawer } from "@/components/ram/RAMDrawer";
import { RAMInput } from "@/components/ram/RAMInput";
import { CreateMethodDrawer } from "@/components/ram/CreateMethodDrawer";
import { getTemplateById, mockTemplateVersions, locationAssociations, type TemplateField, type TemplateVersion } from "@/data/mockAssets";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { mockLocations } from "@/data/mockLocations";

type TabId = "fields" | "associations" | "versions";

const FIELD_TYPES = ["Text", "Number", "Date", "Time", "Textarea", "Toggle", "Dropdown"] as const;

export default function TemplateDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const template = getTemplateById(id ?? "");
  const versions = mockTemplateVersions[id ?? ""] ?? [];

  const [activeTab, setActiveTab] = useState<TabId>("fields");
  const [addFieldOpen, setAddFieldOpen] = useState(false);
  const [versionModalOpen, setVersionModalOpen] = useState(false);
  const [methodDrawerOpen, setMethodDrawerOpen] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<TemplateVersion | null>(null);
  const [revertConfirmVersion, setRevertConfirmVersion] = useState<TemplateVersion | null>(null);

  // Add field drawer state
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<TemplateField["type"]>("Text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldMin, setNewFieldMin] = useState("");
  const [newFieldMax, setNewFieldMax] = useState("");
  const [newFieldMaxChars, setNewFieldMaxChars] = useState("");
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([""]);
  const [newFieldDateRestrict, setNewFieldDateRestrict] = useState("any");
  const [newFieldToggleLabels, setNewFieldToggleLabels] = useState(["Pass", "Fail"]);

  // Associations state
  const [enabledLocations, setEnabledLocations] = useState<Record<string, boolean>>({
    "loc-001": true, "loc-002": true, "loc-005": true,
  });
  const [removedAssets, setRemovedAssets] = useState<Set<string>>(new Set());

  if (!template) {
    return (
      <AppLayout>
        <HeaderNav type="back" title="Template Not Found" />
      </AppLayout>
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "fields", label: "Fields" },
    { id: "associations", label: "Associations" },
    { id: "versions", label: "Versions" },
  ];

  const resetFieldForm = () => {
    setNewFieldName("");
    setNewFieldType("Text");
    setNewFieldRequired(false);
    setNewFieldMin("");
    setNewFieldMax("");
    setNewFieldMaxChars("");
    setNewFieldOptions([""]);
    setNewFieldDateRestrict("any");
    setNewFieldToggleLabels(["Pass", "Fail"]);
  };

  return (
    <AppLayout>
      <HeaderNav
        type="back"
        title={template.name}
        rightAction={
          <button
            onClick={() => setMethodDrawerOpen(true)}
            className="flex items-center gap-ram-sm rounded-ram-md border border-border px-ram-xl py-ram-md text-text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Edit Template
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-border px-ram-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-ram-xl py-ram-lg text-text-sm font-medium transition-colors border-b-2",
              activeTab === tab.id
                ? "border-brand-500 text-brand-500"
                : "border-transparent text-gray-600 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl">
        {/* ── Fields Tab ── */}
        {activeTab === "fields" && (
          <div className="space-y-ram-md">
            {template.fields.map((field, i) => (
              <div
                key={i}
                className="flex items-center gap-ram-md rounded-ram-md border border-border bg-card p-ram-lg"
              >
                <GripVertical className="h-4 w-4 shrink-0 text-gray-400 cursor-grab" />
                <div className="flex-1 min-w-0">
                  <span className="text-[15px] font-extrabold text-foreground">
                    {field.name}
                    {field.required && <span className="text-error-600 ml-1">*</span>}
                  </span>
                  {field.validation && (
                    <span className="ml-ram-lg text-text-xs text-gray-500">{field.validation}</span>
                  )}
                  {field.autoFill && (
                    <span className="ml-ram-lg text-text-xs text-gray-500">{field.autoFill}</span>
                  )}
                </div>
                <span className="inline-flex items-center rounded-full bg-gray-200 px-ram-lg py-ram-xxs text-text-xs text-gray-600">
                  {field.type}
                </span>
                <button className="text-brand-500 hover:text-brand-600">
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              onClick={() => { resetFieldForm(); setAddFieldOpen(true); }}
              className="flex w-full items-center justify-center gap-ram-sm rounded-ram-md border border-dashed border-gray-300 py-ram-lg text-text-sm font-medium text-brand-500 hover:bg-brand-100 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Add Field
            </button>

            {template.fields.length === 0 && (
              <p className="text-center text-text-sm text-gray-500 py-ram-4xl">
                No fields added yet. Add fields to define what operators will fill out.
              </p>
            )}
          </div>
        )}

        {/* ── Associations Tab ── */}
        {activeTab === "associations" && (
          <div className="space-y-ram-xl">
            {mockLocations.map((loc) => {
              const assocData = locationAssociations[loc.id];
              const enabled = enabledLocations[loc.id] ?? false;
              const assets = assocData?.assets ?? [];
              return (
                <div key={loc.id} className="rounded-ram-md border border-border bg-card p-ram-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-extrabold text-foreground">{loc.name}</span>
                    <Switch
                      checked={enabled}
                      onCheckedChange={(v) =>
                        setEnabledLocations((prev) => ({ ...prev, [loc.id]: v }))
                      }
                    />
                  </div>
                  {enabled && assets.length > 0 && (
                    <div className="mt-ram-lg flex flex-wrap gap-ram-sm">
                      {assets
                        .filter((a) => !removedAssets.has(a.assetId))
                        .map((a) => (
                          <span
                            key={a.assetId}
                            className="inline-flex items-center gap-1 rounded-full bg-brand-200 px-ram-lg py-ram-xxs text-text-xs text-brand-500"
                          >
                            {a.assetName}
                            <button
                              onClick={() =>
                                setRemovedAssets((prev) => new Set(prev).add(a.assetId))
                              }
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="sticky bottom-0 bg-background py-ram-lg">
              <button className="w-full rounded-ram-md bg-brand-500 py-ram-lg text-text-md font-extrabold text-primary-foreground">
                Save Associations
              </button>
            </div>
          </div>
        )}

        {/* ── Versions Tab ── */}
        {activeTab === "versions" && (
          <div className="space-y-ram-lg">
            <div className="flex justify-end">
              <button
                onClick={() => setMethodDrawerOpen(true)}
                className="flex items-center gap-ram-sm rounded-ram-md border border-border px-ram-xl py-ram-md text-text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <PlusCircle className="h-4 w-4" />
                Create New Version
              </button>
            </div>

            {versions.map((ver) => (
              <div
                key={ver.version}
                className="rounded-ram-md border border-border bg-card p-ram-xl"
              >
                <div className="flex items-center gap-ram-md flex-wrap">
                  <span className="text-[15px] font-extrabold text-foreground">{ver.version}</span>
                  <StatusChip
                    status={ver.status === "Active" ? "published" : "archived"}
                  />
                  <span className="text-text-xs text-gray-500">{ver.entryCount} entries</span>
                </div>
                <p className="mt-ram-sm text-text-sm text-gray-500">
                  {ver.date} · by {ver.author}
                </p>
                <p className="mt-ram-sm text-text-sm text-gray-600">{ver.changeSummary}</p>
              </div>
            ))}

            {versions.length === 0 && (
              <p className="text-center text-text-sm text-gray-500 py-ram-4xl">
                No version history available.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Add Field Drawer */}
      <RAMDrawer
        open={addFieldOpen}
        onClose={() => setAddFieldOpen(false)}
        title="Add Field"
        footer={
          <button
            onClick={() => setAddFieldOpen(false)}
            className="w-full rounded-ram-md bg-brand-500 py-ram-lg text-text-md font-extrabold text-primary-foreground"
          >
            Add Field
          </button>
        }
      >
        <div className="space-y-ram-xl">
          <RAMInput label="Field Name" value={newFieldName} onChange={setNewFieldName} placeholder="e.g., Temperature (°C)" />

          <div className="flex flex-col gap-ram-sm">
            <label className="text-text-sm font-medium text-gray-800">Field Type</label>
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as TemplateField["type"])}
              className="rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-lg text-text-md text-foreground"
            >
              {FIELD_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-ram-md text-text-sm font-medium text-gray-800 cursor-pointer">
            <Switch checked={newFieldRequired} onCheckedChange={setNewFieldRequired} />
            Required
          </label>

          {/* Type-specific validation UI */}
          {newFieldType === "Number" && (
            <div className="grid grid-cols-2 gap-ram-lg">
              <RAMInput label="Min" value={newFieldMin} onChange={setNewFieldMin} type="number" placeholder="0" />
              <RAMInput label="Max" value={newFieldMax} onChange={setNewFieldMax} type="number" placeholder="100" />
            </div>
          )}

          {(newFieldType === "Text" || newFieldType === "Textarea") && (
            <RAMInput label="Max Characters" value={newFieldMaxChars} onChange={setNewFieldMaxChars} type="number" placeholder="500" />
          )}

          {newFieldType === "Dropdown" && (
            <div className="flex flex-col gap-ram-sm">
              <label className="text-text-sm font-medium text-gray-800">Options</label>
              {newFieldOptions.map((opt, i) => (
                <div key={i} className="flex items-center gap-ram-sm">
                  <input
                    value={opt}
                    onChange={(e) => {
                      const next = [...newFieldOptions];
                      next[i] = e.target.value;
                      setNewFieldOptions(next);
                    }}
                    className="flex-1 rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-md text-text-md"
                    placeholder={`Option ${i + 1}`}
                  />
                  {newFieldOptions.length > 1 && (
                    <button onClick={() => setNewFieldOptions(newFieldOptions.filter((_, j) => j !== i))}>
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setNewFieldOptions([...newFieldOptions, ""])}
                className="text-text-sm font-medium text-brand-500 hover:underline self-start"
              >
                + Add Option
              </button>
            </div>
          )}

          {newFieldType === "Date" && (
            <div className="flex flex-col gap-ram-sm">
              <label className="text-text-sm font-medium text-gray-800">Restrict to</label>
              <select
                value={newFieldDateRestrict}
                onChange={(e) => setNewFieldDateRestrict(e.target.value)}
                className="rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-lg text-text-md text-foreground"
              >
                <option value="any">Any date</option>
                <option value="past">Past only</option>
                <option value="future">Future only</option>
              </select>
            </div>
          )}

          {newFieldType === "Toggle" && (
            <div className="grid grid-cols-2 gap-ram-lg">
              <RAMInput
                label="Label 1"
                value={newFieldToggleLabels[0]}
                onChange={(v) => setNewFieldToggleLabels([v, newFieldToggleLabels[1]])}
              />
              <RAMInput
                label="Label 2"
                value={newFieldToggleLabels[1]}
                onChange={(v) => setNewFieldToggleLabels([newFieldToggleLabels[0], v])}
              />
            </div>
          )}
        </div>
      </RAMDrawer>

      {/* Version Modal */}
      {versionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60">
          <div className="mx-ram-xl max-w-md rounded-ram-xl bg-card p-ram-3xl shadow-ram-lg">
            <h3 className="text-text-lg font-extrabold text-foreground">Create New Version</h3>
            <p className="mt-ram-lg text-text-sm text-gray-600">
              Version management is available in the full release. New versions lock existing entries on their original format and apply the new format to all future entries.
            </p>
            <button
              onClick={() => setVersionModalOpen(false)}
              className="mt-ram-xl w-full rounded-ram-md bg-brand-500 py-ram-lg text-text-md font-extrabold text-primary-foreground"
            >
              Got It
            </button>
          </div>
        </div>
      )}


      <CreateMethodDrawer open={methodDrawerOpen} onClose={() => setMethodDrawerOpen(false)} />
    </AppLayout>
  );
}
