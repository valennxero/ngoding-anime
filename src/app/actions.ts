"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getAnimeDetail } from "@/lib/anilist";
import { getCurrentUserId } from "@/lib/current-user";
import { removeEntry, upsertEntry } from "@/lib/mylist-store";
import { isValidRating, isWatchStatus } from "@/types/mylist";

const MAX_COMMENT_LENGTH = 500;

export async function saveToMyList(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  const status = formData.get("status");
  const ratingRaw = formData.get("rating");
  const commentsRaw = formData.get("comments");

  // Validasi di server: jangan percaya data dari browser
  if (!Number.isInteger(animeId) || !isWatchStatus(status)) return;

  // "" berarti belum dinilai. Cek ini dulu karena Number("") bernilai 0
  let rating: number | null = null;
  if (typeof ratingRaw === "string" && ratingRaw !== "") {
    rating = Number(ratingRaw);
    if (!isValidRating(rating)) return;
  }

  // undefined = field tidak dikirim, komentar lama dibiarkan
  // "" = komentar dikosongkan
  const comments =
    typeof commentsRaw === "string"
      ? commentsRaw.trim().slice(0, MAX_COMMENT_LENGTH)
      : undefined;

  const anime = await getAnimeDetail(animeId);
  if (!anime) return;

  const userId = await getCurrentUserId();
  await upsertEntry(userId, anime, { status, rating, comments });

  revalidatePath(`/anime/${animeId}`);
  revalidatePath("/mylist");
}

export async function removeFromMyList(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  if (!Number.isInteger(animeId)) return;

  const userId = await getCurrentUserId();
  await removeEntry(userId, animeId);

  revalidatePath(`/anime/${animeId}`);
  revalidatePath("/mylist");
}

export async function refreshAnime(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  if (!Number.isInteger(animeId)) return;

  updateTag(`anime-${animeId}`); // buang cache data anime ini sekarang juga
  revalidatePath(`/anime/${animeId}`); // dan render ulang halamannya
}