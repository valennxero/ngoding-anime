export const WATCH_STATUSES = [
  "watching",
  "completed",
  "plan_to_watch",
  "dropped",
] as const;

export type WatchStatus = (typeof WATCH_STATUSES)[number];

export const STATUS_LABEL : Record<WatchStatus, string> = {
  watching: "Sedang ditonton",
  completed: "Selesai ditonton",
  plan_to_watch: "Berencana menonton",
  dropped: "Dihentikan",
};

export function isWatchStatus(value: unknown): value is WatchStatus {
  return typeof value === "string" && WATCH_STATUSES.includes(value as WatchStatus);
}

export type MyListEntry = {
  animeId: number;
  title: string;
  imageUrl: string | null;
  status: WatchStatus;
  updatedAt: string;
};