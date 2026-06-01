import { useEffect, useState } from "react";
import { FileText, FileCheck2, Shield, Wrench, GitBranch, Hash, X, CheckCircle2 } from "lucide-react";
import type { ReviewEntry } from "@/data/mockAssets";
import { cn } from "@/lib/utils";

interface ExportBundleModalProps {
  open: boolean;
  entries: ReviewEntry[];
  scopeLabel: string;
  onClose: () => void;
}

const ROWS = [
  { id: "entries", label: "Entries", icon: FileText },
  { id: "audit", label: "Audit trail (ALCOA++)", icon: Shield },
  { id: "signatures", label: "E-signatures", icon: FileCheck2 },
  { id: "traces", label: "Evaluation traces", icon: GitBranch },
  { id: "wos", label: "Linked work requests", icon: Wrench },
];

// Deterministic mock SHA-256 from entry ids (display only)
function mockHash(ids: string[]): string {
  let h = 0n;
  for (const c of ids.join("|")) h = (h * 131n + BigInt(c.charCodeAt(0))) & 0xffffffffffffffffn;
  const hex = h.toString(16).padStart(16, "0");
  return `${hex}${hex.split("").reverse().join("")}`.padEnd(64, "0").slice(0, 64);
}

export function ExportBundleModal({ open, entries, scopeLabel, onClose }: ExportBundleModalProps) {
  const [phase, setPhase] = useState<"preview" | "building" | "done">("preview");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!open) { setPhase("preview"); setProgress(0); }
  }, [open]);

  useEffect(() => {
    if (phase !== "building") return;
    let p = 0;
    const t = setInterval(() => {
      p += 12 + Math.random() * 18;
      if (p >= 100) { setProgress(100); clearInterval(t); setTimeout(() => setPhase("done"), 350); }
      else setProgress(p);
    }, 220);
    return () => clearInterval(t);
  }, [phase]);

  if (!open) return null;

  const ids = entries.map((e) => e.id);
  const hash = mockHash(ids);
  const signatures = entries.filter((e) => e.status !== "pending-review").length;
  const traces = entries.reduce((n, e) => n + (e.fields?.filter((f) => f.trace).length ?? 0), 0);
  const wos = entries.filter((e) => e.linkedWorkRequest).length;
  const auditRows = entries.reduce((n, e) => n + (e.auditTrail?.length ?? 0), 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-foreground/60 p-ram-xl">
      <div className="relative w-full max-w-lg rounded-ram-xl bg-card shadow-ram-lg overflow-hidden">
        <button onClick={onClose} className="absolute top-ram-md right-ram-md p-ram-sm text-gray-500 hover:text-foreground">
          <X className="h-5 w-5" />
        </button>

        <div className="px-ram-3xl pt-ram-3xl pb-ram-xl border-b border-border">
          <h3 className="text-text-lg font-extrabold text-foreground">Audit-ready export bundle</h3>
          <p className="text-text-sm text-gray-600 mt-ram-xxs">Scope: <span className="font-medium text-foreground">{scopeLabel}</span> · {entries.length} entries</p>
        </div>

        <div className="px-ram-3xl py-ram-xl">
          <ul className="divide-y divide-border rounded-ram-md border border-border bg-background">
            {ROWS.map((r) => {
              const count =
                r.id === "entries" ? entries.length :
                r.id === "audit" ? auditRows :
                r.id === "signatures" ? signatures :
                r.id === "traces" ? traces :
                wos;
              return (
                <li key={r.id} className="flex items-center justify-between px-ram-lg py-ram-md">
                  <span className="flex items-center gap-ram-md text-text-sm font-medium text-foreground">
                    <r.icon className="h-4 w-4 text-brand-500" />
                    {r.label}
                  </span>
                  <span className="text-text-sm font-extrabold text-foreground tabular-nums">{count}</span>
                </li>
              );
            })}
          </ul>

          <div className="mt-ram-lg rounded-ram-md border border-border bg-muted px-ram-lg py-ram-md">
            <div className="flex items-center gap-ram-sm text-text-xs font-extrabold text-gray-600 uppercase tracking-wider">
              <Hash className="h-3.5 w-3.5" /> Manifest SHA-256
            </div>
            <code className="mt-ram-xxs block break-all font-mono text-text-xs text-foreground">{hash}</code>
          </div>

          {phase === "building" && (
            <div className="mt-ram-lg">
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-ram-sm text-text-xs text-gray-600">Bundling entries, audit log and signatures…</p>
            </div>
          )}

          {phase === "done" && (
            <div className="mt-ram-lg flex items-center gap-ram-sm rounded-ram-md bg-success-100 border border-success-400/40 px-ram-lg py-ram-md text-success-900">
              <CheckCircle2 className="h-4 w-4 text-success-400" />
              <span className="text-text-sm font-extrabold">Bundle ready · regulator_export_{hash.slice(0, 8)}.zip</span>
            </div>
          )}
        </div>

        <div className="flex gap-ram-md px-ram-3xl pb-ram-3xl">
          <button onClick={onClose} className="flex-1 rounded-ram-md border border-border py-ram-lg text-text-sm font-medium text-foreground hover:bg-muted">
            {phase === "done" ? "Close" : "Cancel"}
          </button>
          <button
            onClick={() => phase === "preview" ? setPhase("building") : phase === "done" ? onClose() : null}
            disabled={phase === "building"}
            className={cn(
              "flex-1 rounded-ram-md py-ram-lg text-text-sm font-extrabold text-primary-foreground transition-colors",
              phase === "building" ? "bg-brand-500/60 cursor-wait" : "bg-brand-500 hover:bg-brand-600"
            )}
          >
            {phase === "preview" ? "Generate bundle" : phase === "building" ? "Generating…" : "Download .zip"}
          </button>
        </div>
      </div>
    </div>
  );
}
