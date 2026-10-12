import { promises as fs } from "fs";
import path from "path";
import type { MyListEntry, WatchStatus } from "@/types/mylist";

const FILE = path.join(process.cwd(), "data", "mylist.json");

async function readAll(): Promise<MyListEntry[]> {
  try {
    const raw: MyListEntry[] = JSON.parse(await fs.readFile(FILE, "utf-8"));
    return raw.map((e) => ({ ...e, rating: e.rating ?? null }));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(entries: MyListEntry[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(entries, null, 2));
}

export async function getMyList(): Promise<MyListEntry[]> {
  return readAll();
}

export async function getEntry(animeId: number): Promise<MyListEntry | null> {
  const entries = await readAll();
  return entries.find((e) => e.animeId === animeId) ?? null;
}

type UpsertPatch = {
  status: WatchStatus;
  rating?: number | null; // undefined = biarkan, null = hapus
  comments?: string | null;
};


export async function upsertEntry(
  anime: { id: number; title: string; imageUrl: string | null },
  patch: UpsertPatch
) {
  const entries = await readAll();
  const index = entries.findIndex((e) => e.animeId === anime.id);
  const existing = index >= 0 ? entries[index] : null;

  const entry: MyListEntry = {
    animeId: anime.id,
    title: anime.title,
    imageUrl: anime.imageUrl,
    status: patch.status,
    rating: patch.rating !== undefined ? patch.rating : (existing?.rating ?? null),
    updatedAt: new Date().toISOString(),
    comments: patch.comments !== undefined ? patch.comments : (existing?.comments ?? ""),
  };

  if (index >= 0) entries[index] = entry;
  else entries.push(entry);

  await writeAll(entries);
}

export async function removeEntry(animeId: number) {
  const entries = await readAll();
  await writeAll(entries.filter((e) => e.animeId !== animeId));
}
