import type { FormField } from "@/data/mockLogbooks";

export type Verdict = "pass" | "fail" | "pending";

export interface FieldEvaluation {
  verdict: Verdict;
  /** Human-readable trace mimicking the Evaluation Service explainability */
  trace: string;
  /** Short comparison summary, e.g. "26 > max 24" */
  summary?: string;
}

/**
 * Local, offline evaluation of a single field against its limits / criteria.
 * Mirrors the Evaluation Service posture: deterministic, no network.
 */
export function evaluateField(field: FormField): FieldEvaluation {
  if (field.type === "toggle") {
    if (!field.value) return { verdict: "pending", trace: "Awaiting selection" };
    const expected = field.passWhen ?? "pass";
    const pass = field.value === expected;
    return {
      verdict: pass ? "pass" : "fail",
      trace: `Toggle = "${field.value}" · expected "${expected}"`,
      summary: pass ? "Within criterion" : "Failed check",
    };
  }

  if (field.type === "number" && field.limits) {
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
  }

  return { verdict: "pending", trace: "No criterion attached" };
}

export function evaluateAll(fields: FormField[]): Record<string, FieldEvaluation> {
  const out: Record<string, FieldEvaluation> = {};
  for (const f of fields) out[f.id] = evaluateField(f);
  return out;
}

export function failedFields(fields: FormField[]): FormField[] {
  return fields.filter((f) => evaluateField(f).verdict === "fail");
}
