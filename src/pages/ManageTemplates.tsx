import { useNavigate } from "react-router-dom";
import { PlusCircle, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { StatusChip } from "@/components/ram/StatusChip";
import { mockTemplates } from "@/data/mockAssets";

export default function ManageTemplates() {
  const navigate = useNavigate();

  return (
    <AppLayout>
      <HeaderNav
        type="workAgenda"
        title="Manage Templates"
        rightAction={
          <button
            onClick={() => navigate("/manage/template/new")}
            className="flex items-center gap-ram-sm rounded-full bg-brand-500 px-ram-xl py-ram-md text-text-sm font-medium text-primary-foreground"
          >
            <PlusCircle className="h-4 w-4" />
            Create Template
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto px-ram-xl py-ram-xl space-y-ram-lg">
        {mockTemplates.map((tpl) => (
          <button
            key={tpl.id}
            onClick={() => navigate(`/manage/template/${tpl.id}`)}
            className="flex w-full items-center gap-ram-lg rounded-ram-xl border border-border bg-card p-ram-xl hover:shadow-ram-sm transition-shadow text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-ram-md flex-wrap">
                <h3 className="text-[17px] font-extrabold text-foreground">{tpl.name}</h3>
                <span className="inline-flex items-center rounded-full bg-brand-200 px-ram-lg py-ram-xxs text-text-xs font-medium text-brand-500">
                  {tpl.version}
                </span>
                <StatusChip
                  status={tpl.status === "Published" ? "published" : tpl.status === "Draft" ? "draft" : "archived"}
                />
              </div>
              <p className="mt-ram-sm text-text-sm text-gray-600">
                {tpl.locationCount} location{tpl.locationCount !== 1 ? "s" : ""} · {tpl.assetCount} asset{tpl.assetCount !== 1 ? "s" : ""}
              </p>
              <div className="mt-ram-sm flex items-center gap-ram-xl text-text-xs text-gray-500">
                <span>{tpl.fieldCount} fields</span>
                <span>{tpl.totalEntries.toLocaleString()} entries</span>
                <span>Modified {tpl.modifiedAgo}</span>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
          </button>
        ))}
      </div>
    </AppLayout>
  );
}
