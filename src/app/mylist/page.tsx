import Link from "next/link";
import Poster from "@/components/poster";
import { getMyList } from "@/lib/mylist-store";
import { STATUS_LABEL, WATCH_STATUSES } from "@/types/mylist";
import { getMyListStats } from "@/lib/mylist-stats";
import { getCurrentUserId } from "@/lib/current-user";
import {
  DEFAULT_SORT,
  parseSort,
  SORT_OPTIONS,
  sortEntries,
} from "@/lib/mylist-sort";

export const metadata = { title: "My List" };
type Props = { searchParams: Promise<{ sort?: string }> };

export default async function MyListPage({ searchParams }: Props) {
  const { sort: sortParam } = await searchParams;
  const sort = parseSort(sortParam);

  const entries = await getMyList(await getCurrentUserId());
  const stats = getMyListStats(entries);
  const sorted = sortEntries(entries, sort);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Kembali
      </Link>
      <h1 className="mt-4 text-3xl font-bold">My List</h1>
      <h2 className="mt-2 text-xl font-semibold">Rata-rata Ratingmu : {stats.averageRating?.toFixed(2)} </h2>
      <h2 className="mt-2 text-xl font-semibold">Jumlah Anime di list-mu : {stats.total} </h2>
      {entries.length > 0 && (
        <nav className="mt-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-gray-500">Urutkan:</span>
          {SORT_OPTIONS.map((option) => {
            const active = option.value === sort;
            return (
              <Link
                key={option.value}
                href={
                  option.value === DEFAULT_SORT
                    ? "/mylist"
                    : `/mylist?sort=${option.value}`
                }
                aria-current={active ? "true" : undefined}
                className={`rounded-full border px-3 py-1 ${active
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "hover:bg-gray-100"
                  }`}
              >
                {option.label}
              </Link>
            );
          })}
        </nav>
      )}
      {entries.length === 0 ? (
        <p className="mt-6 text-gray-500">
          Belum ada anime di list. Buka halaman detail anime dan tambahkan dari sana.
        </p>
      ) : (
        WATCH_STATUSES.map((status) => {
          const group = sorted.filter((e) => e.status === status);
          if (group.length === 0) return null;

          return (
            <section key={status} className="mt-8">
              <h2 className="mb-3 text-xl font-semibold">
                {STATUS_LABEL[status]} ({group.length})
              </h2>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {group.map((e) => (
                  <Link
                    key={e.animeId}
                    href={`/anime/${e.animeId}`}
                    className="block overflow-hidden rounded-lg border shadow-sm hover:shadow-md"
                  >
                    <div className="relative aspect-[2/3] w-full">
                      <Poster
                        src={e.imageUrl}
                        alt={e.title}
                        sizes="(min-width: 768px) 25vw, 50vw"
                      />
                    </div>
                    <p className="line-clamp-2 p-3 font-semibold">{e.title}</p>
                    <div className="p-3">
                      <p className="line-clamp-2 font-semibold">{e.title}</p>
                      <p className="mt-1 text-sm text-gray-500">
                        {e.rating ? `★ Rating saya: ${e.rating}/10` : "Belum dinilai"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })
      )}
    </main>
  );
}