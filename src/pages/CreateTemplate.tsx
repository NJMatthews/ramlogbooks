import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, X } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { RAMInput } from "@/components/ram/RAMInput";
import { RAMTextarea } from "@/components/ram/RAMTextarea";
import { RAMDrawer } from "@/components/ram/RAMDrawer";
import { Switch } from "@/components/ui/switch";
import { mockLocations } from "@/data/mockLocations";
import { locationAssociations, type TemplateField } from "@/data/mockAssets";
import { toast } from "@/hooks/use-toast";

const FIELD_TYPES = ["Text", "Number", "Date", "Time", "Textarea", "Toggle", "Dropdown"] as const;

export default function CreateTemplate() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState<TemplateField[]>([]);
  const [addFieldOpen, setAddFieldOpen] = useState(false);

  // field drawer state
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<TemplateField["type"]>("Text");
  const [newFieldRequired, setNewFieldRequired] = useState(false);
  const [newFieldMin, setNewFieldMin] = useState("");
  const [newFieldMax, setNewFieldMax] = useState("");
  const [newFieldMaxChars, setNewFieldMaxChars] = useState("");
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([""]);
  const [newFieldDateRestrict, setNewFieldDateRestrict] = useState("any");
  const [newFieldToggleLabels, setNewFieldToggleLabels] = useState(["Pass", "Fail"]);

  // associations
  const [enabledLocations, setEnabledLocations] = useState<Record<string, boolean>>({});
  const [removedAssets, setRemovedAssets] = useState<Set<string>>(new Set());

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

  const handleAddField = () => {
    if (!newFieldName.trim()) return;
    setFields((prev) => [...prev, { name: newFieldName.trim(), type: newFieldType, required: newFieldRequired }]);
    setAddFieldOpen(false);
  };

  const handleSave = (publish: boolean) => {
    toast({
      title: publish ? "Template Published" : "Draft Saved",
      description: `"${name || "Untitled"}" has been ${publish ? "published" : "saved as draft"}.`,
    });
    navigate("/manage");
  };

  return (
    <AppLayout>
      <HeaderNav type="back" title="New Template" />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl space-y-ram-3xl">
        <RAMInput label="Template Name" value={name} onChange={setName} placeholder="e.g., Cleaning Log" />
        <RAMTextarea label="Description" value={description} onChange={setDescription} placeholder="Describe the purpose of this logbook" />

        {/* Fields */}
        <section>
          <h2 className="text-[15px] font-extrabold text-foreground mb-ram-lg">Fields</h2>
          {fields.length === 0 ? (
            <p className="text-center text-text-sm text-gray-500 py-ram-3xl">
              No fields added yet. Add fields to define what operators will fill out.
            </p>
          ) : (
            <div className="space-y-ram-md mb-ram-lg">
              {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-ram-md rounded-ram-md border border-border bg-card p-ram-lg">
                  <span className="text-text-sm text-gray-500 w-6">{i + 1}.</span>
                  <span className="flex-1 text-[15px] font-extrabold text-foreground">
                    {f.name}{f.required && <span className="text-error-600 ml-1">*</span>}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-200 px-ram-lg py-ram-xxs text-text-xs text-gray-600">{f.type}</span>
                  <button onClick={() => setFields(fields.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => { resetFieldForm(); setAddFieldOpen(true); }}
            className="flex w-full items-center justify-center gap-ram-sm rounded-ram-md border border-dashed border-gray-300 py-ram-lg text-text-sm font-medium text-brand-500 hover:bg-brand-100 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            Add Field
          </button>
        </section>

        {/* Associations */}
        <section>
          <h2 className="text-[15px] font-extrabold text-foreground mb-ram-lg">Associations</h2>
          <div className="space-y-ram-md">
            {mockLocations.map((loc) => {
              const assocData = locationAssociations[loc.id];
              const enabled = enabledLocations[loc.id] ?? false;
              const assets = assocData?.assets ?? [];
              return (
                <div key={loc.id} className="rounded-ram-md border border-border bg-card p-ram-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-text-md font-medium text-foreground">{loc.name}</span>
                    <Switch checked={enabled} onCheckedChange={(v) => setEnabledLocations((p) => ({ ...p, [loc.id]: v }))} />
                  </div>
                  {enabled && assets.length > 0 && (
                    <div className="mt-ram-lg flex flex-wrap gap-ram-sm">
                      {assets.filter((a) => !removedAssets.has(a.assetId)).map((a) => (
                        <span key={a.assetId} className="inline-flex items-center gap-1 rounded-full bg-brand-200 px-ram-lg py-ram-xxs text-text-xs text-brand-500">
                          {a.assetName}
                          <button onClick={() => setRemovedAssets((p) => new Set(p).add(a.assetId))}>
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <div className="flex gap-ram-lg pb-ram-3xl">
          <button onClick={() => handleSave(false)} className="flex-1 rounded-ram-md border border-border py-ram-lg text-text-md font-extrabold text-foreground hover:bg-muted transition-colors">
            Save as Draft
          </button>
          <button onClick={() => handleSave(true)} className="flex-1 rounded-ram-md bg-brand-500 py-ram-lg text-text-md font-extrabold text-primary-foreground">
            Publish
          </button>
        </div>
      </div>

      {/* Add Field Drawer */}
      <RAMDrawer
        open={addFieldOpen}
        onClose={() => setAddFieldOpen(false)}
        title="Add Field"
        footer={
          <button onClick={handleAddField} className="w-full rounded-ram-md bg-brand-500 py-ram-lg text-text-md font-extrabold text-primary-foreground">
            Add Field
          </button>
        }
      >
        <div className="space-y-ram-xl">
          <RAMInput label="Field Name" value={newFieldName} onChange={setNewFieldName} placeholder="e.g., Temperature (°C)" />
          <div className="flex flex-col gap-ram-sm">
            <label className="text-text-sm font-medium text-gray-800">Field Type</label>
            <select value={newFieldType} onChange={(e) => setNewFieldType(e.target.value as TemplateField["type"])} className="rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-lg text-text-md text-foreground">
              {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-ram-md text-text-sm font-medium text-gray-800 cursor-pointer">
            <Switch checked={newFieldRequired} onCheckedChange={setNewFieldRequired} />
            Required
          </label>
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
                  <input value={opt} onChange={(e) => { const n = [...newFieldOptions]; n[i] = e.target.value; setNewFieldOptions(n); }} className="flex-1 rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-md text-text-md" placeholder={`Option ${i + 1}`} />
                  {newFieldOptions.length > 1 && <button onClick={() => setNewFieldOptions(newFieldOptions.filter((_, j) => j !== i))}><X className="h-4 w-4 text-gray-500" /></button>}
                </div>
              ))}
              <button onClick={() => setNewFieldOptions([...newFieldOptions, ""])} className="text-text-sm font-medium text-brand-500 hover:underline self-start">+ Add Option</button>
            </div>
          )}
          {newFieldType === "Date" && (
            <div className="flex flex-col gap-ram-sm">
              <label className="text-text-sm font-medium text-gray-800">Restrict to</label>
              <select value={newFieldDateRestrict} onChange={(e) => setNewFieldDateRestrict(e.target.value)} className="rounded-ram-xs border border-gray-300 bg-card px-ram-lg py-ram-lg text-text-md text-foreground">
                <option value="any">Any date</option>
                <option value="past">Past only</option>
                <option value="future">Future only</option>
              </select>
            </div>
          )}
          {newFieldType === "Toggle" && (
            <div className="grid grid-cols-2 gap-ram-lg">
              <RAMInput label="Label 1" value={newFieldToggleLabels[0]} onChange={(v) => setNewFieldToggleLabels([v, newFieldToggleLabels[1]])} />
              <RAMInput label="Label 2" value={newFieldToggleLabels[1]} onChange={(v) => setNewFieldToggleLabels([newFieldToggleLabels[0], v])} />
            </div>
          )}
        </div>
      </RAMDrawer>
    </AppLayout>
  );
}
