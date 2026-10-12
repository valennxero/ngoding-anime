import { NextResponse } from "next/server";
import { getAnimeDetail } from "@/lib/anilist";
import { getMyList, upsertEntry } from "@/lib/mylist-store";
import { isWatchStatus } from "@/types/mylist";

export async function GET() {
  return NextResponse.json(await getMyList());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const animeId = Number(body?.animeId);

  if (!Number.isInteger(animeId) || !isWatchStatus(body?.status)) {
    return NextResponse.json(
      { error: "animeId (angka) dan status yang valid wajib diisi" },
      { status: 400 }
    );
  }

  const anime = await getAnimeDetail(animeId);
  if (!anime) {
    return NextResponse.json({ error: "Anime tidak ditemukan" }, { status: 404 });
  }

  await upsertEntry(anime, body.status);
  return NextResponse.json({ ok: true }, { status: 201 });
}