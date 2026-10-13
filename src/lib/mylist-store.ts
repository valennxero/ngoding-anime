import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { mylistEntries } from "@/db/schema";
import type { MyListEntry, WatchStatus } from "@/types/mylist";

export async function getMyList(userId: string): Promise<MyListEntry[]> {
  return db
    .select()
    .from(mylistEntries)
    .where(eq(mylistEntries.userId, userId));
}

export async function getEntry(
  userId: string,
  animeId: number
): Promise<MyListEntry | null> {
  const rows = await db
    .select()
    .from(mylistEntries)
    .where(
      and(eq(mylistEntries.userId, userId), eq(mylistEntries.animeId, animeId))
    )
    .limit(1);

  return rows[0] ?? null;
}

type UpsertPatch = {
  status: WatchStatus;
  rating?: number | null; // undefined = biarkan, null = hapus
  comments?: string | null; // undefined = biarkan, null/"" = hapus
};

export async function upsertEntry(
  userId: string,
  anime: { id: number; title: string; imageUrl: string | null },
  patch: UpsertPatch
) {
  const now = new Date().toISOString();

  await db
    .insert(mylistEntries)
    .values({
      userId,
      animeId: anime.id,
      title: anime.title,
      imageUrl: anime.imageUrl,
      status: patch.status,
      rating: patch.rating ?? null,
      comments: patch.comments ?? "",
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [mylistEntries.userId, mylistEntries.animeId],
      set: {
        title: anime.title,
        imageUrl: anime.imageUrl,
        status: patch.status,
        updatedAt: now,
        // rating dan comments hanya disentuh kalau memang dikirim
        ...(patch.rating !== undefined && { rating: patch.rating }),
        ...(patch.comments !== undefined && { comments: patch.comments ?? "" }),
      },
    });
}

export async function removeEntry(userId: string, animeId: number) {
  await db
    .delete(mylistEntries)
    .where(
      and(eq(mylistEntries.userId, userId), eq(mylistEntries.animeId, animeId))
    );
}