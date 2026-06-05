import { useState } from "react";
import { Camera, Paperclip, Wrench, Hash, Check, ChevronDown, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { RAMInput } from "@/components/ram/RAMInput";
import { FieldVerdict } from "@/components/ram/FieldVerdict";
import { evaluateField } from "@/lib/evaluation";
import type { FormField } from "@/data/mockLogbooks";

interface ExtraFieldProps {
  field: FormField;
  onChange: (value: string) => void;
}

/** Dropdown / Symptom controlled list */
export function DropdownField({ field, onChange }: ExtraFieldProps) {
  return (
    <div className="space-y-ram-sm">
      <label className="block text-text-sm font-extrabold text-foreground">
        {field.label}
        {field.help && <span className="ml-2 text-text-xs font-medium text-gray-500">{field.help}</span>}
      </label>
      <div className="relative">
        <select
          value={field.value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 appearance-none rounded-ram-md border border-gray-300 bg-card pl-3 pr-10 text-text-md font-medium text-foreground focus:border-brand-500 focus:outline-none"
        >
          <option value="">Select…</option>
          {(field.options ?? []).map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
      </div>
    </div>
  );
}

/** Asset service-status selector with three states */
export function StatusField({ field, onChange }: ExtraFieldProps) {
  const opts = field.options ?? ["in-service", "out-of-service", "under-maintenance"];
  const labels: Record<string, string> = {
    "in-service": "In Service",
    "out-of-service": "Out of Service",
    "under-maintenance": "Under Maintenance",
  };
  const tone: Record<string, string> = {
    "in-service": "bg-success-100 text-success-900 border-success-100",
    "out-of-service": "bg-error-600/10 text-error-600 border-error-600/30",
    "under-maintenance": "bg-warning-400/30 text-foreground border-warning-400",
  };
  return (
    <div className="space-y-ram-sm">
      <label className="block text-text-sm font-extrabold text-foreground">
        {field.label}
        {field.help && <span className="ml-2 text-text-xs font-medium text-gray-500">{field.help}</span>}
      </label>
      <div className="flex flex-wrap gap-ram-sm">
        {opts.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={cn(
              "h-9 rounded-full border px-3 text-text-xs font-extrabold transition-colors",
              field.value === o ? tone[o] : "border-gray-300 bg-card text-gray-600 hover:border-brand-500"
            )}
          >
            {labels[o] ?? o}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Linked Work Order — free text that resolves to a chip */
export function LinkedWOField({ field, onChange }: ExtraFieldProps) {
  const value = field.value.trim();
  const resolved = /^WR-\d{3,}$/i.test(value);
  return (
    <div className="space-y-ram-sm">
      <label className="block text-text-sm font-extrabold text-foreground">
        {field.label}
        {field.help && <span className="ml-2 text-text-xs font-medium text-gray-500">{field.help}</span>}
      </label>
      <div className="flex items-center gap-ram-sm">
        <div className="relative flex-1">
          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={field.value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="WR-12345"
            className="w-full h-11 rounded-ram-md border border-gray-300 bg-card pl-9 pr-3 text-text-md font-medium text-foreground focus:border-brand-500 focus:outline-none"
          />
        </div>
        {resolved && (
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-text-xs font-extrabold text-brand-600">
            <Wrench className="h-3 w-3" /> {value.toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
}

/** Attachment — simulated photo capture */
export function AttachmentField({ field, onChange }: ExtraFieldProps) {
  const attached = field.value.trim() !== "";
  return (
    <div className="space-y-ram-sm">
      <label className="block text-text-sm font-extrabold text-foreground">
        {field.label}
        {field.help && <span className="ml-2 text-text-xs font-medium text-gray-500">{field.help}</span>}
      </label>
      {attached ? (
        <div className="flex items-center gap-ram-md rounded-ram-md border border-success-100 bg-success-100/50 p-ram-md">
          <div className="flex h-10 w-10 items-center justify-center rounded-ram-xs bg-success-400/20">
            <Check className="h-5 w-5 text-success-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-text-sm font-extrabold text-foreground truncate">{field.value}</p>
            <p className="text-text-xs text-gray-500">Captured · attached to entry</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-gray-500 hover:text-error-600"
            title="Remove"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex gap-ram-sm">
          <button
            type="button"
            onClick={() => onChange(`IMG_${Date.now().toString().slice(-6)}.jpg`)}
            className="flex flex-1 items-center justify-center gap-ram-sm h-11 rounded-ram-md border border-dashed border-brand-500 bg-brand-100/40 text-text-sm font-extrabold text-brand-600 hover:bg-brand-100"
          >
            <Camera className="h-4 w-4" /> Capture photo
          </button>
          <button
            type="button"
            onClick={() => onChange(`upload_${Date.now().toString().slice(-6)}.pdf`)}
            className="flex items-center justify-center gap-ram-sm h-11 rounded-ram-md border border-gray-300 bg-card px-4 text-text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600"
          >
            <Paperclip className="h-4 w-4" /> Attach file
          </button>
        </div>
      )}
    </div>
  );
}

interface PartLine {
  id: string;
  partNo: string;
  qty: string;
  lot: string;
}

const MOCK_PARTS = ["GAS-204 Door Gasket", "SEN-188 Photoelectric Sensor", "BLT-301 Bearing 30mm", "FLT-007 HEPA Filter", "VLV-512 3-Way Valve"];

/** Parts Used — chip-style picker */
export function PartsUsedField({ field, onChange }: ExtraFieldProps) {
  const initial: PartLine[] = field.value
    ? JSON.parse(field.value || "[]")
    : [];
  const [lines, setLines] = useState<PartLine[]>(initial);

  const update = (next: PartLine[]) => {
    setLines(next);
    onChange(JSON.stringify(next));
  };

  return (
    <div className="space-y-ram-sm">
      <label className="block text-text-sm font-extrabold text-foreground">{field.label}</label>
      {lines.map((line, idx) => (
        <div key={line.id} className="grid grid-cols-[1fr,80px,1fr,32px] gap-ram-sm items-center">
          <select
            value={line.partNo}
            onChange={(e) => {
              const n = [...lines];
              n[idx] = { ...line, partNo: e.target.value };
              update(n);
            }}
            className="h-10 rounded-ram-md border border-gray-300 bg-card px-2 text-text-sm font-medium text-foreground focus:border-brand-500 focus:outline-none"
          >
            <option value="">Select part…</option>
            {MOCK_PARTS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
          <input
            type="number"
            placeholder="Qty"
            value={line.qty}
            onChange={(e) => {
              const n = [...lines];
              n[idx] = { ...line, qty: e.target.value };
              update(n);
            }}
            className="h-10 rounded-ram-md border border-gray-300 bg-card px-2 text-text-sm font-medium text-foreground focus:border-brand-500 focus:outline-none"
          />
          <input
            placeholder="Lot #"
            value={line.lot}
            onChange={(e) => {
              const n = [...lines];
              n[idx] = { ...line, lot: e.target.value };
              update(n);
            }}
            className="h-10 rounded-ram-md border border-gray-300 bg-card px-2 text-text-sm font-medium text-foreground focus:border-brand-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => update(lines.filter((_, i) => i !== idx))}
            className="flex h-10 w-10 items-center justify-center rounded-ram-md text-gray-500 hover:text-error-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => update([...lines, { id: `p-${Date.now()}`, partNo: "", qty: "", lot: "" }])}
        className="flex items-center gap-1.5 text-text-xs font-extrabold text-brand-600 hover:text-brand-500"
      >
        <Plus className="h-3.5 w-3.5" /> Add part
      </button>
    </div>
  );
}

interface TripletValue {
  asFound: string;
  adjustment: string;
  asLeft: string;
}

/** As-Found / Adjustment / As-Left triplet with tolerance evaluation */
export function TripletField({ field, onChange }: ExtraFieldProps) {
  const initial: TripletValue = field.value
    ? JSON.parse(field.value || '{"asFound":"","adjustment":"","asLeft":""}')
    : { asFound: "", adjustment: "", asLeft: "" };
  const [val, setVal] = useState<TripletValue>(initial);

  const triplet = field.triplet ?? { expected: "0", tolerance: 0 };
  const expected = Number(triplet.expected);
  const tol = Number(triplet.tolerance);

  const update = (next: TripletValue) => {
    setVal(next);
    onChange(JSON.stringify(next));
  };

  const evalNum = (raw: string): null | { pass: boolean; delta: number } => {
    if (raw.trim() === "") return null;
    const n = Number(raw);
    if (Number.isNaN(n)) return null;
    const delta = n - expected;
    return { pass: Math.abs(delta) <= tol, delta };
  };

  const verdict = evalNum(val.asLeft);

  return (
    <div className="space-y-ram-sm">
      <label className="block text-text-sm font-extrabold text-foreground">
        {field.label}
        <span className="ml-2 text-text-xs font-medium text-gray-500">
          Expected {triplet.expected}{triplet.unit ? ` ${triplet.unit}` : ""} · ±{triplet.tolerance}
        </span>
      </label>
      <div className="grid grid-cols-3 gap-ram-sm">
        {(["asFound", "adjustment", "asLeft"] as (keyof TripletValue)[]).map((k) => (
          <div key={k}>
            <p className="mb-1 text-text-xs font-extrabold uppercase tracking-wider text-gray-500">
              {k === "asFound" ? "As Found" : k === "adjustment" ? "Adjustment" : "As Left"}
            </p>
            <input
              type="number"
              value={val[k]}
              onChange={(e) => update({ ...val, [k]: e.target.value })}
              className="h-11 w-full rounded-ram-md border border-gray-300 bg-card px-3 text-text-md font-medium text-foreground focus:border-brand-500 focus:outline-none"
            />
          </div>
        ))}
      </div>
      {verdict && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-text-xs font-extrabold",
            verdict.pass ? "bg-success-100 text-success-900" : "bg-error-600/10 text-error-600"
          )}
        >
          {verdict.pass ? "Within tolerance" : "Out of tolerance"} · Δ {verdict.delta > 0 ? "+" : ""}{verdict.delta.toFixed(2)}
          {triplet.unit ? ` ${triplet.unit}` : ""}
        </div>
      )}
    </div>
  );
}

/** Numeric input wrapper that also surfaces verdict + trace */
export function NumberWithLimitsField({ field, onChange }: ExtraFieldProps) {
  const ev = evaluateField(field);
  return (
    <div className="space-y-ram-sm">
      <RAMInput
        label={field.label}
        value={field.value}
        onChange={onChange}
        readOnly={field.readOnly}
        type="number"
      />
      <FieldVerdict field={field} evaluation={ev} />
    </div>
  );
}
