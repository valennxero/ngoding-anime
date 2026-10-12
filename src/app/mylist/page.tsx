import Link from "next/link";
import Poster from "@/components/poster";
import { getMyList } from "@/lib/mylist-store";
import { STATUS_LABEL, WATCH_STATUSES } from "@/types/mylist";

export const metadata = { title: "My List" };

export default async function MyListPage() {
  const entries = await getMyList();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Kembali
      </Link>
      <h1 className="mt-4 text-3xl font-bold">My List</h1>

      {entries.length === 0 ? (
        <p className="mt-6 text-gray-500">
          Belum ada anime di list. Buka halaman detail anime dan tambahkan dari sana.
        </p>
      ) : (
        WATCH_STATUSES.map((status) => {
          const group = entries.filter((e) => e.status === status);
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