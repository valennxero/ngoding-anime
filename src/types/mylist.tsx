export const WATCH_STATUSES = [
  "watching",
  "completed",
  "plan_to_watch",
  "dropped",
] as const;

export const RATING_VALUE = [10,9,8,7,6,5,4,3,2,1] as const;


export type WatchStatus = (typeof WATCH_STATUSES)[number];

export const STATUS_LABEL : Record<WatchStatus, string> = {
  watching: "Sedang ditonton",
  completed: "Selesai ditonton",
  plan_to_watch: "Berencana menonton",
  dropped: "Dihentikan",
};
export const comments: string = "";

export const RATING_LABEL: Record<number, string> = {
  10: "Masterpiece",
  9: "Great",
  8: "Very good",
  7: "Good",
  6: "Fine",
  5: "Average",
  4: "Bad",
  3: "Very bad",
  2: "Horrible",
  1: "Appalling",
};

export function isWatchStatus(value: unknown): value is WatchStatus {
  return typeof value === "string" && WATCH_STATUSES.includes(value as WatchStatus);
}

export function isValidRating(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 10
  );
}

export type MyListEntry = {
  animeId: number;
  title: string;
  imageUrl: string | null;
  status: WatchStatus;
  rating: number | null;
  updatedAt: string;
  comments: string | null;
};
