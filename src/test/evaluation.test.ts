import { describe, it, expect } from "vitest";
import { evaluateField } from "@/lib/evaluation";
import type { FormField } from "@/data/mockLogbooks";

function numField(partial: Partial<FormField>): FormField {
  return {
    id: "f",
    label: "x",
    type: "number",
    value: "",
    prefilled: false,
    timeSensitive: false,
    ...partial,
  };
}

function toggleField(partial: Partial<FormField>): FormField {
  return {
    id: "t",
    label: "t",
    type: "toggle",
    value: "",
    prefilled: false,
    timeSensitive: false,
    ...partial,
  };
}

describe("evaluateField - numeric", () => {
  it("value within min and max → pass", () => {
    const r = evaluateField(numField({ value: "5", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("pass");
  });

  it("value exactly at min → pass", () => {
    const r = evaluateField(numField({ value: "0", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("pass");
  });

  it("value exactly at max → pass", () => {
    const r = evaluateField(numField({ value: "10", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("pass");
  });

  it("value below min → fail, summary includes '< min'", () => {
    const r = evaluateField(numField({ value: "-1", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("fail");
    expect(r.summary).toContain("< min");
  });

  it("value above max → fail, summary includes '> max'", () => {
    const r = evaluateField(numField({ value: "11", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("fail");
    expect(r.summary).toContain("> max");
  });

  it("no limits → pending", () => {
    const r = evaluateField(numField({ value: "5" }));
    expect(r.verdict).toBe("pending");
  });

  it("empty string value → pending", () => {
    const r = evaluateField(numField({ value: "", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("pending");
  });

  it("non-numeric string value → pending", () => {
    const r = evaluateField(numField({ value: "abc", limits: { min: 0, max: 10 } }));
    expect(r.verdict).toBe("pending");
  });
});

describe("evaluateField - toggle", () => {
  it("value matches passWhen → pass", () => {
    const r = evaluateField(toggleField({ value: "pass", passWhen: "pass" }));
    expect(r.verdict).toBe("pass");
  });

  it("value does not match passWhen → fail", () => {
    const r = evaluateField(toggleField({ value: "fail", passWhen: "pass" }));
    expect(r.verdict).toBe("fail");
  });

  it("empty value → pending", () => {
    const r = evaluateField(toggleField({ value: "" }));
    expect(r.verdict).toBe("pending");
  });
});

describe("evaluateField - no evaluator for type", () => {
  it("returns pending with 'No criterion attached'", () => {
    const r = evaluateField({
      id: "x",
      label: "x",
      type: "text",
      value: "anything",
      prefilled: false,
      timeSensitive: false,
    });
    expect(r.verdict).toBe("pending");
    expect(r.trace).toBe("No criterion attached");
  });
});
