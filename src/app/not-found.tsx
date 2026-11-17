import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-[640px] flex-col items-start gap-4 px-6 pb-16 pt-16">
      <h1 className="page-title">Page not found</h1>
      <p className="text-ink-soft">
        The page or item you are looking for does not exist or was removed.
      </p>
      <Link href="/equipment" className="btn-primary">
        Browse equipment
      </Link>
    </main>
  );
}
