import type { Anime, AnimeDetail } from "@/types/anime";
import { CONFIG_FILES } from "next/dist/shared/lib/constants";

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
        coverImage { large }
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
      coverImage { large }
      description(asHtml: false)
      genres
      status
      seasonYear
      studios(isMain: true) { nodes { name } }
      popularity
    }
  }
`;


type AniListMedia = {
  id: number;
  title: { romaji: string | null; english: string | null };
  averageScore: number | null; // skala 0-100
  episodes: number | null;
  coverImage: { large: string };
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


function toAnime(m: AniListMedia): Anime {
  return {
    id: m.id,
    title: m.title.english ?? m.title.romaji ?? "Tanpa judul",
    score: m.averageScore ? m.averageScore / 10 : null,
    episodes: m.episodes,
    imageUrl: m.coverImage.large,
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
  console.log("getAnimeDetail dipanggil dengan id:", id);

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: ANIME_DETAIL_QUERY, variables: { id } }),
      next: { revalidate: 3600 },
    });

    const text = await res.text();
    console.log("AniList status:", res.status);

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      console.error("Respons bukan JSON:", text.slice(0, 300));
      return null;
    }

    if (!res.ok || !json.data?.Media) {
      console.error("AniList detail gagal:", JSON.stringify(json.errors ?? json));
      return null;
    }

    return toAnimeDetail(json.data.Media);
  } catch (err) {
    console.error("Fetch detail error:", err);
    return null;
  }
}