import { useState } from "react";
import { AppLayout } from "@/components/ram/AppLayout";
import { HeaderNav } from "@/components/ram/HeaderNav";
import { SyncQueueCard } from "@/components/ram/SyncQueueCard";
import { EmptyState } from "@/components/ram/EmptyState";
import { mockSyncQueue } from "@/data/mockLogbooks";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";
import { useLogbook } from "@/hooks/useLogbookState";

const tabs = ["Awaits", "Issues", "Success"] as const;
type Tab = (typeof tabs)[number];

const tabToStatus: Record<Tab, string> = {
  Awaits: "awaiting",
  Issues: "issue",
  Success: "success",
};

export default function OfflineQueue() {
  const [activeTab, setActiveTab] = useState<Tab>("Awaits");
  const { dispatch } = useLogbook();

  // Ensure offline mode is shown
  // (StatusBar renders automatically via AppLayout when isOffline)

  const filteredEntries = mockSyncQueue.filter(
    (e) => e.status === tabToStatus[activeTab]
  );

  return (
    <AppLayout>
      <HeaderNav type="syncQueue" title="Sync Queue" />

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-ram-lg text-text-md font-medium text-center transition-colors relative",
              activeTab === tab ? "text-brand-500" : "text-gray-600"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      <div className="px-ram-xl py-ram-xl">
        {filteredEntries.length > 0 ? (
          <div className="space-y-ram-lg">
            {filteredEntries.map((entry) => (
              <SyncQueueCard key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Inbox className="h-12 w-12" />}
            title="No items"
            body={`No ${activeTab.toLowerCase()} entries in the sync queue.`}
          />
        )}
      </div>
    </AppLayout>
  );
}
