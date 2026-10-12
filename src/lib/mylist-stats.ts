import type { MyListEntry } from "@/types/mylist";

export function getMyListStats(entries: MyListEntry[]) {
  const total = entries.length;
  const statusCounts: Record<string, number> = {};
  let ratingSum = 0;
  let ratingCount = 0;

  for (const entry of entries) {
    // Hitung status
    if (!statusCounts[entry.status]) {
      statusCounts[entry.status] = 0;
    }
    statusCounts[entry.status]++;

    // Hitung rating
    if (entry.rating !== null) {
      ratingSum += entry.rating;
      ratingCount++;
    }
  }

  const averageRating = ratingCount > 0 ? ratingSum / ratingCount : null;

  return {
    total,
    statusCounts,
    averageRating,
  };
}