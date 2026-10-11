export type Anime = {
  id: number;
  title: string;
  score: number | null; // skala 0-10
  episodes: number | null;
  imageUrl: string;
  popularity: number | null;
};

export type AnimeDetail = Anime & {
  synopsis: string | null;
  genres: string[];
  status: string | null;
  year : number | null;
  studio : string | null;
  popularity: number | null;
}