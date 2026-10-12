"use server";

import { revalidatePath } from "next/cache";
import { getAnimeDetail } from "@/lib/anilist";
import { removeEntry, upsertEntry } from "@/lib/mylist-store";
import { isValidRating, isWatchStatus } from "@/types/mylist";

export async function saveToMyList(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  const status = formData.get("status");
  const ratingRaw = formData.get("rating");
  const comments = formData.get("comments");

  console.log("saveToMyList:", { animeId, status, ratingRaw, comments });

  if (!Number.isInteger(animeId) || !isWatchStatus(status)) {
    console.log("DITOLAK: animeId atau status tidak valid");
    return;
  }

  let rating: number | null = null;
  if (typeof ratingRaw === "string" && ratingRaw !== "") {
    rating = Number(ratingRaw);
    if (!isValidRating(rating)) {
      console.log("DITOLAK: rating tidak valid:", rating);
      return;
    }
  }

  const anime = await getAnimeDetail(animeId);
  if (!anime) {
    console.log("DITOLAK: anime tidak ditemukan di AniList");
    return;
  }

  await upsertEntry(anime, { status, rating, comments: typeof comments === "string" ? comments : null });
  console.log("TERSIMPAN");

  revalidatePath(`/anime/${animeId}`);
  revalidatePath("/mylist");
}

export async function updateMyListEntry(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  const status = formData.get("status");
  const ratingRaw = formData.get("rating");
  const comments = formData.get("comments");

  console.log("updateMyListEntry:", { animeId, status, ratingRaw, comments });

  if (!Number.isInteger(animeId) || !isWatchStatus(status)) {
    console.log("DITOLAK: animeId atau status tidak valid");
    return;
  }

  let rating: number | null = null;
  if (typeof ratingRaw === "string" && ratingRaw !== "") {
    rating = Number(ratingRaw);
    if (!isValidRating(rating)) {
      console.log("DITOLAK: rating tidak valid:", rating);
      return;
    }
  }
  const anime = await getAnimeDetail(animeId);
  if (!anime) {
    console.log("DITOLAK: anime tidak ditemukan di AniList");
    return;
  }

  await upsertEntry(anime, { status, rating, comments: typeof comments === "string" ? comments : null });
  console.log("TERSIMPAN");

  revalidatePath(`/anime/${animeId}`);
  revalidatePath("/mylist");
}

export async function removeFromMyList(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  if (!Number.isInteger(animeId)) return;

  await removeEntry(animeId);

  revalidatePath(`/anime/${animeId}`);
  revalidatePath("/mylist");
}