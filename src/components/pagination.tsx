import Link from "next/link";

type Props = { page: number; hasNextPage: boolean; q?: string; genre?: string };

function buildHref(page: number, q?: string, genre?: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (genre) params.set("genre", genre);
  if (page > 1) params.set("page", String(page));

  const qs = params.toString();
  return qs ? `/?${qs}` : "/";
}

export default function Pagination({ page, hasNextPage, q, genre }: Props) {
  const linkClass = "rounded border px-4 py-2 hover:bg-gray-100";

  return (
    <nav className="mt-8 flex items-center justify-center gap-4">
      {page > 1 && (
        <Link href={buildHref(page - 1, q, genre)} className={linkClass}>
          ← Sebelumnya
        </Link>
      )}
      <span className="text-sm text-gray-500">Halaman {page}</span>
      {hasNextPage && (
        <Link href={buildHref(page + 1, q, genre)} className={linkClass}>
          Berikutnya →
        </Link>
      )}
    </nav>
  );
}