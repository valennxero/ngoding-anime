import type { MyListEntry } from "@/types/mylist";

export const SORT_OPTIONS = [
  { value: "recent", label: "Terbaru diubah" },
  { value: "rating_desc", label: "Rating tertinggi" },
  { value: "rating_asc", label: "Rating terendah" },
  { value: "title", label: "Judul A-Z" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["value"];

export const DEFAULT_SORT: SortKey = "recent";

// Nilai dari URL itu string bebas, jadi validasi dulu
export function parseSort(value: string | undefined): SortKey {
  const found = SORT_OPTIONS.find((o) => o.value === value);
  return found ? found.value : DEFAULT_SORT;
}

const byTitle = (a: MyListEntry, b: MyListEntry) =>
  a.title.localeCompare(b.title, undefined, { sensitivity: "base" });

// Anime yang belum dinilai selalu di paling bawah, untuk kedua arah
function byRating(a: MyListEntry, b: MyListEntry, direction: 1 | -1) {
  if (a.rating === null && b.rating === null) return 0;
  if (a.rating === null) return 1;
  if (b.rating === null) return -1;
  return (a.rating - b.rating) * direction;
}

export function sortEntries(entries: MyListEntry[], sort: SortKey): MyListEntry[] {
  const copy = [...entries]; // sort() mengubah array asli, jadi salin dulu

  switch (sort) {
    case "rating_desc":
      return copy.sort((a, b) => byRating(a, b, -1) || byTitle(a, b));
    case "rating_asc":
      return copy.sort((a, b) => byRating(a, b, 1) || byTitle(a, b));
    case "title":
      return copy.sort(byTitle);
    case "recent":
    default:
      return copy.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}