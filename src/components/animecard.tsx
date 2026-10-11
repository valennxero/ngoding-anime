import Link from "next/link";
import type { Anime } from "@/types/anime";

export default function AnimeCard({ anime }: { anime: Anime }) {
  return (
    <Link
      href={`/anime/${anime.id}`}
      className="block overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md"
    >
      <img
        src={anime.imageUrl}
        alt={anime.title}
        className="h-64 w-full object-cover"
      />
      <div className="p-3">
        <h2 className="line-clamp-2 font-semibold">{anime.title}</h2>
        <p className="text-sm text-gray-500">{anime.episodes ?? "?"} episode</p>
        <p className="mt-1 text-yellow-500">★ {anime.score ?? "N/A"}</p>
        <p className="mt-1 text-gray-500">🔥Popularity: {anime.popularity ?? "N/A"}</p>
      </div>
    </Link>
  );
}