"use server";

import { revalidatePath } from "next/cache";
import { getAnimeDetail } from "@/lib/anilist";
import { removeEntry, upsertEntry } from "@/lib/mylist-store";
import { isWatchStatus } from "@/types/mylist";

export async function saveToMyList(formData: FormData) {
  const animeId = Number(formData.get("animeId"));
  const status = formData.get("status");

  // Validasi di server: jangan percaya data dari browser
  if (!Number.isInteger(animeId) || !isWatchStatus(status)) return;

  const anime = await getAnimeDetail(animeId);
  if (!anime) return;

  await upsertEntry(anime, status);

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