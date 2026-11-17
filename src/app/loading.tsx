export default function Loading() {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-3 px-6 pb-16 pt-10">
      <div role="status" className="text-sm text-ink-soft">
        Loading...
      </div>
      <div className="h-1 w-full overflow-hidden rounded bg-line">
        <div className="h-full w-1/3 animate-pulse rounded bg-accent" />
      </div>
    </main>
  );
}
