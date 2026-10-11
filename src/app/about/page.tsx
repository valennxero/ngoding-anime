import Link from "next/link"

export default function About() {
  return (
    <main className="mx-auto max-w-5xl p-6">
      <button className="mb-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        <Link href="/">Back to Home</Link>
      </button>
      <h1 className="mb-6 text-3xl font-bold">About</h1>
      <p>This is a simple anime list application built with Next.js and Tailwind CSS.</p>
    </main>
  );
}