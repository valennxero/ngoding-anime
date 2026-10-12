import { Suspense } from "react";
import AnimeCard from "@/components/animecard";
import Pagination from "@/components/pagination";
import SearchFilters from "@/components/searchfilter";
import { searchAnime } from "@/lib/anilist";
import Link from "next/link";

type Props = {
  searchParams: Promise<{ q?: string; genre?: string; page?: string }>;
};

export default async function Home({ searchParams }: Props) {
  const { q, genre, page } = await searchParams;
  const currentPage = Math.max(1, Number(page) || 1);

  const { items, hasNextPage } = await searchAnime({
    search: q,
    genre,
    page: currentPage,
  });
  const isFiltering = Boolean(q || genre);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          {isFiltering ? "Hasil Pencarian" : "Top Anime"}
        </h1>
        <div className="flex gap-2">
          <Link
            href="/mylist"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            My List
          </Link>
          <Link
            href="/about"
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            Tentang
          </Link>
        </div>
      </div>

      <Suspense fallback={null}>
        <SearchFilters />
      </Suspense>

      {items.length === 0 ? (
        <p className="text-gray-500">Tidak ada anime yang cocok.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      <Pagination page={currentPage} hasNextPage={hasNextPage} q={q} genre={genre} />

    </main>
  );
}