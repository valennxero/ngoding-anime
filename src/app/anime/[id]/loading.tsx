export default function Loading() {
  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />

      <div className="mt-4 flex flex-col gap-6 md:flex-row">
        <div className="h-96 w-full animate-pulse rounded-lg bg-gray-200 md:w-64" />

        <div className="flex-1 space-y-3">
          <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </main>
  );
}