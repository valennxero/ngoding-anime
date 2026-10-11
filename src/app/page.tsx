import AnimeCard from "@/components/animecard";
import { getTopAnime, getPopularAnime } from "@/lib/anilist";

export default async function Home() {
  const animeList = await getTopAnime();
  const popularAnimeList = await getPopularAnime();

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-bold">Top Anime</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {animeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} /> 
        ))}
      </div>

      <h1 className="mb-6 mt-12 text-3xl font-bold">Popular Anime</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {popularAnimeList.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </main>
  );
}