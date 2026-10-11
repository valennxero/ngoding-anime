"use client";

import { useRef, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha",
  "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life",
  "Sports", "Supernatural", "Thriller",
];

export default function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [text, setText] = useState(searchParams.get("q") ?? "");
  const [genre, setGenre] = useState(searchParams.get("genre") ?? "");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function updateParams(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page");

    const qs = params.toString();

    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    });
  }

  function handleSearch(value: string) {
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => updateParams({ q: value.trim() }), 400);
  }
  function handleGenre(value: string) {
    setGenre(value);
    updateParams({ genre: value });
  }

  function handleReset() {
    setText("");
    setGenre("");
    updateParams({ q: "", genre: "" });
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={text}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari anime..."
          className="w-full rounded border px-3 py-2"
        />

        <select
          value={genre}
          onChange={(e) => handleGenre(e.target.value)}
          className="rounded border px-3 py-2"
        >
          <option value="">Semua genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button
          onClick={handleReset}
          className="rounded border px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      {/* Indikator: tinggi tetap supaya layout tidak melompat */}
      <div className="mt-2 h-5 text-sm text-gray-500">
        {isPending && <span className="animate-pulse">Mencari...</span>}
      </div>
    </div>
  );
}