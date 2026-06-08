import type { FormField, FormFieldType } from "@/data/mockLogbooks";

export type Verdict = "pass" | "fail" | "pending";

export interface FieldEvaluation {
  verdict: Verdict;
  /** Human-readable trace mimicking the Evaluation Service explainability */
  trace: string;
  /** Short comparison summary, e.g. "26 > max 24" */
  summary?: string;
}

const PENDING_NO_CRITERION: FieldEvaluation = {
  verdict: "pending",
  trace: "No criterion attached",
};

type Evaluator = (field: FormField) => FieldEvaluation;

/**
 * Strategy map: register a new field type here without touching evaluateField.
 */
const evaluators: Partial<Record<FormFieldType, Evaluator>> = {
  toggle: (field) => {
    if (!field.value) return { verdict: "pending", trace: "Awaiting selection" };
    const expected = field.passWhen ?? "pass";
    const pass = field.value === expected;
    return {
      verdict: pass ? "pass" : "fail",
      trace: `Toggle = "${field.value}" · expected "${expected}"`,
      summary: pass ? "Within criterion" : "Failed check",
    };
  },

  number: (field) => {
    if (!field.limits) return PENDING_NO_CRITERION;
    if (field.value.trim() === "") return { verdict: "pending", trace: "Awaiting value" };
    const v = Number(field.value);
    if (Number.isNaN(v)) return { verdict: "pending", trace: "Value is not numeric" };
    const { min, max } = field.limits;
    if (min !== undefined && v < min) {
      return {
        verdict: "fail",
        summary: `${v} < min ${min}`,
        trace: `value (${v}) < min (${min})${field.unit ? ` ${field.unit}` : ""}`,
      };
    }
    if (max !== undefined && v > max) {
      return {
        verdict: "fail",
        summary: `${v} > max ${max}`,
        trace: `value (${v}) > max (${max})${field.unit ? ` ${field.unit}` : ""}`,
      };
    }
    const parts: string[] = [];
    if (min !== undefined) parts.push(`value (${v}) ≥ min (${min})`);
    if (max !== undefined) parts.push(`value (${v}) ≤ max (${max})`);
    return {
      verdict: "pass",
      summary: "Within limits",
      trace: parts.join(" AND "),
    };
  },
};

/**
 * Local, offline evaluation of a single field against its limits / criteria.
 * Dispatches to a per-type evaluator from the strategy map.
 */
export function evaluateField(field: FormField): FieldEvaluation {
  const evaluator = evaluators[field.type];
  if (!evaluator) return PENDING_NO_CRITERION;
  return evaluator(field);
}

export function evaluateAll(fields: FormField[]): Record<string, FieldEvaluation> {
  const out: Record<string, FieldEvaluation> = {};
  for (const f of fields) out[f.id] = evaluateField(f);
  return out;
}

export function failedFields(fields: FormField[]): FormField[] {
  return fields.filter((f) => evaluateField(f).verdict === "fail");
}
