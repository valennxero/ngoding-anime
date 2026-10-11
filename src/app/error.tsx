"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold">Terjadi kesalahan</h1>
      <p className="mt-2 text-gray-500">{error.message}</p>
      <button
        onClick={() => reset()}
        className="mt-4 rounded bg-black px-4 py-2 text-white"
      >
        Coba lagi
      </button>
    </main>
  );
}