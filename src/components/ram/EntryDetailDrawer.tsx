import { useState } from "react";
import { X, ArrowLeft, CheckCircle, XCircle, AlertTriangle, Wrench, Clock, GitBranch, CornerUpLeft, ShieldAlert, FileText, History, Edit3, PenTool, ShieldCheck, Send, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { StatusChip } from "@/components/ram/StatusChip";
import type { ReviewEntry, AuditTrailEntry } from "@/data/mockAssets";
import { cn } from "@/lib/utils";

interface EntryDetailDrawerProps {
  entry: ReviewEntry | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReturn: (id: string) => void;
  onEscalate: (id: string) => void;
}

type Tab = "detail" | "audit";

export function EntryDetailDrawer({ entry, onClose, onApprove, onReject, onReturn, onEscalate }: EntryDetailDrawerProps) {
  const isMobile = useIsMobile();
  const [tab, setTab] = useState<Tab>("detail");

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

      {/* Tabs */}
      <div className="flex border-b border-border shrink-0">
        <TabButton active={tab === "detail"} onClick={() => setTab("detail")} icon={<FileText className="h-4 w-4" />} label="Detail" />
        <TabButton active={tab === "audit"} onClick={() => setTab("audit")} icon={<History className="h-4 w-4" />} label={`Audit Trail (${entry.auditTrail.length})`} />
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl space-y-ram-3xl">
        {tab === "detail" ? (
          <DetailBody entry={entry} />
        ) : (
          <AuditTrailBody trail={entry.auditTrail} />
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border px-ram-xl py-ram-lg grid grid-cols-2 md:grid-cols-4 gap-ram-sm">
        <button
          onClick={() => onApprove(entry.id)}
          className="flex items-center justify-center gap-ram-sm rounded-ram-md py-ram-md text-text-sm font-extrabold text-primary-foreground"
          style={{ backgroundColor: "hsl(157, 42%, 53%)" }}
        >
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
        <button
          onClick={() => onReject(entry.id)}
          className="flex items-center justify-center gap-ram-sm rounded-ram-md bg-error-600 py-ram-md text-text-sm font-extrabold text-primary-foreground"
        >
          <XCircle className="h-4 w-4" />
          Reject
        </button>
        <button
          onClick={() => onReturn(entry.id)}
          className="flex items-center justify-center gap-ram-sm rounded-ram-md bg-warning-400 py-ram-md text-text-sm font-extrabold text-primary-foreground"
        >
          <CornerUpLeft className="h-4 w-4" />
          Return
        </button>
        <button
          onClick={() => onEscalate(entry.id)}
          className="flex items-center justify-center gap-ram-sm rounded-ram-md border border-error-600 py-ram-md text-text-sm font-extrabold text-error-600 hover:bg-error-600/10"
        >
          <ShieldAlert className="h-4 w-4" />
          Escalate
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return <div className="fixed inset-0 z-50 bg-card">{content}</div>;
  }

  return (
    <div className="fixed top-0 right-0 z-50 h-full w-[480px] border-l border-border bg-card shadow-ram-lg">
      {content}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-ram-sm py-ram-md text-text-sm font-extrabold border-b-2 transition-colors",
        active ? "border-brand-500 text-brand-500" : "border-transparent text-gray-500 hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function DetailBody({ entry }: { entry: ReviewEntry }) {
  return (
    <>
      {(entry.hasException || entry.slaBreached || entry.linkedWorkRequest || entry.returnReason || entry.deviationRef) && (
        <div className="space-y-ram-sm">
          {entry.hasException && (
            <div className="flex items-center gap-ram-sm rounded-ram-xs border border-error-600/30 bg-error-600/10 px-ram-md py-ram-sm text-text-xs font-extrabold text-error-600">
              <AlertTriangle className="h-3.5 w-3.5" />
              Out-of-limit values present · operator filed impact assessment
            </div>
          )}
          {entry.slaBreached && (
            <div className="flex items-center gap-ram-sm rounded-ram-xs border border-warning-400/40 bg-warning-400/10 px-ram-md py-ram-sm text-text-xs font-extrabold text-warning-400">
              <Clock className="h-3.5 w-3.5" />
              Review SLA breached · {entry.hoursOpen}h open
            </div>
          )}
          {entry.linkedWorkRequest && (
            <div className="flex items-center gap-ram-sm rounded-ram-xs border border-brand-500/30 bg-brand-100 px-ram-md py-ram-sm text-text-xs font-extrabold text-brand-700">
              <Wrench className="h-3.5 w-3.5" />
              Linked work request: {entry.linkedWorkRequest}
            </div>
          )}
          {entry.returnReason && (
            <div className="rounded-ram-xs border border-warning-400/40 bg-warning-400/10 px-ram-md py-ram-sm text-text-xs text-foreground">
              <p className="font-extrabold text-warning-400 flex items-center gap-1.5"><CornerUpLeft className="h-3.5 w-3.5" /> Returned for correction</p>
              <p className="mt-1 text-gray-700">{entry.returnReason}</p>
            </div>
          )}
          {entry.deviationRef && (
            <div className="flex items-center gap-ram-sm rounded-ram-xs border border-error-600/30 bg-error-600/10 px-ram-md py-ram-sm text-text-xs font-extrabold text-error-600">
              <ShieldAlert className="h-3.5 w-3.5" />
              Escalated · {entry.deviationRef}
            </div>
          )}
        </div>
      )}

      <div className="space-y-ram-md">
        <MetaRow label="Operator" value={entry.operator} />
        <MetaRow label="Assignee" value={entry.assignee ?? "—"} />
        <MetaRow label="Location" value={entry.location} />
        <MetaRow label="Asset" value={entry.asset ?? "—"} />
        <MetaRow label="Captured" value={entry.capturedAt ?? entry.date} />
        <MetaRow label="Synced" value={entry.syncedAt ?? entry.date} />
        <div className="flex items-center gap-ram-md">
          <span className="text-text-sm font-extrabold text-gray-600 w-24">E-Signature</span>
          <div className="flex items-center gap-ram-sm">
            <StatusChip status="approved" />
            {entry.signatureMeaning && (
              <span className="text-text-xs font-extrabold text-foreground">· {entry.signatureMeaning}</span>
            )}
          </div>
        </div>
        <MetaRow label="Template" value={entry.templateHash ?? entry.version} />
      </div>

      {entry.fields.length > 0 && (
        <section>
          <h3 className="text-text-sm font-extrabold text-gray-600 mb-ram-lg">Field Values</h3>
          <div className="space-y-ram-lg">
            {entry.fields.map((f, i) => (
              <div key={i}>
                <div className="flex items-center gap-ram-sm">
                  <span className="text-text-xs font-extrabold text-gray-600">{f.label}</span>
                  {f.verdict === "fail" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-error-600/10 px-2 py-0.5 text-[10px] font-extrabold text-error-600">
                      <AlertTriangle className="h-3 w-3" /> Out of limit
                    </span>
                  )}
                  {f.verdict === "pass" && (
                    <span className="inline-flex items-center rounded-full bg-success-100 px-2 py-0.5 text-[10px] font-extrabold text-success-900">Pass</span>
                  )}
                </div>
                <p className="text-[15px] text-foreground">{f.value}</p>
                {f.trace && (
                  <p className="text-text-xs text-gray-500 flex items-center gap-1 mt-ram-xxs">
                    <GitBranch className="h-3 w-3" /> {f.trace}
                  </p>
                )}
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
    </>
  );
}

function iconForAction(action: string) {
  const a = action.toLowerCase();
  if (a.includes("e-sign")) return <PenTool className="h-3.5 w-3.5" />;
  if (a.includes("exception")) return <AlertTriangle className="h-3.5 w-3.5" />;
  if (a.includes("submit")) return <Send className="h-3.5 w-3.5" />;
  if (a.includes("sync")) return <RefreshCw className="h-3.5 w-3.5" />;
  if (a.includes("field")) return <Edit3 className="h-3.5 w-3.5" />;
  if (a.includes("review") || a.includes("approve")) return <ShieldCheck className="h-3.5 w-3.5" />;
  return <FileText className="h-3.5 w-3.5" />;
}

function AuditTrailBody({ trail }: { trail: AuditTrailEntry[] }) {
  return (
    <ol className="space-y-ram-md">
      {trail.map((a, i) => {
        const borderClass =
          a.verdict === "fail"
            ? "border-l-error-600"
            : a.verdict === "pass"
            ? "border-l-success-400"
            : "border-l-gray-300";
        return (
          <li
            key={i}
            className={cn(
              "rounded-ram-xs border border-border bg-card px-ram-md py-ram-md border-l-4",
              borderClass
            )}
          >
            <div className="flex items-start gap-ram-sm">
              <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-gray-600 shrink-0">
                {iconForAction(a.action)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-ram-md gap-y-1">
                  <span className="text-text-sm font-extrabold text-foreground">{a.action}</span>
                  <span className="text-text-xs text-gray-500">{a.timestamp}</span>
                </div>
                {a.actor && (
                  <p className="text-text-xs text-gray-600">
                    by <span className="font-medium">{a.actor}</span>
                    {a.reasonCode && <> · reason: <span className="font-mono">{a.reasonCode}</span></>}
                  </p>
                )}
                {a.detail && (
                  <p className="mt-1 text-text-sm text-foreground">{a.detail}</p>
                )}
                {(a.priorValue || a.newValue) && !a.detail && (
                  <p className="text-text-xs text-gray-600">
                    <span className="text-gray-400 line-through">{a.priorValue}</span>
                    <span className="mx-1">→</span>
                    <span className="font-medium text-foreground">{a.newValue}</span>
                  </p>
                )}
                {a.hash && (
                  <p className="mt-1 text-text-xs font-mono text-gray-400">hash: {a.hash}</p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-ram-md">
      <span className="text-text-sm font-extrabold text-gray-600 w-24 shrink-0">{label}</span>
      <span className="text-[15px] text-foreground break-all">{value}</span>
    </div>
  );
}
