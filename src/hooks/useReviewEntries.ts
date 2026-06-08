import { useState } from "react";
import { mockReviewEntries, type ReviewEntry } from "@/data/mockAssets";

/**
 * Data-layer hook for the QA review queue.
 * Returns local mock data today; swap the body for a real API call later
 * without touching consumers.
 */
export function useReviewEntries() {
  const [entries, setEntries] = useState<ReviewEntry[]>(mockReviewEntries);
  return { entries, setEntries };
}
