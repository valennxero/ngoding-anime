import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tentang",
};

const techStack = [
  "Next.js (App Router)",
  "React & TypeScript",
  "Tailwind CSS",
  "AniList GraphQL API",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline">
        ← Kembali
      </Link>

      <h1 className="mt-4 text-3xl font-bold">Tentang Aplikasi</h1>

      <p className="mt-4 leading-relaxed">
        Anime List adalah aplikasi sederhana untuk menjelajahi daftar anime,
        mencari berdasarkan judul atau genre, dan melihat detail tiap anime.
        Aplikasi ini dibuat sebagai proyek latihan untuk belajar Next.js.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Teknologi</h2>
      <ul className="mt-3 list-inside list-disc space-y-1">
        {techStack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>

      <h2 className="mt-8 text-xl font-semibold">Sumber Data</h2>
      <p className="mt-3 leading-relaxed">
        Data anime dan poster berasal dari{" "}
        <a
          href="https://anilist.co"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          AniList
        </a>
        . Seluruh hak atas data dan gambar dimiliki oleh pemiliknya masing-masing.
      </p>
    </main>
  );
}