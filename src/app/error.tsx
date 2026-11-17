"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col items-start gap-4 px-6 pb-16 pt-16">
      <h1 className="page-title">Something went wrong</h1>
      <p className="text-ink-soft">
        The page could not be loaded. Check that the server is running, then try
        again.
      </p>
      <button type="button" onClick={() => reset()} className="btn-primary">
        Try again
      </button>
    </main>
  );
}
