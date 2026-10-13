import type { Anime, AnimeDetail } from "@/types/anime";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";
import { cacheLife, cacheTag } from "next/cache";

const ENDPOINT = "https://graphql.anilist.co";

const TOP_ANIME_QUERY = `
  query ($perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(type: ANIME, sort: SCORE_DESC) {
        id
        title { romaji english }
        averageScore
        episodes
        coverImage { large }
        popularity
      }
    }
  }
`;
const POPULARITY_QUERY = `
  query ($perPage: Int) {
    Page(page: 1, perPage: $perPage) {
      media(type: ANIME, sort: POPULARITY_DESC) {
        id
        title { romaji english }
        averageScore
        episodes
        coverImage { extraLarge }
        popularity
      }
    }
  }
`;
const ANIME_DETAIL_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english }
      averageScore
      episodes
      coverImage { extraLarge }
      description(asHtml: false)
      genres
      status
      seasonYear
      studios(isMain: true) { nodes { name } }
      popularity
    }
  }
`;
const SEARCH_QUERY = `
  query ($page: Int, $perPage: Int, $search: String, $genre: String, $sort: [MediaSort]) {
    Page(page: $page, perPage: $perPage) {
      pageInfo { hasNextPage }
      media(type: ANIME, search: $search, genre: $genre, sort: $sort) {
        id
        title { romaji english }
        averageScore
        episodes
        coverImage { extraLarge }
      }
    }
  }
`;

type AniListMedia = {
  id: number;
  title: { romaji: string | null; english: string | null };
  averageScore: number | null; // skala 0-100
  episodes: number | null;
  coverImage: { extraLarge: string };
  popularity: number | null;
};


type AniListDetail = AniListMedia & {
  description: string | null;
  genres: string[];
  status: string | null;
  seasonYear: number | null;
  studios: { nodes: { name: string }[] };
  popularity: number | null;
};

type SearchAnimeParams = { search?: string; genre?: string; page?: number };

function toAnime(m: AniListMedia): Anime {
  return {
    id: m.id,
    title: m.title.english ?? m.title.romaji ?? "Tanpa judul",
    score: m.averageScore ? m.averageScore / 10 : null,
    episodes: m.episodes,
    imageUrl: m.coverImage.extraLarge,
    popularity: m.popularity,
  };
}
function toAnimeDetail(m: AniListDetail): AnimeDetail {
  return {
    ...toAnime(m),
    synopsis: m.description?.replace(/<br\s*\/?>/gi, "\n") ?? null,
    genres: m.genres,
    status: m.status,
    year: m.seasonYear,
    studio: m.studios.nodes[0]?.name ?? null,
    popularity: m.popularity,
  };
}

export async function getTopAnime(): Promise<Anime[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: TOP_ANIME_QUERY, variables: { perPage: 12 } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`AniList merespons ${res.status}`);

  const json = await res.json();
  return json.data.Page.media.map(toAnime);
}

export async function getPopularAnime(): Promise<Anime[]> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: POPULARITY_QUERY, variables: { perPage: 12 } }),
    next: { revalidate: 3600 },
  });

  if (!res.ok) throw new Error(`AniList merespons ${res.status}`);

  const json = await res.json();
  return json.data.Page.media.map(toAnime);
}

export async function getAnimeDetail(id: number): Promise<AnimeDetail | null> {
  "use cache";
  cacheLife("days");
  cacheTag(`anime-${id}`);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: ANIME_DETAIL_QUERY, variables: { id } }),
    });

    const json = await res.json();

    if (!res.ok || !json.data?.Media) {
      console.error("AniList detail gagal:", res.status, JSON.stringify(json.errors ?? json));
      return null;
    }

    return toAnimeDetail(json.data.Media);
  } catch (err) {
    console.error("Fetch detail error:", err);
    return null;
  }
}

export async function searchAnime({
  search,
  genre,
  page = 1,
}: SearchAnimeParams = {}): Promise<{ items: Anime[]; hasNextPage: boolean }> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: SEARCH_QUERY,
      variables: {
        page,
        perPage: 12,
        search: search || undefined, // undefined dibuang oleh JSON.stringify
        genre: genre || undefined,
        sort: search ? ["SEARCH_MATCH"] : ["SCORE_DESC"],
      },
    }),
    next: { revalidate: 3600 },
  });

  const json = await res.json();

  if (!res.ok || !json.data) {
    console.error("AniList search gagal:", res.status, JSON.stringify(json.errors ?? json));
    throw new Error("Gagal mengambil data anime");
  }

  const { media, pageInfo } = json.data.Page;
  return { items: media.map(toAnime), hasNextPage: pageInfo.hasNextPage };
}