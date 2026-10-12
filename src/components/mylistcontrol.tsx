import { removeFromMyList, saveToMyList } from "@/app/actions";
import { STATUS_LABEL, WATCH_STATUSES, type WatchStatus } from "@/types/mylist";

type Props = { animeId: number; current: WatchStatus | null };

export default function MyListControl({ animeId, current }: Props) {
  return (
    <div className="mt-6 rounded-lg border p-4">
      <h2 className="mb-3 font-semibold">My List</h2>

      <form
        key={current ?? "none"}
        action={saveToMyList}
        className="flex flex-wrap items-center gap-3"
      >
        <input type="hidden" name="animeId" value={animeId} />
        <select
          name="status"
          defaultValue={current ?? "plan_to_watch"}
          className="rounded border px-3 py-2"
        >
          {WATCH_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          {current ? "Perbarui" : "Tambahkan"}
        </button>
      </form>

      {current && (
        <form action={removeFromMyList} className="mt-3">
          <input type="hidden" name="animeId" value={animeId} />
          <button type="submit" className="text-sm text-red-600 hover:underline">
            Hapus dari list
          </button>
        </form>
      )}
    </div>
  );
}