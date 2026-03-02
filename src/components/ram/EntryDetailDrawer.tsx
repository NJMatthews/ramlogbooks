import { useState } from "react";
import { X, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatusChip } from "@/components/ram/StatusChip";
import type { ReviewEntry } from "@/data/mockAssets";
import { cn } from "@/lib/utils";

interface EntryDetailDrawerProps {
  entry: ReviewEntry | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export function EntryDetailDrawer({ entry, onClose, onApprove, onReject }: EntryDetailDrawerProps) {
  const isMobile = useIsMobile();
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [correctionText, setCorrectionText] = useState("");

  if (!entry) return null;

  const content = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-ram-xl py-ram-lg shrink-0">
        {isMobile ? (
          <button onClick={onClose} className="p-ram-md">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
        ) : null}
        <div className="flex-1 min-w-0">
          <h2 className="text-text-lg font-extrabold text-foreground truncate">{entry.logbook}</h2>
          <p className="text-text-xs text-gray-500">{entry.date}</p>
        </div>
        {!isMobile && (
          <button onClick={onClose} className="p-ram-md">
            <X className="h-5 w-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl space-y-ram-3xl">
        {/* Meta */}
        <div className="space-y-ram-md">
          <MetaRow label="Operator" value={entry.operator} />
          <MetaRow label="Location" value={entry.location} />
          <MetaRow label="Asset" value={entry.asset ?? "—"} />
          <MetaRow label="Submitted" value={entry.date} />
          <div className="flex items-center gap-ram-md">
            <span className="text-text-sm font-extrabold text-gray-600 w-24">E-Signature</span>
            <StatusChip status="approved" />
          </div>
          <MetaRow label="Version" value={entry.version} />
        </div>

        {/* Fields */}
        {entry.fields.length > 0 && (
          <section>
            <h3 className="text-text-sm font-extrabold text-gray-600 mb-ram-lg">Field Values</h3>
            <div className="space-y-ram-lg">
              {entry.fields.map((f, i) => (
                <div key={i}>
                  <span className="text-text-xs font-extrabold text-gray-600">{f.label}</span>
                  <p className="text-[15px] text-foreground">{f.value}</p>
                  {f.preFilled && (
                    <p className="text-text-xs text-gray-500">Pre-filled, confirmed by operator</p>
                  )}
                  {f.modified && (
                    <p className="text-text-xs text-warning-400">
                      Modified from pre-fill: was {f.modified.from}, changed to {f.modified.to}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Audit trail */}
        <section>
          <h3 className="text-text-sm font-extrabold text-gray-600 mb-ram-lg">Audit Trail</h3>
          <div className="space-y-ram-md">
            {entry.auditTrail.map((a, i) => (
              <div key={i} className="flex items-start gap-ram-md">
                <div className="mt-1.5 h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                <div>
                  <span className="text-text-sm text-gray-600">{a.action}</span>
                  <span className="ml-ram-md text-text-xs text-gray-500">{a.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-ram-xl py-ram-lg flex gap-ram-md">
        <button
          onClick={() => onApprove(entry.id)}
          className="flex-1 flex items-center justify-center gap-ram-sm rounded-ram-md py-ram-lg text-text-sm font-extrabold text-primary-foreground"
          style={{ backgroundColor: "hsl(157, 42%, 53%)" }}
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(entry.id)}
          className="flex-1 flex items-center justify-center gap-ram-sm rounded-ram-md bg-error-600 py-ram-lg text-text-sm font-extrabold text-primary-foreground"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>
        <button
          onClick={() => setCorrectionOpen(true)}
          className="flex-1 rounded-ram-md border border-border py-ram-lg text-text-sm font-extrabold text-foreground hover:bg-muted transition-colors"
        >
          Request Correction
        </button>
      </div>

      {/* Correction Modal */}
      {correctionOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60">
          <div className="mx-ram-xl max-w-md w-full rounded-ram-xl bg-card p-ram-3xl shadow-ram-lg">
            <h3 className="text-text-lg font-extrabold text-foreground">Request Correction</h3>
            <textarea
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="Describe what needs to be corrected"
              className="mt-ram-lg w-full h-32 rounded-ram-xs border border-gray-300 bg-background px-ram-lg py-ram-lg text-text-md text-foreground placeholder:text-gray-500 resize-none outline-none focus:border-brand-500"
            />
            <div className="mt-ram-xl flex gap-ram-md">
              <button onClick={() => setCorrectionOpen(false)} className="flex-1 rounded-ram-md border border-border py-ram-lg text-text-sm font-medium text-foreground">
                Cancel
              </button>
              <button
                onClick={() => { setCorrectionOpen(false); setCorrectionText(""); }}
                className="flex-1 rounded-ram-md bg-brand-500 py-ram-lg text-text-sm font-extrabold text-primary-foreground"
              >
                Send to Operator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 bg-card">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed top-0 right-0 z-50 h-full w-[420px] border-l border-border bg-card shadow-ram-lg">
      {content}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-ram-md">
      <span className="text-text-sm font-extrabold text-gray-600 w-24 shrink-0">{label}</span>
      <span className="text-[15px] text-foreground">{value}</span>
    </div>
  );
}
