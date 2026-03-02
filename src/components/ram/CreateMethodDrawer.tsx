import { ScanLine, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RAMDrawer } from "@/components/ram/RAMDrawer";

interface CreateMethodDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Where "Create from Scratch" navigates. Defaults to /manage/template/new */
  scratchRoute?: string;
}

export function CreateMethodDrawer({ open, onClose, scratchRoute = "/manage/template/new" }: CreateMethodDrawerProps) {
  const navigate = useNavigate();

  const options = [
    {
      icon: ScanLine,
      title: "Scan Paper Logbook",
      description: "Use Scan & Convert to digitize an existing paper logbook.",
      onClick: () => { onClose(); navigate("/scan"); },
    },
    {
      icon: FileText,
      title: "Create from Scratch",
      description: "Start with a blank template and add fields manually.",
      onClick: () => { onClose(); navigate(scratchRoute); },
    },
  ];

  return (
    <RAMDrawer open={open} onClose={onClose} title="How do you want to start?">
      <div className="space-y-ram-lg">
        {options.map((opt) => (
          <button
            key={opt.title}
            onClick={opt.onClick}
            className="flex w-full items-center gap-ram-xl rounded-ram-xl border border-border bg-card p-ram-xl text-left hover:shadow-ram-sm transition-shadow"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100">
              <opt.icon className="h-6 w-6 text-brand-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-extrabold text-foreground">{opt.title}</h3>
              <p className="mt-ram-xxs text-text-sm text-gray-600">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </RAMDrawer>
  );
}
