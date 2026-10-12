import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnimeDetail } from "@/lib/anilist";
import Image from "next/image";
import MyListControl from "@/components/mylistcontrol";
import { getEntry } from "@/lib/mylist-store";
type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const anime = await getAnimeDetail(Number(id));

  return { title: anime ? anime.title : "Anime tidak ditemukan" };
}

export default async function AnimeDetailPage({ params }: Props) {
  const { id } = await params;
  const numericId = Number(id);

  if (!Number.isInteger(numericId)) notFound();

  const anime = await getAnimeDetail(numericId);
  if (!anime) notFound();
  const entry = await getEntry(anime.id);

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Kembali
      </Link>

      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="relative aspect-[2/3] w-full shrink-0 md:w-64">
          <Image
            src={anime.imageUrl}
            alt={anime.title}
            fill
            preload
            sizes="(min-width: 768px) 256px, 100vw"
            className="rounded-lg object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold">{anime.title}</h1>
          <p className="mt-2 text-yellow-500">★ {anime.score ?? "N/A"}</p>

          <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <dt className="text-gray-500">Episode</dt>
            <dd>{anime.episodes ?? "?"}</dd>
            <dt className="text-gray-500">Status</dt>
            <dd>{anime.status ?? "-"}</dd>
            <dt className="text-gray-500">Tahun</dt>
            <dd>{anime.year ?? "-"}</dd>
            <dt className="text-gray-500">Studio</dt>
            <dd>{anime.studio ?? "-"}</dd>
            <dt className="text-gray-500">Popularity</dt>
            <dd>{anime.popularity ?? "-"}</dd>
          </dl>

          <div className="mt-4 flex flex-wrap gap-2">
            {anime.genres.map((g) => (
              <span key={g} className="rounded-full bg-gray-100 px-3 py-1 text-xs">
                {g}
              </span>
            ))}
          </div>
          <MyListControl animeId={anime.id} current={entry?.status ?? null} />
          <p className="mt-6 whitespace-pre-line leading-relaxed">
            {anime.synopsis ?? "Belum ada sinopsis."}
          </p>
        </div>
      </div>
    </main>
  );
}