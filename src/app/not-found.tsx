import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-bold">Anime tidak ditemukan</h1>
      <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
        ← Kembali ke daftar
      </Link>
    </main>
  );
}