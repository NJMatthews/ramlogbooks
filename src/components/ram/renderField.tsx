import { Calendar } from "lucide-react";
import { RAMInput } from "@/components/ram/RAMInput";
import { RAMTextarea } from "@/components/ram/RAMTextarea";
import { RAMToggle } from "@/components/ram/RAMToggle";
import { FieldVerdict } from "@/components/ram/FieldVerdict";
import {
  DropdownField,
  StatusField,
  LinkedWOField,
  AttachmentField,
  PartsUsedField,
  TripletField,
} from "@/components/ram/EntryFieldRenderer";
import { evaluateField } from "@/lib/evaluation";
import type { FormField } from "@/data/mockLogbooks";

interface RenderFieldOptions {
  confirmed?: boolean;
  onConfirm?: () => void;
}

/**
 * Single, centralized renderer for a logbook FormField.
 * Every screen that displays an entry form should use this — there is exactly
 * one switch on field.type in the app.
 */
export function renderField(
  field: FormField,
  onChange: (value: string) => void,
  options: RenderFieldOptions = {}
) {
  const ev = evaluateField(field);

  switch (field.type) {
    case "textarea":
      return (
        <RAMTextarea
          label={field.label}
          value={field.value}
          onChange={onChange}
          placeholder="Enter observations..."
          expanded
        />
      );
    case "toggle":
      return (
        <div className="space-y-ram-sm">
          <RAMToggle
            label={field.label}
            value={field.value === "pass"}
            onChange={(v) => onChange(v ? "pass" : "fail")}
          />
          <FieldVerdict field={field} evaluation={ev} />
        </div>
      );
    case "dropdown":
      return <DropdownField field={field} onChange={onChange} />;
    case "status":
      return <StatusField field={field} onChange={onChange} />;
    case "linked-wo":
      return <LinkedWOField field={field} onChange={onChange} />;
    case "attachment":
      return <AttachmentField field={field} onChange={onChange} />;
    case "parts-used":
      return <PartsUsedField field={field} onChange={onChange} />;
    case "triplet":
      return <TripletField field={field} onChange={onChange} />;
    default:
      return (
        <div className="space-y-ram-sm">
          <RAMInput
            label={field.label}
            value={field.value}
            onChange={onChange}
            readOnly={field.readOnly}
            type={field.type === "number" ? "number" : "text"}
            leadingIcon={field.type === "datetime" ? <Calendar className="h-4 w-4" /> : undefined}
            needsConfirmation={field.timeSensitive && field.prefilled}
            confirmed={options.confirmed}
            onConfirm={options.onConfirm}
          />
          <FieldVerdict field={field} evaluation={ev} />
        </div>
      );
  }
}
