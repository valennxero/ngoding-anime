import Image from "next/image";
import Link from "next/link";
import type { Anime } from "@/types/anime";

export default function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="block overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[2/3] w-full">
        <Image
          src={anime.imageUrl}
          alt={anime.title}
          fill
          sizes="(min-width: 1024px) 240px, (min-width: 768px) 25vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* bagian teks di bawah ini tetap seperti sebelumnya */}
      <div className="p-3">
        <h2 className="line-clamp-2 font-semibold">{anime.title}</h2>
        <p className="text-sm text-gray-500">{anime.episodes ?? "?"} episode</p>
        <p className="mt-1 text-yellow-500">★ {anime.score ?? "N/A"}</p>
        <p className="text-sm text-gray-500">🔥Popularity: {anime.popularity ?? "N/A"}</p>
      </div>
    </Link>
  );
}