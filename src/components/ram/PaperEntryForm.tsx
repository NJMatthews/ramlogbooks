import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FormField } from "@/data/mockLogbooks";
import { BookOpen } from "lucide-react";

interface PaperEntryFormProps {
  fields: FormField[];
  logbookName: string;
  onUpdateField: (fieldId: string, value: string) => void;
}

function PaperCell({
  label,
  value,
  onChange,
  type = "text",
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  className?: string;
}) {
  return (
    <td className={cn("border border-gray-400 p-0", className)}>
      <div className="px-2 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent px-2 pb-1.5 pt-0.5 text-sm text-foreground outline-none placeholder:text-gray-400"
        placeholder="—"
      />
    </td>
  );
}

function PaperCheckbox({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const isYes = value === "pass" || value === "yes";
  const isNo = value === "fail" || value === "no";

  return (
    <td className={cn("border border-gray-400 p-2", className)}>
      <div className="mb-1">
        <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">{label}</span>
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <div
            onClick={() => onChange("yes")}
            className={cn(
              "h-5 w-5 border-2 border-gray-500 rounded-sm flex items-center justify-center transition-colors",
              isYes && "bg-foreground border-foreground"
            )}
          >
            {isYes && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <span className="text-sm text-foreground">Yes</span>
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <div
            onClick={() => onChange("no")}
            className={cn(
              "h-5 w-5 border-2 border-gray-500 rounded-sm flex items-center justify-center transition-colors",
              isNo && "bg-foreground border-foreground"
            )}
          >
            {isNo && <span className="text-white text-xs font-bold">✓</span>}
          </div>
          <span className="text-sm text-foreground">No</span>
        </label>
      </div>
    </td>
  );
}

export function PaperEntryForm({ fields, logbookName, onUpdateField }: PaperEntryFormProps) {
  const getField = (id: string) => fields.find((f) => f.id === id);

  return (
    <div className="mx-auto max-w-[900px] space-y-4">
      {/* Paper document container */}
      <div className="bg-white rounded-sm shadow-[0_2px_8px_rgba(0,0,0,0.12)] overflow-hidden border border-gray-300">
        {/* Document header */}
        <div className="bg-gray-100 border-b-2 border-gray-400 px-6 py-4">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-gray-600" />
            <h2 className="text-base font-extrabold text-foreground uppercase tracking-wide text-center">
              {logbookName}
            </h2>
          </div>
          <p className="text-[11px] text-gray-500 text-center tracking-wide">DAILY USE LOGBOOK — PAPER FORM</p>
        </div>

        {/* Equipment ID row */}
        <div className="border-b border-gray-400">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <PaperCell
                  label="Equipment ID Number"
                  value={getField("equipmentId")?.value ?? ""}
                  onChange={(v) => onUpdateField("equipmentId", v)}
                />
                <PaperCell
                  label="Date"
                  value={getField("date")?.value ?? ""}
                  onChange={(v) => onUpdateField("date", v)}
                  type="text"
                />
              </tr>
            </tbody>
          </table>
        </div>

        {/* pH Buffer Section */}
        <div className="border-b border-gray-400">
          <div className="bg-gray-100 px-4 py-1.5 border-b border-gray-400">
            <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">pH Buffer Solution Test</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">pH Buffer Solution*</th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">Buffer Solution Lot #</th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">Buffer Solution Exp. Date</th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">Slope (%)</th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left w-[160px]">
                  Slope Within Range?
                  <br />
                  <span className="font-normal text-gray-500">(92.0% – 102.0%)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-0">
                  <input
                    value={getField("phBufferSolution")?.value ?? ""}
                    onChange={(e) => onUpdateField("phBufferSolution", e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                    placeholder="—"
                  />
                </td>
                <td className="border border-gray-400 p-0">
                  <input
                    value={getField("bufferSolutionLot")?.value ?? ""}
                    onChange={(e) => onUpdateField("bufferSolutionLot", e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                    placeholder="—"
                  />
                </td>
                <td className="border border-gray-400 p-0">
                  <input
                    value={getField("bufferExpDate")?.value ?? ""}
                    onChange={(e) => onUpdateField("bufferExpDate", e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                    placeholder="—"
                  />
                </td>
                <td className="border border-gray-400 p-0">
                  <input
                    type="number"
                    value={getField("slopePct")?.value ?? ""}
                    onChange={(e) => onUpdateField("slopePct", e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                    placeholder="—"
                  />
                </td>
                <PaperCheckbox
                  label=""
                  value={getField("slopeInRange")?.value ?? ""}
                  onChange={(v) => onUpdateField("slopeInRange", v)}
                />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Conductivity Section */}
        <div className="border-b border-gray-400">
          <div className="bg-gray-100 px-4 py-1.5 border-b border-gray-400">
            <span className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Conductivity Standard Test</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">
                  Conductivity Std.
                  <br />
                  <span className="font-normal text-gray-500">(Select U/M)</span>
                </th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">Conductivity Std. Lot #</th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">Conductivity Std. Exp. Date</th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left">
                  Std. Verification
                  <br />
                  <span className="font-normal text-gray-500">(Select U/M)</span>
                </th>
                <th className="border border-gray-400 px-2 py-2 text-[11px] font-bold text-gray-700 text-left w-[160px]">
                  Std. Verification
                  <br />
                  Within Range?
                  <br />
                  <span className="font-normal text-gray-500">(± 5% of std. value)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 p-0">
                  <div className="px-2 py-1.5 space-y-1">
                    {["µS/cm", "mS/cm"].map((unit) => (
                      <label key={unit} className="flex items-center gap-1.5 cursor-pointer">
                        <div
                          onClick={() => onUpdateField("conductivityStdUnit", unit)}
                          className={cn(
                            "h-4 w-4 border-2 border-gray-500 rounded-sm flex items-center justify-center transition-colors",
                            getField("conductivityStdUnit")?.value === unit && "bg-foreground border-foreground"
                          )}
                        >
                          {getField("conductivityStdUnit")?.value === unit && (
                            <span className="text-white text-[10px] font-bold">✓</span>
                          )}
                        </div>
                        <span className="text-xs text-foreground">{unit}</span>
                      </label>
                    ))}
                  </div>
                </td>
                <td className="border border-gray-400 p-0">
                  <input
                    value={getField("conductivityStdLot")?.value ?? ""}
                    onChange={(e) => onUpdateField("conductivityStdLot", e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                    placeholder="—"
                  />
                </td>
                <td className="border border-gray-400 p-0">
                  <input
                    value={getField("conductivityExpDate")?.value ?? ""}
                    onChange={(e) => onUpdateField("conductivityExpDate", e.target.value)}
                    className="w-full bg-transparent px-2 py-3 text-sm outline-none placeholder:text-gray-400"
                    placeholder="—"
                  />
                </td>
                <td className="border border-gray-400 p-0">
                  <div className="px-2 py-1.5 space-y-1">
                    {["µS/cm", "mS/cm"].map((unit) => (
                      <label key={unit} className="flex items-center gap-1.5 cursor-pointer">
                        <div
                          onClick={() => onUpdateField("stdVerificationUnit", unit)}
                          className={cn(
                            "h-4 w-4 border-2 border-gray-500 rounded-sm flex items-center justify-center transition-colors",
                            getField("stdVerificationUnit")?.value === unit && "bg-foreground border-foreground"
                          )}
                        >
                          {getField("stdVerificationUnit")?.value === unit && (
                            <span className="text-white text-[10px] font-bold">✓</span>
                          )}
                        </div>
                        <span className="text-xs text-foreground">{unit}</span>
                      </label>
                    ))}
                  </div>
                </td>
                <PaperCheckbox
                  label=""
                  value={getField("stdVerInRange")?.value ?? ""}
                  onChange={(v) => onUpdateField("stdVerInRange", v)}
                />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sign-off row */}
        <div className="border-b border-gray-400">
          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <PaperCell
                  label="Performed by — Initials/Date"
                  value={getField("performedBy")?.value ?? ""}
                  onChange={(v) => onUpdateField("performedBy", v)}
                />
                <PaperCell
                  label="Verified by — Initials/Date"
                  value={getField("verifiedBy")?.value ?? ""}
                  onChange={(v) => onUpdateField("verifiedBy", v)}
                />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comments */}
        <div className="px-4 py-3">
          <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Comments</span>
          <textarea
            value={getField("comments")?.value ?? ""}
            onChange={(e) => onUpdateField("comments", e.target.value)}
            className="mt-1 w-full border-b-2 border-dotted border-gray-400 bg-transparent py-1 text-sm text-foreground outline-none resize-none placeholder:text-gray-400"
            rows={2}
            placeholder="—"
          />
        </div>

        {/* Footnotes */}
        <div className="bg-gray-50 border-t border-gray-300 px-4 py-2">
          <p className="text-[9px] text-gray-500 leading-relaxed">
            * Record all digits of the standard value listed on the pH buffer bottle.
            ♣ Record all digits of the value listed on the conductivity standard bottle.
            ♠ Record all digits of the value displayed on the conductivity meter.
          </p>
        </div>
      </div>
    </div>
  );
}
